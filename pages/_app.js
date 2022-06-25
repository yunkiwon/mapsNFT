import 'mapbox-gl/dist/mapbox-gl.css';
import '../styles/globals.css'

function MyApp({Component, pageProps}) {
    return (
        <div className="bg-project-background">
            <Component {...pageProps} />
        </div>
    )
}

export default MyApp
