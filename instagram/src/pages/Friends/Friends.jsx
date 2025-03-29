import { useEffect, useState } from "react";
import { getListFriend } from "../../action/action";

function Friends() {
    const [friends, setFriends] = useState([])
    const getFriends = async ()=>{
        const data = getListFriend()
        setFriends(data)
    }
    useEffect(()=>{
    }, [])
    return ( 
        <h1>{JSON.stringify(friends)}</h1>
     );
}

export default Friends;