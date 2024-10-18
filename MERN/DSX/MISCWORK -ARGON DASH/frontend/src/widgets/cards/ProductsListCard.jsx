import axios from 'axios';
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { handleSuccess } from '../../utils/Toastify';
import { ToastContainer } from 'react-toastify';
import { PORT } from '../../PORT/PORT';

function ProductsListCard({data}) {
  const navigate=useNavigate();

const handleRemove=async()=>{
  try {
    const url=`${PORT}removeProduct/${data.id}`
    const response = await axios.delete(url)

    console.log(response);
    
    if(response==200){
      handleSuccess('Product removed ...!')
    }else{
      handleRemove('Something went wrong while removing product')
    }

    
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
                        <img
                          src={data?.p_images[0]}
                          className="avatar avatar-sm me-3"
                          alt="user1"
                        />
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
                    <p className="text-xs text-secondary text-capitalize mb-0">{data?.subCateogry}</p>
                  </td>
                  <td>
                    <p className="text-xs text-secondary text-capitalize mb-0">{data?.desc}</p>
                    {/* <p className="text-xs text-secondary text-capitalize mb-0">Soft</p> */}
                  </td>
                  <td className="align-middle text-sm">

                    {
                      data?.stock >20? <span className="badge badge-sm bg-gradient-success">
                                        Available
                                      </span> 
                                    :  
                                     data.stock>0 ?<span className="badge badge-sm bg-gradient-warning">
                                                      few stock left
                                                    </span> 
                                                    :
                                                    <span className="badge badge-sm bg-gradient-danger">
                                                      Out of stock 
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
                    {data?.price}
                    </span>
                  </td>
                  <td className="align-middle">
                    <a
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
                    </a>
                  </td>
                </tr>
               

    </>
  )
}

export default ProductsListCard
