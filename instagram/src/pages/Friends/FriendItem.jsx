import React from 'react'
import { BASE_URL } from '../../action/action'
import { images } from '../../source'

const FriendItem = ({friend , share= false, onCheck}) => {
  const handleChange = (e) => {
    if (onCheck) {
      onCheck(friend, e.target.checked);
    }
  };
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
          share ? <input type="checkbox" onChange={handleChange}/> :  <button className='bg-red-400 text-white px-3 py-2 rounded-lg'>Xóa</button>
        }
      </div>
    </div>
  )
}

export default FriendItem