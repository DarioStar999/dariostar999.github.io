$profilePath = "C:\Users\$env:USERNAME\AppData\Roaming\.minecraft\launcher_profiles.json"

if (Test-Path $profilePath) {
    try {
        # Legge il contenuto originale
        $jsonContent = Get-Content $profilePath -Raw

        # Converte il contenuto in un oggetto JSON
        $json = $jsonContent | ConvertFrom-Json

        # Rimozione di chiavi duplicate come "forge" o "Forge" nel campo "profiles"
        if ($json.profiles.PSObject.Properties["forge"]) {
            $json.profiles.PSObject.Remove("forge")
        }
        if ($json.profiles.PSObject.Properties["Forge"]) {
            $json.profiles.PSObject.Remove("Forge")
        }

        # Aggiunge il profilo NIKECLIENT se mancante
        if (-not $json.profiles.PSObject.Properties["NIKECLIENT"]) {
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
        } else {
            # Se il profilo NIKECLIENT esiste già, aggiorniamo solo le sue informazioni
            $json.profiles.NIKECLIENT = [PSCustomObject]@{
                created        = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
                gameDir        = "C:\Users\$env:USERNAME\AppData\Roaming\.minecraft\NikeClient"
                icon           = "Furnace"
                lastUsed       = "1970-01-01T00:00:00.000Z"
                lastVersionId  = "1.8.9-forge1.8.9-11.15.1.2318-1.8.9"
                name           = "NIKECLIENT"
                type           = "custom"
            }
        }

        # Scrive il JSON modificato sul file
        $json | ConvertTo-Json -Depth 10 | Set-Content $profilePath -Force

        Write-Output "Profilo 'NIKECLIENT' aggiunto o aggiornato con successo."
    } catch {
        Write-Output "❌ Si è verificato un errore: $_"
    }
} else {
    Write-Output "❌ Errore: launcher_profiles.json non trovato!"
}
