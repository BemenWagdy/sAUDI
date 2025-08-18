import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { QuestionnaireData, COUNTRIES } from '@/lib/schemas';
import { convertToSAR } from '@/lib/currency';
import { getWeatherForecast } from '@/lib/weather';
import { carRentalRates, getCarRecommendation } from '@/lib/car-rental';
import restaurants from '@/data/restaurants.json';
import { culturalTips, visaGuidance } from '@/data/cultural-tips';

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

export async function POST(request: NextRequest) {
  try {
    if (!groq) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const data: QuestionnaireData = await request.json();
    
    // Get user's country and currency info
    const originCountry = COUNTRIES.find(c => c.code === data.origin_country);
    const currency = originCountry?.currency || 'USD';
    
    // Convert budget to SAR
    const budgetInSAR = await convertToSAR(data.budget, currency);
    
    // Calculate trip duration
    const startDate = new Date(data.travel_dates[0]);
    const endDate = new Date(data.travel_dates[1]);
    const tripDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Get weather data for major Saudi cities
    const weatherData = await getWeatherForecast('Riyadh').catch(() => null);
    
    // Get car rental recommendation if needed
    let carRecommendation = null;
    if (data.want_car) {
      const recommendedCarType = getCarRecommendation(data.party_size, budgetInSAR, tripDays);
      carRecommendation = carRentalRates[recommendedCarType];
    }
    
    // Filter restaurants based on food preferences
    const filteredRestaurants = restaurants.filter(restaurant => {
      if (data.food_pref === 'vegetarian' && !['Lebanese', 'International'].includes(restaurant.cuisine)) {
        return false;
      }
      if (data.food_pref === 'vegan' && restaurant.cuisine === 'Traditional Saudi') {
        return false;
      }
      return true;
    });

    // Create comprehensive prompt for Groq
    const systemPrompt = `You are an elite Saudi travel planner with deep knowledge of Saudi Arabia's culture, attractions, logistics, and current tourism offerings. Create a detailed, day-by-day itinerary that showcases the best of Saudi Arabia while respecting cultural norms and the user's specific preferences.

Key Requirements:
- Provide specific, actionable recommendations with real locations and activities
- Include cultural context and respectful travel advice
- Suggest optimal timing for activities considering prayer times and local customs
- Balance must-see attractions with hidden gems
- Consider seasonal weather and regional differences
- Provide practical logistics information (transportation, booking tips, etc.)
- Include cost estimates in Saudi Riyals (SAR)
- Respect dietary restrictions and accessibility needs
- Highlight unique Saudi experiences that showcase Vision 2030 developments

Format your response as a detailed itinerary with:
1. Day-by-day schedule with specific activities and timings
2. Detailed descriptions of attractions and experiences
3. Practical tips for each activity
4. Cost estimates where relevant
5. Transportation recommendations
6. Cultural insights and etiquette reminders`;

    const userPrompt = `Create a personalized Saudi Arabia itinerary with these details:

TRAVELER PROFILE:
- Origin: ${originCountry?.name || 'Unknown'} (${data.party_size} travelers)
- Travel Dates: ${data.travel_dates[0]} to ${data.travel_dates[1]} (${tripDays} days)
- Budget: ${budgetInSAR.toLocaleString()} SAR total
- Interests: ${data.interests.join(', ')}
- Food Preference: ${data.food_pref}
- Car Rental: ${data.want_car ? 'Yes' : 'No'}
- Mobility: ${data.mobility}

ADDITIONAL CONTEXT:
- Current weather in Riyadh: ${weatherData ? `${weatherData.current.temperature}°C, ${weatherData.current.condition}` : 'Mild and sunny'}
- Recommended restaurants available: ${filteredRestaurants.slice(0, 5).map(r => r.name).join(', ')}
- Car rental option: ${carRecommendation ? `${carRecommendation.type} at ${carRecommendation.dailyRate} SAR/day` : 'Public transport and ride-sharing'}

Please create a comprehensive itinerary that maximizes their experience while staying within budget and respecting all cultural considerations.`;

    // Generate streaming response from Groq
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'llama3-8b-8192',
      temperature: 0.7,
      max_tokens: 4000,
      stream: true
    });

    // Create a readable stream for the response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of chatCompletion) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate itinerary' },
      { status: 500 }
    );
  }
}