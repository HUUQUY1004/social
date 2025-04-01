import { useEffect, useState } from "react";
import { BASE_URL, getListFriend } from "../../action/action";
import FriendItem from "./FriendItem";

function Friends() {
    const [friends, setFriends] = useState([])
    const getFriends = async ()=>{
        const data = await getListFriend()
        setFriends(data)
    }
    useEffect(()=>{
        getFriends()
    }, [])
    return ( 
        <div className="friends w-[475px] pt-8 ml-5">
            <h4>Bạn bè của bạn</h4>

            <div className="mt-5 border max-h-96 py-5">
                {
                   friends.length ===0 ? (
                    <h2 className="text-center">Không có người bạn nào</h2>
                   ):
                   friends.map((item, index) => (
                    <FriendItem friend={item} key={index} />
                ))
                }
            </div>
        </div>
     );
}

export default Friends;