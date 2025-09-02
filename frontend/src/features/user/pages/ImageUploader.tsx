import React, { useState } from "react";
import axios from "axios";

interface UploadedImage {
  url: string;
  userId: string;
  type: string;
  likes: number;
}

const ImageUploader: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select a file first!");
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:4000/api/v1/upload/profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-user-id": "sdfsdfr234sdfsd", // <-- add this header
          },
        }
      );

      setUploadedImages([
        ...uploadedImages,
        { ...res.data, likes: 0 } as UploadedImage,
      ]);
      setSelectedFile(null);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (index: number) => {
    const newImages = [...uploadedImages];
    newImages[index].likes += 1;
    setUploadedImages(newImages);
  };

  const handleDelete = (index: number) => {
    const newImages = [...uploadedImages];
    newImages.splice(index, 1);
    setUploadedImages(newImages);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Upload Art Image</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading || !selectedFile}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      <div style={{ marginTop: "20px" }}>
        <div>
          <img src="https://d3cvx09k0cxq21.cloudfront.net/profile/sdfsdfr234sdfsd_avatar.jpg" alt="" className="w-20 h-20" />
        </div>
        {uploadedImages.map((img, index) => (
          <div key={index} style={{ marginBottom: "15px" }}>
            <img
              src={img.url}
              alt="uploaded"
              style={{ width: "200px", display: "block", marginBottom: "5px" }}
            />
            <div>
              <button onClick={() => handleLike(index)}>
                Like ({img.likes})
              </button>
              <button
                onClick={() => handleDelete(index)}
                style={{ marginLeft: "10px" }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
