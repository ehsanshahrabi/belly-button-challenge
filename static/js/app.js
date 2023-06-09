
// Use the D3 library to read in samples.json
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

d3.json(url).then(data => {
    init(data);
});

// Populate the dropdown menu and build the initial plots
function init(data) {
    let dropdownMenu = d3.select("#selDataset");

    data.names.forEach(name => {
        dropdownMenu.append("option").text(name).attr("value", name);
    });

    buildPlots(data, data.names[0]);
}

// Update the plots and metadata when a new sample is selected
function optionChanged(newSample) {
    d3.json(url).then(data => {
        buildPlots(data, newSample);
    });
}

// Build the plots and metadata display
function buildPlots(data, sample) {
    let sampleData = data.samples.find(s => s.id === sample);
    let metadata = data.metadata.find(m => m.id === parseInt(sample));

    // Bar chart
    let barData = [{
        type: 'bar',
        x: sampleData.sample_values.slice(0, 10).reverse(),
        y: sampleData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
        text: sampleData.otu_labels.slice(0, 10).reverse(),
        orientation: 'h'
    }];

    let barLayout = {
        title: 'Top 10 OTUs'
    };

    Plotly.newPlot('bar', barData, barLayout);

    // Bubble chart
    let bubbleData = [{
        x: sampleData.otu_ids,
        y: sampleData.sample_values,
        text: sampleData.otu_labels,
        mode: 'markers',
        marker: {
            size: sampleData.sample_values,
            color: sampleData.otu_ids,
            colorscale: 'Earth' // Added colorscale to specify the color range
        }
    }];

    let bubbleLayout = {
        title: 'Sample Values vs OTU IDs',
        xaxis: { title: 'OTU ID' },
        yaxis: { title: 'Sample Values' }
    };

    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // Display the sample metadata (demographic information)
    let metadataDisplay = d3.select("#sample-metadata");

    metadataDisplay.html('');

    Object.entries(metadata).forEach(([key, value]) => {
        metadataDisplay.append("p").text(`${key}: ${value}`);
    });

    // Gauge chart for weekly washing frequency
    let gaugeData = [{
        type: "indicator",
        mode: "gauge+number",
        value: metadata.wfreq,
        title: { text: "Weekly Washing Frequency" },
        gauge: {
            axis: { range: [0, 9] },
            steps: [
                { range: [0, 1], color: "#F8F3EC" },
                { range: [1, 2], color: "#F4F1E5" },
                { range: [2, 3], color: "#E9E6CA" },
                { range: [3, 4], color: "#E5E8B0" },
                { range: [4, 5], color: "#D5E599" },
                { range: [5, 6], color: "#B7CC92" },
                { range: [6, 7], color: "#8CBF88" },
                { range: [7, 8], color: "#8ABB8F" },
                { range: [8, 9], color: "#85B48A" }
            ],
            threshold: {
                line: { color: "red", width: 4 },
                thickness: 0.75,
                value: metadata.wfreq
            }
        }
    }];

    let gaugeLayout = { width: 600, height: 500, margin: { t: 0, b: 0 } };

    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
}
