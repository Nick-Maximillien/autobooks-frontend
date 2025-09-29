'use client';
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="aboutContainer container py-5" 
         style={{ backgroundImage: "url('/images/b.png')" }}>
      <h2 className="text-center aboutTitle mb-4">Welcome to AutoBooks AI</h2>
      
      <div className="row gy-4">
        <div className="col-md-6">
          <ul className="aboutList">
            <li className="about-list">📑 AI-powered document engine — scan receipts, invoices, and statements</li>
            <li className="about-list">🧾 Fully aligned with IFRS for SMEs — precision in every entry</li>
            <li className="about-list">🤖 Personalized business copilot — track cash flow, expenses, and insights</li>
            <li className="about-list">📊 Real-time balance sheets and financial reports</li>
            <li className="about-list">🌍 Lightweight, cloud-native ERP designed for SMEs everywhere</li>
          </ul>
          <p className="aboutText">
            AutoBooks AI is your always-on business companion — merging accounting standards 
            with AI intelligence to give small businesses clarity, compliance, and control.
          </p>
        </div>
      </div>

      <button className="text-center mt-5 signupRedirect">
        <Link href="/signup" className="btn btnabt btn-outline-success">
          Join AutoBooks AI and simplify your business finance with intelligent accounting
        </Link>
      </button>
    </div>
  );
}
