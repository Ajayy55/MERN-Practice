import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageIcon from "@mui/icons-material/Image";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import DeleteIcon from "@mui/icons-material/Delete";

export default function UploadForm() {
  const [files, setFiles] = useState([]);

  const handleFileUpload = (event, type) => {
    const uploadedFiles = Array.from(event.target.files).map((file) => ({
      type,
      name: file.name,
      preview: URL.createObjectURL(file),
    }));
    setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  return (
    <Box
      sx={{
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "#fff",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          backgroundColor: "#3f51b5",
          color: "#fff",
          padding: "10px",
          textAlign: "center",
          borderRadius: "4px",
          marginBottom: "20px",
        }}
      >
        <CloudUploadIcon sx={{ marginRight: "8px" }} />
        Upload Society Images and Videos
      </Typography>

      {/* Upload Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
          gap: "10px",
        }}
      >
        <Button
          variant="outlined"
          component="label"
          startIcon={<ImageIcon />}
          sx={{ flex: 1 }}
        >
          Choose Files
          <input
            type="file"
            hidden
            accept="image/*"
            multiple
            onChange={(e) => handleFileUpload(e, "Image")}
          />
        </Button>
        <Button
          variant="outlined"
          component="label"
          startIcon={<VideoLibraryIcon />}
          sx={{ flex: 1 }}
        >
          Choose File
          <input
            type="file"
            hidden
            accept="video/*"
            multiple
            onChange={(e) => handleFileUpload(e, "Video")}
          />
        </Button>
      </Box>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ marginBottom: "20px" }}
      >
        Submit
      </Button>

      {/* Table for Uploaded Files */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>File Name</TableCell>
              <TableCell>Preview</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {files.length > 0 ? (
              files.map((file, index) => (
                <TableRow key={index}>
                  <TableCell>{file.type}</TableCell>
                  <TableCell>{file.name}</TableCell>
                  <TableCell>
                    {file.type === "Image" ? (
                      <img
                        src={file.preview}
                        alt={file.name}
                        style={{ width: "50px", height: "50px" }}
                      />
                    ) : (
                      <video
                        src={file.preview}
                        controls
                        style={{ width: "50px", height: "50px" }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveFile(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No Media Available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
