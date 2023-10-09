"use client";
import ModalImage from "react-modal-image";
function ImageGallery() {
  const images = [
    {
      img: "/path/to/image1.jpg",
      alt: "Image 1",
    },
    {
      img: "/path/to/image2.jpg",
      alt: "Image 2",
    },
    {
      img: "/path/to/image3.jpg",
      alt: "Image 3",
    },
    // Add more image objects here
  ];

  return (
    <div>
      {images.map((image, index) => (
        <ModalImage
          key={index}
          small={image.img}
          large={image.img}
          alt={image.alt}
        />
      ))}
    </div>
  );
}
