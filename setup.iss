[Setup]
AppName=PA5X Simulator - Korg PA5X 88 Professional Arranger
AppVersion=1.0.0
AppPublisher=PA5X Simulator Team
AppPublisherURL=https://pa5x-simulator.com
AppSupportURL=https://pa5x-simulator.com/support
AppUpdatesURL=https://pa5x-simulator.com/updates
DefaultDirName={autopf}\PA5X Simulator
DefaultGroupName=PA5X Simulator
AllowNoIcons=yes
LicenseFile=license.txt
InfoBeforeFile=readme.txt
OutputDir=output
OutputBaseFilename=PA5X_Simulator_Setup
SetupIconFile=icon.ico
Compression=lzma
SolidCompression=yes
WizardStyle=modern
ArchitecturesAllowed=x64
ArchitecturesInstallIn64BitMode=x64
MinVersion=10.0.17763
PrivilegesRequired=admin
DisableProgramGroupPage=yes
DisableReadyPage=no
DisableFinishedPage=no
ShowLanguageDialog=no
LanguageDetectionMethod=uilanguage

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"
Name: "portuguese"; MessagesFile: "compiler:Languages\Portuguese.isl"
Name: "spanish"; MessagesFile: "compiler:Languages\Spanish.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked
Name: "quicklaunchicon"; Description: "{cm:CreateQuickLaunchIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked; OnlyBelowVersion: 6.1; Check: not IsAdminInstallMode
Name: "startmenu"; Description: "Criar atalho no Menu Iniciar"; GroupDescription: "{cm:AdditionalIcons}"; Flags: checked
Name: "mididriver"; Description: "Instalar driver MIDI virtual (LoopBe1)"; GroupDescription: "Componentes MIDI"; Flags: checked
Name: "vcredist"; Description: "Instalar Visual C++ Redistributable"; GroupDescription: "Dependências"; Flags: checked

[Files]
; Aplicação principal
Source: "app\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "app\PA5X_Simulator.exe"; DestDir: "{app}"; Flags: ignoreversion

; Samples de áudio
Source: "samples\*"; DestDir: "{app}\samples"; Flags: ignoreversion recursesubdirs createallsubdirs

; Estilos e ritmos
Source: "styles\*"; DestDir: "{app}\styles"; Flags: ignoreversion recursesubdirs createallsubdirs

; Soundfonts
Source: "soundfonts\*"; DestDir: "{app}\soundfonts"; Flags: ignoreversion recursesubdirs createallsubdirs

; Documentação
Source: "docs\*"; DestDir: "{app}\docs"; Flags: ignoreversion recursesubdirs createallsubdirs

; Driver MIDI virtual
Source: "drivers\LoopBe1\*"; DestDir: "{tmp}\loopbe1"; Flags: ignoreversion recursesubdirs createallsubdirs; Tasks: mididriver

; Visual C++ Redistributable
Source: "redist\VC_redist.x64.exe"; DestDir: "{tmp}"; Flags: ignoreversion deleteafterinstall; Tasks: vcredist

; Arquivos de configuração
Source: "config\*"; DestDir: "{userappdata}\PA5X Simulator"; Flags: ignoreversion recursesubdirs createallsubdirs onlyifdoesntexist

[Icons]
Name: "{group}\PA5X Simulator"; Filename: "{app}\PA5X_Simulator.exe"; WorkingDir: "{app}"; IconFilename: "{app}\icon.ico"
Name: "{group}\Manual do Usuário"; Filename: "{app}\docs\manual.pdf"
Name: "{group}\{cm:UninstallProgram,PA5X Simulator}"; Filename: "{uninstallexe}"
Name: "{autodesktop}\PA5X Simulator"; Filename: "{app}\PA5X_Simulator.exe"; WorkingDir: "{app}"; IconFilename: "{app}\icon.ico"; Tasks: desktopicon
Name: "{userappdata}\Microsoft\Internet Explorer\Quick Launch\PA5X Simulator"; Filename: "{app}\PA5X_Simulator.exe"; WorkingDir: "{app}"; Tasks: quicklaunchicon

[Run]
; Instalar Visual C++ Redistributable
Filename: "{tmp}\VC_redist.x64.exe"; Parameters: "/quiet /norestart"; StatusMsg: "Instalando Visual C++ Redistributable..."; Tasks: vcredist; Flags: waituntilterminated

; Instalar driver MIDI virtual
Filename: "{tmp}\loopbe1\setup.exe"; Parameters: "/S"; StatusMsg: "Instalando driver MIDI virtual..."; Tasks: mididriver; Flags: waituntilterminated

; Executar aplicação após instalação
Filename: "{app}\PA5X_Simulator.exe"; Description: "{cm:LaunchProgram,PA5X Simulator}"; Flags: nowait postinstall skipifsilent

[UninstallRun]
; Parar serviços se estiverem rodando
Filename: "{sys}\taskkill.exe"; Parameters: "/F /IM PA5X_Simulator.exe"; Flags: runhidden; RunOnceId: "StopPA5X"

[Registry]
; Associações de arquivo
Root: HKCR; Subkey: ".pa5x"; ValueType: string; ValueName: ""; ValueData: "PA5XStyle"; Flags: uninsdeletevalue
Root: HKCR; Subkey: "PA5XStyle"; ValueType: string; ValueName: ""; ValueData: "PA5X Style File"; Flags: uninsdeletekey
Root: HKCR; Subkey: "PA5XStyle\DefaultIcon"; ValueType: string; ValueName: ""; ValueData: "{app}\PA5X_Simulator.exe,0"
Root: HKCR; Subkey: "PA5XStyle\shell\open\command"; ValueType: string; ValueName: ""; ValueData: """{app}\PA5X_Simulator.exe"" ""%1"""

