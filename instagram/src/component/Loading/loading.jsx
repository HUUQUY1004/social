import { images } from "../../source";
import './loading.scss'
function Loading() {
    return ( 
        <div className="loading flex a-center j-center">
            <img src={images.logoLoading} alt="loading" />
        </div>
     );
}

export default Loading;