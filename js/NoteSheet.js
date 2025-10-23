const {
    Renderer,
    Formatter,
    Stave,
    StaveNote,
    Accidental,
    Dot,
    Tuplet,
    Beam,
    Voice: VexFlowVoice,
    Stem,
    KeySignature,
    Barline
} = Vex.Flow;


class NoteSheet {
    constructor() {


        // vexflow renderer and context
        this.staveWidth = 1012;
        this.staveHeight = 110;
        this.vexFlowPanel = this.createVexFlowPanel();
        this.renderer = new Renderer(this.vexFlowPanel, Renderer.Backends.SVG);
        this.renderer.resize(this.staveWidth, 1);
        this.context = this.renderer.getContext();


        // vexflow formatter
        this.vexFlowVoices = [];
        this.beatsPerMeasure = 4; //   4 / 4 measure

        this.formatter = new Formatter();
        this.noteTooltips = [];

        // name labels
        this.nameLabels = [];
        this.nameLabelPanel = null;

        // control panel items
        this.keySelector = new KeySelector();
        this.addVoiceButton = this.createAddVoiceButton();
        this.panel = this.createPanel();


        // attach tooltips

        Help.attachTooltip(this.keySelector.panel, `Select the <b>key</b> for the note sheet. This does not impact note generation. 
        `, 'bottom');

        Help.attachTooltip(this.vexFlowPanel, `
            This is your <b>note sheet</b>. It depicts all voices. Click the name label to the left to select a voice for editing.
`, 'bottom')

        Help.attachTooltip(Transport.panel, 'Set playback <b>BPM</b>, <b>start</b> and <b>stop</b> transport.')

        Help.attachTooltip(this.addVoiceButton, "Add a new voice!",'bottom')


    }


    createPanel() {
        const panel = document.createElement('div');
        panel.className = "full-width";

        panel.appendChild(this.vexFlowPanel);

        const controlPanel = document.createElement('div');
        controlPanel.className = "d-flex";
        controlPanel.style.width = '1008px'

        controlPanel.appendChild(Transport.panel);
        controlPanel.appendChild(AudioBuffer.panel);
        controlPanel.appendChild(this.keySelector.panel);
        controlPanel.appendChild(this.addVoiceButton);

        panel.appendChild(controlPanel);
        panel.appendChild(this.createNameLabelPanel());
        return panel;
    }

    createVexFlowPanel() {
        const panel = document.createElement('div');
        panel.id = 'output';
        panel.className = 'p-0 ms-auto my-0';

        return panel;
    }

    createNameLabelPanel() {
        const nameLabelPanel = document.createElement('div');
        nameLabelPanel.style.position = 'absolute';
        this.nameLabelPanel = nameLabelPanel;

        return nameLabelPanel;
    }


    updateNameLabels() {

        // remove old nameLabels to remove event listeners
        this.nameLabels.forEach(nameLabel => {
            nameLabel.remove();
        })
        this.nameLabels = [];

        this.nameLabelPanel.innerHTML = '';
        Choir.voices.forEach((voice) => {


            const nameLabel = document.createElement('button');
            nameLabel.className = 'btn py-0 px-1 m-0 shadow';
            nameLabel.style = 'transform: rotate(-90deg); font-weight: bold'
            nameLabel.style.zIndex = '10';
            nameLabel.style.fontSize = '16px';
            nameLabel.style.position = 'absolute';
            nameLabel.style.top = (voice.staveOffsetY + 48) + 'px';
            nameLabel.style.left = '-40px';
            nameLabel.style.width = '80px';
            nameLabel.style.height = '25px';


            const activeClass = ["btn-primary"];
            const passiveClass = ["btn-outline-primary"];

            if (voice.isActive) {
                nameLabel.classList.add(...activeClass)
                nameLabel.classList.remove(...passiveClass)
            } else {
                nameLabel.classList.add(...passiveClass)
                nameLabel.classList.remove(...activeClass)
            }

            const nameLabelClick = () => {
                voice.tabLink.click();
            }

            nameLabel.addEventListener('click', () => {
                nameLabelClick()
            });


            nameLabel.innerHTML = voice.name;
            this.nameLabelPanel.appendChild(nameLabel)

            voice.noteSheetNameLabel = nameLabel;

            this.nameLabels.push(nameLabel);
        });
    }


