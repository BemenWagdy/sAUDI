'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Download, 
  Share2, 
  MapPin, 
  Clock, 
  Utensils, 
  Car, 
  Plane,
  Calendar,
  DollarSign,
  Cloud,
  Star,
  QrCode,
  Info
} from 'lucide-react';
import { QuestionnaireData } from '@/lib/schemas';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ItineraryDisplayProps {
  data: QuestionnaireData;
  itinerary: string;
  weather?: any;
  restaurants?: any[];
  carRental?: any;
}

export default function ItineraryDisplay({ 
  data, 
  itinerary, 
  weather,
  restaurants = [],
  carRental
}: ItineraryDisplayProps) {
  const [loading, setLoading] = useState(false);

  const generatePDF = async () => {
    setLoading(true);
    try {
      const element = document.getElementById('itinerary-content');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('saudi-arabia-itinerary.pdf');
    } catch (error) {
      console.error('PDF generation error:', error);
    }
    setLoading(false);
  };

  const shareItinerary = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Saudi Arabia Itinerary',
          text: 'Check out my custom Saudi Arabia travel itinerary!',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTripDuration = () => {
    const start = new Date(data.travel_dates[0]);
    const end = new Date(data.travel_dates[1]);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header with Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Saudi Arabia Itinerary</h1>
          <p className="text-gray-600 mt-1">
            {getTripDuration()} days • {data.party_size} traveler{data.party_size > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={shareItinerary}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button
            onClick={generatePDF}
            disabled={loading}
            className="flex items-center gap-2 bg-[#006C35] hover:bg-[#005028]"
          >
            <Download className="w-4 h-4" />
            {loading ? 'Generating...' : 'Download PDF'}
          </Button>
        </div>
      </div>

      <div id="itinerary-content" className="space-y-6">
        {/* Trip Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#006C35]" />
              Trip Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#006C35]">
                  {formatDate(data.travel_dates[0])}
                </div>
                <p className="text-gray-600">Departure</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#006C35]">
                  {getTripDuration()} Days
                </div>
                <p className="text-gray-600">Duration</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#006C35]">
                  {formatDate(data.travel_dates[1])}
                </div>
                <p className="text-gray-600">Return</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weather Forecast */}
        {weather && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="w-5 h-5 text-[#006C35]" />
                Weather Forecast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Current Weather</h3>
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-bold text-[#006C35]">
                      {weather.current.temperature}°C
                    </div>
                    <div className="text-gray-600">
                      {weather.current.condition}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">5-Day Forecast</h3>
                  <div className="space-y-2">
                    {weather.forecast.map((day: any, index: number) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{day.date}</span>
                        <span className="font-medium">
                          {day.high}°/{day.low}°
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {day.precipitation}% rain
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {weather.chartUrl && (
                <div className="mt-4">
                  <img
                    src={weather.chartUrl}
                    alt="Weather Chart"
                    className="w-full max-w-md mx-auto"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* AI Generated Itinerary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#006C35]" />
              Your Personalized Itinerary
            </CardTitle>
            <CardDescription>
              AI-crafted itinerary based on your preferences and interests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {itinerary}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Restaurant Recommendations */}
        {restaurants.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-[#006C35]" />
                Recommended Restaurants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {restaurants.slice(0, 6).map((restaurant: any) => (
                  <div key={restaurant.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{restaurant.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm">{restaurant.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{restaurant.cuisine}</p>
                    <p className="text-sm font-medium text-[#006C35] mb-2">
                      {restaurant.pricePerPerson} SAR per person
                    </p>
                    <p className="text-sm text-gray-700">{restaurant.signature}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Car Rental */}
        {data.want_car && carRental && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5 text-[#006C35]" />
                Recommended Car Rental
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{carRental.type}</h3>
                    <p className="text-2xl font-bold text-[#006C35]">
                      {carRental.dailyRate} SAR/day
                    </p>
                  </div>
                  <Badge className="bg-[#006C35]">Recommended</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  {carRental.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[#006C35] rounded-full"></div>
                      {feature}
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total ({getTripDuration()} days):</span>
                    <span className="text-lg font-bold text-[#006C35]">
                      {carRental.dailyRate * getTripDuration()} SAR
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cultural Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-[#006C35]" />
              Cultural Tips & Guidelines
            </CardTitle>
            <CardDescription>
              Important information for a respectful and enjoyable visit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "🕌 Prayer times occur 5 times daily",
                "🍽️ No alcohol is served in Saudi Arabia",
                "👔 Dress modestly with covered shoulders",
                "🤝 Use your right hand for greetings",
                "📱 Free WiFi widely available",
                "🚗 Uber and Careem operate in cities",
                "💳 Credit cards widely accepted",
                "🗣️ Arabic and English spoken in tourist areas"
              ].map((tip, index) => (
                <div key={index} className="text-sm flex items-start gap-2">
                  <span className="flex-shrink-0">{tip.split(' ')[0]}</span>
                  <span>{tip.substring(tip.indexOf(' ') + 1)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}