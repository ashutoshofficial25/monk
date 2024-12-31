import React, { useRef, useState, useEffect } from "react";

interface LazyImageProps {
  src: string;
  alt: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt }) => {
  const imgRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (imgRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            console.log("log: run");
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(imgRef.current);

      // Cleanup the observer when the component unmounts
      return () => observer.disconnect();
    }
  }, []);

  return <div ref={imgRef}>{isVisible && <img src={src} alt={alt} />}</div>;
};

export default LazyImage;
