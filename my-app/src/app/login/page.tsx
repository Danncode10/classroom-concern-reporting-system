'use client';

import { useState, useEffect } from 'react';
import { signInWithEmailRateLimited } from '@/services/auth-server';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { IdCard, Lock, Eye, EyeOff, ArrowRight, Loader2, Check } from 'lucide-react';

const SCHOOL_ID_PATTERN = /^\d{3}-\d{4}$/;
const schoolIdToAuthEmail = (schoolId: string) => `${schoolId.trim().toLowerCase()}@nvsu.local`;
const formatSchoolIdInput = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 7);
  return digits.length > 3 ? `${digits.slice(0, 3)}-${digits.slice(3)}` : digits;
};

export default function AuthPage() {
  const [schoolId, setSchoolId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window === 'undefined' ? 1024 : window.innerWidth
  );
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const normalizedSchoolId = schoolId.trim();
      if (!SCHOOL_ID_PATTERN.test(normalizedSchoolId)) {
        throw new Error('Enter your school ID using the format XXX-XXXX.');
      }

      const result = await signInWithEmailRateLimited(schoolIdToAuthEmail(normalizedSchoolId), password);
      if (result.requiresMFA) {
        router.push('/auth/mfa');
      } else {
        setSuccess(true);
        setTimeout(() => {
          toast.success('Login successful!');
          router.push('/dashboard');
          router.refresh();
        }, 800);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const isDesktop = windowWidth >= 900;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background)', color: 'var(--color-foreground)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Grid Background */}
      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        backgroundImage: `linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
        opacity: 0.025,
      }} />

      {/* Glows */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-8%',
          width: 560,
          height: 560,
          borderRadius: '50%',
          background: 'var(--color-primary)',
          opacity: 0.15,
          filter: 'blur(110px)',
          animation: 'float 9s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-15%',
          left: '-8%',
          width: 480,
          height: 480,
          borderRadius: '50%',
          background: 'var(--color-primary)',
          opacity: 0.08,
          filter: 'blur(110px)',
          animation: 'float 11s ease-in-out infinite reverse',
        }} />
        <div style={{
          position: 'absolute',
          top: '45%',
          left: '38%',
          width: 280,
          height: 280,
          borderRadius: '50%',
          background: 'var(--color-accent)',
          opacity: 0.05,
          filter: 'blur(77px)',
          animation: 'float 13s ease-in-out infinite 3s',
        }} />
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', position: 'relative', zIndex: 10, flexDirection: isDesktop ? 'row' : 'column' }}>
        {/* Brand Panel - Desktop Only */}
        {isDesktop && (
          <div style={{
            width: 400,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '52px 44px',
            borderRight: '1px solid var(--color-border)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Tint */}
            <div style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background: 'linear-gradient(145deg, rgba(11, 122, 42, 0.08) 0%, transparent 55%)',
            }} />

            {/* Orbital Ring */}
            <div style={{
              position: 'absolute',
              top: 100,
              right: -50,
              width: 180,
              height: 180,
              borderRadius: '50%',
              border: '1px solid rgba(11, 122, 42, 0.18)',
              pointerEvents: 'none',
            }}>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: 'var(--color-primary)',
                marginTop: -3.5,
                marginLeft: -3.5,
                animation: 'orbit 5s linear infinite',
                boxShadow: '0 0 8px var(--color-primary)',
              }} />
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Logo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 56 }}>
                <div style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #0B7A2A, #C62828)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: 14,
                  color: 'white',
                  boxShadow: '0 10px 22px rgba(11, 122, 42, 0.18)',
                }}>N</div>
                <span style={{ fontSize: 18, fontWeight: 'bold', letterSpacing: 0, color: 'var(--color-foreground)' }}>NVSU Concerns</span>
                <span style={{
                  padding: '2px 7px',
                  borderRadius: 5,
                  background: 'var(--color-secondary)',
                  border: '1px solid var(--color-border)',
                  fontSize: 10,
                  color: 'var(--color-primary)',
                  letterSpacing: 0,
                }}>MVP</span>
              </div>

              {/* Headline */}
              <h1 style={{ fontSize: 32, fontWeight: 'bold', lineHeight: 1.18, marginBottom: 14, letterSpacing: 0, color: 'var(--color-foreground)' }}>
                Sign in to report
                <br />
                <span style={{
                  background: 'linear-gradient(90deg, #0B7A2A, #C62828, #0B7A2A)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'shimmer 3s linear infinite',
                }}>classroom concerns.</span>
              </h1>

              <p style={{ fontSize: 13.5, color: 'var(--color-muted-foreground)', lineHeight: 1.7, maxWidth: 290, marginBottom: 36 }}>
                Use your school ID to access the shared reporting space for classroom issues, updates, and concern tracking.
              </p>

              {/* Features */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['Post classroom concerns', 'Track report status', 'Support visible concerns', 'Admin-reviewed updates'].map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                    <div style={{
                      width: 20,
                      height: 20,
                      borderRadius: 6,
                      background: 'var(--color-secondary)',
                      border: '1px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-primary)',
                      flexShrink: 0,
                    }}>
                      <Check size={11} />
                    </div>
                    <span style={{ fontSize: 13, color: 'var(--color-foreground)', lineHeight: 1.4 }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Chip */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '13px 15px',
              borderRadius: 10,
              background: 'rgba(11, 122, 42, 0.06)',
              border: '1px solid rgba(11, 122, 42, 0.18)',
              position: 'relative',
              zIndex: 1,
            }}>
              <div style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#22C55E',
                flexShrink: 0,
                boxShadow: '0 0 7px #22C55E',
                animation: 'pulse-dot 2s ease-in-out infinite',
              }} />
              <span style={{ fontSize: 11, color: 'var(--color-muted-foreground)' }}>Manual school accounts only</span>
            </div>
          </div>
        )}

        {/* Form Section */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isDesktop ? '40px 44px' : '28px 20px',
          position: 'relative',
          zIndex: 10,
        }}>
          <div style={{ width: '100%', maxWidth: 400, animation: 'fadeUp 0.45s ease both' }}>
            {/* Heading */}
            <div style={{ marginBottom: 24 }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 10px',
                borderRadius: 999,
                background: 'var(--color-secondary)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-primary)',
                fontSize: 11,
                fontWeight: 700,
                marginBottom: 14,
              }}>
                School ID Login
              </div>
              <h2 style={{ fontSize: 28, fontWeight: 'bold', letterSpacing: 0, marginBottom: 7, color: 'var(--color-foreground)' }}>
                Welcome back
              </h2>
              <p style={{ fontSize: 13, color: 'var(--color-muted-foreground)', lineHeight: 1.55 }}>
                Enter the ID number and password given by the school admin.
              </p>
            </div>

            {/* Success State */}
            {success ? (
              <div style={{
                padding: 28,
                borderRadius: 12,
                textAlign: 'center',
                background: 'rgba(11, 122, 42, 0.08)',
                border: '1px solid rgba(11, 122, 42, 0.22)',
                animation: 'fadeUp 0.35s ease both',
              }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>✓</div>
                <p style={{ fontWeight: 600, marginBottom: 5, color: 'var(--color-foreground)' }}>
                  Welcome back!
                </p>
                <p style={{ fontSize: 12, color: 'var(--color-muted-foreground)' }}>
                  Redirecting to your dashboard...
                </p>
              </div>
            ) : (
              <form noValidate onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 0.02, textTransform: 'uppercase', color: 'var(--color-muted-foreground)', marginBottom: 6 }}>
                    School ID number
                  </label>
                  <div style={{ position: 'relative' }}>
                    <IdCard size={16} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted-foreground)', pointerEvents: 'none' }} />
                    <input
                      type="text"
                      inputMode="numeric"
                      value={schoolId}
                      onChange={e => setSchoolId(formatSchoolIdInput(e.target.value))}
                      placeholder="123-4567"
                      pattern="[0-9]{3}-[0-9]{4}"
                      title="Use the format XXX-XXXX"
                      autoComplete="username"
                      maxLength={8}
                      required
                      style={{
                        width: '100%',
                        paddingLeft: 40,
                        paddingRight: 14,
                        paddingTop: 12,
                        paddingBottom: 12,
                        background: 'var(--color-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 9,
                        color: 'var(--color-foreground)',
                        fontSize: 14,
                        outline: 'none',
                        transition: 'all 0.18s',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 0.02, textTransform: 'uppercase', color: 'var(--color-muted-foreground)', marginBottom: 6 }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted-foreground)', pointerEvents: 'none' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      style={{
                        width: '100%',
                        paddingLeft: 40,
                        paddingRight: 40,
                        paddingTop: 12,
                        paddingBottom: 12,
                        background: 'var(--color-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 9,
                        color: 'var(--color-foreground)',
                        fontSize: 14,
                        outline: 'none',
                        transition: 'all 0.18s',
                        boxSizing: 'border-box',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--color-muted-foreground)',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>

                </div>

                <p style={{ fontSize: 12, color: 'var(--color-muted-foreground)', lineHeight: 1.55, marginTop: -4 }}>
                  No account creation here. Admins manually add school IDs in Supabase before students or professors can sign in.
                </p>

                {error && (
                  <div style={{
                    padding: '10px 13px',
                    borderRadius: 8,
                    background: 'rgba(198, 40, 40, 0.08)',
                    border: '1px solid rgba(198, 40, 40, 0.22)',
                    fontSize: 12,
                    color: 'var(--color-destructive)',
                  }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '13px 0',
                    marginTop: 2,
                    background: loading ? 'rgba(11, 122, 42, 0.55)' : 'linear-gradient(135deg, #0B7A2A, #086322)',
                    border: 'none',
                    borderRadius: 10,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: loading ? 'none' : `0 8px 22px rgba(11, 122, 42, 0.18)`,
                    transition: 'all 0.18s',
                  }}
                  onMouseEnter={e => {
                    if (!loading) {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 10px 26px rgba(11, 122, 42, 0.24)';
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 22px rgba(11, 122, 42, 0.18)';
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} style={{ animation: 'spin 0.75s linear infinite' }} />
                      Processing…
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}

            <div style={{
              marginTop: 22,
              padding: '12px 14px',
              borderRadius: 10,
              background: 'var(--color-secondary)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-muted-foreground)',
              fontSize: 12,
              lineHeight: 1.55,
            }}>
              Example account email in Supabase: <strong style={{ color: 'var(--color-foreground)' }}>123-4567@nvsu.local</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        borderTop: '1px solid var(--color-border)',
        padding: '10px 44px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
        background: 'rgba(255, 255, 255, 0.78)',
        backdropFilter: 'blur(10px)',
      }}>
        <span style={{ fontSize: 11, color: 'var(--color-muted-foreground)' }}>© 2026 NVSU Concerns</span>
        <div style={{ display: 'flex', gap: 18 }}>
          {['Privacy', 'Terms', 'Docs'].map(l => (
            <Link key={l} href="#" style={{ fontSize: 11, color: 'var(--color-muted-foreground)', textDecoration: 'none', transition: 'color 0.2s', cursor: 'pointer' }} onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-primary)'; }} onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-muted-foreground)'; }}>{l}</Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes float { 0%, 100% { transform: translateY(0px) scale(1); } 50% { transform: translateY(-24px) scale(1.04); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(12px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes orbit { from { transform: rotate(0deg) translateX(72px) rotate(0deg); } to { transform: rotate(360deg) translateX(72px) rotate(-360deg); } }
        @keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
