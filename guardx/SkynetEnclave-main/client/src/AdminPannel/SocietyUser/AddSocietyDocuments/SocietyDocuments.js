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
import { RxCrossCircled } from "react-icons/rx";
import { ToastContainer, toast } from "react-toastify";
import { LanguageContext } from "../../../lib/LanguageContext";
import ViewDocumentModal from "./ViewDocumentModal";
import { FiImage, FiVideo } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { FiFileText } from "react-icons/fi"; // Import the icons

const SocietyDocuments = ({ data }) => {
  const id = data;
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [societyMedia, setSocietyMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const imageInputRef = useRef(null);
  const { language } = useContext(LanguageContext);
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map((file) => {
      const fileType = file.type;
      let type = "";
      if (fileType.startsWith("image")) {
        type = "image";
      } else if (
        fileType === "application/pdf" ||
        fileType.includes("msword") ||
        fileType.includes("document")
      ) {
        type = "document";
      }
      return {
        file: file,
        url: URL.createObjectURL(file),
        type: type,
      };
    });
    setImages([...images, ...newFiles]);
  };
  // Submit form data to the API
  const handleSubmit = async () => {
    const formData = new FormData();
    images?.forEach((image, index) => {
      formData.append(`societyDocuments`, image.file);
    });
    try {
      const response = await axios.post(
        `${PORT}/societyDocumentsUpload/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setImages([]);
      if (imageInputRef.current) imageInputRef.current.value = "";
      getSocietyMedia();
      setLoading(false);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };
  const getSocietyMedia = async () => {
    try {
      const response = await axios.get(`${PORT}/getSocietyData`);
      const res = await response.data.societyData;
      const filterData = await res.filter((item) => item._id === id);
      setSocietyMedia(filterData[0].societyDocuments);
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
      const ress = await axios.delete(
        `${PORT}/deleteSocietyDocuments/${id}/${mediaId}`
      );
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
            ? "Upload Society Documents"
            : "समाज के दस्तावेज़ अपलोड करें"}
        </div>
      </div>

      <div className="society-media-main-div">
        <div className="society-images-main-div">
          <div className="society-documents-div">
            <input
              type="file"
              multiple
              accept="image/*,application/pdf,.doc,.docx"
              onChange={handleImageChange}
              ref={imageInputRef}
            />
            <div className="upload-title-with-icon">
              Upload Documents &nbsp;
              <FaImages className="upload-icon" />
            </div>
          </div>
        </div>
        <div className="handle-add-society-media-button">
          <button onClick={handleSubmit} disabled={images.length === 0}>
            {" "}
            <MdOutlineSaveAlt className="add-society-rwa-form-action-buttons-icon" />
            Submit
          </button>
        </div>
        <hr className="hr-society-images-view" />

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
                        societyMedia.map((mediaItem) => {
                          const fileExtension = mediaItem.path.split(".").pop();
                          const isImage = [
                            "jpg",
                            "jpeg",
                            "png",
                            "gif",
                          ].includes(fileExtension);
                          const isPdf = fileExtension === "pdf";

                          return (
                            <tr key={mediaItem._id}>
                              <td>{mediaItem.type.toUpperCase()}</td>
                              <td>
                                {mediaItem.fileName || `Media ${mediaItem._id}`}
                              </td>
                              <td>
                                <ViewDocumentModal
                                  mediaItem={mediaItem}
                                  icon={
                                    isImage ? (
                                      <FiImage />
                                    ) : isPdf ? (
                                      <FiFileText />
                                    ) : null
                                  }
                                />
                              </td>
                              <td>
                                <div
                                  onClick={() =>
                                    handleDeleteMedia(mediaItem._id)
                                  }
                                  className="delete-button"
                                >
                                  <MdDelete />
                                </div>
                              </td>
                            </tr>
                          );
                        })
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
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default SocietyDocuments;
