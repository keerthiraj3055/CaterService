import React, { useEffect } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircleIcon className="text-green-500" />,
    error: <ErrorIcon className="text-red-500" />,
    info: <InfoIcon className="text-blue-500" />,
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  };

  return (
    <div
      className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${bgColors[type]} animate-slide-in`}
    >
      {icons[type]}
      <span className="text-[#1E293B] font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-gray-500 hover:text-gray-700"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;











