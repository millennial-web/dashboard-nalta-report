var totales = new L.LayerGroup();
var con_vehiculo = new L.LayerGroup();
var objeto_fijo = new L.LayerGroup();
var motocicleta = new L.LayerGroup();
var peatones = new L.LayerGroup();

//use MapBox as the tile layer source with three diferent styles for user to choose from
let attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
let mapbox_url = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}';
let tileSize = 512;
let maxZoom = 18;
let zoomOffset = -1;
let streets_map_layer = L.tileLayer(mapbox_url, { attribution: attribution, maxZoom: maxZoom, tileSize: tileSize, zoomOffset: zoomOffset, accessToken: apiKey,
    id: 'mapbox/streets-v11', 
});
let light_map_layer = L.tileLayer(mapbox_url, { attribution: attribution, maxZoom: maxZoom, tileSize: tileSize, zoomOffset: zoomOffset, accessToken: apiKey,
    id: 'mapbox/light-v10',
});
let dark_map_layer = L.tileLayer(mapbox_url, { attribution: attribution, maxZoom: maxZoom, tileSize: tileSize, zoomOffset: zoomOffset, accessToken: apiKey,
    id: 'mapbox/dark-v10',
});

let baseMaps = {
    Streets : streets_map_layer,
    Light: light_map_layer,
    Dark: dark_map_layer,
};

let overlayMaps = {
    Totales: totales,
    'Choque con otro vehículo': con_vehiculo,
    'Choque con objeto fijo': objeto_fijo,
    'Choque con motocicleta': motocicleta,
    'Atropellamiento': peatones,
};

