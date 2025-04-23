import React from "react";
import { motion } from "framer-motion";

const destinations = [
  {
    name: "Paris",
    country: "France",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
  },
  {
    name: "Maldives",
    country: "Indian Ocean",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  },
  {
    name: "Bali",
    country: "Indonesia",
    image: "https://images.pexels.com/photos/1643130/pexels-photo-1643130.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    name: "New York",
    country: "USA",
    image: "https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

const PopularDestinations = () => {
  return (
    <section className="bg-gradient-to-b from-white to-[#f0f4f8] dark:from-[#1f2937] dark:to-[#111827] py-16 px-4 md:px-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
        Popular Destinations
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {destinations.map((dest, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            viewport={{ once: true }}
            className="bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 cursor-pointer"
          >
            <img
              src={dest.image}
              alt={dest.name}
              className="w-full h-52 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{dest.name}</h3>
              <p className="text-gray-600 dark:text-gray-300">{dest.country}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default PopularDestinations;
