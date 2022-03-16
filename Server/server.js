require('dotenv').config();
const express = require('express');
const cors = require('cors')
const lyricsFinder = require('lyrics-finder')
const bodyParser = require('body-parser')
const SpotifyWebApi = require('spotify-web-api-node');



const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Para hacer el login con la api de Spotify
app.post('/login', (req, res) => {
    const code = req.body.code;

    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
    })

    spotifyApi.authorizationCodeGrant(code)
        .then(data => {
            res.json({
                accessToken: data.body.access_token,
                refreshToken: data.body.refresh_token,
                expiresIn: data.body.expires_in
            })
        }).catch((err) => {
            res.sendStatus(400)
        })
})

// Para hacer el refresh del token y que no se tenga que estar logeando cada 1 hora
app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken;

    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken
    })
    // Refrescamos el token
    spotifyApi
        .refreshAccessToken()
        .then(
            (data) => {
                res.json({
                    accessToken: data.body.access_token,
                    expiresIn: data.body.expires_in
                })
            }
        ).catch(() => {
            res.sendStatus(400);
        })

})

// Para buscar las letras de las canciones
app.get('/lyrics', async (req, res) => {
    const lyrics = await lyricsFinder(req.query.artist, req.query.track) || "No se encontró la letra de la canción"

    res.json({lyrics})
})


app.listen(3001)