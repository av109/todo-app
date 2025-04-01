import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect, useRef } from 'react';

const Dialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  children, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  size = "md" // sm, md, lg, xl
}) => {
  const dialogRef = useRef(null);

  // Handle escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Focus the dialog when it opens
      dialogRef.current?.focus();
      // Prevent body scrolling when dialog is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Determine max width based on size prop
  let maxWidthClass = 'max-w-md'; // default medium
  if (size === 'sm') maxWidthClass = 'max-w-sm';
  if (size === 'lg') maxWidthClass = 'max-w-2xl';
  if (size === 'xl') maxWidthClass = 'max-w-4xl';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            // Close dialog when clicking on backdrop
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={dialogRef}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ 
              duration: 0.2, 
              ease: [0.16, 1, 0.3, 1], // Custom bezier curve
              type: 'spring',
              stiffness: 300,
              damping: 25
            }}
            className={`bg-white rounded-lg p-6 w-full ${maxWidthClass} mx-auto shadow-xl outline-none overflow-auto max-h-[90vh]`}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4 text-amber-950">{title}</h2>
            <div className="mb-6">{children}</div>
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-amber-300 text-amber-950 rounded-md hover:bg-amber-50 transition-colors duration-150"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors duration-150"
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Dialog;