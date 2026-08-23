/** Uses the user-supplied LifeLink brand artwork stored in project-managed storage. */
const LIFE_LINK_LOGO_URL = "/manus-storage/lifelink-logo-blue-aqua_ac41eb4a.jpg";

export function LifeLinkLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`lifelink-logo-crop ${className}`}>
      <img
        className="lifelink-logo"
        src={LIFE_LINK_LOGO_URL}
        alt="LifeLink — Smart Healthcare Assistance Platform" style={{backgroundColor: '#ffffff'}}
      />
    </span>
  );
}
