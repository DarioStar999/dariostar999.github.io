::variables
set "minecraftpath=C:\Users\%username%\AppData\Roaming\.minecraft"
set "versionpath=%minecraftpath%\versions"

:start
cls
@echo off
chcp 65001>nul

@echo ░▒▓█▓▒░▒▓███████▓▒░ ░▒▓███████▓▒░▒▓████████▓▒░▒▓██████▓▒░░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓████████▓▒░▒▓███████▓▒░  
@echo ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░         ░▒▓█▓▒░  ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░ 
@echo ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░         ░▒▓█▓▒░  ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░ 
@echo ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░░▒▓██████▓▒░   ░▒▓█▓▒░  ░▒▓████████▓▒░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓██████▓▒░ ░▒▓███████▓▒░  
@echo ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░      ░▒▓█▓▒░  ░▒▓█▓▒░  ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░ 
@echo ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░      ░▒▓█▓▒░  ░▒▓█▓▒░  ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░ 
@echo ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓███████▓▒░   ░▒▓█▓▒░  ░▒▓█▓▒░░▒▓█▓▒░▒▓████████▓▒░▒▓████████▓▒░▒▓████████▓▒░▒▓█▓▒░░▒▓█▓▒░   

chcp 437 >nul

:forge_select
set /p forge="(Consigliato)Install Forge(1.8) Y/N: "

if "%forge%" == "Y" (
    goto install_forge
) else if "%forge%" == "y" (
    goto install_forge
) else if "%forge%" == "N" (
    goto select
) else if "%forge%" == "n" ( 
    goto select
) else (
    @echo please select a valid option!
    goto forge_select
)

:select
set /p install="Install Y/N: "

if "%install%" == "Y" (
    goto install
) else if "%install%" == "y" (
    goto install
) else (
    exit
)

:install_forge
mkdir "%versionpath%\1.8.9-forge1.8.9-11.15.1.2318-1.8.9" > nul
mkdir "%minecraftpath%\libraries\net\minecraftforge" > nul
mkdir "%minecraftpath%\libraries\net\minecraftforge\forge" > nul
mkdir "%minecraftpath%\libraries\net\minecraftforge\forge\1.8.9-11.15.1.2318-1.8.9" > nul
@echo Sto installando jar della forge
powershell -Command "& { Invoke-WebRequest -Uri 'https://dariostar999.github.io/assets/src/1.8.9-forge1.8.9-11.15.1.2318-1.8.9.jar' -OutFile '%versionpath%\1.8.9-forge1.8.9-11.15.1.2318-1.8.9\1.8.9-forge1.8.9-11.15.1.2318-1.8.9.jar' }"
@echo Riuscito
@echo Sto installando json della forge
powershell -Command "& { Invoke-WebRequest -Uri 'https://dariostar999.github.io/assets/src/1.8.9-forge1.8.9-11.15.1.2318-1.8.9.json' -OutFile '%versionpath%\1.8.9-forge1.8.9-11.15.1.2318-1.8.9\1.8.9-forge1.8.9-11.15.1.2318-1.8.9.json' }"
@echo Riuscito
@echo Sto installando jar della 1.8.9
powershell -Command "& { Invoke-WebRequest -Uri 'https://dariostar999.github.io/assets/src/1.8.9.jar' -OutFile '%versionpath%\1.8.9-forge1.8.9-11.15.1.2318-1.8.9\1.8.9.jar' }"
@echo Riuscito
@echo Sto installando la forge nella directory "%minecraftpath%\libraries\net\minecraftforge\forge\1.8.9-11.15.1.2318-1.8.9"
powershell -Command "& { Invoke-WebRequest -Uri 'https://dariostar999.github.io/assets/src/forge-1.8.9-11.15.1.2318-1.8.9.jar' -OutFile '%minecraftpath%\libraries\net\minecraftforge\forge\1.8.9-11.15.1.2318-1.8.9\forge-1.8.9-11.15.1.2318-1.8.9.jar' }"
@echo Riuscito
goto install

:install
@echo creando la cartella di installazione
mkdir "%minecraftpath%\NikeClient" > nul
mkdir "%minecraftpath%\NikeClient\mods" > nul
powershell -Command "& { Invoke-WebRequest -Uri 'https://dariostar999.github.io/assets/src/install.ps1' -OutFile 'C:\Users\%username%\Downloads\install.ps1' }"
@echo Sto installando Nikeclient
powershell -Command "& { Invoke-WebRequest -Uri 'https://dariostar999.github.io/assets/src/NikeClient.jar' -OutFile '%minecraftpath%\NikeClient\mods\NikeClient.jar' }"
@echo Riuscito
@echo Sto installando Cosmetics 
powershell -Command "& { Invoke-WebRequest -Uri https://dariostar999.github.io/assets/src/Cosmetics.jar' -OutFile '%minecraftpath%\NikeClient\mods\Cosmetics.jar' }"
@echo Riuscito
@echo Sto installando FpsBoost 
powershell -Command "& { Invoke-WebRequest -Uri 'https://dariostar999.github.io/assets/src/FpsBoost.jar' -OutFile '%minecraftpath%\NikeClient\mods\FpsBoost.jar' }"
@echo Riuscito
@echo Sto installando Gui 
powershell -Command "& { Invoke-WebRequest -Uri 'https://dariostar999.github.io/assets/src/gui.jar' -OutFile '%minecraftpath%\NikeClient\mods\gui.jar' }"
@echo Riuscito
@echo creando un profilo per il NikeClient 
powershell -NoProfile -ExecutionPolicy Bypass -File "C:\Users\%username%\Downloads\install.ps1"
rmdir "C:\Users\%username%\Downloads\install.ps1"
pause > nul
