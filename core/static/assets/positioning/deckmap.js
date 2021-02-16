
console.log('test3');

var dataarray = [];

//console.log([dataarray[0].Longitude, dataarray[0].Latitude, 1]);



/* var layer = [
    new deck.ScatterplotLayer({
        data: [...dataarray],
        getPosition: d => [d.Longitude, d.Latitude, 1],
        getColor: [255, 0, 0],
        getRadius: 10,
    })
]*/


var deckmapobj = {};

var path1 = [
    {
        path: [[17.63807, 59.18061], [52.179730492018095, 13.637774111803992], [55.17969333195976, 57.63774915572128]],
             name: 'Richmond - Millbrae',
           color: [255, 0, 0]
     },
  
    ];
var path = [];
var kalmanpath = [];
var posarray = [];
var marker = {};

googlemap = {

    initmap:  () => {

        //await this.getpos();
    
        var myLatlng = new google.maps.LatLng(59.18061, 17.63807);
        var mapOptions = {
            zoom: 18,
            mapId: "b17bcd68efb0a5ed",
            //mapTypeId: 'satellite',
            center: myLatlng,
            scrollwheel: true, //we disable de scroll over the map, it is a really annoing when you scroll through page
            //tilt: 45,
        }
        map = new google.maps.Map(document.getElementById("map"), mapOptions)


        var icon = {
            url: "https://static.thenounproject.com/png/1664-200.png", // url
            scaledSize: new google.maps.Size(50, 50), // scaled size
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(25, 25) // anchor
        };


        marker = new google.maps.Marker({
            position: { lat: 59.18061, lng: 17.63807 },
            title: "Truck1",
            icon: icon
        });

        marker.setMap(map);
    },


    getpos: async function () {

        var output = {};

        var response = await fetch('https://p184-geps-production-api.hd-rtls.com/objects/00000001/pos?max_age=60', {
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "X-Authenticate-User": "cpal",
                "X-Authenticate-Password": "cpal"
            }

        });

        var result = await response.json();
        //dataarray.push(output);


        this.validatepos(result);

            /*.then(response => response.json())
            .then(data => {
                
                
                var position = { lat: data.Latitude, lng: data.Longitude }

                var valid = this.validatepos(position);
                marker.setPosition(position);


                path.push(marker.position)
                dataarray.push(data);

                     
                return data;
            })
            .catch((error) => {
                output_data = error;
                return error;

            })*/

        
        return result;

    },

    kalman: function () {


        var kalmanFilter = new KalmanFilter({ R: 0.01, Q: 3 });
        var kalmanFilter2 = new KalmanFilter({ R: 0.01, Q: 3 });

        var dataConstantKalman = path.map(v => {

            var tmp = { lat: kalmanFilter.filter(v.lat), lng: kalmanFilter2.filter(v.lng) }
            return tmp;
        });

        return dataConstantKalman
    },


    filterdata: function (data) {
        var last_element = dataarray[dataarray.length - 1];
        //console.log('new', data);
        //console.log('last', last_element);

        //console.log(Math.abs((data.Longitude-last_element.Longitude))*100000);
    },

    validatepos: function (data) {


        /*var last_element = dataarray[dataarray.length - 1];
            

        if (last_element !== undefined) {
            if (last_element.Longitude != data.Longitude && last_element.Latitude != data.Latitude) {

                var dlat = Math.abs((data.Latitude - last_element.Latitude) * 100000)
                var dllng = Math.abs((data.Longitude - last_element.Longitude) * 100000);
                var delta = dlat + dllng;

                if (delta > 2 && delta < 20) {*/

                    //console.log(delta);

                    if (dataarray.length >= 10) { dataarray.shift() };
                    dataarray.push(data);
                    
                    var position = { lat: data.Latitude, lng: data.Longitude }
                    marker.setPosition(position);
                    path.push(position);
                    //console.log(path);
                    kalmanpath = this.kalman();
                /*}


                
            }

            else {
                //console.log('duplicate')
            }


        }
        else {
            dataarray.push(data);
    }
    */},

    renderpath: function () {
        var truckPath = new google.maps.Polyline({
            path: path,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });
        truckPath.setMap(map);

        var truckPathKalman = new google.maps.Polyline({
            path: kalmanpath,
            geodesic: true,
            strokeColor: '#0040FF',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });
        truckPathKalman.setMap(map);

        
        
    },

    renderheatmap: function () {
        var heatmap = new google.maps.visualization.HeatmapLayer({
            data: path,
            opacity: 0.1,
            radius: 15,
        });
        heatmap.setMap(map);
    }

};


deckmap = {



    setLayer: function () {

       

        var layer = [
            //new deck.HeatmapLayer({
                //data: [...dataarray],
                //getPosition: d => [d.Longitude, d.Latitude, 1],
                //getLineColor: [255, 0, 0, 100],
                //getFillColor: [255, 0, 0, 50],
                //getRadius: 1,
            //}),


            new deck.PathLayer({
                id: 'path-layer',
                data: path1,
                pickable: true,
                widthScale: 1,
                widthMinPixels: 0,
                getPath: d => d.path,
                get_color: [255, 147, 0, 150],
                getWidth: 0.2
            })
        ]
        
        deckmapobj.setProps({layers: layer});
        
    },
    

    initmap: function () {

        deckmapobj = new deck.DeckGL({
            mapStyle: 'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json',
            initialViewState: {
                longitude: 17.63807,
                latitude: 59.18061,
                zoom: 15,
                pitch: 45,
                
            },
            controller: true,
            //layers: layer,
            container: 'map',
        });

       
    },

    getpos: function () {

            return fetch('https://p184-geps-production-api.hd-rtls.com/objects/00000001/pos?max_age=60', {
                method: 'GET',
                headers: {
                    "Accept": "application/json",
                    "X-Authenticate-User": "cpal",
                    "X-Authenticate-Password": "cpal"
                }

            })
                .then(response => response.json())
                .then(data => {
                    if (dataarray.length >= 100) { dataarray.shift() };
                    


                    if (dataarray.some(e => e.Longitude === data.Longitude && e.Latitude === data.Latitude)) {
                    
                        //console.log('duplicate');
                        console.log()
                        //dataarray.push(data);
                        
                    }

                    var position = { lat: res.Latitude, lng: res.Longitude }
                    marker.setPosition(position)

                    dataarray.push(data);
                    path.push([data.Longitude, data.Latitude])
                    //console.log(dataarray);
                    //console.log(path1);
                    // console.log('Success:', output_data);            
                    return data;
                })
                .catch((error) => {
                    output_data = error;
                    // console.error('Error:', error);
                    return error;

                })




        },










}