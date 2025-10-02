import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { motion } from 'framer-motion';

interface QRCodeDisplayProps {
  url: string;
  title: string;
  description: string;
  size?: number;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ 
  url, 
  title, 
  description, 
  size = 200 
}) => {
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('');

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const dataURL = await QRCode.toDataURL(url, {
          width: size,
          margin: 2,
          color: {
            dark: '#dc2626', // Theatrical red
            light: '#ffffff'
          }
        });
        setQrCodeDataURL(dataURL);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQRCode();
  }, [url, size]);

  return (
    <motion.div
      className="card-theatrical text-center p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-bold text-accent-800 mb-2 text-curtain">
        {title}
      </h3>
      <p className="text-accent-700 mb-4 font-semibold">
        {description}
      </p>
      
      {qrCodeDataURL && (
        <motion.div
          className="bg-white p-4 rounded-lg border-2 border-secondary-300 inline-block"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        >
          <img 
            src={qrCodeDataURL} 
            alt={`QR Code for ${title}`}
            className="mx-auto"
          />
        </motion.div>
      )}
      
      <div className="mt-4 p-3 bg-secondary-100 border border-secondary-300 rounded-lg">
        <p className="text-sm text-secondary-800 font-semibold">
          📱 Scan with your phone camera
        </p>
        <p className="text-xs text-secondary-700 mt-1">
          {url}
        </p>
      </div>
    </motion.div>
  );
};

export default QRCodeDisplay;
