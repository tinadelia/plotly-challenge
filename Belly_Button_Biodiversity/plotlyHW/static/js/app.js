// build Metadata

function buildMetadata(sample) {

  var sampleMetadata = d3.select("#sample-metadata").html("");

  var metadataURL = `/metadata/${sample}`;

  d3.json(metadataURL).then(function(metadataSample){
    list = Object.entries(metadataSample);
    list.forEach((item => {
      sampleMetadata.append("p")
        .text(item[0]+ " : "+ item[1]);

    }));
  })
}

// build Charts

function buildCharts(sample) {

    var pieSample = d3.select("#pie").html("");
    var pieURL = `/samples/${sample}`;

    d3.json(pieURL).then((pieData => {
      
      pieData.sample_values.forEach((pie_values =>parseInt(pie_values)));

      var otu_ids_list = pieData["otu_ids"];
      var otu_labels_list = pieData["otu_labels"];
      var sample_values_list = pieData["sample_values"];
      var sampleList = [sample_values_list,otu_labels_list,otu_ids_list];      
      
      //new Pie Data

      var newPieData = sampleList[0].map(function(col, i){
        return sampleList.map(function(row){
            return row[i];
            
        });
      });

      //sort the Pie Data
      
      newPieData.sort(function(a, b){
        return b[0] - a[0];
        });
      
      //slice the Top Ten

      var topTen = newPieData.slice(0,10);

      var pie_data = topTen[0].map(function(col, i){
        return topTen.map(function(row){
            return row[i];
        });
      });


  //plot the Pie Chart

    var data = [{
      values: pie_data[0],
      labels: pie_data[2],
      hovertext: pie_data[1],
      hoverinfo: 'hovertext',
      type: 'pie'
    }];
    
    var layout = {
      height: 510,
      width: 500
    };
    
    Plotly.newPlot('pie', data, layout);

//plot the Bubble Chart

  var bubble_data = [{
    x: otu_ids_list,
    y: sample_values_list,
    text: otu_labels_list,
    mode: "markers",
    marker: {
      size: sample_values_list,
      color: otu_ids_list,
      colorscale:"Rainbow"
    }
  }];
  
  var layout = {
    showlegend: false,
    height: 600,
    width: 1200,
    sizemode: "area",
    hovermode:"closet",
    xaxis:{title:"OTU_ID"}
  };
  
  Plotly.newPlot('bubble', bubble_data, layout);

    }));

}

function init() {

var selector = d3.select("#selDataset");

d3.json("/names").then((sampleNames) => {
  sampleNames.forEach((sample) => {
    
    selector
      .append("option")
      .text(sample)
      .property("value", sample);
  });

  const firstSample = sampleNames[0];
  buildCharts(firstSample);
  buildMetadata(firstSample);
  buildGauge(firstSample);
});
}

function optionChanged(newSample) {

buildCharts(newSample);
buildMetadata(newSample);
}

init();
