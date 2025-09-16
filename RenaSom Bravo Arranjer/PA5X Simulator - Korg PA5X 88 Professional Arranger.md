# PA5X Simulator - Korg PA5X 88 Professional Arranger

Um simulador completo do teclado arranjador Korg PA5X 88, desenvolvido com tecnologias web modernas para oferecer uma experiência autêntica de performance musical.

## 🎹 Características Principais

### Interface Autêntica
- **Layout idêntico ao Korg PA5X 88** com todos os controles e botões
- **88 teclas virtuais** com resposta visual e tátil
- **Display LCD simulado** com informações em tempo real
- **Controles de transporte** (Start/Stop, Fill In, Break, Ending)
- **Seleção de estilos** por categorias organizadas

### Motor de Áudio Avançado
- **240 vozes de polifonia** simultâneas
- **Samples de piano super samplados** com qualidade Korg
- **Síntese em tempo real** para todos os instrumentos
- **Sistema de efeitos** (Reverb, Chorus, Delay)
- **Controle de volume master** e por canal

### Estilos Musicais Completos
- **Ritmos Brasileiros**: Samba, Bossa Nova, Forró, Baião, Axé, Maracatu
- **Estilos Internacionais**: Pop, Rock, Jazz, Latin, Country, Ballad
- **Variações dinâmicas**: Intro, Main A/B/C/D, Fill In, Break, Ending
- **Progressões de acordes** automáticas por estilo
- **Controle de tempo** de 60 a 200 BPM

### Suporte MIDI Completo
- **Entrada MIDI** para teclados controladores de 88 teclas
- **Saída MIDI** para dispositivos externos
- **Mapeamento de controles** (Sustain, Modulation, Volume)
- **Múltiplos canais MIDI** com filtros configuráveis
- **Transposição** em oitavas e semitons

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 19** com Hooks modernos
- **Vite** para build otimizado
- **Tailwind CSS** para estilização
- **Radix UI** para componentes acessíveis
- **Lucide React** para ícones

### Áudio
- **Web Audio API** para processamento de áudio
- **Web MIDI API** para conectividade MIDI
- **AudioContext** com buffer de baixa latência
- **Síntese aditiva** para geração de samples

### Build e Deploy
- **Inno Setup** para instalador Windows
- **Electron** (opcional) para aplicação desktop
- **PWA** com Service Workers para uso offline

## 📦 Instalação

### Requisitos do Sistema
- **Windows 10** ou superior (64-bit)
- **4GB RAM** mínimo (8GB recomendado)
- **2GB espaço livre** em disco
- **Placa de som** compatível com ASIO (recomendado)
- **Teclado MIDI** de 88 teclas (opcional)

### Instalação Automática
1. Baixe o instalador `PA5X_Simulator_Setup.exe`
2. Execute como administrador
3. Siga as instruções do assistente
4. O simulador será instalado e configurado automaticamente

### Instalação Manual (Desenvolvimento)
```bash
# Clonar repositório
git clone https://github.com/pa5x-simulator/pa5x-simulator.git
cd pa5x-simulator

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Construir para produção
npm run build

# Gerar instalador (Windows)
npm run build-installer
```

## 🎵 Como Usar

### Primeiros Passos
1. **Conecte seu teclado MIDI** (se disponível)
2. **Selecione uma categoria** de estilo (POP, ROCK, BRAZILIAN, etc.)
3. **Escolha um estilo** específico (Samba, Bossa Nova, etc.)
4. **Ajuste o tempo** usando o controle BPM
5. **Pressione START/STOP** para iniciar o acompanhamento

### Controles Principais
- **START/STOP**: Inicia/para o acompanhamento completo
- **DRUM PLAY**: Toca apenas a bateria
- **FILL IN**: Executa uma virada de bateria
- **BREAK**: Pausa o acompanhamento mantendo a bateria
- **ENDING**: Finaliza o estilo com um final apropriado

### Teclado Virtual
- **Clique nas teclas** para tocar notas
- **Use o teclado do computador** como alternativa
- **Conecte um teclado MIDI** para melhor experiência
- **Sustain pedal** suportado via MIDI

### Configurações MIDI
1. Acesse **Configurações > MIDI**
2. Selecione sua **interface MIDI**
3. Configure **canal MIDI** (padrão: Canal 1)
4. Ajuste **curva de velocidade** se necessário
5. Teste a **conectividade** tocando algumas notas

## 🎼 Estilos Disponíveis

### Brasileiros
- **Samba**: Ritmo tradicional brasileiro (100-140 BPM)
- **Bossa Nova**: Estilo suave e sofisticado (120-160 BPM)
- **Forró**: Ritmo nordestino animado (120-150 BPM)
- **Baião**: Base do forró tradicional (100-130 BPM)
- **Axé**: Ritmo baiano energético (130-160 BPM)
- **Maracatu**: Ritmo pernambucano tradicional

