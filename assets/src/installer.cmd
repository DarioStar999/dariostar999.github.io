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
powershell -Command "& { Invoke-WebRequest -Uri 'https://cdn.discordapp.com/attachments/1108474765318041662/1281210986308571156/1.8.9-forge1.8.9-11.15.1.2318-1.8.9.jar?ex=66dae436&is=66d992b6&hm=630fdc634e9d80eb48aba454c3086d484f1e66f6b21916e575ed60faca258a17&' -OutFile '%versionpath%\1.8.9-forge1.8.9-11.15.1.2318-1.8.9\1.8.9-forge1.8.9-11.15.1.2318-1.8.9.jar' }"
@echo Riuscito
@echo Sto installando json della forge
powershell -Command "& { Invoke-WebRequest -Uri 'https://cdn.discordapp.com/attachments/1108474765318041662/1281210986778595388/1.8.9-forge1.8.9-11.15.1.2318-1.8.9.json?ex=66dae436&is=66d992b6&hm=7394198a71edaabc61b106f33e87333580f6ce3116bb5570956274db16bfc85d&' -OutFile '%versionpath%\1.8.9-forge1.8.9-11.15.1.2318-1.8.9\1.8.9-forge1.8.9-11.15.1.2318-1.8.9.json' }"
@echo Riuscito
@echo Sto installando jar della 1.8.9
powershell -Command "& { Invoke-WebRequest -Uri 'https://cdn.discordapp.com/attachments/1108474765318041662/1281210987222929448/1.8.9.jar?ex=66dae437&is=66d992b7&hm=4641d50fd2e1ceb7f843fb82ea2ca6d54966efc1e3ad1160e675e56442a88e31&' -OutFile '%versionpath%\1.8.9-forge1.8.9-11.15.1.2318-1.8.9\1.8.9.jar' }"
@echo Riuscito
@echo Sto installando la forge nella directory "%minecraftpath%\libraries\net\minecraftforge\forge\1.8.9-11.15.1.2318-1.8.9"
powershell -Command "& { Invoke-WebRequest -Uri 'https://cdn.discordapp.com/attachments/1108474765318041662/1281218020869537852/forge-1.8.9-11.15.1.2318-1.8.9.jar?ex=66daeac4&is=66d99944&hm=add91af7a0167b336210c1de83b504b2f34115f3330c8d1c05aaa2623b560183&' -OutFile '%minecraftpath%\libraries\net\minecraftforge\forge\1.8.9-11.15.1.2318-1.8.9\forge-1.8.9-11.15.1.2318-1.8.9.jar' }"
@echo Riuscito
goto install

:install
@echo creando la cartella di installazione
mkdir "%minecraftpath%\NikeClient" > nul
mkdir "%minecraftpath%\NikeClient\mods" > nul
powershell -Command "& { Invoke-WebRequest -Uri 'https://cdn.discordapp.com/attachments/1108474765318041662/1281214207932764220/install.ps1?ex=66dae736&is=66d995b6&hm=d9151fbf0aecfa0d9701e464f508d3dbfa59618a85ac686ca06df02f52e51b69&' -OutFile 'C:\Users\%username%\Downloads\install.ps1' }"
@echo Sto installando Nikeclient
powershell -Command "& { Invoke-WebRequest -Uri 'https://cdn.discordapp.com/attachments/1108474765318041662/1280511193575854162/NikeClient.jar?ex=66da52bb&is=66d9013b&hm=cbffc7079d28ab44d4b0d3f2e9cd136a218bb467ebd017175c4ca7368f7aaf0f&' -OutFile '%minecraftpath%\NikeClient\mods\NikeClient.jar' }"
@echo Riuscito
@echo Sto installando Cosmetics 
powershell -Command "& { Invoke-WebRequest -Uri 'https://cdn.discordapp.com/attachments/1108474765318041662/1280511192313630740/Cosmetics.jar?ex=66da52ba&is=66d9013a&hm=b5eae7aa342666fe37455333b53cf0d18d6dd642e306971855455e85311a3f7e&' -OutFile '%minecraftpath%\NikeClient\mods\Cosmetics.jar' }"
@echo Riuscito
@echo Sto installando FpsBoost 
powershell -Command "& { Invoke-WebRequest -Uri 'https://cdn.discordapp.com/attachments/1108474765318041662/1280511192837914624/FpsBoost.jar?ex=66da52bb&is=66d9013b&hm=ca09521d75a0007c050e932ef6c7ba1a23fc0a9223aa5dc0c9cc0323a604deaf&' -OutFile '%minecraftpath%\NikeClient\mods\FpsBoost.jar' }"
@echo Riuscito
@echo Sto installando Gui 
powershell -Command "& { Invoke-WebRequest -Uri 'https://cdn.discordapp.com/attachments/1108474765318041662/1280511193177391135/gui.jar?ex=66da52bb&is=66d9013b&hm=680f9154671fa9a6e7fabd8a27349d884d236278e7969438d2eb25f36a0eae8a&' -OutFile '%minecraftpath%\NikeClient\mods\gui.jar' }"
@echo Riuscito
@echo creando un profilo per il NikeClient 
powershell -NoProfile -ExecutionPolicy Bypass -File "C:\Users\%username%\Downloads\install.ps1"
rmdir "C:\Users\%username%\Downloads\install.ps1"
pause > nul