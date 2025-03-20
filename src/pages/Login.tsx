import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, UserPlus, User } from 'lucide-react';
import { Github } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter.';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter.';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number.';
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return 'Password must contain at least one special character.';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (isSignUpMode) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      const passwordError = validatePassword(password);
      if (passwordError) {
        setError(passwordError);
        setLoading(false);
        return;
      }

      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        
        // Show success message and switch to login
        setIsSignUpMode(false);
        setPassword('');
        setConfirmPassword('');
        setError('Account created successfully! Please sign in.');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create account');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (isResetMode) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/login`,
        });
        if (error) throw error;
        setResetSent(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to send reset email');
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsResetMode(!isResetMode);
    setError('');
    setResetSent(false);
    setPassword('');
    setConfirmPassword('');
  };

  const toggleSignUp = () => {
    setIsSignUpMode(!isSignUpMode);
    setError('');
    setPassword('');
    setConfirmPassword('');
    setIsResetMode(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError('An error occurred while signing in with Google.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900 to-blue-700">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center">
          <div className="bg-blue-400 rounded-full p-6 mb-4 shadow-lg">
            <User className="w-12 h-12 text-white" />
          </div>
          
          {!isResetMode && !isSignUpMode && !resetSent && (
            <h2 className="text-center text-3xl font-extrabold text-white">
              Sign in to your account
            </h2>
          )}
          
          {isSignUpMode && (
            <h2 className="text-center text-3xl font-extrabold text-white">
              Create an account
            </h2>
          )}
          
          {isResetMode && !resetSent && (
            <h2 className="text-center text-3xl font-extrabold text-white">
              Reset Password
            </h2>
          )}
        </div>

        <div className="mt-8">
          {resetSent ? (
            <div className="bg-white/20 backdrop-blur-sm p-8 rounded-lg shadow-lg text-center">
              <div className="text-white mb-4">
                Password reset instructions have been sent to your email.
              </div>
              <button
                onClick={toggleMode}
                className="text-white hover:text-blue-200 font-medium"
              >
                Return to login
              </button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Username"
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-white/30 rounded-md bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  />
                </div>
              </div>

              {!isResetMode && (
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-white" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="appearance-none block w-full pl-10 pr-3 py-3 border border-white/30 rounded-md bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {isSignUpMode && (
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-white" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm Password"
                      className="appearance-none block w-full pl-10 pr-3 py-3 border border-white/30 rounded-md bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {!isResetMode && !isSignUpMode && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-white">
                      Remember Me
                    </label>
                  </div>

                  <div className="text-sm">
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="font-medium text-white hover:text-blue-200"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div className={`text-sm p-2 rounded ${error.includes('successfully') ? 'bg-green-500/20 text-white' : 'bg-red-500/20 text-white'}`}>
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                  ) : (
                    isSignUpMode && <UserPlus className="w-5 h-5 mr-2" />
                  )}
                  {loading
                    ? (isResetMode ? 'Sending...' : (isSignUpMode ? 'Creating Account...' : 'Signing in...'))
                    : (isResetMode ? 'Send Reset Instructions' : (isSignUpMode ? 'Create Account' : 'Sign in'))}
                </button>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <Github className="h-5 w-5 text-white" />
                </span>
                Sign in with Google
              </button>

              <div className="flex flex-col space-y-2 text-center">
                {!isResetMode && (
                  <button
                    type="button"
                    onClick={toggleSignUp}
                    className="w-full text-sm text-white hover:text-blue-200 font-medium"
                  >
                    {isSignUpMode ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
                  </button>
                )}
                
                {isResetMode && (
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="w-full text-sm text-white hover:text-blue-200 font-medium"
                  >
                    Back to sign in
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
