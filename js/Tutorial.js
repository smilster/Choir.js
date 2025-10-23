/**
 * <pre>
 * hard coded tutorial for generating tenor voice for
 * Vois Sur Ton Chemin
 * </pre>
 */

class Tutorial {

    static panel = null;

    static exitButton = null;
    static startButton = null;
    static dNoneGroup = [];
    static label = null;
    static voice = null;


    static createPanel() {

        const panel = document.createElement('div');
        panel.id = 'tutorial';
        panel.className = 'collapse';


        this.body = document.createElement('div');
        this.body.classList.add('text-nice')
        panel.appendChild(this.body);
        panel.append(this.createButtonPanel());

        this.panel = panel;

        return panel;
    }

    static fadeInBody(bodyContent) {
        Tutorial.body.innerHTML = '';

        bodyContent.classList.add('fade-slow'); // start faded (opacity 0)
        bodyContent.innerHTML += '<hr>';
        // Add to DOM
        Tutorial.body.append(bodyContent);


        // Force reflow so the fade transition will trigger
        void bodyContent.offsetWidth;

        // Trigger fade-in
        bodyContent.classList.add('show');
    }


    static createButtonPanel() {


        // start button with warning
        const buttonPanel = document.createElement('div');
        buttonPanel.className = 'd-flex my-1 '

        const tutorialLabel = document.createElement('button');
        tutorialLabel.className = 'btn btn-warning disabled fw-bold d-none me-1';
        tutorialLabel.innerHTML = 'Tutorial';
        tutorialLabel.style.width = '97px';
        this.label = tutorialLabel;
        const startButton = this.createStartButton();
        this.startButton = startButton;

        const warningText = document.createElement('div');
        warningText.className = 'btn text-danger border-white disabled small';
        warningText.innerHTML = 'Removes current voices!';


        const exitButton = this.createExitButton()
        this.exitButton = exitButton;

        /////////////////

        // buttonPanel.appendChild(tutorialLabel);
        buttonPanel.appendChild(startButton);
        buttonPanel.appendChild(exitButton);
        buttonPanel.appendChild(warningText);


        const dNoneGroup = []
        dNoneGroup.push(Choir.mixer.panel);
        dNoneGroup.push(Choir.interval.panel);
        dNoneGroup.push(Choir.voiceControl.panel);
        dNoneGroup.push(Help.header);
        dNoneGroup.push(warningText);
        dNoneGroup.push(Choir.noteSheet.keySelector.panel);

        this.dNoneGroup = dNoneGroup;

        return buttonPanel;
    }


    ///////////////////////////
    ///////////////////////////
    // S T A R T  B U T T O N
    ///////////////////////////
    ///////////////////////////
    static createStartButton() {

        const startButton = document.createElement('button');
        startButton.className = 'btn btn-success px-3 fw-bold';
        startButton.innerHTML = 'Start';
        startButton.style.width = '97px';


        const startButtonClick = () => {
            // this.exitButton.click();

            Help.panel.style = 'background-color: #ffedb0;' //#fff7e1;';

            if (Help.tooltipsEnabled) {
                Help.tooltipButton.click();
            }

            Tone.Transport.cancel();
            Tone.Transport.stop();
            Choir.setKey('d');
            Choir.voices.forEach(voice => {
                Choir.removeVoice(voice, false);
            })

            if (Choir.voiceNumber === 0) {
                Choir.addVoice();
                Choir.addVoice();
            } else if (Choir.voiceNumber === 1) {
                Choir.addVoice();
            }

            Choir.voices[0].clef = 'treble';
            Choir.voices[0].setNoteString("D4.4d D4.8 G4.4 G4.16 F4.16 E4.8 F4.2 .8 G4.8 F4.8 E4.8 D4.4d D4.8 G4.4 G4.16 F4.16 E4.8 A4.4 D4.4 .8 E4.8 D4.8 C#4.8");

            Choir.voices[1].clef = 'treble';
            Choir.voices[1].setNoteString("F4.2 Bb4.2 D4.4 F4.4 E4.2 F4.4 A4.4 D4.2 F4.2 E4.2");


            startButton.innerHTML = 'Restart';


            this.dNoneGroup.forEach((element) => {
                element.classList.add('d-none');
            })


            this.exitButton.classList.remove('d-none');
            this.label.classList.remove('d-none');


            const bodyContent = this.start();
            this.fadeInBody(bodyContent);



        };


        startButton.addEventListener('click', startButtonClick.bind(this));
        return startButton
    }

