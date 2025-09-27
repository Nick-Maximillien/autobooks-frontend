'use client';
import Link from "next/link";
import DiagnoseOnWhatsapp from "app/components/DiagnoseOnWhatsapp";

export default function ServicesPage() {
  return (
    <div className="dashboardContainer">
      <h2 className="dashboardHeading">Agrosight Services</h2>

      <div className="dashboardGrid container">
        {/* 1. Image-Based Diagnosis */}
        <div className="col-md-6 serviceCard">
          <h4 className="serviceTitle">📸 Crop Disease & Pest Detection</h4>
          <p className="serviceDescription">
            Farmers can upload images of their crops and instantly receive AI-powered diagnoses of diseases and pests, enabling early intervention and better yield outcomes.
          </p>
        </div>

        {/* 2. Insight Generator */}
        <div className="col-md-6 serviceCard">
          <h4 className="serviceTitle">🧠 AI Insights & Recommendations</h4>
          <p className="serviceDescription">
            Each diagnosis comes with tailored insights and recommendations to guide farmers on the best treatment or action plan.
          </p>
        </div>

        {/* 3. Weather */}
        <div className="col-md-6 serviceCard">
          <h4 className="serviceTitle">🌤️ Real-Time Weather Advisory</h4>
          <p className="serviceDescription">
            Farmers get real-time weather data and localized forecasts, helping them plan farming activities like irrigation, spraying, and harvesting.
          </p>
        </div>

        {/* 4. Drone Feed */}
        <div className="col-md-6 serviceCard">
          <h4 className="serviceTitle">🚁 Drone Data Integration</h4>
          <p className="serviceDescription">
            Our platform supports real-time drone feeds and integrates aerial imagery for wider farm assessment and AI-based analysis.
          </p>
        </div>

        {/* 5. Upload History */}
        <div className="col-md-6 serviceCard">
          <h4 className="serviceTitle">📂 Upload History & Reports</h4>
          <p className="serviceDescription">
            Farmers can track past diagnoses, insights, and analysis results from their uploads — all securely stored and easy to access.
          </p>
        </div>

        {/* 6. Farm Management */}
        <div className="col-md-6 serviceCard">
          <h4 className="serviceTitle">🌱 Digital Farm Management</h4>
          <p className="serviceDescription">
            Farmers can register and manage their farms, including crop types, sizes, and locations, for better tracking and AI personalization.
          </p>
        </div>
      </div>
      <div className="dashboardGrid container">
        <DiagnoseOnWhatsapp />
      </div>
          <p className="signupRedirect">
            <Link className="links" href="/">
              Home
            </Link>
          </p>
    </div>
  );
}
