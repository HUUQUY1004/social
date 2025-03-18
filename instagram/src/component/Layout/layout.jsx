import Sidebar from "../Sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import React, {useState, useEffect} from 'react';
import './layout.scss'
import Loading from "../Loading/loading";
function DefaultLayout({children}) {
    const navigate = useNavigate()
    const [currentUser ,setCurrentUser] = useState({})
    const [isLoading , setIsLoading] = useState(true)
    const getUser = async ()=>{
        try {
            if(!localStorage.getItem('instagram-user')){
                navigate('/login')
            }
            else{
                const data = await JSON.parse(localStorage.getItem('instagram-user'))
                setIsLoading(false)
                 await setCurrentUser(data)
                
            }
        } catch (error) {
            alert('Please resfesh page')
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
              <Sidebar currentUser={currentUser}/>
              <div className='content'>
                  {children}
              </div>
          </div>
            )
          }
      </div>
     );
}
export default DefaultLayout;