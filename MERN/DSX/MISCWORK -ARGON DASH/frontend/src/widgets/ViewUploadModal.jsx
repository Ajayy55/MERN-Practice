// import React, { useState } from 'react';
// import {
//   Button,
//   Modal,
//   Box,
//   IconButton,
//   Typography,
//   Grid,
// } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';

// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'background.paper',
//   border: '2px solid #000',
//   boxShadow: 24,
//   p: 4,
// };

// const ImageUploadModal = () => {
//   const [images, setImages] = useState([]);
//   const [open, setOpen] = useState(false);

//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
//     setImages((prevImages) => prevImages.concat(files));
//     e.target.value = ''; // Reset the input value to allow re-upload of the same file
//   };

//   const handleRemoveImage = (index) => {
//     setImages((prevImages) => prevImages.filter((_, i) => i !== index));
//   };

//   return (
//     <div>
//       <h5 variant="outlined" onClick={handleOpen}>
//         Upload Images
//       </h5>
//       <Modal
//         open={open}
//         onClose={handleClose}
//       >
//         <Box sx={style}>
//           <Typography variant="h6" component="h2" gutterBottom>
//             Upload and View Images
//           </Typography>
//           <input
//             type="file"
//             accept="image/*,video/*"
//             multiple
//             onChange={handleImageChange}
//             style={{ marginBottom: '16px' }}
//           />
//           <Grid container spacing={2}>
//             {images.map((image, index) => (
//               <Grid item xs={4} key={index}>
//                 <Box position="relative">
//                   <img
//                     src={image}
//                     alt={`Uploaded Preview ${index + 1}`}
//                     style={{ width: '100%', borderRadius: '8px' }}
//                   />
//                   <IconButton
//                     onClick={() => handleRemoveImage(index)}
//                     style={{
//                       position: 'absolute',
//                       top: -15,
//                       right: -15,
//                       color: 'Black',
//                       border:'2',
//                       borderRadius: '50%' 
//                     }}
//                   >
//                     <CloseIcon />
//                   </IconButton>
//                 </Box>
//               </Grid>
//             ))}
//           </Grid>
//         </Box>
//       </Modal>
//     </div>
//   );
// };

// export default ImageUploadModal;
