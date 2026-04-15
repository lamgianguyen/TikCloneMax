function basicAudioUnlockCheck() {
    window.unlockAudio = async function () {
        try {
            if (
                (localStorage.getItem("setting_soundsdatasource") && localStorage.getItem("setting_soundsdatasource").length > 5) ||
                localStorage.getItem("setting_checkboxttsenabled") === 'true'
            ) {
                try {
                    let dummyAudio = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA");
                    await dummyAudio.play();
                } catch (err) {
                    DevExpress.ui.dialog.alert("Click OK to activate sound playback!", "Audio Activation");
                }
            }
        } catch (err) { }
    }
}

function fixIosAudio() {
    let audio = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA");
    let originalPlay = audio.play;
    let originalAddEventListener = audio.addEventListener;
    let dialogVisible = false;
    let eventListeners = [];

    async function unlockAndPlay(showDialogIfFailed) {
        // Disable sound caching by "Sound Alerts"
        if (window.sounds && window.sounds.audioObjects) window.sounds.audioObjects = [];

        try {
            await originalPlay.apply(audio);
        } catch (err) {
            if (err.toString().includes("NotAllowedError")) {
                if (showDialogIfFailed && !dialogVisible) {
                    dialogVisible = true;
                    DevExpress.ui.dialog.alert("Click OK to activate sound playback!", "Audio Activation").done(() => {
                        dialogVisible = false;
                        unlockAudio(false);
                    });
                }
            } else if (err.toString().includes("AbortError")) {
                // ignore
            } else {
                // toastr.error(err.toString(), "iOS Audio Fix Error");
                throw err;
            }
        }
    }

    function emulateEnding() {
        let event = new Event("ended");
        eventListeners.forEach(listener => {
            if (listener.type === "ended") {
                listener.listener(event);
            }
        });
    }

    function removeListeners() {
        eventListeners.forEach(listener => {
            audio.removeEventListener(listener.type, listener.listener);
        });
    }

    window.unlockAudio = unlockAndPlay;
    window.nativeAudio = window.Audio;

    window.Audio = function (src) {
        emulateEnding();
        removeListeners();

        audio.src = src;
        audio.play = async function () {
            await unlockAndPlay(true);
        }

        audio.addEventListener = function (type, listener) {
            if (type === "abort") return;
            eventListeners.push({ type, listener });
            originalAddEventListener.apply(audio, arguments);
        }

        return audio;
    }

    window.iosAudioFixActive = true;
}

try {
    let isIos = [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
    ].includes(navigator.platform)
        // iPad on iOS 13 detection
        || (navigator.userAgent.includes("Mac") && "ontouchend" in document);

    if (isIos) {
        fixIosAudio();
        // toastr.success("iOS Audio Fix Activated");
    } else {
        basicAudioUnlockCheck();
    }
} catch (err) {
    // toastr.error(err.message, "iOS Audio Fix Error");
}