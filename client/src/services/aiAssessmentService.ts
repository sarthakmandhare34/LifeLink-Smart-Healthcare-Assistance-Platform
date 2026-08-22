import type { Assessment } from '../types';

interface AssessmentPayload {
  symptoms: string;
  age: number;
  gender: string;
  conditions: string;
  duration: string;
}

interface AssessmentResponse {
  urgency: 'LOW' | 'MODERATE' | 'EMERGENCY';
  recommendedSpecialty: string;
  reason: string;
  guidance: string;
}

export const analyzeSymptoms = async (payload: AssessmentPayload): Promise<AssessmentResponse> => {
  const response = await fetch('http://localhost:3001/api/assessment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  const data = await response.json();
  
  if (!data.urgency || !['LOW', 'MODERATE', 'EMERGENCY'].includes(data.urgency) || !data.reason) {
    throw new Error('Received malformed assessment data from AI provider.');
  }

  return {
    urgency: data.urgency,
    recommendedSpecialty: data.recommendedSpecialty,
    reason: data.reason,
    guidance: data.guidance
  };
};