    ///////////////////////////
    ///////////////////////////
    // E X I T   B U T T O N
    ///////////////////////////
    ///////////////////////////
    static createExitButton() {
        const exitButton = document.createElement('button');
        exitButton.className = 'btn btn-danger px-3 ms-auto fw-bold d-none';
        exitButton.innerHTML = 'Exit';
        // exitButton.style.width = '97px';


        const exitButtonClick = () => {
            Help.enableAllTooltips();
            Help.disableAllTooltips();
            if (document.getElementById('intervalMatrixTable').children[0].children[0].children[2]){
                const tooltipInstance = bootstrap.Tooltip.getInstance(document.getElementById('intervalMatrixTable').children[0].children[0].children[2]);
                if ((typeof tooltipInstance) !== undefined) {
                    tooltipInstance.dispose();
                }
            }


            Help.panel.style = 'background-color: #ffffff;';
            this.enableButtons();

            this.dNoneGroup.forEach((element) => {
                element.classList.remove('d-none');
            })

            this.startButton.innerHTML = 'Start';
            this.label.classList.add('d-none');
            exitButton.classList.add('d-none');
            Choir.noteSheet.addVoiceButton.classList.remove('disabled');
            this.body.innerHTML = '';

            Tutorial.panel.classList.remove('show');


        }
        exitButton.addEventListener('click', exitButtonClick.bind(this))

        return exitButton;
    }


    static disableButtons() {
        Choir.voices.forEach(voice => {
            setTimeout(() => {
                voice.noteSheetNameLabel.classList.add('disabled')
                voice.voiceRemoveButton.classList.add('disabled');
            }, 50)
        })
    }

    static enableButtons() {
        Choir.voices.forEach(voice => {
            voice.noteSheetNameLabel.classList.remove('disabled');
            voice.voiceRemoveButton.classList.remove('disabled');
        })
    }

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
///  T U T O R I A L   S L I D E S
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////


    static start() {
        this.disableButtons();

        const body = document.createElement('div');
        body.classList.add('fade-in');
        const title = document.createElement('div');
        title.className = 'fw-bold';
        title.innerHTML += '<p class="text-center">Tenor voice for <i>Vois Sur Ton Chemin</i></p>';


        //
        const textOne = document.createElement('div');
        textOne.innerHTML = `<p>In this tutorial, you learn how to add a third voice to small two-voice passage. I created two voices for you. This is the chorus of <i>Vois Sur Ton Chemin</i>. <p>Now <b>add a third voice</b>. Find the add button that looks like the one below and click it.</p>`;


        Choir.noteSheet.addVoiceButton


        // addVoiceButton

        const wrapper = document.createElement('div');
        wrapper.classList.add('d-flex','justify-content-center','pb-3');

        const addVoiceButton = Choir.noteSheet.addVoiceButton.cloneNode(true);



        const addVoiceButtonClick = () => {
            Help.disableTooltip(Choir.noteSheet.addVoiceButton)

            const bodyContent = Tutorial.clef();

            Tutorial.fadeInBody(bodyContent);

            Choir.voiceControl.panel.classList.remove('d-none');
            Choir.noteSheet.addVoiceButton.removeEventListener('click', addVoiceButtonClick);
            Choir.noteSheet.addVoiceButton.classList.add('disabled');


        };

        Choir.noteSheet.addVoiceButton.addEventListener('click', addVoiceButtonClick);

        wrapper.append(addVoiceButton);
        body.append(title, textOne, wrapper);

        Help.showTooltip(Choir.noteSheet.addVoiceButton)

        return body;

    }

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////


    static clef() {
        this.disableButtons();

        this.voice = Choir.voices[Choir.voiceNumber - 1];
        const voice = this.voice;

        Help.showTooltip(document.getElementById("clefPanel" + voice.id));

        const body = document.createElement('div');
        const info = document.createElement('div');



        info.innerHTML = `
        <p>The new voice is given a random initial name, <b>${voice.name}</b>, and its properties can be edited in the <b>voice control panel</b> to the right.<p/>
        <p>Let's first change the clef. Press the <b>Bass Clef</b> button in the voice control panel. </p>`;

        const originalBassClef = document.getElementById('bass' + voice.id)



        const wrapper = document.createElement('div');
        wrapper.classList.add('d-flex','justify-content-center','pb-3');
        const bassClef = originalBassClef.cloneNode(true);

        const bassClefClick = () => {



            const bodyContent = Tutorial.voiceRange();
            Tutorial.fadeInBody(bodyContent);

            originalBassClef.removeEventListener('click', bassClefClick);
            Help.disableTooltip(document.getElementById("clefPanel" + voice.id));

        };
        originalBassClef.addEventListener('click', bassClefClick);

        wrapper.append(bassClef);
        body.append(info, wrapper);




        return body;
    }

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////


