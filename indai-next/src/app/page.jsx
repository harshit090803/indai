"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BackgroundSlideshow from '../components/BackgroundSlideshow';
import { Brain, Phone, ChevronDown, CheckCircle, Twitter, Facebook, Loader2, X, Eye, EyeOff } from 'lucide-react';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from '../firebase';
import Link from 'next/link';
import ThemeToggle from '../components/ThemeToggle';
import './Login.css';
import './logo-anim.css';

const countries = [
    { code: "+93", short: "AF" }, { code: "+61", short: "AU" }, { code: "+55", short: "BR" },
    { code: "+1", short: "CA" }, { code: "+86", short: "CN" }, { code: "+33", short: "FR" },
    { code: "+49", short: "DE" }, { code: "+91", short: "IN" }, { code: "+81", short: "JP" },
    { code: "+44", short: "UK" }, { code: "+1", short: "US" },
];

const Login = () => {
    const router = useRouter();
    const navigate = (path) => router.push(path);
    const [phone, setPhone] = useState('');
    const [countryCode, setCountryCode] = useState('+91');
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [socialLoading, setSocialLoading] = useState(null);
    const [phoneLoading, setPhoneLoading] = useState(false);
    const [otpError, setOtpError] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [resendTimer, setResendTimer] = useState(0);

    // New Auth States
    const [authMode, setAuthMode] = useState('phone'); // 'phone', 'email', 'register'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');

    useEffect(() => {
        let interval;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    useEffect(() => {
        // Clear all form states when switching tabs to prevent data bleeding
        setEmail('');
        setPassword('');
        setName('');
        setPhone('');
        setShowPassword(false);
        setOtpError('');
    }, [authMode]);

    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            try {
                window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                    'size': 'invisible',
                    'callback': (response) => {
                        console.log("Recaptcha verified");
                    },
                    'expired-callback': () => {
                        console.log("Recaptcha expired");
                        window.recaptchaVerifier.clear();
                        window.recaptchaVerifier = null;
                    }
                });
            } catch (err) {
                console.error("Recaptcha Init Error", err);
            }
        }
    };

    const handleSocialLogin = (provider) => {
        setSocialLoading(provider);
        setTimeout(() => {
            setSocialLoading(null);
            if (provider === 'google') {
                window.location.href = 'https://google.com';
            } else if (provider === 'facebook') {
                window.location.href = 'https://facebook.com';
            } else if (provider === 'twitter') {
                window.location.href = 'https://twitter.com';
            } else {
                navigate('/language');
            }
        }, 1500);
    };

    const handleContinue = async () => {
        if (phone.length !== 10) {
            alert("Please enter a valid 10-digit mobile number");
            return;
        }

        setPhoneLoading(true);
        const phoneNumber = `${countryCode}${phone}`;

        // FORCE MOCK FLOW FOR TESTING WITHOUT FIREBASE UPGRADE
        setTimeout(() => {
            setPhoneLoading(false);
            setShowOtp(true);
            setResendTimer(60);
        }, 800);
    };

    const handleResendOtp = async () => {
        if (resendTimer > 0) return;

        setPhoneLoading(true);
        setOtpError('');

        // FORCE MOCK RESEND FOR TESTING
        setTimeout(() => {
            setPhoneLoading(false);
            setResendTimer(60);
            alert("Mock OTP resent successfully!");
        }, 800);
        return;
    };

    const handleOtpChange = (index, value) => {
        if (!/^[0-9]?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
        setOtpError('');
    };

    const handleVerify = async () => {
        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            setOtpError("Please enter full 6-digit OTP");
            return;
        }

        setPhoneLoading(true);

        // FORCE MOCK VERIFY FOR TESTING
        setTimeout(() => {
            setPhoneLoading(false);
            navigate('/language');
        }, 800);
        return;
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            setOtpError("Please enter both email and password.");
            return;
        }

        setPhoneLoading(true);
        setOtpError("");

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            
            if (res.ok && data.success) {
                navigate('/language');
            } else {
                setOtpError(data.message || "Invalid credentials");
            }
        } catch (error) {
            setOtpError("An error occurred during login. Please try again.");
        } finally {
            setPhoneLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        
        if (authMode === 'register-email') {
            if (!name || !email || !password) {
                setOtpError("Please fill in all fields.");
                return;
            }
            
            setPhoneLoading(true);
            setOtpError("");

            try {
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });
                const data = await res.json();
                
                if (res.ok && data.success) {
                    setAuthMode('email');
                    setOtpError("Registration successful! Please sign in.");
                } else {
                    setOtpError(data.message || "Registration failed");
                }
            } catch (error) {
                setOtpError("An error occurred during registration. Please try again.");
            } finally {
                setPhoneLoading(false);
            }
        } else {
            // Mock phone registration since no backend for it currently
            if (!name || phone.length !== 10) {
                setOtpError("Please enter valid name and 10-digit mobile number.");
                return;
            }
            setPhoneLoading(true);
            setOtpError("");
            
            setTimeout(() => {
                setPhoneLoading(false);
                setAuthMode('phone');
                setOtpError("Phone registration successful! Please login.");
            }, 800);
        }
    };

    return (
        <div className="login-wrapper">
            <ThemeToggle />
            <BackgroundSlideshow />
            <div className="slideshow-overlay"></div>
            <div className="animated-bg-glow"></div>

            <div className="login-container animate-fade-in">
                <div className="logo-container">
                    <div className="brand-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <div className="logo-text">
                        <span className="text-saffron">IN</span>
                        <span className="text-center-white">D</span>
                        <span className="logo-text-animated-wrapper">
                            <div className="logo-text-flipper">
                                <span className="logo-text-ai text-green">AI</span>
                                <span className="logo-text-ia text-green">IA</span>
                            </div>
                        </span>
                    </div>
                    <div className="tagline">Next Generation Intelligence</div>
                    <div className="sub-tagline" style={{ fontSize: '13px', color: '#94a3b8', marginTop: '6px', fontWeight: '500', letterSpacing: '0.5px' }}>Made in Bharat, made for the world</div>
                </div>

                {!showOtp ? (
                    <>
                        <div className="login-options">
                            <button className="social-btn google-btn google-btn-vibrant" onClick={() => handleSocialLogin('google')} disabled={socialLoading !== null}>
                                {socialLoading === 'google' ? <Loader2 size={18} className="lucide-spin" style={{ marginRight: '10px' }} /> : <i className="fab fa-google" style={{ marginRight: '10px', fontSize: '18px' }}></i>} Continue with Google
                            </button>
                            <button className="social-btn facebook-btn" onClick={() => handleSocialLogin('facebook')} disabled={socialLoading !== null}>
                                {socialLoading === 'facebook' ? <Loader2 size={18} className="lucide-spin" style={{ marginRight: '10px' }} /> : <Facebook size={18} style={{ marginRight: '10px' }} />} Continue with Facebook
                            </button>
                            <button className="social-btn twitter-btn" onClick={() => handleSocialLogin('twitter')} disabled={socialLoading !== null}>
                                {socialLoading === 'twitter' ? <Loader2 size={18} className="lucide-spin" style={{ marginRight: '10px' }} /> : <Twitter size={18} style={{ marginRight: '10px' }} />} Continue with X
                            </button>
                        </div>

                        <div className="divider">Or with Email / Phone</div>



                        <div className="mobile-login animate-fade-in">
                            {authMode === 'phone' && (
                                <>
                                    <div className="phone-input-wrapper">
                                        <select
                                            className="country-code-select"
                                            value={countryCode}
                                            onChange={(e) => setCountryCode(e.target.value)}
                                        >
                                            {countries.map(c => (
                                                <option key={c.short} value={c.code}>{c.short}</option>
                                            ))}
                                        </select>
                                        <div className="dropdown-arrow">
                                            <ChevronDown size={14} />
                                        </div>
                                        <input
                                            type="tel"
                                            className="phone-input"
                                            placeholder="Enter 10-digit mobile number"
                                            value={phone}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, ''); // Allow only digits
                                                if (val.length <= 10) setPhone(val);
                                            }}
                                            required
                                        />
                                        <Phone size={18} className="phone-icon" />
                                    </div>
                                    <button className="submit-btn" onClick={handleContinue} disabled={phoneLoading}>
                                        {phoneLoading ? <Loader2 size={20} className="lucide-spin" /> : "Send OTP"}
                                    </button>
                                </>
                            )}

                            {authMode === 'email' && (
                                <div className="email-auth-wrapper">
                                    <input
                                        type="email"
                                        className="email-input"
                                        placeholder="Enter your email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <div className="password-input-wrapper">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className="password-input"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle-btn"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    <button className="submit-btn" onClick={handleEmailLogin} disabled={phoneLoading}>
                                        {phoneLoading ? <Loader2 size={20} className="lucide-spin" /> : "Sign In"}
                                    </button>
                                </div>
                            )}

                            {authMode === 'register-phone' && (
                                <div className="email-auth-wrapper animate-fade-in">
                                    <input
                                        type="text"
                                        className="email-input"
                                        placeholder="Full Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                    <div className="phone-input-wrapper">
                                        <select
                                            className="country-code-select"
                                            value={countryCode}
                                            onChange={(e) => setCountryCode(e.target.value)}
                                        >
                                            {countries.map(c => (
                                                <option key={c.short} value={c.code}>{c.short}</option>
                                            ))}
                                        </select>
                                        <div className="dropdown-arrow">
                                            <ChevronDown size={14} />
                                        </div>
                                        <input
                                            type="tel"
                                            className="phone-input"
                                            placeholder="Mobile Number"
                                            value={phone}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                if (val.length <= 10) setPhone(val);
                                            }}
                                            required
                                        />
                                        <Phone size={18} className="phone-icon" />
                                    </div>
                                    <button className="submit-btn" onClick={handleRegister} disabled={phoneLoading}>
                                        {phoneLoading ? <Loader2 size={20} className="lucide-spin" /> : "Create Account"}
                                    </button>
                                </div>
                            )}

                            {authMode === 'register-email' && (
                                <div className="email-auth-wrapper animate-fade-in">
                                    <input
                                        type="text"
                                        className="email-input"
                                        placeholder="Full Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                    <input
                                        type="email"
                                        className="email-input"
                                        placeholder="Email Address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <div className="password-input-wrapper">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className="password-input"
                                            placeholder="Create Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle-btn"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    <button className="submit-btn" onClick={handleRegister} disabled={phoneLoading}>
                                        {phoneLoading ? <Loader2 size={20} className="lucide-spin" /> : "Create Account"}
                                    </button>
                                </div>
                            )}

                            {/* Auth Switcher Links */}
                            <div className="auth-switcher-links" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px', fontSize: '13px', alignItems: 'center' }}>

                                {/* LOGIN MODES */}
                                {(authMode === 'phone' || authMode === 'email') && (
                                    <>
                                        <div style={{ color: 'var(--text-secondary)' }}>
                                            {authMode === 'phone' ? "Want to use a password? " : "Prefer using OTP? "}
                                            <span style={{ cursor: 'pointer', textDecoration: 'underline', color: 'white', fontWeight: '500' }}
                                                onClick={() => setAuthMode(authMode === 'phone' ? 'email' : 'phone')}>
                                                {authMode === 'phone' ? "Sign in with Email" : "Sign in with Phone"}
                                            </span>
                                        </div>

                                        <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)', margin: '4px 0' }}></div>

                                        <div style={{ color: 'var(--text-secondary)' }}>
                                            Don't have an account?
                                        </div>
                                        <div style={{ display: 'flex', gap: '16px' }}>
                                            <span style={{ cursor: 'pointer', color: 'var(--primary-color)', fontWeight: '600' }} onClick={() => setAuthMode('register-phone')}>
                                                Sign up with Phone
                                            </span>
                                            <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
                                            <span style={{ cursor: 'pointer', color: 'var(--primary-color)', fontWeight: '600' }} onClick={() => setAuthMode('register-email')}>
                                                Sign up with Email
                                            </span>
                                        </div>
                                    </>
                                )}

                                {/* REGISTER MODES */}
                                {(authMode === 'register-phone' || authMode === 'register-email') && (
                                    <>
                                        <div style={{ color: 'var(--text-secondary)' }}>
                                            {authMode === 'register-phone' ? "Want to use a password? " : "Prefer using OTP? "}
                                            <span style={{ cursor: 'pointer', textDecoration: 'underline', color: 'white', fontWeight: '500' }}
                                                onClick={() => setAuthMode(authMode === 'register-phone' ? 'register-email' : 'register-phone')}>
                                                {authMode === 'register-phone' ? "Sign up with Email" : "Sign up with Phone"}
                                            </span>
                                        </div>

                                        <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)', margin: '4px 0' }}></div>

                                        <div style={{ color: 'var(--text-secondary)' }}>
                                            Already have an account?
                                        </div>
                                        <div style={{ display: 'flex', gap: '16px' }}>
                                            <span style={{ cursor: 'pointer', color: 'var(--primary-color)', fontWeight: '600' }} onClick={() => setAuthMode('phone')}>
                                                Login with Phone
                                            </span>
                                            <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
                                            <span style={{ cursor: 'pointer', color: 'var(--primary-color)', fontWeight: '600' }} onClick={() => setAuthMode('email')}>
                                                Login with Email
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="otp-modal animate-fade-in">
                        <button className="close-btn" onClick={() => setShowOtp(false)}><X size={20} /></button>
                        <h3>Verify Identity</h3>
                        <p>We've sent a security code to<br /><strong>{countryCode} {phone}</strong></p>

                        <div className="otp-input-group">
                            {otp.map((digit, i) => (
                                <input
                                    key={i}
                                    id={`otp-${i}`}
                                    type="text"
                                    className="otp-cell"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(i, e.target.value)}
                                />
                            ))}
                        </div>
                        {otpError && <p style={{ color: '#ff4d4f', fontSize: '13px', marginTop: '-20px', marginBottom: '20px' }}>{otpError}</p>}

                        <div className="resend-otp" style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '10px' }}>
                            Didn't receive the code?{' '}
                            {resendTimer > 0 ? (
                                <span>Wait <strong>{resendTimer}s</strong></span>
                            ) : (
                                <button
                                    onClick={handleResendOtp}
                                    disabled={phoneLoading}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--primary-color)',
                                        cursor: phoneLoading ? 'default' : 'pointer',
                                        fontWeight: '600',
                                        padding: 0,
                                        opacity: phoneLoading ? 0.5 : 1
                                    }}
                                >
                                    Resend now
                                </button>
                            )}
                        </div>

                        <button className="submit-btn" onClick={handleVerify} disabled={phoneLoading}>
                            {phoneLoading ? <Loader2 size={20} className="lucide-spin" /> : "Confirm & Access"}
                        </button>
                    </div>
                )}

                <div className="footer-nav">
                    Secure access governed by our<br /> <Link href="/terms-of-service">Terms of Service</Link> &bull; <Link href="/privacy-policy">Privacy Policy</Link>
                </div>
            </div>

            {/* Invisible ReCaptcha Container moved to the highest DOM level so it never unmounts */}
            <div id="recaptcha-container"></div>
        </div>
    );
};

export default Login;
