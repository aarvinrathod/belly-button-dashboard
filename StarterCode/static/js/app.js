d3.json("samples.json").then((data) => {
  // console.log(data);
  var names_list = data.names;
  // console.log(names_list);
  let dropdownMenu = d3.select("#selDataset");
  let names = dropdownMenu.property("value");
  names_list.forEach(name => {dropdownMenu.append("option").text(name).property('value', name);  
  });
  let name_selection = names_list[0];
  chart_data(name_selection);
});

function chart_data(name_selection) {
  d3.json('samples.json').then((data) => {
    let demographic_data = data.metadata.filter((element) => element["id"]==name_selection);
    // console.log(demographic_data);
    let samples_data = data.samples.filter((element) => element["id"]==name_selection);
    // console.log(samples_data);
    let sample_values = samples_data[0].sample_values;
    // console.log(sample_values);
    let otu_ids = samples_data[0].otu_ids;
    // console.log(otu_ids);
    let id_list = [];
    for (i=0; i<otu_ids.length; i++) {
      id_list.push(`OTU_ID:${otu_ids[i]}`);
    };
    // console.log(id_list);
    let otu_labels = samples_data[0].otu_labels.slice(0,10);
    // console.log(otu_labels);
    let barChartData = {
      "ids": id_list,
      "values": sample_values,
      "hovertext": otu_labels
    };

    barChart(barChartData);
  }
)};

function barChart(barChartData) {
  // console.log(barChartData.ids.slice(0,10));
  let trace = [{
    "y" : barChartData.ids.slice(0,10).reverse(),
    "x" : barChartData.values.slice(0,10).reverse(),
    "type" : "bar",
    "orientation" : "h",
    "text": barChartData.hovertext.slice(0,10).reverse()
  }];

  let layout = {
    "title": "Top 10 bacteria found in Subjects BellyButton",
    "yaxis" : {"tickangle" : -45},
    "hovermode" : 'closest'
  };
  let config = {
    responsive : true
  };

   Plotly.newPlot('bar', trace, layout, config)
};

d3.selectAll("#selDataset").on("change", getData);

function getData() {
  let name_selection = d3.select("#selDataset").node().value;
  chart_data(name_selection) 
};
