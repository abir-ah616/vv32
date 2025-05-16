import React, { useCallback } from 'react';
import html2canvas from 'html2canvas';
import { Camera } from 'lucide-react';
import { toast } from 'react-toastify';

interface ScreenshotButtonProps {
  targetId: string;
}

const ScreenshotButton: React.FC<ScreenshotButtonProps> = ({ targetId }) => {
  const takeScreenshot = useCallback(() => {
    const element = document.getElementById(targetId);
    
    if (!element) {
      toast.error('Screenshot area not found!');
      return;
    }
    
    toast.info('Capturing screenshot...');
    
    // Create a deep clone of the element to preserve all styles
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.top = '0';
    document.body.appendChild(clone);
    
    // Ensure all images are loaded
    const images = Array.from(clone.getElementsByTagName('img'));
    const imagePromises = images.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
    });

    // Wait for background image to load
    const bgImg = new Image();
    bgImg.src = 'https://dl.dropboxusercontent.com/scl/fi/d31dbw99yrujn6ytosjbu/bg.png?rlkey=4ul24wy33p0d2kx4mnemuziwr&st=0m4b2lye';
    const bgPromise = new Promise((resolve) => {
      bgImg.onload = resolve;
    });

    // Wait for all images to load
    Promise.all([...imagePromises, bgPromise])
      .then(() => {
        return html2canvas(clone, {
          backgroundColor: null,
          allowTaint: true,
          useCORS: true,
          scale: 2,
          logging: true,
          width: element.offsetWidth,
          height: element.offsetHeight,
          onclone: (clonedDoc) => {
            const clonedElement = clonedDoc.getElementById(targetId);
            if (clonedElement) {
              // Copy computed styles
              const styles = window.getComputedStyle(element);
              Array.from(styles).forEach(key => {
                clonedElement.style.setProperty(key, styles.getPropertyValue(key));
              });
              
              // Ensure background image is set
              clonedElement.style.backgroundImage = `url(${bgImg.src})`;
              clonedElement.style.backgroundSize = 'cover';
              clonedElement.style.backgroundPosition = 'center';
            }
          }
        });
      })
      .then(canvas => {
        // Convert to data URL with maximum quality
        const imgData = canvas.toDataURL('image/png', 1.0);
        
        // Create download link
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'tournament-screenshot.png';
        link.click();
        
        // Clean up
        document.body.removeChild(clone);
        toast.success('Screenshot saved!');
      })
      .catch(err => {
        console.error('Screenshot error:', err);
        document.body.removeChild(clone);
        toast.error('Failed to capture screenshot');
      });
  }, [targetId]);

  return (
    <button 
      onClick={takeScreenshot}
      className="fixed bottom-6 right-6 z-50 bg-primary text-white px-4 py-2 rounded-full
        flex items-center gap-2 shadow-glow-md hover:shadow-glow-lg transition-all duration-300"
    >
      <Camera size={18} />
      <span>Save Screenshot</span>
    </button>
  );
};

export default ScreenshotButton;