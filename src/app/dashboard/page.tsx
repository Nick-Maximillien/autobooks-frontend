'use client';

import { useAuth } from 'context/AuthContext';
import CreateFarmToggle from 'app/components/createFarmToggle';
import OrderDroneButton from 'app/components/OrderDroneButton';
import StopDrone from 'app/components/StopDroneButton';
import DroneData from 'app/components/DroneData';
import UploadImages from 'app/components/UploadImages';
import FarmerProfile from 'app/components/FarmerProfile';
import CreateProfileToggle from 'app/components/CreateProfileToggle';
import WeatherWidget from 'app/components/WeatherWidget';
import Link from 'next/link';
import Farms from 'app/components/Farms';
import OnWhatsappToggle from 'app/components/OnWhatsappToggle';
import ChatToggle from 'app/components/ChatToggle';
import Bot from 'app/components/Bot';
import Uploader from 'app/components/AutoBooks';

export default function Dashboard() {
  const { accessToken } = useAuth();

  if (!accessToken) {
    return (
      <div className="dashboardGuest">
          <p className="signupRedirect">
            <Link className="links" href="/login">
            Signup or login manage your farm and get help
            </Link>
          </p>
      </div>
    );
  }

  return (
    <div className="dashboardContainer">
      <h2 className="dashboardHeading">📊 Farmer Dashboard 🌾</h2>


      <section className="dashboardGrid container">
        <div className="dashboardCard farmList">
          <Uploader />
        </div>
        <div className="dashboardCard farmList">
          <ChatToggle />
        </div>
          <div className="dashboardCard farmList">
          <Bot />
        </div>
         
        <div className="dashboardCard weatherCard">
          <WeatherWidget />
        </div>

        <div className="dashboardCard toggleCard">
          <CreateProfileToggle />
        </div>
        <div className="dashboardCard imageUploadCard">
          <UploadImages />
        </div>
          <div className="dashboardCard imageUploadCard">
          <OnWhatsappToggle />
        </div>

        <div className="dashboardCard farmList">
          <Farms />
        </div>

        <div className="dashboardCard formCard">
          <CreateFarmToggle />
        </div>
        <div className="dashboardCard imageUploadCard">
          <UploadImages />
        </div>
        <div className="dashboardCard imageUploadCard">
          <OnWhatsappToggle />
        </div>

        <div className="dashboardCard toggleCard droneButtons">
          <OrderDroneButton token={accessToken} />
          <StopDrone />
        </div>

        <div className="dashboardCard droneDataSection">
          <DroneData />
        </div>
      </section>
        <p className="signupRedirect">
          <Link className="links" href="/">
            Home
          </Link>
        </p>
    </div>
  );
}
