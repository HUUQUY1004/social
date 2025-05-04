import React from 'react'
import { BASE_URL, deleteFriend } from '../../action/action'
import { images } from '../../source'
import { toast } from 'react-toastify';

const FriendItem = ({friend , share= false, onCheck}) => {
  const handleChange = (e) => {
    if (onCheck) {
      onCheck(friend, e.target.checked);
    }
  };
  const handleClick = async()=>{
    const data = await deleteFriend(friend.id)
    if(data.status === 200) {
      toast.info("Xoá thành công")
    }
    else {
      toast.error(`${data.message}`)
    }
  }
  return (
    <div className="flex items-center px-3 py-2 hover:bg-gray-200">
      <div className='flex gap-2 items-center flex-1'>
        <img src={
          friend.avatar? `${BASE_URL}${friend.avatar}` :
          images.noAvatar
  
        } alt="avatar" className="w-8 h-8 rounded-full mr-3" />
        <p>{friend.username}</p>
      </div>

      <div className=''>
        {
          share ? <input type="checkbox" onChange={handleChange}/> :  <button onClick={handleClick} className='bg-red-400 text-white px-3 py-2 rounded-lg'>Xóa</button>
        }
      </div>
    </div>
  )
}

export default FriendItem