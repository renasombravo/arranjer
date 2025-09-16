import { useState, useEffect, useRef } from 'react'

// Mapeamento de notas MIDI para nomes
const MIDI_NOTE_NAMES = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
]

// Converte número MIDI para nome da nota
function midiToNoteName(midiNumber) {
  const octave = Math.floor(midiNumber / 12) - 1
  const noteIndex = midiNumber % 12
  return MIDI_NOTE_NAMES[noteIndex] + octave
}

// Converte nome da nota para número MIDI
function noteNameToMidi(noteName) {
  const noteMap = {
    'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5,
    'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
  }
  
  const notePart = noteName.slice(0, -1)
  const octave = parseInt(noteName.slice(-1))
  
  return (octave + 1) * 12 + noteMap[notePart]
}

export class MidiController {
  constructor(audioEngine, rhythmEngine) {
    this.audioEngine = audioEngine
    this.rhythmEngine = rhythmEngine
    this.midiAccess = null
    this.connectedInputs = new Map()
    this.connectedOutputs = new Map()
    this.activeNotes = new Set()
    this.sustainPedal = false
    this.sustainedNotes = new Set()
    
    // Callbacks
    this.onDeviceChange = null
    this.onNoteOn = null
    this.onNoteOff = null
    this.onControlChange = null
    
    // Configurações
    this.velocityCurve = 'linear' // linear, exponential, logarithmic
    this.transposeOctaves = 0
    this.transposeSemitones = 0
    this.channelFilter = null // null = all channels
    
    this.initialize()
  }

  async initialize() {
    try {
      if (!navigator.requestMIDIAccess) {
        console.warn('Web MIDI API não suportada neste navegador')
        return false
      }

      this.midiAccess = await navigator.requestMIDIAccess({ sysex: false })
      
      // Configura listeners para mudanças de dispositivos
      this.midiAccess.onstatechange = (event) => {
        this.handleDeviceChange(event)
      }
      
      // Conecta dispositivos existentes
      this.connectExistingDevices()
      
      console.log('MIDI Controller inicializado com sucesso')
      return true
    } catch (error) {
      console.error('Erro ao inicializar MIDI Controller:', error)
      return false
    }
  }

  connectExistingDevices() {
    // Conecta entradas MIDI
    for (const input of this.midiAccess.inputs.values()) {
      this.connectInput(input)
    }
    
    // Conecta saídas MIDI
    for (const output of this.midiAccess.outputs.values()) {
      this.connectOutput(output)
    }
  }

  connectInput(input) {
    if (this.connectedInputs.has(input.id)) return

    input.onmidimessage = (event) => {
      this.handleMidiMessage(event)
    }
    
    this.connectedInputs.set(input.id, input)
    console.log(`Conectado: ${input.name} (${input.manufacturer})`)
    
    if (this.onDeviceChange) {
      this.onDeviceChange('input', 'connected', input)
    }
  }

  connectOutput(output) {
    if (this.connectedOutputs.has(output.id)) return
    
    this.connectedOutputs.set(output.id, output)
    console.log(`Saída conectada: ${output.name} (${output.manufacturer})`)
    
    if (this.onDeviceChange) {
      this.onDeviceChange('output', 'connected', output)
    }
  }

  handleDeviceChange(event) {
    const device = event.port
    
    if (device.type === 'input') {
      if (device.state === 'connected') {
        this.connectInput(device)
      } else if (device.state === 'disconnected') {
        this.connectedInputs.delete(device.id)
        if (this.onDeviceChange) {
          this.onDeviceChange('input', 'disconnected', device)
        }
      }
    } else if (device.type === 'output') {
      if (device.state === 'connected') {
        this.connectOutput(device)
      } else if (device.state === 'disconnected') {
        this.connectedOutputs.delete(device.id)
        if (this.onDeviceChange) {
          this.onDeviceChange('output', 'disconnected', device)
        }
      }
    }
  }

