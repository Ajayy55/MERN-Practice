import React, { useState } from 'react';
import {
  Button,
  Modal,
  Box,
  IconButton,
  Typography,
  Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: 800,
  bgcolor: 'background.paper',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
  transition: 'all 0.3s ease-in-out', // Smooth transition for opening/closing
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative', // Make sure the modal content is positioned for the close button
};

const fileInputStyle = {
  display: 'none',
};

const buttonStyle = {
  backgroundColor: '#4CAF50',
  color: '#fff',
  padding: '12px 24px',
  borderRadius: '8px',
  fontWeight: 'bold',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#45a049',
  },
};

const previewStyle = {
  width: '100%',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease-in-out', // Add smooth animation to scale images
};

const modalTitleStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#333',
  marginBottom: '16px',
};

const removeButtonStyle = {
  position: 'absolute',
  top: '8px',
  right: '8px',
  color: 'white',
  backgroundColor: 'rgba(255, 0, 0, 0.7)',
  '&:hover': {
    backgroundColor: 'rgba(255, 0, 0, 0.9)',
  },
};

const closeModalButtonStyle = {
  position: 'absolute',
  top: '8px',
  right: '8px',
  color: '#333',
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
};

const UploadModal = () => {
  const [media, setMedia] = useState([]);
  const [open, setOpen] = useState(true);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files).map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type,
    }));
    setMedia((prevMedia) => prevMedia.concat(files));
    e.target.value = ''; // Reset input after selecting files
  };

  const handleRemoveMedia = (index) => {
    setMedia((prevMedia) => prevMedia.filter((_, i) => i !== index));
  };

  return (
    <div>
      <Button variant="contained" sx={buttonStyle} onClick={handleOpen}>
        Upload Images/Videos
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          {/* Close button */}
          <IconButton sx={closeModalButtonStyle} onClick={handleClose}>
            <CloseIcon />
          </IconButton>

          <Typography sx={modalTitleStyle}>Upload and View Media</Typography>

          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleMediaChange}
            style={fileInputStyle}
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button variant="outlined" component="span" sx={buttonStyle}>
              Choose Files
            </Button>
          </label>

          <Grid container spacing={2} mt={2}>
            {media.map((item, index) => (
              <Grid item xs={4} key={index}>
                <Box position="relative">
                  {item.type.startsWith('image/') ? (
                    <img
                      src={item.url}
                      alt={`Uploaded ${index + 1}`}
                      style={{
                        ...previewStyle,
                        transform: 'scale(1)',
                      }}
                      className="media-preview"
                    />
                  ) : (
                    <video
                      src={item.url}
                      controls
                      style={previewStyle}
                    />
                  )}
                  <IconButton
                    onClick={() => handleRemoveMedia(index)}
                    sx={removeButtonStyle}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Modal>
    </div>
  );
};

export default UploadModal;
