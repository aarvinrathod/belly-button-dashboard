d3.json("data/samples.json").then((data) => {
  console.log(data);
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
  d3.json('data/samples.json').then((data) => {
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

    bubbleChart(barChartData);

    // _____________________________________________________________________ //
    
    let demographic_data = data.metadata.filter((element) => element["id"]==name_selection);
    // console.log(demographic_data[0]);
    let keys = Object.keys(demographic_data[0]);
    // console.log(keys)
    let value_pairs = Object.values(demographic_data[0]);
    // console.log(value_pairs)
    let table_data = {
      "arrays": [keys, value_pairs]
    };
    // console.log(table_data.arrays)
    
    demoTable(table_data);
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

function demoTable(table_data) {
  let values = table_data.arrays;
  let demoData = [{
    type : "table",
    columnwidth: [10,10],
    header : {
      values : [["<b>Particulars</b>"],["<b>Values</b>"]],
      align: "center",
      height: 100,
      line: {color:"black"},
      fill:{color:"lightblue"}
    },
    cells: {
      values: values,
      align : "center"
    }
  }];
  // console.log(values)
  Plotly.newPlot('sample-metadata', demoData)
};

function bubbleChart(barChartData) {

  let random_color = [];

  for (let i=0; i<barChartData.ids.length; i++) {
    let randomColor = Math.floor(Math.random()*16777215).toString(16);
    random_color.push(randomColor);
  };
  
  // console.log(random_color);
  
  let trace1 = {
    x: barChartData.ids,
    y: barChartData.values,
    text: barChartData.hovertext,
    mode: 'markers',
    marker: {size: barChartData.values, color: random_color}
  };
  let bubbleChartData = [trace1];
  let layout = {
    title: "ID vs Sample Values",
    showlegend: false,
  };
  Plotly.newPlot('bubble', bubbleChartData, layout)
}


d3.selectAll("#selDataset").on("change", getData);

function getData() {
  let name_selection = d3.select("#selDataset").node().value;
  chart_data(name_selection) 
};
