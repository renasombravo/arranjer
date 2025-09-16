}

//==============================================================================
void MainComponent::setupKorgPA5XInterface()
{
    // Configura Look and Feel escuro estilo PA5X
    getLookAndFeel().setColour(juce::TextButton::buttonColourId, juce::Colour(0xff1a1a1a));
    getLookAndFeel().setColour(juce::TextButton::textColourOffId, juce::Colour(0xffe0e0e0));
    getLookAndFeel().setColour(juce::TextButton::textColourOnId, juce::Colour(0xff00d4aa));
    getLookAndFeel().setColour(juce::TextButton::buttonOnColourId, juce::Colour(0xff2a2a2a));
    getLookAndFeel().setColour(juce::ComboBox::backgroundColourId, juce::Colour(0xff0d1117));
    getLookAndFeel().setColour(juce::ComboBox::textColourId, juce::Colour(0xffe0e0e0));
    getLookAndFeel().setColour(juce::ComboBox::outlineColourId, juce::Colour(0xff404040));
    getLookAndFeel().setColour(juce::Slider::backgroundColourId, juce::Colour(0xff0d1117));
    getLookAndFeel().setColour(juce::Slider::thumbColourId, juce::Colour(0xff00d4aa));
    getLookAndFeel().setColour(juce::Slider::trackColourId, juce::Colour(0xff404040));
    
    // Botões de transporte estilo PA5X com cores características
    startStopButton.setButtonText("START/STOP");
    startStopButton.setColour(juce::TextButton::buttonColourId, juce::Colour(0xff006633)); // Verde escuro
    startStopButton.setColour(juce::TextButton::textColourOffId, juce::Colours::white);
    startStopButton.onClick = [this] { startStopButtonClicked(); };
    addAndMakeVisible(startStopButton);
    
    drumPlayButton.setButtonText("DRUM PLAY");
    drumPlayButton.setColour(juce::TextButton::buttonColourId, juce::Colour(0xff0066aa)); // Azul PA5X
    drumPlayButton.setColour(juce::TextButton::textColourOffId, juce::Colours::white);
    drumPlayButton.onClick = [this] { drumPlayButtonClicked(); };
    addAndMakeVisible(drumPlayButton);
    
    drumPauseButton.setButtonText("DRUM PAUSE");
    drumPauseButton.setColour(juce::TextButton::buttonColourId, juce::Colour(0xff996600)); // Laranja escuro
    drumPauseButton.setColour(juce::TextButton::textColourOffId, juce::Colours::white);
    drumPauseButton.onClick = [this] { drumPauseButtonClicked(); };
    addAndMakeVisible(drumPauseButton);
    
    syncStartButton.setButtonText("SYNC");
    syncStartButton.setColour(juce::TextButton::buttonColourId, juce::Colour(0xff663366)); // Roxo escuro
    syncStartButton.setColour(juce::TextButton::textColourOffId, juce::Colours::white);
    syncStartButton.onClick = [this] { syncStartButtonClicked(); };
    addAndMakeVisible(syncStartButton);
    
    // Controles de tempo estilo PA5X
    tempoDownButton.setButtonText("◄");
    tempoDownButton.setColour(juce::TextButton::buttonColourId, juce::Colour(0xff2a2a2a));
    tempoDownButton.setColour(juce::TextButton::textColourOffId, juce::Colour(0xff00d4aa));
    tempoDownButton.onClick = [this] { tempoDownButtonClicked(); };
    addAndMakeVisible(tempoDownButton);
    
    tempoUpButton.setButtonText("►");
    tempoUpButton.setColour(juce::TextButton::buttonColourId, juce::Colour(0xff2a2a2a));
    tempoUpButton.setColour(juce::TextButton::textColourOffId, juce::Colour(0xff00d4aa));
    tempoUpButton.onClick = [this] { tempoUpButtonClicked(); };
    addAndMakeVisible(tempoUpButton);
    
    tempoSlider.setRange(60, 200, 1);
    tempoSlider.setValue(120);
    tempoSlider.setSliderStyle(juce::Slider::LinearHorizontal);
    tempoSlider.setTextBoxStyle(juce::Slider::NoTextBox, false, 0, 0);
    tempoSlider.setColour(juce::Slider::backgroundColourId, juce::Colour(0xff0d1117));
    tempoSlider.setColour(juce::Slider::thumbColourId, juce::Colour(0xff00d4aa));
    tempoSlider.setColour(juce::Slider::trackColourId, juce::Colour(0xff404040));
    tempoSlider.onValueChange = [this] { tempoSliderChanged(); };
    addAndMakeVisible(tempoSlider);
    
    // Dispositivos MIDI com estilo PA5X
    midiInputLabel.setText("MIDI IN", juce::dontSendNotification);
    midiInputLabel.setColour(juce::Label::textColourId, juce::Colour(0xffe0e0e0));
    midiInputLabel.setFont(juce::Font("Arial", 12.0f, juce::Font::bold));
    addAndMakeVisible(midiInputLabel);
    
    midiInputCombo.setColour(juce::ComboBox::backgroundColourId, juce::Colour(0xff0d1117));
    midiInputCombo.setColour(juce::ComboBox::textColourId, juce::Colour(0xffe0e0e0));
    midiInputCombo.setColour(juce::ComboBox::outlineColourId, juce::Colour(0xff404040));
    midiInputCombo.onChange = [this] { midiInputChanged(); };
    addAndMakeVisible(midiInputCombo);
    
    midiOutputLabel.setText("MIDI OUT", juce::dontSendNotification);
    midiOutputLabel.setColour(juce::Label::textColourId, juce::Colour(0xffe0e0e0));
    midiOutputLabel.setFont(juce::Font("Arial", 12.0f, juce::Font::bold));
    addAndMakeVisible(midiOutputLabel);
    
    midiOutputCombo.setColour(juce::ComboBox::backgroundColourId, juce::Colour(0xff0d1117));
    midiOutputCombo.setColour(juce::ComboBox::textColourId, juce::Colour(0xffe0e0e0));
    midiOutputCombo.setColour(juce::ComboBox::outlineColourId, juce::Colour(0xff404040));
    midiOutputCombo.onChange = [this] { midiOutputChanged(); };
    addAndMakeVisible(midiOutputCombo);
    
    // Kontakt8 com cor característica
    kontakt8ConnectButton.setButtonText("KONTAKT8");
    kontakt8ConnectButton.setColour(juce::TextButton::buttonColourId, juce::Colour(0xff0099ff));
    kontakt8ConnectButton.setColour(juce::TextButton::textColourOffId, juce::Colours::white);
    kontakt8ConnectButton.onClick = [this] { kontakt8ConnectButtonClicked(); };
    addAndMakeVisible(kontakt8ConnectButton);
    
    // Categorias de estilo (estilo PA5X) com cores diferenciadas
    juce::StringArray categories = {"POP", "ROCK", "JAZZ", "LATIN", "WORLD", "DANCE", "BALLAD", "COUNTRY"};
    juce::Array<juce::Colour> categoryColors = {
        juce::Colour(0xff4a90e2), // Azul
        juce::Colour(0xffe74c3c), // Vermelho
        juce::Colour(0xfff39c12), // Laranja
        juce::Colour(0xff27ae60), // Verde
        juce::Colour(0xff9b59b6), // Roxo
        juce::Colour(0xffe91e63), // Rosa
        juce::Colour(0xff34495e), // Cinza azulado
        juce::Colour(0xff795548)  // Marrom
    };
    
    for (int i = 0; i < categories.size(); i++)
    {
        auto button = std::make_unique<juce::TextButton>(categories[i]);
        button->setColour(juce::TextButton::buttonColourId, categoryColors[i]);
        button->setColour(juce::TextButton::textColourOffId, juce::Colours::white);
        button->onClick = [this, i] { styleCategorySelected(i); };
        styleCategoryButtons.push_back(std::move(button));
        addAndMakeVisible(styleCategoryButtons.back().get());
    }
    
    // Estilos (simulando PA5X) com cores neutras
    juce::StringArray styles = {"8Beat Pop", "16Beat", "Ballad", "Bossa Nova", "Samba", "Rock", "Jazz Swing", "Country"};
    for (int i = 0; i < styles.size(); i++)
    {
        auto button = std::make_unique<juce::TextButton>(styles[i]);
        button->setColour(juce::TextButton::buttonColourId, juce::Colour(0xff1a1a1a));
        button->setColour(juce::TextButton::textColourOffId, juce::Colour(0xffe0e0e0));
        button->setColour(juce::TextButton::buttonOnColourId, juce::Colour(0xff00d4aa));
        button->onClick = [this, i] { styleSelected(i); };
        styleButtons.push_back(std::move(button));
        addAndMakeVisible(styleButtons.back().get());
    }
    
    // Variações estilo PA5X com cores características
    introButton.setButtonText("INTRO");
    introButton.setColour(juce::TextButton::buttonColourId, juce::Colour(0xff27ae60)); // Verde
    introButton.setColour(juce::TextButton::textColourOffId, juce::Colours::white);
    introButton.onClick = [this] { variationSelected(StyleSectionType::INTRO_A); };
    addAndMakeVisible(introButton);
    
    variationAButton.setButtonText("VAR A");
    variationAButton.setColour(juce::TextButton::buttonColourId, juce::Colour(0xff3498db)); // Azul claro
    variationAButton.setColour(juce::TextButton::textColourOffId, juce::Colours::white);
    variationAButton.onClick = [this] { variationSelected(StyleSectionType::MAIN_A); };
    addAndMakeVisible(variationAButton);
    
    variationBButton.setButtonText("VAR B");
    variationBButton.setColour(juce::TextButton::buttonColourId, juce::Colour(0xff2980b9)); // Azul médio
    variationBButton.setColour(juce::TextButton::textColourOffId, juce::Colours::white);
    variationBButton.onClick = [this] { variationSelected(StyleSectionType::MAIN_B); };
    addAndMakeVisible(variationBButton);
    
