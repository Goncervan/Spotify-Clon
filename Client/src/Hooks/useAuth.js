import { useState, useEffect } from 'react'
import axios from 'axios'

export default function useAuth(code) {
    const [accessToken, setAccessToken] = useState()
    const [refreshToken, setRefreshToken] = useState()
    const [expiresIn, setExpiresIn] = useState()

    useEffect(() => {
        axios.post('https://spotify-gonzacervan.herokuapp.com//login', {
            code,
        }).then(res => {
            setAccessToken(res.data.accessToken);
            setRefreshToken(res.data.refreshToken);
            setExpiresIn(res.data.expiresIn);
            window.history.pushState({}, null, "/");
        }).catch(() => {
            window.location = "/";
        })
    }, [])

    useEffect(() => {
        if (!refreshToken || !expiresIn) return;
        // Seteamos un intervalo para que se refresque el token cuando le falte 1 minuto para expirar
        const interval = setInterval(() => {
            axios
                .post('https://spotify-gonzacervan.herokuapp.com/refresh', {
                    refreshToken,
                })
                .then(res => {
                    setAccessToken(res.data.accessToken);
                    setExpiresIn(res.data.expiresIn);
                })
                .catch(() => {
                    window.location = "/";
                })
        }, (expiresIn - 60) * 1000)

        return () => clearInterval(interval);

    }, [refreshToken, expiresIn])



    return accessToken
}
