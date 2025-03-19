import { images } from '../../source';
import {useEffect, useState} from 'react'
import './intro.scss'
const introImg = [
    images.intro1,
    images.intro2,
    images.intro3,
    images.intro4
]
function Intro() {
    const [index, setIndex] = useState(0)
    useEffect(() => {
        const timeId = setTimeout(()=>{
            if(index === introImg.length-1){
                setIndex(0)
            }
            else{
                setIndex(prev => prev +1)
            }
        }, 5000)
        return ()=>{
            clearTimeout(timeId)
        }
        
    }, [index]);
    return ( 
        <div className="intro__wrapper">
            <img src={introImg[index]} alt="" />
        </div>
     );
}

export default Intro;