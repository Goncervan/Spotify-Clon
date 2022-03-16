import { useEffect, useState } from 'react';
import SpotifyPlayer from 'react-spotify-web-playback'

export default function Player({ accesstoken, trackUri }) {

    const [play, setPlay] = useState(false)

    useEffect(() => setPlay(true), [trackUri])


    if (!accesstoken) return null

    return <SpotifyPlayer
        token={accesstoken}
        showSaveIcon
        callback={state => {
            if (!state.isPlaying) setPlay(false);
        }}
        play={play}
        magnifySliderOnHover={true}
        uris={trackUri ? [trackUri] : []}
        styles={{
            bgColor: '#8484CA',
            color: '#272aad',
            sliderColor: '#0D0F31',
            sliderHandleColor:'#272aad',
            trackNameColor: 'rgb(225, 225, 225)',
            trackArtistColor: "rgb(190, 190, 190)",
            height: '80px',
            padding: "5px"
        }}
    />

}
