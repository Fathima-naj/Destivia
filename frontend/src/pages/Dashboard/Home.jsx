import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from './Layout';
import HeroSection from './Hero';
import WhyChooseUs from './WhyChooseUs';
import Footer from './Footer';
import SearchResults from './SearchResults';
import { useSelector } from 'react-redux';
import PopularDestinations from './PopularDestination';

const Home = () => {
  const navigate = useNavigate();
  
  const { flights, loading: flightLoading } = useSelector(state => state.flights);
  const { hotels, loading: hotelLoading } = useSelector(state => state.hotels);
  const { places, status: placeLoading } = useSelector(state => state.place);
  const { activeTab } = useSelector(state => state.ui);

  // Check if there are any results or if a search is in progress
  const hasResults = flights?.length > 0 || hotels?.length > 0 || places?.length > 0;
  const isSearching = flightLoading || hotelLoading || placeLoading === 'loading';
  const showResults = hasResults || isSearching;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <HeroSection />
        
        {showResults && (
          <div className="container mx-auto px-4 py-12">
            <SearchResults 
              activeTab={activeTab}
              handleBookNow={(hotel) => {
                navigate(`/hotels/${hotel.hotelId}`);
              }}
            />
          </div>
        )}
        
        <div className="mt-12">
          <WhyChooseUs />
          <PopularDestinations />
          <Footer />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;
