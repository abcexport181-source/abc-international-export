'use client';

import React from 'react';

export function isVideoMedia(url: string) {
  return /\.(webm|mp4|mov)(\?|#|$)/i.test(url);
}

type MediaBackgroundProps = {
  url: string;
  overlay?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

export function MediaBackground({ url, overlay = 'rgba(0,0,0,0.6)', className, style, children }: MediaBackgroundProps) {
  const isVideo = isVideoMedia(url);

  return (
    <section
      className={className}
      style={{
        ...style,
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: isVideo ? undefined : `linear-gradient(${overlay}, ${overlay}), url(${url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {isVideo && (
        <>
          <video
            src={url}
            autoPlay
            muted
            loop
            playsInline
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: overlay }} />
        </>
      )}
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </section>
  );
}

type MediaBlockProps = {
  url: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  mediaStyle?: React.CSSProperties;
};

export function MediaBlock({ url, alt, className, style, mediaStyle }: MediaBlockProps) {
  const sharedStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '12px',
    ...mediaStyle,
  };

  return (
    <div className={className} style={{ overflow: 'hidden', ...style }}>
      {isVideoMedia(url) ? (
        <video src={url} style={sharedStyle} autoPlay muted loop playsInline />
      ) : (
        <img src={url} alt={alt} style={sharedStyle} />
      )}
    </div>
  );
}
