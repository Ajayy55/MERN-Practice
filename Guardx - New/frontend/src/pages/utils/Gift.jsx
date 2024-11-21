import React, { useState } from 'react'
import Layout from '../../layout/Layout'

function Gift() {
    const [list,setList]=useState([])
    const [friend,setFriend]=useState({
        name:"",
        id:Date.now(),
        city:"",
        gift:false
    }
    );

    const handleChange=(e)=>{
        const { name, value } = e.target;
        setFriend((prevState) => ({
            ...prevState, 
            [name]: value, 
          }));
    }

    const AddFriend=(e)=>{
        e.preventDefault();
        
        setList((prev)=>[...prev,friend]
        )
    }

console.log(friend,list);
const giftList=["Pen","Mobile","Notebook","Shoes","Cricket Bat"];

const assignGift =(id)=>{
    setList(list.map((item)=>item.id==id?
     { ...item,gift:giftList[Math.floor(Math.random()*giftList.length)]}:item))  
           
}

  return (
   <>
    <Layout>
    <div className="content-wrapper">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="container mt-0">
            <div className='card m-6 p-6' style={{height:'300px'}}>
            <div className="mb-3">
            <label htmlFor="friendName" className="form-label">
              Friend Name 
            </label>
            <input
            className='formcontrol'
              type="text"
              id="name"
              name="name"
        
              onChange={handleChange}
            />

          </div>
            <div className="mb-3">
            <label htmlFor="friendAge" className="form-label">
              Friend's Age 
            </label>
            <input
              type="text"
              id="friendAge"
              name="age"
          
              onChange={handleChange}
            />
          </div>
            <div className="mb-3">
            <label htmlFor="friendAge" className="form-label">
              Friend's city 
            </label>
            <input
            className='formcontrol'
              type="text"
              id="friendAge"
              name="city"
          
              onChange={handleChange}
            />
            <button type='submit' onClick={AddFriend}>Add Friend</button>
          </div>
         <span className='mx-5'>  Gift List : {giftList.join()}</span>
        </div>
        <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Friend Name</th>
                        <th>Gift </th>
                        <th>Action</th>
                        </tr>
                        
                           {
                            list.length>0 && list?.map((friend,index)=>{
                                return<tr key={index}>
                                    <td>{friend.name}</td>
                                    <td>{friend.gift}</td>
                                    <td><button className='btn btn-primary' onClick={()=>{assignGift(friend.id)}}> Assign Gift
                                        </button></td>
                                 </tr>
                            })
                           } 
                       
                      
                      </thead>
             </table>
             </div>
            </div>
        </div>
    </div>

    </Layout>

   </>
  )
}

export default Gift
