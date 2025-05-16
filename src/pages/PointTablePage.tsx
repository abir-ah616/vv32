import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import Header from '../components/Header';
import PointTable from '../components/PointTable';
import Footer from '../components/Footer';
import ScreenshotButton from '../components/ScreenshotButton';

const PointTablePage: React.FC = () => {
  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center"
      style={{
        backgroundImage: "url('https://dl.dropboxusercontent.com/scl/fi/d31dbw99yrujn6ytosjbu/bg.png?rlkey=4ul24wy33p0d2kx4mnemuziwr&st=0m4b2lye')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full flex justify-start p-4">
        <Link 
          to="/"
          className="glass px-4 py-2 rounded-full flex items-center gap-2 hover:bg-white/10 transition-all"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </div>
      
      <div 
        id="screenshot-area" 
        className="w-full max-w-4xl p-6 rounded-lg"
        style={{
          backgroundImage: "url('https://dl.dropboxusercontent.com/scl/fi/d31dbw99yrujn6ytosjbu/bg.png?rlkey=4ul24wy33p0d2kx4mnemuziwr&st=0m4b2lye')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '600px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Header />
        <div className="my-8">
          <PointTable />
        </div>
        <Footer />
      </div>
      
      <ScreenshotButton targetId="screenshot-area" />
    </div>
  );
};

export default PointTablePage;