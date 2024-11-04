import React from 'react'
import { useNavigate } from 'react-router-dom';
import { deleteFCMToken } from '../../firebase-config';

const Home = () => {

    const navigate=useNavigate();
    const handleLogOut =()=>{
        localStorage.clear();
        deleteFCMToken();
        navigate('/login')
    }

    const user=localStorage.getItem('user')||localStorage.getItem('email')
  return (<>
  <div className="d-flex justify-content-end">
  <span className='btn btn-info ' onClick={handleLogOut}>Logout</span></div>
    <div className='display-5'>
      Hi...  {user}
      
    </div>
    </>
  )
}

export default Home