    createAddVoiceButton() {

        const addVoiceButton = document.createElement('button');
        addVoiceButton.className = 'btn btn-outline-primary';
        addVoiceButton.style.resize = 'none';
        addVoiceButton.style.width = '147px';
        addVoiceButton.style.textAlign = 'center';
        addVoiceButton.style.fontWeight = 'bold';
        addVoiceButton.innerHTML = 'Add Voice &nbsp; ✚';
        addVoiceButton.addEventListener('click', Choir.addVoice);


        return addVoiceButton;

    }


    drawAllVoices() {


        this.vexFlowVoices = [];
        this.renderer.resize(this.staveWidth, 10 + this.staveHeight * Choir.voiceNumber);


        this.initializeStaves();

        Choir.voices.forEach(voice => {
            this.generateStaveNotes(voice);


            this.makeVexFlowVoice(voice);
            this.vexFlowVoices.push(voice.vexFlowVoice);
        });

        this.formatter.joinVoices([this.vexFlowVoices[0]]);


        this.formatter.formatToStave(this.vexFlowVoices, Choir.voices[0].stave, {
            align_rests: false, auto_beam: false
        });

        this.context.clear();
        Choir.voices.forEach(voice => {
            this.drawVoice(voice);
            this.attachNoteTooltips(voice);
        });


        this.updateNameLabels();


    }


    makeVexFlowVoice(voice) {
        voice.vexFlowVoice = new VexFlowVoice({
            num_beats: NoteParser.maxTotalDuration * this.beatsPerMeasure, beat_value: this.beatsPerMeasure
        }).addTickables(voice.staveNotes);
        Accidental.applyAccidentals([voice.vexFlowVoice], Music.enharmonicDur(voice.noteSheetKey));
        voice.beams = Beam.generateBeams(voice.staveNotes);
        // }
    }


    initializeStaves() {
        Choir.voices.forEach((voice, i) => {

            voice.noteSheetKey = Choir.noteSheetKey;
            voice.staveOffsetX = this.staveWidth - 15;
            voice.staveOffsetY = -this.staveHeight + (i + 1) * this.staveHeight;
            voice.stave = new Stave(10, voice.staveOffsetY, voice.staveOffsetX).addClef(voice.clef).addKeySignature(Music.enharmonicDur(Choir.noteSheetKey));

        });
    }

    drawVoice(voice) {
        voice.stave.setContext(this.context).draw();
        voice.vexFlowVoice.draw(this.context, voice.stave);
        voice.tuplets.forEach((tuplet) => tuplet.setContext(this.context).draw());
        voice.beams.forEach((beam) => {
            beam.setContext(this.context).draw();
        });
    }


    highlightStaveLine(voice) {
        document.getElementById("vf-" + voice.stave.attrs.id).classList.add('active-stave-line');
    }

    unhighlightStaveLine(voice) {
        document.getElementById("vf-" + voice.stave.attrs.id).classList.remove('active-stave-line');
    }

    getStaveNoteHead(staveNote) {
        return document.getElementById('vf-' + staveNote.attrs.id);
    }

    getStaveNoteStem(staveNote) {
        return document.getElementById('vf-' + staveNote.stem.attrs.id);
    }


    highlightNote(staveNoteHead, staveNoteStem) {

        if (staveNoteHead != null) {
            staveNoteHead.classList.add('active-note');
            staveNoteHead.classList.remove('fade-out-active');

            //setAttribute('fill','red');
        }
        if (staveNoteStem != null) {
            staveNoteStem.classList.add('active-note');
            staveNoteStem.classList.remove('fade-out-active');
            // setAttribute('stroke','red');
        }
    }

    highlightAllNotesGreen(staveNotes){

        staveNotes.forEach(staveNote => {
            const staveNotehead = this.getStaveNoteHead(staveNote);
            const staveNoteStem = this.getStaveNoteStem(staveNote);
            let staveNoteBeam = null;

        if ((typeof staveNote.beam) === 'object') {
                staveNoteBeam =document.getElementById("vf-" + staveNote.beam.attrs.id)
        }
            this.highlightNoteCustomColor(staveNotehead, staveNoteStem,staveNoteBeam,'var(--bs-success)');
        })
    }

