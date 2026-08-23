/** Uses the user-supplied LifeLink brand artwork stored in project-managed storage. */
export const LIFELINK_OFFICIAL_LOGO_URL = "/assets/branding/lifelink-logo.jpg";

type LifeLinkLogoProps = {
  className?: string;
  variant?: 'full' | 'symbol';
};

export function LifeLinkLogo({ className = '', variant = 'full' }: LifeLinkLogoProps) {
  const usesEntryPageSize = variant === 'full' && className.includes('lifelink-logo-auth');

  return (
    <span className={`lifelink-logo-crop lifelink-logo-${variant} ${className}`}>
      <img
        className="lifelink-logo"
        src={LIFELINK_OFFICIAL_LOGO_URL}
        alt={variant === 'full' ? 'LifeLink — Smart Healthcare Assistance Platform' : 'LifeLink'}
        style={usesEntryPageSize ? { height: '173px', width: '307px' } : undefined}
      />
    </span>
  );
}
