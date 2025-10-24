class NoteGenerator {


    /**
     * Maps integer values to duration strings, see {@link encodeDuration}
     * @type {{4: string, 8: string, 16: string, 32: string, 64: string, 128: string, 256: string, 512: string, 6: string, 12: string, 24: string, 48: string, 96: string, 192: string, 384: string, 768: string, 9: string, 18: string, 36: string, 72: string, 144: string, 288: string, 576: string, 1152: string}}
     */
    static durationMap = {
        // triad
        4: "128t", 8: "64t", 16: "32t", 32: "16t", 64: "8t", 128: "4t", 256: "2t", 512: "1t",

        // standard
        6: "128", 12: "64", 24: "32", 48: "16", 96: "8", 192: "4", 384: "2", 768: "1",

        //dotted
        9: "128d", 18: "64d", 36: "32d", 72: "16d", 144: "8d", 288: "4d", 576: "2d", 1152: "1d"
    };

    /**
     * Converts a single duration expressed as numerical value to duration strings accounting for triplets and dotted notes. The numerical durations counts in (4/4) measures, i.e., duration=1 corresponds to one measure of 4 quarter notes.  And alos 0.25 corresponds to one quarter note. If the smallest allowed duration is 128th note, the multiplication of the numerical duration by 768 provides an integer mapping defined by {@link durationMap} to
     * @param {number} duration
     * @returns {string} - duration string readable by {@link NoteParser}
     */
    static encodeDuration(duration) {
        return this.durationMap[Math.round(768 * duration)]
    }





    /**
     * Generates melody for input voice. Needs refactoring.
     * @param {Voice} voice
     */
    static generateMelody(voice) {


        let rhythmLockId = voice.rhythmLockId

        if (rhythmLockId >= 0) {

        } else if (rhythmLockId === -1) {
            voice.noteString = this.generateRandomRhythm(voice.randomRhythmDurationInBeats / 4);

            NoteParser.parseNotes(voice);
            voice.correctNoteInput();

            NoteParser.updateMaxDuration(Choir.voices);


            voice.noteString = voice.noteStringCorrected;
            voice.noteInput.value = voice.noteString;

            rhythmLockId = voice.tabId;
        }


        if (rhythmLockId !== -2) {

            let time = 0;
            let currentNotes = [];
            let currentIndex = [];

            let notes = [];
            let durations = [];
            let note = null;
            let duration;


            let noteString = "";


            //


            voice.scale = Music.getScale(voice.scaleType, voice.root)
            voice.noteCandidates = this.getCandidates(voice.scale, voice.voiceRangeMidi);


            const allTimes = [];
            Choir.voices.forEach(voice => {
                const times = [];
                voice.notes.forEach((note) => {
                    times.push(note.time + note.duration);
                })

                allTimes.push(times);
            })


            // refactor parts of this loop to something like getRhythm()
            while (time < NoteParser.maxTotalDuration) {
                currentNotes = [];
                currentIndex = [];
                for (let i = 0; i < Choir.voiceNumber; i++) {

                    currentIndex[i] = this.findSmallestLarger(allTimes[i], time);
                    if (i !== voice.tabId) {
                        currentNotes[i] = Tone.Frequency(Choir.voices[i].notes[currentIndex[i]].toneKey).toMidi();
                    } else {
                        currentNotes[i] = null
                    }
                }
                note = NoteGenerator.calculateNote(note, currentNotes, Choir.interval.matrix, voice.noteCandidates, Choir.getTabId(voice.id), voice.disjunction, voice.voiceCoupling)


                duration = Choir.voices[rhythmLockId].notes[currentIndex[rhythmLockId]].duration;
                notes.push(note);
                time += duration;


                durations.push(this.encodeDuration(duration));


            }


            // perhaps move following lines to NoteParser
            for (let i = 0; i < notes.length; i++) {
                let pitch = Tone.Frequency(notes[i], 'midi').toNote().split('');

                let octave = pitch.pop();
                let key = pitch.join('');
                let duration = durations[i];

                if (Choir.voices[rhythmLockId].notes[i].type === "r") {
                    noteString += "." + duration + " ";
                } else {
                    noteString += key + octave + "." + duration + " ";
                }

            }

            voice.noteStringCorrected = noteString;
            voice.correctNoteInput();


        }
    }


    /**
     * Return an array of notes (MIDI values) based on a scale within a voice range, a number array with two MIDI
     * values corresponding to minimum and maximum
     * @param {integer[]}scale
     * @param {integer[]} voiceRangeMidi
     * @returns {integer[]}
     */
    static getCandidates(scale, voiceRangeMidi) {
        let noteCandidates = [];

        for (let i = 0; i < scale.length; i++) {
            if (scale[i] >= voiceRangeMidi[0] && scale[i] <= voiceRangeMidi[1]) {
                noteCandidates.push(scale[i]);
            }
        }
        return noteCandidates;
    }


    /**
     * calculates note based on a probabilistic routine that defines gaining and penalty potentials for note
     * canditates based on the (semitone) values of the interval matrix and distances to other voice's notes and own
     * previous note
     *
     * absolute values correspond to midi values
     * relative values (semitone differences) are identical with differences in MIDI notation
     *
     * needs a splitting of subroutines into smaller methods
     *
     * @param {integer} ownPreviousNote
     * @param {integer[]}currentNotes
     * @param {integer[][]}intervalMatrix
     * @param {integer[]}noteCandidates
     * @param {integer} tabId
     * @param {number} disjunction
     * @param {integer} voiceLock
     * @returns {integer}
     */
    static calculateNote(
        ownPreviousNote,
        currentNotes,
        intervalMatrix,
        noteCandidates,
        tabId,
        disjunction,
        voiceLock
    ) {

        if (ownPreviousNote === null) {
            ownPreviousNote = noteCandidates[Math.floor(noteCandidates.length * Math.random())];
        }

        const potentials = [];
        const probabilities = [];

        for (let i = 0; i < noteCandidates.length; i++) {

            potentials.push(5 * Math.pow(noteCandidates[i] - ownPreviousNote, 2));

            for (let j = 0; j < currentNotes.length; j++) {

                if (j !== tabId) {
                    if (intervalMatrix[tabId] && intervalMatrix[tabId][j]) {
                        const intervals = intervalMatrix[tabId][j];
                        for (let k = 0; k < intervals.length; k++) {
                            if (currentNotes[j] + parseFloat(intervals[k]) === noteCandidates[i]) {

                                potentials[i] -= voiceLock;
                            }
                        }
                    }
                }
            }


            let probability = Math.exp(-potentials[i] / disjunction);
            probability = Math.min(probability, 10 ^ 100); // cut probability at large values
            probabilities.push(probability);

        }


        // new
        let cumSumProbabilities = this.cumSum(probabilities);
        const sumProbabilities = cumSumProbabilities[cumSumProbabilities.length - 1];
        for (let i = 0; i < cumSumProbabilities.length; i++) {
            cumSumProbabilities[i] = cumSumProbabilities[i] / sumProbabilities;
        }

        const noteIndex = this.findSmallestLarger(cumSumProbabilities, Math.random());
        return noteCandidates[noteIndex];


    }


    static generateRandomRhythm(duration) {

        const rhythmCandidates = [];
        for (let i = 0; i < 4; i++) {

            let j = Math.pow(2, i)
            for (let k = 0; k < j; k++) {
                rhythmCandidates.push(j);
            }
        }

        let rhythmString = '';
        let cumLength = 0;
        let noteLength = 0;
        let maxLength = duration;

        while (cumLength !== maxLength) {

            noteLength = 1 / (rhythmCandidates[Math.floor(rhythmCandidates.length * Math.random())]);

            if ((cumLength + noteLength) <= maxLength) {
                cumLength += noteLength;
                rhythmString += "c." + String(Math.round(1 / noteLength)) + " "

            }
        }

        return rhythmString;
    }


    /**
     *
     * returns index of the largest array entry that is smaller to probeValue
     * used to find current event in sequence or index of probability
     * @info
     * usually used together with {@link cumSum}
     * <pre>
     * example I:
     * if sequence durations are [ 1 2 1 3 ]
     * cumulated durations will be [1 3 4 7]
     * if probeValue is 3.5, returned index is 2, i.e. event with index 2 is active
     * </pre>
     * <pre>
     * example II:
     * if normalized probabilities are [0.25 0.25 0.5]
     * cumulated probabilities will be [0.25 0.5 1.0]
     * if random number generates 0.3, event with index 1 was chosen
     * </pre>
     * @param sortedArray
     * @param probeValue
     * @returns {number|null}
     */
    static findSmallestLarger(sortedArray, probeValue) {
        /**
         * current smallestLarger value
         * @type {number}
         */
        let smallestLarger = Infinity;

        /**
         * set return index to -1, if no value is found
         * usually throws error if someArray[-1] is called
         * @type {number}
         */

        let smallestLargerIndex = -1;

        for (let i = 0; i < sortedArray.length; i++) {
            if (sortedArray[i] > probeValue) { // Only check if larger first
                if (sortedArray[i] < smallestLarger) {

                    smallestLarger = sortedArray[i];
                    smallestLargerIndex = i;
                }
            }
        }

        if (smallestLargerIndex !== -1) {
            return smallestLargerIndex;
        } else {
            return null;
        }
    }

    /**
     * calculates cumulated values of an array. The return array has same size as inout array.
     * @param {number[]} array
     * @returns {number[]}
     */
    static cumSum(array) {
        const cumulativeSum = (sum => value => sum += value)(0);
        return array.map(cumulativeSum);
    }


}