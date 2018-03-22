
// Array where all MIDI sessions are saved
var sessions = [];

// Metronome Tempo
var bpm = document.getElementById("bpm").value;
var beatsPerSecond = bpm/60;
var beatDuration = 1/beatsPerSecond;
var barDuration = beatDuration*4;

var firstBeat;


// Array with all notes information
var notesOn;
var notesOff;

// Array with filtered notes information
var filteredNotes;

// Array with chords information
var chords;

// counter for notes-array positions
var notesOnCount = 0;
var notesOffCount = 0;

// Statistics about each String
var stats,
    stats_E,
    stats_A,
    stats_d,
    stats_g,
    stats_b,
    stats_e;

var maxString;

var barreChords;

var sessionSaved = false,
    recording = false;

var csvHeader = new Array("id", "channel", "note", "receivedTime", "velocity");
var csvHeader2 = new Array("session_id", "noteNumber", "note", "string", "velocity", "receivedTime", "duration", "barValue");
var sep = ",";                                                  // element seperator for CSV-file
var str, str2;

var heatmapData;
var streamGraphData;
var barChartData;

var scatterplotData;

// Number of sessions played
var numSessions = 0;

/**
 *
 */
function recordSession(){
    notesOn = [];
    notesOff = [];
    filteredNotes = [];
    notesOnCount = 0;
    notesOffCount = 0;

    // Check if Session is already recording
    if (!recording) {

        // Prepare Status text
        var status = d3.select("#status");
        status.select("rect").remove();
        status.select("text").remove();
        status.append("circle")
            .attr("r", 10)
            .attr("cx", 15)
            .attr("cy", 10)
            .attr("fill", "#d62728");
        status.append("text")
            .attr("x", 35)
            .attr("y", 14)
            .text("Recording Session");
        // Change button colors in the UI
        var recordButton = d3.select("#record")
            .attr("style", "background-color: #d62728;");
        var visButton = d3.select("#visBut")
            .attr("style", "background-color: #1D4C6E;");

        // WebMidi saves the played notes into the array "notesOn"
        WebMidi.enable(function(err){
            if (err) console.log("WebMidi could not be enabled");
            var input = WebMidi.inputs[0];

            input.addListener("noteon", "all", function(e){
                if (preludeOver){
                    notesOn[notesOnCount] = new Object(2);
                    notesOn[notesOnCount].rawData = e;
                    notesOn[notesOnCount].timecode = audioContext.currentTime;
                    notesOnCount++;
                }

            });
            input.addListener("noteoff", "all", function(e){
                if (preludeOver){
                    notesOff[notesOffCount] = new Object(2);
                    notesOff[notesOffCount].rawData = e;
                    notesOff[notesOffCount].timecode = audioContext.currentTime;
                    notesOffCount++;
                }

            });

        });
        recording = true;
        sessionSaved = false;
        visRequested = false;
    }
    else {
        window.alert("Already recording!");
    }
}

/**
 *
 */
function saveSession(){
    // Only saves the session if the system is in recording mode
    if (recording && !sessionSaved){
        var status = d3.select("#status");
        status.select("circle").remove();
        status.select("text").remove();
        status.append("rect")
            .attr("width", 20)
            .attr("height", 20)
            .attr("x", 4)
            .attr("y", 2);
        status.append("text")
            .attr("x", 35)
            .attr("y", 15)
            .text("Session saved");

        var recordButton = d3.select("#record")
            .attr("style", "background-color: #1D4C6E;");

        var stopButton = d3.select("#stop")
            .attr("style", "background-color: #123045;");

        // Preparing dataset for csv and line graph
        for (var i = 0; i < notesOn.length;i++){
            filteredNotes[i] = new Array(5);
            filteredNotes[i][0] = i;                                         // id
            switch (notesOn[i]["rawData"]["channel"]) {                          // string-name
                case 6:
                    filteredNotes[i][1] = "E";
                    break;
                case 5:
                    filteredNotes[i][1] = "A";
                    break;
                case 4:
                    filteredNotes[i][1] = "d";
                    break;
                case 3:
                    filteredNotes[i][1] = "g";
                    break;
                case 2:
                    filteredNotes[i][1] = "b";
                    break;
                case 1:
                    filteredNotes[i][1] = "e'";
                    break;
                default:
                    filteredNotes[i][1] = "N/A";
                    break;
            }

            filteredNotes[i][2] = notesOn[i]["rawData"]["note"]["number"];                        // MIDI-note number
            filteredNotes[i][3] = ((notesOn[i]["rawData"]["receivedTime"])/1000)-firstBeat;      // Received Time (in sec)
            filteredNotes[i][4] = notesOn[i]["rawData"]["velocity"];                              // Velocity

        }
        str = arrayToCSVString(csvHeader, filteredNotes, sep);                        // converts "filteredNotes" into the CSV-compatible string "str"
        stats_E = createStats(filteredNotes, "E");
        stats_A = createStats(filteredNotes, "A");
        stats_d = createStats(filteredNotes, "d");
        stats_g = createStats(filteredNotes, "g");
        stats_b = createStats(filteredNotes, "b");
        stats_e = createStats(filteredNotes, "e'");
        stats = new Array(stats_E, stats_A, stats_d, stats_g, stats_b, stats_e);




        /*
        chords = aggregateChords();
        streamGraphData = prepareStreamGraphData(chords);
        barChartData = prepareBarChartData(chords);
        */
        maxString = getMaxString();
        scatterplotData = prepareScatterplotData();
        var temp = sessions;
        sessions = temp.concat(scatterplotData);
        var sessionsArr = sessionsObjectToArray(sessions);
        str2 = arrayToCSVString(csvHeader2, sessionsArr, sep);
        heatmapData = prepareHeatmapData();

        console.log("sessions", sessions);

        sessionSaved = true;
        recording = false;
        preludeOver = false;
        numSessions++;
        preludeCounter = 0;

    }
    else {
        window.alert("Record a session first!");
    }

}