; Configurações do aplicativo
Root: HKCU; Subkey: "Software\PA5X Simulator"; ValueType: string; ValueName: "InstallPath"; ValueData: "{app}"; Flags: uninsdeletekey
Root: HKCU; Subkey: "Software\PA5X Simulator"; ValueType: string; ValueName: "Version"; ValueData: "1.0.0"
Root: HKCU; Subkey: "Software\PA5X Simulator"; ValueType: dword; ValueName: "FirstRun"; ValueData: 1

[Code]
var
  ProgressPage: TOutputProgressWizardPage;

function InitializeSetup(): Boolean;
begin
  Result := True;
  
  // Verificar se Windows 10 ou superior
  if not (GetWindowsVersion >= $0A000000) then
  begin
    MsgBox('Este programa requer Windows 10 ou superior.', mbError, MB_OK);
    Result := False;
    Exit;
  end;
  
  // Verificar se há espaço suficiente (mínimo 2GB)
  if GetSpaceOnDisk(ExpandConstant('{app}')) < 2147483648 then
  begin
    MsgBox('Espaço insuficiente em disco. São necessários pelo menos 2GB livres.', mbError, MB_OK);
    Result := False;
    Exit;
  end;
end;

procedure InitializeWizard();
begin
  ProgressPage := CreateOutputProgressWizardPage('Instalando Componentes', 
    'Por favor aguarde enquanto os componentes são instalados...');
end;

function PrepareToInstall(var NeedsRestart: Boolean): String;
var
  ResultCode: Integer;
begin
  Result := '';
  NeedsRestart := False;
  
  ProgressPage.SetText('Preparando instalação...', '');
  ProgressPage.SetProgress(0, 100);
  ProgressPage.Show;
  
  try
    // Verificar e parar processos conflitantes
    ProgressPage.SetText('Verificando processos em execução...', '');
    ProgressPage.SetProgress(25, 100);
    
    if Exec(ExpandConstant('{sys}\taskkill.exe'), '/F /IM PA5X_Simulator.exe', '', SW_HIDE, ewWaitUntilTerminated, ResultCode) then
    begin
      Sleep(1000);
    end;
    
    ProgressPage.SetProgress(50, 100);
    
    // Criar diretórios necessários
    ProgressPage.SetText('Criando diretórios...', '');
    ForceDirectories(ExpandConstant('{userappdata}\PA5X Simulator\Presets'));
    ForceDirectories(ExpandConstant('{userappdata}\PA5X Simulator\Recordings'));
    ForceDirectories(ExpandConstant('{userappdata}\PA5X Simulator\User Styles'));
    
    ProgressPage.SetProgress(75, 100);
    
    // Configurar permissões
    ProgressPage.SetText('Configurando permissões...', '');
    ProgressPage.SetProgress(100, 100);
    
  finally
    ProgressPage.Hide;
  end;
end;

procedure CurStepChanged(CurStep: TSetupStep);
begin
  case CurStep of
    ssPostInstall:
    begin
      // Configurações pós-instalação
      ProgressPage.SetText('Finalizando instalação...', '');
      ProgressPage.Show;
      
      try
        // Registrar codecs de áudio se necessário
        ProgressPage.SetProgress(25, 100);
        
        // Configurar firewall se necessário
        ProgressPage.SetProgress(50, 100);
        
        // Criar configuração inicial
        ProgressPage.SetProgress(75, 100);
        SaveStringToFile(ExpandConstant('{userappdata}\PA5X Simulator\config.ini'), 
          '[Audio]' + #13#10 + 
          'SampleRate=44100' + #13#10 + 
          'BufferSize=512' + #13#10 + 
          'MaxPolyphony=240' + #13#10 + 
          '[MIDI]' + #13#10 + 
          'AutoConnect=1' + #13#10 + 
          '[Display]' + #13#10 + 
          'Theme=Dark' + #13#10, 
          False);
        
        ProgressPage.SetProgress(100, 100);
        
      finally
        ProgressPage.Hide;
      end;
    end;
  end;
end;

function ShouldSkipPage(PageID: Integer): Boolean;
begin
  Result := False;
  
  // Pular página de componentes se não houver opções
  if PageID = wpSelectTasks then
  begin
    if not WizardIsTaskSelected('mididriver') and not WizardIsTaskSelected('vcredist') then
      Result := True;
  end;
end;

procedure CurUninstallStepChanged(CurUninstallStep: TUninstallStep);
var
  ResultCode: Integer;
begin
  case CurUninstallStep of
    usUninstall:
    begin
      // Parar todos os processos relacionados
      Exec(ExpandConstant('{sys}\taskkill.exe'), '/F /IM PA5X_Simulator.exe', '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
      
      // Aguardar um pouco
      Sleep(2000);
    end;
    
    usPostUninstall:
    begin
      // Perguntar se deseja manter configurações do usuário
      if MsgBox('Deseja manter suas configurações e presets personalizados?', mbConfirmation, MB_YESNO) = IDNO then
      begin
        DelTree(ExpandConstant('{userappdata}\PA5X Simulator'), True, True, True);
      end;
    end;
  end;
end;

