(function(){var s=document.createElement("style");s.id="vue-widget-countdown-goals-styles";if(!document.getElementById(s.id)){s.textContent=".flip-digit[data-v-ce8605b0]{--flip-fg: #f0f0f0;--flip-bg: #3a3a3a;--flip-duration: .15s;--flip-half-duration: 75ms;position:relative;display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;padding:4px 6px 6px;border-radius:6px;background-color:var(--flip-bg);color:var(--flip-fg);vertical-align:middle}.flip-digit[data-v-ce8605b0]:after{content:\"\";position:absolute;left:0;right:0;top:50%;z-index:20;height:2px;margin-top:-1px;pointer-events:none;background:linear-gradient(to bottom,#000000a6 0% 50%,#ffffff1a 50% 100%)}.flip-digit__viewport[data-v-ce8605b0]{position:relative;display:block;width:1ch;min-width:.75em;height:1em;font-variant-numeric:tabular-nums;font-weight:700;font-size:1em;line-height:1em;perspective:10em;transform-style:preserve-3d;isolation:isolate}.flip-digit__half[data-v-ce8605b0]{position:absolute;left:0;right:0;height:50%;overflow:hidden;background-color:var(--flip-bg)}.flip-digit__half--top[data-v-ce8605b0]{top:0}.flip-digit__half--bottom[data-v-ce8605b0]{bottom:0}.flip-digit__value[data-v-ce8605b0]{position:absolute;left:0;right:0;width:100%;height:1em;line-height:1em;text-align:center;color:var(--flip-fg)}.flip-digit__half--top .flip-digit__value[data-v-ce8605b0]{top:0}.flip-digit__half--bottom .flip-digit__value[data-v-ce8605b0]{bottom:0}.flip-digit__back[data-v-ce8605b0]{z-index:1}.flip-digit__fold-top[data-v-ce8605b0]{z-index:4;transform-origin:50% 100%;-webkit-backface-visibility:hidden;backface-visibility:hidden;animation:flip-fold-top-ce8605b0 var(--flip-half-duration) ease-in forwards}.flip-digit__fold-top[data-v-ce8605b0]:after{content:\"\";position:absolute;left:0;right:0;bottom:0;height:1px;background:#0006}.flip-digit__fold-bottom[data-v-ce8605b0]{z-index:3;transform-origin:50% 0;transform:rotateX(90deg);-webkit-backface-visibility:hidden;backface-visibility:hidden;animation:flip-unfold-bottom-ce8605b0 var(--flip-half-duration) ease-out forwards}@keyframes flip-fold-top-ce8605b0{0%{transform:rotateX(0)}to{transform:rotateX(-90deg)}}@keyframes flip-unfold-bottom-ce8605b0{0%{transform:rotateX(90deg)}to{transform:rotateX(0)}}.flipping-odometer-number[data-v-aa25076c]{display:inline-flex;align-items:center;justify-content:center;gap:6px;line-height:1}.odometer.odometer-auto-theme,.odometer.odometer-theme-default,.odometer.odometer-auto-theme .odometer-digit,.odometer.odometer-theme-default .odometer-digit{display:inline-block;vertical-align:middle;*vertical-align: auto;*zoom: 1;*display: inline;position:relative}.odometer.odometer-auto-theme .odometer-digit .odometer-digit-spacer,.odometer.odometer-theme-default .odometer-digit .odometer-digit-spacer{display:inline-block;vertical-align:middle;*vertical-align: auto;*zoom: 1;*display: inline;visibility:hidden}.odometer.odometer-auto-theme .odometer-digit .odometer-digit-inner,.odometer.odometer-theme-default .odometer-digit .odometer-digit-inner{text-align:left;display:block;position:absolute;inset:0;overflow:hidden}.odometer.odometer-auto-theme .odometer-digit .odometer-ribbon,.odometer.odometer-theme-default .odometer-digit .odometer-ribbon{display:block}.odometer.odometer-auto-theme .odometer-digit .odometer-ribbon-inner,.odometer.odometer-theme-default .odometer-digit .odometer-ribbon-inner{display:block;-webkit-backface-visibility:hidden}.odometer.odometer-auto-theme .odometer-digit .odometer-value,.odometer.odometer-theme-default .odometer-digit .odometer-value{display:block;-webkit-transform:translateZ(0)}.odometer.odometer-auto-theme .odometer-digit .odometer-value.odometer-last-value,.odometer.odometer-theme-default .odometer-digit .odometer-value.odometer-last-value{position:absolute}.odometer.odometer-auto-theme.odometer-animating-up .odometer-ribbon-inner,.odometer.odometer-theme-default.odometer-animating-up .odometer-ribbon-inner{transition:transform 2s}.odometer.odometer-auto-theme.odometer-animating-up.odometer-animating .odometer-ribbon-inner,.odometer.odometer-theme-default.odometer-animating-up.odometer-animating .odometer-ribbon-inner,.odometer.odometer-auto-theme.odometer-animating-down .odometer-ribbon-inner,.odometer.odometer-theme-default.odometer-animating-down .odometer-ribbon-inner{transform:translateY(-100%)}.odometer.odometer-auto-theme.odometer-animating-down.odometer-animating .odometer-ribbon-inner,.odometer.odometer-theme-default.odometer-animating-down.odometer-animating .odometer-ribbon-inner{transition:transform 2s;transform:translateY(0)}.odometer.odometer-auto-theme,.odometer.odometer-theme-default{font-family:Helvetica Neue,sans-serif;line-height:1.1em}.odometer.odometer-auto-theme .odometer-value,.odometer.odometer-theme-default .odometer-value{text-align:center}.odometer-counter[data-v-1bd38ed1]{--odometer-font-family: inherit;display:inline-block}.odometer-counter[data-v-1bd38ed1] .odometer{font-family:var(--odometer-font-family)!important;font-variant-numeric:tabular-nums;font-feature-settings:\"tnum\" 1;color:inherit;line-height:1}.odometer-counter[data-v-1bd38ed1] .odometer-digit .odometer-digit-inner{text-align:center}.odometer-counter[data-v-1bd38ed1] .odometer-digit .odometer-value{color:inherit;text-align:center;width:100%;box-sizing:border-box}.odometer-counter[data-v-1bd38ed1] .odometer-formatting-mark{display:inline-block;min-width:.3em;text-align:center}.countdown-goals__odometer-rotate[data-v-7ecc942f] .odometer.odometer-auto-theme .odometer-digit,.countdown-goals__odometer-rotate[data-v-7ecc942f] .odometer.odometer-theme-default .odometer-digit{border-radius:6px;border:1px solid rgba(0,0,0,.99);background:#6c6c6c;box-shadow:0 -3px 4px #5c52524f inset,0 1px 4px #fff inset;padding:2px;margin:0 2px;overflow:hidden}.countdown-goals__odometer-rotate[data-v-7ecc942f] .odometer.odometer-auto-theme .odometer-digit-inner,.countdown-goals__odometer-rotate[data-v-7ecc942f] .odometer.odometer-theme-default .odometer-digit-inner{border-radius:4px;border:1px solid #2f2f2f;background:linear-gradient(180deg,#565658,#323232);box-shadow:0 1px 4px #ffffffbf inset;overflow:hidden;inset:2px}.countdown-goals__odometer-rotate[data-v-7ecc942f] .odometer.odometer-auto-theme .odometer-digit-spacer,.countdown-goals__odometer-rotate[data-v-7ecc942f] .odometer.odometer-theme-default .odometer-digit-spacer{padding:0 10px}.countdown-goals__odometer-rotate[data-v-7ecc942f] .odometer.odometer-auto-theme .odometer-value,.countdown-goals__odometer-rotate[data-v-7ecc942f] .odometer.odometer-theme-default .odometer-value{box-sizing:border-box;padding:0 10px;text-align:center}.countdown-goals__odometer-rotate[data-v-7ecc942f] .odometer.odometer-auto-theme .odometer-formatting-mark,.countdown-goals__odometer-rotate[data-v-7ecc942f] .odometer.odometer-theme-default .odometer-formatting-mark{display:none}.countdown-goals__odometer .split-flap-outer[data-v-4c8d6dd7]{border-radius:6px;border:1px solid rgba(0,0,0,.99);background:#6c6c6c;box-shadow:0 -3px 4px #5c52524f inset,0 1px 4px #fff inset;padding:2px}.countdown-goals__odometer .split-flap-inner[data-v-4c8d6dd7]{border-radius:4px;border:1px solid #2f2f2f;background:linear-gradient(180deg,#565658,#323232);box-shadow:0 1px 4px #ffffffbf inset;overflow:hidden}@layer properties{@supports ((-webkit-hyphens:none) and (not (margin-trim:inline))) or ((-moz-orient:inline) and (not (color:rgb(from red r g b)))){*,:before,:after,::backdrop{--tw-translate-x:0;--tw-translate-y:0;--tw-translate-z:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scale-z:1;--tw-rotate-x:initial;--tw-rotate-y:initial;--tw-rotate-z:initial;--tw-skew-x:initial;--tw-skew-y:initial;--tw-space-y-reverse:0;--tw-divide-y-reverse:0;--tw-border-style:solid;--tw-gradient-position:initial;--tw-gradient-from:#0000;--tw-gradient-via:#0000;--tw-gradient-to:#0000;--tw-gradient-stops:initial;--tw-gradient-via-stops:initial;--tw-gradient-from-position:0%;--tw-gradient-via-position:50%;--tw-gradient-to-position:100%;--tw-leading:initial;--tw-font-weight:initial;--tw-tracking:initial;--tw-ordinal:initial;--tw-slashed-zero:initial;--tw-numeric-figure:initial;--tw-numeric-spacing:initial;--tw-numeric-fraction:initial;--tw-shadow:0 0 #0000;--tw-shadow-color:initial;--tw-shadow-alpha:100%;--tw-inset-shadow:0 0 #0000;--tw-inset-shadow-color:initial;--tw-inset-shadow-alpha:100%;--tw-ring-color:initial;--tw-ring-shadow:0 0 #0000;--tw-inset-ring-color:initial;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-inset:initial;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-outline-style:solid;--tw-blur:initial;--tw-brightness:initial;--tw-contrast:initial;--tw-grayscale:initial;--tw-hue-rotate:initial;--tw-invert:initial;--tw-opacity:initial;--tw-saturate:initial;--tw-sepia:initial;--tw-drop-shadow:initial;--tw-drop-shadow-color:initial;--tw-drop-shadow-alpha:100%;--tw-drop-shadow-size:initial;--tw-backdrop-blur:initial;--tw-backdrop-brightness:initial;--tw-backdrop-contrast:initial;--tw-backdrop-grayscale:initial;--tw-backdrop-hue-rotate:initial;--tw-backdrop-invert:initial;--tw-backdrop-opacity:initial;--tw-backdrop-saturate:initial;--tw-backdrop-sepia:initial;--tw-duration:initial;--tw-ease:initial;--tw-text-shadow-color:initial;--tw-text-shadow-alpha:100%}}}@layer theme{:root,:host{--font-sans:ui-sans-serif,system-ui,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\",\"Noto Color Emoji\";--font-mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,\"Liberation Mono\",\"Courier New\",monospace;--color-yellow-300:oklch(90.5% .182 98.111);--color-gray-500:oklch(55.1% .027 264.364);--color-black:#000;--color-white:#fff;--spacing:.25rem;--container-xs:20rem;--container-xl:36rem;--container-2xl:42rem;--text-xs:.75rem;--text-xs--line-height:calc(1/.75);--text-sm:.875rem;--text-sm--line-height:calc(1.25/.875);--text-base:1rem;--text-base--line-height: 1.5 ;--text-lg:1.125rem;--text-lg--line-height:calc(1.75/1.125);--text-xl:1.25rem;--text-xl--line-height:calc(1.75/1.25);--text-2xl:1.5rem;--text-2xl--line-height:calc(2/1.5);--text-3xl:1.875rem;--text-3xl--line-height: 1.2 ;--text-4xl:2.25rem;--text-4xl--line-height:calc(2.5/2.25);--text-5xl:3rem;--text-5xl--line-height:1;--text-7xl:4.5rem;--text-7xl--line-height:1;--font-weight-normal:400;--font-weight-medium:500;--font-weight-semibold:600;--font-weight-bold:700;--font-weight-extrabold:800;--tracking-wide:.025em;--leading-tight:1.25;--leading-normal:1.5;--leading-relaxed:1.625;--radius-sm:.25rem;--radius-md:.375rem;--radius-lg:.5rem;--radius-xl:.75rem;--radius-2xl:1rem;--drop-shadow-md:0 3px 3px #0000001f;--ease-in:cubic-bezier(.4,0,1,1);--ease-out:cubic-bezier(0,0,.2,1);--ease-in-out:cubic-bezier(.4,0,.2,1);--animate-spin:spin 1s linear infinite;--animate-pulse:pulse 2s cubic-bezier(.4,0,.6,1)infinite;--blur-md:12px;--blur-lg:16px;--default-transition-duration:.15s;--default-transition-timing-function:cubic-bezier(.4,0,.2,1);--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono);--animate-marquee-slow:marquee-loop 14s linear infinite;--animate-marquee-medium:marquee-loop 9s linear infinite;--animate-marquee-fast:marquee-loop 5s linear infinite}}@layer base{*,:after,:before,::backdrop{box-sizing:border-box;border:0 solid;margin:0;padding:0}::-webkit-file-upload-button{box-sizing:border-box;border:0 solid;margin:0;padding:0}::file-selector-button{box-sizing:border-box;border:0 solid;margin:0;padding:0}html,:host{-webkit-text-size-adjust:100%;tab-size:4;line-height:1.5;font-family:var(--default-font-family,ui-sans-serif,system-ui,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\",\"Noto Color Emoji\");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);-webkit-tap-highlight-color:transparent}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:var(--default-mono-font-family,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,\"Liberation Mono\",\"Courier New\",monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-variation-settings:var(--default-mono-font-variation-settings,normal);font-size:1em}small{font-size:80%}sub,sup{vertical-align:baseline;font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}:-moz-focusring{outline:auto}progress{vertical-align:baseline}summary{display:list-item}ol,ul,menu{list-style:none}img,svg,video,canvas,audio,iframe,embed,object{vertical-align:middle;display:block}img,video{max-width:100%;height:auto}button,input,select,optgroup,textarea{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}::-webkit-file-upload-button{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}::file-selector-button{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{-webkit-padding-start:20px;padding-inline-start:20px}::-webkit-file-upload-button{-webkit-margin-end:4px;margin-inline-end:4px}::file-selector-button{-webkit-margin-end:4px;margin-inline-end:4px}::-webkit-input-placeholder{opacity:1}::placeholder{opacity:1}@supports (not (-webkit-appearance:-apple-pay-button)) or (contain-intrinsic-size:1px){::-webkit-input-placeholder{color:currentColor}::placeholder{color:currentColor}@supports (color:color-mix(in lab,red,red)){::-webkit-input-placeholder{color:color-mix(in oklab,currentcolor 50%,transparent)}::placeholder{color:color-mix(in oklab,currentcolor 50%,transparent)}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit{padding-block:0}::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-datetime-edit-month-field{padding-block:0}::-webkit-datetime-edit-day-field{padding-block:0}::-webkit-datetime-edit-hour-field{padding-block:0}::-webkit-datetime-edit-minute-field{padding-block:0}::-webkit-datetime-edit-second-field{padding-block:0}::-webkit-datetime-edit-millisecond-field{padding-block:0}::-webkit-datetime-edit-meridiem-field{padding-block:0}::-webkit-calendar-picker-indicator{line-height:1}:-moz-ui-invalid{box-shadow:none}button,input:where([type=button],[type=reset],[type=submit]){-webkit-appearance:button;appearance:button}::-webkit-file-upload-button{-webkit-appearance:button;appearance:button}::file-selector-button{-webkit-appearance:button;appearance:button}::-webkit-inner-spin-button{height:auto}::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}}@layer components;@layer utilities{.pointer-events-auto{pointer-events:auto}.pointer-events-none{pointer-events:none}.collapse{visibility:collapse}.invisible{visibility:hidden}.visible{visibility:visible}.visible\\!{visibility:visible!important}.sr-only{-webkit-clip-path:inset(50%);clip-path:inset(50%);white-space:nowrap;border-width:0;width:1px;height:1px;margin:-1px;padding:0;position:absolute;overflow:hidden}.absolute{position:absolute}.fixed{position:fixed}.fixed\\!{position:fixed!important}.relative{position:relative}.static{position:static}.sticky{position:-webkit-sticky;position:sticky}.inset-0{inset:calc(var(--spacing)*0)}.-top-1{top:calc(var(--spacing)*-1)}.-top-2{top:calc(var(--spacing)*-2)}.-top-7{top:calc(var(--spacing)*-7)}.top-0{top:calc(var(--spacing)*0)}.top-0\\.5{top:calc(var(--spacing)*.5)}.top-1{top:calc(var(--spacing)*1)}.top-1\\/2{top:50%}.top-3{top:calc(var(--spacing)*3)}.top-4{top:calc(var(--spacing)*4)}.top-6{top:calc(var(--spacing)*6)}.top-6\\.5{top:calc(var(--spacing)*6.5)}.top-8{top:calc(var(--spacing)*8)}.top-10{top:calc(var(--spacing)*10)}.top-12{top:calc(var(--spacing)*12)}.top-24{top:calc(var(--spacing)*24)}.top-48{top:calc(var(--spacing)*48)}.top-\\[-16px\\]{top:-16px}.top-\\[-22px\\]{top:-22px}.top-\\[-25px\\]{top:-25px}.top-\\[-40px\\]{top:-40px}.top-\\[-42px\\]{top:-42px}.top-\\[45px\\]{top:45px}.top-\\[56px\\]{top:56px}.top-\\[62px\\]{top:62px}.top-\\[470px\\]{top:470px}.top-\\[calc\\(50\\%-75px\\)\\]{top:calc(50% - 75px)}.top-\\[calc\\(100\\%\\+6px\\)\\]{top:calc(100% + 6px)}.top-\\[calc\\(100\\%\\+8px\\)\\]{top:calc(100% + 8px)}.top-\\[calc\\(100\\%-12px\\)\\]{top:calc(100% - 12px)}.top-full{top:100%}.-right-5{right:calc(var(--spacing)*-5)}.-right-6{right:calc(var(--spacing)*-6)}.-right-6\\.5{right:calc(var(--spacing)*-6.5)}.-right-8{right:calc(var(--spacing)*-8)}.right-0{right:calc(var(--spacing)*0)}.right-0\\.5{right:calc(var(--spacing)*.5)}.right-3{right:calc(var(--spacing)*3)}.right-4{right:calc(var(--spacing)*4)}.right-8{right:calc(var(--spacing)*8)}.right-10{right:calc(var(--spacing)*10)}.right-16{right:calc(var(--spacing)*16)}.right-\\[120px\\]{right:120px}.right-\\[280px\\]{right:280px}.right-full{right:100%}.-bottom-1{bottom:calc(var(--spacing)*-1)}.-bottom-8{bottom:calc(var(--spacing)*-8)}.-bottom-20{bottom:calc(var(--spacing)*-20)}.-bottom-36{bottom:calc(var(--spacing)*-36)}.-bottom-\\[20px\\]{bottom:-20px}.-bottom-px{bottom:-1px}.bottom-0{bottom:calc(var(--spacing)*0)}.bottom-2{bottom:calc(var(--spacing)*2)}.bottom-4{bottom:calc(var(--spacing)*4)}.bottom-\\[-20px\\]{bottom:-20px}.bottom-\\[63px\\]{bottom:63px}.bottom-\\[260px\\]{bottom:260px}.bottom-full{bottom:100%}.-left-1{left:calc(var(--spacing)*-1)}.-left-4{left:calc(var(--spacing)*-4)}.left-0{left:calc(var(--spacing)*0)}.left-1{left:calc(var(--spacing)*1)}.left-1\\.5{left:calc(var(--spacing)*1.5)}.left-1\\/2{left:50%}.left-6{left:calc(var(--spacing)*6)}.left-6\\.5{left:calc(var(--spacing)*6.5)}.left-8{left:calc(var(--spacing)*8)}.left-\\[-12px\\]{left:-12px}.left-\\[-25px\\]{left:-25px}.left-\\[20px\\]{left:20px}.left-\\[calc\\(100\\%\\+0\\.5rem\\)\\]{left:calc(100% + .5rem)}.left-\\[calc\\(100\\%-12px\\)\\]{left:calc(100% - 12px)}.left-full{left:100%}.-z-1{z-index:-1}.-z-2{z-index:-2}.z-0{z-index:0}.z-1{z-index:1}.z-2{z-index:2}.z-3{z-index:3}.z-4{z-index:4}.z-5{z-index:5}.z-10{z-index:10}.z-20{z-index:20}.z-30{z-index:30}.z-50{z-index:50}.z-\\[2\\]{z-index:2}.z-\\[10\\]{z-index:10}.z-\\[100\\]{z-index:100}.z-\\[9999\\]{z-index:9999}.z-\\[10000\\]{z-index:10000}.z-\\[100001\\]{z-index:100001}.col-span-1{grid-column:span 1/span 1}.col-span-2{grid-column:span 2/span 2}.col-span-3{grid-column:span 3/span 3}.col-span-5{grid-column:span 5/span 5}.col-start-2{grid-column-start:2}.col-start-3{grid-column-start:3}.col-start-4{grid-column-start:4}.container{width:100%}@media (min-width:40rem){.container{max-width:40rem}}@media (min-width:48rem){.container{max-width:48rem}}@media (min-width:64rem){.container{max-width:64rem}}@media (min-width:80rem){.container{max-width:80rem}}@media (min-width:96rem){.container{max-width:96rem}}.-m-4{margin:calc(var(--spacing)*-4)}.m-0{margin:calc(var(--spacing)*0)}.-mx-4{margin-inline:calc(var(--spacing)*-4)}.mx-2{margin-inline:calc(var(--spacing)*2)}.mx-10{margin-inline:calc(var(--spacing)*10)}.mx-auto{margin-inline:auto}.my-0{margin-block:calc(var(--spacing)*0)}.my-0\\!{margin-block:calc(var(--spacing)*0)!important}.my-3{margin-block:calc(var(--spacing)*3)}.my-3\\.5{margin-block:calc(var(--spacing)*3.5)}.my-6{margin-block:calc(var(--spacing)*6)}.my-12{margin-block:calc(var(--spacing)*12)}.-mt-0{margin-top:calc(var(--spacing)*0)}.-mt-0\\.5{margin-top:calc(var(--spacing)*-.5)}.-mt-2{margin-top:calc(var(--spacing)*-2)}.-mt-4{margin-top:calc(var(--spacing)*-4)}.-mt-7{margin-top:calc(var(--spacing)*-7)}.-mt-8{margin-top:calc(var(--spacing)*-8)}.-mt-12{margin-top:calc(var(--spacing)*-12)}.-mt-15{margin-top:calc(var(--spacing)*-15)}.-mt-16{margin-top:calc(var(--spacing)*-16)}.-mt-21{margin-top:calc(var(--spacing)*-21)}.-mt-px{margin-top:-1px}.mt-0{margin-top:calc(var(--spacing)*0)}.mt-0\\.5{margin-top:calc(var(--spacing)*.5)}.mt-1{margin-top:calc(var(--spacing)*1)}.mt-1\\.5{margin-top:calc(var(--spacing)*1.5)}.mt-2{margin-top:calc(var(--spacing)*2)}.mt-3{margin-top:calc(var(--spacing)*3)}.mt-4{margin-top:calc(var(--spacing)*4)}.mt-6{margin-top:calc(var(--spacing)*6)}.mt-8{margin-top:calc(var(--spacing)*8)}.mt-10{margin-top:calc(var(--spacing)*10)}.mt-16{margin-top:calc(var(--spacing)*16)}.mt-\\[-42px\\]{margin-top:-42px}.mt-\\[137px\\]{margin-top:137px}.mt-auto{margin-top:auto}.mr-1{margin-right:calc(var(--spacing)*1)}.mr-1\\.5{margin-right:calc(var(--spacing)*1.5)}.mr-2{margin-right:calc(var(--spacing)*2)}.mr-3{margin-right:calc(var(--spacing)*3)}.mr-4{margin-right:calc(var(--spacing)*4)}.mr-12{margin-right:calc(var(--spacing)*12)}.mr-18{margin-right:calc(var(--spacing)*18)}.mr-\\[20px\\]{margin-right:20px}.-mb-\\[10px\\]{margin-bottom:-10px}.mb-0{margin-bottom:calc(var(--spacing)*0)}.mb-0\\.5{margin-bottom:calc(var(--spacing)*.5)}.mb-1{margin-bottom:calc(var(--spacing)*1)}.mb-1\\.5{margin-bottom:calc(var(--spacing)*1.5)}.mb-2{margin-bottom:calc(var(--spacing)*2)}.mb-3{margin-bottom:calc(var(--spacing)*3)}.mb-4{margin-bottom:calc(var(--spacing)*4)}.mb-6{margin-bottom:calc(var(--spacing)*6)}.mb-7{margin-bottom:calc(var(--spacing)*7)}.mb-8{margin-bottom:calc(var(--spacing)*8)}.mb-12{margin-bottom:calc(var(--spacing)*12)}.mb-12\\!{margin-bottom:calc(var(--spacing)*12)!important}.mb-16{margin-bottom:calc(var(--spacing)*16)}.mb-20{margin-bottom:calc(var(--spacing)*20)}.ml-1{margin-left:calc(var(--spacing)*1)}.ml-1\\.5{margin-left:calc(var(--spacing)*1.5)}.ml-2{margin-left:calc(var(--spacing)*2)}.ml-3{margin-left:calc(var(--spacing)*3)}.ml-4{margin-left:calc(var(--spacing)*4)}.ml-6{margin-left:calc(var(--spacing)*6)}.ml-8{margin-left:calc(var(--spacing)*8)}.ml-22{margin-left:calc(var(--spacing)*22)}.ml-\\[320px\\]{margin-left:320px}.ml-auto{margin-left:auto}.box-border{box-sizing:border-box}.line-clamp-2{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.\\!block{display:block!important}.\\!hidden{display:none!important}.block{display:block}.contents{display:contents}.flex{display:flex}.grid{display:grid}.hidden{display:none}.inline{display:inline}.inline-block{display:inline-block}.inline-flex{display:inline-flex}.table{display:table}.table-cell{display:table-cell}.table-row{display:table-row}.aspect-\\[16\\/9\\]{aspect-ratio:16/9}.size-1{width:calc(var(--spacing)*1);height:calc(var(--spacing)*1)}.size-2{width:calc(var(--spacing)*2);height:calc(var(--spacing)*2)}.size-3{width:calc(var(--spacing)*3);height:calc(var(--spacing)*3)}.size-4{width:calc(var(--spacing)*4);height:calc(var(--spacing)*4)}.size-4\\!{width:calc(var(--spacing)*4)!important;height:calc(var(--spacing)*4)!important}.size-4\\.5{width:calc(var(--spacing)*4.5);height:calc(var(--spacing)*4.5)}.size-5{width:calc(var(--spacing)*5);height:calc(var(--spacing)*5)}.size-6{width:calc(var(--spacing)*6);height:calc(var(--spacing)*6)}.size-8{width:calc(var(--spacing)*8);height:calc(var(--spacing)*8)}.size-10{width:calc(var(--spacing)*10);height:calc(var(--spacing)*10)}.size-11{width:calc(var(--spacing)*11);height:calc(var(--spacing)*11)}.size-12{width:calc(var(--spacing)*12);height:calc(var(--spacing)*12)}.size-15{width:calc(var(--spacing)*15);height:calc(var(--spacing)*15)}.size-16{width:calc(var(--spacing)*16);height:calc(var(--spacing)*16)}.size-24{width:calc(var(--spacing)*24);height:calc(var(--spacing)*24)}.size-36{width:calc(var(--spacing)*36);height:calc(var(--spacing)*36)}.size-40{width:calc(var(--spacing)*40);height:calc(var(--spacing)*40)}.size-64{width:calc(var(--spacing)*64);height:calc(var(--spacing)*64)}.size-76{width:calc(var(--spacing)*76);height:calc(var(--spacing)*76)}.size-\\[3\\.5em\\]{width:3.5em;height:3.5em}.size-\\[26px\\]{width:26px;height:26px}.size-\\[30px\\]{width:30px;height:30px}.size-\\[56px\\]{width:56px;height:56px}.size-\\[70px\\]{width:70px;height:70px}.size-\\[80px\\]{width:80px;height:80px}.size-\\[100px\\]{width:100px;height:100px}.size-\\[136px\\]{width:136px;height:136px}.size-\\[148px\\]{width:148px;height:148px}.size-\\[186px\\]{width:186px;height:186px}.size-fit{width:-webkit-fit-content;width:fit-content;height:-webkit-fit-content;height:fit-content}.size-full{width:100%;height:100%}.size-max{width:-webkit-max-content;width:max-content;height:-webkit-max-content;height:max-content}.h-0{height:calc(var(--spacing)*0)}.h-0\\.5{height:calc(var(--spacing)*.5)}.h-1{height:calc(var(--spacing)*1)}.h-1\\/2{height:50%}.h-2{height:calc(var(--spacing)*2)}.h-3{height:calc(var(--spacing)*3)}.h-3\\.5{height:calc(var(--spacing)*3.5)}.h-4{height:calc(var(--spacing)*4)}.h-4\\.5{height:calc(var(--spacing)*4.5)}.h-5{height:calc(var(--spacing)*5)}.h-5\\.5{height:calc(var(--spacing)*5.5)}.h-6{height:calc(var(--spacing)*6)}.h-6\\.5{height:calc(var(--spacing)*6.5)}.h-7{height:calc(var(--spacing)*7)}.h-8{height:calc(var(--spacing)*8)}.h-8\\.5{height:calc(var(--spacing)*8.5)}.h-9{height:calc(var(--spacing)*9)}.h-9\\.5{height:calc(var(--spacing)*9.5)}.h-10{height:calc(var(--spacing)*10)}.h-12{height:calc(var(--spacing)*12)}.h-12\\.5{height:calc(var(--spacing)*12.5)}.h-16{height:calc(var(--spacing)*16)}.h-20{height:calc(var(--spacing)*20)}.h-22{height:calc(var(--spacing)*22)}.h-24{height:calc(var(--spacing)*24)}.h-48{height:calc(var(--spacing)*48)}.h-96{height:calc(var(--spacing)*96)}.h-\\[1px\\]{height:1px}.h-\\[2px\\]{height:2px}.h-\\[3px\\]{height:3px}.h-\\[4px\\]{height:4px}.h-\\[8vw\\]{height:8vw}.h-\\[10vw\\]{height:10vw}.h-\\[16px\\]{height:16px}.h-\\[26px\\]{height:26px}.h-\\[28px\\]{height:28px}.h-\\[30px\\]{height:30px}.h-\\[32px\\]{height:32px}.h-\\[60px\\]{height:60px}.h-\\[80px\\]{height:80px}.h-\\[85vh\\]{height:85vh}.h-\\[105px\\]{height:105px}.h-\\[120px\\]{height:120px}.h-\\[160px\\]{height:160px}.h-\\[181px\\]{height:181px}.h-\\[200px\\]{height:200px}.h-\\[240px\\]{height:240px}.h-\\[250px\\]{height:250px}.h-\\[275px\\]\\!{height:275px!important}.h-\\[300px\\]{height:300px}.h-\\[360px\\]{height:360px}.h-\\[410px\\]{height:410px}.h-\\[440px\\]{height:440px}.h-\\[600px\\]{height:600px}.h-\\[calc\\(100\\%-32px\\)\\]{height:calc(100% - 32px)}.h-\\[calc\\(100\\%-54px\\)\\]{height:calc(100% - 54px)}.h-auto{height:auto}.h-full{height:100%}.h-px{height:1px}.h-screen{height:100vh}.max-h-60{max-height:calc(var(--spacing)*60)}.max-h-\\[70vh\\]{max-height:70vh}.max-h-\\[90\\%\\]{max-height:90%}.max-h-\\[200px\\]{max-height:200px}.max-h-\\[260px\\]{max-height:260px}.max-h-\\[300px\\]{max-height:300px}.max-h-\\[460px\\]{max-height:460px}.max-h-\\[650px\\]{max-height:650px}.max-h-\\[calc\\(100vh-260px\\)\\]{max-height:calc(100vh - 260px)}.max-h-full{max-height:100%}.min-h-0{min-height:calc(var(--spacing)*0)}.min-h-32{min-height:calc(var(--spacing)*32)}.min-h-48{min-height:calc(var(--spacing)*48)}.min-h-screen{min-height:100vh}.w-1{width:calc(var(--spacing)*1)}.w-1\\.5{width:calc(var(--spacing)*1.5)}.w-1\\/2{width:50%}.w-1\\/3{width:33.3333%}.w-2{width:calc(var(--spacing)*2)}.w-2\\/3{width:66.6667%}.w-2\\/5{width:40%}.w-3{width:calc(var(--spacing)*3)}.w-3\\/4{width:75%}.w-3\\/5{width:60%}.w-4{width:calc(var(--spacing)*4)}.w-4\\.5{width:calc(var(--spacing)*4.5)}.w-5{width:calc(var(--spacing)*5)}.w-6{width:calc(var(--spacing)*6)}.w-9{width:calc(var(--spacing)*9)}.w-9\\.5{width:calc(var(--spacing)*9.5)}.w-10{width:calc(var(--spacing)*10)}.w-12{width:calc(var(--spacing)*12)}.w-16{width:calc(var(--spacing)*16)}.w-20{width:calc(var(--spacing)*20)}.w-22{width:calc(var(--spacing)*22)}.w-24{width:calc(var(--spacing)*24)}.w-28{width:calc(var(--spacing)*28)}.w-32{width:calc(var(--spacing)*32)}.w-36{width:calc(var(--spacing)*36)}.w-40{width:calc(var(--spacing)*40)}.w-48{width:calc(var(--spacing)*48)}.w-52{width:calc(var(--spacing)*52)}.w-56{width:calc(var(--spacing)*56)}.w-64{width:calc(var(--spacing)*64)}.w-64\\!{width:calc(var(--spacing)*64)!important}.w-72{width:calc(var(--spacing)*72)}.w-96{width:calc(var(--spacing)*96)}.w-128{width:calc(var(--spacing)*128)}.w-280{width:calc(var(--spacing)*280)}.w-340{width:calc(var(--spacing)*340)}.w-\\[2px\\]{width:2px}.w-\\[3\\.25rem\\]{width:3.25rem}.w-\\[3px\\]{width:3px}.w-\\[6px\\]{width:6px}.w-\\[10px\\]{width:10px}.w-\\[20px\\]{width:20px}.w-\\[45\\%\\]{width:45%}.w-\\[50\\%\\]{width:50%}.w-\\[55\\%\\]{width:55%}.w-\\[70\\%\\]{width:70%}.w-\\[75\\%\\]{width:75%}.w-\\[85\\%\\]{width:85%}.w-\\[100px\\]{width:100px}.w-\\[150px\\]{width:150px}.w-\\[256px\\]{width:256px}.w-\\[306px\\]{width:306px}.w-\\[320px\\]{width:320px}.w-\\[330px\\]{width:330px}.w-\\[335px\\]{width:335px}.w-\\[660px\\]{width:660px}.w-\\[750px\\]{width:750px}.w-\\[902px\\]{width:902px}.w-\\[calc\\(100\\%-2rem\\)\\]{width:calc(100% - 2rem)}.w-\\[calc\\(100\\%-16px\\)\\]{width:calc(100% - 16px)}.w-\\[calc\\(100\\%-32px\\)\\]{width:calc(100% - 32px)}.w-\\[calc\\(100\\%-320px\\)\\]{width:calc(100% - 320px)}.w-auto{width:auto}.w-fit{width:-webkit-fit-content;width:fit-content}.w-full{width:100%}.w-full\\!{width:100%!important}.w-max{width:-webkit-max-content;width:max-content}.w-min{width:-webkit-min-content;width:min-content}.w-px{width:1px}.w-screen{width:100vw}.max-w-2xl{max-width:var(--container-2xl)}.max-w-14{max-width:calc(var(--spacing)*14)}.max-w-48{max-width:calc(var(--spacing)*48)}.max-w-80{max-width:calc(var(--spacing)*80)}.max-w-\\[33\\%\\]{max-width:33%}.max-w-\\[100px\\]{max-width:100px}.max-w-\\[120px\\]{max-width:120px}.max-w-\\[130px\\]{max-width:130px}.max-w-\\[280px\\]{max-width:280px}.max-w-\\[360px\\]{max-width:360px}.max-w-\\[400px\\]{max-width:400px}.max-w-\\[1070px\\]{max-width:1070px}.max-w-\\[1200px\\]{max-width:1200px}.max-w-\\[1920px\\]{max-width:1920px}.max-w-full{max-width:100%}.max-w-none{max-width:none}.max-w-xl{max-width:var(--container-xl)}.max-w-xs{max-width:var(--container-xs)}.min-w-0{min-width:calc(var(--spacing)*0)}.min-w-\\[150px\\]{min-width:150px}.min-w-\\[220px\\]{min-width:220px}.min-w-full{min-width:100%}.min-w-screen{min-width:100vw}.flex-1{flex:1}.flex-3{flex:3}.flex-7{flex:7}.flex-none{flex:none}.flex-shrink{flex-shrink:1}.flex-shrink-0{flex-shrink:0}.shrink{flex-shrink:1}.shrink-0{flex-shrink:0}.flex-grow,.grow{flex-grow:1}.basis-1{flex-basis:calc(var(--spacing)*1)}.basis-1\\/2{flex-basis:50%}.basis-1\\/3{flex-basis:33.3333%}.basis-2{flex-basis:calc(var(--spacing)*2)}.basis-2\\/3{flex-basis:66.6667%}.basis-full{flex-basis:100%}.table-fixed{table-layout:fixed}.border-collapse{border-collapse:collapse}.origin-center{transform-origin:50%}.-translate-x-1{--tw-translate-x:calc(var(--spacing)*-1);translate:var(--tw-translate-x)var(--tw-translate-y)}.-translate-x-1\\/2{--tw-translate-x: -50% ;translate:var(--tw-translate-x)var(--tw-translate-y)}.-translate-x-2{--tw-translate-x:calc(var(--spacing)*-2);translate:var(--tw-translate-x)var(--tw-translate-y)}.translate-x-0{--tw-translate-x:calc(var(--spacing)*0);translate:var(--tw-translate-x)var(--tw-translate-y)}.-translate-y-1{--tw-translate-y:calc(var(--spacing)*-1);translate:var(--tw-translate-x)var(--tw-translate-y)}.-translate-y-1\\/2{--tw-translate-y: -50% ;translate:var(--tw-translate-x)var(--tw-translate-y)}.-translate-y-full{--tw-translate-y:-100%;translate:var(--tw-translate-x)var(--tw-translate-y)}.translate-y-0{--tw-translate-y:calc(var(--spacing)*0);translate:var(--tw-translate-x)var(--tw-translate-y)}.translate-y-1{--tw-translate-y:calc(var(--spacing)*1);translate:var(--tw-translate-x)var(--tw-translate-y)}.translate-y-4{--tw-translate-y:calc(var(--spacing)*4);translate:var(--tw-translate-x)var(--tw-translate-y)}.translate-y-9{--tw-translate-y:calc(var(--spacing)*9);translate:var(--tw-translate-x)var(--tw-translate-y)}.translate-y-18{--tw-translate-y:calc(var(--spacing)*18);translate:var(--tw-translate-x)var(--tw-translate-y)}.scale-95{--tw-scale-x:95%;--tw-scale-y:95%;--tw-scale-z:95%;scale:var(--tw-scale-x)var(--tw-scale-y)}.-rotate-90{rotate:-90deg}.rotate-90{rotate:90deg}.rotate-180{rotate:180deg}.rotate-270{rotate:270deg}.rotate-\\[-13deg\\]{rotate:-13deg}.transform{transform:var(--tw-rotate-x, )var(--tw-rotate-y, )var(--tw-rotate-z, )var(--tw-skew-x, )var(--tw-skew-y, )}.animate-marquee-fast{animation:var(--animate-marquee-fast)}.animate-marquee-medium{animation:var(--animate-marquee-medium)}.animate-marquee-slow{animation:var(--animate-marquee-slow)}.animate-pulse{animation:var(--animate-pulse)}.animate-spin{animation:var(--animate-spin)}.cursor-auto{cursor:auto}.cursor-default{cursor:default}.cursor-not-allowed{cursor:not-allowed}.cursor-pointer{cursor:pointer}.resize{resize:both}.resize-none{resize:none}.list-disc{list-style-type:disc}.appearance-none{-webkit-appearance:none;appearance:none}.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-cols-7{grid-template-columns:repeat(7,minmax(0,1fr))}.grid-cols-12{grid-template-columns:repeat(12,minmax(0,1fr))}.grid-cols-\\[4fr_3fr_4fr\\]{grid-template-columns:4fr 3fr 4fr}.grid-cols-\\[5fr_4fr_4fr_4fr\\]{grid-template-columns:5fr 4fr 4fr 4fr}.flex-col{flex-direction:column}.flex-row{flex-direction:row}.flex-wrap{flex-wrap:wrap}.items-baseline{align-items:baseline}.items-center{align-items:center}.items-end{align-items:flex-end}.items-start{align-items:flex-start}.items-stretch{align-items:stretch}.justify-between{justify-content:space-between}.justify-center{justify-content:center}.justify-end{justify-content:flex-end}.justify-items-center{justify-items:center}.gap-0{gap:calc(var(--spacing)*0)}.gap-0\\.5{gap:calc(var(--spacing)*.5)}.gap-1{gap:calc(var(--spacing)*1)}.gap-1\\.5{gap:calc(var(--spacing)*1.5)}.gap-2{gap:calc(var(--spacing)*2)}.gap-2\\.5{gap:calc(var(--spacing)*2.5)}.gap-3{gap:calc(var(--spacing)*3)}.gap-3\\!{gap:calc(var(--spacing)*3)!important}.gap-4{gap:calc(var(--spacing)*4)}.gap-6{gap:calc(var(--spacing)*6)}.gap-8{gap:calc(var(--spacing)*8)}.gap-16{gap:calc(var(--spacing)*16)}:where(.space-y-1>:not(:last-child)){--tw-space-y-reverse:0;-webkit-margin-before:calc(calc(var(--spacing)*1)*var(--tw-space-y-reverse));margin-block-start:calc(calc(var(--spacing)*1)*var(--tw-space-y-reverse));-webkit-margin-after:calc(calc(var(--spacing)*1)*calc(1 - var(--tw-space-y-reverse)));margin-block-end:calc(calc(var(--spacing)*1)*calc(1 - var(--tw-space-y-reverse)))}.gap-x-2{column-gap:calc(var(--spacing)*2)}.gap-x-4{column-gap:calc(var(--spacing)*4)}.gap-x-12{column-gap:calc(var(--spacing)*12)}.gap-y-3{row-gap:calc(var(--spacing)*3)}.gap-y-5{row-gap:calc(var(--spacing)*5)}:where(.divide-y>:not(:last-child)){--tw-divide-y-reverse:0;border-bottom-style:var(--tw-border-style);border-top-style:var(--tw-border-style);border-top-width:calc(1px*var(--tw-divide-y-reverse));border-bottom-width:calc(1px*calc(1 - var(--tw-divide-y-reverse)))}:where(.divide-white>:not(:last-child)){border-color:var(--color-white)}:where(.divide-white\\/5>:not(:last-child)){border-color:#ffffff0d}@supports (color:color-mix(in lab,red,red)){:where(.divide-white\\/5>:not(:last-child)){border-color:color-mix(in oklab,var(--color-white)5%,transparent)}}:where(.divide-white\\/10>:not(:last-child)){border-color:#ffffff1a}@supports (color:color-mix(in lab,red,red)){:where(.divide-white\\/10>:not(:last-child)){border-color:color-mix(in oklab,var(--color-white)10%,transparent)}}.self-start{align-self:flex-start}.self-stretch{align-self:stretch}.justify-self-start{justify-self:flex-start}.truncate{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.overflow-auto{overflow:auto}.overflow-hidden{overflow:hidden}.overflow-visible{overflow:visible}.overflow-x-hidden{overflow-x:hidden}.overflow-y-auto{overflow-y:auto}.overscroll-contain{overscroll-behavior:contain}.rounded{border-radius:.25rem}.rounded-2xl{border-radius:var(--radius-2xl)}.rounded-\\[0\\.625rem\\]{border-radius:.625rem}.rounded-\\[4px\\]{border-radius:4px}.rounded-\\[6px\\]{border-radius:6px}.rounded-\\[8px\\]{border-radius:8px}.rounded-\\[10px\\]{border-radius:10px}.rounded-\\[10px\\]\\!{border-radius:10px!important}.rounded-\\[12px\\]{border-radius:12px}.rounded-\\[14px\\]{border-radius:14px}.rounded-\\[16px\\]{border-radius:16px}.rounded-\\[20px\\]{border-radius:20px}.rounded-\\[27px\\]{border-radius:27px}.rounded-\\[28px\\]{border-radius:28px}.rounded-\\[40px\\]{border-radius:40px}.rounded-full{border-radius:3.40282e38px}.rounded-lg{border-radius:var(--radius-lg)}.rounded-md{border-radius:var(--radius-md)}.rounded-sm{border-radius:var(--radius-sm)}.rounded-xl{border-radius:var(--radius-xl)}.rounded-t-\\[16px\\]{border-top-left-radius:16px;border-top-right-radius:16px}.rounded-t-lg{border-top-left-radius:var(--radius-lg);border-top-right-radius:var(--radius-lg)}.rounded-l-\\[4px\\]{border-top-left-radius:4px;border-bottom-left-radius:4px}.rounded-r-\\[6px\\]{border-top-right-radius:6px;border-bottom-right-radius:6px}.rounded-b-\\[16px\\]{border-bottom-right-radius:16px;border-bottom-left-radius:16px}.rounded-b-lg{border-bottom-right-radius:var(--radius-lg);border-bottom-left-radius:var(--radius-lg)}.rounded-bl-\\[10px\\]{border-bottom-left-radius:10px}.border{border-style:var(--tw-border-style);border-width:1px}.border-0{border-style:var(--tw-border-style);border-width:0}.border-0\\!{border-style:var(--tw-border-style)!important;border-width:0!important}.border-2{border-style:var(--tw-border-style);border-width:2px}.border-3{border-style:var(--tw-border-style);border-width:3px}.border-\\[2px\\]{border-style:var(--tw-border-style);border-width:2px}.border-x{border-inline-style:var(--tw-border-style);border-inline-width:1px}.border-y-1{border-block-style:var(--tw-border-style);border-block-width:1px}.border-t{border-top-style:var(--tw-border-style);border-top-width:1px}.border-b{border-bottom-style:var(--tw-border-style);border-bottom-width:1px}.border-l{border-left-style:var(--tw-border-style);border-left-width:1px}.border-dashed{--tw-border-style:dashed;border-style:dashed}.border-none{--tw-border-style:none;border-style:none}.border-none\\!{--tw-border-style:none!important;border-style:none!important}.border-\\[\\#3AFF6866\\]{border-color:#3aff6866}.border-\\[\\#4D4D4D\\]{border-color:#4d4d4d}.border-\\[\\#48363A\\]{border-color:#48363a}.border-\\[\\#92223E\\]{border-color:#92223e}.border-\\[\\#303030\\]{border-color:#303030}.border-\\[\\#303030\\]\\!{border-color:#303030!important}.border-\\[\\#383737\\]{border-color:#383737}.border-\\[\\#474747\\]{border-color:#474747}.border-\\[\\#D4355580\\]{border-color:#d4355580}.border-\\[\\#F6C669\\]{border-color:#f6c669}.border-\\[\\#FDB100\\]{border-color:#fdb100}.border-\\[\\#FFB54D80\\]{border-color:#ffb54d80}.border-black{border-color:var(--color-black)}.border-black\\/10{border-color:#0000001a}@supports (color:color-mix(in lab,red,red)){.border-black\\/10{border-color:color-mix(in oklab,var(--color-black)10%,transparent)}}.border-transparent{border-color:#0000}.border-white{border-color:var(--color-white)}.border-white\\/4{border-color:#ffffff0a}@supports (color:color-mix(in lab,red,red)){.border-white\\/4{border-color:color-mix(in oklab,var(--color-white)4%,transparent)}}.border-white\\/5{border-color:#ffffff0d}@supports (color:color-mix(in lab,red,red)){.border-white\\/5{border-color:color-mix(in oklab,var(--color-white)5%,transparent)}}.border-white\\/6{border-color:#ffffff0f}@supports (color:color-mix(in lab,red,red)){.border-white\\/6{border-color:color-mix(in oklab,var(--color-white)6%,transparent)}}.border-white\\/8{border-color:#ffffff14}@supports (color:color-mix(in lab,red,red)){.border-white\\/8{border-color:color-mix(in oklab,var(--color-white)8%,transparent)}}.border-white\\/10{border-color:#ffffff1a}@supports (color:color-mix(in lab,red,red)){.border-white\\/10{border-color:color-mix(in oklab,var(--color-white)10%,transparent)}}.border-white\\/20{border-color:#fff3}@supports (color:color-mix(in lab,red,red)){.border-white\\/20{border-color:color-mix(in oklab,var(--color-white)20%,transparent)}}.border-white\\/30{border-color:#ffffff4d}@supports (color:color-mix(in lab,red,red)){.border-white\\/30{border-color:color-mix(in oklab,var(--color-white)30%,transparent)}}.bg-\\[\\#1D1C1C\\],.bg-\\[\\#1d1c1c\\]{background-color:#1d1c1c}.bg-\\[\\#2A2A2A\\]{background-color:#2a2a2a}.bg-\\[\\#2D4B2E\\]{background-color:#2d4b2e}.bg-\\[\\#2E1F22\\]{background-color:#2e1f22}.bg-\\[\\#3AFF68\\]{background-color:#3aff68}.bg-\\[\\#3AFF68\\]\\/10{background-color:#3aff681a}.bg-\\[\\#3AFF6866\\]{background-color:#3aff6866}.bg-\\[\\#3F3F3F\\]{background-color:#3f3f3f}.bg-\\[\\#75FE971A\\]{background-color:#75fe971a}.bg-\\[\\#006313\\]{background-color:#006313}.bg-\\[\\#210033\\]{background-color:#210033}.bg-\\[\\#212121\\]{background-color:#212121}.bg-\\[\\#212121\\]\\!{background-color:#212121!important}.bg-\\[\\#222222\\]{background-color:#222}.bg-\\[\\#252525\\]{background-color:#252525}.bg-\\[\\#282828CC\\]{background-color:#282828cc}.bg-\\[\\#282828\\]{background-color:#282828}.bg-\\[\\#303030\\]{background-color:#303030}.bg-\\[\\#323232\\]{background-color:#323232}.bg-\\[\\#333333\\]{background-color:#333}.bg-\\[\\#474747\\]{background-color:#474747}.bg-\\[\\#474747\\]\\!{background-color:#474747!important}.bg-\\[\\#777777\\]\\!{background-color:#777!important}.bg-\\[\\#786243\\]{background-color:#786243}.bg-\\[\\#C4FFC8\\]{background-color:#c4ffc8}.bg-\\[\\#C192374D\\]{background-color:#c192374d}.bg-\\[\\#D43555\\]{background-color:#d43555}.bg-\\[\\#D43555\\]\\/20{background-color:#d4355533}.bg-\\[\\#D435554D\\]{background-color:#d435554d}.bg-\\[\\#D4355524\\]{background-color:#d4355524}.bg-\\[\\#F5C467\\]{background-color:#f5c467}.bg-\\[\\#FDB100\\]{background-color:#fdb100}.bg-\\[\\#FDB10014\\]{background-color:#fdb10014}.bg-\\[\\#FFB54D4D\\]{background-color:#ffb54d4d}.bg-\\[\\#FFB54D14\\]{background-color:#ffb54d14}.bg-\\[\\#FFB54D\\]{background-color:#ffb54d}.bg-\\[\\#FFFFFF0A\\]{background-color:#ffffff0a}.bg-\\[var\\(--bubble-bg\\)\\]{background-color:var(--bubble-bg)}.bg-black{background-color:var(--color-black)}.bg-black\\/10{background-color:#0000001a}@supports (color:color-mix(in lab,red,red)){.bg-black\\/10{background-color:color-mix(in oklab,var(--color-black)10%,transparent)}}.bg-black\\/30{background-color:#0000004d}@supports (color:color-mix(in lab,red,red)){.bg-black\\/30{background-color:color-mix(in oklab,var(--color-black)30%,transparent)}}.bg-transparent{background-color:#0000}.bg-white{background-color:var(--color-white)}.bg-white\\/4{background-color:#ffffff0a}@supports (color:color-mix(in lab,red,red)){.bg-white\\/4{background-color:color-mix(in oklab,var(--color-white)4%,transparent)}}.bg-white\\/5{background-color:#ffffff0d}@supports (color:color-mix(in lab,red,red)){.bg-white\\/5{background-color:color-mix(in oklab,var(--color-white)5%,transparent)}}.bg-white\\/6{background-color:#ffffff0f}@supports (color:color-mix(in lab,red,red)){.bg-white\\/6{background-color:color-mix(in oklab,var(--color-white)6%,transparent)}}.bg-white\\/7{background-color:#ffffff12}@supports (color:color-mix(in lab,red,red)){.bg-white\\/7{background-color:color-mix(in oklab,var(--color-white)7%,transparent)}}.bg-white\\/8{background-color:#ffffff14}@supports (color:color-mix(in lab,red,red)){.bg-white\\/8{background-color:color-mix(in oklab,var(--color-white)8%,transparent)}}.bg-white\\/10{background-color:#ffffff1a}@supports (color:color-mix(in lab,red,red)){.bg-white\\/10{background-color:color-mix(in oklab,var(--color-white)10%,transparent)}}.bg-white\\/12{background-color:#ffffff1f}@supports (color:color-mix(in lab,red,red)){.bg-white\\/12{background-color:color-mix(in oklab,var(--color-white)12%,transparent)}}.bg-white\\/15{background-color:#ffffff26}@supports (color:color-mix(in lab,red,red)){.bg-white\\/15{background-color:color-mix(in oklab,var(--color-white)15%,transparent)}}.bg-white\\/16{background-color:#ffffff29}@supports (color:color-mix(in lab,red,red)){.bg-white\\/16{background-color:color-mix(in oklab,var(--color-white)16%,transparent)}}.bg-white\\/20{background-color:#fff3}@supports (color:color-mix(in lab,red,red)){.bg-white\\/20{background-color:color-mix(in oklab,var(--color-white)20%,transparent)}}.bg-white\\/30{background-color:#ffffff4d}@supports (color:color-mix(in lab,red,red)){.bg-white\\/30{background-color:color-mix(in oklab,var(--color-white)30%,transparent)}}.bg-white\\/40{background-color:#fff6}@supports (color:color-mix(in lab,red,red)){.bg-white\\/40{background-color:color-mix(in oklab,var(--color-white)40%,transparent)}}.bg-white\\/\\[0\\.06\\]{background-color:#ffffff0f}@supports (color:color-mix(in lab,red,red)){.bg-white\\/\\[0\\.06\\]{background-color:color-mix(in oklab,var(--color-white)6%,transparent)}}.bg-linear-to-t{--tw-gradient-position:to top}@supports (background-image:linear-gradient(in lab,red,red)){.bg-linear-to-t{--tw-gradient-position:to top in oklab}}.bg-linear-to-t{background-image:linear-gradient(var(--tw-gradient-stops))}.bg-gradient-to-r{--tw-gradient-position:to right in oklab;background-image:linear-gradient(var(--tw-gradient-stops))}.bg-gradient-to-t{--tw-gradient-position:to top in oklab;background-image:linear-gradient(var(--tw-gradient-stops))}.bg-\\[linear-gradient\\(90deg\\,rgba\\(212\\,53\\,85\\,0\\.10\\)_0\\%\\,rgba\\(29\\,28\\,28\\,0\\.00\\)_100\\%\\)\\]{background-image:linear-gradient(90deg,#d435551a,#1d1c1c00)}.bg-\\[linear-gradient\\(92deg\\,rgba\\(212\\,53\\,85\\,0\\.14\\)_0\\%\\,rgba\\(48\\,46\\,46\\,0\\.00\\)_100\\%\\)\\]{background-image:linear-gradient(92deg,#d4355524,#302e2e00)}.bg-\\[linear-gradient\\(98deg\\,\\#D43555_-3\\.08\\%\\,\\#733435_70\\.62\\%\\)\\]{background-image:linear-gradient(98deg,#d43555 -3.08%,#733435 70.62%)}.bg-\\[linear-gradient\\(98deg\\,_var\\(--color-gradient-green-start\\)_-3\\.08\\%\\,_var\\(--color-gradient-green-end\\)_70\\.62\\%\\)\\]{background-image:linear-gradient(98deg,var(--color-gradient-green-start)-3.08%,var(--color-gradient-green-end)70.62%)}.bg-\\[linear-gradient\\(230deg\\,rgba\\(246\\,208\\,110\\,0\\.8\\)_0\\%\\,rgba\\(209\\,152\\,55\\,0\\.8\\)_100\\%\\)\\]{background-image:linear-gradient(230deg,#f6d06ecc,#d19837cc)}.bg-\\[linear-gradient\\(230deg\\,rgba\\(246\\,208\\,110\\,0\\.65\\)_0\\%\\,rgba\\(209\\,152\\,55\\,0\\.65\\)_100\\%\\)\\]{background-image:linear-gradient(230deg,#f6d06ea6,#d19837a6)}.bg-\\[linear-gradient\\(270deg\\,\\#343333_0\\%\\,rgba\\(52\\,51\\,51\\,0\\)_100\\%\\)\\]{background-image:linear-gradient(270deg,#343333,#34333300)}.bg-\\[radial-gradient\\(84\\.4\\%_78\\.16\\%_at_100\\%_0\\%\\,rgba\\(70\\,112\\,59\\,0\\.60\\)_0\\%\\,rgba\\(70\\,112\\,59\\,0\\.40\\)_25\\.18\\%\\,rgba\\(70\\,112\\,59\\,0\\)_100\\%\\)\\]{background-image:radial-gradient(84.4% 78.16% at 100% 0,#46703b99,#46703b66 25.18%,#46703b00)}.from-\\[\\#211C21\\]{--tw-gradient-from:#211c21;--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position),var(--tw-gradient-from)var(--tw-gradient-from-position),var(--tw-gradient-to)var(--tw-gradient-to-position))}.from-\\[\\#337E2D\\]{--tw-gradient-from:#337e2d;--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position),var(--tw-gradient-from)var(--tw-gradient-from-position),var(--tw-gradient-to)var(--tw-gradient-to-position))}.to-\\[\\#84EC6B\\]{--tw-gradient-to:#84ec6b;--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position),var(--tw-gradient-from)var(--tw-gradient-from-position),var(--tw-gradient-to)var(--tw-gradient-to-position))}.to-\\[\\#481C26\\]{--tw-gradient-to:#481c26;--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position),var(--tw-gradient-from)var(--tw-gradient-from-position),var(--tw-gradient-to)var(--tw-gradient-to-position))}.to-transparent{--tw-gradient-to:transparent;--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position),var(--tw-gradient-from)var(--tw-gradient-from-position),var(--tw-gradient-to)var(--tw-gradient-to-position))}.bg-cover{background-size:cover}.bg-cover\\!{background-size:cover!important}.bg-center{background-position:50%}.bg-center\\!{background-position:50%!important}.mask-repeat{-webkit-mask-repeat:repeat;mask-repeat:repeat}.object-contain{object-fit:contain}.object-cover{object-fit:cover}.p-0{padding:calc(var(--spacing)*0)}.p-0\\.75{padding:calc(var(--spacing)*.75)}.p-1{padding:calc(var(--spacing)*1)}.p-1\\.5{padding:calc(var(--spacing)*1.5)}.p-2{padding:calc(var(--spacing)*2)}.p-2\\!{padding:calc(var(--spacing)*2)!important}.p-2\\.5{padding:calc(var(--spacing)*2.5)}.p-3{padding:calc(var(--spacing)*3)}.p-4{padding:calc(var(--spacing)*4)}.p-4\\.5{padding:calc(var(--spacing)*4.5)}.p-6{padding:calc(var(--spacing)*6)}.p-8{padding:calc(var(--spacing)*8)}.p-10{padding:calc(var(--spacing)*10)}.p-20{padding:calc(var(--spacing)*20)}.p-\\[0\\.1875rem\\]{padding:.1875rem}.px-0{padding-inline:calc(var(--spacing)*0)}.px-1{padding-inline:calc(var(--spacing)*1)}.px-1\\.5{padding-inline:calc(var(--spacing)*1.5)}.px-2{padding-inline:calc(var(--spacing)*2)}.px-2\\.5{padding-inline:calc(var(--spacing)*2.5)}.px-3{padding-inline:calc(var(--spacing)*3)}.px-3\\!{padding-inline:calc(var(--spacing)*3)!important}.px-3\\.5{padding-inline:calc(var(--spacing)*3.5)}.px-4{padding-inline:calc(var(--spacing)*4)}.px-4\\!{padding-inline:calc(var(--spacing)*4)!important}.px-4\\.5{padding-inline:calc(var(--spacing)*4.5)}.px-5{padding-inline:calc(var(--spacing)*5)}.px-6{padding-inline:calc(var(--spacing)*6)}.px-6\\!{padding-inline:calc(var(--spacing)*6)!important}.px-8{padding-inline:calc(var(--spacing)*8)}.px-8\\!{padding-inline:calc(var(--spacing)*8)!important}.px-20{padding-inline:calc(var(--spacing)*20)}.px-\\[10px\\]{padding-inline:10px}.py-0{padding-block:calc(var(--spacing)*0)}.py-0\\.5{padding-block:calc(var(--spacing)*.5)}.py-0\\.75{padding-block:calc(var(--spacing)*.75)}.py-1{padding-block:calc(var(--spacing)*1)}.py-1\\.5{padding-block:calc(var(--spacing)*1.5)}.py-2{padding-block:calc(var(--spacing)*2)}.py-2\\!{padding-block:calc(var(--spacing)*2)!important}.py-2\\.5{padding-block:calc(var(--spacing)*2.5)}.py-3{padding-block:calc(var(--spacing)*3)}.py-3\\!{padding-block:calc(var(--spacing)*3)!important}.py-3\\.5{padding-block:calc(var(--spacing)*3.5)}.py-4{padding-block:calc(var(--spacing)*4)}.py-5{padding-block:calc(var(--spacing)*5)}.py-8{padding-block:calc(var(--spacing)*8)}.py-10{padding-block:calc(var(--spacing)*10)}.py-12{padding-block:calc(var(--spacing)*12)}.py-16{padding-block:calc(var(--spacing)*16)}.pt-0{padding-top:calc(var(--spacing)*0)}.pt-0\\.5{padding-top:calc(var(--spacing)*.5)}.pt-1{padding-top:calc(var(--spacing)*1)}.pt-1\\.5{padding-top:calc(var(--spacing)*1.5)}.pt-2{padding-top:calc(var(--spacing)*2)}.pt-4{padding-top:calc(var(--spacing)*4)}.pt-6{padding-top:calc(var(--spacing)*6)}.pt-8{padding-top:calc(var(--spacing)*8)}.pt-10{padding-top:calc(var(--spacing)*10)}.pt-12{padding-top:calc(var(--spacing)*12)}.pt-14{padding-top:calc(var(--spacing)*14)}.pt-24{padding-top:calc(var(--spacing)*24)}.pt-px{padding-top:1px}.pr-3{padding-right:calc(var(--spacing)*3)}.pr-4{padding-right:calc(var(--spacing)*4)}.pr-8{padding-right:calc(var(--spacing)*8)}.pr-16{padding-right:calc(var(--spacing)*16)}.pr-\\[calc\\(2rem-5px\\)\\]{padding-right:calc(2rem - 5px)}.pb-0{padding-bottom:calc(var(--spacing)*0)}.pb-0\\.75{padding-bottom:calc(var(--spacing)*.75)}.pb-1{padding-bottom:calc(var(--spacing)*1)}.pb-2{padding-bottom:calc(var(--spacing)*2)}.pb-3{padding-bottom:calc(var(--spacing)*3)}.pb-4{padding-bottom:calc(var(--spacing)*4)}.pb-5{padding-bottom:calc(var(--spacing)*5)}.pb-6{padding-bottom:calc(var(--spacing)*6)}.pb-6\\.5{padding-bottom:calc(var(--spacing)*6.5)}.pb-8{padding-bottom:calc(var(--spacing)*8)}.pb-10{padding-bottom:calc(var(--spacing)*10)}.pb-16{padding-bottom:calc(var(--spacing)*16)}.pb-20{padding-bottom:calc(var(--spacing)*20)}.pb-\\[26px\\]{padding-bottom:26px}.pl-2{padding-left:calc(var(--spacing)*2)}.pl-4{padding-left:calc(var(--spacing)*4)}.pl-8{padding-left:calc(var(--spacing)*8)}.pl-24{padding-left:calc(var(--spacing)*24)}.pl-\\[100\\%\\]{padding-left:100%}.text-center{text-align:center}.text-end{text-align:end}.text-left{text-align:left}.text-start{text-align:start}.text-start\\!{text-align:start!important}.align-middle{vertical-align:middle}.text-2xl{font-size:var(--text-2xl);line-height:var(--tw-leading,var(--text-2xl--line-height))}.text-3xl{font-size:var(--text-3xl);line-height:var(--tw-leading,var(--text-3xl--line-height))}.text-4xl{font-size:var(--text-4xl);line-height:var(--tw-leading,var(--text-4xl--line-height))}.text-5xl{font-size:var(--text-5xl);line-height:var(--tw-leading,var(--text-5xl--line-height))}.text-7xl{font-size:var(--text-7xl);line-height:var(--tw-leading,var(--text-7xl--line-height))}.text-\\[2rem\\]\\/\\[45px\\]{font-size:2rem;line-height:45px}.text-base{font-size:var(--text-base);line-height:var(--tw-leading,var(--text-base--line-height))}.text-base\\/6{font-size:var(--text-base);line-height:calc(var(--spacing)*6)}.text-lg{font-size:var(--text-lg);line-height:var(--tw-leading,var(--text-lg--line-height))}.text-sm{font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height))}.text-sm\\/6{font-size:var(--text-sm);line-height:calc(var(--spacing)*6)}.text-xl{font-size:var(--text-xl);line-height:var(--tw-leading,var(--text-xl--line-height))}.text-xs{font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height))}.text-xs\\!{font-size:var(--text-xs)!important;line-height:var(--tw-leading,var(--text-xs--line-height))!important}.text-xs\\/6{font-size:var(--text-xs);line-height:calc(var(--spacing)*6)}.text-\\[0\\.875em\\]{font-size:.875em}.text-\\[1\\.17em\\]{font-size:1.17em}.text-\\[1\\.25em\\]{font-size:1.25em}.text-\\[1\\.875rem\\]{font-size:1.875rem}.text-\\[1em\\]{font-size:1em}.text-\\[2\\.3em\\]{font-size:2.3em}.text-\\[3\\.5em\\]{font-size:3.5em}.text-\\[3em\\]{font-size:3em}.text-\\[9px\\]{font-size:9px}.text-\\[10px\\]{font-size:10px}.text-\\[11px\\]{font-size:11px}.text-\\[13px\\]{font-size:13px}.text-\\[18px\\]{font-size:18px}.text-\\[20px\\]{font-size:20px}.text-\\[24px\\]{font-size:24px}.text-\\[32px\\]{font-size:32px}.text-\\[44px\\]{font-size:44px}.leading-5{--tw-leading:calc(var(--spacing)*5);line-height:calc(var(--spacing)*5)}.leading-\\[1\\]{--tw-leading:1;line-height:1}.leading-\\[24px\\]{--tw-leading:24px;line-height:24px}.leading-\\[24px\\]\\!{--tw-leading:24px!important;line-height:24px!important}.leading-none{--tw-leading:1;line-height:1}.leading-normal{--tw-leading:var(--leading-normal);line-height:var(--leading-normal)}.leading-relaxed{--tw-leading:var(--leading-relaxed);line-height:var(--leading-relaxed)}.leading-tight{--tw-leading:var(--leading-tight);line-height:var(--leading-tight)}.font-\\[400\\]\\!{--tw-font-weight:400!important;font-weight:400!important}.font-\\[500\\]{--tw-font-weight:500;font-weight:500}.font-\\[600\\]{--tw-font-weight:600;font-weight:600}.font-\\[600\\]\\!{--tw-font-weight:600!important;font-weight:600!important}.font-bold{--tw-font-weight:var(--font-weight-bold);font-weight:var(--font-weight-bold)}.font-bold\\!{--tw-font-weight:var(--font-weight-bold)!important;font-weight:var(--font-weight-bold)!important}.font-extrabold{--tw-font-weight:var(--font-weight-extrabold);font-weight:var(--font-weight-extrabold)}.font-extrabold\\!{--tw-font-weight:var(--font-weight-extrabold)!important;font-weight:var(--font-weight-extrabold)!important}.font-medium{--tw-font-weight:var(--font-weight-medium);font-weight:var(--font-weight-medium)}.font-normal{--tw-font-weight:var(--font-weight-normal);font-weight:var(--font-weight-normal)}.font-semibold{--tw-font-weight:var(--font-weight-semibold);font-weight:var(--font-weight-semibold)}.tracking-\\[0\\.01em\\]{--tw-tracking:.01em;letter-spacing:.01em}.tracking-\\[0\\.18em\\]{--tw-tracking:.18em;letter-spacing:.18em}.tracking-\\[0\\]{--tw-tracking:0;letter-spacing:0}.tracking-wide{--tw-tracking:var(--tracking-wide);letter-spacing:var(--tracking-wide)}.text-wrap{text-wrap:wrap}.break-words{overflow-wrap:break-word}.text-ellipsis{text-overflow:ellipsis}.whitespace-normal{white-space:normal}.whitespace-normal\\!{white-space:normal!important}.whitespace-nowrap{white-space:nowrap}.whitespace-pre-line{white-space:pre-line}.\\!text-white{color:var(--color-white)!important}.text-\\[\\#4D6BEE\\]{color:#4d6bee}.text-\\[\\#5E5E5E\\]{color:#5e5e5e}.text-\\[\\#42A9FF\\]{color:#42a9ff}.text-\\[\\#359BD4\\]{color:#359bd4}.text-\\[\\#4895be\\]{color:#4895be}.text-\\[\\#006313\\]{color:#006313}.text-\\[\\#949494\\]{color:#949494}.text-\\[\\#959595\\]{color:#959595}.text-\\[\\#ABABAB\\]{color:#ababab}.text-\\[\\#ABABAB\\]\\!{color:#ababab!important}.text-\\[\\#C6C6C6\\]\\!{color:#c6c6c6!important}.text-\\[\\#D43555\\]{color:#d43555}.text-\\[\\#E4E4E4\\]{color:#e4e4e4}.text-\\[\\#EF3F62\\]{color:#ef3f62}.text-\\[\\#FFB54D\\]{color:#ffb54d}.text-\\[\\#FFDD31\\]{color:#ffdd31}.text-black{color:var(--color-black)}.text-gray-500{color:var(--color-gray-500)}.text-white{color:var(--color-white)}.text-white\\!{color:var(--color-white)!important}.text-white\\/20{color:#fff3}@supports (color:color-mix(in lab,red,red)){.text-white\\/20{color:color-mix(in oklab,var(--color-white)20%,transparent)}}.text-white\\/30{color:#ffffff4d}@supports (color:color-mix(in lab,red,red)){.text-white\\/30{color:color-mix(in oklab,var(--color-white)30%,transparent)}}.text-white\\/40{color:#fff6}@supports (color:color-mix(in lab,red,red)){.text-white\\/40{color:color-mix(in oklab,var(--color-white)40%,transparent)}}.text-white\\/50{color:#ffffff80}@supports (color:color-mix(in lab,red,red)){.text-white\\/50{color:color-mix(in oklab,var(--color-white)50%,transparent)}}.text-white\\/60{color:#fff9}@supports (color:color-mix(in lab,red,red)){.text-white\\/60{color:color-mix(in oklab,var(--color-white)60%,transparent)}}.text-white\\/70{color:#ffffffb3}@supports (color:color-mix(in lab,red,red)){.text-white\\/70{color:color-mix(in oklab,var(--color-white)70%,transparent)}}.text-white\\/70\\!{color:#ffffffb3!important}@supports (color:color-mix(in lab,red,red)){.text-white\\/70\\!{color:color-mix(in oklab,var(--color-white)70%,transparent)!important}}.text-white\\/75{color:#ffffffbf}@supports (color:color-mix(in lab,red,red)){.text-white\\/75{color:color-mix(in oklab,var(--color-white)75%,transparent)}}.text-white\\/80{color:#fffc}@supports (color:color-mix(in lab,red,red)){.text-white\\/80{color:color-mix(in oklab,var(--color-white)80%,transparent)}}.text-white\\/\\[0\\.75\\]{color:#ffffffbf}@supports (color:color-mix(in lab,red,red)){.text-white\\/\\[0\\.75\\]{color:color-mix(in oklab,var(--color-white)75%,transparent)}}.text-yellow-300{color:var(--color-yellow-300)}.capitalize{text-transform:capitalize}.lowercase{text-transform:lowercase}.uppercase{text-transform:uppercase}.italic{font-style:italic}.ordinal{--tw-ordinal:ordinal;font-variant-numeric:var(--tw-ordinal, )var(--tw-slashed-zero, )var(--tw-numeric-figure, )var(--tw-numeric-spacing, )var(--tw-numeric-fraction, )}.tabular-nums{--tw-numeric-spacing:tabular-nums;font-variant-numeric:var(--tw-ordinal, )var(--tw-slashed-zero, )var(--tw-numeric-figure, )var(--tw-numeric-spacing, )var(--tw-numeric-fraction, )}.\\!underline{-webkit-text-decoration-line:underline!important;text-decoration-line:underline!important}.line-through{-webkit-text-decoration-line:line-through;text-decoration-line:line-through}.overline{-webkit-text-decoration-line:overline;text-decoration-line:overline}.underline{-webkit-text-decoration-line:underline;text-decoration-line:underline}.\\!decoration-white\\/50{-webkit-text-decoration-color:#ffffff80!important;text-decoration-color:#ffffff80!important}@supports (color:color-mix(in lab,red,red)){.\\!decoration-white\\/50{-webkit-text-decoration-color:color-mix(in oklab,var(--color-white)50%,transparent)!important;text-decoration-color:color-mix(in oklab,var(--color-white)50%,transparent)!important}}.decoration-white{-webkit-text-decoration-color:var(--color-white);text-decoration-color:var(--color-white)}.decoration-white\\/30{-webkit-text-decoration-color:#ffffff4d;text-decoration-color:#ffffff4d}@supports (color:color-mix(in lab,red,red)){.decoration-white\\/30{-webkit-text-decoration-color:color-mix(in oklab,var(--color-white)30%,transparent);text-decoration-color:color-mix(in oklab,var(--color-white)30%,transparent)}}.\\!decoration-dotted{-webkit-text-decoration-style:dotted!important;text-decoration-style:dotted!important}.decoration-dotted{-webkit-text-decoration-style:dotted;text-decoration-style:dotted}.\\!decoration-\\[12\\%\\]{text-decoration-thickness:.12em!important}.decoration-\\[12\\%\\]{text-decoration-thickness:.12em}.\\!underline-offset-\\[21\\.5\\%\\]{text-underline-offset:21.5%!important}.underline-offset-\\[21\\.5\\%\\]{text-underline-offset:21.5%}.opacity-0{opacity:0}.opacity-50{opacity:.5}.opacity-55{opacity:.55}.opacity-60{opacity:.6}.opacity-70{opacity:.7}.opacity-90{opacity:.9}.opacity-100{opacity:1}.mix-blend-screen{mix-blend-mode:screen}.shadow{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,#0000001a),0 1px 2px -1px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-2xl{--tw-shadow:0 25px 50px -12px var(--tw-shadow-color,#00000040);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-\\[0_8px_24px_rgba\\(0\\,0\\,0\\,0\\.4\\)\\]{--tw-shadow:0 8px 24px var(--tw-shadow-color,#0006);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-lg{--tw-shadow:0 10px 15px -3px var(--tw-shadow-color,#0000001a),0 4px 6px -4px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-md{--tw-shadow:0 4px 6px -1px var(--tw-shadow-color,#0000001a),0 2px 4px -2px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-xl{--tw-shadow:0 20px 25px -5px var(--tw-shadow-color,#0000001a),0 8px 10px -6px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.ring,.ring-1{--tw-ring-shadow:var(--tw-ring-inset, )0 0 0 calc(1px + var(--tw-ring-offset-width))var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.\\[box-shadow\\:0_0_60px_0_rgba\\(247\\,213\\,119\\,1\\.00\\)\\]{box-shadow:0 0 60px #f7d577}.ring-white{--tw-ring-color:var(--color-white)}.ring-white\\/10{--tw-ring-color:#ffffff1a}@supports (color:color-mix(in lab,red,red)){.ring-white\\/10{--tw-ring-color:color-mix(in oklab,var(--color-white)10%,transparent)}}.outline{outline-style:var(--tw-outline-style);outline-width:1px}.outline-\\[3px\\]{outline-style:var(--tw-outline-style);outline-width:3px}.blur{--tw-blur:blur(8px);-webkit-filter:var(--tw-blur, )var(--tw-brightness, )var(--tw-contrast, )var(--tw-grayscale, )var(--tw-hue-rotate, )var(--tw-invert, )var(--tw-saturate, )var(--tw-sepia, )var(--tw-drop-shadow, );filter:var(--tw-blur, )var(--tw-brightness, )var(--tw-contrast, )var(--tw-grayscale, )var(--tw-hue-rotate, )var(--tw-invert, )var(--tw-saturate, )var(--tw-sepia, )var(--tw-drop-shadow, )}.drop-shadow-md{--tw-drop-shadow-size:drop-shadow(0 3px 3px var(--tw-drop-shadow-color,#0000001f));--tw-drop-shadow:drop-shadow(var(--drop-shadow-md));-webkit-filter:var(--tw-blur, )var(--tw-brightness, )var(--tw-contrast, )var(--tw-grayscale, )var(--tw-hue-rotate, )var(--tw-invert, )var(--tw-saturate, )var(--tw-sepia, )var(--tw-drop-shadow, );filter:var(--tw-blur, )var(--tw-brightness, )var(--tw-contrast, )var(--tw-grayscale, )var(--tw-hue-rotate, )var(--tw-invert, )var(--tw-saturate, )var(--tw-sepia, )var(--tw-drop-shadow, )}.invert{--tw-invert:invert(100%);-webkit-filter:var(--tw-blur, )var(--tw-brightness, )var(--tw-contrast, )var(--tw-grayscale, )var(--tw-hue-rotate, )var(--tw-invert, )var(--tw-saturate, )var(--tw-sepia, )var(--tw-drop-shadow, );filter:var(--tw-blur, )var(--tw-brightness, )var(--tw-contrast, )var(--tw-grayscale, )var(--tw-hue-rotate, )var(--tw-invert, )var(--tw-saturate, )var(--tw-sepia, )var(--tw-drop-shadow, )}.filter{-webkit-filter:var(--tw-blur, )var(--tw-brightness, )var(--tw-contrast, )var(--tw-grayscale, )var(--tw-hue-rotate, )var(--tw-invert, )var(--tw-saturate, )var(--tw-sepia, )var(--tw-drop-shadow, );filter:var(--tw-blur, )var(--tw-brightness, )var(--tw-contrast, )var(--tw-grayscale, )var(--tw-hue-rotate, )var(--tw-invert, )var(--tw-saturate, )var(--tw-sepia, )var(--tw-drop-shadow, )}.backdrop-blur-lg{--tw-backdrop-blur:blur(var(--blur-lg));-webkit-backdrop-filter:var(--tw-backdrop-blur, )var(--tw-backdrop-brightness, )var(--tw-backdrop-contrast, )var(--tw-backdrop-grayscale, )var(--tw-backdrop-hue-rotate, )var(--tw-backdrop-invert, )var(--tw-backdrop-opacity, )var(--tw-backdrop-saturate, )var(--tw-backdrop-sepia, );backdrop-filter:var(--tw-backdrop-blur, )var(--tw-backdrop-brightness, )var(--tw-backdrop-contrast, )var(--tw-backdrop-grayscale, )var(--tw-backdrop-hue-rotate, )var(--tw-backdrop-invert, )var(--tw-backdrop-opacity, )var(--tw-backdrop-saturate, )var(--tw-backdrop-sepia, )}.backdrop-blur-md{--tw-backdrop-blur:blur(var(--blur-md));-webkit-backdrop-filter:var(--tw-backdrop-blur, )var(--tw-backdrop-brightness, )var(--tw-backdrop-contrast, )var(--tw-backdrop-grayscale, )var(--tw-backdrop-hue-rotate, )var(--tw-backdrop-invert, )var(--tw-backdrop-opacity, )var(--tw-backdrop-saturate, )var(--tw-backdrop-sepia, );backdrop-filter:var(--tw-backdrop-blur, )var(--tw-backdrop-brightness, )var(--tw-backdrop-contrast, )var(--tw-backdrop-grayscale, )var(--tw-backdrop-hue-rotate, )var(--tw-backdrop-invert, )var(--tw-backdrop-opacity, )var(--tw-backdrop-saturate, )var(--tw-backdrop-sepia, )}.backdrop-filter{-webkit-backdrop-filter:var(--tw-backdrop-blur, )var(--tw-backdrop-brightness, )var(--tw-backdrop-contrast, )var(--tw-backdrop-grayscale, )var(--tw-backdrop-hue-rotate, )var(--tw-backdrop-invert, )var(--tw-backdrop-opacity, )var(--tw-backdrop-saturate, )var(--tw-backdrop-sepia, );backdrop-filter:var(--tw-backdrop-blur, )var(--tw-backdrop-brightness, )var(--tw-backdrop-contrast, )var(--tw-backdrop-grayscale, )var(--tw-backdrop-hue-rotate, )var(--tw-backdrop-invert, )var(--tw-backdrop-opacity, )var(--tw-backdrop-saturate, )var(--tw-backdrop-sepia, )}.transition{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,opacity,box-shadow,transform,translate,scale,rotate,filter,-webkit-backdrop-filter,backdrop-filter,display,content-visibility,overlay,pointer-events;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-\\[left\\]{transition-property:left;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-\\[stroke-dashoffset\\]{transition-property:stroke-dashoffset;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-all{transition-property:all;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-colors{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-opacity{transition-property:opacity;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-transform{transition-property:transform,translate,scale,rotate;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.delay-1000{transition-delay:1s}.duration-150{--tw-duration:.15s;transition-duration:.15s}.duration-180{--tw-duration:.18s;transition-duration:.18s}.duration-200{--tw-duration:.2s;transition-duration:.2s}.duration-300{--tw-duration:.3s;transition-duration:.3s}.duration-500{--tw-duration:.5s;transition-duration:.5s}.duration-1000{--tw-duration:1s;transition-duration:1s}.duration-\\[260ms\\]{--tw-duration:.26s;transition-duration:.26s}.ease-in{--tw-ease:var(--ease-in);transition-timing-function:var(--ease-in)}.ease-in-out{--tw-ease:var(--ease-in-out);transition-timing-function:var(--ease-in-out)}.ease-out{--tw-ease:var(--ease-out);transition-timing-function:var(--ease-out)}.will-change-transform{will-change:transform}.outline-none{--tw-outline-style:none;outline-style:none}.select-none{-webkit-user-select:none;user-select:none}.\\[-ms-overflow-style\\:none\\]{-ms-overflow-style:none}.\\[scrollbar-width\\:none\\]{scrollbar-width:none}.backface-hidden{-webkit-backface-visibility:hidden;backface-visibility:hidden}.text-shadow-lg{text-shadow:0px 1px 2px var(--tw-text-shadow-color,#0000001a),0px 3px 2px var(--tw-text-shadow-color,#0000001a),0px 4px 8px var(--tw-text-shadow-color,#0000001a)}.text-shadow-sm{text-shadow:0px 1px 0px var(--tw-text-shadow-color,#00000013),0px 1px 1px var(--tw-text-shadow-color,#00000013),0px 2px 2px var(--tw-text-shadow-color,#00000013)}.group-focus-within\\/tooltip\\:opacity-100:is(:where(.group\\/tooltip):focus-within *){opacity:1}@media (hover:hover){.group-hover\\:\\!block:is(:where(.group):hover *){display:block!important}.group-hover\\:h-\\[28px\\]:is(:where(.group):hover *){height:28px}.group-hover\\:translate-x-0:is(:where(.group):hover *){--tw-translate-x:calc(var(--spacing)*0);translate:var(--tw-translate-x)var(--tw-translate-y)}.group-hover\\:translate-x-0\\.5:is(:where(.group):hover *){--tw-translate-x:calc(var(--spacing)*.5);translate:var(--tw-translate-x)var(--tw-translate-y)}.group-hover\\:bg-\\[\\#454444\\]:is(:where(.group):hover *){background-color:#454444}.group-hover\\:opacity-100:is(:where(.group):hover *){opacity:1}.group-hover\\:brightness-80:is(:where(.group):hover *){--tw-brightness:brightness(80%);-webkit-filter:var(--tw-blur, )var(--tw-brightness, )var(--tw-contrast, )var(--tw-grayscale, )var(--tw-hue-rotate, )var(--tw-invert, )var(--tw-saturate, )var(--tw-sepia, )var(--tw-drop-shadow, );filter:var(--tw-blur, )var(--tw-brightness, )var(--tw-contrast, )var(--tw-grayscale, )var(--tw-hue-rotate, )var(--tw-invert, )var(--tw-saturate, )var(--tw-sepia, )var(--tw-drop-shadow, )}.group-hover\\/tooltip\\:opacity-100:is(:where(.group\\/tooltip):hover *){opacity:1}}.group-active\\:translate-y-1\\!:is(:where(.group):active *){--tw-translate-y:calc(var(--spacing)*1)!important;translate:var(--tw-translate-x)var(--tw-translate-y)!important}@media (hover:hover){.hover\\:-translate-y-0\\.5:hover{--tw-translate-y:calc(var(--spacing)*-.5);translate:var(--tw-translate-x)var(--tw-translate-y)}.hover\\:scale-105:hover{--tw-scale-x:105%;--tw-scale-y:105%;--tw-scale-z:105%;scale:var(--tw-scale-x)var(--tw-scale-y)}.hover\\:border-\\[\\#5a5a5a\\]:hover{border-color:#5a5a5a}.hover\\:border-white\\/12:hover{border-color:#ffffff1f}@supports (color:color-mix(in lab,red,red)){.hover\\:border-white\\/12:hover{border-color:color-mix(in oklab,var(--color-white)12%,transparent)}}.hover\\:bg-\\[\\#3AFF68\\]\\/15:hover{background-color:#3aff6826}.hover\\:bg-\\[\\#222222\\]\\/60:hover{background-color:#2229}.hover\\:bg-\\[\\#303030\\]:hover{background-color:#303030}.hover\\:bg-\\[\\#343434\\]:hover{background-color:#343434}.hover\\:bg-\\[\\#474747\\]\\!:hover{background-color:#474747!important}.hover\\:bg-\\[var\\(--bubble-hover\\)\\]:hover{background-color:var(--bubble-hover)}.hover\\:bg-white\\/6:hover{background-color:#ffffff0f}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-white\\/6:hover{background-color:color-mix(in oklab,var(--color-white)6%,transparent)}}.hover\\:bg-white\\/8:hover{background-color:#ffffff14}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-white\\/8:hover{background-color:color-mix(in oklab,var(--color-white)8%,transparent)}}.hover\\:bg-white\\/10:hover{background-color:#ffffff1a}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-white\\/10:hover{background-color:color-mix(in oklab,var(--color-white)10%,transparent)}}.hover\\:bg-white\\/15:hover{background-color:#ffffff26}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-white\\/15:hover{background-color:color-mix(in oklab,var(--color-white)15%,transparent)}}.hover\\:bg-white\\/20:hover{background-color:#fff3}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-white\\/20:hover{background-color:color-mix(in oklab,var(--color-white)20%,transparent)}}.hover\\:bg-white\\/24:hover{background-color:#ffffff3d}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-white\\/24:hover{background-color:color-mix(in oklab,var(--color-white)24%,transparent)}}.hover\\:bg-white\\/\\[0\\.08\\]:hover{background-color:#ffffff14}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-white\\/\\[0\\.08\\]:hover{background-color:color-mix(in oklab,var(--color-white)8%,transparent)}}.hover\\:text-\\[\\#53afdf\\]:hover{color:#53afdf}.hover\\:text-white:hover{color:var(--color-white)}.hover\\:text-white\\!:hover{color:var(--color-white)!important}.hover\\:brightness-80:hover{--tw-brightness:brightness(80%);-webkit-filter:var(--tw-blur, )var(--tw-brightness, )var(--tw-contrast, )var(--tw-grayscale, )var(--tw-hue-rotate, )var(--tw-invert, )var(--tw-saturate, )var(--tw-sepia, )var(--tw-drop-shadow, );filter:var(--tw-blur, )var(--tw-brightness, )var(--tw-contrast, )var(--tw-grayscale, )var(--tw-hue-rotate, )var(--tw-invert, )var(--tw-saturate, )var(--tw-sepia, )var(--tw-drop-shadow, )}}.focus\\:border-transparent:focus{border-color:#0000}.focus\\:border-white\\/15:focus{border-color:#ffffff26}@supports (color:color-mix(in lab,red,red)){.focus\\:border-white\\/15:focus{border-color:color-mix(in oklab,var(--color-white)15%,transparent)}}.focus\\:outline-none:focus{--tw-outline-style:none;outline-style:none}.active\\:border-transparent:active{border-color:#0000}.active\\:outline-none:active{--tw-outline-style:none;outline-style:none}.disabled\\:cursor-not-allowed:disabled{cursor:not-allowed}.disabled\\:opacity-50:disabled{opacity:.5}.disabled\\:opacity-60:disabled{opacity:.6}@media not all and (min-width:1600px){.max-\\[1600px\\]\\:px-4{padding-inline:calc(var(--spacing)*4)}}@media (min-width:64rem){.lg\\:block\\!{display:block!important}.lg\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}}@media (min-width:80rem){.xl\\:block\\!{display:block!important}.xl\\:flex\\!{display:flex!important}.xl\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.xl\\:text-lg{font-size:var(--text-lg);line-height:var(--tw-leading,var(--text-lg--line-height))}}.\\[\\&\\:\\:-webkit-scrollbar\\]\\:hidden::-webkit-scrollbar{display:none}}html,body,#app{width:100%;height:100%;margin:0;overflow:hidden}@keyframes marquee-loop{0%{transform:translate(0)}to{transform:translate(-100%)}}@property --tw-translate-x{syntax:\"*\";inherits:false;initial-value:0}@property --tw-translate-y{syntax:\"*\";inherits:false;initial-value:0}@property --tw-translate-z{syntax:\"*\";inherits:false;initial-value:0}@property --tw-scale-x{syntax:\"*\";inherits:false;initial-value:1}@property --tw-scale-y{syntax:\"*\";inherits:false;initial-value:1}@property --tw-scale-z{syntax:\"*\";inherits:false;initial-value:1}@property --tw-rotate-x{syntax:\"*\";inherits:false}@property --tw-rotate-y{syntax:\"*\";inherits:false}@property --tw-rotate-z{syntax:\"*\";inherits:false}@property --tw-skew-x{syntax:\"*\";inherits:false}@property --tw-skew-y{syntax:\"*\";inherits:false}@property --tw-space-y-reverse{syntax:\"*\";inherits:false;initial-value:0}@property --tw-divide-y-reverse{syntax:\"*\";inherits:false;initial-value:0}@property --tw-border-style{syntax:\"*\";inherits:false;initial-value:solid}@property --tw-gradient-position{syntax:\"*\";inherits:false}@property --tw-gradient-from{syntax:\"<color>\";inherits:false;initial-value:#0000}@property --tw-gradient-via{syntax:\"<color>\";inherits:false;initial-value:#0000}@property --tw-gradient-to{syntax:\"<color>\";inherits:false;initial-value:#0000}@property --tw-gradient-stops{syntax:\"*\";inherits:false}@property --tw-gradient-via-stops{syntax:\"*\";inherits:false}@property --tw-gradient-from-position{syntax:\"<length-percentage>\";inherits:false;initial-value:0%}@property --tw-gradient-via-position{syntax:\"<length-percentage>\";inherits:false;initial-value:50%}@property --tw-gradient-to-position{syntax:\"<length-percentage>\";inherits:false;initial-value:100%}@property --tw-leading{syntax:\"*\";inherits:false}@property --tw-font-weight{syntax:\"*\";inherits:false}@property --tw-tracking{syntax:\"*\";inherits:false}@property --tw-ordinal{syntax:\"*\";inherits:false}@property --tw-slashed-zero{syntax:\"*\";inherits:false}@property --tw-numeric-figure{syntax:\"*\";inherits:false}@property --tw-numeric-spacing{syntax:\"*\";inherits:false}@property --tw-numeric-fraction{syntax:\"*\";inherits:false}@property --tw-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-shadow-color{syntax:\"*\";inherits:false}@property --tw-shadow-alpha{syntax:\"<percentage>\";inherits:false;initial-value:100%}@property --tw-inset-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-inset-shadow-color{syntax:\"*\";inherits:false}@property --tw-inset-shadow-alpha{syntax:\"<percentage>\";inherits:false;initial-value:100%}@property --tw-ring-color{syntax:\"*\";inherits:false}@property --tw-ring-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-inset-ring-color{syntax:\"*\";inherits:false}@property --tw-inset-ring-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-ring-inset{syntax:\"*\";inherits:false}@property --tw-ring-offset-width{syntax:\"<length>\";inherits:false;initial-value:0}@property --tw-ring-offset-color{syntax:\"*\";inherits:false;initial-value:#fff}@property --tw-ring-offset-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-outline-style{syntax:\"*\";inherits:false;initial-value:solid}@property --tw-blur{syntax:\"*\";inherits:false}@property --tw-brightness{syntax:\"*\";inherits:false}@property --tw-contrast{syntax:\"*\";inherits:false}@property --tw-grayscale{syntax:\"*\";inherits:false}@property --tw-hue-rotate{syntax:\"*\";inherits:false}@property --tw-invert{syntax:\"*\";inherits:false}@property --tw-opacity{syntax:\"*\";inherits:false}@property --tw-saturate{syntax:\"*\";inherits:false}@property --tw-sepia{syntax:\"*\";inherits:false}@property --tw-drop-shadow{syntax:\"*\";inherits:false}@property --tw-drop-shadow-color{syntax:\"*\";inherits:false}@property --tw-drop-shadow-alpha{syntax:\"<percentage>\";inherits:false;initial-value:100%}@property --tw-drop-shadow-size{syntax:\"*\";inherits:false}@property --tw-backdrop-blur{syntax:\"*\";inherits:false}@property --tw-backdrop-brightness{syntax:\"*\";inherits:false}@property --tw-backdrop-contrast{syntax:\"*\";inherits:false}@property --tw-backdrop-grayscale{syntax:\"*\";inherits:false}@property --tw-backdrop-hue-rotate{syntax:\"*\";inherits:false}@property --tw-backdrop-invert{syntax:\"*\";inherits:false}@property --tw-backdrop-opacity{syntax:\"*\";inherits:false}@property --tw-backdrop-saturate{syntax:\"*\";inherits:false}@property --tw-backdrop-sepia{syntax:\"*\";inherits:false}@property --tw-duration{syntax:\"*\";inherits:false}@property --tw-ease{syntax:\"*\";inherits:false}@property --tw-text-shadow-color{syntax:\"*\";inherits:false}@property --tw-text-shadow-alpha{syntax:\"<percentage>\";inherits:false;initial-value:100%}@keyframes spin{to{transform:rotate(360deg)}}@keyframes pulse{50%{opacity:.5}}\n";document.head.appendChild(s);}})();// @__NO_SIDE_EFFECTS__
function ti(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(",")) t[n] = 1;
  return (n) => n in t;
}
const le = {}, Ot = [], et = () => {
}, rs = () => !1, _n = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), ni = (e) => e.startsWith("onUpdate:"), Ee = Object.assign, ii = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, dr = Object.prototype.hasOwnProperty, ie = (e, t) => dr.call(e, t), V = Array.isArray, Ft = (e) => xn(e) === "[object Map]", os = (e) => xn(e) === "[object Set]", q = (e) => typeof e == "function", me = (e) => typeof e == "string", yt = (e) => typeof e == "symbol", ue = (e) => e !== null && typeof e == "object", ls = (e) => (ue(e) || q(e)) && q(e.then) && q(e.catch), as = Object.prototype.toString, xn = (e) => as.call(e), hr = (e) => xn(e).slice(8, -1), us = (e) => xn(e) === "[object Object]", yn = (e) => me(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, jt = /* @__PURE__ */ ti(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), bn = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return ((n) => t[n] || (t[n] = e(n)));
}, pr = /-\w/g, vt = bn(
  (e) => e.replace(pr, (t) => t.slice(1).toUpperCase())
), gr = /\B([A-Z])/g, Et = bn(
  (e) => e.replace(gr, "-$1").toLowerCase()
), fs = bn((e) => e.charAt(0).toUpperCase() + e.slice(1)), Rn = bn(
  (e) => e ? `on${fs(e)}` : ""
), gt = (e, t) => !Object.is(e, t), Pn = (e, ...t) => {
  for (let n = 0; n < e.length; n++)
    e[n](...t);
}, cs = (e, t, n, i = !1) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    writable: i,
    value: n
  });
}, mr = (e) => {
  const t = parseFloat(e);
  return isNaN(t) ? e : t;
};
let wi;
const wn = () => wi || (wi = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function Te(e) {
  if (V(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const i = e[n], s = me(i) ? yr(i) : Te(i);
      if (s)
        for (const r in s)
          t[r] = s[r];
    }
    return t;
  } else if (me(e) || ue(e))
    return e;
}
const vr = /;(?![^(]*\))/g, _r = /:([^]+)/, xr = /\/\*[^]*?\*\//g;
function yr(e) {
  const t = {};
  return e.replace(xr, "").split(vr).forEach((n) => {
    if (n) {
      const i = n.split(_r);
      i.length > 1 && (t[i[0].trim()] = i[1].trim());
    }
  }), t;
}
function ot(e) {
  let t = "";
  if (me(e))
    t = e;
  else if (V(e))
    for (let n = 0; n < e.length; n++) {
      const i = ot(e[n]);
      i && (t += i + " ");
    }
  else if (ue(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
function br(e) {
  if (!e) return null;
  let { class: t, style: n } = e;
  return t && !me(t) && (e.class = ot(t)), n && (e.style = Te(n)), e;
}
const wr = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", Sr = /* @__PURE__ */ ti(wr);
function ds(e) {
  return !!e || e === "";
}
const hs = (e) => !!(e && e.__v_isRef === !0), $e = (e) => me(e) ? e : e == null ? "" : V(e) || ue(e) && (e.toString === as || !q(e.toString)) ? hs(e) ? $e(e.value) : JSON.stringify(e, ps, 2) : String(e), ps = (e, t) => hs(t) ? ps(e, t.value) : Ft(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce(
    (n, [i, s], r) => (n[In(i, r) + " =>"] = s, n),
    {}
  )
} : os(t) ? {
  [`Set(${t.size})`]: [...t.values()].map((n) => In(n))
} : yt(t) ? In(t) : ue(t) && !V(t) && !us(t) ? String(t) : t, In = (e, t = "") => {
  var n;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    yt(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e
  );
};
let Ie;
class Mr {
  constructor(t = !1) {
    this.detached = t, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this.parent = Ie, !t && Ie && (this.index = (Ie.scopes || (Ie.scopes = [])).push(
      this
    ) - 1);
  }
  get active() {
    return this._active;
  }
  pause() {
    if (this._active) {
      this._isPaused = !0;
      let t, n;
      if (this.scopes)
        for (t = 0, n = this.scopes.length; t < n; t++)
          this.scopes[t].pause();
      for (t = 0, n = this.effects.length; t < n; t++)
        this.effects[t].pause();
    }
  }
  /**
   * Resumes the effect scope, including all child scopes and effects.
   */
  resume() {
    if (this._active && this._isPaused) {
      this._isPaused = !1;
      let t, n;
      if (this.scopes)
        for (t = 0, n = this.scopes.length; t < n; t++)
          this.scopes[t].resume();
      for (t = 0, n = this.effects.length; t < n; t++)
        this.effects[t].resume();
    }
  }
  run(t) {
    if (this._active) {
      const n = Ie;
      try {
        return Ie = this, t();
      } finally {
        Ie = n;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && (this.prevScope = Ie, Ie = this);
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    this._on > 0 && --this._on === 0 && (Ie = this.prevScope, this.prevScope = void 0);
  }
  stop(t) {
    if (this._active) {
      this._active = !1;
      let n, i;
      for (n = 0, i = this.effects.length; n < i; n++)
        this.effects[n].stop();
      for (this.effects.length = 0, n = 0, i = this.cleanups.length; n < i; n++)
        this.cleanups[n]();
      if (this.cleanups.length = 0, this.scopes) {
        for (n = 0, i = this.scopes.length; n < i; n++)
          this.scopes[n].stop(!0);
        this.scopes.length = 0;
      }
      if (!this.detached && this.parent && !t) {
        const s = this.parent.scopes.pop();
        s && s !== this && (this.parent.scopes[this.index] = s, s.index = this.index);
      }
      this.parent = void 0;
    }
  }
}
function Tr() {
  return Ie;
}
let re;
const $n = /* @__PURE__ */ new WeakSet();
class gs {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, Ie && Ie.active && Ie.effects.push(this);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, $n.has(this) && ($n.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || vs(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, Si(this), _s(this);
    const t = re, n = Be;
    re = this, Be = !0;
    try {
      return this.fn();
    } finally {
      xs(this), re = t, Be = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        oi(t);
      this.deps = this.depsTail = void 0, Si(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? $n.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    Un(this) && this.run();
  }
  get dirty() {
    return Un(this);
  }
}
let ms = 0, Bt, Vt;
function vs(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = Vt, Vt = e;
    return;
  }
  e.next = Bt, Bt = e;
}
function si() {
  ms++;
}
function ri() {
  if (--ms > 0)
    return;
  if (Vt) {
    let t = Vt;
    for (Vt = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; Bt; ) {
    let t = Bt;
    for (Bt = void 0; t; ) {
      const n = t.next;
      if (t.next = void 0, t.flags &= -9, t.flags & 1)
        try {
          t.trigger();
        } catch (i) {
          e || (e = i);
        }
      t = n;
    }
  }
  if (e) throw e;
}
function _s(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function xs(e) {
  let t, n = e.depsTail, i = n;
  for (; i; ) {
    const s = i.prevDep;
    i.version === -1 ? (i === n && (n = s), oi(i), Er(i)) : t = i, i.dep.activeLink = i.prevActiveLink, i.prevActiveLink = void 0, i = s;
  }
  e.deps = t, e.depsTail = n;
}
function Un(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (ys(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function ys(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Jt) || (e.globalVersion = Jt, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Un(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = re, i = Be;
  re = e, Be = !0;
  try {
    _s(e);
    const s = e.fn(e._value);
    (t.version === 0 || gt(s, e._value)) && (e.flags |= 128, e._value = s, t.version++);
  } catch (s) {
    throw t.version++, s;
  } finally {
    re = n, Be = i, xs(e), e.flags &= -3;
  }
}
function oi(e, t = !1) {
  const { dep: n, prevSub: i, nextSub: s } = e;
  if (i && (i.nextSub = s, e.prevSub = void 0), s && (s.prevSub = i, e.nextSub = void 0), n.subs === e && (n.subs = i, !i && n.computed)) {
    n.computed.flags &= -5;
    for (let r = n.computed.deps; r; r = r.nextDep)
      oi(r, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function Er(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
let Be = !0;
const bs = [];
function lt() {
  bs.push(Be), Be = !1;
}
function at() {
  const e = bs.pop();
  Be = e === void 0 ? !0 : e;
}
function Si(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = re;
    re = void 0;
    try {
      t();
    } finally {
      re = n;
    }
  }
}
let Jt = 0;
class Cr {
  constructor(t, n) {
    this.sub = t, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class li {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
  }
  track(t) {
    if (!re || !Be || re === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== re)
      n = this.activeLink = new Cr(re, this), re.deps ? (n.prevDep = re.depsTail, re.depsTail.nextDep = n, re.depsTail = n) : re.deps = re.depsTail = n, ws(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const i = n.nextDep;
      i.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = i), n.prevDep = re.depsTail, n.nextDep = void 0, re.depsTail.nextDep = n, re.depsTail = n, re.deps === n && (re.deps = i);
    }
    return n;
  }
  trigger(t) {
    this.version++, Jt++, this.notify(t);
  }
  notify(t) {
    si();
    try {
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      ri();
    }
  }
}
function ws(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let i = t.deps; i; i = i.nextDep)
        ws(i);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
  }
}
const fn = /* @__PURE__ */ new WeakMap(), Mt = Symbol(
  ""
), qn = Symbol(
  ""
), Yt = Symbol(
  ""
);
function Me(e, t, n) {
  if (Be && re) {
    let i = fn.get(e);
    i || fn.set(e, i = /* @__PURE__ */ new Map());
    let s = i.get(n);
    s || (i.set(n, s = new li()), s.map = i, s.key = n), s.track();
  }
}
function rt(e, t, n, i, s, r) {
  const o = fn.get(e);
  if (!o) {
    Jt++;
    return;
  }
  const l = (u) => {
    u && u.trigger();
  };
  if (si(), t === "clear")
    o.forEach(l);
  else {
    const u = V(e), h = u && yn(n);
    if (u && n === "length") {
      const c = Number(i);
      o.forEach((p, y) => {
        (y === "length" || y === Yt || !yt(y) && y >= c) && l(p);
      });
    } else
      switch ((n !== void 0 || o.has(void 0)) && l(o.get(n)), h && l(o.get(Yt)), t) {
        case "add":
          u ? h && l(o.get("length")) : (l(o.get(Mt)), Ft(e) && l(o.get(qn)));
          break;
        case "delete":
          u || (l(o.get(Mt)), Ft(e) && l(o.get(qn)));
          break;
        case "set":
          Ft(e) && l(o.get(Mt));
          break;
      }
  }
  ri();
}
function Ar(e, t) {
  const n = fn.get(e);
  return n && n.get(t);
}
function Ct(e) {
  const t = te(e);
  return t === e ? t : (Me(t, "iterate", Yt), He(e) ? t : t.map(Ve));
}
function Sn(e) {
  return Me(e = te(e), "iterate", Yt), e;
}
function ct(e, t) {
  return ut(e) ? Tt(e) ? Pt(Ve(t)) : Pt(t) : Ve(t);
}
const Or = {
  __proto__: null,
  [Symbol.iterator]() {
    return Nn(this, Symbol.iterator, (e) => ct(this, e));
  },
  concat(...e) {
    return Ct(this).concat(
      ...e.map((t) => V(t) ? Ct(t) : t)
    );
  },
  entries() {
    return Nn(this, "entries", (e) => (e[1] = ct(this, e[1]), e));
  },
  every(e, t) {
    return it(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return it(
      this,
      "filter",
      e,
      t,
      (n) => n.map((i) => ct(this, i)),
      arguments
    );
  },
  find(e, t) {
    return it(
      this,
      "find",
      e,
      t,
      (n) => ct(this, n),
      arguments
    );
  },
  findIndex(e, t) {
    return it(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return it(
      this,
      "findLast",
      e,
      t,
      (n) => ct(this, n),
      arguments
    );
  },
  findLastIndex(e, t) {
    return it(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return it(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return Ln(this, "includes", e);
  },
  indexOf(...e) {
    return Ln(this, "indexOf", e);
  },
  join(e) {
    return Ct(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return Ln(this, "lastIndexOf", e);
  },
  map(e, t) {
    return it(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return Nt(this, "pop");
  },
  push(...e) {
    return Nt(this, "push", e);
  },
  reduce(e, ...t) {
    return Mi(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return Mi(this, "reduceRight", e, t);
  },
  shift() {
    return Nt(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return it(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return Nt(this, "splice", e);
  },
  toReversed() {
    return Ct(this).toReversed();
  },
  toSorted(e) {
    return Ct(this).toSorted(e);
  },
  toSpliced(...e) {
    return Ct(this).toSpliced(...e);
  },
  unshift(...e) {
    return Nt(this, "unshift", e);
  },
  values() {
    return Nn(this, "values", (e) => ct(this, e));
  }
};
function Nn(e, t, n) {
  const i = Sn(e), s = i[t]();
  return i !== e && !He(e) && (s._next = s.next, s.next = () => {
    const r = s._next();
    return r.done || (r.value = n(r.value)), r;
  }), s;
}
const Fr = Array.prototype;
function it(e, t, n, i, s, r) {
  const o = Sn(e), l = o !== e && !He(e), u = o[t];
  if (u !== Fr[t]) {
    const p = u.apply(e, r);
    return l ? Ve(p) : p;
  }
  let h = n;
  o !== e && (l ? h = function(p, y) {
    return n.call(this, ct(e, p), y, e);
  } : n.length > 2 && (h = function(p, y) {
    return n.call(this, p, y, e);
  }));
  const c = u.call(o, h, i);
  return l && s ? s(c) : c;
}
function Mi(e, t, n, i) {
  const s = Sn(e);
  let r = n;
  return s !== e && (He(e) ? n.length > 3 && (r = function(o, l, u) {
    return n.call(this, o, l, u, e);
  }) : r = function(o, l, u) {
    return n.call(this, o, ct(e, l), u, e);
  }), s[t](r, ...i);
}
function Ln(e, t, n) {
  const i = te(e);
  Me(i, "iterate", Yt);
  const s = i[t](...n);
  return (s === -1 || s === !1) && Mn(n[0]) ? (n[0] = te(n[0]), i[t](...n)) : s;
}
function Nt(e, t, n = []) {
  lt(), si();
  const i = te(e)[t].apply(e, n);
  return ri(), at(), i;
}
const Dr = /* @__PURE__ */ ti("__proto__,__v_isRef,__isVue"), Ss = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(yt)
);
function Rr(e) {
  yt(e) || (e = String(e));
  const t = te(this);
  return Me(t, "has", e), t.hasOwnProperty(e);
}
class Ms {
  constructor(t = !1, n = !1) {
    this._isReadonly = t, this._isShallow = n;
  }
  get(t, n, i) {
    if (n === "__v_skip") return t.__v_skip;
    const s = this._isReadonly, r = this._isShallow;
    if (n === "__v_isReactive")
      return !s;
    if (n === "__v_isReadonly")
      return s;
    if (n === "__v_isShallow")
      return r;
    if (n === "__v_raw")
      return i === (s ? r ? Br : As : r ? Cs : Es).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(i) ? t : void 0;
    const o = V(t);
    if (!s) {
      let u;
      if (o && (u = Or[n]))
        return u;
      if (n === "hasOwnProperty")
        return Rr;
    }
    const l = Reflect.get(
      t,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      be(t) ? t : i
    );
    if ((yt(n) ? Ss.has(n) : Dr(n)) || (s || Me(t, "get", n), r))
      return l;
    if (be(l)) {
      const u = o && yn(n) ? l : l.value;
      return s && ue(u) ? Gn(u) : u;
    }
    return ue(l) ? s ? Gn(l) : ui(l) : l;
  }
}
class Ts extends Ms {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, i, s) {
    let r = t[n];
    const o = V(t) && yn(n);
    if (!this._isShallow) {
      const h = ut(r);
      if (!He(i) && !ut(i) && (r = te(r), i = te(i)), !o && be(r) && !be(i))
        return h || (r.value = i), !0;
    }
    const l = o ? Number(n) < t.length : ie(t, n), u = Reflect.set(
      t,
      n,
      i,
      be(t) ? t : s
    );
    return t === te(s) && (l ? gt(i, r) && rt(t, "set", n, i) : rt(t, "add", n, i)), u;
  }
  deleteProperty(t, n) {
    const i = ie(t, n);
    t[n];
    const s = Reflect.deleteProperty(t, n);
    return s && i && rt(t, "delete", n, void 0), s;
  }
  has(t, n) {
    const i = Reflect.has(t, n);
    return (!yt(n) || !Ss.has(n)) && Me(t, "has", n), i;
  }
  ownKeys(t) {
    return Me(
      t,
      "iterate",
      V(t) ? "length" : Mt
    ), Reflect.ownKeys(t);
  }
}
class Pr extends Ms {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, n) {
    return !0;
  }
  deleteProperty(t, n) {
    return !0;
  }
}
const Ir = /* @__PURE__ */ new Ts(), $r = /* @__PURE__ */ new Pr(), Nr = /* @__PURE__ */ new Ts(!0);
const Kn = (e) => e, rn = (e) => Reflect.getPrototypeOf(e);
function Lr(e, t, n) {
  return function(...i) {
    const s = this.__v_raw, r = te(s), o = Ft(r), l = e === "entries" || e === Symbol.iterator && o, u = e === "keys" && o, h = s[e](...i), c = n ? Kn : t ? Pt : Ve;
    return !t && Me(
      r,
      "iterate",
      u ? qn : Mt
    ), {
      // iterator protocol
      next() {
        const { value: p, done: y } = h.next();
        return y ? { value: p, done: y } : {
          value: l ? [c(p[0]), c(p[1])] : c(p),
          done: y
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function on(e) {
  return function(...t) {
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function kr(e, t) {
  const n = {
    get(s) {
      const r = this.__v_raw, o = te(r), l = te(s);
      e || (gt(s, l) && Me(o, "get", s), Me(o, "get", l));
      const { has: u } = rn(o), h = t ? Kn : e ? Pt : Ve;
      if (u.call(o, s))
        return h(r.get(s));
      if (u.call(o, l))
        return h(r.get(l));
      r !== o && r.get(s);
    },
    get size() {
      const s = this.__v_raw;
      return !e && Me(te(s), "iterate", Mt), s.size;
    },
    has(s) {
      const r = this.__v_raw, o = te(r), l = te(s);
      return e || (gt(s, l) && Me(o, "has", s), Me(o, "has", l)), s === l ? r.has(s) : r.has(s) || r.has(l);
    },
    forEach(s, r) {
      const o = this, l = o.__v_raw, u = te(l), h = t ? Kn : e ? Pt : Ve;
      return !e && Me(u, "iterate", Mt), l.forEach((c, p) => s.call(r, h(c), h(p), o));
    }
  };
  return Ee(
    n,
    e ? {
      add: on("add"),
      set: on("set"),
      delete: on("delete"),
      clear: on("clear")
    } : {
      add(s) {
        !t && !He(s) && !ut(s) && (s = te(s));
        const r = te(this);
        return rn(r).has.call(r, s) || (r.add(s), rt(r, "add", s, s)), this;
      },
      set(s, r) {
        !t && !He(r) && !ut(r) && (r = te(r));
        const o = te(this), { has: l, get: u } = rn(o);
        let h = l.call(o, s);
        h || (s = te(s), h = l.call(o, s));
        const c = u.call(o, s);
        return o.set(s, r), h ? gt(r, c) && rt(o, "set", s, r) : rt(o, "add", s, r), this;
      },
      delete(s) {
        const r = te(this), { has: o, get: l } = rn(r);
        let u = o.call(r, s);
        u || (s = te(s), u = o.call(r, s)), l && l.call(r, s);
        const h = r.delete(s);
        return u && rt(r, "delete", s, void 0), h;
      },
      clear() {
        const s = te(this), r = s.size !== 0, o = s.clear();
        return r && rt(
          s,
          "clear",
          void 0,
          void 0
        ), o;
      }
    }
  ), [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ].forEach((s) => {
    n[s] = Lr(s, e, t);
  }), n;
}
function ai(e, t) {
  const n = kr(e, t);
  return (i, s, r) => s === "__v_isReactive" ? !e : s === "__v_isReadonly" ? e : s === "__v_raw" ? i : Reflect.get(
    ie(n, s) && s in i ? n : i,
    s,
    r
  );
}
const Hr = {
  get: /* @__PURE__ */ ai(!1, !1)
}, Wr = {
  get: /* @__PURE__ */ ai(!1, !0)
}, jr = {
  get: /* @__PURE__ */ ai(!0, !1)
};
const Es = /* @__PURE__ */ new WeakMap(), Cs = /* @__PURE__ */ new WeakMap(), As = /* @__PURE__ */ new WeakMap(), Br = /* @__PURE__ */ new WeakMap();
function Vr(e) {
  switch (e) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function Ur(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : Vr(hr(e));
}
function ui(e) {
  return ut(e) ? e : fi(
    e,
    !1,
    Ir,
    Hr,
    Es
  );
}
function qr(e) {
  return fi(
    e,
    !1,
    Nr,
    Wr,
    Cs
  );
}
function Gn(e) {
  return fi(
    e,
    !0,
    $r,
    jr,
    As
  );
}
function fi(e, t, n, i, s) {
  if (!ue(e) || e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const r = Ur(e);
  if (r === 0)
    return e;
  const o = s.get(e);
  if (o)
    return o;
  const l = new Proxy(
    e,
    r === 2 ? i : n
  );
  return s.set(e, l), l;
}
function Tt(e) {
  return ut(e) ? Tt(e.__v_raw) : !!(e && e.__v_isReactive);
}
function ut(e) {
  return !!(e && e.__v_isReadonly);
}
function He(e) {
  return !!(e && e.__v_isShallow);
}
function Mn(e) {
  return e ? !!e.__v_raw : !1;
}
function te(e) {
  const t = e && e.__v_raw;
  return t ? te(t) : e;
}
function Kr(e) {
  return !ie(e, "__v_skip") && Object.isExtensible(e) && cs(e, "__v_skip", !0), e;
}
const Ve = (e) => ue(e) ? ui(e) : e, Pt = (e) => ue(e) ? Gn(e) : e;
function be(e) {
  return e ? e.__v_isRef === !0 : !1;
}
function J(e) {
  return Gr(e, !1);
}
function Gr(e, t) {
  return be(e) ? e : new zr(e, t);
}
class zr {
  constructor(t, n) {
    this.dep = new li(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? t : te(t), this._value = n ? t : Ve(t), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(t) {
    const n = this._rawValue, i = this.__v_isShallow || He(t) || ut(t);
    t = i ? t : te(t), gt(t, n) && (this._rawValue = t, this._value = i ? t : Ve(t), this.dep.trigger());
  }
}
function _t(e) {
  return be(e) ? e.value : e;
}
const Jr = {
  get: (e, t, n) => t === "__v_raw" ? e : _t(Reflect.get(e, t, n)),
  set: (e, t, n, i) => {
    const s = e[t];
    return be(s) && !be(n) ? (s.value = n, !0) : Reflect.set(e, t, n, i);
  }
};
function Os(e) {
  return Tt(e) ? e : new Proxy(e, Jr);
}
class Yr {
  constructor(t, n, i) {
    this._object = t, this._key = n, this._defaultValue = i, this.__v_isRef = !0, this._value = void 0, this._raw = te(t);
    let s = !0, r = t;
    if (!V(t) || !yn(String(n)))
      do
        s = !Mn(r) || He(r);
      while (s && (r = r.__v_raw));
    this._shallow = s;
  }
  get value() {
    let t = this._object[this._key];
    return this._shallow && (t = _t(t)), this._value = t === void 0 ? this._defaultValue : t;
  }
  set value(t) {
    if (this._shallow && be(this._raw[this._key])) {
      const n = this._object[this._key];
      if (be(n)) {
        n.value = t;
        return;
      }
    }
    this._object[this._key] = t;
  }
  get dep() {
    return Ar(this._raw, this._key);
  }
}
class Xr {
  constructor(t) {
    this._getter = t, this.__v_isRef = !0, this.__v_isReadonly = !0, this._value = void 0;
  }
  get value() {
    return this._value = this._getter();
  }
}
function cn(e, t, n) {
  return be(e) ? e : q(e) ? new Xr(e) : ue(e) && arguments.length > 1 ? Qr(e, t, n) : J(e);
}
function Qr(e, t, n) {
  return new Yr(e, t, n);
}
class Zr {
  constructor(t, n, i) {
    this.fn = t, this.setter = n, this._value = void 0, this.dep = new li(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Jt - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = i;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    re !== this)
      return vs(this, !0), !0;
  }
  get value() {
    const t = this.dep.track();
    return ys(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter && this.setter(t);
  }
}
function eo(e, t, n = !1) {
  let i, s;
  return q(e) ? i = e : (i = e.get, s = e.set), new Zr(i, s, n);
}
const ln = {}, dn = /* @__PURE__ */ new WeakMap();
let St;
function to(e, t = !1, n = St) {
  if (n) {
    let i = dn.get(n);
    i || dn.set(n, i = []), i.push(e);
  }
}
function no(e, t, n = le) {
  const { immediate: i, deep: s, once: r, scheduler: o, augmentJob: l, call: u } = n, h = (F) => s ? F : He(F) || s === !1 || s === 0 ? pt(F, 1) : pt(F);
  let c, p, y, A, P = !1, D = !1;
  if (be(e) ? (p = () => e.value, P = He(e)) : Tt(e) ? (p = () => h(e), P = !0) : V(e) ? (D = !0, P = e.some((F) => Tt(F) || He(F)), p = () => e.map((F) => {
    if (be(F))
      return F.value;
    if (Tt(F))
      return h(F);
    if (q(F))
      return u ? u(F, 2) : F();
  })) : q(e) ? t ? p = u ? () => u(e, 2) : e : p = () => {
    if (y) {
      lt();
      try {
        y();
      } finally {
        at();
      }
    }
    const F = St;
    St = c;
    try {
      return u ? u(e, 3, [A]) : e(A);
    } finally {
      St = F;
    }
  } : p = et, t && s) {
    const F = p, Y = s === !0 ? 1 / 0 : s;
    p = () => pt(F(), Y);
  }
  const Z = Tr(), I = () => {
    c.stop(), Z && Z.active && ii(Z.effects, c);
  };
  if (r && t) {
    const F = t;
    t = (...Y) => {
      F(...Y), I();
    };
  }
  let W = D ? new Array(e.length).fill(ln) : ln;
  const K = (F) => {
    if (!(!(c.flags & 1) || !c.dirty && !F))
      if (t) {
        const Y = c.run();
        if (s || P || (D ? Y.some((ae, de) => gt(ae, W[de])) : gt(Y, W))) {
          y && y();
          const ae = St;
          St = c;
          try {
            const de = [
              Y,
              // pass undefined as the old value when it's changed for the first time
              W === ln ? void 0 : D && W[0] === ln ? [] : W,
              A
            ];
            W = Y, u ? u(t, 3, de) : (
              // @ts-expect-error
              t(...de)
            );
          } finally {
            St = ae;
          }
        }
      } else
        c.run();
  };
  return l && l(K), c = new gs(p), c.scheduler = o ? () => o(K, !1) : K, A = (F) => to(F, !1, c), y = c.onStop = () => {
    const F = dn.get(c);
    if (F) {
      if (u)
        u(F, 4);
      else
        for (const Y of F) Y();
      dn.delete(c);
    }
  }, t ? i ? K(!0) : W = c.run() : o ? o(K.bind(null, !0), !0) : c.run(), I.pause = c.pause.bind(c), I.resume = c.resume.bind(c), I.stop = I, I;
}
function pt(e, t = 1 / 0, n) {
  if (t <= 0 || !ue(e) || e.__v_skip || (n = n || /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t))
    return e;
  if (n.set(e, t), t--, be(e))
    pt(e.value, t, n);
  else if (V(e))
    for (let i = 0; i < e.length; i++)
      pt(e[i], t, n);
  else if (os(e) || Ft(e))
    e.forEach((i) => {
      pt(i, t, n);
    });
  else if (us(e)) {
    for (const i in e)
      pt(e[i], t, n);
    for (const i of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, i) && pt(e[i], t, n);
  }
  return e;
}
function tn(e, t, n, i) {
  try {
    return i ? e(...i) : e();
  } catch (s) {
    Tn(s, t, n);
  }
}
function nt(e, t, n, i) {
  if (q(e)) {
    const s = tn(e, t, n, i);
    return s && ls(s) && s.catch((r) => {
      Tn(r, t, n);
    }), s;
  }
  if (V(e)) {
    const s = [];
    for (let r = 0; r < e.length; r++)
      s.push(nt(e[r], t, n, i));
    return s;
  }
}
function Tn(e, t, n, i = !0) {
  const s = t ? t.vnode : null, { errorHandler: r, throwUnhandledErrorInProduction: o } = t && t.appContext.config || le;
  if (t) {
    let l = t.parent;
    const u = t.proxy, h = `https://vuejs.org/error-reference/#runtime-${n}`;
    for (; l; ) {
      const c = l.ec;
      if (c) {
        for (let p = 0; p < c.length; p++)
          if (c[p](e, u, h) === !1)
            return;
      }
      l = l.parent;
    }
    if (r) {
      lt(), tn(r, null, 10, [
        e,
        u,
        h
      ]), at();
      return;
    }
  }
  io(e, n, s, i, o);
}
function io(e, t, n, i = !0, s = !1) {
  if (s)
    throw e;
  console.error(e);
}
const Fe = [];
let Ye = -1;
const Dt = [];
let dt = null, At = 0;
const Fs = /* @__PURE__ */ Promise.resolve();
let hn = null;
function En(e) {
  const t = hn || Fs;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function so(e) {
  let t = Ye + 1, n = Fe.length;
  for (; t < n; ) {
    const i = t + n >>> 1, s = Fe[i], r = Xt(s);
    r < e || r === e && s.flags & 2 ? t = i + 1 : n = i;
  }
  return t;
}
function ci(e) {
  if (!(e.flags & 1)) {
    const t = Xt(e), n = Fe[Fe.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(e.flags & 2) && t >= Xt(n) ? Fe.push(e) : Fe.splice(so(t), 0, e), e.flags |= 1, Ds();
  }
}
function Ds() {
  hn || (hn = Fs.then(Ps));
}
function ro(e) {
  V(e) ? Dt.push(...e) : dt && e.id === -1 ? dt.splice(At + 1, 0, e) : e.flags & 1 || (Dt.push(e), e.flags |= 1), Ds();
}
function Ti(e, t, n = Ye + 1) {
  for (; n < Fe.length; n++) {
    const i = Fe[n];
    if (i && i.flags & 2) {
      if (e && i.id !== e.uid)
        continue;
      Fe.splice(n, 1), n--, i.flags & 4 && (i.flags &= -2), i(), i.flags & 4 || (i.flags &= -2);
    }
  }
}
function Rs(e) {
  if (Dt.length) {
    const t = [...new Set(Dt)].sort(
      (n, i) => Xt(n) - Xt(i)
    );
    if (Dt.length = 0, dt) {
      dt.push(...t);
      return;
    }
    for (dt = t, At = 0; At < dt.length; At++) {
      const n = dt[At];
      n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), n.flags &= -2;
    }
    dt = null, At = 0;
  }
}
const Xt = (e) => e.id == null ? e.flags & 2 ? -1 : 1 / 0 : e.id;
function Ps(e) {
  try {
    for (Ye = 0; Ye < Fe.length; Ye++) {
      const t = Fe[Ye];
      t && !(t.flags & 8) && (t.flags & 4 && (t.flags &= -2), tn(
        t,
        t.i,
        t.i ? 15 : 14
      ), t.flags & 4 || (t.flags &= -2));
    }
  } finally {
    for (; Ye < Fe.length; Ye++) {
      const t = Fe[Ye];
      t && (t.flags &= -2);
    }
    Ye = -1, Fe.length = 0, Rs(), hn = null, (Fe.length || Dt.length) && Ps();
  }
}
let Qe = null, Is = null;
function pn(e) {
  const t = Qe;
  return Qe = e, Is = e && e.type.__scopeId || null, t;
}
function oo(e, t = Qe, n) {
  if (!t || e._n)
    return e;
  const i = (...s) => {
    i._d && $i(-1);
    const r = pn(t);
    let o;
    try {
      o = e(...s);
    } finally {
      pn(r), i._d && $i(1);
    }
    return o;
  };
  return i._n = !0, i._c = !0, i._d = !0, i;
}
function bt(e, t, n, i) {
  const s = e.dirs, r = t && t.dirs;
  for (let o = 0; o < s.length; o++) {
    const l = s[o];
    r && (l.oldValue = r[o].value);
    let u = l.dir[i];
    u && (lt(), nt(u, n, 8, [
      e.el,
      l,
      e,
      t
    ]), at());
  }
}
const lo = Symbol("_vte"), ao = (e) => e.__isTeleport, uo = Symbol("_leaveCb");
function di(e, t) {
  e.shapeFlag & 6 && e.component ? (e.transition = t, di(e.component.subTree, t)) : e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
// @__NO_SIDE_EFFECTS__
function Ue(e, t) {
  return q(e) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    Ee({ name: e.name }, t, { setup: e })
  ) : e;
}
function $s(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
}
const gn = /* @__PURE__ */ new WeakMap();
function Ut(e, t, n, i, s = !1) {
  if (V(e)) {
    e.forEach(
      (P, D) => Ut(
        P,
        t && (V(t) ? t[D] : t),
        n,
        i,
        s
      )
    );
    return;
  }
  if (qt(i) && !s) {
    i.shapeFlag & 512 && i.type.__asyncResolved && i.component.subTree.component && Ut(e, t, n, i.component.subTree);
    return;
  }
  const r = i.shapeFlag & 4 ? _i(i.component) : i.el, o = s ? null : r, { i: l, r: u } = e, h = t && t.r, c = l.refs === le ? l.refs = {} : l.refs, p = l.setupState, y = te(p), A = p === le ? rs : (P) => ie(y, P);
  if (h != null && h !== u) {
    if (Ei(t), me(h))
      c[h] = null, A(h) && (p[h] = null);
    else if (be(h)) {
      h.value = null;
      const P = t;
      P.k && (c[P.k] = null);
    }
  }
  if (q(u))
    tn(u, l, 12, [o, c]);
  else {
    const P = me(u), D = be(u);
    if (P || D) {
      const Z = () => {
        if (e.f) {
          const I = P ? A(u) ? p[u] : c[u] : u.value;
          if (s)
            V(I) && ii(I, r);
          else if (V(I))
            I.includes(r) || I.push(r);
          else if (P)
            c[u] = [r], A(u) && (p[u] = c[u]);
          else {
            const W = [r];
            u.value = W, e.k && (c[e.k] = W);
          }
        } else P ? (c[u] = o, A(u) && (p[u] = o)) : D && (u.value = o, e.k && (c[e.k] = o));
      };
      if (o) {
        const I = () => {
          Z(), gn.delete(e);
        };
        I.id = -1, gn.set(e, I), Le(I, n);
      } else
        Ei(e), Z();
    }
  }
}
function Ei(e) {
  const t = gn.get(e);
  t && (t.flags |= 8, gn.delete(e));
}
wn().requestIdleCallback;
wn().cancelIdleCallback;
const qt = (e) => !!e.type.__asyncLoader, Ns = (e) => e.type.__isKeepAlive;
function fo(e, t) {
  Ls(e, "a", t);
}
function co(e, t) {
  Ls(e, "da", t);
}
function Ls(e, t, n = De) {
  const i = e.__wdc || (e.__wdc = () => {
    let s = n;
    for (; s; ) {
      if (s.isDeactivated)
        return;
      s = s.parent;
    }
    return e();
  });
  if (Cn(t, i, n), n) {
    let s = n.parent;
    for (; s && s.parent; )
      Ns(s.parent.vnode) && ho(i, t, n, s), s = s.parent;
  }
}
function ho(e, t, n, i) {
  const s = Cn(
    t,
    e,
    i,
    !0
    /* prepend */
  );
  pi(() => {
    ii(i[t], s);
  }, n);
}
function Cn(e, t, n = De, i = !1) {
  if (n) {
    const s = n[e] || (n[e] = []), r = t.__weh || (t.__weh = (...o) => {
      lt();
      const l = nn(n), u = nt(t, n, e, o);
      return l(), at(), u;
    });
    return i ? s.unshift(r) : s.push(r), r;
  }
}
const ft = (e) => (t, n = De) => {
  (!Zt || e === "sp") && Cn(e, (...i) => t(...i), n);
}, po = ft("bm"), hi = ft("m"), go = ft(
  "bu"
), mo = ft("u"), An = ft(
  "bum"
), pi = ft("um"), vo = ft(
  "sp"
), _o = ft("rtg"), xo = ft("rtc");
function yo(e, t = De) {
  Cn("ec", e, t);
}
const bo = Symbol.for("v-ndc");
function wo(e, t, n, i) {
  let s;
  const r = n, o = V(e);
  if (o || me(e)) {
    const l = o && Tt(e);
    let u = !1, h = !1;
    l && (u = !He(e), h = ut(e), e = Sn(e)), s = new Array(e.length);
    for (let c = 0, p = e.length; c < p; c++)
      s[c] = t(
        u ? h ? Pt(Ve(e[c])) : Ve(e[c]) : e[c],
        c,
        void 0,
        r
      );
  } else if (typeof e == "number") {
    s = new Array(e);
    for (let l = 0; l < e; l++)
      s[l] = t(l + 1, l, void 0, r);
  } else if (ue(e))
    if (e[Symbol.iterator])
      s = Array.from(
        e,
        (l, u) => t(l, u, void 0, r)
      );
    else {
      const l = Object.keys(e);
      s = new Array(l.length);
      for (let u = 0, h = l.length; u < h; u++) {
        const c = l[u];
        s[u] = t(e[c], c, u, r);
      }
    }
  else
    s = [];
  return s;
}
const zn = (e) => e ? rr(e) ? _i(e) : zn(e.parent) : null, Kt = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ Ee(/* @__PURE__ */ Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => e.props,
    $attrs: (e) => e.attrs,
    $slots: (e) => e.slots,
    $refs: (e) => e.refs,
    $parent: (e) => zn(e.parent),
    $root: (e) => zn(e.root),
    $host: (e) => e.ce,
    $emit: (e) => e.emit,
    $options: (e) => Hs(e),
    $forceUpdate: (e) => e.f || (e.f = () => {
      ci(e.update);
    }),
    $nextTick: (e) => e.n || (e.n = En.bind(e.proxy)),
    $watch: (e) => Po.bind(e)
  })
), kn = (e, t) => e !== le && !e.__isScriptSetup && ie(e, t), So = {
  get({ _: e }, t) {
    if (t === "__v_skip")
      return !0;
    const { ctx: n, setupState: i, data: s, props: r, accessCache: o, type: l, appContext: u } = e;
    if (t[0] !== "$") {
      const y = o[t];
      if (y !== void 0)
        switch (y) {
          case 1:
            return i[t];
          case 2:
            return s[t];
          case 4:
            return n[t];
          case 3:
            return r[t];
        }
      else {
        if (kn(i, t))
          return o[t] = 1, i[t];
        if (s !== le && ie(s, t))
          return o[t] = 2, s[t];
        if (ie(r, t))
          return o[t] = 3, r[t];
        if (n !== le && ie(n, t))
          return o[t] = 4, n[t];
        Jn && (o[t] = 0);
      }
    }
    const h = Kt[t];
    let c, p;
    if (h)
      return t === "$attrs" && Me(e.attrs, "get", ""), h(e);
    if (
      // css module (injected by vue-loader)
      (c = l.__cssModules) && (c = c[t])
    )
      return c;
    if (n !== le && ie(n, t))
      return o[t] = 4, n[t];
    if (
      // global properties
      p = u.config.globalProperties, ie(p, t)
    )
      return p[t];
  },
  set({ _: e }, t, n) {
    const { data: i, setupState: s, ctx: r } = e;
    return kn(s, t) ? (s[t] = n, !0) : i !== le && ie(i, t) ? (i[t] = n, !0) : ie(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (r[t] = n, !0);
  },
  has({
    _: { data: e, setupState: t, accessCache: n, ctx: i, appContext: s, props: r, type: o }
  }, l) {
    let u;
    return !!(n[l] || e !== le && l[0] !== "$" && ie(e, l) || kn(t, l) || ie(r, l) || ie(i, l) || ie(Kt, l) || ie(s.config.globalProperties, l) || (u = o.__cssModules) && u[l]);
  },
  defineProperty(e, t, n) {
    return n.get != null ? e._.accessCache[t] = 0 : ie(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
  }
};
function Ci(e) {
  return V(e) ? e.reduce(
    (t, n) => (t[n] = null, t),
    {}
  ) : e;
}
let Jn = !0;
function Mo(e) {
  const t = Hs(e), n = e.proxy, i = e.ctx;
  Jn = !1, t.beforeCreate && Ai(t.beforeCreate, e, "bc");
  const {
    // state
    data: s,
    computed: r,
    methods: o,
    watch: l,
    provide: u,
    inject: h,
    // lifecycle
    created: c,
    beforeMount: p,
    mounted: y,
    beforeUpdate: A,
    updated: P,
    activated: D,
    deactivated: Z,
    beforeDestroy: I,
    beforeUnmount: W,
    destroyed: K,
    unmounted: F,
    render: Y,
    renderTracked: ae,
    renderTriggered: de,
    errorCaptured: xe,
    serverPrefetch: we,
    // public API
    expose: ye,
    inheritAttrs: Ce,
    // assets
    components: Ae,
    directives: U,
    filters: Se
  } = t;
  if (h && To(h, i, null), o)
    for (const se in o) {
      const X = o[se];
      q(X) && (i[se] = X.bind(n));
    }
  if (s) {
    const se = s.call(n, n);
    ue(se) && (e.data = ui(se));
  }
  if (Jn = !0, r)
    for (const se in r) {
      const X = r[se], E = q(X) ? X.bind(n, n) : q(X.get) ? X.get.bind(n, n) : et, g = !q(X) && q(X.set) ? X.set.bind(n) : et, M = fe({
        get: E,
        set: g
      });
      Object.defineProperty(i, se, {
        enumerable: !0,
        configurable: !0,
        get: () => M.value,
        set: (C) => M.value = C
      });
    }
  if (l)
    for (const se in l)
      ks(l[se], i, n, se);
  if (u) {
    const se = q(u) ? u.call(n) : u;
    Reflect.ownKeys(se).forEach((X) => {
      js(X, se[X]);
    });
  }
  c && Ai(c, e, "c");
  function ve(se, X) {
    V(X) ? X.forEach((E) => se(E.bind(n))) : X && se(X.bind(n));
  }
  if (ve(po, p), ve(hi, y), ve(go, A), ve(mo, P), ve(fo, D), ve(co, Z), ve(yo, xe), ve(xo, ae), ve(_o, de), ve(An, W), ve(pi, F), ve(vo, we), V(ye))
    if (ye.length) {
      const se = e.exposed || (e.exposed = {});
      ye.forEach((X) => {
        Object.defineProperty(se, X, {
          get: () => n[X],
          set: (E) => n[X] = E,
          enumerable: !0
        });
      });
    } else e.exposed || (e.exposed = {});
  Y && e.render === et && (e.render = Y), Ce != null && (e.inheritAttrs = Ce), Ae && (e.components = Ae), U && (e.directives = U), we && $s(e);
}
function To(e, t, n = et) {
  V(e) && (e = Yn(e));
  for (const i in e) {
    const s = e[i];
    let r;
    ue(s) ? "default" in s ? r = Gt(
      s.from || i,
      s.default,
      !0
    ) : r = Gt(s.from || i) : r = Gt(s), be(r) ? Object.defineProperty(t, i, {
      enumerable: !0,
      configurable: !0,
      get: () => r.value,
      set: (o) => r.value = o
    }) : t[i] = r;
  }
}
function Ai(e, t, n) {
  nt(
    V(e) ? e.map((i) => i.bind(t.proxy)) : e.bind(t.proxy),
    t,
    n
  );
}
function ks(e, t, n, i) {
  let s = i.includes(".") ? Vs(n, i) : () => n[i];
  if (me(e)) {
    const r = t[e];
    q(r) && tt(s, r);
  } else if (q(e))
    tt(s, e.bind(n));
  else if (ue(e))
    if (V(e))
      e.forEach((r) => ks(r, t, n, i));
    else {
      const r = q(e.handler) ? e.handler.bind(n) : t[e.handler];
      q(r) && tt(s, r, e);
    }
}
function Hs(e) {
  const t = e.type, { mixins: n, extends: i } = t, {
    mixins: s,
    optionsCache: r,
    config: { optionMergeStrategies: o }
  } = e.appContext, l = r.get(t);
  let u;
  return l ? u = l : !s.length && !n && !i ? u = t : (u = {}, s.length && s.forEach(
    (h) => mn(u, h, o, !0)
  ), mn(u, t, o)), ue(t) && r.set(t, u), u;
}
function mn(e, t, n, i = !1) {
  const { mixins: s, extends: r } = t;
  r && mn(e, r, n, !0), s && s.forEach(
    (o) => mn(e, o, n, !0)
  );
  for (const o in t)
    if (!(i && o === "expose")) {
      const l = Eo[o] || n && n[o];
      e[o] = l ? l(e[o], t[o]) : t[o];
    }
  return e;
}
const Eo = {
  data: Oi,
  props: Fi,
  emits: Fi,
  // objects
  methods: Ht,
  computed: Ht,
  // lifecycle
  beforeCreate: Oe,
  created: Oe,
  beforeMount: Oe,
  mounted: Oe,
  beforeUpdate: Oe,
  updated: Oe,
  beforeDestroy: Oe,
  beforeUnmount: Oe,
  destroyed: Oe,
  unmounted: Oe,
  activated: Oe,
  deactivated: Oe,
  errorCaptured: Oe,
  serverPrefetch: Oe,
  // assets
  components: Ht,
  directives: Ht,
  // watch
  watch: Ao,
  // provide / inject
  provide: Oi,
  inject: Co
};
function Oi(e, t) {
  return t ? e ? function() {
    return Ee(
      q(e) ? e.call(this, this) : e,
      q(t) ? t.call(this, this) : t
    );
  } : t : e;
}
function Co(e, t) {
  return Ht(Yn(e), Yn(t));
}
function Yn(e) {
  if (V(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++)
      t[e[n]] = e[n];
    return t;
  }
  return e;
}
function Oe(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function Ht(e, t) {
  return e ? Ee(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Fi(e, t) {
  return e ? V(e) && V(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : Ee(
    /* @__PURE__ */ Object.create(null),
    Ci(e),
    Ci(t ?? {})
  ) : t;
}
function Ao(e, t) {
  if (!e) return t;
  if (!t) return e;
  const n = Ee(/* @__PURE__ */ Object.create(null), e);
  for (const i in t)
    n[i] = Oe(e[i], t[i]);
  return n;
}
function Ws() {
  return {
    app: null,
    config: {
      isNativeTag: rs,
      performance: !1,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let Oo = 0;
function Fo(e, t) {
  return function(i, s = null) {
    q(i) || (i = Ee({}, i)), s != null && !ue(s) && (s = null);
    const r = Ws(), o = /* @__PURE__ */ new WeakSet(), l = [];
    let u = !1;
    const h = r.app = {
      _uid: Oo++,
      _component: i,
      _props: s,
      _container: null,
      _context: r,
      _instance: null,
      version: cl,
      get config() {
        return r.config;
      },
      set config(c) {
      },
      use(c, ...p) {
        return o.has(c) || (c && q(c.install) ? (o.add(c), c.install(h, ...p)) : q(c) && (o.add(c), c(h, ...p))), h;
      },
      mixin(c) {
        return r.mixins.includes(c) || r.mixins.push(c), h;
      },
      component(c, p) {
        return p ? (r.components[c] = p, h) : r.components[c];
      },
      directive(c, p) {
        return p ? (r.directives[c] = p, h) : r.directives[c];
      },
      mount(c, p, y) {
        if (!u) {
          const A = h._ceVNode || We(i, s);
          return A.appContext = r, y === !0 ? y = "svg" : y === !1 && (y = void 0), e(A, c, y), u = !0, h._container = c, c.__vue_app__ = h, _i(A.component);
        }
      },
      onUnmount(c) {
        l.push(c);
      },
      unmount() {
        u && (nt(
          l,
          h._instance,
          16
        ), e(null, h._container), delete h._container.__vue_app__);
      },
      provide(c, p) {
        return r.provides[c] = p, h;
      },
      runWithContext(c) {
        const p = Rt;
        Rt = h;
        try {
          return c();
        } finally {
          Rt = p;
        }
      }
    };
    return h;
  };
}
let Rt = null;
function js(e, t) {
  if (De) {
    let n = De.provides;
    const i = De.parent && De.parent.provides;
    i === n && (n = De.provides = Object.create(i)), n[e] = t;
  }
}
function Gt(e, t, n = !1) {
  const i = rl();
  if (i || Rt) {
    let s = Rt ? Rt._context.provides : i ? i.parent == null || i.ce ? i.vnode.appContext && i.vnode.appContext.provides : i.parent.provides : void 0;
    if (s && e in s)
      return s[e];
    if (arguments.length > 1)
      return n && q(t) ? t.call(i && i.proxy) : t;
  }
}
const Do = Symbol.for("v-scx"), Ro = () => Gt(Do);
function tt(e, t, n) {
  return Bs(e, t, n);
}
function Bs(e, t, n = le) {
  const { immediate: i, deep: s, flush: r, once: o } = n, l = Ee({}, n), u = t && i || !t && r !== "post";
  let h;
  if (Zt) {
    if (r === "sync") {
      const A = Ro();
      h = A.__watcherHandles || (A.__watcherHandles = []);
    } else if (!u) {
      const A = () => {
      };
      return A.stop = et, A.resume = et, A.pause = et, A;
    }
  }
  const c = De;
  l.call = (A, P, D) => nt(A, c, P, D);
  let p = !1;
  r === "post" ? l.scheduler = (A) => {
    Le(A, c && c.suspense);
  } : r !== "sync" && (p = !0, l.scheduler = (A, P) => {
    P ? A() : ci(A);
  }), l.augmentJob = (A) => {
    t && (A.flags |= 4), p && (A.flags |= 2, c && (A.id = c.uid, A.i = c));
  };
  const y = no(e, t, l);
  return Zt && (h ? h.push(y) : u && y()), y;
}
function Po(e, t, n) {
  const i = this.proxy, s = me(e) ? e.includes(".") ? Vs(i, e) : () => i[e] : e.bind(i, i);
  let r;
  q(t) ? r = t : (r = t.handler, n = t);
  const o = nn(this), l = Bs(s, r.bind(i), n);
  return o(), l;
}
function Vs(e, t) {
  const n = t.split(".");
  return () => {
    let i = e;
    for (let s = 0; s < n.length && i; s++)
      i = i[n[s]];
    return i;
  };
}
const Io = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${vt(t)}Modifiers`] || e[`${Et(t)}Modifiers`];
function $o(e, t, ...n) {
  if (e.isUnmounted) return;
  const i = e.vnode.props || le;
  let s = n;
  const r = t.startsWith("update:"), o = r && Io(i, t.slice(7));
  o && (o.trim && (s = n.map((c) => me(c) ? c.trim() : c)), o.number && (s = n.map(mr)));
  let l, u = i[l = Rn(t)] || // also try camelCase event handler (#2249)
  i[l = Rn(vt(t))];
  !u && r && (u = i[l = Rn(Et(t))]), u && nt(
    u,
    e,
    6,
    s
  );
  const h = i[l + "Once"];
  if (h) {
    if (!e.emitted)
      e.emitted = {};
    else if (e.emitted[l])
      return;
    e.emitted[l] = !0, nt(
      h,
      e,
      6,
      s
    );
  }
}
const No = /* @__PURE__ */ new WeakMap();
function Us(e, t, n = !1) {
  const i = n ? No : t.emitsCache, s = i.get(e);
  if (s !== void 0)
    return s;
  const r = e.emits;
  let o = {}, l = !1;
  if (!q(e)) {
    const u = (h) => {
      const c = Us(h, t, !0);
      c && (l = !0, Ee(o, c));
    };
    !n && t.mixins.length && t.mixins.forEach(u), e.extends && u(e.extends), e.mixins && e.mixins.forEach(u);
  }
  return !r && !l ? (ue(e) && i.set(e, null), null) : (V(r) ? r.forEach((u) => o[u] = null) : Ee(o, r), ue(e) && i.set(e, o), o);
}
function On(e, t) {
  return !e || !_n(t) ? !1 : (t = t.slice(2).replace(/Once$/, ""), ie(e, t[0].toLowerCase() + t.slice(1)) || ie(e, Et(t)) || ie(e, t));
}
function Di(e) {
  const {
    type: t,
    vnode: n,
    proxy: i,
    withProxy: s,
    propsOptions: [r],
    slots: o,
    attrs: l,
    emit: u,
    render: h,
    renderCache: c,
    props: p,
    data: y,
    setupState: A,
    ctx: P,
    inheritAttrs: D
  } = e, Z = pn(e);
  let I, W;
  try {
    if (n.shapeFlag & 4) {
      const F = s || i, Y = F;
      I = Xe(
        h.call(
          Y,
          F,
          c,
          p,
          A,
          y,
          P
        )
      ), W = l;
    } else {
      const F = t;
      I = Xe(
        F.length > 1 ? F(
          p,
          { attrs: l, slots: o, emit: u }
        ) : F(
          p,
          null
        )
      ), W = t.props ? l : Lo(l);
    }
  } catch (F) {
    zt.length = 0, Tn(F, e, 1), I = We(xt);
  }
  let K = I;
  if (W && D !== !1) {
    const F = Object.keys(W), { shapeFlag: Y } = K;
    F.length && Y & 7 && (r && F.some(ni) && (W = ko(
      W,
      r
    )), K = It(K, W, !1, !0));
  }
  return n.dirs && (K = It(K, null, !1, !0), K.dirs = K.dirs ? K.dirs.concat(n.dirs) : n.dirs), n.transition && di(K, n.transition), I = K, pn(Z), I;
}
const Lo = (e) => {
  let t;
  for (const n in e)
    (n === "class" || n === "style" || _n(n)) && ((t || (t = {}))[n] = e[n]);
  return t;
}, ko = (e, t) => {
  const n = {};
  for (const i in e)
    (!ni(i) || !(i.slice(9) in t)) && (n[i] = e[i]);
  return n;
};
function Ho(e, t, n) {
  const { props: i, children: s, component: r } = e, { props: o, children: l, patchFlag: u } = t, h = r.emitsOptions;
  if (t.dirs || t.transition)
    return !0;
  if (n && u >= 0) {
    if (u & 1024)
      return !0;
    if (u & 16)
      return i ? Ri(i, o, h) : !!o;
    if (u & 8) {
      const c = t.dynamicProps;
      for (let p = 0; p < c.length; p++) {
        const y = c[p];
        if (o[y] !== i[y] && !On(h, y))
          return !0;
      }
    }
  } else
    return (s || l) && (!l || !l.$stable) ? !0 : i === o ? !1 : i ? o ? Ri(i, o, h) : !0 : !!o;
  return !1;
}
function Ri(e, t, n) {
  const i = Object.keys(t);
  if (i.length !== Object.keys(e).length)
    return !0;
  for (let s = 0; s < i.length; s++) {
    const r = i[s];
    if (t[r] !== e[r] && !On(n, r))
      return !0;
  }
  return !1;
}
function Wo({ vnode: e, parent: t }, n) {
  for (; t; ) {
    const i = t.subTree;
    if (i.suspense && i.suspense.activeBranch === e && (i.el = e.el), i === e)
      (e = t.vnode).el = n, t = t.parent;
    else
      break;
  }
}
const qs = {}, Ks = () => Object.create(qs), Gs = (e) => Object.getPrototypeOf(e) === qs;
function jo(e, t, n, i = !1) {
  const s = {}, r = Ks();
  e.propsDefaults = /* @__PURE__ */ Object.create(null), zs(e, t, s, r);
  for (const o in e.propsOptions[0])
    o in s || (s[o] = void 0);
  n ? e.props = i ? s : qr(s) : e.type.props ? e.props = s : e.props = r, e.attrs = r;
}
function Bo(e, t, n, i) {
  const {
    props: s,
    attrs: r,
    vnode: { patchFlag: o }
  } = e, l = te(s), [u] = e.propsOptions;
  let h = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (i || o > 0) && !(o & 16)
  ) {
    if (o & 8) {
      const c = e.vnode.dynamicProps;
      for (let p = 0; p < c.length; p++) {
        let y = c[p];
        if (On(e.emitsOptions, y))
          continue;
        const A = t[y];
        if (u)
          if (ie(r, y))
            A !== r[y] && (r[y] = A, h = !0);
          else {
            const P = vt(y);
            s[P] = Xn(
              u,
              l,
              P,
              A,
              e,
              !1
            );
          }
        else
          A !== r[y] && (r[y] = A, h = !0);
      }
    }
  } else {
    zs(e, t, s, r) && (h = !0);
    let c;
    for (const p in l)
      (!t || // for camelCase
      !ie(t, p) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((c = Et(p)) === p || !ie(t, c))) && (u ? n && // for camelCase
      (n[p] !== void 0 || // for kebab-case
      n[c] !== void 0) && (s[p] = Xn(
        u,
        l,
        p,
        void 0,
        e,
        !0
      )) : delete s[p]);
    if (r !== l)
      for (const p in r)
        (!t || !ie(t, p)) && (delete r[p], h = !0);
  }
  h && rt(e.attrs, "set", "");
}
function zs(e, t, n, i) {
  const [s, r] = e.propsOptions;
  let o = !1, l;
  if (t)
    for (let u in t) {
      if (jt(u))
        continue;
      const h = t[u];
      let c;
      s && ie(s, c = vt(u)) ? !r || !r.includes(c) ? n[c] = h : (l || (l = {}))[c] = h : On(e.emitsOptions, u) || (!(u in i) || h !== i[u]) && (i[u] = h, o = !0);
    }
  if (r) {
    const u = te(n), h = l || le;
    for (let c = 0; c < r.length; c++) {
      const p = r[c];
      n[p] = Xn(
        s,
        u,
        p,
        h[p],
        e,
        !ie(h, p)
      );
    }
  }
  return o;
}
function Xn(e, t, n, i, s, r) {
  const o = e[n];
  if (o != null) {
    const l = ie(o, "default");
    if (l && i === void 0) {
      const u = o.default;
      if (o.type !== Function && !o.skipFactory && q(u)) {
        const { propsDefaults: h } = s;
        if (n in h)
          i = h[n];
        else {
          const c = nn(s);
          i = h[n] = u.call(
            null,
            t
          ), c();
        }
      } else
        i = u;
      s.ce && s.ce._setProp(n, i);
    }
    o[
      0
      /* shouldCast */
    ] && (r && !l ? i = !1 : o[
      1
      /* shouldCastTrue */
    ] && (i === "" || i === Et(n)) && (i = !0));
  }
  return i;
}
const Vo = /* @__PURE__ */ new WeakMap();
function Js(e, t, n = !1) {
  const i = n ? Vo : t.propsCache, s = i.get(e);
  if (s)
    return s;
  const r = e.props, o = {}, l = [];
  let u = !1;
  if (!q(e)) {
    const c = (p) => {
      u = !0;
      const [y, A] = Js(p, t, !0);
      Ee(o, y), A && l.push(...A);
    };
    !n && t.mixins.length && t.mixins.forEach(c), e.extends && c(e.extends), e.mixins && e.mixins.forEach(c);
  }
  if (!r && !u)
    return ue(e) && i.set(e, Ot), Ot;
  if (V(r))
    for (let c = 0; c < r.length; c++) {
      const p = vt(r[c]);
      Pi(p) && (o[p] = le);
    }
  else if (r)
    for (const c in r) {
      const p = vt(c);
      if (Pi(p)) {
        const y = r[c], A = o[p] = V(y) || q(y) ? { type: y } : Ee({}, y), P = A.type;
        let D = !1, Z = !0;
        if (V(P))
          for (let I = 0; I < P.length; ++I) {
            const W = P[I], K = q(W) && W.name;
            if (K === "Boolean") {
              D = !0;
              break;
            } else K === "String" && (Z = !1);
          }
        else
          D = q(P) && P.name === "Boolean";
        A[
          0
          /* shouldCast */
        ] = D, A[
          1
          /* shouldCastTrue */
        ] = Z, (D || ie(A, "default")) && l.push(p);
      }
    }
  const h = [o, l];
  return ue(e) && i.set(e, h), h;
}
function Pi(e) {
  return e[0] !== "$" && !jt(e);
}
const gi = (e) => e === "_" || e === "_ctx" || e === "$stable", mi = (e) => V(e) ? e.map(Xe) : [Xe(e)], Uo = (e, t, n) => {
  if (t._n)
    return t;
  const i = oo((...s) => mi(t(...s)), n);
  return i._c = !1, i;
}, Ys = (e, t, n) => {
  const i = e._ctx;
  for (const s in e) {
    if (gi(s)) continue;
    const r = e[s];
    if (q(r))
      t[s] = Uo(s, r, i);
    else if (r != null) {
      const o = mi(r);
      t[s] = () => o;
    }
  }
}, Xs = (e, t) => {
  const n = mi(t);
  e.slots.default = () => n;
}, Qs = (e, t, n) => {
  for (const i in t)
    (n || !gi(i)) && (e[i] = t[i]);
}, qo = (e, t, n) => {
  const i = e.slots = Ks();
  if (e.vnode.shapeFlag & 32) {
    const s = t._;
    s ? (Qs(i, t, n), n && cs(i, "_", s, !0)) : Ys(t, i);
  } else t && Xs(e, t);
}, Ko = (e, t, n) => {
  const { vnode: i, slots: s } = e;
  let r = !0, o = le;
  if (i.shapeFlag & 32) {
    const l = t._;
    l ? n && l === 1 ? r = !1 : Qs(s, t, n) : (r = !t.$stable, Ys(t, s)), o = t;
  } else t && (Xs(e, t), o = { default: 1 });
  if (r)
    for (const l in s)
      !gi(l) && o[l] == null && delete s[l];
}, Le = Xo;
function Go(e) {
  return zo(e);
}
function zo(e, t) {
  const n = wn();
  n.__VUE__ = !0;
  const {
    insert: i,
    remove: s,
    patchProp: r,
    createElement: o,
    createText: l,
    createComment: u,
    setText: h,
    setElementText: c,
    parentNode: p,
    nextSibling: y,
    setScopeId: A = et,
    insertStaticContent: P
  } = e, D = (a, f, d, _ = null, m = null, v = null, T = void 0, S = null, w = !!f.dynamicChildren) => {
    if (a === f)
      return;
    a && !Lt(a, f) && (_ = G(a), C(a, m, v, !0), a = null), f.patchFlag === -2 && (w = !1, f.dynamicChildren = null);
    const { type: x, ref: L, shapeFlag: O } = f;
    switch (x) {
      case Fn:
        Z(a, f, d, _);
        break;
      case xt:
        I(a, f, d, _);
        break;
      case Wn:
        a == null && W(f, d, _, T);
        break;
      case je:
        Ae(
          a,
          f,
          d,
          _,
          m,
          v,
          T,
          S,
          w
        );
        break;
      default:
        O & 1 ? Y(
          a,
          f,
          d,
          _,
          m,
          v,
          T,
          S,
          w
        ) : O & 6 ? U(
          a,
          f,
          d,
          _,
          m,
          v,
          T,
          S,
          w
        ) : (O & 64 || O & 128) && x.process(
          a,
          f,
          d,
          _,
          m,
          v,
          T,
          S,
          w,
          b
        );
    }
    L != null && m ? Ut(L, a && a.ref, v, f || a, !f) : L == null && a && a.ref != null && Ut(a.ref, null, v, a, !0);
  }, Z = (a, f, d, _) => {
    if (a == null)
      i(
        f.el = l(f.children),
        d,
        _
      );
    else {
      const m = f.el = a.el;
      f.children !== a.children && h(m, f.children);
    }
  }, I = (a, f, d, _) => {
    a == null ? i(
      f.el = u(f.children || ""),
      d,
      _
    ) : f.el = a.el;
  }, W = (a, f, d, _) => {
    [a.el, a.anchor] = P(
      a.children,
      f,
      d,
      _,
      a.el,
      a.anchor
    );
  }, K = ({ el: a, anchor: f }, d, _) => {
    let m;
    for (; a && a !== f; )
      m = y(a), i(a, d, _), a = m;
    i(f, d, _);
  }, F = ({ el: a, anchor: f }) => {
    let d;
    for (; a && a !== f; )
      d = y(a), s(a), a = d;
    s(f);
  }, Y = (a, f, d, _, m, v, T, S, w) => {
    if (f.type === "svg" ? T = "svg" : f.type === "math" && (T = "mathml"), a == null)
      ae(
        f,
        d,
        _,
        m,
        v,
        T,
        S,
        w
      );
    else {
      const x = a.el && a.el._isVueCE ? a.el : null;
      try {
        x && x._beginPatch(), we(
          a,
          f,
          m,
          v,
          T,
          S,
          w
        );
      } finally {
        x && x._endPatch();
      }
    }
  }, ae = (a, f, d, _, m, v, T, S) => {
    let w, x;
    const { props: L, shapeFlag: O, transition: N, dirs: k } = a;
    if (w = a.el = o(
      a.type,
      v,
      L && L.is,
      L
    ), O & 8 ? c(w, a.children) : O & 16 && xe(
      a.children,
      w,
      null,
      _,
      m,
      Hn(a, v),
      T,
      S
    ), k && bt(a, null, _, "created"), de(w, a, a.scopeId, T, _), L) {
      for (const ne in L)
        ne !== "value" && !jt(ne) && r(w, ne, null, L[ne], v, _);
      "value" in L && r(w, "value", null, L.value, v), (x = L.onVnodeBeforeMount) && Je(x, _, a);
    }
    k && bt(a, null, _, "beforeMount");
    const z = Jo(m, N);
    z && N.beforeEnter(w), i(w, f, d), ((x = L && L.onVnodeMounted) || z || k) && Le(() => {
      x && Je(x, _, a), z && N.enter(w), k && bt(a, null, _, "mounted");
    }, m);
  }, de = (a, f, d, _, m) => {
    if (d && A(a, d), _)
      for (let v = 0; v < _.length; v++)
        A(a, _[v]);
    if (m) {
      let v = m.subTree;
      if (f === v || tr(v.type) && (v.ssContent === f || v.ssFallback === f)) {
        const T = m.vnode;
        de(
          a,
          T,
          T.scopeId,
          T.slotScopeIds,
          m.parent
        );
      }
    }
  }, xe = (a, f, d, _, m, v, T, S, w = 0) => {
    for (let x = w; x < a.length; x++) {
      const L = a[x] = S ? ht(a[x]) : Xe(a[x]);
      D(
        null,
        L,
        f,
        d,
        _,
        m,
        v,
        T,
        S
      );
    }
  }, we = (a, f, d, _, m, v, T) => {
    const S = f.el = a.el;
    let { patchFlag: w, dynamicChildren: x, dirs: L } = f;
    w |= a.patchFlag & 16;
    const O = a.props || le, N = f.props || le;
    let k;
    if (d && wt(d, !1), (k = N.onVnodeBeforeUpdate) && Je(k, d, f, a), L && bt(f, a, d, "beforeUpdate"), d && wt(d, !0), (O.innerHTML && N.innerHTML == null || O.textContent && N.textContent == null) && c(S, ""), x ? ye(
      a.dynamicChildren,
      x,
      S,
      d,
      _,
      Hn(f, m),
      v
    ) : T || X(
      a,
      f,
      S,
      null,
      d,
      _,
      Hn(f, m),
      v,
      !1
    ), w > 0) {
      if (w & 16)
        Ce(S, O, N, d, m);
      else if (w & 2 && O.class !== N.class && r(S, "class", null, N.class, m), w & 4 && r(S, "style", O.style, N.style, m), w & 8) {
        const z = f.dynamicProps;
        for (let ne = 0; ne < z.length; ne++) {
          const Q = z[ne], Re = O[Q], Pe = N[Q];
          (Pe !== Re || Q === "value") && r(S, Q, Re, Pe, m, d);
        }
      }
      w & 1 && a.children !== f.children && c(S, f.children);
    } else !T && x == null && Ce(S, O, N, d, m);
    ((k = N.onVnodeUpdated) || L) && Le(() => {
      k && Je(k, d, f, a), L && bt(f, a, d, "updated");
    }, _);
  }, ye = (a, f, d, _, m, v, T) => {
    for (let S = 0; S < f.length; S++) {
      const w = a[S], x = f[S], L = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        w.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (w.type === je || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !Lt(w, x) || // - In the case of a component, it could contain anything.
        w.shapeFlag & 198) ? p(w.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          d
        )
      );
      D(
        w,
        x,
        L,
        null,
        _,
        m,
        v,
        T,
        !0
      );
    }
  }, Ce = (a, f, d, _, m) => {
    if (f !== d) {
      if (f !== le)
        for (const v in f)
          !jt(v) && !(v in d) && r(
            a,
            v,
            f[v],
            null,
            m,
            _
          );
      for (const v in d) {
        if (jt(v)) continue;
        const T = d[v], S = f[v];
        T !== S && v !== "value" && r(a, v, S, T, m, _);
      }
      "value" in d && r(a, "value", f.value, d.value, m);
    }
  }, Ae = (a, f, d, _, m, v, T, S, w) => {
    const x = f.el = a ? a.el : l(""), L = f.anchor = a ? a.anchor : l("");
    let { patchFlag: O, dynamicChildren: N, slotScopeIds: k } = f;
    k && (S = S ? S.concat(k) : k), a == null ? (i(x, d, _), i(L, d, _), xe(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      f.children || [],
      d,
      L,
      m,
      v,
      T,
      S,
      w
    )) : O > 0 && O & 64 && N && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    a.dynamicChildren ? (ye(
      a.dynamicChildren,
      N,
      d,
      m,
      v,
      T,
      S
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (f.key != null || m && f === m.subTree) && Zs(
      a,
      f,
      !0
      /* shallow */
    )) : X(
      a,
      f,
      d,
      L,
      m,
      v,
      T,
      S,
      w
    );
  }, U = (a, f, d, _, m, v, T, S, w) => {
    f.slotScopeIds = S, a == null ? f.shapeFlag & 512 ? m.ctx.activate(
      f,
      d,
      _,
      T,
      w
    ) : Se(
      f,
      d,
      _,
      m,
      v,
      T,
      w
    ) : qe(a, f, w);
  }, Se = (a, f, d, _, m, v, T) => {
    const S = a.component = sl(
      a,
      _,
      m
    );
    if (Ns(a) && (S.ctx.renderer = b), ol(S, !1, T), S.asyncDep) {
      if (m && m.registerDep(S, ve, T), !a.el) {
        const w = S.subTree = We(xt);
        I(null, w, f, d), a.placeholder = w.el;
      }
    } else
      ve(
        S,
        a,
        f,
        d,
        m,
        v,
        T
      );
  }, qe = (a, f, d) => {
    const _ = f.component = a.component;
    if (Ho(a, f, d))
      if (_.asyncDep && !_.asyncResolved) {
        se(_, f, d);
        return;
      } else
        _.next = f, _.update();
    else
      f.el = a.el, _.vnode = f;
  }, ve = (a, f, d, _, m, v, T) => {
    const S = () => {
      if (a.isMounted) {
        let { next: O, bu: N, u: k, parent: z, vnode: ne } = a;
        {
          const Ge = er(a);
          if (Ge) {
            O && (O.el = ne.el, se(a, O, T)), Ge.asyncDep.then(() => {
              a.isUnmounted || S();
            });
            return;
          }
        }
        let Q = O, Re;
        wt(a, !1), O ? (O.el = ne.el, se(a, O, T)) : O = ne, N && Pn(N), (Re = O.props && O.props.onVnodeBeforeUpdate) && Je(Re, z, O, ne), wt(a, !0);
        const Pe = Di(a), Ke = a.subTree;
        a.subTree = Pe, D(
          Ke,
          Pe,
          // parent may have changed if it's in a teleport
          p(Ke.el),
          // anchor may have changed if it's in a fragment
          G(Ke),
          a,
          m,
          v
        ), O.el = Pe.el, Q === null && Wo(a, Pe.el), k && Le(k, m), (Re = O.props && O.props.onVnodeUpdated) && Le(
          () => Je(Re, z, O, ne),
          m
        );
      } else {
        let O;
        const { el: N, props: k } = f, { bm: z, m: ne, parent: Q, root: Re, type: Pe } = a, Ke = qt(f);
        wt(a, !1), z && Pn(z), !Ke && (O = k && k.onVnodeBeforeMount) && Je(O, Q, f), wt(a, !0);
        {
          Re.ce && // @ts-expect-error _def is private
          Re.ce._def.shadowRoot !== !1 && Re.ce._injectChildStyle(Pe);
          const Ge = a.subTree = Di(a);
          D(
            null,
            Ge,
            d,
            _,
            a,
            m,
            v
          ), f.el = Ge.el;
        }
        if (ne && Le(ne, m), !Ke && (O = k && k.onVnodeMounted)) {
          const Ge = f;
          Le(
            () => Je(O, Q, Ge),
            m
          );
        }
        (f.shapeFlag & 256 || Q && qt(Q.vnode) && Q.vnode.shapeFlag & 256) && a.a && Le(a.a, m), a.isMounted = !0, f = d = _ = null;
      }
    };
    a.scope.on();
    const w = a.effect = new gs(S);
    a.scope.off();
    const x = a.update = w.run.bind(w), L = a.job = w.runIfDirty.bind(w);
    L.i = a, L.id = a.uid, w.scheduler = () => ci(L), wt(a, !0), x();
  }, se = (a, f, d) => {
    f.component = a;
    const _ = a.vnode.props;
    a.vnode = f, a.next = null, Bo(a, f.props, _, d), Ko(a, f.children, d), lt(), Ti(a), at();
  }, X = (a, f, d, _, m, v, T, S, w = !1) => {
    const x = a && a.children, L = a ? a.shapeFlag : 0, O = f.children, { patchFlag: N, shapeFlag: k } = f;
    if (N > 0) {
      if (N & 128) {
        g(
          x,
          O,
          d,
          _,
          m,
          v,
          T,
          S,
          w
        );
        return;
      } else if (N & 256) {
        E(
          x,
          O,
          d,
          _,
          m,
          v,
          T,
          S,
          w
        );
        return;
      }
    }
    k & 8 ? (L & 16 && B(x, m, v), O !== x && c(d, O)) : L & 16 ? k & 16 ? g(
      x,
      O,
      d,
      _,
      m,
      v,
      T,
      S,
      w
    ) : B(x, m, v, !0) : (L & 8 && c(d, ""), k & 16 && xe(
      O,
      d,
      _,
      m,
      v,
      T,
      S,
      w
    ));
  }, E = (a, f, d, _, m, v, T, S, w) => {
    a = a || Ot, f = f || Ot;
    const x = a.length, L = f.length, O = Math.min(x, L);
    let N;
    for (N = 0; N < O; N++) {
      const k = f[N] = w ? ht(f[N]) : Xe(f[N]);
      D(
        a[N],
        k,
        d,
        null,
        m,
        v,
        T,
        S,
        w
      );
    }
    x > L ? B(
      a,
      m,
      v,
      !0,
      !1,
      O
    ) : xe(
      f,
      d,
      _,
      m,
      v,
      T,
      S,
      w,
      O
    );
  }, g = (a, f, d, _, m, v, T, S, w) => {
    let x = 0;
    const L = f.length;
    let O = a.length - 1, N = L - 1;
    for (; x <= O && x <= N; ) {
      const k = a[x], z = f[x] = w ? ht(f[x]) : Xe(f[x]);
      if (Lt(k, z))
        D(
          k,
          z,
          d,
          null,
          m,
          v,
          T,
          S,
          w
        );
      else
        break;
      x++;
    }
    for (; x <= O && x <= N; ) {
      const k = a[O], z = f[N] = w ? ht(f[N]) : Xe(f[N]);
      if (Lt(k, z))
        D(
          k,
          z,
          d,
          null,
          m,
          v,
          T,
          S,
          w
        );
      else
        break;
      O--, N--;
    }
    if (x > O) {
      if (x <= N) {
        const k = N + 1, z = k < L ? f[k].el : _;
        for (; x <= N; )
          D(
            null,
            f[x] = w ? ht(f[x]) : Xe(f[x]),
            d,
            z,
            m,
            v,
            T,
            S,
            w
          ), x++;
      }
    } else if (x > N)
      for (; x <= O; )
        C(a[x], m, v, !0), x++;
    else {
      const k = x, z = x, ne = /* @__PURE__ */ new Map();
      for (x = z; x <= N; x++) {
        const Ne = f[x] = w ? ht(f[x]) : Xe(f[x]);
        Ne.key != null && ne.set(Ne.key, x);
      }
      let Q, Re = 0;
      const Pe = N - z + 1;
      let Ke = !1, Ge = 0;
      const $t = new Array(Pe);
      for (x = 0; x < Pe; x++) $t[x] = 0;
      for (x = k; x <= O; x++) {
        const Ne = a[x];
        if (Re >= Pe) {
          C(Ne, m, v, !0);
          continue;
        }
        let ze;
        if (Ne.key != null)
          ze = ne.get(Ne.key);
        else
          for (Q = z; Q <= N; Q++)
            if ($t[Q - z] === 0 && Lt(Ne, f[Q])) {
              ze = Q;
              break;
            }
        ze === void 0 ? C(Ne, m, v, !0) : ($t[ze - z] = x + 1, ze >= Ge ? Ge = ze : Ke = !0, D(
          Ne,
          f[ze],
          d,
          null,
          m,
          v,
          T,
          S,
          w
        ), Re++);
      }
      const xi = Ke ? Yo($t) : Ot;
      for (Q = xi.length - 1, x = Pe - 1; x >= 0; x--) {
        const Ne = z + x, ze = f[Ne], yi = f[Ne + 1], bi = Ne + 1 < L ? (
          // #13559, fallback to el placeholder for unresolved async component
          yi.el || yi.placeholder
        ) : _;
        $t[x] === 0 ? D(
          null,
          ze,
          d,
          bi,
          m,
          v,
          T,
          S,
          w
        ) : Ke && (Q < 0 || x !== xi[Q] ? M(ze, d, bi, 2) : Q--);
      }
    }
  }, M = (a, f, d, _, m = null) => {
    const { el: v, type: T, transition: S, children: w, shapeFlag: x } = a;
    if (x & 6) {
      M(a.component.subTree, f, d, _);
      return;
    }
    if (x & 128) {
      a.suspense.move(f, d, _);
      return;
    }
    if (x & 64) {
      T.move(a, f, d, b);
      return;
    }
    if (T === je) {
      i(v, f, d);
      for (let O = 0; O < w.length; O++)
        M(w[O], f, d, _);
      i(a.anchor, f, d);
      return;
    }
    if (T === Wn) {
      K(a, f, d);
      return;
    }
    if (_ !== 2 && x & 1 && S)
      if (_ === 0)
        S.beforeEnter(v), i(v, f, d), Le(() => S.enter(v), m);
      else {
        const { leave: O, delayLeave: N, afterLeave: k } = S, z = () => {
          a.ctx.isUnmounted ? s(v) : i(v, f, d);
        }, ne = () => {
          v._isLeaving && v[uo](
            !0
            /* cancelled */
          ), O(v, () => {
            z(), k && k();
          });
        };
        N ? N(v, z, ne) : ne();
      }
    else
      i(v, f, d);
  }, C = (a, f, d, _ = !1, m = !1) => {
    const {
      type: v,
      props: T,
      ref: S,
      children: w,
      dynamicChildren: x,
      shapeFlag: L,
      patchFlag: O,
      dirs: N,
      cacheIndex: k
    } = a;
    if (O === -2 && (m = !1), S != null && (lt(), Ut(S, null, d, a, !0), at()), k != null && (f.renderCache[k] = void 0), L & 256) {
      f.ctx.deactivate(a);
      return;
    }
    const z = L & 1 && N, ne = !qt(a);
    let Q;
    if (ne && (Q = T && T.onVnodeBeforeUnmount) && Je(Q, f, a), L & 6)
      H(a.component, d, _);
    else {
      if (L & 128) {
        a.suspense.unmount(d, _);
        return;
      }
      z && bt(a, null, f, "beforeUnmount"), L & 64 ? a.type.remove(
        a,
        f,
        d,
        b,
        _
      ) : x && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !x.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (v !== je || O > 0 && O & 64) ? B(
        x,
        f,
        d,
        !1,
        !0
      ) : (v === je && O & 384 || !m && L & 16) && B(w, f, d), _ && $(a);
    }
    (ne && (Q = T && T.onVnodeUnmounted) || z) && Le(() => {
      Q && Je(Q, f, a), z && bt(a, null, f, "unmounted");
    }, d);
  }, $ = (a) => {
    const { type: f, el: d, anchor: _, transition: m } = a;
    if (f === je) {
      R(d, _);
      return;
    }
    if (f === Wn) {
      F(a);
      return;
    }
    const v = () => {
      s(d), m && !m.persisted && m.afterLeave && m.afterLeave();
    };
    if (a.shapeFlag & 1 && m && !m.persisted) {
      const { leave: T, delayLeave: S } = m, w = () => T(d, v);
      S ? S(a.el, v, w) : w();
    } else
      v();
  }, R = (a, f) => {
    let d;
    for (; a !== f; )
      d = y(a), s(a), a = d;
    s(f);
  }, H = (a, f, d) => {
    const { bum: _, scope: m, job: v, subTree: T, um: S, m: w, a: x } = a;
    Ii(w), Ii(x), _ && Pn(_), m.stop(), v && (v.flags |= 8, C(T, a, f, d)), S && Le(S, f), Le(() => {
      a.isUnmounted = !0;
    }, f);
  }, B = (a, f, d, _ = !1, m = !1, v = 0) => {
    for (let T = v; T < a.length; T++)
      C(a[T], f, d, _, m);
  }, G = (a) => {
    if (a.shapeFlag & 6)
      return G(a.component.subTree);
    if (a.shapeFlag & 128)
      return a.suspense.next();
    const f = y(a.anchor || a.el), d = f && f[lo];
    return d ? y(d) : f;
  };
  let he = !1;
  const ce = (a, f, d) => {
    a == null ? f._vnode && C(f._vnode, null, null, !0) : D(
      f._vnode || null,
      a,
      f,
      null,
      null,
      null,
      d
    ), f._vnode = a, he || (he = !0, Ti(), Rs(), he = !1);
  }, b = {
    p: D,
    um: C,
    m: M,
    r: $,
    mt: Se,
    mc: xe,
    pc: X,
    pbc: ye,
    n: G,
    o: e
  };
  return {
    render: ce,
    hydrate: void 0,
    createApp: Fo(ce)
  };
}
function Hn({ type: e, props: t }, n) {
  return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function wt({ effect: e, job: t }, n) {
  n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Jo(e, t) {
  return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Zs(e, t, n = !1) {
  const i = e.children, s = t.children;
  if (V(i) && V(s))
    for (let r = 0; r < i.length; r++) {
      const o = i[r];
      let l = s[r];
      l.shapeFlag & 1 && !l.dynamicChildren && ((l.patchFlag <= 0 || l.patchFlag === 32) && (l = s[r] = ht(s[r]), l.el = o.el), !n && l.patchFlag !== -2 && Zs(o, l)), l.type === Fn && // avoid cached text nodes retaining detached dom nodes
      l.patchFlag !== -1 && (l.el = o.el), l.type === xt && !l.el && (l.el = o.el);
    }
}
function Yo(e) {
  const t = e.slice(), n = [0];
  let i, s, r, o, l;
  const u = e.length;
  for (i = 0; i < u; i++) {
    const h = e[i];
    if (h !== 0) {
      if (s = n[n.length - 1], e[s] < h) {
        t[i] = s, n.push(i);
        continue;
      }
      for (r = 0, o = n.length - 1; r < o; )
        l = r + o >> 1, e[n[l]] < h ? r = l + 1 : o = l;
      h < e[n[r]] && (r > 0 && (t[i] = n[r - 1]), n[r] = i);
    }
  }
  for (r = n.length, o = n[r - 1]; r-- > 0; )
    n[r] = o, o = t[o];
  return n;
}
function er(e) {
  const t = e.subTree.component;
  if (t)
    return t.asyncDep && !t.asyncResolved ? t : er(t);
}
function Ii(e) {
  if (e)
    for (let t = 0; t < e.length; t++)
      e[t].flags |= 8;
}
const tr = (e) => e.__isSuspense;
function Xo(e, t) {
  t && t.pendingBranch ? V(e) ? t.effects.push(...e) : t.effects.push(e) : ro(e);
}
const je = Symbol.for("v-fgt"), Fn = Symbol.for("v-txt"), xt = Symbol.for("v-cmt"), Wn = Symbol.for("v-stc"), zt = [];
let ke = null;
function ee(e = !1) {
  zt.push(ke = e ? null : []);
}
function Qo() {
  zt.pop(), ke = zt[zt.length - 1] || null;
}
let Qt = 1;
function $i(e, t = !1) {
  Qt += e, e < 0 && ke && t && (ke.hasOnce = !0);
}
function nr(e) {
  return e.dynamicChildren = Qt > 0 ? ke || Ot : null, Qo(), Qt > 0 && ke && ke.push(e), e;
}
function pe(e, t, n, i, s, r) {
  return nr(
    oe(
      e,
      t,
      n,
      i,
      s,
      r,
      !0
    )
  );
}
function Ze(e, t, n, i, s) {
  return nr(
    We(
      e,
      t,
      n,
      i,
      s,
      !0
    )
  );
}
function ir(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function Lt(e, t) {
  return e.type === t.type && e.key === t.key;
}
const sr = ({ key: e }) => e ?? null, an = ({
  ref: e,
  ref_key: t,
  ref_for: n
}) => (typeof e == "number" && (e = "" + e), e != null ? me(e) || be(e) || q(e) ? { i: Qe, r: e, k: t, f: !!n } : e : null);
function oe(e, t = null, n = null, i = 0, s = null, r = e === je ? 0 : 1, o = !1, l = !1) {
  const u = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && sr(t),
    ref: t && an(t),
    scopeId: Is,
    slotScopeIds: null,
    children: n,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: r,
    patchFlag: i,
    dynamicProps: s,
    dynamicChildren: null,
    appContext: null,
    ctx: Qe
  };
  return l ? (vi(u, n), r & 128 && e.normalize(u)) : n && (u.shapeFlag |= me(n) ? 8 : 16), Qt > 0 && // avoid a block node from tracking itself
  !o && // has current parent block
  ke && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (u.patchFlag > 0 || r & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  u.patchFlag !== 32 && ke.push(u), u;
}
const We = Zo;
function Zo(e, t = null, n = null, i = 0, s = null, r = !1) {
  if ((!e || e === bo) && (e = xt), ir(e)) {
    const l = It(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return n && vi(l, n), Qt > 0 && !r && ke && (l.shapeFlag & 6 ? ke[ke.indexOf(e)] = l : ke.push(l)), l.patchFlag = -2, l;
  }
  if (fl(e) && (e = e.__vccOpts), t) {
    t = el(t);
    let { class: l, style: u } = t;
    l && !me(l) && (t.class = ot(l)), ue(u) && (Mn(u) && !V(u) && (u = Ee({}, u)), t.style = Te(u));
  }
  const o = me(e) ? 1 : tr(e) ? 128 : ao(e) ? 64 : ue(e) ? 4 : q(e) ? 2 : 0;
  return oe(
    e,
    t,
    n,
    i,
    s,
    o,
    r,
    !0
  );
}
function el(e) {
  return e ? Mn(e) || Gs(e) ? Ee({}, e) : e : null;
}
function It(e, t, n = !1, i = !1) {
  const { props: s, ref: r, patchFlag: o, children: l, transition: u } = e, h = t ? Wt(s || {}, t) : s, c = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: h,
    key: h && sr(h),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && r ? V(r) ? r.concat(an(t)) : [r, an(t)] : an(t)
    ) : r,
    scopeId: e.scopeId,
    slotScopeIds: e.slotScopeIds,
    children: l,
    target: e.target,
    targetStart: e.targetStart,
    targetAnchor: e.targetAnchor,
    staticCount: e.staticCount,
    shapeFlag: e.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: t && e.type !== je ? o === -1 ? 16 : o | 16 : o,
    dynamicProps: e.dynamicProps,
    dynamicChildren: e.dynamicChildren,
    appContext: e.appContext,
    dirs: e.dirs,
    transition: u,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: e.component,
    suspense: e.suspense,
    ssContent: e.ssContent && It(e.ssContent),
    ssFallback: e.ssFallback && It(e.ssFallback),
    placeholder: e.placeholder,
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce
  };
  return u && i && di(
    c,
    u.clone(c)
  ), c;
}
function tl(e = " ", t = 0) {
  return We(Fn, null, e, t);
}
function mt(e = "", t = !1) {
  return t ? (ee(), Ze(xt, null, e)) : We(xt, null, e);
}
function Xe(e) {
  return e == null || typeof e == "boolean" ? We(xt) : V(e) ? We(
    je,
    null,
    // #3666, avoid reference pollution when reusing vnode
    e.slice()
  ) : ir(e) ? ht(e) : We(Fn, null, String(e));
}
function ht(e) {
  return e.el === null && e.patchFlag !== -1 || e.memo ? e : It(e);
}
function vi(e, t) {
  let n = 0;
  const { shapeFlag: i } = e;
  if (t == null)
    t = null;
  else if (V(t))
    n = 16;
  else if (typeof t == "object")
    if (i & 65) {
      const s = t.default;
      s && (s._c && (s._d = !1), vi(e, s()), s._c && (s._d = !0));
      return;
    } else {
      n = 32;
      const s = t._;
      !s && !Gs(t) ? t._ctx = Qe : s === 3 && Qe && (Qe.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else q(t) ? (t = { default: t, _ctx: Qe }, n = 32) : (t = String(t), i & 64 ? (n = 16, t = [tl(t)]) : n = 8);
  e.children = t, e.shapeFlag |= n;
}
function Wt(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const i = e[n];
    for (const s in i)
      if (s === "class")
        t.class !== i.class && (t.class = ot([t.class, i.class]));
      else if (s === "style")
        t.style = Te([t.style, i.style]);
      else if (_n(s)) {
        const r = t[s], o = i[s];
        o && r !== o && !(V(r) && r.includes(o)) && (t[s] = r ? [].concat(r, o) : o);
      } else s !== "" && (t[s] = i[s]);
  }
  return t;
}
function Je(e, t, n, i = null) {
  nt(e, t, 7, [
    n,
    i
  ]);
}
const nl = Ws();
let il = 0;
function sl(e, t, n) {
  const i = e.type, s = (t ? t.appContext : e.appContext) || nl, r = {
    uid: il++,
    vnode: e,
    type: i,
    parent: t,
    appContext: s,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    job: null,
    scope: new Mr(
      !0
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: t ? t.provides : Object.create(s.provides),
    ids: t ? t.ids : ["", 0, 0],
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: Js(i, s),
    emitsOptions: Us(i, s),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: le,
    // inheritAttrs
    inheritAttrs: i.inheritAttrs,
    // state
    ctx: le,
    data: le,
    props: le,
    attrs: le,
    slots: le,
    refs: le,
    setupState: le,
    setupContext: null,
    // suspense related
    suspense: n,
    suspenseId: n ? n.pendingId : 0,
    asyncDep: null,
    asyncResolved: !1,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: !1,
    isUnmounted: !1,
    isDeactivated: !1,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  return r.ctx = { _: r }, r.root = t ? t.root : r, r.emit = $o.bind(null, r), e.ce && e.ce(r), r;
}
let De = null;
const rl = () => De || Qe;
let vn, Qn;
{
  const e = wn(), t = (n, i) => {
    let s;
    return (s = e[n]) || (s = e[n] = []), s.push(i), (r) => {
      s.length > 1 ? s.forEach((o) => o(r)) : s[0](r);
    };
  };
  vn = t(
    "__VUE_INSTANCE_SETTERS__",
    (n) => De = n
  ), Qn = t(
    "__VUE_SSR_SETTERS__",
    (n) => Zt = n
  );
}
const nn = (e) => {
  const t = De;
  return vn(e), e.scope.on(), () => {
    e.scope.off(), vn(t);
  };
}, Ni = () => {
  De && De.scope.off(), vn(null);
};
function rr(e) {
  return e.vnode.shapeFlag & 4;
}
let Zt = !1;
function ol(e, t = !1, n = !1) {
  t && Qn(t);
  const { props: i, children: s } = e.vnode, r = rr(e);
  jo(e, i, r, t), qo(e, s, n || t);
  const o = r ? ll(e, t) : void 0;
  return t && Qn(!1), o;
}
function ll(e, t) {
  const n = e.type;
  e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, So);
  const { setup: i } = n;
  if (i) {
    lt();
    const s = e.setupContext = i.length > 1 ? ul(e) : null, r = nn(e), o = tn(
      i,
      e,
      0,
      [
        e.props,
        s
      ]
    ), l = ls(o);
    if (at(), r(), (l || e.sp) && !qt(e) && $s(e), l) {
      if (o.then(Ni, Ni), t)
        return o.then((u) => {
          Li(e, u);
        }).catch((u) => {
          Tn(u, e, 0);
        });
      e.asyncDep = o;
    } else
      Li(e, o);
  } else
    or(e);
}
function Li(e, t, n) {
  q(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : ue(t) && (e.setupState = Os(t)), or(e);
}
function or(e, t, n) {
  const i = e.type;
  e.render || (e.render = i.render || et);
  {
    const s = nn(e);
    lt();
    try {
      Mo(e);
    } finally {
      at(), s();
    }
  }
}
const al = {
  get(e, t) {
    return Me(e, "get", ""), e[t];
  }
};
function ul(e) {
  const t = (n) => {
    e.exposed = n || {};
  };
  return {
    attrs: new Proxy(e.attrs, al),
    slots: e.slots,
    emit: e.emit,
    expose: t
  };
}
function _i(e) {
  return e.exposed ? e.exposeProxy || (e.exposeProxy = new Proxy(Os(Kr(e.exposed)), {
    get(t, n) {
      if (n in t)
        return t[n];
      if (n in Kt)
        return Kt[n](e);
    },
    has(t, n) {
      return n in t || n in Kt;
    }
  })) : e.proxy;
}
function fl(e) {
  return q(e) && "__vccOpts" in e;
}
const fe = (e, t) => eo(e, t, Zt), cl = "3.5.25";
let Zn;
const ki = typeof window < "u" && window.trustedTypes;
if (ki)
  try {
    Zn = /* @__PURE__ */ ki.createPolicy("vue", {
      createHTML: (e) => e
    });
  } catch {
  }
const lr = Zn ? (e) => Zn.createHTML(e) : (e) => e, dl = "http://www.w3.org/2000/svg", hl = "http://www.w3.org/1998/Math/MathML", st = typeof document < "u" ? document : null, Hi = st && /* @__PURE__ */ st.createElement("template"), pl = {
  insert: (e, t, n) => {
    t.insertBefore(e, n || null);
  },
  remove: (e) => {
    const t = e.parentNode;
    t && t.removeChild(e);
  },
  createElement: (e, t, n, i) => {
    const s = t === "svg" ? st.createElementNS(dl, e) : t === "mathml" ? st.createElementNS(hl, e) : n ? st.createElement(e, { is: n }) : st.createElement(e);
    return e === "select" && i && i.multiple != null && s.setAttribute("multiple", i.multiple), s;
  },
  createText: (e) => st.createTextNode(e),
  createComment: (e) => st.createComment(e),
  setText: (e, t) => {
    e.nodeValue = t;
  },
  setElementText: (e, t) => {
    e.textContent = t;
  },
  parentNode: (e) => e.parentNode,
  nextSibling: (e) => e.nextSibling,
  querySelector: (e) => st.querySelector(e),
  setScopeId(e, t) {
    e.setAttribute(t, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(e, t, n, i, s, r) {
    const o = n ? n.previousSibling : t.lastChild;
    if (s && (s === r || s.nextSibling))
      for (; t.insertBefore(s.cloneNode(!0), n), !(s === r || !(s = s.nextSibling)); )
        ;
    else {
      Hi.innerHTML = lr(
        i === "svg" ? `<svg>${e}</svg>` : i === "mathml" ? `<math>${e}</math>` : e
      );
      const l = Hi.content;
      if (i === "svg" || i === "mathml") {
        const u = l.firstChild;
        for (; u.firstChild; )
          l.appendChild(u.firstChild);
        l.removeChild(u);
      }
      t.insertBefore(l, n);
    }
    return [
      // first
      o ? o.nextSibling : t.firstChild,
      // last
      n ? n.previousSibling : t.lastChild
    ];
  }
}, gl = Symbol("_vtc");
function ml(e, t, n) {
  const i = e[gl];
  i && (t = (t ? [t, ...i] : [...i]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
const Wi = Symbol("_vod"), vl = Symbol("_vsh"), _l = Symbol(""), xl = /(?:^|;)\s*display\s*:/;
function yl(e, t, n) {
  const i = e.style, s = me(n);
  let r = !1;
  if (n && !s) {
    if (t)
      if (me(t))
        for (const o of t.split(";")) {
          const l = o.slice(0, o.indexOf(":")).trim();
          n[l] == null && un(i, l, "");
        }
      else
        for (const o in t)
          n[o] == null && un(i, o, "");
    for (const o in n)
      o === "display" && (r = !0), un(i, o, n[o]);
  } else if (s) {
    if (t !== n) {
      const o = i[_l];
      o && (n += ";" + o), i.cssText = n, r = xl.test(n);
    }
  } else t && e.removeAttribute("style");
  Wi in e && (e[Wi] = r ? i.display : "", e[vl] && (i.display = "none"));
}
const ji = /\s*!important$/;
function un(e, t, n) {
  if (V(n))
    n.forEach((i) => un(e, t, i));
  else if (n == null && (n = ""), t.startsWith("--"))
    e.setProperty(t, n);
  else {
    const i = bl(e, t);
    ji.test(n) ? e.setProperty(
      Et(i),
      n.replace(ji, ""),
      "important"
    ) : e[i] = n;
  }
}
const Bi = ["Webkit", "Moz", "ms"], jn = {};
function bl(e, t) {
  const n = jn[t];
  if (n)
    return n;
  let i = vt(t);
  if (i !== "filter" && i in e)
    return jn[t] = i;
  i = fs(i);
  for (let s = 0; s < Bi.length; s++) {
    const r = Bi[s] + i;
    if (r in e)
      return jn[t] = r;
  }
  return t;
}
const Vi = "http://www.w3.org/1999/xlink";
function Ui(e, t, n, i, s, r = Sr(t)) {
  i && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(Vi, t.slice(6, t.length)) : e.setAttributeNS(Vi, t, n) : n == null || r && !ds(n) ? e.removeAttribute(t) : e.setAttribute(
    t,
    r ? "" : yt(n) ? String(n) : n
  );
}
function qi(e, t, n, i, s) {
  if (t === "innerHTML" || t === "textContent") {
    n != null && (e[t] = t === "innerHTML" ? lr(n) : n);
    return;
  }
  const r = e.tagName;
  if (t === "value" && r !== "PROGRESS" && // custom elements may use _value internally
  !r.includes("-")) {
    const l = r === "OPTION" ? e.getAttribute("value") || "" : e.value, u = n == null ? (
      // #11647: value should be set as empty string for null and undefined,
      // but <input type="checkbox"> should be set as 'on'.
      e.type === "checkbox" ? "on" : ""
    ) : String(n);
    (l !== u || !("_value" in e)) && (e.value = u), n == null && e.removeAttribute(t), e._value = n;
    return;
  }
  let o = !1;
  if (n === "" || n == null) {
    const l = typeof e[t];
    l === "boolean" ? n = ds(n) : n == null && l === "string" ? (n = "", o = !0) : l === "number" && (n = 0, o = !0);
  }
  try {
    e[t] = n;
  } catch {
  }
  o && e.removeAttribute(s || t);
}
function wl(e, t, n, i) {
  e.addEventListener(t, n, i);
}
function Sl(e, t, n, i) {
  e.removeEventListener(t, n, i);
}
const Ki = Symbol("_vei");
function Ml(e, t, n, i, s = null) {
  const r = e[Ki] || (e[Ki] = {}), o = r[t];
  if (i && o)
    o.value = i;
  else {
    const [l, u] = Tl(t);
    if (i) {
      const h = r[t] = Al(
        i,
        s
      );
      wl(e, l, h, u);
    } else o && (Sl(e, l, o, u), r[t] = void 0);
  }
}
const Gi = /(?:Once|Passive|Capture)$/;
function Tl(e) {
  let t;
  if (Gi.test(e)) {
    t = {};
    let i;
    for (; i = e.match(Gi); )
      e = e.slice(0, e.length - i[0].length), t[i[0].toLowerCase()] = !0;
  }
  return [e[2] === ":" ? e.slice(3) : Et(e.slice(2)), t];
}
let Bn = 0;
const El = /* @__PURE__ */ Promise.resolve(), Cl = () => Bn || (El.then(() => Bn = 0), Bn = Date.now());
function Al(e, t) {
  const n = (i) => {
    if (!i._vts)
      i._vts = Date.now();
    else if (i._vts <= n.attached)
      return;
    nt(
      Ol(i, n.value),
      t,
      5,
      [i]
    );
  };
  return n.value = e, n.attached = Cl(), n;
}
function Ol(e, t) {
  if (V(t)) {
    const n = e.stopImmediatePropagation;
    return e.stopImmediatePropagation = () => {
      n.call(e), e._stopped = !0;
    }, t.map(
      (i) => (s) => !s._stopped && i && i(s)
    );
  } else
    return t;
}
const zi = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // lowercase letter
e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Fl = (e, t, n, i, s, r) => {
  const o = s === "svg";
  t === "class" ? ml(e, i, o) : t === "style" ? yl(e, n, i) : _n(t) ? ni(t) || Ml(e, t, n, i, r) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : Dl(e, t, i, o)) ? (qi(e, t, i), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Ui(e, t, i, o, r, t !== "value")) : /* #11081 force set props for possible async custom element */ e._isVueCE && (/[A-Z]/.test(t) || !me(i)) ? qi(e, vt(t), i, r, t) : (t === "true-value" ? e._trueValue = i : t === "false-value" && (e._falseValue = i), Ui(e, t, i, o));
};
function Dl(e, t, n, i) {
  if (i)
    return !!(t === "innerHTML" || t === "textContent" || t in e && zi(t) && q(n));
  if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA")
    return !1;
  if (t === "width" || t === "height") {
    const s = e.tagName;
    if (s === "IMG" || s === "VIDEO" || s === "CANVAS" || s === "SOURCE")
      return !1;
  }
  return zi(t) && me(n) ? !1 : t in e;
}
const Rl = /* @__PURE__ */ Ee({ patchProp: Fl }, pl);
let Ji;
function Pl() {
  return Ji || (Ji = Go(Rl));
}
const ar = ((...e) => {
  const t = Pl().createApp(...e), { mount: n } = t;
  return t.mount = (i) => {
    const s = $l(i);
    if (!s) return;
    const r = t._component;
    !q(r) && !r.render && !r.template && (r.template = s.innerHTML), s.nodeType === 1 && (s.textContent = "");
    const o = n(s, !1, Il(s));
    return s instanceof Element && (s.removeAttribute("v-cloak"), s.setAttribute("data-v-app", "")), o;
  }, t;
});
function Il(e) {
  if (e instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement)
    return "mathml";
}
function $l(e) {
  return me(e) ? document.querySelector(e) : e;
}
const ur = Symbol(
  "countdownGoalsTextEffects"
);
function Yi(e) {
  const t = window.$, n = window.TextEffects;
  typeof t != "function" || !n?.updateWaveChars || document.querySelectorAll(".countdown-goals-text").forEach((i) => {
    n.updateWaveChars(t(i), e);
  });
}
const _e = (e) => {
  const t = window.settings;
  if (t) {
    if (typeof t.get == "function") {
      const n = t.get(e);
      if (n != null) return n;
    }
    return t[e];
  }
}, Dn = /* @__PURE__ */ Ue({
  __name: "CountdownGoalsValueLine",
  props: {
    prefix: {},
    suffix: {},
    displayValue: {},
    valueStyles: {},
    lineStyles: {},
    bold: { type: Boolean },
    lineBreak: { type: Boolean },
    lineClass: {},
    textEffectsActive: { type: Boolean },
    freezeTextForWave: { type: Boolean }
  },
  setup(e) {
    const t = e, n = Gt(ur, null), i = J(null), s = fe(() => ({
      ...t.lineStyles,
      color: t.valueStyles.color
    })), r = fe(() => {
      const o = [];
      return t.prefix && o.push(t.prefix), o.push(String(t.displayValue)), t.suffix && o.push(t.suffix), o.join(" ");
    });
    return tt(
      r,
      async (o) => {
        !t.freezeTextForWave || !n?.needsWaveSafeText() || (await En(), i.value && n.syncLineText(o));
      }
    ), (o, l) => (ee(), pe(
      "div",
      {
        class: ot([
          e.lineClass ?? "flex items-center gap-2 text-3xl",
          e.bold && "font-bold",
          e.lineBreak && "flex-wrap"
        ])
      },
      [
        e.textEffectsActive && e.freezeTextForWave ? (ee(), pe(
          "span",
          {
            key: 0,
            ref_key: "textEffectEl",
            ref: i,
            class: "countdown-goals-text",
            style: Te(e.lineStyles)
          },
          null,
          4
          /* STYLE */
        )) : e.textEffectsActive ? (ee(), pe(
          "span",
          {
            key: 1,
            class: "countdown-goals-text",
            style: Te(e.lineStyles)
          },
          $e(r.value),
          5
          /* TEXT, STYLE */
        )) : (ee(), pe(
          je,
          { key: 2 },
          [
            e.prefix ? (ee(), pe(
              "span",
              {
                key: 0,
                style: Te(e.lineStyles)
              },
              $e(e.prefix),
              5
              /* TEXT, STYLE */
            )) : mt("v-if", !0),
            oe(
              "span",
              {
                class: ot(["countdown-goals-value", e.lineBreak && "w-full basis-full"]),
                style: Te(s.value)
              },
              $e(e.displayValue),
              7
              /* TEXT, CLASS, STYLE */
            ),
            e.suffix ? (ee(), pe(
              "span",
              {
                key: 1,
                style: Te(e.lineStyles)
              },
              $e(e.suffix),
              5
              /* TEXT, STYLE */
            )) : mt("v-if", !0)
          ],
          64
          /* STABLE_FRAGMENT */
        ))
      ],
      2
      /* CLASS */
    ));
  }
});
function Nl(e = 0) {
  const t = J(e);
  return { value: t, animateTo: (i, s = 500, r = (l) => 1 - Math.pow(1 - l, 3), o) => {
    const l = t.value, u = Date.now(), h = () => {
      const c = Date.now() - u, p = Math.min(c / s, 1), y = r(p);
      t.value = Math.floor(l + (i - l) * y), p < 1 ? requestAnimationFrame(h) : (t.value = i, o?.());
    };
    requestAnimationFrame(h);
  } };
}
function en(e, t = {}) {
  const n = t.duration ?? 1e3, i = t.animate !== !1, { value: s, animateTo: r } = Nl(e.value);
  return tt(e, (o) => {
    if (!i) {
      s.value = o;
      return;
    }
    r(o, n);
  }), s;
}
const Ll = /* @__PURE__ */ Ue({
  __name: "VariantDefault",
  props: {
    prefix: {},
    suffix: {},
    remaining: {},
    valueStyles: {},
    lineStyles: {},
    bold: { type: Boolean },
    freezeTextForWave: { type: Boolean }
  },
  setup(e) {
    const t = e, n = en(cn(t, "remaining"), {
      animate: !t.freezeTextForWave
    });
    return (i, s) => (ee(), Ze(Dn, {
      prefix: e.prefix,
      suffix: e.suffix,
      "display-value": _t(n),
      "value-styles": e.valueStyles,
      "line-styles": e.lineStyles,
      bold: e.bold,
      "freeze-text-for-wave": e.freezeTextForWave
    }, null, 8, ["prefix", "suffix", "display-value", "value-styles", "line-styles", "bold", "freeze-text-for-wave"]));
  }
}), kl = "inline-flex items-center gap-2 text-3xl whitespace-nowrap pl-[100%] will-change-transform", Hl = /* @__PURE__ */ Ue({
  __name: "VariantMarquee",
  props: {
    prefix: {},
    suffix: {},
    remaining: {},
    valueStyles: {},
    lineStyles: {},
    bold: { type: Boolean },
    textEffectsActive: { type: Boolean },
    freezeTextForWave: { type: Boolean },
    marqueeSpeed: {}
  },
  setup(e) {
    const t = e, n = en(cn(t, "remaining"), {
      animate: !t.freezeTextForWave
    });
    return (i, s) => (ee(), pe(
      "div",
      {
        class: "w-full overflow-hidden",
        style: Te(e.lineStyles)
      },
      [
        We(Dn, {
          "line-class": kl,
          class: ot({
            "animate-marquee-slow": e.marqueeSpeed === "slow",
            "animate-marquee-medium": e.marqueeSpeed === "medium",
            "animate-marquee-fast": e.marqueeSpeed === "fast"
          }),
          prefix: e.prefix,
          suffix: e.suffix,
          "display-value": _t(n),
          "value-styles": e.valueStyles,
          "line-styles": e.lineStyles,
          bold: e.bold,
          "text-effects-active": e.textEffectsActive,
          "freeze-text-for-wave": e.freezeTextForWave
        }, null, 8, ["class", "prefix", "suffix", "display-value", "value-styles", "line-styles", "bold", "text-effects-active", "freeze-text-for-wave"])
      ],
      4
      /* STYLE */
    ));
  }
}), Wl = { class: "flip-digit" }, jl = { class: "flip-digit__half flip-digit__half--top flip-digit__back" }, Bl = { class: "flip-digit__value" }, Vl = { class: "flip-digit__half flip-digit__half--bottom flip-digit__back" }, Ul = { class: "flip-digit__value" }, ql = { class: "flip-digit__value" }, Kl = { class: "flip-digit__value" }, Gl = /* @__PURE__ */ Ue({
  __name: "OdometerFlippingDigit",
  props: {
    digit: {},
    flipDurationMs: {}
  },
  setup(e) {
    const t = e, n = J(t.digit), i = J(t.digit), s = J(t.digit), r = J("idle"), o = J(0);
    let l = null, u = null, h = null;
    const c = fe(() => r.value !== "idle"), p = fe(() => t.flipDurationMs ?? 150), y = fe(() => `${p.value}ms`), A = fe(() => {
      const F = Math.floor(p.value / 2), Y = p.value <= 100 ? 40 : 80;
      return Math.max(Y, F);
    }), P = fe(() => `${A.value}ms`), D = fe(() => n.value), Z = fe(() => n.value), I = () => {
      u !== null && (clearTimeout(u), u = null), h !== null && (clearTimeout(h), h = null);
    }, W = (F) => {
      if (F === n.value && !c.value) return;
      if (c.value) {
        l = F;
        return;
      }
      i.value = n.value, s.value = F, o.value += 1, r.value = "top";
      const Y = o.value, ae = A.value;
      I(), u = window.setTimeout(() => {
        o.value !== Y || r.value !== "top" || (n.value = s.value, r.value = "bottom", h = window.setTimeout(() => {
          o.value !== Y || r.value !== "bottom" || K();
        }, ae));
      }, ae);
    }, K = async () => {
      I(), r.value = "idle";
      const F = l;
      l = null, !(F === null || F === n.value) && (await En(), W(F));
    };
    return tt(
      () => t.digit,
      (F) => {
        W(F);
      }
    ), An(() => {
      I();
    }), (F, Y) => (ee(), pe("span", Wl, [
      oe(
        "span",
        {
          class: "flip-digit__viewport",
          style: Te({
            "--flip-duration": y.value,
            "--flip-half-duration": P.value
          })
        },
        [
          oe("span", jl, [
            oe(
              "span",
              Bl,
              $e(D.value),
              1
              /* TEXT */
            )
          ]),
          oe("span", Vl, [
            oe(
              "span",
              Ul,
              $e(Z.value),
              1
              /* TEXT */
            )
          ]),
          c.value ? (ee(), pe(
            je,
            { key: 0 },
            [
              r.value === "top" || r.value === "bottom" ? (ee(), pe("span", {
                key: `top-${o.value}`,
                class: "flip-digit__half flip-digit__half--top flip-digit__fold-top"
              }, [
                oe(
                  "span",
                  ql,
                  $e(i.value),
                  1
                  /* TEXT */
                )
              ])) : mt("v-if", !0),
              r.value === "bottom" ? (ee(), pe("span", {
                key: `bottom-${o.value}`,
                class: "flip-digit__half flip-digit__half--bottom flip-digit__fold-bottom"
              }, [
                oe(
                  "span",
                  Kl,
                  $e(s.value),
                  1
                  /* TEXT */
                )
              ])) : mt("v-if", !0)
            ],
            64
            /* STABLE_FRAGMENT */
          )) : mt("v-if", !0)
        ],
        4
        /* STYLE */
      )
    ]));
  }
}), sn = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [i, s] of t)
    n[i] = s;
  return n;
}, zl = /* @__PURE__ */ sn(Gl, [["__scopeId", "data-v-ce8605b0"]]), Jl = {
  class: "flipping-odometer-number",
  "aria-hidden": "true"
}, Yl = /* @__PURE__ */ Ue({
  __name: "FlippingOdometerNumber",
  props: {
    slots: {},
    flipDurationMs: {}
  },
  setup(e) {
    return (t, n) => (ee(), pe("div", Jl, [
      (ee(!0), pe(
        je,
        null,
        wo(e.slots, (i) => (ee(), Ze(zl, {
          key: i.positionKey,
          digit: i.digit,
          "flip-duration-ms": e.flipDurationMs
        }, null, 8, ["digit", "flip-duration-ms"]))),
        128
        /* KEYED_FRAGMENT */
      ))
    ]));
  }
}), Xl = /* @__PURE__ */ sn(Yl, [["__scopeId", "data-v-aa25076c"]]);
function Ql(e) {
  var t = typeof e;
  return e != null && (t == "object" || t == "function");
}
const Zl = ["[object AsyncFunction]", "[object Function]", "[object GeneratorFunction]", "[object Proxy]"];
function ge(e) {
  if (!Ql(e))
    return !1;
  var t = Object.prototype.toString.call(e);
  return Zl.includes(t);
}
var ea = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, ei = { exports: {} };
(function(e, t) {
  (function() {
    var n, i, s, r, o, l, u, h, c, p, y, A, P, D, Z, I, W, K, F, Y, ae, de, xe, we, ye, Ce, Ae, U, Se, qe, ve, se, X = [].slice;
    W = '<span class="odometer-value"></span>', D = '<span class="odometer-ribbon"><span class="odometer-ribbon-inner">' + W + "</span></span>", r = '<span class="odometer-digit"><span class="odometer-digit-spacer">8</span><span class="odometer-digit-inner">' + D + "</span></span>", u = '<span class="odometer-formatting-mark"></span>', s = "(,ddd).dd", h = /^\(?([^)]*)\)?(?:(.)(d+))?$/, c = 30, l = 2e3, n = 20, p = 2, o = 0.5, y = 1e3 / c, i = 1e3 / n, Z = "transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd", ye = document.createElement("div").style, I = ye.transition != null || ye.webkitTransition != null || ye.mozTransition != null || ye.oTransition != null, xe = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame, A = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver, F = function(E) {
      var g;
      return g = document.createElement("div"), g.innerHTML = E, g.children[0];
    }, de = function(E, g) {
      return E.className = E.className.replace(new RegExp("(^| )" + g.split(" ").join("|") + "( |$)", "gi"), " ");
    }, K = function(E, g) {
      return de(E, g), E.className += " " + g;
    }, Ce = function(E, g) {
      var M;
      if (document.createEvent != null)
        return M = document.createEvent("HTMLEvents"), M.initEvent(g, !0, !0), E.dispatchEvent(M);
    }, ae = function() {
      var E, g;
      return (E = (g = window.performance) != null && typeof g.now == "function" ? g.now() : void 0) != null ? E : +/* @__PURE__ */ new Date();
    }, we = function(E, g) {
      return g == null && (g = 0), g ? (E *= Math.pow(10, g), E += 0.5, E = Math.floor(E), E /= Math.pow(10, g)) : Math.round(E);
    }, Ae = function(E) {
      return E < 0 ? Math.ceil(E) : Math.floor(E);
    }, Y = function(E) {
      return E - we(E);
    }, Se = !1, (U = function() {
      var E, g, M, C, $;
      if (!Se && window.jQuery != null) {
        for (Se = !0, C = ["html", "text"], $ = [], g = 0, M = C.length; g < M; g++)
          E = C[g], $.push((function(R) {
            var H;
            return H = window.jQuery.fn[R], window.jQuery.fn[R] = function(B) {
              var G;
              return B == null || ((G = this[0]) != null ? G.odometer : void 0) == null ? H.apply(this, arguments) : this[0].odometer.update(B);
            };
          })(E));
        return $;
      }
    })(), setTimeout(U, 0), P = (function() {
      function E(g) {
        var M, C, $, R, H, B, G, he, ce, b = this;
        if (this.options = g, this.el = this.options.el, this.el.odometer != null)
          return this.el.odometer;
        this.el.odometer = this, G = E.options;
        for (M in G)
          $ = G[M], this.options[M] == null && (this.options[M] = $);
        (R = this.options).duration == null && (R.duration = l), this.MAX_VALUES = this.options.duration / y / p | 0, this.resetFormat(), this.value = this.cleanValue((he = this.options.value) != null ? he : ""), this.renderInside(), this.render();
        try {
          for (ce = ["innerHTML", "innerText", "textContent"], H = 0, B = ce.length; H < B; H++)
            C = ce[H], this.el[C] != null && (function(j) {
              return Object.defineProperty(b.el, j, {
                get: function() {
                  var a;
                  return j === "innerHTML" ? b.inside.outerHTML : (a = b.inside.innerText) != null ? a : b.inside.textContent;
                },
                set: function(a) {
                  return b.update(a);
                }
              });
            })(C);
        } catch {
          this.watchForMutations();
        }
      }
      return E.prototype.renderInside = function() {
        return this.inside = document.createElement("div"), this.inside.className = "odometer-inside", this.el.innerHTML = "", this.el.appendChild(this.inside);
      }, E.prototype.watchForMutations = function() {
        var g = this;
        if (A != null)
          try {
            return this.observer == null && (this.observer = new A(function(M) {
              var C;
              return C = g.el.innerText, g.renderInside(), g.render(g.value), g.update(C);
            })), this.watchMutations = !0, this.startWatchingMutations();
          } catch {
          }
      }, E.prototype.startWatchingMutations = function() {
        if (this.watchMutations)
          return this.observer.observe(this.el, {
            childList: !0
          });
      }, E.prototype.stopWatchingMutations = function() {
        var g;
        return (g = this.observer) != null ? g.disconnect() : void 0;
      }, E.prototype.cleanValue = function(g) {
        var M;
        return typeof g == "string" && (g = g.replace((M = this.format.radix) != null ? M : ".", "<radix>"), g = g.replace(/[.,]/g, ""), g = g.replace("<radix>", "."), g = parseFloat(g, 10) || 0), we(g, this.format.precision);
      }, E.prototype.bindTransitionEnd = function() {
        var g, M, C, $, R, H, B = this;
        if (!this.transitionEndBound) {
          for (this.transitionEndBound = !0, M = !1, R = Z.split(" "), H = [], C = 0, $ = R.length; C < $; C++)
            g = R[C], H.push(this.el.addEventListener(g, function() {
              return M || (M = !0, setTimeout(function() {
                return B.render(), M = !1, Ce(B.el, "odometerdone");
              }, 0)), !0;
            }, !1));
          return H;
        }
      }, E.prototype.resetFormat = function() {
        var g, M, C, $, R, H, B, G;
        if (g = (B = this.options.format) != null ? B : s, g || (g = "d"), C = h.exec(g), !C)
          throw new Error("Odometer: Unparsable digit format");
        return G = C.slice(1, 4), H = G[0], R = G[1], M = G[2], $ = M?.length || 0, this.format = {
          repeating: H,
          radix: R,
          precision: $
        };
      }, E.prototype.render = function(g) {
        var M, C, $, R, H, B, G;
        for (g == null && (g = this.value), this.stopWatchingMutations(), this.resetFormat(), this.inside.innerHTML = "", H = this.options.theme, M = this.el.className.split(" "), R = [], B = 0, G = M.length; B < G; B++)
          if (C = M[B], !!C.length) {
            if ($ = /^odometer-theme-(.+)$/.exec(C)) {
              H = $[1];
              continue;
            }
            /^odometer(-|$)/.test(C) || R.push(C);
          }
        return R.push("odometer"), I || R.push("odometer-no-transitions"), H ? R.push("odometer-theme-" + H) : R.push("odometer-auto-theme"), this.el.className = R.join(" "), this.ribbons = {}, this.formatDigits(g), this.startWatchingMutations();
      }, E.prototype.formatDigits = function(g) {
        var M, C, $, R, H, B, G, he, ce, b;
        if (this.digits = [], this.options.formatFunction)
          for ($ = this.options.formatFunction(g), ce = $.split("").reverse(), H = 0, G = ce.length; H < G; H++)
            C = ce[H], C.match(/0-9/) ? (M = this.renderDigit(), M.querySelector(".odometer-value").innerHTML = C, this.digits.push(M), this.insertDigit(M)) : this.addSpacer(C);
        else
          for (R = !this.format.precision || !Y(g) || !1, b = g.toString().split("").reverse(), B = 0, he = b.length; B < he; B++)
            M = b[B], M === "." && (R = !0), this.addDigit(M, R);
      }, E.prototype.update = function(g) {
        var M, C = this;
        if (g = this.cleanValue(g), !!(M = g - this.value))
          return de(this.el, "odometer-animating-up odometer-animating-down odometer-animating"), M > 0 ? K(this.el, "odometer-animating-up") : K(this.el, "odometer-animating-down"), this.stopWatchingMutations(), this.animate(g), this.startWatchingMutations(), setTimeout(function() {
            return C.el.offsetHeight, K(C.el, "odometer-animating");
          }, 0), this.value = g;
      }, E.prototype.renderDigit = function() {
        return F(r);
      }, E.prototype.insertDigit = function(g, M) {
        return M != null ? this.inside.insertBefore(g, M) : this.inside.children.length ? this.inside.insertBefore(g, this.inside.children[0]) : this.inside.appendChild(g);
      }, E.prototype.addSpacer = function(g, M, C) {
        var $;
        return $ = F(u), $.innerHTML = g, C && K($, C), this.insertDigit($, M);
      }, E.prototype.addDigit = function(g, M) {
        var C, $, R, H;
        if (M == null && (M = !0), g === "-")
          return this.addSpacer(g, null, "odometer-negation-mark");
        if (g === ".")
          return this.addSpacer((H = this.format.radix) != null ? H : ".", null, "odometer-radix-mark");
        if (M)
          for (R = !1; ; ) {
            if (!this.format.repeating.length) {
              if (R)
                throw new Error("Bad odometer format without digits");
              this.resetFormat(), R = !0;
            }
            if (C = this.format.repeating[this.format.repeating.length - 1], this.format.repeating = this.format.repeating.substring(0, this.format.repeating.length - 1), C === "d")
              break;
            this.addSpacer(C);
          }
        return $ = this.renderDigit(), $.querySelector(".odometer-value").innerHTML = g, this.digits.push($), this.insertDigit($);
      }, E.prototype.animate = function(g) {
        return !I || this.options.animation === "count" ? this.animateCount(g) : this.animateSlide(g);
      }, E.prototype.animateCount = function(g) {
        var M, C, $, R, H, B = this;
        if (C = +g - this.value)
          return R = $ = ae(), M = this.value, (H = function() {
            var G, he, ce;
            if (ae() - R > B.options.duration) {
              B.value = g, B.render(), Ce(B.el, "odometerdone");
              return;
            }
            return G = ae() - $, G > i && ($ = ae(), ce = G / B.options.duration, he = C * ce, M += he, B.render(Math.round(M))), xe != null ? xe(H) : setTimeout(H, i);
          })();
      }, E.prototype.getDigitCount = function() {
        var g, M, C, $, R, H;
        for ($ = 1 <= arguments.length ? X.call(arguments, 0) : [], g = R = 0, H = $.length; R < H; g = ++R)
          C = $[g], $[g] = Math.abs(C);
        return M = Math.max.apply(Math, $), Math.ceil(Math.log(M + 1) / Math.log(10));
      }, E.prototype.getFractionalDigitCount = function() {
        var g, M, C, $, R, H, B;
        for (R = 1 <= arguments.length ? X.call(arguments, 0) : [], M = /^\-?\d*\.(\d*?)0*$/, g = H = 0, B = R.length; H < B; g = ++H)
          $ = R[g], R[g] = $.toString(), C = M.exec(R[g]), C == null ? R[g] = 0 : R[g] = C[1].length;
        return Math.max.apply(Math, R);
      }, E.prototype.resetDigits = function() {
        return this.digits = [], this.ribbons = [], this.inside.innerHTML = "", this.resetFormat();
      }, E.prototype.animateSlide = function(g) {
        var M, C, $, R, H, B, G, he, ce, b, j, a, f, d, _, m, v, T, S, w, x, L, O, N, k, z, ne;
        if (m = this.value, he = this.getFractionalDigitCount(m, g), he && (g = g * Math.pow(10, he), m = m * Math.pow(10, he)), !!($ = g - m)) {
          for (this.bindTransitionEnd(), R = this.getDigitCount(m, g), H = [], M = 0, j = S = 0; 0 <= R ? S < R : S > R; j = 0 <= R ? ++S : --S) {
            if (v = Ae(m / Math.pow(10, R - j - 1)), G = Ae(g / Math.pow(10, R - j - 1)), B = G - v, Math.abs(B) > this.MAX_VALUES) {
              for (b = [], a = B / (this.MAX_VALUES + this.MAX_VALUES * M * o), C = v; B > 0 && C < G || B < 0 && C > G; )
                b.push(Math.round(C)), C += a;
              b[b.length - 1] !== G && b.push(G), M++;
            } else
              b = (function() {
                ne = [];
                for (var Q = v; v <= G ? Q <= G : Q >= G; v <= G ? Q++ : Q--)
                  ne.push(Q);
                return ne;
              }).apply(this);
            for (j = w = 0, L = b.length; w < L; j = ++w)
              ce = b[j], b[j] = Math.abs(ce % 10);
            H.push(b);
          }
          for (this.resetDigits(), z = H.reverse(), j = x = 0, O = z.length; x < O; j = ++x)
            for (b = z[j], this.digits[j] || this.addDigit(" ", j >= he), (T = this.ribbons)[j] == null && (T[j] = this.digits[j].querySelector(".odometer-ribbon-inner")), this.ribbons[j].innerHTML = "", $ < 0 && (b = b.reverse()), f = k = 0, N = b.length; k < N; f = ++k)
              ce = b[f], _ = document.createElement("div"), _.className = "odometer-value", _.innerHTML = ce, this.ribbons[j].appendChild(_), f === b.length - 1 && K(_, "odometer-last-value"), f === 0 && K(_, "odometer-first-value");
          if (v < 0 && this.addDigit("-"), d = this.inside.querySelector(".odometer-radix-mark"), d?.parent.removeChild(d), he)
            return this.addSpacer(this.format.radix, this.digits[he - 1], "odometer-radix-mark");
        }
      }, E;
    })(), P.options = (ve = window.odometerOptions) != null ? ve : {}, setTimeout(function() {
      var E, g, M, C, $;
      if (window.odometerOptions) {
        C = window.odometerOptions, $ = [];
        for (E in C)
          g = C[E], $.push((M = P.options)[E] != null ? (M = P.options)[E] : M[E] = g);
        return $;
      }
    }, 0), P.init = function() {
      var E, g, M, C, $, R;
      if (document.querySelectorAll != null) {
        for (g = document.querySelectorAll(P.options.selector || ".odometer"), R = [], M = 0, C = g.length; M < C; M++)
          E = g[M], R.push(E.odometer = new P({
            el: E,
            value: ($ = E.innerText) != null ? $ : E.textContent
          }));
        return R;
      }
    }, ((se = document.documentElement) != null ? se.doScroll : void 0) != null && document.createEventObject != null ? (qe = document.onreadystatechange, document.onreadystatechange = function() {
      return document.readyState === "complete" && P.options.auto !== !1 && P.init(), qe?.apply(this, arguments);
    }) : document.addEventListener("DOMContentLoaded", function() {
      if (P.options.auto !== !1)
        return P.init();
    }, !1), t !== null ? e.exports = P : window.Odometer = P;
  }).call(ea);
})(ei, ei.exports);
var Xi = ei.exports;
const ta = /* @__PURE__ */ Ue({
  __name: "Odometer",
  props: {
    value: {
      type: Number,
      required: !1,
      default: 0
    },
    format: {
      type: String,
      required: !1
    },
    theme: {
      type: String,
      required: !1,
      default: "default"
    },
    duration: {
      type: Number,
      required: !1
    },
    animation: {
      type: String,
      required: !1
    },
    formatFunction: {
      type: Function,
      required: !1
    }
  },
  emits: ["ready"],
  setup(e, { expose: t, emit: n }) {
    const i = e, s = J(null), r = J(null);
    tt(() => i.value, (U) => {
      s.value && ge(s.value.update) && s.value.update(U);
    }, {
      deep: !1
    });
    function o() {
      typeof window > "u" || (window.odometerOptions ? window.odometerOptions.auto = !1 : window.odometerOptions = {
        auto: !1
      });
    }
    function l() {
      if (s.value)
        return;
      o();
      const U = new Xi({
        el: r.value,
        value: i.value,
        format: i.format,
        theme: i.theme,
        duration: i.duration,
        animation: i.animation,
        formatFunction: i.formatFunction
      });
      U.render(), n("ready", U, Xi), s.value = U;
    }
    function u() {
      s.value = null;
    }
    function h() {
      s.value && ge(s.value.renderInside) && s.value.renderInside();
    }
    function c() {
      s.value && ge(s.value.watchForMutations) && s.value.watchForMutations();
    }
    function p() {
      s.value && ge(s.value.startWatchingMutations) && s.value.startWatchingMutations();
    }
    function y() {
      s.value && ge(s.value.stopWatchingMutations) && s.value.stopWatchingMutations();
    }
    function A(U) {
      s.value && ge(s.value.cleanValue) && s.value.cleanValue(U);
    }
    function P() {
      s.value && ge(s.value.bindTransitionEnd) && s.value.bindTransitionEnd();
    }
    function D() {
      s.value && ge(s.value.resetFormat) && s.value.resetFormat();
    }
    function Z() {
      s.value && ge(s.value.renderDigit) && s.value.renderDigit();
    }
    function I(U) {
      s.value && ge(s.value.formatDigits) && s.value.formatDigits(U);
    }
    function W(U, Se) {
      s.value && ge(s.value.insertDigit) && s.value.insertDigit(U, Se);
    }
    function K(U, Se) {
      s.value && ge(s.value.addDigit) && s.value.addDigit(U, Se);
    }
    function F(U, Se, qe) {
      s.value && ge(s.value.addSpacer) && s.value.addSpacer(U, Se, qe);
    }
    function Y(U) {
      s.value && ge(s.value.animate) && s.value.animate(U);
    }
    function ae(U) {
      s.value && ge(s.value.animateCount) && s.value.animateCount(U);
    }
    function de() {
      s.value && ge(s.value.getDigitCount) && s.value.getDigitCount();
    }
    function xe() {
      s.value && ge(s.value.getFractionalDigitCount) && s.value.getFractionalDigitCount();
    }
    function we() {
      s.value && ge(s.value.resetDigits) && s.value.resetDigits();
    }
    function ye(U) {
      s.value && ge(s.value.animateSlide) && s.value.animateSlide(U);
    }
    function Ce(U) {
      s.value && ge(s.value.render) && s.value.render(U);
    }
    function Ae(U) {
      s.value && ge(s.value.update) && s.value.update(U);
    }
    return hi(() => {
      l();
    }), pi(() => {
      u();
    }), t({
      instance: s,
      init: l,
      uninit: u,
      renderInside: h,
      watchForMutations: c,
      startWatchingMutations: p,
      stopWatchingMutations: y,
      cleanValue: A,
      bindTransitionEnd: P,
      resetFormat: D,
      renderDigit: Z,
      formatDigits: I,
      insertDigit: W,
      addDigit: K,
      addSpacer: F,
      animate: Y,
      animateCount: ae,
      getDigitCount: de,
      getFractionalDigitCount: xe,
      resetDigits: we,
      animateSlide: ye,
      render: Ce,
      update: Ae
    }), (U, Se) => (ee(), pe("span", {
      ref_key: "numRef",
      ref: r
    }, null, 512));
  }
}), na = { class: "odometer-counter" }, ia = /* @__PURE__ */ Ue({
  __name: "OdometerNumber",
  props: {
    value: {}
  },
  setup(e) {
    return (t, n) => (ee(), pe("span", na, [
      We(_t(ta), {
        value: e.value,
        format: "(,ddd)"
      }, null, 8, ["value"])
    ]));
  }
}), sa = /* @__PURE__ */ sn(ia, [["__scopeId", "data-v-1bd38ed1"]]), ra = {
  class: "countdown-goals__odometer-rotate",
  "aria-hidden": "true"
}, oa = /* @__PURE__ */ Ue({
  __name: "RotatingOdometerNumber",
  props: {
    value: {}
  },
  setup(e) {
    return (t, n) => (ee(), pe("div", ra, [
      We(sa, { value: e.value }, null, 8, ["value"])
    ]));
  }
}), la = /* @__PURE__ */ sn(oa, [["__scopeId", "data-v-7ecc942f"]]), aa = { class: "mx-auto flex w-fit max-w-full flex-col items-center gap-2" }, ua = { class: "split-flap-inner block px-[10px]" }, fa = 1e3, Qi = 40, ca = 120, Zi = 240, da = 12, Vn = 120, es = 400, ha = 5e3, pa = /* @__PURE__ */ Ue({
  __name: "VariantOdometer",
  props: {
    prefix: {},
    suffix: {},
    remaining: {},
    valueStyles: {},
    lineStyles: {},
    numberSwitchMode: {},
    bold: { type: Boolean },
    usePlainValueDisplay: { type: Boolean },
    freezeTextForWave: { type: Boolean }
  },
  setup(e) {
    const t = e, n = (D) => Math.max(0, Math.floor(D)), i = J(n(t.remaining)), s = J(String(i.value).length), r = J(Vn);
    let o = null;
    const l = () => {
      o !== null && (clearTimeout(o), o = null);
    }, u = (D) => {
      l(), o = window.setTimeout(c, D);
    }, h = (D, Z) => {
      const I = Z - D, W = Math.abs(I);
      if (W === 0) return { kind: "done" };
      if (W >= ha) return { kind: "snap", target: Z };
      const K = Math.sign(I), F = W > da, Y = F ? fa : W * Zi, ae = F ? ca : Zi, de = Math.min(W, Math.max(1, Math.floor(Y / ae))), xe = Math.max(1, Math.ceil(W / de)), we = Math.max(ae, Math.floor(Y / de)), ye = t.numberSwitchMode === "flipping" ? Math.max(Vn, Math.min(es, we - Qi)) : Math.max(Vn, Math.min(es, Math.floor(we / 2)));
      return { kind: "step", next: D + K * Math.min(xe, W), flipMs: ye, delayMs: we };
    }, c = () => {
      o = null;
      const D = n(t.remaining), Z = i.value, I = h(Z, D);
      if (I.kind === "done") return;
      if (I.kind === "snap") {
        i.value = I.target;
        return;
      }
      r.value = I.flipMs, i.value = I.next;
      const W = t.numberSwitchMode === "flipping" ? I.flipMs + Qi : I.delayMs;
      u(W);
    }, p = fe(() => n(t.remaining));
    tt(
      () => t.remaining,
      () => {
        const D = String(p.value).length;
        if (D > s.value && (s.value = D), t.numberSwitchMode === "rotating") {
          l(), i.value = p.value;
          return;
        }
        o === null && c();
      }
    ), tt(
      () => t.numberSwitchMode,
      (D) => {
        if (D === "rotating") {
          l(), i.value = p.value;
          return;
        }
        i.value !== p.value && o === null && c();
      }
    ), An(() => {
      l();
    });
    const y = fe(() => {
      const D = String(i.value).split("");
      return D.map((Z, I) => ({
        positionKey: D.length - I - 1,
        digit: Z
      }));
    }), A = en(fe(() => t.remaining), {
      animate: !t.freezeTextForWave
    }), P = fe(() => ({
      color: t.valueStyles.color,
      textShadow: t.lineStyles.textShadow
    }));
    return (D, Z) => e.usePlainValueDisplay ? (ee(), Ze(Dn, {
      key: 0,
      prefix: e.prefix,
      suffix: e.suffix,
      "display-value": _t(A),
      "value-styles": e.valueStyles,
      "line-styles": e.lineStyles,
      bold: e.bold,
      "text-effects-active": "",
      "freeze-text-for-wave": e.freezeTextForWave
    }, null, 8, ["prefix", "suffix", "display-value", "value-styles", "line-styles", "bold", "freeze-text-for-wave"])) : (ee(), pe(
      "div",
      {
        key: 1,
        class: ot(["countdown-goals__odometer flex w-full flex-col items-center gap-3 text-center", e.bold && "font-bold"])
      },
      [
        e.prefix ? (ee(), pe(
          "span",
          {
            key: 0,
            class: "w-full text-2xl",
            style: Te(e.lineStyles)
          },
          $e(e.prefix),
          5
          /* TEXT, STYLE */
        )) : mt("v-if", !0),
        oe("div", aa, [
          oe(
            "div",
            {
              class: "text-[3.5em] font-extrabold leading-[1] tracking-[0]",
              style: Te(P.value)
            },
            [
              e.numberSwitchMode === "rotating" ? (ee(), Ze(la, {
                key: 0,
                value: p.value
              }, null, 8, ["value"])) : (ee(), Ze(Xl, {
                key: 1,
                slots: y.value,
                "flip-duration-ms": r.value
              }, null, 8, ["slots", "flip-duration-ms"]))
            ],
            4
            /* STYLE */
          ),
          e.suffix ? (ee(), pe(
            "div",
            {
              key: 0,
              class: "odometer-suffix split-flap-outer self-stretch text-center text-[1.25em] font-extrabold uppercase tracking-[0.18em]",
              style: Te(e.lineStyles)
            },
            [
              oe(
                "span",
                ua,
                $e(e.suffix),
                1
                /* TEXT */
              )
            ],
            4
            /* STYLE */
          )) : mt("v-if", !0)
        ])
      ],
      2
      /* CLASS */
    ));
  }
}), ga = /* @__PURE__ */ sn(pa, [["__scopeId", "data-v-4c8d6dd7"]]), ma = { class: "flex items-center gap-4" }, va = { class: "relative shrink-0" }, _a = {
  viewBox: "0 0 100 100",
  class: "block h-22 w-22"
}, xa = ["stroke"], ya = ["stroke", "stroke-dashoffset", "filter"], ba = { class: "flex min-w-0 flex-col gap-2" }, kt = 42, ts = 8, wa = 270, Sa = /* @__PURE__ */ Ue({
  __name: "VariantProgress",
  props: {
    prefix: {},
    suffix: {},
    remaining: {},
    current: {},
    goal: {},
    percentage: {},
    bold: { type: Boolean },
    valueStyles: {},
    lineStyles: {},
    textEffectsActive: { type: Boolean },
    progressBackgroundColor: {},
    progressIndicatorColor: {}
  },
  setup(e) {
    const t = e, n = wa / 360 * 2 * Math.PI * kt, i = (p) => {
      const y = p * Math.PI / 180;
      return {
        x: 50 + kt * Math.cos(y),
        y: 50 + kt * Math.sin(y)
      };
    }, s = i(135), r = i(45), o = `M ${s.x.toFixed(3)} ${s.y.toFixed(3)} A ${kt} ${kt} 0 1 1 ${r.x.toFixed(3)} ${r.y.toFixed(3)}`, l = en(cn(t, "current")), u = en(cn(t, "percentage")), h = fe(() => {
      const p = Math.max(0, Math.min(100, u.value));
      return n * (1 - p / 100);
    }), c = `countdown-goals-progress-glow-${Math.random().toString(36).slice(2, 8)}`;
    return (p, y) => (ee(), pe("div", ma, [
      oe("div", va, [
        (ee(), pe("svg", _a, [
          oe("defs", null, [
            oe("filter", {
              id: c,
              x: "-50%",
              y: "-50%",
              width: "200%",
              height: "200%"
            }, [...y[0] || (y[0] = [
              oe(
                "feGaussianBlur",
                {
                  stdDeviation: "2.5",
                  result: "blur"
                },
                null,
                -1
                /* CACHED */
              ),
              oe(
                "feMerge",
                null,
                [
                  oe("feMergeNode", { in: "blur" }),
                  oe("feMergeNode", { in: "SourceGraphic" })
                ],
                -1
                /* CACHED */
              )
            ])])
          ]),
          oe("path", {
            d: o,
            fill: "none",
            stroke: e.progressBackgroundColor,
            "stroke-width": ts,
            "stroke-linecap": "round"
          }, null, 8, xa),
          oe("path", {
            d: o,
            fill: "none",
            stroke: e.progressIndicatorColor,
            "stroke-width": ts,
            "stroke-linecap": "round",
            "stroke-dasharray": n,
            "stroke-dashoffset": h.value,
            filter: `url(#${c})`,
            class: "transition-[stroke-dashoffset] duration-[260ms] ease-out"
          }, null, 8, ya)
        ])),
        oe(
          "div",
          {
            class: "absolute inset-0 flex items-center justify-center text-xs leading-none",
            style: Te(e.lineStyles)
          },
          $e(Math.round(_t(u))) + "% ",
          5
          /* TEXT, STYLE */
        )
      ]),
      oe("div", ba, [
        We(Dn, {
          prefix: e.prefix,
          suffix: e.suffix,
          "display-value": e.goal,
          "value-styles": e.valueStyles,
          "line-styles": e.lineStyles,
          bold: e.bold,
          "text-effects-active": e.textEffectsActive,
          "line-class": "flex items-baseline gap-1 text-xl leading-tight"
        }, null, 8, ["prefix", "suffix", "display-value", "value-styles", "line-styles", "bold", "text-effects-active"]),
        oe(
          "div",
          {
            class: "text-base leading-none opacity-90",
            style: Te({ color: e.lineStyles.color })
          },
          $e(Math.round(_t(l))) + " / " + $e(e.goal),
          5
          /* TEXT, STYLE */
        )
      ])
    ]));
  }
}), Ma = (e, t) => {
  if (e <= 0) return;
  const n = /* @__PURE__ */ new Set();
  for (let i = -e; i <= e; i++)
    for (let s = -e; s <= e; s++)
      i === 0 && s === 0 || Math.hypot(i, s) <= e && n.add(`${i}px ${s}px 0 ${t}`);
  return [...n].join(", ");
}, ns = "countdown-goals-bold-font";
function Ta(e, t, n) {
  const i = e === "default" || e === "variant1" || e === "variant2" || e === "variant3", s = document.querySelector(`link.${ns}`);
  if (!i) {
    s?.remove();
    return;
  }
  const r = String(n(`${t}fontType`) || "");
  if (!r || r === "default") {
    s?.remove();
    return;
  }
  const l = `https://fonts.googleapis.com/css2?family=${r.trim().replace(/\s+/g, "+")}:wght@700&display=swap`;
  let u = s;
  u || (u = document.createElement("link"), u.rel = "stylesheet", u.className = ns, document.head.appendChild(u)), u.href !== l && (u.href = l);
}
const is = 120, Ea = 420, ss = 0.4, Ca = 1.2, Aa = (e) => {
  const t = Math.max(1, Math.abs(Math.round(e))), n = Math.min(1, (t - 1) / 12);
  return {
    durationMs: Math.round(is + (Ea - is) * n),
    intensityDeg: ss + (Ca - ss) * n
  };
}, Oa = (e, t, n, i) => {
  let s = null, r = null;
  const o = () => {
    s !== null && (clearTimeout(s), s = null);
  }, l = (p, y) => y > 0 ? Math.min(100, Math.floor(p / y * 100)) : 0, u = (p) => {
    const y = e.value;
    if (!y || i.value <= 0) return;
    r?.cancel(), o();
    const { durationMs: A, intensityDeg: P } = Aa(p), D = P * 0.55;
    r = y.animate(
      [
        { transform: "rotate(0deg)" },
        { transform: `rotate(-${P}deg)` },
        { transform: `rotate(${P}deg)` },
        { transform: `rotate(-${D}deg)` },
        { transform: `rotate(${D}deg)` },
        { transform: "rotate(0deg)" }
      ],
      {
        duration: A,
        easing: "ease-out"
      }
    ), s = setTimeout(() => {
      r = null, s = null;
    }, A + 50);
  }, h = (p) => {
    const y = i.value;
    return y <= 0 ? !1 : y >= 100 ? !0 : l(p, n.value) >= y;
  }, c = (p, y) => {
    y === p || !h(y) || u(y - p);
  };
  return An(() => {
    r?.cancel(), o();
  }), { onCurrentChange: c };
}, Fa = {
  likes: { prefix: "There are", suffix: "likes remaining" },
  shares: { prefix: "There are", suffix: "shares remaining" },
  follows: { prefix: "There are", suffix: "follows remaining" },
  viewer: { prefix: "There are", suffix: "viewers remaining" },
  coins: { prefix: "There are", suffix: "coins remaining" },
  points: { prefix: "There are", suffix: "points remaining" },
  subs: { prefix: "There are", suffix: "subs remaining" },
  custom1: { prefix: "There are", suffix: "custom goal 1 remaining" },
  custom2: { prefix: "There are", suffix: "custom goal 2 remaining" },
  custom3: { prefix: "There are", suffix: "custom goal 3 remaining" }
}, Da = (e) => Fa[e] ?? {
  prefix: "There are",
  suffix: `${e} remaining`
}, Ra = { class: "flex size-full min-h-screen min-w-full items-center justify-center overflow-hidden text-white" }, fr = /* @__PURE__ */ Ue({
  __name: "App",
  setup(e) {
    const t = J("likes"), n = J("default"), i = J(""), s = J(""), r = J(0), o = J(100), l = J(100), u = J(0), h = J(!1), c = J("none"), p = J(!1), y = J("normal"), A = J(!1), P = J(!1), D = J(0), Z = J("rgba(0, 0, 0, 0.7)"), I = J("#ffffff"), W = J("#ffffff"), K = J("medium"), F = J("rotating"), Y = J("rgba(255, 255, 255, 0.25)"), ae = J("#5ec4ff"), de = J(0), xe = J(null), we = () => window.location.href.includes("preview=1") && window.self !== window.top, ye = fe(() => `countdowngoals_${t.value}_`), Ce = fe(() => `countdowngoals${t.value}_`), Ae = (b, j = !1) => typeof b == "boolean" ? b : typeof b == "string" ? b === "true" : j, U = (b, j, a = Number.MIN_SAFE_INTEGER) => {
      const f = Number.parseInt(String(b ?? ""), 10);
      return Number.isNaN(f) ? j : Math.max(a, f);
    }, { onCurrentChange: Se } = Oa(xe, r, o, de), qe = () => {
      l.value = Math.max(0, o.value - r.value), u.value = o.value > 0 ? Math.min(100, Math.floor(r.value / o.value * 100)) : 0;
    }, ve = (b) => {
      if (!b) return;
      const j = r.value, a = U(b.current, r.value, 0), f = U(b.goal, o.value, 1), d = U(b.remaining, Math.max(0, f - a), 0), _ = Math.max(0, Math.min(100, U(b.percentage, u.value, 0))), m = Ae(b.hidden, !1);
      a === r.value && f === o.value && d === l.value && _ === u.value && m === h.value || (Se(j, a), r.value = a, o.value = f, l.value = d, u.value = _, h.value = m);
    }, se = (b) => b === "variant1" || b === "variant2" || b === "variant3" ? b : "default", X = (b) => b === "default" || b === "variant1", E = async () => {
      await En();
      const b = window.$, j = window.TextEffects;
      if (typeof b != "function" || !j || !X(n.value) || !R.value) return;
      const a = document.querySelectorAll(".countdown-goals-text");
      if (a.length && (a.forEach((f) => {
        const d = b(f);
        !d || !d.length || (typeof j.clearAllEffects == "function" && j.clearAllEffects(d), typeof j.applyComprehensiveEffects == "function" && j.applyComprehensiveEffects(d, {
          effect: c.value,
          wave: p.value,
          waveSpeed: y.value,
          glow: A.value && c.value === "none",
          defaultColor: I.value
        }));
      }), H.value)) {
        const f = [];
        i.value && f.push(i.value), f.push(String(l.value)), s.value && f.push(s.value), Yi(f.join(" "));
      }
    }, g = () => {
      const b = ye.value, j = Da(t.value), a = (m, v) => m === null || typeof m > "u" ? v : String(m), f = _e(`${b}prefix`), d = _e(`${b}suffix`);
      i.value = a(f, j.prefix), s.value = a(d, j.suffix);
      const _ = U(_e(`${b}value`), o.value, 1);
      _ !== o.value && (o.value = _, qe());
    }, M = () => {
      const b = Ce.value;
      let j = se(String(_e(`${b}variation`) || "default"));
      !window.settings?.isPro && !we() && (j = "default"), n.value = j;
      let a = String(_e(`${b}titleEffect`) || "none"), f = Ae(_e(`${b}titleWave`), !1);
      a === "wavy" && (a = "none", f = !0);
      const d = X(j), _ = ["none", "rainbow", "aurora"].includes(a) ? a : "none";
      c.value = d ? _ : "none", p.value = d ? f : !1;
      let m = String(_e(`${b}titleWaveSpeed`) || "normal");
      m === "medium" && (m = "normal"), y.value = d && ["slow", "normal", "fast"].includes(m) ? m : "normal", A.value = d ? Ae(_e(`${b}titleGlow`), !1) : !1, P.value = d ? Ae(_e(`${b}textStrokeEnabled`), !1) : !1, D.value = d ? U(_e(`${b}textStrokeWidth`), 2, 0) : 0, Z.value = d ? String(_e(`${b}textStrokeColor`) || "rgba(0, 0, 0, 0.7)") : "rgba(0, 0, 0, 0.7)", I.value = String(_e(`${b}fontColor`) || "#ffffff"), W.value = String(
        _e(`${b}valueColor`) || _e(`${b}fontColor`) || "#ffffff"
      );
      const v = String(_e(`${b}marqueeSpeed`) || "medium");
      K.value = ["slow", "medium", "fast"].includes(v) ? v : "medium";
      const T = String(_e(`${b}numberSwitchMode`) || "rotating");
      F.value = ["rotating", "flipping"].includes(T) ? T : "rotating", Y.value = String(_e(`${b}progressBackgroundColor`) || "rgba(255, 255, 255, 0.25)"), ae.value = String(_e(`${b}progressIndicatorColor`) || "#5ec4ff"), de.value = Math.min(
        100,
        Math.max(0, U(_e(`${b}shakeThresholdPercent`), 0, 0))
      ), Ta(n.value, Ce.value, _e), E();
    }, C = () => {
      const b = new URLSearchParams(window.location.search);
      t.value = b.get("metric") || "likes", g(), M();
    }, $ = fe(
      () => n.value === "default" || n.value === "variant1" || n.value === "variant2" || n.value === "variant3"
    ), R = fe(
      () => X(n.value) && (c.value !== "none" || A.value || p.value)
    ), H = fe(() => R.value && p.value);
    js(ur, {
      isActive: () => X(n.value) && R.value,
      needsWaveSafeText: () => H.value,
      getOptions: () => ({
        effect: c.value,
        wave: p.value,
        waveSpeed: y.value,
        glow: A.value && c.value === "none",
        defaultColor: I.value
      }),
      apply: E,
      syncLineText: Yi
    });
    const B = fe(
      () => n.value === "variant2" && R.value
    ), G = fe(() => ({
      color: W.value
    })), he = fe(() => {
      const b = { color: I.value };
      if (!X(n.value)) return b;
      const j = P.value && c.value === "none" ? Ma(D.value, Z.value) : void 0;
      return j && (b.textShadow = j), b;
    }), ce = fe(() => ({
      prefix: i.value,
      suffix: s.value,
      remaining: l.value,
      valueStyles: G.value,
      lineStyles: he.value,
      bold: $.value,
      textEffectsActive: R.value,
      freezeTextForWave: H.value,
      usePlainValueDisplay: B.value
    }));
    return window.updateCountdownGoalsStatus = (b) => {
      const a = b?.status?.[t.value];
      a && ve(a);
    }, window.updateSettings = (b) => {
      g(), M();
    }, tt(
      [
        c,
        p,
        y,
        A,
        P,
        D,
        Z,
        I,
        W,
        n,
        h
      ],
      () => {
        E();
      }
    ), hi(() => {
      C();
    }), (b, j) => (ee(), pe("div", Ra, [
      oe(
        "div",
        {
          ref_key: "shakeRoot",
          ref: xe,
          class: ot(["flex items-center justify-center", n.value === "variant1" || n.value === "variant2" ? "w-full" : "inline-flex max-w-full"])
        },
        [
          !h.value && n.value === "default" ? (ee(), Ze(
            Ll,
            br(Wt({ key: 0 }, ce.value)),
            null,
            16
            /* FULL_PROPS */
          )) : !h.value && n.value === "variant1" ? (ee(), Ze(Hl, Wt({ key: 1 }, ce.value, { "marquee-speed": K.value }), null, 16, ["marquee-speed"])) : !h.value && n.value === "variant2" ? (ee(), Ze(ga, Wt({ key: 2 }, ce.value, { "number-switch-mode": F.value }), null, 16, ["number-switch-mode"])) : !h.value && n.value === "variant3" ? (ee(), Ze(Sa, Wt({ key: 3 }, ce.value, {
            current: r.value,
            goal: o.value,
            percentage: u.value,
            "progress-background-color": Y.value,
            "progress-indicator-color": ae.value
          }), null, 16, ["current", "goal", "percentage", "progress-background-color", "progress-indicator-color"])) : mt("v-if", !0)
        ],
        2
        /* CLASS */
      )
    ]));
  }
});
window.createCountdownGoals = () => ar(fr);
const Pa = fr;
function cr(e) {
  return ar(Pa, e);
}
function Ia(e, t) {
  const n = cr(t);
  return n.mount(e), n;
}
window.createCountdownGoals = cr;
window.mountCountdownGoals = Ia;
export {
  cr as createCountdownGoals,
  Pa as default,
  Ia as mountCountdownGoals
};
