$env:ELECTRON_RUN_AS_NODE = ''
$env:TIKMAX_DEVTOOLS = '1'
[Environment]::SetEnvironmentVariable('ELECTRON_RUN_AS_NODE', $null, 'Process')
[Environment]::SetEnvironmentVariable('TIKMAX_DEVTOOLS', '1', 'Process')
$exe = 'C:\Users\nguyenlg\Documents\TikMax\TikCloneMax\electron\node_modules\electron\dist\electron.exe'
$dir = 'C:\Users\nguyenlg\Documents\TikMax\TikCloneMax\electron'
Start-Process -FilePath $exe -ArgumentList $dir -WorkingDirectory $dir
