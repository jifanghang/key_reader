# Key Reader

## Functionalities
* Collect MIDI signal from guitar and visualise on a virtual fretboard
* Generate dynamic heatmap

## Implementation
* Web app `html/css/js`
* Visualization done on `D3.js`
* Signal collection & processing with `Webmidijs`

## Files

### parser & metromome
Parse a midi stream and rewrite into csv files
By Prof. [Michael Seldmair](http://homepage.univie.ac.at/michael.sedlmair/)

<!-- ### midi2json -->
<!-- Converts mid files into json data - mostly *C* code -->
<!-- Forked from [pepperpepperpepper](https://github.com/pepperpepperpepper/midi-json) -->

## Setup localhost (mac os)
1. Open `Terminal`
2. Navigate to the folder (directory) containing the file you want to serve
3. `php -S localhost:8080`
4. Go to `http://localhost:8080` in the browser