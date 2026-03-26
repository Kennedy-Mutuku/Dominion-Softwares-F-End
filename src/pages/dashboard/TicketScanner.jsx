import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQrcode, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaRedo } from 'react-icons/fa';
import api from '../../utils/api';

export default function TicketScanner() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  const startScanner = async () => {
    setResult(null);
    setScanning(true);

    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      const html5QrCode = new Html5Qrcode('qr-reader');
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          // Extract ticketCode from URL
          const match = decodedText.match(/validate\/qr\/([a-f0-9-]+)/i);
          const ticketCode = match ? match[1] : decodedText;

          try {
            await html5QrCode.stop();
            html5QrCodeRef.current = null;
          } catch (_) {}
          setScanning(false);

          // Validate ticket
          try {
            const { data } = await api.put(`/tickets/validate/qr/${ticketCode}`);
            setResult(data);
          } catch (error) {
            setResult({
              success: false,
              status: 'invalid',
              message: error.response?.data?.message || 'Invalid ticket',
            });
          }
        },
        () => {} // Ignore scan errors
      );
    } catch (error) {
      setScanning(false);
      setResult({
        success: false,
        status: 'error',
        message: 'Could not access camera. Please allow camera permissions.',
      });
    }
  };

  const stopScanner = async () => {
    try {
      if (html5QrCodeRef.current) {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current = null;
      }
    } catch (_) {}
    setScanning(false);
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  const resultColors = {
    valid: { bg: 'bg-green-50', border: 'border-green-200', icon: FaCheckCircle, iconColor: 'text-green-500', label: 'VALID' },
    already_used: { bg: 'bg-yellow-50', border: 'border-yellow-200', icon: FaExclamationTriangle, iconColor: 'text-yellow-500', label: 'ALREADY USED' },
    invalid: { bg: 'bg-red-50', border: 'border-red-200', icon: FaTimesCircle, iconColor: 'text-red-500', label: 'INVALID' },
    cancelled: { bg: 'bg-red-50', border: 'border-red-200', icon: FaTimesCircle, iconColor: 'text-red-500', label: 'CANCELLED' },
    error: { bg: 'bg-red-50', border: 'border-red-200', icon: FaTimesCircle, iconColor: 'text-red-500', label: 'ERROR' },
  };

  const resultStyle = result ? resultColors[result.status] || resultColors.error : null;

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-heading mb-2">QR Scanner</h1>
      <p className="text-body-light mb-6">Scan attendee tickets at the entrance</p>

      {/* Scanner */}
      <div className="bg-white rounded-xl border border-border-light p-5 mb-6">
        {!scanning && !result && (
          <div className="text-center py-10">
            <FaQrcode className="text-6xl text-body-light mx-auto mb-4" />
            <p className="text-body mb-6">Point your camera at a ticket QR code</p>
            <button onClick={startScanner} className="btn-primary">
              Start Scanner
            </button>
          </div>
        )}

        {scanning && (
          <div>
            <div id="qr-reader" className="rounded-xl overflow-hidden" />
            <button
              onClick={stopScanner}
              className="w-full mt-4 btn-outline text-sm"
            >
              Stop Scanner
            </button>
          </div>
        )}
      </div>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            className={`rounded-xl border-2 p-6 ${resultStyle.bg} ${resultStyle.border}`}
          >
            <div className="text-center mb-4">
              <resultStyle.icon className={`text-5xl ${resultStyle.iconColor} mx-auto mb-3`} />
              <h2 className={`text-2xl font-bold ${resultStyle.iconColor}`}>{resultStyle.label}</h2>
              <p className="text-body mt-1">{result.message}</p>
            </div>

            {result.data && (
              <div className="bg-white/80 rounded-lg p-4 space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-body-light">Name</span>
                  <span className="text-sm font-semibold text-heading">{result.data.ownerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-body-light">Ticket Type</span>
                  <span className="text-sm font-medium text-heading">{result.data.typeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-body-light">Ticket #</span>
                  <span className="text-sm font-mono text-heading">{result.data.ticketNumber}</span>
                </div>
                {result.data.usedAt && (
                  <div className="flex justify-between">
                    <span className="text-sm text-body-light">Used At</span>
                    <span className="text-sm font-medium text-heading">
                      {new Date(result.data.usedAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => { setResult(null); startScanner(); }}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              <FaRedo /> Scan Next
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
