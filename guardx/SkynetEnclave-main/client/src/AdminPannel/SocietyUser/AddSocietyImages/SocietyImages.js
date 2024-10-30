import React, { useContext, useEffect, useRef } from "react";
import "./style.css";
import axios from "axios";
import { FaImages } from "react-icons/fa";

import { useState } from "react";
import { PORT } from "../../../Api/api";
import { FaUpload } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import { MdOutlineSaveAlt } from "react-icons/md";
import Loading from "../../../Loading/Loading";
import { FaTrash } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";
import { toast, ToastContainer } from "react-toastify";
import { LanguageContext } from "../../../lib/LanguageContext";
import ViewImagesModal from "./ViewImagesModal";
import { FiImage, FiVideo } from 'react-icons/fi';
import { MdDelete } from "react-icons/md";

const SocietyImages = ({ data }) => {
  const id = data;
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [societyMedia, setSocietyMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const { language } = useContext(LanguageContext);
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files
      .filter((file) => file.type.startsWith("image"))
      .map((file) => ({
        file: file,
        url: URL.createObjectURL(file),
        type: "image",
      }));
    setImages([...images, ...newImages]);
  };

  // Handle video upload
  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    const newVideos = files
      .filter((file) => file.type.startsWith("video"))
      .map((file) => ({
        file: file,
        url: URL.createObjectURL(file),
        type: "video",
      }));
    setVideos([...videos, ...newVideos]);
  };

  // Submit form data to the API
  const handleSubmit = async () => {
    const formData = new FormData();

    // Append images to form data
    images?.forEach((image, index) => {
      formData.append(`images`, image.file);
    });

    // Append videos to form data
    videos?.forEach((video, index) => {
      formData.append(`videos`, video.file);
    });

    try {
      // Send POST request to the API
      const response = await axios.post(
        `${PORT}/societyMediaUpload/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setImages([]);
      setVideos([]);
      if (imageInputRef.current) imageInputRef.current.value = "";
      if (videoInputRef.current) videoInputRef.current.value = "";
      getSocietyMedia();
      console.log("Success:", response.data);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };
  const getSocietyMedia = async () => {
    try {
      const response = await axios.get(`${PORT}/getSocietyData`);
      const res = await response.data.societyData;
      const filterData = await res.filter((item) => item._id === id);
      setSocietyMedia(filterData[0].media);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching society data:", error);
    }
  };
  useEffect(() => {
    getSocietyMedia();
  }, []);
  const handleDeleteMedia = async (mediaId) => {
    try {
      await axios.delete(`${PORT}/deleteSocietyMedia/${id}/${mediaId}`);
      setSocietyMedia((prevMedia) =>
        prevMedia.filter((item) => item._id !== mediaId)
      );
      toast.success("Deleted");
    } catch (error) {
      console.error("Error deleting media:", error);
    }
  };
  return (
    <>
      <div className="top-society-images-heading-div">
        <div className="top-society-images-heading-icon-div">
          {" "}
          <FaUpload />
          &nbsp;{" "}
          {language === "hindi"
            ? "Upload Society Images and Videos"
            : "समाज की छवियों और वीडियो को अपलोड करें"}
        </div>
      </div>

      <div className="society-media-main-div">
        <div className="society-images-main-div">
          <div className="society-images-div">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              ref={imageInputRef}
            />
            <div className="upload-title-with-icon">
              Upload Images &nbsp;
              <FaImages className="upload-icon" />
            </div>
          </div>

          <div className="society-images-and-video-main-div">
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              ref={videoInputRef}
            />
            <div className="upload-title-with-icon">
              Upload Videos &nbsp;
              <FaVideo className="upload-icon" />
            </div>
          </div>
        </div>
        <div className="handle-add-society-media-button">
          <button
            onClick={handleSubmit}
            disabled={images.length === 0 && videos.length === 0}
          >
            {" "}
            <MdOutlineSaveAlt className="add-society-rwa-form-action-buttons-icon" />
            Submit
          </button>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <div className="view-society-media-main-div">
            <div className="view-society-media-image-content">
              <div className="view-society-media-container">
                <div className="view-society-media-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>File Name</th>
                        <th>Preview</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {societyMedia.length > 0 ? (
                        societyMedia.map((mediaItem) => (
                          <tr key={mediaItem._id}>
                            <td>{mediaItem.type.toUpperCase()}</td>
                            <td>
                              {mediaItem.fileName || `Media ${mediaItem._id}`}
                            </td>
                            <td>
                          
                              <ViewImagesModal  mediaItem={mediaItem}  icon={mediaItem.type === 'image' ? <FiImage /> : <FiVideo />} />
                            </td>
                            <td>
                              <div
                                onClick={() => handleDeleteMedia(mediaItem._id)}
                                className="delete-button"
                              >
                              <MdDelete/>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="no-data">
                            No Media available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="view-society-media-center-line"></div>
            {/* <div className="view-society-media-video-content">
              {societyMedia.filter((mediaItem) => mediaItem.type === "video")
                .length > 0 ? (
                societyMedia.map((mediaItem) => {
                  if (mediaItem.type === "video") {
                    return (
                      <>
                        <div
                          onClick={() => handleDeleteMedia(mediaItem._id)}
                          className="delete-button-video"
                        >
                          <RxCrossCircled />
                        </div>
                        <video
                          key={mediaItem._id}
                          controls
                          className="society-media-video"
                        >
                          <source
                            src={`http://localhost:2512/${mediaItem.path?.replace(
                              "public/",
                              ""
                            )}`}
                            type="video/mp4"
                          />{" "}
                          Your browser does not support the video tag.
                        </video>
                      </>
                    );
                  }
                  return null;
                })
              ) : (
                <p className="no-data-for-image">No Videos available</p>
              )}
            </div> */}
          </div>
        )}
        <ToastContainer />
      </div>
    </>
  );
};

export default SocietyImages;
