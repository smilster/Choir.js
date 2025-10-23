class RangeSelector {
    constructor(voice) {
        this.id = voice.id;
        this.voice = voice;
        this.notenStartEnd = ['C2', 'B5'];

        this.startOktave = 2;
        this.endOktave = 5;
        this.notenNamen = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

        this.isMouseDown = false;
        this.startNote = null;


        this.ausgewaehlteNoten = [];
        this.scale = Array.from({length: 128}, (_, i) => i + 1);

        for (let i = 0; i < this.scale.length; i++) {
            let key = Tone.Frequency(this.scale[i], 'midi').toNote();
            if (key.split('').pop() < 6 && key.split('').pop() > 1) {
                this.ausgewaehlteNoten.push(key);
            }
        }

        this.voiceRangeButton;
        this.claviature;
        this.voiceRangePanel = this.createVoiceRangePanel();
        this.panel = this.createPanel();

        Help.attachTooltip(this.voiceRangePanel,`
        Voice range for note generation. Use the claviature below to adjust.
        `)
        Help.attachTooltip(this.panel,`
<b>Click, drag and release</b><br>to set limiting pitch <b>Range</b> for voice generation. <br><br> Current <i>scale</i> and selected range are highlighted. <br><br> <b>Plays</b> pitch on click.
            `,'bottom');

        // this.updateAusgewaehlteNoten();
    }


    createPanel() {
        // const id = this.id;
        this.claviature = this.createClaviature();


        const panel = document.createElement('div');
        panel.className = 'card card-body justify-content-between align-items-center bg-light';
        panel.id = "klaviaturCard" + this.id;

        const klaviaturContainer = document.createElement('div');
        // klaviaturContainer.id = 'klaviaturContainer' + id;
        klaviaturContainer.className = 'justify-content-between align-items-center';
        klaviaturContainer.appendChild(this.claviature);

        panel.appendChild(klaviaturContainer);

        return panel;

    }


    createClaviature() {
        const claviature = document.createElement('div');
        claviature.id = 'klaviatur' + this.id;
        claviature.classList.add('klaviatur');
        for (let oktave = this.startOktave; oktave <= this.endOktave; oktave++) {
            for (let i = 0; i < this.notenNamen.length; i++) {
                const note = this.notenNamen[i];
                const volleNote = note + oktave;
                const taste = document.createElement('div');
                taste.classList.add('taste');
                taste.dataset.note = volleNote;
                if (note.includes('#')) {
                    taste.classList.add('schwarz');
                }
                taste.innerHTML = volleNote === "C4" ? "<div class='C4-circle'></div>" : "";

                claviature.appendChild(taste);
            }
        }


        this.attachEventListener(claviature);

        this.claviature = claviature;
        this.updateClaviatureColors();
        return claviature;
    }

    selectNotes(note) {
        if (this.startNote) {
            this.ausgewaehlteNoten = [];
            const keys = [...this.claviature.children];
            const startIndex = keys.findIndex(key => key.dataset.note === this.startNote);
            const endIndex = keys.findIndex(key => key.dataset.note === note);
            const start = Math.min(startIndex, endIndex);
            const end = Math.max(startIndex, endIndex);

            for (let i = start; i <= end; i++) {
                this.ausgewaehlteNoten.push(keys[i].dataset.note);
            }
            this.updateClaviatureColors();

        }
    }

    updateClaviatureColors() {
        const keys = [...this.claviature.children];
        keys.forEach(key => {
            if (this.ausgewaehlteNoten.includes(key.dataset.note)) {
                key.classList.add('ausgewaehlt');
            } else {
                key.classList.remove('ausgewaehlt');
            }

            if (this.voice.scale.includes(Tone.Frequency(key.dataset.note).toMidi())) {
                key.classList.add('scaleShow');
            } else {
                key.classList.remove('scaleShow');
            }

        });

        this.notenStartEnd[0] = this.ausgewaehlteNoten[0];
        this.notenStartEnd[1] = this.ausgewaehlteNoten[this.ausgewaehlteNoten.length - 1];

        this.voiceRangeLabel = this.notenStartEnd.join(' - ');

        this.voiceRangeButton.textContent = this.voiceRangeLabel;

        this.voice.voiceRange = this.notenStartEnd;
        this.voice.voiceRangeMidi = [Tone.Frequency(this.notenStartEnd[0]).toMidi(),
            Tone.Frequency(this.notenStartEnd[1]).toMidi()];
    }


    attachEventListener(div) {
        /// ///
        /// ///
        /// ///
        this.claviatureMouseDown = async function (event) {
            this.isMouseDown = true;
            const key = event.target.closest('.taste');
            this.startNote = key.dataset.note;
            if (Tone.Buffer.downloads.length === 0){
                await Tone.start();
                this.voice.sampler.triggerAttackRelease(key.dataset.note, 0.2);
            }
            this.selectNotes(key.dataset.note)
        }.bind(this);
        div.addEventListener('mousedown', this.claviatureMouseDown);

        /// ///
        /// ///
        /// ///
        this.claviatureMouseLeave = function (event) {
            this.isMouseDown = false;
        }.bind(this);
        div.addEventListener('mouseleave', this.claviatureMouseLeave);


        /// ///
        /// ///
        /// ///
        this.claviatureMouseMove = function (event) {
            if (this.isMouseDown) {
                const taste = event.target.closest('.taste');
                this.selectNotes(taste.dataset.note)
            }
        }.bind(this);
        div.addEventListener('mousemove', this.claviatureMouseMove);

        /// ///
        /// ///
        /// ///
        this.claviatureDocumentMouseUp = function (event) {
            this.isMouseDown = false;
        }.bind(this)
        document.addEventListener('mouseup', this.claviatureDocumentMouseUp);



        /// ///
        /// ///
        /// ///

        this.voice.storeEventListener(div, 'mousedown', this.claviatureMouseDown);
        this.voice.storeEventListener(div, 'mouseleave', this.claviatureMouseLeave);
        this.voice.storeEventListener(div, 'mousemove', this.claviatureMouseMove);
        this.voice.storeEventListener(document, 'mouseup', this.claviatureDocumentMouseUp);
        // document in last line is intended for global release

    }


    createVoiceRangePanel() {
        const panel = document.createElement('div');
        panel.className = 'd-flex';
        const rangeButton = document.createElement('button');
        rangeButton.className = 'btn btn-secondary btn-static me-1';
        rangeButton.disabled = true;
        rangeButton.style.cssText = 'resize: none; width: 60px; padding-left: 0px; padding-right: 0px;';
        rangeButton.textContent = 'Range';


        const voiceRangeButton = document.createElement('button');
        voiceRangeButton.className = 'btn btn-light border-secondary';
        voiceRangeButton.disabled = true;
        voiceRangeButton.style.cssText = 'resize: none; width: 86px; padding-left: 0px; padding-right: 0px;';
        this.voiceRangeButton = voiceRangeButton;

        panel.appendChild(rangeButton);

        panel.appendChild(voiceRangeButton);

        return panel;
    }

}
