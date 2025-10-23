class InstrumentSelector {
    constructor(voice) {
        this.voice = voice;
        this.id = voice.id;
        this.instrumentNames = AudioBuffer.instrumentNames;
        this.instrumentDropdownAnchors = [];
        this.instrumentButton = null;


        this.panel = this.createInstrumentDropdownMenu();


    }




    createInstrumentDropdownMenu() {

        const instrumentSelector = document.createElement('div');
        instrumentSelector.className = 'dropup';

        const button = document.createElement("button");
        button.classList.add('btn','btn-light','btn-outline-secondary', 'text-truncate');
        button.innerHTML = this.voice.instrument;
        button.style.paddingTop = '0px';
        button.style.paddingBottom = '0px';
        button.style.fontSize = "14px";
        button.style.fontWeight = 'bold';
        button.style.width = "96px";
        button.id = 'instrumentButton' + this.id;
        button.dataset.bsToggle = 'dropdown';

        this.instrumentButton = button;


        const dropdownMenu = document.createElement('ul');
        dropdownMenu.className = 'dropdown-menu scale bg-light';
        dropdownMenu.id = 'instrumentSelectContent' + this.id;

        this.attachEventListener(dropdownMenu);


        for (let i = 0; i < this.instrumentNames.length; i++) {
            const listItem = document.createElement('li');
            const anchor = document.createElement('a');

            anchor.className = 'dropdown-item';
            anchor.dataset.value = this.instrumentNames[i];
            anchor.id = 'instrument' + this.id;
            anchor.textContent = this.instrumentNames[i];

            if (this.instrumentNames[i] === this.voice.instrument) {
                anchor.classList.add('active', 'bg-secondary', 'text-white');
            }

            listItem.appendChild(anchor);
            dropdownMenu.appendChild(listItem);

            this.instrumentDropdownAnchors.push(anchor);
        }

        instrumentSelector.appendChild(button);
        instrumentSelector.appendChild(dropdownMenu);
        return instrumentSelector;

    }


    attachEventListener(div) {

        this.instrumentDropdownClick = function (event) {

            const anchor = event.target.closest('.dropdown-item');
            const selectedInstrument = anchor.getAttribute('data-value');
            this.instrumentButton.innerHTML = selectedInstrument;

            this.instrumentDropdownAnchors.forEach(item => {
                item.classList.remove('active', 'bg-secondary', 'text-white');
            });
            anchor.classList.add('active', 'bg-secondary', 'text-white');
            AudioBuffer.setInstrument(this.voice,selectedInstrument);
        }.bind(this);

        div.addEventListener('click', this.instrumentDropdownClick);
        this.voice.storeEventListener(div, 'click', this.instrumentDropdownClick);
    }


}