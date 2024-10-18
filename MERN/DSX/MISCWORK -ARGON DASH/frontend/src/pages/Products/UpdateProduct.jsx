import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Layout from '../../layouts/Layout';
import { fetchProducts } from '../../redux/Slice/productsSlice';
import { useSelector,useDispatch } from 'react-redux'
import axios from 'axios';
import { PORT } from '../../PORT/PORT';
import { handleSuccess } from '../../utils/Toastify';
import { ToastContainer } from 'react-toastify';

function UpdateProduct() {
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const location=useLocation()
    const id=location.state;
    const [file,setFiles]=useState();

    const [data,setData]=useState( {
        product: '',
        category: '',
        subCategory: '',
        price: '',
        stock: "",
        sku: "",
        desc:"",
        weight:"",
        discount:"",
        p_images:"",
    })
    
    useEffect(()=>{
      dispatch(fetchProducts(id))
    },[]);

  const singleProduct=useSelector(state=>state.allProducts.data);
  
  useEffect(() => {
    if (singleProduct) {
        setData(singleProduct); // Update state with fetched product
    }
}, [singleProduct]);
  

    
    const handleChange=(e)=>{
        const { name, value } = e.target;
        console.log(name, value);
        const copyLogiInfo = { ...data };
        copyLogiInfo[name] = value;
        setData(copyLogiInfo);
    }
    console.log('dd',data);
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("product",data.product)
            formData.append("category",data.category)
            formData.append("subCategory",data.subCategory)
            formData.append("price",data.price)
            formData.append("stock",data.stock)
            formData.append("sku",data.sku)
            formData.append("desc",data.desc)
            formData.append("weight",data.weight)
            formData.append("discount",data.discount)
            if (file) {
                formData.append("files", file);
                formData.append("filename", file.name);
            }
            console.log('ss',data);
            
            const url = `${PORT}editProduct/${id}`;
            const response = await axios.patch(url,formData,{
                headers: {
                  "content-Type": "multipart/form-data",
                },
              });

            console.log('Response:', response);
            if(response.status===200){
                handleSuccess('Record updated successfully')
                setTimeout(()=>{navigate('/products')},1000)

            }else{
                handleRemove('Something went wrong while Updating product')
              }

        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    // const handleSubmit=async(e)=>{
    //     e.preventDefault();
     
          
    //     try { 

    //         const formData = new FormData();
    //         formData.append("files", file);
    //         formData.append("filename", file.name); 
        
        
    //           console.log('form data',formData);

    //        const url=`${PORT}editProduct/${id}` 
    //         const response=await axios.post(url,data,formData,{
    //             headers: {
    //               "content-Type": "multipart/form-data",
    //             },
    //           })

    //     } catch (error) {
    //         console.log('error occured whilr updating product',error);   
    //     }


    // }
    

  return (
    <>
          <Layout>
     <div className="container-fluid py-4">
  <div className="row">
       <div className="col-xl-10 col-lg-8 col-md-7 mx-auto">
         <div className="card z-index-0">
           <div className="card-header text-center pt-4">
             <h5>Edit product</h5>
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
                   value={data?.product} onChange={handleChange} 
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
                   value={data?.category} onChange={handleChange} 
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
                   value={data?.subCategory} onChange={handleChange} 
                   required
                   maxLength={40}
                 >  
                 <option name="Cloths" value={"Cloths"} defaultValue>Mobiles</option>
                 <option name="Shoes" value={"Shoes"}>Shoes</option>
                 <option name="mobiles" value={"mobiles"}>Cloths</option>
                 <option name="Televison" value={"Televison"}>Televison</option>
                 <option name="Laptop" value={"Laptop"}>Laptop</option>
                 </select>
               </div>

               <div className="mb-3">
                <label>Price</label> <input
                   type="number"
                   className="form-control"
                   placeholder="Item Price"
                   aria-label="price"
                   name='price'
                   value={data?.price} onChange={handleChange} 
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
                   value={data?.weight} onChange={handleChange} 
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
                   value={data?.stock} onChange={handleChange} 
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
                   value={data?.sku} onChange={handleChange} 
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
                   value={data?.discount} onChange={handleChange} 
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
                   value={data?.desc} onChange={handleChange} 
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
                    onChange={(e)=>{ 
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
                   Update Product
                 </button>
               </div>
            
             </form>
           </div>
         </div>
       </div>
  </div>
  <ToastContainer/>
  </div>

  </Layout>
    
    </>
  )
}

export default UpdateProduct
