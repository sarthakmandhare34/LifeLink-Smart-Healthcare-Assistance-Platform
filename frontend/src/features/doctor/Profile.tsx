import { Card } from "../../components/ui/Card";
import { ShieldCheck } from "lucide-react";
import { trpc } from "../../lib/trpc";

export const DoctorProfile = () => {
  const profile = trpc.doctorWorkspace.profile.useQuery();
  if (profile.isLoading) return <p>Loading clinician profile…</p>;
  if (profile.isError || !profile.data) return <p role="alert">Unable to load the clinician profile. Please try again.</p>;
  return <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
    <header><h1>Clinical Profile</h1><p className="caption">Controlled LifeLink clinician account.</p></header>
    <Card style={{ maxWidth: "600px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
        <div><p className="caption">Display name</p><h2 style={{ margin: 0 }}>{profile.data.displayName}</h2></div>
        <div><p className="caption">Specialty</p><p>{profile.data.specialty}</p></div>
        <div><p className="caption">Directory locality</p><p>{profile.data.locality} · {profile.data.railLine} Line</p></div>
        <p className="caption" style={{ display: "inline-flex", alignItems: "center", gap: "6px", margin: 0 }}><ShieldCheck size={15} /> This controlled directory profile is not a verified clinician, credential, or registration record.</p>
      </div>
    </Card>
  </div>;
};
