'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface YesReactionScreenProps {
  onNext: () => void;
}

export function YesReactionScreen({ onNext }: YesReactionScreenProps) {
  return (
    <Card className="text-center space-y-8">
      <div className="text-4xl sm:text-5xl font-bold text-rose-900 leading-tight">
        WAIT YOU ACTUALLY SAID YES?? 😒
      </div>
      
      <p className="text-xl text-gray-600">
        I was so ready for you to say no 😒
      </p>

      <Button onClick={onNext} className="mt-8 text-lg w-full max-w-xs mx-auto">
        okay okay! →
      </Button>
    </Card>
  );
}
