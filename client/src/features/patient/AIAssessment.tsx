import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Stethoscope, AlertCircle, CheckCircle2, ArrowRight, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Popup } from '../../components/ui/Popup';
import { trpc } from '../../lib/trpc';

type AssessmentResult = {
  id: number;
  createdAt: Date;
  symptoms: string;
  age: number;
  gender: string;
  conditions?: string | null;
  duration: string;
  urgency: 'LOW' | 'MODERATE' | 'EMERGENCY';
  reason: string;
  specialty: string;
  guidance: string;
};

export const AIAssessment = () => {
  const trpcUtils = trpc.useUtils();
  const savedAssessments = trpc.assessment.list.useQuery();
  const analyzeAssessment = trpc.assessment.analyze.useMutation();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(0);
  const [symptoms, setSymptoms] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [conditions, setConditions] = useState('');
  const [duration, setDuration] = useState('');
  
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleCloseResult = () => {
    setIsPopupOpen(false);
    // As per constraints: For LOW and MODERATE, return to the assessment workflow.
    // For EMERGENCY, do not lose the emergency result, keep it inline.
    if (result && result.urgency !== 'EMERGENCY') {
      resetForm();
    }
  };

  const resetForm = () => {
    setStep(0); 
    setSymptoms(''); 
    setAge(''); 
    setGender(''); 
    setConditions(''); 
    setDuration('');
    setResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms || !age || !gender || !duration) return;

    setIsProcessing(true);
    setApiError(null);
    
    try {
      const assessment = await analyzeAssessment.mutateAsync({
        symptoms,
        age: parseInt(age, 10),
        gender,
        conditions,
        duration
      });

      await trpcUtils.assessment.list.invalidate();
      await trpcUtils.patientDashboard.summary.invalidate();
      setResult(assessment);
      setStep(1);
      setIsPopupOpen(true);
    } catch (error) {
      console.error('Assessment failed', error);
      setApiError('Live AI assessment is temporarily unavailable. Please try again or seek appropriate professional medical care based on your symptoms.');
    } finally {
      setIsProcessing(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    background: 'var(--color-surface-white)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--border-radius-input)',
    padding: '10px var(--spacing-3)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-text)',
    width: '100%',
    outline: 'none',
    fontFamily: 'inherit'
  };

  return (
    <div className="container" style={{ padding: 0 }}>
      <header className="mb-4 flex items-center gap-3">
        <div style={{ width: 44, height: 44, borderRadius: '14px', background: 'rgba(0,27,48,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Stethoscope size={24} color="var(--color-primary)" />
        </div>
        <div>
          <h1 style={{ margin: 0 }}>AI Health Assessment</h1>
          <p className="caption">Intelligent clinical triage decision-support tool.</p>
        </div>
      </header>

      <section className="saved-assessments-panel" aria-labelledby="saved-assessments-heading">
          <div className="saved-assessments-heading">
            <div>
              <p className="caption">Private record</p>
              <h2 id="saved-assessments-heading">Saved assessments</h2>
            </div>
            <span className="caption">Stored in your secure LifeLink account</span>
          </div>
          {savedAssessments.isLoading ? (
            <p className="caption">Loading your saved assessments…</p>
          ) : savedAssessments.data?.length ? (
            <div className="saved-assessment-list">
              {savedAssessments.data.slice(0, 3).map((assessment) => (
                <article className="saved-assessment-item" key={assessment.id}>
                  <div>
                    <strong>{assessment.specialty}</strong>
                    <p className="caption">{new Date(assessment.createdAt).toLocaleString()}</p>
                  </div>
                  <Badge status={assessment.urgency === 'EMERGENCY' ? 'danger' : assessment.urgency === 'MODERATE' ? 'warning' : 'success'}>
                    {assessment.urgency}
                  </Badge>
                </article>
              ))}
            </div>
          ) : (
            <p className="caption">No saved assessments yet. New secure assessments will appear here.</p>
          )}
      </section>

      <Card variant="glass" style={{ maxWidth: '680px', width: '100%', margin: '0 auto' }}>
        {step === 0 ? (
          <form onSubmit={handleSubmit} className="flex-col gap-4">
            <div style={{ display: 'flex', gap: 'var(--spacing-3)', background: 'rgba(255, 159, 128, 0.12)', padding: 'var(--spacing-3)', borderRadius: 'var(--border-radius-md)', border: '1px solid rgba(255, 159, 128, 0.3)' }}>
              <AlertCircle color="#8C391B" style={{ flexShrink: 0 }} size={20} />
              <p className="caption" style={{ margin: 0, color: '#8C391B' }}>
                <strong>Medical Triage Disclaimer:</strong> The AI assessment is decision support only and is not a substitute for professional medical diagnosis, treatment, or emergency medical care.
              </p>
            </div>
            
            {apiError && (
              <div style={{ display: 'flex', gap: 'var(--spacing-3)', background: 'rgba(255, 159, 128, 0.12)', padding: 'var(--spacing-3)', borderRadius: 'var(--border-radius-md)', border: '1px solid rgba(255, 159, 128, 0.3)' }}>
                <AlertCircle color="#8C391B" style={{ flexShrink: 0 }} size={20} />
                <p className="caption" style={{ margin: 0, color: '#8C391B', fontWeight: 600 }}>
                  {apiError}
                </p>
              </div>
            )}
            
            <div className="flex gap-3">
               <div style={{ flex: 1 }}>
                 <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: 600, color: 'var(--color-primary)' }}>Age</label>
                 <Input type="number" value={age} onChange={e => setAge(e.target.value)} required placeholder="e.g. 34" min="0" max="120" />
               </div>
               <div style={{ flex: 1 }}>
                 <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: 600, color: 'var(--color-primary)' }}>Gender</label>
                 <select style={inputStyle} value={gender} onChange={e => setGender(e.target.value)} required>
                   <option value="" disabled>Select Gender</option>
                   <option value="Male">Male</option>
                   <option value="Female">Female</option>
                   <option value="Other">Other</option>
                 </select>
               </div>
            </div>

            <div>
               <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: 600, color: 'var(--color-primary)' }}>Symptom Duration</label>
               <select style={inputStyle} value={duration} onChange={e => setDuration(e.target.value)} required>
                 <option value="" disabled>Select Duration</option>
                 <option value="< 24 hours">&lt; 24 hours</option>
                 <option value="1-3 days">1-3 days</option>
                 <option value="1 week">1 week</option>
                 <option value="> 1 week">&gt; 1 week</option>
               </select>
            </div>

            <div>
               <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: 600, color: 'var(--color-primary)' }}>Existing Medical Conditions (Optional)</label>
               <Input type="text" value={conditions} onChange={e => setConditions(e.target.value)} placeholder="e.g. Hypertension, Asthma" />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: 600, color: 'var(--color-primary)' }}>
                Describe your symptoms in detail
              </label>
              <textarea 
                 value={symptoms}
                 onChange={(e) => setSymptoms(e.target.value)}
                 style={{ 
                   ...inputStyle,
                   minHeight: '120px', 
                   resize: 'vertical',
                 }}
                 placeholder="E.g., I have experienced a persistent mild fever, muscle aches, and headache over the past 48 hours..."
                 required
              />
            </div>

            <Button type="submit" variant="primary" className="w-full" disabled={isProcessing}>
              {isProcessing ? 'Analyzing Symptoms with AI Engine...' : 'Analyze Symptoms'}
            </Button>
          </form>
        ) : (
          <div className="flex-col gap-4">
             {result?.urgency === 'EMERGENCY' ? (
               <div className="emergency-panel">
                 <div className="flex-col gap-2">
                   <div className="flex items-center gap-2">
                     <ShieldAlert size={24} color="var(--color-semantic-emergency)" />
                     <h2 style={{ margin: 0, color: 'var(--color-semantic-emergency)' }}>Immediate Care Recommended</h2>
                   </div>
                   <p style={{ margin: 0 }}>
                     Your symptoms suggest an emergency medical situation. Please proceed to the nearest emergency room or call your local emergency number immediately.
                   </p>
                 </div>
               </div>
             ) : (
               <div className="flex items-center gap-2" style={{ color: 'var(--color-semantic-success)' }}>
                 <CheckCircle2 size={24} />
                 <h2 style={{ margin: 0, fontSize: 'var(--text-h2)' }}>Triage Assessment Complete</h2>
               </div>
             )}
             
             <div className="flex-col gap-3" style={{ background: 'var(--color-surface-white)', padding: 'var(--spacing-4)', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--color-border)' }}>
               <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--spacing-2)' }}>
                 <h3 style={{ margin: 0, fontSize: 'var(--text-h3)' }}>Clinical Summary</h3>
                 <Badge status={result?.urgency === 'EMERGENCY' ? 'danger' : result?.urgency === 'MODERATE' ? 'warning' : 'success'}>
                   {result?.urgency}
                 </Badge>
               </div>
               
               <div>
                 <span className="caption">Reasoning</span>
                 <p style={{ margin: '4px 0 0 0', fontWeight: 500, color: 'var(--color-text)' }}>{result?.reason}</p>
               </div>
               <div className="mt-2">
                 <span className="caption">Guidance</span>
                 <p style={{ margin: '4px 0 0 0' }}>{result?.guidance}</p>
               </div>
             </div>
             
             <div className="flex gap-3 mt-2">
                <Button variant="outline" style={{ flex: 1 }} onClick={resetForm}>
                  Start New Assessment
                </Button>
                {result?.urgency !== 'EMERGENCY' && (
                  <Button variant="primary" style={{ flex: 1 }} onClick={() => navigate('/patient/specialists')}>
                    Find {result?.specialty} <ArrowRight size={14} />
                  </Button>
                )}
             </div>
          </div>
        )}
      </Card>

      {/* 3D Popup for Presenting Assessment Result */}
      <Popup
        isOpen={isPopupOpen}
        onClose={handleCloseResult}
        title="Assessment Result"
        maxWidth="600px"
      >
        <div className="flex-col gap-4">
          {result?.urgency === 'EMERGENCY' && (
            <div className="emergency-panel mb-2" style={{ borderLeftWidth: '8px' }}>
              <div className="flex-col gap-1 w-full">
                 <div className="flex items-center gap-2 mb-2">
                   <ShieldAlert size={28} color="var(--color-semantic-emergency)" />
                   <h2 style={{ margin: 0, color: 'var(--color-semantic-emergency)', fontSize: '20px' }}>EMERGENCY ACTION REQUIRED</h2>
                 </div>
                 <p style={{ margin: 0, fontWeight: 500, fontSize: '15px' }}>
                   {result?.guidance || "Please proceed to the nearest emergency room immediately."}
                 </p>
              </div>
            </div>
          )}

          <div className="flex-col gap-3">
             <div className="flex justify-between items-center bg-gray-50 rounded p-3" style={{ background: 'var(--color-background)', padding: 'var(--spacing-3)', borderRadius: 'var(--border-radius-sm)' }}>
               <span className="caption text-muted">Detected Urgency</span>
               <Badge status={result?.urgency === 'EMERGENCY' ? 'danger' : result?.urgency === 'MODERATE' ? 'warning' : 'success'}>
                 {result?.urgency}
               </Badge>
             </div>
             
             <div>
               <span className="caption text-muted">AI Reasoning</span>
               <p style={{ margin: '4px 0 0 0', fontWeight: 500, color: 'var(--color-text)' }}>{result?.reason}</p>
             </div>

             {result?.urgency !== 'EMERGENCY' && (
               <div>
                 <span className="caption text-muted">Recommended Action</span>
                 <p style={{ margin: '4px 0 0 0', fontWeight: 500, color: 'var(--color-primary)' }}>
                   Consult a {result?.specialty}
                 </p>
                 <p className="caption" style={{ marginTop: '8px' }}>{result?.guidance}</p>
               </div>
             )}
          </div>

          <div className="flex gap-3 mt-4">
            {result?.urgency === 'EMERGENCY' ? (
              <Button variant="danger" className="w-full" onClick={handleCloseResult}>
                I Understand - Close
              </Button>
            ) : (
              <>
                <Button variant="outline" className="w-full" onClick={handleCloseResult}>
                  Dismiss
                </Button>
                <Button variant="primary" className="w-full" onClick={() => { handleCloseResult(); navigate('/patient/specialists'); }}>
                  Find {result?.specialty}
                </Button>
              </>
            )}
          </div>
        </div>
      </Popup>
    </div>
  );
};
