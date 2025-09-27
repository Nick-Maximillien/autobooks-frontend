'use client';
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="aboutContainer container py-5">
      <h2 className="text-center aboutTitle mb-4">About Agrosight AI</h2>
      
      <div className="row gy-4">
        <div className="col-md-6">
          <p className="aboutText">
            <strong>Agrosight AI</strong> is a Kenyan-built agricultural intelligence platform that empowers farmers through cutting-edge computer vision and real-time data. Whether it’s diagnosing crop diseases from images, advising based on drone footage, or offering hyper-local weather data — Agrosight AI brings deep technology to the heart of the farm.
          </p>
          <p className="aboutText">
            Our mission is to make modern AI tools accessible to every rural farmer in Africa, regardless of internet connection or location.
          </p>
        </div>

        <div className="col-md-6">
          <p className="aboutText">
            Built with simplicity and field reliability in mind, the platform includes:
          </p>
          <ul className="aboutList">
            <li>🌾 Instant crop disease/pest detection via WhatsApp or web</li>
            <li>🧠 AI-generated recommendations for treatment</li>
            <li>🚁 Integration with drone and satellite data for large farms</li>
            <li>🌤️ Weather-aware farming advice</li>
            <li>📊 Trackable history of uploads, analysis, and trends</li>
          </ul>
          <p className="aboutText">
            Agrosight is more than software — it’s a rural companion, delivering AI as an invisible layer of intelligence in the farmer’s hands.
          </p>
        </div>
      </div>

      <div className="text-center mt-5">
        <Link href="/" className="btn btn-outline-success">Back to Home</Link>
      </div>
    </div>
  );
}
