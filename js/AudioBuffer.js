class AudioBuffer {


    // constructor(startButton) {

        static instruments = Instruments.get();
        static instrumentNames = this.generateInstrumentNameList();
        static bufferingInstruments = new Map();

        static bufferText = '';
        static bufferingInstrumentsNames = '';

        static startButton = Transport.startButton; // AudioBuffer can deactivate StartButton;

        static isBuffering = false;

        static panel = this.createPanel();



    // }

    static createPanel(){
        const panel = document.createElement('div');
        panel.className = 'btn btn-outline-success me-auto disabled opacity-0 ms-0 px-3' +
            ' buffer-loading text-truncate';
        panel.style.maxWidth = '400px';

        const bufferText = document.createElement('span');
        this.bufferText = bufferText;



        const spinner = document.createElement('span');
        spinner.className = 'spinner-border spinner-border-sm ms-1 me-2';
        spinner.setAttribute('role','status');

        panel.appendChild(spinner);
        panel.appendChild(bufferText);

        return panel;
    }

    static updateBufferDisplay(bufferingInstruments) {
        if (!this.isBuffering) {
            this.panel.classList.add('opacity-0');
            this.startButton.classList.remove("disabled");
            this.bufferText.innerHTML = '100% Buffering ' + this.bufferingInstrumentsNames;
            return
        }

        this.startButton.classList.add("disabled");
        this.panel.classList.remove('opacity-0');

        this.updateBufferString();

        this.bufferText.innerHTML = this.bufferString;
        setTimeout( () => {
            this.updateBufferDisplay(bufferingInstruments);
        }, 100);
    }


    static updateBufferString() {
        const pendingBuffers = Tone.Buffer.downloads.length;

        let totalBuffer = 0;
        // console.log('\n\n\n\n\n')
        // check all buffering instruments and those that have been called before all buffer loadings have finish
        this.bufferingInstrumentsNames = '';
        this.bufferingInstruments.forEach((sampleNumber, instrumentName) => {
            // console.log(instrumentName)
            totalBuffer += parseFloat(sampleNumber);
            this.bufferingInstrumentsNames += instrumentName + " ";
        })
        const totalProgress = Math.round(100 * (1 - pendingBuffers / totalBuffer));
        this.bufferString = totalProgress + "% Buffering " + this.bufferingInstrumentsNames;
    }






    static generateInstrumentNameList() {
        const instrumentNames = [];
        this.instruments.forEach((instrument) => instrumentNames.push(instrument.displayName));
        return instrumentNames;
    }


    static async generateSampler(instrument) {

        const generateSamplerFromBuffer = (instrument) => {

            const samplerProperties = {
                baseUrl: instrument.baseUrl,
                attack: instrument.attack,
                release: instrument.release,
                // urls: instrument.urls,
            }
            const sampler = new Tone.Sampler(samplerProperties);
            for (const [note, toneBuffer] of instrument.buffer._buffers) {
                sampler.add(note, toneBuffer);
            }

            return sampler;
        }

        const bufferProperties = {
            baseUrl: instrument.baseUrl,
            urls: instrument.urls,
        }


        if (instrument.isBuffered) {
            return generateSamplerFromBuffer(instrument);
            // await Tone.Buffer.loaded();
        }


        // if not buffered, start buffering
        if (!instrument.isBuffering) {
            instrument.isBuffering = true;
            this.isBuffering = true;

            this.bufferingInstruments.set(instrument.displayName, instrument.sampleNumber);
            this.updateBufferDisplay(this.bufferingInstruments);

            instrument.buffer = await new Tone.ToneAudioBuffers(bufferProperties);


            instrument.isBuffering = false;
            instrument.isBuffered = true;

            await Tone.Buffer.loaded();

            this.bufferingInstruments.delete(instrument.displayName);
            if(this.bufferingInstruments.size === 0) {
                this.isBuffering = false;
            }
            return generateSamplerFromBuffer(instrument);
            // await Tone.Buffer.loaded();


        }

        if (instrument.isBuffering) {
            await Tone.Buffer.loaded();

            return generateSamplerFromBuffer(instrument);
        }


    }


    static async setInstrument(voice, instrumentName) {
        voice.instrument = instrumentName;
        const instrument = this.instruments.get(instrumentName);
        const sampler = await this.generateSampler(instrument);
        await Tone.Buffer.loaded()
        voice.sampler = sampler;
        voice.isConnectedToPlayer = false;
        voice.sampler.connect(voice.panner)
    }

}



