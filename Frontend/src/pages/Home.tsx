import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, BookOpen, Brain, Sparkles, PauseCircle, PlayCircle, Music, Video } from "lucide-react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import "./home.css";

export function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();
  const [animateBG, setAnimateBG] = useState(true);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      // Existing document formats
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
      // New audio formats
      "audio/mpeg": [".mp3"],
      "audio/wav": [".wav"],
      "audio/m4a": [".m4a"],
      "audio/ogg": [".ogg"],
      // New video formats
      "video/mp4": [".mp4"],
      "video/x-msvideo": [".avi"],
      "video/quicktime": [".mov"],
      "video/x-matroska": [".mkv"],
    },
    multiple: false,
  });

  // Helper function to determine file type
  const getFileType = (file: File) => {
    if (file.type.startsWith('audio/')) return 'audio';
    if (file.type.startsWith('video/')) return 'video';
    return 'document';
  };

  // Render upload icon based on file type
  const renderUploadIcon = (file: File | null) => {
    if (!file) return <Upload className="h-16 w-16 text-blue-500 mx-auto mb-4" />;

    const fileType = getFileType(file);
    switch (fileType) {
      case 'audio':
        return <Music className="h-16 w-16 text-blue-500 mx-auto mb-4" />;
      case 'video':
        return <Video className="h-16 w-16 text-blue-500 mx-auto mb-4" />;
      default:
        return <Upload className="h-16 w-16 text-blue-500 mx-auto mb-4" />;
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(progress);
        },
      });
      navigate(`/study/${response.data.id}`);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-blue-500" />,
      title: "Smart Summaries",
      description: "AI-powered document analysis for quick understanding",
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-500" />,
      title: "Interactive Learning with Goals & Videos",
      description: "Flashcards and quizzes generated automatically",
    },
    {
      icon: <Sparkles className="h-8 w-8 text-indigo-500" />,
      title: "AI Assistant",
      description: "Chat with AI to clarify concepts and deepen understanding",
    },
  ];

  return (
    <div className={`min-h-screen ${animateBG ? "bg-animated" : "bg-static"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title & Description */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl font-bold mb-6">
            <span className="gradient-text">Transform Your Study Material</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your documents and let AI create interactive study materials
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="feature-card animate-float">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Modified Upload Section */}
        <div className="max-w-2xl mx-auto">
          <div {...getRootProps()} className={`upload-zone ${isDragActive ? "dragging" : ""}`}>
            <input {...getInputProps()} />
            <div className="text-center">
              {file ? renderUploadIcon(file) : <Upload className="h-16 w-16 text-blue-500 mx-auto mb-4" />}
              <h3 className="text-xl font-semibold mb-2">
                {file ? file.name : "Drop your file here"}
              </h3>
              <p className="text-gray-500 text-sm">
                Support for PDF, TXT, DOCX, PPTX files
                <br />
                Now supporting Audio (MP3, WAV, M4A, OGG) and Video (MP4, AVI, MOV, MKV)
              </p>
            </div>
          </div>

          {uploading && (
            <div className="mt-4">
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }} />
              </div>
              <p className="text-sm text-gray-500 text-center mt-2">
                {file && getFileType(file) !== 'document'
                  ? "Transcribing and processing..."
                  : "Uploading..."} {uploadProgress}%
              </p>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="cta-button w-full mt-6"
          >
            {uploading
              ? (file && getFileType(file) !== 'document'
                ? "Transcribing..."
                : "Processing...")
              : "Generate Study Materials"}
          </button>
        </div>
      </div>
    </div>
  );
}
