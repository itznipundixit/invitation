'use client';

import React, { useState, useEffect } from 'react';
import { AnimatedContainer } from '../ui/AnimatedContainer';
import { WelcomeScreen } from './WelcomeScreen';
import { YesReactionScreen } from './YesReactionScreen';
import { DateTimeScreen } from './DateTimeScreen';
import { FoodSelectionScreen } from './FoodSelectionScreen';
import { AcceptanceScreen } from './AcceptanceScreen';
import { FakePaymentScreen } from './FakePaymentScreen';
import { FinalScreen } from './FinalScreen';

type Step = 
  | 'welcome' 
  | 'yes_reaction' 
  | 'datetime' 
  | 'food' 
  | 'acceptance' 
  | 'payment' 
  | 'final';

export function InvitationFlow() {
  const [step, setStep] = useState<Step>('welcome');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for data
  const [invitationId, setInvitationId] = useState<string | null>(null);
  const [day, setDay] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [food, setFood] = useState<string>('');

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('jupiter_invitation');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.id) setInvitationId(parsed.id);
        if (parsed.step) setStep(parsed.step);
        if (parsed.day) setDay(parsed.day);
        if (parsed.time) setTime(parsed.time);
        if (parsed.food) setFood(parsed.food);
      } catch (e) {}
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    if (invitationId) {
      localStorage.setItem('jupiter_invitation', JSON.stringify({
        id: invitationId,
        step,
        day,
        time,
        food
      }));
    }
  }, [invitationId, step, day, time, food]);

  const logEvent = async (id: string, eventType: string, metadata: any = {}) => {
    try {
      await fetch(`/api/invitations/${id}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_type: eventType, metadata })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleYes = async () => {
    setIsSubmitting(true);
    try {
      let id = invitationId;
      if (!id) {
        const res = await fetch('/api/invitations', { method: 'POST' });
        const data = await res.json();
        if (data.id) {
          id = data.id;
          setInvitationId(data.id);
        }
      }
      if (id) {
        await fetch(`/api/invitations/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accepted: true })
        });
        await logEvent(id, 'yes_clicked');
        setStep('yes_reaction');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateTime = async (selectedDay: string, selectedTime: string) => {
    setDay(selectedDay);
    setTime(selectedTime);
    setIsSubmitting(true);
    try {
      if (invitationId) {
        await fetch(`/api/invitations/${invitationId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ selected_day: selectedDay, selected_time: selectedTime })
        });
        await logEvent(invitationId, 'datetime_selected', { day: selectedDay, time: selectedTime });
      }
      setStep('food');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFood = async (selectedFood: string) => {
    setFood(selectedFood);
    setIsSubmitting(true);
    try {
      if (invitationId) {
        await fetch(`/api/invitations/${invitationId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ food_choice: selectedFood })
        });
        await logEvent(invitationId, 'food_selected', { food: selectedFood });
      }
      setStep('acceptance');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptance = async () => {
    if (invitationId) {
      await logEvent(invitationId, 'acceptance_clicked');
    }
    setStep('payment');
  };

  const handleFinalConfirm = async () => {
    setIsSubmitting(true);
    try {
      if (invitationId) {
        await fetch(`/api/invitations/${invitationId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ final_confirmed: true })
        });
        await logEvent(invitationId, 'final_confirmed');
      }
      setStep('final');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    localStorage.removeItem('jupiter_invitation');
    setInvitationId(null);
    setDay('');
    setTime('');
    setFood('');
    setStep('welcome');
  };

  return (
    <AnimatedContainer stepKey={step}>
      {step === 'welcome' && (
        <WelcomeScreen onYes={handleYes} isSubmitting={isSubmitting} />
      )}
      
      {step === 'yes_reaction' && (
        <YesReactionScreen onNext={() => setStep('datetime')} />
      )}
      
      {step === 'datetime' && (
        <DateTimeScreen onNext={handleDateTime} isSubmitting={isSubmitting} />
      )}
      
      {step === 'food' && (
        <FoodSelectionScreen onNext={handleFood} isSubmitting={isSubmitting} />
      )}

      {step === 'acceptance' && (
        <AcceptanceScreen onNext={handleAcceptance} />
      )}

      {step === 'payment' && (
        <FakePaymentScreen onNext={handleFinalConfirm} isSubmitting={isSubmitting} />
      )}

      {step === 'final' && (
        <FinalScreen day={day} time={time} foodId={food} onReset={handleReset} />
      )}
    </AnimatedContainer>
  );
}
