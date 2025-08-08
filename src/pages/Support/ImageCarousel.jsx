import React, { useRef } from "react";
import { Carousel, Button } from "antd";

const ImageCarousel = ({ images,record }) => {
  const carouselRef = useRef(null);
  
 const displayImages = [
    "/assets/img/banner.png",
    "/assets/img/meeting-done.jpg",
    // "https://via.placeholder.com/600x200?text=Image+3"
  ];

  return (
    <div style={{ width: "100%", maxWidth: "100px", textAlign: "center" }}>
 

      <Carousel ref={carouselRef} dots={false}>
        {record?.imageList.map((src, index) => (
          <div key={index}>
            <img
              src={src}
              alt={`Image ${index + 1}`}
              style={{ width: "100%", height: "100px", objectFit: "cover" }}
            />
          </div>
        ))}
      </Carousel>
      <div className="d-flex justify-content-center">
          <Button onClick={() => carouselRef.current?.prev()} style={{ margin: "5px" }}>
        {/* Previous */}{"<"}
      </Button>

      <Button onClick={() => carouselRef.current?.next()} style={{ margin: "5px" }}>
        {/* Next */}{">"}
      </Button>

      </div>
         
    </div>
  );
};

export default ImageCarousel;
