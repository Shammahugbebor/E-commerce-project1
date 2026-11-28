import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, ArrowLeft, CheckCircle2, Mail } from 'lucide-react';
import { EazetradesMark } from './Header';

export type AuthScreen = 'signin' | 'signup' | 'otp' | 'forgot' | 'check-email' | 'reset';

export interface AuthUser {
  name: string;
  email: string;
  role: 'buyer' | 'seller';
}

interface AuthFlowOverlayProps {
  isOpen: boolean;
  initialScreen?: AuthScreen;
  onClose: () => void;
  onAuthSuccess: (user: AuthUser) => void;
}

const MOSAIC_IMAGES = [
  '/src/assets/images/headphones_main_1795452533961.jpg',
  '/src/assets/images/product_wooden_stool_1795452534731.jpg',
  '/src/assets/images/product_insulated_flask_1795452534646.jpg',
  '/src/assets/images/product_colorful_clogs_1795452533961.jpg',
  '/src/assets/images/product_smartwatch_1795452534296.jpg',
  '/src/assets/images/product_smart_speaker_1795452534163.jpg',
  '/src/assets/images/headphones_thumb_case_1795452534466.jpg',
  '/src/assets/images/headphones_thumb_lifestyle_1795452536609.jpg',
  '/src/assets/images/headphones_thumb_detail_1795452533712.jpg',
  '/src/assets/images/service_delivery_logistics_1795486249157.jpg',
  '/src/assets/images/vendor_storefront_banner_1795486249885.jpg',
  '/src/assets/images/service_artisan_repair_1795486249968.jpg',
];

function maskEmail(email: string): string {
  const parts = email.split('@');
  if (parts.length !== 2) return 'u***@eazetrades.com';
  const [local, domain] = parts;
  const maskedLocal = local.length > 2 ? `${local[0]}***${local[local.length - 1]}` : `${local[0]}***`;
  return `${maskedLocal}@${domain}`;
}

