"use client";
import carouselItems from "@/constants/featuresContent";
import { Carousel } from "@material-tailwind/react";
import React from "react";

const FeatureSection = () => {
  return (
    <div
      id="features"
      className="features relative h-[600px] md:p-10 flex flex-col items-center"
    >
      <div className="font-semibold text-xs tracking-[6px] absolute top-4 left-1/2 -translate-x-1/2 mb-6 lg:mb-10 text-center">
        FEATURES
      </div>
      <Carousel
        placeholder={"Features"}
        autoplay={true}
        autoplayDelay={14000}
        loop={true}
        className="w-full md:w-4/5 h-[500px] bg-[url('/images/genmanwp2.svg')] bg-cover bg-no-repeat"
      >
        {carouselItems.map((item, index) => (
          <div
            key={index}
            className={`flex flex-col h-[450px] md:h-[500px] p-12 pt-16 md:p-20 items-center `}
          >
            <div className="flex flex-col justify-between items-center">
              <h2 className="text-center font-semibold text-4xl lg:text-5xl mb-20">
                {item.title}
              </h2>
              <p className="text-center font-medium text-lg max-w-md">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default FeatureSection;
