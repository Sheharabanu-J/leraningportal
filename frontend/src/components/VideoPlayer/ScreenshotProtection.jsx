import React, { useState, useEffect } from 'react';

const ScreenshotProtection = ({ children, userEmail, currentTime }) => {
  const [isBlurred, setIsBlurred] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  useEffect(() => {
    // Blur when tab loses focus
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsBlurred(true);
      } else {
        setIsBlurred(false);
      }
    };
    
    // Disable Right Click
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    // Disable Developer Shortcuts & PrintScreen
    const handleKeyDown = (e) => {
      // PrintScreen key
      if (e.key === 'PrintScreen') {
        setIsBlurred(true);
        setWarningMessage('Screenshot is not allowed.');
        setTimeout(() => {
          setIsBlurred(false);
          setWarningMessage('');
        }, 3000);
      }
      
      // Ctrl+Shift+I, Ctrl+Shift+J, F12, Ctrl+U
      if (
        e.keyCode === 123 ||
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) ||
        (e.ctrlKey && e.keyCode === 85)
      ) {
        e.preventDefault();
      }
      
      // Disable Copy (Ctrl+C)
      if (e.ctrlKey && e.keyCode === 67) {
        e.preventDefault();
      }
    };

    // Disable copy event
    const handleCopy = (e) => {
      e.preventDefault();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('copy', handleCopy);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('copy', handleCopy);
    };
  }, []);

  return (
    <div className="protected-video-container select-none">
      {isBlurred && (
        <div className="blur-overlay">
          {warningMessage || 'Content Hidden'}
        </div>
      )}
      
      {/* Dynamic Watermark */}
      <div className="watermark">
        GVCC Learning Portal<br/>
        {userEmail}<br/>
        {currentTime}
      </div>

      <div className="w-full h-full" style={{ filter: isBlurred ? 'blur(20px)' : 'none', pointerEvents: isBlurred ? 'none' : 'auto' }}>
        {children}
      </div>
    </div>
  );
};

export default ScreenshotProtection;
