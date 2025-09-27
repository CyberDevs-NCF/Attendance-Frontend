// To use this component in your project, install the required dependencies:
// npm install jsqr

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, X, Camera, AlertCircle } from 'lucide-react';
import jsQR from 'jsqr'; // Uncomment this in your actual project

interface Event {
  title: string;
  date: string;
  location: string;
}

interface QRScannerPageProps {
  event: Event;
  onBack: () => void;
  onStudentScanned?: (studentId: string) => void;
}

export const QRScannerPage: React.FC<QRScannerPageProps> = ({ 
  event, 
  onBack, 
  onStudentScanned 
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [scanAttempts, setScanAttempts] = useState(0);
  
  const webcamRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const scanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (webcamRef.current) {
      webcamRef.current.srcObject = null;
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    setIsScanning(false);
    setIsLoading(false);
  }, [stream]);

  const captureAndScan = useCallback(() => {
    const video = webcamRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data for QR detection
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    
    // Use jsQR to detect QR codes
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    
    setScanAttempts(prev => prev + 1);
    
    if (code) {
      console.log('QR Code detected:', code.data);

      // Try to parse JSON payload expected from Registration QR
      let studentIdToEmit: string | undefined;
      let displayText = code.data;
      try {
        const parsed = JSON.parse(code.data);
        if (parsed && typeof parsed === 'object') {
          // Support both new and potential legacy keys
          studentIdToEmit = parsed.student_id || parsed.studentId || parsed.id;
          // Pretty print JSON for UI
          displayText = JSON.stringify(parsed, null, 2);
        }
      } catch (_) {
        // Not JSON, fallback to raw string
      }

      setScannedData(displayText);

      // Call the callback if provided with extracted student id or raw
      if (onStudentScanned) {
        onStudentScanned(studentIdToEmit || code.data);
      }
      
      // Stop scanning after successful scan
      stopCamera();
    }
  }, [onStudentScanned, stopCamera]);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      setScanAttempts(0);

      if (stream) stopCamera();

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported in this browser");
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "environment", // Prefer rear-facing camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (webcamRef.current) {
        webcamRef.current.srcObject = mediaStream;

        try {
          await webcamRef.current.play();
          setStream(mediaStream);
          setIsScanning(true);
          setIsLoading(false);

          // Start scanning interval
          scanIntervalRef.current = setInterval(captureAndScan, 300); // Scan every 300ms
          
        } catch (playError) {
          console.error("Video play error:", playError);
          setError("Failed to start camera playback");
          setIsLoading(false);
        }
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      let errorMessage = "Unable to access camera. ";
      if (err.name === "NotAllowedError") {
        errorMessage += "Please grant camera permissions and try again.";
      } else if (err.name === "NotFoundError") {
        errorMessage += "No camera found on this device.";
      } else {
        errorMessage += "Please check your camera settings and try again.";
      }
      setError(errorMessage);
      setIsLoading(false);
    }
  }, [stream, stopCamera, captureAndScan]);

  // Handle QR upload (fallback when camera not available)
  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsLoading(true);

    try {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          // Resize canvas to image size and draw image
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);

          if (code) {
            // Parse as in live scanner
            let studentIdToEmit: string | undefined;
            let displayText = code.data;
            try {
              const parsed = JSON.parse(code.data);
              if (parsed && typeof parsed === 'object') {
                studentIdToEmit = parsed.student_id || parsed.studentId || parsed.id;
                displayText = JSON.stringify(parsed, null, 2);
              }
            } catch (_) {
              // non-JSON
            }

            setScannedData(displayText);
            if (onStudentScanned) {
              onStudentScanned(studentIdToEmit || code.data);
            }
            // Ensure camera (if running) is stopped after success
            stopCamera();
            setIsLoading(false);
          } else {
            setError('No QR code detected in the uploaded image.');
            setIsLoading(false);
          }
        };
        if (typeof reader.result === 'string') {
          img.src = reader.result;
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Failed to read image:', err);
      setError('Failed to process the uploaded image.');
      setIsLoading(false);
    } finally {
      // reset input value to allow re-uploading the same file
      e.target.value = '';
    }
  }, [onStudentScanned, stopCamera]);

  useEffect(() => {
    // Auto-start camera when component mounts
    startCamera();
    
    return () => {
      // Cleanup camera on component unmount
      stopCamera();
    };
  }, []); // Empty dependency array to avoid infinite re-renders

  return (
    <div className="text-gray-800 h-screen bg-gray-100 p-6 flex flex-col">
      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center text-gray-700 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span className="text-lg font-medium">Back</span>
        </button>
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-semibold text-gray-800">Scan Student QR Code</h1>
        </div>
      </div>

      {/* Event Info */}
      <div className="bg-white rounded-lg p-4 shadow-sm mb-6 flex-shrink-0">
        <h2 className="font-medium text-gray-800 mb-2">Scanning for: {event.title}</h2>
        <p className="text-sm text-gray-600">
          {event.date} • {event.location}
        </p>
      </div>

      {/* Scanner Section */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white rounded-lg shadow-sm p-6 flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Camera Scanner</h3>
            <div className="flex items-center space-x-3">
              {isScanning && (
                <>
                  <span className="text-sm text-gray-500">
                    Scanning... ({scanAttempts} attempts)
                  </span>
                  <button
                    onClick={stopCamera}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <X size={16} />
                    <span>Stop</span>
                  </button>
                </>
              )}
              <button
                onClick={handleUploadClick}
                className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <span>Upload QR Image</span>
                <span className="text-xs opacity-80">(This is just a test)</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Scanner Area */}
          <div className="flex-1 flex flex-col items-center justify-center">
            {isLoading && !error && (
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="w-32 h-32 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Camera size={48} className="text-blue-500 animate-pulse" />
                </div>
                <p className="text-gray-600">Starting camera...</p>
              </div>
            )}

            {!isScanning && !scannedData && !isLoading && !error && (
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Camera size={48} className="text-gray-400" />
                </div>
                <p className="text-gray-600 mb-4">
                  Position the QR code within the scanning area
                </p>
                <button
                  onClick={startCamera}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Camera size={18} />
                  <span>Start Camera</span>
                </button>
              </div>
            )}

            {isScanning && (
              <div className="flex flex-col items-center space-y-4 w-full max-w-md">
                <div className="relative w-full aspect-square bg-black rounded-lg overflow-hidden">
                  <video
                    ref={webcamRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    style={{ transform: 'scaleX(-1)' }} /* Mirror the video for better UX */
                  />
                  
                  {/* Scanning overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-white rounded-lg relative">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
                      
                      {/* Scanning animation line */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-40 h-0.5 bg-blue-500 animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  {/* Scan attempts indicator */}
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    Attempts: {scanAttempts}
                  </div>
                </div>
                
                <p className="text-gray-600 text-center">
                  Hold QR code steady within the frame
                </p>
                
                <div className="text-xs text-gray-500 text-center">
                  <p>• Ensure good lighting</p>
                  <p>• Hold QR code 6-12 inches from camera</p>
                  <p>• Keep QR code flat and visible</p>
                </div>
              </div>
            )}

            {scannedData && (
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">✓</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    QR Code Scanned Successfully!
                  </h4>
                  <div className="bg-gray-100 p-3 rounded-lg mb-4 max-w-sm break-all">
                    <p className="text-sm font-mono text-gray-700">{scannedData}</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    Attendance recorded for {event.title}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setScannedData(null);
                      setScanAttempts(0);
                      startCamera();
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Scan Another
                  </button>
                  <button
                    onClick={onBack}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle size={32} className="text-red-500" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    Camera Error
                  </h4>
                  <p className="text-red-600 mb-4 max-w-sm">{error}</p>
                </div>
                <button
                  onClick={startCamera}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg flex-shrink-0">
            <h4 className="font-medium text-blue-800 mb-2">QR Scanner Instructions:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Ensure bright, even lighting for optimal scanning</li>
              <li>• Hold the QR code 6-12 inches from the camera</li>
              <li>• Keep the QR code flat and fully visible within the frame</li>
              <li>• The scanner automatically detects and reads QR codes</li>
              <li>• Make sure the QR code is not damaged or distorted</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};