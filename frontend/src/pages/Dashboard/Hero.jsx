import React from 'react';
import { motion } from 'framer-motion';
import Input from './Input';

const HeroSection = () => {
  return (
    <section
      className="relative min-h-[600px] w-full bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/2901212/pexels-photo-2901212.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 container mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-6 text-white text-center"
        >
          Find Your Perfect Journey
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-white/90 text-center mb-12 max-w-2xl"
        >
          Compare prices, book hotels, flights, and discover top attractions in one place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-6xl"
        >
          <Input showResultsInHero={false} />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
