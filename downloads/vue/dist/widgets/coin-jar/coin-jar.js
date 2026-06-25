(function(){var s=document.createElement("style");s.id="vue-widget-coin-jar-styles";if(!document.getElementById(s.id)){s.textContent="@import\"https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;700&display=swap\";.coin-jar-canvas[data-v-0206bf39]{position:fixed;top:0;left:0;width:100vw;height:100vh;overflow:hidden}.coin-jar-canvas[data-v-0206bf39] canvas{display:block;width:100%!important;height:100%!important}.jar-progress[data-v-9500c571]{animation-name:jar-progress-animation-9500c571;animation-timing-function:linear;animation-fill-mode:forwards}@keyframes jar-progress-animation-9500c571{0%{width:100%}to{width:0%}}.donation-alert-enter-active[data-v-0c2bc7da],.donation-alert-leave-active[data-v-0c2bc7da]{transition:opacity .4s ease,transform .4s ease}.donation-alert-enter-from[data-v-0c2bc7da],.donation-alert-leave-to[data-v-0c2bc7da]{opacity:0;transform:translateY(-10px)}.donation-alert-card[data-v-0c2bc7da]{background:#282828cc;padding:.5rem .75rem;border-radius:1.6875rem;display:flex;gap:.5rem;align-items:center;justify-content:space-between;white-space:nowrap;max-width:100%}@layer properties{@supports ((-webkit-hyphens:none) and (not (margin-trim:inline))) or ((-moz-orient:inline) and (not (color:rgb(from red r g b)))){*,:before,:after,::backdrop{--tw-translate-x:0;--tw-translate-y:0;--tw-translate-z:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scale-z:1;--tw-rotate-x:initial;--tw-rotate-y:initial;--tw-rotate-z:initial;--tw-skew-x:initial;--tw-skew-y:initial;--tw-space-y-reverse:0;--tw-divide-y-reverse:0;--tw-border-style:solid;--tw-gradient-position:initial;--tw-gradient-from:#0000;--tw-gradient-via:#0000;--tw-gradient-to:#0000;--tw-gradient-stops:initial;--tw-gradient-via-stops:initial;--tw-gradient-from-position:0%;--tw-gradient-via-position:50%;--tw-gradient-to-position:100%;--tw-leading:initial;--tw-font-weight:initial;--tw-ordinal:initial;--tw-slashed-zero:initial;--tw-numeric-figure:initial;--tw-numeric-spacing:initial;--tw-numeric-fraction:initial;--tw-shadow:0 0 #0000;--tw-shadow-color:initial;--tw-shadow-alpha:100%;--tw-inset-shadow:0 0 #0000;--tw-inset-shadow-color:initial;--tw-inset-shadow-alpha:100%;--tw-ring-color:initial;--tw-ring-shadow:0 0 #0000;--tw-inset-ring-color:initial;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-inset:initial;--tw-ring-offset-width:0;--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-outline-style:solid;--tw-blur:initial;--tw-brightness:initial;--tw-contrast:initial;--tw-grayscale:initial;--tw-hue-rotate:initial;--tw-invert:initial;--tw-opacity:initial;--tw-saturate:initial;--tw-sepia:initial;--tw-drop-shadow:initial;--tw-drop-shadow-color:initial;--tw-drop-shadow-alpha:100%;--tw-drop-shadow-size:initial;--tw-backdrop-blur:initial;--tw-backdrop-brightness:initial;--tw-backdrop-contrast:initial;--tw-backdrop-grayscale:initial;--tw-backdrop-hue-rotate:initial;--tw-backdrop-invert:initial;--tw-backdrop-opacity:initial;--tw-backdrop-saturate:initial;--tw-backdrop-sepia:initial;--tw-duration:initial;--tw-ease:initial;--tw-text-shadow-color:initial;--tw-text-shadow-alpha:100%}}}@layer components;@layer theme{:root,:host{--font-sans:ui-sans-serif,system-ui,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\",\"Noto Color Emoji\";--font-mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,\"Liberation Mono\",\"Courier New\",monospace;--color-yellow-300:oklch(90.5% .182 98.111);--color-gray-500:oklch(55.1% .027 264.364);--color-black:#000;--color-white:#fff;--spacing:.25rem;--container-xs:20rem;--container-xl:36rem;--container-2xl:42rem;--text-xs:.75rem;--text-xs--line-height:calc(1/.75);--text-sm:.875rem;--text-sm--line-height:calc(1.25/.875);--text-base:1rem;--text-base--line-height: 1.5 ;--text-lg:1.125rem;--text-lg--line-height:calc(1.75/1.125);--text-xl:1.25rem;--text-xl--line-height:calc(1.75/1.25);--text-2xl:1.5rem;--text-2xl--line-height:calc(2/1.5);--text-3xl:1.875rem;--text-3xl--line-height: 1.2 ;--text-4xl:2.25rem;--text-4xl--line-height:calc(2.5/2.25);--text-5xl:3rem;--text-5xl--line-height:1;--text-7xl:4.5rem;--text-7xl--line-height:1;--font-weight-normal:400;--font-weight-medium:500;--font-weight-semibold:600;--font-weight-bold:700;--font-weight-extrabold:800;--leading-normal:1.5;--radius-sm:.25rem;--radius-md:.375rem;--radius-lg:.5rem;--radius-xl:.75rem;--radius-2xl:1rem;--drop-shadow-md:0 3px 3px #0000001f;--ease-in:cubic-bezier(.4,0,1,1);--ease-out:cubic-bezier(0,0,.2,1);--ease-in-out:cubic-bezier(.4,0,.2,1);--animate-pulse:pulse 2s cubic-bezier(.4,0,.6,1)infinite;--blur-md:12px;--blur-lg:16px;--default-transition-duration:.15s;--default-transition-timing-function:cubic-bezier(.4,0,.2,1);--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono)}}@layer base{*,:after,:before,::backdrop{box-sizing:border-box;border:0 solid;margin:0;padding:0}::-webkit-file-upload-button{box-sizing:border-box;border:0 solid;margin:0;padding:0}::file-selector-button{box-sizing:border-box;border:0 solid;margin:0;padding:0}html,:host{-webkit-text-size-adjust:100%;tab-size:4;line-height:1.5;font-family:var(--default-font-family,ui-sans-serif,system-ui,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\",\"Noto Color Emoji\");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);-webkit-tap-highlight-color:transparent}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:var(--default-mono-font-family,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,\"Liberation Mono\",\"Courier New\",monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-variation-settings:var(--default-mono-font-variation-settings,normal);font-size:1em}small{font-size:80%}sub,sup{vertical-align:baseline;font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}:-moz-focusring{outline:auto}progress{vertical-align:baseline}summary{display:list-item}ol,ul,menu{list-style:none}img,svg,video,canvas,audio,iframe,embed,object{vertical-align:middle;display:block}img,video{max-width:100%;height:auto}button,input,select,optgroup,textarea{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}::-webkit-file-upload-button{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}::file-selector-button{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{-webkit-padding-start:20px;padding-inline-start:20px}::-webkit-file-upload-button{-webkit-margin-end:4px;margin-inline-end:4px}::file-selector-button{-webkit-margin-end:4px;margin-inline-end:4px}::-webkit-input-placeholder{opacity:1}::placeholder{opacity:1}@supports (not (-webkit-appearance:-apple-pay-button)) or (contain-intrinsic-size:1px){::-webkit-input-placeholder{color:currentColor}::placeholder{color:currentColor}@supports (color:color-mix(in lab,red,red)){::-webkit-input-placeholder{color:currentColor}::placeholder{color:currentColor}@supports (color:color-mix(in lab,red,red)){::-webkit-input-placeholder{color:color-mix(in oklab,currentcolor 50%,transparent)}::placeholder{color:color-mix(in oklab,currentcolor 50%,transparent)}}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit{padding-block:0}::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-datetime-edit-month-field{padding-block:0}::-webkit-datetime-edit-day-field{padding-block:0}::-webkit-datetime-edit-hour-field{padding-block:0}::-webkit-datetime-edit-minute-field{padding-block:0}::-webkit-datetime-edit-second-field{padding-block:0}::-webkit-datetime-edit-millisecond-field{padding-block:0}::-webkit-datetime-edit-meridiem-field{padding-block:0}::-webkit-calendar-picker-indicator{line-height:1}:-moz-ui-invalid{box-shadow:none}button,input:where([type=button],[type=reset],[type=submit]){-webkit-appearance:button;appearance:button}::-webkit-file-upload-button{-webkit-appearance:button;appearance:button}::file-selector-button{-webkit-appearance:button;appearance:button}::-webkit-inner-spin-button{height:auto}::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}}@layer utilities{.pointer-events-auto{pointer-events:auto}.pointer-events-none{pointer-events:none}.collapse{visibility:collapse}.invisible{visibility:hidden}.visible{visibility:visible}.visible\\!{visibility:visible!important}.sr-only{-webkit-clip-path:inset(50%);clip-path:inset(50%);white-space:nowrap;border-width:0;width:1px;height:1px;margin:-1px;padding:0;position:absolute;overflow:hidden}.absolute{position:absolute}.fixed{position:fixed}.fixed\\!{position:fixed!important}.relative{position:relative}.static{position:static}.sticky{position:-webkit-sticky;position:sticky}.inset-0{inset:calc(var(--spacing)*0)}.-top-1{top:calc(var(--spacing)*-1)}.-top-2{top:calc(var(--spacing)*-2)}.-top-7{top:calc(var(--spacing)*-7)}.top-0{top:calc(var(--spacing)*0)}.top-0\\.5{top:calc(var(--spacing)*.5)}.top-1{top:calc(var(--spacing)*1)}.top-1\\/2{top:50%}.top-6{top:calc(var(--spacing)*6)}.top-6\\.5{top:calc(var(--spacing)*6.5)}.top-8{top:calc(var(--spacing)*8)}.top-10{top:calc(var(--spacing)*10)}.top-24{top:calc(var(--spacing)*24)}.top-48{top:calc(var(--spacing)*48)}.top-\\[45px\\]{top:45px}.top-\\[470px\\]{top:470px}.top-\\[calc\\(50\\%-75px\\)\\]{top:calc(50% - 75px)}.top-\\[calc\\(100\\%\\+8px\\)\\]{top:calc(100% + 8px)}.top-\\[calc\\(100\\%-12px\\)\\]{top:calc(100% - 12px)}.top-full{top:100%}.-right-5{right:calc(var(--spacing)*-5)}.-right-6{right:calc(var(--spacing)*-6)}.-right-6\\.5{right:calc(var(--spacing)*-6.5)}.-right-8{right:calc(var(--spacing)*-8)}.right-0{right:calc(var(--spacing)*0)}.right-0\\.5{right:calc(var(--spacing)*.5)}.right-4{right:calc(var(--spacing)*4)}.right-8{right:calc(var(--spacing)*8)}.right-\\[280px\\]{right:280px}.right-full{right:100%}.-bottom-8{bottom:calc(var(--spacing)*-8)}.-bottom-20{bottom:calc(var(--spacing)*-20)}.-bottom-36{bottom:calc(var(--spacing)*-36)}.-bottom-\\[20px\\]{bottom:-20px}.-bottom-px{bottom:-1px}.bottom-0{bottom:calc(var(--spacing)*0)}.bottom-4{bottom:calc(var(--spacing)*4)}.bottom-\\[63px\\]{bottom:63px}.bottom-\\[260px\\]{bottom:260px}.bottom-full{bottom:100%}.-left-1{left:calc(var(--spacing)*-1)}.-left-4{left:calc(var(--spacing)*-4)}.left-0{left:calc(var(--spacing)*0)}.left-1{left:calc(var(--spacing)*1)}.left-1\\.5{left:calc(var(--spacing)*1.5)}.left-1\\/2{left:50%}.left-6{left:calc(var(--spacing)*6)}.left-6\\.5{left:calc(var(--spacing)*6.5)}.left-8{left:calc(var(--spacing)*8)}.left-\\[-12px\\]{left:-12px}.left-\\[calc\\(100\\%\\+0\\.5rem\\)\\]{left:calc(100% + .5rem)}.left-\\[calc\\(100\\%-12px\\)\\]{left:calc(100% - 12px)}.left-full{left:100%}.-z-1{z-index:-1}.-z-2{z-index:-2}.z-0{z-index:0}.z-1{z-index:1}.z-2{z-index:2}.z-3{z-index:3}.z-4{z-index:4}.z-5{z-index:5}.z-10{z-index:10}.z-\\[9999\\]{z-index:9999}.col-span-1{grid-column:span 1/span 1}.col-span-2{grid-column:span 2/span 2}.col-span-3{grid-column:span 3/span 3}.col-start-2{grid-column-start:2}.col-start-3{grid-column-start:3}.col-start-4{grid-column-start:4}.container{width:100%}@media (min-width:40rem){.container{max-width:40rem}}@media (min-width:48rem){.container{max-width:48rem}}@media (min-width:64rem){.container{max-width:64rem}}@media (min-width:80rem){.container{max-width:80rem}}@media (min-width:96rem){.container{max-width:96rem}}.mx-10{margin-inline:calc(var(--spacing)*10)}.mx-auto{margin-inline:auto}.my-0{margin-block:calc(var(--spacing)*0)}.my-0\\!{margin-block:calc(var(--spacing)*0)!important}.my-3{margin-block:calc(var(--spacing)*3)}.my-3\\.5{margin-block:calc(var(--spacing)*3.5)}.my-12{margin-block:calc(var(--spacing)*12)}.-mt-0{margin-top:calc(var(--spacing)*0)}.-mt-0\\.5{margin-top:calc(var(--spacing)*-.5)}.-mt-2{margin-top:calc(var(--spacing)*-2)}.-mt-8{margin-top:calc(var(--spacing)*-8)}.-mt-12{margin-top:calc(var(--spacing)*-12)}.-mt-16{margin-top:calc(var(--spacing)*-16)}.-mt-px{margin-top:-1px}.mt-1{margin-top:calc(var(--spacing)*1)}.mt-1\\.5{margin-top:calc(var(--spacing)*1.5)}.mt-2{margin-top:calc(var(--spacing)*2)}.mt-3{margin-top:calc(var(--spacing)*3)}.mt-4{margin-top:calc(var(--spacing)*4)}.mt-6{margin-top:calc(var(--spacing)*6)}.mt-8{margin-top:calc(var(--spacing)*8)}.mt-16{margin-top:calc(var(--spacing)*16)}.mr-1{margin-right:calc(var(--spacing)*1)}.mr-1\\.5{margin-right:calc(var(--spacing)*1.5)}.mr-2{margin-right:calc(var(--spacing)*2)}.mr-3{margin-right:calc(var(--spacing)*3)}.mr-4{margin-right:calc(var(--spacing)*4)}.mb-1{margin-bottom:calc(var(--spacing)*1)}.mb-1\\.5{margin-bottom:calc(var(--spacing)*1.5)}.mb-2{margin-bottom:calc(var(--spacing)*2)}.mb-3{margin-bottom:calc(var(--spacing)*3)}.mb-4{margin-bottom:calc(var(--spacing)*4)}.mb-6{margin-bottom:calc(var(--spacing)*6)}.mb-8{margin-bottom:calc(var(--spacing)*8)}.mb-12{margin-bottom:calc(var(--spacing)*12)}.mb-12\\!{margin-bottom:calc(var(--spacing)*12)!important}.mb-16{margin-bottom:calc(var(--spacing)*16)}.mb-20{margin-bottom:calc(var(--spacing)*20)}.ml-1{margin-left:calc(var(--spacing)*1)}.ml-1\\.5{margin-left:calc(var(--spacing)*1.5)}.ml-2{margin-left:calc(var(--spacing)*2)}.ml-3{margin-left:calc(var(--spacing)*3)}.ml-4{margin-left:calc(var(--spacing)*4)}.ml-6{margin-left:calc(var(--spacing)*6)}.ml-8{margin-left:calc(var(--spacing)*8)}.ml-22{margin-left:calc(var(--spacing)*22)}.box-border{box-sizing:border-box}.\\!block{display:block!important}.block{display:block}.contents{display:contents}.flex{display:flex}.grid{display:grid}.hidden{display:none}.inline{display:inline}.inline-block{display:inline-block}.inline-flex{display:inline-flex}.table{display:table}.table-cell{display:table-cell}.table-row{display:table-row}.aspect-\\[16\\/9\\]{aspect-ratio:16/9}.size-2{width:calc(var(--spacing)*2);height:calc(var(--spacing)*2)}.size-3{width:calc(var(--spacing)*3);height:calc(var(--spacing)*3)}.size-4{width:calc(var(--spacing)*4);height:calc(var(--spacing)*4)}.size-5{width:calc(var(--spacing)*5);height:calc(var(--spacing)*5)}.size-6{width:calc(var(--spacing)*6);height:calc(var(--spacing)*6)}.size-8{width:calc(var(--spacing)*8);height:calc(var(--spacing)*8)}.size-10{width:calc(var(--spacing)*10);height:calc(var(--spacing)*10)}.size-11{width:calc(var(--spacing)*11);height:calc(var(--spacing)*11)}.size-12{width:calc(var(--spacing)*12);height:calc(var(--spacing)*12)}.size-16{width:calc(var(--spacing)*16);height:calc(var(--spacing)*16)}.size-36{width:calc(var(--spacing)*36);height:calc(var(--spacing)*36)}.size-64{width:calc(var(--spacing)*64);height:calc(var(--spacing)*64)}.size-76{width:calc(var(--spacing)*76);height:calc(var(--spacing)*76)}.size-fit{width:-webkit-fit-content;width:fit-content;height:-webkit-fit-content;height:fit-content}.size-full{width:100%;height:100%}.size-max{width:-webkit-max-content;width:max-content;height:-webkit-max-content;height:max-content}.h-0{height:calc(var(--spacing)*0)}.h-0\\.5{height:calc(var(--spacing)*.5)}.h-1{height:calc(var(--spacing)*1)}.h-1\\/2{height:50%}.h-2{height:calc(var(--spacing)*2)}.h-3{height:calc(var(--spacing)*3)}.h-4{height:calc(var(--spacing)*4)}.h-4\\.5{height:calc(var(--spacing)*4.5)}.h-5{height:calc(var(--spacing)*5)}.h-5\\.5{height:calc(var(--spacing)*5.5)}.h-6{height:calc(var(--spacing)*6)}.h-6\\.5{height:calc(var(--spacing)*6.5)}.h-8{height:calc(var(--spacing)*8)}.h-8\\.5{height:calc(var(--spacing)*8.5)}.h-9{height:calc(var(--spacing)*9)}.h-9\\.5{height:calc(var(--spacing)*9.5)}.h-10{height:calc(var(--spacing)*10)}.h-12{height:calc(var(--spacing)*12)}.h-12\\.5{height:calc(var(--spacing)*12.5)}.h-16{height:calc(var(--spacing)*16)}.h-20{height:calc(var(--spacing)*20)}.h-24{height:calc(var(--spacing)*24)}.h-48{height:calc(var(--spacing)*48)}.h-96{height:calc(var(--spacing)*96)}.h-\\[2px\\]{height:2px}.h-\\[3px\\]{height:3px}.h-\\[8vw\\]{height:8vw}.h-\\[10vw\\]{height:10vw}.h-\\[28px\\]{height:28px}.h-\\[85vh\\]{height:85vh}.h-\\[181px\\]{height:181px}.h-\\[275px\\]\\!{height:275px!important}.h-\\[300px\\]{height:300px}.h-\\[410px\\]{height:410px}.h-\\[440px\\]{height:440px}.h-\\[calc\\(100\\%-32px\\)\\]{height:calc(100% - 32px)}.h-\\[calc\\(100\\%-54px\\)\\]{height:calc(100% - 54px)}.h-auto{height:auto}.h-full{height:100%}.h-px{height:1px}.h-screen{height:100vh}.max-h-\\[70vh\\]{max-height:70vh}.max-h-\\[90\\%\\]{max-height:90%}.max-h-\\[650px\\]{max-height:650px}.max-h-\\[calc\\(100vh-260px\\)\\]{max-height:calc(100vh - 260px)}.max-h-full{max-height:100%}.min-h-48{min-height:calc(var(--spacing)*48)}.min-h-screen{min-height:100vh}.w-1{width:calc(var(--spacing)*1)}.w-1\\/2{width:50%}.w-1\\/3{width:33.3333%}.w-2{width:calc(var(--spacing)*2)}.w-2\\/3{width:66.6667%}.w-4{width:calc(var(--spacing)*4)}.w-4\\.5{width:calc(var(--spacing)*4.5)}.w-5{width:calc(var(--spacing)*5)}.w-6{width:calc(var(--spacing)*6)}.w-9{width:calc(var(--spacing)*9)}.w-9\\.5{width:calc(var(--spacing)*9.5)}.w-10{width:calc(var(--spacing)*10)}.w-12{width:calc(var(--spacing)*12)}.w-16{width:calc(var(--spacing)*16)}.w-32{width:calc(var(--spacing)*32)}.w-40{width:calc(var(--spacing)*40)}.w-56{width:calc(var(--spacing)*56)}.w-62{width:calc(var(--spacing)*62)}.w-62\\!{width:calc(var(--spacing)*62)!important}.w-64{width:calc(var(--spacing)*64)}.w-80{width:calc(var(--spacing)*80)}.w-96{width:calc(var(--spacing)*96)}.w-128{width:calc(var(--spacing)*128)}.w-280{width:calc(var(--spacing)*280)}.w-340{width:calc(var(--spacing)*340)}.w-\\[3\\.25rem\\]{width:3.25rem}.w-\\[3px\\]{width:3px}.w-\\[6px\\]{width:6px}.w-\\[45\\%\\]{width:45%}.w-\\[70\\%\\]{width:70%}.w-\\[256px\\]{width:256px}.w-\\[320px\\]{width:320px}.w-\\[660px\\]{width:660px}.w-\\[750px\\]{width:750px}.w-\\[calc\\(100\\%-2rem\\)\\]{width:calc(100% - 2rem)}.w-\\[calc\\(100\\%-32px\\)\\]{width:calc(100% - 32px)}.w-auto{width:auto}.w-fit{width:-webkit-fit-content;width:fit-content}.w-full{width:100%}.w-max{width:-webkit-max-content;width:max-content}.w-min{width:-webkit-min-content;width:min-content}.w-px{width:1px}.w-screen{width:100vw}.max-w-2xl{max-width:var(--container-2xl)}.max-w-14{max-width:calc(var(--spacing)*14)}.max-w-48{max-width:calc(var(--spacing)*48)}.max-w-80{max-width:calc(var(--spacing)*80)}.max-w-\\[33\\%\\]{max-width:33%}.max-w-\\[100px\\]{max-width:100px}.max-w-\\[120px\\]{max-width:120px}.max-w-\\[130px\\]{max-width:130px}.max-w-\\[400px\\]{max-width:400px}.max-w-\\[1920px\\]{max-width:1920px}.max-w-full{max-width:100%}.max-w-none{max-width:none}.max-w-xl{max-width:var(--container-xl)}.max-w-xs{max-width:var(--container-xs)}.min-w-0{min-width:calc(var(--spacing)*0)}.min-w-\\[220px\\]{min-width:220px}.min-w-screen{min-width:100vw}.flex-1{flex:1}.flex-3{flex:3}.flex-7{flex:7}.flex-none{flex:none}.flex-shrink{flex-shrink:1}.flex-shrink-0{flex-shrink:0}.shrink{flex-shrink:1}.shrink-0{flex-shrink:0}.flex-grow,.grow{flex-grow:1}.table-fixed{table-layout:fixed}.border-collapse{border-collapse:collapse}.origin-center{transform-origin:50%}.-translate-x-1{--tw-translate-x:calc(var(--spacing)*-1);translate:var(--tw-translate-x)var(--tw-translate-y)}.-translate-x-1\\/2{--tw-translate-x: -50% ;translate:var(--tw-translate-x)var(--tw-translate-y)}.-translate-x-2{--tw-translate-x:calc(var(--spacing)*-2);translate:var(--tw-translate-x)var(--tw-translate-y)}.translate-x-0{--tw-translate-x:calc(var(--spacing)*0);translate:var(--tw-translate-x)var(--tw-translate-y)}.translate-x-1{--tw-translate-x:calc(var(--spacing)*1);translate:var(--tw-translate-x)var(--tw-translate-y)}.translate-x-1\\/2{--tw-translate-x: 50% ;translate:var(--tw-translate-x)var(--tw-translate-y)}.-translate-y-1{--tw-translate-y:calc(var(--spacing)*-1);translate:var(--tw-translate-x)var(--tw-translate-y)}.-translate-y-1\\/2{--tw-translate-y: -50% ;translate:var(--tw-translate-x)var(--tw-translate-y)}.-translate-y-full{--tw-translate-y:-100%;translate:var(--tw-translate-x)var(--tw-translate-y)}.translate-y-0{--tw-translate-y:calc(var(--spacing)*0);translate:var(--tw-translate-x)var(--tw-translate-y)}.translate-y-1{--tw-translate-y:calc(var(--spacing)*1);translate:var(--tw-translate-x)var(--tw-translate-y)}.translate-y-1\\/2{--tw-translate-y: 50% ;translate:var(--tw-translate-x)var(--tw-translate-y)}.translate-y-9{--tw-translate-y:calc(var(--spacing)*9);translate:var(--tw-translate-x)var(--tw-translate-y)}.translate-y-18{--tw-translate-y:calc(var(--spacing)*18);translate:var(--tw-translate-x)var(--tw-translate-y)}.scale-95{--tw-scale-x:95%;--tw-scale-y:95%;--tw-scale-z:95%;scale:var(--tw-scale-x)var(--tw-scale-y)}.-rotate-90{rotate:-90deg}.rotate-45{rotate:45deg}.rotate-90{rotate:90deg}.rotate-180{rotate:180deg}.rotate-270{rotate:270deg}.transform{transform:var(--tw-rotate-x, )var(--tw-rotate-y, )var(--tw-rotate-z, )var(--tw-skew-x, )var(--tw-skew-y, )}.animate-pulse{animation:var(--animate-pulse)}.cursor-auto{cursor:auto}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.resize{resize:both}.list-disc{list-style-type:disc}.grid-cols-12{grid-template-columns:repeat(12,minmax(0,1fr))}.grid-cols-\\[4fr_3fr_4fr\\]{grid-template-columns:4fr 3fr 4fr}.grid-cols-\\[5fr_4fr_4fr_4fr\\]{grid-template-columns:5fr 4fr 4fr 4fr}.flex-col{flex-direction:column}.flex-row{flex-direction:row}.flex-wrap{flex-wrap:wrap}.items-center{align-items:center}.items-end{align-items:flex-end}.items-start{align-items:flex-start}.items-stretch{align-items:stretch}.justify-between{justify-content:space-between}.justify-center{justify-content:center}.justify-end{justify-content:flex-end}.justify-items-center{justify-items:center}.gap-0{gap:calc(var(--spacing)*0)}.gap-0\\.5{gap:calc(var(--spacing)*.5)}.gap-1{gap:calc(var(--spacing)*1)}.gap-1\\.5{gap:calc(var(--spacing)*1.5)}.gap-2{gap:calc(var(--spacing)*2)}.gap-2\\.5{gap:calc(var(--spacing)*2.5)}.gap-3{gap:calc(var(--spacing)*3)}.gap-3\\!{gap:calc(var(--spacing)*3)!important}.gap-4{gap:calc(var(--spacing)*4)}.gap-6{gap:calc(var(--spacing)*6)}.gap-8{gap:calc(var(--spacing)*8)}.gap-16{gap:calc(var(--spacing)*16)}:where(.space-y-1>:not(:last-child)){--tw-space-y-reverse:0;-webkit-margin-before:calc(calc(var(--spacing)*1)*var(--tw-space-y-reverse));margin-block-start:calc(calc(var(--spacing)*1)*var(--tw-space-y-reverse));-webkit-margin-after:calc(calc(var(--spacing)*1)*calc(1 - var(--tw-space-y-reverse)));margin-block-end:calc(calc(var(--spacing)*1)*calc(1 - var(--tw-space-y-reverse)))}.gap-x-2{column-gap:calc(var(--spacing)*2)}:where(.divide-y>:not(:last-child)){--tw-divide-y-reverse:0;border-bottom-style:var(--tw-border-style);border-top-style:var(--tw-border-style);border-top-width:calc(1px*var(--tw-divide-y-reverse));border-bottom-width:calc(1px*calc(1 - var(--tw-divide-y-reverse)))}:where(.divide-white>:not(:last-child)){border-color:var(--color-white)}:where(.divide-white\\/5>:not(:last-child)){border-color:#ffffff0d}@supports (color:color-mix(in lab,red,red)){:where(.divide-white\\/5>:not(:last-child)){border-color:var(--color-white)}@supports (color:color-mix(in lab,red,red)){:where(.divide-white\\/5>:not(:last-child)){border-color:color-mix(in oklab,var(--color-white)5%,transparent)}}}.self-stretch{align-self:stretch}.justify-self-start{justify-self:flex-start}.truncate{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.overflow-auto{overflow:auto}.overflow-hidden{overflow:hidden}.overflow-visible{overflow:visible}.overflow-x-hidden{overflow-x:hidden}.overflow-y-auto{overflow-y:auto}.overscroll-contain{overscroll-behavior:contain}.rounded{border-radius:.25rem}.rounded-2xl{border-radius:var(--radius-2xl)}.rounded-\\[0\\.625rem\\]{border-radius:.625rem}.rounded-\\[8px\\]{border-radius:8px}.rounded-\\[10px\\]{border-radius:10px}.rounded-\\[14px\\]{border-radius:14px}.rounded-\\[20px\\]{border-radius:20px}.rounded-\\[27px\\]{border-radius:27px}.rounded-full{border-radius:3.40282e38px}.rounded-lg{border-radius:var(--radius-lg)}.rounded-md{border-radius:var(--radius-md)}.rounded-sm{border-radius:var(--radius-sm)}.rounded-xl{border-radius:var(--radius-xl)}.rounded-t-\\[16px\\]{border-top-left-radius:16px;border-top-right-radius:16px}.rounded-t-lg{border-top-left-radius:var(--radius-lg);border-top-right-radius:var(--radius-lg)}.rounded-r-\\[6px\\]{border-top-right-radius:6px;border-bottom-right-radius:6px}.rounded-b-\\[16px\\]{border-bottom-right-radius:16px;border-bottom-left-radius:16px}.rounded-b-lg{border-bottom-right-radius:var(--radius-lg);border-bottom-left-radius:var(--radius-lg)}.border{border-style:var(--tw-border-style);border-width:1px}.border-2{border-style:var(--tw-border-style);border-width:2px}.border-3{border-style:var(--tw-border-style);border-width:3px}.border-x{border-inline-style:var(--tw-border-style);border-inline-width:1px}.border-y-1{border-block-style:var(--tw-border-style);border-block-width:1px}.border-t{border-top-style:var(--tw-border-style);border-top-width:1px}.border-t-0{border-top-style:var(--tw-border-style);border-top-width:0}.border-r-0{border-right-style:var(--tw-border-style);border-right-width:0}.border-b{border-bottom-style:var(--tw-border-style);border-bottom-width:1px}.border-b-0{border-bottom-style:var(--tw-border-style);border-bottom-width:0}.border-l{border-left-style:var(--tw-border-style);border-left-width:1px}.border-l-0{border-left-style:var(--tw-border-style);border-left-width:0}.border-dashed{--tw-border-style:dashed;border-style:dashed}.border-none{--tw-border-style:none;border-style:none}.border-\\[\\#3AFF6866\\]{border-color:#3aff6866}.border-\\[\\#48363A\\]{border-color:#48363a}.border-\\[\\#F6C669\\]{border-color:#f6c669}.border-black{border-color:var(--color-black)}.border-black\\/10{border-color:#0000001a}@supports (color:color-mix(in lab,red,red)){.border-black\\/10{border-color:var(--color-black)}@supports (color:color-mix(in lab,red,red)){.border-black\\/10{border-color:color-mix(in oklab,var(--color-black)10%,transparent)}}}.border-white{border-color:var(--color-white)}.border-white\\/4{border-color:#ffffff0a}@supports (color:color-mix(in lab,red,red)){.border-white\\/4{border-color:var(--color-white)}@supports (color:color-mix(in lab,red,red)){.border-white\\/4{border-color:color-mix(in oklab,var(--color-white)4%,transparent)}}}.border-white\\/5{border-color:#ffffff0d}@supports (color:color-mix(in lab,red,red)){.border-white\\/5{border-color:var(--color-white)}@supports (color:color-mix(in lab,red,red)){.border-white\\/5{border-color:color-mix(in oklab,var(--color-white)5%,transparent)}}}.border-white\\/6{border-color:#ffffff0f}@supports (color:color-mix(in lab,red,red)){.border-white\\/6{border-color:var(--color-white)}@supports (color:color-mix(in lab,red,red)){.border-white\\/6{border-color:color-mix(in oklab,var(--color-white)6%,transparent)}}}.border-white\\/8{border-color:#ffffff14}@supports (color:color-mix(in lab,red,red)){.border-white\\/8{border-color:var(--color-white)}@supports (color:color-mix(in lab,red,red)){.border-white\\/8{border-color:color-mix(in oklab,var(--color-white)8%,transparent)}}}.border-white\\/10{border-color:#ffffff1a}@supports (color:color-mix(in lab,red,red)){.border-white\\/10{border-color:var(--color-white)}@supports (color:color-mix(in lab,red,red)){.border-white\\/10{border-color:color-mix(in oklab,var(--color-white)10%,transparent)}}}.border-white\\/20{border-color:#fff3}@supports (color:color-mix(in lab,red,red)){.border-white\\/20{border-color:var(--color-white)}@supports (color:color-mix(in lab,red,red)){.border-white\\/20{border-color:color-mix(in oklab,var(--color-white)20%,transparent)}}}.bg-\\[\\#2E1F22\\]{background-color:#2e1f22}.bg-\\[\\#3AFF68\\]{background-color:#3aff68}.bg-\\[\\#3AFF68\\]\\/10{background-color:#3aff681a}.bg-\\[\\#3AFF6866\\]{background-color:#3aff6866}.bg-\\[\\#3F3F3F\\]{background-color:#3f3f3f}.bg-\\[\\#222222\\]{background-color:#222}.bg-\\[\\#282828CC\\]{background-color:#282828cc}.bg-\\[\\#323232\\]{background-color:#323232}.bg-\\[\\#333333\\]{background-color:#333}.bg-\\[\\#C192374D\\]{background-color:#c192374d}.bg-\\[\\#D43555\\]{background-color:#d43555}.bg-\\[\\#F5C467\\]{background-color:#f5c467}.bg-\\[var\\(--bubble-bg\\)\\]{background-color:var(--bubble-bg)}.bg-black{background-color:var(--color-black)}.bg-black\\/30{background-color:#0000004d}@supports (color:color-mix(in lab,red,red)){.bg-black\\/30{background-color:var(--color-black)}@supports (color:color-mix(in lab,red,red)){.bg-black\\/30{background-color:color-mix(in oklab,var(--color-black)30%,transparent)}}}.bg-transparent{background-color:#0000}.bg-white{background-color:var(--color-white)}.bg-white\\/4{background-color:#ffffff0a}@supports (color:color-mix(in lab,red,red)){.bg-white\\/4{background-color:var(--color-white)}@supports (color:color-mix(in lab,red,red)){.bg-white\\/4{background-color:color-mix(in oklab,var(--color-white)4%,transparent)}}}.bg-white\\/6{background-color:#ffffff0f}@supports (color:color-mix(in lab,red,red)){.bg-white\\/6{background-color:var(--color-white)}@supports (color:color-mix(in lab,red,red)){.bg-white\\/6{background-color:color-mix(in oklab,var(--color-white)6%,transparent)}}}.bg-white\\/8{background-color:#ffffff14}@supports (color:color-mix(in lab,red,red)){.bg-white\\/8{background-color:var(--color-white)}@supports (color:color-mix(in lab,red,red)){.bg-white\\/8{background-color:color-mix(in oklab,var(--color-white)8%,transparent)}}}.bg-white\\/10{background-color:#ffffff1a}@supports (color:color-mix(in lab,red,red)){.bg-white\\/10{background-color:var(--color-white)}@supports (color:color-mix(in lab,red,red)){.bg-white\\/10{background-color:color-mix(in oklab,var(--color-white)10%,transparent)}}}.bg-white\\/12{background-color:#ffffff1f}@supports (color:color-mix(in lab,red,red)){.bg-white\\/12{background-color:var(--color-white)}@supports (color:color-mix(in lab,red,red)){.bg-white\\/12{background-color:color-mix(in oklab,var(--color-white)12%,transparent)}}}.bg-white\\/16{background-color:#ffffff29}@supports (color:color-mix(in lab,red,red)){.bg-white\\/16{background-color:var(--color-white)}@supports (color:color-mix(in lab,red,red)){.bg-white\\/16{background-color:color-mix(in oklab,var(--color-white)16%,transparent)}}}.bg-white\\/20{background-color:#fff3}@supports (color:color-mix(in lab,red,red)){.bg-white\\/20{background-color:var(--color-white)}@supports (color:color-mix(in lab,red,red)){.bg-white\\/20{background-color:color-mix(in oklab,var(--color-white)20%,transparent)}}}.bg-white\\/40{background-color:#fff6}@supports (color:color-mix(in lab,red,red)){.bg-white\\/40{background-color:var(--color-white)}@supports (color:color-mix(in lab,red,red)){.bg-white\\/40{background-color:color-mix(in oklab,var(--color-white)40%,transparent)}}}.bg-linear-to-t{--tw-gradient-position:to top}@supports (background-image:linear-gradient(in lab,red,red)){.bg-linear-to-t{--tw-gradient-position:to top in oklab}}.bg-linear-to-t{background-image:linear-gradient(var(--tw-gradient-stops))}.bg-gradient-to-r{--tw-gradient-position:to right in oklab;background-image:linear-gradient(var(--tw-gradient-stops))}.bg-gradient-to-t{--tw-gradient-position:to top in oklab;background-image:linear-gradient(var(--tw-gradient-stops))}.bg-\\[linear-gradient\\(90deg\\,rgba\\(212\\,53\\,85\\,0\\.10\\)_0\\%\\,rgba\\(29\\,28\\,28\\,0\\.00\\)_100\\%\\)\\]{background-image:linear-gradient(90deg,#d435551a,#1d1c1c00)}.bg-\\[linear-gradient\\(92deg\\,rgba\\(212\\,53\\,85\\,0\\.14\\)_0\\%\\,rgba\\(48\\,46\\,46\\,0\\.00\\)_100\\%\\)\\]{background-image:linear-gradient(92deg,#d4355524,#302e2e00)}.bg-\\[linear-gradient\\(98deg\\,\\#D43555_-3\\.08\\%\\,\\#733435_70\\.62\\%\\)\\]{background-image:linear-gradient(98deg,#d43555 -3.08%,#733435 70.62%)}.bg-\\[linear-gradient\\(98deg\\,_var\\(--color-gradient-green-start\\)_-3\\.08\\%\\,_var\\(--color-gradient-green-end\\)_70\\.62\\%\\)\\]{background-image:linear-gradient(98deg,var(--color-gradient-green-start)-3.08%,var(--color-gradient-green-end)70.62%)}.bg-\\[linear-gradient\\(230deg\\,rgba\\(246\\,208\\,110\\,0\\.8\\)_0\\%\\,rgba\\(209\\,152\\,55\\,0\\.8\\)_100\\%\\)\\]{background-image:linear-gradient(230deg,#f6d06ecc,#d19837cc)}.bg-\\[linear-gradient\\(230deg\\,rgba\\(246\\,208\\,110\\,0\\.65\\)_0\\%\\,rgba\\(209\\,152\\,55\\,0\\.65\\)_100\\%\\)\\]{background-image:linear-gradient(230deg,#f6d06ea6,#d19837a6)}.bg-\\[linear-gradient\\(270deg\\,\\#343333_0\\%\\,rgba\\(52\\,51\\,51\\,0\\)_100\\%\\)\\]{background-image:linear-gradient(270deg,#343333,#34333300)}.bg-\\[radial-gradient\\(84\\.4\\%_78\\.16\\%_at_100\\%_0\\%\\,rgba\\(70\\,112\\,59\\,0\\.60\\)_0\\%\\,rgba\\(70\\,112\\,59\\,0\\.40\\)_25\\.18\\%\\,rgba\\(70\\,112\\,59\\,0\\)_100\\%\\)\\]{background-image:radial-gradient(84.4% 78.16% at 100% 0,#46703b99,#46703b66 25.18%,#46703b00)}.from-\\[\\#337E2D\\]{--tw-gradient-from:#337e2d;--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position),var(--tw-gradient-from)var(--tw-gradient-from-position),var(--tw-gradient-to)var(--tw-gradient-to-position))}.to-\\[\\#84EC6B\\]{--tw-gradient-to:#84ec6b;--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position),var(--tw-gradient-from)var(--tw-gradient-from-position),var(--tw-gradient-to)var(--tw-gradient-to-position))}.to-transparent{--tw-gradient-to:transparent;--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position),var(--tw-gradient-from)var(--tw-gradient-from-position),var(--tw-gradient-to)var(--tw-gradient-to-position))}.mask-repeat{-webkit-mask-repeat:repeat;mask-repeat:repeat}.object-contain{object-fit:contain}.object-cover{object-fit:cover}.p-1{padding:calc(var(--spacing)*1)}.p-1\\.5{padding:calc(var(--spacing)*1.5)}.p-2{padding:calc(var(--spacing)*2)}.p-2\\.5{padding:calc(var(--spacing)*2.5)}.p-3{padding:calc(var(--spacing)*3)}.p-4{padding:calc(var(--spacing)*4)}.p-4\\.5{padding:calc(var(--spacing)*4.5)}.p-6{padding:calc(var(--spacing)*6)}.p-8{padding:calc(var(--spacing)*8)}.px-0{padding-inline:calc(var(--spacing)*0)}.px-1{padding-inline:calc(var(--spacing)*1)}.px-1\\.5{padding-inline:calc(var(--spacing)*1.5)}.px-2{padding-inline:calc(var(--spacing)*2)}.px-2\\.5{padding-inline:calc(var(--spacing)*2.5)}.px-3{padding-inline:calc(var(--spacing)*3)}.px-3\\.5{padding-inline:calc(var(--spacing)*3.5)}.px-4{padding-inline:calc(var(--spacing)*4)}.px-4\\.5{padding-inline:calc(var(--spacing)*4.5)}.px-6{padding-inline:calc(var(--spacing)*6)}.px-8{padding-inline:calc(var(--spacing)*8)}.py-0{padding-block:calc(var(--spacing)*0)}.py-0\\.75{padding-block:calc(var(--spacing)*.75)}.py-1{padding-block:calc(var(--spacing)*1)}.py-1\\.5{padding-block:calc(var(--spacing)*1.5)}.py-2{padding-block:calc(var(--spacing)*2)}.py-2\\.5{padding-block:calc(var(--spacing)*2.5)}.py-3{padding-block:calc(var(--spacing)*3)}.py-3\\.5{padding-block:calc(var(--spacing)*3.5)}.py-4{padding-block:calc(var(--spacing)*4)}.py-5{padding-block:calc(var(--spacing)*5)}.py-8{padding-block:calc(var(--spacing)*8)}.py-10{padding-block:calc(var(--spacing)*10)}.py-12{padding-block:calc(var(--spacing)*12)}.py-16{padding-block:calc(var(--spacing)*16)}.pt-0{padding-top:calc(var(--spacing)*0)}.pt-0\\.5{padding-top:calc(var(--spacing)*.5)}.pt-1{padding-top:calc(var(--spacing)*1)}.pt-1\\.5{padding-top:calc(var(--spacing)*1.5)}.pt-2{padding-top:calc(var(--spacing)*2)}.pt-4{padding-top:calc(var(--spacing)*4)}.pt-6{padding-top:calc(var(--spacing)*6)}.pt-12{padding-top:calc(var(--spacing)*12)}.pt-24{padding-top:calc(var(--spacing)*24)}.pt-px{padding-top:1px}.pr-4{padding-right:calc(var(--spacing)*4)}.pr-8{padding-right:calc(var(--spacing)*8)}.pr-16{padding-right:calc(var(--spacing)*16)}.pr-\\[calc\\(2rem-5px\\)\\]{padding-right:calc(2rem - 5px)}.pb-0{padding-bottom:calc(var(--spacing)*0)}.pb-0\\.75{padding-bottom:calc(var(--spacing)*.75)}.pb-1{padding-bottom:calc(var(--spacing)*1)}.pb-2{padding-bottom:calc(var(--spacing)*2)}.pb-3{padding-bottom:calc(var(--spacing)*3)}.pb-4{padding-bottom:calc(var(--spacing)*4)}.pb-6{padding-bottom:calc(var(--spacing)*6)}.pb-6\\.5{padding-bottom:calc(var(--spacing)*6.5)}.pb-8{padding-bottom:calc(var(--spacing)*8)}.pb-16{padding-bottom:calc(var(--spacing)*16)}.pb-20{padding-bottom:calc(var(--spacing)*20)}.pl-2{padding-left:calc(var(--spacing)*2)}.pl-4{padding-left:calc(var(--spacing)*4)}.pl-8{padding-left:calc(var(--spacing)*8)}.pl-24{padding-left:calc(var(--spacing)*24)}.text-center{text-align:center}.text-end{text-align:end}.text-left{text-align:left}.text-start{text-align:start}.text-start\\!{text-align:start!important}.align-middle{vertical-align:middle}.text-2xl{font-size:var(--text-2xl);line-height:var(--tw-leading,var(--text-2xl--line-height))}.text-3xl{font-size:var(--text-3xl);line-height:var(--tw-leading,var(--text-3xl--line-height))}.text-4xl{font-size:var(--text-4xl);line-height:var(--tw-leading,var(--text-4xl--line-height))}.text-5xl{font-size:var(--text-5xl);line-height:var(--tw-leading,var(--text-5xl--line-height))}.text-7xl{font-size:var(--text-7xl);line-height:var(--tw-leading,var(--text-7xl--line-height))}.text-\\[2rem\\]\\/\\[45px\\]{font-size:2rem;line-height:45px}.text-base{font-size:var(--text-base);line-height:var(--tw-leading,var(--text-base--line-height))}.text-base\\/6{font-size:var(--text-base);line-height:calc(var(--spacing)*6)}.text-lg{font-size:var(--text-lg);line-height:var(--tw-leading,var(--text-lg--line-height))}.text-sm{font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height))}.text-sm\\/6{font-size:var(--text-sm);line-height:calc(var(--spacing)*6)}.text-xl{font-size:var(--text-xl);line-height:var(--tw-leading,var(--text-xl--line-height))}.text-xs{font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height))}.text-xs\\/6{font-size:var(--text-xs);line-height:calc(var(--spacing)*6)}.text-\\[1\\.17em\\]{font-size:1.17em}.text-\\[9px\\]{font-size:9px}.text-\\[10px\\]{font-size:10px}.text-\\[11px\\]{font-size:11px}.text-\\[18px\\]{font-size:18px}.leading-none{--tw-leading:1;line-height:1}.leading-normal{--tw-leading:var(--leading-normal);line-height:var(--leading-normal)}.font-bold{--tw-font-weight:var(--font-weight-bold);font-weight:var(--font-weight-bold)}.font-bold\\!{--tw-font-weight:var(--font-weight-bold)!important;font-weight:var(--font-weight-bold)!important}.font-extrabold{--tw-font-weight:var(--font-weight-extrabold);font-weight:var(--font-weight-extrabold)}.font-extrabold\\!{--tw-font-weight:var(--font-weight-extrabold)!important;font-weight:var(--font-weight-extrabold)!important}.font-medium{--tw-font-weight:var(--font-weight-medium);font-weight:var(--font-weight-medium)}.font-normal{--tw-font-weight:var(--font-weight-normal);font-weight:var(--font-weight-normal)}.font-semibold{--tw-font-weight:var(--font-weight-semibold);font-weight:var(--font-weight-semibold)}.text-wrap{text-wrap:wrap}.break-words{overflow-wrap:break-word}.text-ellipsis{text-overflow:ellipsis}.whitespace-normal{white-space:normal}.whitespace-normal\\!{white-space:normal!important}.whitespace-nowrap{white-space:nowrap}.whitespace-pre-line{white-space:pre-line}.\\!text-white{color:var(--color-white)!important}.text-\\[\\#4D6BEE\\]{color:#4d6bee}.text-\\[\\#359BD4\\]{color:#359bd4}.text-\\[\\#4895be\\]{color:#4895be}.text-\\[\\#959595\\]{color:#959595}.text-\\[\\#EF3F62\\]{color:#ef3f62}.text-\\[\\#FFDD31\\]{color:#ffdd31}.text-black{color:var(--color-black)}.text-gray-500{color:var(--color-gray-500)}.text-white{color:var(--color-white)}.text-white\\!{color:var(--color-white)!important}.text-white\\/20{color:#fff3}@supports (color:color-mix(in lab,red,red)){.text-white\\/20{color:var(--color-white)}@supports (color:color-mix(in lab,red,red)){.text-white\\/20{color:color-mix(in oklab,var(--color-white)20%,transparent)}}}.text-white\\/30{color:#ffffff4d}@supports (color:color-mix(in lab,red,red)){.text-white\\/30{color:var(--color-white)}@supports (color:color-mix(in lab,red,red)){.text-white\\/30{color:color-mix(in oklab,var(--color-white)30%,transparent)}}}.text-white\\/40{color:#fff6}@supports (color:color-mix(in lab,red,red)){.text-white\\/40{color:var(--color-white)}@supports (color:color-mix(in lab,red,red)){.text-white\\/40{color:color-mix(in oklab,var(--color-white)40%,transparent)}}}.text-white\\/50{color:#ffffff80}@supports (color:color-mix(in lab,red,red)){.text-white\\/50{color:var(--color-white)}@supports (color:color-mix(in lab,red,red)){.text-white\\/50{color:color-mix(in oklab,var(--color-white)50%,transparent)}}}.text-white\\/70{color:#ffffffb3}@supports (color:color-mix(in lab,red,red)){.text-white\\/70{color:var(--color-white)}@supports (color:color-mix(in lab,red,red)){.text-white\\/70{color:color-mix(in oklab,var(--color-white)70%,transparent)}}}.text-white\\/70\\!{color:#ffffffb3!important}@supports (color:color-mix(in lab,red,red)){.text-white\\/70\\!{color:var(--color-white)!important}@supports (color:color-mix(in lab,red,red)){.text-white\\/70\\!{color:color-mix(in oklab,var(--color-white)70%,transparent)!important}}}.text-yellow-300{color:var(--color-yellow-300)}.capitalize{text-transform:capitalize}.lowercase{text-transform:lowercase}.uppercase{text-transform:uppercase}.italic{font-style:italic}.ordinal{--tw-ordinal:ordinal;font-variant-numeric:var(--tw-ordinal, )var(--tw-slashed-zero, )var(--tw-numeric-figure, )var(--tw-numeric-spacing, )var(--tw-numeric-fraction, )}.\\!underline{-webkit-text-decoration-line:underline!important;text-decoration-line:underline!important}.line-through{-webkit-text-decoration-line:line-through;text-decoration-line:line-through}.overline{-webkit-text-decoration-line:overline;text-decoration-line:overline}.underline{-webkit-text-decoration-line:underline;text-decoration-line:underline}.\\!decoration-white\\/50{-webkit-text-decoration-color:#ffffff80!important;text-decoration-color:#ffffff80!important}@supports (color:color-mix(in lab,red,red)){.\\!decoration-white\\/50{-webkit-text-decoration-color:color-mix(in oklab,var(--color-white)50%,transparent)!important;text-decoration-color:color-mix(in oklab,var(--color-white)50%,transparent)!important}}.decoration-white{-webkit-text-decoration-color:var(--color-white);text-decoration-color:var(--color-white)}.decoration-white\\/30{-webkit-text-decoration-color:#ffffff4d;text-decoration-color:#ffffff4d}@supports (color:color-mix(in lab,red,red)){.decoration-white\\/30{-webkit-text-decoration-color:color-mix(in oklab,var(--color-white)30%,transparent);text-decoration-color:color-mix(in oklab,var(--color-white)30%,transparent)}}.\\!decoration-dotted{-webkit-text-decoration-style:dotted!important;text-decoration-style:dotted!important}.decoration-dotted{-webkit-text-decoration-style:dotted;text-decoration-style:dotted}.\\!decoration-\\[12\\%\\]{text-decoration-thickness:.12em!important}.decoration-\\[12\\%\\]{text-decoration-thickness:.12em}.\\!underline-offset-\\[21\\.5\\%\\]{text-underline-offset:21.5%!important}.underline-offset-\\[21\\.5\\%\\]{text-underline-offset:21.5%}.opacity-0{opacity:0}.opacity-50{opacity:.5}.opacity-60{opacity:.6}.opacity-100{opacity:1}.mix-blend-screen{mix-blend-mode:screen}.shadow{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,#0000001a),0 1px 2px -1px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-2xl{--tw-shadow:0 25px 50px -12px var(--tw-shadow-color,#00000040);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-lg{--tw-shadow:0 10px 15px -3px var(--tw-shadow-color,#0000001a),0 4px 6px -4px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.ring{--tw-ring-shadow:var(--tw-ring-inset, )0 0 0 calc(1px + var(--tw-ring-offset-width))var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.\\[box-shadow\\:0_0_60px_0_rgba\\(247\\,213\\,119\\,1\\.00\\)\\]{box-shadow:0 0 60px #f7d577}.outline{outline-style:var(--tw-outline-style);outline-width:1px}.blur{--tw-blur:blur(8px);-webkit-filter:var(--tw-blur, )var(--tw-brightness, )var(--tw-contrast, )var(--tw-grayscale, )var(--tw-hue-rotate, )var(--tw-invert, )var(--tw-saturate, )var(--tw-sepia, )var(--tw-drop-shadow, );filter:var(--tw-blur, )var(--tw-brightness, )var(--tw-contrast, )var(--tw-grayscale, )var(--tw-hue-rotate, )var(--tw-invert, )var(--tw-saturate, )var(--tw-sepia, )var(--tw-drop-shadow, )}.drop-shadow-md{--tw-drop-shadow-size:drop-shadow(0 3px 3px var(--tw-drop-shadow-color,#0000001f));--tw-drop-shadow:drop-shadow(var(--drop-shadow-md));-webkit-filter:var(--tw-blur, )var(--tw-brightness, )var(--tw-contrast, )var(--tw-grayscale, )var(--tw-hue-rotate, )var(--tw-invert, )var(--tw-saturate, )var(--tw-sepia, )var(--tw-drop-shadow, );filter:var(--tw-blur, )var(--tw-brightness, )var(--tw-contrast, )var(--tw-grayscale, )var(--tw-hue-rotate, )var(--tw-invert, )var(--tw-saturate, )var(--tw-sepia, )var(--tw-drop-shadow, )}.invert{--tw-invert:invert(100%);-webkit-filter:var(--tw-blur, )var(--tw-brightness, )var(--tw-contrast, )var(--tw-grayscale, )var(--tw-hue-rotate, )var(--tw-invert, )var(--tw-saturate, )var(--tw-sepia, )var(--tw-drop-shadow, );filter:var(--tw-blur, )var(--tw-brightness, )var(--tw-contrast, )var(--tw-grayscale, )var(--tw-hue-rotate, )var(--tw-invert, )var(--tw-saturate, )var(--tw-sepia, )var(--tw-drop-shadow, )}.filter{-webkit-filter:var(--tw-blur, )var(--tw-brightness, )var(--tw-contrast, )var(--tw-grayscale, )var(--tw-hue-rotate, )var(--tw-invert, )var(--tw-saturate, )var(--tw-sepia, )var(--tw-drop-shadow, );filter:var(--tw-blur, )var(--tw-brightness, )var(--tw-contrast, )var(--tw-grayscale, )var(--tw-hue-rotate, )var(--tw-invert, )var(--tw-saturate, )var(--tw-sepia, )var(--tw-drop-shadow, )}.backdrop-blur-lg{--tw-backdrop-blur:blur(var(--blur-lg));-webkit-backdrop-filter:var(--tw-backdrop-blur, )var(--tw-backdrop-brightness, )var(--tw-backdrop-contrast, )var(--tw-backdrop-grayscale, )var(--tw-backdrop-hue-rotate, )var(--tw-backdrop-invert, )var(--tw-backdrop-opacity, )var(--tw-backdrop-saturate, )var(--tw-backdrop-sepia, );backdrop-filter:var(--tw-backdrop-blur, )var(--tw-backdrop-brightness, )var(--tw-backdrop-contrast, )var(--tw-backdrop-grayscale, )var(--tw-backdrop-hue-rotate, )var(--tw-backdrop-invert, )var(--tw-backdrop-opacity, )var(--tw-backdrop-saturate, )var(--tw-backdrop-sepia, )}.backdrop-blur-md{--tw-backdrop-blur:blur(var(--blur-md));-webkit-backdrop-filter:var(--tw-backdrop-blur, )var(--tw-backdrop-brightness, )var(--tw-backdrop-contrast, )var(--tw-backdrop-grayscale, )var(--tw-backdrop-hue-rotate, )var(--tw-backdrop-invert, )var(--tw-backdrop-opacity, )var(--tw-backdrop-saturate, )var(--tw-backdrop-sepia, );backdrop-filter:var(--tw-backdrop-blur, )var(--tw-backdrop-brightness, )var(--tw-backdrop-contrast, )var(--tw-backdrop-grayscale, )var(--tw-backdrop-hue-rotate, )var(--tw-backdrop-invert, )var(--tw-backdrop-opacity, )var(--tw-backdrop-saturate, )var(--tw-backdrop-sepia, )}.transition{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,opacity,box-shadow,transform,translate,scale,rotate,filter,-webkit-backdrop-filter,backdrop-filter,display,content-visibility,overlay,pointer-events;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-\\[left\\]{transition-property:left;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-all{transition-property:all;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-colors{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-opacity{transition-property:opacity;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-transform{transition-property:transform,translate,scale,rotate;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.delay-1000{transition-delay:1s}.duration-150{--tw-duration:.15s;transition-duration:.15s}.duration-200{--tw-duration:.2s;transition-duration:.2s}.duration-500{--tw-duration:.5s;transition-duration:.5s}.duration-1000{--tw-duration:1s;transition-duration:1s}.ease-in{--tw-ease:var(--ease-in);transition-timing-function:var(--ease-in)}.ease-in-out{--tw-ease:var(--ease-in-out);transition-timing-function:var(--ease-in-out)}.ease-out{--tw-ease:var(--ease-out);transition-timing-function:var(--ease-out)}.outline-none{--tw-outline-style:none;outline-style:none}.select-none{-webkit-user-select:none;user-select:none}.\\[-ms-overflow-style\\:none\\]{-ms-overflow-style:none}.\\[scrollbar-width\\:none\\]{scrollbar-width:none}.backface-hidden{-webkit-backface-visibility:hidden;backface-visibility:hidden}.text-shadow-lg{text-shadow:0px 1px 2px var(--tw-text-shadow-color,#0000001a),0px 3px 2px var(--tw-text-shadow-color,#0000001a),0px 4px 8px var(--tw-text-shadow-color,#0000001a)}.text-shadow-sm{text-shadow:0px 1px 0px var(--tw-text-shadow-color,#00000013),0px 1px 1px var(--tw-text-shadow-color,#00000013),0px 2px 2px var(--tw-text-shadow-color,#00000013)}.group-focus-within\\/tooltip\\:opacity-100:is(:where(.group\\/tooltip):focus-within *){opacity:1}@media (hover:hover){.group-hover\\:\\!block:is(:where(.group):hover *){display:block!important}.group-hover\\:h-\\[28px\\]:is(:where(.group):hover *){height:28px}.group-hover\\:translate-x-0:is(:where(.group):hover *){--tw-translate-x:calc(var(--spacing)*0);translate:var(--tw-translate-x)var(--tw-translate-y)}.group-hover\\:translate-x-0\\.5:is(:where(.group):hover *){--tw-translate-x:calc(var(--spacing)*.5);translate:var(--tw-translate-x)var(--tw-translate-y)}.group-hover\\:bg-\\[\\#454444\\]:is(:where(.group):hover *){background-color:#454444}.group-hover\\:opacity-100:is(:where(.group):hover *){opacity:1}.group-hover\\:brightness-80:is(:where(.group):hover *){--tw-brightness:brightness(80%);-webkit-filter:var(--tw-blur, )var(--tw-brightness, )var(--tw-contrast, )var(--tw-grayscale, )var(--tw-hue-rotate, )var(--tw-invert, )var(--tw-saturate, )var(--tw-sepia, )var(--tw-drop-shadow, );filter:var(--tw-blur, )var(--tw-brightness, )var(--tw-contrast, )var(--tw-grayscale, )var(--tw-hue-rotate, )var(--tw-invert, )var(--tw-saturate, )var(--tw-sepia, )var(--tw-drop-shadow, )}.group-hover\\/tooltip\\:opacity-100:is(:where(.group\\/tooltip):hover *){opacity:1}}.group-active\\:translate-y-1\\!:is(:where(.group):active *){--tw-translate-y:calc(var(--spacing)*1)!important;translate:var(--tw-translate-x)var(--tw-translate-y)!important}@media (hover:hover){.hover\\:-translate-y-0\\.5:hover{--tw-translate-y:calc(var(--spacing)*-.5);translate:var(--tw-translate-x)var(--tw-translate-y)}.hover\\:scale-105:hover{--tw-scale-x:105%;--tw-scale-y:105%;--tw-scale-z:105%;scale:var(--tw-scale-x)var(--tw-scale-y)}.hover\\:border-white\\/12:hover{border-color:#ffffff1f}@supports (color:color-mix(in lab,red,red)){.hover\\:border-white\\/12:hover{border-color:var(--color-white)}@supports (color:color-mix(in lab,red,red)){.hover\\:border-white\\/12:hover{border-color:color-mix(in oklab,var(--color-white)12%,transparent)}}}.hover\\:bg-\\[\\#3AFF68\\]\\/15:hover{background-color:#3aff6826}.hover\\:bg-\\[\\#222222\\]\\/60:hover{background-color:#2229}.hover\\:bg-\\[\\#343434\\]:hover{background-color:#343434}.hover\\:bg-\\[var\\(--bubble-hover\\)\\]:hover{background-color:var(--bubble-hover)}.hover\\:bg-white\\/6:hover{background-color:#ffffff0f}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-white\\/6:hover{background-color:var(--color-white)}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-white\\/6:hover{background-color:color-mix(in oklab,var(--color-white)6%,transparent)}}}.hover\\:bg-white\\/10:hover{background-color:#ffffff1a}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-white\\/10:hover{background-color:var(--color-white)}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-white\\/10:hover{background-color:color-mix(in oklab,var(--color-white)10%,transparent)}}}.hover\\:text-\\[\\#53afdf\\]:hover{color:#53afdf}.hover\\:text-white:hover{color:var(--color-white)}.hover\\:text-white\\!:hover{color:var(--color-white)!important}.hover\\:brightness-80:hover{--tw-brightness:brightness(80%);-webkit-filter:var(--tw-blur, )var(--tw-brightness, )var(--tw-contrast, )var(--tw-grayscale, )var(--tw-hue-rotate, )var(--tw-invert, )var(--tw-saturate, )var(--tw-sepia, )var(--tw-drop-shadow, );filter:var(--tw-blur, )var(--tw-brightness, )var(--tw-contrast, )var(--tw-grayscale, )var(--tw-hue-rotate, )var(--tw-invert, )var(--tw-saturate, )var(--tw-sepia, )var(--tw-drop-shadow, )}}.focus\\:border-transparent:focus{border-color:#0000}.focus\\:outline-none:focus{--tw-outline-style:none;outline-style:none}.active\\:border-transparent:active{border-color:#0000}.active\\:outline-none:active{--tw-outline-style:none;outline-style:none}.disabled\\:cursor-not-allowed:disabled{cursor:not-allowed}.disabled\\:opacity-50:disabled{opacity:.5}@media (min-width:64rem){.lg\\:block\\!{display:block!important}}@media (min-width:80rem){.xl\\:block\\!{display:block!important}.xl\\:text-lg{font-size:var(--text-lg);line-height:var(--tw-leading,var(--text-lg--line-height))}}.\\[\\&\\:\\:-webkit-scrollbar\\]\\:hidden::-webkit-scrollbar{display:none}}body{background:0 0;font-family:\"Exo 2\",sans-serif;overflow:hidden}@property --tw-translate-x{syntax:\"*\";inherits:false;initial-value:0}@property --tw-translate-y{syntax:\"*\";inherits:false;initial-value:0}@property --tw-translate-z{syntax:\"*\";inherits:false;initial-value:0}@property --tw-scale-x{syntax:\"*\";inherits:false;initial-value:1}@property --tw-scale-y{syntax:\"*\";inherits:false;initial-value:1}@property --tw-scale-z{syntax:\"*\";inherits:false;initial-value:1}@property --tw-rotate-x{syntax:\"*\";inherits:false}@property --tw-rotate-y{syntax:\"*\";inherits:false}@property --tw-rotate-z{syntax:\"*\";inherits:false}@property --tw-skew-x{syntax:\"*\";inherits:false}@property --tw-skew-y{syntax:\"*\";inherits:false}@property --tw-space-y-reverse{syntax:\"*\";inherits:false;initial-value:0}@property --tw-divide-y-reverse{syntax:\"*\";inherits:false;initial-value:0}@property --tw-border-style{syntax:\"*\";inherits:false;initial-value:solid}@property --tw-gradient-position{syntax:\"*\";inherits:false}@property --tw-gradient-from{syntax:\"<color>\";inherits:false;initial-value:#0000}@property --tw-gradient-via{syntax:\"<color>\";inherits:false;initial-value:#0000}@property --tw-gradient-to{syntax:\"<color>\";inherits:false;initial-value:#0000}@property --tw-gradient-stops{syntax:\"*\";inherits:false}@property --tw-gradient-via-stops{syntax:\"*\";inherits:false}@property --tw-gradient-from-position{syntax:\"<length-percentage>\";inherits:false;initial-value:0%}@property --tw-gradient-via-position{syntax:\"<length-percentage>\";inherits:false;initial-value:50%}@property --tw-gradient-to-position{syntax:\"<length-percentage>\";inherits:false;initial-value:100%}@property --tw-leading{syntax:\"*\";inherits:false}@property --tw-font-weight{syntax:\"*\";inherits:false}@property --tw-ordinal{syntax:\"*\";inherits:false}@property --tw-slashed-zero{syntax:\"*\";inherits:false}@property --tw-numeric-figure{syntax:\"*\";inherits:false}@property --tw-numeric-spacing{syntax:\"*\";inherits:false}@property --tw-numeric-fraction{syntax:\"*\";inherits:false}@property --tw-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-shadow-color{syntax:\"*\";inherits:false}@property --tw-shadow-alpha{syntax:\"<percentage>\";inherits:false;initial-value:100%}@property --tw-inset-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-inset-shadow-color{syntax:\"*\";inherits:false}@property --tw-inset-shadow-alpha{syntax:\"<percentage>\";inherits:false;initial-value:100%}@property --tw-ring-color{syntax:\"*\";inherits:false}@property --tw-ring-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-inset-ring-color{syntax:\"*\";inherits:false}@property --tw-inset-ring-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-ring-inset{syntax:\"*\";inherits:false}@property --tw-ring-offset-width{syntax:\"<length>\";inherits:false;initial-value:0}@property --tw-ring-offset-color{syntax:\"*\";inherits:false;initial-value:#fff}@property --tw-ring-offset-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-outline-style{syntax:\"*\";inherits:false;initial-value:solid}@property --tw-blur{syntax:\"*\";inherits:false}@property --tw-brightness{syntax:\"*\";inherits:false}@property --tw-contrast{syntax:\"*\";inherits:false}@property --tw-grayscale{syntax:\"*\";inherits:false}@property --tw-hue-rotate{syntax:\"*\";inherits:false}@property --tw-invert{syntax:\"*\";inherits:false}@property --tw-opacity{syntax:\"*\";inherits:false}@property --tw-saturate{syntax:\"*\";inherits:false}@property --tw-sepia{syntax:\"*\";inherits:false}@property --tw-drop-shadow{syntax:\"*\";inherits:false}@property --tw-drop-shadow-color{syntax:\"*\";inherits:false}@property --tw-drop-shadow-alpha{syntax:\"<percentage>\";inherits:false;initial-value:100%}@property --tw-drop-shadow-size{syntax:\"*\";inherits:false}@property --tw-backdrop-blur{syntax:\"*\";inherits:false}@property --tw-backdrop-brightness{syntax:\"*\";inherits:false}@property --tw-backdrop-contrast{syntax:\"*\";inherits:false}@property --tw-backdrop-grayscale{syntax:\"*\";inherits:false}@property --tw-backdrop-hue-rotate{syntax:\"*\";inherits:false}@property --tw-backdrop-invert{syntax:\"*\";inherits:false}@property --tw-backdrop-opacity{syntax:\"*\";inherits:false}@property --tw-backdrop-saturate{syntax:\"*\";inherits:false}@property --tw-backdrop-sepia{syntax:\"*\";inherits:false}@property --tw-duration{syntax:\"*\";inherits:false}@property --tw-ease{syntax:\"*\";inherits:false}@property --tw-text-shadow-color{syntax:\"*\";inherits:false}@property --tw-text-shadow-alpha{syntax:\"<percentage>\";inherits:false;initial-value:100%}@keyframes pulse{50%{opacity:.5}}\n";document.head.appendChild(s);}})();// @__NO_SIDE_EFFECTS__
function di(e) {
  const n = /* @__PURE__ */ Object.create(null);
  for (const i of e.split(",")) n[i] = 1;
  return (i) => i in n;
}
const ce = {}, _t = [], nt = () => {
}, Cs = () => !1, In = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), hi = (e) => e.startsWith("onUpdate:"), we = Object.assign, pi = (e, n) => {
  const i = e.indexOf(n);
  i > -1 && e.splice(i, 1);
}, Hr = Object.prototype.hasOwnProperty, se = (e, n) => Hr.call(e, n), Q = Array.isArray, Ht = (e) => Bn(e) === "[object Map]", Ps = (e) => Bn(e) === "[object Set]", Z = (e) => typeof e == "function", ve = (e) => typeof e == "string", Pt = (e) => typeof e == "symbol", he = (e) => e !== null && typeof e == "object", Ms = (e) => (he(e) || Z(e)) && Z(e.then) && Z(e.catch), Ts = Object.prototype.toString, Bn = (e) => Ts.call(e), $r = (e) => Bn(e).slice(8, -1), bs = (e) => Bn(e) === "[object Object]", gi = (e) => ve(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Kt = /* @__PURE__ */ di(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), Rn = (e) => {
  const n = /* @__PURE__ */ Object.create(null);
  return ((i) => n[i] || (n[i] = e(i)));
}, Vr = /-\w/g, wt = Rn(
  (e) => e.replace(Vr, (n) => n.slice(1).toUpperCase())
), kr = /\B([A-Z])/g, Ft = Rn(
  (e) => e.replace(kr, "-$1").toLowerCase()
), As = Rn((e) => e.charAt(0).toUpperCase() + e.slice(1)), Vn = Rn(
  (e) => e ? `on${As(e)}` : ""
), yt = (e, n) => !Object.is(e, n), kn = (e, ...n) => {
  for (let i = 0; i < e.length; i++)
    e[i](...n);
}, Es = (e, n, i, c = !1) => {
  Object.defineProperty(e, n, {
    configurable: !0,
    enumerable: !1,
    writable: c,
    value: i
  });
}, Nr = (e) => {
  const n = parseFloat(e);
  return isNaN(n) ? e : n;
}, Wr = (e) => {
  const n = ve(e) ? Number(e) : NaN;
  return isNaN(n) ? e : n;
};
let Oi;
const Fn = () => Oi || (Oi = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function Nt(e) {
  if (Q(e)) {
    const n = {};
    for (let i = 0; i < e.length; i++) {
      const c = e[i], s = ve(c) ? Kr(c) : Nt(c);
      if (s)
        for (const t in s)
          n[t] = s[t];
    }
    return n;
  } else if (ve(e) || he(e))
    return e;
}
const Ur = /;(?![^(]*\))/g, jr = /:([^]+)/, Gr = /\/\*[^]*?\*\//g;
function Kr(e) {
  const n = {};
  return e.replace(Gr, "").split(Ur).forEach((i) => {
    if (i) {
      const c = i.split(jr);
      c.length > 1 && (n[c[0].trim()] = c[1].trim());
    }
  }), n;
}
function vi(e) {
  let n = "";
  if (ve(e))
    n = e;
  else if (Q(e))
    for (let i = 0; i < e.length; i++) {
      const c = vi(e[i]);
      c && (n += c + " ");
    }
  else if (he(e))
    for (const i in e)
      e[i] && (n += i + " ");
  return n.trim();
}
const zr = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", Jr = /* @__PURE__ */ di(zr);
function Is(e) {
  return !!e || e === "";
}
const Bs = (e) => !!(e && e.__v_isRef === !0), qe = (e) => ve(e) ? e : e == null ? "" : Q(e) || he(e) && (e.toString === Ts || !Z(e.toString)) ? Bs(e) ? qe(e.value) : JSON.stringify(e, Rs, 2) : String(e), Rs = (e, n) => Bs(n) ? Rs(e, n.value) : Ht(n) ? {
  [`Map(${n.size})`]: [...n.entries()].reduce(
    (i, [c, s], t) => (i[Nn(c, t) + " =>"] = s, i),
    {}
  )
} : Ps(n) ? {
  [`Set(${n.size})`]: [...n.values()].map((i) => Nn(i))
} : Pt(n) ? Nn(n) : he(n) && !Q(n) && !bs(n) ? String(n) : n, Nn = (e, n = "") => {
  var i;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    Pt(e) ? `Symbol(${(i = e.description) != null ? i : n})` : e
  );
};
let Fe;
class Qr {
  constructor(n = !1) {
    this.detached = n, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this.parent = Fe, !n && Fe && (this.index = (Fe.scopes || (Fe.scopes = [])).push(
      this
    ) - 1);
  }
  get active() {
    return this._active;
  }
  pause() {
    if (this._active) {
      this._isPaused = !0;
      let n, i;
      if (this.scopes)
        for (n = 0, i = this.scopes.length; n < i; n++)
          this.scopes[n].pause();
      for (n = 0, i = this.effects.length; n < i; n++)
        this.effects[n].pause();
    }
  }
  /**
   * Resumes the effect scope, including all child scopes and effects.
   */
  resume() {
    if (this._active && this._isPaused) {
      this._isPaused = !1;
      let n, i;
      if (this.scopes)
        for (n = 0, i = this.scopes.length; n < i; n++)
          this.scopes[n].resume();
      for (n = 0, i = this.effects.length; n < i; n++)
        this.effects[n].resume();
    }
  }
  run(n) {
    if (this._active) {
      const i = Fe;
      try {
        return Fe = this, n();
      } finally {
        Fe = i;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && (this.prevScope = Fe, Fe = this);
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    this._on > 0 && --this._on === 0 && (Fe = this.prevScope, this.prevScope = void 0);
  }
  stop(n) {
    if (this._active) {
      this._active = !1;
      let i, c;
      for (i = 0, c = this.effects.length; i < c; i++)
        this.effects[i].stop();
      for (this.effects.length = 0, i = 0, c = this.cleanups.length; i < c; i++)
        this.cleanups[i]();
      if (this.cleanups.length = 0, this.scopes) {
        for (i = 0, c = this.scopes.length; i < c; i++)
          this.scopes[i].stop(!0);
        this.scopes.length = 0;
      }
      if (!this.detached && this.parent && !n) {
        const s = this.parent.scopes.pop();
        s && s !== this && (this.parent.scopes[this.index] = s, s.index = this.index);
      }
      this.parent = void 0;
    }
  }
}
function Zr() {
  return Fe;
}
let le;
const Wn = /* @__PURE__ */ new WeakSet();
class Fs {
  constructor(n) {
    this.fn = n, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, Fe && Fe.active && Fe.effects.push(this);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, Wn.has(this) && (Wn.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Ls(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, _i(this), Os(this);
    const n = le, i = We;
    le = this, We = !0;
    try {
      return this.fn();
    } finally {
      _s(this), le = n, We = i, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let n = this.deps; n; n = n.nextDep)
        yi(n);
      this.deps = this.depsTail = void 0, _i(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? Wn.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    qn(this) && this.run();
  }
  get dirty() {
    return qn(this);
  }
}
let Ds = 0, zt, Jt;
function Ls(e, n = !1) {
  if (e.flags |= 8, n) {
    e.next = Jt, Jt = e;
    return;
  }
  e.next = zt, zt = e;
}
function mi() {
  Ds++;
}
function xi() {
  if (--Ds > 0)
    return;
  if (Jt) {
    let n = Jt;
    for (Jt = void 0; n; ) {
      const i = n.next;
      n.next = void 0, n.flags &= -9, n = i;
    }
  }
  let e;
  for (; zt; ) {
    let n = zt;
    for (zt = void 0; n; ) {
      const i = n.next;
      if (n.next = void 0, n.flags &= -9, n.flags & 1)
        try {
          n.trigger();
        } catch (c) {
          e || (e = c);
        }
      n = i;
    }
  }
  if (e) throw e;
}
function Os(e) {
  for (let n = e.deps; n; n = n.nextDep)
    n.version = -1, n.prevActiveLink = n.dep.activeLink, n.dep.activeLink = n;
}
function _s(e) {
  let n, i = e.depsTail, c = i;
  for (; c; ) {
    const s = c.prevDep;
    c.version === -1 ? (c === i && (i = s), yi(c), Yr(c)) : n = c, c.dep.activeLink = c.prevActiveLink, c.prevActiveLink = void 0, c = s;
  }
  e.deps = n, e.depsTail = i;
}
function qn(e) {
  for (let n = e.deps; n; n = n.nextDep)
    if (n.dep.version !== n.version || n.dep.computed && (Hs(n.dep.computed) || n.dep.version !== n.version))
      return !0;
  return !!e._dirty;
}
function Hs(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === en) || (e.globalVersion = en, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !qn(e))))
    return;
  e.flags |= 2;
  const n = e.dep, i = le, c = We;
  le = e, We = !0;
  try {
    Os(e);
    const s = e.fn(e._value);
    (n.version === 0 || yt(s, e._value)) && (e.flags |= 128, e._value = s, n.version++);
  } catch (s) {
    throw n.version++, s;
  } finally {
    le = i, We = c, _s(e), e.flags &= -3;
  }
}
function yi(e, n = !1) {
  const { dep: i, prevSub: c, nextSub: s } = e;
  if (c && (c.nextSub = s, e.prevSub = void 0), s && (s.prevSub = c, e.nextSub = void 0), i.subs === e && (i.subs = c, !c && i.computed)) {
    i.computed.flags &= -5;
    for (let t = i.computed.deps; t; t = t.nextDep)
      yi(t, !0);
  }
  !n && !--i.sc && i.map && i.map.delete(i.key);
}
function Yr(e) {
  const { prevDep: n, nextDep: i } = e;
  n && (n.nextDep = i, e.prevDep = void 0), i && (i.prevDep = n, e.nextDep = void 0);
}
let We = !0;
const $s = [];
function ft() {
  $s.push(We), We = !1;
}
function ct() {
  const e = $s.pop();
  We = e === void 0 ? !0 : e;
}
function _i(e) {
  const { cleanup: n } = e;
  if (e.cleanup = void 0, n) {
    const i = le;
    le = void 0;
    try {
      n();
    } finally {
      le = i;
    }
  }
}
let en = 0;
class Xr {
  constructor(n, i) {
    this.sub = n, this.dep = i, this.version = i.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class wi {
  // TODO isolatedDeclarations "__v_skip"
  constructor(n) {
    this.computed = n, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
  }
  track(n) {
    if (!le || !We || le === this.computed)
      return;
    let i = this.activeLink;
    if (i === void 0 || i.sub !== le)
      i = this.activeLink = new Xr(le, this), le.deps ? (i.prevDep = le.depsTail, le.depsTail.nextDep = i, le.depsTail = i) : le.deps = le.depsTail = i, Vs(i);
    else if (i.version === -1 && (i.version = this.version, i.nextDep)) {
      const c = i.nextDep;
      c.prevDep = i.prevDep, i.prevDep && (i.prevDep.nextDep = c), i.prevDep = le.depsTail, i.nextDep = void 0, le.depsTail.nextDep = i, le.depsTail = i, le.deps === i && (le.deps = c);
    }
    return i;
  }
  trigger(n) {
    this.version++, en++, this.notify(n);
  }
  notify(n) {
    mi();
    try {
      for (let i = this.subs; i; i = i.prevSub)
        i.sub.notify() && i.sub.dep.notify();
    } finally {
      xi();
    }
  }
}
function Vs(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const n = e.dep.computed;
    if (n && !e.dep.subs) {
      n.flags |= 20;
      for (let c = n.deps; c; c = c.nextDep)
        Vs(c);
    }
    const i = e.dep.subs;
    i !== e && (e.prevSub = i, i && (i.nextSub = e)), e.dep.subs = e;
  }
}
const ei = /* @__PURE__ */ new WeakMap(), Bt = Symbol(
  ""
), ti = Symbol(
  ""
), tn = Symbol(
  ""
);
function Me(e, n, i) {
  if (We && le) {
    let c = ei.get(e);
    c || ei.set(e, c = /* @__PURE__ */ new Map());
    let s = c.get(i);
    s || (c.set(i, s = new wi()), s.map = c, s.key = i), s.track();
  }
}
function at(e, n, i, c, s, t) {
  const o = ei.get(e);
  if (!o) {
    en++;
    return;
  }
  const l = (f) => {
    f && f.trigger();
  };
  if (mi(), n === "clear")
    o.forEach(l);
  else {
    const f = Q(e), p = f && gi(i);
    if (f && i === "length") {
      const a = Number(c);
      o.forEach((g, h) => {
        (h === "length" || h === tn || !Pt(h) && h >= a) && l(g);
      });
    } else
      switch ((i !== void 0 || o.has(void 0)) && l(o.get(i)), p && l(o.get(tn)), n) {
        case "add":
          f ? p && l(o.get("length")) : (l(o.get(Bt)), Ht(e) && l(o.get(ti)));
          break;
        case "delete":
          f || (l(o.get(Bt)), Ht(e) && l(o.get(ti)));
          break;
        case "set":
          Ht(e) && l(o.get(Bt));
          break;
      }
  }
  xi();
}
function Lt(e) {
  const n = ie(e);
  return n === e ? n : (Me(n, "iterate", tn), Ue(e) ? n : n.map(ut));
}
function Si(e) {
  return Me(e = ie(e), "iterate", tn), e;
}
function gt(e, n) {
  return St(e) ? $t(e) ? nn(ut(n)) : nn(n) : ut(n);
}
const qr = {
  __proto__: null,
  [Symbol.iterator]() {
    return Un(this, Symbol.iterator, (e) => gt(this, e));
  },
  concat(...e) {
    return Lt(this).concat(
      ...e.map((n) => Q(n) ? Lt(n) : n)
    );
  },
  entries() {
    return Un(this, "entries", (e) => (e[1] = gt(this, e[1]), e));
  },
  every(e, n) {
    return it(this, "every", e, n, void 0, arguments);
  },
  filter(e, n) {
    return it(
      this,
      "filter",
      e,
      n,
      (i) => i.map((c) => gt(this, c)),
      arguments
    );
  },
  find(e, n) {
    return it(
      this,
      "find",
      e,
      n,
      (i) => gt(this, i),
      arguments
    );
  },
  findIndex(e, n) {
    return it(this, "findIndex", e, n, void 0, arguments);
  },
  findLast(e, n) {
    return it(
      this,
      "findLast",
      e,
      n,
      (i) => gt(this, i),
      arguments
    );
  },
  findLastIndex(e, n) {
    return it(this, "findLastIndex", e, n, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, n) {
    return it(this, "forEach", e, n, void 0, arguments);
  },
  includes(...e) {
    return jn(this, "includes", e);
  },
  indexOf(...e) {
    return jn(this, "indexOf", e);
  },
  join(e) {
    return Lt(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return jn(this, "lastIndexOf", e);
  },
  map(e, n) {
    return it(this, "map", e, n, void 0, arguments);
  },
  pop() {
    return Ut(this, "pop");
  },
  push(...e) {
    return Ut(this, "push", e);
  },
  reduce(e, ...n) {
    return Hi(this, "reduce", e, n);
  },
  reduceRight(e, ...n) {
    return Hi(this, "reduceRight", e, n);
  },
  shift() {
    return Ut(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, n) {
    return it(this, "some", e, n, void 0, arguments);
  },
  splice(...e) {
    return Ut(this, "splice", e);
  },
  toReversed() {
    return Lt(this).toReversed();
  },
  toSorted(e) {
    return Lt(this).toSorted(e);
  },
  toSpliced(...e) {
    return Lt(this).toSpliced(...e);
  },
  unshift(...e) {
    return Ut(this, "unshift", e);
  },
  values() {
    return Un(this, "values", (e) => gt(this, e));
  }
};
function Un(e, n, i) {
  const c = Si(e), s = c[n]();
  return c !== e && !Ue(e) && (s._next = s.next, s.next = () => {
    const t = s._next();
    return t.done || (t.value = i(t.value)), t;
  }), s;
}
const eo = Array.prototype;
function it(e, n, i, c, s, t) {
  const o = Si(e), l = o !== e && !Ue(e), f = o[n];
  if (f !== eo[n]) {
    const g = f.apply(e, t);
    return l ? ut(g) : g;
  }
  let p = i;
  o !== e && (l ? p = function(g, h) {
    return i.call(this, gt(e, g), h, e);
  } : i.length > 2 && (p = function(g, h) {
    return i.call(this, g, h, e);
  }));
  const a = f.call(o, p, c);
  return l && s ? s(a) : a;
}
function Hi(e, n, i, c) {
  const s = Si(e);
  let t = i;
  return s !== e && (Ue(e) ? i.length > 3 && (t = function(o, l, f) {
    return i.call(this, o, l, f, e);
  }) : t = function(o, l, f) {
    return i.call(this, o, gt(e, l), f, e);
  }), s[n](t, ...c);
}
function jn(e, n, i) {
  const c = ie(e);
  Me(c, "iterate", tn);
  const s = c[n](...i);
  return (s === -1 || s === !1) && Ti(i[0]) ? (i[0] = ie(i[0]), c[n](...i)) : s;
}
function Ut(e, n, i = []) {
  ft(), mi();
  const c = ie(e)[n].apply(e, i);
  return xi(), ct(), c;
}
const to = /* @__PURE__ */ di("__proto__,__v_isRef,__isVue"), ks = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(Pt)
);
function no(e) {
  Pt(e) || (e = String(e));
  const n = ie(this);
  return Me(n, "has", e), n.hasOwnProperty(e);
}
class Ns {
  constructor(n = !1, i = !1) {
    this._isReadonly = n, this._isShallow = i;
  }
  get(n, i, c) {
    if (i === "__v_skip") return n.__v_skip;
    const s = this._isReadonly, t = this._isShallow;
    if (i === "__v_isReactive")
      return !s;
    if (i === "__v_isReadonly")
      return s;
    if (i === "__v_isShallow")
      return t;
    if (i === "__v_raw")
      return c === (s ? t ? ho : Gs : t ? js : Us).get(n) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(n) === Object.getPrototypeOf(c) ? n : void 0;
    const o = Q(n);
    if (!s) {
      let f;
      if (o && (f = qr[i]))
        return f;
      if (i === "hasOwnProperty")
        return no;
    }
    const l = Reflect.get(
      n,
      i,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      Te(n) ? n : c
    );
    if ((Pt(i) ? ks.has(i) : to(i)) || (s || Me(n, "get", i), t))
      return l;
    if (Te(l)) {
      const f = o && gi(i) ? l : l.value;
      return s && he(f) ? ii(f) : f;
    }
    return he(l) ? s ? ii(l) : Pi(l) : l;
  }
}
class Ws extends Ns {
  constructor(n = !1) {
    super(!1, n);
  }
  set(n, i, c, s) {
    let t = n[i];
    const o = Q(n) && gi(i);
    if (!this._isShallow) {
      const p = St(t);
      if (!Ue(c) && !St(c) && (t = ie(t), c = ie(c)), !o && Te(t) && !Te(c))
        return p || (t.value = c), !0;
    }
    const l = o ? Number(i) < n.length : se(n, i), f = Reflect.set(
      n,
      i,
      c,
      Te(n) ? n : s
    );
    return n === ie(s) && (l ? yt(c, t) && at(n, "set", i, c) : at(n, "add", i, c)), f;
  }
  deleteProperty(n, i) {
    const c = se(n, i);
    n[i];
    const s = Reflect.deleteProperty(n, i);
    return s && c && at(n, "delete", i, void 0), s;
  }
  has(n, i) {
    const c = Reflect.has(n, i);
    return (!Pt(i) || !ks.has(i)) && Me(n, "has", i), c;
  }
  ownKeys(n) {
    return Me(
      n,
      "iterate",
      Q(n) ? "length" : Bt
    ), Reflect.ownKeys(n);
  }
}
class io extends Ns {
  constructor(n = !1) {
    super(!0, n);
  }
  set(n, i) {
    return !0;
  }
  deleteProperty(n, i) {
    return !0;
  }
}
const so = /* @__PURE__ */ new Ws(), ro = /* @__PURE__ */ new io(), oo = /* @__PURE__ */ new Ws(!0);
const ni = (e) => e, hn = (e) => Reflect.getPrototypeOf(e);
function ao(e, n, i) {
  return function(...c) {
    const s = this.__v_raw, t = ie(s), o = Ht(t), l = e === "entries" || e === Symbol.iterator && o, f = e === "keys" && o, p = s[e](...c), a = i ? ni : n ? nn : ut;
    return !n && Me(
      t,
      "iterate",
      f ? ti : Bt
    ), {
      // iterator protocol
      next() {
        const { value: g, done: h } = p.next();
        return h ? { value: g, done: h } : {
          value: l ? [a(g[0]), a(g[1])] : a(g),
          done: h
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function pn(e) {
  return function(...n) {
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function lo(e, n) {
  const i = {
    get(s) {
      const t = this.__v_raw, o = ie(t), l = ie(s);
      e || (yt(s, l) && Me(o, "get", s), Me(o, "get", l));
      const { has: f } = hn(o), p = n ? ni : e ? nn : ut;
      if (f.call(o, s))
        return p(t.get(s));
      if (f.call(o, l))
        return p(t.get(l));
      t !== o && t.get(s);
    },
    get size() {
      const s = this.__v_raw;
      return !e && Me(ie(s), "iterate", Bt), s.size;
    },
    has(s) {
      const t = this.__v_raw, o = ie(t), l = ie(s);
      return e || (yt(s, l) && Me(o, "has", s), Me(o, "has", l)), s === l ? t.has(s) : t.has(s) || t.has(l);
    },
    forEach(s, t) {
      const o = this, l = o.__v_raw, f = ie(l), p = n ? ni : e ? nn : ut;
      return !e && Me(f, "iterate", Bt), l.forEach((a, g) => s.call(t, p(a), p(g), o));
    }
  };
  return we(
    i,
    e ? {
      add: pn("add"),
      set: pn("set"),
      delete: pn("delete"),
      clear: pn("clear")
    } : {
      add(s) {
        !n && !Ue(s) && !St(s) && (s = ie(s));
        const t = ie(this);
        return hn(t).has.call(t, s) || (t.add(s), at(t, "add", s, s)), this;
      },
      set(s, t) {
        !n && !Ue(t) && !St(t) && (t = ie(t));
        const o = ie(this), { has: l, get: f } = hn(o);
        let p = l.call(o, s);
        p || (s = ie(s), p = l.call(o, s));
        const a = f.call(o, s);
        return o.set(s, t), p ? yt(t, a) && at(o, "set", s, t) : at(o, "add", s, t), this;
      },
      delete(s) {
        const t = ie(this), { has: o, get: l } = hn(t);
        let f = o.call(t, s);
        f || (s = ie(s), f = o.call(t, s)), l && l.call(t, s);
        const p = t.delete(s);
        return f && at(t, "delete", s, void 0), p;
      },
      clear() {
        const s = ie(this), t = s.size !== 0, o = s.clear();
        return t && at(
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
    i[s] = ao(s, e, n);
  }), i;
}
function Ci(e, n) {
  const i = lo(e, n);
  return (c, s, t) => s === "__v_isReactive" ? !e : s === "__v_isReadonly" ? e : s === "__v_raw" ? c : Reflect.get(
    se(i, s) && s in c ? i : c,
    s,
    t
  );
}
const fo = {
  get: /* @__PURE__ */ Ci(!1, !1)
}, co = {
  get: /* @__PURE__ */ Ci(!1, !0)
}, uo = {
  get: /* @__PURE__ */ Ci(!0, !1)
};
const Us = /* @__PURE__ */ new WeakMap(), js = /* @__PURE__ */ new WeakMap(), Gs = /* @__PURE__ */ new WeakMap(), ho = /* @__PURE__ */ new WeakMap();
function po(e) {
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
function go(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : po($r(e));
}
function Pi(e) {
  return St(e) ? e : Mi(
    e,
    !1,
    so,
    fo,
    Us
  );
}
function vo(e) {
  return Mi(
    e,
    !1,
    oo,
    co,
    js
  );
}
function ii(e) {
  return Mi(
    e,
    !0,
    ro,
    uo,
    Gs
  );
}
function Mi(e, n, i, c, s) {
  if (!he(e) || e.__v_raw && !(n && e.__v_isReactive))
    return e;
  const t = go(e);
  if (t === 0)
    return e;
  const o = s.get(e);
  if (o)
    return o;
  const l = new Proxy(
    e,
    t === 2 ? c : i
  );
  return s.set(e, l), l;
}
function $t(e) {
  return St(e) ? $t(e.__v_raw) : !!(e && e.__v_isReactive);
}
function St(e) {
  return !!(e && e.__v_isReadonly);
}
function Ue(e) {
  return !!(e && e.__v_isShallow);
}
function Ti(e) {
  return e ? !!e.__v_raw : !1;
}
function ie(e) {
  const n = e && e.__v_raw;
  return n ? ie(n) : e;
}
function mo(e) {
  return !se(e, "__v_skip") && Object.isExtensible(e) && Es(e, "__v_skip", !0), e;
}
const ut = (e) => he(e) ? Pi(e) : e, nn = (e) => he(e) ? ii(e) : e;
function Te(e) {
  return e ? e.__v_isRef === !0 : !1;
}
function pe(e) {
  return xo(e, !1);
}
function xo(e, n) {
  return Te(e) ? e : new yo(e, n);
}
class yo {
  constructor(n, i) {
    this.dep = new wi(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = i ? n : ie(n), this._value = i ? n : ut(n), this.__v_isShallow = i;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(n) {
    const i = this._rawValue, c = this.__v_isShallow || Ue(n) || St(n);
    n = c ? n : ie(n), yt(n, i) && (this._rawValue = n, this._value = c ? n : ut(n), this.dep.trigger());
  }
}
function ae(e) {
  return Te(e) ? e.value : e;
}
const wo = {
  get: (e, n, i) => n === "__v_raw" ? e : ae(Reflect.get(e, n, i)),
  set: (e, n, i, c) => {
    const s = e[n];
    return Te(s) && !Te(i) ? (s.value = i, !0) : Reflect.set(e, n, i, c);
  }
};
function Ks(e) {
  return $t(e) ? e : new Proxy(e, wo);
}
class So {
  constructor(n, i, c) {
    this.fn = n, this.setter = i, this._value = void 0, this.dep = new wi(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = en - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !i, this.isSSR = c;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    le !== this)
      return Ls(this, !0), !0;
  }
  get value() {
    const n = this.dep.track();
    return Hs(this), n && (n.version = this.dep.version), this._value;
  }
  set value(n) {
    this.setter && this.setter(n);
  }
}
function Co(e, n, i = !1) {
  let c, s;
  return Z(e) ? c = e : (c = e.get, s = e.set), new So(c, s, i);
}
const gn = {}, Sn = /* @__PURE__ */ new WeakMap();
let Et;
function Po(e, n = !1, i = Et) {
  if (i) {
    let c = Sn.get(i);
    c || Sn.set(i, c = []), c.push(e);
  }
}
function Mo(e, n, i = ce) {
  const { immediate: c, deep: s, once: t, scheduler: o, augmentJob: l, call: f } = i, p = (E) => s ? E : Ue(E) || s === !1 || s === 0 ? xt(E, 1) : xt(E);
  let a, g, h, r, u = !1, d = !1;
  if (Te(e) ? (g = () => e.value, u = Ue(e)) : $t(e) ? (g = () => p(e), u = !0) : Q(e) ? (d = !0, u = e.some((E) => $t(E) || Ue(E)), g = () => e.map((E) => {
    if (Te(E))
      return E.value;
    if ($t(E))
      return p(E);
    if (Z(E))
      return f ? f(E, 2) : E();
  })) : Z(e) ? n ? g = f ? () => f(e, 2) : e : g = () => {
    if (h) {
      ft();
      try {
        h();
      } finally {
        ct();
      }
    }
    const E = Et;
    Et = a;
    try {
      return f ? f(e, 3, [r]) : e(r);
    } finally {
      Et = E;
    }
  } : g = nt, n && s) {
    const E = g, m = s === !0 ? 1 / 0 : s;
    g = () => xt(E(), m);
  }
  const v = Zr(), x = () => {
    a.stop(), v && v.active && pi(v.effects, a);
  };
  if (t && n) {
    const E = n;
    n = (...m) => {
      E(...m), x();
    };
  }
  let M = d ? new Array(e.length).fill(gn) : gn;
  const b = (E) => {
    if (!(!(a.flags & 1) || !a.dirty && !E))
      if (n) {
        const m = a.run();
        if (s || u || (d ? m.some((w, C) => yt(w, M[C])) : yt(m, M))) {
          h && h();
          const w = Et;
          Et = a;
          try {
            const C = [
              m,
              // pass undefined as the old value when it's changed for the first time
              M === gn ? void 0 : d && M[0] === gn ? [] : M,
              r
            ];
            M = m, f ? f(n, 3, C) : (
              // @ts-expect-error
              n(...C)
            );
          } finally {
            Et = w;
          }
        }
      } else
        a.run();
  };
  return l && l(b), a = new Fs(g), a.scheduler = o ? () => o(b, !1) : b, r = (E) => Po(E, !1, a), h = a.onStop = () => {
    const E = Sn.get(a);
    if (E) {
      if (f)
        f(E, 4);
      else
        for (const m of E) m();
      Sn.delete(a);
    }
  }, n ? c ? b(!0) : M = a.run() : o ? o(b.bind(null, !0), !0) : a.run(), x.pause = a.pause.bind(a), x.resume = a.resume.bind(a), x.stop = x, x;
}
function xt(e, n = 1 / 0, i) {
  if (n <= 0 || !he(e) || e.__v_skip || (i = i || /* @__PURE__ */ new Map(), (i.get(e) || 0) >= n))
    return e;
  if (i.set(e, n), n--, Te(e))
    xt(e.value, n, i);
  else if (Q(e))
    for (let c = 0; c < e.length; c++)
      xt(e[c], n, i);
  else if (Ps(e) || Ht(e))
    e.forEach((c) => {
      xt(c, n, i);
    });
  else if (bs(e)) {
    for (const c in e)
      xt(e[c], n, i);
    for (const c of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, c) && xt(e[c], n, i);
  }
  return e;
}
function fn(e, n, i, c) {
  try {
    return c ? e(...c) : e();
  } catch (s) {
    Dn(s, n, i);
  }
}
function je(e, n, i, c) {
  if (Z(e)) {
    const s = fn(e, n, i, c);
    return s && Ms(s) && s.catch((t) => {
      Dn(t, n, i);
    }), s;
  }
  if (Q(e)) {
    const s = [];
    for (let t = 0; t < e.length; t++)
      s.push(je(e[t], n, i, c));
    return s;
  }
}
function Dn(e, n, i, c = !0) {
  const s = n ? n.vnode : null, { errorHandler: t, throwUnhandledErrorInProduction: o } = n && n.appContext.config || ce;
  if (n) {
    let l = n.parent;
    const f = n.proxy, p = `https://vuejs.org/error-reference/#runtime-${i}`;
    for (; l; ) {
      const a = l.ec;
      if (a) {
        for (let g = 0; g < a.length; g++)
          if (a[g](e, f, p) === !1)
            return;
      }
      l = l.parent;
    }
    if (t) {
      ft(), fn(t, null, 10, [
        e,
        f,
        p
      ]), ct();
      return;
    }
  }
  To(e, i, s, c, o);
}
function To(e, n, i, c = !0, s = !1) {
  if (s)
    throw e;
  console.error(e);
}
const Ee = [];
let Ze = -1;
const Vt = [];
let vt = null, Ot = 0;
const zs = /* @__PURE__ */ Promise.resolve();
let Cn = null;
function Js(e) {
  const n = Cn || zs;
  return e ? n.then(this ? e.bind(this) : e) : n;
}
function bo(e) {
  let n = Ze + 1, i = Ee.length;
  for (; n < i; ) {
    const c = n + i >>> 1, s = Ee[c], t = sn(s);
    t < e || t === e && s.flags & 2 ? n = c + 1 : i = c;
  }
  return n;
}
function bi(e) {
  if (!(e.flags & 1)) {
    const n = sn(e), i = Ee[Ee.length - 1];
    !i || // fast path when the job id is larger than the tail
    !(e.flags & 2) && n >= sn(i) ? Ee.push(e) : Ee.splice(bo(n), 0, e), e.flags |= 1, Qs();
  }
}
function Qs() {
  Cn || (Cn = zs.then(Ys));
}
function Ao(e) {
  Q(e) ? Vt.push(...e) : vt && e.id === -1 ? vt.splice(Ot + 1, 0, e) : e.flags & 1 || (Vt.push(e), e.flags |= 1), Qs();
}
function $i(e, n, i = Ze + 1) {
  for (; i < Ee.length; i++) {
    const c = Ee[i];
    if (c && c.flags & 2) {
      if (e && c.id !== e.uid)
        continue;
      Ee.splice(i, 1), i--, c.flags & 4 && (c.flags &= -2), c(), c.flags & 4 || (c.flags &= -2);
    }
  }
}
function Zs(e) {
  if (Vt.length) {
    const n = [...new Set(Vt)].sort(
      (i, c) => sn(i) - sn(c)
    );
    if (Vt.length = 0, vt) {
      vt.push(...n);
      return;
    }
    for (vt = n, Ot = 0; Ot < vt.length; Ot++) {
      const i = vt[Ot];
      i.flags & 4 && (i.flags &= -2), i.flags & 8 || i(), i.flags &= -2;
    }
    vt = null, Ot = 0;
  }
}
const sn = (e) => e.id == null ? e.flags & 2 ? -1 : 1 / 0 : e.id;
function Ys(e) {
  try {
    for (Ze = 0; Ze < Ee.length; Ze++) {
      const n = Ee[Ze];
      n && !(n.flags & 8) && (n.flags & 4 && (n.flags &= -2), fn(
        n,
        n.i,
        n.i ? 15 : 14
      ), n.flags & 4 || (n.flags &= -2));
    }
  } finally {
    for (; Ze < Ee.length; Ze++) {
      const n = Ee[Ze];
      n && (n.flags &= -2);
    }
    Ze = -1, Ee.length = 0, Zs(), Cn = null, (Ee.length || Vt.length) && Ys();
  }
}
let et = null, Xs = null;
function Pn(e) {
  const n = et;
  return et = e, Xs = e && e.type.__scopeId || null, n;
}
function qs(e, n = et, i) {
  if (!n || e._n)
    return e;
  const c = (...s) => {
    c._d && bn(-1);
    const t = Pn(n);
    let o;
    try {
      o = e(...s);
    } finally {
      Pn(t), c._d && bn(1);
    }
    return o;
  };
  return c._n = !0, c._c = !0, c._d = !0, c;
}
function Mt(e, n, i, c) {
  const s = e.dirs, t = n && n.dirs;
  for (let o = 0; o < s.length; o++) {
    const l = s[o];
    t && (l.oldValue = t[o].value);
    let f = l.dir[c];
    f && (ft(), je(f, i, 8, [
      e.el,
      l,
      e,
      n
    ]), ct());
  }
}
const Eo = Symbol("_vte"), er = (e) => e.__isTeleport, ot = Symbol("_leaveCb"), vn = Symbol("_enterCb");
function Io() {
  const e = {
    isMounted: !1,
    isLeaving: !1,
    isUnmounting: !1,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  return un(() => {
    e.isMounted = !0;
  }), Dt(() => {
    e.isUnmounting = !0;
  }), e;
}
const $e = [Function, Array], tr = {
  mode: String,
  appear: Boolean,
  persisted: Boolean,
  // enter
  onBeforeEnter: $e,
  onEnter: $e,
  onAfterEnter: $e,
  onEnterCancelled: $e,
  // leave
  onBeforeLeave: $e,
  onLeave: $e,
  onAfterLeave: $e,
  onLeaveCancelled: $e,
  // appear
  onBeforeAppear: $e,
  onAppear: $e,
  onAfterAppear: $e,
  onAppearCancelled: $e
}, nr = (e) => {
  const n = e.subTree;
  return n.component ? nr(n.component) : n;
}, Bo = {
  name: "BaseTransition",
  props: tr,
  setup(e, { slots: n }) {
    const i = Er(), c = Io();
    return () => {
      const s = n.default && rr(n.default(), !0);
      if (!s || !s.length)
        return;
      const t = ir(s), o = ie(e), { mode: l } = o;
      if (c.isLeaving)
        return Gn(t);
      const f = Vi(t);
      if (!f)
        return Gn(t);
      let p = si(
        f,
        o,
        c,
        i,
        // #11061, ensure enterHooks is fresh after clone
        (g) => p = g
      );
      f.type !== Ie && rn(f, p);
      let a = i.subTree && Vi(i.subTree);
      if (a && a.type !== Ie && !It(a, f) && nr(i).type !== Ie) {
        let g = si(
          a,
          o,
          c,
          i
        );
        if (rn(a, g), l === "out-in" && f.type !== Ie)
          return c.isLeaving = !0, g.afterLeave = () => {
            c.isLeaving = !1, i.job.flags & 8 || i.update(), delete g.afterLeave, a = void 0;
          }, Gn(t);
        l === "in-out" && f.type !== Ie ? g.delayLeave = (h, r, u) => {
          const d = sr(
            c,
            a
          );
          d[String(a.key)] = a, h[ot] = () => {
            r(), h[ot] = void 0, delete p.delayedLeave, a = void 0;
          }, p.delayedLeave = () => {
            u(), delete p.delayedLeave, a = void 0;
          };
        } : a = void 0;
      } else a && (a = void 0);
      return t;
    };
  }
};
function ir(e) {
  let n = e[0];
  if (e.length > 1) {
    for (const i of e)
      if (i.type !== Ie) {
        n = i;
        break;
      }
  }
  return n;
}
const Ro = Bo;
function sr(e, n) {
  const { leavingVNodes: i } = e;
  let c = i.get(n.type);
  return c || (c = /* @__PURE__ */ Object.create(null), i.set(n.type, c)), c;
}
function si(e, n, i, c, s) {
  const {
    appear: t,
    mode: o,
    persisted: l = !1,
    onBeforeEnter: f,
    onEnter: p,
    onAfterEnter: a,
    onEnterCancelled: g,
    onBeforeLeave: h,
    onLeave: r,
    onAfterLeave: u,
    onLeaveCancelled: d,
    onBeforeAppear: v,
    onAppear: x,
    onAfterAppear: M,
    onAppearCancelled: b
  } = n, E = String(e.key), m = sr(i, e), w = (T, S) => {
    T && je(
      T,
      c,
      9,
      S
    );
  }, C = (T, S) => {
    const I = S[1];
    w(T, S), Q(T) ? T.every((P) => P.length <= 1) && I() : T.length <= 1 && I();
  }, y = {
    mode: o,
    persisted: l,
    beforeEnter(T) {
      let S = f;
      if (!i.isMounted)
        if (t)
          S = v || f;
        else
          return;
      T[ot] && T[ot](
        !0
        /* cancelled */
      );
      const I = m[E];
      I && It(e, I) && I.el[ot] && I.el[ot](), w(S, [T]);
    },
    enter(T) {
      let S = p, I = a, P = g;
      if (!i.isMounted)
        if (t)
          S = x || p, I = M || a, P = b || g;
        else
          return;
      let R = !1;
      const _ = T[vn] = (H) => {
        R || (R = !0, H ? w(P, [T]) : w(I, [T]), y.delayedLeave && y.delayedLeave(), T[vn] = void 0);
      };
      S ? C(S, [T, _]) : _();
    },
    leave(T, S) {
      const I = String(e.key);
      if (T[vn] && T[vn](
        !0
        /* cancelled */
      ), i.isUnmounting)
        return S();
      w(h, [T]);
      let P = !1;
      const R = T[ot] = (_) => {
        P || (P = !0, S(), _ ? w(d, [T]) : w(u, [T]), T[ot] = void 0, m[I] === e && delete m[I]);
      };
      m[I] = e, r ? C(r, [T, R]) : R();
    },
    clone(T) {
      const S = si(
        T,
        n,
        i,
        c,
        s
      );
      return s && s(S), S;
    }
  };
  return y;
}
function Gn(e) {
  if (Ln(e))
    return e = Ct(e), e.children = null, e;
}
function Vi(e) {
  if (!Ln(e))
    return er(e.type) && e.children ? ir(e.children) : e;
  if (e.component)
    return e.component.subTree;
  const { shapeFlag: n, children: i } = e;
  if (i) {
    if (n & 16)
      return i[0];
    if (n & 32 && Z(i.default))
      return i.default();
  }
}
function rn(e, n) {
  e.shapeFlag & 6 && e.component ? (e.transition = n, rn(e.component.subTree, n)) : e.shapeFlag & 128 ? (e.ssContent.transition = n.clone(e.ssContent), e.ssFallback.transition = n.clone(e.ssFallback)) : e.transition = n;
}
function rr(e, n = !1, i) {
  let c = [], s = 0;
  for (let t = 0; t < e.length; t++) {
    let o = e[t];
    const l = i == null ? o.key : String(i) + String(o.key != null ? o.key : t);
    o.type === Ye ? (o.patchFlag & 128 && s++, c = c.concat(
      rr(o.children, n, l)
    )) : (n || o.type !== Ie) && c.push(l != null ? Ct(o, { key: l }) : o);
  }
  if (s > 1)
    for (let t = 0; t < c.length; t++)
      c[t].patchFlag = -2;
  return c;
}
// @__NO_SIDE_EFFECTS__
function cn(e, n) {
  return Z(e) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    we({ name: e.name }, n, { setup: e })
  ) : e;
}
function or(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
}
const Mn = /* @__PURE__ */ new WeakMap();
function Qt(e, n, i, c, s = !1) {
  if (Q(e)) {
    e.forEach(
      (u, d) => Qt(
        u,
        n && (Q(n) ? n[d] : n),
        i,
        c,
        s
      )
    );
    return;
  }
  if (Zt(c) && !s) {
    c.shapeFlag & 512 && c.type.__asyncResolved && c.component.subTree.component && Qt(e, n, i, c.component.subTree);
    return;
  }
  const t = c.shapeFlag & 4 ? Bi(c.component) : c.el, o = s ? null : t, { i: l, r: f } = e, p = n && n.r, a = l.refs === ce ? l.refs = {} : l.refs, g = l.setupState, h = ie(g), r = g === ce ? Cs : (u) => se(h, u);
  if (p != null && p !== f) {
    if (ki(n), ve(p))
      a[p] = null, r(p) && (g[p] = null);
    else if (Te(p)) {
      p.value = null;
      const u = n;
      u.k && (a[u.k] = null);
    }
  }
  if (Z(f))
    fn(f, l, 12, [o, a]);
  else {
    const u = ve(f), d = Te(f);
    if (u || d) {
      const v = () => {
        if (e.f) {
          const x = u ? r(f) ? g[f] : a[f] : f.value;
          if (s)
            Q(x) && pi(x, t);
          else if (Q(x))
            x.includes(t) || x.push(t);
          else if (u)
            a[f] = [t], r(f) && (g[f] = a[f]);
          else {
            const M = [t];
            f.value = M, e.k && (a[e.k] = M);
          }
        } else u ? (a[f] = o, r(f) && (g[f] = o)) : d && (f.value = o, e.k && (a[e.k] = o));
      };
      if (o) {
        const x = () => {
          v(), Mn.delete(e);
        };
        x.id = -1, Mn.set(e, x), _e(x, i);
      } else
        ki(e), v();
    }
  }
}
function ki(e) {
  const n = Mn.get(e);
  n && (n.flags |= 8, Mn.delete(e));
}
Fn().requestIdleCallback;
Fn().cancelIdleCallback;
const Zt = (e) => !!e.type.__asyncLoader, Ln = (e) => e.type.__isKeepAlive;
function Fo(e, n) {
  ar(e, "a", n);
}
function Do(e, n) {
  ar(e, "da", n);
}
function ar(e, n, i = Be) {
  const c = e.__wdc || (e.__wdc = () => {
    let s = i;
    for (; s; ) {
      if (s.isDeactivated)
        return;
      s = s.parent;
    }
    return e();
  });
  if (On(n, c, i), i) {
    let s = i.parent;
    for (; s && s.parent; )
      Ln(s.parent.vnode) && Lo(c, n, i, s), s = s.parent;
  }
}
function Lo(e, n, i, c) {
  const s = On(
    n,
    e,
    c,
    !0
    /* prepend */
  );
  lr(() => {
    pi(c[n], s);
  }, i);
}
function On(e, n, i = Be, c = !1) {
  if (i) {
    const s = i[e] || (i[e] = []), t = n.__weh || (n.__weh = (...o) => {
      ft();
      const l = dn(i), f = je(n, i, e, o);
      return l(), ct(), f;
    });
    return c ? s.unshift(t) : s.push(t), t;
  }
}
const dt = (e) => (n, i = Be) => {
  (!an || e === "sp") && On(e, (...c) => n(...c), i);
}, Oo = dt("bm"), un = dt("m"), _o = dt(
  "bu"
), Ho = dt("u"), Dt = dt(
  "bum"
), lr = dt("um"), $o = dt(
  "sp"
), Vo = dt("rtg"), ko = dt("rtc");
function No(e, n = Be) {
  On("ec", e, n);
}
const Wo = Symbol.for("v-ndc"), ri = (e) => e ? Ir(e) ? Bi(e) : ri(e.parent) : null, Yt = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ we(/* @__PURE__ */ Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => e.props,
    $attrs: (e) => e.attrs,
    $slots: (e) => e.slots,
    $refs: (e) => e.refs,
    $parent: (e) => ri(e.parent),
    $root: (e) => ri(e.root),
    $host: (e) => e.ce,
    $emit: (e) => e.emit,
    $options: (e) => cr(e),
    $forceUpdate: (e) => e.f || (e.f = () => {
      bi(e.update);
    }),
    $nextTick: (e) => e.n || (e.n = Js.bind(e.proxy)),
    $watch: (e) => ea.bind(e)
  })
), Kn = (e, n) => e !== ce && !e.__isScriptSetup && se(e, n), Uo = {
  get({ _: e }, n) {
    if (n === "__v_skip")
      return !0;
    const { ctx: i, setupState: c, data: s, props: t, accessCache: o, type: l, appContext: f } = e;
    if (n[0] !== "$") {
      const h = o[n];
      if (h !== void 0)
        switch (h) {
          case 1:
            return c[n];
          case 2:
            return s[n];
          case 4:
            return i[n];
          case 3:
            return t[n];
        }
      else {
        if (Kn(c, n))
          return o[n] = 1, c[n];
        if (s !== ce && se(s, n))
          return o[n] = 2, s[n];
        if (se(t, n))
          return o[n] = 3, t[n];
        if (i !== ce && se(i, n))
          return o[n] = 4, i[n];
        oi && (o[n] = 0);
      }
    }
    const p = Yt[n];
    let a, g;
    if (p)
      return n === "$attrs" && Me(e.attrs, "get", ""), p(e);
    if (
      // css module (injected by vue-loader)
      (a = l.__cssModules) && (a = a[n])
    )
      return a;
    if (i !== ce && se(i, n))
      return o[n] = 4, i[n];
    if (
      // global properties
      g = f.config.globalProperties, se(g, n)
    )
      return g[n];
  },
  set({ _: e }, n, i) {
    const { data: c, setupState: s, ctx: t } = e;
    return Kn(s, n) ? (s[n] = i, !0) : c !== ce && se(c, n) ? (c[n] = i, !0) : se(e.props, n) || n[0] === "$" && n.slice(1) in e ? !1 : (t[n] = i, !0);
  },
  has({
    _: { data: e, setupState: n, accessCache: i, ctx: c, appContext: s, props: t, type: o }
  }, l) {
    let f;
    return !!(i[l] || e !== ce && l[0] !== "$" && se(e, l) || Kn(n, l) || se(t, l) || se(c, l) || se(Yt, l) || se(s.config.globalProperties, l) || (f = o.__cssModules) && f[l]);
  },
  defineProperty(e, n, i) {
    return i.get != null ? e._.accessCache[n] = 0 : se(i, "value") && this.set(e, n, i.value, null), Reflect.defineProperty(e, n, i);
  }
};
function Ni(e) {
  return Q(e) ? e.reduce(
    (n, i) => (n[i] = null, n),
    {}
  ) : e;
}
let oi = !0;
function jo(e) {
  const n = cr(e), i = e.proxy, c = e.ctx;
  oi = !1, n.beforeCreate && Wi(n.beforeCreate, e, "bc");
  const {
    // state
    data: s,
    computed: t,
    methods: o,
    watch: l,
    provide: f,
    inject: p,
    // lifecycle
    created: a,
    beforeMount: g,
    mounted: h,
    beforeUpdate: r,
    updated: u,
    activated: d,
    deactivated: v,
    beforeDestroy: x,
    beforeUnmount: M,
    destroyed: b,
    unmounted: E,
    render: m,
    renderTracked: w,
    renderTriggered: C,
    errorCaptured: y,
    serverPrefetch: T,
    // public API
    expose: S,
    inheritAttrs: I,
    // assets
    components: P,
    directives: R,
    filters: _
  } = n;
  if (p && Go(p, c, null), o)
    for (const k in o) {
      const G = o[k];
      Z(G) && (c[k] = G.bind(i));
    }
  if (s) {
    const k = s.call(i, i);
    he(k) && (e.data = Pi(k));
  }
  if (oi = !0, t)
    for (const k in t) {
      const G = t[k], X = Z(G) ? G.bind(i, i) : Z(G.get) ? G.get.bind(i, i) : nt, ue = !Z(G) && Z(G.set) ? G.set.bind(i) : nt, de = tt({
        get: X,
        set: ue
      });
      Object.defineProperty(c, k, {
        enumerable: !0,
        configurable: !0,
        get: () => de.value,
        set: (re) => de.value = re
      });
    }
  if (l)
    for (const k in l)
      fr(l[k], c, i, k);
  if (f) {
    const k = Z(f) ? f.call(i) : f;
    Reflect.ownKeys(k).forEach((G) => {
      Yo(G, k[G]);
    });
  }
  a && Wi(a, e, "c");
  function U(k, G) {
    Q(G) ? G.forEach((X) => k(X.bind(i))) : G && k(G.bind(i));
  }
  if (U(Oo, g), U(un, h), U(_o, r), U(Ho, u), U(Fo, d), U(Do, v), U(No, y), U(ko, w), U(Vo, C), U(Dt, M), U(lr, E), U($o, T), Q(S))
    if (S.length) {
      const k = e.exposed || (e.exposed = {});
      S.forEach((G) => {
        Object.defineProperty(k, G, {
          get: () => i[G],
          set: (X) => i[G] = X,
          enumerable: !0
        });
      });
    } else e.exposed || (e.exposed = {});
  m && e.render === nt && (e.render = m), I != null && (e.inheritAttrs = I), P && (e.components = P), R && (e.directives = R), T && or(e);
}
function Go(e, n, i = nt) {
  Q(e) && (e = ai(e));
  for (const c in e) {
    const s = e[c];
    let t;
    he(s) ? "default" in s ? t = mn(
      s.from || c,
      s.default,
      !0
    ) : t = mn(s.from || c) : t = mn(s), Te(t) ? Object.defineProperty(n, c, {
      enumerable: !0,
      configurable: !0,
      get: () => t.value,
      set: (o) => t.value = o
    }) : n[c] = t;
  }
}
function Wi(e, n, i) {
  je(
    Q(e) ? e.map((c) => c.bind(n.proxy)) : e.bind(n.proxy),
    n,
    i
  );
}
function fr(e, n, i, c) {
  let s = c.includes(".") ? hr(i, c) : () => i[c];
  if (ve(e)) {
    const t = n[e];
    Z(t) && Rt(s, t);
  } else if (Z(e))
    Rt(s, e.bind(i));
  else if (he(e))
    if (Q(e))
      e.forEach((t) => fr(t, n, i, c));
    else {
      const t = Z(e.handler) ? e.handler.bind(i) : n[e.handler];
      Z(t) && Rt(s, t, e);
    }
}
function cr(e) {
  const n = e.type, { mixins: i, extends: c } = n, {
    mixins: s,
    optionsCache: t,
    config: { optionMergeStrategies: o }
  } = e.appContext, l = t.get(n);
  let f;
  return l ? f = l : !s.length && !i && !c ? f = n : (f = {}, s.length && s.forEach(
    (p) => Tn(f, p, o, !0)
  ), Tn(f, n, o)), he(n) && t.set(n, f), f;
}
function Tn(e, n, i, c = !1) {
  const { mixins: s, extends: t } = n;
  t && Tn(e, t, i, !0), s && s.forEach(
    (o) => Tn(e, o, i, !0)
  );
  for (const o in n)
    if (!(c && o === "expose")) {
      const l = Ko[o] || i && i[o];
      e[o] = l ? l(e[o], n[o]) : n[o];
    }
  return e;
}
const Ko = {
  data: Ui,
  props: ji,
  emits: ji,
  // objects
  methods: Gt,
  computed: Gt,
  // lifecycle
  beforeCreate: be,
  created: be,
  beforeMount: be,
  mounted: be,
  beforeUpdate: be,
  updated: be,
  beforeDestroy: be,
  beforeUnmount: be,
  destroyed: be,
  unmounted: be,
  activated: be,
  deactivated: be,
  errorCaptured: be,
  serverPrefetch: be,
  // assets
  components: Gt,
  directives: Gt,
  // watch
  watch: Jo,
  // provide / inject
  provide: Ui,
  inject: zo
};
function Ui(e, n) {
  return n ? e ? function() {
    return we(
      Z(e) ? e.call(this, this) : e,
      Z(n) ? n.call(this, this) : n
    );
  } : n : e;
}
function zo(e, n) {
  return Gt(ai(e), ai(n));
}
function ai(e) {
  if (Q(e)) {
    const n = {};
    for (let i = 0; i < e.length; i++)
      n[e[i]] = e[i];
    return n;
  }
  return e;
}
function be(e, n) {
  return e ? [...new Set([].concat(e, n))] : n;
}
function Gt(e, n) {
  return e ? we(/* @__PURE__ */ Object.create(null), e, n) : n;
}
function ji(e, n) {
  return e ? Q(e) && Q(n) ? [.../* @__PURE__ */ new Set([...e, ...n])] : we(
    /* @__PURE__ */ Object.create(null),
    Ni(e),
    Ni(n ?? {})
  ) : n;
}
function Jo(e, n) {
  if (!e) return n;
  if (!n) return e;
  const i = we(/* @__PURE__ */ Object.create(null), e);
  for (const c in n)
    i[c] = be(e[c], n[c]);
  return i;
}
function ur() {
  return {
    app: null,
    config: {
      isNativeTag: Cs,
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
let Qo = 0;
function Zo(e, n) {
  return function(c, s = null) {
    Z(c) || (c = we({}, c)), s != null && !he(s) && (s = null);
    const t = ur(), o = /* @__PURE__ */ new WeakSet(), l = [];
    let f = !1;
    const p = t.app = {
      _uid: Qo++,
      _component: c,
      _props: s,
      _container: null,
      _context: t,
      _instance: null,
      version: Fa,
      get config() {
        return t.config;
      },
      set config(a) {
      },
      use(a, ...g) {
        return o.has(a) || (a && Z(a.install) ? (o.add(a), a.install(p, ...g)) : Z(a) && (o.add(a), a(p, ...g))), p;
      },
      mixin(a) {
        return t.mixins.includes(a) || t.mixins.push(a), p;
      },
      component(a, g) {
        return g ? (t.components[a] = g, p) : t.components[a];
      },
      directive(a, g) {
        return g ? (t.directives[a] = g, p) : t.directives[a];
      },
      mount(a, g, h) {
        if (!f) {
          const r = p._ceVNode || Re(c, s);
          return r.appContext = t, h === !0 ? h = "svg" : h === !1 && (h = void 0), e(r, a, h), f = !0, p._container = a, a.__vue_app__ = p, Bi(r.component);
        }
      },
      onUnmount(a) {
        l.push(a);
      },
      unmount() {
        f && (je(
          l,
          p._instance,
          16
        ), e(null, p._container), delete p._container.__vue_app__);
      },
      provide(a, g) {
        return t.provides[a] = g, p;
      },
      runWithContext(a) {
        const g = kt;
        kt = p;
        try {
          return a();
        } finally {
          kt = g;
        }
      }
    };
    return p;
  };
}
let kt = null;
function Yo(e, n) {
  if (Be) {
    let i = Be.provides;
    const c = Be.parent && Be.parent.provides;
    c === i && (i = Be.provides = Object.create(c)), i[e] = n;
  }
}
function mn(e, n, i = !1) {
  const c = Er();
  if (c || kt) {
    let s = kt ? kt._context.provides : c ? c.parent == null || c.ce ? c.vnode.appContext && c.vnode.appContext.provides : c.parent.provides : void 0;
    if (s && e in s)
      return s[e];
    if (arguments.length > 1)
      return i && Z(n) ? n.call(c && c.proxy) : n;
  }
}
const Xo = Symbol.for("v-scx"), qo = () => mn(Xo);
function Rt(e, n, i) {
  return dr(e, n, i);
}
function dr(e, n, i = ce) {
  const { immediate: c, deep: s, flush: t, once: o } = i, l = we({}, i), f = n && c || !n && t !== "post";
  let p;
  if (an) {
    if (t === "sync") {
      const r = qo();
      p = r.__watcherHandles || (r.__watcherHandles = []);
    } else if (!f) {
      const r = () => {
      };
      return r.stop = nt, r.resume = nt, r.pause = nt, r;
    }
  }
  const a = Be;
  l.call = (r, u, d) => je(r, a, u, d);
  let g = !1;
  t === "post" ? l.scheduler = (r) => {
    _e(r, a && a.suspense);
  } : t !== "sync" && (g = !0, l.scheduler = (r, u) => {
    u ? r() : bi(r);
  }), l.augmentJob = (r) => {
    n && (r.flags |= 4), g && (r.flags |= 2, a && (r.id = a.uid, r.i = a));
  };
  const h = Mo(e, n, l);
  return an && (p ? p.push(h) : f && h()), h;
}
function ea(e, n, i) {
  const c = this.proxy, s = ve(e) ? e.includes(".") ? hr(c, e) : () => c[e] : e.bind(c, c);
  let t;
  Z(n) ? t = n : (t = n.handler, i = n);
  const o = dn(this), l = dr(s, t.bind(c), i);
  return o(), l;
}
function hr(e, n) {
  const i = n.split(".");
  return () => {
    let c = e;
    for (let s = 0; s < i.length && c; s++)
      c = c[i[s]];
    return c;
  };
}
const ta = (e, n) => n === "modelValue" || n === "model-value" ? e.modelModifiers : e[`${n}Modifiers`] || e[`${wt(n)}Modifiers`] || e[`${Ft(n)}Modifiers`];
function na(e, n, ...i) {
  if (e.isUnmounted) return;
  const c = e.vnode.props || ce;
  let s = i;
  const t = n.startsWith("update:"), o = t && ta(c, n.slice(7));
  o && (o.trim && (s = i.map((a) => ve(a) ? a.trim() : a)), o.number && (s = i.map(Nr)));
  let l, f = c[l = Vn(n)] || // also try camelCase event handler (#2249)
  c[l = Vn(wt(n))];
  !f && t && (f = c[l = Vn(Ft(n))]), f && je(
    f,
    e,
    6,
    s
  );
  const p = c[l + "Once"];
  if (p) {
    if (!e.emitted)
      e.emitted = {};
    else if (e.emitted[l])
      return;
    e.emitted[l] = !0, je(
      p,
      e,
      6,
      s
    );
  }
}
const ia = /* @__PURE__ */ new WeakMap();
function pr(e, n, i = !1) {
  const c = i ? ia : n.emitsCache, s = c.get(e);
  if (s !== void 0)
    return s;
  const t = e.emits;
  let o = {}, l = !1;
  if (!Z(e)) {
    const f = (p) => {
      const a = pr(p, n, !0);
      a && (l = !0, we(o, a));
    };
    !i && n.mixins.length && n.mixins.forEach(f), e.extends && f(e.extends), e.mixins && e.mixins.forEach(f);
  }
  return !t && !l ? (he(e) && c.set(e, null), null) : (Q(t) ? t.forEach((f) => o[f] = null) : we(o, t), he(e) && c.set(e, o), o);
}
function _n(e, n) {
  return !e || !In(n) ? !1 : (n = n.slice(2).replace(/Once$/, ""), se(e, n[0].toLowerCase() + n.slice(1)) || se(e, Ft(n)) || se(e, n));
}
function Gi(e) {
  const {
    type: n,
    vnode: i,
    proxy: c,
    withProxy: s,
    propsOptions: [t],
    slots: o,
    attrs: l,
    emit: f,
    render: p,
    renderCache: a,
    props: g,
    data: h,
    setupState: r,
    ctx: u,
    inheritAttrs: d
  } = e, v = Pn(e);
  let x, M;
  try {
    if (i.shapeFlag & 4) {
      const E = s || c, m = E;
      x = Xe(
        p.call(
          m,
          E,
          a,
          g,
          r,
          h,
          u
        )
      ), M = l;
    } else {
      const E = n;
      x = Xe(
        E.length > 1 ? E(
          g,
          { attrs: l, slots: o, emit: f }
        ) : E(
          g,
          null
        )
      ), M = n.props ? l : sa(l);
    }
  } catch (E) {
    Xt.length = 0, Dn(E, e, 1), x = Re(Ie);
  }
  let b = x;
  if (M && d !== !1) {
    const E = Object.keys(M), { shapeFlag: m } = b;
    E.length && m & 7 && (t && E.some(hi) && (M = ra(
      M,
      t
    )), b = Ct(b, M, !1, !0));
  }
  return i.dirs && (b = Ct(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(i.dirs) : i.dirs), i.transition && rn(b, i.transition), x = b, Pn(v), x;
}
const sa = (e) => {
  let n;
  for (const i in e)
    (i === "class" || i === "style" || In(i)) && ((n || (n = {}))[i] = e[i]);
  return n;
}, ra = (e, n) => {
  const i = {};
  for (const c in e)
    (!hi(c) || !(c.slice(9) in n)) && (i[c] = e[c]);
  return i;
};
function oa(e, n, i) {
  const { props: c, children: s, component: t } = e, { props: o, children: l, patchFlag: f } = n, p = t.emitsOptions;
  if (n.dirs || n.transition)
    return !0;
  if (i && f >= 0) {
    if (f & 1024)
      return !0;
    if (f & 16)
      return c ? Ki(c, o, p) : !!o;
    if (f & 8) {
      const a = n.dynamicProps;
      for (let g = 0; g < a.length; g++) {
        const h = a[g];
        if (o[h] !== c[h] && !_n(p, h))
          return !0;
      }
    }
  } else
    return (s || l) && (!l || !l.$stable) ? !0 : c === o ? !1 : c ? o ? Ki(c, o, p) : !0 : !!o;
  return !1;
}
function Ki(e, n, i) {
  const c = Object.keys(n);
  if (c.length !== Object.keys(e).length)
    return !0;
  for (let s = 0; s < c.length; s++) {
    const t = c[s];
    if (n[t] !== e[t] && !_n(i, t))
      return !0;
  }
  return !1;
}
function aa({ vnode: e, parent: n }, i) {
  for (; n; ) {
    const c = n.subTree;
    if (c.suspense && c.suspense.activeBranch === e && (c.el = e.el), c === e)
      (e = n.vnode).el = i, n = n.parent;
    else
      break;
  }
}
const gr = {}, vr = () => Object.create(gr), mr = (e) => Object.getPrototypeOf(e) === gr;
function la(e, n, i, c = !1) {
  const s = {}, t = vr();
  e.propsDefaults = /* @__PURE__ */ Object.create(null), xr(e, n, s, t);
  for (const o in e.propsOptions[0])
    o in s || (s[o] = void 0);
  i ? e.props = c ? s : vo(s) : e.type.props ? e.props = s : e.props = t, e.attrs = t;
}
function fa(e, n, i, c) {
  const {
    props: s,
    attrs: t,
    vnode: { patchFlag: o }
  } = e, l = ie(s), [f] = e.propsOptions;
  let p = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (c || o > 0) && !(o & 16)
  ) {
    if (o & 8) {
      const a = e.vnode.dynamicProps;
      for (let g = 0; g < a.length; g++) {
        let h = a[g];
        if (_n(e.emitsOptions, h))
          continue;
        const r = n[h];
        if (f)
          if (se(t, h))
            r !== t[h] && (t[h] = r, p = !0);
          else {
            const u = wt(h);
            s[u] = li(
              f,
              l,
              u,
              r,
              e,
              !1
            );
          }
        else
          r !== t[h] && (t[h] = r, p = !0);
      }
    }
  } else {
    xr(e, n, s, t) && (p = !0);
    let a;
    for (const g in l)
      (!n || // for camelCase
      !se(n, g) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((a = Ft(g)) === g || !se(n, a))) && (f ? i && // for camelCase
      (i[g] !== void 0 || // for kebab-case
      i[a] !== void 0) && (s[g] = li(
        f,
        l,
        g,
        void 0,
        e,
        !0
      )) : delete s[g]);
    if (t !== l)
      for (const g in t)
        (!n || !se(n, g)) && (delete t[g], p = !0);
  }
  p && at(e.attrs, "set", "");
}
function xr(e, n, i, c) {
  const [s, t] = e.propsOptions;
  let o = !1, l;
  if (n)
    for (let f in n) {
      if (Kt(f))
        continue;
      const p = n[f];
      let a;
      s && se(s, a = wt(f)) ? !t || !t.includes(a) ? i[a] = p : (l || (l = {}))[a] = p : _n(e.emitsOptions, f) || (!(f in c) || p !== c[f]) && (c[f] = p, o = !0);
    }
  if (t) {
    const f = ie(i), p = l || ce;
    for (let a = 0; a < t.length; a++) {
      const g = t[a];
      i[g] = li(
        s,
        f,
        g,
        p[g],
        e,
        !se(p, g)
      );
    }
  }
  return o;
}
function li(e, n, i, c, s, t) {
  const o = e[i];
  if (o != null) {
    const l = se(o, "default");
    if (l && c === void 0) {
      const f = o.default;
      if (o.type !== Function && !o.skipFactory && Z(f)) {
        const { propsDefaults: p } = s;
        if (i in p)
          c = p[i];
        else {
          const a = dn(s);
          c = p[i] = f.call(
            null,
            n
          ), a();
        }
      } else
        c = f;
      s.ce && s.ce._setProp(i, c);
    }
    o[
      0
      /* shouldCast */
    ] && (t && !l ? c = !1 : o[
      1
      /* shouldCastTrue */
    ] && (c === "" || c === Ft(i)) && (c = !0));
  }
  return c;
}
const ca = /* @__PURE__ */ new WeakMap();
function yr(e, n, i = !1) {
  const c = i ? ca : n.propsCache, s = c.get(e);
  if (s)
    return s;
  const t = e.props, o = {}, l = [];
  let f = !1;
  if (!Z(e)) {
    const a = (g) => {
      f = !0;
      const [h, r] = yr(g, n, !0);
      we(o, h), r && l.push(...r);
    };
    !i && n.mixins.length && n.mixins.forEach(a), e.extends && a(e.extends), e.mixins && e.mixins.forEach(a);
  }
  if (!t && !f)
    return he(e) && c.set(e, _t), _t;
  if (Q(t))
    for (let a = 0; a < t.length; a++) {
      const g = wt(t[a]);
      zi(g) && (o[g] = ce);
    }
  else if (t)
    for (const a in t) {
      const g = wt(a);
      if (zi(g)) {
        const h = t[a], r = o[g] = Q(h) || Z(h) ? { type: h } : we({}, h), u = r.type;
        let d = !1, v = !0;
        if (Q(u))
          for (let x = 0; x < u.length; ++x) {
            const M = u[x], b = Z(M) && M.name;
            if (b === "Boolean") {
              d = !0;
              break;
            } else b === "String" && (v = !1);
          }
        else
          d = Z(u) && u.name === "Boolean";
        r[
          0
          /* shouldCast */
        ] = d, r[
          1
          /* shouldCastTrue */
        ] = v, (d || se(r, "default")) && l.push(g);
      }
    }
  const p = [o, l];
  return he(e) && c.set(e, p), p;
}
function zi(e) {
  return e[0] !== "$" && !Kt(e);
}
const Ai = (e) => e === "_" || e === "_ctx" || e === "$stable", Ei = (e) => Q(e) ? e.map(Xe) : [Xe(e)], ua = (e, n, i) => {
  if (n._n)
    return n;
  const c = qs((...s) => Ei(n(...s)), i);
  return c._c = !1, c;
}, wr = (e, n, i) => {
  const c = e._ctx;
  for (const s in e) {
    if (Ai(s)) continue;
    const t = e[s];
    if (Z(t))
      n[s] = ua(s, t, c);
    else if (t != null) {
      const o = Ei(t);
      n[s] = () => o;
    }
  }
}, Sr = (e, n) => {
  const i = Ei(n);
  e.slots.default = () => i;
}, Cr = (e, n, i) => {
  for (const c in n)
    (i || !Ai(c)) && (e[c] = n[c]);
}, da = (e, n, i) => {
  const c = e.slots = vr();
  if (e.vnode.shapeFlag & 32) {
    const s = n._;
    s ? (Cr(c, n, i), i && Es(c, "_", s, !0)) : wr(n, c);
  } else n && Sr(e, n);
}, ha = (e, n, i) => {
  const { vnode: c, slots: s } = e;
  let t = !0, o = ce;
  if (c.shapeFlag & 32) {
    const l = n._;
    l ? i && l === 1 ? t = !1 : Cr(s, n, i) : (t = !n.$stable, wr(n, s)), o = n;
  } else n && (Sr(e, n), o = { default: 1 });
  if (t)
    for (const l in s)
      !Ai(l) && o[l] == null && delete s[l];
}, _e = xa;
function pa(e) {
  return ga(e);
}
function ga(e, n) {
  const i = Fn();
  i.__VUE__ = !0;
  const {
    insert: c,
    remove: s,
    patchProp: t,
    createElement: o,
    createText: l,
    createComment: f,
    setText: p,
    setElementText: a,
    parentNode: g,
    nextSibling: h,
    setScopeId: r = nt,
    insertStaticContent: u
  } = e, d = (A, B, F, $ = null, D = null, L = null, W = void 0, V = null, N = !!B.dynamicChildren) => {
    if (A === B)
      return;
    A && !It(A, B) && ($ = Ce(A), re(A, D, L, !0), A = null), B.patchFlag === -2 && (N = !1, B.dynamicChildren = null);
    const { type: O, ref: z, shapeFlag: j } = B;
    switch (O) {
      case Hn:
        v(A, B, F, $);
        break;
      case Ie:
        x(A, B, F, $);
        break;
      case Jn:
        A == null && M(B, F, $, W);
        break;
      case Ye:
        P(
          A,
          B,
          F,
          $,
          D,
          L,
          W,
          V,
          N
        );
        break;
      default:
        j & 1 ? m(
          A,
          B,
          F,
          $,
          D,
          L,
          W,
          V,
          N
        ) : j & 6 ? R(
          A,
          B,
          F,
          $,
          D,
          L,
          W,
          V,
          N
        ) : (j & 64 || j & 128) && O.process(
          A,
          B,
          F,
          $,
          D,
          L,
          W,
          V,
          N,
          Pe
        );
    }
    z != null && D ? Qt(z, A && A.ref, L, B || A, !B) : z == null && A && A.ref != null && Qt(A.ref, null, L, A, !0);
  }, v = (A, B, F, $) => {
    if (A == null)
      c(
        B.el = l(B.children),
        F,
        $
      );
    else {
      const D = B.el = A.el;
      B.children !== A.children && p(D, B.children);
    }
  }, x = (A, B, F, $) => {
    A == null ? c(
      B.el = f(B.children || ""),
      F,
      $
    ) : B.el = A.el;
  }, M = (A, B, F, $) => {
    [A.el, A.anchor] = u(
      A.children,
      B,
      F,
      $,
      A.el,
      A.anchor
    );
  }, b = ({ el: A, anchor: B }, F, $) => {
    let D;
    for (; A && A !== B; )
      D = h(A), c(A, F, $), A = D;
    c(B, F, $);
  }, E = ({ el: A, anchor: B }) => {
    let F;
    for (; A && A !== B; )
      F = h(A), s(A), A = F;
    s(B);
  }, m = (A, B, F, $, D, L, W, V, N) => {
    if (B.type === "svg" ? W = "svg" : B.type === "math" && (W = "mathml"), A == null)
      w(
        B,
        F,
        $,
        D,
        L,
        W,
        V,
        N
      );
    else {
      const O = A.el && A.el._isVueCE ? A.el : null;
      try {
        O && O._beginPatch(), T(
          A,
          B,
          D,
          L,
          W,
          V,
          N
        );
      } finally {
        O && O._endPatch();
      }
    }
  }, w = (A, B, F, $, D, L, W, V) => {
    let N, O;
    const { props: z, shapeFlag: j, transition: K, dirs: J } = A;
    if (N = A.el = o(
      A.type,
      L,
      z && z.is,
      z
    ), j & 8 ? a(N, A.children) : j & 16 && y(
      A.children,
      N,
      null,
      $,
      D,
      zn(A, L),
      W,
      V
    ), J && Mt(A, null, $, "created"), C(N, A, A.scopeId, W, $), z) {
      for (const oe in z)
        oe !== "value" && !Kt(oe) && t(N, oe, null, z[oe], L, $);
      "value" in z && t(N, "value", null, z.value, L), (O = z.onVnodeBeforeMount) && Qe(O, $, A);
    }
    J && Mt(A, null, $, "beforeMount");
    const q = va(D, K);
    q && K.beforeEnter(N), c(N, B, F), ((O = z && z.onVnodeMounted) || q || J) && _e(() => {
      O && Qe(O, $, A), q && K.enter(N), J && Mt(A, null, $, "mounted");
    }, D);
  }, C = (A, B, F, $, D) => {
    if (F && r(A, F), $)
      for (let L = 0; L < $.length; L++)
        r(A, $[L]);
    if (D) {
      let L = D.subTree;
      if (B === L || Tr(L.type) && (L.ssContent === B || L.ssFallback === B)) {
        const W = D.vnode;
        C(
          A,
          W,
          W.scopeId,
          W.slotScopeIds,
          D.parent
        );
      }
    }
  }, y = (A, B, F, $, D, L, W, V, N = 0) => {
    for (let O = N; O < A.length; O++) {
      const z = A[O] = V ? mt(A[O]) : Xe(A[O]);
      d(
        null,
        z,
        B,
        F,
        $,
        D,
        L,
        W,
        V
      );
    }
  }, T = (A, B, F, $, D, L, W) => {
    const V = B.el = A.el;
    let { patchFlag: N, dynamicChildren: O, dirs: z } = B;
    N |= A.patchFlag & 16;
    const j = A.props || ce, K = B.props || ce;
    let J;
    if (F && Tt(F, !1), (J = K.onVnodeBeforeUpdate) && Qe(J, F, B, A), z && Mt(B, A, F, "beforeUpdate"), F && Tt(F, !0), (j.innerHTML && K.innerHTML == null || j.textContent && K.textContent == null) && a(V, ""), O ? S(
      A.dynamicChildren,
      O,
      V,
      F,
      $,
      zn(B, D),
      L
    ) : W || G(
      A,
      B,
      V,
      null,
      F,
      $,
      zn(B, D),
      L,
      !1
    ), N > 0) {
      if (N & 16)
        I(V, j, K, F, D);
      else if (N & 2 && j.class !== K.class && t(V, "class", null, K.class, D), N & 4 && t(V, "style", j.style, K.style, D), N & 8) {
        const q = B.dynamicProps;
        for (let oe = 0; oe < q.length; oe++) {
          const te = q[oe], me = j[te], xe = K[te];
          (xe !== me || te === "value") && t(V, te, me, xe, D, F);
        }
      }
      N & 1 && A.children !== B.children && a(V, B.children);
    } else !W && O == null && I(V, j, K, F, D);
    ((J = K.onVnodeUpdated) || z) && _e(() => {
      J && Qe(J, F, B, A), z && Mt(B, A, F, "updated");
    }, $);
  }, S = (A, B, F, $, D, L, W) => {
    for (let V = 0; V < B.length; V++) {
      const N = A[V], O = B[V], z = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        N.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (N.type === Ye || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !It(N, O) || // - In the case of a component, it could contain anything.
        N.shapeFlag & 198) ? g(N.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          F
        )
      );
      d(
        N,
        O,
        z,
        null,
        $,
        D,
        L,
        W,
        !0
      );
    }
  }, I = (A, B, F, $, D) => {
    if (B !== F) {
      if (B !== ce)
        for (const L in B)
          !Kt(L) && !(L in F) && t(
            A,
            L,
            B[L],
            null,
            D,
            $
          );
      for (const L in F) {
        if (Kt(L)) continue;
        const W = F[L], V = B[L];
        W !== V && L !== "value" && t(A, L, V, W, D, $);
      }
      "value" in F && t(A, "value", B.value, F.value, D);
    }
  }, P = (A, B, F, $, D, L, W, V, N) => {
    const O = B.el = A ? A.el : l(""), z = B.anchor = A ? A.anchor : l("");
    let { patchFlag: j, dynamicChildren: K, slotScopeIds: J } = B;
    J && (V = V ? V.concat(J) : J), A == null ? (c(O, F, $), c(z, F, $), y(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      B.children || [],
      F,
      z,
      D,
      L,
      W,
      V,
      N
    )) : j > 0 && j & 64 && K && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    A.dynamicChildren ? (S(
      A.dynamicChildren,
      K,
      F,
      D,
      L,
      W,
      V
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (B.key != null || D && B === D.subTree) && Pr(
      A,
      B,
      !0
      /* shallow */
    )) : G(
      A,
      B,
      F,
      z,
      D,
      L,
      W,
      V,
      N
    );
  }, R = (A, B, F, $, D, L, W, V, N) => {
    B.slotScopeIds = V, A == null ? B.shapeFlag & 512 ? D.ctx.activate(
      B,
      F,
      $,
      W,
      N
    ) : _(
      B,
      F,
      $,
      D,
      L,
      W,
      N
    ) : H(A, B, N);
  }, _ = (A, B, F, $, D, L, W) => {
    const V = A.component = Ta(
      A,
      $,
      D
    );
    if (Ln(A) && (V.ctx.renderer = Pe), ba(V, !1, W), V.asyncDep) {
      if (D && D.registerDep(V, U, W), !A.el) {
        const N = V.subTree = Re(Ie);
        x(null, N, B, F), A.placeholder = N.el;
      }
    } else
      U(
        V,
        A,
        B,
        F,
        D,
        L,
        W
      );
  }, H = (A, B, F) => {
    const $ = B.component = A.component;
    if (oa(A, B, F))
      if ($.asyncDep && !$.asyncResolved) {
        k($, B, F);
        return;
      } else
        $.next = B, $.update();
    else
      B.el = A.el, $.vnode = B;
  }, U = (A, B, F, $, D, L, W) => {
    const V = () => {
      if (A.isMounted) {
        let { next: j, bu: K, u: J, parent: q, vnode: oe } = A;
        {
          const ze = Mr(A);
          if (ze) {
            j && (j.el = oe.el, k(A, j, W)), ze.asyncDep.then(() => {
              A.isUnmounted || V();
            });
            return;
          }
        }
        let te = j, me;
        Tt(A, !1), j ? (j.el = oe.el, k(A, j, W)) : j = oe, K && kn(K), (me = j.props && j.props.onVnodeBeforeUpdate) && Qe(me, q, j, oe), Tt(A, !0);
        const xe = Gi(A), Ke = A.subTree;
        A.subTree = xe, d(
          Ke,
          xe,
          // parent may have changed if it's in a teleport
          g(Ke.el),
          // anchor may have changed if it's in a fragment
          Ce(Ke),
          A,
          D,
          L
        ), j.el = xe.el, te === null && aa(A, xe.el), J && _e(J, D), (me = j.props && j.props.onVnodeUpdated) && _e(
          () => Qe(me, q, j, oe),
          D
        );
      } else {
        let j;
        const { el: K, props: J } = B, { bm: q, m: oe, parent: te, root: me, type: xe } = A, Ke = Zt(B);
        Tt(A, !1), q && kn(q), !Ke && (j = J && J.onVnodeBeforeMount) && Qe(j, te, B), Tt(A, !0);
        {
          me.ce && // @ts-expect-error _def is private
          me.ce._def.shadowRoot !== !1 && me.ce._injectChildStyle(xe);
          const ze = A.subTree = Gi(A);
          d(
            null,
            ze,
            F,
            $,
            A,
            D,
            L
          ), B.el = ze.el;
        }
        if (oe && _e(oe, D), !Ke && (j = J && J.onVnodeMounted)) {
          const ze = B;
          _e(
            () => Qe(j, te, ze),
            D
          );
        }
        (B.shapeFlag & 256 || te && Zt(te.vnode) && te.vnode.shapeFlag & 256) && A.a && _e(A.a, D), A.isMounted = !0, B = F = $ = null;
      }
    };
    A.scope.on();
    const N = A.effect = new Fs(V);
    A.scope.off();
    const O = A.update = N.run.bind(N), z = A.job = N.runIfDirty.bind(N);
    z.i = A, z.id = A.uid, N.scheduler = () => bi(z), Tt(A, !0), O();
  }, k = (A, B, F) => {
    B.component = A;
    const $ = A.vnode.props;
    A.vnode = B, A.next = null, fa(A, B.props, $, F), ha(A, B.children, F), ft(), $i(A), ct();
  }, G = (A, B, F, $, D, L, W, V, N = !1) => {
    const O = A && A.children, z = A ? A.shapeFlag : 0, j = B.children, { patchFlag: K, shapeFlag: J } = B;
    if (K > 0) {
      if (K & 128) {
        ue(
          O,
          j,
          F,
          $,
          D,
          L,
          W,
          V,
          N
        );
        return;
      } else if (K & 256) {
        X(
          O,
          j,
          F,
          $,
          D,
          L,
          W,
          V,
          N
        );
        return;
      }
    }
    J & 8 ? (z & 16 && ee(O, D, L), j !== O && a(F, j)) : z & 16 ? J & 16 ? ue(
      O,
      j,
      F,
      $,
      D,
      L,
      W,
      V,
      N
    ) : ee(O, D, L, !0) : (z & 8 && a(F, ""), J & 16 && y(
      j,
      F,
      $,
      D,
      L,
      W,
      V,
      N
    ));
  }, X = (A, B, F, $, D, L, W, V, N) => {
    A = A || _t, B = B || _t;
    const O = A.length, z = B.length, j = Math.min(O, z);
    let K;
    for (K = 0; K < j; K++) {
      const J = B[K] = N ? mt(B[K]) : Xe(B[K]);
      d(
        A[K],
        J,
        F,
        null,
        D,
        L,
        W,
        V,
        N
      );
    }
    O > z ? ee(
      A,
      D,
      L,
      !0,
      !1,
      j
    ) : y(
      B,
      F,
      $,
      D,
      L,
      W,
      V,
      N,
      j
    );
  }, ue = (A, B, F, $, D, L, W, V, N) => {
    let O = 0;
    const z = B.length;
    let j = A.length - 1, K = z - 1;
    for (; O <= j && O <= K; ) {
      const J = A[O], q = B[O] = N ? mt(B[O]) : Xe(B[O]);
      if (It(J, q))
        d(
          J,
          q,
          F,
          null,
          D,
          L,
          W,
          V,
          N
        );
      else
        break;
      O++;
    }
    for (; O <= j && O <= K; ) {
      const J = A[j], q = B[K] = N ? mt(B[K]) : Xe(B[K]);
      if (It(J, q))
        d(
          J,
          q,
          F,
          null,
          D,
          L,
          W,
          V,
          N
        );
      else
        break;
      j--, K--;
    }
    if (O > j) {
      if (O <= K) {
        const J = K + 1, q = J < z ? B[J].el : $;
        for (; O <= K; )
          d(
            null,
            B[O] = N ? mt(B[O]) : Xe(B[O]),
            F,
            q,
            D,
            L,
            W,
            V,
            N
          ), O++;
      }
    } else if (O > K)
      for (; O <= j; )
        re(A[O], D, L, !0), O++;
    else {
      const J = O, q = O, oe = /* @__PURE__ */ new Map();
      for (O = q; O <= K; O++) {
        const Oe = B[O] = N ? mt(B[O]) : Xe(B[O]);
        Oe.key != null && oe.set(Oe.key, O);
      }
      let te, me = 0;
      const xe = K - q + 1;
      let Ke = !1, ze = 0;
      const Wt = new Array(xe);
      for (O = 0; O < xe; O++) Wt[O] = 0;
      for (O = J; O <= j; O++) {
        const Oe = A[O];
        if (me >= xe) {
          re(Oe, D, L, !0);
          continue;
        }
        let Je;
        if (Oe.key != null)
          Je = oe.get(Oe.key);
        else
          for (te = q; te <= K; te++)
            if (Wt[te - q] === 0 && It(Oe, B[te])) {
              Je = te;
              break;
            }
        Je === void 0 ? re(Oe, D, L, !0) : (Wt[Je - q] = O + 1, Je >= ze ? ze = Je : Ke = !0, d(
          Oe,
          B[Je],
          F,
          null,
          D,
          L,
          W,
          V,
          N
        ), me++);
      }
      const Fi = Ke ? ma(Wt) : _t;
      for (te = Fi.length - 1, O = xe - 1; O >= 0; O--) {
        const Oe = q + O, Je = B[Oe], Di = B[Oe + 1], Li = Oe + 1 < z ? (
          // #13559, fallback to el placeholder for unresolved async component
          Di.el || Di.placeholder
        ) : $;
        Wt[O] === 0 ? d(
          null,
          Je,
          F,
          Li,
          D,
          L,
          W,
          V,
          N
        ) : Ke && (te < 0 || O !== Fi[te] ? de(Je, F, Li, 2) : te--);
      }
    }
  }, de = (A, B, F, $, D = null) => {
    const { el: L, type: W, transition: V, children: N, shapeFlag: O } = A;
    if (O & 6) {
      de(A.component.subTree, B, F, $);
      return;
    }
    if (O & 128) {
      A.suspense.move(B, F, $);
      return;
    }
    if (O & 64) {
      W.move(A, B, F, Pe);
      return;
    }
    if (W === Ye) {
      c(L, B, F);
      for (let j = 0; j < N.length; j++)
        de(N[j], B, F, $);
      c(A.anchor, B, F);
      return;
    }
    if (W === Jn) {
      b(A, B, F);
      return;
    }
    if ($ !== 2 && O & 1 && V)
      if ($ === 0)
        V.beforeEnter(L), c(L, B, F), _e(() => V.enter(L), D);
      else {
        const { leave: j, delayLeave: K, afterLeave: J } = V, q = () => {
          A.ctx.isUnmounted ? s(L) : c(L, B, F);
        }, oe = () => {
          L._isLeaving && L[ot](
            !0
            /* cancelled */
          ), j(L, () => {
            q(), J && J();
          });
        };
        K ? K(L, q, oe) : oe();
      }
    else
      c(L, B, F);
  }, re = (A, B, F, $ = !1, D = !1) => {
    const {
      type: L,
      props: W,
      ref: V,
      children: N,
      dynamicChildren: O,
      shapeFlag: z,
      patchFlag: j,
      dirs: K,
      cacheIndex: J
    } = A;
    if (j === -2 && (D = !1), V != null && (ft(), Qt(V, null, F, A, !0), ct()), J != null && (B.renderCache[J] = void 0), z & 256) {
      B.ctx.deactivate(A);
      return;
    }
    const q = z & 1 && K, oe = !Zt(A);
    let te;
    if (oe && (te = W && W.onVnodeBeforeUnmount) && Qe(te, B, A), z & 6)
      Le(A.component, F, $);
    else {
      if (z & 128) {
        A.suspense.unmount(F, $);
        return;
      }
      q && Mt(A, null, B, "beforeUnmount"), z & 64 ? A.type.remove(
        A,
        B,
        F,
        Pe,
        $
      ) : O && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !O.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (L !== Ye || j > 0 && j & 64) ? ee(
        O,
        B,
        F,
        !1,
        !0
      ) : (L === Ye && j & 384 || !D && z & 16) && ee(N, B, F), $ && ye(A);
    }
    (oe && (te = W && W.onVnodeUnmounted) || q) && _e(() => {
      te && Qe(te, B, A), q && Mt(A, null, B, "unmounted");
    }, F);
  }, ye = (A) => {
    const { type: B, el: F, anchor: $, transition: D } = A;
    if (B === Ye) {
      Ge(F, $);
      return;
    }
    if (B === Jn) {
      E(A);
      return;
    }
    const L = () => {
      s(F), D && !D.persisted && D.afterLeave && D.afterLeave();
    };
    if (A.shapeFlag & 1 && D && !D.persisted) {
      const { leave: W, delayLeave: V } = D, N = () => W(F, L);
      V ? V(A.el, L, N) : N();
    } else
      L();
  }, Ge = (A, B) => {
    let F;
    for (; A !== B; )
      F = h(A), s(A), A = F;
    s(B);
  }, Le = (A, B, F) => {
    const { bum: $, scope: D, job: L, subTree: W, um: V, m: N, a: O } = A;
    Ji(N), Ji(O), $ && kn($), D.stop(), L && (L.flags |= 8, re(W, A, B, F)), V && _e(V, B), _e(() => {
      A.isUnmounted = !0;
    }, B);
  }, ee = (A, B, F, $ = !1, D = !1, L = 0) => {
    for (let W = L; W < A.length; W++)
      re(A[W], B, F, $, D);
  }, Ce = (A) => {
    if (A.shapeFlag & 6)
      return Ce(A.component.subTree);
    if (A.shapeFlag & 128)
      return A.suspense.next();
    const B = h(A.anchor || A.el), F = B && B[Eo];
    return F ? h(F) : B;
  };
  let ge = !1;
  const ht = (A, B, F) => {
    A == null ? B._vnode && re(B._vnode, null, null, !0) : d(
      B._vnode || null,
      A,
      B,
      null,
      null,
      null,
      F
    ), B._vnode = A, ge || (ge = !0, $i(), Zs(), ge = !1);
  }, Pe = {
    p: d,
    um: re,
    m: de,
    r: ye,
    mt: _,
    mc: y,
    pc: G,
    pbc: S,
    n: Ce,
    o: e
  };
  return {
    render: ht,
    hydrate: void 0,
    createApp: Zo(ht)
  };
}
function zn({ type: e, props: n }, i) {
  return i === "svg" && e === "foreignObject" || i === "mathml" && e === "annotation-xml" && n && n.encoding && n.encoding.includes("html") ? void 0 : i;
}
function Tt({ effect: e, job: n }, i) {
  i ? (e.flags |= 32, n.flags |= 4) : (e.flags &= -33, n.flags &= -5);
}
function va(e, n) {
  return (!e || e && !e.pendingBranch) && n && !n.persisted;
}
function Pr(e, n, i = !1) {
  const c = e.children, s = n.children;
  if (Q(c) && Q(s))
    for (let t = 0; t < c.length; t++) {
      const o = c[t];
      let l = s[t];
      l.shapeFlag & 1 && !l.dynamicChildren && ((l.patchFlag <= 0 || l.patchFlag === 32) && (l = s[t] = mt(s[t]), l.el = o.el), !i && l.patchFlag !== -2 && Pr(o, l)), l.type === Hn && // avoid cached text nodes retaining detached dom nodes
      l.patchFlag !== -1 && (l.el = o.el), l.type === Ie && !l.el && (l.el = o.el);
    }
}
function ma(e) {
  const n = e.slice(), i = [0];
  let c, s, t, o, l;
  const f = e.length;
  for (c = 0; c < f; c++) {
    const p = e[c];
    if (p !== 0) {
      if (s = i[i.length - 1], e[s] < p) {
        n[c] = s, i.push(c);
        continue;
      }
      for (t = 0, o = i.length - 1; t < o; )
        l = t + o >> 1, e[i[l]] < p ? t = l + 1 : o = l;
      p < e[i[t]] && (t > 0 && (n[c] = i[t - 1]), i[t] = c);
    }
  }
  for (t = i.length, o = i[t - 1]; t-- > 0; )
    i[t] = o, o = n[o];
  return i;
}
function Mr(e) {
  const n = e.subTree.component;
  if (n)
    return n.asyncDep && !n.asyncResolved ? n : Mr(n);
}
function Ji(e) {
  if (e)
    for (let n = 0; n < e.length; n++)
      e[n].flags |= 8;
}
const Tr = (e) => e.__isSuspense;
function xa(e, n) {
  n && n.pendingBranch ? Q(e) ? n.effects.push(...e) : n.effects.push(e) : Ao(e);
}
const Ye = Symbol.for("v-fgt"), Hn = Symbol.for("v-txt"), Ie = Symbol.for("v-cmt"), Jn = Symbol.for("v-stc"), Xt = [];
let He = null;
function Ae(e = !1) {
  Xt.push(He = e ? null : []);
}
function ya() {
  Xt.pop(), He = Xt[Xt.length - 1] || null;
}
let on = 1;
function bn(e, n = !1) {
  on += e, e < 0 && He && n && (He.hasOnce = !0);
}
function br(e) {
  return e.dynamicChildren = on > 0 ? He || _t : null, ya(), on > 0 && He && He.push(e), e;
}
function Ne(e, n, i, c, s, t) {
  return br(
    fe(
      e,
      n,
      i,
      c,
      s,
      t,
      !0
    )
  );
}
function $n(e, n, i, c, s) {
  return br(
    Re(
      e,
      n,
      i,
      c,
      s,
      !0
    )
  );
}
function An(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function It(e, n) {
  return e.type === n.type && e.key === n.key;
}
const Ar = ({ key: e }) => e ?? null, xn = ({
  ref: e,
  ref_key: n,
  ref_for: i
}) => (typeof e == "number" && (e = "" + e), e != null ? ve(e) || Te(e) || Z(e) ? { i: et, r: e, k: n, f: !!i } : e : null);
function fe(e, n = null, i = null, c = 0, s = null, t = e === Ye ? 0 : 1, o = !1, l = !1) {
  const f = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: n,
    key: n && Ar(n),
    ref: n && xn(n),
    scopeId: Xs,
    slotScopeIds: null,
    children: i,
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
    shapeFlag: t,
    patchFlag: c,
    dynamicProps: s,
    dynamicChildren: null,
    appContext: null,
    ctx: et
  };
  return l ? (Ii(f, i), t & 128 && e.normalize(f)) : i && (f.shapeFlag |= ve(i) ? 8 : 16), on > 0 && // avoid a block node from tracking itself
  !o && // has current parent block
  He && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (f.patchFlag > 0 || t & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  f.patchFlag !== 32 && He.push(f), f;
}
const Re = wa;
function wa(e, n = null, i = null, c = 0, s = null, t = !1) {
  if ((!e || e === Wo) && (e = Ie), An(e)) {
    const l = Ct(
      e,
      n,
      !0
      /* mergeRef: true */
    );
    return i && Ii(l, i), on > 0 && !t && He && (l.shapeFlag & 6 ? He[He.indexOf(e)] = l : He.push(l)), l.patchFlag = -2, l;
  }
  if (Ba(e) && (e = e.__vccOpts), n) {
    n = Sa(n);
    let { class: l, style: f } = n;
    l && !ve(l) && (n.class = vi(l)), he(f) && (Ti(f) && !Q(f) && (f = we({}, f)), n.style = Nt(f));
  }
  const o = ve(e) ? 1 : Tr(e) ? 128 : er(e) ? 64 : he(e) ? 4 : Z(e) ? 2 : 0;
  return fe(
    e,
    n,
    i,
    c,
    s,
    o,
    t,
    !0
  );
}
function Sa(e) {
  return e ? Ti(e) || mr(e) ? we({}, e) : e : null;
}
function Ct(e, n, i = !1, c = !1) {
  const { props: s, ref: t, patchFlag: o, children: l, transition: f } = e, p = n ? Ca(s || {}, n) : s, a = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: p,
    key: p && Ar(p),
    ref: n && n.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      i && t ? Q(t) ? t.concat(xn(n)) : [t, xn(n)] : xn(n)
    ) : t,
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
    patchFlag: n && e.type !== Ye ? o === -1 ? 16 : o | 16 : o,
    dynamicProps: e.dynamicProps,
    dynamicChildren: e.dynamicChildren,
    appContext: e.appContext,
    dirs: e.dirs,
    transition: f,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: e.component,
    suspense: e.suspense,
    ssContent: e.ssContent && Ct(e.ssContent),
    ssFallback: e.ssFallback && Ct(e.ssFallback),
    placeholder: e.placeholder,
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce
  };
  return f && c && rn(
    a,
    f.clone(a)
  ), a;
}
function qt(e = " ", n = 0) {
  return Re(Hn, null, e, n);
}
function De(e = "", n = !1) {
  return n ? (Ae(), $n(Ie, null, e)) : Re(Ie, null, e);
}
function Xe(e) {
  return e == null || typeof e == "boolean" ? Re(Ie) : Q(e) ? Re(
    Ye,
    null,
    // #3666, avoid reference pollution when reusing vnode
    e.slice()
  ) : An(e) ? mt(e) : Re(Hn, null, String(e));
}
function mt(e) {
  return e.el === null && e.patchFlag !== -1 || e.memo ? e : Ct(e);
}
function Ii(e, n) {
  let i = 0;
  const { shapeFlag: c } = e;
  if (n == null)
    n = null;
  else if (Q(n))
    i = 16;
  else if (typeof n == "object")
    if (c & 65) {
      const s = n.default;
      s && (s._c && (s._d = !1), Ii(e, s()), s._c && (s._d = !0));
      return;
    } else {
      i = 32;
      const s = n._;
      !s && !mr(n) ? n._ctx = et : s === 3 && et && (et.slots._ === 1 ? n._ = 1 : (n._ = 2, e.patchFlag |= 1024));
    }
  else Z(n) ? (n = { default: n, _ctx: et }, i = 32) : (n = String(n), c & 64 ? (i = 16, n = [qt(n)]) : i = 8);
  e.children = n, e.shapeFlag |= i;
}
function Ca(...e) {
  const n = {};
  for (let i = 0; i < e.length; i++) {
    const c = e[i];
    for (const s in c)
      if (s === "class")
        n.class !== c.class && (n.class = vi([n.class, c.class]));
      else if (s === "style")
        n.style = Nt([n.style, c.style]);
      else if (In(s)) {
        const t = n[s], o = c[s];
        o && t !== o && !(Q(t) && t.includes(o)) && (n[s] = t ? [].concat(t, o) : o);
      } else s !== "" && (n[s] = c[s]);
  }
  return n;
}
function Qe(e, n, i, c = null) {
  je(e, n, 7, [
    i,
    c
  ]);
}
const Pa = ur();
let Ma = 0;
function Ta(e, n, i) {
  const c = e.type, s = (n ? n.appContext : e.appContext) || Pa, t = {
    uid: Ma++,
    vnode: e,
    type: c,
    parent: n,
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
    scope: new Qr(
      !0
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: n ? n.provides : Object.create(s.provides),
    ids: n ? n.ids : ["", 0, 0],
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: yr(c, s),
    emitsOptions: pr(c, s),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: ce,
    // inheritAttrs
    inheritAttrs: c.inheritAttrs,
    // state
    ctx: ce,
    data: ce,
    props: ce,
    attrs: ce,
    slots: ce,
    refs: ce,
    setupState: ce,
    setupContext: null,
    // suspense related
    suspense: i,
    suspenseId: i ? i.pendingId : 0,
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
  return t.ctx = { _: t }, t.root = n ? n.root : t, t.emit = na.bind(null, t), e.ce && e.ce(t), t;
}
let Be = null;
const Er = () => Be || et;
let En, fi;
{
  const e = Fn(), n = (i, c) => {
    let s;
    return (s = e[i]) || (s = e[i] = []), s.push(c), (t) => {
      s.length > 1 ? s.forEach((o) => o(t)) : s[0](t);
    };
  };
  En = n(
    "__VUE_INSTANCE_SETTERS__",
    (i) => Be = i
  ), fi = n(
    "__VUE_SSR_SETTERS__",
    (i) => an = i
  );
}
const dn = (e) => {
  const n = Be;
  return En(e), e.scope.on(), () => {
    e.scope.off(), En(n);
  };
}, Qi = () => {
  Be && Be.scope.off(), En(null);
};
function Ir(e) {
  return e.vnode.shapeFlag & 4;
}
let an = !1;
function ba(e, n = !1, i = !1) {
  n && fi(n);
  const { props: c, children: s } = e.vnode, t = Ir(e);
  la(e, c, t, n), da(e, s, i || n);
  const o = t ? Aa(e, n) : void 0;
  return n && fi(!1), o;
}
function Aa(e, n) {
  const i = e.type;
  e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, Uo);
  const { setup: c } = i;
  if (c) {
    ft();
    const s = e.setupContext = c.length > 1 ? Ia(e) : null, t = dn(e), o = fn(
      c,
      e,
      0,
      [
        e.props,
        s
      ]
    ), l = Ms(o);
    if (ct(), t(), (l || e.sp) && !Zt(e) && or(e), l) {
      if (o.then(Qi, Qi), n)
        return o.then((f) => {
          Zi(e, f);
        }).catch((f) => {
          Dn(f, e, 0);
        });
      e.asyncDep = o;
    } else
      Zi(e, o);
  } else
    Br(e);
}
function Zi(e, n, i) {
  Z(n) ? e.type.__ssrInlineRender ? e.ssrRender = n : e.render = n : he(n) && (e.setupState = Ks(n)), Br(e);
}
function Br(e, n, i) {
  const c = e.type;
  e.render || (e.render = c.render || nt);
  {
    const s = dn(e);
    ft();
    try {
      jo(e);
    } finally {
      ct(), s();
    }
  }
}
const Ea = {
  get(e, n) {
    return Me(e, "get", ""), e[n];
  }
};
function Ia(e) {
  const n = (i) => {
    e.exposed = i || {};
  };
  return {
    attrs: new Proxy(e.attrs, Ea),
    slots: e.slots,
    emit: e.emit,
    expose: n
  };
}
function Bi(e) {
  return e.exposed ? e.exposeProxy || (e.exposeProxy = new Proxy(Ks(mo(e.exposed)), {
    get(n, i) {
      if (i in n)
        return n[i];
      if (i in Yt)
        return Yt[i](e);
    },
    has(n, i) {
      return i in n || i in Yt;
    }
  })) : e.proxy;
}
function Ba(e) {
  return Z(e) && "__vccOpts" in e;
}
const tt = (e, n) => Co(e, n, an);
function Ra(e, n, i) {
  try {
    bn(-1);
    const c = arguments.length;
    return c === 2 ? he(n) && !Q(n) ? An(n) ? Re(e, null, [n]) : Re(e, n) : Re(e, null, n) : (c > 3 ? i = Array.prototype.slice.call(arguments, 2) : c === 3 && An(i) && (i = [i]), Re(e, n, i));
  } finally {
    bn(1);
  }
}
const Fa = "3.5.25";
let ci;
const Yi = typeof window < "u" && window.trustedTypes;
if (Yi)
  try {
    ci = /* @__PURE__ */ Yi.createPolicy("vue", {
      createHTML: (e) => e
    });
  } catch {
  }
const Rr = ci ? (e) => ci.createHTML(e) : (e) => e, Da = "http://www.w3.org/2000/svg", La = "http://www.w3.org/1998/Math/MathML", rt = typeof document < "u" ? document : null, Xi = rt && /* @__PURE__ */ rt.createElement("template"), Oa = {
  insert: (e, n, i) => {
    n.insertBefore(e, i || null);
  },
  remove: (e) => {
    const n = e.parentNode;
    n && n.removeChild(e);
  },
  createElement: (e, n, i, c) => {
    const s = n === "svg" ? rt.createElementNS(Da, e) : n === "mathml" ? rt.createElementNS(La, e) : i ? rt.createElement(e, { is: i }) : rt.createElement(e);
    return e === "select" && c && c.multiple != null && s.setAttribute("multiple", c.multiple), s;
  },
  createText: (e) => rt.createTextNode(e),
  createComment: (e) => rt.createComment(e),
  setText: (e, n) => {
    e.nodeValue = n;
  },
  setElementText: (e, n) => {
    e.textContent = n;
  },
  parentNode: (e) => e.parentNode,
  nextSibling: (e) => e.nextSibling,
  querySelector: (e) => rt.querySelector(e),
  setScopeId(e, n) {
    e.setAttribute(n, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(e, n, i, c, s, t) {
    const o = i ? i.previousSibling : n.lastChild;
    if (s && (s === t || s.nextSibling))
      for (; n.insertBefore(s.cloneNode(!0), i), !(s === t || !(s = s.nextSibling)); )
        ;
    else {
      Xi.innerHTML = Rr(
        c === "svg" ? `<svg>${e}</svg>` : c === "mathml" ? `<math>${e}</math>` : e
      );
      const l = Xi.content;
      if (c === "svg" || c === "mathml") {
        const f = l.firstChild;
        for (; f.firstChild; )
          l.appendChild(f.firstChild);
        l.removeChild(f);
      }
      n.insertBefore(l, i);
    }
    return [
      // first
      o ? o.nextSibling : n.firstChild,
      // last
      i ? i.previousSibling : n.lastChild
    ];
  }
}, pt = "transition", jt = "animation", ln = Symbol("_vtc"), Fr = {
  name: String,
  type: String,
  css: {
    type: Boolean,
    default: !0
  },
  duration: [String, Number, Object],
  enterFromClass: String,
  enterActiveClass: String,
  enterToClass: String,
  appearFromClass: String,
  appearActiveClass: String,
  appearToClass: String,
  leaveFromClass: String,
  leaveActiveClass: String,
  leaveToClass: String
}, _a = /* @__PURE__ */ we(
  {},
  tr,
  Fr
), Ha = (e) => (e.displayName = "Transition", e.props = _a, e), $a = /* @__PURE__ */ Ha(
  (e, { slots: n }) => Ra(Ro, Va(e), n)
), bt = (e, n = []) => {
  Q(e) ? e.forEach((i) => i(...n)) : e && e(...n);
}, qi = (e) => e ? Q(e) ? e.some((n) => n.length > 1) : e.length > 1 : !1;
function Va(e) {
  const n = {};
  for (const P in e)
    P in Fr || (n[P] = e[P]);
  if (e.css === !1)
    return n;
  const {
    name: i = "v",
    type: c,
    duration: s,
    enterFromClass: t = `${i}-enter-from`,
    enterActiveClass: o = `${i}-enter-active`,
    enterToClass: l = `${i}-enter-to`,
    appearFromClass: f = t,
    appearActiveClass: p = o,
    appearToClass: a = l,
    leaveFromClass: g = `${i}-leave-from`,
    leaveActiveClass: h = `${i}-leave-active`,
    leaveToClass: r = `${i}-leave-to`
  } = e, u = ka(s), d = u && u[0], v = u && u[1], {
    onBeforeEnter: x,
    onEnter: M,
    onEnterCancelled: b,
    onLeave: E,
    onLeaveCancelled: m,
    onBeforeAppear: w = x,
    onAppear: C = M,
    onAppearCancelled: y = b
  } = n, T = (P, R, _, H) => {
    P._enterCancelled = H, At(P, R ? a : l), At(P, R ? p : o), _ && _();
  }, S = (P, R) => {
    P._isLeaving = !1, At(P, g), At(P, r), At(P, h), R && R();
  }, I = (P) => (R, _) => {
    const H = P ? C : M, U = () => T(R, P, _);
    bt(H, [R, U]), es(() => {
      At(R, P ? f : t), st(R, P ? a : l), qi(H) || ts(R, c, d, U);
    });
  };
  return we(n, {
    onBeforeEnter(P) {
      bt(x, [P]), st(P, t), st(P, o);
    },
    onBeforeAppear(P) {
      bt(w, [P]), st(P, f), st(P, p);
    },
    onEnter: I(!1),
    onAppear: I(!0),
    onLeave(P, R) {
      P._isLeaving = !0;
      const _ = () => S(P, R);
      st(P, g), P._enterCancelled ? (st(P, h), ss(P)) : (ss(P), st(P, h)), es(() => {
        P._isLeaving && (At(P, g), st(P, r), qi(E) || ts(P, c, v, _));
      }), bt(E, [P, _]);
    },
    onEnterCancelled(P) {
      T(P, !1, void 0, !0), bt(b, [P]);
    },
    onAppearCancelled(P) {
      T(P, !0, void 0, !0), bt(y, [P]);
    },
    onLeaveCancelled(P) {
      S(P), bt(m, [P]);
    }
  });
}
function ka(e) {
  if (e == null)
    return null;
  if (he(e))
    return [Qn(e.enter), Qn(e.leave)];
  {
    const n = Qn(e);
    return [n, n];
  }
}
function Qn(e) {
  return Wr(e);
}
function st(e, n) {
  n.split(/\s+/).forEach((i) => i && e.classList.add(i)), (e[ln] || (e[ln] = /* @__PURE__ */ new Set())).add(n);
}
function At(e, n) {
  n.split(/\s+/).forEach((c) => c && e.classList.remove(c));
  const i = e[ln];
  i && (i.delete(n), i.size || (e[ln] = void 0));
}
function es(e) {
  requestAnimationFrame(() => {
    requestAnimationFrame(e);
  });
}
let Na = 0;
function ts(e, n, i, c) {
  const s = e._endId = ++Na, t = () => {
    s === e._endId && c();
  };
  if (i != null)
    return setTimeout(t, i);
  const { type: o, timeout: l, propCount: f } = Wa(e, n);
  if (!o)
    return c();
  const p = o + "end";
  let a = 0;
  const g = () => {
    e.removeEventListener(p, h), t();
  }, h = (r) => {
    r.target === e && ++a >= f && g();
  };
  setTimeout(() => {
    a < f && g();
  }, l + 1), e.addEventListener(p, h);
}
function Wa(e, n) {
  const i = window.getComputedStyle(e), c = (u) => (i[u] || "").split(", "), s = c(`${pt}Delay`), t = c(`${pt}Duration`), o = ns(s, t), l = c(`${jt}Delay`), f = c(`${jt}Duration`), p = ns(l, f);
  let a = null, g = 0, h = 0;
  n === pt ? o > 0 && (a = pt, g = o, h = t.length) : n === jt ? p > 0 && (a = jt, g = p, h = f.length) : (g = Math.max(o, p), a = g > 0 ? o > p ? pt : jt : null, h = a ? a === pt ? t.length : f.length : 0);
  const r = a === pt && /\b(?:transform|all)(?:,|$)/.test(
    c(`${pt}Property`).toString()
  );
  return {
    type: a,
    timeout: g,
    propCount: h,
    hasTransform: r
  };
}
function ns(e, n) {
  for (; e.length < n.length; )
    e = e.concat(e);
  return Math.max(...n.map((i, c) => is(i) + is(e[c])));
}
function is(e) {
  return e === "auto" ? 0 : Number(e.slice(0, -1).replace(",", ".")) * 1e3;
}
function ss(e) {
  return (e ? e.ownerDocument : document).body.offsetHeight;
}
function Ua(e, n, i) {
  const c = e[ln];
  c && (n = (n ? [n, ...c] : [...c]).join(" ")), n == null ? e.removeAttribute("class") : i ? e.setAttribute("class", n) : e.className = n;
}
const rs = Symbol("_vod"), ja = Symbol("_vsh"), Ga = Symbol(""), Ka = /(?:^|;)\s*display\s*:/;
function za(e, n, i) {
  const c = e.style, s = ve(i);
  let t = !1;
  if (i && !s) {
    if (n)
      if (ve(n))
        for (const o of n.split(";")) {
          const l = o.slice(0, o.indexOf(":")).trim();
          i[l] == null && yn(c, l, "");
        }
      else
        for (const o in n)
          i[o] == null && yn(c, o, "");
    for (const o in i)
      o === "display" && (t = !0), yn(c, o, i[o]);
  } else if (s) {
    if (n !== i) {
      const o = c[Ga];
      o && (i += ";" + o), c.cssText = i, t = Ka.test(i);
    }
  } else n && e.removeAttribute("style");
  rs in e && (e[rs] = t ? c.display : "", e[ja] && (c.display = "none"));
}
const os = /\s*!important$/;
function yn(e, n, i) {
  if (Q(i))
    i.forEach((c) => yn(e, n, c));
  else if (i == null && (i = ""), n.startsWith("--"))
    e.setProperty(n, i);
  else {
    const c = Ja(e, n);
    os.test(i) ? e.setProperty(
      Ft(c),
      i.replace(os, ""),
      "important"
    ) : e[c] = i;
  }
}
const as = ["Webkit", "Moz", "ms"], Zn = {};
function Ja(e, n) {
  const i = Zn[n];
  if (i)
    return i;
  let c = wt(n);
  if (c !== "filter" && c in e)
    return Zn[n] = c;
  c = As(c);
  for (let s = 0; s < as.length; s++) {
    const t = as[s] + c;
    if (t in e)
      return Zn[n] = t;
  }
  return n;
}
const ls = "http://www.w3.org/1999/xlink";
function fs(e, n, i, c, s, t = Jr(n)) {
  c && n.startsWith("xlink:") ? i == null ? e.removeAttributeNS(ls, n.slice(6, n.length)) : e.setAttributeNS(ls, n, i) : i == null || t && !Is(i) ? e.removeAttribute(n) : e.setAttribute(
    n,
    t ? "" : Pt(i) ? String(i) : i
  );
}
function cs(e, n, i, c, s) {
  if (n === "innerHTML" || n === "textContent") {
    i != null && (e[n] = n === "innerHTML" ? Rr(i) : i);
    return;
  }
  const t = e.tagName;
  if (n === "value" && t !== "PROGRESS" && // custom elements may use _value internally
  !t.includes("-")) {
    const l = t === "OPTION" ? e.getAttribute("value") || "" : e.value, f = i == null ? (
      // #11647: value should be set as empty string for null and undefined,
      // but <input type="checkbox"> should be set as 'on'.
      e.type === "checkbox" ? "on" : ""
    ) : String(i);
    (l !== f || !("_value" in e)) && (e.value = f), i == null && e.removeAttribute(n), e._value = i;
    return;
  }
  let o = !1;
  if (i === "" || i == null) {
    const l = typeof e[n];
    l === "boolean" ? i = Is(i) : i == null && l === "string" ? (i = "", o = !0) : l === "number" && (i = 0, o = !0);
  }
  try {
    e[n] = i;
  } catch {
  }
  o && e.removeAttribute(s || n);
}
function Qa(e, n, i, c) {
  e.addEventListener(n, i, c);
}
function Za(e, n, i, c) {
  e.removeEventListener(n, i, c);
}
const us = Symbol("_vei");
function Ya(e, n, i, c, s = null) {
  const t = e[us] || (e[us] = {}), o = t[n];
  if (c && o)
    o.value = c;
  else {
    const [l, f] = Xa(n);
    if (c) {
      const p = t[n] = tl(
        c,
        s
      );
      Qa(e, l, p, f);
    } else o && (Za(e, l, o, f), t[n] = void 0);
  }
}
const ds = /(?:Once|Passive|Capture)$/;
function Xa(e) {
  let n;
  if (ds.test(e)) {
    n = {};
    let c;
    for (; c = e.match(ds); )
      e = e.slice(0, e.length - c[0].length), n[c[0].toLowerCase()] = !0;
  }
  return [e[2] === ":" ? e.slice(3) : Ft(e.slice(2)), n];
}
let Yn = 0;
const qa = /* @__PURE__ */ Promise.resolve(), el = () => Yn || (qa.then(() => Yn = 0), Yn = Date.now());
function tl(e, n) {
  const i = (c) => {
    if (!c._vts)
      c._vts = Date.now();
    else if (c._vts <= i.attached)
      return;
    je(
      nl(c, i.value),
      n,
      5,
      [c]
    );
  };
  return i.value = e, i.attached = el(), i;
}
function nl(e, n) {
  if (Q(n)) {
    const i = e.stopImmediatePropagation;
    return e.stopImmediatePropagation = () => {
      i.call(e), e._stopped = !0;
    }, n.map(
      (c) => (s) => !s._stopped && c && c(s)
    );
  } else
    return n;
}
const hs = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // lowercase letter
e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, il = (e, n, i, c, s, t) => {
  const o = s === "svg";
  n === "class" ? Ua(e, c, o) : n === "style" ? za(e, i, c) : In(n) ? hi(n) || Ya(e, n, i, c, t) : (n[0] === "." ? (n = n.slice(1), !0) : n[0] === "^" ? (n = n.slice(1), !1) : sl(e, n, c, o)) ? (cs(e, n, c), !e.tagName.includes("-") && (n === "value" || n === "checked" || n === "selected") && fs(e, n, c, o, t, n !== "value")) : /* #11081 force set props for possible async custom element */ e._isVueCE && (/[A-Z]/.test(n) || !ve(c)) ? cs(e, wt(n), c, t, n) : (n === "true-value" ? e._trueValue = c : n === "false-value" && (e._falseValue = c), fs(e, n, c, o));
};
function sl(e, n, i, c) {
  if (c)
    return !!(n === "innerHTML" || n === "textContent" || n in e && hs(n) && Z(i));
  if (n === "spellcheck" || n === "draggable" || n === "translate" || n === "autocorrect" || n === "sandbox" && e.tagName === "IFRAME" || n === "form" || n === "list" && e.tagName === "INPUT" || n === "type" && e.tagName === "TEXTAREA")
    return !1;
  if (n === "width" || n === "height") {
    const s = e.tagName;
    if (s === "IMG" || s === "VIDEO" || s === "CANVAS" || s === "SOURCE")
      return !1;
  }
  return hs(n) && ve(i) ? !1 : n in e;
}
const rl = /* @__PURE__ */ we({ patchProp: il }, Oa);
let ps;
function ol() {
  return ps || (ps = pa(rl));
}
const al = ((...e) => {
  const n = ol().createApp(...e), { mount: i } = n;
  return n.mount = (c) => {
    const s = fl(c);
    if (!s) return;
    const t = n._component;
    !Z(t) && !t.render && !t.template && (t.template = s.innerHTML), s.nodeType === 1 && (s.textContent = "");
    const o = i(s, !1, ll(s));
    return s instanceof Element && (s.removeAttribute("v-cloak"), s.setAttribute("data-v-app", "")), o;
  }, n;
});
function ll(e) {
  if (e instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement)
    return "mathml";
}
function fl(e) {
  return ve(e) ? document.querySelector(e) : e;
}
const Dr = "https://assets.tikfinity.com", Y = (e) => `${Dr}/${e}`, Se = (e) => `${Dr}/widget/${e}`, lt = {
  widget: {
    wheelOfActions: {
      wheel: Se("wheel-of-actions/images/wheel.png"),
      pin: Se("wheel-of-actions/images/pin.png"),
      dot: Se("wheel-of-actions/images/dot.png"),
      base: Se("wheel-of-actions/images/base.png"),
      shadow: Se("wheel-of-actions/images/shadow.png"),
      click: Se("wheel-of-actions/sounds/click.mp3")
    },
    coinMatch: {
      coin: Se("coin-match/images/coin.png"),
      first: Se("coin-match/images/first.png"),
      second: Se("coin-match/images/second.png"),
      third: Se("coin-match/images/third.png"),
      firstPlace: Se("coin-match/images/first-place.png"),
      secondPlace: Se("coin-match/images/second-place.png"),
      thirdPlace: Se("coin-match/images/third-place.png"),
      ticTac: Se("coin-match/sounds/tic-tac.mp3")
    },
    coinJar: {
      jarTopBg: Se("coin-jar/images/jar-top-bg-2.png"),
      jarTop: Se("coin-jar/images/jar-top.png"),
      jarBottom: Se("coin-jar/images/jar-bottom.png")
    }
  },
  christmasEvent: {
    images: {
      decorations: {
        deco0: Y("christmas-event/images/decorations/deco-0.png"),
        decoWin: Y("christmas-event/images/decorations/deco-win.png"),
        decoWinners: Y("christmas-event/images/decorations/deco-winners.png"),
        snow1: Y("christmas-event/images/decorations/snow-1.png"),
        snow2: Y("christmas-event/images/decorations/snow-2.png"),
        snow3: Y("christmas-event/images/decorations/snow-3.png")
      },
      fintys: {
        fintyGift: Y("christmas-event/images/fintys/finty-gift.png"),
        fintyIncome: Y("christmas-event/images/fintys/finty-income.png")
      },
      icons: {
        prizeIcon: Y("christmas-event/images/icons/prize-icon.png"),
        treeIcon: Y("christmas-event/images/icons/tree-icon.png")
      },
      posters: {
        fintyPoster: Y("christmas-event/images/posters/finty-poster.jpg"),
        particlesPoster: Y("christmas-event/images/posters/particles-poster.jpg"),
        snowPoster: Y("christmas-event/images/posters/snow-poster.png")
      },
      widget: {
        gifts: {
          blueGift: Y("christmas-event/images/widget/gifts/blue-gift.png"),
          greenGift: Y("christmas-event/images/widget/gifts/green-gift.png"),
          redGiftLeft: Y("christmas-event/images/widget/gifts/red-gift-left.png"),
          redGiftRight: Y("christmas-event/images/widget/gifts/red-gift-right.png"),
          yellowGift: Y("christmas-event/images/widget/gifts/yellow-gift.png")
        },
        parts: {
          pineCone: Y("christmas-event/images/widget/parts/pine-cone.png"),
          redChristmasBauble: Y("christmas-event/images/widget/parts/red-christmas-bauble.png"),
          star: Y("christmas-event/images/widget/parts/star.png"),
          sweet: Y("christmas-event/images/widget/parts/sweet.png"),
          yellowChristmasBauble: Y("christmas-event/images/widget/parts/yellow-christmas-bauble.png")
        },
        tree: {
          tree: Y("christmas-event/images/widget/tree/tree.png"),
          leaf: Y("christmas-event/images/widget/tree/leaf.png")
        },
        ui: {
          giftBottom: Y("christmas-event/images/widget/ui/gift-bottom.png"),
          giftTop: Y("christmas-event/images/widget/ui/gift-top.png"),
          goalBar: Y("christmas-event/images/widget/ui/goal-bar.png"),
          treeIcon: Y("christmas-event/images/widget/ui/tree-icon.png")
        }
      },
      wins: {
        baseIncome: Y("christmas-event/images/wins/base-income.png"),
        gamingLaptop: Y("christmas-event/images/wins/gaming-laptop.png"),
        iphone: Y("christmas-event/images/wins/iphone.png"),
        peripherals: Y("christmas-event/images/wins/peripherals.png"),
        ticket: Y("christmas-event/images/wins/ticket.png"),
        ticketNew: Y("christmas-event/images/wins/ticket-new.png"),
        virtualCard: Y("christmas-event/images/wins/virtual-card.png")
      },
      misc: {
        ticketWin: Y("christmas-event/images/misc/ticket-win.png"),
        winnerDraw: Y("christmas-event/images/misc/winner-draw.png")
      }
    },
    videos: {
      snow: Y("christmas-event/videos/snow.webm"),
      fintyChristmas: Y("christmas-event/videos/finty-christmas.mp4"),
      particles: Y("christmas-event/videos/particles.webm")
    }
  }
};
var gs = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function cl(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var wn = { exports: {} };
var ul = wn.exports, vs;
function dl() {
  return vs || (vs = 1, (function(e, n) {
    (function(c, s) {
      e.exports = s();
    })(ul, function() {
      return (
        /******/
        (function(i) {
          var c = {};
          function s(t) {
            if (c[t])
              return c[t].exports;
            var o = c[t] = {
              /******/
              i: t,
              /******/
              l: !1,
              /******/
              exports: {}
              /******/
            };
            return i[t].call(o.exports, o, o.exports, s), o.l = !0, o.exports;
          }
          return s.m = i, s.c = c, s.d = function(t, o, l) {
            s.o(t, o) || Object.defineProperty(t, o, { enumerable: !0, get: l });
          }, s.r = function(t) {
            typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t, "__esModule", { value: !0 });
          }, s.t = function(t, o) {
            if (o & 1 && (t = s(t)), o & 8 || o & 4 && typeof t == "object" && t && t.__esModule) return t;
            var l = /* @__PURE__ */ Object.create(null);
            if (s.r(l), Object.defineProperty(l, "default", { enumerable: !0, value: t }), o & 2 && typeof t != "string") for (var f in t) s.d(l, f, (function(p) {
              return t[p];
            }).bind(null, f));
            return l;
          }, s.n = function(t) {
            var o = t && t.__esModule ? (
              /******/
              function() {
                return t.default;
              }
            ) : (
              /******/
              function() {
                return t;
              }
            );
            return s.d(o, "a", o), o;
          }, s.o = function(t, o) {
            return Object.prototype.hasOwnProperty.call(t, o);
          }, s.p = "", s(s.s = 20);
        })([
          /* 0 */
          /***/
          (function(i, c) {
            var s = {};
            i.exports = s, (function() {
              s._baseDelta = 1e3 / 60, s._nextId = 0, s._seed = 0, s._nowStartTime = +/* @__PURE__ */ new Date(), s._warnedOnce = {}, s._decomp = null, s.extend = function(o, l) {
                var f, p;
                typeof l == "boolean" ? (f = 2, p = l) : (f = 1, p = !0);
                for (var a = f; a < arguments.length; a++) {
                  var g = arguments[a];
                  if (g)
                    for (var h in g)
                      p && g[h] && g[h].constructor === Object && (!o[h] || o[h].constructor === Object) ? (o[h] = o[h] || {}, s.extend(o[h], p, g[h])) : o[h] = g[h];
                }
                return o;
              }, s.clone = function(o, l) {
                return s.extend({}, l, o);
              }, s.keys = function(o) {
                if (Object.keys)
                  return Object.keys(o);
                var l = [];
                for (var f in o)
                  l.push(f);
                return l;
              }, s.values = function(o) {
                var l = [];
                if (Object.keys) {
                  for (var f = Object.keys(o), p = 0; p < f.length; p++)
                    l.push(o[f[p]]);
                  return l;
                }
                for (var a in o)
                  l.push(o[a]);
                return l;
              }, s.get = function(o, l, f, p) {
                l = l.split(".").slice(f, p);
                for (var a = 0; a < l.length; a += 1)
                  o = o[l[a]];
                return o;
              }, s.set = function(o, l, f, p, a) {
                var g = l.split(".").slice(p, a);
                return s.get(o, l, 0, -1)[g[g.length - 1]] = f, f;
              }, s.shuffle = function(o) {
                for (var l = o.length - 1; l > 0; l--) {
                  var f = Math.floor(s.random() * (l + 1)), p = o[l];
                  o[l] = o[f], o[f] = p;
                }
                return o;
              }, s.choose = function(o) {
                return o[Math.floor(s.random() * o.length)];
              }, s.isElement = function(o) {
                return typeof HTMLElement < "u" ? o instanceof HTMLElement : !!(o && o.nodeType && o.nodeName);
              }, s.isArray = function(o) {
                return Object.prototype.toString.call(o) === "[object Array]";
              }, s.isFunction = function(o) {
                return typeof o == "function";
              }, s.isPlainObject = function(o) {
                return typeof o == "object" && o.constructor === Object;
              }, s.isString = function(o) {
                return toString.call(o) === "[object String]";
              }, s.clamp = function(o, l, f) {
                return o < l ? l : o > f ? f : o;
              }, s.sign = function(o) {
                return o < 0 ? -1 : 1;
              }, s.now = function() {
                if (typeof window < "u" && window.performance) {
                  if (window.performance.now)
                    return window.performance.now();
                  if (window.performance.webkitNow)
                    return window.performance.webkitNow();
                }
                return Date.now ? Date.now() : /* @__PURE__ */ new Date() - s._nowStartTime;
              }, s.random = function(o, l) {
                return o = typeof o < "u" ? o : 0, l = typeof l < "u" ? l : 1, o + t() * (l - o);
              };
              var t = function() {
                return s._seed = (s._seed * 9301 + 49297) % 233280, s._seed / 233280;
              };
              s.colorToNumber = function(o) {
                return o = o.replace("#", ""), o.length == 3 && (o = o.charAt(0) + o.charAt(0) + o.charAt(1) + o.charAt(1) + o.charAt(2) + o.charAt(2)), parseInt(o, 16);
              }, s.logLevel = 1, s.log = function() {
                console && s.logLevel > 0 && s.logLevel <= 3 && console.log.apply(console, ["matter-js:"].concat(Array.prototype.slice.call(arguments)));
              }, s.info = function() {
                console && s.logLevel > 0 && s.logLevel <= 2 && console.info.apply(console, ["matter-js:"].concat(Array.prototype.slice.call(arguments)));
              }, s.warn = function() {
                console && s.logLevel > 0 && s.logLevel <= 3 && console.warn.apply(console, ["matter-js:"].concat(Array.prototype.slice.call(arguments)));
              }, s.warnOnce = function() {
                var o = Array.prototype.slice.call(arguments).join(" ");
                s._warnedOnce[o] || (s.warn(o), s._warnedOnce[o] = !0);
              }, s.deprecated = function(o, l, f) {
                o[l] = s.chain(function() {
                  s.warnOnce("🔅 deprecated 🔅", f);
                }, o[l]);
              }, s.nextId = function() {
                return s._nextId++;
              }, s.indexOf = function(o, l) {
                if (o.indexOf)
                  return o.indexOf(l);
                for (var f = 0; f < o.length; f++)
                  if (o[f] === l)
                    return f;
                return -1;
              }, s.map = function(o, l) {
                if (o.map)
                  return o.map(l);
                for (var f = [], p = 0; p < o.length; p += 1)
                  f.push(l(o[p]));
                return f;
              }, s.topologicalSort = function(o) {
                var l = [], f = [], p = [];
                for (var a in o)
                  !f[a] && !p[a] && s._topologicalSort(a, f, p, o, l);
                return l;
              }, s._topologicalSort = function(o, l, f, p, a) {
                var g = p[o] || [];
                f[o] = !0;
                for (var h = 0; h < g.length; h += 1) {
                  var r = g[h];
                  f[r] || l[r] || s._topologicalSort(r, l, f, p, a);
                }
                f[o] = !1, l[o] = !0, a.push(o);
              }, s.chain = function() {
                for (var o = [], l = 0; l < arguments.length; l += 1) {
                  var f = arguments[l];
                  f._chained ? o.push.apply(o, f._chained) : o.push(f);
                }
                var p = function() {
                  for (var a, g = new Array(arguments.length), h = 0, r = arguments.length; h < r; h++)
                    g[h] = arguments[h];
                  for (h = 0; h < o.length; h += 1) {
                    var u = o[h].apply(a, g);
                    typeof u < "u" && (a = u);
                  }
                  return a;
                };
                return p._chained = o, p;
              }, s.chainPathBefore = function(o, l, f) {
                return s.set(o, l, s.chain(
                  f,
                  s.get(o, l)
                ));
              }, s.chainPathAfter = function(o, l, f) {
                return s.set(o, l, s.chain(
                  s.get(o, l),
                  f
                ));
              }, s.setDecomp = function(o) {
                s._decomp = o;
              }, s.getDecomp = function() {
                var o = s._decomp;
                try {
                  !o && typeof window < "u" && (o = window.decomp), !o && typeof gs < "u" && (o = gs.decomp);
                } catch {
                  o = null;
                }
                return o;
              };
            })();
          }),
          /* 1 */
          /***/
          (function(i, c) {
            var s = {};
            i.exports = s, (function() {
              s.create = function(t) {
                var o = {
                  min: { x: 0, y: 0 },
                  max: { x: 0, y: 0 }
                };
                return t && s.update(o, t), o;
              }, s.update = function(t, o, l) {
                t.min.x = 1 / 0, t.max.x = -1 / 0, t.min.y = 1 / 0, t.max.y = -1 / 0;
                for (var f = 0; f < o.length; f++) {
                  var p = o[f];
                  p.x > t.max.x && (t.max.x = p.x), p.x < t.min.x && (t.min.x = p.x), p.y > t.max.y && (t.max.y = p.y), p.y < t.min.y && (t.min.y = p.y);
                }
                l && (l.x > 0 ? t.max.x += l.x : t.min.x += l.x, l.y > 0 ? t.max.y += l.y : t.min.y += l.y);
              }, s.contains = function(t, o) {
                return o.x >= t.min.x && o.x <= t.max.x && o.y >= t.min.y && o.y <= t.max.y;
              }, s.overlaps = function(t, o) {
                return t.min.x <= o.max.x && t.max.x >= o.min.x && t.max.y >= o.min.y && t.min.y <= o.max.y;
              }, s.translate = function(t, o) {
                t.min.x += o.x, t.max.x += o.x, t.min.y += o.y, t.max.y += o.y;
              }, s.shift = function(t, o) {
                var l = t.max.x - t.min.x, f = t.max.y - t.min.y;
                t.min.x = o.x, t.max.x = o.x + l, t.min.y = o.y, t.max.y = o.y + f;
              };
            })();
          }),
          /* 2 */
          /***/
          (function(i, c) {
            var s = {};
            i.exports = s, (function() {
              s.create = function(t, o) {
                return { x: t || 0, y: o || 0 };
              }, s.clone = function(t) {
                return { x: t.x, y: t.y };
              }, s.magnitude = function(t) {
                return Math.sqrt(t.x * t.x + t.y * t.y);
              }, s.magnitudeSquared = function(t) {
                return t.x * t.x + t.y * t.y;
              }, s.rotate = function(t, o, l) {
                var f = Math.cos(o), p = Math.sin(o);
                l || (l = {});
                var a = t.x * f - t.y * p;
                return l.y = t.x * p + t.y * f, l.x = a, l;
              }, s.rotateAbout = function(t, o, l, f) {
                var p = Math.cos(o), a = Math.sin(o);
                f || (f = {});
                var g = l.x + ((t.x - l.x) * p - (t.y - l.y) * a);
                return f.y = l.y + ((t.x - l.x) * a + (t.y - l.y) * p), f.x = g, f;
              }, s.normalise = function(t) {
                var o = s.magnitude(t);
                return o === 0 ? { x: 0, y: 0 } : { x: t.x / o, y: t.y / o };
              }, s.dot = function(t, o) {
                return t.x * o.x + t.y * o.y;
              }, s.cross = function(t, o) {
                return t.x * o.y - t.y * o.x;
              }, s.cross3 = function(t, o, l) {
                return (o.x - t.x) * (l.y - t.y) - (o.y - t.y) * (l.x - t.x);
              }, s.add = function(t, o, l) {
                return l || (l = {}), l.x = t.x + o.x, l.y = t.y + o.y, l;
              }, s.sub = function(t, o, l) {
                return l || (l = {}), l.x = t.x - o.x, l.y = t.y - o.y, l;
              }, s.mult = function(t, o) {
                return { x: t.x * o, y: t.y * o };
              }, s.div = function(t, o) {
                return { x: t.x / o, y: t.y / o };
              }, s.perp = function(t, o) {
                return o = o === !0 ? -1 : 1, { x: o * -t.y, y: o * t.x };
              }, s.neg = function(t) {
                return { x: -t.x, y: -t.y };
              }, s.angle = function(t, o) {
                return Math.atan2(o.y - t.y, o.x - t.x);
              }, s._temp = [
                s.create(),
                s.create(),
                s.create(),
                s.create(),
                s.create(),
                s.create()
              ];
            })();
          }),
          /* 3 */
          /***/
          (function(i, c, s) {
            var t = {};
            i.exports = t;
            var o = s(2), l = s(0);
            (function() {
              t.create = function(f, p) {
                for (var a = [], g = 0; g < f.length; g++) {
                  var h = f[g], r = {
                    x: h.x,
                    y: h.y,
                    index: g,
                    body: p,
                    isInternal: !1
                  };
                  a.push(r);
                }
                return a;
              }, t.fromPath = function(f, p) {
                var a = /L?\s*([-\d.e]+)[\s,]*([-\d.e]+)*/ig, g = [];
                return f.replace(a, function(h, r, u) {
                  g.push({ x: parseFloat(r), y: parseFloat(u) });
                }), t.create(g, p);
              }, t.centre = function(f) {
                for (var p = t.area(f, !0), a = { x: 0, y: 0 }, g, h, r, u = 0; u < f.length; u++)
                  r = (u + 1) % f.length, g = o.cross(f[u], f[r]), h = o.mult(o.add(f[u], f[r]), g), a = o.add(a, h);
                return o.div(a, 6 * p);
              }, t.mean = function(f) {
                for (var p = { x: 0, y: 0 }, a = 0; a < f.length; a++)
                  p.x += f[a].x, p.y += f[a].y;
                return o.div(p, f.length);
              }, t.area = function(f, p) {
                for (var a = 0, g = f.length - 1, h = 0; h < f.length; h++)
                  a += (f[g].x - f[h].x) * (f[g].y + f[h].y), g = h;
                return p ? a / 2 : Math.abs(a) / 2;
              }, t.inertia = function(f, p) {
                for (var a = 0, g = 0, h = f, r, u, d = 0; d < h.length; d++)
                  u = (d + 1) % h.length, r = Math.abs(o.cross(h[u], h[d])), a += r * (o.dot(h[u], h[u]) + o.dot(h[u], h[d]) + o.dot(h[d], h[d])), g += r;
                return p / 6 * (a / g);
              }, t.translate = function(f, p, a) {
                a = typeof a < "u" ? a : 1;
                var g = f.length, h = p.x * a, r = p.y * a, u;
                for (u = 0; u < g; u++)
                  f[u].x += h, f[u].y += r;
                return f;
              }, t.rotate = function(f, p, a) {
                if (p !== 0) {
                  var g = Math.cos(p), h = Math.sin(p), r = a.x, u = a.y, d = f.length, v, x, M, b;
                  for (b = 0; b < d; b++)
                    v = f[b], x = v.x - r, M = v.y - u, v.x = r + (x * g - M * h), v.y = u + (x * h + M * g);
                  return f;
                }
              }, t.contains = function(f, p) {
                for (var a = p.x, g = p.y, h = f.length, r = f[h - 1], u, d = 0; d < h; d++) {
                  if (u = f[d], (a - r.x) * (u.y - r.y) + (g - r.y) * (r.x - u.x) > 0)
                    return !1;
                  r = u;
                }
                return !0;
              }, t.scale = function(f, p, a, g) {
                if (p === 1 && a === 1)
                  return f;
                g = g || t.centre(f);
                for (var h, r, u = 0; u < f.length; u++)
                  h = f[u], r = o.sub(h, g), f[u].x = g.x + r.x * p, f[u].y = g.y + r.y * a;
                return f;
              }, t.chamfer = function(f, p, a, g, h) {
                typeof p == "number" ? p = [p] : p = p || [8], a = typeof a < "u" ? a : -1, g = g || 2, h = h || 14;
                for (var r = [], u = 0; u < f.length; u++) {
                  var d = f[u - 1 >= 0 ? u - 1 : f.length - 1], v = f[u], x = f[(u + 1) % f.length], M = p[u < p.length ? u : p.length - 1];
                  if (M === 0) {
                    r.push(v);
                    continue;
                  }
                  var b = o.normalise({
                    x: v.y - d.y,
                    y: d.x - v.x
                  }), E = o.normalise({
                    x: x.y - v.y,
                    y: v.x - x.x
                  }), m = Math.sqrt(2 * Math.pow(M, 2)), w = o.mult(l.clone(b), M), C = o.normalise(o.mult(o.add(b, E), 0.5)), y = o.sub(v, o.mult(C, m)), T = a;
                  a === -1 && (T = Math.pow(M, 0.32) * 1.75), T = l.clamp(T, g, h), T % 2 === 1 && (T += 1);
                  for (var S = Math.acos(o.dot(b, E)), I = S / T, P = 0; P < T; P++)
                    r.push(o.add(o.rotate(w, I * P), y));
                }
                return r;
              }, t.clockwiseSort = function(f) {
                var p = t.mean(f);
                return f.sort(function(a, g) {
                  return o.angle(p, a) - o.angle(p, g);
                }), f;
              }, t.isConvex = function(f) {
                var p = 0, a = f.length, g, h, r, u;
                if (a < 3)
                  return null;
                for (g = 0; g < a; g++)
                  if (h = (g + 1) % a, r = (g + 2) % a, u = (f[h].x - f[g].x) * (f[r].y - f[h].y), u -= (f[h].y - f[g].y) * (f[r].x - f[h].x), u < 0 ? p |= 1 : u > 0 && (p |= 2), p === 3)
                    return !1;
                return p !== 0 ? !0 : null;
              }, t.hull = function(f) {
                var p = [], a = [], g, h;
                for (f = f.slice(0), f.sort(function(r, u) {
                  var d = r.x - u.x;
                  return d !== 0 ? d : r.y - u.y;
                }), h = 0; h < f.length; h += 1) {
                  for (g = f[h]; a.length >= 2 && o.cross3(a[a.length - 2], a[a.length - 1], g) <= 0; )
                    a.pop();
                  a.push(g);
                }
                for (h = f.length - 1; h >= 0; h -= 1) {
                  for (g = f[h]; p.length >= 2 && o.cross3(p[p.length - 2], p[p.length - 1], g) <= 0; )
                    p.pop();
                  p.push(g);
                }
                return p.pop(), a.pop(), p.concat(a);
              };
            })();
          }),
          /* 4 */
          /***/
          (function(i, c, s) {
            var t = {};
            i.exports = t;
            var o = s(3), l = s(2), f = s(7), p = s(0), a = s(1), g = s(11);
            (function() {
              t._timeCorrection = !0, t._inertiaScale = 4, t._nextCollidingGroupId = 1, t._nextNonCollidingGroupId = -1, t._nextCategory = 1, t._baseDelta = 1e3 / 60, t.create = function(r) {
                var u = {
                  id: p.nextId(),
                  type: "body",
                  label: "Body",
                  parts: [],
                  plugin: {},
                  angle: 0,
                  vertices: o.fromPath("L 0 0 L 40 0 L 40 40 L 0 40"),
                  position: { x: 0, y: 0 },
                  force: { x: 0, y: 0 },
                  torque: 0,
                  positionImpulse: { x: 0, y: 0 },
                  constraintImpulse: { x: 0, y: 0, angle: 0 },
                  totalContacts: 0,
                  speed: 0,
                  angularSpeed: 0,
                  velocity: { x: 0, y: 0 },
                  angularVelocity: 0,
                  isSensor: !1,
                  isStatic: !1,
                  isSleeping: !1,
                  motion: 0,
                  sleepThreshold: 60,
                  density: 1e-3,
                  restitution: 0,
                  friction: 0.1,
                  frictionStatic: 0.5,
                  frictionAir: 0.01,
                  collisionFilter: {
                    category: 1,
                    mask: 4294967295,
                    group: 0
                  },
                  slop: 0.05,
                  timeScale: 1,
                  render: {
                    visible: !0,
                    opacity: 1,
                    strokeStyle: null,
                    fillStyle: null,
                    lineWidth: null,
                    sprite: {
                      xScale: 1,
                      yScale: 1,
                      xOffset: 0,
                      yOffset: 0
                    }
                  },
                  events: null,
                  bounds: null,
                  chamfer: null,
                  circleRadius: 0,
                  positionPrev: null,
                  anglePrev: 0,
                  parent: null,
                  axes: null,
                  area: 0,
                  mass: 0,
                  inertia: 0,
                  deltaTime: 16.666666666666668,
                  _original: null
                }, d = p.extend(u, r);
                return h(d, r), d;
              }, t.nextGroup = function(r) {
                return r ? t._nextNonCollidingGroupId-- : t._nextCollidingGroupId++;
              }, t.nextCategory = function() {
                return t._nextCategory = t._nextCategory << 1, t._nextCategory;
              };
              var h = function(r, u) {
                u = u || {}, t.set(r, {
                  bounds: r.bounds || a.create(r.vertices),
                  positionPrev: r.positionPrev || l.clone(r.position),
                  anglePrev: r.anglePrev || r.angle,
                  vertices: r.vertices,
                  parts: r.parts || [r],
                  isStatic: r.isStatic,
                  isSleeping: r.isSleeping,
                  parent: r.parent || r
                }), o.rotate(r.vertices, r.angle, r.position), g.rotate(r.axes, r.angle), a.update(r.bounds, r.vertices, r.velocity), t.set(r, {
                  axes: u.axes || r.axes,
                  area: u.area || r.area,
                  mass: u.mass || r.mass,
                  inertia: u.inertia || r.inertia
                });
                var d = r.isStatic ? "#14151f" : p.choose(["#f19648", "#f5d259", "#f55a3c", "#063e7b", "#ececd1"]), v = r.isStatic ? "#555" : "#ccc", x = r.isStatic && r.render.fillStyle === null ? 1 : 0;
                r.render.fillStyle = r.render.fillStyle || d, r.render.strokeStyle = r.render.strokeStyle || v, r.render.lineWidth = r.render.lineWidth || x, r.render.sprite.xOffset += -(r.bounds.min.x - r.position.x) / (r.bounds.max.x - r.bounds.min.x), r.render.sprite.yOffset += -(r.bounds.min.y - r.position.y) / (r.bounds.max.y - r.bounds.min.y);
              };
              t.set = function(r, u, d) {
                var v;
                typeof u == "string" && (v = u, u = {}, u[v] = d);
                for (v in u)
                  if (Object.prototype.hasOwnProperty.call(u, v))
                    switch (d = u[v], v) {
                      case "isStatic":
                        t.setStatic(r, d);
                        break;
                      case "isSleeping":
                        f.set(r, d);
                        break;
                      case "mass":
                        t.setMass(r, d);
                        break;
                      case "density":
                        t.setDensity(r, d);
                        break;
                      case "inertia":
                        t.setInertia(r, d);
                        break;
                      case "vertices":
                        t.setVertices(r, d);
                        break;
                      case "position":
                        t.setPosition(r, d);
                        break;
                      case "angle":
                        t.setAngle(r, d);
                        break;
                      case "velocity":
                        t.setVelocity(r, d);
                        break;
                      case "angularVelocity":
                        t.setAngularVelocity(r, d);
                        break;
                      case "speed":
                        t.setSpeed(r, d);
                        break;
                      case "angularSpeed":
                        t.setAngularSpeed(r, d);
                        break;
                      case "parts":
                        t.setParts(r, d);
                        break;
                      case "centre":
                        t.setCentre(r, d);
                        break;
                      default:
                        r[v] = d;
                    }
              }, t.setStatic = function(r, u) {
                for (var d = 0; d < r.parts.length; d++) {
                  var v = r.parts[d];
                  u ? (v.isStatic || (v._original = {
                    restitution: v.restitution,
                    friction: v.friction,
                    mass: v.mass,
                    inertia: v.inertia,
                    density: v.density,
                    inverseMass: v.inverseMass,
                    inverseInertia: v.inverseInertia
                  }), v.restitution = 0, v.friction = 1, v.mass = v.inertia = v.density = 1 / 0, v.inverseMass = v.inverseInertia = 0, v.positionPrev.x = v.position.x, v.positionPrev.y = v.position.y, v.anglePrev = v.angle, v.angularVelocity = 0, v.speed = 0, v.angularSpeed = 0, v.motion = 0) : v._original && (v.restitution = v._original.restitution, v.friction = v._original.friction, v.mass = v._original.mass, v.inertia = v._original.inertia, v.density = v._original.density, v.inverseMass = v._original.inverseMass, v.inverseInertia = v._original.inverseInertia, v._original = null), v.isStatic = u;
                }
              }, t.setMass = function(r, u) {
                var d = r.inertia / (r.mass / 6);
                r.inertia = d * (u / 6), r.inverseInertia = 1 / r.inertia, r.mass = u, r.inverseMass = 1 / r.mass, r.density = r.mass / r.area;
              }, t.setDensity = function(r, u) {
                t.setMass(r, u * r.area), r.density = u;
              }, t.setInertia = function(r, u) {
                r.inertia = u, r.inverseInertia = 1 / r.inertia;
              }, t.setVertices = function(r, u) {
                u[0].body === r ? r.vertices = u : r.vertices = o.create(u, r), r.axes = g.fromVertices(r.vertices), r.area = o.area(r.vertices), t.setMass(r, r.density * r.area);
                var d = o.centre(r.vertices);
                o.translate(r.vertices, d, -1), t.setInertia(r, t._inertiaScale * o.inertia(r.vertices, r.mass)), o.translate(r.vertices, r.position), a.update(r.bounds, r.vertices, r.velocity);
              }, t.setParts = function(r, u, d) {
                var v;
                for (u = u.slice(0), r.parts.length = 0, r.parts.push(r), r.parent = r, v = 0; v < u.length; v++) {
                  var x = u[v];
                  x !== r && (x.parent = r, r.parts.push(x));
                }
                if (r.parts.length !== 1) {
                  if (d = typeof d < "u" ? d : !0, d) {
                    var M = [];
                    for (v = 0; v < u.length; v++)
                      M = M.concat(u[v].vertices);
                    o.clockwiseSort(M);
                    var b = o.hull(M), E = o.centre(b);
                    t.setVertices(r, b), o.translate(r.vertices, E);
                  }
                  var m = t._totalProperties(r);
                  r.area = m.area, r.parent = r, r.position.x = m.centre.x, r.position.y = m.centre.y, r.positionPrev.x = m.centre.x, r.positionPrev.y = m.centre.y, t.setMass(r, m.mass), t.setInertia(r, m.inertia), t.setPosition(r, m.centre);
                }
              }, t.setCentre = function(r, u, d) {
                d ? (r.positionPrev.x += u.x, r.positionPrev.y += u.y, r.position.x += u.x, r.position.y += u.y) : (r.positionPrev.x = u.x - (r.position.x - r.positionPrev.x), r.positionPrev.y = u.y - (r.position.y - r.positionPrev.y), r.position.x = u.x, r.position.y = u.y);
              }, t.setPosition = function(r, u, d) {
                var v = l.sub(u, r.position);
                d ? (r.positionPrev.x = r.position.x, r.positionPrev.y = r.position.y, r.velocity.x = v.x, r.velocity.y = v.y, r.speed = l.magnitude(v)) : (r.positionPrev.x += v.x, r.positionPrev.y += v.y);
                for (var x = 0; x < r.parts.length; x++) {
                  var M = r.parts[x];
                  M.position.x += v.x, M.position.y += v.y, o.translate(M.vertices, v), a.update(M.bounds, M.vertices, r.velocity);
                }
              }, t.setAngle = function(r, u, d) {
                var v = u - r.angle;
                d ? (r.anglePrev = r.angle, r.angularVelocity = v, r.angularSpeed = Math.abs(v)) : r.anglePrev += v;
                for (var x = 0; x < r.parts.length; x++) {
                  var M = r.parts[x];
                  M.angle += v, o.rotate(M.vertices, v, r.position), g.rotate(M.axes, v), a.update(M.bounds, M.vertices, r.velocity), x > 0 && l.rotateAbout(M.position, v, r.position, M.position);
                }
              }, t.setVelocity = function(r, u) {
                var d = r.deltaTime / t._baseDelta;
                r.positionPrev.x = r.position.x - u.x * d, r.positionPrev.y = r.position.y - u.y * d, r.velocity.x = (r.position.x - r.positionPrev.x) / d, r.velocity.y = (r.position.y - r.positionPrev.y) / d, r.speed = l.magnitude(r.velocity);
              }, t.getVelocity = function(r) {
                var u = t._baseDelta / r.deltaTime;
                return {
                  x: (r.position.x - r.positionPrev.x) * u,
                  y: (r.position.y - r.positionPrev.y) * u
                };
              }, t.getSpeed = function(r) {
                return l.magnitude(t.getVelocity(r));
              }, t.setSpeed = function(r, u) {
                t.setVelocity(r, l.mult(l.normalise(t.getVelocity(r)), u));
              }, t.setAngularVelocity = function(r, u) {
                var d = r.deltaTime / t._baseDelta;
                r.anglePrev = r.angle - u * d, r.angularVelocity = (r.angle - r.anglePrev) / d, r.angularSpeed = Math.abs(r.angularVelocity);
              }, t.getAngularVelocity = function(r) {
                return (r.angle - r.anglePrev) * t._baseDelta / r.deltaTime;
              }, t.getAngularSpeed = function(r) {
                return Math.abs(t.getAngularVelocity(r));
              }, t.setAngularSpeed = function(r, u) {
                t.setAngularVelocity(r, p.sign(t.getAngularVelocity(r)) * u);
              }, t.translate = function(r, u, d) {
                t.setPosition(r, l.add(r.position, u), d);
              }, t.rotate = function(r, u, d, v) {
                if (!d)
                  t.setAngle(r, r.angle + u, v);
                else {
                  var x = Math.cos(u), M = Math.sin(u), b = r.position.x - d.x, E = r.position.y - d.y;
                  t.setPosition(r, {
                    x: d.x + (b * x - E * M),
                    y: d.y + (b * M + E * x)
                  }, v), t.setAngle(r, r.angle + u, v);
                }
              }, t.scale = function(r, u, d, v) {
                var x = 0, M = 0;
                v = v || r.position;
                for (var b = 0; b < r.parts.length; b++) {
                  var E = r.parts[b];
                  o.scale(E.vertices, u, d, v), E.axes = g.fromVertices(E.vertices), E.area = o.area(E.vertices), t.setMass(E, r.density * E.area), o.translate(E.vertices, { x: -E.position.x, y: -E.position.y }), t.setInertia(E, t._inertiaScale * o.inertia(E.vertices, E.mass)), o.translate(E.vertices, { x: E.position.x, y: E.position.y }), b > 0 && (x += E.area, M += E.inertia), E.position.x = v.x + (E.position.x - v.x) * u, E.position.y = v.y + (E.position.y - v.y) * d, a.update(E.bounds, E.vertices, r.velocity);
                }
                r.parts.length > 1 && (r.area = x, r.isStatic || (t.setMass(r, r.density * x), t.setInertia(r, M))), r.circleRadius && (u === d ? r.circleRadius *= u : r.circleRadius = null);
              }, t.update = function(r, u) {
                u = (typeof u < "u" ? u : 1e3 / 60) * r.timeScale;
                var d = u * u, v = t._timeCorrection ? u / (r.deltaTime || u) : 1, x = 1 - r.frictionAir * (u / p._baseDelta), M = (r.position.x - r.positionPrev.x) * v, b = (r.position.y - r.positionPrev.y) * v;
                r.velocity.x = M * x + r.force.x / r.mass * d, r.velocity.y = b * x + r.force.y / r.mass * d, r.positionPrev.x = r.position.x, r.positionPrev.y = r.position.y, r.position.x += r.velocity.x, r.position.y += r.velocity.y, r.deltaTime = u, r.angularVelocity = (r.angle - r.anglePrev) * x * v + r.torque / r.inertia * d, r.anglePrev = r.angle, r.angle += r.angularVelocity;
                for (var E = 0; E < r.parts.length; E++) {
                  var m = r.parts[E];
                  o.translate(m.vertices, r.velocity), E > 0 && (m.position.x += r.velocity.x, m.position.y += r.velocity.y), r.angularVelocity !== 0 && (o.rotate(m.vertices, r.angularVelocity, r.position), g.rotate(m.axes, r.angularVelocity), E > 0 && l.rotateAbout(m.position, r.angularVelocity, r.position, m.position)), a.update(m.bounds, m.vertices, r.velocity);
                }
              }, t.updateVelocities = function(r) {
                var u = t._baseDelta / r.deltaTime, d = r.velocity;
                d.x = (r.position.x - r.positionPrev.x) * u, d.y = (r.position.y - r.positionPrev.y) * u, r.speed = Math.sqrt(d.x * d.x + d.y * d.y), r.angularVelocity = (r.angle - r.anglePrev) * u, r.angularSpeed = Math.abs(r.angularVelocity);
              }, t.applyForce = function(r, u, d) {
                var v = { x: u.x - r.position.x, y: u.y - r.position.y };
                r.force.x += d.x, r.force.y += d.y, r.torque += v.x * d.y - v.y * d.x;
              }, t._totalProperties = function(r) {
                for (var u = {
                  mass: 0,
                  area: 0,
                  inertia: 0,
                  centre: { x: 0, y: 0 }
                }, d = r.parts.length === 1 ? 0 : 1; d < r.parts.length; d++) {
                  var v = r.parts[d], x = v.mass !== 1 / 0 ? v.mass : 1;
                  u.mass += x, u.area += v.area, u.inertia += v.inertia, u.centre = l.add(u.centre, l.mult(v.position, x));
                }
                return u.centre = l.div(u.centre, u.mass), u;
              };
            })();
          }),
          /* 5 */
          /***/
          (function(i, c, s) {
            var t = {};
            i.exports = t;
            var o = s(0);
            (function() {
              t.on = function(l, f, p) {
                for (var a = f.split(" "), g, h = 0; h < a.length; h++)
                  g = a[h], l.events = l.events || {}, l.events[g] = l.events[g] || [], l.events[g].push(p);
                return p;
              }, t.off = function(l, f, p) {
                if (!f) {
                  l.events = {};
                  return;
                }
                typeof f == "function" && (p = f, f = o.keys(l.events).join(" "));
                for (var a = f.split(" "), g = 0; g < a.length; g++) {
                  var h = l.events[a[g]], r = [];
                  if (p && h)
                    for (var u = 0; u < h.length; u++)
                      h[u] !== p && r.push(h[u]);
                  l.events[a[g]] = r;
                }
              }, t.trigger = function(l, f, p) {
                var a, g, h, r, u = l.events;
                if (u && o.keys(u).length > 0) {
                  p || (p = {}), a = f.split(" ");
                  for (var d = 0; d < a.length; d++)
                    if (g = a[d], h = u[g], h) {
                      r = o.clone(p, !1), r.name = g, r.source = l;
                      for (var v = 0; v < h.length; v++)
                        h[v].apply(l, [r]);
                    }
                }
              };
            })();
          }),
          /* 6 */
          /***/
          (function(i, c, s) {
            var t = {};
            i.exports = t;
            var o = s(5), l = s(0), f = s(1), p = s(4);
            (function() {
              t.create = function(a) {
                return l.extend({
                  id: l.nextId(),
                  type: "composite",
                  parent: null,
                  isModified: !1,
                  bodies: [],
                  constraints: [],
                  composites: [],
                  label: "Composite",
                  plugin: {},
                  cache: {
                    allBodies: null,
                    allConstraints: null,
                    allComposites: null
                  }
                }, a);
              }, t.setModified = function(a, g, h, r) {
                if (a.isModified = g, g && a.cache && (a.cache.allBodies = null, a.cache.allConstraints = null, a.cache.allComposites = null), h && a.parent && t.setModified(a.parent, g, h, r), r)
                  for (var u = 0; u < a.composites.length; u++) {
                    var d = a.composites[u];
                    t.setModified(d, g, h, r);
                  }
              }, t.add = function(a, g) {
                var h = [].concat(g);
                o.trigger(a, "beforeAdd", { object: g });
                for (var r = 0; r < h.length; r++) {
                  var u = h[r];
                  switch (u.type) {
                    case "body":
                      if (u.parent !== u) {
                        l.warn("Composite.add: skipped adding a compound body part (you must add its parent instead)");
                        break;
                      }
                      t.addBody(a, u);
                      break;
                    case "constraint":
                      t.addConstraint(a, u);
                      break;
                    case "composite":
                      t.addComposite(a, u);
                      break;
                    case "mouseConstraint":
                      t.addConstraint(a, u.constraint);
                      break;
                  }
                }
                return o.trigger(a, "afterAdd", { object: g }), a;
              }, t.remove = function(a, g, h) {
                var r = [].concat(g);
                o.trigger(a, "beforeRemove", { object: g });
                for (var u = 0; u < r.length; u++) {
                  var d = r[u];
                  switch (d.type) {
                    case "body":
                      t.removeBody(a, d, h);
                      break;
                    case "constraint":
                      t.removeConstraint(a, d, h);
                      break;
                    case "composite":
                      t.removeComposite(a, d, h);
                      break;
                    case "mouseConstraint":
                      t.removeConstraint(a, d.constraint);
                      break;
                  }
                }
                return o.trigger(a, "afterRemove", { object: g }), a;
              }, t.addComposite = function(a, g) {
                return a.composites.push(g), g.parent = a, t.setModified(a, !0, !0, !1), a;
              }, t.removeComposite = function(a, g, h) {
                var r = l.indexOf(a.composites, g);
                if (r !== -1) {
                  var u = t.allBodies(g);
                  t.removeCompositeAt(a, r);
                  for (var d = 0; d < u.length; d++)
                    u[d].sleepCounter = 0;
                }
                if (h)
                  for (var d = 0; d < a.composites.length; d++)
                    t.removeComposite(a.composites[d], g, !0);
                return a;
              }, t.removeCompositeAt = function(a, g) {
                return a.composites.splice(g, 1), t.setModified(a, !0, !0, !1), a;
              }, t.addBody = function(a, g) {
                return a.bodies.push(g), t.setModified(a, !0, !0, !1), a;
              }, t.removeBody = function(a, g, h) {
                var r = l.indexOf(a.bodies, g);
                if (r !== -1 && (t.removeBodyAt(a, r), g.sleepCounter = 0), h)
                  for (var u = 0; u < a.composites.length; u++)
                    t.removeBody(a.composites[u], g, !0);
                return a;
              }, t.removeBodyAt = function(a, g) {
                return a.bodies.splice(g, 1), t.setModified(a, !0, !0, !1), a;
              }, t.addConstraint = function(a, g) {
                return a.constraints.push(g), t.setModified(a, !0, !0, !1), a;
              }, t.removeConstraint = function(a, g, h) {
                var r = l.indexOf(a.constraints, g);
                if (r !== -1 && t.removeConstraintAt(a, r), h)
                  for (var u = 0; u < a.composites.length; u++)
                    t.removeConstraint(a.composites[u], g, !0);
                return a;
              }, t.removeConstraintAt = function(a, g) {
                return a.constraints.splice(g, 1), t.setModified(a, !0, !0, !1), a;
              }, t.clear = function(a, g, h) {
                if (h)
                  for (var r = 0; r < a.composites.length; r++)
                    t.clear(a.composites[r], g, !0);
                return g ? a.bodies = a.bodies.filter(function(u) {
                  return u.isStatic;
                }) : a.bodies.length = 0, a.constraints.length = 0, a.composites.length = 0, t.setModified(a, !0, !0, !1), a;
              }, t.allBodies = function(a) {
                if (a.cache && a.cache.allBodies)
                  return a.cache.allBodies;
                for (var g = [].concat(a.bodies), h = 0; h < a.composites.length; h++)
                  g = g.concat(t.allBodies(a.composites[h]));
                return a.cache && (a.cache.allBodies = g), g;
              }, t.allConstraints = function(a) {
                if (a.cache && a.cache.allConstraints)
                  return a.cache.allConstraints;
                for (var g = [].concat(a.constraints), h = 0; h < a.composites.length; h++)
                  g = g.concat(t.allConstraints(a.composites[h]));
                return a.cache && (a.cache.allConstraints = g), g;
              }, t.allComposites = function(a) {
                if (a.cache && a.cache.allComposites)
                  return a.cache.allComposites;
                for (var g = [].concat(a.composites), h = 0; h < a.composites.length; h++)
                  g = g.concat(t.allComposites(a.composites[h]));
                return a.cache && (a.cache.allComposites = g), g;
              }, t.get = function(a, g, h) {
                var r, u;
                switch (h) {
                  case "body":
                    r = t.allBodies(a);
                    break;
                  case "constraint":
                    r = t.allConstraints(a);
                    break;
                  case "composite":
                    r = t.allComposites(a).concat(a);
                    break;
                }
                return r ? (u = r.filter(function(d) {
                  return d.id.toString() === g.toString();
                }), u.length === 0 ? null : u[0]) : null;
              }, t.move = function(a, g, h) {
                return t.remove(a, g), t.add(h, g), a;
              }, t.rebase = function(a) {
                for (var g = t.allBodies(a).concat(t.allConstraints(a)).concat(t.allComposites(a)), h = 0; h < g.length; h++)
                  g[h].id = l.nextId();
                return a;
              }, t.translate = function(a, g, h) {
                for (var r = h ? t.allBodies(a) : a.bodies, u = 0; u < r.length; u++)
                  p.translate(r[u], g);
                return a;
              }, t.rotate = function(a, g, h, r) {
                for (var u = Math.cos(g), d = Math.sin(g), v = r ? t.allBodies(a) : a.bodies, x = 0; x < v.length; x++) {
                  var M = v[x], b = M.position.x - h.x, E = M.position.y - h.y;
                  p.setPosition(M, {
                    x: h.x + (b * u - E * d),
                    y: h.y + (b * d + E * u)
                  }), p.rotate(M, g);
                }
                return a;
              }, t.scale = function(a, g, h, r, u) {
                for (var d = u ? t.allBodies(a) : a.bodies, v = 0; v < d.length; v++) {
                  var x = d[v], M = x.position.x - r.x, b = x.position.y - r.y;
                  p.setPosition(x, {
                    x: r.x + M * g,
                    y: r.y + b * h
                  }), p.scale(x, g, h);
                }
                return a;
              }, t.bounds = function(a) {
                for (var g = t.allBodies(a), h = [], r = 0; r < g.length; r += 1) {
                  var u = g[r];
                  h.push(u.bounds.min, u.bounds.max);
                }
                return f.create(h);
              };
            })();
          }),
          /* 7 */
          /***/
          (function(i, c, s) {
            var t = {};
            i.exports = t;
            var o = s(4), l = s(5), f = s(0);
            (function() {
              t._motionWakeThreshold = 0.18, t._motionSleepThreshold = 0.08, t._minBias = 0.9, t.update = function(p, a) {
                for (var g = a / f._baseDelta, h = t._motionSleepThreshold, r = 0; r < p.length; r++) {
                  var u = p[r], d = o.getSpeed(u), v = o.getAngularSpeed(u), x = d * d + v * v;
                  if (u.force.x !== 0 || u.force.y !== 0) {
                    t.set(u, !1);
                    continue;
                  }
                  var M = Math.min(u.motion, x), b = Math.max(u.motion, x);
                  u.motion = t._minBias * M + (1 - t._minBias) * b, u.sleepThreshold > 0 && u.motion < h ? (u.sleepCounter += 1, u.sleepCounter >= u.sleepThreshold / g && t.set(u, !0)) : u.sleepCounter > 0 && (u.sleepCounter -= 1);
                }
              }, t.afterCollisions = function(p) {
                for (var a = t._motionSleepThreshold, g = 0; g < p.length; g++) {
                  var h = p[g];
                  if (h.isActive) {
                    var r = h.collision, u = r.bodyA.parent, d = r.bodyB.parent;
                    if (!(u.isSleeping && d.isSleeping || u.isStatic || d.isStatic) && (u.isSleeping || d.isSleeping)) {
                      var v = u.isSleeping && !u.isStatic ? u : d, x = v === u ? d : u;
                      !v.isStatic && x.motion > a && t.set(v, !1);
                    }
                  }
                }
              }, t.set = function(p, a) {
                var g = p.isSleeping;
                a ? (p.isSleeping = !0, p.sleepCounter = p.sleepThreshold, p.positionImpulse.x = 0, p.positionImpulse.y = 0, p.positionPrev.x = p.position.x, p.positionPrev.y = p.position.y, p.anglePrev = p.angle, p.speed = 0, p.angularSpeed = 0, p.motion = 0, g || l.trigger(p, "sleepStart")) : (p.isSleeping = !1, p.sleepCounter = 0, g && l.trigger(p, "sleepEnd"));
              };
            })();
          }),
          /* 8 */
          /***/
          (function(i, c, s) {
            var t = {};
            i.exports = t;
            var o = s(3), l = s(9);
            (function() {
              var f = [], p = {
                overlap: 0,
                axis: null
              }, a = {
                overlap: 0,
                axis: null
              };
              t.create = function(g, h) {
                return {
                  pair: null,
                  collided: !1,
                  bodyA: g,
                  bodyB: h,
                  parentA: g.parent,
                  parentB: h.parent,
                  depth: 0,
                  normal: { x: 0, y: 0 },
                  tangent: { x: 0, y: 0 },
                  penetration: { x: 0, y: 0 },
                  supports: [null, null],
                  supportCount: 0
                };
              }, t.collides = function(g, h, r) {
                if (t._overlapAxes(p, g.vertices, h.vertices, g.axes), p.overlap <= 0 || (t._overlapAxes(a, h.vertices, g.vertices, h.axes), a.overlap <= 0))
                  return null;
                var u = r && r.table[l.id(g, h)], d;
                u ? d = u.collision : (d = t.create(g, h), d.collided = !0, d.bodyA = g.id < h.id ? g : h, d.bodyB = g.id < h.id ? h : g, d.parentA = d.bodyA.parent, d.parentB = d.bodyB.parent), g = d.bodyA, h = d.bodyB;
                var v;
                p.overlap < a.overlap ? v = p : v = a;
                var x = d.normal, M = d.tangent, b = d.penetration, E = d.supports, m = v.overlap, w = v.axis, C = w.x, y = w.y, T = h.position.x - g.position.x, S = h.position.y - g.position.y;
                C * T + y * S >= 0 && (C = -C, y = -y), x.x = C, x.y = y, M.x = -y, M.y = C, b.x = C * m, b.y = y * m, d.depth = m;
                var I = t._findSupports(g, h, x, 1), P = 0;
                if (o.contains(g.vertices, I[0]) && (E[P++] = I[0]), o.contains(g.vertices, I[1]) && (E[P++] = I[1]), P < 2) {
                  var R = t._findSupports(h, g, x, -1);
                  o.contains(h.vertices, R[0]) && (E[P++] = R[0]), P < 2 && o.contains(h.vertices, R[1]) && (E[P++] = R[1]);
                }
                return P === 0 && (E[P++] = I[0]), d.supportCount = P, d;
              }, t._overlapAxes = function(g, h, r, u) {
                var d = h.length, v = r.length, x = h[0].x, M = h[0].y, b = r[0].x, E = r[0].y, m = u.length, w = Number.MAX_VALUE, C = 0, y, T, S, I, P, R;
                for (P = 0; P < m; P++) {
                  var _ = u[P], H = _.x, U = _.y, k = x * H + M * U, G = b * H + E * U, X = k, ue = G;
                  for (R = 1; R < d; R += 1)
                    I = h[R].x * H + h[R].y * U, I > X ? X = I : I < k && (k = I);
                  for (R = 1; R < v; R += 1)
                    I = r[R].x * H + r[R].y * U, I > ue ? ue = I : I < G && (G = I);
                  if (T = X - G, S = ue - k, y = T < S ? T : S, y < w && (w = y, C = P, y <= 0))
                    break;
                }
                g.axis = u[C], g.overlap = w;
              }, t._findSupports = function(g, h, r, u) {
                var d = h.vertices, v = d.length, x = g.position.x, M = g.position.y, b = r.x * u, E = r.y * u, m = d[0], w = m, C = b * (x - w.x) + E * (M - w.y), y, T, S;
                for (S = 1; S < v; S += 1)
                  w = d[S], T = b * (x - w.x) + E * (M - w.y), T < C && (C = T, m = w);
                return y = d[(v + m.index - 1) % v], C = b * (x - y.x) + E * (M - y.y), w = d[(m.index + 1) % v], b * (x - w.x) + E * (M - w.y) < C ? (f[0] = m, f[1] = w, f) : (f[0] = m, f[1] = y, f);
              };
            })();
          }),
          /* 9 */
          /***/
          (function(i, c, s) {
            var t = {};
            i.exports = t;
            var o = s(16);
            (function() {
              t.create = function(l, f) {
                var p = l.bodyA, a = l.bodyB, g = {
                  id: t.id(p, a),
                  bodyA: p,
                  bodyB: a,
                  collision: l,
                  contacts: [o.create(), o.create()],
                  contactCount: 0,
                  separation: 0,
                  isActive: !0,
                  isSensor: p.isSensor || a.isSensor,
                  timeCreated: f,
                  timeUpdated: f,
                  inverseMass: 0,
                  friction: 0,
                  frictionStatic: 0,
                  restitution: 0,
                  slop: 0
                };
                return t.update(g, l, f), g;
              }, t.update = function(l, f, p) {
                var a = f.supports, g = f.supportCount, h = l.contacts, r = f.parentA, u = f.parentB;
                l.isActive = !0, l.timeUpdated = p, l.collision = f, l.separation = f.depth, l.inverseMass = r.inverseMass + u.inverseMass, l.friction = r.friction < u.friction ? r.friction : u.friction, l.frictionStatic = r.frictionStatic > u.frictionStatic ? r.frictionStatic : u.frictionStatic, l.restitution = r.restitution > u.restitution ? r.restitution : u.restitution, l.slop = r.slop > u.slop ? r.slop : u.slop, l.contactCount = g, f.pair = l;
                var d = a[0], v = h[0], x = a[1], M = h[1];
                (M.vertex === d || v.vertex === x) && (h[1] = v, h[0] = v = M, M = h[1]), v.vertex = d, M.vertex = x;
              }, t.setActive = function(l, f, p) {
                f ? (l.isActive = !0, l.timeUpdated = p) : (l.isActive = !1, l.contactCount = 0);
              }, t.id = function(l, f) {
                return l.id < f.id ? l.id.toString(36) + ":" + f.id.toString(36) : f.id.toString(36) + ":" + l.id.toString(36);
              };
            })();
          }),
          /* 10 */
          /***/
          (function(i, c, s) {
            var t = {};
            i.exports = t;
            var o = s(3), l = s(2), f = s(7), p = s(1), a = s(11), g = s(0);
            (function() {
              t._warming = 0.4, t._torqueDampen = 1, t._minLength = 1e-6, t.create = function(h) {
                var r = h;
                r.bodyA && !r.pointA && (r.pointA = { x: 0, y: 0 }), r.bodyB && !r.pointB && (r.pointB = { x: 0, y: 0 });
                var u = r.bodyA ? l.add(r.bodyA.position, r.pointA) : r.pointA, d = r.bodyB ? l.add(r.bodyB.position, r.pointB) : r.pointB, v = l.magnitude(l.sub(u, d));
                r.length = typeof r.length < "u" ? r.length : v, r.id = r.id || g.nextId(), r.label = r.label || "Constraint", r.type = "constraint", r.stiffness = r.stiffness || (r.length > 0 ? 1 : 0.7), r.damping = r.damping || 0, r.angularStiffness = r.angularStiffness || 0, r.angleA = r.bodyA ? r.bodyA.angle : r.angleA, r.angleB = r.bodyB ? r.bodyB.angle : r.angleB, r.plugin = {};
                var x = {
                  visible: !0,
                  lineWidth: 2,
                  strokeStyle: "#ffffff",
                  type: "line",
                  anchors: !0
                };
                return r.length === 0 && r.stiffness > 0.1 ? (x.type = "pin", x.anchors = !1) : r.stiffness < 0.9 && (x.type = "spring"), r.render = g.extend(x, r.render), r;
              }, t.preSolveAll = function(h) {
                for (var r = 0; r < h.length; r += 1) {
                  var u = h[r], d = u.constraintImpulse;
                  u.isStatic || d.x === 0 && d.y === 0 && d.angle === 0 || (u.position.x += d.x, u.position.y += d.y, u.angle += d.angle);
                }
              }, t.solveAll = function(h, r) {
                for (var u = g.clamp(r / g._baseDelta, 0, 1), d = 0; d < h.length; d += 1) {
                  var v = h[d], x = !v.bodyA || v.bodyA && v.bodyA.isStatic, M = !v.bodyB || v.bodyB && v.bodyB.isStatic;
                  (x || M) && t.solve(h[d], u);
                }
                for (d = 0; d < h.length; d += 1)
                  v = h[d], x = !v.bodyA || v.bodyA && v.bodyA.isStatic, M = !v.bodyB || v.bodyB && v.bodyB.isStatic, !x && !M && t.solve(h[d], u);
              }, t.solve = function(h, r) {
                var u = h.bodyA, d = h.bodyB, v = h.pointA, x = h.pointB;
                if (!(!u && !d)) {
                  u && !u.isStatic && (l.rotate(v, u.angle - h.angleA, v), h.angleA = u.angle), d && !d.isStatic && (l.rotate(x, d.angle - h.angleB, x), h.angleB = d.angle);
                  var M = v, b = x;
                  if (u && (M = l.add(u.position, v)), d && (b = l.add(d.position, x)), !(!M || !b)) {
                    var E = l.sub(M, b), m = l.magnitude(E);
                    m < t._minLength && (m = t._minLength);
                    var w = (m - h.length) / m, C = h.stiffness >= 1 || h.length === 0, y = C ? h.stiffness * r : h.stiffness * r * r, T = h.damping * r, S = l.mult(E, w * y), I = (u ? u.inverseMass : 0) + (d ? d.inverseMass : 0), P = (u ? u.inverseInertia : 0) + (d ? d.inverseInertia : 0), R = I + P, _, H, U, k, G;
                    if (T > 0) {
                      var X = l.create();
                      U = l.div(E, m), G = l.sub(
                        d && l.sub(d.position, d.positionPrev) || X,
                        u && l.sub(u.position, u.positionPrev) || X
                      ), k = l.dot(U, G);
                    }
                    u && !u.isStatic && (H = u.inverseMass / I, u.constraintImpulse.x -= S.x * H, u.constraintImpulse.y -= S.y * H, u.position.x -= S.x * H, u.position.y -= S.y * H, T > 0 && (u.positionPrev.x -= T * U.x * k * H, u.positionPrev.y -= T * U.y * k * H), _ = l.cross(v, S) / R * t._torqueDampen * u.inverseInertia * (1 - h.angularStiffness), u.constraintImpulse.angle -= _, u.angle -= _), d && !d.isStatic && (H = d.inverseMass / I, d.constraintImpulse.x += S.x * H, d.constraintImpulse.y += S.y * H, d.position.x += S.x * H, d.position.y += S.y * H, T > 0 && (d.positionPrev.x += T * U.x * k * H, d.positionPrev.y += T * U.y * k * H), _ = l.cross(x, S) / R * t._torqueDampen * d.inverseInertia * (1 - h.angularStiffness), d.constraintImpulse.angle += _, d.angle += _);
                  }
                }
              }, t.postSolveAll = function(h) {
                for (var r = 0; r < h.length; r++) {
                  var u = h[r], d = u.constraintImpulse;
                  if (!(u.isStatic || d.x === 0 && d.y === 0 && d.angle === 0)) {
                    f.set(u, !1);
                    for (var v = 0; v < u.parts.length; v++) {
                      var x = u.parts[v];
                      o.translate(x.vertices, d), v > 0 && (x.position.x += d.x, x.position.y += d.y), d.angle !== 0 && (o.rotate(x.vertices, d.angle, u.position), a.rotate(x.axes, d.angle), v > 0 && l.rotateAbout(x.position, d.angle, u.position, x.position)), p.update(x.bounds, x.vertices, u.velocity);
                    }
                    d.angle *= t._warming, d.x *= t._warming, d.y *= t._warming;
                  }
                }
              }, t.pointAWorld = function(h) {
                return {
                  x: (h.bodyA ? h.bodyA.position.x : 0) + (h.pointA ? h.pointA.x : 0),
                  y: (h.bodyA ? h.bodyA.position.y : 0) + (h.pointA ? h.pointA.y : 0)
                };
              }, t.pointBWorld = function(h) {
                return {
                  x: (h.bodyB ? h.bodyB.position.x : 0) + (h.pointB ? h.pointB.x : 0),
                  y: (h.bodyB ? h.bodyB.position.y : 0) + (h.pointB ? h.pointB.y : 0)
                };
              }, t.currentLength = function(h) {
                var r = (h.bodyA ? h.bodyA.position.x : 0) + (h.pointA ? h.pointA.x : 0), u = (h.bodyA ? h.bodyA.position.y : 0) + (h.pointA ? h.pointA.y : 0), d = (h.bodyB ? h.bodyB.position.x : 0) + (h.pointB ? h.pointB.x : 0), v = (h.bodyB ? h.bodyB.position.y : 0) + (h.pointB ? h.pointB.y : 0), x = r - d, M = u - v;
                return Math.sqrt(x * x + M * M);
              };
            })();
          }),
          /* 11 */
          /***/
          (function(i, c, s) {
            var t = {};
            i.exports = t;
            var o = s(2), l = s(0);
            (function() {
              t.fromVertices = function(f) {
                for (var p = {}, a = 0; a < f.length; a++) {
                  var g = (a + 1) % f.length, h = o.normalise({
                    x: f[g].y - f[a].y,
                    y: f[a].x - f[g].x
                  }), r = h.y === 0 ? 1 / 0 : h.x / h.y;
                  r = r.toFixed(3).toString(), p[r] = h;
                }
                return l.values(p);
              }, t.rotate = function(f, p) {
                if (p !== 0)
                  for (var a = Math.cos(p), g = Math.sin(p), h = 0; h < f.length; h++) {
                    var r = f[h], u;
                    u = r.x * a - r.y * g, r.y = r.x * g + r.y * a, r.x = u;
                  }
              };
            })();
          }),
          /* 12 */
          /***/
          (function(i, c, s) {
            var t = {};
            i.exports = t;
            var o = s(3), l = s(0), f = s(4), p = s(1), a = s(2);
            (function() {
              t.rectangle = function(g, h, r, u, d) {
                d = d || {};
                var v = {
                  label: "Rectangle Body",
                  position: { x: g, y: h },
                  vertices: o.fromPath("L 0 0 L " + r + " 0 L " + r + " " + u + " L 0 " + u)
                };
                if (d.chamfer) {
                  var x = d.chamfer;
                  v.vertices = o.chamfer(
                    v.vertices,
                    x.radius,
                    x.quality,
                    x.qualityMin,
                    x.qualityMax
                  ), delete d.chamfer;
                }
                return f.create(l.extend({}, v, d));
              }, t.trapezoid = function(g, h, r, u, d, v) {
                v = v || {}, d >= 1 && l.warn("Bodies.trapezoid: slope parameter must be < 1."), d *= 0.5;
                var x = (1 - d * 2) * r, M = r * d, b = M + x, E = b + M, m;
                d < 0.5 ? m = "L 0 0 L " + M + " " + -u + " L " + b + " " + -u + " L " + E + " 0" : m = "L 0 0 L " + b + " " + -u + " L " + E + " 0";
                var w = {
                  label: "Trapezoid Body",
                  position: { x: g, y: h },
                  vertices: o.fromPath(m)
                };
                if (v.chamfer) {
                  var C = v.chamfer;
                  w.vertices = o.chamfer(
                    w.vertices,
                    C.radius,
                    C.quality,
                    C.qualityMin,
                    C.qualityMax
                  ), delete v.chamfer;
                }
                return f.create(l.extend({}, w, v));
              }, t.circle = function(g, h, r, u, d) {
                u = u || {};
                var v = {
                  label: "Circle Body",
                  circleRadius: r
                };
                d = d || 25;
                var x = Math.ceil(Math.max(10, Math.min(d, r)));
                return x % 2 === 1 && (x += 1), t.polygon(g, h, x, r, l.extend({}, v, u));
              }, t.polygon = function(g, h, r, u, d) {
                if (d = d || {}, r < 3)
                  return t.circle(g, h, u, d);
                for (var v = 2 * Math.PI / r, x = "", M = v * 0.5, b = 0; b < r; b += 1) {
                  var E = M + b * v, m = Math.cos(E) * u, w = Math.sin(E) * u;
                  x += "L " + m.toFixed(3) + " " + w.toFixed(3) + " ";
                }
                var C = {
                  label: "Polygon Body",
                  position: { x: g, y: h },
                  vertices: o.fromPath(x)
                };
                if (d.chamfer) {
                  var y = d.chamfer;
                  C.vertices = o.chamfer(
                    C.vertices,
                    y.radius,
                    y.quality,
                    y.qualityMin,
                    y.qualityMax
                  ), delete d.chamfer;
                }
                return f.create(l.extend({}, C, d));
              }, t.fromVertices = function(g, h, r, u, d, v, x, M) {
                var b = l.getDecomp(), E, m, w, C, y, T, S, I, P, R, _;
                for (E = !!(b && b.quickDecomp), u = u || {}, w = [], d = typeof d < "u" ? d : !1, v = typeof v < "u" ? v : 0.01, x = typeof x < "u" ? x : 10, M = typeof M < "u" ? M : 0.01, l.isArray(r[0]) || (r = [r]), R = 0; R < r.length; R += 1)
                  if (T = r[R], C = o.isConvex(T), y = !C, y && !E && l.warnOnce(
                    "Bodies.fromVertices: Install the 'poly-decomp' library and use Common.setDecomp or provide 'decomp' as a global to decompose concave vertices."
                  ), C || !E)
                    C ? T = o.clockwiseSort(T) : T = o.hull(T), w.push({
                      position: { x: g, y: h },
                      vertices: T
                    });
                  else {
                    var H = T.map(function(ee) {
                      return [ee.x, ee.y];
                    });
                    b.makeCCW(H), v !== !1 && b.removeCollinearPoints(H, v), M !== !1 && b.removeDuplicatePoints && b.removeDuplicatePoints(H, M);
                    var U = b.quickDecomp(H);
                    for (S = 0; S < U.length; S++) {
                      var k = U[S], G = k.map(function(ee) {
                        return {
                          x: ee[0],
                          y: ee[1]
                        };
                      });
                      x > 0 && o.area(G) < x || w.push({
                        position: o.centre(G),
                        vertices: G
                      });
                    }
                  }
                for (S = 0; S < w.length; S++)
                  w[S] = f.create(l.extend(w[S], u));
                if (d) {
                  var X = 5;
                  for (S = 0; S < w.length; S++) {
                    var ue = w[S];
                    for (I = S + 1; I < w.length; I++) {
                      var de = w[I];
                      if (p.overlaps(ue.bounds, de.bounds)) {
                        var re = ue.vertices, ye = de.vertices;
                        for (P = 0; P < ue.vertices.length; P++)
                          for (_ = 0; _ < de.vertices.length; _++) {
                            var Ge = a.magnitudeSquared(a.sub(re[(P + 1) % re.length], ye[_])), Le = a.magnitudeSquared(a.sub(re[P], ye[(_ + 1) % ye.length]));
                            Ge < X && Le < X && (re[P].isInternal = !0, ye[_].isInternal = !0);
                          }
                      }
                    }
                  }
                }
                return w.length > 1 ? (m = f.create(l.extend({ parts: w.slice(0) }, u)), f.setPosition(m, { x: g, y: h }), m) : w[0];
              };
            })();
          }),
          /* 13 */
          /***/
          (function(i, c, s) {
            var t = {};
            i.exports = t;
            var o = s(0), l = s(8);
            (function() {
              t.create = function(f) {
                var p = {
                  bodies: [],
                  collisions: [],
                  pairs: null
                };
                return o.extend(p, f);
              }, t.setBodies = function(f, p) {
                f.bodies = p.slice(0);
              }, t.clear = function(f) {
                f.bodies = [], f.collisions = [];
              }, t.collisions = function(f) {
                var p = f.pairs, a = f.bodies, g = a.length, h = t.canCollide, r = l.collides, u = f.collisions, d = 0, v, x;
                for (a.sort(t._compareBoundsX), v = 0; v < g; v++) {
                  var M = a[v], b = M.bounds, E = M.bounds.max.x, m = M.bounds.max.y, w = M.bounds.min.y, C = M.isStatic || M.isSleeping, y = M.parts.length, T = y === 1;
                  for (x = v + 1; x < g; x++) {
                    var S = a[x], I = S.bounds;
                    if (I.min.x > E)
                      break;
                    if (!(m < I.min.y || w > I.max.y) && !(C && (S.isStatic || S.isSleeping)) && h(M.collisionFilter, S.collisionFilter)) {
                      var P = S.parts.length;
                      if (T && P === 1) {
                        var R = r(M, S, p);
                        R && (u[d++] = R);
                      } else
                        for (var _ = y > 1 ? 1 : 0, H = P > 1 ? 1 : 0, U = _; U < y; U++)
                          for (var k = M.parts[U], b = k.bounds, G = H; G < P; G++) {
                            var X = S.parts[G], I = X.bounds;
                            if (!(b.min.x > I.max.x || b.max.x < I.min.x || b.max.y < I.min.y || b.min.y > I.max.y)) {
                              var R = r(k, X, p);
                              R && (u[d++] = R);
                            }
                          }
                    }
                  }
                }
                return u.length !== d && (u.length = d), u;
              }, t.canCollide = function(f, p) {
                return f.group === p.group && f.group !== 0 ? f.group > 0 : (f.mask & p.category) !== 0 && (p.mask & f.category) !== 0;
              }, t._compareBoundsX = function(f, p) {
                return f.bounds.min.x - p.bounds.min.x;
              };
            })();
          }),
          /* 14 */
          /***/
          (function(i, c, s) {
            var t = {};
            i.exports = t;
            var o = s(0);
            (function() {
              t.create = function(l) {
                var f = {};
                return l || o.log("Mouse.create: element was undefined, defaulting to document.body", "warn"), f.element = l || document.body, f.absolute = { x: 0, y: 0 }, f.position = { x: 0, y: 0 }, f.mousedownPosition = { x: 0, y: 0 }, f.mouseupPosition = { x: 0, y: 0 }, f.offset = { x: 0, y: 0 }, f.scale = { x: 1, y: 1 }, f.wheelDelta = 0, f.button = -1, f.pixelRatio = parseInt(f.element.getAttribute("data-pixel-ratio"), 10) || 1, f.sourceEvents = {
                  mousemove: null,
                  mousedown: null,
                  mouseup: null,
                  mousewheel: null
                }, f.mousemove = function(p) {
                  var a = t._getRelativeMousePosition(p, f.element, f.pixelRatio), g = p.changedTouches;
                  g && (f.button = 0, p.preventDefault()), f.absolute.x = a.x, f.absolute.y = a.y, f.position.x = f.absolute.x * f.scale.x + f.offset.x, f.position.y = f.absolute.y * f.scale.y + f.offset.y, f.sourceEvents.mousemove = p;
                }, f.mousedown = function(p) {
                  var a = t._getRelativeMousePosition(p, f.element, f.pixelRatio), g = p.changedTouches;
                  g ? (f.button = 0, p.preventDefault()) : f.button = p.button, f.absolute.x = a.x, f.absolute.y = a.y, f.position.x = f.absolute.x * f.scale.x + f.offset.x, f.position.y = f.absolute.y * f.scale.y + f.offset.y, f.mousedownPosition.x = f.position.x, f.mousedownPosition.y = f.position.y, f.sourceEvents.mousedown = p;
                }, f.mouseup = function(p) {
                  var a = t._getRelativeMousePosition(p, f.element, f.pixelRatio), g = p.changedTouches;
                  g && p.preventDefault(), f.button = -1, f.absolute.x = a.x, f.absolute.y = a.y, f.position.x = f.absolute.x * f.scale.x + f.offset.x, f.position.y = f.absolute.y * f.scale.y + f.offset.y, f.mouseupPosition.x = f.position.x, f.mouseupPosition.y = f.position.y, f.sourceEvents.mouseup = p;
                }, f.mousewheel = function(p) {
                  f.wheelDelta = Math.max(-1, Math.min(1, p.wheelDelta || -p.detail)), p.preventDefault(), f.sourceEvents.mousewheel = p;
                }, t.setElement(f, f.element), f;
              }, t.setElement = function(l, f) {
                l.element = f, f.addEventListener("mousemove", l.mousemove, { passive: !0 }), f.addEventListener("mousedown", l.mousedown, { passive: !0 }), f.addEventListener("mouseup", l.mouseup, { passive: !0 }), f.addEventListener("wheel", l.mousewheel, { passive: !1 }), f.addEventListener("touchmove", l.mousemove, { passive: !1 }), f.addEventListener("touchstart", l.mousedown, { passive: !1 }), f.addEventListener("touchend", l.mouseup, { passive: !1 });
              }, t.clearSourceEvents = function(l) {
                l.sourceEvents.mousemove = null, l.sourceEvents.mousedown = null, l.sourceEvents.mouseup = null, l.sourceEvents.mousewheel = null, l.wheelDelta = 0;
              }, t.setOffset = function(l, f) {
                l.offset.x = f.x, l.offset.y = f.y, l.position.x = l.absolute.x * l.scale.x + l.offset.x, l.position.y = l.absolute.y * l.scale.y + l.offset.y;
              }, t.setScale = function(l, f) {
                l.scale.x = f.x, l.scale.y = f.y, l.position.x = l.absolute.x * l.scale.x + l.offset.x, l.position.y = l.absolute.y * l.scale.y + l.offset.y;
              }, t._getRelativeMousePosition = function(l, f, p) {
                var a = f.getBoundingClientRect(), g = document.documentElement || document.body.parentNode || document.body, h = window.pageXOffset !== void 0 ? window.pageXOffset : g.scrollLeft, r = window.pageYOffset !== void 0 ? window.pageYOffset : g.scrollTop, u = l.changedTouches, d, v;
                return u ? (d = u[0].pageX - a.left - h, v = u[0].pageY - a.top - r) : (d = l.pageX - a.left - h, v = l.pageY - a.top - r), {
                  x: d / (f.clientWidth / (f.width || f.clientWidth) * p),
                  y: v / (f.clientHeight / (f.height || f.clientHeight) * p)
                };
              };
            })();
          }),
          /* 15 */
          /***/
          (function(i, c, s) {
            var t = {};
            i.exports = t;
            var o = s(0);
            (function() {
              t._registry = {}, t.register = function(l) {
                if (t.isPlugin(l) || o.warn("Plugin.register:", t.toString(l), "does not implement all required fields."), l.name in t._registry) {
                  var f = t._registry[l.name], p = t.versionParse(l.version).number, a = t.versionParse(f.version).number;
                  p > a ? (o.warn("Plugin.register:", t.toString(f), "was upgraded to", t.toString(l)), t._registry[l.name] = l) : p < a ? o.warn("Plugin.register:", t.toString(f), "can not be downgraded to", t.toString(l)) : l !== f && o.warn("Plugin.register:", t.toString(l), "is already registered to different plugin object");
                } else
                  t._registry[l.name] = l;
                return l;
              }, t.resolve = function(l) {
                return t._registry[t.dependencyParse(l).name];
              }, t.toString = function(l) {
                return typeof l == "string" ? l : (l.name || "anonymous") + "@" + (l.version || l.range || "0.0.0");
              }, t.isPlugin = function(l) {
                return l && l.name && l.version && l.install;
              }, t.isUsed = function(l, f) {
                return l.used.indexOf(f) > -1;
              }, t.isFor = function(l, f) {
                var p = l.for && t.dependencyParse(l.for);
                return !l.for || f.name === p.name && t.versionSatisfies(f.version, p.range);
              }, t.use = function(l, f) {
                if (l.uses = (l.uses || []).concat(f || []), l.uses.length === 0) {
                  o.warn("Plugin.use:", t.toString(l), "does not specify any dependencies to install.");
                  return;
                }
                for (var p = t.dependencies(l), a = o.topologicalSort(p), g = [], h = 0; h < a.length; h += 1)
                  if (a[h] !== l.name) {
                    var r = t.resolve(a[h]);
                    if (!r) {
                      g.push("❌ " + a[h]);
                      continue;
                    }
                    t.isUsed(l, r.name) || (t.isFor(r, l) || (o.warn("Plugin.use:", t.toString(r), "is for", r.for, "but installed on", t.toString(l) + "."), r._warned = !0), r.install ? r.install(l) : (o.warn("Plugin.use:", t.toString(r), "does not specify an install function."), r._warned = !0), r._warned ? (g.push("🔶 " + t.toString(r)), delete r._warned) : g.push("✅ " + t.toString(r)), l.used.push(r.name));
                  }
                g.length > 0 && o.info(g.join("  "));
              }, t.dependencies = function(l, f) {
                var p = t.dependencyParse(l), a = p.name;
                if (f = f || {}, !(a in f)) {
                  l = t.resolve(l) || l, f[a] = o.map(l.uses || [], function(h) {
                    t.isPlugin(h) && t.register(h);
                    var r = t.dependencyParse(h), u = t.resolve(h);
                    return u && !t.versionSatisfies(u.version, r.range) ? (o.warn(
                      "Plugin.dependencies:",
                      t.toString(u),
                      "does not satisfy",
                      t.toString(r),
                      "used by",
                      t.toString(p) + "."
                    ), u._warned = !0, l._warned = !0) : u || (o.warn(
                      "Plugin.dependencies:",
                      t.toString(h),
                      "used by",
                      t.toString(p),
                      "could not be resolved."
                    ), l._warned = !0), r.name;
                  });
                  for (var g = 0; g < f[a].length; g += 1)
                    t.dependencies(f[a][g], f);
                  return f;
                }
              }, t.dependencyParse = function(l) {
                if (o.isString(l)) {
                  var f = /^[\w-]+(@(\*|[\^~]?\d+\.\d+\.\d+(-[0-9A-Za-z-+]+)?))?$/;
                  return f.test(l) || o.warn("Plugin.dependencyParse:", l, "is not a valid dependency string."), {
                    name: l.split("@")[0],
                    range: l.split("@")[1] || "*"
                  };
                }
                return {
                  name: l.name,
                  range: l.range || l.version
                };
              }, t.versionParse = function(l) {
                var f = /^(\*)|(\^|~|>=|>)?\s*((\d+)\.(\d+)\.(\d+))(-[0-9A-Za-z-+]+)?$/;
                f.test(l) || o.warn("Plugin.versionParse:", l, "is not a valid version or range.");
                var p = f.exec(l), a = Number(p[4]), g = Number(p[5]), h = Number(p[6]);
                return {
                  isRange: !!(p[1] || p[2]),
                  version: p[3],
                  range: l,
                  operator: p[1] || p[2] || "",
                  major: a,
                  minor: g,
                  patch: h,
                  parts: [a, g, h],
                  prerelease: p[7],
                  number: a * 1e8 + g * 1e4 + h
                };
              }, t.versionSatisfies = function(l, f) {
                f = f || "*";
                var p = t.versionParse(f), a = t.versionParse(l);
                if (p.isRange) {
                  if (p.operator === "*" || l === "*")
                    return !0;
                  if (p.operator === ">")
                    return a.number > p.number;
                  if (p.operator === ">=")
                    return a.number >= p.number;
                  if (p.operator === "~")
                    return a.major === p.major && a.minor === p.minor && a.patch >= p.patch;
                  if (p.operator === "^")
                    return p.major > 0 ? a.major === p.major && a.number >= p.number : p.minor > 0 ? a.minor === p.minor && a.patch >= p.patch : a.patch === p.patch;
                }
                return l === f || l === "*";
              };
            })();
          }),
          /* 16 */
          /***/
          (function(i, c) {
            var s = {};
            i.exports = s, (function() {
              s.create = function(t) {
                return {
                  vertex: t,
                  normalImpulse: 0,
                  tangentImpulse: 0
                };
              };
            })();
          }),
          /* 17 */
          /***/
          (function(i, c, s) {
            var t = {};
            i.exports = t;
            var o = s(7), l = s(18), f = s(13), p = s(19), a = s(5), g = s(6), h = s(10), r = s(0), u = s(4);
            (function() {
              t._deltaMax = 1e3 / 60, t.create = function(d) {
                d = d || {};
                var v = {
                  positionIterations: 6,
                  velocityIterations: 4,
                  constraintIterations: 2,
                  enableSleeping: !1,
                  events: [],
                  plugin: {},
                  gravity: {
                    x: 0,
                    y: 1,
                    scale: 1e-3
                  },
                  timing: {
                    timestamp: 0,
                    timeScale: 1,
                    lastDelta: 0,
                    lastElapsed: 0,
                    lastUpdatesPerFrame: 0
                  }
                }, x = r.extend(v, d);
                return x.world = d.world || g.create({ label: "World" }), x.pairs = d.pairs || p.create(), x.detector = d.detector || f.create(), x.detector.pairs = x.pairs, x.grid = { buckets: [] }, x.world.gravity = x.gravity, x.broadphase = x.grid, x.metrics = {}, x;
              }, t.update = function(d, v) {
                var x = r.now(), M = d.world, b = d.detector, E = d.pairs, m = d.timing, w = m.timestamp, C;
                v > t._deltaMax && r.warnOnce(
                  "Matter.Engine.update: delta argument is recommended to be less than or equal to",
                  t._deltaMax.toFixed(3),
                  "ms."
                ), v = typeof v < "u" ? v : r._baseDelta, v *= m.timeScale, m.timestamp += v, m.lastDelta = v;
                var y = {
                  timestamp: m.timestamp,
                  delta: v
                };
                a.trigger(d, "beforeUpdate", y);
                var T = g.allBodies(M), S = g.allConstraints(M);
                for (M.isModified && (f.setBodies(b, T), g.setModified(M, !1, !1, !0)), d.enableSleeping && o.update(T, v), t._bodiesApplyGravity(T, d.gravity), v > 0 && t._bodiesUpdate(T, v), a.trigger(d, "beforeSolve", y), h.preSolveAll(T), C = 0; C < d.constraintIterations; C++)
                  h.solveAll(S, v);
                h.postSolveAll(T);
                var I = f.collisions(b);
                p.update(E, I, w), d.enableSleeping && o.afterCollisions(E.list), E.collisionStart.length > 0 && a.trigger(d, "collisionStart", {
                  pairs: E.collisionStart,
                  timestamp: m.timestamp,
                  delta: v
                });
                var P = r.clamp(20 / d.positionIterations, 0, 1);
                for (l.preSolvePosition(E.list), C = 0; C < d.positionIterations; C++)
                  l.solvePosition(E.list, v, P);
                for (l.postSolvePosition(T), h.preSolveAll(T), C = 0; C < d.constraintIterations; C++)
                  h.solveAll(S, v);
                for (h.postSolveAll(T), l.preSolveVelocity(E.list), C = 0; C < d.velocityIterations; C++)
                  l.solveVelocity(E.list, v);
                return t._bodiesUpdateVelocities(T), E.collisionActive.length > 0 && a.trigger(d, "collisionActive", {
                  pairs: E.collisionActive,
                  timestamp: m.timestamp,
                  delta: v
                }), E.collisionEnd.length > 0 && a.trigger(d, "collisionEnd", {
                  pairs: E.collisionEnd,
                  timestamp: m.timestamp,
                  delta: v
                }), t._bodiesClearForces(T), a.trigger(d, "afterUpdate", y), d.timing.lastElapsed = r.now() - x, d;
              }, t.merge = function(d, v) {
                if (r.extend(d, v), v.world) {
                  d.world = v.world, t.clear(d);
                  for (var x = g.allBodies(d.world), M = 0; M < x.length; M++) {
                    var b = x[M];
                    o.set(b, !1), b.id = r.nextId();
                  }
                }
              }, t.clear = function(d) {
                p.clear(d.pairs), f.clear(d.detector);
              }, t._bodiesClearForces = function(d) {
                for (var v = d.length, x = 0; x < v; x++) {
                  var M = d[x];
                  M.force.x = 0, M.force.y = 0, M.torque = 0;
                }
              }, t._bodiesApplyGravity = function(d, v) {
                var x = typeof v.scale < "u" ? v.scale : 1e-3, M = d.length;
                if (!(v.x === 0 && v.y === 0 || x === 0))
                  for (var b = 0; b < M; b++) {
                    var E = d[b];
                    E.isStatic || E.isSleeping || (E.force.y += E.mass * v.y * x, E.force.x += E.mass * v.x * x);
                  }
              }, t._bodiesUpdate = function(d, v) {
                for (var x = d.length, M = 0; M < x; M++) {
                  var b = d[M];
                  b.isStatic || b.isSleeping || u.update(b, v);
                }
              }, t._bodiesUpdateVelocities = function(d) {
                for (var v = d.length, x = 0; x < v; x++)
                  u.updateVelocities(d[x]);
              };
            })();
          }),
          /* 18 */
          /***/
          (function(i, c, s) {
            var t = {};
            i.exports = t;
            var o = s(3), l = s(0), f = s(1);
            (function() {
              t._restingThresh = 2, t._restingThreshTangent = Math.sqrt(6), t._positionDampen = 0.9, t._positionWarming = 0.8, t._frictionNormalMultiplier = 5, t._frictionMaxStatic = Number.MAX_VALUE, t.preSolvePosition = function(p) {
                var a, g, h, r = p.length;
                for (a = 0; a < r; a++)
                  g = p[a], g.isActive && (h = g.contactCount, g.collision.parentA.totalContacts += h, g.collision.parentB.totalContacts += h);
              }, t.solvePosition = function(p, a, g) {
                var h, r, u, d, v, x, M, b, E = t._positionDampen * (g || 1), m = l.clamp(a / l._baseDelta, 0, 1), w = p.length;
                for (h = 0; h < w; h++)
                  r = p[h], !(!r.isActive || r.isSensor) && (u = r.collision, d = u.parentA, v = u.parentB, x = u.normal, r.separation = u.depth + x.x * (v.positionImpulse.x - d.positionImpulse.x) + x.y * (v.positionImpulse.y - d.positionImpulse.y));
                for (h = 0; h < w; h++)
                  r = p[h], !(!r.isActive || r.isSensor) && (u = r.collision, d = u.parentA, v = u.parentB, x = u.normal, b = r.separation - r.slop * m, (d.isStatic || v.isStatic) && (b *= 2), d.isStatic || d.isSleeping || (M = E / d.totalContacts, d.positionImpulse.x += x.x * b * M, d.positionImpulse.y += x.y * b * M), v.isStatic || v.isSleeping || (M = E / v.totalContacts, v.positionImpulse.x -= x.x * b * M, v.positionImpulse.y -= x.y * b * M));
              }, t.postSolvePosition = function(p) {
                for (var a = t._positionWarming, g = p.length, h = o.translate, r = f.update, u = 0; u < g; u++) {
                  var d = p[u], v = d.positionImpulse, x = v.x, M = v.y, b = d.velocity;
                  if (d.totalContacts = 0, x !== 0 || M !== 0) {
                    for (var E = 0; E < d.parts.length; E++) {
                      var m = d.parts[E];
                      h(m.vertices, v), r(m.bounds, m.vertices, b), m.position.x += x, m.position.y += M;
                    }
                    d.positionPrev.x += x, d.positionPrev.y += M, x * b.x + M * b.y < 0 ? (v.x = 0, v.y = 0) : (v.x *= a, v.y *= a);
                  }
                }
              }, t.preSolveVelocity = function(p) {
                var a = p.length, g, h;
                for (g = 0; g < a; g++) {
                  var r = p[g];
                  if (!(!r.isActive || r.isSensor)) {
                    var u = r.contacts, d = r.contactCount, v = r.collision, x = v.parentA, M = v.parentB, b = v.normal, E = v.tangent;
                    for (h = 0; h < d; h++) {
                      var m = u[h], w = m.vertex, C = m.normalImpulse, y = m.tangentImpulse;
                      if (C !== 0 || y !== 0) {
                        var T = b.x * C + E.x * y, S = b.y * C + E.y * y;
                        x.isStatic || x.isSleeping || (x.positionPrev.x += T * x.inverseMass, x.positionPrev.y += S * x.inverseMass, x.anglePrev += x.inverseInertia * ((w.x - x.position.x) * S - (w.y - x.position.y) * T)), M.isStatic || M.isSleeping || (M.positionPrev.x -= T * M.inverseMass, M.positionPrev.y -= S * M.inverseMass, M.anglePrev -= M.inverseInertia * ((w.x - M.position.x) * S - (w.y - M.position.y) * T));
                      }
                    }
                  }
                }
              }, t.solveVelocity = function(p, a) {
                var g = a / l._baseDelta, h = g * g, r = h * g, u = -t._restingThresh * g, d = t._restingThreshTangent, v = t._frictionNormalMultiplier * g, x = t._frictionMaxStatic, M = p.length, b, E, m, w;
                for (m = 0; m < M; m++) {
                  var C = p[m];
                  if (!(!C.isActive || C.isSensor)) {
                    var y = C.collision, T = y.parentA, S = y.parentB, I = y.normal.x, P = y.normal.y, R = y.tangent.x, _ = y.tangent.y, H = C.inverseMass, U = C.friction * C.frictionStatic * v, k = C.contacts, G = C.contactCount, X = 1 / G, ue = T.position.x - T.positionPrev.x, de = T.position.y - T.positionPrev.y, re = T.angle - T.anglePrev, ye = S.position.x - S.positionPrev.x, Ge = S.position.y - S.positionPrev.y, Le = S.angle - S.anglePrev;
                    for (w = 0; w < G; w++) {
                      var ee = k[w], Ce = ee.vertex, ge = Ce.x - T.position.x, ht = Ce.y - T.position.y, Pe = Ce.x - S.position.x, ke = Ce.y - S.position.y, A = ue - ht * re, B = de + ge * re, F = ye - ke * Le, $ = Ge + Pe * Le, D = A - F, L = B - $, W = I * D + P * L, V = R * D + _ * L, N = C.separation + W, O = Math.min(N, 1);
                      O = N < 0 ? 0 : O;
                      var z = O * U;
                      V < -z || V > z ? (E = V > 0 ? V : -V, b = C.friction * (V > 0 ? 1 : -1) * r, b < -E ? b = -E : b > E && (b = E)) : (b = V, E = x);
                      var j = ge * P - ht * I, K = Pe * P - ke * I, J = X / (H + T.inverseInertia * j * j + S.inverseInertia * K * K), q = (1 + C.restitution) * W * J;
                      if (b *= J, W < u)
                        ee.normalImpulse = 0;
                      else {
                        var oe = ee.normalImpulse;
                        ee.normalImpulse += q, ee.normalImpulse > 0 && (ee.normalImpulse = 0), q = ee.normalImpulse - oe;
                      }
                      if (V < -d || V > d)
                        ee.tangentImpulse = 0;
                      else {
                        var te = ee.tangentImpulse;
                        ee.tangentImpulse += b, ee.tangentImpulse < -E && (ee.tangentImpulse = -E), ee.tangentImpulse > E && (ee.tangentImpulse = E), b = ee.tangentImpulse - te;
                      }
                      var me = I * q + R * b, xe = P * q + _ * b;
                      T.isStatic || T.isSleeping || (T.positionPrev.x += me * T.inverseMass, T.positionPrev.y += xe * T.inverseMass, T.anglePrev += (ge * xe - ht * me) * T.inverseInertia), S.isStatic || S.isSleeping || (S.positionPrev.x -= me * S.inverseMass, S.positionPrev.y -= xe * S.inverseMass, S.anglePrev -= (Pe * xe - ke * me) * S.inverseInertia);
                    }
                  }
                }
              };
            })();
          }),
          /* 19 */
          /***/
          (function(i, c, s) {
            var t = {};
            i.exports = t;
            var o = s(9), l = s(0);
            (function() {
              t.create = function(f) {
                return l.extend({
                  table: {},
                  list: [],
                  collisionStart: [],
                  collisionActive: [],
                  collisionEnd: []
                }, f);
              }, t.update = function(f, p, a) {
                var g = o.update, h = o.create, r = o.setActive, u = f.table, d = f.list, v = d.length, x = v, M = f.collisionStart, b = f.collisionEnd, E = f.collisionActive, m = p.length, w = 0, C = 0, y = 0, T, S, I;
                for (I = 0; I < m; I++)
                  T = p[I], S = T.pair, S ? (S.isActive && (E[y++] = S), g(S, T, a)) : (S = h(T, a), u[S.id] = S, M[w++] = S, d[x++] = S);
                for (x = 0, v = d.length, I = 0; I < v; I++)
                  S = d[I], S.timeUpdated >= a ? d[x++] = S : (r(S, !1, a), S.collision.bodyA.sleepCounter > 0 && S.collision.bodyB.sleepCounter > 0 ? d[x++] = S : (b[C++] = S, delete u[S.id]));
                d.length !== x && (d.length = x), M.length !== w && (M.length = w), b.length !== C && (b.length = C), E.length !== y && (E.length = y);
              }, t.clear = function(f) {
                return f.table = {}, f.list.length = 0, f.collisionStart.length = 0, f.collisionActive.length = 0, f.collisionEnd.length = 0, f;
              };
            })();
          }),
          /* 20 */
          /***/
          (function(i, c, s) {
            var t = i.exports = s(21);
            t.Axes = s(11), t.Bodies = s(12), t.Body = s(4), t.Bounds = s(1), t.Collision = s(8), t.Common = s(0), t.Composite = s(6), t.Composites = s(22), t.Constraint = s(10), t.Contact = s(16), t.Detector = s(13), t.Engine = s(17), t.Events = s(5), t.Grid = s(23), t.Mouse = s(14), t.MouseConstraint = s(24), t.Pair = s(9), t.Pairs = s(19), t.Plugin = s(15), t.Query = s(25), t.Render = s(26), t.Resolver = s(18), t.Runner = s(27), t.SAT = s(28), t.Sleeping = s(7), t.Svg = s(29), t.Vector = s(2), t.Vertices = s(3), t.World = s(30), t.Engine.run = t.Runner.run, t.Common.deprecated(t.Engine, "run", "Engine.run ➤ use Matter.Runner.run(engine) instead");
          }),
          /* 21 */
          /***/
          (function(i, c, s) {
            var t = {};
            i.exports = t;
            var o = s(15), l = s(0);
            (function() {
              t.name = "matter-js", t.version = "0.20.0", t.uses = [], t.used = [], t.use = function() {
                o.use(t, Array.prototype.slice.call(arguments));
              }, t.before = function(f, p) {
                return f = f.replace(/^Matter./, ""), l.chainPathBefore(t, f, p);
              }, t.after = function(f, p) {
                return f = f.replace(/^Matter./, ""), l.chainPathAfter(t, f, p);
              };
            })();
          }),
          /* 22 */
          /***/
          (function(i, c, s) {
            var t = {};
            i.exports = t;
            var o = s(6), l = s(10), f = s(0), p = s(4), a = s(12), g = f.deprecated;
            (function() {
              t.stack = function(h, r, u, d, v, x, M) {
                for (var b = o.create({ label: "Stack" }), E = h, m = r, w, C = 0, y = 0; y < d; y++) {
                  for (var T = 0, S = 0; S < u; S++) {
                    var I = M(E, m, S, y, w, C);
                    if (I) {
                      var P = I.bounds.max.y - I.bounds.min.y, R = I.bounds.max.x - I.bounds.min.x;
                      P > T && (T = P), p.translate(I, { x: R * 0.5, y: P * 0.5 }), E = I.bounds.max.x + v, o.addBody(b, I), w = I, C += 1;
                    } else
                      E += v;
                  }
                  m += T + x, E = h;
                }
                return b;
              }, t.chain = function(h, r, u, d, v, x) {
                for (var M = h.bodies, b = 1; b < M.length; b++) {
                  var E = M[b - 1], m = M[b], w = E.bounds.max.y - E.bounds.min.y, C = E.bounds.max.x - E.bounds.min.x, y = m.bounds.max.y - m.bounds.min.y, T = m.bounds.max.x - m.bounds.min.x, S = {
                    bodyA: E,
                    pointA: { x: C * r, y: w * u },
                    bodyB: m,
                    pointB: { x: T * d, y: y * v }
                  }, I = f.extend(S, x);
                  o.addConstraint(h, l.create(I));
                }
                return h.label += " Chain", h;
              }, t.mesh = function(h, r, u, d, v) {
                var x = h.bodies, M, b, E, m, w;
                for (M = 0; M < u; M++) {
                  for (b = 1; b < r; b++)
                    E = x[b - 1 + M * r], m = x[b + M * r], o.addConstraint(h, l.create(f.extend({ bodyA: E, bodyB: m }, v)));
                  if (M > 0)
                    for (b = 0; b < r; b++)
                      E = x[b + (M - 1) * r], m = x[b + M * r], o.addConstraint(h, l.create(f.extend({ bodyA: E, bodyB: m }, v))), d && b > 0 && (w = x[b - 1 + (M - 1) * r], o.addConstraint(h, l.create(f.extend({ bodyA: w, bodyB: m }, v)))), d && b < r - 1 && (w = x[b + 1 + (M - 1) * r], o.addConstraint(h, l.create(f.extend({ bodyA: w, bodyB: m }, v))));
                }
                return h.label += " Mesh", h;
              }, t.pyramid = function(h, r, u, d, v, x, M) {
                return t.stack(h, r, u, d, v, x, function(b, E, m, w, C, y) {
                  var T = Math.min(d, Math.ceil(u / 2)), S = C ? C.bounds.max.x - C.bounds.min.x : 0;
                  if (!(w > T)) {
                    w = T - w;
                    var I = w, P = u - 1 - w;
                    if (!(m < I || m > P)) {
                      y === 1 && p.translate(C, { x: (m + (u % 2 === 1 ? 1 : -1)) * S, y: 0 });
                      var R = C ? m * S : 0;
                      return M(h + R + m * v, E, m, w, C, y);
                    }
                  }
                });
              }, t.newtonsCradle = function(h, r, u, d, v) {
                for (var x = o.create({ label: "Newtons Cradle" }), M = 0; M < u; M++) {
                  var b = 1.9, E = a.circle(
                    h + M * (d * b),
                    r + v,
                    d,
                    { inertia: 1 / 0, restitution: 1, friction: 0, frictionAir: 1e-4, slop: 1 }
                  ), m = l.create({ pointA: { x: h + M * (d * b), y: r }, bodyB: E });
                  o.addBody(x, E), o.addConstraint(x, m);
                }
                return x;
              }, g(t, "newtonsCradle", "Composites.newtonsCradle ➤ moved to newtonsCradle example"), t.car = function(h, r, u, d, v) {
                var x = p.nextGroup(!0), M = 20, b = -u * 0.5 + M, E = u * 0.5 - M, m = 0, w = o.create({ label: "Car" }), C = a.rectangle(h, r, u, d, {
                  collisionFilter: {
                    group: x
                  },
                  chamfer: {
                    radius: d * 0.5
                  },
                  density: 2e-4
                }), y = a.circle(h + b, r + m, v, {
                  collisionFilter: {
                    group: x
                  },
                  friction: 0.8
                }), T = a.circle(h + E, r + m, v, {
                  collisionFilter: {
                    group: x
                  },
                  friction: 0.8
                }), S = l.create({
                  bodyB: C,
                  pointB: { x: b, y: m },
                  bodyA: y,
                  stiffness: 1,
                  length: 0
                }), I = l.create({
                  bodyB: C,
                  pointB: { x: E, y: m },
                  bodyA: T,
                  stiffness: 1,
                  length: 0
                });
                return o.addBody(w, C), o.addBody(w, y), o.addBody(w, T), o.addConstraint(w, S), o.addConstraint(w, I), w;
              }, g(t, "car", "Composites.car ➤ moved to car example"), t.softBody = function(h, r, u, d, v, x, M, b, E, m) {
                E = f.extend({ inertia: 1 / 0 }, E), m = f.extend({ stiffness: 0.2, render: { type: "line", anchors: !1 } }, m);
                var w = t.stack(h, r, u, d, v, x, function(C, y) {
                  return a.circle(C, y, b, E);
                });
                return t.mesh(w, u, d, M, m), w.label = "Soft Body", w;
              }, g(t, "softBody", "Composites.softBody ➤ moved to softBody and cloth examples");
            })();
          }),
          /* 23 */
          /***/
          (function(i, c, s) {
            var t = {};
            i.exports = t;
            var o = s(9), l = s(0), f = l.deprecated;
            (function() {
              t.create = function(p) {
                var a = {
                  buckets: {},
                  pairs: {},
                  pairsList: [],
                  bucketWidth: 48,
                  bucketHeight: 48
                };
                return l.extend(a, p);
              }, t.update = function(p, a, g, h) {
                var r, u, d, v = g.world, x = p.buckets, M, b, E = !1;
                for (r = 0; r < a.length; r++) {
                  var m = a[r];
                  if (!(m.isSleeping && !h) && !(v.bounds && (m.bounds.max.x < v.bounds.min.x || m.bounds.min.x > v.bounds.max.x || m.bounds.max.y < v.bounds.min.y || m.bounds.min.y > v.bounds.max.y))) {
                    var w = t._getRegion(p, m);
                    if (!m.region || w.id !== m.region.id || h) {
                      (!m.region || h) && (m.region = w);
                      var C = t._regionUnion(w, m.region);
                      for (u = C.startCol; u <= C.endCol; u++)
                        for (d = C.startRow; d <= C.endRow; d++) {
                          b = t._getBucketId(u, d), M = x[b];
                          var y = u >= w.startCol && u <= w.endCol && d >= w.startRow && d <= w.endRow, T = u >= m.region.startCol && u <= m.region.endCol && d >= m.region.startRow && d <= m.region.endRow;
                          !y && T && T && M && t._bucketRemoveBody(p, M, m), (m.region === w || y && !T || h) && (M || (M = t._createBucket(x, b)), t._bucketAddBody(p, M, m));
                        }
                      m.region = w, E = !0;
                    }
                  }
                }
                E && (p.pairsList = t._createActivePairsList(p));
              }, f(t, "update", "Grid.update ➤ replaced by Matter.Detector"), t.clear = function(p) {
                p.buckets = {}, p.pairs = {}, p.pairsList = [];
              }, f(t, "clear", "Grid.clear ➤ replaced by Matter.Detector"), t._regionUnion = function(p, a) {
                var g = Math.min(p.startCol, a.startCol), h = Math.max(p.endCol, a.endCol), r = Math.min(p.startRow, a.startRow), u = Math.max(p.endRow, a.endRow);
                return t._createRegion(g, h, r, u);
              }, t._getRegion = function(p, a) {
                var g = a.bounds, h = Math.floor(g.min.x / p.bucketWidth), r = Math.floor(g.max.x / p.bucketWidth), u = Math.floor(g.min.y / p.bucketHeight), d = Math.floor(g.max.y / p.bucketHeight);
                return t._createRegion(h, r, u, d);
              }, t._createRegion = function(p, a, g, h) {
                return {
                  id: p + "," + a + "," + g + "," + h,
                  startCol: p,
                  endCol: a,
                  startRow: g,
                  endRow: h
                };
              }, t._getBucketId = function(p, a) {
                return "C" + p + "R" + a;
              }, t._createBucket = function(p, a) {
                var g = p[a] = [];
                return g;
              }, t._bucketAddBody = function(p, a, g) {
                var h = p.pairs, r = o.id, u = a.length, d;
                for (d = 0; d < u; d++) {
                  var v = a[d];
                  if (!(g.id === v.id || g.isStatic && v.isStatic)) {
                    var x = r(g, v), M = h[x];
                    M ? M[2] += 1 : h[x] = [g, v, 1];
                  }
                }
                a.push(g);
              }, t._bucketRemoveBody = function(p, a, g) {
                var h = p.pairs, r = o.id, u;
                a.splice(l.indexOf(a, g), 1);
                var d = a.length;
                for (u = 0; u < d; u++) {
                  var v = h[r(g, a[u])];
                  v && (v[2] -= 1);
                }
              }, t._createActivePairsList = function(p) {
                var a, g = p.pairs, h = l.keys(g), r = h.length, u = [], d;
                for (d = 0; d < r; d++)
                  a = g[h[d]], a[2] > 0 ? u.push(a) : delete g[h[d]];
                return u;
              };
            })();
          }),
          /* 24 */
          /***/
          (function(i, c, s) {
            var t = {};
            i.exports = t;
            var o = s(3), l = s(7), f = s(14), p = s(5), a = s(13), g = s(10), h = s(6), r = s(0), u = s(1);
            (function() {
              t.create = function(d, v) {
                var x = (d ? d.mouse : null) || (v ? v.mouse : null);
                x || (d && d.render && d.render.canvas ? x = f.create(d.render.canvas) : v && v.element ? x = f.create(v.element) : (x = f.create(), r.warn("MouseConstraint.create: options.mouse was undefined, options.element was undefined, may not function as expected")));
                var M = g.create({
                  label: "Mouse Constraint",
                  pointA: x.position,
                  pointB: { x: 0, y: 0 },
                  length: 0.01,
                  stiffness: 0.1,
                  angularStiffness: 1,
                  render: {
                    strokeStyle: "#90EE90",
                    lineWidth: 3
                  }
                }), b = {
                  type: "mouseConstraint",
                  mouse: x,
                  element: null,
                  body: null,
                  constraint: M,
                  collisionFilter: {
                    category: 1,
                    mask: 4294967295,
                    group: 0
                  }
                }, E = r.extend(b, v);
                return p.on(d, "beforeUpdate", function() {
                  var m = h.allBodies(d.world);
                  t.update(E, m), t._triggerEvents(E);
                }), E;
              }, t.update = function(d, v) {
                var x = d.mouse, M = d.constraint, b = d.body;
                if (x.button === 0) {
                  if (M.bodyB)
                    l.set(M.bodyB, !1), M.pointA = x.position;
                  else
                    for (var E = 0; E < v.length; E++)
                      if (b = v[E], u.contains(b.bounds, x.position) && a.canCollide(b.collisionFilter, d.collisionFilter))
                        for (var m = b.parts.length > 1 ? 1 : 0; m < b.parts.length; m++) {
                          var w = b.parts[m];
                          if (o.contains(w.vertices, x.position)) {
                            M.pointA = x.position, M.bodyB = d.body = b, M.pointB = { x: x.position.x - b.position.x, y: x.position.y - b.position.y }, M.angleB = b.angle, l.set(b, !1), p.trigger(d, "startdrag", { mouse: x, body: b });
                            break;
                          }
                        }
                } else
                  M.bodyB = d.body = null, M.pointB = null, b && p.trigger(d, "enddrag", { mouse: x, body: b });
              }, t._triggerEvents = function(d) {
                var v = d.mouse, x = v.sourceEvents;
                x.mousemove && p.trigger(d, "mousemove", { mouse: v }), x.mousedown && p.trigger(d, "mousedown", { mouse: v }), x.mouseup && p.trigger(d, "mouseup", { mouse: v }), f.clearSourceEvents(v);
              };
            })();
          }),
          /* 25 */
          /***/
          (function(i, c, s) {
            var t = {};
            i.exports = t;
            var o = s(2), l = s(8), f = s(1), p = s(12), a = s(3);
            (function() {
              t.collides = function(g, h) {
                for (var r = [], u = h.length, d = g.bounds, v = l.collides, x = f.overlaps, M = 0; M < u; M++) {
                  var b = h[M], E = b.parts.length, m = E === 1 ? 0 : 1;
                  if (x(b.bounds, d))
                    for (var w = m; w < E; w++) {
                      var C = b.parts[w];
                      if (x(C.bounds, d)) {
                        var y = v(C, g);
                        if (y) {
                          r.push(y);
                          break;
                        }
                      }
                    }
                }
                return r;
              }, t.ray = function(g, h, r, u) {
                u = u || 1e-100;
                for (var d = o.angle(h, r), v = o.magnitude(o.sub(h, r)), x = (r.x + h.x) * 0.5, M = (r.y + h.y) * 0.5, b = p.rectangle(x, M, v, u, { angle: d }), E = t.collides(b, g), m = 0; m < E.length; m += 1) {
                  var w = E[m];
                  w.body = w.bodyB = w.bodyA;
                }
                return E;
              }, t.region = function(g, h, r) {
                for (var u = [], d = 0; d < g.length; d++) {
                  var v = g[d], x = f.overlaps(v.bounds, h);
                  (x && !r || !x && r) && u.push(v);
                }
                return u;
              }, t.point = function(g, h) {
                for (var r = [], u = 0; u < g.length; u++) {
                  var d = g[u];
                  if (f.contains(d.bounds, h))
                    for (var v = d.parts.length === 1 ? 0 : 1; v < d.parts.length; v++) {
                      var x = d.parts[v];
                      if (f.contains(x.bounds, h) && a.contains(x.vertices, h)) {
                        r.push(d);
                        break;
                      }
                    }
                }
                return r;
              };
            })();
          }),
          /* 26 */
          /***/
          (function(i, c, s) {
            var t = {};
            i.exports = t;
            var o = s(4), l = s(0), f = s(6), p = s(1), a = s(5), g = s(2), h = s(14);
            (function() {
              var r, u;
              typeof window < "u" && (r = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || function(m) {
                window.setTimeout(function() {
                  m(l.now());
                }, 1e3 / 60);
              }, u = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame), t._goodFps = 30, t._goodDelta = 1e3 / 60, t.create = function(m) {
                var w = {
                  engine: null,
                  element: null,
                  canvas: null,
                  mouse: null,
                  frameRequestId: null,
                  timing: {
                    historySize: 60,
                    delta: 0,
                    deltaHistory: [],
                    lastTime: 0,
                    lastTimestamp: 0,
                    lastElapsed: 0,
                    timestampElapsed: 0,
                    timestampElapsedHistory: [],
                    engineDeltaHistory: [],
                    engineElapsedHistory: [],
                    engineUpdatesHistory: [],
                    elapsedHistory: []
                  },
                  options: {
                    width: 800,
                    height: 600,
                    pixelRatio: 1,
                    background: "#14151f",
                    wireframeBackground: "#14151f",
                    wireframeStrokeStyle: "#bbb",
                    hasBounds: !!m.bounds,
                    enabled: !0,
                    wireframes: !0,
                    showSleeping: !0,
                    showDebug: !1,
                    showStats: !1,
                    showPerformance: !1,
                    showBounds: !1,
                    showVelocity: !1,
                    showCollisions: !1,
                    showSeparations: !1,
                    showAxes: !1,
                    showPositions: !1,
                    showAngleIndicator: !1,
                    showIds: !1,
                    showVertexNumbers: !1,
                    showConvexHulls: !1,
                    showInternalEdges: !1,
                    showMousePosition: !1
                  }
                }, C = l.extend(w, m);
                return C.canvas && (C.canvas.width = C.options.width || C.canvas.width, C.canvas.height = C.options.height || C.canvas.height), C.mouse = m.mouse, C.engine = m.engine, C.canvas = C.canvas || x(C.options.width, C.options.height), C.context = C.canvas.getContext("2d"), C.textures = {}, C.bounds = C.bounds || {
                  min: {
                    x: 0,
                    y: 0
                  },
                  max: {
                    x: C.canvas.width,
                    y: C.canvas.height
                  }
                }, C.controller = t, C.options.showBroadphase = !1, C.options.pixelRatio !== 1 && t.setPixelRatio(C, C.options.pixelRatio), l.isElement(C.element) && C.element.appendChild(C.canvas), C;
              }, t.run = function(m) {
                (function w(C) {
                  m.frameRequestId = r(w), d(m, C), t.world(m, C), m.context.setTransform(m.options.pixelRatio, 0, 0, m.options.pixelRatio, 0, 0), (m.options.showStats || m.options.showDebug) && t.stats(m, m.context, C), (m.options.showPerformance || m.options.showDebug) && t.performance(m, m.context, C), m.context.setTransform(1, 0, 0, 1, 0, 0);
                })();
              }, t.stop = function(m) {
                u(m.frameRequestId);
              }, t.setPixelRatio = function(m, w) {
                var C = m.options, y = m.canvas;
                w === "auto" && (w = M(y)), C.pixelRatio = w, y.setAttribute("data-pixel-ratio", w), y.width = C.width * w, y.height = C.height * w, y.style.width = C.width + "px", y.style.height = C.height + "px";
              }, t.setSize = function(m, w, C) {
                m.options.width = w, m.options.height = C, m.bounds.max.x = m.bounds.min.x + w, m.bounds.max.y = m.bounds.min.y + C, m.options.pixelRatio !== 1 ? t.setPixelRatio(m, m.options.pixelRatio) : (m.canvas.width = w, m.canvas.height = C);
              }, t.lookAt = function(m, w, C, y) {
                y = typeof y < "u" ? y : !0, w = l.isArray(w) ? w : [w], C = C || {
                  x: 0,
                  y: 0
                };
                for (var T = {
                  min: { x: 1 / 0, y: 1 / 0 },
                  max: { x: -1 / 0, y: -1 / 0 }
                }, S = 0; S < w.length; S += 1) {
                  var I = w[S], P = I.bounds ? I.bounds.min : I.min || I.position || I, R = I.bounds ? I.bounds.max : I.max || I.position || I;
                  P && R && (P.x < T.min.x && (T.min.x = P.x), R.x > T.max.x && (T.max.x = R.x), P.y < T.min.y && (T.min.y = P.y), R.y > T.max.y && (T.max.y = R.y));
                }
                var _ = T.max.x - T.min.x + 2 * C.x, H = T.max.y - T.min.y + 2 * C.y, U = m.canvas.height, k = m.canvas.width, G = k / U, X = _ / H, ue = 1, de = 1;
                X > G ? de = X / G : ue = G / X, m.options.hasBounds = !0, m.bounds.min.x = T.min.x, m.bounds.max.x = T.min.x + _ * ue, m.bounds.min.y = T.min.y, m.bounds.max.y = T.min.y + H * de, y && (m.bounds.min.x += _ * 0.5 - _ * ue * 0.5, m.bounds.max.x += _ * 0.5 - _ * ue * 0.5, m.bounds.min.y += H * 0.5 - H * de * 0.5, m.bounds.max.y += H * 0.5 - H * de * 0.5), m.bounds.min.x -= C.x, m.bounds.max.x -= C.x, m.bounds.min.y -= C.y, m.bounds.max.y -= C.y, m.mouse && (h.setScale(m.mouse, {
                  x: (m.bounds.max.x - m.bounds.min.x) / m.canvas.width,
                  y: (m.bounds.max.y - m.bounds.min.y) / m.canvas.height
                }), h.setOffset(m.mouse, m.bounds.min));
              }, t.startViewTransform = function(m) {
                var w = m.bounds.max.x - m.bounds.min.x, C = m.bounds.max.y - m.bounds.min.y, y = w / m.options.width, T = C / m.options.height;
                m.context.setTransform(
                  m.options.pixelRatio / y,
                  0,
                  0,
                  m.options.pixelRatio / T,
                  0,
                  0
                ), m.context.translate(-m.bounds.min.x, -m.bounds.min.y);
              }, t.endViewTransform = function(m) {
                m.context.setTransform(m.options.pixelRatio, 0, 0, m.options.pixelRatio, 0, 0);
              }, t.world = function(m, w) {
                var C = l.now(), y = m.engine, T = y.world, S = m.canvas, I = m.context, P = m.options, R = m.timing, _ = f.allBodies(T), H = f.allConstraints(T), U = P.wireframes ? P.wireframeBackground : P.background, k = [], G = [], X, ue = {
                  timestamp: y.timing.timestamp
                };
                if (a.trigger(m, "beforeRender", ue), m.currentBackground !== U && E(m, U), I.globalCompositeOperation = "source-in", I.fillStyle = "transparent", I.fillRect(0, 0, S.width, S.height), I.globalCompositeOperation = "source-over", P.hasBounds) {
                  for (X = 0; X < _.length; X++) {
                    var de = _[X];
                    p.overlaps(de.bounds, m.bounds) && k.push(de);
                  }
                  for (X = 0; X < H.length; X++) {
                    var re = H[X], ye = re.bodyA, Ge = re.bodyB, Le = re.pointA, ee = re.pointB;
                    ye && (Le = g.add(ye.position, re.pointA)), Ge && (ee = g.add(Ge.position, re.pointB)), !(!Le || !ee) && (p.contains(m.bounds, Le) || p.contains(m.bounds, ee)) && G.push(re);
                  }
                  t.startViewTransform(m), m.mouse && (h.setScale(m.mouse, {
                    x: (m.bounds.max.x - m.bounds.min.x) / m.options.width,
                    y: (m.bounds.max.y - m.bounds.min.y) / m.options.height
                  }), h.setOffset(m.mouse, m.bounds.min));
                } else
                  G = H, k = _, m.options.pixelRatio !== 1 && m.context.setTransform(m.options.pixelRatio, 0, 0, m.options.pixelRatio, 0, 0);
                !P.wireframes || y.enableSleeping && P.showSleeping ? t.bodies(m, k, I) : (P.showConvexHulls && t.bodyConvexHulls(m, k, I), t.bodyWireframes(m, k, I)), P.showBounds && t.bodyBounds(m, k, I), (P.showAxes || P.showAngleIndicator) && t.bodyAxes(m, k, I), P.showPositions && t.bodyPositions(m, k, I), P.showVelocity && t.bodyVelocity(m, k, I), P.showIds && t.bodyIds(m, k, I), P.showSeparations && t.separations(m, y.pairs.list, I), P.showCollisions && t.collisions(m, y.pairs.list, I), P.showVertexNumbers && t.vertexNumbers(m, k, I), P.showMousePosition && t.mousePosition(m, m.mouse, I), t.constraints(G, I), P.hasBounds && t.endViewTransform(m), a.trigger(m, "afterRender", ue), R.lastElapsed = l.now() - C;
              }, t.stats = function(m, w, C) {
                for (var y = m.engine, T = y.world, S = f.allBodies(T), I = 0, P = 55, R = 44, _ = 0, H = 0, U = 0; U < S.length; U += 1)
                  I += S[U].parts.length;
                var k = {
                  Part: I,
                  Body: S.length,
                  Cons: f.allConstraints(T).length,
                  Comp: f.allComposites(T).length,
                  Pair: y.pairs.list.length
                };
                w.fillStyle = "#0e0f19", w.fillRect(_, H, P * 5.5, R), w.font = "12px Arial", w.textBaseline = "top", w.textAlign = "right";
                for (var G in k) {
                  var X = k[G];
                  w.fillStyle = "#aaa", w.fillText(G, _ + P, H + 8), w.fillStyle = "#eee", w.fillText(X, _ + P, H + 26), _ += P;
                }
              }, t.performance = function(m, w) {
                var C = m.engine, y = m.timing, T = y.deltaHistory, S = y.elapsedHistory, I = y.timestampElapsedHistory, P = y.engineDeltaHistory, R = y.engineUpdatesHistory, _ = y.engineElapsedHistory, H = C.timing.lastUpdatesPerFrame, U = C.timing.lastDelta, k = v(T), G = v(S), X = v(P), ue = v(R), de = v(_), re = v(I), ye = re / k || 0, Ge = Math.round(k / U), Le = 1e3 / k || 0, ee = 4, Ce = 12, ge = 60, ht = 34, Pe = 10, ke = 69;
                w.fillStyle = "#0e0f19", w.fillRect(0, 50, Ce * 5 + ge * 6 + 22, ht), t.status(
                  w,
                  Pe,
                  ke,
                  ge,
                  ee,
                  T.length,
                  Math.round(Le) + " fps",
                  Le / t._goodFps,
                  function(A) {
                    return T[A] / k - 1;
                  }
                ), t.status(
                  w,
                  Pe + Ce + ge,
                  ke,
                  ge,
                  ee,
                  P.length,
                  U.toFixed(2) + " dt",
                  t._goodDelta / U,
                  function(A) {
                    return P[A] / X - 1;
                  }
                ), t.status(
                  w,
                  Pe + (Ce + ge) * 2,
                  ke,
                  ge,
                  ee,
                  R.length,
                  H + " upf",
                  Math.pow(l.clamp(ue / Ge || 1, 0, 1), 4),
                  function(A) {
                    return R[A] / ue - 1;
                  }
                ), t.status(
                  w,
                  Pe + (Ce + ge) * 3,
                  ke,
                  ge,
                  ee,
                  _.length,
                  de.toFixed(2) + " ut",
                  1 - H * de / t._goodFps,
                  function(A) {
                    return _[A] / de - 1;
                  }
                ), t.status(
                  w,
                  Pe + (Ce + ge) * 4,
                  ke,
                  ge,
                  ee,
                  S.length,
                  G.toFixed(2) + " rt",
                  1 - G / t._goodFps,
                  function(A) {
                    return S[A] / G - 1;
                  }
                ), t.status(
                  w,
                  Pe + (Ce + ge) * 5,
                  ke,
                  ge,
                  ee,
                  I.length,
                  ye.toFixed(2) + " x",
                  ye * ye * ye,
                  function(A) {
                    return (I[A] / T[A] / ye || 0) - 1;
                  }
                );
              }, t.status = function(m, w, C, y, T, S, I, P, R) {
                m.strokeStyle = "#888", m.fillStyle = "#444", m.lineWidth = 1, m.fillRect(w, C + 7, y, 1), m.beginPath(), m.moveTo(w, C + 7 - T * l.clamp(0.4 * R(0), -2, 2));
                for (var _ = 0; _ < y; _ += 1)
                  m.lineTo(w + _, C + 7 - (_ < S ? T * l.clamp(0.4 * R(_), -2, 2) : 0));
                m.stroke(), m.fillStyle = "hsl(" + l.clamp(25 + 95 * P, 0, 120) + ",100%,60%)", m.fillRect(w, C - 7, 4, 4), m.font = "12px Arial", m.textBaseline = "middle", m.textAlign = "right", m.fillStyle = "#eee", m.fillText(I, w + y, C - 5);
              }, t.constraints = function(m, w) {
                for (var C = w, y = 0; y < m.length; y++) {
                  var T = m[y];
                  if (!(!T.render.visible || !T.pointA || !T.pointB)) {
                    var S = T.bodyA, I = T.bodyB, P, R;
                    if (S ? P = g.add(S.position, T.pointA) : P = T.pointA, T.render.type === "pin")
                      C.beginPath(), C.arc(P.x, P.y, 3, 0, 2 * Math.PI), C.closePath();
                    else {
                      if (I ? R = g.add(I.position, T.pointB) : R = T.pointB, C.beginPath(), C.moveTo(P.x, P.y), T.render.type === "spring")
                        for (var _ = g.sub(R, P), H = g.perp(g.normalise(_)), U = Math.ceil(l.clamp(T.length / 5, 12, 20)), k, G = 1; G < U; G += 1)
                          k = G % 2 === 0 ? 1 : -1, C.lineTo(
                            P.x + _.x * (G / U) + H.x * k * 4,
                            P.y + _.y * (G / U) + H.y * k * 4
                          );
                      C.lineTo(R.x, R.y);
                    }
                    T.render.lineWidth && (C.lineWidth = T.render.lineWidth, C.strokeStyle = T.render.strokeStyle, C.stroke()), T.render.anchors && (C.fillStyle = T.render.strokeStyle, C.beginPath(), C.arc(P.x, P.y, 3, 0, 2 * Math.PI), C.arc(R.x, R.y, 3, 0, 2 * Math.PI), C.closePath(), C.fill());
                  }
                }
              }, t.bodies = function(m, w, C) {
                var y = C;
                m.engine;
                var T = m.options, S = T.showInternalEdges || !T.wireframes, I, P, R, _;
                for (R = 0; R < w.length; R++)
                  if (I = w[R], !!I.render.visible) {
                    for (_ = I.parts.length > 1 ? 1 : 0; _ < I.parts.length; _++)
                      if (P = I.parts[_], !!P.render.visible) {
                        if (T.showSleeping && I.isSleeping ? y.globalAlpha = 0.5 * P.render.opacity : P.render.opacity !== 1 && (y.globalAlpha = P.render.opacity), P.render.sprite && P.render.sprite.texture && !T.wireframes) {
                          var H = P.render.sprite, U = b(m, H.texture);
                          y.translate(P.position.x, P.position.y), y.rotate(P.angle), y.drawImage(
                            U,
                            U.width * -H.xOffset * H.xScale,
                            U.height * -H.yOffset * H.yScale,
                            U.width * H.xScale,
                            U.height * H.yScale
                          ), y.rotate(-P.angle), y.translate(-P.position.x, -P.position.y);
                        } else {
                          if (P.circleRadius)
                            y.beginPath(), y.arc(P.position.x, P.position.y, P.circleRadius, 0, 2 * Math.PI);
                          else {
                            y.beginPath(), y.moveTo(P.vertices[0].x, P.vertices[0].y);
                            for (var k = 1; k < P.vertices.length; k++)
                              !P.vertices[k - 1].isInternal || S ? y.lineTo(P.vertices[k].x, P.vertices[k].y) : y.moveTo(P.vertices[k].x, P.vertices[k].y), P.vertices[k].isInternal && !S && y.moveTo(P.vertices[(k + 1) % P.vertices.length].x, P.vertices[(k + 1) % P.vertices.length].y);
                            y.lineTo(P.vertices[0].x, P.vertices[0].y), y.closePath();
                          }
                          T.wireframes ? (y.lineWidth = 1, y.strokeStyle = m.options.wireframeStrokeStyle, y.stroke()) : (y.fillStyle = P.render.fillStyle, P.render.lineWidth && (y.lineWidth = P.render.lineWidth, y.strokeStyle = P.render.strokeStyle, y.stroke()), y.fill());
                        }
                        y.globalAlpha = 1;
                      }
                  }
              }, t.bodyWireframes = function(m, w, C) {
                var y = C, T = m.options.showInternalEdges, S, I, P, R, _;
                for (y.beginPath(), P = 0; P < w.length; P++)
                  if (S = w[P], !!S.render.visible)
                    for (_ = S.parts.length > 1 ? 1 : 0; _ < S.parts.length; _++) {
                      for (I = S.parts[_], y.moveTo(I.vertices[0].x, I.vertices[0].y), R = 1; R < I.vertices.length; R++)
                        !I.vertices[R - 1].isInternal || T ? y.lineTo(I.vertices[R].x, I.vertices[R].y) : y.moveTo(I.vertices[R].x, I.vertices[R].y), I.vertices[R].isInternal && !T && y.moveTo(I.vertices[(R + 1) % I.vertices.length].x, I.vertices[(R + 1) % I.vertices.length].y);
                      y.lineTo(I.vertices[0].x, I.vertices[0].y);
                    }
                y.lineWidth = 1, y.strokeStyle = m.options.wireframeStrokeStyle, y.stroke();
              }, t.bodyConvexHulls = function(m, w, C) {
                var y = C, T, S, I;
                for (y.beginPath(), S = 0; S < w.length; S++)
                  if (T = w[S], !(!T.render.visible || T.parts.length === 1)) {
                    for (y.moveTo(T.vertices[0].x, T.vertices[0].y), I = 1; I < T.vertices.length; I++)
                      y.lineTo(T.vertices[I].x, T.vertices[I].y);
                    y.lineTo(T.vertices[0].x, T.vertices[0].y);
                  }
                y.lineWidth = 1, y.strokeStyle = "rgba(255,255,255,0.2)", y.stroke();
              }, t.vertexNumbers = function(m, w, C) {
                var y = C, T, S, I;
                for (T = 0; T < w.length; T++) {
                  var P = w[T].parts;
                  for (I = P.length > 1 ? 1 : 0; I < P.length; I++) {
                    var R = P[I];
                    for (S = 0; S < R.vertices.length; S++)
                      y.fillStyle = "rgba(255,255,255,0.2)", y.fillText(T + "_" + S, R.position.x + (R.vertices[S].x - R.position.x) * 0.8, R.position.y + (R.vertices[S].y - R.position.y) * 0.8);
                  }
                }
              }, t.mousePosition = function(m, w, C) {
                var y = C;
                y.fillStyle = "rgba(255,255,255,0.8)", y.fillText(w.position.x + "  " + w.position.y, w.position.x + 5, w.position.y - 5);
              }, t.bodyBounds = function(m, w, C) {
                var y = C;
                m.engine;
                var T = m.options;
                y.beginPath();
                for (var S = 0; S < w.length; S++) {
                  var I = w[S];
                  if (I.render.visible)
                    for (var P = w[S].parts, R = P.length > 1 ? 1 : 0; R < P.length; R++) {
                      var _ = P[R];
                      y.rect(_.bounds.min.x, _.bounds.min.y, _.bounds.max.x - _.bounds.min.x, _.bounds.max.y - _.bounds.min.y);
                    }
                }
                T.wireframes ? y.strokeStyle = "rgba(255,255,255,0.08)" : y.strokeStyle = "rgba(0,0,0,0.1)", y.lineWidth = 1, y.stroke();
              }, t.bodyAxes = function(m, w, C) {
                var y = C;
                m.engine;
                var T = m.options, S, I, P, R;
                for (y.beginPath(), I = 0; I < w.length; I++) {
                  var _ = w[I], H = _.parts;
                  if (_.render.visible)
                    if (T.showAxes)
                      for (P = H.length > 1 ? 1 : 0; P < H.length; P++)
                        for (S = H[P], R = 0; R < S.axes.length; R++) {
                          var U = S.axes[R];
                          y.moveTo(S.position.x, S.position.y), y.lineTo(S.position.x + U.x * 20, S.position.y + U.y * 20);
                        }
                    else
                      for (P = H.length > 1 ? 1 : 0; P < H.length; P++)
                        for (S = H[P], R = 0; R < S.axes.length; R++)
                          y.moveTo(S.position.x, S.position.y), y.lineTo(
                            (S.vertices[0].x + S.vertices[S.vertices.length - 1].x) / 2,
                            (S.vertices[0].y + S.vertices[S.vertices.length - 1].y) / 2
                          );
                }
                T.wireframes ? (y.strokeStyle = "indianred", y.lineWidth = 1) : (y.strokeStyle = "rgba(255, 255, 255, 0.4)", y.globalCompositeOperation = "overlay", y.lineWidth = 2), y.stroke(), y.globalCompositeOperation = "source-over";
              }, t.bodyPositions = function(m, w, C) {
                var y = C;
                m.engine;
                var T = m.options, S, I, P, R;
                for (y.beginPath(), P = 0; P < w.length; P++)
                  if (S = w[P], !!S.render.visible)
                    for (R = 0; R < S.parts.length; R++)
                      I = S.parts[R], y.arc(I.position.x, I.position.y, 3, 0, 2 * Math.PI, !1), y.closePath();
                for (T.wireframes ? y.fillStyle = "indianred" : y.fillStyle = "rgba(0,0,0,0.5)", y.fill(), y.beginPath(), P = 0; P < w.length; P++)
                  S = w[P], S.render.visible && (y.arc(S.positionPrev.x, S.positionPrev.y, 2, 0, 2 * Math.PI, !1), y.closePath());
                y.fillStyle = "rgba(255,165,0,0.8)", y.fill();
              }, t.bodyVelocity = function(m, w, C) {
                var y = C;
                y.beginPath();
                for (var T = 0; T < w.length; T++) {
                  var S = w[T];
                  if (S.render.visible) {
                    var I = o.getVelocity(S);
                    y.moveTo(S.position.x, S.position.y), y.lineTo(S.position.x + I.x, S.position.y + I.y);
                  }
                }
                y.lineWidth = 3, y.strokeStyle = "cornflowerblue", y.stroke();
              }, t.bodyIds = function(m, w, C) {
                var y = C, T, S;
                for (T = 0; T < w.length; T++)
                  if (w[T].render.visible) {
                    var I = w[T].parts;
                    for (S = I.length > 1 ? 1 : 0; S < I.length; S++) {
                      var P = I[S];
                      y.font = "12px Arial", y.fillStyle = "rgba(255,255,255,0.5)", y.fillText(P.id, P.position.x + 10, P.position.y - 10);
                    }
                  }
              }, t.collisions = function(m, w, C) {
                var y = C, T = m.options, S, I, P, R;
                for (y.beginPath(), P = 0; P < w.length; P++)
                  if (S = w[P], !!S.isActive)
                    for (I = S.collision, R = 0; R < S.contactCount; R++) {
                      var _ = S.contacts[R], H = _.vertex;
                      y.rect(H.x - 1.5, H.y - 1.5, 3.5, 3.5);
                    }
                for (T.wireframes ? y.fillStyle = "rgba(255,255,255,0.7)" : y.fillStyle = "orange", y.fill(), y.beginPath(), P = 0; P < w.length; P++)
                  if (S = w[P], !!S.isActive && (I = S.collision, S.contactCount > 0)) {
                    var U = S.contacts[0].vertex.x, k = S.contacts[0].vertex.y;
                    S.contactCount === 2 && (U = (S.contacts[0].vertex.x + S.contacts[1].vertex.x) / 2, k = (S.contacts[0].vertex.y + S.contacts[1].vertex.y) / 2), I.bodyB === I.supports[0].body || I.bodyA.isStatic === !0 ? y.moveTo(U - I.normal.x * 8, k - I.normal.y * 8) : y.moveTo(U + I.normal.x * 8, k + I.normal.y * 8), y.lineTo(U, k);
                  }
                T.wireframes ? y.strokeStyle = "rgba(255,165,0,0.7)" : y.strokeStyle = "orange", y.lineWidth = 1, y.stroke();
              }, t.separations = function(m, w, C) {
                var y = C, T = m.options, S, I, P, R, _;
                for (y.beginPath(), _ = 0; _ < w.length; _++)
                  if (S = w[_], !!S.isActive) {
                    I = S.collision, P = I.bodyA, R = I.bodyB;
                    var H = 1;
                    !R.isStatic && !P.isStatic && (H = 0.5), R.isStatic && (H = 0), y.moveTo(R.position.x, R.position.y), y.lineTo(R.position.x - I.penetration.x * H, R.position.y - I.penetration.y * H), H = 1, !R.isStatic && !P.isStatic && (H = 0.5), P.isStatic && (H = 0), y.moveTo(P.position.x, P.position.y), y.lineTo(P.position.x + I.penetration.x * H, P.position.y + I.penetration.y * H);
                  }
                T.wireframes ? y.strokeStyle = "rgba(255,165,0,0.5)" : y.strokeStyle = "orange", y.stroke();
              }, t.inspector = function(m, w) {
                m.engine;
                var C = m.selected, y = m.render, T = y.options, S;
                if (T.hasBounds) {
                  var I = y.bounds.max.x - y.bounds.min.x, P = y.bounds.max.y - y.bounds.min.y, R = I / y.options.width, _ = P / y.options.height;
                  w.scale(1 / R, 1 / _), w.translate(-y.bounds.min.x, -y.bounds.min.y);
                }
                for (var H = 0; H < C.length; H++) {
                  var U = C[H].data;
                  switch (w.translate(0.5, 0.5), w.lineWidth = 1, w.strokeStyle = "rgba(255,165,0,0.9)", w.setLineDash([1, 2]), U.type) {
                    case "body":
                      S = U.bounds, w.beginPath(), w.rect(
                        Math.floor(S.min.x - 3),
                        Math.floor(S.min.y - 3),
                        Math.floor(S.max.x - S.min.x + 6),
                        Math.floor(S.max.y - S.min.y + 6)
                      ), w.closePath(), w.stroke();
                      break;
                    case "constraint":
                      var k = U.pointA;
                      U.bodyA && (k = U.pointB), w.beginPath(), w.arc(k.x, k.y, 10, 0, 2 * Math.PI), w.closePath(), w.stroke();
                      break;
                  }
                  w.setLineDash([]), w.translate(-0.5, -0.5);
                }
                m.selectStart !== null && (w.translate(0.5, 0.5), w.lineWidth = 1, w.strokeStyle = "rgba(255,165,0,0.6)", w.fillStyle = "rgba(255,165,0,0.1)", S = m.selectBounds, w.beginPath(), w.rect(
                  Math.floor(S.min.x),
                  Math.floor(S.min.y),
                  Math.floor(S.max.x - S.min.x),
                  Math.floor(S.max.y - S.min.y)
                ), w.closePath(), w.stroke(), w.fill(), w.translate(-0.5, -0.5)), T.hasBounds && w.setTransform(1, 0, 0, 1, 0, 0);
              };
              var d = function(m, w) {
                var C = m.engine, y = m.timing, T = y.historySize, S = C.timing.timestamp;
                y.delta = w - y.lastTime || t._goodDelta, y.lastTime = w, y.timestampElapsed = S - y.lastTimestamp || 0, y.lastTimestamp = S, y.deltaHistory.unshift(y.delta), y.deltaHistory.length = Math.min(y.deltaHistory.length, T), y.engineDeltaHistory.unshift(C.timing.lastDelta), y.engineDeltaHistory.length = Math.min(y.engineDeltaHistory.length, T), y.timestampElapsedHistory.unshift(y.timestampElapsed), y.timestampElapsedHistory.length = Math.min(y.timestampElapsedHistory.length, T), y.engineUpdatesHistory.unshift(C.timing.lastUpdatesPerFrame), y.engineUpdatesHistory.length = Math.min(y.engineUpdatesHistory.length, T), y.engineElapsedHistory.unshift(C.timing.lastElapsed), y.engineElapsedHistory.length = Math.min(y.engineElapsedHistory.length, T), y.elapsedHistory.unshift(y.lastElapsed), y.elapsedHistory.length = Math.min(y.elapsedHistory.length, T);
              }, v = function(m) {
                for (var w = 0, C = 0; C < m.length; C += 1)
                  w += m[C];
                return w / m.length || 0;
              }, x = function(m, w) {
                var C = document.createElement("canvas");
                return C.width = m, C.height = w, C.oncontextmenu = function() {
                  return !1;
                }, C.onselectstart = function() {
                  return !1;
                }, C;
              }, M = function(m) {
                var w = m.getContext("2d"), C = window.devicePixelRatio || 1, y = w.webkitBackingStorePixelRatio || w.mozBackingStorePixelRatio || w.msBackingStorePixelRatio || w.oBackingStorePixelRatio || w.backingStorePixelRatio || 1;
                return C / y;
              }, b = function(m, w) {
                var C = m.textures[w];
                return C || (C = m.textures[w] = new Image(), C.src = w, C);
              }, E = function(m, w) {
                var C = w;
                /(jpg|gif|png)$/.test(w) && (C = "url(" + w + ")"), m.canvas.style.background = C, m.canvas.style.backgroundSize = "contain", m.currentBackground = w;
              };
            })();
          }),
          /* 27 */
          /***/
          (function(i, c, s) {
            var t = {};
            i.exports = t;
            var o = s(5), l = s(17), f = s(0);
            (function() {
              t._maxFrameDelta = 1e3 / 15, t._frameDeltaFallback = 1e3 / 60, t._timeBufferMargin = 1.5, t._elapsedNextEstimate = 1, t._smoothingLowerBound = 0.1, t._smoothingUpperBound = 0.9, t.create = function(a) {
                var g = {
                  delta: 16.666666666666668,
                  frameDelta: null,
                  frameDeltaSmoothing: !0,
                  frameDeltaSnapping: !0,
                  frameDeltaHistory: [],
                  frameDeltaHistorySize: 100,
                  frameRequestId: null,
                  timeBuffer: 0,
                  timeLastTick: null,
                  maxUpdates: null,
                  maxFrameTime: 33.333333333333336,
                  lastUpdatesDeferred: 0,
                  enabled: !0
                }, h = f.extend(g, a);
                return h.fps = 0, h;
              }, t.run = function(a, g) {
                return a.timeBuffer = t._frameDeltaFallback, (function h(r) {
                  a.frameRequestId = t._onNextFrame(a, h), r && a.enabled && t.tick(a, g, r);
                })(), a;
              }, t.tick = function(a, g, h) {
                var r = f.now(), u = a.delta, d = 0, v = h - a.timeLastTick;
                if ((!v || !a.timeLastTick || v > Math.max(t._maxFrameDelta, a.maxFrameTime)) && (v = a.frameDelta || t._frameDeltaFallback), a.frameDeltaSmoothing) {
                  a.frameDeltaHistory.push(v), a.frameDeltaHistory = a.frameDeltaHistory.slice(-a.frameDeltaHistorySize);
                  var x = a.frameDeltaHistory.slice(0).sort(), M = a.frameDeltaHistory.slice(
                    x.length * t._smoothingLowerBound,
                    x.length * t._smoothingUpperBound
                  ), b = p(M);
                  v = b || v;
                }
                a.frameDeltaSnapping && (v = 1e3 / Math.round(1e3 / v)), a.frameDelta = v, a.timeLastTick = h, a.timeBuffer += a.frameDelta, a.timeBuffer = f.clamp(
                  a.timeBuffer,
                  0,
                  a.frameDelta + u * t._timeBufferMargin
                ), a.lastUpdatesDeferred = 0;
                var E = a.maxUpdates || Math.ceil(a.maxFrameTime / u), m = {
                  timestamp: g.timing.timestamp
                };
                o.trigger(a, "beforeTick", m), o.trigger(a, "tick", m);
                for (var w = f.now(); u > 0 && a.timeBuffer >= u * t._timeBufferMargin; ) {
                  o.trigger(a, "beforeUpdate", m), l.update(g, u), o.trigger(a, "afterUpdate", m), a.timeBuffer -= u, d += 1;
                  var C = f.now() - r, y = f.now() - w, T = C + t._elapsedNextEstimate * y / d;
                  if (d >= E || T > a.maxFrameTime) {
                    a.lastUpdatesDeferred = Math.round(Math.max(0, a.timeBuffer / u - t._timeBufferMargin));
                    break;
                  }
                }
                g.timing.lastUpdatesPerFrame = d, o.trigger(a, "afterTick", m), a.frameDeltaHistory.length >= 100 && (a.lastUpdatesDeferred && Math.round(a.frameDelta / u) > E ? f.warnOnce("Matter.Runner: runner reached runner.maxUpdates, see docs.") : a.lastUpdatesDeferred && f.warnOnce("Matter.Runner: runner reached runner.maxFrameTime, see docs."), typeof a.isFixed < "u" && f.warnOnce("Matter.Runner: runner.isFixed is now redundant, see docs."), (a.deltaMin || a.deltaMax) && f.warnOnce("Matter.Runner: runner.deltaMin and runner.deltaMax were removed, see docs."), a.fps !== 0 && f.warnOnce("Matter.Runner: runner.fps was replaced by runner.delta, see docs."));
              }, t.stop = function(a) {
                t._cancelNextFrame(a);
              }, t._onNextFrame = function(a, g) {
                if (typeof window < "u" && window.requestAnimationFrame)
                  a.frameRequestId = window.requestAnimationFrame(g);
                else
                  throw new Error("Matter.Runner: missing required global window.requestAnimationFrame.");
                return a.frameRequestId;
              }, t._cancelNextFrame = function(a) {
                if (typeof window < "u" && window.cancelAnimationFrame)
                  window.cancelAnimationFrame(a.frameRequestId);
                else
                  throw new Error("Matter.Runner: missing required global window.cancelAnimationFrame.");
              };
              var p = function(a) {
                for (var g = 0, h = a.length, r = 0; r < h; r += 1)
                  g += a[r];
                return g / h || 0;
              };
            })();
          }),
          /* 28 */
          /***/
          (function(i, c, s) {
            var t = {};
            i.exports = t;
            var o = s(8), l = s(0), f = l.deprecated;
            (function() {
              t.collides = function(p, a) {
                return o.collides(p, a);
              }, f(t, "collides", "SAT.collides ➤ replaced by Collision.collides");
            })();
          }),
          /* 29 */
          /***/
          (function(i, c, s) {
            var t = {};
            i.exports = t, s(1);
            var o = s(0);
            (function() {
              t.pathToVertices = function(l, f) {
                typeof window < "u" && !("SVGPathSeg" in window) && o.warn("Svg.pathToVertices: SVGPathSeg not defined, a polyfill is required.");
                var p, a, g, h, r, u, d, v, x, M, b = [], E, m, w = 0, C = 0, y = 0;
                f = f || 15;
                var T = function(I, P, R) {
                  var _ = R % 2 === 1 && R > 1;
                  if (!x || I != x.x || P != x.y) {
                    x && _ ? (E = x.x, m = x.y) : (E = 0, m = 0);
                    var H = {
                      x: E + I,
                      y: m + P
                    };
                    (_ || !x) && (x = H), b.push(H), C = E + I, y = m + P;
                  }
                }, S = function(I) {
                  var P = I.pathSegTypeAsLetter.toUpperCase();
                  if (P !== "Z") {
                    switch (P) {
                      case "M":
                      case "L":
                      case "T":
                      case "C":
                      case "S":
                      case "Q":
                        C = I.x, y = I.y;
                        break;
                      case "H":
                        C = I.x;
                        break;
                      case "V":
                        y = I.y;
                        break;
                    }
                    T(C, y, I.pathSegType);
                  }
                };
                for (t._svgPathToAbsolute(l), g = l.getTotalLength(), u = [], p = 0; p < l.pathSegList.numberOfItems; p += 1)
                  u.push(l.pathSegList.getItem(p));
                for (d = u.concat(); w < g; ) {
                  if (M = l.getPathSegAtLength(w), r = u[M], r != v) {
                    for (; d.length && d[0] != r; )
                      S(d.shift());
                    v = r;
                  }
                  switch (r.pathSegTypeAsLetter.toUpperCase()) {
                    case "C":
                    case "T":
                    case "S":
                    case "Q":
                    case "A":
                      h = l.getPointAtLength(w), T(h.x, h.y, 0);
                      break;
                  }
                  w += f;
                }
                for (p = 0, a = d.length; p < a; ++p)
                  S(d[p]);
                return b;
              }, t._svgPathToAbsolute = function(l) {
                for (var f, p, a, g, h, r, u = l.pathSegList, d = 0, v = 0, x = u.numberOfItems, M = 0; M < x; ++M) {
                  var b = u.getItem(M), E = b.pathSegTypeAsLetter;
                  if (/[MLHVCSQTA]/.test(E))
                    "x" in b && (d = b.x), "y" in b && (v = b.y);
                  else
                    switch ("x1" in b && (a = d + b.x1), "x2" in b && (h = d + b.x2), "y1" in b && (g = v + b.y1), "y2" in b && (r = v + b.y2), "x" in b && (d += b.x), "y" in b && (v += b.y), E) {
                      case "m":
                        u.replaceItem(l.createSVGPathSegMovetoAbs(d, v), M);
                        break;
                      case "l":
                        u.replaceItem(l.createSVGPathSegLinetoAbs(d, v), M);
                        break;
                      case "h":
                        u.replaceItem(l.createSVGPathSegLinetoHorizontalAbs(d), M);
                        break;
                      case "v":
                        u.replaceItem(l.createSVGPathSegLinetoVerticalAbs(v), M);
                        break;
                      case "c":
                        u.replaceItem(l.createSVGPathSegCurvetoCubicAbs(d, v, a, g, h, r), M);
                        break;
                      case "s":
                        u.replaceItem(l.createSVGPathSegCurvetoCubicSmoothAbs(d, v, h, r), M);
                        break;
                      case "q":
                        u.replaceItem(l.createSVGPathSegCurvetoQuadraticAbs(d, v, a, g), M);
                        break;
                      case "t":
                        u.replaceItem(l.createSVGPathSegCurvetoQuadraticSmoothAbs(d, v), M);
                        break;
                      case "a":
                        u.replaceItem(l.createSVGPathSegArcAbs(d, v, b.r1, b.r2, b.angle, b.largeArcFlag, b.sweepFlag), M);
                        break;
                      case "z":
                      case "Z":
                        d = f, v = p;
                        break;
                    }
                  (E == "M" || E == "m") && (f = d, p = v);
                }
              };
            })();
          }),
          /* 30 */
          /***/
          (function(i, c, s) {
            var t = {};
            i.exports = t;
            var o = s(6);
            s(0), (function() {
              t.create = o.create, t.add = o.add, t.remove = o.remove, t.clear = o.clear, t.addComposite = o.addComposite, t.addBody = o.addBody, t.addConstraint = o.addConstraint;
            })();
          })
          /******/
        ])
      );
    });
  })(wn)), wn.exports;
}
var hl = dl();
const ne = /* @__PURE__ */ cl(hl), ui = 290, pl = 320, Lr = 30, Xn = /* @__PURE__ */ new Map(), gl = (e) => Xn.has(e) ? Promise.resolve(Xn.get(e)) : new Promise((n, i) => {
  const c = new Image();
  c.src = e, c.onload = () => {
    const s = { width: c.naturalWidth, height: c.naturalHeight };
    Xn.set(e, s), n(s);
  }, c.onerror = i;
}), ms = ["#FFD700", "#FFA500", "#FF6347", "#4CAF50", "#2196F3", "#9C27B0"], vl = () => ms[Math.floor(Math.random() * ms.length)], Or = (e) => ({
  isStatic: !0,
  render: { fillStyle: e ? vl() : "transparent" }
}), xs = (e, n) => {
  const c = Or(!1);
  return [
    // Floor
    ne.Bodies.rectangle(e / 2, n + 50 / 2, e * 2, 50, c),
    // Left wall
    ne.Bodies.rectangle(-50 / 2, n / 2, 50, n * 2, c),
    // Right wall
    ne.Bodies.rectangle(e + 50 / 2, n / 2, 50, n * 2, c)
  ];
}, ys = (e, n, i = !1, c = 1) => {
  const s = () => Or(i), t = ui / 2 * c, o = 20 * c, l = Lr * c, f = pl * c;
  return [
    // Thread walls (top narrow part)
    ne.Bodies.rectangle(
      e - t + l,
      n - t - 10 * c,
      o,
      50 * c,
      s()
    ),
    ne.Bodies.rectangle(
      e + t - l,
      n - t - 10 * c,
      o,
      50 * c,
      s()
    ),
    // Upper angled walls
    ne.Bodies.rectangle(
      e - t + 15 * c,
      n - t + 25 * c,
      o,
      50 * c,
      { ...s(), angle: Math.PI / 4 }
    ),
    ne.Bodies.rectangle(
      e + t - 15 * c,
      n - t + 25 * c,
      o,
      50 * c,
      { ...s(), angle: -Math.PI / 4 }
    ),
    // Mid walls (main body)
    ne.Bodies.rectangle(
      e - t,
      n + 25 * c,
      o,
      f - 50 * c,
      s()
    ),
    ne.Bodies.rectangle(
      e + t,
      n + 25 * c,
      o,
      f - 50 * c,
      s()
    ),
    // Lower angled walls
    ne.Bodies.rectangle(
      e - t + 15 * c,
      n + f / 2 + 15 * c,
      o,
      50 * c,
      { ...s(), angle: -Math.PI / 4 }
    ),
    ne.Bodies.rectangle(
      e + t - 15 * c,
      n + f / 2 + 15 * c,
      o,
      50 * c,
      { ...s(), angle: Math.PI / 4 }
    ),
    // Bottom wall (thicker)
    ne.Bodies.rectangle(
      e,
      n + f / 2 + 45 * c,
      (ui - 25) * c,
      o * 2,
      s()
    )
  ];
}, ml = (e, n, i = 1) => {
  const c = ui / 2 * i, s = Lr * i, t = e - c + s, o = e + c - s, l = n - c - 200 * i;
  return { left: t, right: o, top: l, width: o - t };
}, xl = (e, n, i, c, s = 1) => {
  const t = c ?? 16 + Math.random() * 15, o = ml(e, n, s), l = t + 5, f = o.width - l * 2, p = o.left + l + Math.random() * f, a = o.top - t, g = ne.Bodies.circle(p, a, t, {
    restitution: 0.2,
    friction: 0.2,
    frictionStatic: 1,
    density: 15e-4,
    sleepThreshold: 45,
    render: {
      sprite: {
        texture: i,
        xScale: 1,
        yScale: 1
      }
    }
  });
  return gl(i).then(({ width: h }) => {
    const u = t * 2.5 / h;
    g.render.sprite.xScale = u, g.render.sprite.yScale = u;
  }), g;
}, yl = /* @__PURE__ */ cn({
  __name: "JarCanvas",
  props: {
    xOffset: {},
    yOffset: {},
    scale: {},
    giftScale: {}
  },
  setup(e, { expose: n }) {
    const i = e, c = pe(null);
    let s = null, t = null, o = null, l = [], f = [], p = window.innerWidth, a = window.innerHeight;
    const g = () => ({
      x: p / 2 + i.xOffset,
      y: a / 2 + i.yOffset
    }), h = (b, E) => {
      if (!s) return;
      const m = g(), w = r(E) * i.scale * i.giftScale, C = xl(m.x, m.y, b, w, i.scale);
      ne.World.add(s.world, C);
    };
    function r(b) {
      const S = (b - 1) / 99999, I = Math.pow(S, 0.6);
      return 11 + 89 * Math.tanh(I * 8);
    }
    const u = () => {
      if (!s || !t) return;
      p = window.innerWidth, a = window.innerHeight;
      const b = g();
      t.canvas.width = p, t.canvas.height = a, t.options.width = p, t.options.height = a, ne.World.remove(s.world, l), ne.World.remove(s.world, f), l = xs(p, a), f = ys(b.x, b.y, !1, i.scale), ne.World.add(s.world, l), ne.World.add(s.world, f), M();
    };
    Rt(
      () => [i.xOffset, i.yOffset, i.scale],
      () => {
        s && u();
      }
    );
    const d = () => {
      if (!c.value) return;
      p = window.innerWidth, a = window.innerHeight;
      const b = g();
      s = ne.Engine.create({
        positionIterations: 12,
        velocityIterations: 10,
        constraintIterations: 4,
        enableSleeping: !0
      }), t = ne.Render.create({
        element: c.value,
        engine: s,
        options: {
          width: p,
          height: a,
          wireframes: !1,
          background: "transparent",
          showSleeping: !1
        }
      }), l = xs(p, a), f = ys(b.x, b.y, !1, i.scale), ne.World.add(s.world, l), ne.World.add(s.world, f), o = ne.Runner.create({ delta: 1e3 / 60 }), ne.Runner.run(o, s), ne.Render.run(t), window.addEventListener("resize", u);
    }, v = () => {
      window.removeEventListener("resize", u), t && (ne.Render.stop(t), t.canvas?.parentNode?.removeChild(t.canvas), t = null), o && (ne.Runner.stop(o), o = null), s && (ne.World.clear(s.world, !1), ne.Engine.clear(s), s = null), l = [], f = [];
    };
    un(async () => {
      await Js(), d();
    }), Dt(v);
    const x = () => {
      v(), d();
    }, M = () => {
      if (!s) return;
      const b = ne.Composite.allBodies(s.world);
      for (const E of b)
        E.isSleeping && ne.Sleeping.set(E, !1);
    };
    return n({
      spawnGift: h,
      resetJar: x,
      wakeAllBodies: M
    }), (b, E) => (Ae(), Ne(
      "div",
      {
        ref_key: "containerRef",
        ref: c,
        class: "coin-jar-canvas"
      },
      null,
      512
      /* NEED_PATCH */
    ));
  }
}), Ri = (e, n) => {
  const i = e.__vccOpts || e;
  for (const [c, s] of n)
    i[c] = s;
  return i;
}, wl = /* @__PURE__ */ Ri(yl, [["__scopeId", "data-v-0206bf39"]]), Sl = { class: "absolute gap-2 flex items-center text-white flex-col top-[470px]" }, Cl = {
  key: 0,
  class: "bg-[#282828CC] px-2.5 py-1.5 rounded-[27px] justify-between items-center flex gap-2 w-[320px] relative overflow-hidden"
}, Pl = { class: "flex items-center gap-2 min-w-0 flex-1" }, Ml = ["src"], Tl = {
  key: 1,
  class: "text-sm font-bold w-6 text-center shrink-0"
}, bl = ["src"], Al = { class: "truncate min-w-0" }, El = { class: "bg-white/10 px-2.5 py-1.5 rounded-[27px] flex items-center gap-2 text-[#FFDD31] font-bold shrink-0" }, Il = ["src"], Bl = {
  key: 0,
  class: "w-full h-[2px] bg-white/16 absolute bottom-0 left-0"
}, Rl = {
  key: 1,
  class: "bg-[#282828CC] px-2.5 py-1.5 rounded-[20px] flex items-center gap-2 text-[#FFDD31] font-bold"
}, Fl = ["src"], Dl = /* @__PURE__ */ cn({
  __name: "GiftStats",
  props: {
    entry: {},
    showLeaderboard: { type: Boolean },
    coinsCollected: {},
    duration: {},
    rank: {},
    totalEntries: {},
    displayFormat: {},
    showRankBadge: { type: Boolean },
    showTotalCoins: { type: Boolean }
  },
  setup(e) {
    const n = e, i = pe(0), c = tt(() => n.totalEntries > 1), s = tt(() => n.displayFormat === "avatarNameCoins"), t = tt(() => {
      if (!n.showRankBadge) return null;
      switch (n.rank) {
        case 1:
          return lt.widget.coinMatch.first;
        case 2:
          return lt.widget.coinMatch.second;
        case 3:
          return lt.widget.coinMatch.third;
        default:
          return null;
      }
    }), o = tt(() => !n.showRankBadge || n.rank <= 3 ? null : `${n.rank}.`);
    return Rt(
      () => [n.entry?.username, n.duration, n.showLeaderboard],
      () => {
        c.value && (i.value += 1);
      }
    ), (l, f) => (Ae(), Ne("div", Sl, [
      e.showLeaderboard ? (Ae(), Ne("div", Cl, [
        fe("div", Pl, [
          De(" Rank badge or text "),
          t.value ? (Ae(), Ne("img", {
            key: 0,
            src: t.value,
            alt: "Rank",
            class: "w-6 h-6 shrink-0"
          }, null, 8, Ml)) : o.value ? (Ae(), Ne(
            "span",
            Tl,
            qe(o.value),
            1
            /* TEXT */
          )) : De("v-if", !0),
          De(" Avatar (conditional based on displayFormat) "),
          s.value ? (Ae(), Ne("img", {
            key: 2,
            src: e.entry?.profilePictureUrl,
            alt: "Avatar",
            class: "w-9.5 h-9.5 rounded-full shrink-0"
          }, null, 8, bl)) : De("v-if", !0),
          De(" Username with ellipsis "),
          fe(
            "span",
            Al,
            qe(e.entry?.username),
            1
            /* TEXT */
          )
        ]),
        fe("div", El, [
          fe("img", {
            src: ae(lt).widget.coinMatch.coin,
            alt: "Coin",
            class: "size-5"
          }, null, 8, Il),
          fe(
            "span",
            null,
            qe(e.entry?.totalCoins),
            1
            /* TEXT */
          )
        ]),
        De(" Progress bar only when multiple entries "),
        c.value ? (Ae(), Ne("div", Bl, [
          (Ae(), Ne(
            "div",
            {
              key: i.value,
              class: "h-full bg-[#D43555] jar-progress",
              style: Nt({ animationDuration: `${n.duration}s` })
            },
            null,
            4
            /* STYLE */
          ))
        ])) : De("v-if", !0)
      ])) : De("v-if", !0),
      e.showTotalCoins ? (Ae(), Ne("div", Rl, [
        fe("img", {
          src: ae(lt).widget.coinMatch.coin,
          alt: "Coin",
          class: "size-5"
        }, null, 8, Fl),
        qt(
          " " + qe(e.coinsCollected),
          1
          /* TEXT */
        )
      ])) : De("v-if", !0)
    ]));
  }
}), Ll = /* @__PURE__ */ Ri(Dl, [["__scopeId", "data-v-9500c571"]]), Ol = {
  key: 0,
  class: "donation-alert absolute bottom-[260px] right-[280px] gap-2 flex items-center text-white flex-col"
}, _l = { class: "donation-alert-card" }, Hl = { class: "flex items-center gap-2" }, $l = ["src"], Vl = { class: "shrink-0" }, kl = ["src"], Nl = { class: "font-bold shrink-0" }, Wl = { class: "text-[#FFDD31]" }, Ul = /* @__PURE__ */ cn({
  __name: "GiftAlert",
  props: {
    gift: {},
    show: { type: Boolean }
  },
  setup(e) {
    return (n, i) => (Ae(), $n($a, { name: "donation-alert" }, {
      default: qs(() => [
        e.gift && e.show ? (Ae(), Ne("div", Ol, [
          fe("div", _l, [
            fe("div", Hl, [
              fe("img", {
                src: e.gift.profilePictureUrl,
                alt: "Avatar",
                class: "w-9.5 h-9.5 rounded-full shrink-0"
              }, null, 8, $l),
              fe("span", Vl, [
                fe(
                  "b",
                  null,
                  qe(e.gift.username),
                  1
                  /* TEXT */
                ),
                i[0] || (i[0] = qt(
                  " donated ",
                  -1
                  /* CACHED */
                ))
              ]),
              fe("img", {
                src: e.gift.giftPictureUrl,
                alt: "Gift",
                class: "w-6 h-6 shrink-0"
              }, null, 8, kl),
              fe("span", Nl, [
                qt(
                  qe(e.gift.giftName) + " " + qe(e.gift.repeatCount > 1 ? ` x${e.gift.repeatCount} ` : "") + " (",
                  1
                  /* TEXT */
                ),
                fe(
                  "span",
                  Wl,
                  qe(e.gift.value * e.gift.repeatCount) + " " + qe(e.gift.value * e.gift.repeatCount !== 1 ? "Coins" : "Coin"),
                  1
                  /* TEXT */
                ),
                i[1] || (i[1] = qt(
                  ") ",
                  -1
                  /* CACHED */
                ))
              ])
            ])
          ]),
          i[2] || (i[2] = fe(
            "svg",
            {
              class: "absolute -bottom-[20px] right-4",
              xmlns: "http://www.w3.org/2000/svg",
              width: "36",
              height: "20",
              viewBox: "0 0 36 20",
              fill: "none"
            },
            [
              fe("path", {
                d: "M33 19.5C18.6 19.5 9 14 0 0H31.5C14 0 43 19.5 33 19.5Z",
                fill: "#282828",
                "fill-opacity": "0.8"
              })
            ],
            -1
            /* CACHED */
          ))
        ])) : De("v-if", !0)
      ]),
      _: 1
      /* STABLE */
    }));
  }
}), jl = /* @__PURE__ */ Ri(Ul, [["__scopeId", "data-v-0c2bc7da"]]), Ve = (e) => {
  const n = window.settings;
  if (n) {
    if (typeof n.get == "function") {
      const i = n.get(e);
      if (i != null) return i;
    }
    return n[e];
  }
}, ws = {
  top3: 3,
  top5: 5,
  top10: 10
};
function Gl() {
  const e = pe(0), n = pe(0), i = pe(1), c = pe(1), s = pe(5), t = pe("avatarNameCoins"), o = pe(!0), l = pe(5), f = pe(5), p = pe(!0), a = pe(!0), g = pe(!0);
  return {
    // Transform
    xOffset: e,
    yOffset: n,
    scale: i,
    giftScale: c,
    // Leaderboard
    leaderboardSize: s,
    leaderboardDisplayFormat: t,
    displayRankBadges: o,
    leaderboardDuration: l,
    showLeaderboardSetting: p,
    // Coin display
    showTotalCoins: a,
    // Alert
    alertDuration: f,
    showAlert: g,
    // Actions
    loadSettings: () => {
      e.value = parseFloat(Ve("coinjar_xOffset") || "0"), n.value = parseFloat(Ve("coinjar_yOffset") || "0"), i.value = parseFloat(Ve("coinjar_scale") || "1"), c.value = parseFloat(Ve("coinjar_giftScale") || "1");
      const r = Ve("coinjar_numberOfRanks");
      r && ws[r] && (s.value = ws[r]);
      const u = Ve("coinjar_leaderboardDisplayFormat");
      u && (t.value = u), o.value = !!Ve("coinjar_displayRankBadges"), p.value = !!Ve("coinjar_displayLeaderboard"), a.value = !!Ve("coinjar_showTotalCoins"), g.value = !!Ve("coinjar_displayAlert");
      const d = Number(Ve("coinjar_leaderboardDuration"));
      d > 0 && (l.value = d);
      const v = Number(Ve("coinjar_alertDuration"));
      v > 0 && (f.value = v);
    }
  };
}
function Kl(e, n) {
  const i = pe([]), c = pe(0);
  let s = null;
  const t = tt(
    () => i.value[c.value] ?? null
  ), o = tt(() => !!t.value), l = tt(() => c.value + 1), f = tt(() => i.value.length), p = () => {
    i.value.length <= 1 || (c.value = (c.value + 1) % i.value.length);
  }, a = () => {
    s !== null && (window.clearInterval(s), s = null);
  }, g = () => {
    a(), !(i.value.length <= 1) && (s = window.setInterval(
      p,
      n.value * 1e3
    ));
  }, h = (u) => {
    const d = u.value * u.repeatCount;
    if (d === 0) return;
    const v = i.value.find(
      (x) => x.username === u.username
    );
    v ? v.totalCoins += d : i.value.push({
      username: u.username,
      profilePictureUrl: u.profilePictureUrl,
      totalCoins: d
    }), i.value.sort((x, M) => M.totalCoins - x.totalCoins), i.value.length > e.value && (i.value.length = e.value), c.value >= i.value.length && (c.value = 0), s === null && i.value.length > 1 && g();
  }, r = () => {
    i.value = [], c.value = 0, a();
  };
  return Rt(
    () => n.value,
    () => {
      g();
    }
  ), Rt(
    () => e.value,
    () => {
      i.value.length > e.value && (i.value.length = e.value);
    }
  ), Dt(() => {
    a();
  }), {
    leaderboard: i,
    currentEntry: t,
    currentRank: l,
    totalEntries: f,
    isVisible: o,
    updateLeaderboard: h,
    reset: r,
    stopRotation: a
  };
}
function zl(e) {
  const n = pe(null), i = pe(!1);
  let c = null;
  const s = () => {
    c !== null && (window.clearTimeout(c), c = null);
  }, t = () => {
    n.value && (i.value = !0, s(), c = window.setTimeout(() => {
      i.value = !1;
    }, e.value * 1e3));
  }, o = (f) => {
    n.value = f, t();
  }, l = () => {
    n.value = null, i.value = !1, s();
  };
  return Dt(() => {
    s();
  }), {
    currentGift: n,
    showCurrentGift: i,
    setGift: o,
    reset: l,
    clearTimers: s
  };
}
const Ss = 200;
function Jl(e, n) {
  const i = pe([]);
  let c = null, s = 0;
  const t = () => document.visibilityState === "visible", o = () => {
    if (!t() || i.value.length === 0) return;
    const h = performance.now();
    if (h - s < Ss) return;
    const r = i.value.shift();
    r && (n(r.value), e(r.giftPictureUrl, r.value), s = h);
  }, l = () => {
    c === null && (c = window.setInterval(o, Ss));
  }, f = () => {
    c !== null && (window.clearInterval(c), c = null);
  }, p = () => {
    t() ? l() : f();
  }, a = (h) => {
    for (let r = 0; r < h.repeatCount; r++)
      i.value.push(h);
  }, g = () => {
    i.value = [], s = 0;
  };
  return un(() => {
    document.addEventListener("visibilitychange", p), t() && l();
  }), Dt(() => {
    f(), document.removeEventListener("visibilitychange", p);
  }), {
    giftQueue: i,
    addGift: a,
    reset: g,
    stopProcessing: f
  };
}
const Ql = { class: "w-screen h-screen overflow-hidden" }, Zl = {
  class: "fixed inset-0 flex items-center justify-center pointer-events-none",
  style: { "z-index": "0" }
}, Yl = ["src"], Xl = ["src"], ql = ["src"], ef = {
  class: "fixed inset-0 flex items-center justify-center pointer-events-none flex-col",
  style: { "z-index": "2" }
}, tf = ["src"], nf = /* @__PURE__ */ cn({
  __name: "CoinJar",
  setup(e) {
    const n = pe(null), i = pe(0), c = () => {
      n.value?.wakeAllBodies();
    }, s = Gl(), t = Kl(
      s.leaderboardSize,
      s.leaderboardDuration
    ), o = zl(s.alertDuration), l = Jl(
      (p, a) => {
        n.value?.spawnGift(p, a);
      },
      (p) => {
        i.value += p;
      }
    ), f = tt(
      () => s.showLeaderboardSetting.value && t.isVisible.value
    );
    return window.addGift = (p) => {
      o.setGift(p), t.updateLeaderboard(p), l.addGift(p);
    }, window.resetJar = () => {
      l.reset(), i.value = 0, o.reset(), t.reset(), n.value?.resetJar();
    }, window.updateSettings = (p) => {
      p && s.loadSettings();
    }, un(() => {
      s.loadSettings(), window.addEventListener("resize", c);
    }), Dt(() => {
      window.removeEventListener("resize", c), l.stopProcessing(), t.stopRotation(), o.clearTimers();
    }), (p, a) => (Ae(), Ne("div", Ql, [
      De(" Background layer: jarTopBg + jarBottom (behind canvas) "),
      fe("div", Zl, [
        fe(
          "div",
          {
            class: "relative origin-center",
            style: Nt({
              transform: `translate(${ae(s).xOffset.value}px, ${ae(s).yOffset.value}px) scale(${ae(s).scale.value})`
            })
          },
          [
            fe("img", {
              src: ae(lt).widget.coinJar.jarTopBg,
              alt: "Jar Top Background",
              class: "absolute left-1/2 -translate-x-1/2 top-[45px] w-auto h-auto"
            }, null, 8, Yl),
            fe("img", {
              src: ae(lt).widget.coinJar.jarTop,
              alt: "Jar Top (invisible placeholder for sizing)",
              class: "invisible w-auto h-auto"
            }, null, 8, Xl),
            fe("img", {
              src: ae(lt).widget.coinJar.jarBottom,
              alt: "Jar Bottom",
              class: "absolute left-1/2 -translate-x-1/2 bottom-[63px] w-auto h-auto"
            }, null, 8, ql)
          ],
          4
          /* STYLE */
        )
      ]),
      De(" Canvas layer (middle) "),
      Re(wl, {
        ref_key: "jarCanvasRef",
        ref: n,
        class: "fixed inset-0 z-1",
        "x-offset": ae(s).xOffset.value,
        "y-offset": ae(s).yOffset.value,
        scale: ae(s).scale.value,
        "gift-scale": ae(s).giftScale.value
      }, null, 8, ["x-offset", "y-offset", "scale", "gift-scale"]),
      De(" Foreground layer: jarTop (in front of canvas) "),
      fe("div", ef, [
        fe(
          "div",
          {
            class: "relative origin-center flex flex-col items-center",
            style: Nt({
              transform: `translate(${ae(s).xOffset.value}px, ${ae(s).yOffset.value}px) scale(${ae(s).scale.value})`
            })
          },
          [
            fe("img", {
              src: ae(lt).widget.coinJar.jarTop,
              alt: "Jar Top",
              class: "w-auto h-auto"
            }, null, 8, tf),
            ae(s).showAlert.value ? (Ae(), $n(jl, {
              key: 0,
              gift: ae(o).currentGift.value,
              show: ae(o).showCurrentGift.value
            }, null, 8, ["gift", "show"])) : De("v-if", !0),
            Re(Ll, {
              entry: ae(t).currentEntry.value,
              "show-leaderboard": f.value,
              "coins-collected": i.value,
              duration: ae(s).leaderboardDuration.value,
              rank: ae(t).currentRank.value,
              "total-entries": ae(t).totalEntries.value,
              "display-format": ae(s).leaderboardDisplayFormat.value,
              "show-rank-badge": ae(s).displayRankBadges.value,
              "show-total-coins": ae(s).showTotalCoins.value
            }, null, 8, ["entry", "show-leaderboard", "coins-collected", "duration", "rank", "total-entries", "display-format", "show-rank-badge", "show-total-coins"])
          ],
          4
          /* STYLE */
        )
      ])
    ]));
  }
}), sf = /* @__PURE__ */ cn({
  __name: "App",
  setup(e) {
    return (n, i) => (Ae(), $n(nf));
  }
}), rf = sf;
function _r(e) {
  return al(rf, e);
}
function of(e, n) {
  const i = _r(n);
  return i.mount(e), i;
}
window.createCoinJar = _r;
window.mountCoinJar = of;
export {
  _r as createCoinJar,
  rf as default,
  of as mountCoinJar
};
