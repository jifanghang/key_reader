

// Starts the live guitar session
function record(){
    start();                            // starts metronome
    recordSession();
}

// Saves the session data into the array "filteredNotes"
function save(){
    stop();                             // stops the metronome
    saveSession();
    heatmapVis();
}

// Download the session data as .csv
function download(){ downloadSession() };
// Starts the visualization (line graph)
function vis(){
    if(sessionSaved && !visRequested) {
        var stopButton = d3.select("#stop")
            .attr("style", "background-color: #1D4C6E;");
        var visButton = d3.select("#visBut")
            .attr("style", "background-color: #123045;");

        // scatterplot();
        heatmapVis();
        visRequested = true;

    }
    else if(visRequested){
        window.alert("Vis already exists!");
    }

    else{
        window.alert("Record a session first!");
    }

};

