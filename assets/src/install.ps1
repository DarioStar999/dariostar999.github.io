$profilePath = "C:\Users\$env:USERNAME\AppData\Roaming\.minecraft\launcher_profiles.json"

if (Test-Path $profilePath) {
    try {
        # Legge il contenuto originale
        $jsonContent = Get-Content $profilePath -Raw

        # Rimozione preventiva delle chiavi duplicate (es. "Forge", "forge")
        $jsonContent = $jsonContent -replace '"[Ff]orge"\s*:\s*\{[^\}]*\},?', ""

        # Converte in oggetto JSON
        $json = $jsonContent | ConvertFrom-Json

        # Aggiunge profilo NIKECLIENT se mancante
        if (-not $json.profiles) {
            $json | Add-Member -MemberType NoteProperty -Name "profiles" -Value ([PSCustomObject]@{}) -Force
        }

        $nikeProfile = [PSCustomObject]@{
            created        = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
            gameDir        = "C:\Users\$env:USERNAME\AppData\Roaming\.minecraft\NikeClient"
            icon           = "Furnace"
            lastUsed       = "1970-01-01T00:00:00.000Z"
            lastVersionId  = "1.8.9-forge1.8.9-11.15.1.2318-1.8.9"
            name           = "NIKECLIENT"
            type           = "custom"
        }

        $json.profiles | Add-Member -MemberType NoteProperty -Name "NIKECLIENT" -Value $nikeProfile -Force

        # Scrive il JSON modificato sul file
        $json | ConvertTo-Json -Depth 10 | Set-Content $profilePath -Force

        Write-Output "Profilo 'NIKECLIENT' aggiunto o aggiornato con successo."
    } catch {
        Write-Output "❌ Si è verificato un errore: $_"
    }
} else {
    Write-Output "❌ Errore: launcher_profiles.json non trovato!"
}
