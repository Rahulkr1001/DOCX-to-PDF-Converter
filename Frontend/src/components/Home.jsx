import React, { useState } from "react";
import { FaFileWord } from "react-icons/fa6"; // FaFileWord icon is used to show a Word file icon
import axios from "axios"; // Axios library is used to make HTTP requests

function Home() {
  // State variables to manage file selection, conversion status, and error messages
  const [selectedFile, setSelectedFile] = useState(null); // Store the selected file
  const [convert, setConvert] = useState(""); // Message to show the conversion status
  const [downloadError, setDownloadError] = useState(""); // Message to handle any errors during download

  // This function handles file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]); // Set the selected file in the state
  };

  // This function handles the file conversion process
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevents the default form submission behavior

    // Check if no file is selected
    if (!selectedFile) {
      setConvert("Please select a file"); // Set a message if no file is selected
      return;
    }

    const formData = new FormData(); // Create a form data object
    console.log(formData)
    formData.append("file", selectedFile); // Add the selected file to the form data

    try {
      // Send a POST request to the backend for file conversion
      const response = await axios.post(
        "http://localhost:3000/convertFile", // Backend endpoint
        formData,
        {
          responseType: "blob", // Expect a binary file (PDF) in response
        }
      );
      console.log(response)
      // Create a downloadable link for the converted file
      const url = window.URL.createObjectURL(new Blob([response.data])); // Convert the response to a blob
      console.log(url);
      const link = document.createElement("a"); // Create an anchor tag
      console.log(link);
      link.href = url; // Set the blob URL
      link.setAttribute(
        "download",
        selectedFile.name.replace(/\.[^/.]+$/, "") + ".pdf" // Rename file with ".pdf"
      );
      document.body.appendChild(link); // Append the link to the document
      link.click(); //when we are click, Trigger the download
      link.parentNode.removeChild(link); // Remove the link after the downloaded

      setSelectedFile(null); // Reset the selected file
      setDownloadError(""); // Clear any previous error messages
      setConvert("File Converted Successfully"); // Show success message
    } catch (error) {
      console.log(error);
      // Handle errors
      if (error.response && error.response.status == 400) {
        setDownloadError("Error occurred: " + error.response.data.message); // Show server error message
      } else {
        setConvert(""); // Clear conversion status
      }
    }
  };

  // Render the UI
  return (
    <>
      <div className="max-w-screen-2xl mx-auto container px-6 py-3 md:px-40">
        <div className="flex h-screen items-center justify-center">
          <div className="border-2 border-dashed px-4 py-2 md:px-8 md:py-6 border-indigo-400 rounded-lg shadow-lg">
            {/* Title */}
            <h1 className="text-3xl font-bold text-center mb-4">
              Convert Word to PDF Online
            </h1>
            {/* Subtitle */}
            <p className="text-sm text-center mb-5">
              Easily convert Word documents to PDF format online, without having
              to install any software.
            </p>

            {/* File Upload Section */}
            <div className="flex flex-col items-center space-y-4">
              <input
                type="file"
                accept=".doc,.docx" // Accept only Word files
                onChange={handleFileChange} // Call handleFileChange on file selection
                className="hidden" // Hide the input element
                id="FileInput"
              />
              <label
                htmlFor="FileInput" // Label for file input
                className="w-full flex items-center justify-center px-4 py-6 bg-gray-100 text-gray-700 rounded-lg shadow-lg cursor-pointer border-blue-300 hover:bg-blue-700 duration-300 hover:text-white"
              >
                <FaFileWord className="text-3xl mr-3" />
                <span className="text-2xl mr-2 ">
                  {selectedFile ? selectedFile.name : "Choose File"}{" "}
                  {/* Show selected file name */}
                </span>
              </label>
              {/* Convert Button */}
              <button
                onClick={handleSubmit} // Call handleSubmit on click
                disabled={!selectedFile} // Disable button if no file is selected
                className="text-white bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 disabled:pointer-events-none duration-300 font-bold px-4 py-2 rounded-lg"
              >
                Convert File
              </button>
              {/* Show success or error messages */}
              {convert && (
                <div className="text-green-500 text-center">{convert}</div>
              )}
              {downloadError && (
                <div className="text-red-500 text-center">{downloadError}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home; // Export the Home component
