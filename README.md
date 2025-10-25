# Choir.js

**Choir.js** is a **music composition assistant** designed for **inspiration** and **education**. The core feature is **automatic note generation**,  e.g., useful for adding a voice to a short musical passage. Choir.js visualizes the notes in simple musical scores and can play them back.

Choir.js itself **does not understand** chord progression or harmony. Instead, a good melody already inherently encodes them to some extent, though not in a unique way. By defining scales and vertical interval-relations between voices (and the addition of randomness), Choir.js can produce countless harmonizing (or intentionally disharmonizing) accompaniments.

**It's your job** to figure out how to tweak scales and intervals to create pleasing musical passages. You decide what sounds good. You are the composer, and Choir.js is only your inspiring little assistant implementing your rules.

### [Start Choir.js](https://smilster.github.io/Choir.js)



### Tutorial Demo
In the tutorial you will learn how to setup up voice for note generation.
<div align="center">
 <a href="https://smilster.github.io/Choir.js/videos/tutorial.mp4">
    <img alt="Tutorial Video" Demo src="https://smilster.github.io/Choir.js/videos/tutorial_thumb.png" width="350px"></img>
 </a>
</div>

### Random Demo
A random composition from scratch. Some rhythmic patterns were inserted manually. 
<div align="center">
 <a href="https://smilster.github.io/Choir.js/videos/random.mp4">
    <img alt="Random Composition Demo Video" src="https://smilster.github.io/Choir.js/videos/random_thumb.png" width="350px"></img>
 </a>
</div>

### Chord Progression Demo
Example of how to compose a four-chord progression with random voices.
<div align="center">
 <a href="https://smilster.github.io/Choir.js/videos/chord-progression.mp4">
    <img alt="Chord Progression Demo Video" src="https://smilster.github.io/Choir.js/videos/chord-progression_thumb.png" width="350px"></img>
 </a>
</div>


### Creating a Composition

#### 1. You can begin in several ways
- Define a musical scale or mode, set the range, and generate a random melody.
- Input your own melody.
- Input the root notes of a chord progression.


#### 2. Add more voices
- Refine inter-voice relations, change instruments, adjust volume and panning, change playback speed, experiment with scales.
- Explore how all of these impacts the perception of harmony and musical expression. 

### Features
- Manual note editing (text input with simple syntax)
- Random rhythm generation
- Automated voiced generation
- Scale and key visualization
- Voice range setting
- Audio playback with different instruments
- Multi-channel mixer (fade, pan, solo, mute)
- Tooltips
- Tutorial


### Code Design
Choir.js focuses on providing a simple graphical interface with audio feedback for automated note generation. At the current stage, the underlying routines unfortunately depend on the GUI modules. Nonetheless, many code segments are designed for reuse. For example, take a look at `NoteGenerator.js` if you are interested in the core algorithm behind note generation.

Score visualizing uses [VexFlow](https://www.vexflow.com/).
Audio playback employs [Tone.js](https://tonejs.github.io/).

### Run Locally

If you want to run Choir.js locally, you must launch a simple server, e.g.,

`python -m RangeHTTPServer` or `python -m SimpleHTTPServer`

in the root folder, since the browser usually restrict access to externally linked samples. This is achieved through through `baseUrl = document.location` in `samples/Instrument.js`, which should work for most testing cases. Alternatively, hard code the `baseUrl` path and directly open `index.html` with your browser without the need to launch a server.





