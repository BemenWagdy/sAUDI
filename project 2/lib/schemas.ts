import { z } from 'zod';

export const QuestionnaireSchema = z.object({
  origin_country: z.string().length(2, 'Please select your country'),
  travel_dates: z.tuple([
    z.string().min(1, 'Start date is required'),
    z.string().min(1, 'End date is required')
  ]),
  party_size: z.number().min(1, 'At least 1 traveler required').max(10, 'Maximum 10 travelers'),
  budget: z.number().min(100, 'Minimum budget is $100'),
  interests: z.array(z.string()).min(1, 'Select at least one interest'),
  want_car: z.boolean(),
  food_pref: z.enum(['halal', 'vegetarian', 'vegan', 'no-restrictions']),
  mobility: z.enum(['full', 'limited', 'wheelchair'])
});

export type QuestionnaireData = z.infer<typeof QuestionnaireSchema>;

export const INTERESTS_OPTIONS = [
  'Historical Sites',
  'Modern Architecture', 
  'Desert Adventures',
  'Shopping',
  'Cultural Experiences',
  'Food & Dining',
  'Entertainment',
  'Religious Tourism',
  'Nature & Wildlife',
  'Adventure Sports'
];

export const COUNTRIES = [
  { code: 'US', name: 'United States', currency: 'USD' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP' },
  { code: 'DE', name: 'Germany', currency: 'EUR' },
  { code: 'FR', name: 'France', currency: 'EUR' },
  { code: 'JP', name: 'Japan', currency: 'JPY' },
  { code: 'CN', name: 'China', currency: 'CNY' },
  { code: 'IN', name: 'India', currency: 'INR' },
  { code: 'AE', name: 'UAE', currency: 'AED' },
  { code: 'EG', name: 'Egypt', currency: 'EGP' },
  { code: 'AU', name: 'Australia', currency: 'AUD' }
];