import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../../layouts/Layout";
import { fetchProducts } from "../../redux/Slice/productsSlice";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { PORT } from "../../PORT/PORT";
import { handleSuccess } from "../../utils/Toastify";
import { ToastContainer } from "react-toastify";
import { FaEye } from "react-icons/fa";
import { IoCaretBackSharp } from "react-icons/io5";

import {
  Button,
  Modal,
  Box,
  IconButton,
  Typography,
  Grid,
  Divider
} from "@mui/material";   
import CloseIcon from "@mui/icons-material/Close";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function UpdateProduct() {
  const [previewFiles, setpreviewFiles] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const id = location.state;

  const [files, setFiles] = useState([]);
  const [media, setMedia] = useState([]);
  const [open, setOpen] = useState(false);
  
  const [previeNewFiles, setpreviewNewFiles] = useState([]);
  const [deletedIndex,setDeletedIndex]=useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [data, setData] = useState({
    product: "",
    category: "",
    subCategory: "",
    price: "",
    stock: "",
    sku: "",
    desc: "",
    weight: "",
    discount: "",
    p_images: "",
  });

  useEffect(() => {
    dispatch(fetchProducts(id));
  }, []);

  const singleProduct = useSelector((state) => state.allProducts.data);

  useEffect(() => {
    if (singleProduct) {
      setData(singleProduct); // Update state with fetched product
      console.log('Fetched product:', singleProduct);
      
      const Pfiles = singleProduct.media?.map((file) => {
        if (file.image) {
          return {
            url: file.image,
            type: 'image/jpeg',
          };
        } else if (file.video) {
          return {
            url: file.video,
            type: 'video/jpeg', // Ensure the type is correct
          };
        }
        return null; // Return null for entries that don't match
      }).filter(file => file !== null); // Filter out any null entries
      console.log('Processed media files:', Pfiles);
      if(Pfiles)
      {
        setpreviewFiles((prevMedia) => Pfiles); // Use spread operator for cleaner concat
      }
     
    }
  }, [singleProduct]);
  

console.log('ppp',previewFiles);

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    setMedia((prevMedia) => prevMedia.concat(files));
    setFiles((files))
    
    const Pfiles = Array.from(e.target.files).map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type,
    }));

    
    setpreviewNewFiles((prevMedia) => prevMedia.concat(Pfiles));
    e.target.value = ""; // Reset input
  };

  const handleRemoveMedia = (index) => {
    deletedIndex.push(index)
    setpreviewFiles((prevMedia) => prevMedia.filter((_, i) => i !== index));
    setMedia((prevMedia) => prevMedia.filter((_, i) => i !== index));
  };
  
  const handleRemoveMediaNew = (index) => {
    setpreviewNewFiles((prevMedia) => prevMedia.filter((_, i) => i !== index))
    setFiles((prevMedia) => prevMedia.filter((_, i) => i !== index));
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    const copyLogiInfo = { ...data };
    copyLogiInfo[name] = value;
    setData(copyLogiInfo);
  };
  console.log("dd", data);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("product", data.product);
      formData.append("category", data.category);
      formData.append("subCategory", data.subCategory);
      formData.append("price", data.price);
      formData.append("stock", data.stock);
      formData.append("sku", data.sku);
      formData.append("desc", data.desc);
      formData.append("weight", data.weight);
      formData.append("discount", data.discount);
      formData.append("del",deletedIndex);
      if (files) {

        files.forEach((file) => {
          formData.append("files", file);
        });
      }
      console.log("ss", data);

      const url = `${PORT}editProduct/${id}`;
      const response = await axios.patch(url, formData, {
        headers: {  
          "content-Type": "multipart/form-data",
        },
      });

      console.log("Response:", response);
      if (response.status === 200) {
        handleSuccess("Record updated successfully");
        setTimeout(() => {
          navigate("/products");
        }, 1000);
      } else {
        handleRemove("Something went wrong while Updating product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <>
      <Layout>
        <div className="container-fluid py-4">
          <div className="row">
            <div className="col-xl-10 col-lg-8 col-md-7 mx-auto">
              <div className="card z-index-0">
                <div className="card-header pt-4" style={{ display: "flex" }}>
                  <button
                    onClick={() => {
                      navigate("/products");
                    }}
                    className="btn btn-primary"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <IoCaretBackSharp />
                    Back
                  </button>
                  <h5 style={{ marginLeft: "35%" }}>Edit product</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="name">Product Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Product Name"
                        aria-label="product"
                        name="product"
                        value={data?.product}
                        onChange={handleChange}
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
                        name="category"
                        value={data?.category}
                        onChange={handleChange}
                        required
                        maxLength={40}
                      >
                        <option onChange={handleChange}></option>
                        <option
                          name="electronic"
                          value={"Electronics"}
                          onChange={handleChange}
                          defaultValue
                        >
                          Electronics
                        </option>
                        <option
                          name="mens"
                          value={"Mens Fashion"}
                          onChange={handleChange}
                        >
                          Mens Fashion
                        </option>
                        <option
                          name="womens"
                          value={"Womens Fashion"}
                          onChange={handleChange}
                        >
                          Womens Fashion
                        </option>
                        <option
                          name="home"
                          value={"Home Decore"}
                          onChange={handleChange}
                        >
                          Home Decore
                        </option>
                        <option
                          name="kids"
                          value={"Kids"}
                          onChange={handleChange}
                        >
                          Kids
                        </option>
                        <option name="Others" value={"Others"}>
                          Others
                        </option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="name">Select Subcategory</label>
                      <select
                        className="form-control"
                        placeholder="Select Cateogry"
                        aria-label="subCategory"
                        name="subCategory"
                        value={data?.subCategory}
                        onChange={handleChange}
                        required
                        maxLength={40}
                      >
                        <option onChange={handleChange}></option>
                        <option name="mobiles" value={"mobiles"} defaultValue>
                          Mobiles
                        </option>
                        <option name="Shoes" value={"Shoes"}>
                          Shoes
                        </option>
                        <option name="Cloths" value={"mobiles"}>
                          Cloths
                        </option>
                        <option name="Televison" value={"Televison"}>
                          Televison
                        </option>
                        <option name="Laptop" value={"Laptop"}>
                          Laptop
                        </option>
                        <option name="Others" value={"Others"}>
                          Others
                        </option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label>Price</label>{" "}
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Item Price"
                        aria-label="price"
                        name="price"
                        value={data?.price}
                        onChange={handleChange}
                        required
                        maxLength={40}
                      />
                    </div>

                    <div className="mb-3">
                      <label>Weight (kg)</label>{" "}
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Item Weight"
                        aria-label="weight"
                        name="weight"
                        value={data?.weight}
                        onChange={handleChange}
                        required
                        maxLength={40}
                      />
                    </div>

                    <div className="mb-3">
                      <label>Stock </label>{" "}
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Item Stock"
                        aria-label="stock"
                        name="stock"
                        value={data?.stock}
                        onChange={handleChange}
                        required
                        maxLength={40}
                      />
                    </div>

                    <div className="mb-3">
                      <label>SKU</label>{" "}
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Item SKU"
                        aria-label="sku"
                        name="sku"
                        value={data?.sku}
                        onChange={handleChange}
                        required
                        maxLength={40}
                      />
                    </div>

                    <div className="mb-3">
                      <label>Discount </label>{" "}
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Discount if any"
                        aria-label="discount"
                        name="discount"
                        value={data?.discount}
                        onChange={handleChange}
                        required
                        maxLength={3}
                      />
                    </div>

                    <div className="mb-3">
                      <label>Product Desription</label>
                      <textarea
                        className="form-control"
                        placeholder="Enter Product Desription"
                        aria-label="Password"
                        rows={5}
                        name="desc"
                        value={data?.desc}
                        onChange={handleChange}
                        maxLength={140}
                      />
                    </div>
                   

                        {/*  */}

                        <div
                      className="mb-3"
                      style={{
                        alignContent: "center",
                        display: "flex",
                      }}
                    >
                      <input
                        type="file"
                        className="form-control"
                        aria-label="files"
                        name="files"
                        onChange={handleMediaChange}
                        multiple
                      />
                      <span
                        variant="outlined"
                        onClick={handleOpen}
                        style={{
                          alignContent: "center",
                          marginLeft: "-30px",
                        }}
                      >
                        <FaEye />
                      </span>
                    </div>
                    <Modal open={open} onClose={handleClose}>
  <Box 
    sx={{ 
      bgcolor: 'white', 
      borderRadius: '10px', 
      boxShadow: 24, 
      padding: 3, 
      maxWidth: '800px', 
      margin: 'auto', 
      maxHeight: '80vh', 
      overflowY: 'auto' 
    }}
  >
    <Grid container spacing={2}>
      {previewFiles.length > 0 ? (
        previewFiles.map((item, index) => (
          <Grid item xs={4} key={index}>
            <Box 
              position="relative" 
              sx={{ 
                borderRadius: '10px', 
                overflow: 'hidden', 
                boxShadow: 2, 
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.05)' }
              }}
            >
              {item?.type?.startsWith("image/") ? (
                <img
                  src={item?.url}
                  alt={`Uploaded ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "150px", 
                    objectFit: "cover", 
                    borderRadius: "8px"
                  }}
                />
              ) : (
                <video
                  src={item?.url}
                  controls
                  style={{
                    width: "100%",
                    height: "150px", 
                    borderRadius: "8px",
                  }}
                />
              )}
              <IconButton
                onClick={() => handleRemoveMedia(index)}
                aria-label={`Remove ${item?.type?.startsWith("image/") ? "image" : "video"} ${index + 1}`}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  margin: 0,
                  color: "white",
                  bgcolor: "red",
                  '&:hover': { bgcolor: 'darkred' },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <Typography variant="body1" color="gray">No uploaded media.</Typography>
        </Grid>
      )}
    </Grid>

    <Divider sx={{ my: 3,color: "black" ,bgcolor: "black"}} />

    <Grid container spacing={2}>
      {previeNewFiles.length > 0 ? (
        previeNewFiles.map((item, index) => (
          <Grid item xs={4} key={index}>
            <Box 
              position="relative" 
              sx={{ 
                borderRadius: '10px', 
                overflow: 'hidden', 
                boxShadow: 2, 
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.05)' }
              }}
            >
              {item?.type?.startsWith("image/") ? (
                <img
                  src={item?.url}
                  alt={`New upload ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "150px", 
                    objectFit: "cover", 
                    borderRadius: "8px"
                  }}
                />
              ) : (
                <video
                  src={item?.url}
                  controls
                  style={{
                    width: "100%",
                    height: "150px", 
                    borderRadius: "8px",
                  }}
                />
              )}
              <IconButton
                onClick={() => handleRemoveMediaNew(index)}
                aria-label={`Remove new ${item?.type?.startsWith("image/") ? "image" : "video"} ${index + 1}`}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  margin: 0,
                  color: "white",
                  bgcolor: "red",
                  '&:hover': { bgcolor: 'darkred' },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <Typography variant="body1" color="gray">No new uploads.</Typography>
        </Grid>
      )}
    </Grid>
  </Box>
</Modal>

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
          <ToastContainer />
        </div>
      </Layout>
    </>
  );
}

export default UpdateProduct;
