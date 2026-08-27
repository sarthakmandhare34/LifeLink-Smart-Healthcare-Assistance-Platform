/** Uses the user-supplied LifeLink brand artwork stored in project-managed storage. */
export const LIFELINK_OFFICIAL_LOGO_URL = "/assets/branding/lifelink-logo-lockup.jpg";
export const LIFELINK_OFFICIAL_LOGO_SYMBOL_URL = "/assets/branding/lifelink-logo.jpg";
export const LIFELINK_FULL_LOGO_PRESENTATION_CLASS = 'lifelink-logo-full';

type LifeLinkLogoProps = {
  className?: string;
  variant?: 'full' | 'symbol';
};

export function LifeLinkLogo({ className = '', variant = 'full' }: LifeLinkLogoProps) {
  const logoSource = variant === 'full' ? LIFELINK_OFFICIAL_LOGO_URL : LIFELINK_OFFICIAL_LOGO_SYMBOL_URL;

  return (
    <span className={`lifelink-logo-crop lifelink-logo-${variant} ${variant === 'full' ? LIFELINK_FULL_LOGO_PRESENTATION_CLASS : ''} ${className}`}>
      <img
        className="lifelink-logo"
        src={logoSource}
        alt={variant === 'full' ? 'LifeLink — Smart Healthcare Assistance Platform' : 'LifeLink'}
      />
    </span>
  );
}
