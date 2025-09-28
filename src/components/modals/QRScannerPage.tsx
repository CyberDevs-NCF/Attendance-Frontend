import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, Flashlight, Loader2, RotateCcw, X } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import type { Html5QrcodeCameraScanConfig, Html5QrcodeResult } from 'html5-qrcode';

// Types for html5-qrcode (library ships its own types, but we narrow for our usage)
interface QRScannerPageProps {
  onClose: () => void;
  onScan: (text: string, raw?: Html5QrcodeResult) => void;
  headerTitle?: string;
  // html5-qrcode exposes optional format config but its type may not include property; keep generic any[]
  allowedFormats?: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  fps?: number; // scan frames per second
  qrbox?: number | { width: number; height: number };
  disableFlip?: boolean; // disable mirrored video
}

// Helper to check torch capability on track
async function toggleTorch(track: MediaStreamTrack, turnOn: boolean): Promise<boolean> {
  try {
    // Attempt applying constraint; some browsers support this unofficially
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
  const [scannedText, setScannedText] = useState<string | null>(null);
  const [parsedJson, setParsedJson] = useState<unknown | null>(null);
  const [isJson, setIsJson] = useState(false);
  const [showRaw, setShowRaw] = useState(true);

  // Helper: attempt to parse JSON and set state
  const handleDecoded = useCallback((decodedText: string, rawResult?: Html5QrcodeResult) => {
    // Avoid re-processing identical scans in rapid succession
    setScannedText(prev => {
      if (prev === decodedText) return prev; // ignore duplicate
      return decodedText;
    });
    try {
      const obj = JSON.parse(decodedText);
      setParsedJson(obj);
      setIsJson(true);
    } catch {
      setParsedJson(null);
      setIsJson(false);
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
        // Enforce square to avoid letterboxing that can show gray zones
        // @ts-ignore - aspectRatio supported by library though not typed
        aspectRatio: 1.0,
      };
      // Some builds allow specifying supported formats via experimental property; ignore if unsupported
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

      // Try to capture track for torch
      // @ts-expect-error private field _localMediaStream may not be public
      const stream: MediaStream | undefined = scannerRef.current?._localMediaStream;
      mediaTrackRef.current = stream?.getVideoTracks()?.[0] || null;

      // Post-start styling adjustments to remove any remaining gray overlay space / shaded regions
      const containerEl = document.getElementById(containerIdRef.current);
      if (containerEl) {
        // Hide default shaded regions that html5-qrcode injects
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
  }, [allowedFormats, disableFlip, fps, onScan, qrbox]);

  // Enumerate cameras on mount
  useEffect(() => {
    let mounted = true;
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (!mounted) return;
        const mapped = devices.map(d => ({ id: d.id, label: d.label || `Camera ${d.id}` }));
        setCameras(mapped);
        // Prefer environment facing camera if label hints
        const preferred = mapped.find(c => /back|rear|environment/i.test(c.label)) || mapped[0];
        if (preferred) {
          setCameraId(preferred.id);
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Cannot access cameras'));
    return () => { mounted = false; };
  }, []);

  // Start when cameraId changes
  useEffect(() => {
    if (cameraId) {
      startScanner(cameraId);
    }
    return () => { void stopScanner(); };
  }, [cameraId, startScanner, stopScanner]);

  // Clean up on unmount
  useEffect(() => {
    return () => { void stopScanner(); };
  }, [stopScanner]);

  const handleTorchToggle = async () => {
    if (!mediaTrackRef.current) return;
    const success = await toggleTorch(mediaTrackRef.current, !torchOn);
    if (success) setTorchOn(v => !v);
  };

  const handleRetry = () => {
    if (cameraId) startScanner(cameraId);
  };

  const flattenObject = (obj: unknown, prefix = ''): { key: string; value: string }[] => {
    if (obj === null) return [{ key: prefix || '(null)', value: 'null' }];
    if (typeof obj !== 'object') {
      return [{ key: prefix || 'value', value: String(obj) }];
    }
    const entries: { key: string; value: string }[] = [];
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      const newKey = prefix ? `${prefix}.${k}` : k;
      if (typeof v === 'object' && v !== null) {
        if (Array.isArray(v)) {
          if (v.every(item => typeof item !== 'object')) {
            entries.push({ key: newKey, value: v.map(item => String(item)).join(', ') });
          } else {
            v.forEach((item, idx) => {
              entries.push(...flattenObject(item, `${newKey}[${idx}]`));
            });
          }
        } else {
          entries.push(...flattenObject(v, newKey));
        }
      } else {
        entries.push({ key: newKey, value: String(v) });
      }
    }
    return entries;
  };

  const flattened = isJson && parsedJson ? flattenObject(parsedJson) : [];

  const copyRaw = () => {
    if (!scannedText) return;
    navigator.clipboard.writeText(scannedText).catch(() => {/* ignore */});
  };

  const handleSwitchCamera = (id: string) => {
    if (id !== cameraId) {
      setTorchOn(false);
      setCameraId(id);
    }
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
        <button
          onClick={handleRetry}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 bg-white hover:bg-gray-50"
        >
          <RotateCcw size={16} /> Restart
        </button>
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
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-600/80 text-white gap-4 p-6 text-center">
              <p className="font-medium">{error}</p>
              <button
                onClick={handleRetry}
                className="bg-white text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100"
              >Retry</button>
            </div>
          )}
          {/* Decorative scanning frame overlay */}
          <AnimatePresence>
            {!isLoading && !error && (
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

        {/* Scan result panel */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg p-6 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Result</h2>
            {scannedText && (
              <div className="flex items-center gap-2">
                <button onClick={() => setShowRaw(r => !r)} className="text-xs px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium">
                  {showRaw ? 'Hide JSON' : 'Show JSON'}
                </button>
                <button onClick={copyRaw} className="text-xs px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium">Copy</button>
              </div>
            )}
          </div>
          <div className="flex-1 overflow-auto space-y-6 pr-1">
            {!scannedText && (
              <p className="text-sm text-gray-500">Align the QR code within the frame to scan.</p>
            )}
            {scannedText && isJson && (
              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Parsed Fields</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {flattened.map(item => (
                    <div key={item.key} className="flex flex-col bg-gray-50/70 rounded-lg border border-gray-200 p-3">
                      <span className="text-[11px] uppercase tracking-wide text-gray-500 font-medium mb-1 break-all">{item.key}</span>
                      <span className="text-sm text-gray-800 break-words font-medium">{item.value || '\u00a0'}</span>
                    </div>
                  ))}
                  {flattened.length === 0 && (
                    <div className="text-xs text-gray-500">(Empty Object)</div>
                  )}
                </div>
              </div>
            )}
            {scannedText && !isJson && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md p-3 text-xs">
                Content is not valid JSON. Displaying raw text below.
              </div>
            )}
            {scannedText && showRaw && (
              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Raw {isJson ? 'JSON' : 'Data'}</h3>
                <motion.pre
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="whitespace-pre-wrap break-words text-xs leading-relaxed font-mono text-gray-800 bg-gray-900/90 text-gray-100 rounded-lg p-4 border border-gray-800 shadow-inner max-h-64 overflow-auto"
                >{isJson ? JSON.stringify(parsedJson, null, 2) : scannedText}</motion.pre>
              </div>
            )}
          </div>
          {scannedText && (
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => { setScannedText(null); setParsedJson(null); setIsJson(false); }}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
              >Scan Another</button>
              <button
                onClick={() => { onClose(); }}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300"
              >Close</button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default QRScannerPage;
