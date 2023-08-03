const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());
app.post('/playlist', async (req, res) => {
  const uris = [];
  const {
    limit,
    target_liveness,
    target_popularity,
    seed_artists,
    seed_genres,
    seed_tracks,
    target_energy,
    target_instrumentalness,
  } = req.body;
  const url = 'https://api.spotify.com/v1/recommendations';
  const link = `${url}?limit=${limit}&target_liveness=${target_liveness}&target_popularity=${target_popularity}&seed_artists=${seed_artists}&seed_genres=${seed_genres}
  &seed_tracks=${seed_tracks}&target_energy=${target_energy}&target_instrumentalness=${target_instrumentalness}`;

  var bearer = [];
  await axios
    .post(
      'https://accounts.spotify.com/api/token',
      {
        client_id: '4c8bf19b632845739f93092ccabc4335',
        client_secret: '90a8861ba0b24df18340a043198e476c',
        grant_type: 'client_credentials',
        scope:"playlist-modify-public"
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )
    .then((res) => {
      bearer = res.data.access_token;
    });
    
  
  await axios
    .get(link, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearer}`,
      },
    })
    .then((response) => {
      json_response = response.data;

      console.log('Recommended Songs:');
      uris.length = 0;

      for (let i = 0; i < json_response.tracks.length; i++) {
        const track = json_response.tracks[i];
        
        uris.push(`${i + 1}) ${track.name} by ${track.artists[0].name}`);
      }
      return;
    })
    .catch((error) => {
      console.error(error);
    });
  console.log(uris)

  res.status(200).json({
    uris
  });
});

app.listen(4500);
