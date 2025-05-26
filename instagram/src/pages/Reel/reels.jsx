import { createContext, useEffect, useState } from "react";
import { getReels } from "../../action/action";
import PostHome from "../../component/PostHome/PostHome";
import { useUser } from "../../store/useStore";
import { ReelContext } from "../../context/ReelContext";

function Reels() {
    const [reels, setReels] = useState([])
    const [page,setPage] = useState(1)

    // class Name
    const className = "h-[475px] flex justify-center";
    useEffect(()=>{
        const getData =async ()=>{
            const data = await getReels(1)            
            setReels(data)
        }
        getData()
    },[page])
    const {currentUser}= useUser()
    return ( 
        <ReelContext.Provider  value={className}>
            <div className="flex justify-center">
                <PostHome  postList={reels} currentUser={currentUser} />
        
            </div>
        </ReelContext.Provider>
     );
}

export default Reels;