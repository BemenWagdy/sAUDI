export async function convertToSAR(amount: number, fromCurrency: string): Promise<number> {
  try {
    const response = await fetch(
      `${process.env.EXCHANGE_URL}?from=${fromCurrency}&to=SAR&amount=${amount}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rate');
    }
    
    const data = await response.json();
    return Math.round(data.result * 100) / 100; // Round to 2 decimal places
  } catch (error) {
    console.error('Currency conversion error:', error);
    // Fallback rates (approximate)
    const fallbackRates: Record<string, number> = {
      USD: 3.75,
      EUR: 4.1,
      GBP: 4.8,
      JPY: 0.025,
      AED: 1.02,
      CNY: 0.52,
      INR: 0.045,
      EGP: 0.12,
      AUD: 2.5
    };
    
    return Math.round((amount * (fallbackRates[fromCurrency] || 3.75)) * 100) / 100;
  }
}

export function formatSAR(amount: number): string {
  return `${amount.toLocaleString()} SAR`;
}