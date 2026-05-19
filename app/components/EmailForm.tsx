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
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const err = validate(email);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
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
          className="flex-1 min-w-0 bg-transparent border border-white text-white placeholder-[#444444] text-sm uppercase tracking-normal lg:tracking-widest px-3 py-2.5 lg:px-4 lg:py-4 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="relative bg-white text-black text-sm font-semibold uppercase tracking-widest px-2 py-2.5 lg:px-8 lg:py-4 hover:bg-[#e0e0e0] transition-colors whitespace-nowrap disabled:opacity-50"
        >
          <span className={loading ? 'invisible' : ''}>Notify Me</span>
          {loading && (
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            </span>
          )}
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
