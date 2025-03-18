import {BrowserRouter , Routes,Route} from 'react-router-dom'
import {router} from './router'
import Home from './pages/Home/home';
import DefaultLayout from './component/Layout/layout';
import { Fragment } from 'react';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
        {router.map((route,index)=>{
          const Page = route.Component
          let Layout = DefaultLayout
          if(route.layout){
            Layout = route.layout
          }
          else if(route.layout === null){
            Layout = Fragment
          }
          return <Route key={index} path={route.path} element = {<Layout><Page/></Layout>}/>
         })}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
