import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, Flashlight, Loader2, RotateCcw, X, Check, Clock, ChevronDown } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import type { Html5QrcodeCameraScanConfig, Html5QrcodeResult } from 'html5-qrcode';

interface AttendeeData {
  id: string;
  name: string;
  block: string;
  year: string;
  course: string;
  email: string;
}

interface QRScannerPageProps {
  onClose: () => void;
  onScan: (text: string, raw?: Html5QrcodeResult) => void;
  onApproveAttendee?: (attendee: AttendeeData, time: string, isTimeIn: boolean, period: 'AM' | 'PM') => void;
  headerTitle?: string;
  allowedFormats?: any[];
  fps?: number;
  qrbox?: number | { width: number; height: number };
  disableFlip?: boolean;
}


async function toggleTorch(track: MediaStreamTrack, turnOn: boolean): Promise<boolean> {
  try {
    // @ts-ignore: torch constraint not in standard lib yet
    await track.applyConstraints({ advanced: [{ torch: turnOn }] });
    return true;
  } catch {
    return false;
  }
}

export const QRScannerPage: React.FC<QRScannerPageProps> = ({
  onClose,
  onScan,
  onApproveAttendee,
  headerTitle = 'Scan QR Code',
  allowedFormats,
  fps = 10,
  qrbox = 280,
  disableFlip = false,
}) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerIdRef = useRef(`qr-reader-${Math.random().toString(36).slice(2)}`);
  const [cameras, setCameras] = useState<{ id: string; label: string }[]>([]);
  const [cameraId, setCameraId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const mediaTrackRef = useRef<MediaStreamTrack | null>(null);
  const [scannedData, setScannedData] = useState<AttendeeData | null>(null);
  const [scannedText, setScannedText] = useState<string | null>(null);
  const [showRaw, setShowRaw] = useState(false);
  
  // New states for attendance management
  const [selectedTime, setSelectedTime] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  });
  const [selectedPeriod, setSelectedPeriod] = useState(() => {
    const now = new Date();
    return now.getHours() >= 12 ? 'PM' : 'AM';
  });
  const [isTimeIn, setIsTimeIn] = useState(true);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);

  const handleDecoded = useCallback((decodedText: string, rawResult?: Html5QrcodeResult) => {
    setScannedText(prev => {
      if (prev === decodedText) return prev;
      return decodedText;
    });
    
    try {
      const data = JSON.parse(decodedText);
      console.log('Decoded QR data:', data);

      const block = data.course_year_section || 'N/A';
      let course = 'N/A';
      let year = 'N/A';

      if (block && block !== 'N/A') {
        // Example: "BSCS 1A"
        const match = block.match(/^([A-Za-z]+)\s*(\d)/);
        if (match) {
          course = match[1];   // "BSCS"
          year = match[2];     // "1"
        }
      }

      const attendee: AttendeeData = {
        id: data.student_id,
        name: `${data.first_name} ${data.last_name}`,
        block,
        course,
        year,
        email: data.email || 'N/A',
      };

      if (attendee.id && attendee.name && attendee.block) {
        setScannedData(attendee);
        setShowApprovalDialog(true);
      } else {
        setScannedData(null);
        setError('Invalid QR code format. Missing required attendee information.');
      }
    } catch {
      setScannedData(null);
      setError('QR code does not contain valid attendee data.');
    }
    
    onScan(decodedText, rawResult);
  }, [onScan]);

  const stopScanner = useCallback(async () => {
    try {
      if (scannerRef.current && scannerRef.current.isScanning) {
        await scannerRef.current.stop();
      }
      mediaTrackRef.current?.stop();
    } catch {/* ignore */}
  }, []);

  const startScanner = useCallback(async (deviceId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(containerIdRef.current);
      } else if (scannerRef.current.isScanning) {
        await scannerRef.current.stop();
      }

      const config: Html5QrcodeCameraScanConfig = {
        fps,
        qrbox,
        disableFlip,
        // @ts-ignore - aspectRatio supported by library
        aspectRatio: 1.0,
      };
      
      if (allowedFormats) {
        // @ts-ignore - optional experimental property
        config.formatsToSupport = allowedFormats;
      }

      await scannerRef.current.start(
        { deviceId: { exact: deviceId } },
        config,
        (decodedText, rawResult) => {
          handleDecoded(decodedText, rawResult);
        },
        (scanError) => { void scanError; }
      );

      // @ts-expect-error private field
      const stream: MediaStream | undefined = scannerRef.current?._localMediaStream;
      mediaTrackRef.current = stream?.getVideoTracks()?.[0] || null;

      const containerEl = document.getElementById(containerIdRef.current);
      if (containerEl) {
        containerEl.querySelectorAll('.qr-shaded-region').forEach(el => {
          (el as HTMLElement).style.display = 'none';
        });
        const videoEl = containerEl.querySelector('video') as HTMLVideoElement | null;
        if (videoEl) {
          videoEl.style.width = '100%';
          videoEl.style.height = '100%';
          videoEl.style.objectFit = 'cover';
          videoEl.style.top = '0';
          videoEl.style.left = '0';
          videoEl.style.position = 'absolute';
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to start camera');
    } finally {
      setIsLoading(false);
    }
  }, [allowedFormats, disableFlip, fps, handleDecoded, qrbox]);

  useEffect(() => {
    let mounted = true;
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (!mounted) return;
        const mapped = devices.map(d => ({ id: d.id, label: d.label || `Camera ${d.id}` }));
        setCameras(mapped);
        const preferred = mapped.find(c => /back|rear|environment/i.test(c.label)) || mapped[0];
        if (preferred) {
          setCameraId(preferred.id);
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Cannot access cameras'));
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (cameraId) {
      startScanner(cameraId);
    }
    return () => { void stopScanner(); };
  }, [cameraId, startScanner, stopScanner]);

  useEffect(() => {
    return () => { void stopScanner(); };
  }, [stopScanner]);

  const handleTorchToggle = async () => {
    if (!mediaTrackRef.current) return;
    const success = await toggleTorch(mediaTrackRef.current, !torchOn);
    if (success) setTorchOn(v => !v);
  };

  const handleRetry = () => {
    setShowApprovalDialog(false);
    setScannedData(null);
    setScannedText(null);
    setError(null);
    if (cameraId) startScanner(cameraId);
  };

  const handleApprove = () => {
  if (scannedData && onApproveAttendee) {
    const now = new Date();
    const hours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeWithPeriod = `${hours}:${minutes} ${selectedPeriod}`;

    // Pass only 3 arguments
    onApproveAttendee(scannedData, timeWithPeriod, isTimeIn,  selectedPeriod as 'AM' | 'PM');
    onClose();
  }
};




  const handleDeny = () => {
    handleRetry();
  };

  const handleSwitchCamera = (id: string) => {
    if (id !== cameraId) {
      setTorchOn(false);
      setCameraId(id);
    }
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let h = 1; h <= 12; h++) {
      for (let m = 0; m < 60; m += 15) {
        const hour = h.toString().padStart(2, '0');
        const minute = m.toString().padStart(2, '0');
        options.push(`${hour}:${minute}`);
      }
    }
    return options;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.35 }}
      className="h-[90vh] flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Camera size={20} /> {headerTitle}
        </h1>
        <button
          onClick={() => { void stopScanner(); onClose(); }}
          className="p-2 rounded-full hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors"
          aria-label="Close scanner"
        >
          <X size={18} />
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Camera:</label>
          <select
            value={cameraId || ''}
            onChange={(e) => handleSwitchCamera(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {cameras.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleTorchToggle}
          disabled={!mediaTrackRef.current}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Flashlight size={16} /> {torchOn ? 'Torch Off' : 'Torch On'}
        </button>

        {/* {AM/PM Toggle} */}
        <div className="flex items-center gap-2 ml-auto">
          <button
          onClick={() => setSelectedPeriod('AM')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedPeriod === 'AM' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          >
            AM
          </button>
          <button
            onClick={() => setSelectedPeriod('PM')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedPeriod === 'PM' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            PM
          </button>
        </div>
        
        {/* Time In/Out Toggle */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setIsTimeIn(true)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isTimeIn 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Time In
          </button>
          <button
            onClick={() => setIsTimeIn(false)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !isTimeIn 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Time Out
          </button>
        </div>
      </div>

      {/* Scanner container */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
        <div className="relative rounded-2xl bg-black/80 aspect-square max-w-xl w-full mx-auto flex items-center justify-center overflow-hidden">
          <div id={containerIdRef.current} className="w-full h-full" />
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white gap-3">
              <Loader2 className="animate-spin" size={32} />
              <p className="text-sm">Starting camera...</p>
            </div>
          )}
          {error && !showApprovalDialog && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-600/80 text-white gap-4 p-6 text-center">
              <p className="font-medium">{error}</p>
              <button
                onClick={handleRetry}
                className="bg-white text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100"
              >Retry</button>
            </div>
          )}
          
          {/* Scanning frame overlay */}
          <AnimatePresence>
            {!isLoading && !error && !showApprovalDialog && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
              >
                <div className="relative w-[70%] aspect-square">
                  <div className="absolute inset-0 border-[3px] rounded-2xl border-white/60 shadow-[0_0_0_3000px_rgba(0,0,0,0.25)]" />
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                    animate={{ y: ['0%', '100%', '0%'] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Result/Approval panel */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg p-6 flex flex-col overflow-hidden">
          {showApprovalDialog && scannedData ? (
            <div className="h-full flex flex-col">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Approve Attendance</h2>
              
              {/* Attendee Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Student Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">ID:</span>
                    <span className="text-sm font-medium text-gray-800">{scannedData.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Name:</span>
                    <span className="text-sm font-medium text-gray-800">{scannedData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Block:</span>
                    <span className="text-sm font-medium text-gray-800">{scannedData.block}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Email:</span>
                    <span className="text-sm font-medium text-gray-800">{scannedData.email}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-auto">
                <button
                  onClick={handleApprove}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors"
                >
                  <Check size={20} />
                  Approve
                </button>
                <button
                  onClick={handleDeny}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors"
                >
                  <X size={20} />
                  Deny
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col justify-center items-center text-center">
              <Camera className="text-gray-400 mb-4" size={48} />
              <p className="text-gray-600">Position the QR code within the frame to scan</p>
              <p className="text-sm text-gray-500 mt-2">Currently in <span className="font-medium">{isTimeIn ? 'Time In' : 'Time Out'}</span> mode</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default QRScannerPage;