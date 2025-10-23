DEPTH = 3;

class Choir {


    static noteSheetKey = "C";
    static scaleType = null;


    /**
     * number of voices, adjusts dynaically on adding and removing voices
     * by {@link addVoice}  and {@link removeVoice}
     * @type {number}
     */
    static voiceNumber = 0;

    /**
     * stores Voice class instances
     * @type {[]}
     */

    static voices = [];

    /**
     * reference pointer for currently active voice
     * active means selected for editing
     * @type {Voice}
     */
    static activeVoice = null;

    /**
     * NoteSheet instance, only one at the moment
     * it is assigned by {@link initialize}
     * @type {NoteSheet}
     */
    static noteSheet = null;

    /**
     * choir container, the DOM element passed to {@link initialize}
     * @type {null}
     */
    static choirContainer = null;

    /**
     *
     *  array for panels to be hidden case of no voices
     */
    static controlPanels = [];

    /////



    static initialize(choirContainerID) {
        this.addVoice = this.addVoice.bind(this);


        this.choirContainer = document.getElementById(choirContainerID);


        // upper main panel classes
        this.noteSheet = new NoteSheet();

        //lower subpanels classes
        this.mixer = new Mixer();
        this.interval = new Interval();
        this.voiceControl = new VoiceControl();
        this.help = new Help();

        this.createLayout();


        this.addVoice();


    }

    // general

    static setKey(noteSheetKey) {
        this.noteSheetKey = noteSheetKey;
        this.noteSheet.keySelector.setKey();
    }


    // voice control

    static getTabId(id) {
        for (let tabId = 0; tabId < Choir.voiceNumber; tabId++) {
            if (Choir.voices[tabId].id === id) {
                return tabId;
            }
        }
    }


    static updateTabIds() {
        this.voices.forEach((voice, tabId) => {
            voice.tabId = tabId;
        });
    }

    static update() {

        this.draw();
        this.updateTabIds();
        this.mixer.updateMixer();
        this.interval.updateMatrix();
        this.voiceControl.updateAllRhythmSelectors();


    }

    static async addVoice() {
        if (this.voiceNumber === 0) {
            this.showControls();
        }

        this.updateTabIds();
        if (this.voiceNumber < 5) {

            const voice = new Voice(this);
            this.voices.push(voice);
            this.voiceNumber = this.voices.length;
            this.voiceControl.addVoiceControlTab(voice);
            this.mixer.addChannel(voice);

            this.update();
            voice.tabLink.click()
            await AudioBuffer.setInstrument(voice, voice.instrument)

            setTimeout(this.activateVoice(voice))
        }
    }

    static async removeVoice(voice, awaitConfirm = true) {

        let userChoice = 1

        if (awaitConfirm) {
            userChoice = await this.voiceControl.askConfirmation(voice.name);
        }


        if (userChoice === 1) {

            if (voice.part != null) {
                voice.part.cancel();
            }
            if (voice.highlightPart != null) {
                voice.highlightPart.cancel();
            }


            this.updateTabIds();
            voice.tabPane.remove();
            voice.tabLink.remove();
            voice.removeAllEventListeners();

            this.voices.splice(voice.tabId, 1)

            this.voiceNumber = this.voices.length;
            this.mixer.removeChannel(voice);
            this.interval.removeVoiceFromMatrix(voice);

            this.update();

            if (this.voiceNumber === 0) {
                this.addVoice();
            } else {
                this.voices[0].tabLink.click();
            }
            voice = null;
        }
    }


