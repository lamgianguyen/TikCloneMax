window.TextEffectsIntegration = (function() {
    'use strict';

    function applyUsernameEffects(widgetPrefix, usernameSelector, settings) {
        if (!window.TextEffects || !settings) return;

        const effectSetting = widgetPrefix + '_usernameEffect';
        const glowSetting = widgetPrefix + '_usernameGlow';

        const effect = settings[effectSetting] || 'none';
        const glow = settings[glowSetting] || false;

        if (effect !== 'none') {
            const $usernames = typeof usernameSelector === 'string' ? $(usernameSelector) : usernameSelector;
            $usernames.each(function() {
                TextEffects.applyEffect($(this), effect, { glow: glow });
            });
        }
    }

    function applyTitleEffects(widgetPrefix, titleSelector, settings) {
        if (!window.TextEffects || !settings) return;

        const effectSetting = widgetPrefix + '_titleEffect';
        const glowSetting = widgetPrefix + '_titleGlow';

        const effect = settings[effectSetting] || 'none';
        const glow = settings[glowSetting] || false;

        if (effect !== 'none') {
            const $titles = typeof titleSelector === 'string' ? $(titleSelector) : titleSelector;
            $titles.each(function() {
                TextEffects.applyEffect($(this), effect, { glow: glow });
            });
        }
    }

    function applySingleUsernameEffect(widgetPrefix, $element, settings) {
        if (!window.TextEffects || !settings || !$element.length) return;

        const effectSetting = widgetPrefix + '_usernameEffect';
        const glowSetting = widgetPrefix + '_usernameGlow';

        const effect = settings[effectSetting] || 'none';
        const glow = settings[glowSetting] || false;

        if (effect !== 'none') {
            TextEffects.applyEffect($element, effect, { glow: glow });
        }
    }

    return {
        applyUsernameEffects,
        applyTitleEffects,
        applySingleUsernameEffect
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.TextEffectsIntegration;
}