    static voiceRange() {
        this.disableButtons();

        const voice = this.voice;

        Help.showTooltip(document.getElementById('klaviaturCard' + voice.id));


        const body = document.createElement('div');
        const info = document.createElement('div');
        info.innerHTML = `<p>Set the <b>range</b> to  <b>E3</b> to <b>E4</b>, a typical tenor pitch range. <b>Click, drag and release</b> in the <b>claviature</b>. It should look like this:</p>`

        const fakeVoice = new Voice();

        const wrapper = document.createElement('div');
        wrapper.classList.add('d-flex','justify-content-center');
        const klaviatur = new RangeSelector(fakeVoice);
        klaviatur.claviature = this.voice.scaleSelector.klaviatur.claviature.cloneNode(true);


        klaviatur.ausgewaehlteNoten = [];
        for (let i = 51; i < 64; i++) {
            let cNote = Tone.Frequency(klaviatur.scale[i], 'midi').toNote();
            if (cNote.split('').pop() < 6 && cNote.split('').pop() > 1) {
                klaviatur.ausgewaehlteNoten.push(cNote);

            }
        }

        klaviatur.updateClaviatureColors();




        const infoTwo = document.createElement('div');
        infoTwo.innerHTML = `<p></p><p>So when we generate notes for the voice, only pitches within this range will be allowed.</p><div>You probably noticed the second highlighting layer. It depicts the currently selected scale, <b>D Minor</b>. The colors will make more sense once you play around with the scale, but no need to change now.</div>`


        const voiceRangeCheck = function () {


            if (
                (voice.voiceRange[0] === "F3") && (voice.voiceRange[1] === "D#4") ||
                (voice.voiceRange[0] === "E3") && (voice.voiceRange[1] === "D#4") ||
                (voice.voiceRange[0] === "D#3") && (voice.voiceRange[1] === "D#4") ||
                (voice.voiceRange[0] === "D3") && (voice.voiceRange[1] === "D#4") ||

                (voice.voiceRange[0] === "F3") && (voice.voiceRange[1] === "E4") ||
                (voice.voiceRange[0] === "E3") && (voice.voiceRange[1] === "E4") ||
                (voice.voiceRange[0] === "D#3") && (voice.voiceRange[1] === "E4") ||
                (voice.voiceRange[0] === "D3") && (voice.voiceRange[1] === "E4") ||

                (voice.voiceRange[0] === "F3") && (voice.voiceRange[1] === "F4") ||
                (voice.voiceRange[0] === "E3") && (voice.voiceRange[1] === "F4") ||
                (voice.voiceRange[0] === "D#3") && (voice.voiceRange[1] === "F4") ||
                (voice.voiceRange[0] === "D3") && (voice.voiceRange[1] === "F4")
                )
            {
                Help.disableTooltip(document.getElementById('klaviaturCard' + voice.id));

                document.dispatchEvent(new MouseEvent('mouseup', {bubbles: true}));
                const bodyContent = Tutorial.rhythm();
                Tutorial.fadeInBody(bodyContent);


            } else {
                setTimeout(voiceRangeCheck, 300);
            }
        }

        voiceRangeCheck();

        body.appendChild(info);
        wrapper.append(klaviatur.claviature)
        body.appendChild(wrapper);
        body.appendChild(infoTwo);




        return body;
    }

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

    static rhythm() {
        this.disableButtons();

        const voice = this.voice;

        const body = document.createElement('div');
        const info = document.createElement('div');
        info.innerHTML = `<p>Now we have to define a <b>Rhythm</b>. Find the rythm selector in the control panel to the right. Tell ${voice.name} to copy <b> ${Choir.voices[0].name}'s rhythmic pattern</b>.</p>`


        // const rhythmSelectorPanel.
        const fakeVoice = new Voice();
        fakeVoice.rhythmLockId = Choir.voices[0].id;


        const wrapper = document.createElement('div');
        wrapper.classList.add('d-flex','justify-content-center','pb-2');
        const rhythmSelector = new RhythmSelector(fakeVoice);
        rhythmSelector.updateRhythmSelector(Choir.voices);




        const checkRhythm = () => {

            if ( voice.rhythmLockId === Choir.voices[0].tabId ) {
                Help.disableTooltip(document.getElementById('rhythmTooltipWrapper' + voice.id));

                Choir.interval.panel.classList.remove('d-none');

                const bodyContent = Tutorial.intervalMatrix();
                Tutorial.fadeInBody(bodyContent);

            } else {
                setTimeout(checkRhythm,300)
            }


        }

        // const infoTwo = document.createElement('div');
        // infoTwo.innerHTML = `<p></p>This means that <b>${voice.name}</b> will use the <b>same rhythmic pattern</b> as <b>${Choir.voices[0].name}</b>.`

        wrapper.append(rhythmSelector.panel);
        body.appendChild(info);
        body.appendChild(wrapper);
        // body.appendChild(infoTwo);

        Help.showTooltip(document.getElementById('rhythmTooltipWrapper' + voice.id));

        checkRhythm();

        return body

    }

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

