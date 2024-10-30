// import React, { useState } from "react";
// import Box from "@mui/material/Box";
// import Button from "@mui/material/Button";
// import Typography from "@mui/material/Typography";
// import Modal from "@mui/material/Modal";
// import "./view.css";
// import { useEffect } from "react";
// import { RxCross2 } from "react-icons/rx";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 400,
//   bgcolor: "background.paper",
//   boxShadow: 24,
//   p: 4,
//   zIndex: "10000000",
// };

// const RegularView = (props) => {
//   // console.log(props.data.blob)
//   const [open, setOpen] = React.useState(false);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);
//   const [images, setImagesView] = useState();
//   useEffect(() => {
//     if (props.data && Array.isArray(props.data)) {
//       setImagesView(props.data);
//     }
//   }, [props.data]);

//   return (
//     <div>
//       <h6 onClick={handleOpen}>view</h6>
//       <Modal
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//       >
//         <Box sx={style}>
//           {/* Images View */}
//           <div className="images_view">
//             {images?.length > 0 ? (
//               images.map((item, index) => (
//                 <div key={index}>
//                   <img src={item} alt={`Image ${index}`} />
//                 </div>
//               ))
//             ) : (
//               <Typography>No images available</Typography>
//             )}
//           </div>
//           <div className="cross_button">
//             <h5 className="" onClick={handleClose}>
//               <RxCross2></RxCross2>
//             </h5>
//           </div>
//         </Box>
//       </Modal>
//     </div>
//   );
// };

// export default RegularView;
