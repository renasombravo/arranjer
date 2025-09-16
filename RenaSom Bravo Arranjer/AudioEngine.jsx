import { useState, useEffect, useRef } from 'react'

// Simulador de motor de áudio para o PA5X
export class AudioEngine {
  constructor() {
    this.audioContext = null
    this.masterGain = null
    this.voices = []
    this.maxPolyphony = 240
    this.isInitialized = false
    this.sampleRate = 44100
    this.bufferSize = 512
    
    // Samples básicos simulados
    this.samples = {
      piano: this.generatePianoSample(),
      drums: this.generateDrumSamples(),
      bass: this.generateBassSample(),
      strings: this.generateStringsSample()
    }
    
    this.effects = {
      reverb: null,
      chorus: null,
      delay: null
    }
  }

  async initialize() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      this.masterGain = this.audioContext.createGain()
      this.masterGain.connect(this.audioContext.destination)
      this.masterGain.gain.value = 0.7
      
      await this.initializeEffects()
      this.isInitialized = true
      
      console.log('AudioEngine inicializado com sucesso')
      console.log(`Sample Rate: ${this.audioContext.sampleRate}Hz`)
      console.log(`Polifonia máxima: ${this.maxPolyphony} vozes`)
      
      return true
    } catch (error) {
      console.error('Erro ao inicializar AudioEngine:', error)
      return false
    }
  }

  async initializeEffects() {
    // Reverb
    this.effects.reverb = this.audioContext.createConvolver()
    this.effects.reverb.buffer = await this.createReverbImpulse()
    
    // Chorus (simulado com delay)
    this.effects.chorus = this.audioContext.createDelay()
    this.effects.chorus.delayTime.value = 0.02
    
    // Delay
    this.effects.delay = this.audioContext.createDelay()
    this.effects.delay.delayTime.value = 0.3
  }

  generatePianoSample() {
    // Gera um sample de piano básico usando síntese aditiva
    const length = this.sampleRate * 2 // 2 segundos
    const buffer = this.audioContext?.createBuffer(1, length, this.sampleRate)
    
    if (!buffer) return null
    
    const data = buffer.getChannelData(0)
    
    for (let i = 0; i < length; i++) {
      const t = i / this.sampleRate
      const envelope = Math.exp(-t * 2) // Envelope exponencial
      
      // Harmônicos do piano
      let sample = 0
      sample += Math.sin(2 * Math.PI * 440 * t) * 0.5 // Fundamental
      sample += Math.sin(2 * Math.PI * 880 * t) * 0.3 // 2ª harmônica
      sample += Math.sin(2 * Math.PI * 1320 * t) * 0.2 // 3ª harmônica
      sample += Math.sin(2 * Math.PI * 1760 * t) * 0.1 // 4ª harmônica
      
      data[i] = sample * envelope * 0.3
    }
    
    return buffer
  }

  generateDrumSamples() {
    const drums = {}
    
    // Kick drum
    drums.kick = this.generateKickSample()
    
    // Snare drum
    drums.snare = this.generateSnareSample()
    
    // Hi-hat
    drums.hihat = this.generateHihatSample()
    
    // Crash cymbal
    drums.crash = this.generateCrashSample()
    
    return drums
  }

  generateKickSample() {
    const length = this.sampleRate * 0.5 // 0.5 segundos
    const buffer = this.audioContext?.createBuffer(1, length, this.sampleRate)
    
    if (!buffer) return null
    
    const data = buffer.getChannelData(0)
    
    for (let i = 0; i < length; i++) {
      const t = i / this.sampleRate
      const envelope = Math.exp(-t * 8)
      const freq = 60 * Math.exp(-t * 10) // Frequência que decresce
      
      data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.8
    }
    
    return buffer
  }

  generateSnareSample() {
    const length = this.sampleRate * 0.2 // 0.2 segundos
    const buffer = this.audioContext?.createBuffer(1, length, this.sampleRate)
    
    if (!buffer) return null
    
    const data = buffer.getChannelData(0)
    
    for (let i = 0; i < length; i++) {
      const t = i / this.sampleRate
      const envelope = Math.exp(-t * 15)
      
      // Mistura de tom e ruído
      const tone = Math.sin(2 * Math.PI * 200 * t) * 0.3
      const noise = (Math.random() * 2 - 1) * 0.7
      
      data[i] = (tone + noise) * envelope * 0.6
    }
    
    return buffer
  }

  generateHihatSample() {
    const length = this.sampleRate * 0.1 // 0.1 segundos
    const buffer = this.audioContext?.createBuffer(1, length, this.sampleRate)
    
    if (!buffer) return null
    
    const data = buffer.getChannelData(0)
    
    for (let i = 0; i < length; i++) {
      const t = i / this.sampleRate
      const envelope = Math.exp(-t * 30)
      
      // Ruído filtrado para simular hi-hat
      const noise = (Math.random() * 2 - 1)
      const filtered = noise * (1 + Math.sin(2 * Math.PI * 8000 * t))
      
      data[i] = filtered * envelope * 0.4
    }
    
    return buffer
  }

  generateCrashSample() {
    const length = this.sampleRate * 2 // 2 segundos
    const buffer = this.audioContext?.createBuffer(1, length, this.sampleRate)
    
    if (!buffer) return null
    
    const data = buffer.getChannelData(0)
    
    for (let i = 0; i < length; i++) {
      const t = i / this.sampleRate
      const envelope = Math.exp(-t * 1.5)
      
      // Múltiplas frequências para simular crash
      let sample = 0
      for (let freq = 3000; freq < 12000; freq += 500) {
        sample += Math.sin(2 * Math.PI * freq * t) * (Math.random() * 0.1)
      }
      
      data[i] = sample * envelope * 0.3
    }
    
    return buffer
  }

  generateBassSample() {
    const length = this.sampleRate * 1.5 // 1.5 segundos
    const buffer = this.audioContext?.createBuffer(1, length, this.sampleRate)
    
    if (!buffer) return null
    
    const data = buffer.getChannelData(0)
    
    for (let i = 0; i < length; i++) {
      const t = i / this.sampleRate
      const envelope = Math.exp(-t * 1.5)
      
      // Bass com harmônicos
      let sample = 0
      sample += Math.sin(2 * Math.PI * 110 * t) * 0.8 // Fundamental
      sample += Math.sin(2 * Math.PI * 220 * t) * 0.4 // 2ª harmônica
      sample += Math.sin(2 * Math.PI * 330 * t) * 0.2 // 3ª harmônica
      
      data[i] = sample * envelope * 0.5
    }
    
    return buffer
  }

  generateStringsSample() {
    const length = this.sampleRate * 3 // 3 segundos
    const buffer = this.audioContext?.createBuffer(1, length, this.sampleRate)
    
    if (!buffer) return null
    
    const data = buffer.getChannelData(0)
    
    for (let i = 0; i < length; i++) {
      const t = i / this.sampleRate
      const envelope = 1 - Math.exp(-t * 3) // Attack lento
      const decay = Math.exp(-t * 0.5) // Decay lento
      
      // Strings com múltiplas vozes
      let sample = 0
      sample += Math.sin(2 * Math.PI * 440 * t) * 0.3 // Voz 1
      sample += Math.sin(2 * Math.PI * 554 * t) * 0.3 // Voz 2 (quinta)
      sample += Math.sin(2 * Math.PI * 659 * t) * 0.3 // Voz 3 (terça)
      
      data[i] = sample * envelope * decay * 0.4
    }
    
    return buffer
  }

  async createReverbImpulse() {
    const length = this.sampleRate * 2
    const buffer = this.audioContext.createBuffer(2, length, this.sampleRate)
    
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel)
      for (let i = 0; i < length; i++) {
        const t = i / this.sampleRate
        const envelope = Math.exp(-t * 3)
        data[i] = (Math.random() * 2 - 1) * envelope * 0.3
      }
    }
    
    return buffer
  }

  playNote(note, velocity = 127, instrument = 'piano') {
    if (!this.isInitialized || !this.audioContext) return null

    try {
      const source = this.audioContext.createBufferSource()
      const gainNode = this.audioContext.createGain()
      
      // Seleciona o sample baseado no instrumento
      let buffer = null
      switch (instrument) {
        case 'piano':
          buffer = this.samples.piano
          break
        case 'kick':
          buffer = this.samples.drums.kick
          break
        case 'snare':
          buffer = this.samples.drums.snare
          break
        case 'hihat':
          buffer = this.samples.drums.hihat
          break
        case 'crash':
          buffer = this.samples.drums.crash
          break
        case 'bass':
          buffer = this.samples.bass
          break
        case 'strings':
          buffer = this.samples.strings
          break
        default:
          buffer = this.samples.piano
      }
      
      if (!buffer) return null
      
      source.buffer = buffer
      
      // Calcula a frequência da nota
      const frequency = this.noteToFrequency(note)
      const baseFrequency = 440 // A4
      const playbackRate = frequency / baseFrequency
      source.playbackRate.value = playbackRate
      
      // Configura volume baseado na velocity
      const volume = (velocity / 127) * 0.7
      gainNode.gain.value = volume
      
      // Conecta o áudio
      source.connect(gainNode)
      gainNode.connect(this.masterGain)
      
      // Inicia a reprodução
      source.start()
      
      // Adiciona à lista de vozes ativas
      const voice = {
        source,
        gainNode,
        note,
        startTime: this.audioContext.currentTime,
        instrument
      }
      
      this.voices.push(voice)
      
      // Remove vozes antigas se exceder a polifonia
      if (this.voices.length > this.maxPolyphony) {
        const oldVoice = this.voices.shift()
        this.stopVoice(oldVoice)
      }
      
      return voice
    } catch (error) {
      console.error('Erro ao reproduzir nota:', error)
      return null
    }
  }

  stopNote(note, instrument = 'piano') {
    const voicesToStop = this.voices.filter(voice => 
      voice.note === note && voice.instrument === instrument
    )
    
    voicesToStop.forEach(voice => {
      this.stopVoice(voice)
      const index = this.voices.indexOf(voice)
      if (index > -1) {
        this.voices.splice(index, 1)
      }
    })
  }

  stopVoice(voice) {
    try {
      if (voice.source) {
        voice.source.stop()
      }
    } catch (error) {
      // Ignora erros de stop (pode já ter parado)
    }
  }

  stopAllNotes() {
    this.voices.forEach(voice => this.stopVoice(voice))
    this.voices = []
  }

  noteToFrequency(note) {
    // Converte nota MIDI para frequência
    if (typeof note === 'string') {
      // Converte nome da nota para número MIDI
      const noteMap = {
        'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5,
        'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
      }
      
      const noteName = note.slice(0, -1)
      const octave = parseInt(note.slice(-1))
      note = (octave + 1) * 12 + noteMap[noteName]
    }
    
    return 440 * Math.pow(2, (note - 69) / 12)
  }

  setMasterVolume(volume) {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, volume))
    }
  }

  getActiveVoices() {
    return this.voices.length
  }

  getMaxPolyphony() {
    return this.maxPolyphony
  }

  destroy() {
    this.stopAllNotes()
    if (this.audioContext) {
      this.audioContext.close()
    }
    this.isInitialized = false
  }
}

// Hook React para usar o AudioEngine
export function useAudioEngine() {
  const [audioEngine] = useState(() => new AudioEngine())
  const [isInitialized, setIsInitialized] = useState(false)
  const [activeVoices, setActiveVoices] = useState(0)

  useEffect(() => {
    const initEngine = async () => {
      const success = await audioEngine.initialize()
      setIsInitialized(success)
    }

    initEngine()

    // Atualiza contador de vozes ativas
    const interval = setInterval(() => {
      setActiveVoices(audioEngine.getActiveVoices())
    }, 100)

    return () => {
      clearInterval(interval)
      audioEngine.destroy()
    }
  }, [audioEngine])

  return {
    audioEngine,
    isInitialized,
    activeVoices,
    maxPolyphony: audioEngine.getMaxPolyphony()
  }
}