    highlightNoteCustomColor(staveNoteHead, staveNoteStem,staveNoteBeam,colorCode) {
        const highlightDuration = 1500;

        if (staveNoteHead != null) {
            staveNoteHead.setAttribute('fill',colorCode);

            setTimeout( ()=>{
                staveNoteHead.removeAttribute('fill')
                staveNoteHead.classList.add('fade-out-active');
            },highlightDuration)
            //setAttribute('fill','red');
        }
        if (staveNoteStem != null) {
            staveNoteStem.setAttribute('stroke',colorCode);
            staveNoteStem.classList.add('fade-out-active');

            // setAttribute('stroke','red');
            setTimeout( ()=>{
                staveNoteStem.removeAttribute('stroke')
            },highlightDuration)
        }

        if (staveNoteBeam != null) {
            staveNoteBeam.setAttribute('fill',colorCode);
            staveNoteBeam.classList.add('fade-out-active');

            // setAttribute('stroke','red');
            setTimeout( ()=>{
                staveNoteBeam.removeAttribute('fill')
            },highlightDuration)
        }

    }



    highlightMutedNote(staveNoteHead, staveNoteStem) {

        if (staveNoteHead != null) {
            staveNoteHead.classList.add('active-muted-note');
            staveNoteHead.classList.remove('fade-out-active');

            //setAttribute('fill','red');
        }
        if (staveNoteStem != null) {
            staveNoteStem.classList.add('active-muted-note');
            staveNoteStem.classList.remove('fade-out-active');
            // setAttribute('stroke','red');
        }
    }

    unhighlightNote(staveNoteHead, staveNoteStem) {

        if (staveNoteHead != null) {
            staveNoteHead.classList.remove('active-note');
            staveNoteHead.classList.remove('active-muted-note');
            staveNoteHead.classList.add('fade-out-active');
            // removeAttribute('fill','red');
        }
        if (staveNoteStem != null) {
            staveNoteStem.classList.remove('active-note');
            staveNoteStem.classList.remove('active-muted-note');
            staveNoteStem.classList.add('fade-out-active');
        }
    }

    unhighlightLastPlayEvents() {

        Choir.voices.forEach((voice) => {
            if (voice.lastPlayEvent != null) {
                this.unhighlightNote(voice.lastPlayEvent.staveNoteHead, voice.lastPlayEvent.staveNoteStem);
            }
        })
    }


    generateStaveNotes(voice) {
        let staveNotes = [];

        voice.notes.forEach(note => {

            let staveNotePitch;
            let staveNoteDuration = note.durationString;

            if (note.key === 'rest') {
                if (voice.clef === "treble") {
                    staveNotePitch = "b/4"; // position for rest
                } else if (voice.clef === "bass") {
                    staveNotePitch = "d/3"; // position for rest
                }
                staveNoteDuration = staveNoteDuration + 'r';
            } else {
                staveNotePitch = note.key + '/' + note.octave;
            }

            let staveNote = new StaveNote({
                keys: [staveNotePitch], duration: staveNoteDuration, clef: voice.clef,
            })
            staveNote.autoStem(); //adjust stem direction automatically

            if (note.isDotted) {
                staveNote.addModifier(new Dot().setXShift(2));
            }

            staveNotes.push(staveNote);
        })

        voice.staveNotes = staveNotes;

        this.generateStaveTriplets(voice);


    }

    generateStaveTriplets(voice) {
        const tuplets = [];
        let tripletGroup = []
        voice.notes.forEach((note, index) => {
            if (note.isTriplet) {
                tripletGroup.push(voice.staveNotes[index]);
            }
            if (tripletGroup.length === 3) {
                let tuplet = new Tuplet(tripletGroup, {
                    bracketed: true, ratioed: false, location: Tuplet.LOCATION_ABOVE, // Place the bracket and number above
                })
                tuplets.push(tuplet);
                tripletGroup = [];
            }
        })

        voice.tuplets = tuplets;


    }

    attachNoteTooltips(voice) {
        voice.notes.forEach(note => {
            const staveNote = voice.staveNotes[note.index];
            const divId = "vf-" + staveNote.attrs.id;
            const tip = note.stringCorrected;
            // const tip =  String(staveNote.keys).replace("\/", "").replace("#", "&sharp;").replace("b", "&flat;")
            this.attachNoteTooltip(divId, tip);
        })
    }

    attachNoteTooltip(divId, tip) {
        const div = document.getElementById(divId);

        div.setAttribute("data-bs-toggle", "tooltip");
        div.setAttribute("data-bs-html", "true");
        div.setAttribute("title", tip);

        let tooltip = new bootstrap.Tooltip(div, {trigger: 'hover'});

        this.noteTooltips.push(tooltip);

        setTimeout(() => {
                Choir.activateVoice(Choir.activeVoice);
            }, 0)

    }


//
//     this.notes.forEach(note => {
//     makeTooltip("vf-" + note.attrs.id, String(note.keys).replace("\/", "").replace("#", "&sharp;").replace("b", "&flat;"))
// });


}