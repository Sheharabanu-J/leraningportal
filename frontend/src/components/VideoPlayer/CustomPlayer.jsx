import React, { useState, useEffect } from 'react';

const CustomPlayer = ({ url, onProgress, onDuration, playerRef, playing, setPlaying }) => {
  const [currentUrl, setCurrentUrl] = useState(url);

  // Sync URL prop updates
  useEffect(() => {
    setCurrentUrl(url);
  }, [url]);

  // Convert watch URL to embed URL
  const getEmbedUrl = (videoUrl) => {
    if (!videoUrl) return '';
    if (videoUrl.includes('youtube.com/watch?v=')) {
      return videoUrl.replace('watch?v=', 'embed/');
    }
    if (videoUrl.includes('youtu.be/')) {
      return videoUrl.replace('youtu.be/', 'youtube.com/embed/');
    }
    return videoUrl;
  };

  const embedUrl = getEmbedUrl(currentUrl);

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center">
      {embedUrl.includes('youtube.com') ? (
        <iframe
          src={`${embedUrl}?autoplay=${playing ? 1 : 0}&origin=${window.location.origin}&rel=0`}
          className="absolute top-0 left-0 w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube Video Player"
        />
      ) : (
        <video
          src={currentUrl}
          controls
          className="w-full h-full outline-none"
          playsInline
        />
      )}
    </div>
  );
};

export default CustomPlayer;
