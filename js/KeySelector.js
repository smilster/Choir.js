

class KeySelector {
    constructor() {

        this.keyDisplay;
        this.keyDropdownButton;

        this.keySetItems = [];


        this.panel = this.createPanel();


    }

    createPanel() {

        const panel = document.createElement('div');
        panel.className = 'd-flex';

        const keyLabel = document.createElement('button');
        keyLabel.className = 'btn btn-secondary btn-static me-1';
        keyLabel.disabled = true;
        keyLabel.style = 'resize: none; width: 60px;';
        keyLabel.innerHTML = '<b>KEY</b>';


        const keyDropdown = document.createElement('div');
        keyDropdown.className = 'dropdown';

        const keyDropdownButton = document.createElement('button');
        keyDropdownButton.className = 'btn btn-light btn-outline-secondary me-1';
        keyDropdownButton.type = 'button';
        keyDropdownButton.style.width = '110px';
        keyDropdownButton.dataset.bsToggle = 'dropdown';
        keyDropdownButton.id = 'keyDropdownButton';
        keyDropdownButton.innerHTML = "<b>" + this.keyDisplay + " &#x23F7;</b>";

        this.keyDropdownButton = keyDropdownButton;


        const keyDropdownMenu = document.createElement('div');
        keyDropdownMenu.className = 'dropdown-menu keySelect';



        const keySelectContainer = this.createKeySelectContainer();


        this.attachEventListener(keySelectContainer);

        keyDropdownMenu.appendChild(keySelectContainer);
        keyDropdown.appendChild(keyDropdownButton);
        keyDropdown.appendChild(keyDropdownMenu);

        this.setKey();

        panel.appendChild(keyLabel);
        panel.appendChild(keyDropdown);
        return panel;
    }

    attachEventListener(div) {

        this.keySelectorClick = function (event) {

            const item = event.target.closest('.key-set');
            Choir.noteSheetKey = item.value
            this.setKey();
            this.deactivateAllKeySelects();
            item.classList.add('active');

            if (item.className.includes('mini-stave')) {
                const majorLabel = item.children[0].children[0];
                majorLabel.classList.add('active');
            } else {
                const miniStave = item.parentElement.parentElement;
                miniStave.classList.add('active');
            }
            Choir.draw();


        }.bind(this);

        div.addEventListener('click', this.keySelectorClick);

      

    }


    deactivateAllKeySelects() {
            this.keySetItems.forEach(element => {
            element.classList.remove('active');
        });
    }

    createKeySelectContainer() {
        const keySelectContainer = document.createElement('div')
        keySelectContainer.id = 'keySelectContainer';

        const majorKeys = ['C#', 'F#', 'B', 'E', 'A', 'D', 'G', 'C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'].slice().reverse();
        const minorKeys = ['a#', 'd#', 'g#', 'c#', 'f#', 'b', 'e', 'a', 'd', 'g', 'c', 'f', 'bb', 'eb', 'ab'].slice().reverse();
        const accidentalNumbers = [7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 6, 7];




        majorKeys.forEach((majorKey, index) => {
            let accidentalNumber = accidentalNumbers[index];
            const keyDropdownItem = document.createElement('div');


            const majorLabel = document.createElement('button');
            majorLabel.className = 'btn btn-outline-dark key-set key-set-major';
            majorLabel.setAttribute("value", majorKey);
            majorLabel.innerHTML = `<b>${majorKey.replace('#', '&sharp;').replace('b', '&flat;')}</b>`;
            

            const minorLabel = document.createElement('button');
            minorLabel.className = 'btn btn-outline-primary key-set key-set-minor';
            minorLabel.setAttribute("value", minorKeys[index]);
            minorLabel.innerHTML = `<b>${minorKeys[index][0].toUpperCase()}`;
            if (minorKeys[index][1] !== undefined) {
                minorLabel.innerHTML += `${minorKeys[index][1].replace('#', '&sharp;').replace('b', '&flat;')}`;
            }
            minorLabel.innerHTML += "m</b>";


            const spacer = document.createElement('div');
            spacer.style.height = "0.1em";
            // innerHTML = "";






            keyDropdownItem.appendChild(majorLabel);
            keyDropdownItem.appendChild(minorLabel);
            keyDropdownItem.appendChild(spacer);


            const keyStave = document.createElement('button');
            keyStave.classList.add('mini-stave', 'btn',);

            keyStave.classList.add('key-set');
            // keyStave.setAttribute("id", "key-setDef" + majorKey + "Major")
            keyStave.setAttribute("value", majorKey);


            if (majorKeys[index] === Choir.noteSheetKey) {
                majorLabel.classList.add('active');
                keyStave.classList.add('active');
                // if ( che)
            }

            if (minorKeys[index] === Choir.noteSheetKey) {
                minorLabel.classList.add('active');
                keyStave.classList.add('active');
                // if ( che)
            }

            keySelectContainer.appendChild(keyStave);
            keyStave.appendChild(keyDropdownItem);


            this.drawMiniStave(keyStave, majorKey, accidentalNumber);

            this.keySetItems.push(majorLabel);
            this.keySetItems.push(minorLabel);
            this.keySetItems.push(keyStave);


        });

        return keySelectContainer;

    }



    drawMiniStave(miniStave, key, accidentalNumber) {
        const renderer = new Renderer(miniStave, Renderer.Backends.SVG);
        const scaleFactor = 0.5;
        if (accidentalNumber === 0) accidentalNumber = 1;
        renderer.resize(135 * scaleFactor, 80 * scaleFactor);

        const context = renderer.getContext();
        context.scale(scaleFactor, scaleFactor);

        const stave = new Stave(0, -20, 133);
        stave.addClef('treble');
        stave.setKeySignature(key);
        stave.setContext(context).draw();
    }


    setKey() {
        this.getKeyScale();
        this.keyDisplay = Choir.noteSheetKey[0].toUpperCase();
        if (Choir.noteSheetKey.length > 1) {
            this.keyDisplay += Choir.noteSheetKey[1].replace("#", "&sharp;").replace("b", "&flat;");
        }
        this.keyDisplay += " " + Choir.scaleType;
        this.keyDropdownButton.innerHTML = "<b>" + this.keyDisplay + " &#x23F7;</b>";
    }



    getKeyScale() {
        const character = Choir.noteSheetKey[0];
        if (character ===
            character.toUpperCase()) {
            Choir.scaleType = 'Major';
        } else if (character ===
            character.toLowerCase()) {
            Choir.scaleType = 'Minor';
        }
    }


}