/**
 *
 * @param arr
 */
function consoleOutChordStats(arr){
    var pcCount = 0,
        otherCount = 0,
        undefinedCount = 0,
        barreCount = 0,
        singleCount = 0;
    for (var k = 0; k<arr.length;k++){
        if (chords[k]["key"]=="PC") pcCount++;
        if (chords[k]["key"]=="other") otherCount++;
        if (chords[k]["key"]=="undefined") undefinedCount++;
        if (chords[k]["key"]=="BC") barreCount++;
        if (chords[k]["key"]=="SN") singleCount++;

    }
    console.log("Chords", chords);
    console.log("Power Chords", pcCount);
    console.log("Other", otherCount);
    console.log("Undefined", undefinedCount);
    console.log("Barre Chords", barreCount);
    console.log("Single Notes", singleCount);
}

/**
 *
 */
function downloadSession(){
    if (sessionSaved){
        var blob = new Blob([str], {type:"text/plain;charset=utf-8"});
        var blob2 = new Blob([str2], {type:"text/plain;charset=utf-8"});
        saveAs(blob, "guitarData.csv");
        saveAs(blob2, "guitarData2.csv");
    }
    else{
        window.alert("Record a session first!");
    }
}

function getMaxString(){
    var result = 0;
    var max_E = 0,
        max_A = 0,
        max_d = 0,
        max_g = 0,
        max_b = 0,
        max_e = 0;
    for(var i = 0; i<notesOn.length; i++){
        switch (notesOn[i]["rawData"]["channel"]) {
          case 6:
              max_E++;
              break;
          case 5:
              max_A++;
              break;
          case 4:
              max_d++;
              break;
          case 3:
              max_g++;
              break;
          case 2:
              max_b++;
              break;
          case 1:
              max_e++;
              break;
          default:
              break;
        }
    }
    result = Math.max(max_E, max_A, max_d, max_g, max_b, max_e);
    return result;
}

/**
 * Converts an array to a CSV-compatible string
 *
 * @param header CSV-Header
 * @param arr Array that will be converted into a CSV-string
 * @param sep element seperator (for example: ",", ";", "|"
 * @returns {String} CSV-compatible string
 */
function arrayToCSVString(header, arr, sep){
    var str = new String;
    if (header.length>0){
        str = header.join(sep);
        str += "\n";
    }

    for (var i = 0; i < arr.length; i++){
        str += arr[i].join(sep);
        str += "\n";
    }
    return str;
}

/**
 *
 * @param arr
 * @param note
 * @returns {Array}
 */
function createStats(arr, note){
    var stats = new Array();
    var num = 0;
    for (var i = 0; i<arr.length; i++){
        stats[i] = new Object();

        if (arr[i][1]==note) {
            stats[num] = new Object();
            stats[num].time = arr[i][3];
            stats[num].played = num+1;
            num++;
        }

    }
    return stats;
}

/**
 *
 * @param note
 * @param string
 * @returns {number}
 */
function countNoteOnFret(note, string){
    var count = 0;
    for (var i = 0; i<sessions.length; i++){

        if (sessions[i]["string"]==string && sessions[i]["noteNumber"] == note) {
            count++;
        }
    }
    return count;
}

/**
 *
 * @param arr
 * @param t
 * @returns {number}
 */
function getIndexOfTime(arr, t){
    for (var i = 0; i< arr.length; i++){
        if (arr[i].time==t){
            return i;
        }
    }
}
