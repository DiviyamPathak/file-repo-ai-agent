import React, { useState } from "react";
import axios from "axios";
import { Upload } from "lucide-react";
import "../FileUpload.css"; // Optional for custom styling

const FileUpload = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [tags, setTags] = useState("");
  const [uploading, setUploading] = useState(false);
  const API_URL = "https://flask-backend-635915852841.asia-south2.run.app/upload"; // Flask API endpoint

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleTagsChange = (event) => {
    setTags(event.target.value);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("tags", tags);

    setUploading(true);
    try {
      const response = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(response.data.message || "File uploaded successfully!");
      setSelectedFile(null);
      setTags("");
      if (onUpload) onUpload(); // Notify parent to refresh file list
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload the file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-upload">
      <input
        type="file"
        onChange={handleFileChange}
        className="file-input"
        disabled={uploading}
      />
      <input
        type="text"
        value={tags}
        onChange={handleTagsChange}
        placeholder="Enter tags (comma-separated)"
        className="tags-input"
        disabled={uploading}
      />
      <button onClick={handleUpload} disabled={uploading || !selectedFile} className="upload-button">
        {uploading ? "Uploading..." : <><Upload className="upload-icon" /> Upload</>}
      </button>
    </div>
  );
};

export default FileUpload;
