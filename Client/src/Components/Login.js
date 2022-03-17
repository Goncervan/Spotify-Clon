import React from 'react'
import '../Styles/Login.modules.css'
const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=017c4d9e09aa4332a6325f6b6d03a016&response_type=code&redirect_uri=https://goncervan.github.io/Spotify-Clon/#/dashboard&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state"





export default function Login() {
    return (
            <div className="contenedor" >
                <a className="btnLogin" href={AUTH_URL}>
                    Login With Spotify
                </a>
            </div>
    )
}
