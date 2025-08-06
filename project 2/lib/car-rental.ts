export interface CarRental {
  type: string;
  dailyRate: number;
  features: string[];
  image: string;
}

export const carRentalRates: Record<string, CarRental> = {
  economy: {
    type: 'Economy Car',
    dailyRate: 154,
    features: ['Air Conditioning', 'Manual Transmission', '4 Passengers', 'Fuel Efficient'],
    image: 'https://i.ibb.co/qkqTQMP/economy-car.jpg'
  },
  compact: {
    type: 'Compact Car',
    dailyRate: 189,
    features: ['Air Conditioning', 'Automatic Transmission', '4 Passengers', 'Bluetooth'],
    image: 'https://i.ibb.co/9bM8QdV/compact-car.jpg'
  },
  midsize: {
    type: 'Midsize Car',
    dailyRate: 247,
    features: ['Air Conditioning', 'Automatic Transmission', '5 Passengers', 'GPS Navigation'],
    image: 'https://i.ibb.co/LNvL1Qz/midsize-car.jpg'
  },
  suv: {
    type: 'SUV',
    dailyRate: 350,
    features: ['Air Conditioning', 'Automatic Transmission', '7 Passengers', 'GPS Navigation', '4WD'],
    image: 'https://i.ibb.co/h7YtQmc/suv-car.jpg'
  },
  luxury: {
    type: 'Luxury Car',
    dailyRate: 520,
    features: ['Premium Interior', 'Automatic Transmission', '4 Passengers', 'GPS Navigation', 'Premium Sound'],
    image: 'https://i.ibb.co/2Y8QHx4/luxury-car.jpg'
  }
};

export function calculateCarRentalCost(carType: string, days: number): number {
  const rental = carRentalRates[carType];
  if (!rental) return 0;
  
  return rental.dailyRate * days;
}

export function getCarRecommendation(partySize: number, budget: number, days: number): string {
  const dailyBudget = budget * 0.3 / days; // 30% of budget for transportation
  
  if (partySize <= 4) {
    if (dailyBudget >= 520) return 'luxury';
    if (dailyBudget >= 247) return 'midsize';
    if (dailyBudget >= 189) return 'compact';
    return 'economy';
  } else {
    if (dailyBudget >= 350) return 'suv';
    return 'midsize';
  }
}