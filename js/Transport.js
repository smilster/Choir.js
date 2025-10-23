/**
 * static Transport control class
 *
 */


class Transport {


    /**
     * BPM mus be same as ToneJS Transport BPM
     * @type {*}
     */
        static bpm = Tone.Transport.bpm.value;

    /**
     *  scheduling latency offset in case of performance issues
     * @type {number}
     */
        static scheduleDelay = 0.05; // add this seconds for smoother playback on live note change

        static startButton = null;
        static stopButton = null;



        static panel = this.createPanel();




    // transport control

    static async start() {
        if (Tone.context.state !== 'running') {
            await Tone.start();
        }
        if (Tone.Transport.state !== 'running') {
            Choir.createAndScheduleAll();
            await Tone.Transport.start();
        } else {
            Tone.Transport.pause();
        }
    }

    static stop() {
        Tone.Transport.stop();
        Tone.Transport.cancel();
        Tone.Transport.position = 0;
        setTimeout(() => {
            Choir.noteSheet.unhighlightLastPlayEvents();
        }, 1500)
    }





    static schedulePlayEvents(voice) {
        let oldPart = null;
        if (voice.part !== null) {
            oldPart = voice.part;
        }

        const audioDelay = this. scheduleDelay + 0.05;
        const beatRescale = 240 / Tone.Transport.bpm.value;
        const part = new Tone.Part(((time, playEvent) => {
            if (playEvent.note !== null) {
                voice.sampler.triggerAttackRelease(playEvent.note, playEvent.duration, time + audioDelay);
            }
        }), voice.playEvents).start(0);

        part.loop = true;
        part.loopEnd = beatRescale * NoteParser.maxTotalDuration;
        voice.part = part;

        if (oldPart !== null) {
            oldPart.cancel(0);
        }

    }

    static scheduleHighlightEvents(voice, noteSheet) {
        let oldPart = null;
        if (voice.highlightPart !== null) {
            oldPart = voice.highlightPart;
        }
        const highlightDelay = this.scheduleDelay;
        const beatRescale = 240 / Tone.Transport.bpm.value;
        const part = new Tone.Part(((time, playEvent) => {
            Tone.Draw.schedule(function () {
                if (voice.lastPlayEvent != null) {
                    noteSheet.unhighlightNote(voice.lastPlayEvent.staveNoteHead, voice.lastPlayEvent.staveNoteStem)
                }
                if (!voice.muted){
                    noteSheet.highlightNote(playEvent.staveNoteHead, playEvent.staveNoteStem);
                } else {
                    noteSheet.highlightMutedNote(playEvent.staveNoteHead, playEvent.staveNoteStem);
                }

                voice.lastPlayEvent = playEvent;
            }, time + highlightDelay);

        }), voice.playEvents).start(0);

        part.loop = true;
        part.loopEnd = beatRescale * NoteParser.maxTotalDuration;
        voice.highlightPart = part;
        if (oldPart !== null) {
            oldPart.cancel(0);
        }

    }


    /**
     * creates Panel with Button to control BPM, and Transport (start,stop)
     * @returns {HTMLDivElement}
     */

    static createPanel() {


        const buttonWidth = '60px';
        const marginClass = 'me-1';

        const controlPanel = document.createElement('div');
        controlPanel.className = 'd-flex ';
        controlPanel.id = 'transportPanel';
        // controlPanel.style.width = '1000px'

        const bpmLabel = document.createElement('button');
        bpmLabel.className = 'btn btn-secondary text-white';
        bpmLabel.classList.add(marginClass);
        bpmLabel.style.width = buttonWidth;
        bpmLabel.disabled = true;
        bpmLabel.innerHTML = '<b>BPM</b>';

        const bpmInput = document.createElement('input');
        bpmInput.type = 'text';
        bpmInput.inputmode = 'numeric';
        bpmInput.className = 'form-control bg-light';
        bpmInput.classList.add(marginClass);
        bpmInput.id = 'bpmInput';
        bpmInput.rows = '1';
        bpmInput.cols = '3';
        bpmInput.style.resize = 'none';
        bpmInput.style.width = buttonWidth;
        bpmInput.style.textAlign = 'center';
        bpmInput.maxLength = 3;
        bpmInput.spellcheck = false;
        bpmInput.value = this.bpm;


        /**
         * BPM input listener function
         */
        const bpmInputHandler = function (event) {
            const input = event.target.value.replace(/\D+/g, '');
            event.target.value = input;
            this.setBpm(input);
             Choir.createAndScheduleAll()
        }.bind(this)

        bpmInput.addEventListener('input', bpmInputHandler);


        // STOP BUTTON
        const stopButton = document.createElement('button');
        stopButton.id = 'stopButton';
        stopButton.className = 'btn btn-danger ';
        stopButton.classList.add(marginClass);
        stopButton.style.width = buttonWidth;
        stopButton.innerHTML = '&#9632;';

        this.stopButton = stopButton;
        this.stopButton.addEventListener('click', this.stop);


        // STARTBUTTON
        const startButton = document.createElement('button');
        startButton.id = 'startButton';
        startButton.className = 'btn btn-success';
        startButton.classList.add(marginClass);
        startButton.style.width = buttonWidth;
        startButton.innerHTML = '&#9654;';

        this.startButton = startButton;

        this.startButton.addEventListener('click', this.start);



        controlPanel.appendChild(bpmLabel);
        controlPanel.appendChild(bpmInput);
        controlPanel.appendChild(stopButton);
        controlPanel.appendChild(this.startButton);



        return controlPanel;

    }


    /**
     * sets BPM globally for Choir, Tone.Transport and this Transport class
     * @param bpm
     */

    static setBpm(bpm) {
        if (bpm === 0 || bpm === ''){
            bpm = 1;
        }

        this.bpm = bpm;
        Choir.bpm = bpm;
        Tone.Transport.bpm.value = bpm;
    }

}