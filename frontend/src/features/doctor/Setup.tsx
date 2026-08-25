import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { LifeLinkLogo } from "../../components/brand/LifeLinkLogo";
import { trpc } from "../../lib/trpc";

export const DoctorSetup = () => {
  const navigate = useNavigate();
  const directory = trpc.doctorAuth.directory.useQuery();
  const [doctorId, setDoctorId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [provisioningCode, setProvisioningCode] = useState("");
  const [message, setMessage] = useState("");
  const provision = trpc.doctorAuth.provision.useMutation({
    onSuccess: (result) => {
      setMessage(`${result.displayName} now has a separate demo login. Continue to sign in.`);
      setPassword("");
      setProvisioningCode("");
    },
    onError: (error) => setMessage(error.message),
  });
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    provision.mutate({ doctorId, email, password, provisioningCode });
  };
  return <main className="auth-page" aria-labelledby="doctor-setup-heading">
    <Card variant="glass" className="auth-card auth-card-wide">
      <header className="auth-card-header"><LifeLinkLogo className="lifelink-logo-auth" /><p className="caption">Controlled demo account setup</p><h1 id="doctor-setup-heading">Create a separate doctor login</h1><p>Assign one controlled synthetic doctor a unique email and password. No real clinician account is created.</p></header>
      {message ? <div className="alert-panel auth-message" role="status">{message}</div> : null}
      <form onSubmit={submit} className="auth-form">
        <label className="auth-field"><span>Controlled demo doctor</span><select value={doctorId} onChange={(event) => setDoctorId(event.target.value)} required><option value="">Select a synthetic doctor</option>{directory.data?.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.displayName} · {doctor.locality}</option>)}</select></label>
        <label className="auth-field"><span>Separate demo email</span><Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" required /></label>
        <label className="auth-field"><span>Separate password</span><Input type="password" minLength={10} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" required /></label>
        <label className="auth-field"><span>Provisioning access code</span><Input type="password" value={provisioningCode} onChange={(event) => setProvisioningCode(event.target.value)} autoComplete="off" required /><small className="caption">This private owner code is only used to create a demo doctor account. Doctors use their own email and password afterward.</small></label>
        <Button type="submit" variant="primary" className="w-full" disabled={provision.isPending || directory.isLoading}>{provision.isPending ? "Creating account…" : "Create separate demo login"}</Button>
      </form>
      <footer className="auth-card-footer"><span className="caption">Already provisioned?</span><button type="button" className="auth-link-button" onClick={() => navigate("/doctor/login")}>Doctor sign in</button></footer>
    </Card>
  </main>;
};
