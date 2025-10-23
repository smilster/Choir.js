

class RhythmSelector {
    constructor(voice) {
        this.voice = voice;
        this.id = voice.id;

        this.dropdownMenu = null;
        this.dropdownButton = null;

        this.dropdownItems = [];

        this.beatsButton = null;
        this.beatsInput = null;

        this.rhythmTooltipWrapper = null;
        this.beatsTooltipWrapper = null;

        this.generateButton = null;

        this.panel = this.createPanel();

        Help.attachTooltip(this.rhythmTooltipWrapper,`
        <b>Rhythm</b> for note generation is copied from selected voice (may include self, if it should not change rhythm) or randomized. <b>None</b> disables note generation. Rest notes in parent voice will also be rest notes in this voice. 
        `,'left');
        Help.attachTooltip(this.beatsTooltipWrapper,`
        Duration (counted in quarter notes) for generating <b>Random</b> rythm.        
        `,'left')

    }

    createPanel() {

        const divWidth = '97px';

        const panel = document.createElement('div');
        panel.className = 'd-flex';

        // === Rhythm section ===
        const rhythmTooltipWrapper = document.createElement('div');
        rhythmTooltipWrapper.style.display = 'flex';
        rhythmTooltipWrapper.id = 'rhythmTooltipWrapper' + this.id;
        this.rhythmTooltipWrapper = rhythmTooltipWrapper;

        const rhythmLabel = document.createElement('button');
        rhythmLabel.className = 'btn btn-secondary btn-static';
        rhythmLabel.textContent = 'Rhythm';
        rhythmLabel.disabled = true;
        rhythmLabel.style.width = divWidth

        const dropdown = document.createElement('div');
        dropdown.className = 'dropdown';

        const dropdownButton = document.createElement('button');
        dropdownButton.id = `rhythmTypeSelect${this.id}`;
        dropdownButton.className = 'btn btn-light btn-outline-secondary ps-3';
        dropdownButton.type = 'button';
        dropdownButton.dataset.bsToggle = 'dropdown';
        dropdownButton.style.width = divWidth
        this.dropdownButton = dropdownButton;

        const dropdownMenu = document.createElement('ul');
        dropdownMenu.className = 'dropdown-menu';
        dropdownMenu.id = `rhythmTypeSelectContent${this.id}`;
        this.attachEventListener(dropdownMenu);
        this.dropdownMenu = dropdownMenu;

        dropdown.append(dropdownButton, dropdownMenu);

        const rhythmContainer = document.createElement('div');
        rhythmContainer.className = 'mx-1';
        // rhythmContainer.id = `rhythmSelectorContainer${this.id}`;
        rhythmContainer.append(dropdown);

        rhythmTooltipWrapper.append(rhythmLabel, rhythmContainer);

        // === duration in beats section ===
        const beatsTooltipWrapper = document.createElement('div');
        beatsTooltipWrapper.className = 'd-flex ms-auto'
        this.beatsTooltipWrapper = beatsTooltipWrapper;

        const beatsButton = document.createElement('button');
        beatsButton.id = `randomBeatsButton${this.id}`;
        beatsButton.className = 'btn btn-secondary btn-static me-1 px-2';
        beatsButton.innerHTML = `duration &nbsp;&#x2669;&nbsp;`;
        beatsButton.disabled = true;
        beatsButton.style.display = 'none';
        beatsButton.style.width = divWidth;

        this.beatsButton = beatsButton;

        const beatsInput = document.createElement('input');
        beatsInput.id = `randomBeatsInput${this.id}`;
        beatsInput.type = 'text';
        beatsInput.inputMode = 'numeric';
        beatsInput.className = 'form-control bg-light';
        beatsInput.value = NoteParser.maxTotalDuration * 4;
        beatsInput.style.cssText = 'width:60px;text-align:center;display:none;';

        this.randomBeatsInput = function (event) {
            beatsInput.value = Math.min(beatsInput.value.replace(/\D+/g, ''), 32);
            this.voice.randomRhythmDurationInBeats = beatsInput.value; ///check if this works
        }.bind(this);

        beatsInput.addEventListener('input', this.randomBeatsInput);
        
        this.voice.storeEventListener(beatsInput, 'input', this.randomBeatsInput);

        this.beatsInput = beatsInput;


        beatsTooltipWrapper.append(beatsButton, document.createElement('div'), beatsInput);
        panel.append(rhythmTooltipWrapper, beatsTooltipWrapper);

        return panel;
    }

     updateRhythmSelector(alleStimmen) {

        const { dropdownMenu, voice, beatsInput } = this;
        dropdownMenu.innerHTML = '';
        this.dropdownItems = [];

        beatsInput.value = NoteParser.maxTotalDuration * 4;



        // Add all rhythm items
        alleStimmen.forEach(voice => {
            const voiceAnchor = this.addItem(voice.name, voice.tabId, false);
            if (voice.id === this.voice.rhythmLockId) {
                voiceAnchor.classList.add('active', 'bg-secondary', 'text-white');
                this.setButtonLabel(voice.name);
            }
            this.dropdownItems.push(voiceAnchor)

        });
        // Divider + special items
        dropdownMenu.append(Object.assign(document.createElement('div'), { className: 'dropdown-divider' }));
        const randomAnchor = this.addItem('Random', -1, true);
        const noneAnchor = this.addItem('None', -2, false);

        // Handle selected state
        const rhythmLockId = voice.rhythmLockId;
        if (rhythmLockId === -1) {
            randomAnchor.classList.add('active', 'bg-secondary', 'text-white');
            this.setButtonLabel('Random');
        } else if (rhythmLockId === -2) {
            noneAnchor.classList.add('active', 'bg-secondary', 'text-white');
            this.setButtonLabel('None');
        } else if (!dropdownMenu.querySelector('.active')) {
            this.setButtonLabel('None');
        }
    }

    attachEventListener(div) {

        this.rhythmSelectClick = function (event) {

            const anchor = event.target.closest('.dropdown-item');
            if (anchor != null){
                this.clearActive();
                anchor.classList.add('active', 'bg-secondary', 'text-white');
                this.setButtonLabel(anchor.id);

                const rhythmId = parseFloat(anchor.getAttribute('rhythm-id'));
                if (rhythmId === -2){
                    this.generateButton.classList.add('disabled');
                } else {
                    this.generateButton.classList.remove('disabled');
                }
                this.voice.rhythmLockId = rhythmId
                const display = anchor.showBeats ? 'block' : 'none';
                this.beatsButton.style.display = this.beatsInput.style.display = display;
            }

        
        }.bind(this);

        div.addEventListener('click', this.rhythmSelectClick);

        this.voice.storeEventListener(div, 'click', this.rhythmSelectClick);

    }


    clearActive() {
        this.dropdownMenu.querySelectorAll('.dropdown-item').forEach(a => a.classList.remove('active', 'bg-secondary', 'text-white'));

    }


    addItem(label, rhythmId, showBeats) {
        const listItem = document.createElement('li');
        const anchor = document.createElement('a');
        anchor.id = label;
        anchor.className = 'dropdown-item';
        // anchor.href = '#';
        anchor.setAttribute('rhythm-id',rhythmId)
        anchor.textContent = label;
        anchor.showBeats = showBeats;

        listItem.append(anchor);
        this.dropdownMenu.append(listItem);
        return anchor;
    };

    setButtonLabel(label) {
        return this.dropdownButton.innerHTML = `${label} &#x23F7;`;
    }

}


