import {
  CheckCircle2, CircleAlert, Info, LockKeyhole, TriangleAlert,
} from 'lucide-react';
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

const icons = {
  success: CheckCircle2, info: Info, warning: TriangleAlert, danger: CircleAlert, neutral: LockKeyhole,
};
type Tone = keyof typeof icons;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'on-ink';
  block?: boolean;
  busy?: boolean;
  busyLabel?: string;
};

export function Button({ variant = 'primary', block, busy, busyLabel, disabled, children, className = '', type = 'button', ...rest }: ButtonProps) {
  return <button {...rest} type={type} disabled={disabled || busy} aria-busy={busy}
    aria-disabled={disabled || busy} className={`tl-btn tl-btn--${variant} ${block ? 'tl-btn--block' : ''} ${className}`}>
    {busyLabel ? <span className="tl-btn__labels">
      <span aria-hidden={busy || undefined} data-visible={!busy}>{children}</span>
      <span aria-hidden={!busy} data-visible={!!busy}>{busyLabel}</span>
    </span> : children}
  </button>;
}

export function StatusBadge({ tone, children }: { tone: Tone; children: ReactNode }) {
  const Icon = icons[tone];
  return <span className={`tl-badge tl-badge--${tone}`}><Icon size={16} aria-hidden="true" />{children}</span>;
}

export function Card({ variant, className = '', ...props }: HTMLAttributes<HTMLDivElement> & { variant?: 'feature' | 'ink' | 'offer' }) {
  return <div {...props} className={`tl-card ${variant ? 'tl-card--' + variant : ''} ${className}`} />;
}

export function Alert({ tone = 'info', title, children }: { tone?: Exclude<Tone, 'neutral'>; title: string; children: ReactNode }) {
  const Icon = icons[tone];
  return <div className={`tl-alert tl-alert--${tone}`} role="status" aria-live="polite">
    <Icon size={20} aria-hidden="true" /><div><strong>{title}</strong>{children}</div>
  </div>;
}

export function Skeleton({ label, className = '', ...rest }: HTMLAttributes<HTMLDivElement> & { label: string }) {
  return <div {...rest} className={`tl-skel ${className}`} role="group" aria-label={label} aria-busy="true" />;
}

export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return <section className="tl-empty">
    <svg width="60" height="60" viewBox="0 0 64 64" fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M2 2h60v60H2z M2 17h60 M2 47h60 M17 2v60 M47 2v60 M32 2v15m0 30v15 M2 32h15m30 0h15" />
    </svg>
    <h2>{title}</h2>{children && <p>{children}</p>}{action}
  </section>;
}

/** Keep the control's native props, validation and associated message IDs at the call site. */
export function FormField({ id, label, children, message }: {
  id: string; label: string; children: ReactNode; message?: ReactNode;
}) {
  return <div className="field tl-field">
    <label htmlFor={id}>{label}</label>{children}{message}
  </div>;
}

/** The enclosing fieldset/legend names this group of native radio choices. */
export function Segmented({ children, style }: Pick<HTMLAttributes<HTMLDivElement>, 'children' | 'style'>) {
  return <div className="choice tl-seg" style={style}>{children}</div>;
}
