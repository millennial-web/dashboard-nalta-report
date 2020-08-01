var labelType, useGradients, nativeTextSupport, animate;

(function () {
    var ua = navigator.userAgent,
        iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
        typeOfCanvas = typeof HTMLCanvasElement,
        nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
        textSupport = nativeCanvasSupport
            && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
    //I'm setting this based on the fact that ExCanvas provides text support for IE
    //and that as of today iPhone/iPad current text support is lame
    labelType = (!nativeCanvasSupport || (textSupport && !iStuff)) ? 'Native' : 'HTML';
    nativeTextSupport = labelType == 'Native';
    useGradients = nativeCanvasSupport;
    animate = !(iStuff || !nativeCanvasSupport);
})();

var Log = {
    elem: false,
    write: function (text) {
        if (!this.elem)
            this.elem = document.getElementById('log');
        this.elem.innerHTML = text;
        this.elem.style.left = (500 - this.elem.offsetWidth / 2) + 'px';
    }
};


var icicle;

function init() {

    let entIdToNames = {
        '0': 'Total nacional',
        '1': 'Aguascalientes','2': 'Baja California','3': 'Baja California Sur','4': 'Campeche','5': 'Coahuila de Zaragoza',
        '6': 'Colima','7': 'Chiapas','8': 'Chihuahua','9': 'Distrito Federal','10': 'Durango',
        '11': 'Guanajuato','12': 'Guerrero','13': 'Hidalgo','14': 'Jalisco','15': 'México',
        '16': 'Michoacán de Ocampo','17': 'Morelos','18': 'Nayarit','19': 'Nuevo León','20': 'Oaxaca',
        '21': 'Puebla','22': 'Querétaro','23': 'Quintana Roo','24': 'San Luis Potosí','25': 'Sinaloa',
        '26': 'Sonora','27': 'Tabasco','28': 'Tamaulipas','29': 'Tlaxcala','30': 'Veracruz de Ignacio de la Llave',
        '31': 'Yucatán','32': 'Zacatecas',
    }

    let accident_types = [
        'Collision with vehicle',
        'Collision with fixed object',
        'Collision with motorcicle',
        'Run over',
        // 'Way out',
        'Overturn',
        // 'Other',
        // 'Collision with cyclist',
        // 'Fallen passenger',
        // 'Collision with animal',
        // 'Collision with train',
        'Fire',
        // 'Colisión con motocicleta', 'Colisión con vehículo automotor', 'Colisión con objeto fijo', 'Colisión con peatón (atropellamiento)', 
        // 'Colisión con ciclista', 'Salida del camino', 
        // 'Colisión con ferrocarril', 'Otro', 'Colisión con animal', 
        // 'Volcadura', 'Caída de pasajero', 'Certificado cero', 
        // 'Incendio'
    ];

    let accidents_by_state, accidents_by_type;


    let getNationalChildren = function (accidents) {
        // group all accidents by states
        accidents_by_state = d3.nest()
            .key(d => d.ID_ENTIDAD)
            .entries(accidents);

        states = [];

        accidents_by_state.forEach((state_data, state_index) => {
            //create state obj for lvl 2 node
            state_obj = {
                "id": `state_${state_index}`,
                "name": `${entIdToNames[state_data.key]} Total: ${state_data.values.length}`,
                "data": {
                    "$area": 10,
                    "$dim": 10,
                    "$color": "#255957"
                },
                "children": getStateChildren(state_data, state_index)
            }
            states.push(state_obj);
        });
        return states;
    }


    let getStateChildren = function (state_data, state_index) {
        //group states accidents by type
        accidents_by_type = d3.nest()
            .key(d => d.TIPACCID)
            .entries(state_data.values);

        types = [];

        // add totals for each type as the states children obj
        accidents_by_type.forEach((types_data, type_index) => {
            if (accident_types.indexOf(types_data.key) > -1) {
                //create types obj for lvl 3 node
                type_obj = {
                    "id": `types_${state_index}_${type_index}`,
                    "name": `${types_data.key}: ${types_data.values.length}`,
                    "data": {
                        "$area": 1,
                        "$dim": 0.5,
                        "$color": "#8A716A"
                    },
                    "children": getTypeChildren(types_data, state_index, type_index)
                }
                //add types counts as child of state node
                types.push(type_obj);
            }
        });
        return types;
    }

    let getTypeChildren = function (types_data, state_index, type_index) {
        //group type accidents by fatal or not fatal
        let accidents_by_fatality = d3.nest()
            .key(d => d.CLASACC)
            .entries(types_data.values);
        console.log(accidents_by_fatality);
        fatals = [];
        accidents_by_fatality.forEach((fatal_data, fatl_index) => {
            //create fatality obj for lvl 4 node
            fatality_obj = {
                "id": `fatl_${state_index}_${type_index}_${fatl_index}`,
                "name": `${fatal_data.key} : ${fatal_data.values.length}`,
                "data": {
                    "$area": 1,
                    "$dim": 0.5,
                    "$color": "#874646"
                },
                "children": []
            }
            //add fatality counts as child of type node
            fatals.push(fatality_obj);
        });
        return fatals;
    }
    
    link = 'assets/data/accidents.json';
    d3.json(link).then(accidents => { 
        

        // get national total count (root element)
        let national_total = accidents.length;
        json_data = {
            "id": "node00",
            "name": `México Total: ${national_total}`,
            "data": {
                "$area": 100,
                "$dim": 100,
                "$color": "#2191FB"
            },
            "children": getNationalChildren(accidents)
        };
         

        // left panel controls
        controls();

        json = json_data;
        // init Icicle
        icicle = new $jit.Icicle({
            // id of the visualization container
            injectInto: 'infovis',
            // whether to add transition animations
            animate: animate,
            // nodes offset
            offset: 1,
            // whether to add cushion type nodes
            cushion: false,
            //show only three levels at a time
            constrained: true,
            levelsToShow: 3,
            // enable tips
            Tips: {
                enable: true,
                type: 'Native',
                // add positioning offsets
                offsetX: 20,
                offsetY: 20,
                // implement the onShow method to
                // add content to the tooltip when a node
                // is hovered
                onShow: function (tip, node) {
                    // count children
                    var count = 0;
                    node.eachSubnode(function () {
                        count++;
                    });
                    // add tooltip info
                    tip.innerHTML = "<div class=\"tip-title\"><b>Name:</b> " + node.name
                        + "</div><div class=\"tip-text\">" + count + " children</div>";
                }
            },
            // Add events to nodes
            Events: {
                enable: true,
                onMouseEnter: function (node) {
                    //add border and replot node
                    node.setData('border', '#33dddd');
                    icicle.fx.plotNode(node, icicle.canvas);
                    icicle.labels.plotLabel(icicle.canvas, node, icicle.controller);
                },
                onMouseLeave: function (node) {
                    node.removeData('border');
                    icicle.fx.plot();
                },
                onClick: function (node) {
                    if (node) {
                        //hide tips and selections
                        icicle.tips.hide();
                        if (icicle.events.hovered)
                            this.onMouseLeave(icicle.events.hovered);
                        //perform the enter animation
                        icicle.enter(node);
                    }
                },
                onRightClick: function () {
                    //hide tips and selections
                    icicle.tips.hide();
                    if (icicle.events.hovered)
                        this.onMouseLeave(icicle.events.hovered);
                    //perform the out animation
                    icicle.out();
                }
            },
            // Add canvas label styling
            Label: {
                type: labelType // "Native" or "HTML"
            },
            // Add the name of the node in the corresponding label
            // This method is called once, on label creation and only for DOM and not
            // Native labels.
            onCreateLabel: function (domElement, node) {
                domElement.innerHTML = node.name;
                var style = domElement.style;
                style.fontSize = '0.9em';
                style.display = '';
                style.cursor = 'pointer';
                style.color = '#333';
                style.overflow = 'hidden';
            },
            // Change some label dom properties.
            // This method is called each time a label is plotted.
            onPlaceLabel: function (domElement, node) {
                var style = domElement.style,
                    width = node.getData('width'),
                    height = node.getData('height');
                if (width < 7 || height < 7) {
                    style.display = 'none';
                } else {
                    style.display = '';
                    style.width = width + 'px';
                    style.height = height + 'px';
                }
            }
        });
        
        
        // load data
        icicle.loadJSON(json);
        // compute positions and plot
        icicle.refresh();
        //end

        //init controls
        function controls() {
            var jit = $jit;
            var gotoparent = jit.id('update');
            jit.util.addEvent(gotoparent, 'click', function () {
                icicle.out();
            });
            var select = jit.id('s-orientation');
            jit.util.addEvent(select, 'change', function () {
                icicle.layout.orientation = select[select.selectedIndex].value;
                icicle.refresh();
            });
            var levelsToShowSelect = jit.id('i-levels-to-show');
            jit.util.addEvent(levelsToShowSelect, 'change', function () {
                var index = levelsToShowSelect.selectedIndex;
                if (index == 0) {
                    icicle.config.constrained = false;
                } else {
                    icicle.config.constrained = true;
                    icicle.config.levelsToShow = index;
                }
                icicle.refresh();
            });
        }
        //end
    
    
    });
}

