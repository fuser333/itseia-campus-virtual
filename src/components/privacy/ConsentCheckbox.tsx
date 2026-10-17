"use client";

import Link from "next/link";

interface ConsentCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

export default function ConsentCheckbox({
  checked,
  onChange,
  error,
}: ConsentCheckboxProps) {
  return (
    <div className="space-y-2">
      <label className="flex items-start gap-3 cursor-pointer group">
        {/* Checkbox custom — NOT pre-checked (LOPDP Art. 9) */}
        <div className="relative mt-0.5 flex-shrink-0">
          <input
            type="checkbox"
            id="privacy-consent"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="sr-only"
            aria-describedby={error ? "consent-error" : undefined}
            aria-required="true"
          />
          <div
            className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-150
              ${
                checked
                  ? "bg-yellow border-yellow"
                  : error
                  ? "border-coral bg-coral/5"
                  : "border-border/60 bg-secondary/50 group-hover:border-yellow/50"
              }`}
            aria-hidden="true"
          >
            {checked && (
              <svg
                className="w-2.5 h-2.5 text-navy-dark"
                fill="none"
                viewBox="0 0 10 8"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M1 4l2.5 2.5L9 1"
                />
              </svg>
            )}
          </div>
        </div>

        <span className="text-sm text-muted-foreground leading-snug select-none">
          He leido y acepto la{" "}
          <Link
            href="/privacidad"
            target="_blank"
            rel="noopener noreferrer"
            className="text-light-blue hover:text-light-blue/80 underline underline-offset-2 transition-colors font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            Politica de Privacidad
          </Link>{" "}
          de ITSEIA, conforme a la Ley Organica de Proteccion de Datos
          Personales del Ecuador (LOPDP).
        </span>
      </label>

      {error && (
        <p
          id="consent-error"
          className="text-xs text-coral animate-fade-in pl-7"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
