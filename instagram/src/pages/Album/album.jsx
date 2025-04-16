import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getAlbumById } from '../../action/action'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faArrowLeft, faEllipsis, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { BsBookmark } from 'react-icons/bs'
import PostList from '../../component/PostList/PostList'

const AlbumPage = () => {
    const {id} = useParams()
    const [album, setAlbum] = useState(null)
    const getAlbum = async ()=>{
        const data = await getAlbumById(id)
        setAlbum(data)
    }
    useEffect(()=>{
        getAlbum()
    },[])
    console.log(album);
    
  return (
    <div className='p-8 pb-10'>
        <div className='flex justify-between'>
            <Link to={'/profile'} className='flex gap-3 items-center'>
                <FontAwesomeIcon icon={faAngleLeft}/>
                <span className='font-semibold'>Đã lưu</span>
            </Link>
            <div>
                <FontAwesomeIcon icon={faEllipsisVertical} />
            </div>
        </div>
        <h1 className='my-5'>{album?.name || 'Collection'}</h1>
        <div>
            {
                album?.posts.length ===0 ? (
                    <div className='mt-10 flex items-center justify-center flex-column'>
                        <div className='text-5xl h-28 w-28 rounded-full border-[5px] border-gray-900 flex items-center justify-center '>
                            <BsBookmark />
                        </div>
                        <p className='mt-5'>Chưa có bài viết nào được lưu</p>
                    </div>
                ):(
                    <PostList data={album.posts}/>
                )
            }
        </div>
    </div>
  )
}

export default AlbumPage