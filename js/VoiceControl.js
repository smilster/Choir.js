class VoiceControl {
    constructor() {

        this.removeModel = this.createRemoveModal();
        this.removeModalTitle;

        this.navBar = this.createNavBar();
        this.tabContent = this.createTabContent();
        this.panel = this.createPanel();




    }


    createNavBar() {
        const navBar = document.createElement('ul');
        navBar.className = 'nav';
        navBar.id = 'myTabs';
        navBar.style = `
            display: none;
        `;
        return navBar;
    }

    createTabContent() {
        const tabContent = document.createElement('div');
        tabContent.className = 'tab-content';
        tabContent.id = 'tabContent';

        return tabContent;

    }

    createPanel() {

        const controlPanel = document.createElement('subsection');

        const contentWrapper = document.createElement('div');
        contentWrapper.style.width = '485px';
        contentWrapper.style.margin = '0px';

        const spacer = document.createElement('div');
        spacer.style.height = '1.15em';

        contentWrapper.appendChild(spacer);
        contentWrapper.appendChild(this.tabContent);
        controlPanel.appendChild(contentWrapper);


        return controlPanel;

    }


    createTabLink(voice) {
        const id = voice.id;

        const tabLink = document.createElement('a');
        tabLink.id = id;
        tabLink.href = '#tab' + id;
        tabLink.className = 'navnav btn btn-light btn-outline-secondary';
        tabLink.setAttribute('data-bs-toggle', 'tab');
        tabLink.setAttribute('data-index', id);
        tabLink.style = `  
            display: none;
        `;

        const tabLinkClick = function (event) {

            Choir.activateVoice(voice);
            event.stopPropagation();
        }

        tabLink.addEventListener('click', tabLinkClick);
        voice.storeEventListener(tabLink, 'click', tabLinkClick);


        return tabLink;

    }





    addVoiceControlTab(voice) {


        const tabLink = this.createTabLink(voice);
        voice.tabLink = tabLink;

        const voiceControlTab = new VoiceControlTab(voice);



        const voiceRemoveClick = function() {
            Choir.removeVoice(voice)
        }

        voiceControlTab.removeButton.addEventListener('click', voiceRemoveClick);
        voice.storeEventListener(voiceControlTab.removeButton, 'click', voiceRemoveClick);




        voice.tabPane = voiceControlTab.tabPane;

        this.navBar.appendChild(tabLink);
        this.tabContent.appendChild(voiceControlTab.tabPane);


    }


    updateAllRhythmSelectors() {
        Choir.voices.forEach(voice => {
            voice.rhythmSelector.updateRhythmSelector(Choir.voices);
        });
    }


    createRemoveModal() {
        // Main Modal Container
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'confirmModal';
        modal.tabIndex = -1;
        modal.role = 'dialog';

        // Modal Dialog
        const modalDialog = document.createElement('div');
        modalDialog.className = 'modal-dialog modal-dialog-centered modal-sm';

        // Modal Content
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';

        // Modal Header
        const modalHeader = document.createElement('div');
        modalHeader.className = 'modal-header';

        this.removeModalTitle = document.createElement('h5');
        this.removeModalTitle.className = 'modal-title';
        this.removeModalTitle.id = 'mtitle';


        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.className = 'btn-close';
        closeButton.dataset.bsDismiss = 'modal';

        modalHeader.appendChild(this.removeModalTitle);
        modalHeader.appendChild(closeButton);

        // Modal Body
        const modalBody = document.createElement('div');
        modalBody.className = 'modal-body text-center';

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'd-flex justify-content-center gap-3';

        const confirmYesButton = document.createElement('button');
        confirmYesButton.id = 'confirmYes';
        confirmYesButton.className = 'btn btn-outline-danger mx-auto';
        confirmYesButton.textContent = 'Remove';
        confirmYesButton.style.width = '80px';


        const confirmNoButton = document.createElement('button');
        confirmNoButton.id = 'confirmNo';
        confirmNoButton.className = 'btn btn-outline-success mx-auto';
        confirmNoButton.textContent = 'Keep';
        confirmNoButton.style.width = '80px';

        buttonContainer.appendChild(confirmYesButton);
        buttonContainer.appendChild(confirmNoButton);

        modalBody.appendChild(buttonContainer);

        // Assemble the structure
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modalDialog.appendChild(modalContent);
        modal.appendChild(modalDialog);

        document.body.appendChild(modal);

        return modal;
    }

    showConfirm(name) {
        this.removeModalTitle.textContent = 'Remove '  + name + '?';

        return new Promise((resolve) => {
            const modal = new bootstrap.Modal(this.removeModel);
            document.getElementById("confirmYes").onclick = () => {
                modal.hide();
                resolve(1); // Yes returns 1
            };

            document.getElementById("confirmNo").onclick = () => {
                modal.hide();
                resolve(0); // No returns 0
            };

            modal.show();
        });
    }

    askConfirmation(name) {

        return this.showConfirm(name); // Returns 1 (Yes) or 0 (No)
    }


}