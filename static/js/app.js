//Read in the data from the JSON file. 
d3.json('samples.json').then(data=>{
    // Create variable for the names/test subject IDs 
    var names = data.names;
    // Append as an option to the dropdown on the html id "selDataset" each name/id
    names.forEach(name => {
        d3.select('#selDataset').append('option').text(name);
    });

    createCharts();
});

// Create event handler that will change the chart displayed by running the createCharts function
function handleid() {
    // Prevent page from refreshing 
    d3.event.preventDefault();
    // Run createCharts function
    createCharts();
}


// Create function that generates the chart. 
function createCharts() {
    // Read in the data from the JSON file in the function 
    d3.json("samples.json").then((importedData) => {
        // Store the value of the html id "selDataset" to new variable selection. 
        var selection = d3.select('#selDataset').node().value;
        // Filter the samples in the JSON for only those where the id matches the selection
        var sample = importedData.samples.filter(obj => obj.id == selection)[0];
        console.log(importedData.samples);
        console.log(sample);
        // Select only the top 10 OTUs by volume for plotting the bar chart. 
        // Use reverse to have the chart display the highest volume OTU top down 
        var values = sample.sample_values.slice(0, 10).reverse();
            // Add OTU in fron of the ID number for labelling purposes on the chart/graph.
        var ids = sample.otu_ids.slice(0, 10).reverse().map(x => 'OTU ' + x);
        var labels = sample.otu_labels.slice(0, 10).reverse();

        // Store metadata data for Demographic Info section 
        var metadata = importedData.metadata;
        //console.log(metadata);
        
        var result = metadata.filter(obj => obj.id.toString() === selection)[0];
        console.log(result);

        var demographics = d3.select("#sample-metadata");

        demographics.html("");

        Object.entries(result).forEach((key) => {
            demographics.append("h4").text(key[0] + ": " + key[1] + "\n");
        });

        // Create the trace with x axis including the sample values, and the y axis displaying the OTU ID
        var trace1 = {
            x: values,
            y: ids,
            text: labels,
            name: "Top Operational Taxonomic Units (OTUs)",
            type: "bar",
            // Make bar chart horizontal instead of default vertical
            orientation: "h"
        };

        var data = [trace1];

        // Add title and labels for the axis 
        var layout = {
            title: "Top Operational Taxonomic Units (OTUs)",
            xaxis: { title: "OTU Volume" },
            yaxis: { title: "OTU ID" }
        };

        // Plot the bar chart using the trace1 and defined layout.
        Plotly.newPlot("bar", data, layout);

        // Use reverse to have the chart display the highest volume OTU top down 
        var values_raw = sample.sample_values;
            // Add OTU in fron of the ID number for labelling purposes on the chart/graph.
        var ids_raw = sample.otu_ids;
        var labels_raw = sample.otu_labels;

        var bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            margin: { t: 0 },
            hovermode: "closest",
            xaxis: { title: "OTU ID" },
            margin: { t: 30},
            
          };
        //   var bubbleData = [
        //     {
        //       x: ids,
        //       y: values,
        //       text: labels,
        //       mode: "markers",
        //       colorscale: "Jet",
        //       marker: {
        //         size: values,
        //         color: ids,
        //         //colorscale: "Jet"
        //       }
        //     }
        //   ];

          var bubbleData = [
            {
              x: ids_raw,
              y: values_raw,
              text: labels_raw,
              mode: "markers",
              colorscale: "Jet",
              marker: {
                size: values_raw,
                color: ids_raw,
                colorscale: "Jet"
              }
            }
          ];
          
          Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    });
};

//createCharts();

// Add event listener for a change on body of html. Run handleid function at change.
d3.selectAll("body").on("change", handleid);

