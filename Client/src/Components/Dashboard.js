import { useState, useEffect } from 'react'
import { Container, Form } from 'react-bootstrap'
import useAuth from '../Hooks/useAuth'
import SpotifyWebApi from 'spotify-web-api-node'
import TrackSearchResult from './TrackSearchResult'
import Player from './Player'
import axios from 'axios'
import '../Styles/Dashboard.modules.css'


const spotify = new SpotifyWebApi({
    clientId: "017c4d9e09aa4332a6325f6b6d03a016",
})

export default function Dashboard({ code }) {
    const accesstoken = useAuth(code)

    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [playingTrack, setPlayingTrack] = useState();
    const [lyrics, setLyrics] = useState("");

    function chooseTrack(track) {
        setPlayingTrack(track);
        setSearch("");
        setLyrics("");
    }

    // Seteamos el accesstoken para poder hacer todas las queries
    useEffect(() => {
        if (!accesstoken) return;
        spotify.setAccessToken(accesstoken);
    }, [accesstoken])

    // 
    useEffect(() => {
        // Nos aseguramos de que si no hay búsqueda, no haya resultados
        if (!search) return setSearchResults([]);
        // Nos aseguramos de que si no tenemos accessToken no hagamos querie
        if (!accesstoken) return;


        // Seteamos una variable para cancelar las queries si hacemos otra nueva
        let cancel = false;
        // Usamos spotify para buscar las canciones pasandole la búsqueda
        spotify.searchTracks(search).then(res => {

            if (cancel) return

            setSearchResults(res.body.tracks.items.map(track => {

                // Buscamos entre todas las imagenes y nos quedamos con las más chica
                const smallestAlbumImage = track.album.images.reduce((smallest, image) => {
                    if (image.height < smallest.height) return image
                    return smallest
                }, track.album.images[0])

                return {
                    artist: track.artists[0].name,
                    title: track.name,
                    uri: track.uri,
                    albumUrl: smallestAlbumImage.url
                }
            }))
        })
        // La seteamos en true para cancelar la querie 
        return () => cancel = true
    }, [search, accesstoken])

    // Buscar letra de las canciones
    useEffect(() => {
        if (!playingTrack) return

        axios.get('http://localhost:3001/lyrics', {
            params: {
                track: playingTrack.title,
                artist: playingTrack.artist
            }
        }).then(res => {
            setLyrics(res.data.lyrics)
        }
        )
    }, [playingTrack])

    console.log(lyrics)
    return (
        <div className="principal">
            <div className="contenedor">
                <div className="contenedorInput">
                    <input
                        className="inputSearch"
                        type="search"
                        placeholder="Buscar Canciones / Artistas"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="contenedorCanciones">
                    <div className="canciones">
                        {!playingTrack && searchResults.length === 0 ? (
                            <div className="Info">
                                <h1 className="title">Empieza a buscar canciones o artistas!</h1>
                                <h3 className="subTitle">App creada por Gonzalo Cervan</h3>
                                <div  className="container-btn">
                                    <a className="btn-redes" href="https://www.linkedin.com/in/gonzalo-cervan/" target="_blank">
                                        <img className="logos" src='https://cdn-icons-png.flaticon.com/512/174/174857.png' alt='LinkedIn' />
                                    </a>
                                    <a className="btn-redes" href='https://github.com/Goncervan' target='_blank'>
                                        <img className="logos" src='https://cdn-icons-png.flaticon.com/512/25/25231.png' alt='Github' />
                                    </a>
                                </div>
                            </div>
                        ) : (<></>)}
                        {searchResults?.map((t) => {
                            return (
                                <TrackSearchResult track={t} key={t.uri} chooseTrack={chooseTrack} />
                            )
                        })}
                        {searchResults.length === 0 && (
                            <div className="letras">
                                {lyrics}
                            </div>
                        )}
                    </div>
                </div>
                <div className="contenedorPlayer">
                    <Player className="Player" accesstoken={accesstoken} trackUri={playingTrack?.uri} />
                </div>
            </div>
        </div>
    )
}
