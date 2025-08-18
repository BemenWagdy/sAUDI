'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import QuestionnaireForm from '@/components/questionnaire-form';
import ItineraryDisplay from '@/components/itinerary-display';
import { QuestionnaireData } from '@/lib/schemas';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Star, Clock, Users } from 'lucide-react';
import restaurants from '@/data/restaurants.json';
import { carRentalRates, getCarRecommendation } from '@/lib/car-rental';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<'form' | 'loading' | 'result'>('form');
  const [formData, setFormData] = useState<QuestionnaireData | null>(null);
  const [itinerary, setItinerary] = useState<string>('');
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (data: QuestionnaireData) => {
    setFormData(data);
    setLoading(true);
    setCurrentStep('loading');

    try {
      // Fetch weather data
      const weatherResponse = await fetch(`/api/weather?city=Riyadh`);
      const weatherData = await weatherResponse.json();
      setWeather(weatherData);

      // Generate itinerary
      const response = await fetch('/api/compile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to generate itinerary');
      }

      const reader = response.body?.getReader();
      let accumulatedText = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = new TextDecoder().decode(value);
          accumulatedText += chunk;
          setItinerary(accumulatedText);
        }
      }

      setCurrentStep('result');
    } catch (error) {
      console.error('Error generating itinerary:', error);
      setItinerary('Sorry, there was an error generating your itinerary. Please try again.');
      setCurrentStep('result');
    } finally {
      setLoading(false);
    }
  };

  const handleStartOver = () => {
    setCurrentStep('form');
    setFormData(null);
    setItinerary('');
    setWeather(null);
  };

  const getCarRental = () => {
    if (!formData || !formData.want_car) return null;
    
    const tripDays = Math.ceil(
      (new Date(formData.travel_dates[1]).getTime() - new Date(formData.travel_dates[0]).getTime()) / 
      (1000 * 60 * 60 * 24)
    );
    
    const recommendedCarType = getCarRecommendation(formData.party_size, formData.budget * 3.75, tripDays);
    return carRentalRates[recommendedCarType];
  };

  if (currentStep === 'form') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <img
                src="https://i.ibb.co/99z3ZqR/images.png"
                alt="Visit Saudi"
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Visit Saudi Concierge</h1>
                <p className="text-gray-600">Your AI-Powered Saudi Arabia Travel Planner</p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Discover the Magic of
              <span className="text-[#006C35] block">Saudi Arabia</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Let our AI create a personalized itinerary that combines ancient heritage with modern wonders, 
              tailored to your interests, budget, and travel style.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#006C35] rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Personalized Routes</h3>
                <p className="text-gray-600 text-sm">AI-crafted itineraries based on your interests</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#006C35] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Expert Recommendations</h3>
                <p className="text-gray-600 text-sm">Curated experiences and hidden gems</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#006C35] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Instant Planning</h3>
                <p className="text-gray-600 text-sm">Get your complete itinerary in seconds</p>
              </div>
            </div>
          </motion.div>

          {/* Questionnaire */}
          <QuestionnaireForm onSubmit={handleFormSubmit} loading={loading} />

          {/* Features Preview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16"
          >
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
              What You&apos;ll Get
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-l-4 border-l-[#006C35]">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-lg mb-2">Visa Guidance</h4>
                  <p className="text-gray-600 text-sm">
                    Complete visa requirements and application process for your country
                  </p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-[#006C35]">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-lg mb-2">Weather Forecasts</h4>
                  <p className="text-gray-600 text-sm">
                    Real-time weather data and what to pack for your travel dates
                  </p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-[#006C35]">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-lg mb-2">Cultural Tips</h4>
                  <p className="text-gray-600 text-sm">
                    Essential cultural guidelines and etiquette for respectful travel
                  </p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-[#006C35]">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-lg mb-2">PDF Export</h4>
                  <p className="text-gray-600 text-sm">
                    Download your complete itinerary as a beautiful PDF
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  if (currentStep === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-[#006C35] rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <MapPin className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Creating Your Itinerary
            </h2>
            <p className="text-gray-600 mb-4">
              Our AI is crafting the perfect Saudi Arabia experience for you...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-[#006C35] h-2 rounded-full"
                animate={{ width: ['0%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src="https://i.ibb.co/99z3ZqR/images.png"
                alt="Visit Saudi"
                className="h-10 w-auto"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Visit Saudi Concierge</h1>
              </div>
            </div>
            <button
              onClick={handleStartOver}
              className="text-[#006C35] hover:text-[#005028] font-medium"
            >
              Plan Another Trip
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {formData && (
          <ItineraryDisplay
            data={formData}
            itinerary={itinerary}
            weather={weather}
            restaurants={restaurants.slice(0, 6)}
            carRental={getCarRental()}
          />
        )}
      </main>
    </div>
  );
}