    static activateVoice(voice) {

        this.activeVoice = voice;
        let id = voice.id;


        let oldId = -1;

        this.voices.forEach(voice => {
            if (voice.isActive) {
                oldId = voice.id;
            }
        })

        if (id === undefined) {
            id = oldId;

        }


        // let activeTab = getTabId(Id);
        const activeClass = ["btn-primary"];
        const passiveClass = ["btn-outline-primary", "fill-white"];

        this.voices.forEach(voice => {
            let mixerNameLabel = voice.mixerNameLabel;


            if (voice.id === id) {
                voice.isActive = 1;
                mixerNameLabel.classList.remove(...passiveClass)
                mixerNameLabel.classList.add(...activeClass)

                voice.noteSheetNameLabel.classList.remove(...passiveClass)
                voice.noteSheetNameLabel.classList.add(...activeClass)


                this.noteSheet.highlightStaveLine(voice);


            } else {
                voice.isActive = 0;

                mixerNameLabel.classList.remove(...activeClass)
                mixerNameLabel.classList.add(...passiveClass)

                voice.noteSheetNameLabel.classList.remove(...activeClass)
                voice.noteSheetNameLabel.classList.add(...passiveClass)

                this.noteSheet.unhighlightStaveLine(voice);


            }


        });


    }


    /// layout

    /**
     * method pushes control panels to an array, so that visibility can be globally changed by {@link showControls} and {@link hideControls}
     */

    static storeControlPanels() {
        // upper
        this.controlPanels.push(this.noteSheet.panel);
        this.controlPanels.push(Transport.panel);
        this.controlPanels.push(this.noteSheet.keySelector.panel);
        // lower
        this.controlPanels.push(this.mixer.panel);
        this.controlPanels.push(this.interval.panel);
        this.controlPanels.push(this.voiceControl.panel);
        this.controlPanels.push(this.help.panel);
        this.controlPanels.forEach(panel => {
            panel.classList.add('fade-slow-two');
        })

    }

    static showControls() {

        this.controlPanels.forEach(panel => {

            panel.classList.remove('d-none');
            void panel.offsetWidth;
            panel.classList.add('show')
        })
    }

    static hideControls() {
        this.controlPanels.forEach(panel => {
            panel.classList.remove('show')
            panel.classList.add('d-none');

        })
    }

    static createSection() {
        return document.createElement('section');
    }


    static createLayout() {


        this.storeControlPanels();
        this.hideControls();


        this.choirContainer.appendChild(this.noteSheet.panel);
        this.choirContainer.classList.add("mb-5", "mt-3");

        const lowerPanels = document.createElement('div');
        lowerPanels.classList.add('fixed-container');

        // LHS
        const sectionLeft = this.createSection();
        sectionLeft.appendChild(this.mixer.panel);
        sectionLeft.appendChild(this.interval.panel);
        sectionLeft.appendChild(this.help.panel);

        //RHS
        const sectionRight = this.createSection();
        sectionRight.appendChild(this.voiceControl.navBar);
        sectionRight.appendChild(this.voiceControl.panel);

        // sectionRight

        lowerPanels.appendChild(sectionLeft);
        lowerPanels.appendChild(sectionRight);

        this.choirContainer.appendChild(lowerPanels);


    }


    // drawing


    static draw() {
        if (this.voiceNumber > 0) {
            this.voices.forEach(voice => {
                NoteParser.parseNotes(voice);
            });

            NoteParser.updateMaxDuration(this.voices);

            this.noteSheet.drawAllVoices();
            this.createAllPlayEvents(); // always create playEvents on redraw!
            this.scheduleAllHighlightEvents(); // needed to re-assign staveNotes

// update playback loop length in case of difference with  visual loop
// no need to reschedule audio
// this happens if another voice is longer then the checked voice and tailing
// rests are added to the checked voice, no need to play rests, right? but without, voices
// are no longer in sync
            this.voices.forEach(voice => {
                if (voice.part !== null) {
                    voice.part.loopEnd = voice.highlightPart.loopEnd;
                }
            });


        }
    }


    /// scheduler and event creation


    static createAndScheduleAll() {
        this.createAllPlayEvents();
        this.scheduleAllPlayEvents();
        this.scheduleAllHighlightEvents();

    }

    static createAllPlayEvents() {
        this.voices.forEach((voice) => {
            NoteParser.createPlayEvents(voice, this.noteSheet)
        });

    }


    static scheduleAllPlayEvents() {
        this.voices.forEach((voice) => {
            Transport.schedulePlayEvents(voice);
        });

    }

    static scheduleAllHighlightEvents() {
        this.voices.forEach((voice) => {
            Transport.scheduleHighlightEvents(voice, this.noteSheet)
        });

    }


}













