

d3.json("samples.json").then((data) => {

    var otuData = data.samples
    var ids = otuData.map(d => d.id)

    ids.forEach(function(d) {
        d3.selectAll("#selDataset").append("option").text(d)
    });

    d3.selectAll("#selDataset").on("change", changeInput);

    // EVENT HANDLER
    function changeInput() {

        var dropdown = d3.select("#selDataset")
        var idSelection = dropdown.property("value")

        plotData(idSelection)
        metadata(parseInt(idSelection))
    };

    // FILTERS & PLOTS
    function plotData(selection) {

        var filteredData = otuData.filter(d=> d.id == selection);
        var otuIds = filteredData.map(d=> d.otu_ids);
        var slicedOtuIds = otuIds[0].slice(0, 10);
        var otuIdLong = slicedOtuIds.map(d => `OTU ${d}`)

        var sampleValues = filteredData.map(d => d.sample_values);
        var slicedSampleValues = sampleValues[0].slice(0,10);

        var otuLabels= filteredData.map(d => d.otu_labels)
        var slicedOtuLabels= otuLabels[0].slice(0,10)

    // PLOT BAR
    var trace1 = {
        x: slicedSampleValues.reverse(),
        y: otuIdLong.reverse(),
        text: slicedOtuLabels,
        type: "bar",
        orientation: "h"    
    };

    var barData = [trace1];

    var barLayout = {
        title: "Top 10 OTUs by Individual",
        xaxis: {title: "Sample Values"},
        yaxis: {title: "OTU IDs"},
        height: 700,
        width: 1100,
        margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 100
        }
    }

    Plotly.newPlot("bar", barData, barLayout);
    

    // PLOT BUBBLE
    var trace2 = {
        x: slicedOtuIds, 
        y: slicedSampleValues,
        text: slicedOtuLabels,
        mode: "markers",
        marker: {
            size: slicedSampleValues,
            color: slicedOtuIds,
            opacity: 0.7
        }
    };

    var bubbleData = [trace2];

    var bubbleLayout = {
        title: "",
        xaxis: {title: "OTU ID"},
        yaxis: {title: "Sample Values"},
        height: 700,
        width: 1100,
        margin: {
            l: 250,
            r: 0,
            t: 100,
            b: 100
        }
    };
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    };


    // POPULATE DEMO TABLE
    function populateMetadata(selection) {

        var metadata = data.metadata
        d3.selectAll(".panel-body > h5").remove()

        var filteredMetadata = metadata.filter(d => d.id == selection)[0]

        Object.entries(filteredMetadata).forEach(function([key, value]) {
            d3.selectAll(".panel-body").append("h5").html("<strong>" + key + ": " + "</strong>" + value);
        });

    };        

    function init() {
        plotData("940");
        populateMetadata(940);
    };

    init();

});








