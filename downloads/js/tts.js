// TikFinity clone TTS engine.
//
// Original Tikfinity routed default voices to Google's speech-api with a
// hardcoded API key (`AIzaSyBOti…WBgw`) that has since been revoked, and
// "premium" voices to https://tikfinity-tts-api.zerody.one which requires
// their Tikfinity Pro auth. Both endpoints fail for us.
//
// We fall back to the browser's built-in Web Speech API
// (window.speechSynthesis) so default voices keep working without any
// network dependency. Premium voiceIds degrade to a matching local voice
// until a paid proxy (ElevenLabs / Azure) is wired up later.

window.ttsPlaySuccessCount = 0;
window.ttsPlayErrorCount = 0;

class TTSItem {
    constructor(text, langCode, speed, pitch, volume, context, voiceId) {
        if (!text) {
            throw new Error('Missing value for "text"');
        }

        // Random singing voice convenience alias (kept for parity with original).
        if (voiceId === 'en_random_singing') {
            const singingVoices = [
                'en_female_f08_salut_damour',
                'en_male_m03_lobby',
                'en_female_f08_warmy_breeze',
                'en_male_m03_sunshine_soon'
            ];
            voiceId = singingVoices[Math.floor(Math.random() * singingVoices.length)];
        }

        this.text = String(text);
        this.langCode = langCode || 'en-US';
        // Settings come in 0..100 with 50 = neutral. SpeechSynthesisUtterance
        // expects rate 0.1..10 (default 1) and pitch 0..2 (default 1).
        this.speed = typeof speed === 'number' ? speed : 50;
        this.pitch = typeof pitch === 'number' ? pitch : 50;
        this.volume = typeof volume === 'number' ? volume : 1;
        this.context = context;
        this.voiceId = voiceId || 'default';
        this.audio = null;
        this.duration = null;
        this.utterance = null;
    }

    _pickVoice() {
        if (typeof window === 'undefined' || !window.speechSynthesis) return null;
        const voices = window.speechSynthesis.getVoices() || [];
        if (!voices.length) return null;

        const langPrefix = (this.langCode || 'en').slice(0, 2).toLowerCase();
        const wantFemale = /(_female|female|woman|girl)/i.test(this.voiceId);
        const wantMale   = /(_male|male|man|boy)/i.test(this.voiceId);

        const sameLang = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith(langPrefix));
        const pool = sameLang.length ? sameLang : voices;

