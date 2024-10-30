import React from 'react'

function ViewProducts() {
  return (
    <>
        <div className="container">
  <div className="product-images">
    <img
      src="http://localhost:4000/products/1729526824320-512534763-iPhone_15_Pro_Max_Natural_Titanium_PDP_Image_Position-1__WWEN.jpg"
      alt="iPhone 15 Pro Max"
      className="main-image"
    />
    <div className="thumbnail-images">
      <img
        src="http://localhost:4000/products/1729573053658-760467043-wp3315252-shri-krishna-hd-wallpaper.jpg"
        alt="Thumbnail 1"
      />
      <img
        src="http://localhost:4000/products/1729574301897-587299812-iPhone_15_Pro_Max_Natural_Titanium_PDP_Image_Position-1__WWEN.jpg"
        alt="Thumbnail 2"
      />
      <img
        src="http://localhost:4000/products/1729574301898-370745806-iPhone_15_Pro_Max_Natural_Titanium_PDP_Image_Position-1__WWEN.jpg"
        alt="Thumbnail 3"
      />
    </div>
  </div>
  <div className="product-details">
    <h1 className="product-title">iPhone 15 Pro Max</h1>
    <p className="price">₹62,999</p>
    <p className="stock">Stock: 1 available</p>
    <p className="description">32 km</p>
    <button className="add-to-cart">Add to Cart</button>
  </div>
  <div className="media-section">
    <h2>Additional Media</h2>
    <div className="media-gallery">
      <video
        controls=""
        src="http://localhost:4000/products/1729574301861-512922546-car glight.mov"
      />
      <video
        controls=""
        src="http://localhost:4000/products/1729574301879-949430002-car glight.mov"
      />
    </div>
  </div>
</div>

    </>
  )
}

export default ViewProducts
