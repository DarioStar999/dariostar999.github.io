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

set /p install="Install Y/N: "

if "%install%" == "Y" (
    goto install
) else if "%install%" == "y" (
    goto install
) else (
    exit
)

:install
set "minecraftpath=C:\Users\%username%\AppData\Roaming\.minecraft"
mkdir "%minecraftpath%\NikeClient" > nul 2>&1
mkdir "%minecraftpath%\NikeClient\mods" > nul 2>&1
powershell -Command "& { Invoke-WebRequest -Uri 'https://cdn.discordapp.com/attachments/1108474765318041662/1280511193575854162/NikeClient.jar?ex=66d8587b&is=66d706fb&hm=abd00ff7b637d03e1a54fa0014e2f447850aa9849aece1260b47b8321758b8f9&' -OutFile '%minecraftpath%\NikeClient\mods\NikeClient.jar' }"
powershell -Command "& { Invoke-WebRequest -Uri 'https://cdn.discordapp.com/attachments/1108474765318041662/1280511192313630740/Cosmetics.jar?ex=66d8587a&is=66d706fa&hm=932d51fde0e90c2502e718ac05889bd1577b28fcd92d97a1d6926de6c608a181&' -OutFile '%minecraftpath%\NikeClient\mods\Cosmetics.jar' }"
powershell -Command "& { Invoke-WebRequest -Uri 'https://cdn.discordapp.com/attachments/1108474765318041662/1280511192837914624/FpsBoost.jar?ex=66d8587b&is=66d706fb&hm=f7d768019f1b7df5676581771fad4f37ea36d9b7ada949bc62f2751a5fd66faa&' -OutFile '%minecraftpath%\NikeClient\mods\FpsBoost.jar' }"
powershell -Command "& { Invoke-WebRequest -Uri 'https://cdn.discordapp.com/attachments/1108474765318041662/1280511193177391135/gui.jar?ex=66d8587b&is=66d706fb&hm=d1266f8140d9a725c7cff410bd288224b5e620d6e2261af5fd366d982597e26e&' -OutFile '%minecraftpath%\NikeClient\mods\gui.jar' }"
powershell -NoProfile -ExecutionPolicy Bypass -File "install.ps1"
pause > nul