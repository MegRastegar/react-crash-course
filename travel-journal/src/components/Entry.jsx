export default function Entry(prop) {
    return (
        <article className="journal-entry">
            <div className="main-image-container">
                <img className="main-image" src={prop.img.src} alt={prop.img.alt} />
            </div>
            <div className="info-container">
                <img className="marker" src="\marker.png" alt="map marker icon" />
                <span className="country">{prop.country}</span>
                <a href={prop.googleMapsLink}>View on Google Maps</a>
                <h2 className="entry-title">{prop.title}</h2>
                <p className="trip-dates">{prop.dates}</p>
                <p className="entry-text">{prop.text}</p>
            </div>
        </article>
    )
}