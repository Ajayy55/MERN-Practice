import React, { useEffect, useState } from 'react'
import Layout from '../../layouts/Layout'
import ProductsListCard from '../../widgets/cards/ProductsListCard'
import { useSelector,useDispatch } from 'react-redux'
import { fetchProducts } from '../../redux/Slice/productsSlice'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { IoGrid } from "react-icons/io5";
import { FaThList } from "react-icons/fa";
import ProductsGridCard from '../../widgets/cards/ProductsGridCard'
import './../../widgets/cards/ProductGridCard.css'


const Products = () => {
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const location = useLocation();
  const [grid,setGrid]=useState(false);
  const [changeFlag,setChangeFlag]=useState(false)
  
  
  const handleProductChange = () => {
    console.log('handle change');
    
    setChangeFlag(changeFlag?1:0)
    console.log('flag changed');
    
  };
  useEffect(()=>{
    dispatch(fetchProducts())

  },[dispatch,changeFlag]);

 

    const products=useSelector(state=>state.allProducts.data)
    
  return (  
    <>
    <Layout>
    <div className="container-fluid py-4">
  <div className="row">
    <div className="col-12">
      <div className="card mb-4">
        <div className="card-header pb-0" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span> Products View  
          <Link className='mx-2  text-bold shadow view-toggle' onClick={()=>{!grid ? setGrid(true) : setGrid(false)}}>{grid? <IoGrid className='align-middle mb-1  '/> : <FaThList className='align-middle mb-1 ' />}
          </Link></span>
          <Link to='/addProduct' className='btn btn-primary'>Add Product +</Link>
        </div>
        <div className="card-body px-0 pt-0 pb-2">
         {!grid ?<>
          <div className="table-responsive p-0">
            <table className="table align-items-center mb-0">
              <thead>
                <tr>
                  <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                    Product
                  </th>
                  <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                    Category
                  </th>
                  <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                  Description
                  </th>
                  <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                  Stock
                  </th>
                  <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2" >
                  Updated  At
                  </th>
                  <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                  Price
                  </th>
                  <th className="text-uppercase text-secondary text-LEFT text-xxs font-weight-bolder opacity-7 ps-2">
                  Action's
                  </th>                 
                  <th className="text-secondary opacity-7" />
                </tr>
              </thead>
              <tbody>
                 { products?.length>0?products && products?.map((el,index)=><ProductsListCard key={index} data={el}/>):<></>} 
              </tbody>
            </table>
          </div>
          </> 
          :<>
              <div className="product-grid">
              { products?.length>0?products.map((el,index)=><ProductsGridCard key={index} product={el} onProductChange={handleProductChange}/>):<></>} 
              </div>
          </>}
        </div>
      </div>
    </div>
  </div>
  </div>
 
    </Layout>
    </>

  )
}

export default Products
