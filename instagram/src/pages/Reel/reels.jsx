import { useEffect, useState } from "react";
import { getReels } from "../../action/action";
import PostHome from "../../component/PostHome/PostHome";
import { useUser } from "../../store/useStore";

function Reels() {
    const [reels, setReels] = useState([])
    const [page,setPage] = useState(1)
    useEffect(()=>{
        const getData =async ()=>{
            const data = await getReels(1)            
            setReels(data)
        }
        getData()
    },[page])
    const {currentUser}= useUser()
    return ( 
        <div className="flex justify-center">
            <PostHome postList={reels} currentUser={currentUser} />
    
        </div>
     );
}

export default Reels;