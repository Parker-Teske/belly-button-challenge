const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'
function init() {
  // Select the dropdown element
  var dropdown = d3.select("#selDataset");
  
  // Populate the dropdown with subject ID's from the list of sample Names
    d3.json(url).then((data) => {
      var subjectIds = data.names;
      subjectIds.forEach((id) => {
        dropdown
        .append("option")
        .text(id)
        .property("value", id);
      });
    
    // Use the first subject ID from the names to build initial plots
    const firstId = subjectIds[0];
    charts(firstId);
    demoInfo(firstId);
  });
}

function charts(sample) {    
  d3.json(url).then((data) => {
  var samples = data.samples;
  var filterArray = samples.filter(sampleObject => sampleObject.id == sample);
  var result = filterArray[0];
  var sample_values = result.sample_values;
  var otu_ids = result.otu_ids;
  var otu_labels = result.otu_labels;   

  // Bar Chart
var trace = {
  x: sample_values.slice(0,10).reverse(),
  y: otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
  text: otu_labels.slice(0,10).reverse(),
  type: "bar",
  orientation: "h"
};
var data = [trace];
var layout = {
    title: "Top Ten OTUs",
    margin: {l: 100, r: 100, t: 100, b: 100}
};
Plotly.newPlot("bar", data, layout);  


  // Bubble Chart
  var trace1 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
      size: sample_values,
      color: otu_ids,
      colorscale:"Earth"
      }
  };
  var data = [trace1];
  var layout = {
      showlegend: false,
      hovermode: 'closest',
      xaxis: {title:"OTU ID "},
      margin: {t:30}
  };
  Plotly.newPlot('bubble', data, layout); 
});
} 
function demoInfo(sample) {
  d3.json(url).then((data) => {
      var metadata = data.metadata;
      var filterArray = metadata.filter(sampleObject => sampleObject.id == sample);
      var result = filterArray[0];
      var metaPanel = d3.select("#sample-metadata");
      metaPanel.html("");
      Object.entries(result).forEach(([key, value]) => {
          metaPanel.append("h6").text(`${key.toUpperCase()}: ${value}`)
      })
  

  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  charts(newSample);
  demoInfo(newSample);
}

// Initialize the dashboard
init();