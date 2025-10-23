class Interval {
    constructor() {
        this.panel = this.createPanel();
        this.tbody;
        this.matrix = [];

        Help.attachTooltip(this.panel,`The <i>Interval Matrix</i> defines vertical relations between voices. Picked intervals (semitones) are preferred and the strength of coupling is controlled by <i>Voice Coupling</i> and <i>Disjunction</i>, and further limited by individual voice's <i>Scale</i> and note <i>Range</i>.<br><br><b>Example</b><br>
    <img src="img/matrixExample.png" width="60%"></img><br><br>
    Here, <b>Anton</b> prefers to be <b>3 and 4 semitones above Bolle</b> when notes are generated for Anton. Reciprocally, if notes are generated for Bolle, 3 and 4 semitones below Anton's current notes will be favored.    
    `,'right');


    }


    createPanel() {
        // === Outer subsection ===
        const panel = document.createElement('subsection');
        panel.id = 'matrixTooltip';
        panel.setAttribute('data-bs-placement', 'top');

        // --- Outer max-width container ---
        const outerDiv = document.createElement('div');
        outerDiv.className = 'maxW';

        // --- Header row (button + spacer) ---
        const headerDiv = document.createElement('div');
        headerDiv.className = 'maxW';
        headerDiv.style.display = 'flex';
        headerDiv.style.justifyContent = 'center';

        const headerButton = document.createElement('button');
        headerButton.className = 'btn btn-secondary mb-2';
        headerButton.disabled = true;
        headerButton.style.width = '140px';
        headerButton.style.fontWeight = 'bold';
        headerButton.textContent = 'Interval Matrix';

        const flexSpacer = createFlexGrow();

        headerDiv.append(headerButton, flexSpacer);

        // --- Spacer below header ---

        // --- Table section ---
        const table = document.createElement('table');
        table.id = 'intervalMatrixTable';

        this.attachEventListener(table)


        const tbody = document.createElement('tbody');
        tbody.className = 'myTbody';
        this.tbody = tbody;

        table.appendChild(tbody);

        // --- Combine everything ---
        outerDiv.append(headerDiv, table);
        panel.appendChild(outerDiv);

        return panel;
    }


    updateMatrix() {
        const voices = Choir.voices;

        const tbody = this.tbody;
        tbody.innerHTML = "";

        voices.forEach((voice, i) => {
            if (!this.matrix[i]) {
                this.matrix[i] = []
            }

            let row = document.createElement("tr");
            voices.forEach((_, j) => {
                if (!this.matrix[i][j]) {
                    this.matrix[i][j] = [];
                }
                let cell = document.createElement("td");

                cell.classList.add('myTD');
                if (i === j) {
                    cell.classList.add("diagonal");


                    let nameLabel = document.createElement('div');
                    nameLabel.className = 'text-primary border border-primary rounded d-flex';
                    nameLabel.style = 'width: 96px; height: 38px; font-weight: bold;  display: flex;  justify-content: center; align-items: center;';

                    nameLabel.textContent = voice.name;
                    cell.appendChild(nameLabel);
                    voice.intervalMatrixNameLabel = nameLabel;


                } else if (j < i) {
                    cell.innerHTML = ""
                } else {
                    let textarea = document.createElement("input");
                    textarea.classList.add('matrix-input');
                    textarea.setAttribute("type", "text")
                    textarea.setAttribute("id", "textarea-" + String(i) + "-" + String(j));
                    textarea.classList.add("form-control", "bg-light");
                    textarea.style.margin = "1px";
                    textarea.style.width = "96px";
                    textarea.row = i;
                    textarea.col = j;
                    textarea.spellcheck = false;
                    textarea.value = this.matrix[i][j].join(" ");

                    cell.appendChild(textarea);
                }
                row.appendChild(cell);
            });
            tbody.appendChild(row);
        });


    }

    attachEventListener(div) {
        div.addEventListener('input', (event) => {
            const matrixInput = event.target.closest('.matrix-input');
            const row = matrixInput.row;
            const col = matrixInput.col;
            let correctInterval = this.cleanInterval(event.target.value);

            const matrixValues = correctInterval.trim().split(" ");


            this.matrix[row][col] = [];
            this.matrix[col][row] = [];

            if (matrixValues.length > 0) {
                matrixValues.forEach((interval) => {
                    if (interval !== '') {
                        this.matrix[row][col].push(parseInt(interval));
                        this.matrix[col][row].push(-parseInt(interval));
                    }
                })
            }

            event.target.value = correctInterval;
        })
    }


    cleanInterval(intervalString) {
        let correctInterval = intervalString.replace(/[^0-9\-\s]/g, '')    // keep only digits, +, -, and spaces
            .replace(/(\d)[+]/g, '$1 +')    // remove + or - after a digit
            .replace(/(\d)[-]/g, '$1 -')    // remove + or - after a digit
            .replace(/\-\-/g, '-')        // remove + or - followed by space
            .replace(/[-]\s+/g, ' ')        // remove + or - followed by space
            .replace(/\s0(\d)/g, ' $1')        // replace space followed by zero and number with space and number
            .replace(/\s+/g, ' ')           // normalize multiple spaces
            .replace(/^\s/g, '');

        return correctInterval;

    }


    removeRowAndColumn(matrix, rowIndex, columnIndex) {
        if (rowIndex >= 0 && rowIndex < matrix.length) {
            matrix.splice(rowIndex, 1);
        }

        for (let i = 0; i < matrix.length; i++) {
            if (columnIndex >= 0 && columnIndex < matrix[i].length) {
                matrix[i].splice(columnIndex, 1);
            }
        }
        return matrix;
    }

    removeVoiceFromMatrix(voice) {
        this.matrix = this.removeRowAndColumn(this.matrix, voice.tabId, voice.tabId);
    }

}