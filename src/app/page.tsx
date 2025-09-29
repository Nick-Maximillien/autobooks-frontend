"use server"
import { Suspense } from 'react';
import ShopperLoginToggle from './components/ShopperLoginToggle';
import AboutPage from './components/About'
import HomeImage from './components/HomeImage';
import ShopperSignupToggle from './components/ShopperSignupToggle';
import OnWhatsappToggle from './components/OnWhatsappToggle';
import ChatToggle from 'app/components/ChatToggle';

const Home = () => {
  return (
    <section className="heroSection">
      <div className="heroContent">
        <h1 className='dashboardHeading'><b>AutoBooks AI</b></h1>
        <h3 className='homeHeader1'>AI-Powered Accounting & Business Copilot</h3>
        <Suspense fallback={<p>Loading...</p>}>
          <ChatToggle />
        </Suspense>
        <Suspense fallback={<p>Loading...</p>}>
          <ShopperLoginToggle />
        </Suspense>
        <Suspense fallback={<p>Loading...</p>}>
          <ShopperSignupToggle />
        </Suspense>
        <Suspense fallback={<p>Loading...</p>}>
          <OnWhatsappToggle />
        </Suspense>
        <h5 className='homeHeader1'>
          IFRS for SMEs Precision | Automated Document Engine | Personalized Guidance
        </h5>
          <div className='homeComponents'>
          <Suspense fallback={<p>Loading...</p>}>
            <AboutPage />
          </Suspense>
        </div>
        <div className='homeComponents'>
          <Suspense fallback={<p>Loading...</p>}>
            <HomeImage />
          </Suspense>
        </div>
      </div>
    </section>
  );
};

export default Home;
