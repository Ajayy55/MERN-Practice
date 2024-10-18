import React, { useEffect, useState } from 'react'
import Layout from '../../layouts/Layout'
import ProductsListCard from '../../widgets/cards/ProductsListCard'
import { useSelector,useDispatch } from 'react-redux'
import { fetchProducts } from '../../redux/Slice/productsSlice'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const Products = () => {
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const location = useLocation();

  useEffect(()=>{
    dispatch(fetchProducts())

  },[dispatch,location]);

    const products=useSelector(state=>state.allProducts.data)
    
  return (
    <>
    <Layout>
    <div className="container-fluid py-4">
  <div className="row">
    <div className="col-12">
      <div className="card mb-4">
        <div className="card-header pb-0" style={{ display: 'flex', justifyContent: 'space-between' }}>
          Products table
          <Link to='/addProduct' className='btn btn-primary'>Add Product +</Link>
        </div>
        <div className="card-body px-0 pt-0 pb-2">
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
                  <th className="text-uppercase text-secondary text-center text-xxs font-weight-bolder opacity-7 ps-2">
                  Action
                  </th>                 
                  <th className="text-secondary opacity-7" />
                </tr>
              </thead>
              <tbody>
                 {products && products?.map((el,index)=><ProductsListCard key={index} data={el}/>)} 
        
              </tbody>
            </table>
          </div>
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
