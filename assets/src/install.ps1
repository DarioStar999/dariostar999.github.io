$profilePath = "C:\Users\$env:USERNAME\AppData\Roaming\.minecraft\launcher_profiles.json"
if (Test-Path $profilePath) {
    try {
        $jsonContent = Get-Content $profilePath -Raw
        $json = $jsonContent | ConvertFrom-Json
        if (-not $json.profiles) {
            $json | Add-Member -MemberType NoteProperty -Name "profiles" -Value ([PSCustomObject]@{}) -Force
        }
        if (-not $json.profiles.PSObject.Properties['NIKECLIENT']) {
            $json.profiles | Add-Member -MemberType NoteProperty -Name "NIKECLIENT" -Value ([PSCustomObject]@{
                created = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
                gameDir = "C:\Users\$env:USERNAME\AppData\Roaming\.minecraft\NikeClient"
                icon = "Furnace"
                lastUsed = "1970-01-01T00:00:00.000Z"
                lastVersionId = "1.8.9-forge1.8.9-11.15.1.2318-1.8.9"
                name = "NIKECLIENT"
                type = "custom"
            }) -Force
        } else {
            $json.profiles.NIKECLIENT = ([PSCustomObject]@{
                created = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
                gameDir = "C:\Users\$env:USERNAME\AppData\Roaming\.minecraft\NikeClient"
                icon = "Furnace"
                lastUsed = "1970-01-01T00:00:00.000Z"
                lastVersionId = "1.8.9-forge1.8.9-11.15.1.2318-1.8.9"
                name = "NIKECLIENT"
                type = "custom"
            })
        }
        $json | ConvertTo-Json -Depth 10 | Set-Content $profilePath -Force
        Write-Output "Profilo 'NIKECLIENT' aggiunto con successo."
    } catch {
        Write-Output "Si è verificato un errore: $_"
    }
} else {
    Write-Output "Errore: launcher_profiles.json non trovato!"
}