### Internacionais
- **8Beat Pop**: Pop comercial moderno (100-140 BPM)
- **16Beat**: Funk e R&B contemporâneo (110-150 BPM)
- **Rock**: Rock clássico e moderno (120-160 BPM)
- **Jazz Swing**: Jazz tradicional (120-200 BPM)
- **Ballad**: Baladas românticas (60-90 BPM)
- **Country**: Country americano (120-140 BPM)

## 🔧 Configuração Avançada

### Áudio
```ini
[Audio]
SampleRate=44100        ; Taxa de amostragem (44100/48000)
BufferSize=512          ; Tamanho do buffer (128/256/512/1024)
MaxPolyphony=240        ; Polifonia máxima
MasterVolume=0.7        ; Volume master (0.0-1.0)
```

### MIDI
```ini
[MIDI]
AutoConnect=1           ; Conectar automaticamente
Channel=0               ; Canal MIDI (0-15, 0=todos)
VelocityCurve=linear    ; Curva de velocidade (linear/exp/log)
TransposeOctaves=0      ; Transposição em oitavas (-4 a +4)
TransposeSemitones=0    ; Transposição em semitons (-12 a +12)
```

### Interface
```ini
[Display]
Theme=Dark              ; Tema (Dark/Light)
Language=Portuguese     ; Idioma (Portuguese/English/Spanish)
ShowKeyLabels=1         ; Mostrar nomes das notas
ShowVelocity=1          ; Mostrar velocidade MIDI
```

## 🛠️ Desenvolvimento

### Estrutura do Projeto
```
pa5x-simulator/
├── src/
│   ├── components/
│   │   ├── AudioEngine.jsx      # Motor de áudio
│   │   ├── MidiController.jsx   # Controle MIDI
│   │   ├── StyleEngine.jsx      # Sistema de estilos
│   │   └── RhythmEngine.jsx     # Motor de ritmos
│   ├── ui/                      # Componentes de interface
│   ├── App.jsx                  # Componente principal
│   └── main.jsx                 # Ponto de entrada
├── installer/
│   ├── setup.iss               # Script Inno Setup
│   └── build_installer.bat     # Script de build
├── public/                     # Arquivos estáticos
└── dist/                       # Build de produção
```

### Contribuindo
1. **Fork** o repositório
2. **Crie uma branch** para sua feature (`git checkout -b feature/nova-feature`)
3. **Commit** suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. **Push** para a branch (`git push origin feature/nova-feature`)
5. **Abra um Pull Request**

### Testes
```bash
# Executar testes unitários
npm run test

# Executar testes de integração
npm run test:integration

# Executar testes E2E
npm run test:e2e
```

## 📱 Compatibilidade

### Navegadores Suportados
- **Chrome 88+** (recomendado)
- **Firefox 85+**
- **Safari 14+**
- **Edge 88+**

### Sistemas Operacionais
- **Windows 10/11** (instalador nativo)
- **macOS 10.15+** (via navegador)
- **Linux** (via navegador)
- **Android/iOS** (funcionalidade limitada)

## 🎯 Roadmap

### Versão 1.1
- [ ] Mais estilos brasileiros (Frevo, Xote, Baião)
- [ ] Gravação de performances
- [ ] Exportação MIDI
- [ ] Presets personalizáveis

### Versão 1.2
- [ ] Samples de instrumentos reais
- [ ] Efeitos avançados (Compressor, EQ)
- [ ] Sequenciador integrado
- [ ] Suporte a VST plugins

### Versão 2.0
- [ ] Modo multiplayer online
- [ ] Streaming de performances
- [ ] Marketplace de estilos
- [ ] IA para acompanhamento inteligente

## 🐛 Problemas Conhecidos

### Áudio
- **Latência alta**: Use drivers ASIO para melhor performance
- **Cliques/pops**: Aumente o buffer size nas configurações
- **Volume baixo**: Verifique configurações do sistema

### MIDI
- **Dispositivo não detectado**: Reinicie o navegador
- **Notas presas**: Use o botão "All Notes Off"
- **Latência MIDI**: Verifique drivers do dispositivo

## 📞 Suporte

### Documentação
- **Manual do Usuário**: `docs/manual.pdf`
- **FAQ**: `docs/faq.md`
- **Tutoriais**: `docs/tutorials/`

### Contato
- **Email**: support@pa5x-simulator.com
- **Discord**: https://discord.gg/pa5x-simulator
- **GitHub Issues**: https://github.com/pa5x-simulator/pa5x-simulator/issues

## 📄 Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

### Créditos
- **Korg** - Inspiração do design original PA5X
- **Web Audio API** - Mozilla e W3C
- **React Team** - Framework React
- **Contribuidores** - Veja [CONTRIBUTORS.md](CONTRIBUTORS.md)

## 🌟 Agradecimentos

Agradecimentos especiais a todos os músicos, desenvolvedores e entusiastas que contribuíram para tornar este projeto realidade. O PA5X Simulator é um projeto de código aberto feito com ❤️ para a comunidade musical.

---

**PA5X Simulator** - Transformando seu computador em um arranjador profissional! 🎹✨

