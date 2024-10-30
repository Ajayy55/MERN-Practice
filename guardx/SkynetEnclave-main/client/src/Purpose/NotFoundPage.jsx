import React from 'react'
import imgError from './Images/error.gif'
function NotFoundPage() {
  return (
    <div className='page-not-found'>
        <img src={imgError} alt="" />
        <h1>404 Not found </h1>
    </div>
  )
}

export default NotFoundPage