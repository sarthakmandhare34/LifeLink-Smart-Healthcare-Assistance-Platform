import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Calendar,
  Droplets,
  FileHeart,
  FileText,
  Microscope,
  Pill,
  ShieldAlert,
  Stethoscope,
  UserCheck,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { trpc } from "../../lib/trpc";

function urgencyBadgeStatus(urgency: string) {
  if (urgency === "EMERGENCY") return "danger";
  if (urgency === "MODERATE") return "warning";
  return "success";
}

export const PatientDashboard = () => {
  const dashboardQuery = trpc.patientDashboard.summary.useQuery();
  const navigate = useNavigate();

  if (dashboardQuery.isLoading) {
    return (
      <div className="dashboard-loading">
        <p className="caption">Loading your workspace…</p>
      </div>
    );
  }

  if (!dashboardQuery.data?.profile) {
    return (
      <div className="dashboard-loading">
        <p className="caption">
          Your patient profile could not be loaded. Please refresh and try
          again.
        </p>
      </div>
    );
  }

  const {
    profile: patient,
    latestAssessment,
    medicines,
    appointments,
    prescriptions,
  } = dashboardQuery.data;
  const upcomingAppointment =
    appointments.find(appointment =>
      ["Requested", "Pending", "Confirmed"].includes(appointment.status)
    ) ?? null;
  const primaryMedicine = medicines[0] ?? null;

  return (
    <div className="dashboard-workspace">
      <section className="dashboard-welcome">
        <p className="caption">Your health workspace</p>
        <h1>Welcome, {patient.name || "Patient"}</h1>
        <p>
          Review your care summary, then continue to a focused task when you are
          ready.
        </p>
      </section>

      <section className="dashboard-primary-grid" aria-label="Care summary">
        <Card variant="glass" className="dashboard-assessment-card">
          <div className="dashboard-card-heading">
            <span className="dashboard-icon">
              <Stethoscope size={22} />
            </span>
            <div>
              <p className="caption">AI health assessment</p>
              <h2>Understand your symptoms</h2>
            </div>
          </div>
          {latestAssessment ? (
            <div
              className={`dashboard-assessment-summary urgency-${latestAssessment.urgency.toLowerCase()}`}
            >
              <div className="dashboard-summary-line">
                <div>
                  <p className="caption">Latest assessment</p>
                  <strong>{latestAssessment.specialty}</strong>
                </div>
                <Badge
                  status={
                    urgencyBadgeStatus(latestAssessment.urgency) as
                      | "success"
                      | "warning"
                      | "danger"
                  }
                >
                  {latestAssessment.urgency}
                </Badge>
              </div>
              <p className="caption">
                Completed{" "}
                {new Date(latestAssessment.createdAt).toLocaleDateString()}.
              </p>
            </div>
          ) : (
            <div className="dashboard-empty-state">
              <p>
                No saved assessment yet. Start only when you want
                decision-support guidance for symptoms you choose to share.
              </p>
            </div>
          )}
          <Button
            variant="primary"
            className="dashboard-primary-action"
            onClick={() => navigate("/patient/assessment")}
          >
            {latestAssessment ? "Start another assessment" : "Start assessment"}{" "}
            <ArrowRight size={16} />
          </Button>
        </Card>

        <Card variant="glass" className="dashboard-today-card">
          <div className="dashboard-card-heading">
            <span className="dashboard-icon">
              <Activity size={22} />
            </span>
            <div>
              <p className="caption">Today’s care</p>
              <h2>At a glance</h2>
            </div>
          </div>
          <button
            type="button"
            className="dashboard-care-row"
            onClick={() => navigate("/patient/appointments")}
          >
            <Calendar size={18} />
            <span>
              <strong>
                {upcomingAppointment ? "Upcoming appointment" : "Appointments"}
              </strong>
              <small>
                {upcomingAppointment
                  ? `${new Date(upcomingAppointment.scheduledAt).toLocaleString()} · ${upcomingAppointment.status}`
                  : "No upcoming appointment recorded."}
              </small>
            </span>
          </button>
          <button
            type="button"
            className="dashboard-care-row"
            onClick={() => navigate("/patient/medicines")}
          >
            <Pill size={18} />
            <span>
              <strong>
                {primaryMedicine ? primaryMedicine.name : "Medicines"}
              </strong>
              <small>
                {primaryMedicine
                  ? `${primaryMedicine.dosage} · ${primaryMedicine.schedule}`
                  : "No medicines recorded."}
              </small>
            </span>
          </button>
        </Card>
      </section>

      <section
        className="dashboard-section"
        aria-labelledby="your-health-heading"
      >
        <div className="dashboard-section-heading">
          <div>
            <p className="caption">Your health</p>
            <h2 id="your-health-heading">Health summary</h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/patient/passport")}
          >
            View passport
          </Button>
        </div>
        <div className="dashboard-health-grid">
          <button
            type="button"
            className="dashboard-stat-card"
            onClick={() => navigate("/patient/passport")}
          >
            <Droplets size={19} />
            <span>{patient.bloodGroup || "—"}</span>
            <small>Blood group</small>
          </button>
          <button
            type="button"
            className="dashboard-stat-card"
            onClick={() => navigate("/patient/passport")}
          >
            <ShieldAlert size={19} />
            <span>{patient.allergies.length}</span>
            <small>
              {patient.allergies.length === 1 ? "Allergy" : "Allergies"}
            </small>
          </button>
          <button
            type="button"
            className="dashboard-stat-card"
            onClick={() => navigate("/patient/passport")}
          >
            <Microscope size={19} />
            <span>{patient.conditions.length}</span>
            <small>
              {patient.conditions.length === 1 ? "Condition" : "Conditions"}
            </small>
          </button>
          <button
            type="button"
            className="dashboard-stat-card"
            onClick={() => navigate("/patient/medicines")}
          >
            <Pill size={19} />
            <span>{medicines.length}</span>
            <small>Medicines</small>
          </button>
        </div>
      </section>

      <section
        className="dashboard-records-section"
        aria-labelledby="care-next-steps-heading"
      >
        <div className="dashboard-section-heading dashboard-records-heading">
          <div>
            <p className="caption">Your care plan</p>
            <h2 id="care-next-steps-heading">Records and next steps</h2>
          </div>
        </div>
        <div
          className="dashboard-lower-grid"
          aria-label="Recent records and quick actions"
        >
          <Card variant="glass">
            <div className="dashboard-card-heading">
              <span className="dashboard-icon">
                <Calendar size={20} />
              </span>
              <div>
                <p className="caption">Appointments</p>
                <h2>Upcoming care</h2>
              </div>
            </div>
            {upcomingAppointment ? (
              <button
                type="button"
                className="dashboard-record-link"
                onClick={() => navigate("/patient/appointments")}
              >
                <strong>
                  {new Date(
                    upcomingAppointment.scheduledAt
                  ).toLocaleDateString()}
                </strong>
                <span>
                  {new Date(upcomingAppointment.scheduledAt).toLocaleTimeString(
                    [],
                    { hour: "numeric", minute: "2-digit" }
                  )}{" "}
                  · {upcomingAppointment.status}
                </span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <p className="dashboard-empty-copy">
                No upcoming appointments. Use Specialists when you are ready to
                request one.
              </p>
            )}
          </Card>

          <Card variant="glass">
            <div className="dashboard-card-heading">
              <span className="dashboard-icon">
                <FileText size={20} />
              </span>
              <div>
                <p className="caption">Recent activity</p>
                <h2>Latest records</h2>
              </div>
            </div>
            <div className="dashboard-activity-list">
              {latestAssessment && (
                <p>
                  <Stethoscope size={16} /> Assessment completed ·{" "}
                  {latestAssessment.urgency}
                </p>
              )}
              {prescriptions[0] && (
                <p>
                  <FileText size={16} /> Prescription recorded ·{" "}
                  {new Date(prescriptions[0].issuedAt).toLocaleDateString()}
                </p>
              )}
              {!latestAssessment && !prescriptions[0] && (
                <p className="dashboard-empty-copy">
                  No recent records to show.
                </p>
              )}
            </div>
          </Card>

          <Card variant="glass" className="dashboard-quick-actions-card">
            <div className="dashboard-card-heading">
              <span className="dashboard-icon">
                <UserCheck size={20} />
              </span>
              <div>
                <p className="caption">Quick actions</p>
                <h2>Continue your care</h2>
              </div>
            </div>
            <div className="dashboard-action-list">
              <button
                type="button"
                className="dashboard-quick-action"
                onClick={() => navigate("/patient/specialists")}
              >
                <span>Find specialist</span>
                <ArrowRight size={17} />
              </button>
              <button
                type="button"
                className="dashboard-quick-action"
                onClick={() => navigate("/patient/passport")}
              >
                <span>Health passport</span>
                <FileHeart size={17} />
              </button>
              <button
                type="button"
                className="dashboard-quick-action"
                onClick={() => navigate("/patient/medicines")}
              >
                <span>Medicines</span>
                <Pill size={17} />
              </button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};
