# Choir.JS

**Choir.js** is a **music composition assistant** designed for **inspiration** and **education**. The core feature is **automatic note generation**,  e.g., useful for adding a voice to a short musical passage. Choir.js visualizes the notes in simple musical scores and can play them back.

Choir.js itself **does not understand** chord progression or harmony. Instead, a good melody already inherently encodes them to some extent, though not in a unique way. By defining scales and vertical interval-relations between voices (and the addition of randomness), Choir.js can produce countless harmonizing (or intentionally disharmonizing) accompaniments.

**It's your job** to figure out how to tweak scales and intervals to create pleasing musical passages. You decide what sounds good. You are the composer, and Choir.js is only your inspiring little assistant implementing your rules.

[Start Choir.js](https://smilster.github.io/Choir.js)

I recommend to start with the **tutorial** provided in the bottom-left corner of the interface.

## Features
- Manual note editing (text input with simple syntax)
- Random rhythm generation
- Automated voiced generation
- Scale and key visualization
- Voice range setting
- Audio playback with different instruments
- Multi-channel mixer (fade, pan, solo, mute)
- Tutorial 



## Crating a Composition

#### 1. You can begin in several ways
- Define a musical scale or mode and generate a random melody.
- Input your own melody.
- Input the root notes of a chord progression.


#### 2. Add more voices
- Refine inter-voice relations, change instruments, adjust volume and panning, change playback speed, experiment with scales.
- Explore how all of this impacts the perception of harmony and musical expression. 


## Code Design
Choir.js focuses on providing a simple graphical interface with audio feedback for automated note generation. At the current stage, the underlying routines unfortunately depend on the GUI modules. Nonetheless, many code segments are designed for reuse. For example, take a look at `NoteGenerator.js` if you are interested in the core algorithm behind note generation.

Score visualizing uses [VexFlow](https://www.vexflow.com/).
Audio playback employs [Tone.js](https://tonejs.github.io/).

## What Choir.js is not
- It's not a DAW.
- It's not a fancy live performance looping gadget.
- It's not a music notation software.
- It's not an AI black box for music generation. 


