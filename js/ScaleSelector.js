class ScaleSelector {
    constructor(voice) {
        this.voice = voice;
        this.id = this.voice.id;
        this.klaviatur = new RangeSelector(voice);

        this.scaleDropdownMenu = null;
        this.scaleDropdownAnchors = [];
        this.scaleTooltipWrapper = null;

        this.panel = this.createPanel();

        Help.attachTooltip(this.scaleTooltipWrapper,`
        Choose <b>root</b> and <b>scale</b> (or mode) for note generation.<br><br>
         It is initially the same as note sheet's <i>KEY</i>.
        `,'left');

    }





    createPanel() {


        const panel = document.createElement('div');
        panel.appendChild(this.createScaleControlPanel());
        panel.appendChild(this.klaviatur.panel);
        return panel;
    }


    createScaleControlPanel() {


        const panel = document.createElement('div');
        panel.className = 'd-flex justify-content-between';

        const scaleTooltipWrapper = document.createElement('div');
        scaleTooltipWrapper.className = 'd-flex';
        this.scaleTooltipWrapper = scaleTooltipWrapper;

        const rootButton = document.createElement('button');
        rootButton.className = 'btn btn-secondary btn-static me-1';
        rootButton.disabled = true;
        rootButton.style.cssText = 'resize: none; width: 60px';
        rootButton.textContent = 'Root';



        const rootInput = document.createElement('textarea');
        rootInput.className = 'form-control bg-light me-1';
        rootInput.id = 'rootInput' + this.id;
        rootInput.rows = 1;
        rootInput.cols = 2;
        rootInput.style.cssText = 'resize: none; width: 42px; text-align: justify; text-align-last: center; padding-left: 0px; padding-right: 0px;';
        rootInput.maxLength = '2';
        rootInput.textContent = this.voice.noteSheetKey.toUpperCase();
        rootInput.spellcheck = false;


        this.scaleRootInput = function (event) {

            const inputElement = event.target;

            inputElement.style.color = "black"

            this.voice.root = 60; //default value

            if (inputElement.value.length > 0) {
                let pitch = inputElement.value[0].toUpperCase();
                if (pitch === "H") { pitch = "B"; }
                let accidental = '';

                if (inputElement.value.length > 1) { accidental = inputElement.value[1]; }

                let pitchClass = pitch + accidental;

                if (allNotes.includes(pitchClass)) {

                    this.voice.root = Tone.Frequency(pitchClass + "4").toMidi();


                } else {

                    inputElement.style.color = "red";

                }
                inputElement.value = pitchClass;


            }

            this.voice.setScale(this.voice.scaleType, this.voice.root);
            this.klaviatur.updateClaviatureColors();



        }.bind(this)


        rootInput.addEventListener('input', this.scaleRootInput);

        this.voice.storeEventListener(rootInput, 'input', this.scaleRootInput);



        const scaleButton = document.createElement('button');
        scaleButton.className = 'btn btn-secondary btn-static me-1';
        scaleButton.disabled = true;
        scaleButton.style.resize = 'none';
        scaleButton.textContent = 'Scale';




        const scaleSelector = document.createElement('div');
        scaleSelector.className = 'dropup';
        scaleSelector.style.cssText = 'right: auto; left: 0;';

        const scaleDropdownButton = document.createElement('button');
        scaleDropdownButton.className = 'btn btn-light btn-outline-secondary ps-3';
        scaleDropdownButton.type = 'button';
        scaleDropdownButton.id = 'scaleTypeSelect' + this.id;
        scaleDropdownButton.dataset.bsToggle = 'dropdown';
        scaleDropdownButton.style.cssText = 'width: 165px;  white-space: nowrap;';
        scaleDropdownButton.innerHTML = this.voice.scaleType + " &#x23F7;";

        this.scaleDropdownButton = scaleDropdownButton;

        const scaleDropdownMenu = document.createElement('ul');
        scaleDropdownMenu.className = 'dropdown-menu scale bg-light';
        scaleDropdownMenu.id = 'scaleTypeSelectContent' + this.id;
      
        this.attachScaleSelectEventListener(scaleDropdownMenu);
        this.scaleDropdownMenu = scaleDropdownMenu;


        for (let i = 0; i < scaleTypeList.length; i++) {
            const listItem = document.createElement('li');
            const anchor = document.createElement('a');

            anchor.className = 'dropdown-item';
            anchor.dataset.value = scaleTypeList[i];
            anchor.id = 'scaleItem' + this.id;
            anchor.textContent = scaleTypeList[i];

            if (scaleTypeList[i] === this.voice.scaleType) {
                anchor.classList.add('active', 'bg-secondary', 'text-white');
            }

            listItem.appendChild(anchor);
            scaleDropdownMenu.appendChild(listItem);

            this.scaleDropdownAnchors.push(anchor);
        }



        scaleSelector.appendChild(scaleDropdownButton);
        scaleSelector.appendChild(scaleDropdownMenu);



        scaleTooltipWrapper.appendChild(rootButton);
        scaleTooltipWrapper.appendChild(rootInput);
        scaleTooltipWrapper.appendChild(scaleButton);
        scaleTooltipWrapper.appendChild(scaleSelector);

        panel.appendChild(scaleTooltipWrapper);

        panel.appendChild(createFlexGrow());
        panel.appendChild(this.klaviatur.voiceRangePanel);



        return panel;
    }


    attachScaleSelectEventListener(div) {

        this.scaleDropDownClick = function (event) {

            const anchor = event.target.closest('.dropdown-item');
            const selectedScaleType = anchor.getAttribute('data-value');
            this.scaleDropdownButton.innerHTML = selectedScaleType + " &#x23F7;";

            this.scaleDropdownAnchors.forEach(item => {
                item.classList.remove('active', 'bg-secondary', 'text-white');
            });
            anchor.classList.add('active', 'bg-secondary', 'text-white');
            this.voice.scaleType = selectedScaleType;
            this.voice.setScale(selectedScaleType, this.voice.root);
            this.klaviatur.updateClaviatureColors();

        }.bind(this);

        div.addEventListener('click', this.scaleDropDownClick);
        this.voice.storeEventListener(div, 'click', this.scaleDropDownClick);
    }





}