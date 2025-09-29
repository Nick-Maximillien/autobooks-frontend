'use client';
import Link from "next/link";
import DiagnoseOnWhatsapp from "app/components/DiagnoseOnWhatsapp";

export default function ServicesPage() {
  return (
    <div className="dashboardContainer">
      <h2 className="dashboardHeading">AutoBooks AI Services</h2>

      <div className="dashboardGrid container">
        {/* 1. Smart Expense Tracking */}
        <div className="col-md-6 serviceCard">
          <h4 className="serviceTitle">💳 Smart Expense Tracking</h4>
          <p className="serviceDescription">
            Automatically separate business and personal transactions with AI precision, giving SMEs a clear view of their true financial position.
          </p>
        </div>

        {/* 2. AI Insights & Forecasting */}
        <div className="col-md-6 serviceCard">
          <h4 className="serviceTitle">🧠 AI Insights & Forecasting</h4>
          <p className="serviceDescription">
            Generate instant insights on cash flow, profitability, and upcoming obligations—powered by an AI engine trained on IFRS for SMEs.
          </p>
        </div>

        {/* 3. Real-Time Financial Health */}
        <div className="col-md-6 serviceCard">
          <h4 className="serviceTitle">📊 Real-Time Financial Health</h4>
          <p className="serviceDescription">
            View dashboards that update automatically from your data sources—mobile money, bank feeds, and uploaded documents—so you always know where your business stands.
          </p>
        </div>

        {/* 4. AI-Powered Document Engine */}
        <div className="col-md-6 serviceCard">
          <h4 className="serviceTitle">📂 AI-Powered Document Engine</h4>
          <p className="serviceDescription">
            Upload receipts, invoices, or statements and let AutoBooks AI extract, classify, and reconcile them instantly into structured records.
          </p>
        </div>

        {/* 5. Personalized Business Copilot */}
        <div className="col-md-6 serviceCard">
          <h4 className="serviceTitle">🤝 Personalized Business Copilot</h4>
          <p className="serviceDescription">
            Get proactive reminders and tailored prompts—whether it’s separating funds, paying suppliers, or saving for taxes—delivered in plain, actionable language.
          </p>
        </div>

        {/* 6. Compliance & Reporting */}
        <div className="col-md-6 serviceCard">
          <h4 className="serviceTitle">📑 Compliance & Reporting</h4>
          <p className="serviceDescription">
            Generate clean, standards-aligned reports with one click, helping SMEs stay compliant and investor-ready without the usual accounting overhead.
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
