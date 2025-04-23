import { ToastContainer } from "react-toastify";
import Routing from "./components/Routing";
import { ClerkLoading, ClerkLoaded } from '@clerk/clerk-react';
import travelIcon from "./assets/global-travel.png"; 

function App() {
  return (
    <>
    <div>
    <ToastContainer position="top-right" autoClose={3000} />
    <ClerkLoading>
  <div className="min-h-screen flex flex-col items-center justify-center bg-white">
    <img src={travelIcon} alt="Logo" className="w-20 h-20 mb-4 animate-pulse" />
    <p className="text-lg text-gray-600 font-semibold">Loading your personalized experience...</p>
  </div>
</ClerkLoading>

      <ClerkLoaded>
        <Routing />
       
      </ClerkLoaded>
       
      </div>
    </>
  );
}

export default App;
