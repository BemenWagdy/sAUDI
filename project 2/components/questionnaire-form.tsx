'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { QuestionnaireSchema, QuestionnaireData, INTERESTS_OPTIONS, COUNTRIES } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, DollarSign, Heart, Car, Utensils, Accessibility, ArrowLeft, ArrowRight } from 'lucide-react';

interface QuestionnaireFormProps {
  onSubmit: (data: QuestionnaireData) => void;
  loading: boolean;
}

const steps = [
  { id: 'origin', title: 'Travel Origin', icon: Calendar },
  { id: 'dates', title: 'Travel Dates', icon: Calendar },
  { id: 'party', title: 'Party Details', icon: Users },
  { id: 'budget', title: 'Budget', icon: DollarSign },
  { id: 'interests', title: 'Interests', icon: Heart },
  { id: 'preferences', title: 'Preferences', icon: Car }
];

export default function QuestionnaireForm({ onSubmit, loading }: QuestionnaireFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger
  } = useForm<QuestionnaireData>({
    resolver: zodResolver(QuestionnaireSchema),
    defaultValues: {
      interests: [],
      want_car: false,
      food_pref: 'halal',
      mobility: 'full'
    }
  });

  const watchedValues = watch();

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate);
    
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFieldsForStep = (step: number): (keyof QuestionnaireData)[] => {
    switch (step) {
      case 0: return ['origin_country'];
      case 1: return ['travel_dates'];
      case 2: return ['party_size'];
      case 3: return ['budget'];
      case 4: return ['interests'];
      case 5: return ['want_car', 'food_pref', 'mobility'];
      default: return [];
    }
  };

  const handleInterestToggle = (interest: string) => {
    const currentInterests = watchedValues.interests || [];
    const newInterests = currentInterests.includes(interest)
      ? currentInterests.filter(i => i !== interest)
      : [...currentInterests, interest];
    setValue('interests', newInterests);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="origin_country">Which country are you traveling from?</Label>
              <Select onValueChange={(value) => setValue('origin_country', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.origin_country && (
                <p className="text-sm text-red-500 mt-1">{errors.origin_country.message}</p>
              )}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label>When are you planning to travel?</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    type="date"
                    {...register('travel_dates.0')}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.travel_dates?.[0] && (
                    <p className="text-sm text-red-500 mt-1">{errors.travel_dates[0].message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    type="date"
                    {...register('travel_dates.1')}
                    min={watchedValues.travel_dates?.[0] || new Date().toISOString().split('T')[0]}
                  />
                  {errors.travel_dates?.[1] && (
                    <p className="text-sm text-red-500 mt-1">{errors.travel_dates[1].message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="party_size">How many people are traveling?</Label>
              <Input
                type="number"
                min="1"
                max="10"
                {...register('party_size', { valueAsNumber: true })}
                placeholder="Number of travelers"
              />
              {errors.party_size && (
                <p className="text-sm text-red-500 mt-1">{errors.party_size.message}</p>
              )}
            </div>
          </div>
        );

      case 3:
        const selectedCountry = COUNTRIES.find(c => c.code === watchedValues.origin_country);
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="budget">
                What is your total budget? ({selectedCountry?.currency || 'USD'})
              </Label>
              <Input
                type="number"
                min="100"
                {...register('budget', { valueAsNumber: true })}
                placeholder={`Total budget in ${selectedCountry?.currency || 'USD'}`}
              />
              {errors.budget && (
                <p className="text-sm text-red-500 mt-1">{errors.budget.message}</p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label>What are you most interested in? (Select all that apply)</Label>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {INTERESTS_OPTIONS.map((interest) => (
                  <div
                    key={interest}
                    className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                      watchedValues.interests?.includes(interest)
                        ? 'bg-[#006C35] text-white border-[#006C35]'
                        : 'border-gray-200 hover:border-[#006C35]'
                    }`}
                    onClick={() => handleInterestToggle(interest)}
                  >
                    <Checkbox
                      checked={watchedValues.interests?.includes(interest) || false}
                    />
                    <span className="text-sm">{interest}</span>
                  </div>
                ))}
              </div>
              {errors.interests && (
                <p className="text-sm text-red-500 mt-1">{errors.interests.message}</p>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <Label>Do you need a rental car?</Label>
              <RadioGroup
                value={watchedValues.want_car ? 'yes' : 'no'}
                onValueChange={(value) => setValue('want_car', value === 'yes')}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="car-yes" />
                  <Label htmlFor="car-yes">Yes, include car rental</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="car-no" />
                  <Label htmlFor="car-no">No, I'll use other transportation</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Food preferences</Label>
              <RadioGroup
                value={watchedValues.food_pref}
                onValueChange={(value) => setValue('food_pref', value as any)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="halal" id="halal" />
                  <Label htmlFor="halal">Halal only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="vegetarian" id="vegetarian" />
                  <Label htmlFor="vegetarian">Vegetarian</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="vegan" id="vegan" />
                  <Label htmlFor="vegan">Vegan</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no-restrictions" id="no-restrictions" />
                  <Label htmlFor="no-restrictions">No dietary restrictions</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Mobility requirements</Label>
              <RadioGroup
                value={watchedValues.mobility}
                onValueChange={(value) => setValue('mobility', value as any)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="full" id="full" />
                  <Label htmlFor="full">Full mobility</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="limited" id="limited" />
                  <Label htmlFor="limited">Limited mobility</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="wheelchair" id="wheelchair" />
                  <Label htmlFor="wheelchair">Wheelchair accessible</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const StepIcon = steps[currentStep].icon;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-[#006C35] rounded-full flex items-center justify-center">
            <StepIcon className="w-8 h-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
        <CardDescription>
          Step {currentStep + 1} of {steps.length}
        </CardDescription>
        <div className="flex justify-center mt-4">
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index <= currentStep ? 'bg-[#006C35]' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 bg-[#006C35] hover:bg-[#005028]"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={loading}
                className="bg-[#006C35] hover:bg-[#005028]"
              >
                {loading ? 'Creating Itinerary...' : 'Create My Itinerary'}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}