@echo off
echo ========================================
echo PA5X Simulator - Build Installer Script
echo ========================================
echo.

REM Verificar se o Inno Setup está instalado
if not exist "C:\Program Files (x86)\Inno Setup 6\ISCC.exe" (
    echo ERRO: Inno Setup 6 não encontrado!
    echo Por favor, instale o Inno Setup 6 de: https://jrsoftware.org/isdl.php
    pause
    exit /b 1
)

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Node.js não encontrado!
    echo Por favor, instale o Node.js de: https://nodejs.org/
    pause
    exit /b 1
)

REM Definir diretórios
set PROJECT_DIR=%~dp0..
set BUILD_DIR=%PROJECT_DIR%\build
set INSTALLER_DIR=%PROJECT_DIR%\installer
set APP_DIR=%INSTALLER_DIR%\app

echo Diretório do projeto: %PROJECT_DIR%
echo Diretório de build: %BUILD_DIR%
echo Diretório do instalador: %INSTALLER_DIR%
echo.

REM Limpar diretórios anteriores
echo Limpando diretórios anteriores...
if exist "%BUILD_DIR%" rmdir /s /q "%BUILD_DIR%"
if exist "%APP_DIR%" rmdir /s /q "%APP_DIR%"
if exist "%INSTALLER_DIR%\output" rmdir /s /q "%INSTALLER_DIR%\output"

REM Criar diretórios necessários
echo Criando diretórios...
mkdir "%BUILD_DIR%" 2>nul
mkdir "%APP_DIR%" 2>nul
mkdir "%INSTALLER_DIR%\samples" 2>nul
mkdir "%INSTALLER_DIR%\styles" 2>nul
mkdir "%INSTALLER_DIR%\soundfonts" 2>nul
mkdir "%INSTALLER_DIR%\docs" 2>nul
mkdir "%INSTALLER_DIR%\config" 2>nul
mkdir "%INSTALLER_DIR%\drivers" 2>nul
mkdir "%INSTALLER_DIR%\redist" 2>nul

REM Navegar para o diretório do projeto
cd /d "%PROJECT_DIR%"

REM Instalar dependências
echo Instalando dependências...
call npm install
if errorlevel 1 (
    echo ERRO: Falha ao instalar dependências!
    pause
    exit /b 1
)

REM Construir aplicação React
echo Construindo aplicação React...
call npm run build
if errorlevel 1 (
    echo ERRO: Falha ao construir aplicação!
    pause
    exit /b 1
)

REM Copiar arquivos da aplicação
echo Copiando arquivos da aplicação...
xcopy "%PROJECT_DIR%\dist\*" "%APP_DIR%\" /E /I /Y
if errorlevel 1 (
    echo ERRO: Falha ao copiar arquivos da aplicação!
    pause
    exit /b 1
)

REM Criar executável wrapper (simulado - em produção seria um executável real)
echo Criando executável wrapper...
echo @echo off > "%APP_DIR%\PA5X_Simulator.bat"
echo cd /d "%%~dp0" >> "%APP_DIR%\PA5X_Simulator.bat"
echo start "" "index.html" >> "%APP_DIR%\PA5X_Simulator.bat"

REM Copiar ícone
if exist "%PROJECT_DIR%\public\icon.ico" (
    copy "%PROJECT_DIR%\public\icon.ico" "%APP_DIR%\icon.ico"
) else (
    echo AVISO: Ícone não encontrado, usando padrão...
    echo. > "%APP_DIR%\icon.ico"
)

REM Criar samples de demonstração
echo Criando samples de demonstração...
echo ; PA5X Simulator Sample Bank > "%INSTALLER_DIR%\samples\demo_samples.sf2"
echo ; Este arquivo conteria os samples de áudio reais >> "%INSTALLER_DIR%\samples\demo_samples.sf2"

REM Criar estilos de demonstração
echo Criando estilos de demonstração...
echo [Style] > "%INSTALLER_DIR%\styles\8Beat_Pop.pa5x"
echo Name=8Beat Pop >> "%INSTALLER_DIR%\styles\8Beat_Pop.pa5x"
echo Tempo=120 >> "%INSTALLER_DIR%\styles\8Beat_Pop.pa5x"
echo Category=POP >> "%INSTALLER_DIR%\styles\8Beat_Pop.pa5x"

echo [Style] > "%INSTALLER_DIR%\styles\Samba.pa5x"
echo Name=Samba >> "%INSTALLER_DIR%\styles\Samba.pa5x"
echo Tempo=130 >> "%INSTALLER_DIR%\styles\Samba.pa5x"
echo Category=BRAZILIAN >> "%INSTALLER_DIR%\styles\Samba.pa5x"

