class Mixer {
    constructor() {
        this.panel = this.createPanel();
        this.channels = new Map();

        this.attachEventListener(this.panel);
        this.master = new Tone.Gain(0.5);
        this.master.toDestination();

        Help.attachTooltip(this.panel,"Click on top labels to <b>select voice</b> for editing tools on the r.h.s..<br><br> Use the <b>Mixer</b> to fade, pan, solo, mute your voices, or <b>change their instrument</b>.",'top');

    }


    createPanel() {
        const mixerPanel = document.createElement('subsection');
        mixerPanel.classList.add('d-flex');
        const mixer = document.createElement('div');
        mixer.className = 'mixer';
        mixer.id = 'mixer';
        mixer.style.display = 'flex';
        mixer.style.flexDirection = 'row';
        mixerPanel.appendChild(mixer);
        return mixerPanel;
    }

    addChannel(voice) {

        const channel = new Channel(voice,this.master);
        this.channels.set('channel' + channel.id, channel);
    }

    removeChannel(voice){
        this.channels.delete('channel' + voice.id);
    }



    updateMixer() {
        const mixer = this.panel;
        mixer.innerHTML = "";


        this.channels.forEach( (channel) => {
            mixer.appendChild(channel.panel);
        });



    }



    attachEventListener(div){


        const soloMuteToggler = function(event){

            const button = event.target.closest('button');

            if (button === null) {return;}
            if (button.classList === null){return;}
            if (button.classList.length ===0) {return;}


            if ( button.classList.contains('mute') || button.classList.contains('solo')) {


                const channelId = button.id.replace('mute', '').replace('solo', '');
                const channel = this.channels.get('channel' + channelId);

                if (button.classList.contains('mute')) {
                    this.toggleMute(channel);
                }

                if (button.classList.contains('solo')) {
                    this.toggleSolo(channel);
                }
            }
        }.bind(this);

        div.addEventListener('click', soloMuteToggler);

    }

    toggleMute(channel) {
        const channels = this.channels;
        if (!channel.muted) {
            channel.setMute();
            channel.setGain(channel.gain)
        } else {
            channels.forEach((channel) => {
                channel.unsetSolo()
            });
            channel.unsetMute();
            channels.forEach((channel) => {
                channel.setGain(channel.gain)
            });
        }
    }

    toggleSolo(channel) {
        const channels = this.channels;
        if (!channel.solo) {
            channels.forEach((channel) => {
                channel.setMute();
            });
            channel.unsetMute();
            channel.setSolo();
            channels.forEach((channel) => {
                channel.setGain(channel.gain);
            });

        } else {
            channel.unsetSolo();
            channels.forEach((channel) => {
                channel.unsetMute();
                channel.setGain(channel.gain);
            });
        }
    }



}