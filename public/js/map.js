mapboxgl.accessToken = 'pk.eyJ1IjoiaXNhYWNoaGIiLCJhIjoiY2w4ajkzNTVyMDFiNTN5cnB6dTVncTE1eCJ9.KH3HgEQ4cliN7SDEMdgVAQ';

const editRoute = document.querySelector('#showEdit');

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/satellite-streets-v11',
  zoom: 3,
  center: [-98.5795, 39.8283],
  projection: 'globe'
});

map.on('load', () => {
  // Set the default atmosphere style
  map.setFog({});
});

// Fetch stories from API
async function getMap() {
  const res = await fetch('/api/v1/stories');
  const data = await res.json();

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
        //! Trying adding anchor tag to the nav bar with route to /profile/edit/:id--------------------------------->
        editRoute.setHTML(`<a href="/profile/edit/${feature.properties.userId}">Edit Profile</a>`);
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