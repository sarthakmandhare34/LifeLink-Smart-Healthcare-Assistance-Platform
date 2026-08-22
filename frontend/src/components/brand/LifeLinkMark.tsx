/**
 * Liquid-glass design note: the recurring LifeLink mark is a linked pulse motif,
 * used in portal identity and avatars instead of a generic healthcare plus.
 */
type LifeLinkMarkProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export function LifeLinkMark({ size = 'md', className = '' }: LifeLinkMarkProps) {
  return (
    <span className={`lifelink-mark lifelink-mark-${size} ${className}`} aria-hidden="true">
      <span className="lifelink-mark-link lifelink-mark-link-one" />
      <span className="lifelink-mark-link lifelink-mark-link-two" />
      <span className="lifelink-mark-pulse" />
    </span>
  );
}
