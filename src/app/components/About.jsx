'use client';
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="aboutContainer container py-5" 
         style={{ backgroundImage: "url('/images/aboutImg.jpeg')" }}>
      <h2 className="text-center aboutTitle mb-4">Welcome to:</h2>
      
      <div className="row gy-4">
        <div className="col-md-6">
          <ul className="aboutList">
            <li className="about-list">🌾 Instant crop disease/pest detection via WhatsApp or web</li>
            <li className="about-list">🧠 AI-generated recommendations for treatment</li>
            <li className="about-list">🚁 Integration with drone and satellite data for large farms</li>
            <li className="about-list">🌤️ Weather-aware farming advice</li>
            <li className="about-list">📊 Trackable history of uploads, analysis, and trends</li>
          </ul>
          <p className="aboutText">
            Agrosight is a a field companion, delivering AI as a 24/7 farm assistance in the farmer’s hands.
          </p>
        </div>
      </div>

      <button className="text-center mt-5 signupRedirect">
        <Link href="/signup" className="btn btnabt btn-outline-success">Join Agrosight farmers seeking to improve yields through smart farming</Link>
      </button>
    </div>
  );
}
