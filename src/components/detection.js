import React, { useState } from "react";
import axios from "axios";

const DetectionPage = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDetect = async () => {
    if (!image) {
      alert("Please upload an image first.");
      return;
    }

    setLoading(true);

    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onloadend = async () => {
      const base64Image = reader.result.split(",")[1];

      try {
        const response = await axios.post(
          "https://detect.roboflow.com/fursaver-v2/1",
          base64Image,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            params: {
              api_key: import.meta.env.VITE_ROBOFLOW_API_KEY,
            },
          }
        );

        setResult(response.data);
      } catch (error) {
        console.error("Detection error:", error);
        setResult("Error detecting the image.");
      } finally {
        setLoading(false);
      }
    };
  };

  return (
    <div className="p-4 text-center bg-light text-dark min-vh-100">
      <h1 className="display-4">Detection</h1>
      <p>Upload an image and detect potential skin diseases in your pet.</p>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="form-control mt-3 w-50 mx-auto"
      />

      {preview && (
        <div className="mt-3">
          <img
            src={preview}
            alt="Preview"
            className="img-fluid border rounded"
            style={{ maxWidth: "300px" }}
          />
        </div>
      )}

      <button className="btn btn-success mt-3" onClick={handleDetect} disabled={loading}>
        {loading ? "Detecting..." : "Run Detection"}
      </button>

      {result && (
        <div className="alert alert-info mt-3">
          <h5>Detection Result:</h5>
          {result.predictions && result.predictions.length > 0 ? (
            <p className="lead">
              <strong>Detected Class:</strong> {result.predictions[0].class}
            </p>
          ) : (
            <p>{result.error ? result.error : "No disease detected."}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DetectionPage;