// read data from geoJSON file using D3
link = 'assets/data/nat_accidents.geojson';
d3.json(link).then(data => {
    console.log(data.features);

    //create layer for total accidents
    L.choropleth(data, {
        valueProperty: `Total accidentes`,
        scale: ['white', '#B80006'],
        steps: 100,
        mode: 'q',
        style: {
            color: '#fff',
            weight: 0.1,
            fillOpacity: 0.8
        },
        onEachFeature: function (feature, layer) {
            
            if (feature.properties) {
                layer.bindPopup(`<h4> ${feature.properties.NOMGEO} </h4> <hr> 
                    <h5> Total: ${feature.properties[`Total accidentes`]}</h5>
                    <h5> Fatales: ${feature.properties[`Fatal`]}</h5>
                    <h5> No Fatales: ${feature.properties[`No fatal`]}</h5>
                    <h5> Solo Daños: ${feature.properties[`Sólo daños`]}</h5>    
                `)
                layer.on({
                    mouseover: function (event) {
                        layer = event.target;
                        layer.setStyle({
                            fillOpacity: 1
                        })
                    },
                    mouseout: function (event) {
                        layer = event.target;
                        layer.setStyle({
                            fillOpacity: 0.8
                        })
                    }
                })
            }
        }
    }).addTo(totales);

    //create layer for accidents with other vehicles
    L.choropleth(data, {
        valueProperty: `Colisión con vehículo automotor`,
        scale: ['white', '#2B8DA1'],
        steps: 100,
        mode: 'q',
        style: {
            color: '#fff',
            weight: 0.1,
            fillOpacity: 0.8
        },
        onEachFeature: function (feature, layer) {
            
            if (feature.properties) {
                layer.bindPopup(`<h4> ${feature.properties.NOMGEO} </h4> <hr> 
                    <h5> Accidentes Totales: ${feature.properties[`Total accidentes`]} </h5>
                    <h5> Colisión con vehículo : ${feature.properties[`Colisión con vehículo automotor`]}</h5>
                    <h5> Porcentaje : ${  Math.round(feature.properties[`Colisión con vehículo automotor`] / feature.properties[`Total accidentes`] * 100)}%</h5>
                `)
                layer.on({
                    mouseover: function (event) {
                        layer = event.target;
                        layer.setStyle({
                            fillOpacity: 1
                        })
                    },
                    mouseout: function (event) {
                        layer = event.target;
                        layer.setStyle({
                            fillOpacity: 0.8
                        })
                    }
                })
            }
        }
    }).addTo(con_vehiculo);

    //create layer for collisions with fixed objects
    L.choropleth(data, {
        valueProperty: `Colisión con objeto fijo`,
        scale: ['white', '#82BC24'],
        steps: 100,
        mode: 'q',
        style: {
            color: '#fff',
            weight: 0.1,
            fillOpacity: 0.8
        },
        onEachFeature: function (feature, layer) {          
            if (feature.properties) {
                layer.bindPopup(`<h4> ${feature.properties.NOMGEO} </h4> <hr> 
                    <h5> Accidentes Totales: ${feature.properties[`Total accidentes`]} </h5>
                    <h5> Colisión con objeto fijo : ${feature.properties[`Colisión con objeto fijo`]}</h5>
                    <h5> Porcentaje : ${  Math.round(feature.properties[`Colisión con objeto fijo`] / feature.properties[`Total accidentes`] * 100 ) }%</h5>
                `)
                layer.on({
                    mouseover: function (event) {
                        layer = event.target;
                        layer.setStyle({
                            fillOpacity: 1
                        })
                    },
                    mouseout: function (event) {
                        layer = event.target;
                        layer.setStyle({
                            fillOpacity: 0.8
                        })
                    }
                })
            }
        }
    }).addTo(objeto_fijo);

    //create layer for collisions with motorcycles
    L.choropleth(data, {
        valueProperty: `Colisión con motocicleta`,
        scale: ['white', '#F55E00'],
        steps: 100,
        mode: 'q',
        style: {
            color: '#fff',
            weight: 0.1,
            fillOpacity: 0.8
        },
        onEachFeature: function (feature, layer) {
            
            if (feature.properties) {
                layer.bindPopup(`<h4> ${feature.properties.NOMGEO} </h4> <hr> 
                    <h5> Accidentes Totales: ${feature.properties[`Total accidentes`]} </h5>
                    <h5> Colisión con motocicleta : ${feature.properties[`Colisión con motocicleta`]}</h5>
                    <h5> Porcentaje : ${  Math.round(feature.properties[`Colisión con motocicleta`] / feature.properties[`Total accidentes`] * 100)}%</h5>
                `)
                layer.on({
                    mouseover: function (event) {
                        layer = event.target;
                        layer.setStyle({
                            fillOpacity: 1
                        })
                    },
                    mouseout: function (event) {
                        layer = event.target;
                        layer.setStyle({
                            fillOpacity: 0.8
                        })
                    }
                })
            }
        }
    }).addTo(motocicleta);
    
    //create layer for collisions with pedestrians
    L.choropleth(data, {
        valueProperty: `Colisión con peatón (atropellamiento)`,
        scale: ['white', '#7e5cad'],
        steps: 100,
        mode: 'q',
        style: {
            color: '#fff',
            weight: 0.1,
            fillOpacity: 0.8
        },
        onEachFeature: function (feature, layer) {
            if (feature.properties) {
                layer.bindPopup(`<h4> ${feature.properties.NOMGEO} </h4> <hr> 
                    <h5> Accidentes Totales: ${feature.properties[`Total accidentes`]} </h5>
                    <h5> Atropellamientos : ${feature.properties[`Colisión con peatón (atropellamiento)`]}</h5>
                    <h5> Porcentaje : ${  Math.round(feature.properties[`Colisión con peatón (atropellamiento)`] / feature.properties[`Total accidentes`] * 100)}%</h5>
                `)
                layer.on({
                    mouseover: function (event) {
                        layer = event.target;
                        layer.setStyle({
                            fillOpacity: 1
                        })
                    },
                    mouseout: function (event) {
                        layer = event.target;
                        layer.setStyle({
                            fillOpacity: 0.8
                        })
                    }
                })
            }
        }
    }).addTo(peatones);


}).then(()=>{
    //tell leaflet where to center our map
    var mymap = L.map('mapid', {
        center: [22.187405, -101.865234],
        zoom: 6,
        layers: [streets_map_layer,totales]
    });
    //add layer controls
    L.control.layers(baseMaps, overlayMaps).addTo(mymap);

    //add project description
    var proj_description = L.control({ position: "topleft" });
    proj_description.onAdd = function (map) {
        var div = L.DomUtil.create("div", "proj_description");
        div.innerHTML += "<h2>National Land Traffic Accident (NALTA) Report</h2>";
        div.innerHTML += "<p>Everyday millions of people move for different purposes and in different ways. Inherently, such movility tests our capacity to share the streets so everyone can travel safety to their destiny and without incidents. How well we do it? That is the purpose of this site.</p>";
        div.innerHTML += "<p>We put the INEGI data report about land traffic accidents (2018) into analysis to unravel the national incidencies per state and evaluate our road safety culture. </p>";
        div.innerHTML += "<p>The present map shows the total number of incidents, then its broken down by outcome: <strong>fatal, not fatal and only material damage.</strong> Plus, you can move through layers to display different variables.</p>";
        return div;
    };
    proj_description.addTo(mymap);

    

    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function (map) {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += "<p><strong>Map layers<strong></p>";
        div.innerHTML += '<i style="background: #B80006"></i> <span> Total incidents </span><br>';
        div.innerHTML += '<i style="background: #2B8DA1"></i> <span> Collision with another vehicle </span><br>';
        div.innerHTML += '<i style="background: #82BC24"></i> <span> Collision with fixed object </span><br>';
        div.innerHTML += '<i style="background: #F55E00"></i> <span> Collision with motorcycle </span><br>';
        div.innerHTML += '<i style="background: #7e5cad"></i> <span> Collision with pedestrian(s) </span><br>';
        return div;
    };
    legend.addTo(mymap);

    //run custom function when user selects a new layer
    mymap.on('overlayadd', onOverlayAdd);
    function onOverlayAdd(e) {
        checkboxes = d3.selectAll('.leaflet-control-layers-overlays .leaflet-control-layers-selector');
    
        checkboxes.nodes().forEach((el)=>{
            el.selected = false;
        });
            // .attr('checked',false);
    }
});






