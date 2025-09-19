"use client";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Image from "next/image";
import { useEffect, useState } from "react";

const ImageZoom = ({ src, onClose }: { src: string; onClose: () => void }) => {
  const [scale, setScale] = useState(1);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 transition-opacity duration-300">
      <TransformWrapper
        doubleClick={{ disabled: true }}
        wheel={{ disabled: false }}
        pinch={{ step: 5 }}
        panning={{ velocityDisabled: false }}
        onTransformed={(ref) => setScale(ref.state.scale)}
      >
        {({ zoomIn, resetTransform }) => (
          <TransformComponent wrapperClass="flex items-center justify-center w-full h-full">
            <div
              className={`relative w-auto h-auto max-w-[95vw] max-h-[90vh] transition-transform duration-300 ${
                scale > 1 ? "cursor-zoom-out" : "cursor-zoom-in"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                if (scale === 1) {
                  zoomIn(0.5);
                }
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                resetTransform();
              }}
            >
              <Image
                src={src}
                alt="Attachment Preview"
                width={1600}
                height={1200}
                className="object-contain max-w-full max-h-full"
              />
            </div>
          </TransformComponent>
        )}
      </TransformWrapper>
    </div>
  );
};

export default ImageZoom;
