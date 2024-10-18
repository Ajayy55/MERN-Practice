import React, { useState } from 'react'
import Products from './Products'
import Layout from '../../layouts/Layout'
import { Formik, useFormik } from 'formik';
import {SignUpSchema} from './../../schema';
import { handleError, handleSuccess } from '../../utils/Toastify';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import { PORT } from '../../PORT/PORT';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
const initialValues = {
    product: '',
    category: '',
    subCategory: '',
    price: '',
    stock: "",
    sku: "",
    desc:"",
    weight:"",
    discount:"",
    p_images:[],
}

function AddProducts() {
    const navigate=useNavigate();
    const [files,setFiles]=useState();
    const { values, errors, handleBlur, touched,handleChange, handleSubmit } = useFormik({
        initialValues: initialValues,
        // validationSchema:SignUpSchema,
        onSubmit: async(values) => {
           try {           
            console.log(values);
            console.log('fdfdfdfd',files);
            const formData = new FormData();
             
            formData.append("files", files);
            formData.append("filename", files.name); 
        
        
            for (const key in values) {
                formData.append(key, values[key]);
              } 
            console.log('formdata',formData);
            
            
             const url=`${PORT}addProduct`;
             const response=await axios.post(url,formData,{
                headers: {
                  "content-Type": "multipart/form-data",
                },
              });
             console.log(response);
            
                if(response?.status===201){
                    handleSuccess(response?.data?.message)
                    setTimeout(()=>{navigate('/products')},1000)
                }

           } catch (error) {
            console.log('error while Signup ',error);
            handleError(error?.response?.data.message)
           }
        },
    }
    )
  return (
  
    <>
    <Layout>
     <div className="container-fluid py-4">
  <div className="row">
   
       <div className="col-xl-10 col-lg-8 col-md-7 mx-auto">
         <div className="card z-index-0">
           <div className="card-header text-center pt-4">
             <h5>Add product</h5>
           </div>
           <div className="card-body">
             <form onSubmit={handleSubmit}>
               <div className="mb-3">
                 <label htmlFor="name">Product Name</label><input
                   type="text"
                   className="form-control"
                   placeholder="Product Name"
                   aria-label="product"
                   name='product'
                   value={values.product} onChange={handleChange} onBlur={handleBlur}
                   required
                   maxLength={40}
                 />
               </div>

               <div className="mb-3">
                 <label htmlFor="name">Select category</label>
                 <select
                   className="form-control"
                   placeholder="Select Cateogry"
                   aria-label="category"
                   name='category'
                   value={values.category} onChange={handleChange} onBlur={handleBlur}
                   required
                   maxLength={40}
                 >  
                 <option name="electronic" value={"Electronics"} onChange={handleChange} defaultValue>Electronics</option>
                 <option name="mens" value={"Mens Fashion"} onChange={handleChange}>Mens Fashion</option>
                 <option name="womens" value={"Womens Fashion"} onChange={handleChange}>Womens Fashion</option>
                 <option name="home" value={"Home Decore"} onChange={handleChange}>Home Decore</option>
                 <option name="kids" value={"Kids"} onChange={handleChange}>Kids</option>
                 </select>
               </div>

               <div className="mb-3">
                 <label htmlFor="name">Select Subcategory</label>
                 <select
                   className="form-control"
                   placeholder="Select Cateogry"
                   aria-label="subCategory"
                   name='subCategory'
                   value={values.username} onChange={handleChange} onBlur={handleBlur}
                   required
                   maxLength={40}
                 >  
                 <option name="Cloths" value={"Cloths"} defaultValue>Mobiles</option>
                 <option name="Shoes" value={"Shoes"}>Shoes</option>
                 <option name="mobiles" value={"mobiles"}>Cloths</option>
                 <option name="Televison" value={"Televison"}>Televison</option>
                 <option name="Laptop" value={"Laptop"}>Laptop</option>
                 </select>
                {errors.username&& touched.username ?(<span className='text-danger text-sm'>{errors.username}</span>):null}
               </div>

               <div className="mb-3">
                <label>Price</label> <input
                   type="number"
                   className="form-control"
                   placeholder="Item Price"
                   aria-label="price"
                   name='price'
                   value={values.mobile} onChange={handleChange} onBlur={handleBlur}
                   required
                   maxLength={40}
                 />
               </div>

               <div className="mb-3">
                <label>Weight (kg)</label> <input
                   type="number"
                   className="form-control"
                   placeholder="Item Weight"
                   aria-label="weight"
                   name='weight'
                   value={values.mobile} onChange={handleChange} onBlur={handleBlur}
                   required
                   maxLength={40}
                 />
               </div>

               <div className="mb-3">
                <label>Stock </label> <input
                   type="number"
                   className="form-control"
                   placeholder="Item Stock"
                   aria-label="stock"
                   name='stock'
                   value={values.mobile} onChange={handleChange} onBlur={handleBlur}
                   required
                   maxLength={40}
                 />
               </div>

               <div className="mb-3">
                <label>SKU</label> <input
                   type="text"
                   className="form-control"
                   placeholder="Item SKU"
                   aria-label="sku"
                   name='sku'
                   value={values.mobile} onChange={handleChange} onBlur={handleBlur}
                   required
                   maxLength={40}
                 />
               </div>

               <div className="mb-3">
                <label>Discount </label> <input
                   type="number"
                   className="form-control"
                   placeholder="Discount if any"
                   aria-label="discount"
                   name='discount'
                   value={values.mobile} onChange={handleChange} onBlur={handleBlur}
                   required
                   maxLength={3}
                 />
               </div>   

        
               <div className="mb-3">
                 <label>Product Desription</label><textarea
                   className="form-control"
                   placeholder="Enter Product Desription"
                   aria-label="Password"
                   rows={5}
                   name='desc'
                   value={values.password} onChange={handleChange} onBlur={handleBlur}
                   maxLength={140}
                 />
               </div>
               <div className="mb-3">
                 <input
                   type="file"
                   className="form-control"
                   placeholder="Confirm Password"
                   aria-label="Password"
                   name='files'
                   value={values.password1} onChange={(e)=>{ 
                    setFiles(e.target.files[0])
                    console.log('wwww',e.target.files);
                    
                }} 
                   multiple
                 />
               </div>
              
               <div className="text-center">
                 <button
                   type="submit"
                   className="btn bg-gradient-dark w-100 my-4 mb-2"
                 >
                   Add Product
                 </button>
               </div>
            
             </form>
           </div>
         </div>
       </div>
  </div>
  </div>

  </Layout>
  <ToastContainer/>
    </>
  )
}

export default AddProducts
