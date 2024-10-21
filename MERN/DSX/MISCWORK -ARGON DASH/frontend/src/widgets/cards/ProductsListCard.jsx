import axios from 'axios';
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { handleError, handleSuccess } from '../../utils/Toastify';
import { PORT } from '../../PORT/PORT';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { MdCurrencyRupee ,MdEditSquare,MdDelete} from "react-icons/md";
import { TiEye } from "react-icons/ti";


function ProductsListCard({data,onProductChange}) {
  const navigate=useNavigate();

// const handleRemove=async()=>{
//   try {
//     const url=`${PORT}removeProduct/${data.id}`
//     const response = await axios.delete(url)

//     console.log(response);
    
//     if(response==200){
//       handleSuccess('Product removed ...!')
//     }else{
//       handleError('Something went wrong while removing product')
//     }

//   } catch (error) {
//     console.log('error while Removing product',error);    
//   }

// }
const removeItem=async()=>{
 const url=`${PORT}removeProduct/${data.id}`
  const response = await axios.delete(url)
  console.log(response);
  if(response==200){
    onProductChange()
    handleSuccess('Product removed ...!')
  }else{
    handleError('Something went wrong while removing product')
  }
}

const handleRemove=async()=>{
  try {

      Swal.fire({
          title: "Are you sure?",
          text: "You want to Delete item!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, Delete Item!"
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: "Product Deleted !",
              // text: "You have been Logged Out.",
              icon: "success"
            });
            
            removeItem();
          }
        });
 

  } catch (error) {
    console.log('error while Removing product',error);    
  }
}

  return (
    <>

<tr>
                  <td>
                    <div className="d-flex px-2 py-1">
                      <div>
                      { data?.media ?(<img src={data?.media[0]?.image} className="avatar avatar-sm me-3" />)
                      :
                      ( <img
                          src={data?.p_images[0]}
                          className="avatar avatar-sm me-3"
                          alt="user1"
                        />)}

                       
                      </div>
                      <div className="d-flex flex-column justify-content-center">
                        <h6 className="mb-0 text-sm">{data?.product}</h6>
                        {/* <p className="text-xs text-secondary mb-0">
                          john@creative-tim.com
                        </p> */}
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="text-xs font-weight-bold text-capitalize mb-0">{data?.category}</p>
                    <p className="text-xs text-secondary text-capitalize mb-0">{data?.subCategory}</p>
                  </td>
                  <td>
                    <p className="text-xs text-secondary text-capitalize mb-0">{data?.desc}</p>
                    {/* <p className="text-xs text-secondary text-capitalize mb-0">Soft</p> */}
                  </td>
                  <td className="align-middle text-sm">

                    {
                      data?.stock >20? <span className="badge badge-sm bg-gradient-success">
                                        Available : {data.stock}
                                      </span> 
                                    :  
                                     data.stock>0 ?<span className="badge badge-sm bg-gradient-warning">
                                                      few stock left :  {data.stock}
                                                    </span> 
                                                    :
                                                    <span className="badge badge-sm bg-gradient-danger">
                                                      Out of stock: {data.stock}
                                                    </span> 
                    }                                 
                   
                  </td>
                  <td className="align-middle">
                    <span className="text-secondary text-xs font-weight-bold">
                     {data?.updatedAt}
                    </span>
                  </td>
                  <td className="align-middle">
                    <span className="text-secondary text-xs font-weight-bold">
                    <MdCurrencyRupee />{data?.price}
                    </span>
                  </td>
                  <td className="align-middle">
                  <div className="action-buttons ">
                <div onClick={()=>{navigate('/updateProduct', {state:data.id})}} ><MdEditSquare  className='action-buttons-icon'/></div>
                <div onClick={() => onView(product)} ><TiEye  className='action-buttons-icon' /></div>
                <div onClick={handleRemove}  ><MdDelete  className='action-buttons-icon'/></div>
              </div>
                  {/* <button onClick={()=>{navigate('/updateProduct', {state:product.id})}} className='btn btn-info mx-2 p-24  toltip'><MdEditSquare/><span className='toltiptext'>Edit</span></button>
                  <button onClick={() => onView(product)} className='btn btn-success mx-2 p-24 toltip'><TiEye /><span className='toltiptext'>View</span></button>
                   <button onClick={handleRemove}  className='btn btn-warning mx-2 p-24 toltip'><MdDelete/><span className='toltiptext'>Remove</span></button> */}
                    {/* <a
                      className="text-secondary font-weight-bold text-xs m-1"
                      data-toggle="tooltip"
                      data-original-title="Edit user"
                      onClick={()=>{navigate('/updateProduct', {state:data.id})}}
                    >
                      Edit 

                    </a> | 
                    <a
                      className="text-secondary font-weight-bold text-xs m-1"
                      data-toggle="tooltip"
                      data-original-title="Edit user"
                    >
                      View 
                    </a> | 
                    <a
                      className="text-secondary font-weight-bold text-xs m-1"
                      data-toggle="tooltip"
                      data-original-title="Edit user"
                      onClick={handleRemove}
                    >
                      Remove
                    </a> */}
                  </td>
                </tr>
               

    </>
  )
}

export default ProductsListCard
