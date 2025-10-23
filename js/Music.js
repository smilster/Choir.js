class Music {


    static getScale(scaleType, root) {
        let scale = allScales[scaleTypeList.indexOf(scaleType)] || allScales[0]; // Default to major if scaleType is not found
        return Music.extendScale(scale, root, 3);
    }

    static extendScale(scale, root, octaveCount) {
        let result = [];
        for(let i = -octaveCount; i < octaveCount; i++){
            for(let note of scale){
                result.push(note + (i*12) + root);
            }
        }
        return result;
    }


    static getAccidentals(key) {
        let accidentals = [];

        key = Music.enharmonicDur(key)

        if ( keyDurUp.includes(key) ) {
            accidentals = accidentalSharp.slice(0,keyDurUp.indexOf(key));
        }

        if ( keyDurDown.includes(key) ) {
            accidentals = accidentalFlat.slice(0,keyDurDown.indexOf(key));
        }

        return accidentals;

    }
    static enharmonicReplace (pitchClass,key) {
        let toFlat = chromaticFlat[chromaticSharp.indexOf(pitchClass)];

        let toSharp = chromaticSharp[chromaticFlat.indexOf(pitchClass)];

        let accidentals = Music.getAccidentals(key);

        if          ( accidentals.includes(toFlat)  ) {
            return toFlat;
        } else if   ( accidentals.includes(toSharp) ) {
            return toSharp;

        } else {
            return pitchClass;
        }
    }

    // static enharmonicDur(pitchClass) {
    //     const pitchMap = {
    //         // "H": "B",
    //         // "Hb": "Bb",
    //         // "h": "b", -> "D"
    //         // "hb": "bb", -> "Db"
    //
    //         "a#": "bb",
    //         "a": "C",
    //         "e": "G",
    //         "b": "D",
    //         "f#": "A",
    //         "c#": "E",
    //         "g#": "B",
    //         "d#": "F#",
    //         "d": "F",
    //         "g": "Bb",
    //         "c": "Eb",
    //         "f": "Ab",
    //         "bb": "Db",
    //         "eb": "Gb"
    //     };
    //
    //     return pitchMap[pitchClass] || pitchClass;
    // }

    static enharmonicDur(pitchClass) {



        if (pitchClass == "H") {
            pitchClass = "B"
        };
        if (pitchClass == "Hb") {
            pitchClass = "Bb"
        };
        if (pitchClass == "h") {
            pitchClass = "b"
        };
        if (pitchClass == "hb") {
            pitchClass = "bb"
        };
        if (pitchClass == "a#") {
            pitchClass = "bb"
        };

        if (pitchClass == "a") {
            pitchClass = "C"
        };
        if (pitchClass == "e") {
            pitchClass = "G"
        };
        if (pitchClass == "b") {
            pitchClass = "D"
        };
        if (pitchClass == "f#") {
            pitchClass = "A"
        };
        if (pitchClass == "c#") {
            pitchClass = "E"
        };
        if (pitchClass == "g#") {
            pitchClass = "B"
        };
        if (pitchClass == "d#") {
            pitchClass = "F#"
        };

        if (pitchClass == "d") {
            pitchClass = "F"
        };
        if (pitchClass == "g") {
            pitchClass = "Bb"
        };
        if (pitchClass == "c") {
            pitchClass = "Eb"
        };
        if (pitchClass == "f") {
            pitchClass = "Ab"
        };
        if (pitchClass == "bb") {
            pitchClass = "Db"
        };
        if (pitchClass == "eb") {
            pitchClass = "Gb"
        };

        return pitchClass;

    }



}





const chromaticSharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const chromaticFlat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];


const keyDurUp = ["C", "G", "D", "A", "E", "B", "F#", "C#"];
const keyDurDown = ["C", "F", "Bb", "Eb", "Ab", "Db", "Gb", "Cb"];

const allNotes = ["A", "A#", "Ab", "B", "B#", "Bb", "C", "C#", "Cb", "D", "D#", "Db", "E", "E#","Eb", "F", "F#", "Fb", "G", "G#", "Gb"];



// quintenzirkel

const accidentalSharp     = [      "F#", "C#", "G#", "D#", "A#", "E#", "B#" ];


const accidentalFlat   = [      "Bb", "Eb", "Ab", "Db", "Gb", "Cb", "Fb" ];





const scaleTypeList = [];
const allScales = [];

scaleTypeList.push("Major");
allScales.push([0, 2, 4, 5, 7, 9, 11 ]);

scaleTypeList.push("Major Harmonic");
allScales.push([0, 2, 4, 5, 7, 8, 11 ]);

scaleTypeList.push("Major Pentatonic");
allScales.push([0,2,4,7,9]);


scaleTypeList.push("Major Triad");
allScales.push([0, 4, 7]);

scaleTypeList.push("Major Seventh");
allScales.push([0, 4, 7, 11]);


scaleTypeList.push("Minor");
allScales.push([0, 2, 3, 5, 7, 8, 10 ]);


scaleTypeList.push("Minor Harmonic");
allScales.push([0, 2, 3, 5, 7, 8, 11 ]);

scaleTypeList.push("Minor Pentatonic");
allScales.push([0,3,5,7,10]);

scaleTypeList.push("Minor Triad");
allScales.push([0, 3, 7]);

scaleTypeList.push("Minor Seventh");
allScales.push([0, 3, 7, 10]);


scaleTypeList.push("Altered dominant");
// allScales.push([0,1,2,3,5,7,9]);
allScales.push([0, 1, 3, 4, 6, 8, 10 ]);

scaleTypeList.push("Harmonic");
allScales.push([0,3,4,5,7,9]);




scaleTypeList.push("Blues");
allScales.push([0,3,5,6,7,10]);

scaleTypeList.push("Bebop Major");
allScales.push([0,2,4,5,7,8,9,11]);

scaleTypeList.push("Bebop Dominant");
allScales.push([0,2,4,5,7,9,10,11]);



scaleTypeList.push("Phrygian");
// allScales.push([0,1,4,5,7, 8, 10]);
allScales.push([0, 2, 4, 5, 8, 9, 11]);
// allScales.push([0, 2, 4,5,8,9,11]);
// allScales.push([0,2,4,5,8,9,11, 12]);

// allScales.push([0, 1, 4, 5, 7, 8, 10 ]);

scaleTypeList.push("Double Harmonic");
allScales.push([0,1,4,5,7, 8, 11])

scaleTypeList.push("Hungarian Minor");
allScales.push([0, 2, 3, 6, 7, 8, 11 ]);



// scaleTypeList.push("Octaves");
// allScales.push([0]);
// 
// scaleTypeList.push("Tritones");
// allScales.push([0, 6]);
// 
// scaleTypeList.push("Major Thirds");
// allScales.push([0,4,8]);
// 
// scaleTypeList.push("Minor Thirds");
// allScales.push([0,3,6,9]);
// 
// scaleTypeList.push("Major Seconds");
// allScales.push([0,2,4,6,8,10]);

scaleTypeList.push("Chromatic");
allScales.push([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);

