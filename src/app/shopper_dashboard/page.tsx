'use client';

import { useAuth } from 'context/AuthContext';
import FarmerProfile from 'app/components/FarmerProfile';
import CreateProfileToggle from 'app/components/CreateProfileToggle';
import Link from 'next/link';
import OnWhatsappToggle from 'app/components/OnWhatsappToggle';
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

        <style jsx>{`
          .dashboardGuest {
            min-height: 80vh;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Inter', sans-serif;
            background: #f5f6fa;
            color: #333;
            text-align: center;
          }

          .signupRedirect {
            font-size: 1.2rem;
            background: #fff;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }

          .links {
            color: #8a2be2;
            text-decoration: none;
            font-weight: 500;
          }

          .links:hover {
            text-decoration: underline;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="dashboardContainer">
      <h2 className="dashboardHeading">📊 Business Dashboard</h2>

      <section className="dashboardGrid container">
        <div className="dashboardCard">
          <Uploader />
        </div>
        <div className="dashboardCard">
          <BalanceSheetComponent />
        </div>
        <div className="dashboardCard">
          <PNLComponent />
        </div>
        <div className="dashboardCard">
          <FarmerProfile />
        </div>
        <div className="dashboardCard">
          <CreateProfileToggle />
        </div>
        <div className="dashboardCard">
          <OnWhatsappToggle />
        </div>
      </section>

      <p className="signupRedirect">
        <Link className="links" href="/">
          Home
        </Link>
      </p>

      <style jsx>{`
        .dashboardContainer {
          padding: 5px;
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
        }

        .dashboardHeading {
          text-align: center;
          font-size: 2rem;
          margin-bottom: 2rem;
          color: #8a2be2;
        }

        .dashboardGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .dashboardCard {
          background: #fff;
          border-radius: 16px;
          padding: 0.5rem;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .dashboardCard:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
        }

        .signupRedirect {
          text-align: center;
          font-size: 1rem;
          margin-top: 2rem;
        }

        .links {
          color: #8a2be2;
          text-decoration: none;
          font-weight: 500;
        }

        .links:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .dashboardHeading {
            font-size: 1.6rem;
          }

          .dashboardGrid {
            gap: 1rem;
          }

          .dashboardCard {
            padding: 1rem;
          }
        }

        @media (max-width: 480px) {
          .dashboardHeading {
            font-size: 1.4rem;
          }
        }
      `}</style>
    </div>
  );
}
