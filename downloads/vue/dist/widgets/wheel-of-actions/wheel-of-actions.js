(function(){var s=document.createElement("style");s.id="vue-widget-wheel-of-actions-styles";if(!document.getElementById(s.id)){s.textContent="@layer properties{@supports ((-webkit-hyphens:none) and (not (margin-trim:inline))) or ((-moz-orient:inline) and (not (color:rgb(from red r g b)))){*,:before,:after,::backdrop{--tw-translate-x:0;--tw-translate-y:0;--tw-translate-z:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scale-z:1;--tw-rotate-x:initial;--tw-rotate-y:initial;--tw-rotate-z:initial;--tw-skew-x:initial;--tw-skew-y:initial;--tw-space-y-reverse:0;--tw-divide-y-reverse:0;--tw-border-style:solid;--tw-gradient-position:initial;--tw-gradient-from:#0000;--tw-gradient-via:#0000;--tw-gradient-to:#0000;--tw-gradient-stops:initial;--tw-gradient-via-stops:initial;--tw-gradient-from-position:0%;--tw-gradient-via-position:50%;--tw-gradient-to-position:100%;--tw-leading:initial;--tw-font-weight:initial;--tw-ordinal:initial;--tw-slashed-zero:initial;--tw-numeric-figure:initial;--tw-numeric-spacing:initial;--tw-numeric-fraction:initial;--tw-shadow:0 0 #0000;--tw-shadow-color:initial;--tw-shadow-alpha:100%;--tw-inset-shadow:0 0 #0000;--tw-inset-shadow-color:initial;--tw-inset-shadow-alpha:100%;--tw-ring-color:initial;--tw-ring-shadow:0 0 #0000;--tw-inset-ring-color:initial;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-inset:initial;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-outline-style:solid;--tw-blur:initial;--tw-brightness:initial;--tw-contrast:initial;--tw-grayscale:initial;--tw-hue-rotate:initial;--tw-invert:initial;--tw-opacity:initial;--tw-saturate:initial;--tw-sepia:initial;--tw-drop-shadow:initial;--tw-drop-shadow-color:initial;--tw-drop-shadow-alpha:100%;--tw-drop-shadow-size:initial;--tw-backdrop-blur:initial;--tw-backdrop-brightness:initial;--tw-backdrop-contrast:initial;--tw-backdrop-grayscale:initial;--tw-backdrop-hue-rotate:initial;--tw-backdrop-invert:initial;--tw-backdrop-opacity:initial;--tw-backdrop-saturate:initial;--tw-backdrop-sepia:initial;--tw-duration:initial;--tw-ease:initial;--tw-text-shadow-color:initial;--tw-text-shadow-alpha:100%}}}@layer theme{:root,:host{--font-sans:ui-sans-serif,system-ui,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\",\"Noto Color Emoji\";--font-mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,\"Liberation Mono\",\"Courier New\",monospace;--color-yellow-300:oklch(90.5% .182 98.111);--color-gray-500:oklch(55.1% .027 264.364);--color-black:#000;--color-white:#fff;--spacing:.25rem;--container-xs:20rem;--container-xl:36rem;--container-2xl:42rem;--text-xs:.75rem;--text-xs--line-height:calc(1/.75);--text-sm:.875rem;--text-sm--line-height:calc(1.25/.875);--text-base:1rem;--text-base--line-height: 1.5 ;--text-lg:1.125rem;--text-lg--line-height:calc(1.75/1.125);--text-xl:1.25rem;--text-xl--line-height:calc(1.75/1.25);--text-2xl:1.5rem;--text-2xl--line-height:calc(2/1.5);--text-3xl:1.875rem;--text-3xl--line-height: 1.2 ;--text-4xl:2.25rem;--text-4xl--line-height:calc(2.5/2.25);--text-5xl:3rem;--text-5xl--line-height:1;--text-7xl:4.5rem;--text-7xl--line-height:1;--font-weight-normal:400;--font-weight-medium:500;--font-weight-semibold:600;--font-weight-bold:700;--font-weight-extrabold:800;--leading-normal:1.5;--radius-sm:.25rem;--radius-md:.375rem;--radius-lg:.5rem;--radius-xl:.75rem;--radius-2xl:1rem;--drop-shadow-md:0 3px 3px #0000001f;--ease-in:cubic-bezier(.4,0,1,1);--ease-out:cubic-bezier(0,0,.2,1);--ease-in-out:cubic-bezier(.4,0,.2,1);--animate-pulse:pulse 2s cubic-bezier(.4,0,.6,1)infinite;--blur-md:12px;--blur-lg:16px;--default-transition-duration:.15s;--default-transition-timing-function:cubic-bezier(.4,0,.2,1);--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono)}}@layer base{*,:after,:before,::backdrop{box-sizing:border-box;border:0 solid;margin:0;padding:0}::-webkit-file-upload-button{box-sizing:border-box;border:0 solid;margin:0;padding:0}::file-selector-button{box-sizing:border-box;border:0 solid;margin:0;padding:0}html,:host{-webkit-text-size-adjust:100%;tab-size:4;line-height:1.5;font-family:var(--default-font-family,ui-sans-serif,system-ui,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\",\"Noto Color Emoji\");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);-webkit-tap-highlight-color:transparent}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:var(--default-mono-font-family,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,\"Liberation Mono\",\"Courier New\",monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-variation-settings:var(--default-mono-font-variation-settings,normal);font-size:1em}small{font-size:80%}sub,sup{vertical-align:baseline;font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}:-moz-focusring{outline:auto}progress{vertical-align:baseline}summary{display:list-item}ol,ul,menu{list-style:none}img,svg,video,canvas,audio,iframe,embed,object{vertical-align:middle;display:block}img,video{max-width:100%;height:auto}button,input,select,optgroup,textarea{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}::-webkit-file-upload-button{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}::file-selector-button{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{-webkit-padding-start:20px;padding-inline-start:20px}::-webkit-file-upload-button{-webkit-margin-end:4px;margin-inline-end:4px}::file-selector-button{-webkit-margin-end:4px;margin-inline-end:4px}::-webkit-input-placeholder{opacity:1}::placeholder{opacity:1}@supports (not (-webkit-appearance:-apple-pay-button)) or (contain-intrinsic-size:1px){::-webkit-input-placeholder{color:currentColor}::placeholder{color:currentColor}@supports (color:color-mix(in lab,red,red)){::-webkit-input-placeholder{color:color-mix(in oklab,currentcolor 50%,transparent)}::placeholder{color:color-mix(in oklab,currentcolor 50%,transparent)}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit{padding-block:0}::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-datetime-edit-month-field{padding-block:0}::-webkit-datetime-edit-day-field{padding-block:0}::-webkit-datetime-edit-hour-field{padding-block:0}::-webkit-datetime-edit-minute-field{padding-block:0}::-webkit-datetime-edit-second-field{padding-block:0}::-webkit-datetime-edit-millisecond-field{padding-block:0}::-webkit-datetime-edit-meridiem-field{padding-block:0}::-webkit-calendar-picker-indicator{line-height:1}:-moz-ui-invalid{box-shadow:none}button,input:where([type=button],[type=reset],[type=submit]){-webkit-appearance:button;appearance:button}::-webkit-file-upload-button{-webkit-appearance:button;appearance:button}::file-selector-button{-webkit-appearance:button;appearance:button}::-webkit-inner-spin-button{height:auto}::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}}@layer components;@layer utilities{.pointer-events-auto{pointer-events:auto}.pointer-events-none{pointer-events:none}.collapse{visibility:collapse}.invisible{visibility:hidden}.visible{visibility:visible}.visible\\!{visibility:visible!important}.sr-only{-webkit-clip-path:inset(50%);clip-path:inset(50%);white-space:nowrap;border-width:0;width:1px;height:1px;margin:-1px;padding:0;position:absolute;overflow:hidden}.absolute{position:absolute}.fixed{position:fixed}.fixed\\!{position:fixed!important}.relative{position:relative}.static{position:static}.sticky{position:-webkit-sticky;position:sticky}.inset-0{inset:calc(var(--spacing)*0)}.-top-1{top:calc(var(--spacing)*-1)}.-top-2{top:calc(var(--spacing)*-2)}.-top-7{top:calc(var(--spacing)*-7)}.top-0{top:calc(var(--spacing)*0)}.top-0\\.5{top:calc(var(--spacing)*.5)}.top-1{top:calc(var(--spacing)*1)}.top-1\\/2{top:50%}.top-6{top:calc(var(--spacing)*6)}.top-6\\.5{top:calc(var(--spacing)*6.5)}.top-8{top:calc(var(--spacing)*8)}.top-10{top:calc(var(--spacing)*10)}.top-24{top:calc(var(--spacing)*24)}.top-48{top:calc(var(--spacing)*48)}.top-\\[45px\\]{top:45px}.top-\\[470px\\]{top:470px}.top-\\[calc\\(50\\%-75px\\)\\]{top:calc(50% - 75px)}.top-\\[calc\\(100\\%\\+8px\\)\\]{top:calc(100% + 8px)}.top-\\[calc\\(100\\%-12px\\)\\]{top:calc(100% - 12px)}.top-full{top:100%}.-right-5{right:calc(var(--spacing)*-5)}.-right-6{right:calc(var(--spacing)*-6)}.-right-6\\.5{right:calc(var(--spacing)*-6.5)}.-right-8{right:calc(var(--spacing)*-8)}.right-0{right:calc(var(--spacing)*0)}.right-0\\.5{right:calc(var(--spacing)*.5)}.right-4{right:calc(var(--spacing)*4)}.right-8{right:calc(var(--spacing)*8)}.right-\\[280px\\]{right:280px}.right-full{right:100%}.-bottom-8{bottom:calc(var(--spacing)*-8)}.-bottom-20{bottom:calc(var(--spacing)*-20)}.-bottom-36{bottom:calc(var(--spacing)*-36)}.-bottom-\\[20px\\]{bottom:-20px}.-bottom-px{bottom:-1px}.bottom-0{bottom:calc(var(--spacing)*0)}.bottom-4{bottom:calc(var(--spacing)*4)}.bottom-\\[63px\\]{bottom:63px}.bottom-\\[260px\\]{bottom:260px}.bottom-full{bottom:100%}.-left-1{left:calc(var(--spacing)*-1)}.-left-4{left:calc(var(--spacing)*-4)}.left-0{left:calc(var(--spacing)*0)}.left-1{left:calc(var(--spacing)*1)}.left-1\\.5{left:calc(var(--spacing)*1.5)}.left-1\\/2{left:50%}.left-6{left:calc(var(--spacing)*6)}.left-6\\.5{left:calc(var(--spacing)*6.5)}.left-8{left:calc(var(--spacing)*8)}.left-\\[-12px\\]{left:-12px}.left-\\[calc\\(100\\%\\+0\\.5rem\\)\\]{left:calc(100% + .5rem)}.left-\\[calc\\(100\\%-12px\\)\\]{left:calc(100% - 12px)}.left-full{left:100%}.-z-1{z-index:-1}.-z-2{z-index:-2}.z-0{z-index:0}.z-1{z-index:1}.z-2{z-index:2}.z-3{z-index:3}.z-4{z-index:4}.z-5{z-index:5}.z-10{z-index:10}.z-\\[9999\\]{z-index:9999}.col-span-1{grid-column:span 1/span 1}.col-span-2{grid-column:span 2/span 2}.col-span-3{grid-column:span 3/span 3}.col-start-2{grid-column-start:2}.col-start-3{grid-column-start:3}.col-start-4{grid-column-start:4}.container{width:100%}@media (min-width:40rem){.container{max-width:40rem}}@media (min-width:48rem){.container{max-width:48rem}}@media (min-width:64rem){.container{max-width:64rem}}@media (min-width:80rem){.container{max-width:80rem}}@media (min-width:96rem){.container{max-width:96rem}}.mx-10{margin-inline:calc(var(--spacing)*10)}.mx-auto{margin-inline:auto}.my-0{margin-block:calc(var(--spacing)*0)}.my-0\\!{margin-block:calc(var(--spacing)*0)!important}.my-3{margin-block:calc(var(--spacing)*3)}.my-3\\.5{margin-block:calc(var(--spacing)*3.5)}.my-12{margin-block:calc(var(--spacing)*12)}.-mt-0{margin-top:calc(var(--spacing)*0)}.-mt-0\\.5{margin-top:calc(var(--spacing)*-.5)}.-mt-2{margin-top:calc(var(--spacing)*-2)}.-mt-8{margin-top:calc(var(--spacing)*-8)}.-mt-12{margin-top:calc(var(--spacing)*-12)}.-mt-16{margin-top:calc(var(--spacing)*-16)}.-mt-px{margin-top:-1px}.mt-1{margin-top:calc(var(--spacing)*1)}.mt-1\\.5{margin-top:calc(var(--spacing)*1.5)}.mt-2{margin-top:calc(var(--spacing)*2)}.mt-3{margin-top:calc(var(--spacing)*3)}.mt-4{margin-top:calc(var(--spacing)*4)}.mt-6{margin-top:calc(var(--spacing)*6)}.mt-8{margin-top:calc(var(--spacing)*8)}.mt-16{margin-top:calc(var(--spacing)*16)}.mr-1{margin-right:calc(var(--spacing)*1)}.mr-1\\.5{margin-right:calc(var(--spacing)*1.5)}.mr-2{margin-right:calc(var(--spacing)*2)}.mr-3{margin-right:calc(var(--spacing)*3)}.mr-4{margin-right:calc(var(--spacing)*4)}.mb-1{margin-bottom:calc(var(--spacing)*1)}.mb-1\\.5{margin-bottom:calc(var(--spacing)*1.5)}.mb-2{margin-bottom:calc(var(--spacing)*2)}.mb-3{margin-bottom:calc(var(--spacing)*3)}.mb-4{margin-bottom:calc(var(--spacing)*4)}.mb-6{margin-bottom:calc(var(--spacing)*6)}.mb-8{margin-bottom:calc(var(--spacing)*8)}.mb-12{margin-bottom:calc(var(--spacing)*12)}.mb-12\\!{margin-bottom:calc(var(--spacing)*12)!important}.mb-16{margin-bottom:calc(var(--spacing)*16)}.mb-20{margin-bottom:calc(var(--spacing)*20)}.ml-1{margin-left:calc(var(--spacing)*1)}.ml-1\\.5{margin-left:calc(var(--spacing)*1.5)}.ml-2{margin-left:calc(var(--spacing)*2)}.ml-3{margin-left:calc(var(--spacing)*3)}.ml-4{margin-left:calc(var(--spacing)*4)}.ml-6{margin-left:calc(var(--spacing)*6)}.ml-8{margin-left:calc(var(--spacing)*8)}.ml-22{margin-left:calc(var(--spacing)*22)}.box-border{box-sizing:border-box}.\\!block{display:block!important}.block{display:block}.contents{display:contents}.flex{display:flex}.grid{display:grid}.hidden{display:none}.inline{display:inline}.inline-block{display:inline-block}.inline-flex{display:inline-flex}.table{display:table}.table-cell{display:table-cell}.table-row{display:table-row}.aspect-\\[16\\/9\\]{aspect-ratio:16/9}.size-2{width:calc(var(--spacing)*2);height:calc(var(--spacing)*2)}.size-3{width:calc(var(--spacing)*3);height:calc(var(--spacing)*3)}.size-4{width:calc(var(--spacing)*4);height:calc(var(--spacing)*4)}.size-5{width:calc(var(--spacing)*5);height:calc(var(--spacing)*5)}.size-6{width:calc(var(--spacing)*6);height:calc(var(--spacing)*6)}.size-8{width:calc(var(--spacing)*8);height:calc(var(--spacing)*8)}.size-10{width:calc(var(--spacing)*10);height:calc(var(--spacing)*10)}.size-11{width:calc(var(--spacing)*11);height:calc(var(--spacing)*11)}.size-12{width:calc(var(--spacing)*12);height:calc(var(--spacing)*12)}.size-16{width:calc(var(--spacing)*16);height:calc(var(--spacing)*16)}.size-36{width:calc(var(--spacing)*36);height:calc(var(--spacing)*36)}.size-64{width:calc(var(--spacing)*64);height:calc(var(--spacing)*64)}.size-76{width:calc(var(--spacing)*76);height:calc(var(--spacing)*76)}.size-fit{width:-webkit-fit-content;width:fit-content;height:-webkit-fit-content;height:fit-content}.size-full{width:100%;height:100%}.size-max{width:-webkit-max-content;width:max-content;height:-webkit-max-content;height:max-content}.h-0{height:calc(var(--spacing)*0)}.h-0\\.5{height:calc(var(--spacing)*.5)}.h-1{height:calc(var(--spacing)*1)}.h-1\\/2{height:50%}.h-2{height:calc(var(--spacing)*2)}.h-3{height:calc(var(--spacing)*3)}.h-4{height:calc(var(--spacing)*4)}.h-4\\.5{height:calc(var(--spacing)*4.5)}.h-5{height:calc(var(--spacing)*5)}.h-5\\.5{height:calc(var(--spacing)*5.5)}.h-6{height:calc(var(--spacing)*6)}.h-6\\.5{height:calc(var(--spacing)*6.5)}.h-8{height:calc(var(--spacing)*8)}.h-8\\.5{height:calc(var(--spacing)*8.5)}.h-9{height:calc(var(--spacing)*9)}.h-9\\.5{height:calc(var(--spacing)*9.5)}.h-10{height:calc(var(--spacing)*10)}.h-12{height:calc(var(--spacing)*12)}.h-12\\.5{height:calc(var(--spacing)*12.5)}.h-16{height:calc(var(--spacing)*16)}.h-20{height:calc(var(--spacing)*20)}.h-24{height:calc(var(--spacing)*24)}.h-48{height:calc(var(--spacing)*48)}.h-96{height:calc(var(--spacing)*96)}.h-\\[2px\\]{height:2px}.h-\\[3px\\]{height:3px}.h-\\[8vw\\]{height:8vw}.h-\\[10vw\\]{height:10vw}.h-\\[28px\\]{height:28px}.h-\\[85vh\\]{height:85vh}.h-\\[181px\\]{height:181px}.h-\\[275px\\]\\!{height:275px!important}.h-\\[300px\\]{height:300px}.h-\\[410px\\]{height:410px}.h-\\[440px\\]{height:440px}.h-\\[calc\\(100\\%-32px\\)\\]{height:calc(100% - 32px)}.h-\\[calc\\(100\\%-54px\\)\\]{height:calc(100% - 54px)}.h-auto{height:auto}.h-full{height:100%}.h-px{height:1px}.h-screen{height:100vh}.max-h-\\[70vh\\]{max-height:70vh}.max-h-\\[90\\%\\]{max-height:90%}.max-h-\\[650px\\]{max-height:650px}.max-h-\\[calc\\(100vh-260px\\)\\]{max-height:calc(100vh - 260px)}.max-h-full{max-height:100%}.min-h-48{min-height:calc(var(--spacing)*48)}.min-h-screen{min-height:100vh}.w-1{width:calc(var(--spacing)*1)}.w-1\\/2{width:50%}.w-1\\/3{width:33.3333%}.w-2{width:calc(var(--spacing)*2)}.w-2\\/3{width:66.6667%}.w-4{width:calc(var(--spacing)*4)}.w-4\\.5{width:calc(var(--spacing)*4.5)}.w-5{width:calc(var(--spacing)*5)}.w-6{width:calc(var(--spacing)*6)}.w-9{width:calc(var(--spacing)*9)}.w-9\\.5{width:calc(var(--spacing)*9.5)}.w-10{width:calc(var(--spacing)*10)}.w-12{width:calc(var(--spacing)*12)}.w-16{width:calc(var(--spacing)*16)}.w-32{width:calc(var(--spacing)*32)}.w-40{width:calc(var(--spacing)*40)}.w-56{width:calc(var(--spacing)*56)}.w-62{width:calc(var(--spacing)*62)}.w-62\\!{width:calc(var(--spacing)*62)!important}.w-64{width:calc(var(--spacing)*64)}.w-80{width:calc(var(--spacing)*80)}.w-96{width:calc(var(--spacing)*96)}.w-128{width:calc(var(--spacing)*128)}.w-280{width:calc(var(--spacing)*280)}.w-340{width:calc(var(--spacing)*340)}.w-\\[3\\.25rem\\]{width:3.25rem}.w-\\[3px\\]{width:3px}.w-\\[6px\\]{width:6px}.w-\\[45\\%\\]{width:45%}.w-\\[70\\%\\]{width:70%}.w-\\[256px\\]{width:256px}.w-\\[320px\\]{width:320px}.w-\\[660px\\]{width:660px}.w-\\[750px\\]{width:750px}.w-\\[calc\\(100\\%-2rem\\)\\]{width:calc(100% - 2rem)}.w-\\[calc\\(100\\%-32px\\)\\]{width:calc(100% - 32px)}.w-auto{width:auto}.w-fit{width:-webkit-fit-content;width:fit-content}.w-full{width:100%}.w-max{width:-webkit-max-content;width:max-content}.w-min{width:-webkit-min-content;width:min-content}.w-px{width:1px}.w-screen{width:100vw}.max-w-2xl{max-width:var(--container-2xl)}.max-w-14{max-width:calc(var(--spacing)*14)}.max-w-48{max-width:calc(var(--spacing)*48)}.max-w-80{max-width:calc(var(--spacing)*80)}.max-w-\\[33\\%\\]{max-width:33%}.max-w-\\[100px\\]{max-width:100px}.max-w-\\[120px\\]{max-width:120px}.max-w-\\[130px\\]{max-width:130px}.max-w-\\[400px\\]{max-width:400px}.max-w-\\[1920px\\]{max-width:1920px}.max-w-full{max-width:100%}.max-w-none{max-width:none}.max-w-xl{max-width:var(--container-xl)}.max-w-xs{max-width:var(--container-xs)}.min-w-0{min-width:calc(var(--spacing)*0)}.min-w-\\[220px\\]{min-width:220px}.min-w-screen{min-width:100vw}.flex-1{flex:1}.flex-3{flex:3}.flex-7{flex:7}.flex-none{flex:none}.flex-shrink{flex-shrink:1}.flex-shrink-0{flex-shrink:0}.shrink{flex-shrink:1}.shrink-0{flex-shrink:0}.flex-grow,.grow{flex-grow:1}.table-fixed{table-layout:fixed}.border-collapse{border-collapse:collapse}.origin-center{transform-origin:50%}.-translate-x-1{--tw-translate-x:calc(var(--spacing)*-1);translate:var(--tw-translate-x)var(--tw-translate-y)}.-translate-x-1\\/2{--tw-translate-x: -50% ;translate:var(--tw-translate-x)var(--tw-translate-y)}.-translate-x-2{--tw-translate-x:calc(var(--spacing)*-2);translate:var(--tw-translate-x)var(--tw-translate-y)}.translate-x-0{--tw-translate-x:calc(var(--spacing)*0);translate:var(--tw-translate-x)var(--tw-translate-y)}.translate-x-1{--tw-translate-x:calc(var(--spacing)*1);translate:var(--tw-translate-x)var(--tw-translate-y)}.translate-x-1\\/2{--tw-translate-x: 50% ;translate:var(--tw-translate-x)var(--tw-translate-y)}.-translate-y-1{--tw-translate-y:calc(var(--spacing)*-1);translate:var(--tw-translate-x)var(--tw-translate-y)}.-translate-y-1\\/2{--tw-translate-y: -50% ;translate:var(--tw-translate-x)var(--tw-translate-y)}.-translate-y-full{--tw-translate-y:-100%;translate:var(--tw-translate-x)var(--tw-translate-y)}.translate-y-0{--tw-translate-y:calc(var(--spacing)*0);translate:var(--tw-translate-x)var(--tw-translate-y)}.translate-y-1{--tw-translate-y:calc(var(--spacing)*1);translate:var(--tw-translate-x)var(--tw-translate-y)}.translate-y-1\\/2{--tw-translate-y: 50% ;translate:var(--tw-translate-x)var(--tw-translate-y)}.translate-y-9{--tw-translate-y:calc(var(--spacing)*9);translate:var(--tw-translate-x)var(--tw-translate-y)}.translate-y-18{--tw-translate-y:calc(var(--spacing)*18);translate:var(--tw-translate-x)var(--tw-translate-y)}.scale-95{--tw-scale-x:95%;--tw-scale-y:95%;--tw-scale-z:95%;scale:var(--tw-scale-x)var(--tw-scale-y)}.-rotate-90{rotate:-90deg}.rotate-45{rotate:45deg}.rotate-90{rotate:90deg}.rotate-180{rotate:180deg}.rotate-270{rotate:270deg}.transform{transform:var(--tw-rotate-x, )var(--tw-rotate-y, )var(--tw-rotate-z, )var(--tw-skew-x, )var(--tw-skew-y, )}.animate-pulse{animation:var(--animate-pulse)}.cursor-auto{cursor:auto}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.resize{resize:both}.list-disc{list-style-type:disc}.grid-cols-12{grid-template-columns:repeat(12,minmax(0,1fr))}.grid-cols-\\[4fr_3fr_4fr\\]{grid-template-columns:4fr 3fr 4fr}.grid-cols-\\[5fr_4fr_4fr_4fr\\]{grid-template-columns:5fr 4fr 4fr 4fr}.flex-col{flex-direction:column}.flex-row{flex-direction:row}.flex-wrap{flex-wrap:wrap}.items-center{align-items:center}.items-end{align-items:flex-end}.items-start{align-items:flex-start}.items-stretch{align-items:stretch}.justify-between{justify-content:space-between}.justify-center{justify-content:center}.justify-end{justify-content:flex-end}.justify-items-center{justify-items:center}.gap-0{gap:calc(var(--spacing)*0)}.gap-0\\.5{gap:calc(var(--spacing)*.5)}.gap-1{gap:calc(var(--spacing)*1)}.gap-1\\.5{gap:calc(var(--spacing)*1.5)}.gap-2{gap:calc(var(--spacing)*2)}.gap-2\\.5{gap:calc(var(--spacing)*2.5)}.gap-3{gap:calc(var(--spacing)*3)}.gap-3\\!{gap:calc(var(--spacing)*3)!important}.gap-4{gap:calc(var(--spacing)*4)}.gap-6{gap:calc(var(--spacing)*6)}.gap-8{gap:calc(var(--spacing)*8)}.gap-16{gap:calc(var(--spacing)*16)}:where(.space-y-1>:not(:last-child)){--tw-space-y-reverse:0;-webkit-margin-before:calc(calc(var(--spacing)*1)*var(--tw-space-y-reverse));margin-block-start:calc(calc(var(--spacing)*1)*var(--tw-space-y-reverse));-webkit-margin-after:calc(calc(var(--spacing)*1)*calc(1 - var(--tw-space-y-reverse)));margin-block-end:calc(calc(var(--spacing)*1)*calc(1 - var(--tw-space-y-reverse)))}.gap-x-2{column-gap:calc(var(--spacing)*2)}:where(.divide-y>:not(:last-child)){--tw-divide-y-reverse:0;border-bottom-style:var(--tw-border-style);border-top-style:var(--tw-border-style);border-top-width:calc(1px*var(--tw-divide-y-reverse));border-bottom-width:calc(1px*calc(1 - var(--tw-divide-y-reverse)))}:where(.divide-white>:not(:last-child)){border-color:var(--color-white)}:where(.divide-white\\/5>:not(:last-child)){border-color:#ffffff0d}@supports (color:color-mix(in lab,red,red)){:where(.divide-white\\/5>:not(:last-child)){border-color:color-mix(in oklab,var(--color-white)5%,transparent)}}.self-stretch{align-self:stretch}.justify-self-start{justify-self:flex-start}.truncate{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.overflow-auto{overflow:auto}.overflow-hidden{overflow:hidden}.overflow-visible{overflow:visible}.overflow-x-hidden{overflow-x:hidden}.overflow-y-auto{overflow-y:auto}.overscroll-contain{overscroll-behavior:contain}.rounded{border-radius:.25rem}.rounded-2xl{border-radius:var(--radius-2xl)}.rounded-\\[0\\.625rem\\]{border-radius:.625rem}.rounded-\\[8px\\]{border-radius:8px}.rounded-\\[10px\\]{border-radius:10px}.rounded-\\[14px\\]{border-radius:14px}.rounded-\\[20px\\]{border-radius:20px}.rounded-\\[27px\\]{border-radius:27px}.rounded-full{border-radius:3.40282e38px}.rounded-lg{border-radius:var(--radius-lg)}.rounded-md{border-radius:var(--radius-md)}.rounded-sm{border-radius:var(--radius-sm)}.rounded-xl{border-radius:var(--radius-xl)}.rounded-t-\\[16px\\]{border-top-left-radius:16px;border-top-right-radius:16px}.rounded-t-lg{border-top-left-radius:var(--radius-lg);border-top-right-radius:var(--radius-lg)}.rounded-r-\\[6px\\]{border-top-right-radius:6px;border-bottom-right-radius:6px}.rounded-b-\\[16px\\]{border-bottom-right-radius:16px;border-bottom-left-radius:16px}.rounded-b-lg{border-bottom-right-radius:var(--radius-lg);border-bottom-left-radius:var(--radius-lg)}.border{border-style:var(--tw-border-style);border-width:1px}.border-2{border-style:var(--tw-border-style);border-width:2px}.border-3{border-style:var(--tw-border-style);border-width:3px}.border-x{border-inline-style:var(--tw-border-style);border-inline-width:1px}.border-y-1{border-block-style:var(--tw-border-style);border-block-width:1px}.border-t{border-top-style:var(--tw-border-style);border-top-width:1px}.border-t-0{border-top-style:var(--tw-border-style);border-top-width:0}.border-r-0{border-right-style:var(--tw-border-style);border-right-width:0}.border-b{border-bottom-style:var(--tw-border-style);border-bottom-width:1px}.border-b-0{border-bottom-style:var(--tw-border-style);border-bottom-width:0}.border-l{border-left-style:var(--tw-border-style);border-left-width:1px}.border-l-0{border-left-style:var(--tw-border-style);border-left-width:0}.border-dashed{--tw-border-style:dashed;border-style:dashed}.border-none{--tw-border-style:none;border-style:none}.border-\\[\\#3AFF6866\\]{border-color:#3aff6866}.border-\\[\\#48363A\\]{border-color:#48363a}.border-\\[\\#F6C669\\]{border-color:#f6c669}.border-black{border-color:var(--color-black)}.border-black\\/10{border-color:#0000001a}@supports (color:color-mix(in lab,red,red)){.border-black\\/10{border-color:color-mix(in oklab,var(--color-black)10%,transparent)}}.border-white{border-color:var(--color-white)}.border-white\\/4{border-color:#ffffff0a}@supports (color:color-mix(in lab,red,red)){.border-white\\/4{border-color:color-mix(in oklab,var(--color-white)4%,transparent)}}.border-white\\/5{border-color:#ffffff0d}@supports (color:color-mix(in lab,red,red)){.border-white\\/5{border-color:color-mix(in oklab,var(--color-white)5%,transparent)}}.border-white\\/6{border-color:#ffffff0f}@supports (color:color-mix(in lab,red,red)){.border-white\\/6{border-color:color-mix(in oklab,var(--color-white)6%,transparent)}}.border-white\\/8{border-color:#ffffff14}@supports (color:color-mix(in lab,red,red)){.border-white\\/8{border-color:color-mix(in oklab,var(--color-white)8%,transparent)}}.border-white\\/10{border-color:#ffffff1a}@supports (color:color-mix(in lab,red,red)){.border-white\\/10{border-color:color-mix(in oklab,var(--color-white)10%,transparent)}}.border-white\\/20{border-color:#fff3}@supports (color:color-mix(in lab,red,red)){.border-white\\/20{border-color:color-mix(in oklab,var(--color-white)20%,transparent)}}.bg-\\[\\#2E1F22\\]{background-color:#2e1f22}.bg-\\[\\#3AFF68\\]{background-color:#3aff68}.bg-\\[\\#3AFF68\\]\\/10{background-color:#3aff681a}.bg-\\[\\#3AFF6866\\]{background-color:#3aff6866}.bg-\\[\\#3F3F3F\\]{background-color:#3f3f3f}.bg-\\[\\#222222\\]{background-color:#222}.bg-\\[\\#282828CC\\]{background-color:#282828cc}.bg-\\[\\#323232\\]{background-color:#323232}.bg-\\[\\#333333\\]{background-color:#333}.bg-\\[\\#C192374D\\]{background-color:#c192374d}.bg-\\[\\#D43555\\]{background-color:#d43555}.bg-\\[\\#F5C467\\]{background-color:#f5c467}.bg-\\[var\\(--bubble-bg\\)\\]{background-color:var(--bubble-bg)}.bg-black{background-color:var(--color-black)}.bg-black\\/30{background-color:#0000004d}@supports (color:color-mix(in lab,red,red)){.bg-black\\/30{background-color:color-mix(in oklab,var(--color-black)30%,transparent)}}.bg-transparent{background-color:#0000}.bg-white{background-color:var(--color-white)}.bg-white\\/4{background-color:#ffffff0a}@supports (color:color-mix(in lab,red,red)){.bg-white\\/4{background-color:color-mix(in oklab,var(--color-white)4%,transparent)}}.bg-white\\/6{background-color:#ffffff0f}@supports (color:color-mix(in lab,red,red)){.bg-white\\/6{background-color:color-mix(in oklab,var(--color-white)6%,transparent)}}.bg-white\\/8{background-color:#ffffff14}@supports (color:color-mix(in lab,red,red)){.bg-white\\/8{background-color:color-mix(in oklab,var(--color-white)8%,transparent)}}.bg-white\\/10{background-color:#ffffff1a}@supports (color:color-mix(in lab,red,red)){.bg-white\\/10{background-color:color-mix(in oklab,var(--color-white)10%,transparent)}}.bg-white\\/12{background-color:#ffffff1f}@supports (color:color-mix(in lab,red,red)){.bg-white\\/12{background-color:color-mix(in oklab,var(--color-white)12%,transparent)}}.bg-white\\/16{background-color:#ffffff29}@supports (color:color-mix(in lab,red,red)){.bg-white\\/16{background-color:color-mix(in oklab,var(--color-white)16%,transparent)}}.bg-white\\/20{background-color:#fff3}@supports (color:color-mix(in lab,red,red)){.bg-white\\/20{background-color:color-mix(in oklab,var(--color-white)20%,transparent)}}.bg-white\\/40{background-color:#fff6}@supports (color:color-mix(in lab,red,red)){.bg-white\\/40{background-color:color-mix(in oklab,var(--color-white)40%,transparent)}}.bg-linear-to-t{--tw-gradient-position:to top}@supports (background-image:linear-gradient(in lab,red,red)){.bg-linear-to-t{--tw-gradient-position:to top in oklab}}.bg-linear-to-t{background-image:linear-gradient(var(--tw-gradient-stops))}.bg-gradient-to-r{--tw-gradient-position:to right in oklab;background-image:linear-gradient(var(--tw-gradient-stops))}.bg-gradient-to-t{--tw-gradient-position:to top in oklab;background-image:linear-gradient(var(--tw-gradient-stops))}.bg-\\[linear-gradient\\(90deg\\,rgba\\(212\\,53\\,85\\,0\\.10\\)_0\\%\\,rgba\\(29\\,28\\,28\\,0\\.00\\)_100\\%\\)\\]{background-image:linear-gradient(90deg,#d435551a,#1d1c1c00)}.bg-\\[linear-gradient\\(92deg\\,rgba\\(212\\,53\\,85\\,0\\.14\\)_0\\%\\,rgba\\(48\\,46\\,46\\,0\\.00\\)_100\\%\\)\\]{background-image:linear-gradient(92deg,#d4355524,#302e2e00)}.bg-\\[linear-gradient\\(98deg\\,\\#D43555_-3\\.08\\%\\,\\#733435_70\\.62\\%\\)\\]{background-image:linear-gradient(98deg,#d43555 -3.08%,#733435 70.62%)}.bg-\\[linear-gradient\\(98deg\\,_var\\(--color-gradient-green-start\\)_-3\\.08\\%\\,_var\\(--color-gradient-green-end\\)_70\\.62\\%\\)\\]{background-image:linear-gradient(98deg,var(--color-gradient-green-start)-3.08%,var(--color-gradient-green-end)70.62%)}.bg-\\[linear-gradient\\(230deg\\,rgba\\(246\\,208\\,110\\,0\\.8\\)_0\\%\\,rgba\\(209\\,152\\,55\\,0\\.8\\)_100\\%\\)\\]{background-image:linear-gradient(230deg,#f6d06ecc,#d19837cc)}.bg-\\[linear-gradient\\(230deg\\,rgba\\(246\\,208\\,110\\,0\\.65\\)_0\\%\\,rgba\\(209\\,152\\,55\\,0\\.65\\)_100\\%\\)\\]{background-image:linear-gradient(230deg,#f6d06ea6,#d19837a6)}.bg-\\[linear-gradient\\(270deg\\,\\#343333_0\\%\\,rgba\\(52\\,51\\,51\\,0\\)_100\\%\\)\\]{background-image:linear-gradient(270deg,#343333,#34333300)}.bg-\\[radial-gradient\\(84\\.4\\%_78\\.16\\%_at_100\\%_0\\%\\,rgba\\(70\\,112\\,59\\,0\\.60\\)_0\\%\\,rgba\\(70\\,112\\,59\\,0\\.40\\)_25\\.18\\%\\,rgba\\(70\\,112\\,59\\,0\\)_100\\%\\)\\]{background-image:radial-gradient(84.4% 78.16% at 100% 0,#46703b99,#46703b66 25.18%,#46703b00)}.from-\\[\\#337E2D\\]{--tw-gradient-from:#337e2d;--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position),var(--tw-gradient-from)var(--tw-gradient-from-position),var(--tw-gradient-to)var(--tw-gradient-to-position))}.to-\\[\\#84EC6B\\]{--tw-gradient-to:#84ec6b;--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position),var(--tw-gradient-from)var(--tw-gradient-from-position),var(--tw-gradient-to)var(--tw-gradient-to-position))}.to-transparent{--tw-gradient-to:transparent;--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position),var(--tw-gradient-from)var(--tw-gradient-from-position),var(--tw-gradient-to)var(--tw-gradient-to-position))}.mask-repeat{-webkit-mask-repeat:repeat;mask-repeat:repeat}.object-contain{object-fit:contain}.object-cover{object-fit:cover}.p-1{padding:calc(var(--spacing)*1)}.p-1\\.5{padding:calc(var(--spacing)*1.5)}.p-2{padding:calc(var(--spacing)*2)}.p-2\\.5{padding:calc(var(--spacing)*2.5)}.p-3{padding:calc(var(--spacing)*3)}.p-4{padding:calc(var(--spacing)*4)}.p-4\\.5{padding:calc(var(--spacing)*4.5)}.p-6{padding:calc(var(--spacing)*6)}.p-8{padding:calc(var(--spacing)*8)}.px-0{padding-inline:calc(var(--spacing)*0)}.px-1{padding-inline:calc(var(--spacing)*1)}.px-1\\.5{padding-inline:calc(var(--spacing)*1.5)}.px-2{padding-inline:calc(var(--spacing)*2)}.px-2\\.5{padding-inline:calc(var(--spacing)*2.5)}.px-3{padding-inline:calc(var(--spacing)*3)}.px-3\\.5{padding-inline:calc(var(--spacing)*3.5)}.px-4{padding-inline:calc(var(--spacing)*4)}.px-4\\.5{padding-inline:calc(var(--spacing)*4.5)}.px-6{padding-inline:calc(var(--spacing)*6)}.px-8{padding-inline:calc(var(--spacing)*8)}.py-0{padding-block:calc(var(--spacing)*0)}.py-0\\.75{padding-block:calc(var(--spacing)*.75)}.py-1{padding-block:calc(var(--spacing)*1)}.py-1\\.5{padding-block:calc(var(--spacing)*1.5)}.py-2{padding-block:calc(var(--spacing)*2)}.py-2\\.5{padding-block:calc(var(--spacing)*2.5)}.py-3{padding-block:calc(var(--spacing)*3)}.py-3\\.5{padding-block:calc(var(--spacing)*3.5)}.py-4{padding-block:calc(var(--spacing)*4)}.py-5{padding-block:calc(var(--spacing)*5)}.py-8{padding-block:calc(var(--spacing)*8)}.py-10{padding-block:calc(var(--spacing)*10)}.py-12{padding-block:calc(var(--spacing)*12)}.py-16{padding-block:calc(var(--spacing)*16)}.pt-0{padding-top:calc(var(--spacing)*0)}.pt-0\\.5{padding-top:calc(var(--spacing)*.5)}.pt-1{padding-top:calc(var(--spacing)*1)}.pt-1\\.5{padding-top:calc(var(--spacing)*1.5)}.pt-2{padding-top:calc(var(--spacing)*2)}.pt-4{padding-top:calc(var(--spacing)*4)}.pt-6{padding-top:calc(var(--spacing)*6)}.pt-12{padding-top:calc(var(--spacing)*12)}.pt-24{padding-top:calc(var(--spacing)*24)}.pt-px{padding-top:1px}.pr-4{padding-right:calc(var(--spacing)*4)}.pr-8{padding-right:calc(var(--spacing)*8)}.pr-16{padding-right:calc(var(--spacing)*16)}.pr-\\[calc\\(2rem-5px\\)\\]{padding-right:calc(2rem - 5px)}.pb-0{padding-bottom:calc(var(--spacing)*0)}.pb-0\\.75{padding-bottom:calc(var(--spacing)*.75)}.pb-1{padding-bottom:calc(var(--spacing)*1)}.pb-2{padding-bottom:calc(var(--spacing)*2)}.pb-3{padding-bottom:calc(var(--spacing)*3)}.pb-4{padding-bottom:calc(var(--spacing)*4)}.pb-6{padding-bottom:calc(var(--spacing)*6)}.pb-6\\.5{padding-bottom:calc(var(--spacing)*6.5)}.pb-8{padding-bottom:calc(var(--spacing)*8)}.pb-16{padding-bottom:calc(var(--spacing)*16)}.pb-20{padding-bottom:calc(var(--spacing)*20)}.pl-2{padding-left:calc(var(--spacing)*2)}.pl-4{padding-left:calc(var(--spacing)*4)}.pl-8{padding-left:calc(var(--spacing)*8)}.pl-24{padding-left:calc(var(--spacing)*24)}.text-center{text-align:center}.text-end{text-align:end}.text-left{text-align:left}.text-start{text-align:start}.text-start\\!{text-align:start!important}.align-middle{vertical-align:middle}.text-2xl{font-size:var(--text-2xl);line-height:var(--tw-leading,var(--text-2xl--line-height))}.text-3xl{font-size:var(--text-3xl);line-height:var(--tw-leading,var(--text-3xl--line-height))}.text-4xl{font-size:var(--text-4xl);line-height:var(--tw-leading,var(--text-4xl--line-height))}.text-5xl{font-size:var(--text-5xl);line-height:var(--tw-leading,var(--text-5xl--line-height))}.text-7xl{font-size:var(--text-7xl);line-height:var(--tw-leading,var(--text-7xl--line-height))}.text-\\[2rem\\]\\/\\[45px\\]{font-size:2rem;line-height:45px}.text-base{font-size:var(--text-base);line-height:var(--tw-leading,var(--text-base--line-height))}.text-base\\/6{font-size:var(--text-base);line-height:calc(var(--spacing)*6)}.text-lg{font-size:var(--text-lg);line-height:var(--tw-leading,var(--text-lg--line-height))}.text-sm{font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height))}.text-sm\\/6{font-size:var(--text-sm);line-height:calc(var(--spacing)*6)}.text-xl{font-size:var(--text-xl);line-height:var(--tw-leading,var(--text-xl--line-height))}.text-xs{font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height))}.text-xs\\/6{font-size:var(--text-xs);line-height:calc(var(--spacing)*6)}.text-\\[1\\.17em\\]{font-size:1.17em}.text-\\[9px\\]{font-size:9px}.text-\\[10px\\]{font-size:10px}.text-\\[11px\\]{font-size:11px}.text-\\[18px\\]{font-size:18px}.leading-none{--tw-leading:1;line-height:1}.leading-normal{--tw-leading:var(--leading-normal);line-height:var(--leading-normal)}.font-bold{--tw-font-weight:var(--font-weight-bold);font-weight:var(--font-weight-bold)}.font-bold\\!{--tw-font-weight:var(--font-weight-bold)!important;font-weight:var(--font-weight-bold)!important}.font-extrabold{--tw-font-weight:var(--font-weight-extrabold);font-weight:var(--font-weight-extrabold)}.font-extrabold\\!{--tw-font-weight:var(--font-weight-extrabold)!important;font-weight:var(--font-weight-extrabold)!important}.font-medium{--tw-font-weight:var(--font-weight-medium);font-weight:var(--font-weight-medium)}.font-normal{--tw-font-weight:var(--font-weight-normal);font-weight:var(--font-weight-normal)}.font-semibold{--tw-font-weight:var(--font-weight-semibold);font-weight:var(--font-weight-semibold)}.text-wrap{text-wrap:wrap}.break-words{overflow-wrap:break-word}.text-ellipsis{text-overflow:ellipsis}.whitespace-normal{white-space:normal}.whitespace-normal\\!{white-space:normal!important}.whitespace-nowrap{white-space:nowrap}.whitespace-pre-line{white-space:pre-line}.\\!text-white{color:var(--color-white)!important}.text-\\[\\#4D6BEE\\]{color:#4d6bee}.text-\\[\\#359BD4\\]{color:#359bd4}.text-\\[\\#4895be\\]{color:#4895be}.text-\\[\\#959595\\]{color:#959595}.text-\\[\\#EF3F62\\]{color:#ef3f62}.text-\\[\\#FFDD31\\]{color:#ffdd31}.text-black{color:var(--color-black)}.text-gray-500{color:var(--color-gray-500)}.text-white{color:var(--color-white)}.text-white\\!{color:var(--color-white)!important}.text-white\\/20{color:#fff3}@supports (color:color-mix(in lab,red,red)){.text-white\\/20{color:color-mix(in oklab,var(--color-white)20%,transparent)}}.text-white\\/30{color:#ffffff4d}@supports (color:color-mix(in lab,red,red)){.text-white\\/30{color:color-mix(in oklab,var(--color-white)30%,transparent)}}.text-white\\/40{color:#fff6}@supports (color:color-mix(in lab,red,red)){.text-white\\/40{color:color-mix(in oklab,var(--color-white)40%,transparent)}}.text-white\\/50{color:#ffffff80}@supports (color:color-mix(in lab,red,red)){.text-white\\/50{color:color-mix(in oklab,var(--color-white)50%,transparent)}}.text-white\\/70{color:#ffffffb3}@supports (color:color-mix(in lab,red,red)){.text-white\\/70{color:color-mix(in oklab,var(--color-white)70%,transparent)}}.text-white\\/70\\!{color:#ffffffb3!important}@supports (color:color-mix(in lab,red,red)){.text-white\\/70\\!{color:color-mix(in oklab,var(--color-white)70%,transparent)!important}}.text-yellow-300{color:var(--color-yellow-300)}.capitalize{text-transform:capitalize}.lowercase{text-transform:lowercase}.uppercase{text-transform:uppercase}.italic{font-style:italic}.ordinal{--tw-ordinal:ordinal;font-variant-numeric:var(--tw-ordinal, )var(--tw-slashed-zero, )var(--tw-numeric-figure, )var(--tw-numeric-spacing, )var(--tw-numeric-fraction, )}.\\!underline{-webkit-text-decoration-line:underline!important;text-decoration-line:underline!important}.line-through{-webkit-text-decoration-line:line-through;text-decoration-line:line-through}.overline{-webkit-text-decoration-line:overline;text-decoration-line:overline}.underline{-webkit-text-decoration-line:underline;text-decoration-line:underline}.\\!decoration-white\\/50{-webkit-text-decoration-color:#ffffff80!important;text-decoration-color:#ffffff80!important}@supports (color:color-mix(in lab,red,red)){.\\!decoration-white\\/50{-webkit-text-decoration-color:color-mix(in oklab,var(--color-white)50%,transparent)!important;text-decoration-color:color-mix(in oklab,var(--color-white)50%,transparent)!important}}.decoration-white{-webkit-text-decoration-color:var(--color-white);text-decoration-color:var(--color-white)}.decoration-white\\/30{-webkit-text-decoration-color:#ffffff4d;text-decoration-color:#ffffff4d}@supports (color:color-mix(in lab,red,red)){.decoration-white\\/30{-webkit-text-decoration-color:color-mix(in oklab,var(--color-white)30%,transparent);text-decoration-color:color-mix(in oklab,var(--color-white)30%,transparent)}}.\\!decoration-dotted{-webkit-text-decoration-style:dotted!important;text-decoration-style:dotted!important}.decoration-dotted{-webkit-text-decoration-style:dotted;text-decoration-style:dotted}.\\!decoration-\\[12\\%\\]{text-decoration-thickness:.12em!important}.decoration-\\[12\\%\\]{text-decoration-thickness:.12em}.\\!underline-offset-\\[21\\.5\\%\\]{text-underline-offset:21.5%!important}.underline-offset-\\[21\\.5\\%\\]{text-underline-offset:21.5%}.opacity-0{opacity:0}.opacity-50{opacity:.5}.opacity-60{opacity:.6}.opacity-100{opacity:1}.mix-blend-screen{mix-blend-mode:screen}.shadow{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,#0000001a),0 1px 2px -1px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-2xl{--tw-shadow:0 25px 50px -12px var(--tw-shadow-color,#00000040);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-lg{--tw-shadow:0 10px 15px -3px var(--tw-shadow-color,#0000001a),0 4px 6px -4px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.ring{--tw-ring-shadow:var(--tw-ring-inset, )0 0 0 calc(1px + var(--tw-ring-offset-width))var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.\\[box-shadow\\:0_0_60px_0_rgba\\(247\\,213\\,119\\,1\\.00\\)\\]{box-shadow:0 0 60px #f7d577}.outline{outline-style:var(--tw-outline-style);outline-width:1px}.blur{--tw-blur:blur(8px);-webkit-filter:var(--tw-blur, )var(--tw-brightness, )var(--tw-contrast, )var(--tw-grayscale, )var(--tw-hue-rotate, )var(--tw-invert, )var(--tw-saturate, )var(--tw-sepia, )var(--tw-drop-shadow, );filter:var(--tw-blur, )var(--tw-brightness, )var(--tw-contrast, )var(--tw-grayscale, )var(--tw-hue-rotate, )var(--tw-invert, )var(--tw-saturate, )var(--tw-sepia, )var(--tw-drop-shadow, )}.drop-shadow-md{--tw-drop-shadow-size:drop-shadow(0 3px 3px var(--tw-drop-shadow-color,#0000001f));--tw-drop-shadow:drop-shadow(var(--drop-shadow-md));-webkit-filter:var(--tw-blur, )var(--tw-brightness, )var(--tw-contrast, )var(--tw-grayscale, )var(--tw-hue-rotate, )var(--tw-invert, )var(--tw-saturate, )var(--tw-sepia, )var(--tw-drop-shadow, );filter:var(--tw-blur, )var(--tw-brightness, )var(--tw-contrast, )var(--tw-grayscale, )var(--tw-hue-rotate, )var(--tw-invert, )var(--tw-saturate, )var(--tw-sepia, )var(--tw-drop-shadow, )}.invert{--tw-invert:invert(100%);-webkit-filter:var(--tw-blur, )var(--tw-brightness, )var(--tw-contrast, )var(--tw-grayscale, )var(--tw-hue-rotate, )var(--tw-invert, )var(--tw-saturate, )var(--tw-sepia, )var(--tw-drop-shadow, );filter:var(--tw-blur, )var(--tw-brightness, )var(--tw-contrast, )var(--tw-grayscale, )var(--tw-hue-rotate, )var(--tw-invert, )var(--tw-saturate, )var(--tw-sepia, )var(--tw-drop-shadow, )}.filter{-webkit-filter:var(--tw-blur, )var(--tw-brightness, )var(--tw-contrast, )var(--tw-grayscale, )var(--tw-hue-rotate, )var(--tw-invert, )var(--tw-saturate, )var(--tw-sepia, )var(--tw-drop-shadow, );filter:var(--tw-blur, )var(--tw-brightness, )var(--tw-contrast, )var(--tw-grayscale, )var(--tw-hue-rotate, )var(--tw-invert, )var(--tw-saturate, )var(--tw-sepia, )var(--tw-drop-shadow, )}.backdrop-blur-lg{--tw-backdrop-blur:blur(var(--blur-lg));-webkit-backdrop-filter:var(--tw-backdrop-blur, )var(--tw-backdrop-brightness, )var(--tw-backdrop-contrast, )var(--tw-backdrop-grayscale, )var(--tw-backdrop-hue-rotate, )var(--tw-backdrop-invert, )var(--tw-backdrop-opacity, )var(--tw-backdrop-saturate, )var(--tw-backdrop-sepia, );backdrop-filter:var(--tw-backdrop-blur, )var(--tw-backdrop-brightness, )var(--tw-backdrop-contrast, )var(--tw-backdrop-grayscale, )var(--tw-backdrop-hue-rotate, )var(--tw-backdrop-invert, )var(--tw-backdrop-opacity, )var(--tw-backdrop-saturate, )var(--tw-backdrop-sepia, )}.backdrop-blur-md{--tw-backdrop-blur:blur(var(--blur-md));-webkit-backdrop-filter:var(--tw-backdrop-blur, )var(--tw-backdrop-brightness, )var(--tw-backdrop-contrast, )var(--tw-backdrop-grayscale, )var(--tw-backdrop-hue-rotate, )var(--tw-backdrop-invert, )var(--tw-backdrop-opacity, )var(--tw-backdrop-saturate, )var(--tw-backdrop-sepia, );backdrop-filter:var(--tw-backdrop-blur, )var(--tw-backdrop-brightness, )var(--tw-backdrop-contrast, )var(--tw-backdrop-grayscale, )var(--tw-backdrop-hue-rotate, )var(--tw-backdrop-invert, )var(--tw-backdrop-opacity, )var(--tw-backdrop-saturate, )var(--tw-backdrop-sepia, )}.transition{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,opacity,box-shadow,transform,translate,scale,rotate,filter,-webkit-backdrop-filter,backdrop-filter,display,content-visibility,overlay,pointer-events;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-\\[left\\]{transition-property:left;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-all{transition-property:all;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-colors{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-opacity{transition-property:opacity;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-transform{transition-property:transform,translate,scale,rotate;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.delay-1000{transition-delay:1s}.duration-150{--tw-duration:.15s;transition-duration:.15s}.duration-200{--tw-duration:.2s;transition-duration:.2s}.duration-500{--tw-duration:.5s;transition-duration:.5s}.duration-1000{--tw-duration:1s;transition-duration:1s}.ease-in{--tw-ease:var(--ease-in);transition-timing-function:var(--ease-in)}.ease-in-out{--tw-ease:var(--ease-in-out);transition-timing-function:var(--ease-in-out)}.ease-out{--tw-ease:var(--ease-out);transition-timing-function:var(--ease-out)}.outline-none{--tw-outline-style:none;outline-style:none}.select-none{-webkit-user-select:none;user-select:none}.\\[-ms-overflow-style\\:none\\]{-ms-overflow-style:none}.\\[scrollbar-width\\:none\\]{scrollbar-width:none}.backface-hidden{-webkit-backface-visibility:hidden;backface-visibility:hidden}.text-shadow-lg{text-shadow:0px 1px 2px var(--tw-text-shadow-color,#0000001a),0px 3px 2px var(--tw-text-shadow-color,#0000001a),0px 4px 8px var(--tw-text-shadow-color,#0000001a)}.text-shadow-sm{text-shadow:0px 1px 0px var(--tw-text-shadow-color,#00000013),0px 1px 1px var(--tw-text-shadow-color,#00000013),0px 2px 2px var(--tw-text-shadow-color,#00000013)}.group-focus-within\\/tooltip\\:opacity-100:is(:where(.group\\/tooltip):focus-within *){opacity:1}@media (hover:hover){.group-hover\\:\\!block:is(:where(.group):hover *){display:block!important}.group-hover\\:h-\\[28px\\]:is(:where(.group):hover *){height:28px}.group-hover\\:translate-x-0:is(:where(.group):hover *){--tw-translate-x:calc(var(--spacing)*0);translate:var(--tw-translate-x)var(--tw-translate-y)}.group-hover\\:translate-x-0\\.5:is(:where(.group):hover *){--tw-translate-x:calc(var(--spacing)*.5);translate:var(--tw-translate-x)var(--tw-translate-y)}.group-hover\\:bg-\\[\\#454444\\]:is(:where(.group):hover *){background-color:#454444}.group-hover\\:opacity-100:is(:where(.group):hover *){opacity:1}.group-hover\\:brightness-80:is(:where(.group):hover *){--tw-brightness:brightness(80%);-webkit-filter:var(--tw-blur, )var(--tw-brightness, )var(--tw-contrast, )var(--tw-grayscale, )var(--tw-hue-rotate, )var(--tw-invert, )var(--tw-saturate, )var(--tw-sepia, )var(--tw-drop-shadow, );filter:var(--tw-blur, )var(--tw-brightness, )var(--tw-contrast, )var(--tw-grayscale, )var(--tw-hue-rotate, )var(--tw-invert, )var(--tw-saturate, )var(--tw-sepia, )var(--tw-drop-shadow, )}.group-hover\\/tooltip\\:opacity-100:is(:where(.group\\/tooltip):hover *){opacity:1}}.group-active\\:translate-y-1\\!:is(:where(.group):active *){--tw-translate-y:calc(var(--spacing)*1)!important;translate:var(--tw-translate-x)var(--tw-translate-y)!important}@media (hover:hover){.hover\\:-translate-y-0\\.5:hover{--tw-translate-y:calc(var(--spacing)*-.5);translate:var(--tw-translate-x)var(--tw-translate-y)}.hover\\:scale-105:hover{--tw-scale-x:105%;--tw-scale-y:105%;--tw-scale-z:105%;scale:var(--tw-scale-x)var(--tw-scale-y)}.hover\\:border-white\\/12:hover{border-color:#ffffff1f}@supports (color:color-mix(in lab,red,red)){.hover\\:border-white\\/12:hover{border-color:color-mix(in oklab,var(--color-white)12%,transparent)}}.hover\\:bg-\\[\\#3AFF68\\]\\/15:hover{background-color:#3aff6826}.hover\\:bg-\\[\\#222222\\]\\/60:hover{background-color:#2229}.hover\\:bg-\\[\\#343434\\]:hover{background-color:#343434}.hover\\:bg-\\[var\\(--bubble-hover\\)\\]:hover{background-color:var(--bubble-hover)}.hover\\:bg-white\\/6:hover{background-color:#ffffff0f}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-white\\/6:hover{background-color:color-mix(in oklab,var(--color-white)6%,transparent)}}.hover\\:bg-white\\/10:hover{background-color:#ffffff1a}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-white\\/10:hover{background-color:color-mix(in oklab,var(--color-white)10%,transparent)}}.hover\\:text-\\[\\#53afdf\\]:hover{color:#53afdf}.hover\\:text-white:hover{color:var(--color-white)}.hover\\:text-white\\!:hover{color:var(--color-white)!important}.hover\\:brightness-80:hover{--tw-brightness:brightness(80%);-webkit-filter:var(--tw-blur, )var(--tw-brightness, )var(--tw-contrast, )var(--tw-grayscale, )var(--tw-hue-rotate, )var(--tw-invert, )var(--tw-saturate, )var(--tw-sepia, )var(--tw-drop-shadow, );filter:var(--tw-blur, )var(--tw-brightness, )var(--tw-contrast, )var(--tw-grayscale, )var(--tw-hue-rotate, )var(--tw-invert, )var(--tw-saturate, )var(--tw-sepia, )var(--tw-drop-shadow, )}}.focus\\:border-transparent:focus{border-color:#0000}.focus\\:outline-none:focus{--tw-outline-style:none;outline-style:none}.active\\:border-transparent:active{border-color:#0000}.active\\:outline-none:active{--tw-outline-style:none;outline-style:none}.disabled\\:cursor-not-allowed:disabled{cursor:not-allowed}.disabled\\:opacity-50:disabled{opacity:.5}@media (min-width:64rem){.lg\\:block\\!{display:block!important}}@media (min-width:80rem){.xl\\:block\\!{display:block!important}.xl\\:text-lg{font-size:var(--text-lg);line-height:var(--tw-leading,var(--text-lg--line-height))}}.\\[\\&\\:\\:-webkit-scrollbar\\]\\:hidden::-webkit-scrollbar{display:none}}:root{--animate-duration:1s;--animate-delay:1s;--animate-repeat:1}.animate__animated{animation-duration:1s;animation-duration:var(--animate-duration);animation-fill-mode:both}.animate__animated.animate__infinite{animation-iteration-count:infinite}.animate__animated.animate__repeat-1{animation-iteration-count:1;animation-iteration-count:var(--animate-repeat)}.animate__animated.animate__repeat-2{animation-iteration-count:2;animation-iteration-count:calc(var(--animate-repeat)*2)}.animate__animated.animate__repeat-3{animation-iteration-count:3;animation-iteration-count:calc(var(--animate-repeat)*3)}.animate__animated.animate__delay-1s{animation-delay:1s;animation-delay:var(--animate-delay)}.animate__animated.animate__delay-2s{animation-delay:2s;animation-delay:calc(var(--animate-delay)*2)}.animate__animated.animate__delay-3s{animation-delay:3s;animation-delay:calc(var(--animate-delay)*3)}.animate__animated.animate__delay-4s{animation-delay:4s;animation-delay:calc(var(--animate-delay)*4)}.animate__animated.animate__delay-5s{animation-delay:5s;animation-delay:calc(var(--animate-delay)*5)}.animate__animated.animate__faster{animation-duration:.5s;animation-duration:calc(var(--animate-duration)/2)}.animate__animated.animate__fast{animation-duration:.8s;animation-duration:calc(var(--animate-duration)*.8)}.animate__animated.animate__slow{animation-duration:2s;animation-duration:calc(var(--animate-duration)*2)}.animate__animated.animate__slower{animation-duration:3s;animation-duration:calc(var(--animate-duration)*3)}@media print,(prefers-reduced-motion:reduce){.animate__animated{transition-duration:1ms!important;animation-duration:1ms!important;animation-iteration-count:1!important}.animate__animated[class*=Out]{opacity:0}}@keyframes bounce{0%,20%,53%,to{animation-timing-function:cubic-bezier(.215,.61,.355,1);transform:translate(0)}40%,43%{animation-timing-function:cubic-bezier(.755,.05,.855,.06);transform:translateY(-30px)scaleY(1.1)}70%{animation-timing-function:cubic-bezier(.755,.05,.855,.06);transform:translateY(-15px)scaleY(1.05)}80%{transition-timing-function:cubic-bezier(.215,.61,.355,1);transform:translate(0)scaleY(.95)}90%{transform:translateY(-4px)scaleY(1.02)}}.animate__bounce{transform-origin:bottom;animation-name:bounce}@keyframes flash{0%,50%,to{opacity:1}25%,75%{opacity:0}}.animate__flash{animation-name:flash}@keyframes pulse{50%{opacity:.5}}.animate__pulse{animation-name:pulse;animation-timing-function:ease-in-out}@keyframes rubberBand{0%{transform:scale(1)}30%{transform:scale(1.25,.75)}40%{transform:scale(.75,1.25)}50%{transform:scale(1.15,.85)}65%{transform:scale(.95,1.05)}75%{transform:scale(1.05,.95)}to{transform:scale(1)}}.animate__rubberBand{animation-name:rubberBand}@keyframes shakeX{0%,to{transform:translate(0)}10%,30%,50%,70%,90%{transform:translate(-10px)}20%,40%,60%,80%{transform:translate(10px)}}.animate__shakeX{animation-name:shakeX}@keyframes shakeY{0%,to{transform:translate(0)}10%,30%,50%,70%,90%{transform:translateY(-10px)}20%,40%,60%,80%{transform:translateY(10px)}}.animate__shakeY{animation-name:shakeY}@keyframes headShake{0%{transform:translate(0)}6.5%{transform:translate(-6px)rotateY(-9deg)}18.5%{transform:translate(5px)rotateY(7deg)}31.5%{transform:translate(-3px)rotateY(-5deg)}43.5%{transform:translate(2px)rotateY(3deg)}50%{transform:translate(0)}}.animate__headShake{animation-name:headShake;animation-timing-function:ease-in-out}@keyframes swing{20%{transform:rotate(15deg)}40%{transform:rotate(-10deg)}60%{transform:rotate(5deg)}80%{transform:rotate(-5deg)}to{transform:rotate(0)}}.animate__swing{transform-origin:top;animation-name:swing}@keyframes tada{0%{transform:scale(1)}10%,20%{transform:scale3d(.9,.9,.9)rotate(-3deg)}30%,50%,70%,90%{transform:scale3d(1.1,1.1,1.1)rotate(3deg)}40%,60%,80%{transform:scale3d(1.1,1.1,1.1)rotate(-3deg)}to{transform:scale(1)}}.animate__tada{animation-name:tada}@keyframes wobble{0%{transform:translate(0)}15%{transform:translate(-25%)rotate(-5deg)}30%{transform:translate(20%)rotate(3deg)}45%{transform:translate(-15%)rotate(-3deg)}60%{transform:translate(10%)rotate(2deg)}75%{transform:translate(-5%)rotate(-1deg)}to{transform:translate(0)}}.animate__wobble{animation-name:wobble}@keyframes jello{0%,11.1%,to{transform:translate(0)}22.2%{transform:skew(-12.5deg)skewY(-12.5deg)}33.3%{transform:skew(6.25deg)skewY(6.25deg)}44.4%{transform:skew(-3.125deg)skewY(-3.125deg)}55.5%{transform:skew(1.5625deg)skewY(1.5625deg)}66.6%{transform:skew(-.78125deg)skewY(-.78125deg)}77.7%{transform:skew(.390625deg)skewY(.390625deg)}88.8%{transform:skew(-.195313deg)skewY(-.195313deg)}}.animate__jello{transform-origin:50%;animation-name:jello}@keyframes heartBeat{0%{transform:scale(1)}14%{transform:scale(1.3)}28%{transform:scale(1)}42%{transform:scale(1.3)}70%{transform:scale(1)}}.animate__heartBeat{animation-name:heartBeat;animation-duration:1.3s;animation-duration:calc(var(--animate-duration)*1.3);animation-timing-function:ease-in-out}@keyframes backInDown{0%{opacity:.7;transform:translateY(-1200px)scale(.7)}80%{opacity:.7;transform:translateY(0)scale(.7)}to{opacity:1;transform:scale(1)}}.animate__backInDown{animation-name:backInDown}@keyframes backInLeft{0%{opacity:.7;transform:translate(-2000px)scale(.7)}80%{opacity:.7;transform:translate(0)scale(.7)}to{opacity:1;transform:scale(1)}}.animate__backInLeft{animation-name:backInLeft}@keyframes backInRight{0%{opacity:.7;transform:translate(2000px)scale(.7)}80%{opacity:.7;transform:translate(0)scale(.7)}to{opacity:1;transform:scale(1)}}.animate__backInRight{animation-name:backInRight}@keyframes backInUp{0%{opacity:.7;transform:translateY(1200px)scale(.7)}80%{opacity:.7;transform:translateY(0)scale(.7)}to{opacity:1;transform:scale(1)}}.animate__backInUp{animation-name:backInUp}@keyframes backOutDown{0%{opacity:1;transform:scale(1)}20%{opacity:.7;transform:translateY(0)scale(.7)}to{opacity:.7;transform:translateY(700px)scale(.7)}}.animate__backOutDown{animation-name:backOutDown}@keyframes backOutLeft{0%{opacity:1;transform:scale(1)}20%{opacity:.7;transform:translate(0)scale(.7)}to{opacity:.7;transform:translate(-2000px)scale(.7)}}.animate__backOutLeft{animation-name:backOutLeft}@keyframes backOutRight{0%{opacity:1;transform:scale(1)}20%{opacity:.7;transform:translate(0)scale(.7)}to{opacity:.7;transform:translate(2000px)scale(.7)}}.animate__backOutRight{animation-name:backOutRight}@keyframes backOutUp{0%{opacity:1;transform:scale(1)}20%{opacity:.7;transform:translateY(0)scale(.7)}to{opacity:.7;transform:translateY(-700px)scale(.7)}}.animate__backOutUp{animation-name:backOutUp}@keyframes bounceIn{0%,20%,40%,60%,80%,to{animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;transform:scale3d(.3,.3,.3)}20%{transform:scale3d(1.1,1.1,1.1)}40%{transform:scale3d(.9,.9,.9)}60%{opacity:1;transform:scale3d(1.03,1.03,1.03)}80%{transform:scale3d(.97,.97,.97)}to{opacity:1;transform:scale(1)}}.animate__bounceIn{animation-duration:.75s;animation-duration:calc(var(--animate-duration)*.75);animation-name:bounceIn}@keyframes bounceInDown{0%,60%,75%,90%,to{animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;transform:translateY(-3000px)scaleY(3)}60%{opacity:1;transform:translateY(25px)scaleY(.9)}75%{transform:translateY(-10px)scaleY(.95)}90%{transform:translateY(5px)scaleY(.985)}to{transform:translate(0)}}.animate__bounceInDown{animation-name:bounceInDown}@keyframes bounceInLeft{0%,60%,75%,90%,to{animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;transform:translate(-3000px)scaleX(3)}60%{opacity:1;transform:translate(25px)scaleX(1)}75%{transform:translate(-10px)scaleX(.98)}90%{transform:translate(5px)scaleX(.995)}to{transform:translate(0)}}.animate__bounceInLeft{animation-name:bounceInLeft}@keyframes bounceInRight{0%,60%,75%,90%,to{animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;transform:translate(3000px)scaleX(3)}60%{opacity:1;transform:translate(-25px)scaleX(1)}75%{transform:translate(10px)scaleX(.98)}90%{transform:translate(-5px)scaleX(.995)}to{transform:translate(0)}}.animate__bounceInRight{animation-name:bounceInRight}@keyframes bounceInUp{0%,60%,75%,90%,to{animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;transform:translateY(3000px)scaleY(5)}60%{opacity:1;transform:translateY(-20px)scaleY(.9)}75%{transform:translateY(10px)scaleY(.95)}90%{transform:translateY(-5px)scaleY(.985)}to{transform:translate(0)}}.animate__bounceInUp{animation-name:bounceInUp}@keyframes bounceOut{20%{transform:scale3d(.9,.9,.9)}50%,55%{opacity:1;transform:scale3d(1.1,1.1,1.1)}to{opacity:0;transform:scale3d(.3,.3,.3)}}.animate__bounceOut{animation-duration:.75s;animation-duration:calc(var(--animate-duration)*.75);animation-name:bounceOut}@keyframes bounceOutDown{20%{transform:translateY(10px)scaleY(.985)}40%,45%{opacity:1;transform:translateY(-20px)scaleY(.9)}to{opacity:0;transform:translateY(2000px)scaleY(3)}}.animate__bounceOutDown{animation-name:bounceOutDown}@keyframes bounceOutLeft{20%{opacity:1;transform:translate(20px)scaleX(.9)}to{opacity:0;transform:translate(-2000px)scaleX(2)}}.animate__bounceOutLeft{animation-name:bounceOutLeft}@keyframes bounceOutRight{20%{opacity:1;transform:translate(-20px)scaleX(.9)}to{opacity:0;transform:translate(2000px)scaleX(2)}}.animate__bounceOutRight{animation-name:bounceOutRight}@keyframes bounceOutUp{20%{transform:translateY(-10px)scaleY(.985)}40%,45%{opacity:1;transform:translateY(20px)scaleY(.9)}to{opacity:0;transform:translateY(-2000px)scaleY(3)}}.animate__bounceOutUp{animation-name:bounceOutUp}@keyframes fadeIn{0%{opacity:0}to{opacity:1}}.animate__fadeIn{animation-name:fadeIn}@keyframes fadeInDown{0%{opacity:0;transform:translateY(-100%)}to{opacity:1;transform:translate(0)}}.animate__fadeInDown{animation-name:fadeInDown}@keyframes fadeInDownBig{0%{opacity:0;transform:translateY(-2000px)}to{opacity:1;transform:translate(0)}}.animate__fadeInDownBig{animation-name:fadeInDownBig}@keyframes fadeInLeft{0%{opacity:0;transform:translate(-100%)}to{opacity:1;transform:translate(0)}}.animate__fadeInLeft{animation-name:fadeInLeft}@keyframes fadeInLeftBig{0%{opacity:0;transform:translate(-2000px)}to{opacity:1;transform:translate(0)}}.animate__fadeInLeftBig{animation-name:fadeInLeftBig}@keyframes fadeInRight{0%{opacity:0;transform:translate(100%)}to{opacity:1;transform:translate(0)}}.animate__fadeInRight{animation-name:fadeInRight}@keyframes fadeInRightBig{0%{opacity:0;transform:translate(2000px)}to{opacity:1;transform:translate(0)}}.animate__fadeInRightBig{animation-name:fadeInRightBig}@keyframes fadeInUp{0%{opacity:0;transform:translateY(100%)}to{opacity:1;transform:translate(0)}}.animate__fadeInUp{animation-name:fadeInUp}@keyframes fadeInUpBig{0%{opacity:0;transform:translateY(2000px)}to{opacity:1;transform:translate(0)}}.animate__fadeInUpBig{animation-name:fadeInUpBig}@keyframes fadeInTopLeft{0%{opacity:0;transform:translate(-100%,-100%)}to{opacity:1;transform:translate(0)}}.animate__fadeInTopLeft{animation-name:fadeInTopLeft}@keyframes fadeInTopRight{0%{opacity:0;transform:translate(100%,-100%)}to{opacity:1;transform:translate(0)}}.animate__fadeInTopRight{animation-name:fadeInTopRight}@keyframes fadeInBottomLeft{0%{opacity:0;transform:translate(-100%,100%)}to{opacity:1;transform:translate(0)}}.animate__fadeInBottomLeft{animation-name:fadeInBottomLeft}@keyframes fadeInBottomRight{0%{opacity:0;transform:translate(100%,100%)}to{opacity:1;transform:translate(0)}}.animate__fadeInBottomRight{animation-name:fadeInBottomRight}@keyframes fadeOut{0%{opacity:1}to{opacity:0}}.animate__fadeOut{animation-name:fadeOut}@keyframes fadeOutDown{0%{opacity:1}to{opacity:0;transform:translateY(100%)}}.animate__fadeOutDown{animation-name:fadeOutDown}@keyframes fadeOutDownBig{0%{opacity:1}to{opacity:0;transform:translateY(2000px)}}.animate__fadeOutDownBig{animation-name:fadeOutDownBig}@keyframes fadeOutLeft{0%{opacity:1}to{opacity:0;transform:translate(-100%)}}.animate__fadeOutLeft{animation-name:fadeOutLeft}@keyframes fadeOutLeftBig{0%{opacity:1}to{opacity:0;transform:translate(-2000px)}}.animate__fadeOutLeftBig{animation-name:fadeOutLeftBig}@keyframes fadeOutRight{0%{opacity:1}to{opacity:0;transform:translate(100%)}}.animate__fadeOutRight{animation-name:fadeOutRight}@keyframes fadeOutRightBig{0%{opacity:1}to{opacity:0;transform:translate(2000px)}}.animate__fadeOutRightBig{animation-name:fadeOutRightBig}@keyframes fadeOutUp{0%{opacity:1}to{opacity:0;transform:translateY(-100%)}}.animate__fadeOutUp{animation-name:fadeOutUp}@keyframes fadeOutUpBig{0%{opacity:1}to{opacity:0;transform:translateY(-2000px)}}.animate__fadeOutUpBig{animation-name:fadeOutUpBig}@keyframes fadeOutTopLeft{0%{opacity:1;transform:translate(0)}to{opacity:0;transform:translate(-100%,-100%)}}.animate__fadeOutTopLeft{animation-name:fadeOutTopLeft}@keyframes fadeOutTopRight{0%{opacity:1;transform:translate(0)}to{opacity:0;transform:translate(100%,-100%)}}.animate__fadeOutTopRight{animation-name:fadeOutTopRight}@keyframes fadeOutBottomRight{0%{opacity:1;transform:translate(0)}to{opacity:0;transform:translate(100%,100%)}}.animate__fadeOutBottomRight{animation-name:fadeOutBottomRight}@keyframes fadeOutBottomLeft{0%{opacity:1;transform:translate(0)}to{opacity:0;transform:translate(-100%,100%)}}.animate__fadeOutBottomLeft{animation-name:fadeOutBottomLeft}@keyframes flip{0%{animation-timing-function:ease-out;transform:perspective(400px)scale(1)translate(0)rotateY(-360deg)}40%{animation-timing-function:ease-out;transform:perspective(400px)scale(1)translateZ(150px)rotateY(-190deg)}50%{animation-timing-function:ease-in;transform:perspective(400px)scale(1)translateZ(150px)rotateY(-170deg)}80%{animation-timing-function:ease-in;transform:perspective(400px)scale3d(.95,.95,.95)translate(0)rotateY(0)}to{animation-timing-function:ease-in;transform:perspective(400px)scale(1)translate(0)rotateY(0)}}.animate__animated.animate__flip{-webkit-backface-visibility:visible;backface-visibility:visible;animation-name:flip}@keyframes flipInX{0%{opacity:0;animation-timing-function:ease-in;transform:perspective(400px)rotateX(90deg)}40%{animation-timing-function:ease-in;transform:perspective(400px)rotateX(-20deg)}60%{opacity:1;transform:perspective(400px)rotateX(10deg)}80%{transform:perspective(400px)rotateX(-5deg)}to{transform:perspective(400px)}}.animate__flipInX{animation-name:flipInX;-webkit-backface-visibility:visible!important;backface-visibility:visible!important}@keyframes flipInY{0%{opacity:0;animation-timing-function:ease-in;transform:perspective(400px)rotateY(90deg)}40%{animation-timing-function:ease-in;transform:perspective(400px)rotateY(-20deg)}60%{opacity:1;transform:perspective(400px)rotateY(10deg)}80%{transform:perspective(400px)rotateY(-5deg)}to{transform:perspective(400px)}}.animate__flipInY{animation-name:flipInY;-webkit-backface-visibility:visible!important;backface-visibility:visible!important}@keyframes flipOutX{0%{transform:perspective(400px)}30%{opacity:1;transform:perspective(400px)rotateX(-20deg)}to{opacity:0;transform:perspective(400px)rotateX(90deg)}}.animate__flipOutX{animation-duration:.75s;animation-duration:calc(var(--animate-duration)*.75);animation-name:flipOutX;-webkit-backface-visibility:visible!important;backface-visibility:visible!important}@keyframes flipOutY{0%{transform:perspective(400px)}30%{opacity:1;transform:perspective(400px)rotateY(-15deg)}to{opacity:0;transform:perspective(400px)rotateY(90deg)}}.animate__flipOutY{animation-duration:.75s;animation-duration:calc(var(--animate-duration)*.75);animation-name:flipOutY;-webkit-backface-visibility:visible!important;backface-visibility:visible!important}@keyframes lightSpeedInRight{0%{opacity:0;transform:translate(100%)skew(-30deg)}60%{opacity:1;transform:skew(20deg)}80%{transform:skew(-5deg)}to{transform:translate(0)}}.animate__lightSpeedInRight{animation-name:lightSpeedInRight;animation-timing-function:ease-out}@keyframes lightSpeedInLeft{0%{opacity:0;transform:translate(-100%)skew(30deg)}60%{opacity:1;transform:skew(-20deg)}80%{transform:skew(5deg)}to{transform:translate(0)}}.animate__lightSpeedInLeft{animation-name:lightSpeedInLeft;animation-timing-function:ease-out}@keyframes lightSpeedOutRight{0%{opacity:1}to{opacity:0;transform:translate(100%)skew(30deg)}}.animate__lightSpeedOutRight{animation-name:lightSpeedOutRight;animation-timing-function:ease-in}@keyframes lightSpeedOutLeft{0%{opacity:1}to{opacity:0;transform:translate(-100%)skew(-30deg)}}.animate__lightSpeedOutLeft{animation-name:lightSpeedOutLeft;animation-timing-function:ease-in}@keyframes rotateIn{0%{opacity:0;transform:rotate(-200deg)}to{opacity:1;transform:translate(0)}}.animate__rotateIn{transform-origin:50%;animation-name:rotateIn}@keyframes rotateInDownLeft{0%{opacity:0;transform:rotate(-45deg)}to{opacity:1;transform:translate(0)}}.animate__rotateInDownLeft{transform-origin:0 100%;animation-name:rotateInDownLeft}@keyframes rotateInDownRight{0%{opacity:0;transform:rotate(45deg)}to{opacity:1;transform:translate(0)}}.animate__rotateInDownRight{transform-origin:100% 100%;animation-name:rotateInDownRight}@keyframes rotateInUpLeft{0%{opacity:0;transform:rotate(45deg)}to{opacity:1;transform:translate(0)}}.animate__rotateInUpLeft{transform-origin:0 100%;animation-name:rotateInUpLeft}@keyframes rotateInUpRight{0%{opacity:0;transform:rotate(-90deg)}to{opacity:1;transform:translate(0)}}.animate__rotateInUpRight{transform-origin:100% 100%;animation-name:rotateInUpRight}@keyframes rotateOut{0%{opacity:1}to{opacity:0;transform:rotate(200deg)}}.animate__rotateOut{transform-origin:50%;animation-name:rotateOut}@keyframes rotateOutDownLeft{0%{opacity:1}to{opacity:0;transform:rotate(45deg)}}.animate__rotateOutDownLeft{transform-origin:0 100%;animation-name:rotateOutDownLeft}@keyframes rotateOutDownRight{0%{opacity:1}to{opacity:0;transform:rotate(-45deg)}}.animate__rotateOutDownRight{transform-origin:100% 100%;animation-name:rotateOutDownRight}@keyframes rotateOutUpLeft{0%{opacity:1}to{opacity:0;transform:rotate(-45deg)}}.animate__rotateOutUpLeft{transform-origin:0 100%;animation-name:rotateOutUpLeft}@keyframes rotateOutUpRight{0%{opacity:1}to{opacity:0;transform:rotate(90deg)}}.animate__rotateOutUpRight{transform-origin:100% 100%;animation-name:rotateOutUpRight}@keyframes hinge{0%{animation-timing-function:ease-in-out}20%,60%{animation-timing-function:ease-in-out;transform:rotate(80deg)}40%,80%{opacity:1;animation-timing-function:ease-in-out;transform:rotate(60deg)}to{opacity:0;transform:translateY(700px)}}.animate__hinge{animation-duration:2s;animation-duration:calc(var(--animate-duration)*2);transform-origin:0 0;animation-name:hinge}@keyframes jackInTheBox{0%{opacity:0;transform-origin:bottom;transform:scale(.1)rotate(30deg)}50%{transform:rotate(-10deg)}70%{transform:rotate(3deg)}to{opacity:1;transform:scale(1)}}.animate__jackInTheBox{animation-name:jackInTheBox}@keyframes rollIn{0%{opacity:0;transform:translate(-100%)rotate(-120deg)}to{opacity:1;transform:translate(0)}}.animate__rollIn{animation-name:rollIn}@keyframes rollOut{0%{opacity:1}to{opacity:0;transform:translate(100%)rotate(120deg)}}.animate__rollOut{animation-name:rollOut}@keyframes zoomIn{0%{opacity:0;transform:scale3d(.3,.3,.3)}50%{opacity:1}}.animate__zoomIn{animation-name:zoomIn}@keyframes zoomInDown{0%{opacity:0;animation-timing-function:cubic-bezier(.55,.055,.675,.19);transform:scale3d(.1,.1,.1)translateY(-1000px)}60%{opacity:1;animation-timing-function:cubic-bezier(.175,.885,.32,1);transform:scale3d(.475,.475,.475)translateY(60px)}}.animate__zoomInDown{animation-name:zoomInDown}@keyframes zoomInLeft{0%{opacity:0;animation-timing-function:cubic-bezier(.55,.055,.675,.19);transform:scale3d(.1,.1,.1)translate(-1000px)}60%{opacity:1;animation-timing-function:cubic-bezier(.175,.885,.32,1);transform:scale3d(.475,.475,.475)translate(10px)}}.animate__zoomInLeft{animation-name:zoomInLeft}@keyframes zoomInRight{0%{opacity:0;animation-timing-function:cubic-bezier(.55,.055,.675,.19);transform:scale3d(.1,.1,.1)translate(1000px)}60%{opacity:1;animation-timing-function:cubic-bezier(.175,.885,.32,1);transform:scale3d(.475,.475,.475)translate(-10px)}}.animate__zoomInRight{animation-name:zoomInRight}@keyframes zoomInUp{0%{opacity:0;animation-timing-function:cubic-bezier(.55,.055,.675,.19);transform:scale3d(.1,.1,.1)translateY(1000px)}60%{opacity:1;animation-timing-function:cubic-bezier(.175,.885,.32,1);transform:scale3d(.475,.475,.475)translateY(-60px)}}.animate__zoomInUp{animation-name:zoomInUp}@keyframes zoomOut{0%{opacity:1}50%{opacity:0;transform:scale3d(.3,.3,.3)}to{opacity:0}}.animate__zoomOut{animation-name:zoomOut}@keyframes zoomOutDown{40%{opacity:1;animation-timing-function:cubic-bezier(.55,.055,.675,.19);transform:scale3d(.475,.475,.475)translateY(-60px)}to{opacity:0;animation-timing-function:cubic-bezier(.175,.885,.32,1);transform:scale3d(.1,.1,.1)translateY(2000px)}}.animate__zoomOutDown{transform-origin:bottom;animation-name:zoomOutDown}@keyframes zoomOutLeft{40%{opacity:1;transform:scale3d(.475,.475,.475)translate(42px)}to{opacity:0;transform:scale(.1)translate(-2000px)}}.animate__zoomOutLeft{transform-origin:0;animation-name:zoomOutLeft}@keyframes zoomOutRight{40%{opacity:1;transform:scale3d(.475,.475,.475)translate(-42px)}to{opacity:0;transform:scale(.1)translate(2000px)}}.animate__zoomOutRight{transform-origin:100%;animation-name:zoomOutRight}@keyframes zoomOutUp{40%{opacity:1;animation-timing-function:cubic-bezier(.55,.055,.675,.19);transform:scale3d(.475,.475,.475)translateY(60px)}to{opacity:0;animation-timing-function:cubic-bezier(.175,.885,.32,1);transform:scale3d(.1,.1,.1)translateY(-2000px)}}.animate__zoomOutUp{transform-origin:bottom;animation-name:zoomOutUp}@keyframes slideInDown{0%{visibility:visible;transform:translateY(-100%)}to{transform:translate(0)}}.animate__slideInDown{animation-name:slideInDown}@keyframes slideInLeft{0%{visibility:visible;transform:translate(-100%)}to{transform:translate(0)}}.animate__slideInLeft{animation-name:slideInLeft}@keyframes slideInRight{0%{visibility:visible;transform:translate(100%)}to{transform:translate(0)}}.animate__slideInRight{animation-name:slideInRight}@keyframes slideInUp{0%{visibility:visible;transform:translateY(100%)}to{transform:translate(0)}}.animate__slideInUp{animation-name:slideInUp}@keyframes slideOutDown{0%{transform:translate(0)}to{visibility:hidden;transform:translateY(100%)}}.animate__slideOutDown{animation-name:slideOutDown}@keyframes slideOutLeft{0%{transform:translate(0)}to{visibility:hidden;transform:translate(-100%)}}.animate__slideOutLeft{animation-name:slideOutLeft}@keyframes slideOutRight{0%{transform:translate(0)}to{visibility:hidden;transform:translate(100%)}}.animate__slideOutRight{animation-name:slideOutRight}@keyframes slideOutUp{0%{transform:translate(0)}to{visibility:hidden;transform:translateY(-100%)}}.animate__slideOutUp{animation-name:slideOutUp}:root{--scale:1}body{overflow:hidden}.text-tikfinity{color:#53afdf}.wheelOfActions{scale:var(--scale);will-change:scale}.font-lexend{font-family:Lexend,sans-serif;font-weight:800}.font-luckiestguy{font-family:Luckiest Guy,sans-serif;font-weight:400}.font-exo2{font-family:\"Exo 2\",sans-serif;font-weight:400}@property --tw-translate-x{syntax:\"*\";inherits:false;initial-value:0}@property --tw-translate-y{syntax:\"*\";inherits:false;initial-value:0}@property --tw-translate-z{syntax:\"*\";inherits:false;initial-value:0}@property --tw-scale-x{syntax:\"*\";inherits:false;initial-value:1}@property --tw-scale-y{syntax:\"*\";inherits:false;initial-value:1}@property --tw-scale-z{syntax:\"*\";inherits:false;initial-value:1}@property --tw-rotate-x{syntax:\"*\";inherits:false}@property --tw-rotate-y{syntax:\"*\";inherits:false}@property --tw-rotate-z{syntax:\"*\";inherits:false}@property --tw-skew-x{syntax:\"*\";inherits:false}@property --tw-skew-y{syntax:\"*\";inherits:false}@property --tw-space-y-reverse{syntax:\"*\";inherits:false;initial-value:0}@property --tw-divide-y-reverse{syntax:\"*\";inherits:false;initial-value:0}@property --tw-border-style{syntax:\"*\";inherits:false;initial-value:solid}@property --tw-gradient-position{syntax:\"*\";inherits:false}@property --tw-gradient-from{syntax:\"<color>\";inherits:false;initial-value:#0000}@property --tw-gradient-via{syntax:\"<color>\";inherits:false;initial-value:#0000}@property --tw-gradient-to{syntax:\"<color>\";inherits:false;initial-value:#0000}@property --tw-gradient-stops{syntax:\"*\";inherits:false}@property --tw-gradient-via-stops{syntax:\"*\";inherits:false}@property --tw-gradient-from-position{syntax:\"<length-percentage>\";inherits:false;initial-value:0%}@property --tw-gradient-via-position{syntax:\"<length-percentage>\";inherits:false;initial-value:50%}@property --tw-gradient-to-position{syntax:\"<length-percentage>\";inherits:false;initial-value:100%}@property --tw-leading{syntax:\"*\";inherits:false}@property --tw-font-weight{syntax:\"*\";inherits:false}@property --tw-ordinal{syntax:\"*\";inherits:false}@property --tw-slashed-zero{syntax:\"*\";inherits:false}@property --tw-numeric-figure{syntax:\"*\";inherits:false}@property --tw-numeric-spacing{syntax:\"*\";inherits:false}@property --tw-numeric-fraction{syntax:\"*\";inherits:false}@property --tw-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-shadow-color{syntax:\"*\";inherits:false}@property --tw-shadow-alpha{syntax:\"<percentage>\";inherits:false;initial-value:100%}@property --tw-inset-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-inset-shadow-color{syntax:\"*\";inherits:false}@property --tw-inset-shadow-alpha{syntax:\"<percentage>\";inherits:false;initial-value:100%}@property --tw-ring-color{syntax:\"*\";inherits:false}@property --tw-ring-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-inset-ring-color{syntax:\"*\";inherits:false}@property --tw-inset-ring-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-ring-inset{syntax:\"*\";inherits:false}@property --tw-ring-offset-width{syntax:\"<length>\";inherits:false;initial-value:0}@property --tw-ring-offset-color{syntax:\"*\";inherits:false;initial-value:#fff}@property --tw-ring-offset-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-outline-style{syntax:\"*\";inherits:false;initial-value:solid}@property --tw-blur{syntax:\"*\";inherits:false}@property --tw-brightness{syntax:\"*\";inherits:false}@property --tw-contrast{syntax:\"*\";inherits:false}@property --tw-grayscale{syntax:\"*\";inherits:false}@property --tw-hue-rotate{syntax:\"*\";inherits:false}@property --tw-invert{syntax:\"*\";inherits:false}@property --tw-opacity{syntax:\"*\";inherits:false}@property --tw-saturate{syntax:\"*\";inherits:false}@property --tw-sepia{syntax:\"*\";inherits:false}@property --tw-drop-shadow{syntax:\"*\";inherits:false}@property --tw-drop-shadow-color{syntax:\"*\";inherits:false}@property --tw-drop-shadow-alpha{syntax:\"<percentage>\";inherits:false;initial-value:100%}@property --tw-drop-shadow-size{syntax:\"*\";inherits:false}@property --tw-backdrop-blur{syntax:\"*\";inherits:false}@property --tw-backdrop-brightness{syntax:\"*\";inherits:false}@property --tw-backdrop-contrast{syntax:\"*\";inherits:false}@property --tw-backdrop-grayscale{syntax:\"*\";inherits:false}@property --tw-backdrop-hue-rotate{syntax:\"*\";inherits:false}@property --tw-backdrop-invert{syntax:\"*\";inherits:false}@property --tw-backdrop-opacity{syntax:\"*\";inherits:false}@property --tw-backdrop-saturate{syntax:\"*\";inherits:false}@property --tw-backdrop-sepia{syntax:\"*\";inherits:false}@property --tw-duration{syntax:\"*\";inherits:false}@property --tw-ease{syntax:\"*\";inherits:false}@property --tw-text-shadow-color{syntax:\"*\";inherits:false}@property --tw-text-shadow-alpha{syntax:\"<percentage>\";inherits:false;initial-value:100%}\n";document.head.appendChild(s);}})();// @__NO_SIDE_EFFECTS__
function Hn(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(",")) t[n] = 1;
  return (n) => n in t;
}
const q = {}, ht = [], Re = () => {
}, Hs = () => !1, en = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), Ln = (e) => e.startsWith("onUpdate:"), ie = Object.assign, Wn = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, zi = Object.prototype.hasOwnProperty, W = (e, t) => zi.call(e, t), R = Array.isArray, dt = (e) => tn(e) === "[object Map]", Ls = (e) => tn(e) === "[object Set]", D = (e) => typeof e == "function", Q = (e) => typeof e == "string", Qe = (e) => typeof e == "symbol", Y = (e) => e !== null && typeof e == "object", Ws = (e) => (Y(e) || D(e)) && D(e.then) && D(e.catch), Us = Object.prototype.toString, tn = (e) => Us.call(e), qi = (e) => tn(e).slice(8, -1), Bs = (e) => tn(e) === "[object Object]", Un = (e) => Q(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Ct = /* @__PURE__ */ Hn(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), nn = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return ((n) => t[n] || (t[n] = e(n)));
}, ki = /-\w/g, Ye = nn(
  (e) => e.replace(ki, (t) => t.slice(1).toUpperCase())
), Ji = /\B([A-Z])/g, ct = nn(
  (e) => e.replace(Ji, "-$1").toLowerCase()
), Vs = nn((e) => e.charAt(0).toUpperCase() + e.slice(1)), hn = nn(
  (e) => e ? `on${Vs(e)}` : ""
), Ge = (e, t) => !Object.is(e, t), dn = (e, ...t) => {
  for (let n = 0; n < e.length; n++)
    e[n](...t);
}, Ks = (e, t, n, s = !1) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    writable: s,
    value: n
  });
}, Gi = (e) => {
  const t = parseFloat(e);
  return isNaN(t) ? e : t;
};
let cs;
const sn = () => cs || (cs = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function pt(e) {
  if (R(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const s = e[n], i = Q(s) ? Xi(s) : pt(s);
      if (i)
        for (const r in i)
          t[r] = i[r];
    }
    return t;
  } else if (Q(e) || Y(e))
    return e;
}
const Yi = /;(?![^(]*\))/g, Zi = /:([^]+)/, Qi = /\/\*[^]*?\*\//g;
function Xi(e) {
  const t = {};
  return e.replace(Qi, "").split(Yi).forEach((n) => {
    if (n) {
      const s = n.split(Zi);
      s.length > 1 && (t[s[0].trim()] = s[1].trim());
    }
  }), t;
}
function jt(e) {
  let t = "";
  if (Q(e))
    t = e;
  else if (R(e))
    for (let n = 0; n < e.length; n++) {
      const s = jt(e[n]);
      s && (t += s + " ");
    }
  else if (Y(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
const er = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", tr = /* @__PURE__ */ Hn(er);
function zs(e) {
  return !!e || e === "";
}
const qs = (e) => !!(e && e.__v_isRef === !0), Ke = (e) => Q(e) ? e : e == null ? "" : R(e) || Y(e) && (e.toString === Us || !D(e.toString)) ? qs(e) ? Ke(e.value) : JSON.stringify(e, ks, 2) : String(e), ks = (e, t) => qs(t) ? ks(e, t.value) : dt(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce(
    (n, [s, i], r) => (n[pn(s, r) + " =>"] = i, n),
    {}
  )
} : Ls(t) ? {
  [`Set(${t.size})`]: [...t.values()].map((n) => pn(n))
} : Qe(t) ? pn(t) : Y(t) && !R(t) && !Bs(t) ? String(t) : t, pn = (e, t = "") => {
  var n;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    Qe(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e
  );
};
let de;
class nr {
  constructor(t = !1) {
    this.detached = t, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this.parent = de, !t && de && (this.index = (de.scopes || (de.scopes = [])).push(
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
      const n = de;
      try {
        return de = this, t();
      } finally {
        de = n;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && (this.prevScope = de, de = this);
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    this._on > 0 && --this._on === 0 && (de = this.prevScope, this.prevScope = void 0);
  }
  stop(t) {
    if (this._active) {
      this._active = !1;
      let n, s;
      for (n = 0, s = this.effects.length; n < s; n++)
        this.effects[n].stop();
      for (this.effects.length = 0, n = 0, s = this.cleanups.length; n < s; n++)
        this.cleanups[n]();
      if (this.cleanups.length = 0, this.scopes) {
        for (n = 0, s = this.scopes.length; n < s; n++)
          this.scopes[n].stop(!0);
        this.scopes.length = 0;
      }
      if (!this.detached && this.parent && !t) {
        const i = this.parent.scopes.pop();
        i && i !== this && (this.parent.scopes[this.index] = i, i.index = this.index);
      }
      this.parent = void 0;
    }
  }
}
function sr() {
  return de;
}
let z;
const gn = /* @__PURE__ */ new WeakSet();
class Js {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, de && de.active && de.effects.push(this);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, gn.has(this) && (gn.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Ys(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, fs(this), Zs(this);
    const t = z, n = xe;
    z = this, xe = !0;
    try {
      return this.fn();
    } finally {
      Qs(this), z = t, xe = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        Kn(t);
      this.deps = this.depsTail = void 0, fs(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? gn.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    Cn(this) && this.run();
  }
  get dirty() {
    return Cn(this);
  }
}
let Gs = 0, Et, Tt;
function Ys(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = Tt, Tt = e;
    return;
  }
  e.next = Et, Et = e;
}
function Bn() {
  Gs++;
}
function Vn() {
  if (--Gs > 0)
    return;
  if (Tt) {
    let t = Tt;
    for (Tt = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; Et; ) {
    let t = Et;
    for (Et = void 0; t; ) {
      const n = t.next;
      if (t.next = void 0, t.flags &= -9, t.flags & 1)
        try {
          t.trigger();
        } catch (s) {
          e || (e = s);
        }
      t = n;
    }
  }
  if (e) throw e;
}
function Zs(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Qs(e) {
  let t, n = e.depsTail, s = n;
  for (; s; ) {
    const i = s.prevDep;
    s.version === -1 ? (s === n && (n = i), Kn(s), ir(s)) : t = s, s.dep.activeLink = s.prevActiveLink, s.prevActiveLink = void 0, s = i;
  }
  e.deps = t, e.depsTail = n;
}
function Cn(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (Xs(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function Xs(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Rt) || (e.globalVersion = Rt, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Cn(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = z, s = xe;
  z = e, xe = !0;
  try {
    Zs(e);
    const i = e.fn(e._value);
    (t.version === 0 || Ge(i, e._value)) && (e.flags |= 128, e._value = i, t.version++);
  } catch (i) {
    throw t.version++, i;
  } finally {
    z = n, xe = s, Qs(e), e.flags &= -3;
  }
}
function Kn(e, t = !1) {
  const { dep: n, prevSub: s, nextSub: i } = e;
  if (s && (s.nextSub = i, e.prevSub = void 0), i && (i.prevSub = s, e.nextSub = void 0), n.subs === e && (n.subs = s, !s && n.computed)) {
    n.computed.flags &= -5;
    for (let r = n.computed.deps; r; r = r.nextDep)
      Kn(r, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function ir(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
let xe = !0;
const ei = [];
function We() {
  ei.push(xe), xe = !1;
}
function Ue() {
  const e = ei.pop();
  xe = e === void 0 ? !0 : e;
}
function fs(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = z;
    z = void 0;
    try {
      t();
    } finally {
      z = n;
    }
  }
}
let Rt = 0;
class rr {
  constructor(t, n) {
    this.sub = t, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class zn {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
  }
  track(t) {
    if (!z || !xe || z === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== z)
      n = this.activeLink = new rr(z, this), z.deps ? (n.prevDep = z.depsTail, z.depsTail.nextDep = n, z.depsTail = n) : z.deps = z.depsTail = n, ti(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const s = n.nextDep;
      s.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = s), n.prevDep = z.depsTail, n.nextDep = void 0, z.depsTail.nextDep = n, z.depsTail = n, z.deps === n && (z.deps = s);
    }
    return n;
  }
  trigger(t) {
    this.version++, Rt++, this.notify(t);
  }
  notify(t) {
    Bn();
    try {
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      Vn();
    }
  }
}
function ti(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let s = t.deps; s; s = s.nextDep)
        ti(s);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
  }
}
const En = /* @__PURE__ */ new WeakMap(), ot = Symbol(
  ""
), Tn = Symbol(
  ""
), Ft = Symbol(
  ""
);
function ne(e, t, n) {
  if (xe && z) {
    let s = En.get(e);
    s || En.set(e, s = /* @__PURE__ */ new Map());
    let i = s.get(n);
    i || (s.set(n, i = new zn()), i.map = s, i.key = n), i.track();
  }
}
function He(e, t, n, s, i, r) {
  const o = En.get(e);
  if (!o) {
    Rt++;
    return;
  }
  const l = (f) => {
    f && f.trigger();
  };
  if (Bn(), t === "clear")
    o.forEach(l);
  else {
    const f = R(e), h = f && Un(n);
    if (f && n === "length") {
      const a = Number(s);
      o.forEach((p, S) => {
        (S === "length" || S === Ft || !Qe(S) && S >= a) && l(p);
      });
    } else
      switch ((n !== void 0 || o.has(void 0)) && l(o.get(n)), h && l(o.get(Ft)), t) {
        case "add":
          f ? h && l(o.get("length")) : (l(o.get(ot)), dt(e) && l(o.get(Tn)));
          break;
        case "delete":
          f || (l(o.get(ot)), dt(e) && l(o.get(Tn)));
          break;
        case "set":
          dt(e) && l(o.get(ot));
          break;
      }
  }
  Vn();
}
function ft(e) {
  const t = L(e);
  return t === e ? t : (ne(t, "iterate", Ft), ve(e) ? t : t.map(ye));
}
function rn(e) {
  return ne(e = L(e), "iterate", Ft), e;
}
function ze(e, t) {
  return Be(e) ? lt(e) ? _t(ye(t)) : _t(t) : ye(t);
}
const or = {
  __proto__: null,
  [Symbol.iterator]() {
    return mn(this, Symbol.iterator, (e) => ze(this, e));
  },
  concat(...e) {
    return ft(this).concat(
      ...e.map((t) => R(t) ? ft(t) : t)
    );
  },
  entries() {
    return mn(this, "entries", (e) => (e[1] = ze(this, e[1]), e));
  },
  every(e, t) {
    return Ne(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return Ne(
      this,
      "filter",
      e,
      t,
      (n) => n.map((s) => ze(this, s)),
      arguments
    );
  },
  find(e, t) {
    return Ne(
      this,
      "find",
      e,
      t,
      (n) => ze(this, n),
      arguments
    );
  },
  findIndex(e, t) {
    return Ne(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return Ne(
      this,
      "findLast",
      e,
      t,
      (n) => ze(this, n),
      arguments
    );
  },
  findLastIndex(e, t) {
    return Ne(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return Ne(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return _n(this, "includes", e);
  },
  indexOf(...e) {
    return _n(this, "indexOf", e);
  },
  join(e) {
    return ft(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return _n(this, "lastIndexOf", e);
  },
  map(e, t) {
    return Ne(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return wt(this, "pop");
  },
  push(...e) {
    return wt(this, "push", e);
  },
  reduce(e, ...t) {
    return us(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return us(this, "reduceRight", e, t);
  },
  shift() {
    return wt(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return Ne(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return wt(this, "splice", e);
  },
  toReversed() {
    return ft(this).toReversed();
  },
  toSorted(e) {
    return ft(this).toSorted(e);
  },
  toSpliced(...e) {
    return ft(this).toSpliced(...e);
  },
  unshift(...e) {
    return wt(this, "unshift", e);
  },
  values() {
    return mn(this, "values", (e) => ze(this, e));
  }
};
function mn(e, t, n) {
  const s = rn(e), i = s[t]();
  return s !== e && !ve(e) && (i._next = i.next, i.next = () => {
    const r = i._next();
    return r.done || (r.value = n(r.value)), r;
  }), i;
}
const lr = Array.prototype;
function Ne(e, t, n, s, i, r) {
  const o = rn(e), l = o !== e && !ve(e), f = o[t];
  if (f !== lr[t]) {
    const p = f.apply(e, r);
    return l ? ye(p) : p;
  }
  let h = n;
  o !== e && (l ? h = function(p, S) {
    return n.call(this, ze(e, p), S, e);
  } : n.length > 2 && (h = function(p, S) {
    return n.call(this, p, S, e);
  }));
  const a = f.call(o, h, s);
  return l && i ? i(a) : a;
}
function us(e, t, n, s) {
  const i = rn(e);
  let r = n;
  return i !== e && (ve(e) ? n.length > 3 && (r = function(o, l, f) {
    return n.call(this, o, l, f, e);
  }) : r = function(o, l, f) {
    return n.call(this, o, ze(e, l), f, e);
  }), i[t](r, ...s);
}
function _n(e, t, n) {
  const s = L(e);
  ne(s, "iterate", Ft);
  const i = s[t](...n);
  return (i === -1 || i === !1) && Gn(n[0]) ? (n[0] = L(n[0]), s[t](...n)) : i;
}
function wt(e, t, n = []) {
  We(), Bn();
  const s = L(e)[t].apply(e, n);
  return Vn(), Ue(), s;
}
const cr = /* @__PURE__ */ Hn("__proto__,__v_isRef,__isVue"), ni = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(Qe)
);
function fr(e) {
  Qe(e) || (e = String(e));
  const t = L(this);
  return ne(t, "has", e), t.hasOwnProperty(e);
}
class si {
  constructor(t = !1, n = !1) {
    this._isReadonly = t, this._isShallow = n;
  }
  get(t, n, s) {
    if (n === "__v_skip") return t.__v_skip;
    const i = this._isReadonly, r = this._isShallow;
    if (n === "__v_isReactive")
      return !i;
    if (n === "__v_isReadonly")
      return i;
    if (n === "__v_isShallow")
      return r;
    if (n === "__v_raw")
      return s === (i ? r ? vr : li : r ? oi : ri).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(s) ? t : void 0;
    const o = R(t);
    if (!i) {
      let f;
      if (o && (f = or[n]))
        return f;
      if (n === "hasOwnProperty")
        return fr;
    }
    const l = Reflect.get(
      t,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      se(t) ? t : s
    );
    if ((Qe(n) ? ni.has(n) : cr(n)) || (i || ne(t, "get", n), r))
      return l;
    if (se(l)) {
      const f = o && Un(n) ? l : l.value;
      return i && Y(f) ? In(f) : f;
    }
    return Y(l) ? i ? In(l) : kn(l) : l;
  }
}
class ii extends si {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, s, i) {
    let r = t[n];
    const o = R(t) && Un(n);
    if (!this._isShallow) {
      const h = Be(r);
      if (!ve(s) && !Be(s) && (r = L(r), s = L(s)), !o && se(r) && !se(s))
        return h || (r.value = s), !0;
    }
    const l = o ? Number(n) < t.length : W(t, n), f = Reflect.set(
      t,
      n,
      s,
      se(t) ? t : i
    );
    return t === L(i) && (l ? Ge(s, r) && He(t, "set", n, s) : He(t, "add", n, s)), f;
  }
  deleteProperty(t, n) {
    const s = W(t, n);
    t[n];
    const i = Reflect.deleteProperty(t, n);
    return i && s && He(t, "delete", n, void 0), i;
  }
  has(t, n) {
    const s = Reflect.has(t, n);
    return (!Qe(n) || !ni.has(n)) && ne(t, "has", n), s;
  }
  ownKeys(t) {
    return ne(
      t,
      "iterate",
      R(t) ? "length" : ot
    ), Reflect.ownKeys(t);
  }
}
class ur extends si {
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
const ar = /* @__PURE__ */ new ii(), hr = /* @__PURE__ */ new ur(), dr = /* @__PURE__ */ new ii(!0);
const An = (e) => e, Bt = (e) => Reflect.getPrototypeOf(e);
function pr(e, t, n) {
  return function(...s) {
    const i = this.__v_raw, r = L(i), o = dt(r), l = e === "entries" || e === Symbol.iterator && o, f = e === "keys" && o, h = i[e](...s), a = n ? An : t ? _t : ye;
    return !t && ne(
      r,
      "iterate",
      f ? Tn : ot
    ), {
      // iterator protocol
      next() {
        const { value: p, done: S } = h.next();
        return S ? { value: p, done: S } : {
          value: l ? [a(p[0]), a(p[1])] : a(p),
          done: S
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function Vt(e) {
  return function(...t) {
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function gr(e, t) {
  const n = {
    get(i) {
      const r = this.__v_raw, o = L(r), l = L(i);
      e || (Ge(i, l) && ne(o, "get", i), ne(o, "get", l));
      const { has: f } = Bt(o), h = t ? An : e ? _t : ye;
      if (f.call(o, i))
        return h(r.get(i));
      if (f.call(o, l))
        return h(r.get(l));
      r !== o && r.get(i);
    },
    get size() {
      const i = this.__v_raw;
      return !e && ne(L(i), "iterate", ot), i.size;
    },
    has(i) {
      const r = this.__v_raw, o = L(r), l = L(i);
      return e || (Ge(i, l) && ne(o, "has", i), ne(o, "has", l)), i === l ? r.has(i) : r.has(i) || r.has(l);
    },
    forEach(i, r) {
      const o = this, l = o.__v_raw, f = L(l), h = t ? An : e ? _t : ye;
      return !e && ne(f, "iterate", ot), l.forEach((a, p) => i.call(r, h(a), h(p), o));
    }
  };
  return ie(
    n,
    e ? {
      add: Vt("add"),
      set: Vt("set"),
      delete: Vt("delete"),
      clear: Vt("clear")
    } : {
      add(i) {
        !t && !ve(i) && !Be(i) && (i = L(i));
        const r = L(this);
        return Bt(r).has.call(r, i) || (r.add(i), He(r, "add", i, i)), this;
      },
      set(i, r) {
        !t && !ve(r) && !Be(r) && (r = L(r));
        const o = L(this), { has: l, get: f } = Bt(o);
        let h = l.call(o, i);
        h || (i = L(i), h = l.call(o, i));
        const a = f.call(o, i);
        return o.set(i, r), h ? Ge(r, a) && He(o, "set", i, r) : He(o, "add", i, r), this;
      },
      delete(i) {
        const r = L(this), { has: o, get: l } = Bt(r);
        let f = o.call(r, i);
        f || (i = L(i), f = o.call(r, i)), l && l.call(r, i);
        const h = r.delete(i);
        return f && He(r, "delete", i, void 0), h;
      },
      clear() {
        const i = L(this), r = i.size !== 0, o = i.clear();
        return r && He(
          i,
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
  ].forEach((i) => {
    n[i] = pr(i, e, t);
  }), n;
}
function qn(e, t) {
  const n = gr(e, t);
  return (s, i, r) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_raw" ? s : Reflect.get(
    W(n, i) && i in s ? n : s,
    i,
    r
  );
}
const mr = {
  get: /* @__PURE__ */ qn(!1, !1)
}, _r = {
  get: /* @__PURE__ */ qn(!1, !0)
}, br = {
  get: /* @__PURE__ */ qn(!0, !1)
};
const ri = /* @__PURE__ */ new WeakMap(), oi = /* @__PURE__ */ new WeakMap(), li = /* @__PURE__ */ new WeakMap(), vr = /* @__PURE__ */ new WeakMap();
function xr(e) {
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
function yr(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : xr(qi(e));
}
function kn(e) {
  return Be(e) ? e : Jn(
    e,
    !1,
    ar,
    mr,
    ri
  );
}
function wr(e) {
  return Jn(
    e,
    !1,
    dr,
    _r,
    oi
  );
}
function In(e) {
  return Jn(
    e,
    !0,
    hr,
    br,
    li
  );
}
function Jn(e, t, n, s, i) {
  if (!Y(e) || e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const r = yr(e);
  if (r === 0)
    return e;
  const o = i.get(e);
  if (o)
    return o;
  const l = new Proxy(
    e,
    r === 2 ? s : n
  );
  return i.set(e, l), l;
}
function lt(e) {
  return Be(e) ? lt(e.__v_raw) : !!(e && e.__v_isReactive);
}
function Be(e) {
  return !!(e && e.__v_isReadonly);
}
function ve(e) {
  return !!(e && e.__v_isShallow);
}
function Gn(e) {
  return e ? !!e.__v_raw : !1;
}
function L(e) {
  const t = e && e.__v_raw;
  return t ? L(t) : e;
}
function Sr(e) {
  return !W(e, "__v_skip") && Object.isExtensible(e) && Ks(e, "__v_skip", !0), e;
}
const ye = (e) => Y(e) ? kn(e) : e, _t = (e) => Y(e) ? In(e) : e;
function se(e) {
  return e ? e.__v_isRef === !0 : !1;
}
function rt(e) {
  return Or(e, !1);
}
function Or(e, t) {
  return se(e) ? e : new Cr(e, t);
}
class Cr {
  constructor(t, n) {
    this.dep = new zn(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? t : L(t), this._value = n ? t : ye(t), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(t) {
    const n = this._rawValue, s = this.__v_isShallow || ve(t) || Be(t);
    t = s ? t : L(t), Ge(t, n) && (this._rawValue = t, this._value = s ? t : ye(t), this.dep.trigger());
  }
}
function st(e) {
  return se(e) ? e.value : e;
}
const Er = {
  get: (e, t, n) => t === "__v_raw" ? e : st(Reflect.get(e, t, n)),
  set: (e, t, n, s) => {
    const i = e[t];
    return se(i) && !se(n) ? (i.value = n, !0) : Reflect.set(e, t, n, s);
  }
};
function ci(e) {
  return lt(e) ? e : new Proxy(e, Er);
}
class Tr {
  constructor(t, n, s) {
    this.fn = t, this.setter = n, this._value = void 0, this.dep = new zn(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Rt - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = s;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    z !== this)
      return Ys(this, !0), !0;
  }
  get value() {
    const t = this.dep.track();
    return Xs(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter && this.setter(t);
  }
}
function Ar(e, t, n = !1) {
  let s, i;
  return D(e) ? s = e : (s = e.get, i = e.set), new Tr(s, i, n);
}
const Kt = {}, Jt = /* @__PURE__ */ new WeakMap();
let it;
function Ir(e, t = !1, n = it) {
  if (n) {
    let s = Jt.get(n);
    s || Jt.set(n, s = []), s.push(e);
  }
}
function Pr(e, t, n = q) {
  const { immediate: s, deep: i, once: r, scheduler: o, augmentJob: l, call: f } = n, h = (E) => i ? E : ve(E) || i === !1 || i === 0 ? Je(E, 1) : Je(E);
  let a, p, S, O, F = !1, C = !1;
  if (se(e) ? (p = () => e.value, F = ve(e)) : lt(e) ? (p = () => h(e), F = !0) : R(e) ? (C = !0, F = e.some((E) => lt(E) || ve(E)), p = () => e.map((E) => {
    if (se(E))
      return E.value;
    if (lt(E))
      return h(E);
    if (D(E))
      return f ? f(E, 2) : E();
  })) : D(e) ? t ? p = f ? () => f(e, 2) : e : p = () => {
    if (S) {
      We();
      try {
        S();
      } finally {
        Ue();
      }
    }
    const E = it;
    it = a;
    try {
      return f ? f(e, 3, [O]) : e(O);
    } finally {
      it = E;
    }
  } : p = Re, t && i) {
    const E = p, $ = i === !0 ? 1 / 0 : i;
    p = () => Je(E(), $);
  }
  const P = sr(), I = () => {
    a.stop(), P && P.active && Wn(P.effects, a);
  };
  if (r && t) {
    const E = t;
    t = (...$) => {
      E(...$), I();
    };
  }
  let N = C ? new Array(e.length).fill(Kt) : Kt;
  const H = (E) => {
    if (!(!(a.flags & 1) || !a.dirty && !E))
      if (t) {
        const $ = a.run();
        if (i || F || (C ? $.some((fe, X) => Ge(fe, N[X])) : Ge($, N))) {
          S && S();
          const fe = it;
          it = a;
          try {
            const X = [
              $,
              // pass undefined as the old value when it's changed for the first time
              N === Kt ? void 0 : C && N[0] === Kt ? [] : N,
              O
            ];
            N = $, f ? f(t, 3, X) : (
              // @ts-expect-error
              t(...X)
            );
          } finally {
            it = fe;
          }
        }
      } else
        a.run();
  };
  return l && l(H), a = new Js(p), a.scheduler = o ? () => o(H, !1) : H, O = (E) => Ir(E, !1, a), S = a.onStop = () => {
    const E = Jt.get(a);
    if (E) {
      if (f)
        f(E, 4);
      else
        for (const $ of E) $();
      Jt.delete(a);
    }
  }, t ? s ? H(!0) : N = a.run() : o ? o(H.bind(null, !0), !0) : a.run(), I.pause = a.pause.bind(a), I.resume = a.resume.bind(a), I.stop = I, I;
}
function Je(e, t = 1 / 0, n) {
  if (t <= 0 || !Y(e) || e.__v_skip || (n = n || /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t))
    return e;
  if (n.set(e, t), t--, se(e))
    Je(e.value, t, n);
  else if (R(e))
    for (let s = 0; s < e.length; s++)
      Je(e[s], t, n);
  else if (Ls(e) || dt(e))
    e.forEach((s) => {
      Je(s, t, n);
    });
  else if (Bs(e)) {
    for (const s in e)
      Je(e[s], t, n);
    for (const s of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, s) && Je(e[s], t, n);
  }
  return e;
}
function Ht(e, t, n, s) {
  try {
    return s ? e(...s) : e();
  } catch (i) {
    on(i, t, n);
  }
}
function Fe(e, t, n, s) {
  if (D(e)) {
    const i = Ht(e, t, n, s);
    return i && Ws(i) && i.catch((r) => {
      on(r, t, n);
    }), i;
  }
  if (R(e)) {
    const i = [];
    for (let r = 0; r < e.length; r++)
      i.push(Fe(e[r], t, n, s));
    return i;
  }
}
function on(e, t, n, s = !0) {
  const i = t ? t.vnode : null, { errorHandler: r, throwUnhandledErrorInProduction: o } = t && t.appContext.config || q;
  if (t) {
    let l = t.parent;
    const f = t.proxy, h = `https://vuejs.org/error-reference/#runtime-${n}`;
    for (; l; ) {
      const a = l.ec;
      if (a) {
        for (let p = 0; p < a.length; p++)
          if (a[p](e, f, h) === !1)
            return;
      }
      l = l.parent;
    }
    if (r) {
      We(), Ht(r, null, 10, [
        e,
        f,
        h
      ]), Ue();
      return;
    }
  }
  Mr(e, n, i, s, o);
}
function Mr(e, t, n, s = !0, i = !1) {
  if (i)
    throw e;
  console.error(e);
}
const le = [];
let Te = -1;
const gt = [];
let qe = null, at = 0;
const fi = /* @__PURE__ */ Promise.resolve();
let Gt = null;
function Rr(e) {
  const t = Gt || fi;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function Fr(e) {
  let t = Te + 1, n = le.length;
  for (; t < n; ) {
    const s = t + n >>> 1, i = le[s], r = Dt(i);
    r < e || r === e && i.flags & 2 ? t = s + 1 : n = s;
  }
  return t;
}
function Yn(e) {
  if (!(e.flags & 1)) {
    const t = Dt(e), n = le[le.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(e.flags & 2) && t >= Dt(n) ? le.push(e) : le.splice(Fr(t), 0, e), e.flags |= 1, ui();
  }
}
function ui() {
  Gt || (Gt = fi.then(hi));
}
function Dr(e) {
  R(e) ? gt.push(...e) : qe && e.id === -1 ? qe.splice(at + 1, 0, e) : e.flags & 1 || (gt.push(e), e.flags |= 1), ui();
}
function as(e, t, n = Te + 1) {
  for (; n < le.length; n++) {
    const s = le[n];
    if (s && s.flags & 2) {
      if (e && s.id !== e.uid)
        continue;
      le.splice(n, 1), n--, s.flags & 4 && (s.flags &= -2), s(), s.flags & 4 || (s.flags &= -2);
    }
  }
}
function ai(e) {
  if (gt.length) {
    const t = [...new Set(gt)].sort(
      (n, s) => Dt(n) - Dt(s)
    );
    if (gt.length = 0, qe) {
      qe.push(...t);
      return;
    }
    for (qe = t, at = 0; at < qe.length; at++) {
      const n = qe[at];
      n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), n.flags &= -2;
    }
    qe = null, at = 0;
  }
}
const Dt = (e) => e.id == null ? e.flags & 2 ? -1 : 1 / 0 : e.id;
function hi(e) {
  try {
    for (Te = 0; Te < le.length; Te++) {
      const t = le[Te];
      t && !(t.flags & 8) && (t.flags & 4 && (t.flags &= -2), Ht(
        t,
        t.i,
        t.i ? 15 : 14
      ), t.flags & 4 || (t.flags &= -2));
    }
  } finally {
    for (; Te < le.length; Te++) {
      const t = le[Te];
      t && (t.flags &= -2);
    }
    Te = -1, le.length = 0, ai(), Gt = null, (le.length || gt.length) && hi();
  }
}
let Me = null, di = null;
function Yt(e) {
  const t = Me;
  return Me = e, di = e && e.type.__scopeId || null, t;
}
function Nr(e, t = Me, n) {
  if (!t || e._n)
    return e;
  const s = (...i) => {
    s._d && ys(-1);
    const r = Yt(t);
    let o;
    try {
      o = e(...i);
    } finally {
      Yt(r), s._d && ys(1);
    }
    return o;
  };
  return s._n = !0, s._c = !0, s._d = !0, s;
}
function tt(e, t, n, s) {
  const i = e.dirs, r = t && t.dirs;
  for (let o = 0; o < i.length; o++) {
    const l = i[o];
    r && (l.oldValue = r[o].value);
    let f = l.dir[s];
    f && (We(), Fe(f, n, 8, [
      e.el,
      l,
      e,
      t
    ]), Ue());
  }
}
const $r = Symbol("_vte"), jr = (e) => e.__isTeleport, Hr = Symbol("_leaveCb");
function Zn(e, t) {
  e.shapeFlag & 6 && e.component ? (e.transition = t, Zn(e.component.subTree, t)) : e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
// @__NO_SIDE_EFFECTS__
function Qn(e, t) {
  return D(e) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    ie({ name: e.name }, t, { setup: e })
  ) : e;
}
function pi(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
}
const Zt = /* @__PURE__ */ new WeakMap();
function At(e, t, n, s, i = !1) {
  if (R(e)) {
    e.forEach(
      (F, C) => At(
        F,
        t && (R(t) ? t[C] : t),
        n,
        s,
        i
      )
    );
    return;
  }
  if (It(s) && !i) {
    s.shapeFlag & 512 && s.type.__asyncResolved && s.component.subTree.component && At(e, t, n, s.component.subTree);
    return;
  }
  const r = s.shapeFlag & 4 ? ns(s.component) : s.el, o = i ? null : r, { i: l, r: f } = e, h = t && t.r, a = l.refs === q ? l.refs = {} : l.refs, p = l.setupState, S = L(p), O = p === q ? Hs : (F) => W(S, F);
  if (h != null && h !== f) {
    if (hs(t), Q(h))
      a[h] = null, O(h) && (p[h] = null);
    else if (se(h)) {
      h.value = null;
      const F = t;
      F.k && (a[F.k] = null);
    }
  }
  if (D(f))
    Ht(f, l, 12, [o, a]);
  else {
    const F = Q(f), C = se(f);
    if (F || C) {
      const P = () => {
        if (e.f) {
          const I = F ? O(f) ? p[f] : a[f] : f.value;
          if (i)
            R(I) && Wn(I, r);
          else if (R(I))
            I.includes(r) || I.push(r);
          else if (F)
            a[f] = [r], O(f) && (p[f] = a[f]);
          else {
            const N = [r];
            f.value = N, e.k && (a[e.k] = N);
          }
        } else F ? (a[f] = o, O(f) && (p[f] = o)) : C && (f.value = o, e.k && (a[e.k] = o));
      };
      if (o) {
        const I = () => {
          P(), Zt.delete(e);
        };
        I.id = -1, Zt.set(e, I), ge(I, n);
      } else
        hs(e), P();
    }
  }
}
function hs(e) {
  const t = Zt.get(e);
  t && (t.flags |= 8, Zt.delete(e));
}
sn().requestIdleCallback;
sn().cancelIdleCallback;
const It = (e) => !!e.type.__asyncLoader, gi = (e) => e.type.__isKeepAlive;
function Lr(e, t) {
  mi(e, "a", t);
}
function Wr(e, t) {
  mi(e, "da", t);
}
function mi(e, t, n = ce) {
  const s = e.__wdc || (e.__wdc = () => {
    let i = n;
    for (; i; ) {
      if (i.isDeactivated)
        return;
      i = i.parent;
    }
    return e();
  });
  if (ln(t, s, n), n) {
    let i = n.parent;
    for (; i && i.parent; )
      gi(i.parent.vnode) && Ur(s, t, n, i), i = i.parent;
  }
}
function Ur(e, t, n, s) {
  const i = ln(
    t,
    e,
    s,
    !0
    /* prepend */
  );
  bi(() => {
    Wn(s[t], i);
  }, n);
}
function ln(e, t, n = ce, s = !1) {
  if (n) {
    const i = n[e] || (n[e] = []), r = t.__weh || (t.__weh = (...o) => {
      We();
      const l = Lt(n), f = Fe(t, n, e, o);
      return l(), Ue(), f;
    });
    return s ? i.unshift(r) : i.push(r), r;
  }
}
const Ve = (e) => (t, n = ce) => {
  (!$t || e === "sp") && ln(e, (...s) => t(...s), n);
}, Br = Ve("bm"), _i = Ve("m"), Vr = Ve(
  "bu"
), Kr = Ve("u"), zr = Ve(
  "bum"
), bi = Ve("um"), qr = Ve(
  "sp"
), kr = Ve("rtg"), Jr = Ve("rtc");
function Gr(e, t = ce) {
  ln("ec", e, t);
}
const Yr = Symbol.for("v-ndc");
function Zr(e, t, n, s) {
  let i;
  const r = n, o = R(e);
  if (o || Q(e)) {
    const l = o && lt(e);
    let f = !1, h = !1;
    l && (f = !ve(e), h = Be(e), e = rn(e)), i = new Array(e.length);
    for (let a = 0, p = e.length; a < p; a++)
      i[a] = t(
        f ? h ? _t(ye(e[a])) : ye(e[a]) : e[a],
        a,
        void 0,
        r
      );
  } else if (typeof e == "number") {
    i = new Array(e);
    for (let l = 0; l < e; l++)
      i[l] = t(l + 1, l, void 0, r);
  } else if (Y(e))
    if (e[Symbol.iterator])
      i = Array.from(
        e,
        (l, f) => t(l, f, void 0, r)
      );
    else {
      const l = Object.keys(e);
      i = new Array(l.length);
      for (let f = 0, h = l.length; f < h; f++) {
        const a = l[f];
        i[f] = t(e[a], a, f, r);
      }
    }
  else
    i = [];
  return i;
}
const Pn = (e) => e ? Li(e) ? ns(e) : Pn(e.parent) : null, Pt = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ ie(/* @__PURE__ */ Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => e.props,
    $attrs: (e) => e.attrs,
    $slots: (e) => e.slots,
    $refs: (e) => e.refs,
    $parent: (e) => Pn(e.parent),
    $root: (e) => Pn(e.root),
    $host: (e) => e.ce,
    $emit: (e) => e.emit,
    $options: (e) => xi(e),
    $forceUpdate: (e) => e.f || (e.f = () => {
      Yn(e.update);
    }),
    $nextTick: (e) => e.n || (e.n = Rr.bind(e.proxy)),
    $watch: (e) => fo.bind(e)
  })
), bn = (e, t) => e !== q && !e.__isScriptSetup && W(e, t), Qr = {
  get({ _: e }, t) {
    if (t === "__v_skip")
      return !0;
    const { ctx: n, setupState: s, data: i, props: r, accessCache: o, type: l, appContext: f } = e;
    if (t[0] !== "$") {
      const S = o[t];
      if (S !== void 0)
        switch (S) {
          case 1:
            return s[t];
          case 2:
            return i[t];
          case 4:
            return n[t];
          case 3:
            return r[t];
        }
      else {
        if (bn(s, t))
          return o[t] = 1, s[t];
        if (i !== q && W(i, t))
          return o[t] = 2, i[t];
        if (W(r, t))
          return o[t] = 3, r[t];
        if (n !== q && W(n, t))
          return o[t] = 4, n[t];
        Mn && (o[t] = 0);
      }
    }
    const h = Pt[t];
    let a, p;
    if (h)
      return t === "$attrs" && ne(e.attrs, "get", ""), h(e);
    if (
      // css module (injected by vue-loader)
      (a = l.__cssModules) && (a = a[t])
    )
      return a;
    if (n !== q && W(n, t))
      return o[t] = 4, n[t];
    if (
      // global properties
      p = f.config.globalProperties, W(p, t)
    )
      return p[t];
  },
  set({ _: e }, t, n) {
    const { data: s, setupState: i, ctx: r } = e;
    return bn(i, t) ? (i[t] = n, !0) : s !== q && W(s, t) ? (s[t] = n, !0) : W(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (r[t] = n, !0);
  },
  has({
    _: { data: e, setupState: t, accessCache: n, ctx: s, appContext: i, props: r, type: o }
  }, l) {
    let f;
    return !!(n[l] || e !== q && l[0] !== "$" && W(e, l) || bn(t, l) || W(r, l) || W(s, l) || W(Pt, l) || W(i.config.globalProperties, l) || (f = o.__cssModules) && f[l]);
  },
  defineProperty(e, t, n) {
    return n.get != null ? e._.accessCache[t] = 0 : W(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
  }
};
function ds(e) {
  return R(e) ? e.reduce(
    (t, n) => (t[n] = null, t),
    {}
  ) : e;
}
let Mn = !0;
function Xr(e) {
  const t = xi(e), n = e.proxy, s = e.ctx;
  Mn = !1, t.beforeCreate && ps(t.beforeCreate, e, "bc");
  const {
    // state
    data: i,
    computed: r,
    methods: o,
    watch: l,
    provide: f,
    inject: h,
    // lifecycle
    created: a,
    beforeMount: p,
    mounted: S,
    beforeUpdate: O,
    updated: F,
    activated: C,
    deactivated: P,
    beforeDestroy: I,
    beforeUnmount: N,
    destroyed: H,
    unmounted: E,
    render: $,
    renderTracked: fe,
    renderTriggered: X,
    errorCaptured: k,
    serverPrefetch: Z,
    // public API
    expose: J,
    inheritAttrs: ee,
    // assets
    components: ue,
    directives: _e,
    filters: Xe
  } = t;
  if (h && eo(h, s, null), o)
    for (const G in o) {
      const V = o[G];
      D(V) && (s[G] = V.bind(n));
    }
  if (i) {
    const G = i.call(n, n);
    Y(G) && (e.data = kn(G));
  }
  if (Mn = !0, r)
    for (const G in r) {
      const V = r[G], De = D(V) ? V.bind(n, n) : D(V.get) ? V.get.bind(n, n) : Re, Wt = !D(V) && D(V.set) ? V.set.bind(n) : Re, et = $n({
        get: De,
        set: Wt
      });
      Object.defineProperty(s, G, {
        enumerable: !0,
        configurable: !0,
        get: () => et.value,
        set: (we) => et.value = we
      });
    }
  if (l)
    for (const G in l)
      vi(l[G], s, n, G);
  if (f) {
    const G = D(f) ? f.call(n) : f;
    Reflect.ownKeys(G).forEach((V) => {
      oo(V, G[V]);
    });
  }
  a && ps(a, e, "c");
  function te(G, V) {
    R(V) ? V.forEach((De) => G(De.bind(n))) : V && G(V.bind(n));
  }
  if (te(Br, p), te(_i, S), te(Vr, O), te(Kr, F), te(Lr, C), te(Wr, P), te(Gr, k), te(Jr, fe), te(kr, X), te(zr, N), te(bi, E), te(qr, Z), R(J))
    if (J.length) {
      const G = e.exposed || (e.exposed = {});
      J.forEach((V) => {
        Object.defineProperty(G, V, {
          get: () => n[V],
          set: (De) => n[V] = De,
          enumerable: !0
        });
      });
    } else e.exposed || (e.exposed = {});
  $ && e.render === Re && (e.render = $), ee != null && (e.inheritAttrs = ee), ue && (e.components = ue), _e && (e.directives = _e), Z && pi(e);
}
function eo(e, t, n = Re) {
  R(e) && (e = Rn(e));
  for (const s in e) {
    const i = e[s];
    let r;
    Y(i) ? "default" in i ? r = zt(
      i.from || s,
      i.default,
      !0
    ) : r = zt(i.from || s) : r = zt(i), se(r) ? Object.defineProperty(t, s, {
      enumerable: !0,
      configurable: !0,
      get: () => r.value,
      set: (o) => r.value = o
    }) : t[s] = r;
  }
}
function ps(e, t, n) {
  Fe(
    R(e) ? e.map((s) => s.bind(t.proxy)) : e.bind(t.proxy),
    t,
    n
  );
}
function vi(e, t, n, s) {
  let i = s.includes(".") ? Si(n, s) : () => n[s];
  if (Q(e)) {
    const r = t[e];
    D(r) && vn(i, r);
  } else if (D(e))
    vn(i, e.bind(n));
  else if (Y(e))
    if (R(e))
      e.forEach((r) => vi(r, t, n, s));
    else {
      const r = D(e.handler) ? e.handler.bind(n) : t[e.handler];
      D(r) && vn(i, r, e);
    }
}
function xi(e) {
  const t = e.type, { mixins: n, extends: s } = t, {
    mixins: i,
    optionsCache: r,
    config: { optionMergeStrategies: o }
  } = e.appContext, l = r.get(t);
  let f;
  return l ? f = l : !i.length && !n && !s ? f = t : (f = {}, i.length && i.forEach(
    (h) => Qt(f, h, o, !0)
  ), Qt(f, t, o)), Y(t) && r.set(t, f), f;
}
function Qt(e, t, n, s = !1) {
  const { mixins: i, extends: r } = t;
  r && Qt(e, r, n, !0), i && i.forEach(
    (o) => Qt(e, o, n, !0)
  );
  for (const o in t)
    if (!(s && o === "expose")) {
      const l = to[o] || n && n[o];
      e[o] = l ? l(e[o], t[o]) : t[o];
    }
  return e;
}
const to = {
  data: gs,
  props: ms,
  emits: ms,
  // objects
  methods: Ot,
  computed: Ot,
  // lifecycle
  beforeCreate: re,
  created: re,
  beforeMount: re,
  mounted: re,
  beforeUpdate: re,
  updated: re,
  beforeDestroy: re,
  beforeUnmount: re,
  destroyed: re,
  unmounted: re,
  activated: re,
  deactivated: re,
  errorCaptured: re,
  serverPrefetch: re,
  // assets
  components: Ot,
  directives: Ot,
  // watch
  watch: so,
  // provide / inject
  provide: gs,
  inject: no
};
function gs(e, t) {
  return t ? e ? function() {
    return ie(
      D(e) ? e.call(this, this) : e,
      D(t) ? t.call(this, this) : t
    );
  } : t : e;
}
function no(e, t) {
  return Ot(Rn(e), Rn(t));
}
function Rn(e) {
  if (R(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++)
      t[e[n]] = e[n];
    return t;
  }
  return e;
}
function re(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function Ot(e, t) {
  return e ? ie(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function ms(e, t) {
  return e ? R(e) && R(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : ie(
    /* @__PURE__ */ Object.create(null),
    ds(e),
    ds(t ?? {})
  ) : t;
}
function so(e, t) {
  if (!e) return t;
  if (!t) return e;
  const n = ie(/* @__PURE__ */ Object.create(null), e);
  for (const s in t)
    n[s] = re(e[s], t[s]);
  return n;
}
function yi() {
  return {
    app: null,
    config: {
      isNativeTag: Hs,
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
let io = 0;
function ro(e, t) {
  return function(s, i = null) {
    D(s) || (s = ie({}, s)), i != null && !Y(i) && (i = null);
    const r = yi(), o = /* @__PURE__ */ new WeakSet(), l = [];
    let f = !1;
    const h = r.app = {
      _uid: io++,
      _component: s,
      _props: i,
      _container: null,
      _context: r,
      _instance: null,
      version: Bo,
      get config() {
        return r.config;
      },
      set config(a) {
      },
      use(a, ...p) {
        return o.has(a) || (a && D(a.install) ? (o.add(a), a.install(h, ...p)) : D(a) && (o.add(a), a(h, ...p))), h;
      },
      mixin(a) {
        return r.mixins.includes(a) || r.mixins.push(a), h;
      },
      component(a, p) {
        return p ? (r.components[a] = p, h) : r.components[a];
      },
      directive(a, p) {
        return p ? (r.directives[a] = p, h) : r.directives[a];
      },
      mount(a, p, S) {
        if (!f) {
          const O = h._ceVNode || Le(s, i);
          return O.appContext = r, S === !0 ? S = "svg" : S === !1 && (S = void 0), e(O, a, S), f = !0, h._container = a, a.__vue_app__ = h, ns(O.component);
        }
      },
      onUnmount(a) {
        l.push(a);
      },
      unmount() {
        f && (Fe(
          l,
          h._instance,
          16
        ), e(null, h._container), delete h._container.__vue_app__);
      },
      provide(a, p) {
        return r.provides[a] = p, h;
      },
      runWithContext(a) {
        const p = mt;
        mt = h;
        try {
          return a();
        } finally {
          mt = p;
        }
      }
    };
    return h;
  };
}
let mt = null;
function oo(e, t) {
  if (ce) {
    let n = ce.provides;
    const s = ce.parent && ce.parent.provides;
    s === n && (n = ce.provides = Object.create(s)), n[e] = t;
  }
}
function zt(e, t, n = !1) {
  const s = $o();
  if (s || mt) {
    let i = mt ? mt._context.provides : s ? s.parent == null || s.ce ? s.vnode.appContext && s.vnode.appContext.provides : s.parent.provides : void 0;
    if (i && e in i)
      return i[e];
    if (arguments.length > 1)
      return n && D(t) ? t.call(s && s.proxy) : t;
  }
}
const lo = Symbol.for("v-scx"), co = () => zt(lo);
function vn(e, t, n) {
  return wi(e, t, n);
}
function wi(e, t, n = q) {
  const { immediate: s, deep: i, flush: r, once: o } = n, l = ie({}, n), f = t && s || !t && r !== "post";
  let h;
  if ($t) {
    if (r === "sync") {
      const O = co();
      h = O.__watcherHandles || (O.__watcherHandles = []);
    } else if (!f) {
      const O = () => {
      };
      return O.stop = Re, O.resume = Re, O.pause = Re, O;
    }
  }
  const a = ce;
  l.call = (O, F, C) => Fe(O, a, F, C);
  let p = !1;
  r === "post" ? l.scheduler = (O) => {
    ge(O, a && a.suspense);
  } : r !== "sync" && (p = !0, l.scheduler = (O, F) => {
    F ? O() : Yn(O);
  }), l.augmentJob = (O) => {
    t && (O.flags |= 4), p && (O.flags |= 2, a && (O.id = a.uid, O.i = a));
  };
  const S = Pr(e, t, l);
  return $t && (h ? h.push(S) : f && S()), S;
}
function fo(e, t, n) {
  const s = this.proxy, i = Q(e) ? e.includes(".") ? Si(s, e) : () => s[e] : e.bind(s, s);
  let r;
  D(t) ? r = t : (r = t.handler, n = t);
  const o = Lt(this), l = wi(i, r.bind(s), n);
  return o(), l;
}
function Si(e, t) {
  const n = t.split(".");
  return () => {
    let s = e;
    for (let i = 0; i < n.length && s; i++)
      s = s[n[i]];
    return s;
  };
}
const uo = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${Ye(t)}Modifiers`] || e[`${ct(t)}Modifiers`];
function ao(e, t, ...n) {
  if (e.isUnmounted) return;
  const s = e.vnode.props || q;
  let i = n;
  const r = t.startsWith("update:"), o = r && uo(s, t.slice(7));
  o && (o.trim && (i = n.map((a) => Q(a) ? a.trim() : a)), o.number && (i = n.map(Gi)));
  let l, f = s[l = hn(t)] || // also try camelCase event handler (#2249)
  s[l = hn(Ye(t))];
  !f && r && (f = s[l = hn(ct(t))]), f && Fe(
    f,
    e,
    6,
    i
  );
  const h = s[l + "Once"];
  if (h) {
    if (!e.emitted)
      e.emitted = {};
    else if (e.emitted[l])
      return;
    e.emitted[l] = !0, Fe(
      h,
      e,
      6,
      i
    );
  }
}
const ho = /* @__PURE__ */ new WeakMap();
function Oi(e, t, n = !1) {
  const s = n ? ho : t.emitsCache, i = s.get(e);
  if (i !== void 0)
    return i;
  const r = e.emits;
  let o = {}, l = !1;
  if (!D(e)) {
    const f = (h) => {
      const a = Oi(h, t, !0);
      a && (l = !0, ie(o, a));
    };
    !n && t.mixins.length && t.mixins.forEach(f), e.extends && f(e.extends), e.mixins && e.mixins.forEach(f);
  }
  return !r && !l ? (Y(e) && s.set(e, null), null) : (R(r) ? r.forEach((f) => o[f] = null) : ie(o, r), Y(e) && s.set(e, o), o);
}
function cn(e, t) {
  return !e || !en(t) ? !1 : (t = t.slice(2).replace(/Once$/, ""), W(e, t[0].toLowerCase() + t.slice(1)) || W(e, ct(t)) || W(e, t));
}
function _s(e) {
  const {
    type: t,
    vnode: n,
    proxy: s,
    withProxy: i,
    propsOptions: [r],
    slots: o,
    attrs: l,
    emit: f,
    render: h,
    renderCache: a,
    props: p,
    data: S,
    setupState: O,
    ctx: F,
    inheritAttrs: C
  } = e, P = Yt(e);
  let I, N;
  try {
    if (n.shapeFlag & 4) {
      const E = i || s, $ = E;
      I = Pe(
        h.call(
          $,
          E,
          a,
          p,
          O,
          S,
          F
        )
      ), N = l;
    } else {
      const E = t;
      I = Pe(
        E.length > 1 ? E(
          p,
          { attrs: l, slots: o, emit: f }
        ) : E(
          p,
          null
        )
      ), N = t.props ? l : po(l);
    }
  } catch (E) {
    Mt.length = 0, on(E, e, 1), I = Le(Ze);
  }
  let H = I;
  if (N && C !== !1) {
    const E = Object.keys(N), { shapeFlag: $ } = H;
    E.length && $ & 7 && (r && E.some(Ln) && (N = go(
      N,
      r
    )), H = bt(H, N, !1, !0));
  }
  return n.dirs && (H = bt(H, null, !1, !0), H.dirs = H.dirs ? H.dirs.concat(n.dirs) : n.dirs), n.transition && Zn(H, n.transition), I = H, Yt(P), I;
}
const po = (e) => {
  let t;
  for (const n in e)
    (n === "class" || n === "style" || en(n)) && ((t || (t = {}))[n] = e[n]);
  return t;
}, go = (e, t) => {
  const n = {};
  for (const s in e)
    (!Ln(s) || !(s.slice(9) in t)) && (n[s] = e[s]);
  return n;
};
function mo(e, t, n) {
  const { props: s, children: i, component: r } = e, { props: o, children: l, patchFlag: f } = t, h = r.emitsOptions;
  if (t.dirs || t.transition)
    return !0;
  if (n && f >= 0) {
    if (f & 1024)
      return !0;
    if (f & 16)
      return s ? bs(s, o, h) : !!o;
    if (f & 8) {
      const a = t.dynamicProps;
      for (let p = 0; p < a.length; p++) {
        const S = a[p];
        if (o[S] !== s[S] && !cn(h, S))
          return !0;
      }
    }
  } else
    return (i || l) && (!l || !l.$stable) ? !0 : s === o ? !1 : s ? o ? bs(s, o, h) : !0 : !!o;
  return !1;
}
function bs(e, t, n) {
  const s = Object.keys(t);
  if (s.length !== Object.keys(e).length)
    return !0;
  for (let i = 0; i < s.length; i++) {
    const r = s[i];
    if (t[r] !== e[r] && !cn(n, r))
      return !0;
  }
  return !1;
}
function _o({ vnode: e, parent: t }, n) {
  for (; t; ) {
    const s = t.subTree;
    if (s.suspense && s.suspense.activeBranch === e && (s.el = e.el), s === e)
      (e = t.vnode).el = n, t = t.parent;
    else
      break;
  }
}
const Ci = {}, Ei = () => Object.create(Ci), Ti = (e) => Object.getPrototypeOf(e) === Ci;
function bo(e, t, n, s = !1) {
  const i = {}, r = Ei();
  e.propsDefaults = /* @__PURE__ */ Object.create(null), Ai(e, t, i, r);
  for (const o in e.propsOptions[0])
    o in i || (i[o] = void 0);
  n ? e.props = s ? i : wr(i) : e.type.props ? e.props = i : e.props = r, e.attrs = r;
}
function vo(e, t, n, s) {
  const {
    props: i,
    attrs: r,
    vnode: { patchFlag: o }
  } = e, l = L(i), [f] = e.propsOptions;
  let h = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (s || o > 0) && !(o & 16)
  ) {
    if (o & 8) {
      const a = e.vnode.dynamicProps;
      for (let p = 0; p < a.length; p++) {
        let S = a[p];
        if (cn(e.emitsOptions, S))
          continue;
        const O = t[S];
        if (f)
          if (W(r, S))
            O !== r[S] && (r[S] = O, h = !0);
          else {
            const F = Ye(S);
            i[F] = Fn(
              f,
              l,
              F,
              O,
              e,
              !1
            );
          }
        else
          O !== r[S] && (r[S] = O, h = !0);
      }
    }
  } else {
    Ai(e, t, i, r) && (h = !0);
    let a;
    for (const p in l)
      (!t || // for camelCase
      !W(t, p) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((a = ct(p)) === p || !W(t, a))) && (f ? n && // for camelCase
      (n[p] !== void 0 || // for kebab-case
      n[a] !== void 0) && (i[p] = Fn(
        f,
        l,
        p,
        void 0,
        e,
        !0
      )) : delete i[p]);
    if (r !== l)
      for (const p in r)
        (!t || !W(t, p)) && (delete r[p], h = !0);
  }
  h && He(e.attrs, "set", "");
}
function Ai(e, t, n, s) {
  const [i, r] = e.propsOptions;
  let o = !1, l;
  if (t)
    for (let f in t) {
      if (Ct(f))
        continue;
      const h = t[f];
      let a;
      i && W(i, a = Ye(f)) ? !r || !r.includes(a) ? n[a] = h : (l || (l = {}))[a] = h : cn(e.emitsOptions, f) || (!(f in s) || h !== s[f]) && (s[f] = h, o = !0);
    }
  if (r) {
    const f = L(n), h = l || q;
    for (let a = 0; a < r.length; a++) {
      const p = r[a];
      n[p] = Fn(
        i,
        f,
        p,
        h[p],
        e,
        !W(h, p)
      );
    }
  }
  return o;
}
function Fn(e, t, n, s, i, r) {
  const o = e[n];
  if (o != null) {
    const l = W(o, "default");
    if (l && s === void 0) {
      const f = o.default;
      if (o.type !== Function && !o.skipFactory && D(f)) {
        const { propsDefaults: h } = i;
        if (n in h)
          s = h[n];
        else {
          const a = Lt(i);
          s = h[n] = f.call(
            null,
            t
          ), a();
        }
      } else
        s = f;
      i.ce && i.ce._setProp(n, s);
    }
    o[
      0
      /* shouldCast */
    ] && (r && !l ? s = !1 : o[
      1
      /* shouldCastTrue */
    ] && (s === "" || s === ct(n)) && (s = !0));
  }
  return s;
}
const xo = /* @__PURE__ */ new WeakMap();
function Ii(e, t, n = !1) {
  const s = n ? xo : t.propsCache, i = s.get(e);
  if (i)
    return i;
  const r = e.props, o = {}, l = [];
  let f = !1;
  if (!D(e)) {
    const a = (p) => {
      f = !0;
      const [S, O] = Ii(p, t, !0);
      ie(o, S), O && l.push(...O);
    };
    !n && t.mixins.length && t.mixins.forEach(a), e.extends && a(e.extends), e.mixins && e.mixins.forEach(a);
  }
  if (!r && !f)
    return Y(e) && s.set(e, ht), ht;
  if (R(r))
    for (let a = 0; a < r.length; a++) {
      const p = Ye(r[a]);
      vs(p) && (o[p] = q);
    }
  else if (r)
    for (const a in r) {
      const p = Ye(a);
      if (vs(p)) {
        const S = r[a], O = o[p] = R(S) || D(S) ? { type: S } : ie({}, S), F = O.type;
        let C = !1, P = !0;
        if (R(F))
          for (let I = 0; I < F.length; ++I) {
            const N = F[I], H = D(N) && N.name;
            if (H === "Boolean") {
              C = !0;
              break;
            } else H === "String" && (P = !1);
          }
        else
          C = D(F) && F.name === "Boolean";
        O[
          0
          /* shouldCast */
        ] = C, O[
          1
          /* shouldCastTrue */
        ] = P, (C || W(O, "default")) && l.push(p);
      }
    }
  const h = [o, l];
  return Y(e) && s.set(e, h), h;
}
function vs(e) {
  return e[0] !== "$" && !Ct(e);
}
const Xn = (e) => e === "_" || e === "_ctx" || e === "$stable", es = (e) => R(e) ? e.map(Pe) : [Pe(e)], yo = (e, t, n) => {
  if (t._n)
    return t;
  const s = Nr((...i) => es(t(...i)), n);
  return s._c = !1, s;
}, Pi = (e, t, n) => {
  const s = e._ctx;
  for (const i in e) {
    if (Xn(i)) continue;
    const r = e[i];
    if (D(r))
      t[i] = yo(i, r, s);
    else if (r != null) {
      const o = es(r);
      t[i] = () => o;
    }
  }
}, Mi = (e, t) => {
  const n = es(t);
  e.slots.default = () => n;
}, Ri = (e, t, n) => {
  for (const s in t)
    (n || !Xn(s)) && (e[s] = t[s]);
}, wo = (e, t, n) => {
  const s = e.slots = Ei();
  if (e.vnode.shapeFlag & 32) {
    const i = t._;
    i ? (Ri(s, t, n), n && Ks(s, "_", i, !0)) : Pi(t, s);
  } else t && Mi(e, t);
}, So = (e, t, n) => {
  const { vnode: s, slots: i } = e;
  let r = !0, o = q;
  if (s.shapeFlag & 32) {
    const l = t._;
    l ? n && l === 1 ? r = !1 : Ri(i, t, n) : (r = !t.$stable, Pi(t, i)), o = t;
  } else t && (Mi(e, t), o = { default: 1 });
  if (r)
    for (const l in i)
      !Xn(l) && o[l] == null && delete i[l];
}, ge = Ao;
function Oo(e) {
  return Co(e);
}
function Co(e, t) {
  const n = sn();
  n.__VUE__ = !0;
  const {
    insert: s,
    remove: i,
    patchProp: r,
    createElement: o,
    createText: l,
    createComment: f,
    setText: h,
    setElementText: a,
    parentNode: p,
    nextSibling: S,
    setScopeId: O = Re,
    insertStaticContent: F
  } = e, C = (c, u, d, b = null, g = null, m = null, y = void 0, x = null, v = !!u.dynamicChildren) => {
    if (c === u)
      return;
    c && !St(c, u) && (b = Ut(c), we(c, g, m, !0), c = null), u.patchFlag === -2 && (v = !1, u.dynamicChildren = null);
    const { type: _, ref: A, shapeFlag: w } = u;
    switch (_) {
      case fn:
        P(c, u, d, b);
        break;
      case Ze:
        I(c, u, d, b);
        break;
      case yn:
        c == null && N(u, d, b, y);
        break;
      case Ie:
        ue(
          c,
          u,
          d,
          b,
          g,
          m,
          y,
          x,
          v
        );
        break;
      default:
        w & 1 ? $(
          c,
          u,
          d,
          b,
          g,
          m,
          y,
          x,
          v
        ) : w & 6 ? _e(
          c,
          u,
          d,
          b,
          g,
          m,
          y,
          x,
          v
        ) : (w & 64 || w & 128) && _.process(
          c,
          u,
          d,
          b,
          g,
          m,
          y,
          x,
          v,
          xt
        );
    }
    A != null && g ? At(A, c && c.ref, m, u || c, !u) : A == null && c && c.ref != null && At(c.ref, null, m, c, !0);
  }, P = (c, u, d, b) => {
    if (c == null)
      s(
        u.el = l(u.children),
        d,
        b
      );
    else {
      const g = u.el = c.el;
      u.children !== c.children && h(g, u.children);
    }
  }, I = (c, u, d, b) => {
    c == null ? s(
      u.el = f(u.children || ""),
      d,
      b
    ) : u.el = c.el;
  }, N = (c, u, d, b) => {
    [c.el, c.anchor] = F(
      c.children,
      u,
      d,
      b,
      c.el,
      c.anchor
    );
  }, H = ({ el: c, anchor: u }, d, b) => {
    let g;
    for (; c && c !== u; )
      g = S(c), s(c, d, b), c = g;
    s(u, d, b);
  }, E = ({ el: c, anchor: u }) => {
    let d;
    for (; c && c !== u; )
      d = S(c), i(c), c = d;
    i(u);
  }, $ = (c, u, d, b, g, m, y, x, v) => {
    if (u.type === "svg" ? y = "svg" : u.type === "math" && (y = "mathml"), c == null)
      fe(
        u,
        d,
        b,
        g,
        m,
        y,
        x,
        v
      );
    else {
      const _ = c.el && c.el._isVueCE ? c.el : null;
      try {
        _ && _._beginPatch(), Z(
          c,
          u,
          g,
          m,
          y,
          x,
          v
        );
      } finally {
        _ && _._endPatch();
      }
    }
  }, fe = (c, u, d, b, g, m, y, x) => {
    let v, _;
    const { props: A, shapeFlag: w, transition: T, dirs: M } = c;
    if (v = c.el = o(
      c.type,
      m,
      A && A.is,
      A
    ), w & 8 ? a(v, c.children) : w & 16 && k(
      c.children,
      v,
      null,
      b,
      g,
      xn(c, m),
      y,
      x
    ), M && tt(c, null, b, "created"), X(v, c, c.scopeId, y, b), A) {
      for (const K in A)
        K !== "value" && !Ct(K) && r(v, K, null, A[K], m, b);
      "value" in A && r(v, "value", null, A.value, m), (_ = A.onVnodeBeforeMount) && Ee(_, b, c);
    }
    M && tt(c, null, b, "beforeMount");
    const j = Eo(g, T);
    j && T.beforeEnter(v), s(v, u, d), ((_ = A && A.onVnodeMounted) || j || M) && ge(() => {
      _ && Ee(_, b, c), j && T.enter(v), M && tt(c, null, b, "mounted");
    }, g);
  }, X = (c, u, d, b, g) => {
    if (d && O(c, d), b)
      for (let m = 0; m < b.length; m++)
        O(c, b[m]);
    if (g) {
      let m = g.subTree;
      if (u === m || Ni(m.type) && (m.ssContent === u || m.ssFallback === u)) {
        const y = g.vnode;
        X(
          c,
          y,
          y.scopeId,
          y.slotScopeIds,
          g.parent
        );
      }
    }
  }, k = (c, u, d, b, g, m, y, x, v = 0) => {
    for (let _ = v; _ < c.length; _++) {
      const A = c[_] = x ? ke(c[_]) : Pe(c[_]);
      C(
        null,
        A,
        u,
        d,
        b,
        g,
        m,
        y,
        x
      );
    }
  }, Z = (c, u, d, b, g, m, y) => {
    const x = u.el = c.el;
    let { patchFlag: v, dynamicChildren: _, dirs: A } = u;
    v |= c.patchFlag & 16;
    const w = c.props || q, T = u.props || q;
    let M;
    if (d && nt(d, !1), (M = T.onVnodeBeforeUpdate) && Ee(M, d, u, c), A && tt(u, c, d, "beforeUpdate"), d && nt(d, !0), (w.innerHTML && T.innerHTML == null || w.textContent && T.textContent == null) && a(x, ""), _ ? J(
      c.dynamicChildren,
      _,
      x,
      d,
      b,
      xn(u, g),
      m
    ) : y || V(
      c,
      u,
      x,
      null,
      d,
      b,
      xn(u, g),
      m,
      !1
    ), v > 0) {
      if (v & 16)
        ee(x, w, T, d, g);
      else if (v & 2 && w.class !== T.class && r(x, "class", null, T.class, g), v & 4 && r(x, "style", w.style, T.style, g), v & 8) {
        const j = u.dynamicProps;
        for (let K = 0; K < j.length; K++) {
          const U = j[K], ae = w[U], he = T[U];
          (he !== ae || U === "value") && r(x, U, ae, he, g, d);
        }
      }
      v & 1 && c.children !== u.children && a(x, u.children);
    } else !y && _ == null && ee(x, w, T, d, g);
    ((M = T.onVnodeUpdated) || A) && ge(() => {
      M && Ee(M, d, u, c), A && tt(u, c, d, "updated");
    }, b);
  }, J = (c, u, d, b, g, m, y) => {
    for (let x = 0; x < u.length; x++) {
      const v = c[x], _ = u[x], A = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        v.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (v.type === Ie || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !St(v, _) || // - In the case of a component, it could contain anything.
        v.shapeFlag & 198) ? p(v.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          d
        )
      );
      C(
        v,
        _,
        A,
        null,
        b,
        g,
        m,
        y,
        !0
      );
    }
  }, ee = (c, u, d, b, g) => {
    if (u !== d) {
      if (u !== q)
        for (const m in u)
          !Ct(m) && !(m in d) && r(
            c,
            m,
            u[m],
            null,
            g,
            b
          );
      for (const m in d) {
        if (Ct(m)) continue;
        const y = d[m], x = u[m];
        y !== x && m !== "value" && r(c, m, x, y, g, b);
      }
      "value" in d && r(c, "value", u.value, d.value, g);
    }
  }, ue = (c, u, d, b, g, m, y, x, v) => {
    const _ = u.el = c ? c.el : l(""), A = u.anchor = c ? c.anchor : l("");
    let { patchFlag: w, dynamicChildren: T, slotScopeIds: M } = u;
    M && (x = x ? x.concat(M) : M), c == null ? (s(_, d, b), s(A, d, b), k(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      u.children || [],
      d,
      A,
      g,
      m,
      y,
      x,
      v
    )) : w > 0 && w & 64 && T && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    c.dynamicChildren ? (J(
      c.dynamicChildren,
      T,
      d,
      g,
      m,
      y,
      x
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (u.key != null || g && u === g.subTree) && Fi(
      c,
      u,
      !0
      /* shallow */
    )) : V(
      c,
      u,
      d,
      A,
      g,
      m,
      y,
      x,
      v
    );
  }, _e = (c, u, d, b, g, m, y, x, v) => {
    u.slotScopeIds = x, c == null ? u.shapeFlag & 512 ? g.ctx.activate(
      u,
      d,
      b,
      y,
      v
    ) : Xe(
      u,
      d,
      b,
      g,
      m,
      y,
      v
    ) : un(c, u, v);
  }, Xe = (c, u, d, b, g, m, y) => {
    const x = c.component = No(
      c,
      b,
      g
    );
    if (gi(c) && (x.ctx.renderer = xt), jo(x, !1, y), x.asyncDep) {
      if (g && g.registerDep(x, te, y), !c.el) {
        const v = x.subTree = Le(Ze);
        I(null, v, u, d), c.placeholder = v.el;
      }
    } else
      te(
        x,
        c,
        u,
        d,
        g,
        m,
        y
      );
  }, un = (c, u, d) => {
    const b = u.component = c.component;
    if (mo(c, u, d))
      if (b.asyncDep && !b.asyncResolved) {
        G(b, u, d);
        return;
      } else
        b.next = u, b.update();
    else
      u.el = c.el, b.vnode = u;
  }, te = (c, u, d, b, g, m, y) => {
    const x = () => {
      if (c.isMounted) {
        let { next: w, bu: T, u: M, parent: j, vnode: K } = c;
        {
          const Oe = Di(c);
          if (Oe) {
            w && (w.el = K.el, G(c, w, y)), Oe.asyncDep.then(() => {
              c.isUnmounted || x();
            });
            return;
          }
        }
        let U = w, ae;
        nt(c, !1), w ? (w.el = K.el, G(c, w, y)) : w = K, T && dn(T), (ae = w.props && w.props.onVnodeBeforeUpdate) && Ee(ae, j, w, K), nt(c, !0);
        const he = _s(c), Se = c.subTree;
        c.subTree = he, C(
          Se,
          he,
          // parent may have changed if it's in a teleport
          p(Se.el),
          // anchor may have changed if it's in a fragment
          Ut(Se),
          c,
          g,
          m
        ), w.el = he.el, U === null && _o(c, he.el), M && ge(M, g), (ae = w.props && w.props.onVnodeUpdated) && ge(
          () => Ee(ae, j, w, K),
          g
        );
      } else {
        let w;
        const { el: T, props: M } = u, { bm: j, m: K, parent: U, root: ae, type: he } = c, Se = It(u);
        nt(c, !1), j && dn(j), !Se && (w = M && M.onVnodeBeforeMount) && Ee(w, U, u), nt(c, !0);
        {
          ae.ce && // @ts-expect-error _def is private
          ae.ce._def.shadowRoot !== !1 && ae.ce._injectChildStyle(he);
          const Oe = c.subTree = _s(c);
          C(
            null,
            Oe,
            d,
            b,
            c,
            g,
            m
          ), u.el = Oe.el;
        }
        if (K && ge(K, g), !Se && (w = M && M.onVnodeMounted)) {
          const Oe = u;
          ge(
            () => Ee(w, U, Oe),
            g
          );
        }
        (u.shapeFlag & 256 || U && It(U.vnode) && U.vnode.shapeFlag & 256) && c.a && ge(c.a, g), c.isMounted = !0, u = d = b = null;
      }
    };
    c.scope.on();
    const v = c.effect = new Js(x);
    c.scope.off();
    const _ = c.update = v.run.bind(v), A = c.job = v.runIfDirty.bind(v);
    A.i = c, A.id = c.uid, v.scheduler = () => Yn(A), nt(c, !0), _();
  }, G = (c, u, d) => {
    u.component = c;
    const b = c.vnode.props;
    c.vnode = u, c.next = null, vo(c, u.props, b, d), So(c, u.children, d), We(), as(c), Ue();
  }, V = (c, u, d, b, g, m, y, x, v = !1) => {
    const _ = c && c.children, A = c ? c.shapeFlag : 0, w = u.children, { patchFlag: T, shapeFlag: M } = u;
    if (T > 0) {
      if (T & 128) {
        Wt(
          _,
          w,
          d,
          b,
          g,
          m,
          y,
          x,
          v
        );
        return;
      } else if (T & 256) {
        De(
          _,
          w,
          d,
          b,
          g,
          m,
          y,
          x,
          v
        );
        return;
      }
    }
    M & 8 ? (A & 16 && vt(_, g, m), w !== _ && a(d, w)) : A & 16 ? M & 16 ? Wt(
      _,
      w,
      d,
      b,
      g,
      m,
      y,
      x,
      v
    ) : vt(_, g, m, !0) : (A & 8 && a(d, ""), M & 16 && k(
      w,
      d,
      b,
      g,
      m,
      y,
      x,
      v
    ));
  }, De = (c, u, d, b, g, m, y, x, v) => {
    c = c || ht, u = u || ht;
    const _ = c.length, A = u.length, w = Math.min(_, A);
    let T;
    for (T = 0; T < w; T++) {
      const M = u[T] = v ? ke(u[T]) : Pe(u[T]);
      C(
        c[T],
        M,
        d,
        null,
        g,
        m,
        y,
        x,
        v
      );
    }
    _ > A ? vt(
      c,
      g,
      m,
      !0,
      !1,
      w
    ) : k(
      u,
      d,
      b,
      g,
      m,
      y,
      x,
      v,
      w
    );
  }, Wt = (c, u, d, b, g, m, y, x, v) => {
    let _ = 0;
    const A = u.length;
    let w = c.length - 1, T = A - 1;
    for (; _ <= w && _ <= T; ) {
      const M = c[_], j = u[_] = v ? ke(u[_]) : Pe(u[_]);
      if (St(M, j))
        C(
          M,
          j,
          d,
          null,
          g,
          m,
          y,
          x,
          v
        );
      else
        break;
      _++;
    }
    for (; _ <= w && _ <= T; ) {
      const M = c[w], j = u[T] = v ? ke(u[T]) : Pe(u[T]);
      if (St(M, j))
        C(
          M,
          j,
          d,
          null,
          g,
          m,
          y,
          x,
          v
        );
      else
        break;
      w--, T--;
    }
    if (_ > w) {
      if (_ <= T) {
        const M = T + 1, j = M < A ? u[M].el : b;
        for (; _ <= T; )
          C(
            null,
            u[_] = v ? ke(u[_]) : Pe(u[_]),
            d,
            j,
            g,
            m,
            y,
            x,
            v
          ), _++;
      }
    } else if (_ > T)
      for (; _ <= w; )
        we(c[_], g, m, !0), _++;
    else {
      const M = _, j = _, K = /* @__PURE__ */ new Map();
      for (_ = j; _ <= T; _++) {
        const pe = u[_] = v ? ke(u[_]) : Pe(u[_]);
        pe.key != null && K.set(pe.key, _);
      }
      let U, ae = 0;
      const he = T - j + 1;
      let Se = !1, Oe = 0;
      const yt = new Array(he);
      for (_ = 0; _ < he; _++) yt[_] = 0;
      for (_ = M; _ <= w; _++) {
        const pe = c[_];
        if (ae >= he) {
          we(pe, g, m, !0);
          continue;
        }
        let Ce;
        if (pe.key != null)
          Ce = K.get(pe.key);
        else
          for (U = j; U <= T; U++)
            if (yt[U - j] === 0 && St(pe, u[U])) {
              Ce = U;
              break;
            }
        Ce === void 0 ? we(pe, g, m, !0) : (yt[Ce - j] = _ + 1, Ce >= Oe ? Oe = Ce : Se = !0, C(
          pe,
          u[Ce],
          d,
          null,
          g,
          m,
          y,
          x,
          v
        ), ae++);
      }
      const rs = Se ? To(yt) : ht;
      for (U = rs.length - 1, _ = he - 1; _ >= 0; _--) {
        const pe = j + _, Ce = u[pe], os = u[pe + 1], ls = pe + 1 < A ? (
          // #13559, fallback to el placeholder for unresolved async component
          os.el || os.placeholder
        ) : b;
        yt[_] === 0 ? C(
          null,
          Ce,
          d,
          ls,
          g,
          m,
          y,
          x,
          v
        ) : Se && (U < 0 || _ !== rs[U] ? et(Ce, d, ls, 2) : U--);
      }
    }
  }, et = (c, u, d, b, g = null) => {
    const { el: m, type: y, transition: x, children: v, shapeFlag: _ } = c;
    if (_ & 6) {
      et(c.component.subTree, u, d, b);
      return;
    }
    if (_ & 128) {
      c.suspense.move(u, d, b);
      return;
    }
    if (_ & 64) {
      y.move(c, u, d, xt);
      return;
    }
    if (y === Ie) {
      s(m, u, d);
      for (let w = 0; w < v.length; w++)
        et(v[w], u, d, b);
      s(c.anchor, u, d);
      return;
    }
    if (y === yn) {
      H(c, u, d);
      return;
    }
    if (b !== 2 && _ & 1 && x)
      if (b === 0)
        x.beforeEnter(m), s(m, u, d), ge(() => x.enter(m), g);
      else {
        const { leave: w, delayLeave: T, afterLeave: M } = x, j = () => {
          c.ctx.isUnmounted ? i(m) : s(m, u, d);
        }, K = () => {
          m._isLeaving && m[Hr](
            !0
            /* cancelled */
          ), w(m, () => {
            j(), M && M();
          });
        };
        T ? T(m, j, K) : K();
      }
    else
      s(m, u, d);
  }, we = (c, u, d, b = !1, g = !1) => {
    const {
      type: m,
      props: y,
      ref: x,
      children: v,
      dynamicChildren: _,
      shapeFlag: A,
      patchFlag: w,
      dirs: T,
      cacheIndex: M
    } = c;
    if (w === -2 && (g = !1), x != null && (We(), At(x, null, d, c, !0), Ue()), M != null && (u.renderCache[M] = void 0), A & 256) {
      u.ctx.deactivate(c);
      return;
    }
    const j = A & 1 && T, K = !It(c);
    let U;
    if (K && (U = y && y.onVnodeBeforeUnmount) && Ee(U, u, c), A & 6)
      Ki(c.component, d, b);
    else {
      if (A & 128) {
        c.suspense.unmount(d, b);
        return;
      }
      j && tt(c, null, u, "beforeUnmount"), A & 64 ? c.type.remove(
        c,
        u,
        d,
        xt,
        b
      ) : _ && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !_.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (m !== Ie || w > 0 && w & 64) ? vt(
        _,
        u,
        d,
        !1,
        !0
      ) : (m === Ie && w & 384 || !g && A & 16) && vt(v, u, d), b && ss(c);
    }
    (K && (U = y && y.onVnodeUnmounted) || j) && ge(() => {
      U && Ee(U, u, c), j && tt(c, null, u, "unmounted");
    }, d);
  }, ss = (c) => {
    const { type: u, el: d, anchor: b, transition: g } = c;
    if (u === Ie) {
      Vi(d, b);
      return;
    }
    if (u === yn) {
      E(c);
      return;
    }
    const m = () => {
      i(d), g && !g.persisted && g.afterLeave && g.afterLeave();
    };
    if (c.shapeFlag & 1 && g && !g.persisted) {
      const { leave: y, delayLeave: x } = g, v = () => y(d, m);
      x ? x(c.el, m, v) : v();
    } else
      m();
  }, Vi = (c, u) => {
    let d;
    for (; c !== u; )
      d = S(c), i(c), c = d;
    i(u);
  }, Ki = (c, u, d) => {
    const { bum: b, scope: g, job: m, subTree: y, um: x, m: v, a: _ } = c;
    xs(v), xs(_), b && dn(b), g.stop(), m && (m.flags |= 8, we(y, c, u, d)), x && ge(x, u), ge(() => {
      c.isUnmounted = !0;
    }, u);
  }, vt = (c, u, d, b = !1, g = !1, m = 0) => {
    for (let y = m; y < c.length; y++)
      we(c[y], u, d, b, g);
  }, Ut = (c) => {
    if (c.shapeFlag & 6)
      return Ut(c.component.subTree);
    if (c.shapeFlag & 128)
      return c.suspense.next();
    const u = S(c.anchor || c.el), d = u && u[$r];
    return d ? S(d) : u;
  };
  let an = !1;
  const is = (c, u, d) => {
    c == null ? u._vnode && we(u._vnode, null, null, !0) : C(
      u._vnode || null,
      c,
      u,
      null,
      null,
      null,
      d
    ), u._vnode = c, an || (an = !0, as(), ai(), an = !1);
  }, xt = {
    p: C,
    um: we,
    m: et,
    r: ss,
    mt: Xe,
    mc: k,
    pc: V,
    pbc: J,
    n: Ut,
    o: e
  };
  return {
    render: is,
    hydrate: void 0,
    createApp: ro(is)
  };
}
function xn({ type: e, props: t }, n) {
  return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function nt({ effect: e, job: t }, n) {
  n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Eo(e, t) {
  return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Fi(e, t, n = !1) {
  const s = e.children, i = t.children;
  if (R(s) && R(i))
    for (let r = 0; r < s.length; r++) {
      const o = s[r];
      let l = i[r];
      l.shapeFlag & 1 && !l.dynamicChildren && ((l.patchFlag <= 0 || l.patchFlag === 32) && (l = i[r] = ke(i[r]), l.el = o.el), !n && l.patchFlag !== -2 && Fi(o, l)), l.type === fn && // avoid cached text nodes retaining detached dom nodes
      l.patchFlag !== -1 && (l.el = o.el), l.type === Ze && !l.el && (l.el = o.el);
    }
}
function To(e) {
  const t = e.slice(), n = [0];
  let s, i, r, o, l;
  const f = e.length;
  for (s = 0; s < f; s++) {
    const h = e[s];
    if (h !== 0) {
      if (i = n[n.length - 1], e[i] < h) {
        t[s] = i, n.push(s);
        continue;
      }
      for (r = 0, o = n.length - 1; r < o; )
        l = r + o >> 1, e[n[l]] < h ? r = l + 1 : o = l;
      h < e[n[r]] && (r > 0 && (t[s] = n[r - 1]), n[r] = s);
    }
  }
  for (r = n.length, o = n[r - 1]; r-- > 0; )
    n[r] = o, o = t[o];
  return n;
}
function Di(e) {
  const t = e.subTree.component;
  if (t)
    return t.asyncDep && !t.asyncResolved ? t : Di(t);
}
function xs(e) {
  if (e)
    for (let t = 0; t < e.length; t++)
      e[t].flags |= 8;
}
const Ni = (e) => e.__isSuspense;
function Ao(e, t) {
  t && t.pendingBranch ? R(e) ? t.effects.push(...e) : t.effects.push(e) : Dr(e);
}
const Ie = Symbol.for("v-fgt"), fn = Symbol.for("v-txt"), Ze = Symbol.for("v-cmt"), yn = Symbol.for("v-stc"), Mt = [];
let me = null;
function oe(e = !1) {
  Mt.push(me = e ? null : []);
}
function Io() {
  Mt.pop(), me = Mt[Mt.length - 1] || null;
}
let Nt = 1;
function ys(e, t = !1) {
  Nt += e, e < 0 && me && t && (me.hasOnce = !0);
}
function $i(e) {
  return e.dynamicChildren = Nt > 0 ? me || ht : null, Io(), Nt > 0 && me && me.push(e), e;
}
function be(e, t, n, s, i, r) {
  return $i(
    B(
      e,
      t,
      n,
      s,
      i,
      r,
      !0
    )
  );
}
function Dn(e, t, n, s, i) {
  return $i(
    Le(
      e,
      t,
      n,
      s,
      i,
      !0
    )
  );
}
function ji(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function St(e, t) {
  return e.type === t.type && e.key === t.key;
}
const Hi = ({ key: e }) => e ?? null, qt = ({
  ref: e,
  ref_key: t,
  ref_for: n
}) => (typeof e == "number" && (e = "" + e), e != null ? Q(e) || se(e) || D(e) ? { i: Me, r: e, k: t, f: !!n } : e : null);
function B(e, t = null, n = null, s = 0, i = null, r = e === Ie ? 0 : 1, o = !1, l = !1) {
  const f = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && Hi(t),
    ref: t && qt(t),
    scopeId: di,
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
    patchFlag: s,
    dynamicProps: i,
    dynamicChildren: null,
    appContext: null,
    ctx: Me
  };
  return l ? (ts(f, n), r & 128 && e.normalize(f)) : n && (f.shapeFlag |= Q(n) ? 8 : 16), Nt > 0 && // avoid a block node from tracking itself
  !o && // has current parent block
  me && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (f.patchFlag > 0 || r & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  f.patchFlag !== 32 && me.push(f), f;
}
const Le = Po;
function Po(e, t = null, n = null, s = 0, i = null, r = !1) {
  if ((!e || e === Yr) && (e = Ze), ji(e)) {
    const l = bt(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return n && ts(l, n), Nt > 0 && !r && me && (l.shapeFlag & 6 ? me[me.indexOf(e)] = l : me.push(l)), l.patchFlag = -2, l;
  }
  if (Uo(e) && (e = e.__vccOpts), t) {
    t = Mo(t);
    let { class: l, style: f } = t;
    l && !Q(l) && (t.class = jt(l)), Y(f) && (Gn(f) && !R(f) && (f = ie({}, f)), t.style = pt(f));
  }
  const o = Q(e) ? 1 : Ni(e) ? 128 : jr(e) ? 64 : Y(e) ? 4 : D(e) ? 2 : 0;
  return B(
    e,
    t,
    n,
    s,
    i,
    o,
    r,
    !0
  );
}
function Mo(e) {
  return e ? Gn(e) || Ti(e) ? ie({}, e) : e : null;
}
function bt(e, t, n = !1, s = !1) {
  const { props: i, ref: r, patchFlag: o, children: l, transition: f } = e, h = t ? Ro(i || {}, t) : i, a = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: h,
    key: h && Hi(h),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && r ? R(r) ? r.concat(qt(t)) : [r, qt(t)] : qt(t)
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
    patchFlag: t && e.type !== Ie ? o === -1 ? 16 : o | 16 : o,
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
    ssContent: e.ssContent && bt(e.ssContent),
    ssFallback: e.ssFallback && bt(e.ssFallback),
    placeholder: e.placeholder,
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce
  };
  return f && s && Zn(
    a,
    f.clone(a)
  ), a;
}
function $e(e = " ", t = 0) {
  return Le(fn, null, e, t);
}
function Ae(e = "", t = !1) {
  return t ? (oe(), Dn(Ze, null, e)) : Le(Ze, null, e);
}
function Pe(e) {
  return e == null || typeof e == "boolean" ? Le(Ze) : R(e) ? Le(
    Ie,
    null,
    // #3666, avoid reference pollution when reusing vnode
    e.slice()
  ) : ji(e) ? ke(e) : Le(fn, null, String(e));
}
function ke(e) {
  return e.el === null && e.patchFlag !== -1 || e.memo ? e : bt(e);
}
function ts(e, t) {
  let n = 0;
  const { shapeFlag: s } = e;
  if (t == null)
    t = null;
  else if (R(t))
    n = 16;
  else if (typeof t == "object")
    if (s & 65) {
      const i = t.default;
      i && (i._c && (i._d = !1), ts(e, i()), i._c && (i._d = !0));
      return;
    } else {
      n = 32;
      const i = t._;
      !i && !Ti(t) ? t._ctx = Me : i === 3 && Me && (Me.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else D(t) ? (t = { default: t, _ctx: Me }, n = 32) : (t = String(t), s & 64 ? (n = 16, t = [$e(t)]) : n = 8);
  e.children = t, e.shapeFlag |= n;
}
function Ro(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const s = e[n];
    for (const i in s)
      if (i === "class")
        t.class !== s.class && (t.class = jt([t.class, s.class]));
      else if (i === "style")
        t.style = pt([t.style, s.style]);
      else if (en(i)) {
        const r = t[i], o = s[i];
        o && r !== o && !(R(r) && r.includes(o)) && (t[i] = r ? [].concat(r, o) : o);
      } else i !== "" && (t[i] = s[i]);
  }
  return t;
}
function Ee(e, t, n, s = null) {
  Fe(e, t, 7, [
    n,
    s
  ]);
}
const Fo = yi();
let Do = 0;
function No(e, t, n) {
  const s = e.type, i = (t ? t.appContext : e.appContext) || Fo, r = {
    uid: Do++,
    vnode: e,
    type: s,
    parent: t,
    appContext: i,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    job: null,
    scope: new nr(
      !0
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: t ? t.provides : Object.create(i.provides),
    ids: t ? t.ids : ["", 0, 0],
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: Ii(s, i),
    emitsOptions: Oi(s, i),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: q,
    // inheritAttrs
    inheritAttrs: s.inheritAttrs,
    // state
    ctx: q,
    data: q,
    props: q,
    attrs: q,
    slots: q,
    refs: q,
    setupState: q,
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
  return r.ctx = { _: r }, r.root = t ? t.root : r, r.emit = ao.bind(null, r), e.ce && e.ce(r), r;
}
let ce = null;
const $o = () => ce || Me;
let Xt, Nn;
{
  const e = sn(), t = (n, s) => {
    let i;
    return (i = e[n]) || (i = e[n] = []), i.push(s), (r) => {
      i.length > 1 ? i.forEach((o) => o(r)) : i[0](r);
    };
  };
  Xt = t(
    "__VUE_INSTANCE_SETTERS__",
    (n) => ce = n
  ), Nn = t(
    "__VUE_SSR_SETTERS__",
    (n) => $t = n
  );
}
const Lt = (e) => {
  const t = ce;
  return Xt(e), e.scope.on(), () => {
    e.scope.off(), Xt(t);
  };
}, ws = () => {
  ce && ce.scope.off(), Xt(null);
};
function Li(e) {
  return e.vnode.shapeFlag & 4;
}
let $t = !1;
function jo(e, t = !1, n = !1) {
  t && Nn(t);
  const { props: s, children: i } = e.vnode, r = Li(e);
  bo(e, s, r, t), wo(e, i, n || t);
  const o = r ? Ho(e, t) : void 0;
  return t && Nn(!1), o;
}
function Ho(e, t) {
  const n = e.type;
  e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, Qr);
  const { setup: s } = n;
  if (s) {
    We();
    const i = e.setupContext = s.length > 1 ? Wo(e) : null, r = Lt(e), o = Ht(
      s,
      e,
      0,
      [
        e.props,
        i
      ]
    ), l = Ws(o);
    if (Ue(), r(), (l || e.sp) && !It(e) && pi(e), l) {
      if (o.then(ws, ws), t)
        return o.then((f) => {
          Ss(e, f);
        }).catch((f) => {
          on(f, e, 0);
        });
      e.asyncDep = o;
    } else
      Ss(e, o);
  } else
    Wi(e);
}
function Ss(e, t, n) {
  D(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : Y(t) && (e.setupState = ci(t)), Wi(e);
}
function Wi(e, t, n) {
  const s = e.type;
  e.render || (e.render = s.render || Re);
  {
    const i = Lt(e);
    We();
    try {
      Xr(e);
    } finally {
      Ue(), i();
    }
  }
}
const Lo = {
  get(e, t) {
    return ne(e, "get", ""), e[t];
  }
};
function Wo(e) {
  const t = (n) => {
    e.exposed = n || {};
  };
  return {
    attrs: new Proxy(e.attrs, Lo),
    slots: e.slots,
    emit: e.emit,
    expose: t
  };
}
function ns(e) {
  return e.exposed ? e.exposeProxy || (e.exposeProxy = new Proxy(ci(Sr(e.exposed)), {
    get(t, n) {
      if (n in t)
        return t[n];
      if (n in Pt)
        return Pt[n](e);
    },
    has(t, n) {
      return n in t || n in Pt;
    }
  })) : e.proxy;
}
function Uo(e) {
  return D(e) && "__vccOpts" in e;
}
const $n = (e, t) => Ar(e, t, $t), Bo = "3.5.25";
let jn;
const Os = typeof window < "u" && window.trustedTypes;
if (Os)
  try {
    jn = /* @__PURE__ */ Os.createPolicy("vue", {
      createHTML: (e) => e
    });
  } catch {
  }
const Ui = jn ? (e) => jn.createHTML(e) : (e) => e, Vo = "http://www.w3.org/2000/svg", Ko = "http://www.w3.org/1998/Math/MathML", je = typeof document < "u" ? document : null, Cs = je && /* @__PURE__ */ je.createElement("template"), zo = {
  insert: (e, t, n) => {
    t.insertBefore(e, n || null);
  },
  remove: (e) => {
    const t = e.parentNode;
    t && t.removeChild(e);
  },
  createElement: (e, t, n, s) => {
    const i = t === "svg" ? je.createElementNS(Vo, e) : t === "mathml" ? je.createElementNS(Ko, e) : n ? je.createElement(e, { is: n }) : je.createElement(e);
    return e === "select" && s && s.multiple != null && i.setAttribute("multiple", s.multiple), i;
  },
  createText: (e) => je.createTextNode(e),
  createComment: (e) => je.createComment(e),
  setText: (e, t) => {
    e.nodeValue = t;
  },
  setElementText: (e, t) => {
    e.textContent = t;
  },
  parentNode: (e) => e.parentNode,
  nextSibling: (e) => e.nextSibling,
  querySelector: (e) => je.querySelector(e),
  setScopeId(e, t) {
    e.setAttribute(t, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(e, t, n, s, i, r) {
    const o = n ? n.previousSibling : t.lastChild;
    if (i && (i === r || i.nextSibling))
      for (; t.insertBefore(i.cloneNode(!0), n), !(i === r || !(i = i.nextSibling)); )
        ;
    else {
      Cs.innerHTML = Ui(
        s === "svg" ? `<svg>${e}</svg>` : s === "mathml" ? `<math>${e}</math>` : e
      );
      const l = Cs.content;
      if (s === "svg" || s === "mathml") {
        const f = l.firstChild;
        for (; f.firstChild; )
          l.appendChild(f.firstChild);
        l.removeChild(f);
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
}, qo = Symbol("_vtc");
function ko(e, t, n) {
  const s = e[qo];
  s && (t = (t ? [t, ...s] : [...s]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
const Es = Symbol("_vod"), Jo = Symbol("_vsh"), Go = Symbol(""), Yo = /(?:^|;)\s*display\s*:/;
function Zo(e, t, n) {
  const s = e.style, i = Q(n);
  let r = !1;
  if (n && !i) {
    if (t)
      if (Q(t))
        for (const o of t.split(";")) {
          const l = o.slice(0, o.indexOf(":")).trim();
          n[l] == null && kt(s, l, "");
        }
      else
        for (const o in t)
          n[o] == null && kt(s, o, "");
    for (const o in n)
      o === "display" && (r = !0), kt(s, o, n[o]);
  } else if (i) {
    if (t !== n) {
      const o = s[Go];
      o && (n += ";" + o), s.cssText = n, r = Yo.test(n);
    }
  } else t && e.removeAttribute("style");
  Es in e && (e[Es] = r ? s.display : "", e[Jo] && (s.display = "none"));
}
const Ts = /\s*!important$/;
function kt(e, t, n) {
  if (R(n))
    n.forEach((s) => kt(e, t, s));
  else if (n == null && (n = ""), t.startsWith("--"))
    e.setProperty(t, n);
  else {
    const s = Qo(e, t);
    Ts.test(n) ? e.setProperty(
      ct(s),
      n.replace(Ts, ""),
      "important"
    ) : e[s] = n;
  }
}
const As = ["Webkit", "Moz", "ms"], wn = {};
function Qo(e, t) {
  const n = wn[t];
  if (n)
    return n;
  let s = Ye(t);
  if (s !== "filter" && s in e)
    return wn[t] = s;
  s = Vs(s);
  for (let i = 0; i < As.length; i++) {
    const r = As[i] + s;
    if (r in e)
      return wn[t] = r;
  }
  return t;
}
const Is = "http://www.w3.org/1999/xlink";
function Ps(e, t, n, s, i, r = tr(t)) {
  s && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(Is, t.slice(6, t.length)) : e.setAttributeNS(Is, t, n) : n == null || r && !zs(n) ? e.removeAttribute(t) : e.setAttribute(
    t,
    r ? "" : Qe(n) ? String(n) : n
  );
}
function Ms(e, t, n, s, i) {
  if (t === "innerHTML" || t === "textContent") {
    n != null && (e[t] = t === "innerHTML" ? Ui(n) : n);
    return;
  }
  const r = e.tagName;
  if (t === "value" && r !== "PROGRESS" && // custom elements may use _value internally
  !r.includes("-")) {
    const l = r === "OPTION" ? e.getAttribute("value") || "" : e.value, f = n == null ? (
      // #11647: value should be set as empty string for null and undefined,
      // but <input type="checkbox"> should be set as 'on'.
      e.type === "checkbox" ? "on" : ""
    ) : String(n);
    (l !== f || !("_value" in e)) && (e.value = f), n == null && e.removeAttribute(t), e._value = n;
    return;
  }
  let o = !1;
  if (n === "" || n == null) {
    const l = typeof e[t];
    l === "boolean" ? n = zs(n) : n == null && l === "string" ? (n = "", o = !0) : l === "number" && (n = 0, o = !0);
  }
  try {
    e[t] = n;
  } catch {
  }
  o && e.removeAttribute(i || t);
}
function Xo(e, t, n, s) {
  e.addEventListener(t, n, s);
}
function el(e, t, n, s) {
  e.removeEventListener(t, n, s);
}
const Rs = Symbol("_vei");
function tl(e, t, n, s, i = null) {
  const r = e[Rs] || (e[Rs] = {}), o = r[t];
  if (s && o)
    o.value = s;
  else {
    const [l, f] = nl(t);
    if (s) {
      const h = r[t] = rl(
        s,
        i
      );
      Xo(e, l, h, f);
    } else o && (el(e, l, o, f), r[t] = void 0);
  }
}
const Fs = /(?:Once|Passive|Capture)$/;
function nl(e) {
  let t;
  if (Fs.test(e)) {
    t = {};
    let s;
    for (; s = e.match(Fs); )
      e = e.slice(0, e.length - s[0].length), t[s[0].toLowerCase()] = !0;
  }
  return [e[2] === ":" ? e.slice(3) : ct(e.slice(2)), t];
}
let Sn = 0;
const sl = /* @__PURE__ */ Promise.resolve(), il = () => Sn || (sl.then(() => Sn = 0), Sn = Date.now());
function rl(e, t) {
  const n = (s) => {
    if (!s._vts)
      s._vts = Date.now();
    else if (s._vts <= n.attached)
      return;
    Fe(
      ol(s, n.value),
      t,
      5,
      [s]
    );
  };
  return n.value = e, n.attached = il(), n;
}
function ol(e, t) {
  if (R(t)) {
    const n = e.stopImmediatePropagation;
    return e.stopImmediatePropagation = () => {
      n.call(e), e._stopped = !0;
    }, t.map(
      (s) => (i) => !i._stopped && s && s(i)
    );
  } else
    return t;
}
const Ds = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // lowercase letter
e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, ll = (e, t, n, s, i, r) => {
  const o = i === "svg";
  t === "class" ? ko(e, s, o) : t === "style" ? Zo(e, n, s) : en(t) ? Ln(t) || tl(e, t, n, s, r) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : cl(e, t, s, o)) ? (Ms(e, t, s), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Ps(e, t, s, o, r, t !== "value")) : /* #11081 force set props for possible async custom element */ e._isVueCE && (/[A-Z]/.test(t) || !Q(s)) ? Ms(e, Ye(t), s, r, t) : (t === "true-value" ? e._trueValue = s : t === "false-value" && (e._falseValue = s), Ps(e, t, s, o));
};
function cl(e, t, n, s) {
  if (s)
    return !!(t === "innerHTML" || t === "textContent" || t in e && Ds(t) && D(n));
  if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA")
    return !1;
  if (t === "width" || t === "height") {
    const i = e.tagName;
    if (i === "IMG" || i === "VIDEO" || i === "CANVAS" || i === "SOURCE")
      return !1;
  }
  return Ds(t) && Q(n) ? !1 : t in e;
}
const fl = /* @__PURE__ */ ie({ patchProp: ll }, zo);
let Ns;
function ul() {
  return Ns || (Ns = Oo(fl));
}
const al = ((...e) => {
  const t = ul().createApp(...e), { mount: n } = t;
  return t.mount = (s) => {
    const i = dl(s);
    if (!i) return;
    const r = t._component;
    !D(r) && !r.render && !r.template && (r.template = i.innerHTML), i.nodeType === 1 && (i.textContent = "");
    const o = n(i, !1, hl(i));
    return i instanceof Element && (i.removeAttribute("v-cloak"), i.setAttribute("data-v-app", "")), o;
  }, t;
});
function hl(e) {
  if (e instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement)
    return "mathml";
}
function dl(e) {
  return Q(e) ? document.querySelector(e) : e;
}
const pl = { class: "flex gap-2 justify-center items-center" }, gl = ["src"], ml = { class: "text-xl" }, _l = { class: "flex flex-col text-center mt-8 font-luckiestguy text-3xl" }, bl = { class: "text-yellow-300" }, vl = { class: "flex mt-4 font-exo2 font-bold! text-sm text-[#959595] px-4 py-1 bg-black/30 border-2 border-black/10 rounded-full" }, xl = {
  key: 0,
  class: "flex items-center gap-1"
}, yl = {
  key: 1,
  class: "flex items-center gap-1"
}, wl = { key: 2 }, Sl = {
  key: 3,
  class: "flex items-center gap-1"
}, Ol = ["src"], Cl = { class: "text-white" }, El = { class: "text-yellow-300" }, Tl = {
  key: 4,
  class: "flex items-center gap-1"
}, Al = {
  key: 5,
  class: "flex items-center gap-1"
}, Il = ["src"], Pl = /* @__PURE__ */ Qn({
  __name: "ActivationScreen",
  props: {
    wheelOptions: {},
    exiting: { type: Boolean }
  },
  setup(e) {
    return (t, n) => (oe(), be(
      "div",
      {
        class: jt(["flex flex-col text-white items-center drop-shadow-md animate__animated", { animate__fadeOutDown: e.exiting, animate__fadeInDown: !e.exiting }])
      },
      [
        B("div", pl, [
          B("img", {
            class: "rounded-full size-8",
            src: e.wheelOptions.user.profilePictureUrl,
            alt: "Profile picture"
          }, null, 8, gl),
          B("span", ml, [
            B(
              "b",
              null,
              Ke(e.wheelOptions.user.username),
              1
              /* TEXT */
            ),
            n[0] || (n[0] = $e(
              " activated",
              -1
              /* CACHED */
            ))
          ])
        ]),
        B("div", _l, [
          n[1] || (n[1] = B(
            "span",
            null,
            "Wheel of Actions:",
            -1
            /* CACHED */
          )),
          B(
            "span",
            bl,
            Ke(e.wheelOptions.wheelName),
            1
            /* TEXT */
          )
        ]),
        B("div", vl, [
          e.wheelOptions.activation.type === "follow" ? (oe(), be("span", xl, [...n[2] || (n[2] = [
            B(
              "i",
              { class: "fas fa-user-plus mr-1 text-tikfinity" },
              null,
              -1
              /* CACHED */
            ),
            $e(
              " with a ",
              -1
              /* CACHED */
            ),
            B(
              "span",
              { class: "text-white" },
              "follow",
              -1
              /* CACHED */
            )
          ])])) : Ae("v-if", !0),
          e.wheelOptions.activation.type === "share" ? (oe(), be("span", yl, [...n[3] || (n[3] = [
            B(
              "i",
              { class: "fas fa-share mr-1 text-tikfinity" },
              null,
              -1
              /* CACHED */
            ),
            $e(
              " with a ",
              -1
              /* CACHED */
            ),
            B(
              "span",
              { class: "text-white" },
              "share",
              -1
              /* CACHED */
            )
          ])])) : Ae("v-if", !0),
          e.wheelOptions.activation.type === "subscribe" ? (oe(), be("span", wl, [...n[4] || (n[4] = [
            B(
              "i",
              { class: "fas fa-star mr-1 text-tikfinity" },
              null,
              -1
              /* CACHED */
            ),
            $e(
              " with a ",
              -1
              /* CACHED */
            ),
            B(
              "span",
              { class: "text-white" },
              "subscription",
              -1
              /* CACHED */
            )
          ])])) : Ae("v-if", !0),
          e.wheelOptions.activation.type === "gift" ? (oe(), be("span", Sl, [
            B("img", {
              src: e.wheelOptions.activation.giftPictureUrl,
              alt: "Gift",
              class: "size-8 mr-1"
            }, null, 8, Ol),
            n[5] || (n[5] = $e(
              " with a ",
              -1
              /* CACHED */
            )),
            B(
              "span",
              Cl,
              Ke(e.wheelOptions.activation.giftName) + " " + Ke(e.wheelOptions.activation.repeatCount > 1 ? `x${e.wheelOptions.activation.repeatCount}` : ""),
              1
              /* TEXT */
            ),
            n[6] || (n[6] = $e(
              " for ",
              -1
              /* CACHED */
            )),
            B(
              "span",
              El,
              Ke(e.wheelOptions.activation.value * e.wheelOptions.activation.repeatCount) + " " + Ke(e.wheelOptions.activation.value * e.wheelOptions.activation.repeatCount !== 1 ? "Coins" : "Coin"),
              1
              /* TEXT */
            )
          ])) : Ae("v-if", !0),
          e.wheelOptions.activation.type === "shop_item_purchased" ? (oe(), be("span", Tl, [
            n[7] || (n[7] = B(
              "i",
              { class: "fas fa-shopping-cart mr-1 text-tikfinity" },
              null,
              -1
              /* CACHED */
            )),
            n[8] || (n[8] = $e(
              " with a ",
              -1
              /* CACHED */
            )),
            n[9] || (n[9] = B(
              "span",
              { class: "text-white" },
              "shop item purchased",
              -1
              /* CACHED */
            )),
            Ae(" TODO ")
          ])) : Ae("v-if", !0),
          e.wheelOptions.activation.type === "emote" ? (oe(), be("span", Al, [
            B("img", {
              src: e.wheelOptions.activation.emoteImageUrl,
              alt: "Emote",
              class: "size-8 mr-1"
            }, null, 8, Il),
            n[10] || (n[10] = $e(
              " with an ",
              -1
              /* CACHED */
            )),
            n[11] || (n[11] = B(
              "span",
              { class: "text-white" },
              "emote",
              -1
              /* CACHED */
            ))
          ])) : Ae("v-if", !0)
        ])
      ],
      2
      /* CLASS */
    ));
  }
}), Ml = "https://assets.tikfinity.com", ut = (e) => `${Ml}/widget/${e}`, Rl = {
  widget: {
    wheelOfActions: {
      wheel: ut("wheel-of-actions/images/wheel.png"),
      pin: ut("wheel-of-actions/images/pin.png"),
      dot: ut("wheel-of-actions/images/dot.png"),
      base: ut("wheel-of-actions/images/base.png"),
      shadow: ut("wheel-of-actions/images/shadow.png"),
      click: ut("wheel-of-actions/sounds/click.mp3")
    }
  }
};
function Fl(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var On, $s;
function Dl() {
  if ($s) return On;
  $s = 1;
  var e = 4, t = 1e-3, n = 1e-7, s = 10, i = 11, r = 1 / (i - 1), o = typeof Float32Array == "function";
  function l(C, P) {
    return 1 - 3 * P + 3 * C;
  }
  function f(C, P) {
    return 3 * P - 6 * C;
  }
  function h(C) {
    return 3 * C;
  }
  function a(C, P, I) {
    return ((l(P, I) * C + f(P, I)) * C + h(P)) * C;
  }
  function p(C, P, I) {
    return 3 * l(P, I) * C * C + 2 * f(P, I) * C + h(P);
  }
  function S(C, P, I, N, H) {
    var E, $, fe = 0;
    do
      $ = P + (I - P) / 2, E = a($, N, H) - C, E > 0 ? I = $ : P = $;
    while (Math.abs(E) > n && ++fe < s);
    return $;
  }
  function O(C, P, I, N) {
    for (var H = 0; H < e; ++H) {
      var E = p(P, I, N);
      if (E === 0)
        return P;
      var $ = a(P, I, N) - C;
      P -= $ / E;
    }
    return P;
  }
  function F(C) {
    return C;
  }
  return On = function(P, I, N, H) {
    if (!(0 <= P && P <= 1 && 0 <= N && N <= 1))
      throw new Error("bezier x values must be in [0, 1] range");
    if (P === I && N === H)
      return F;
    for (var E = o ? new Float32Array(i) : new Array(i), $ = 0; $ < i; ++$)
      E[$] = a($ * r, P, N);
    function fe(X) {
      for (var k = 0, Z = 1, J = i - 1; Z !== J && E[Z] <= X; ++Z)
        k += r;
      --Z;
      var ee = (X - E[Z]) / (E[Z + 1] - E[Z]), ue = k + ee * r, _e = p(ue, P, N);
      return _e >= t ? O(X, ue, P, N) : _e === 0 ? ue : S(X, k, k + r, P, N);
    }
    return function(k) {
      return k === 0 ? 0 : k === 1 ? 1 : a(fe(k), I, H);
    };
  }, On;
}
var Nl = Dl();
const $l = /* @__PURE__ */ Fl(Nl), jl = ["src"], Hl = { class: "absolute rounded-full w-[calc(100%-32px)] h-[calc(100%-32px)]" }, Ll = ["src"], Wl = ["src"], Ul = ["src"], Bl = ["src"], Vl = /* @__PURE__ */ Qn({
  __name: "WheelOfActions",
  props: {
    wheelOptions: {},
    exiting: { type: Boolean }
  },
  setup(e) {
    const { wheel: t, pin: n, dot: s, base: i, shadow: r, click: o } = Rl.widget.wheelOfActions, l = e.wheelOptions.segments, f = e.wheelOptions.spinDuration, h = e.wheelOptions.winnerSegmentIndex, a = 360 / l.length, p = (h + 0.5) * a, S = 90 - p + 180, O = rt(S), F = rt(!1), C = rt(0), P = $l(0.25, 0.1, 0, 1), I = (a - 1) * (Math.random() - 0.5), N = 1800 + (90 - p) + I, H = $n(() => ({
      background: `conic-gradient(${l.map((Z, J) => {
        const ee = J * 360 / l.length, ue = (J + 1) * 360 / l.length;
        return `${Z.color} ${ee}deg ${ue}deg`;
      }).join(", ")})`,
      transform: `rotate(${O.value}deg)`,
      transition: F.value ? "none" : "transform 0.1s ease-out"
    })), E = () => {
      F.value = !0;
      const k = Date.now(), Z = O.value, J = N - Z, ee = () => {
        const ue = Date.now() - k, _e = Math.min(ue / f, 1), Xe = P(_e);
        O.value = Z + J * Xe, _e < 1 ? requestAnimationFrame(ee) : F.value = !1, C.value < 0 && (C.value += 1);
      };
      requestAnimationFrame(ee);
    };
    _i(() => {
      E();
    });
    const $ = rt(h), fe = $n(() => {
      const Z = ((90 - O.value) % 360 + 360) % 360, J = Math.floor(Z / a);
      return J !== $.value && ($.value = J, C.value = -30, e.wheelOptions.playSound === "true" && new Audio(o).play(), setTimeout(() => {
        C.value = 0;
      }, 80)), {
        transform: `rotate(${C.value}deg)`,
        transformOrigin: "60% center",
        transition: "transform 0.2s ease-out"
      };
    }), X = (k) => {
      const Z = k * (360 / l.length) - 90 + 360 / l.length / 2, { color: J, text: ee } = l[k], ue = parseInt(J.slice(1, 3), 16) / 255, _e = parseInt(J.slice(3, 5), 16) / 255, Xe = parseInt(J.slice(5, 7), 16) / 255, te = 0.2126 * ue + 0.7152 * _e + 0.0722 * Xe > 0.8 ? "#000000" : "#FFFFFF", De = Math.max(8, 28 - Math.max(0, ee.length - 12) * 0.5);
      return {
        transform: `rotate(${Z}deg) translateY(-45%)`,
        transformOrigin: "0 0",
        color: te,
        fontSize: `${De}px`
      };
    };
    return (k, Z) => (oe(), be(
      "div",
      {
        class: jt(["absolute flex items-center justify-center animate__animated wheelOfActions", { animate__fadeOutDown: e.exiting, animate__fadeInDown: !e.exiting }])
      },
      [
        e.wheelOptions.showBase === "true" ? (oe(), be("img", {
          key: 0,
          class: "absolute -bottom-20",
          src: st(i),
          alt: "Spin Wheel Base"
        }, null, 8, jl)) : Ae("v-if", !0),
        B("div", Hl, [
          B(
            "div",
            {
              class: "size-full rounded-full relative",
              style: pt(H.value)
            },
            [
              (oe(!0), be(
                Ie,
                null,
                Zr(st(l), (J, ee) => (oe(), be(
                  "div",
                  {
                    class: "absolute top-1/2 left-1/2 w-[256px] flex justify-end text-end leading-none pl-24 font-lexend",
                    key: J.id,
                    style: pt(X(ee))
                  },
                  Ke(J.text),
                  5
                  /* TEXT, STYLE */
                ))),
                128
                /* KEYED_FRAGMENT */
              ))
            ],
            4
            /* STYLE */
          )
        ]),
        B("img", {
          class: "absolute",
          src: st(r),
          alt: "Spin Wheel Shadow"
        }, null, 8, Ll),
        B("img", {
          class: "relative top-0 left-0",
          src: st(t),
          alt: "Spin Wheel"
        }, null, 8, Wl),
        B("img", {
          class: "absolute -right-8 top-[calc(50%-75px)]",
          src: st(n),
          alt: "Spin Wheel Pin",
          style: pt(fe.value)
        }, null, 12, Ul),
        B("img", {
          class: "absolute",
          src: st(s),
          alt: "Spin Wheel Dot"
        }, null, 8, Bl)
      ],
      2
      /* CLASS */
    ));
  }
}), Kl = /* @__PURE__ */ Qn({
  __name: "App",
  setup(e) {
    const t = rt(), n = rt("none"), s = rt([]), i = (r) => {
      s.value.forEach((a) => clearTimeout(a)), s.value = [], t.value = r, n.value = "announce";
      const { announceDuration: o, spinDuration: l, waitDuration: f } = r;
      let h = 0;
      s.value.push(
        setTimeout(
          () => {
            n.value = "announceExit";
          },
          h += o
        )
      ), s.value.push(
        setTimeout(
          () => {
            n.value = "wheel";
          },
          h += 1e3
        )
      ), s.value.push(
        setTimeout(
          () => {
            n.value = "wheelExit";
          },
          h += l + f
        )
      ), s.value.push(
        setTimeout(
          () => {
            n.value = "none", t.value = void 0;
          },
          h += 1e3
        )
      );
    };
    return window.triggerWheel = i, (r, o) => (oe(), be("div", {
      class: "flex items-center justify-center min-h-screen min-w-screen",
      key: t.value?.wheelName
    }, [
      ["announce", "announceExit"].includes(n.value) ? (oe(), Dn(Pl, {
        key: 0,
        "wheel-options": t.value,
        exiting: n.value === "announceExit"
      }, null, 8, ["wheel-options", "exiting"])) : Ae("v-if", !0),
      ["wheel", "wheelExit"].includes(n.value) ? (oe(), Dn(Vl, {
        key: 1,
        "wheel-options": t.value,
        exiting: n.value === "wheelExit"
      }, null, 8, ["wheel-options", "exiting"])) : Ae("v-if", !0)
    ]));
  }
});
function js() {
  const e = document.documentElement, t = 1920;
  function n() {
    const i = document.documentElement.clientWidth || window.innerWidth, r = Math.min(i / t, 1);
    e.style.setProperty("--scale", String(r));
  }
  n();
  let s;
  window.addEventListener("resize", () => {
    clearTimeout(s), s = setTimeout(n, 50);
  });
}
const zl = Kl;
function Bi(e) {
  const t = al(zl, e);
  return typeof js == "function" && js(), t;
}
function ql(e, t) {
  const n = Bi(t);
  return n.mount(e), n;
}
window.createWheelOfActions = Bi;
window.mountWheelOfActions = ql;
export {
  Bi as createWheelOfActions,
  zl as default,
  ql as mountWheelOfActions,
  js as setup
};
