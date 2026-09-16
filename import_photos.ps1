$src = 'C:\Users\arjun\Downloads\BLOOMY WEDDINGS\BLOOMY WEDDINGS\Photos'
$dest = 'c:\Users\arjun\Bloomy_Weddings\assets\real_photos'

if (!(Test-Path -Path $dest)) {
    New-Item -ItemType Directory -Force -Path $dest
}

Get-ChildItem -Path $src -File | Where-Object { $_.Extension -match '(?i)\.(jpg|jpeg|png)$' } | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination $dest -Force
}

Get-ChildItem -Path $dest | Select-Object Name, Length | ConvertTo-Json
