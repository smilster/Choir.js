# Choir.js

**Choir.js** is a **music composition assistant** designed for **inspiration** and **education**. The core feature is **automatic note generation**,  e.g., useful for adding a voice to a short musical passage. Choir.js visualizes the notes in simple musical scores and can play them back.

Choir.js itself **does not understand** chord progression or harmony. Instead, a good melody already inherently encodes them to some extent, though not in a unique way. By defining scales and vertical interval-relations between voices (and the addition of randomness), Choir.js can produce countless harmonizing (or intentionally disharmonizing) accompaniments.

**It's your job** to figure out how to tweak scales and intervals to create pleasing musical passages. You decide what sounds good. You are the composer, and Choir.js is only your inspiring little assistant implementing your rules.

### [Start Choir.js](https://smilster.github.io/Choir.js)



### Tutorial Demo
Learn how to setup up a voice for note generation.
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

Score visualizing uses [VexFlow 4.2.2](https://www.vexflow.com/).
Audio playback employs [Tone.js 15.0.4](https://tonejs.github.io/).

### Run Locally

If you want to run Choir.js locally, you must launch a simple server, e.g.,

`python -m RangeHTTPServer` or `python -m SimpleHTTPServer`

in the root folder, since the browser usually restrict access to externally linked samples. This is achieved through `baseUrl = document.location` in `samples/Instrument.js`, which should work for most online hosted cases. For hosting locally, you might have to change to `window.location.origin`, or hard code the `baseUrl` path and directly open `index.html` with your browser without the need to launch a server.

### Sample References
Samples stored in `samples/external` are taken from https://github.com/nbrosowsky/tonejs-instruments. A copy of the reference list is stored in `samples/sample-source-info.txt`. Samples stored in `samples/mine` were recorded by me. Feel free to use them without restrictions.



### Theory - Note Generation

The following algorithm is used to generate the notes (denoted as melody below) for a **voice** $i$.  For this method, all other voices $j \neq i$ are already defined. For simplicity, we neglect rest notes and allow only a single *preferred interval* per voice pair.

In general, the algorithm is a Markov chain, for which the pitch probabilities depend on the voice's own previous pitch, and the pitches of all other voices played at the time position the note is generated.


| Symbol | Meaning                              |
|:-------|:-------------------------------------|
| $\mathcal{N}$ | Melody / sequence of notes           |
| $\mathcal{C}$ | Note candidates                      |
| $\mathcal{I}$ | **Interval matrix**                  |
| $p$ | Probability                          |
| $U$ | Potential                            |
| $D$ | **Disjunction**                      |
| $\kappa$ | Jump penalty                         |
| $K$ | **Voice coupling**                   |
| $i, j$ | Voice IDs                            |
| $k$ | Note index in sequence $\mathcal{N}$ |
| $l$ | Index of pitch candidate             |

#### Melody
A melody is a sequence of notes. Each note is defined by a **pitch** and duration. Let's assume all durations are already known (or chosen randomly), and only describe the generation of $\mathcal{N}_ i$, the sequence of pitches for voice $i$. The pitch for each note is an integer corresponding to a MIDI key value. 

#### Pitch Candidates

Pitch candidates, $\mathcal{C}_{il}$, are pitches (also encoded as MIDI values). They usually belong to a **scale or mode** within a given pitch/voice range, but may also be chosen arbitrarily. Only pitches belonging to $\mathcal{C}_i$ will be considered in the generation.

#### Interval Matrix

The **Interval Matrix** $\mathcal{I}_ {ij}$ defines a vertical distance measured in semitones (one semitone $\hat= 1$) between voices $i$ and $j$. The distances can also be negative and the interval matrix is symmetric, i.e.,  $\mathcal{I}_ {ij} = -\mathcal{I}_ {ji}$. Note that, in general, $\mathcal{I}$ is a tensor with each element $\mathcal{I}_{ij}$ storing a vector of multiple distances. 

#### Probability

The probability $p_{ilk}$ to choose the pitch from $\mathcal{C}_ {il}$ for $\mathcal{N}_{ik}$ is defined as

$$\large
p_{ilk} = \dfrac{ \exp\left(-\frac{U_{ilk}}{D}\right)}{\sum_l \exp\left(-\frac{U_{ilk}}{D}\right)}.
$$

with $U_{ilk}$, the potential of pitch candidate $l$ for note $k$ in voice $i$, and **disjunction** $D$.


#### Potential

The potential $U_{ilk}$ contains two contributions,

$$\large
U_{ilk} = U_{ik}^{\small \text{self}} + U_{ilk}^{\small \text{coupling}}.
$$

The first term is the *self-coupling*, which adds an increasing penalty the larger the interval jump. This is achieved through a harmonic potential, reading 

$$\large
U_{ik}^{\small \text{self}} = \kappa \left(\mathcal{N}_ {k-1} - \mathcal{C}_{il} \right)^2,
$$

with jump penalty $\kappa \ge 0$. The second term defines the coupling to other voices $j\neq i$, which adds a reward, if the interval $\mathcal{N}_ j(t_k) - \mathcal{C}_ {il}$ equals $\mathcal{I_{ij}}$. It reads

$$\large
U_{ilk}^{\small \text{coupling}} = - K \sum_{j \ne i} \delta \left[\left(\mathcal{N}_ {jk'}  - \mathcal{C}_ {il}\right) -  \mathcal{I}_{ij}\right],
$$

where $K \ge 0$ is the **voice coupling** reward, and $k'$ the index of note currently played by voice $j$. Note that $k$ and $k'$ usually differ due to different rhythmic patterns of the voices.

