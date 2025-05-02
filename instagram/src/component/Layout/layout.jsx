import Sidebar from "../Sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import React, {useState, useEffect} from 'react';
import './layout.scss'
import Loading from "../Loading/loading";
import { getMyProfile } from "../../action/action";
import { useUser } from "../../store/useStore";
import Post from "../Post/Post";
import Search from "../Search/Search";
import NotifyComponent from "../Notify/Notify.compoment";
import ConvertAccount from "../CovertAccount/ConvertAccount";
function DefaultLayout({children}) {
    const navigate = useNavigate()
    const {currentUser,setCurrentUser} = useUser()
    const [isLoading , setIsLoading] = useState(true)
    const [createPost, setCreatePost] = useState(false);
    const [isSearch, setIsSearch] = useState(false);
    const [isNotify, setIsNotify] = useState(false);
    const [isConvert, setIsConvert] = useState(false);
    const getUser = async ()=>{
        try {
            if(!localStorage.getItem('access_token')){
                navigate('/login')
            }
            else{
                const data = await getMyProfile()
                setIsLoading(false)
                setCurrentUser(data.user)
                
            }
        } catch (error) {
            alert(error)
        }
    }
    useEffect(() => {
        getUser()
    }, []);
    return ( 
      <div className='wrapper'>
          {
            isLoading ? <Loading/> : (
                <div className='container flex'>
              <Sidebar 
                 onCreatePost={() => setCreatePost(true)}
                 onSearch={() => setIsSearch(true)}
                 onNotify={() => setIsNotify(true)}
                 onConvertAccount={() => setIsConvert(true)}
              />
              <div className='content'>
                  {children}
              </div>
          </div>
            )
          }
          {createPost && <Post onClose={setCreatePost} user={currentUser} />}
            {isSearch && <Search onClose={() => setIsSearch(false)} />}
            {isNotify && <NotifyComponent onClose={() => setIsNotify(false)} />}
            {isConvert && <ConvertAccount onClose={() => setIsConvert(false)} />}
      </div>
     );
}
export default DefaultLayout;