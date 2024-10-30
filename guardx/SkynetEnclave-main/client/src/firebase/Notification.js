// import React, { useState ,useEffect} from 'react'
// import {requestPermission,onMessageListener} from  './firebase'
// function Notification() {
//     const [notification,setNotification]=useState({title:'',body:''})
//     useEffect(()=>{
//         requestPermission();
    
//         const unsubscribe =onMessageListener().then(payload=>{
//           setNotification({
//             title:payload?.notification?.title,
//             body: payload.notification.body,
//           })
//         })
//         console.log('ss',notification);
//         alert('hi')
        
//         return ()=>{
//             unsubscribe.catch(err=>{
//                 console.log('failed',err);
                
//             })
//         }
//       },[])
       
//   return (
//    <>

//    </>
//   )
// }

// export default Notification
