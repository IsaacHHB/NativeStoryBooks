const storeForm = document.getElementById('store-form');
const title = document.getElementById('title');
const lng = document.getElementById('lng');
const lat = document.getElementById('lat');
const body = document.getElementById('body')

// Send POST to API to add store
async function addStory(e) {
  e.preventDefault();

  if (title.value === '' || lng.value === '') {
    alert('Please fill in fields');
  }

  const sendBody = {
    title: title.value,
    body: body.value,
    location: {
      coordinates: [
        lng.value,
        lat.value
      ]
    }
  };

  try {
    const res = await fetch('/api/v1/stories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sendBody)
    });

    if (res.status === 400) {
      throw Error('Store already exists!');
    }
      
    
    alert('Story added!');
    window.location.href = '/map.html';
    
  } catch (err) {
    alert(err);
    return;
  }
}

storeForm.addEventListener('submit', addStory);