  handleMidiMessage(event) {
    const [status, data1, data2] = event.data
    const messageType = status & 0xF0
    const channel = status & 0x0F
    
    // Filtro de canal se configurado
    if (this.channelFilter !== null && channel !== this.channelFilter) {
      return
    }
    
    switch (messageType) {
      case 0x90: // Note On
        if (data2 > 0) { // Velocity > 0
          this.handleNoteOn(data1, data2, channel)
        } else { // Velocity = 0 (Note Off)
          this.handleNoteOff(data1, channel)
        }
        break
        
      case 0x80: // Note Off
        this.handleNoteOff(data1, channel)
        break
        
      case 0xB0: // Control Change
        this.handleControlChange(data1, data2, channel)
        break
        
      case 0xC0: // Program Change
        this.handleProgramChange(data1, channel)
        break
        
      case 0xE0: // Pitch Bend
        this.handlePitchBend(data1, data2, channel)
        break
        
      case 0xF0: // System messages
        this.handleSystemMessage(event.data)
        break
    }
  }

  handleNoteOn(note, velocity, channel) {
    // Aplica transposição
    const transposedNote = note + (this.transposeOctaves * 12) + this.transposeSemitones
    
    // Verifica se a nota está no range válido (0-127)
    if (transposedNote < 0 || transposedNote > 127) return
    
    // Aplica curva de velocidade
    const adjustedVelocity = this.applyVelocityCurve(velocity)
    
    // Adiciona à lista de notas ativas
    this.activeNotes.add(transposedNote)
    
    // Toca a nota no audio engine
    if (this.audioEngine) {
      const noteName = midiToNoteName(transposedNote)
      this.audioEngine.playNote(noteName, adjustedVelocity, 'piano')
    }
    
    // Callback
    if (this.onNoteOn) {
      this.onNoteOn(transposedNote, adjustedVelocity, channel)
    }
  }

  handleNoteOff(note, channel) {
    // Aplica transposição
    const transposedNote = note + (this.transposeOctaves * 12) + this.transposeSemitones
    
    // Verifica se a nota está no range válido
    if (transposedNote < 0 || transposedNote > 127) return
    
    // Se o pedal sustain está pressionado, adiciona à lista de notas sustentadas
    if (this.sustainPedal) {
      this.sustainedNotes.add(transposedNote)
      return
    }
    
    // Remove da lista de notas ativas
    this.activeNotes.delete(transposedNote)
    
    // Para a nota no audio engine
    if (this.audioEngine) {
      const noteName = midiToNoteName(transposedNote)
      this.audioEngine.stopNote(noteName, 'piano')
    }
    
    // Callback
    if (this.onNoteOff) {
      this.onNoteOff(transposedNote, channel)
    }
  }

  handleControlChange(controller, value, channel) {
    switch (controller) {
      case 64: // Sustain Pedal
        this.handleSustainPedal(value >= 64)
        break
        
      case 1: // Modulation Wheel
        this.handleModulation(value)
        break
        
      case 7: // Volume
        this.handleVolume(value)
        break
        
      case 10: // Pan
        this.handlePan(value)
        break
        
      case 11: // Expression
        this.handleExpression(value)
        break
        
      case 123: // All Notes Off
        this.allNotesOff()
        break
        
      default:
        // Outros controladores
        break
    }
    
    // Callback
    if (this.onControlChange) {
      this.onControlChange(controller, value, channel)
    }
  }

  handleSustainPedal(pressed) {
    this.sustainPedal = pressed
    
    if (!pressed) {
      // Libera todas as notas sustentadas
      for (const note of this.sustainedNotes) {
        if (!this.activeNotes.has(note)) {
          const noteName = midiToNoteName(note)
          if (this.audioEngine) {
            this.audioEngine.stopNote(noteName, 'piano')
          }
        }
      }
      this.sustainedNotes.clear()
    }
  }

  handleModulation(value) {
    // Implementar modulação (vibrato, tremolo, etc.)
    console.log('Modulation:', value)
  }

  handleVolume(value) {
    if (this.audioEngine) {
      const volume = value / 127
      this.audioEngine.setMasterVolume(volume)
    }
  }

  handlePan(value) {
    // Implementar panorama
    console.log('Pan:', value)
  }

  handleExpression(value) {
    // Implementar expressão
    console.log('Expression:', value)
  }

  handleProgramChange(program, channel) {
    // Mudança de instrumento
    console.log('Program Change:', program, 'Channel:', channel)
  }

  handlePitchBend(lsb, msb, channel) {
    const pitchBend = (msb << 7) | lsb
    const normalizedBend = (pitchBend - 8192) / 8192 // -1 to 1
    console.log('Pitch Bend:', normalizedBend)
  }

