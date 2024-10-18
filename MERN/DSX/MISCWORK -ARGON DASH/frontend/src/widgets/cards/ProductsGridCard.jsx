import React from 'react'
import './ProductGridCard.css'
import Swal from "sweetalert2/dist/sweetalert2.js";
import { PORT } from '../../PORT/PORT';
import { MdCurrencyRupee ,MdEditSquare,MdDelete} from "react-icons/md";
import { TiEye } from "react-icons/ti";
import { useNavigate } from 'react-router-dom';


function ProductsGridCard({product,handleProductChange}) {
    const navigate=useNavigate();
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
                  const url=`${PORT}removeProduct/${product.id}`
                  const response = axios.delete(url)
                  console.log(response);
                  if(response==200){
                    handleProductChange();
                    handleSuccess('Product removed ...!')
                  }else{
                    handleError('Something went wrong while removing product')
                  }

                }
              });
       
      
        } catch (error) {
          console.log('error while Removing product',error);    
        }
   }

  return (
    <>

<div className="product-card">
      <img src={product?.p_images[0]} alt={product?.p_images[0]} className="product-image" />
      <h5 className='text-capitalize'>{product?.product}</h5>
      <p className='text-capitalize'><strong>Category:</strong> {product?.category}</p>
      <p>{product?.desc}</p>
      <p><strong>Stock:</strong> {product?.stock}</p>
      <p><strong>Updated At:</strong> {product?.updatedAt}</p>
      <p><strong>Price:</strong><MdCurrencyRupee /> {product?.price}</p>    
      <div className="action-buttons ">
        <div onClick={()=>{navigate('/updateProduct', {state:product.id})}} ><MdEditSquare  className='action-buttons-icon '/></div>
        <div onClick={() => onView(product)} ><TiEye  className='action-buttons-icon' /></div>
        <div onClick={handleRemove}  ><MdDelete  className='action-buttons-icon'/></div>
      </div>
    </div>

    </>
  )
}

export default ProductsGridCard
