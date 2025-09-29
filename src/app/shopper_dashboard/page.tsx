'use client';

import { useAuth } from 'context/AuthContext';
import FarmerProfile from 'app/components/FarmerProfile';
import CreateProfileToggle from 'app/components/CreateProfileToggle';
import Link from 'next/link';
import OnWhatsappToggle from 'app/components/OnWhatsappToggle';
import ChatToggle from 'app/components/ChatToggle';
import Uploader from 'app/components/AutoBooks';
import BalanceSheetComponent from 'app/components/FinancialPosition';
import PNLComponent from 'app/components/PNL';

export default function ShopperDashboard() {
  const { accessToken } = useAuth();

  if (!accessToken) {
    return (
      <div className="dashboardGuest">
          <p className="signupRedirect">
            <Link className="links" href="/shopper_login">
            Signup or login for AI shopping assistance
            </Link>
          </p>
      </div>
    );
  }

  return (
    <div className="dashboardContainer">
      <h2 className="dashboardHeading">📊 Business Dashboard</h2>


      <section className="dashboardGrid container">
        <div className="dashboardCard farmList">
          <ChatToggle />
        </div>
        <div className="dashboardCard farmList">
          <Uploader />
        </div>
        <div className="dashboardCard farmList">
          <BalanceSheetComponent />
        </div>
        <div className="dashboardCard farmList">
          <PNLComponent />
        </div>
        <div className="dashboardCard profileCard">
          <FarmerProfile />
        </div>
         
        <div className="dashboardCard toggleCard">
          <CreateProfileToggle />
        </div>
        <div className="dashboardCard imageUploadCard">
          <OnWhatsappToggle />
        </div>
      </section>
        <p className="signupRedirec">
          <Link className="links" href="/">
            Home
          </Link>
        </p>
    </div>
  );
}
