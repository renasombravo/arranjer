import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Slider } from '@/components/ui/slider.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Play, Pause, Square, SkipForward, SkipBack, Volume2, Mic, Guitar, Usb } from 'lucide-react'
import { useAudioEngine } from './components/AudioEngine.jsx'
import { useMidiController } from './components/MidiController.jsx'
import { useStyleEngine, STYLE_CATEGORIES, STYLE_VARIATIONS } from './components/StyleEngine.jsx'
import './App.css'

function App() {
  // Audio Engine
  const { audioEngine, isInitialized, activeVoices, maxPolyphony } = useAudioEngine()
  
  // MIDI Controller
  const { 
    midiController, 
    connectedInputs, 
    connectedOutputs, 
    activeNotes: midiActiveNotes,
    isInitialized: midiInitialized 
  } = useMidiController(audioEngine, null)
  
  // Style Engine
  const {
    styleEngine,
    currentCategory,
    currentStyle,
    currentVariation,
    isPlaying,
    currentStep,
    currentMeasure,
    currentChord,
    startStop,
    selectCategory,
    selectStyle,
    selectVariation,
    setTempo: setStyleTempo,
    categories,
    variations
  } = useStyleEngine(audioEngine)

  const [tempo, setTempo] = useState([120])
  const [masterVolume, setMasterVolume] = useState([75])
  const [selectedMidiInput, setSelectedMidiInput] = useState('')
  const [selectedMidiOutput, setSelectedMidiOutput] = useState('')

  // Acordes disponíveis
  const chords = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

  // Atualizar tempo no style engine
  useEffect(() => {
    setStyleTempo(tempo[0])
  }, [tempo, setStyleTempo])

  // Atualizar volume master
  useEffect(() => {
    if (audioEngine) {
      audioEngine.setMasterVolume(masterVolume[0] / 100)
    }
  }, [masterVolume, audioEngine])

  // Handlers para controles
  const handleCategorySelect = (category) => {
    selectCategory(category)
  }

  const handleStyleSelect = (style) => {
    selectStyle(style)
  }

  const handleVariationSelect = (variation) => {
    selectVariation(variation)
  }

  const handlePianoKeyPress = (note) => {
    if (audioEngine) {
      audioEngine.playNote(note, 100, 'piano')
    }
  }

  const handleMidiInputSelect = (inputId) => {
    setSelectedMidiInput(inputId)
  }

  const handleMidiOutputSelect = (outputId) => {
    setSelectedMidiOutput(outputId)
  }

  // Gerar teclas do piano (88 teclas)
  const generatePianoKeys = () => {
    const keys = []
    const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
    const blackKeys = ['C#', 'D#', '', 'F#', 'G#', 'A#', '']
    
    for (let octave = 0; octave < 8; octave++) {
      whiteKeys.forEach((note, index) => {
        if (octave === 0 && index < 3) return // Começar do A0
        if (octave === 7 && index > 0) return // Terminar no C8
        
        keys.push({
          note: note + octave,
          type: 'white',
          isPressed: false
        })
        
        if (blackKeys[index]) {
          keys.push({
            note: blackKeys[index] + octave,
            type: 'black',
            isPressed: false
          })
        }
      })
    }
    
    return keys.slice(0, 88) // Garantir exatamente 88 teclas
  }

  const pianoKeys = generatePianoKeys()

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header estilo PA5X */}
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 border-b-2 border-gray-700 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-cyan-400">PA5X SIMULATOR</h1>
            <p className="text-gray-300 text-sm">88 KEYS • 240 POLYPHONY • PROFESSIONAL ARRANGER</p>
          </div>
          
          {/* Status Panel */}
          <Card className="bg-gray-800 border-gray-600">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${midiConnected ? 'bg-cyan-400' : 'bg-gray-600'}`}></div>
                  <span className="text-xs">MIDI IN</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${kontaktConnected ? 'bg-blue-400' : 'bg-gray-600'}`}></div>
                  <span className="text-xs">KONTAKT8</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isInitialized ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                  <span className="text-xs">AUDIO</span>
                </div>
                <div className="text-xs">
                  <span className="text-cyan-400">{activeVoices}</span>
                  <span className="text-gray-400">/{maxPolyphony}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Controles principais */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex gap-4 items-center">
          {/* Botões de transporte */}
          <div className="flex gap-2">
            <Button 
              onClick={startStop}
              className={`${isPlaying ? 'bg-green-600 hover:bg-green-700' : 'bg-green-700 hover:bg-green-600'} text-white`}
            >
              {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              START/STOP
            </Button>
            
            <Button 
              onClick={drumPlay}
              className={`${isDrumPlaying ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-500'} text-white`}
            >
              <Volume2 className="w-4 h-4 mr-2" />
              DRUM PLAY
            </Button>
            
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              <Square className="w-4 h-4 mr-2" />
              DRUM PAUSE
            </Button>
            
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              SYNC
            </Button>
          </div>

          {/* Controles de tempo */}
          <div className="flex items-center gap-2 ml-8">
            <Button 
              onClick={() => setTempo([Math.max(60, tempo[0] - 1)])}
              variant="outline" 
              size="sm"
              className="bg-gray-800 border-gray-600 text-cyan-400"
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            
            <div className="w-32">
              <Slider
                value={tempo}
                onValueChange={setTempo}
                max={200}
                min={60}
                step={1}
                className="w-full"
              />
            </div>
            
            <Button 
              onClick={() => setTempo([Math.min(200, tempo[0] + 1)])}
              variant="outline" 
              size="sm"
              className="bg-gray-800 border-gray-600 text-cyan-400"
            >
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          {/* Display de tempo */}
          <Card className="bg-gray-900 border-gray-600">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-mono text-cyan-400">{tempo[0]}</div>
                <div className="text-xs text-gray-400">BPM</div>
                {isPlaying && <div className="w-2 h-2 bg-green-400 rounded-full mx-auto mt-1"></div>}
              </div>
            </CardContent>
          </Card>

          {/* Kontakt8 */}
          <Button className="bg-blue-600 hover:bg-blue-700 text-white ml-4">
            KONTAKT8
          </Button>
        </div>
      </div>

      {/* MIDI Devices */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">MIDI IN</span>
            <Select>
              <SelectTrigger className="w-48 bg-gray-800 border-gray-600">
                <SelectValue placeholder="Select MIDI Input" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No MIDI Input</SelectItem>
                <SelectItem value="usb">USB MIDI Controller</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">MIDI OUT</span>
            <Select>
              <SelectTrigger className="w-48 bg-gray-800 border-gray-600">
                <SelectValue placeholder="Select MIDI Output" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No MIDI Output</SelectItem>
                <SelectItem value="kontakt">Kontakt8 Virtual Port</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Categorias de estilo */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex gap-2 mb-4">
          {styleCategories.map((category) => (
            <Button
              key={category.name}
              className={`${category.color} hover:opacity-80 text-white`}
            >
              {category.name}
            </Button>
          ))}
        </div>
        
        {/* Lista de estilos */}
        <div className="flex gap-2 flex-wrap">
          {styles.map((style) => (
            <Button
              key={style}
              onClick={() => handleStyleSelect(style)}
              variant={selectedStyle === style ? "default" : "outline"}
              className={selectedStyle === style ? "bg-cyan-400 text-black" : "bg-gray-800 border-gray-600 text-white hover:bg-gray-700"}
            >
              {style}
            </Button>
          ))}
        </div>
      </div>

      {/* Variações de estilo */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex gap-2">
          {variations.map((variation) => (
            <Button
              key={variation.name}
              onClick={() => handleVariationSelect(variation.name)}
              className={`${variation.color} hover:opacity-80 text-white ${selectedVariation === variation.name ? 'ring-2 ring-cyan-400' : ''}`}
            >
              {variation.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Controles de acorde */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">CHORD</span>
            <Select value={currentChord} onValueChange={() => {}}>
              <SelectTrigger className="w-24 bg-gray-800 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {chords.map((chord) => (
                  <SelectItem key={chord} value={chord}>{chord}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">MODE</span>
            <Select>
              <SelectTrigger className="w-32 bg-gray-800 border-gray-600">
                <SelectValue placeholder="Major" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="major">Major</SelectItem>
                <SelectItem value="minor">Minor</SelectItem>
                <SelectItem value="7th">7th</SelectItem>
                <SelectItem value="maj7">Maj7</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">MEASURE</span>
            <Badge variant="outline" className="bg-gray-800 border-gray-600 text-cyan-400">
              {currentMeasure}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">STEP</span>
            <Badge variant="outline" className="bg-gray-800 border-gray-600 text-cyan-400">
              {currentStep + 1}/16
            </Badge>
          </div>
        </div>
      </div>

      {/* Teclado virtual 88 teclas */}
      <div className="p-4">
        <Card className="bg-gray-800 border-gray-600">
          <CardHeader>
            <CardTitle className="text-cyan-400">Virtual Keyboard (88 Keys)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-32 bg-gray-900 rounded overflow-x-auto">
              <div className="flex h-full min-w-max">
                {pianoKeys.map((key, index) => (
                  <div
                    key={index}
                    onClick={() => handlePianoKeyPress(key.note)}
                    className={`
                      ${key.type === 'white' 
                        ? 'bg-white border border-gray-300 w-6 h-full' 
                        : 'bg-gray-900 border border-gray-700 w-4 h-20 -ml-2 -mr-2 z-10'
                      }
                      ${key.isPressed ? 'bg-cyan-400' : ''}
                      cursor-pointer hover:bg-gray-200 transition-colors
                      flex items-end justify-center pb-2
                    `}
                    style={{
                      marginLeft: key.type === 'black' ? '-8px' : '0',
                      marginRight: key.type === 'black' ? '-8px' : '0',
                    }}
                  >
                    <span className={`text-xs ${key.type === 'white' ? 'text-gray-600' : 'text-gray-400'}`}>
                      {key.note}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles de entrada */}
      <div className="p-4 grid grid-cols-3 gap-4">
        <Card className="bg-gray-800 border-gray-600">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="w-5 h-5" />
              Microphone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Slider defaultValue={[50]} max={100} step={1} />
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="bg-gray-700 border-gray-600">EQ</Button>
                <Button size="sm" variant="outline" className="bg-gray-700 border-gray-600">REVERB</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-600">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Guitar className="w-5 h-5" />
              Guitar Input
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Slider defaultValue={[30]} max={100} step={1} />
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="bg-gray-700 border-gray-600">AMP</Button>
                <Button size="sm" variant="outline" className="bg-gray-700 border-gray-600">EFFECTS</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-600">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              Master Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Slider 
                value={masterVolume} 
                onValueChange={setMasterVolume}
                max={100} 
                step={1} 
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>0</span>
                <span className="text-cyan-400">{masterVolume[0]}%</span>
                <span>100</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App