    static intervalMatrix() {
        this.disableButtons();


        const body = document.createElement('div');
        const info = document.createElement('div');
        info.innerHTML = `<p>Now we can generate notes. Click <b>generate</b> button in the control panel.  They will appear in the note sheet and also as short notations in the <b>note input</b> text area at the bottom of the control panel. Press <b>play</b> to listen to the result. </p>`


        const voiceTabId = Choir.voiceNumber - 1;
        const voice = Choir.voices[voiceTabId];
        const originalGenerateButton = voice.generateButton;



        const generateButtonClick = function () {
            Tutorial.disableButtons();
        }
        originalGenerateButton.addEventListener('click', generateButtonClick);

        const buttonPanel = document.createElement('div');
        buttonPanel.classList.add('d-flex','justify-content-around');
        const startButton = Transport.startButton.cloneNode(true);



        const generateButton = originalGenerateButton.cloneNode(true);
        generateButton.classList.remove('disabled');



        const infoTwo = document.createElement('div');
        infoTwo.innerHTML = `<p></p><p>The generated result is probably not very satisfying. So let's apply some magic by tweaking the <b>Interval Matrix</b>. By this, we can tell <b>${voice.name}</b> to prefer pitches that are <b>8</b> and <b>9</b> semitones below <b>${Choir.voices[0].name}</b>. So your Interval Matrix should look like the one below.</p>`

        const originalInterValMatrix =document.getElementById('intervalMatrixTable')

        const wrapper = document.createElement('div');
        wrapper.classList.add('d-flex','justify-content-center');

        const intervalMatrix = originalInterValMatrix.cloneNode(true);
        intervalMatrix.id = 'matrixClone';
        for (let i = 0; i < 2; i++) {
            for (let j = i + 1; j < 3; j++) {
                intervalMatrix.children[0].children[i].children[j].children[0].setAttribute('disabled', 'true')
            }
        }

        intervalMatrix.children[0].children[0].children[2].children[0].setAttribute('value','8 9');


        Help.attachTooltip(originalInterValMatrix.children[0].children[0].children[2],'Type <b>8 9</b>' +
            ' here!','right')
        intervalMatrix.children[0].children[0].children[0].children[0].classList.add('bg-white')
        intervalMatrix.children[0].children[1].children[1].children[0].classList.add('bg-white')
        intervalMatrix.children[0].children[2].children[2].children[0].classList.add('bg-white')


        const intervalCheck = async function () {

            if ((Choir.interval.matrix[0][2].sort().join(' ') === '8 9') && (Choir.interval.matrix[1][2].length === 0)) {
                Help.disableTooltip(originalGenerateButton);
                Help.disableTooltip(Transport.panel)
                Help.disableTooltip(originalInterValMatrix.children[0].children[0].children[2]);

                originalGenerateButton.removeEventListener('click', generateButtonClick);

                const bodyContent = Tutorial.finish();
                Tutorial.fadeInBody(bodyContent);


            } else {
                setTimeout(intervalCheck, 300);
            }
        }

        intervalCheck();


        buttonPanel.append(startButton,generateButton);
        wrapper.appendChild(intervalMatrix)

        body.appendChild(info);
        body.appendChild(buttonPanel)
        body.appendChild(infoTwo);
        body.appendChild(wrapper);




        Help.showTooltip(originalGenerateButton);
        Help.showTooltip(Transport.panel)
        Help.showTooltip(originalInterValMatrix.children[0].children[0].children[2]);

        return body
    }

    static finish() {
        this.disableButtons();

        // Choir.interval.panel.classList.add('d-none');

        const voiceTabId = Choir.voiceNumber - 1;
        const voice = Choir.voices[voiceTabId];


        const body = document.createElement('div');

        const info = document.createElement('div');
        info.innerHTML = `<p><b>Congratulations! You have finished the tutorial. </b></p>
<p>Click <b>generate</b> once more to listen to the magic of the Interval Matrix and exit this tutorial.</p>
`

        const originalGenerateButton = voice.generateButton;


        const wrapper = document.createElement('div');
        wrapper.classList.add('d-flex','justify-content-center');

        const generateButton = originalGenerateButton.cloneNode(true);


        const generateButtonClick = async function  () {
            Help.disableTooltip(originalGenerateButton);
            Tutorial.exitButton.click();

            originalGenerateButton.removeEventListener('click', generateButtonClick);
            await Transport.start();
        }

        originalGenerateButton.addEventListener('click', generateButtonClick);

        wrapper.appendChild(generateButton);
        body.appendChild(info);
        body.appendChild(wrapper);

        Help.disableTooltip(originalGenerateButton);
        Help.showTooltip(originalGenerateButton);

        return body;
    }


}

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////