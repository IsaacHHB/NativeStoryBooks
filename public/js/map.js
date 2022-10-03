mapboxgl.accessToken = 'pk.eyJ1IjoiaXNhYWNoaGIiLCJhIjoiY2w4ajkzNTVyMDFiNTN5cnB6dTVncTE1eCJ9.KH3HgEQ4cliN7SDEMdgVAQ';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/satellite-streets-v11',
  zoom: 3,
  center: [-98.5795, 39.8283],
  projection: 'globe'
});



/* Given a query in the form "lng, lat" or "lat, lng"
     * returns the matching geographic coordinate(s)
     * as search results in carmen geojson format,
     * https://github.com/mapbox/carmen/blob/master/carmen-geojson.md */
  //    const coordinatesGeocoder = function (query) {
  //     // Match anything which looks like
  //     // decimal degrees coordinate pair.
  //     const matches = query.match(
  //         /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
  //     );
  //     if (!matches) {
  //         return null;
  //     }

  //     function coordinateFeature(lng, lat) {
  //         return {
  //             center: [lng, lat],
  //             geometry: {
  //                 type: 'Point',
  //                 coordinates: [
  //                   story.location.coordinates[0],
  //                   story.location.coordinates[1]
  //                 ]
  //             },
  //             place_name: 'Lat: ' + lat + ' Lng: ' + lng,
  //             place_type: ['coordinate'],
  //             properties: {},
  //             type: 'Feature'
  //         };
  //     }

  //     const coord1 = Number(matches[1]);
  //     const coord2 = Number(matches[2]);
  //     const geocodes = [];

  //     if (coord1 < -90 || coord1 > 90) {
  //         // must be lng, lat
  //         geocodes.push(coordinateFeature(coord1, coord2));
  //     }

  //     if (coord2 < -90 || coord2 > 90) {
  //         // must be lat, lng
  //         geocodes.push(coordinateFeature(coord2, coord1));
  //     }

  //     if (geocodes.length === 0) {
  //         // else could be either lng, lat or lat, lng
  //         geocodes.push(coordinateFeature(coord1, coord2));
  //         geocodes.push(coordinateFeature(coord2, coord1));
  //     }

  //     return geocodes;
  // };

  // Add the control to the map.
  // map.addControl(
  //     new MapboxGeocoder({
  //         accessToken: mapboxgl.accessToken,
  //         localGeocoder: coordinatesGeocoder,
  //         zoom: 4,
  //         placeholder: 'Try: -40, 170',
  //         mapboxgl: mapboxgl,
  //         reverseGeocode: true
  //     })
  // );


map.on('load', () => {
  // Set the default atmosphere style
  map.setFog({});
});

// Fetch stores from API
async function getMap() {
  const res = await fetch('/api/v1/stories');
  const data = await res.json();
  console.log(data)

  const stories = data.data.map(story => {
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          story.location.coordinates[0],
          story.location.coordinates[1]
        ]
      },
      properties: {
        title: story.title,
        body: story.body,
        user: story.user.userName,
        userId: story.user._id
      }
    };
  });
  loadMap(stories);
    //add markers to map
    for (const feature of stories) {
      // create a HTML element for each feature
      const el = document.createElement('div');
      el.className = 'marker';
    
      // make a marker for each feature and add it to the map
      new mapboxgl.Marker(el)
        .setLngLat(feature.geometry.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML(
              `<h2>Story By: <a href ="/stories/user/${feature.properties.userId}">${feature.properties.user}</a></h2>
              <h3>${feature.properties.title}</h3>
              <p class="scroll">${feature.properties.body}</p>`
            )
        )
        .addTo(map);
    }
}




// Load map with stores
function loadMap(stories) {
  map.on('load', function() {
    map.addLayer({
      id: 'points',
      type: 'symbol',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: stories
        }
      },
      // layout: {
      //   'icon-image': '{icon}-15',
      //   'icon-size': 1.5,
      //   'text-field': '{title}',
      //   'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
      //   'text-offset': [0, 0.9],
      //   'text-anchor': 'top'
      // }
    });
  });
}

// add the coordinates to the form

map.on('click', (e) => {
  let lng = e.lngLat.lng
  let lat = e.lngLat.lat

    document.querySelector('.lng').value = lng;
    document.querySelector('.lat').value = lat;
});


//form popup functions 

function openForm() {
  document.getElementById("popupForm").style.display = "block";
}
function closeForm() {
  document.getElementById("popupForm").style.display = "none";
}

getMap();
map.doubleClickZoom.disable()