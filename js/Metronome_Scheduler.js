/**
 * Created by MCL on 02.08.16.
 */


/**
 * I modified the following code-example: http://mohayonao.github.io/web-audio-scheduler/
 *
 */


var audioContext = new AudioContext();
var scheduler = new WebAudioScheduler({
    context: audioContext
});


// Boolean variable indicating if the prelude is over or nor
var preludeOver = false;
var preludeCounter = 0;


function metronome(e) {
    scheduler.insert(e.playbackTime + 0.000, ticktack, { frequency: 880, duration: 1.00 });
    scheduler.insert(e.playbackTime + beatDuration, ticktack, { frequency: 440, duration: 0.05 });
    scheduler.insert(e.playbackTime + beatDuration*2, ticktack, { frequency: 440, duration: 0.05 });
    scheduler.insert(e.playbackTime + beatDuration*3, ticktack, { frequency: 440, duration: 0.05 });

    scheduler.insert(e.playbackTime + beatDuration*4, metronome);
}

function ticktack(e) {
    preludeCounter++;
    console.log("preludeCounter", preludeCounter);
    if (preludeCounter==5){
        firstBeat = audioContext.currentTime;
        preludeOver = true;
        console.log("firstBeat", firstBeat);
    }
    var t0 = e.playbackTime;
    var t1 = t0 + e.args.duration;
    var osc = audioContext.createOscillator();
    var amp = audioContext.createGain();

    osc.frequency.value = e.args.frequency;
    osc.start(t0);
    osc.stop(t1);
    osc.connect(amp);

    amp.gain.setValueAtTime(0.5, t0);
    amp.gain.exponentialRampToValueAtTime(1e-6, t1);
    amp.connect(audioContext.destination);

    scheduler.nextTick(t1, function() {
        osc.disconnect();
        amp.disconnect();
    });
}

function start() {
    bpm = document.getElementById("bpm").value;
    beatsPerSecond = bpm/60;
    beatDuration = 1/beatsPerSecond;
    barDuration = beatDuration*4;
    scheduler.start(metronome);
}

function stop() {
    scheduler.stop(true);
}