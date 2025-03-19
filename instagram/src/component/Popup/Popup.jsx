import { Link, NavLink } from 'react-router-dom';
import './popup.scss'
function Popup({popup, onClick}) {
    return ( 
        <div className="popup__wrapper">
                <div className='top'>
                    {
                        popup.map((item, index)=>{
                                let Copm = NavLink
                                if(item.type){
                                    Copm = 'div'
                                }
                                else if(item.link){
                                    Copm = NavLink
                                }
                                return (
                                    <Copm onClick={()=>{
                                        onClick(item)
                                    }} 
                                            to={item.link} 
                                            key={index} 
                                            className={item.separator ? "popup-item flex a-center j-between separator" : "popup-item flex a-center j-between"}>
                                        <div className='item-left flex a-center' >
                                            <div className="icon">{item.icon}</div>
                                            <div className="text">{item.name}</div>
                                        </div>
                                        <div className='item-right'>
                                            <div className="icon">{item.direct}</div>
                                        </div>
                            </Copm>
                                )
                        })
                    }
                </div>
            </div>
     );
}

export default Popup;