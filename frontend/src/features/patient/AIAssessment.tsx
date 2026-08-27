import React, { useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ShieldAlert,
  Stethoscope,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Popup } from "../../components/ui/Popup";
import { trpc } from "../../lib/trpc";

type AssessmentResult = {
  id: number;
  createdAt: Date;
  symptoms: string;
  age: number;
  gender: string;
  conditions?: string | null;
  duration: string;
  urgency: "LOW" | "MODERATE" | "EMERGENCY";
  reason: string;
  specialty: string;
  guidance: string;
};

function resultBadgeStatus(urgency: AssessmentResult["urgency"]) {
  return urgency === "EMERGENCY"
    ? "danger"
    : urgency === "MODERATE"
      ? "warning"
      : "success";
}

export const AIAssessment = () => {
  const trpcUtils = trpc.useUtils();
  const savedAssessments = trpc.assessment.list.useQuery();
  const analyzeAssessment = trpc.assessment.analyze.useMutation();
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [conditions, setConditions] = useState("");
  const [duration, setDuration] = useState("");
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const resetForm = () => {
    setSymptoms("");
    setAge("");
    setGender("");
    setConditions("");
    setDuration("");
    setResult(null);
    setApiError(null);
  };

  const handleCloseResult = () => {
    setIsPopupOpen(false);
    if (result?.urgency !== "EMERGENCY") resetForm();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!symptoms || !age || !gender || !duration) return;
    setIsProcessing(true);
    setApiError(null);
    try {
      const assessment = await analyzeAssessment.mutateAsync({
        symptoms,
        age: Number.parseInt(age, 10),
        gender,
        conditions,
        duration,
      });
      await trpcUtils.assessment.list.invalidate();
      await trpcUtils.patientDashboard.summary.invalidate();
      setResult(assessment);
      setIsPopupOpen(true);
    } catch (error) {
      console.error("Assessment failed", error);
      setApiError(
        "Live AI assessment is temporarily unavailable. Please try again or seek appropriate professional medical care based on your symptoms."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const findSpecialist = () =>
    navigate(
      `/patient/specialists?specialty=${encodeURIComponent(result?.specialty ?? "")}`
    );

  return (
    <div className="assessment-workflow">
      <header className="assessment-workflow-header">
        <span className="assessment-workflow-icon">
          <Stethoscope size={24} />
        </span>
        <div>
          <p className="caption">Dedicated workflow</p>
          <h1>AI Health Assessment</h1>
          <p>
            Tell us what you&apos;re experiencing. LifeLink provides
            decision-support guidance, not a diagnosis.
          </p>
        </div>
      </header>

      <section
        className="saved-assessments-panel"
        aria-labelledby="saved-assessments-heading"
      >
        <div className="saved-assessments-heading">
          <div>
            <p className="caption">Assessment history</p>
            <h2 id="saved-assessments-heading">Saved assessments</h2>
          </div>
          <span className="caption">
            Stored in your secure LifeLink account
          </span>
        </div>
        {savedAssessments.isLoading ? (
          <p className="caption">Loading your saved assessments…</p>
        ) : savedAssessments.data?.length ? (
          <div className="saved-assessment-list">
            {savedAssessments.data.slice(0, 3).map(assessment => (
              <article className="saved-assessment-item" key={assessment.id}>
                <div>
                  <strong>{assessment.specialty}</strong>
                  <p className="caption">
                    {new Date(assessment.createdAt).toLocaleString()}
                  </p>
                </div>
                <Badge status={resultBadgeStatus(assessment.urgency)}>
                  {assessment.urgency}
                </Badge>
              </article>
            ))}
          </div>
        ) : (
          <p className="caption">
            No saved assessments yet. New secure assessments will appear here.
          </p>
        )}
      </section>

      <Card variant="glass" className="assessment-form-card">
        {!result || result.urgency !== "EMERGENCY" ? (
          <form onSubmit={handleSubmit} className="assessment-form">
            <div className="assessment-disclaimer">
              <AlertCircle
                color="var(--color-semantic-warning)"
                style={{ flexShrink: 0 }}
                size={20}
              />
              <p className="caption">
                <strong>Medical Triage Disclaimer:</strong> The AI assessment is
                decision support only and is not a substitute for professional
                medical diagnosis, treatment, or emergency medical care.
              </p>
            </div>
            {apiError && (
              <div
                className="assessment-disclaimer assessment-disclaimer-error"
                role="alert"
              >
                <AlertCircle
                  color="var(--color-semantic-warning)"
                  style={{ flexShrink: 0 }}
                  size={20}
                />
                <p className="caption">{apiError}</p>
              </div>
            )}

            <label className="assessment-field assessment-symptom-field">
              <span>Symptoms</span>
              <textarea
                value={symptoms}
                onChange={event => setSymptoms(event.target.value)}
                placeholder="Describe the symptoms you want assessed, when they began, and anything that concerns you."
                required
              />
            </label>
            <div className="assessment-field-grid">
              <label className="assessment-field">
                <span>Age</span>
                <Input
                  type="number"
                  value={age}
                  onChange={event => setAge(event.target.value)}
                  placeholder="e.g. 34"
                  min="0"
                  max="120"
                  required
                />
              </label>
              <label className="assessment-field">
                <span>Gender</span>
                <select
                  value={gender}
                  onChange={event => setGender(event.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </label>
            </div>
            <label className="assessment-field">
              <span>Symptom duration</span>
              <select
                value={duration}
                onChange={event => setDuration(event.target.value)}
                required
              >
                <option value="" disabled>
                  Select duration
                </option>
                <option value="&lt; 24 hours">&lt; 24 hours</option>
                <option value="1-3 days">1–3 days</option>
                <option value="1 week">1 week</option>
                <option value="&gt; 1 week">&gt; 1 week</option>
              </select>
            </label>
            <label className="assessment-field">
              <span>
                Existing medical conditions <em>(optional)</em>
              </span>
              <Input
                type="text"
                value={conditions}
                onChange={event => setConditions(event.target.value)}
                placeholder="e.g. Hypertension, Asthma"
              />
            </label>
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isProcessing}
            >
              {isProcessing ? "Analyzing your symptoms…" : "Start Assessment"}
            </Button>
          </form>
        ) : (
          <div className="assessment-inline-result">
            <div className="emergency-panel">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldAlert
                    size={24}
                    color="var(--color-semantic-emergency)"
                  />
                  <h2>Emergency</h2>
                </div>
                <p>
                  Immediate medical attention may be required. Follow the
                  guidance below and seek local emergency care.
                </p>
              </div>
            </div>
            <div className="assessment-result-summary">
              <div className="dashboard-summary-line">
                <h3>Assessment result</h3>
                <Badge status="danger">EMERGENCY</Badge>
              </div>
              <p>
                <strong>Guidance:</strong> {result.guidance}
              </p>
            </div>
            <Button
              variant="danger"
              className="w-full"
              onClick={() => setIsPopupOpen(true)}
            >
              Review emergency guidance
            </Button>
          </div>
        )}
      </Card>

      <Popup
        isOpen={isPopupOpen}
        onClose={handleCloseResult}
        title="AI Assessment Result"
        maxWidth="600px"
      >
        <div className="flex-col gap-4">
          {result?.urgency === "EMERGENCY" && (
            <div className="emergency-panel">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldAlert
                    size={28}
                    color="var(--color-semantic-emergency)"
                  />
                  <h2>Emergency action required</h2>
                </div>
                <p>{result.guidance}</p>
              </div>
            </div>
          )}
          <div className="assessment-result-summary">
            <div className="dashboard-summary-line">
              <span className="caption">Detected urgency</span>
              {result && (
                <Badge status={resultBadgeStatus(result.urgency)}>
                  {result.urgency}
                </Badge>
              )}
            </div>
            <div>
              <span className="caption">Reasoning</span>
              <p>{result?.reason}</p>
            </div>
            {result?.urgency !== "EMERGENCY" && (
              <div>
                <span className="caption">Recommended specialty</span>
                <p className="assessment-specialty">{result?.specialty}</p>
                <p className="caption">{result?.guidance}</p>
              </div>
            )}
          </div>
          {result?.urgency === "EMERGENCY" ? (
            <Button
              variant="danger"
              className="w-full"
              onClick={handleCloseResult}
            >
              I Understand — Close
            </Button>
          ) : (
            <div className="assessment-result-actions">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleCloseResult}
              >
                Close
              </Button>
              <Button
                variant="primary"
                className="w-full"
                onClick={() => {
                  handleCloseResult();
                  findSpecialist();
                }}
              >
                Find Specialists <ArrowRight size={14} />
              </Button>
            </div>
          )}
        </div>
      </Popup>
    </div>
  );
};
