"use server"
import { Suspense } from 'react';
import ShopperLoginToggle from './components/ShopperLoginToggle';
import MerchantLoginToggle from './components/MerchantLoginToggle';
import ManufacturerLoginToggle from './components/ManufacturerLoginToggle'; 
import SignUpToggle from './components/SignupToggle';
import AboutPage from './components/About'
import HomeImage from './components/HomeImage';
import OnWhatsappToggle from './components/OnWhatsappToggle';
import ChatToggle from 'app/components/ChatToggle';

const Home = () => {
  return (
    <section className="heroSection">
      <div className="heroContent">
        <h1 className='dashboardHeading'><b>AI Powered Business</b></h1>
        <Suspense fallback={<p>Loading...</p>}>
          <ChatToggle />
        </Suspense>
        <Suspense fallback={<p>Loading...</p>}>
          <ShopperLoginToggle />
        </Suspense>
        <Suspense fallback={<p>Loading...</p>}>
          <MerchantLoginToggle />
        </Suspense>
        <Suspense fallback={<p>Loading...</p>}>
          <ManufacturerLoginToggle />
        </Suspense>
        <Suspense fallback={<p>Loading...</p>}>
          <SignUpToggle />
        </Suspense>
        <Suspense fallback={<p>Loading...</p>}>
          <OnWhatsappToggle />
        </Suspense>
        <h5 className='homeHeader1'>Seamless Shopping Experience | Instant | Friendly | Local</h5>
        <div className='homeComponents'>
        <Suspense fallback={<p>Loading...</p>}>
          <HomeImage />
        </Suspense>
        </div>
        <div className='homeComponents'>
        <Suspense fallback={<p>Loading...</p>}>
          <AboutPage />
        </Suspense>
        </div>
      </div>
    </section>
  );
};

export default Home;
