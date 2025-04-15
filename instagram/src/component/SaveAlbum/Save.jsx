import { useEffect, useRef, useState } from "react";
import useOnClickOutside from "../../hook/useOnClickOutSide";
import { addPostToAlbum, getAllAlbum, getListFriend, sharePost } from "../../action/action";
import FriendItem from "../../pages/Friends/FriendItem";

function SavedAlbum({onClose, postId}) {
    const shareRef = useRef();
    useOnClickOutside(shareRef, ()=>onClose(false))
    const [value,setValue] = useState("")
    const [albums, setAlbums] = useState([])
    const [selectedAlbum, setSelectedAlbum] = useState([]);
        const getAlbums = async ()=>{
            const data = await getAllAlbum()
            setAlbums(data)
        }
    useEffect(()=>{
        getAlbums()
    }, [])
    const handleCheck = (friend, checked) => {
        if (checked) {
          setSelectedAlbum((prev) => [...prev, friend.id]);
        } else {
          setSelectedAlbum((prev) => prev.filter((f) => f !== friend.id));
        }
      };
      const handleShare = async ()=>{
        if(selectedAlbum.length > 0){
            const url = `${window.location.origin}/p/${postId}`;
            const dataSend = {
                postId,
                selectedAlbum
            }
            const data = await addPostToAlbum(dataSend)
            if(data.status === 200){
                onClose(false)
            }
            
        }
        else {
            alert("Vui lòng chọn album để lưu ")
        }
        
      }
      
    return ( 
            <div  className="description__wrapper flex a-center j-center fixed top-0 right-0 bottom-0 left-0 z-1 bg-black/80 bg-opacity-90 ">
                <div ref={shareRef} className="description-inner flex flex-col h-full w-full  bg-white sm:h-[600px] sm:w-[550px] rounded-md py-5 " >
                    <h3 className="description-title text font-bold text-center text-sm pb-4 ">Lưu bài viết</h3>
                    <div className=" flex border-y py-2 px-4 gap-4">
                        <p className="font-semibold ">Tìm album: </p>
                        <input type="text" placeholder=" Tìm kiếm" />
                    </div>
                    <div className="px-4 mt-2  flex-1">
                        <h4 className="font-semibold">Gợi ý:</h4>
                        <div className="mt-4">
                            {
                                albums.map((item, index) => (
                                    <AlbumItemSaved item={item}  onCheck={handleCheck}/>
                                ))
                            }
                        </div>
                    </div>
                    <div className="m-5 mb-0 border-t">
                        
                        <button onClick={handleShare} className={`${selectedAlbum.length > 0 ? 'bg-blue-500' : 'bg-blue-200'} py-1 mt-4 rounded-xl text-center w-full text-white transition-colors duration-300`}>
                            Lưu
                        </button>
                    </div>

                    
                </div>
            </div>
     );
}

export default SavedAlbum;

const AlbumItemSaved = ({item, onCheck }) => {
    const handelCheck = (e)=>{
        onCheck(item, e.target.checked)
    }
  return (
    <div className="flex justify-between ">
        <h1>{item.name || 'Collection'}</h1>
        <input type="checkbox" onChange={handelCheck} />
    </div>
  )
}