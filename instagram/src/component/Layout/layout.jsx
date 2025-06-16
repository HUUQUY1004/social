import Sidebar from "../Sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import React, {useState, useEffect, useRef, useCallback} from 'react';
import './layout.scss'
import Loading from "../Loading/loading";
import { getMyProfile } from "../../action/action";
import { useUser } from "../../store/useStore";
import Post from "../Post/Post";
import Search from "../Search/Search";
import NotifyComponent from "../Notify/Notify.compoment";
import ConvertAccount from "../CovertAccount/ConvertAccount";
import UserChat from "../UserChat/UserChat";
import useOnClickOutside from "../../hook/useOnClickOutSide";
function DefaultLayout({children}) {
    const navigate = useNavigate()
    const {currentUser,setCurrentUser} = useUser()
    const [isLoading , setIsLoading] = useState(true)
    const [createPost, setCreatePost] = useState(false);
    const [isSearch, setIsSearch] = useState(false);
    const [isNotify, setIsNotify] = useState(false);
    const [isConvert, setIsConvert] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const searchRef = useRef();
    const notifyRef = useRef()
    useOnClickOutside(searchRef, ()=> setIsSearch(false))
    useOnClickOutside(notifyRef, ()=> setIsNotify(false));    const getUser = useCallback(async ()=>{
        try {
            if(!localStorage.getItem('access_token')){
                navigate('/login')
                return;
            }
            else{
                const data = await getMyProfile()
                if (data && data.user) {
                    setCurrentUser(data.user)
                } else {
                    // If no user data returned, redirect to login
                    localStorage.removeItem('access_token');
                    navigate('/login')
                    return;
                }
                setIsLoading(false)
            }
        } catch (error) {
            console.error("err: " , error);
            // On error, clear token and redirect to login
            localStorage.removeItem('access_token');
            navigate('/login');
        }
    }, [navigate, setCurrentUser]);useEffect(() => {
        getUser()
    }, [getUser]);
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
          }          {createPost && <Post onClose={setCreatePost} user={currentUser} />}
            {isSearch && <div ref={searchRef}><Search onClose={() => setIsSearch(false)} /></div>}
            {isNotify && <div ref={notifyRef}><NotifyComponent onClose={() => setIsNotify(false)} /></div>}
            {isConvert && <ConvertAccount onClose={() => setIsConvert(false)} />}
            {isChatOpen && <UserChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />}
            
            {/* Chat Support Button */}
            <div className="chat-support-btn" onClick={() => setIsChatOpen(true)}>
                <span className="chat-icon">💬</span>
                <span className="chat-text">Hỗ trợ</span>
            </div>
      </div>
     );
}
export default DefaultLayout;