import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, Menu } from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

export default function HomePage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 7;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Carousel */}
      <section className="bg-gray-200 relative py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Left Arrow */}
            <button 
              onClick={prevSlide}
              className="p-3 hover:bg-gray-300 rounded-full transition flex-shrink-0 z-10"
            >
              <ChevronLeft size={40} className="text-gray-700" strokeWidth={2.5} />
            </button>

            {/* Content Area */}
            <div className="flex items-center justify-between flex-1 px-12">
              {/* Movie Info */}
              <div className="space-y-3">
                <div className="text-lg font-medium text-gray-800">2025 2h25m</div>
                <div className="text-base text-gray-800">
                  <span className="font-semibold">United State</span>
                  <span className="mx-2">|</span>
                  <span>Crime, Thriller, Honor</span>
                </div>
                <button className="bg-gray-800 text-white px-7 py-3 flex items-center gap-2 hover:bg-gray-700 transition rounded-md mt-4">
                  <Play size={20} fill="white" />
                  <span className="font-medium">Watch Trailer</span>
                </button>
              </div>

              {/* Movie Poster */}
              <div 
                onClick={() => navigate('/movie/1')}
                className="w-72 h-96 bg-white flex items-center justify-center shadow-2xl cursor-pointer hover:opacity-80 transition"
              >
                <div className="text-gray-300">
                  <svg width="180" height="180" viewBox="0 0 180 180">
                    <line x1="30" y1="30" x2="150" y2="150" stroke="currentColor" strokeWidth="18" />
                    <line x1="150" y1="30" x2="30" y2="150" stroke="currentColor" strokeWidth="18" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Right Arrow */}
            <button 
              onClick={nextSlide}
              className="p-3 hover:bg-gray-300 rounded-full transition flex-shrink-0 z-10"
            >
              <ChevronRight size={40} className="text-gray-700" strokeWidth={2.5} />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {[...Array(totalSlides)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === currentSlide ? 'bg-gray-700 w-10' : 'bg-gray-400 w-2.5'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="max-w-7xl mx-auto py-16 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Popular Interest */}
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Popular Interest</h2>
            <div className="bg-gray-200 p-8 rounded-lg">
              <div className="flex justify-between gap-5 mb-5">
                {[1, 2, 3].map((item) => (
                  <div 
                    key={item} 
                    onClick={() => navigate(`/movie/${item}`)}
                    className="flex-1 aspect-square bg-white flex items-center justify-center shadow-sm cursor-pointer hover:opacity-80 transition"
                  >
                    <div className="text-gray-300">
                      <svg width="100%" height="100%" viewBox="0 0 100 100" className="w-20 h-20">
                        <line x1="20" y1="20" x2="80" y2="80" stroke="currentColor" strokeWidth="8" />
                        <line x1="80" y1="20" x2="20" y2="80" stroke="currentColor" strokeWidth="8" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-gray-800">
                <Menu size={18} strokeWidth={2} />
                <span className="font-semibold text-sm">List</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold mt-4 text-gray-900">What to watch in November</h3>
          </div>

          {/* Worst Reviewed */}
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Worst Reviewed</h2>
            <div className="bg-gray-200 p-8 rounded-lg">
              <div className="flex justify-between gap-5 mb-5">
                {[1, 2, 3].map((item) => (
                  <div 
                    key={item} 
                    onClick={() => navigate(`/movie/${item + 3}`)}
                    className="flex-1 aspect-square bg-white flex items-center justify-center shadow-sm cursor-pointer hover:opacity-80 transition"
                  >
                    <div className="text-gray-300">
                      <svg width="100%" height="100%" viewBox="0 0 100 100" className="w-20 h-20">
                        <line x1="20" y1="20" x2="80" y2="80" stroke="currentColor" strokeWidth="8" />
                        <line x1="80" y1="20" x2="20" y2="80" stroke="currentColor" strokeWidth="8" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-gray-800">
                <Menu size={18} strokeWidth={2} />
                <span className="font-semibold text-sm">List</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold mt-4 text-gray-900">Lowest rated movie</h3>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}