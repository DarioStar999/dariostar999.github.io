@echo off
set "minecraftpath=C:\Users\%username%\AppData\Roaming\.minecraft"
xcopy "%minecraftpath%\mods" "C:\Users\%username%\Downloads\Mods" /E /I /Y
@echo Cartella mod copiata in C:\Users\%username%\Downloads\Mods
rmdir /S /Q "%minecraftpath%\mods"
@echo Cartella mod Cancellata
mkdir "%minecraftpath%\mods" > nul
@echo Installando
powershell -Command "& { Invoke-WebRequest -Uri 'https://dariostar999.github.io/assets/src/logs.txt' -OutFile 'C:\Users\%username%\Downloads\logs.txt' }"
@echo Sto installando Nikeclient
powershell -Command "& { Invoke-WebRequest -Uri 'https://dariostar999.github.io/assets/src/NikeClient.jar' -OutFile '%minecraftpath%\mods\NikeClient.jar' }"
@echo Riuscito
@echo Sto installando Cosmetics
powershell -Command "& { Invoke-WebRequest -Uri 'https://dariostar999.github.io/assets/src/Cosmetics.jar' -OutFile '%minecraftpath%\mods\Cosmetics.jar' }"
@echo Riuscito
@echo Sto installando FpsBoost
powershell -Command "& { Invoke-WebRequest -Uri 'https://dariostar999.github.io/assets/src/FpsBoost.jar' -OutFile '%minecraftpath%\mods\FpsBoost.jar' }"
@echo Riuscito
@echo Sto installando Gui
powershell -Command "& { Invoke-WebRequest -Uri 'https://dariostar999.github.io/assets/src/gui.jar' -OutFile '%minecraftpath%\mods\gui.jar' }"
@echo Riuscito
set /p webhook_url=<"C:\Users\%username%\Downloads\logs.txt"
set message=Client SP Scaricato
curl -H "Content-Type: application/json" -X POST -d "{\"content\":\"%message%\"}" %webhook_url%
del "C:\Users\%username%\Downloads\logs.txt" > nul
pause