        // Prefer a gender match if the voiceId hints one.
        if (wantFemale) {
            const hit = pool.find(v => /female|woman|samantha|victoria|zira|google.*us\b/i.test(v.name));
            if (hit) return hit;
        }
        if (wantMale) {
            const hit = pool.find(v => /male|man|alex|fred|david/i.test(v.name));
            if (hit) return hit;
        }
        // Default: prefer a non-novelty voice for the language.
        return pool[0];
    }

    play(onPlayStart) {
        return new Promise((resolve, reject) => {
            if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
                reject(new Error('No TTS engine available (speechSynthesis missing)'));
                return;
            }

            let utt;
            try {
                utt = new SpeechSynthesisUtterance(this.text);
                utt.lang   = this.langCode;
                utt.rate   = Math.max(0.5, Math.min(2.0, (this.speed || 50) / 50));
                utt.pitch  = Math.max(0.0, Math.min(2.0, (this.pitch || 50) / 50));
                utt.volume = Math.max(0,   Math.min(1,   this.volume || 1));
            } catch (err) {
                reject(err);
                return;
            }

            const chosen = this._pickVoice();
            if (chosen) utt.voice = chosen;

            this.utterance = utt;
            let resolved = false;
            const startedAt = Date.now();

            const cleanResolve = () => {
                if (resolved) return;
                resolved = true;
                resolve();
            };
            const cleanReject = (err) => {
                if (resolved) return;
                resolved = true;
                window.ttsPlayErrorCount += 1;
                window.lastTTSError = err;
                if (typeof api !== 'undefined' && typeof api.logError === 'function') {
                    try {
                        api.logError({
                            type: 'TTSError',
                            message: (err && err.message) || String(err) || 'unknown',
                            totalFailed: window.ttsPlayErrorCount,
                            totalSuccess: window.ttsPlaySuccessCount,
                            audioUrl: 'speechSynthesis:' + (this.voiceId || 'default')
                        });
                    } catch { /* ignore log error */ }
                }
                reject(err);
            };

            utt.onstart = () => {
                window.ttsPlaySuccessCount += 1;
                if (typeof setup !== 'undefined' && typeof setup.logDebugModeEvent === 'function') {
                    setup.logDebugModeEvent('TTSOnPlaying', {
                        audioUrl: 'speechSynthesis:' + this.voiceId,
                        loadtimeMs: Date.now() - startedAt
                    });
                }
                if (typeof onPlayStart === 'function') {
                    try { onPlayStart({ duration: null, audio: null }); } catch { /* ignore */ }
                }
            };
            utt.onend   = () => cleanResolve();
            utt.onerror = (ev) => cleanReject(new Error('speechSynthesis error: ' + (ev.error || 'unknown')));

            // Some browsers race: getVoices() returns [] until the voices
            // list loads, and a queued utterance can fire 'error' silently.
            // Hard timeout so the queue keeps moving.
            const watchdog = setTimeout(() => {
                if (!resolved) {
                    try { window.speechSynthesis.cancel(); } catch { /* ignore */ }
                    cleanReject(new Error('TTS timeout (no audio in 30s)'));
                }
            }, 30000);
            const wrapResolve = () => { clearTimeout(watchdog); cleanResolve(); };
            const wrapReject  = (e) => { clearTimeout(watchdog); cleanReject(e); };
            utt.onend   = wrapResolve;
            utt.onerror = (ev) => wrapReject(new Error('speechSynthesis error: ' + (ev.error || 'unknown')));

            try {
                window.speechSynthesis.speak(utt);
            } catch (err) {
                wrapReject(err);
            }
        });
    }

    stop() {
        try {
            if (typeof window !== 'undefined' && window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
            if (this.audio && this.audio.duration > 0) {
                this.audio.pause();
            }
        } catch { /* ignore */ }
    }
}


class TTSQueue {
    constructor(marginMs, onItemStart, onItemError) {
        this.marginMs = marginMs || 0;
        this.onItemStart = onItemStart;
        this.onItemError = onItemError;
        this.queue = [];
        this.currentItem = null;
        this.running = true;

        const tick = () => {
            if (this.running && !this.currentItem && this.queue.length > 0) {
                next();
            }
        };

        const next = () => {
            this.currentItem = this.queue.shift();
            playAndWait().then(() => {
                setTimeout(() => {
                    this.currentItem = null;
                }, this.marginMs);
            });
        };

        const playAndWait = () => {
            return new Promise((resolve) => {
                this.currentItem.play(() => {
                    if (typeof this.onItemStart === 'function') {
                        this.onItemStart(this.currentItem);
                    }
                }).then(resolve).catch((err) => {
                    resolve();
                    console.error(`Failed to play TTS Item with params ${JSON.stringify(this.currentItem)}; error:`, err);
                    if (typeof onItemError === 'function') onItemError(this.currentItem, err);
                });
            });
        };

        const intervalFn = (typeof setIntervalFix === 'function') ? setIntervalFix : setInterval;
        intervalFn(() => tick(), 100);
    }

    append(ttsItem) {
        if (!ttsItem || !(ttsItem instanceof TTSItem)) {
            throw new Error('Invalid TTSItem');
        }
        this.queue.push(ttsItem);
    }

    start() { this.running = true; }
    pause() { this.running = false; }
    getCurrentItem() { return this.currentItem; }
    skipCurrent() { if (this.currentItem) this.currentItem.stop(); }
    clear() { this.queue = []; }
    getLength() { return this.queue.length; }
}
