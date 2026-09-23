param([Parameter(Mandatory=$true)][string]$ConfigPath)
$ErrorActionPreference = 'Stop'
$runner = Join-Path $PSScriptRoot 'local-agent.mjs'
$configFile = (Resolve-Path -LiteralPath $ConfigPath).Path
$nodeExecutable = (Get-Command node).Source
# Runs in the current user's interactive login session, without storing a password.
$launcher = Join-Path (Split-Path $configFile) 'run-outbound.ps1'
$content = '$env:OUTBOUND_LOCAL_CONFIG = ''' + $configFile.Replace("'","''") + "'`r`n& '" + $nodeExecutable.Replace("'","''") + "' '" + $runner.Replace("'","''") + "'"
[System.IO.File]::WriteAllText($launcher,$content)
$action = New-ScheduledTaskAction -Execute 'pwsh.exe' -Argument ('-NoProfile -NonInteractive -WindowStyle Hidden -File "' + $launcher + '"')
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(2) -RepetitionInterval (New-TimeSpan -Minutes 15)
$settings = New-ScheduledTaskSettingsSet -MultipleInstances IgnoreNew -ExecutionTimeLimit (New-TimeSpan -Minutes 25) -StartWhenAvailable
Register-ScheduledTask -TaskName 'EverKnitting Local Codex Research' -Action $action -Trigger $trigger -Settings $settings -Description 'Claim one outbound research job; local Codex prepares evidence and drafts. Cannot approve or send.' -Force
