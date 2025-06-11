import { useEffect, useState } from "react";
import TranSlate from "../Translate/Translate";
import LoaderComponent from "../Loader/Loader";
import { getNotify } from "../../action/action";
import  { Link}from 'react-router-dom'
import { useTranslation } from "react-i18next";
import { useNotifySocket } from "../../hook/useWebSocket";
import { useUser } from "../../store/useStore";

function NotifyComponent() {
    const {t} = useTranslation()
    const [notify, setNotify] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const {currentUser} = useUser();
    useNotifySocket(currentUser.id , (newNotify)=>{
            setNotify(prev=> [newNotify, ...prev])
        })
    useEffect(()=>{
        const notify = async ()=>{
            const data = await getNotify()
            setNotify(data)
            setIsLoading(false)
        }
        notify()
    }, [])
    return ( 
        <TranSlate minWidth={0} maxWidth={'400px'}>
            <div className="mt-3 px-3">
                <h2 className="font-semibold mb-4">{t("notifications")}</h2>
                <div>
                    {
                        isLoading ? 
                        <div className="h-[50vw] flex items-center justify-center">
                            <LoaderComponent/>
                        </div>:<div>
                            {
                                notify?.map((item, index) => (
                                    <div key={index} className="mb-2">
                                    
                                        <Link className="block py-3 px-2 rounded-sm hover:bg-gray-100" to={item.redirect}>
                                            <p  className="text-sm text-gray-400">{item.message}</p>
                                        </Link>
                                    </div>
                                ))
                            }
                        </div>
                    }
                </div>
            </div>
        </TranSlate>
     );
}

export default NotifyComponent;