  handleSystemMessage(data) {
    // Mensagens de sistema (clock, start, stop, etc.)
    console.log('System Message:', data)
  }

  applyVelocityCurve(velocity) {
    const normalized = velocity / 127
    
    switch (this.velocityCurve) {
      case 'exponential':
        return Math.pow(normalized, 2) * 127
      case 'logarithmic':
        return Math.sqrt(normalized) * 127
      case 'linear':
      default:
        return velocity
    }
  }

  allNotesOff() {
    // Para todas as notas ativas
    for (const note of this.activeNotes) {
      const noteName = midiToNoteName(note)
      if (this.audioEngine) {
        this.audioEngine.stopNote(noteName, 'piano')
      }
    }
    
    // Para todas as notas sustentadas
    for (const note of this.sustainedNotes) {
      const noteName = midiToNoteName(note)
      if (this.audioEngine) {
        this.audioEngine.stopNote(noteName, 'piano')
      }
    }
    
    this.activeNotes.clear()
    this.sustainedNotes.clear()
  }

  // Métodos de configuração
  setTranspose(octaves, semitones) {
    this.transposeOctaves = Math.max(-4, Math.min(4, octaves))
    this.transposeSemitones = Math.max(-12, Math.min(12, semitones))
  }

  setVelocityCurve(curve) {
    if (['linear', 'exponential', 'logarithmic'].includes(curve)) {
      this.velocityCurve = curve
    }
  }

  setChannelFilter(channel) {
    this.channelFilter = channel
  }

  // Métodos de informação
  getConnectedInputs() {
    return Array.from(this.connectedInputs.values())
  }

  getConnectedOutputs() {
    return Array.from(this.connectedOutputs.values())
  }

  getActiveNotes() {
    return Array.from(this.activeNotes)
  }

  isNoteActive(note) {
    return this.activeNotes.has(note)
  }

  // Envio de mensagens MIDI
  sendNoteOn(note, velocity, channel = 0) {
    const message = [0x90 | channel, note, velocity]
    this.sendMidiMessage(message)
  }

  sendNoteOff(note, channel = 0) {
    const message = [0x80 | channel, note, 0]
    this.sendMidiMessage(message)
  }

  sendControlChange(controller, value, channel = 0) {
    const message = [0xB0 | channel, controller, value]
    this.sendMidiMessage(message)
  }

  sendMidiMessage(message) {
    for (const output of this.connectedOutputs.values()) {
      try {
        output.send(message)
      } catch (error) {
        console.error('Erro ao enviar mensagem MIDI:', error)
      }
    }
  }

  destroy() {
    this.allNotesOff()
    
    // Desconecta todas as entradas
    for (const input of this.connectedInputs.values()) {
      input.onmidimessage = null
    }
    
    this.connectedInputs.clear()
    this.connectedOutputs.clear()
  }
}

// Hook React para usar o MidiController
export function useMidiController(audioEngine, rhythmEngine) {
  const [midiController] = useState(() => new MidiController(audioEngine, rhythmEngine))
  const [connectedInputs, setConnectedInputs] = useState([])
  const [connectedOutputs, setConnectedOutputs] = useState([])
  const [activeNotes, setActiveNotes] = useState([])
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initController = async () => {
      const success = await midiController.initialize()
      setIsInitialized(success)
    }

    // Configura callbacks
    midiController.onDeviceChange = (type, action, device) => {
      if (type === 'input') {
        setConnectedInputs(midiController.getConnectedInputs())
      } else {
        setConnectedOutputs(midiController.getConnectedOutputs())
      }
    }

    midiController.onNoteOn = (note, velocity, channel) => {
      setActiveNotes(midiController.getActiveNotes())
    }

    midiController.onNoteOff = (note, channel) => {
      setActiveNotes(midiController.getActiveNotes())
    }

    initController()

    // Atualiza listas iniciais
    setTimeout(() => {
      setConnectedInputs(midiController.getConnectedInputs())
      setConnectedOutputs(midiController.getConnectedOutputs())
    }, 1000)

    return () => {
      midiController.destroy()
    }
  }, [midiController])

  return {
    midiController,
    connectedInputs,
    connectedOutputs,
    activeNotes,
    isInitialized
  }
}

