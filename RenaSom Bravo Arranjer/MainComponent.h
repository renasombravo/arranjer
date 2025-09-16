#pragma once

#include <JuceHeader.h>
#include "Core/AudioEngine.h"
#include "Core/MidiIO.h"
#include "Core/TempoScheduler.h"
#include "Core/VirtualBand.h"
#include "Core/Kontakt8Integration.h"
#include "StyleEngine/ChordEngine.h"
#include "StyleEngine/StyleParser.h"
#include "StyleEngine/AccompanimentGenerator.h"
#include "SoundEngine/SoundFontLoader.h"
#include "SoundEngine/Mixer.h"
#include "SoundEngine/Effects.h"

//==============================================================================
/*
    Simulador de Teclado Arranjador - Interface estilo Korg PA5X 88
    240 vozes de polifonia, cores escuras, controles de ritmo e drum play/pause
*/
class MainComponent : public juce::AudioAppComponent,
                     public juce::Timer
{
public:
    //==============================================================================
    MainComponent();
    ~MainComponent() override;

    //==============================================================================
    void prepareToPlay (int samplesPerBlockExpected, double sampleRate) override;
    void getNextAudioBlock (const juce::AudioSourceChannelInfo& bufferToFill) override;
    void releaseResources() override;

    //==============================================================================
    void paint (juce::Graphics& g) override;
    void resized() override;
    
    //==============================================================================
    void timerCallback() override;

private:
    //==============================================================================
    // Core components
    std::unique_ptr<AudioEngine> audioEngine;
    std::unique_ptr<MidiIO> midiIO;
    std::unique_ptr<TempoScheduler> tempoScheduler;
    std::unique_ptr<VirtualBand> virtualBand;
    std::unique_ptr<Kontakt8Integration> kontakt8;
    
    // Style engine
    std::unique_ptr<ChordEngine> chordEngine;
    std::unique_ptr<StyleParser> styleParser;
    std::unique_ptr<AccompanimentGenerator> accompanimentGenerator;
    
    // Sound engine
    std::unique_ptr<SoundFontLoader> soundFontLoader;
    std::unique_ptr<Mixer> mixer;
    std::unique_ptr<EffectsProcessor> effectsProcessor;
    
    // UI Components - Estilo Korg PA5X
    // Controles de transporte
    juce::TextButton startStopButton;
    juce::TextButton drumPlayButton;
    juce::TextButton drumPauseButton;
    juce::TextButton syncStartButton;
    
    // Controles de tempo
    juce::Slider tempoSlider;
    juce::TextButton tempoDownButton;
    juce::TextButton tempoUpButton;
    
    // MIDI
    juce::ComboBox midiInputCombo;
    juce::ComboBox midiOutputCombo;
    juce::Label midiInputLabel;
    juce::Label midiOutputLabel;
    
    // Kontakt8
    juce::TextButton kontakt8ConnectButton;
    
    // Estilos e ritmos (estilo PA5X)
    std::vector<std::unique_ptr<juce::TextButton>> styleCategoryButtons;
    std::vector<std::unique_ptr<juce::TextButton>> styleButtons;
    
    // Variações de estilo
    juce::TextButton introButton;
    juce::TextButton variationAButton;
    juce::TextButton variationBButton;
    juce::TextButton variationCButton;
    juce::TextButton variationDButton;
    juce::TextButton fillInButton;
    juce::TextButton breakButton;
    juce::TextButton endingButton;
    
    // Controles de acorde
    juce::ComboBox chordCombo;
    juce::Label chordLabel;
    juce::ComboBox chordModeCombo;
    juce::Label chordModeLabel;
    
    // Teclado virtual (88 teclas)
    juce::MidiKeyboardComponent virtualKeyboard;
    juce::MidiKeyboardState keyboardState;
    
    // Status
    bool isPlaying;
    juce::String statusMessage;
    
    // Methods
    void setupKorgPA5XInterface();
    void setupMIDI();
    void setupAudio();
    void setupMixerControls(juce::Rectangle<int> area);
    void updateMidiDeviceList();
    void updateKontakt8Status();
    void updateDisplays();
    
    // Callbacks dos botões
    void startStopButtonClicked();
    void drumPlayButtonClicked();
    void drumPauseButtonClicked();
    void syncStartButtonClicked();
    void tempoDownButtonClicked();
    void tempoUpButtonClicked();
    void tempoSliderChanged();
    void midiInputChanged();
    void midiOutputChanged();
    void kontakt8ConnectButtonClicked();
    void chordChanged();
    void styleCategorySelected(int category);
    void styleSelected(int style);
    void variationSelected(StyleSectionType variation);
    
    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (MainComponent)
};

