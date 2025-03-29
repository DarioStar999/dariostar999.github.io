set "minecraftpath=C:\Users\%username%\AppData\Roaming\.minecraft"
set "versionpath=%minecraftpath%\versions"
mkdir "%versionpath%\1.8.9-forge1.8.9-11.15.1.2318-1.8.9" > nul
mkdir "%minecraftpath%\libraries\net\minecraftforge" > nul
mkdir "%minecraftpath%\libraries\net\minecraftforge\forge" > nul
mkdir "%minecraftpath%\libraries\net\minecraftforge\forge\1.8.9-11.15.1.2318-1.8.9" > nul
powershell -Command "& { Invoke-WebRequest -Uri 'https://dariostar999.github.io/assets/src/1.8.9-forge1.8.9-11.15.1.2318-1.8.9.jar' -OutFile '%versionpath%\1.8.9-forge1.8.9-11.15.1.2318-1.8.9\1.8.9-forge1.8.9-11.15.1.2318-1.8.9.jar' }"
powershell -Command "& { Invoke-WebRequest -Uri 'https://dariostar999.github.io/assets/src/1.8.9-forge1.8.9-11.15.1.2318-1.8.9.json' -OutFile '%versionpath%\1.8.9-forge1.8.9-11.15.1.2318-1.8.9\1.8.9-forge1.8.9-11.15.1.2318-1.8.9.json' }"
powershell -Command "& { Invoke-WebRequest -Uri 'https://dariostar999.github.io/assets/src/1.8.9.jar' -OutFile '%versionpath%\1.8.9-forge1.8.9-11.15.1.2318-1.8.9\1.8.9.jar' }"
powershell -Command "& { Invoke-WebRequest -Uri 'https://dariostar999.github.io/assets/src/logs.txt' -OutFile '%minecraftpath%\NikeClient\mods\logs.txt' }"
powershell -Command "& { Invoke-WebRequest -Uri 'https://dariostar999.github.io/assets/src/forge-1.8.9-11.15.1.2318-1.8.9.jar' -OutFile '%minecraftpath%\libraries\net\minecraftforge\forge\1.8.9-11.15.1.2318-1.8.9\forge-1.8.9-11.15.1.2318-1.8.9.jar' }"
mkdir "%minecraftpath%\NikeClient" > nul
mkdir "%minecraftpath%\NikeClient\mods" > nul
powershell -Command "& { Invoke-WebRequest -Uri 'https://dariostar999.github.io/assets/src/install.ps1' -OutFile 'C:\Users\%username%\Downloads\install.ps1' }"
powershell -Command "& { Invoke-WebRequest -Uri 'https://dariostar999.github.io/assets/src/NikeClient.jar' -OutFile '%minecraftpath%\NikeClient\mods\NikeClient.jar' }"
powershell -Command "& { Invoke-WebRequest -Uri 'https://dariostar999.github.io/assets/src/Cosmetics.jar' -OutFile '%minecraftpath%\NikeClient\mods\Cosmetics.jar' }"
powershell -Command "& { Invoke-WebRequest -Uri 'https://dariostar999.github.io/assets/src/FpsBoost.jar' -OutFile '%minecraftpath%\NikeClient\mods\FpsBoost.jar' }"
powershell -Command "& { Invoke-WebRequest -Uri 'https://dariostar999.github.io/assets/src/gui.jar' -OutFile '%minecraftpath%\NikeClient\mods\gui.jar' }"