REM Criar documentação
echo Criando documentação...
echo PA5X Simulator - Manual do Usuário > "%INSTALLER_DIR%\docs\manual.txt"
echo. >> "%INSTALLER_DIR%\docs\manual.txt"
echo Este é o manual do usuário do PA5X Simulator. >> "%INSTALLER_DIR%\docs\manual.txt"
echo. >> "%INSTALLER_DIR%\docs\manual.txt"
echo Características: >> "%INSTALLER_DIR%\docs\manual.txt"
echo - 88 teclas virtuais >> "%INSTALLER_DIR%\docs\manual.txt"
echo - 240 vozes de polifonia >> "%INSTALLER_DIR%\docs\manual.txt"
echo - Múltiplos estilos musicais >> "%INSTALLER_DIR%\docs\manual.txt"
echo - Suporte MIDI >> "%INSTALLER_DIR%\docs\manual.txt"
echo - Ritmos brasileiros e internacionais >> "%INSTALLER_DIR%\docs\manual.txt"

REM Criar arquivos de configuração
echo Criando configuração padrão...
echo [Audio] > "%INSTALLER_DIR%\config\default.ini"
echo SampleRate=44100 >> "%INSTALLER_DIR%\config\default.ini"
echo BufferSize=512 >> "%INSTALLER_DIR%\config\default.ini"
echo MaxPolyphony=240 >> "%INSTALLER_DIR%\config\default.ini"
echo. >> "%INSTALLER_DIR%\config\default.ini"
echo [MIDI] >> "%INSTALLER_DIR%\config\default.ini"
echo AutoConnect=1 >> "%INSTALLER_DIR%\config\default.ini"
echo Channel=0 >> "%INSTALLER_DIR%\config\default.ini"
echo. >> "%INSTALLER_DIR%\config\default.ini"
echo [Display] >> "%INSTALLER_DIR%\config\default.ini"
echo Theme=Dark >> "%INSTALLER_DIR%\config\default.ini"
echo Language=Portuguese >> "%INSTALLER_DIR%\config\default.ini"

REM Criar arquivos de licença e readme
echo Criando arquivos de licença...
echo PA5X Simulator License Agreement > "%INSTALLER_DIR%\license.txt"
echo. >> "%INSTALLER_DIR%\license.txt"
echo Este software é fornecido "como está" sem garantias. >> "%INSTALLER_DIR%\license.txt"
echo Uso apenas para fins educacionais e de demonstração. >> "%INSTALLER_DIR%\license.txt"

echo PA5X Simulator - Readme > "%INSTALLER_DIR%\readme.txt"
echo. >> "%INSTALLER_DIR%\readme.txt"
echo Bem-vindo ao PA5X Simulator! >> "%INSTALLER_DIR%\readme.txt"
echo. >> "%INSTALLER_DIR%\readme.txt"
echo Este simulador recria a experiência do Korg PA5X 88. >> "%INSTALLER_DIR%\readme.txt"
echo. >> "%INSTALLER_DIR%\readme.txt"
echo Requisitos do sistema: >> "%INSTALLER_DIR%\readme.txt"
echo - Windows 10 ou superior >> "%INSTALLER_DIR%\readme.txt"
echo - 4GB RAM mínimo >> "%INSTALLER_DIR%\readme.txt"
echo - 2GB espaço em disco >> "%INSTALLER_DIR%\readme.txt"
echo - Placa de som compatível >> "%INSTALLER_DIR%\readme.txt"

REM Simular download de dependências (em produção, baixaria arquivos reais)
echo Preparando dependências...
echo Visual C++ Redistributable placeholder > "%INSTALLER_DIR%\redist\VC_redist.x64.exe"
echo LoopBe1 MIDI Driver placeholder > "%INSTALLER_DIR%\drivers\LoopBe1\setup.exe"

REM Construir instalador com Inno Setup
echo.
echo Construindo instalador...
"C:\Program Files (x86)\Inno Setup 6\ISCC.exe" "%INSTALLER_DIR%\setup.iss"
if errorlevel 1 (
    echo ERRO: Falha ao construir instalador!
    pause
    exit /b 1
)

REM Verificar se o instalador foi criado
if exist "%INSTALLER_DIR%\output\PA5X_Simulator_Setup.exe" (
    echo.
    echo ========================================
    echo SUCESSO! Instalador criado com sucesso!
    echo ========================================
    echo.
    echo Localização: %INSTALLER_DIR%\output\PA5X_Simulator_Setup.exe
    echo Tamanho: 
    dir "%INSTALLER_DIR%\output\PA5X_Simulator_Setup.exe" | find "PA5X_Simulator_Setup.exe"
    echo.
    echo O instalador está pronto para distribuição!
    echo.
) else (
    echo ERRO: Instalador não foi criado!
    exit /b 1
)

REM Perguntar se deseja executar o instalador
set /p EXECUTE="Deseja executar o instalador agora? (s/n): "
if /i "%EXECUTE%"=="s" (
    start "" "%INSTALLER_DIR%\output\PA5X_Simulator_Setup.exe"
)

echo.
echo Processo concluído!
pause

