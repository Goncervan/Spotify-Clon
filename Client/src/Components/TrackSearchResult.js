import '../Styles/TrackSearchResult.modules.css'

export default function TrackSearchResult({ track, chooseTrack }) {

    function handlePlay() {
        chooseTrack(track)
    }

    return (
        <div className="track" onClick={handlePlay}>
            <img src={track.albumUrl} alt="" style={{ height: "64px", width: "64px" }} />
            <div className="infos">
                <div className="name">{track.title}</div>
                <div className="artist">{track.artist}</div>
            </div>
        </div>
    )
}
