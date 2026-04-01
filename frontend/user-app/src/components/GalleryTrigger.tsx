'use client';

import { useState } from 'react';
import { IconImages } from '@/components/Icons';
import GalleryModal from '@/components/GalleryModal';

interface Props {
  images: string[];
  propertyName: string;
}

export default function GalleryTrigger({ images, propertyName }: Props) {
  const [open, setOpen] = useState(false);

  if (images.length <= 1) return null;

  return (
    <>
      <button
        className="gallery-all-btn"
        aria-label="عرض جميع الصور"
        onClick={() => setOpen(true)}
      >
        <IconImages size={16} strokeWidth={1.75} />
        عرض جميع الصور ({images.length.toLocaleString('en-US')})
      </button>

      {open && (
        <GalleryModal
          images={images}
          propertyName={propertyName}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
