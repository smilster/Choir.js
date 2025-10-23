class NoteParser {


    /**
     * global duration for all voices. it is updated by
     * {@link updateMaxDuration} yielding the duration of longest voice
     * @type {number}
     */

    static maxTotalDuration = 1;




    static parseNotes(voice) {
        this.parseNoteString(voice)
        this.calculateTimes(voice);
    }




    static createPlayEvents(voice, noteSheet) {


        const playEvents = []
        voice.notes.forEach((note,index) => {

            const beatRescale = 240 / Tone.Transport.bpm.value;


            const playEvent = {
                type: note.type,
                note: note.toneKey,
                duration: beatRescale * note.duration,
                time: beatRescale * note.time,
                staveNoteHead: noteSheet.getStaveNoteHead(voice.staveNotes[index]),
                staveNoteStem: noteSheet.getStaveNoteStem(voice.staveNotes[index]),
            }
            playEvents.push(playEvent);
        });

        voice.playEvents = playEvents;

    }



    static correctDurationString(duration) {
        const durationAllow = [128, 64, 32, 16, 8, 4, 2, 1];


        if (!duration) duration = "4";
        else {
            duration = duration.replace(/[^0-9drt]/g, "")
                .replace(/([drt])(\d+)/g, "$2$1")
                .replace(/(.)\1+/g, "$1");
            if (/d/.test(duration) && /t/.test(duration)) {
                const first = duration.indexOf('d') < duration.indexOf('t') ? 'd' : 't';
                const second = first === 'd' ? 't' : 'd';
                duration = duration.replace(new RegExp(second, 'g'), '');
            }
        }
        if (duration === '' || duration === 'd' || duration === 't')
            duration = (duration === 'd') ? "4d" : (duration === 't') ? "4t" : "4";
        if (!durationAllow.includes(Number(duration.replace(/[drt]/g, '')))) duration = "4";

        return duration;
    }

    static correctKeyString(key, noteSheetKey) {
        const keyRegex = /^([a-ghA-GH](?:#|b)?)$/;

        if (keyRegex.test(key) === false) {
            key = '';
        }

        if (key.length > 0) {
            const accidental = key.slice(1);
            key = key.charAt(0).toUpperCase() + accidental;
            key = Music.enharmonicReplace(key.replace("H", "B"), noteSheetKey);

        }
        return key.trim();
    }


    static correctOctaveString(octave, clef) {

        const octaveRegex = /^([0-9]?)$/;


        if (!octaveRegex.test(octave)) {
            octave = '';
        }

        if ((octave === '') || (typeof octave === 'undefined')) {
            if (clef === "treble") {
                return "4";
            } else if (clef === "bass") {
                return "3";
            }

        }

        return octave;
    }





    static parseNoteString(voice) {


        if (voice.noteString === "") {
            voice.totalDuration = 1;
            voice.noteString = ".1"
        }
        let {notes: notes, noteStringCorrected: noteStringCorrected} = this.generateNotesFromString(voice.noteString,voice.noteSheetKey,voice.clef);

        voice.notes = notes;
        voice.noteStringCorrected = noteStringCorrected;
        NoteParser.checkTriplets(voice);


    }

    /**
     * return note properties from noteString, e.g. 'C4.8'
     * returns {'C', '4', '8'}
     * @param noteStringItem
     * @returns {{key: *, octave: *, duration: *}}
     */

    static decodeNoteStringItem(noteStringItem){
        let [pitch, durationString] = noteStringItem.split('.');
        let octave = pitch.replace(/\D/g, '');
        let key = pitch.replace(/\d/g, '');




        return [key, octave, durationString ];
    }


    static generateNotesFromString(noteString,noteSheetKey,clef) {
        // Clean the input string (remove extra spaces), replace comma by dot
        noteString = noteString.replace(/\s+/g, ' ').replace(",", ".").trim();

        // Split the note string into individual note components
        let noteStringArray = noteString.split(' ');

        const notes = [];


        noteStringArray.forEach((noteStringItem, index) => {



            let [key, octave, durationString] = this.decodeNoteStringItem(noteStringItem);

            // let [pitch, durationString] = noteStringItem.split('.');
            // let octave = pitch.replace(/\D/g, '');
            // let key = pitch.replace(/\d/g, '');


            // handle keyString
            key = NoteParser.correctKeyString(key, noteSheetKey);
            // handle octaveString
            octave = NoteParser.correctOctaveString(octave, clef);
            // handle durationString
            durationString = NoteParser.correctDurationString(durationString);


            const note = this.generateNote(index, key, octave, durationString,);


            notes.push(note);
        });

        let noteStringCorrected = '';
        notes.forEach(note => {
            noteStringCorrected += note.stringCorrected + ' ';
        })

        return {notes, noteStringCorrected};
    }

    static generateNote( index, key, octave, durationString) {
        const duration = durationString.replace('d', '').replace('t', '');
        const note = {
            index: index,
            key: key === '' ? 'rest' : key,
            octave: octave,
            toneKey: key === '' ? null : key + octave,
            durationString: durationString.replace('t', ''),
            duration: 1 / parseFloat(duration),
            time: null,
            type: key === '' ? 'r' : 'n',
            isTriplet: durationString.includes('t'),
            isDotted: durationString.includes('d'),
            stringCorrected: (key === '' ? key : key + octave) + '.' + durationString,
            staveNoteHead: null,
            staveNoteStem: null,
        }

        if (note.isDotted) {

            note.duration = 1.5 * note.duration;
        }
        return note;
    }

    static calculateTimes(voice){
        // const beatRescale = 240 / Tone.Transport.bpm.value;

        let time = 0
        voice.notes.forEach((note) => {
            note.time = time;
            time += note.duration;
        })
       voice.totalDuration = Math.round(128 * time)/128;


    }

    static checkTriplets(voice) {

        let triplet = [];

        const notes = voice.notes;

        notes.forEach((note) => {


            if (note.isTriplet) {
                triplet.push(note);
            }
            if (triplet.length === 2) {
                if (triplet[0].duration !== triplet[1].duration) {
                    triplet[0].isTriplet = false;
                    triplet.splice(0, 1);
                }
            }

            if (triplet.length === 3) {
                if (triplet[0].duration !== triplet[2].duration) {
                    triplet[0].isTriplet = false;
                    triplet[1].isTriplet = false;
                    triplet.splice(0, 2);
                } else {
                    triplet[0].duration = triplet[0].duration * 0.6666;
                    triplet[1].duration = triplet[1].duration * 0.6667;
                    triplet[2].duration = triplet[2].duration * 0.6667;
                }

                triplet = [];
            }


        })

        if (triplet.length < 3) {
            triplet.forEach((note) => {
                note.isTriplet = false;
            });
        }


        voice.notes = notes;

    }





    static addRests(voice) {
        const desiredDuration = this.maxTotalDuration;
        let currentDuration = voice.totalDuration;

        if (desiredDuration === currentDuration) {
            return; // Return, nothing to do
        }


        let increment = 1;


        while (currentDuration < desiredDuration) {
            if ((currentDuration + increment) <= desiredDuration) {
                currentDuration += increment;
                voice.noteString += " ." + String(1 / increment);
                increment = 1;
            } else {
                increment = increment / 2;
            }
            if (desiredDuration === currentDuration) {
                break;
            }

            if (increment < 1/256) break;
        }

        this.parseNotes(voice);
        // let {}

    }




    static updateMaxDuration(voices) {

        const allTotalDurations = [];
        voices.forEach((voice, i) => {
            allTotalDurations.push(voice.totalDuration);
        });

        this.maxTotalDuration = Math.max(...allTotalDurations);


        voices.forEach(voice => {
                this.addRests(voice);
        })


    }


    // trim function
    static removeTailingRests(voices) {
       voices.forEach(voice => {
           const noteNumber = voice.notes.length;
           for (let j = noteNumber -1; j >= 0; j--) {
               if (voice.notes[j].type !== "r") {
                   break;
               } else {
                   voice.notes.pop();
               }
           }
           let noteString = '';
           voice.notes.forEach(note => {
               noteString += note.stringCorrected + ' ';
           })
           voice.noteStringCorrected = noteString;
           voice.correctNoteInput();
           NoteParser.parseNotes(voice);


       })

        NoteParser.updateMaxDuration(voices);

    }





}