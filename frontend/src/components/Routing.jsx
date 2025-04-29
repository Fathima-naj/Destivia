
import React from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

// Layout
import MainLayout from "../components/MainLayout";

// Auth pages
import SignUpPage from "../Auth/signup";
import Login from "../Auth/Login";

// Pages
import Home from "../pages/Dashboard/Home";
import HotelSearch from "../pages/Hotel/Hotel";
import Flight from "../pages/Flight/Flight";
import HotelDetails from "../pages/Hotel/HotelDetails";
import PlaceCard from "../pages/Place/PlaceCard";
import SearchCity from "../pages/Place/Place";
import PlaceDetails from "../pages/Place/placeDetails";
import UserProfile from "../pages/profile/UserProfile";
import HotelBookingForm from "../pages/Hotel/HotelBookingForm";
import FlightBookingForm from "../pages/Flight/FlightBooking";
import PlaceBookingForm from "../pages/Place/PlaceBookingForm";
import PublicChat from "../chat/PublicChat";

function Routing() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/sign-up/*" element={<SignUpPage />} />
      <Route path="/sign-in/*" element={<Login />} />

      {/* Home route */}
      <Route
        path="/"
        element={
          <>
            <SignedIn>
              <Home />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />

      {/* All other routes with MainLayout */}
      <Route
        element={
          <SignedIn>
            <MainLayout />
          </SignedIn>
        }
      >
        {/* Nested routes */}
        <Route path="hotels" element={<HotelSearch />} />
        <Route path="flight" element={<Flight />} />
        <Route path="hotels/:id" element={<HotelDetails />} />
        <Route path="h-booking" element={<HotelBookingForm />} />
        <Route path="places" element={<SearchCity />} />
        <Route path="placecard" element={<PlaceCard />} />
        <Route path="place/:fsq_id" element={<PlaceDetails />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="f-booking" element={<FlightBookingForm/>}/>
        <Route path="p-booking" element={<PlaceBookingForm/>}/>
        <Route path="chat" element={<PublicChat/>}/>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default Routing;
