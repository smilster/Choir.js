class VoiceControlTab {


    constructor(voice) {
        this.voice = voice;


        this.id = voice.id

        this.removeButton = null;
        this.generateButton = null;
        this.clefButtons = [];

        this.scaleSelector = new ScaleSelector(voice);
        this.voice.scaleSelector = this.scaleSelector;
        this.rhythmSelector = new RhythmSelector(voice);
        this.transpose = new Transpose(voice);

        this.tabPane = this.createTabPane();

        Help.attachTooltip(this.generateButton,'Generate notes!','top');

    }

    drawAndSchedule() {
        Choir.draw();
        Transport.schedulePlayEvents(this.voice);
    }


    createTabPane() {
        this.voice.rhythmSelector = this.rhythmSelector;


        const tabPane = document.createElement('div');
        tabPane.className = 'tab-pane fade';
        tabPane.id = 'tab' + this.id;

        tabPane.appendChild(this.createTopPanel());
        tabPane.appendChild(this.createVerticalSpacer('1.4em'));

        tabPane.appendChild(this.createClefsAndSliders());
        tabPane.appendChild(this.createVerticalSpacer());

        tabPane.appendChild(this.scaleSelector.panel);
        tabPane.appendChild(this.createVerticalSpacer());

        tabPane.appendChild(this.rhythmSelector.panel);
        tabPane.appendChild(this.createVerticalSpacer());


        tabPane.appendChild(this.transpose.panel);
        tabPane.appendChild(this.createNoteInput());




        return tabPane;


    }


    // single voice controls
    createTopPanel() {


        const panel = document.createElement('div');
        panel.className = 'd-flex justify-content-between align-items-center';
        panel.style.cssText = 'height: 1.5em; padding: 0;padding-bottom: 1.5em';

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.id = 'nameInput' + this.id;
        nameInput.className = 'form-control bg-primary text-white';
        nameInput.value = this.voice.name;
        nameInput.placeholder = this.voice.initialName;
        nameInput.maxLength = 6;
        nameInput.style = 'text-align: center; width: 97px; transform: translateX(0px) translateY(0px); padding-left: 0; padding-right: 0; font-weight: bold; color: white;';
        nameInput.setAttribute('data-bs-placement', 'top');
        nameInput.spellcheck = false;


        const renameInput = function (event) {
            let name = event.target.value;
            this.updateName(name)
        }.bind(this)

        nameInput.addEventListener('input', renameInput);
        Help.attachTooltip(nameInput,"Shows the <b>name</b> of the voice currently selected for editing. Type here to" +
            " <b>rename</b>.")

        this.voice.storeEventListener(nameInput, 'input', renameInput)


        const removeButton = document.createElement('button');
        removeButton.className = 'btn btn-danger  ms-2 me-auto fw-bold';
        removeButton.id = 'removeVoiceButton' + this.id;
        removeButton.style = 'transform: translateX(0px) translateY(0px); height:1.7em; width: 1.7em; border-radius:' +
            ' 1em; padding: 0; margin: 0; padding-top:2px';
        removeButton.innerHTML = "✘"
        // '<b style="font-size: 18px">Remove</b>';
        Help.attachTooltip(removeButton,"Remove voice.")
//
        this.removeButton = removeButton;
        this.voice.voiceRemoveButton = removeButton;

        panel.appendChild(nameInput);
        panel.appendChild(removeButton);
        panel.append(this.createNoteControlButtons());


        return panel;
    }

    updateName(name) {
        const voice = this.voice;
        if (name.length === 0) {
            voice.name = voice.initialName;
        } else {
            voice.name = name;
        }
        voice.intervalMatrixNameLabel.textContent = voice.name
        voice.mixerNameLabel.textContent = voice.name;
        voice.noteSheetNameLabel.textContent = voice.name;
    }


    createNoteInput() {

        const {id, voice} = this;


        const panel = document.createElement('div');
        // panel.id = `collapseNoteString${Id}`;

        // const noteInputContainer = document.createElement('div');
        // noteInputContainer.className = 'd-flex justify-content-between align-items-center';



        const noteInput = document.createElement('textarea');
        noteInput.id = 'noteInput' + id;
        noteInput.className = 'form-control bg-light';
        noteInput.setAttribute('placeholder', 'Enter Note String');
        noteInput.setAttribute('rows', '4');
        noteInput.setAttribute('data-bs-placement', 'left');
        noteInput.spellcheck = false;

        Help.attachTooltip(noteInput,`View and edit notes with format <br><br><b>pitch.duration</b><br><br> 
           <b>Pitch</b> is the traditional tone name 
           <b>A</b> - <b>G</b> with optional <b>#</b> or <b>b</b>
           followed by the octave <b>0</b> - <b>9</b>.
           E.g. <b>C#4.8</b> is an eighth  C sharp note in octave 4.
           If no pitch or wrong format is provided, note will be a rest.           
           If no octave or wrong format is provided, default octaves are
           4 and 3 for <i>treble</i> and  <i>bass</i> clef, respectively.<br><br>

           <b>Duration</b> can take the values <b>1</b> (whole), <b>2</b> (half), <b>4</b> (quarter), <b>8</b> (eighth), and so on. If no 
           duration is provided, quarter notes are assumed by default.<br><br>

           <b>Triplets</b> and <b>dotted</b> notes are invoked by adding <b>t</b> and <b>d</b> to the duration, respectively. 
           Triplets must have the same length, otherwise the <b>t</b> is ignored. So <b> C.8t C.8t C.8t</b> creates 8th note triplet, while C.4t C.8t C.8t gives you one quarter note and two eight notes, without triplet timing. <br><br>
           `)

        const noteInputChange = function () {
            voice.noteString = noteInput.value;
            NoteParser.parseNotes(voice);
            this.drawAndSchedule();
        }.bind(this)

        noteInput.addEventListener('input', noteInputChange);

        this.voice.noteInput = noteInput;
        this.voice.storeEventListener(noteInput, 'click', noteInputChange);


        // noteInputContainer.appendChild(noteInput);
        panel.appendChild(noteInput);

        return panel;
    }


    changeClef(clef) {
        const voice = this.voice;
        voice.clef = clef;
        this.drawAndSchedule()
        voice.correctNoteInput();
    }

    createClefsAndSliders() {


        // === panel ===
        const panel = document.createElement('div');
        panel.className = 'd-flex justify-content-between align-items-center';


        // === Clef Section ===
        const clefPanel = document.createElement('div');
        clefPanel.id = "clefPanel" + this.id;
        clefPanel.setAttribute('data-bs-placement', 'left');

        Help.attachTooltip(clefPanel,`Choose <b>clef</b> for the <b>note sheet</b>.`)

        const createClefButton = (type) => {
            const clefButton = document.createElement('button');
            clefButton.className = 'btn btn-light btn-outline-secondary ms-2 clef';
            if (type === 'bass') {
                clefButton.style = 'padding-bottom: 0px;';
                clefButton.classList.add('opacity-50');
            }
            clefButton.style.width = '56px';
            clefButton.style.height = '71px';
            clefButton.style.fontSize = '40px';
            clefButton.value = type;
            clefButton.id = type + this.id;
            clefButton.innerHTML = type === 'bass' ? '&#119074;' : '&#119070;'
            this.clefButtons.push(clefButton);
            clefPanel.appendChild(clefButton)
        }

        createClefButton('treble');
        createClefButton('bass');

        const clefClick = function (event) {
            const clefButton = event.target.closest('.clef');
            if (clefButton !== null) {
                const clef = clefButton.value;

                this.clefButtons.forEach((clefButton) => {
                    clefButton.classList.add('opacity-50');
                });
                clefButton.classList.remove('opacity-50');
                this.changeClef(clef);
            }
        }.bind(this)


        clefPanel.addEventListener('click', clefClick);
        this.voice.storeEventListener(clefPanel, 'click', clefClick)


        // voice coupling and disjunction

        const createControlSlider = function (id, label, inputId, min, max, step, initial, voice, target) {
            const container = document.createElement('div');
            container.className = 'me-4'
            container.id = `${label.toLowerCase().replace(/\s+/g, '')}Tooltip${id}`;
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.alignItems = 'center';

            const button = document.createElement('button');
            button.className = 'btn btn-secondary disabled';
            button.style.width = '140px';
            // button.style.height = '30px';
            button.textContent = label;

            const input = document.createElement('input');
            input.type = 'range';
            input.id = inputId;
            input.style.marginTop = '12px';
            input.style.width = '140px';

            input.min = min;
            input.max = max;
            input.step = step;
            initial = Math.log10(initial);
            input.value = initial;
            voice[target] = Math.pow(10, initial);


            const voiceControlSliderInput = function () {
                this.voice[target] = Math.pow(10, parseFloat(input.value));
            }.bind(this)

            input.addEventListener('input', voiceControlSliderInput)

            voice.storeEventListener(input, 'input', voiceControlSliderInput);


            container.append(button, input);
            return container;
        }.bind(this);


        const voiceCoupling = createControlSlider(this.id, 'Voice Coupling', 'voiceCouplingSlider' + this.id,
            0, // minimum
            4, // maximum
            0.001, // resolution step
            this.voice.voiceCoupling, // initial value
            this.voice, 'voiceCoupling');


        Help.attachTooltip(voiceCoupling,'<b>Voice Coupling</b> tunes the impact of the <b>Interval Matrix</b> during note generation.');

        const disjunction = createControlSlider(this.id, 'Disjunction', 'disjunctionSlider' + this.id,
            -0.5, //minimum
            3, // maximum
            0.001, // resolution step
            this.voice.disjunction, // initial value
            this.voice, 'disjunction');

        Help.attachTooltip(disjunction,'<b>Disjunction</b> promotes larger interval jumps to the subsequent note during' +
            ' note generation.')

        panel.appendChild(voiceCoupling);
        panel.appendChild(disjunction);
        panel.appendChild(createFlexGrow());
        panel.appendChild(clefPanel);

        return panel;
    }


    createNoteControlButtons() {


        const panel = document.createElement('div');
        panel.className = 'd-flex justify-content-between align-items-center';


        // Clear Button
        const clearButton = document.createElement('button');
        clearButton.className = 'btn btn-outline-danger fw-bold me-1 px-3';
        clearButton.innerHTML = `Clear &nbsp;&#x1D160;&nbsp;`;

        Help.attachTooltip(clearButton,`Remove all notes.`);

        const clearNotes = function () {
            this.voice.noteString = '';
            this.voice.noteInput.value = '';
            this.drawAndSchedule();


        }.bind(this);

        clearButton.addEventListener('click', clearNotes);
        this.voice.storeEventListener(clearButton, 'click', clearNotes)


        // Trim Button
        const trimButton = document.createElement('button');
        trimButton.className = 'btn btn-outline-secondary fw-bold me-1 px-3';
        trimButton.innerHTML = 'Trim &nbsp;&#119101;&nbsp;';

        Help.attachTooltip(trimButton,`Remove all tailing rests of <b>all</b> voices.`,'top');

        const trimNotes = function () {
            NoteParser.removeTailingRests(Choir.voices);
            this.drawAndSchedule();

        }.bind(this);

        trimButton.addEventListener('click', trimNotes);
        this.voice.storeEventListener(trimButton, 'click', trimNotes)

        // Generate Button
        const generateButton = document.createElement('button');
        generateButton.className = 'btn btn-outline-success fw-bold px-3 disabled';
        generateButton.innerHTML = `Generate &nbsp;&#119136;&nbsp;`;

        this.voice.generateButton = generateButton;
        this.generateButton = generateButton;


        const generateButtonClick = function () {
            NoteGenerator.generateMelody(this.voice);
            this.drawAndSchedule();
            Choir.noteSheet.highlightAllNotesGreen(this.voice.staveNotes);
        }.bind(this);

        generateButton.addEventListener('click', generateButtonClick);
        this.voice.storeEventListener(generateButton, 'click', generateButtonClick);

        this.rhythmSelector.generateButton = generateButton;

        // Append all elements to the main container
        panel.appendChild(clearButton);
        panel.appendChild(trimButton);
        panel.appendChild(generateButton);

        return panel;
    }




    createVerticalSpacer(height = '2em') {
        const spacer = document.createElement('div');
        spacer.style.height = height;
        return spacer;
    }


}