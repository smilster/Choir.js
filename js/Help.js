/**
 * Help creates Help section with tutorial and tooltip-toggler
 * it contains {@link attachTooltip} for simple tooltip adding syntax
 */


class Help {

    static tooltipElements = [];
    static tooltipsEnabled = false;
    static tooltipButton = null;
    static activeClass = 'btn-warning';
    static passiveClass = 'btn-outline-warning';

    static tutorialBody = null;
    static tutorialStartButton = null;
    static tutorialButton = null;

    static header = null;

    constructor() {
        this.panel = Help.createPanel();
        Help.tutorialPanel = Tutorial.startButton;
    }


    /**
     * ```
     * returns HTML div
     * ```
     * @returns {HTMLElement}
     *
     */

    static createPanel() {
        const panel = document.createElement('subsection');
        // panel.className = 'd-flex';
        this.header = this.createHeader();
        panel.appendChild(this.header);
        panel.appendChild(Tutorial.createPanel());

        this.panel = panel;
        return panel
    }


    static createHeader() {
        const header = document.createElement('div');
        header.className = 'd-flex';


        // Tutorial button
        const tutorialButton = document.createElement('a');
        tutorialButton.className = 'btn btn-warning';
        tutorialButton.dataset.bsToggle = 'collapse';
        tutorialButton.href = '#tutorial';
        tutorialButton.role = 'button';
        tutorialButton.style.cssText = 'width: 97px; font-weight: bold;';
        tutorialButton.innerHTML = 'Tutorial &#x23F7;';


        // tooltip toggler

        const tooltipButton = document.createElement('button');
        tooltipButton.id = 'toggle-tooltips  ';
        tooltipButton.className = 'btn btn-outline-warning ms-auto fw-bold ';
        tooltipButton.textContent = 'Toggle Tooltips';

        this.tooltipButton = tooltipButton;

        const buttonClick = function () {
            Help.tooltipsEnabled = !Help.tooltipsEnabled;
            if (Help.tooltipsEnabled) {
                tooltipButton.classList.remove(Help.passiveClass);
                tooltipButton.classList.add(Help.activeClass);
                Help.enableAllTooltips();
            } else {
                Help.disableAllTooltips();
                tooltipButton.classList.add(Help.passiveClass);
                tooltipButton.classList.remove(Help.activeClass);
            }
        }

        tooltipButton.addEventListener('click', buttonClick)

        header.appendChild(tutorialButton);
        header.appendChild(tooltipButton);

        return header;

    }





    // TOOLTIP HANDLING


    /**
     * <pre>
     * Attaches tooltip to existing DOM element
     * </pre>
     * @param div element for tooltip
     * @param tip string, showing as tooltip, simple HTML allowed
     * @param direction prefered direction of tooltip, 'left', 'right', 'bottom'. 'top' is default when omitted
     *
     */


    static attachTooltip(div, tip, direction) {
        // if ( div.tagName == "BUTTON" ) {
        //     div.disabled = false;
        // }

        if (typeof direction === 'undefined') {
            direction = 'top';
        }
        div.setAttribute('data-bs-placement', direction);
        div.setAttribute("data-bs-toggle", "tooltip");
        div.setAttribute("data-bs-html", "true");
        div.setAttribute("title", tip);


        const tooltip = new bootstrap.Tooltip(div);
        if (!this.tooltipsEnabled) {
            this.disableTooltip(div);
        }

        div.addEventListener('click', () => {
            tooltip.hide();
        })

        this.tooltipElements.push(div);
    }

    /**
     *
     * iterate through {@link this.tooltipElements} and DISABLE their tooltips
     *
     */

    static disableAllTooltips() {
        this.tooltipElements.forEach((tooltipDiv) => {
            this.disableTooltip(tooltipDiv);
        })
    }

    /**
     * hide and disable tooltip for given HTML element
     * @param tooltipDiv
     */
    static disableTooltip(tooltipDiv) {
        const tooltipInstance = bootstrap.Tooltip.getInstance(tooltipDiv);
        if (tooltipInstance !== null) {
            tooltipInstance.hide();
            tooltipInstance.disable();

        }
    }

    /**
     * iterate through {@link tooltipElements} and ENABLE their tooltips
     */


    static enableAllTooltips() {
        this.tooltipElements.forEach((tooltipDiv) => {
            this.enableTooltip(tooltipDiv);
        })
    }


    /**
     * enable tooltip for given HTML element
     * @param tooltipDiv
     */
    static enableTooltip(tooltipDiv) {
        const tooltipInstance = bootstrap.Tooltip.getInstance(tooltipDiv);
        if (tooltipInstance !== null) {
            tooltipInstance._config.trigger = "hover focus";
            tooltipInstance._config.delay = { "show": 0, "hide": 100  };

            tooltipInstance.enable();
        }
    }

     static showTooltip(tooltipDiv) {
        const tooltipInstance = bootstrap.Tooltip.getInstance(tooltipDiv);
        if (tooltipInstance !== null) {
            tooltipInstance._config.trigger = "manual";
            tooltipInstance._config.delay = { "show": 1000, "hide": 99999999  };
                tooltipInstance.enable();
                tooltipInstance.toggle();
            }
    }




}