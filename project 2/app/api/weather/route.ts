import { NextRequest, NextResponse } from 'next/server';
import { getWeatherForecast } from '@/lib/weather';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city') || 'Riyadh';

  try {
    const weatherData = await getWeatherForecast(city);
    return NextResponse.json(weatherData);
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}