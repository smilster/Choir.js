class Channel {
    constructor(voice, master) {
        this.id = voice.id;
        this.voice = voice;
        this.master = master;



        this.instrumentSelector = new InstrumentSelector(voice);

        this.solo = false;
        this.muted = false;




        this.pan = -0.2 + 0.4 * Math.random();
        this.panner = new Tone.Panner(this.pan);
        this.voice.panner = this.panner;

        this.gain = 0.7;
        this.amp = new Tone.Gain(this.gain);


        this.soloButton = null;
        this.muteButton = null;
        this.soloActiveClass = 'btn-success';
        this.soloPassiveClass = 'btn-outline-success';
        this.muteActiveClass = 'btn-danger';
        this.mutePassiveClass = 'btn-outline-danger';
        this.panel = this.createPanel();

        this.connectChannel();



    }

    connectChannel() {
        this.panner.connect(this.amp);
        this.amp.connect(this.master);
    }




    setGain(gain) {
        if (!this.muted) {
            this.amp.gain.rampTo(parseFloat(gain), 0.02);
            this.gain = gain;
        } else {
            this.amp.gain.rampTo(parseFloat(0), 0.02);
            this.gain = gain;
        }

    }

    setPan(pan) {
        this.panner.pan.rampTo(parseFloat(pan), 0.02);
        this.pan = pan;
    }


    createPanel() {
        const voice = this.voice;


        const mixerNameLabel = document.createElement("button");
        mixerNameLabel.classList.add("btn");
        mixerNameLabel.textContent = voice.name;
        mixerNameLabel.style.width = "96px";
        mixerNameLabel.style.marginBottom = "2px";
        mixerNameLabel.style.fontWeight = "bold";
        mixerNameLabel.id = "mixerTab" + voice.id;

        voice.mixerNameLabel = mixerNameLabel;

        mixerNameLabel.addEventListener('click', () => {
            voice.tabLink.click();
        });


        // Volume Slider

        const volPanCard = document.createElement("div");
        volPanCard.classList.add("bg-light", "card");
        volPanCard.setAttribute("style", 'display: block; justify-content: center;')

        const volumeSlider = document.createElement("input");
        volumeSlider.type = "range";
        volumeSlider.min = "0.0";
        volumeSlider.max = "1.0";
        volumeSlider.step = "0.01";

        volumeSlider.value = this.gain;

        volumeSlider.classList.add("volume-slider");

        const volumeSliderInput = function () {
            this.setGain(volumeSlider.value);
        }.bind(this)

        volumeSlider.addEventListener("input", volumeSliderInput);
        voice.storeEventListener(volumeSlider, 'input', volumeSliderInput);


        // Panner Knob

        const pannerKnob = document.createElement("div");
        pannerKnob.className = "panner-knob";

        let panAngle = Math.max(-135, Math.min(135, 135 * this.pan)); // Initial angle

        pannerKnob.style.transform = `rotate(${panAngle}deg)`;

        // Event listeners for the knob
        let isDragging = false;
        let startX;

        pannerKnob.addEventListener("mousedown", (event) => {
            isDragging = true;
            event.preventDefault(); // Prevent text selection
            startX = event.clientX;
        });

        const pannerMouseMove = function (event) {
            if (!isDragging) return;
            event.preventDefault(); // Prevent text selection
            const delta = event.clientX - startX;//
            panAngle += delta;
            panAngle = Math.max(-135, Math.min(135, panAngle)); //limit the rotation.
            pannerKnob.style.transform = `rotate(${panAngle}deg)`;
            startX = event.clientX;

            // Calculate panning value from angle (-1 to 1)
            const panValue = panAngle / 135;
            this.setPan(panValue);

        }.bind(this);


        document.addEventListener("mousemove", pannerMouseMove);
        voice.storeEventListener(document, 'mousemove', pannerMouseMove);

        document.addEventListener("mouseup", () => {
            isDragging = false;
        });


        const soloButton = document.createElement("button");
        soloButton.classList.add("btn", "btn-outline-success", 'py-0', 'solo');
        soloButton.innerHTML = "solo"
        soloButton.style.fontSize = "14px";
        soloButton.style.fontWeight = 'bold';
        soloButton.style.width = "96px";
        soloButton.id = 'solo' + this.id;

        this.soloButton = soloButton;


        const muteButton = document.createElement("button");
        muteButton.classList.add("btn", "btn-outline-danger", "py-0", 'mute');
        muteButton.innerHTML = "mute";
        muteButton.style.fontSize = "14px";
        muteButton.style.fontWeight = 'bold';
        muteButton.style.width = "96px";
        muteButton.id = 'mute' + this.id;

        this.muteButton = muteButton;


        const channelPanel = document.createElement("div");
        channelPanel.classList.add("channel");//, "bg-light");
        channelPanel.setAttribute("style", "width: 96px; align-items: center; text-align: center;")
        channelPanel.disabled = true;
        channelPanel.style.margin = "1px";

        channelPanel.innerHTML = "";


        channelPanel.appendChild(mixerNameLabel);

        volPanCard.appendChild(volumeSlider);
        volPanCard.appendChild(pannerKnob);
        channelPanel.appendChild(volPanCard);
        channelPanel.appendChild(soloButton);
        channelPanel.appendChild(muteButton);
        channelPanel.appendChild(this.instrumentSelector.panel);

        return channelPanel;


    }

    setMute() {
        this.muted = true;
        this.voice.muted = true;

        this.solo = false;
        this.voice.solo = false;


        this.soloButton.classList.add(this.soloPassiveClass);
        this.soloButton.classList.remove(this.soloActiveClass);

        this.muteButton.classList.remove(this.mutePassiveClass);
        this.muteButton.classList.add(this.muteActiveClass);
    }

    unsetMute() {
        this.muted = false;
        this.voice.muted = false;

        this.muteButton.classList.add(this.mutePassiveClass);
        this.muteButton.classList.remove(this.muteActiveClass);
    }


    setSolo() {
        this.solo = true;
        this.voice.solo = true;

        this.muted = false;
        this.voice.muted = false;

        this.soloButton.classList.remove(this.soloPassiveClass);
        this.soloButton.classList.add(this.soloActiveClass);
    }

    unsetSolo() {
        this.solo = false;
        this.voice.solo = false;

        this.soloButton.classList.add(this.soloPassiveClass);
        this.soloButton.classList.remove(this.soloActiveClass);
    }


}