'use server';

import { createClient } from '@/utils/supabase/server';
import { verifyRateLimit } from '@/lib/ratelimit';

export async function signInWithEmailRateLimited(email: string, password: string) {
  try {
    const { success } = await verifyRateLimit(email, "sign-in");
    if (!success) {
      return {
        success: false,
        requiresMFA: false,
        error: "Too many login attempts. Try again in a few moments.",
      };
    }

    const supabase = await createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      return {
        success: false,
        requiresMFA: false,
        error: signInError.message || "Invalid school ID or password.",
      };
    }

    const { data: mfaData, error: mfaError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (mfaError) {
      return {
        success: false,
        requiresMFA: false,
        error: mfaError.message || "Could not verify the login session.",
      };
    }

    if (mfaData.nextLevel === 'aal2' && mfaData.nextLevel !== mfaData.currentLevel) {
      return { success: true, requiresMFA: true, error: null };
    }

    return { success: true, requiresMFA: false, error: null };
  } catch {
    return {
      success: false,
      requiresMFA: false,
      error: "Login failed. Please check the deployment settings and try again.",
    };
  }
}

export async function signUpWithEmailRateLimited(
  email: string,
  password: string,
  origin: string,
) {
  const { success } = await verifyRateLimit(email, "sign-up");
  if (!success) throw new Error('Too many signup attempts. Try again in a few moments.');

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // After user clicks the email link, Supabase will redirect here
      // with ?code=... → our /auth/callback route exchanges it for a session
      // → then redirects to /login (default next)
      emailRedirectTo: `${origin}/auth/callback?next=/login`,
    },
  });
  if (error) throw error;
  return { success: true };
}

export async function forgotPasswordRateLimited(email: string, redirectUrl: string) {
  const { success } = await verifyRateLimit(email, "password-reset");
  if (!success) throw new Error('Too many password reset attempts. Try again in a few moments.');

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  });
  if (error) throw error;
  return { success: true };
}
