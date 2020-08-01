let categories = [
  'vehicle',
  'fixed object',
  'motorcicle',
  'Run over',
  'Overturn',
  'Fire',
];


let entIdToNames = [
  {'id': '1',  'name' : 'Aguascalientes'},
  {'id': '2',  'name' : 'Baja California'},
  {'id': '3',  'name' : 'Baja California Sur'},
  {'id': '4',  'name' : 'Campeche'},
  {'id': '5',  'name' : 'Coahuila de Zaragoza'},
  {'id': '6',  'name' : 'Colima'},
  {'id': '7',  'name' : 'Chiapas'},
  {'id': '8',  'name' : 'Chihuahua'},
  {'id': '9',  'name' : 'Distrito Federal'},
  {'id': '10', 'name' : 'Durango'},
  {'id': '11', 'name' : 'Guanajuato'},
  {'id': '12', 'name' : 'Guerrero'},
  {'id': '13', 'name' : 'Hidalgo'},
  {'id': '14', 'name' : 'Jalisco'},
  {'id': '15', 'name' : 'México'},
  {'id': '16', 'name' : 'Michoacán de Ocampo'},
  {'id': '17', 'name' : 'Morelos'},
  {'id': '18', 'name' : 'Nayarit'},
  {'id': '19', 'name' : 'Nuevo León'},
  {'id': '20', 'name' : 'Oaxaca'},
  {'id': '21', 'name' : 'Puebla'},
  {'id': '22', 'name' : 'Querétaro'},
  {'id': '23', 'name' : 'Quintana Roo'},
  {'id': '24', 'name' : 'San Luis Potosí'},
  {'id': '25', 'name' : 'Sinaloa'},
  {'id': '26', 'name' : 'Sonora'},
  {'id': '27', 'name' : 'Tabasco'},
  {'id': '28', 'name' : 'Tamaulipas'},
  {'id': '29', 'name' : 'Tlaxcala'},
  {'id': '30', 'name' : 'Veracruz de Ignacio de la Llave'},
  {'id': '31', 'name' : 'Yucatán'},
  {'id': '32', 'name' : 'Zacatecas'},
];


let IdToNames = {
  '1': 'Aguascalientes', '2': 'Baja California', '3': 'Baja California Sur', '4': 'Campeche', '5': 'Coahuila de Zaragoza',
  '6': 'Colima', '7': 'Chiapas', '8': 'Chihuahua', '9': 'Distrito Federal', '10': 'Durango',
  '11': 'Guanajuato', '12': 'Guerrero', '13': 'Hidalgo', '14': 'Jalisco', '15': 'México',
  '16': 'Michoacán de Ocampo', '17': 'Morelos', '18': 'Nayarit', '19': 'Nuevo León', '20': 'Oaxaca',
  '21': 'Puebla', '22': 'Querétaro', '23': 'Quintana Roo', '24': 'San Luis Potosí', '25': 'Sinaloa',
  '26': 'Sonora', '27': 'Tabasco', '28': 'Tamaulipas', '29': 'Tlaxcala', '30': 'Veracruz de Ignacio de la Llave',
  '31': 'Yucatán', '32': 'Zacatecas',
}


function setSelectOptions() {
  //populate entidad1 selector
  var selectInput = d3.select("#selDataset1");
  var options = selectInput.selectAll("option")
    .data(entIdToNames)
    .enter()
    .append("option");
  options.text(function (d) {
    return d.name;
  }).attr("value", function (d) {
    return d.id;
  });
  selectInput.on('change',generatePlots);


  //populate entidad2 selector
  var selectInput = d3.select("#selDataset2");
  var options = selectInput.selectAll("option")
    .data(entIdToNames)
    .enter()
    .append("option");
  options.text(function (d) {
    return d.name;
  }).attr("value", function (d) {
    return d.id;
  });
  selectInput.on('change', generatePlots);

  //populate entidad3 selector 
  entIdToNames.shift();
  var selectInput = d3.select("#selDataset3");
  var options = selectInput.selectAll("option")
    .data(entIdToNames)
    .enter()
    .append("option");
  options.text(function (d) {
    return d.name;
  }).attr("value", function (d) {
    return d.id;
  });
  selectInput.on('change', gen3dScatter);
}


let getStateTrace = function (data, entity_id) {
  //filter data by state_id
  if (entity_id > 0) {
    accidents = data.filter((d) => { return parseInt(d.ID_ENTIDAD) == entity_id });
  } else {
    accidents = data;
  }

  //get totals by accident type
  var accidents_by_type = d3.nest()
    .key(d => d.TIPACCID)
    .entries(accidents);

  var counts = accidents_by_type.map(d => d.values.length);

  //create state obj
  var state_obj = {
    x: categories,
    y: counts,
    type: 'bar',
    name: IdToNames[entity_id],
    marker: {
      color: '',
      opacity: 0.7,
    }
  };
  return state_obj;
}

let unpack = function(rows, key) {
  return rows.map(function (row) { return row[key]; });
}

function generatePlots(){
  selected_entity1 = d3.select("#selDataset1").property("value");
  selected_entity2 = d3.select("#selDataset2").property("value");
  link = 'assets/data/accidents.json';
  d3.json(link).then(data => { 
    var trace1 = getStateTrace(data, selected_entity1, 'rgb(49,130,189)');
    var trace2 = getStateTrace(data, selected_entity2, '#a87132');

    var trace_data = [trace1,trace2];

    var layout = {
      title: 'Accidents by Type',
      xaxis: {
        tickangle: -45
      },
      barmode: 'group'
    };

    Plotly.newPlot('plot', trace_data, layout);
  });
}


let gen3dScatter = function () {
  entity_id = d3.select("#selDataset3").property("value");
  link = 'http://127.0.0.1:5000/entidad/' + entity_id;
  
  d3.json(link).then(res => {
    data = res.data;
    //filter accidents by state
    if (entity_id == 0){
      accidents = data;
    }else{
      accidents = data.filter((d) => { 
        return (parseInt(d.ID_ENTIDAD) == entity_id)
      });
    }
    console.log(accidents);

    colors = []
    accidents.forEach((acc)=>{
      switch (acc.SEXO) {
        case 'Hombre':
          colors.push('#036bfc');
          break;
        case 'Mujer':
          colors.push('#ff4afc');
          break;
        default:
          colors.push('#737273');
          break;
      }
    });

    var trace1 = {
      x: unpack(accidents, 'SEXO'), 
      y: unpack(accidents, 'TIPACCID'), 
      z: unpack(accidents, 'ID_EDAD') ,
      mode: 'markers',
      marker: {
        size: 5,
        line: {
          color: colors,
          width: 0.1
        },
        opacity: 0.4
      },
      type: 'scatter3d'
    };

    var data = [trace1];
    var layout = {
      showlegend: false,
      margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 0
      },
      xaxis: {
        title: {
          text: 'Género',
          font: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
          }
        },
      },
      yaxis: {
        title: {
          text: 'Més',
          font: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
          }
        }
      },
      zaxis: {
        title: {
          text: 'Edad',
          font: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
          }
        }
      }
    };
    Plotly.newPlot('scatter', data, layout);
  });
}
 
setSelectOptions();
setTimeout(generatePlots, 500);
setTimeout(gen3dScatter,1000);
