import React from 'react';

interface ModalProps {
  show: boolean;
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ show, children, onClose }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-0.5 right-2 text-4xl font-bold leading-none hover:text-yellow-700 text-black"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
