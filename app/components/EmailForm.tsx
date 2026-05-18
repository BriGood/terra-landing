'use client';

import { useState } from 'react';

// Validates structure: local@domain.tld — no spaces, has @, domain has a dot, TLD is 2+ chars.
// Deliberately lenient on character set; the only authoritative check is a confirmation email.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(value: string): string | null {
  if (!value.trim()) return 'Email address is required.';
  if (!EMAIL_RE.test(value.trim())) return 'Please enter a valid email address.';
  return null;
}

export default function EmailForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const err = validate(email);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="text-white text-sm uppercase tracking-widest">
        You're on the list.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full max-w-sm">
      <div className="flex">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Your email"
          aria-label="Email address"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'email-error' : undefined}
          autoComplete="email"
          className="flex-1 min-w-0 bg-transparent border border-white text-white placeholder-[#444444] text-sm uppercase tracking-widest px-4 py-4 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-white text-black text-sm font-semibold uppercase tracking-widest px-8 py-4 hover:bg-[#e0e0e0] transition-colors whitespace-nowrap"
        >
          Notify Me
        </button>
      </div>
      {error && (
        <p
          id="email-error"
          role="alert"
          className="mt-3 text-[#888888] text-xs uppercase tracking-wider"
        >
          {error}
        </p>
      )}
    </form>
  );
}
