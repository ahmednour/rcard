import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const ImageSlider = ({ images, onSelect, selectedIndex }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Update the internal index when the selectedIndex prop changes
  useEffect(() => {
    setCurrentIndex(selectedIndex);
  }, [selectedIndex]);

  // Set loaded state after component mounts
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % images.length;
      return nextIndex;
    });
  };

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex === 0 ? images.length - 1 : prevIndex - 1;
      return nextIndex;
    });
  };

  const handleSelect = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    onSelect(index);
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? -30 : 30,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
        scale: { duration: 0.5 },
        rotateY: { duration: 0.5 },
      },
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction < 0 ? 30 : -30,
      transition: {
        duration: 0.5,
      },
    }),
  };

  const navButtonVariants = {
    rest: { scale: 1, opacity: 0.8 },
    hover: { scale: 1.2, opacity: 1 },
    tap: { scale: 0.9 },
  };

  const dotVariants = {
    inactive: { width: 12, backgroundColor: "#e2e8f0" },
    active: {
      width: 24,
      backgroundColor: "#84923a",
      transition: { duration: 0.3 },
    },
  };

  const thumbnailVariants = {
    inactive: {
      scale: 1,
      opacity: 0.7,
      borderColor: "transparent",
    },
    active: {
      scale: 1.05,
      opacity: 1,
      borderColor: "#84923a",
      transition: { duration: 0.3 },
    },
    hover: {
      scale: 1.03,
      opacity: 0.9,
      transition: { duration: 0.2 },
    },
  };

  const buttonVariants = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Background gradient for aesthetic appeal */}
      <div className="absolute inset-0  -z-10" />

      <motion.h3
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center font-semibold text-lg mb-2 text-gray-700"
      >
        اختر من بين التصاميم المتوفرة
      </motion.h3>

      <div className="overflow-hidden relative h-[500px]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute w-full h-full flex justify-center items-center perspective-1000"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: 0.2, duration: 0.3 },
              }}
              className="relative"
            >
              <div className="relative">
                <Image
                  src={images[currentIndex]}
                  alt={`Card template ${currentIndex + 1}`}
                  width={400}
                  height={600}
                  priority
                  className={`h-[500px] w-[340px] object-contain cursor-pointer rounded-lg shadow-lg ${
                    selectedIndex === currentIndex
                      ? "border-[#cbe44c] border-4"
                      : "border-transparent border-4"
                  } transition-all duration-300 hover:border-[#cbe44c]/70`}
                  onClick={() => handleSelect(currentIndex)}
                />

                {/* Selection indicator badge */}
                {selectedIndex === currentIndex ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="absolute top-4 right-4 bg-[#84923a] text-white rounded-full p-2 shadow-lg z-10"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <div className="bg-black bg-opacity-40 p-3 rounded-lg">
                      <div className="text-white text-center font-bold">
                        انقر لاختيار هذا التصميم
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Card number indicator */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white rounded-lg px-3 py-1 text-sm shadow-lg"
              >
                التصميم {currentIndex + 1} من {images.length}
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Selection button overlay */}
        {selectedIndex !== currentIndex && (
          <motion.button
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
            onClick={() => handleSelect(currentIndex)}
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-[#84923a] text-white py-2 px-6 rounded-full shadow-lg z-20"
          >
            اختر هذا التصميم
          </motion.button>
        )}

        {/* Navigation arrows */}
        <motion.button
          onClick={handlePrevious}
          variants={navButtonVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          className="absolute top-1/2 left-2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg z-10 transition-all duration-300"
          aria-label="Previous design"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#84923a"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </motion.button>
        <motion.button
          onClick={handleNext}
          variants={navButtonVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          className="absolute top-1/2 right-2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg z-10 transition-all duration-300"
          aria-label="Next design"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#84923a"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </motion.button>
      </div>

      {/* Selected template indicator */}
      {selectedIndex !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 text-center"
        >
          <div className="flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-500 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-green-800">
              تم اختيار التصميم {selectedIndex + 1}
            </p>
          </div>
        </motion.div>
      )}

      {/* Thumbnail navigation */}
      <div className="mt-6 flex justify-center space-x-3 rtl:space-x-reverse overflow-x-auto pb-2">
        {images.map((img, index) => (
          <motion.div
            key={index}
            variants={thumbnailVariants}
            initial="inactive"
            animate={currentIndex === index ? "active" : "inactive"}
            whileHover="hover"
            className={`relative cursor-pointer border-2 rounded-lg overflow-hidden shadow-sm ${
              selectedIndex === index ? "ring-2 ring-[#84923a]" : ""
            }`}
            onClick={() => handleSelect(index)}
          >
            <Image
              src={img}
              alt={`Thumbnail ${index + 1}`}
              width={60}
              height={90}
              className="rounded h-[90px] w-[60px] object-cover"
            />
            {/* Selection indicator for thumbnails */}
            {selectedIndex === index && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-0 right-0 bg-[#84923a] text-white rounded-bl p-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
