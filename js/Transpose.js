class Transpose{
    constructor(voice) {
        this.voice = voice;
        this.panel = this.createTranspose();
        Help.attachTooltip(this.panel,`<b>Transpose</b> all notes of this voice by semitones or octaves.`,'left')

    }

    createTranspose() {
        const id = this.id;

        const createButton = (label, semitones, width = 40) => {
            const button = document.createElement('button');
            button.className = semitones === null ? 'btn btn-secondary' : 'transpose btn btn-light btn-outline-secondary';
            button.classList.add('me-1')
            button.disabled = semitones === null;
            button.value = semitones === null ? null : semitones;
            button.textContent = label;
            button.style.cssText = `width:${width}px;`;
            return button;
        };


        const transposeDiv = document.createElement('div');
        transposeDiv.id = `transposeContainer${id}`;
        transposeDiv.style.display = 'flex';
        transposeDiv.dataset.bsPlacement = 'top';
        transposeDiv.append(
            createButton('Transpose', null, 97),
            createButton('-12', -12),
            createButton('-1', -1),
            createButton('+1', 1),
            createButton('+12', 12)
        );

        this.attachTransposeEventListener(transposeDiv);

        const panel = document.createElement('div');
        panel.className = 'd-flex justify-content-between align-items-center';

        const notesButton = createButton('Notes', null, 97);

        const spacer = document.createElement('div');
        spacer.style.flexGrow = 1;

        panel.append(transposeDiv, spacer, notesButton);
        return panel;
    }


    attachTransposeEventListener(div) {

        const transposeClick = function (event) {
            const transposeButton = event.target.closest('.transpose');
            if (transposeButton != null) {
                const semitones = parseFloat(transposeButton.value);
                this.transpose(semitones);
            }
        }.bind(this);

        div.addEventListener('click', transposeClick);
        this.voice.storeEventListener(div, 'click', transposeClick);

    }



    transpose(interval) {

        const voice = this.voice;

        voice.noteString = "";

        let noteStringArray = voice.noteStringCorrected.split(' ');
        for (let i = 0; i < voice.staveNotes.length; i++) {

            let [key, octave, duration] = NoteParser.decodeNoteStringItem(noteStringArray[i]);
            

            let newOctave;
            let newPitch;
            let newIndex;


            if (chromaticSharp.includes(key)) {
                newIndex = chromaticSharp.indexOf(key) + interval;
            } else {
                newIndex = chromaticFlat.indexOf(key) + interval;
            }

            newOctave = String((Number(octave) + Math.floor(newIndex / 12) + 12) % 12);

            if (Number(newOctave) < 2) { newOctave = String(5) }
            if (Number(newOctave) > 5) { newOctave = String(2) }

            newPitch = chromaticSharp[(newIndex + 12) % 12];
            if (voice.staveNotes[i].noteType === "r") {

                voice.noteString = voice.noteString + "." + duration + " ";
            } else {
                voice.noteString = voice.noteString + newPitch + newOctave + "." + duration + " ";
            }
        }

        voice.noteInput.value = voice.noteString;
        Choir.draw();
        Transport.schedulePlayEvents(this.voice);

    }

}

