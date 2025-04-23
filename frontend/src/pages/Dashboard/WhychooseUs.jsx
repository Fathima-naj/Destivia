import React from "react";
import { FaPlane, FaHotel, FaMapMarkedAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { GiCommercialAirplane } from "react-icons/gi";

const features = [
  {
    icon: <GiCommercialAirplane className="text-5xl text-blue-500 shadow-md bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full transition-transform duration-300 hover:scale-110 hover:animate-bounce" />,
    title: "Seamless Booking",
    description: "Book flights, hotels, and attractions in one place with ease.",
  },
  {
    icon: <FaHotel className="text-5xl text-green-500 bg-green-100 shadow-md dark:bg-green-900/30 p-3 rounded-full transition-transform duration-300 hover:scale-110 hover:animate-bounce" />,
    title: "Affordable Prices",
    description: "We compare prices across platforms to get you the best deal.",
  },
  {
    icon: <FaMapMarkedAlt className="text-5xl text-yellow-500 bg-yellow-100 shadow-md dark:bg-yellow-900/30 p-3 rounded-full transition-transform duration-300 hover:scale-110 hover:animate-bounce" />,
    title: "Explore Anywhere",
    description: "From local getaways to global adventures, explore with ease.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="bg-gradient-to-b from-[#f0f4f8] to-white dark:from-[#1f2937] dark:to-[#111827] py-20 px-6 md:px-20 ">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
        Why Choose Us
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 text-center"
          >
            <div className="mb-4 flex justify-center">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
