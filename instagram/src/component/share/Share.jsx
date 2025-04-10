import { useEffect, useRef, useState } from "react";
import useOnClickOutside from "../../hook/useOnClickOutSide";
import PopupWrapper from "../PopupWrapper/PopupWrapper";
import { getListFriend, sharePost } from "../../action/action";
import FriendItem from "../../pages/Friends/FriendItem";

function Share({onClose}) {
    const shareRef = useRef();
    useOnClickOutside(shareRef, ()=>onClose(false))
    const [value,setValue] = useState("")
    const [friends, setFriends] = useState([])
    const [selectedFriends, setSelectedFriends] = useState([]);
        const getFriends = async ()=>{
            const data = await getListFriend()
            setFriends(data)
        }
    useEffect(()=>{
        getFriends()
    }, [])
    const handleCheck = (friend, checked) => {
        if (checked) {
          setSelectedFriends((prev) => [...prev, friend.id]);
        } else {
          setSelectedFriends((prev) => prev.filter((f) => f !== friend.id));
        }
      };
      const handleShare = async ()=>{
        const dataSend = {
            postId,
            content:value,
            selectedFriends
        }
        const data = await sharePost(dataSend);
      }
      
    return ( 
            <div  className="description__wrapper flex a-center j-center fixed top-0 right-0 bottom-0 left-0 z-1 bg-black/80 bg-opacity-90 ">
                <div ref={shareRef} className="description-inner flex flex-col h-full w-full  bg-white sm:h-[600px] sm:w-[550px] rounded-md py-5 " >
                    <h3 className="description-title text font-bold text-center text-sm pb-4 ">Chia sẻ</h3>
                    <div className=" flex border-y py-2 px-4 gap-4">
                        <p className="font-semibold ">Tới: </p>
                        <input type="text" placeholder=" Tìm kiếm" value={value} onChange={(e)=> setValue(e.target.value)} />
                    </div>
                    <div className="px-4 mt-2  flex-1">
                        <h4 className="font-semibold">Gợi ý:</h4>
                        <div className="mt-4">
                            {
                                friends.map((item, index) => (
                                    <FriendItem friend={item} key={index} share={true}  onCheck={handleCheck} />
                                ))
                            }
                        </div>
                    </div>
                    <div className="m-5 mb-0 border-t">
                        <div className={`transition-all duration-1000 overflow-hidden ${selectedFriends.length > 0 ? 'max-h-[100px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                            <input
                            className="py-2 px-3 w-full border rounded-md"
                            type="text"
                            placeholder="Soạn tin nhắn"
                            />
                        </div>

                        <button onClick={handleShare} className={`${selectedFriends.length > 0 ? 'bg-blue-500' : 'bg-blue-200'} py-1 mt-4 rounded-xl text-center w-full text-white transition-colors duration-300`}>
                            Gửi
                        </button>
                    </div>

                    
                </div>
            </div>
     );
}

export default Share;