export const AuthFlowOverlay: React.FC<AuthFlowOverlayProps> = ({
  isOpen,
  initialScreen = 'signup',
  onClose,
  onAuthSuccess,
}) => {
  const [screen, setScreen] = useState<AuthScreen>(initialScreen);
  useEffect(() => {
    if (isOpen) {
      setScreen(initialScreen);
      setErrorMsg('');
      setSuccessNote('');
    }
  }, [isOpen, initialScreen]);
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // OTP 6-digit boxes
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Forgot & Reset state
  const [resetEmail, setResetEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [resentNote, setResentNote] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successNote, setSuccessNote] = useState('');

  if (!isOpen) return null;

  const switchScreen = (next: AuthScreen) => {
    setErrorMsg('');
    setSuccessNote('');
    setScreen(next);
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      setErrorMsg('Please fill out all required fields.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    setErrorMsg('');
    switchScreen('otp');
  };

  const handleOtpChange = (index: number, value: string) => {
    const clean = value.replace(/\D/g, '').slice(-1);
    const updated = [...otpDigits];
    updated[index] = clean;
    setOtpDigits(updated);
    if (clean && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join('');
    if (code.length < 6) {
      setErrorMsg('Enter all 6 verification digits sent to your email.');
      return;
    }
    onAuthSuccess({
      name: name.trim() || 'Eazetrades Member',
      email: email.trim() || 'member@eazetrades.com',
      role,
    });
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !password) {
      setErrorMsg('Please enter your name/email and password.');
      return;
    }
    const resolvedEmail = name.includes('@') ? name.trim() : `${name.trim().toLowerCase().replace(/\s+/g, '.')}@eazetrades.com`;
    onAuthSuccess({
      name: name.includes('@') ? name.split('@')[0] : name.trim(),
      email: resolvedEmail,
      role,
    });
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim() || !resetEmail.includes('@')) {
      setErrorMsg('Please enter a valid account email address.');
      return;
    }
    setErrorMsg('');
    setResentNote(false);
    switchScreen('check-email');
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetToken.trim() || password.length < 6 || password !== confirmPassword) {
      setErrorMsg('Enter your reset token and matching 6+ character passwords.');
      return;
    }
    setErrorMsg('');
    setSuccessNote('Password updated. You can now sign in with your new password.');
    setScreen('signin');
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-[#141221]"
      role="dialog"
      aria-modal="true"
      aria-label="Eazetrades Account Authentication"
    >
      {/* Product Collage Mosaic Background matching Auth Design Sheet */}
      <div className="fixed inset-0 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 p-2.5 opacity-35 pointer-events-none">
        {MOSAIC_IMAGES.concat(MOSAIC_IMAGES).map((src, i) => (
          <div key={`${src}-${i}`} className="rounded-xl overflow-hidden bg-[#232036]">
            <img
              src={src}
              alt=""
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      <div className="fixed inset-0 bg-gradient-to-b from-[#141221]/60 via-[#141221]/50 to-[#141221]/75 pointer-events-none" />

      {/* Top Left Brand & Return Button */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-8 pt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-white/95 text-[#141221] shadow-md hover:bg-white transition-colors cursor-pointer"
        >
          <EazetradesMark className="w-6 h-6" />
          <span className="font-display font-bold text-xs tracking-wide text-[#5E35F2]">
            EAZETRADES
          </span>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/90 hover:bg-white text-xs font-semibold text-[#141221] shadow-md transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to marketplace</span>
        </button>
      </div>

      {/* Centered Auth Card */}
      <div className="relative z-10 min-h-[calc(100vh-88px)] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-[460px] bg-white rounded-3xl shadow-2xl border border-[#ECEAF6] p-7 sm:p-10">
          {/* Brand Lockup inside Card */}
          <div className="flex items-center justify-center gap-2 mb-5">
            <EazetradesMark className="w-7 h-7" />
            <span className="font-display font-bold text-sm tracking-wide text-[#5E35F2]">
              EAZETRADES
            </span>
          </div>

          {/* Screen 1 & 2: Create new account (Buyer / Seller toggle) */}
          {screen === 'signup' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <div className="text-center mb-2">
                <h1 className="font-display font-bold text-2xl text-[#141221]">
                  Create new account
                </h1>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B384A] mb-1.5">
                  {role === 'seller' ? 'Business name' : 'Name'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === 'seller' ? 'e.g. James Store Lagos' : 'Enter your full name'}
                  className="w-full h-11 px-3.5 text-sm rounded-xl border border-[#E2DFF2] focus:outline-none focus:border-[#5E35F2]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B384A] mb-1.5">
                  {role === 'seller' ? 'Business email address' : 'Email address'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'seller' ? 'orders@yourbusiness.ng' : 'you@example.com'}
                  className="w-full h-11 px-3.5 text-sm rounded-xl border border-[#E2DFF2] focus:outline-none focus:border-[#5E35F2]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B384A] mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full h-11 pl-3.5 pr-10 text-sm rounded-xl border border-[#E2DFF2] focus:outline-none focus:border-[#5E35F2]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A879C] hover:text-[#141221] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B384A] mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full h-11 pl-3.5 pr-10 text-sm rounded-xl border border-[#E2DFF2] focus:outline-none focus:border-[#5E35F2]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((p) => !p)}
                    aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A879C] hover:text-[#141221] cursor-pointer"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Signing As Buyer / Seller Radio */}
              <div className="pt-1">
                <span className="block text-xs font-semibold text-[#141221] mb-2">Signing As</span>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-2.5 text-sm text-[#3B384A] cursor-pointer">
                    <input
                      type="radio"
                      name="signingRole"
                      checked={role === 'buyer'}
                      onChange={() => setRole('buyer')}
                      className="accent-[#5E35F2] w-4 h-4"
                    />
                    <span>Buyer</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-sm text-[#3B384A] cursor-pointer">
                    <input
                      type="radio"
                      name="signingRole"
                      checked={role === 'seller'}
                      onChange={() => setRole('seller')}
                      className="accent-[#5E35F2] w-4 h-4"
                    />
                    <span>Seller</span>
                  </label>
                </div>
              </div>

              {errorMsg && <p className="text-xs font-medium text-red-700">{errorMsg}</p>}

              <button
                type="submit"
                className="w-full h-11 rounded-full bg-[#5E35F2] hover:bg-[#4D26D9] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Sign up
              </button>

              <p className="text-center text-xs text-[#646175]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchScreen('signin')}
                  className="text-[#5E35F2] font-semibold hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            </form>
          )}

          {/* Screen 3: Confirm it's you (OTP) */}
          {screen === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-5 text-center">
              <div className="space-y-1.5">
                <h1 className="font-display font-bold text-2xl text-[#141221]">Confirm it’s you</h1>
                <p className="text-xs text-[#646175]">
                  Enter the 6-digit code sent to your email {maskEmail(email)}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs px-1 pt-2 border-t border-[#F0EEF8]">
                <span className="text-[#3B384A] font-medium">{maskEmail(email)}</span>
                <button
                  type="button"
                  onClick={() => switchScreen('signup')}
                  className="text-[#5E35F2] font-semibold hover:underline cursor-pointer"
                >
                  Change
                </button>
              </div>

              <div className="flex items-center justify-between gap-2">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      otpRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    aria-label={`Verification digit ${idx + 1}`}
                    className="w-11 h-12 sm:w-12 sm:h-13 text-center text-lg font-bold rounded-xl border border-[#E2DFF2] focus:outline-none focus:border-[#5E35F2] focus:ring-2 focus:ring-[#5E35F2]/20 tabular-nums"
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => setOtpDigits(['4', '8', '2', '9', '1', '5'])}
                className="text-[11px] font-medium text-[#5E35F2] hover:underline cursor-pointer"
              >
                Auto-fill demo verification code (482915)
              </button>

              {errorMsg && <p className="text-xs font-medium text-red-700">{errorMsg}</p>}

              <button
                type="submit"
                className="w-full h-11 rounded-full bg-[#5E35F2] hover:bg-[#4D26D9] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Confirm
              </button>
            </form>
          )}

          {/* Screen 4: Sign in */}
          {screen === 'signin' && (
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div className="text-center space-y-1 mb-2">
                <h1 className="font-display font-bold text-2xl text-[#141221]">Sign in</h1>
                <p className="text-xs text-[#646175]">Welcome back! Please enter your details</p>
              </div>

              {successNote && (
                <div className="p-3 rounded-xl bg-[#F6F3FF] border border-[#D4CCF7] text-xs text-[#4D26D9] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successNote}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#3B384A] mb-1.5">
                  Name or Email
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name or email"
                  className="w-full h-11 px-3.5 text-sm rounded-xl border border-[#E2DFF2] focus:outline-none focus:border-[#5E35F2]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B384A] mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full h-11 pl-3.5 pr-10 text-sm rounded-xl border border-[#E2DFF2] focus:outline-none focus:border-[#5E35F2]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A879C] hover:text-[#141221] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex justify-end mt-1.5">
                  <button
                    type="button"
                    onClick={() => switchScreen('forgot')}
                    className="text-xs font-medium text-[#5E35F2] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              {/* Account Role Toggle on Sign In */}
              <div>
                <span className="block text-xs font-semibold text-[#141221] mb-2">Signing in as</span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('buyer')}
                    className={`h-10 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                      role === 'buyer'
                        ? 'border-[#5E35F2] bg-[#F4F1FE] text-[#5E35F2]'
                        : 'border-[#E2DFF2] text-[#48455A] hover:border-[#5E35F2]/50'
                    }`}
                  >
                    Buyer Account
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('seller')}
                    className={`h-10 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                      role === 'seller'
                        ? 'border-[#5E35F2] bg-[#F4F1FE] text-[#5E35F2]'
                        : 'border-[#E2DFF2] text-[#48455A] hover:border-[#5E35F2]/50'
                    }`}
                  >
                    Seller Storefront
                  </button>
                </div>
              </div>

              {errorMsg && <p className="text-xs font-medium text-red-700">{errorMsg}</p>}

              <button
                type="submit"
                className="w-full h-11 rounded-full bg-[#5E35F2] hover:bg-[#4D26D9] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Sign in
              </button>

              <button
                type="button"
                onClick={() =>
                  onAuthSuccess({
                    name: 'James Store',
                    email: 'hello@jamesstore.ng',
                    role: 'seller',
                  })
                }
                className="w-full h-10 rounded-full border border-[#E2DFF2] hover:border-[#5E35F2] text-xs font-semibold text-[#5E35F2] bg-[#FAF9FE] transition-colors cursor-pointer"
              >
                Quick Demo: Enter Seller Dashboard (James Store)
              </button>

              <p className="text-center text-xs text-[#646175]">
                Don’t have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchScreen('signup')}
                  className="text-[#5E35F2] font-semibold hover:underline cursor-pointer"
                >
                  Sign up
                </button>
              </p>
            </form>
          )}

          {/* Screen 5: Forgot password */}
          {screen === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div className="text-center space-y-1.5 mb-2">
                <h1 className="font-display font-bold text-2xl text-[#141221]">Forgot password</h1>
                <p className="text-xs text-[#646175] leading-relaxed">
                  Enter the email you used to create your account so we can send you instructions on
                  how to reset your password.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B384A] mb-1.5">Email</label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full h-11 px-3.5 text-sm rounded-xl border border-[#E2DFF2] focus:outline-none focus:border-[#5E35F2]"
                />
              </div>

              {errorMsg && <p className="text-xs font-medium text-red-700">{errorMsg}</p>}

              <div className="space-y-2.5 pt-1">
                <button
                  type="submit"
                  className="w-full h-11 rounded-full bg-[#5E35F2] hover:bg-[#4D26D9] text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  Send
                </button>
                <button
                  type="button"
                  onClick={() => switchScreen('signin')}
                  className="w-full h-11 rounded-full border border-[#5E35F2] text-[#5E35F2] hover:bg-[#F6F3FF] text-sm font-semibold transition-colors cursor-pointer"
                >
                  Back to sign in
                </button>
              </div>
            </form>
          )}

          {/* Screen 6: Check your email */}
          {screen === 'check-email' && (
            <div className="space-y-5 text-center">
              <div className="w-12 h-12 rounded-full bg-[#F2F0FA] text-[#5E35F2] flex items-center justify-center mx-auto">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h1 className="font-display font-bold text-2xl text-[#141221]">Check your email</h1>
                <p className="text-xs text-[#646175] leading-relaxed">
                  We have sent an email with password reset information to{' '}
                  <strong className="text-[#141221]">{maskEmail(resetEmail)}</strong>.
                </p>
              </div>

              <p className="text-[11px] text-[#8A879C]">
                Didn’t receive the email? Check spam or promotion folder, or continue directly to
                enter your token.
              </p>

              {resentNote && (
                <p className="text-xs font-medium text-[#5E35F2]">
                  Reset link re-sent to {maskEmail(resetEmail)}.
                </p>
              )}

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => switchScreen('reset')}
                  className="w-full h-11 rounded-full bg-[#5E35F2] hover:bg-[#4D26D9] text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  Enter Reset Token
                </button>
                <button
                  type="button"
                  onClick={() => setResentNote(true)}
                  className="w-full h-11 rounded-full border border-[#E2DFF2] hover:border-[#5E35F2] text-[#3B384A] text-sm font-semibold transition-colors cursor-pointer"
                >
                  Resend email
                </button>
                <button
                  type="button"
                  onClick={() => switchScreen('signin')}
                  className="w-full h-10 text-xs font-semibold text-[#5E35F2] hover:underline cursor-pointer"
                >
                  Back to log in
                </button>
              </div>
            </div>
          )}

          {/* Screen 7: Reset Password */}
          {screen === 'reset' && (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div className="text-center space-y-1.5 mb-2">
                <h1 className="font-display font-bold text-2xl text-[#141221]">Reset Password</h1>
                <p className="text-xs text-[#646175]">Choose a new password for your account</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B384A] mb-1.5">
                  Token Message
                </label>
                <input
                  type="text"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  placeholder="Insert the token sent to your mail"
                  className="w-full h-11 px-3.5 text-sm rounded-xl border border-[#E2DFF2] focus:outline-none focus:border-[#5E35F2]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B384A] mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full h-11 pl-3.5 pr-10 text-sm rounded-xl border border-[#E2DFF2] focus:outline-none focus:border-[#5E35F2]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A879C] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B384A] mb-1.5">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full h-11 pl-3.5 pr-10 text-sm rounded-xl border border-[#E2DFF2] focus:outline-none focus:border-[#5E35F2]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A879C] cursor-pointer"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {errorMsg && <p className="text-xs font-medium text-red-700">{errorMsg}</p>}

              <div className="space-y-2.5 pt-1">
                <button
                  type="submit"
                  className="w-full h-11 rounded-full bg-[#5E35F2] hover:bg-[#4D26D9] text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  Reset password
                </button>
                <button
                  type="button"
                  onClick={() => switchScreen('signin')}
                  className="w-full h-11 rounded-full border border-[#5E35F2] text-[#5E35F2] hover:bg-[#F6F3FF] text-sm font-semibold transition-colors cursor-pointer"
                >
                  Back to log in
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

