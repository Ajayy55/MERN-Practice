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
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const UploadModal = () => {
  const [media, setMedia] = useState([]);
  const [open, setOpen] = useState(true);

  const handleOpen = () => setOpen(false);
  const handleClose = () => setOpen(false);

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files).map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type,
    }));
    setMedia((prevMedia) => prevMedia.concat(files));
    e.target.value = ''; // Reset input
  };

  const handleRemoveMedia = (index) => {
    setMedia((prevMedia) => prevMedia.filter((_, i) => i !== index));
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleOpen}>
        Upload Images/Videos
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>
          <Typography variant="h6" component="h2" gutterBottom>
            Upload and View Media
          </Typography>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleMediaChange}
            style={{ marginBottom: '16px' }}
          />
          <Grid container spacing={2}>
            {media.map((item, index) => (
              <Grid item xs={4} key={index}>
                <Box position="relative">
                  {item.type.startsWith('image/') ? (
                    <img
                      src={item.url}
                      alt={`Uploaded ${index + 1}`}
                      style={{ width: '100%', borderRadius: '8px' }}
                    />
                  ) : (
                    <video
                      src={item.url}
                      controls
                      style={{ width: '100%', borderRadius: '8px' }}
                    />
                  )}
                  <IconButton
                    onClick={() => handleRemoveMedia(index)}
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      color: 'red',
                    }}
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
