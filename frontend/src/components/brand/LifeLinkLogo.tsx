import { HeartPulse } from "lucide-react";

/** Self-contained LifeLink brand mark that does not depend on managed asset storage. */
export const LIFELINK_OFFICIAL_LOGO_URL = "local-vector-wordmark";
export const LIFELINK_OFFICIAL_LOGO_SYMBOL_URL = "local-vector-symbol";
export const LIFELINK_FULL_LOGO_PRESENTATION_CLASS = "lifelink-logo-full";

type LifeLinkLogoProps = {
  className?: string;
  variant?: "full" | "symbol";
};

export function LifeLinkLogo({
  className = "",
  variant = "full",
}: LifeLinkLogoProps) {
  return (
    <span
      className={`lifelink-logo-crop lifelink-logo-${variant} ${variant === "full" ? LIFELINK_FULL_LOGO_PRESENTATION_CLASS : ""} ${className}`}
      role="img"
      aria-label={
        variant === "full"
          ? "LifeLink — Smart Healthcare Assistance Platform"
          : "LifeLink"
      }
    >
      <span className="lifelink-logo">
        <span className="lifelink-logo-icon">
          <HeartPulse aria-hidden="true" strokeWidth={2.25} />
        </span>
        {variant === "full" && (
          <span className="lifelink-logo-wording">
            <span>
              <strong>Life</strong>
              <strong>Link</strong>
            </span>
            <small>Smart Healthcare Assistance Platform</small>
          </span>
        )}
      </span>
    </span>
  );
}
