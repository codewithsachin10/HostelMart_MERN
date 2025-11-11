// src/pages/LoginPage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import '../App.css';

// client/src/pages/LoginPage.js

// ... (keep the imports and the PasswordStrengthIndicator component) ...

// --- Announcement Banner Component ---
const AnnouncementBanner = () => (
    <div className="announcement-banner">
      ✨ Quick Delivery Guaranteed! Order your favorite snacks and supplies now! ✨
    </div>
);
// --- End Announcement Banner ---

// --- CORRECTED Lamp SVG Component ---
const LampSvg = () => (
    <svg className="lamp" viewBox="0 0 333 484" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g className="lamp__shade shade"><ellipse className="shade__opening" cx="165" cy="220" rx="130" ry="20" /><ellipse className="shade__opening-shade" cx="165" cy="220" rx="130" ry="20" fill="url(#opening-shade)" /></g><g className="lamp__base base"><path className="base__side" d="M165 464c44.183 0 80-8.954 80-20v-14h-22.869c-14.519-3.703-34.752-6-57.131-6-22.379 0-42.612 2.297-57.131 6H85v14c0 11.046 35.817 20 80 20z" /><path d="M165 464c44.183 0 80-8.954 80-20v-14h-22.869c-14.519-3.703-34.752-6-57.131-6-22.379 0-42.612 2.297-57.131 6H85v14c0 11.046 35.817 20 80 20z" fill="url(#side-shading)" /><ellipse className="base__top" cx="165" cy="430" rx="80" ry="20" /><ellipse cx="165" cy="430" rx="80" ry="20" fill="url(#base-shading)" /></g><g className="lamp__post post"><path className="post__body" d="M180 142h-30v286c0 3.866 6.716 7 15 7 8.284 0 15-3.134 15-7V142z" /><path d="M180 142h-30v286c0 3.866 6.716 7 15 7 8.284 0 15-3.134 15-7V142z" fill="url(#post-shading)" /></g><g className="lamp__cords cords"><path className="cord cord--rig" d="M124 187.033V347" strokeWidth="6" strokeLinecap="round" /><path className="cord cord--rig" d="M124 187.023s17.007 21.921 17.007 34.846c0 12.925-11.338 23.231-17.007 34.846-5.669 11.615-17.007 21.921-17.007 34.846 0 12.925 17.007 34.846 17.007 34.846" strokeWidth="6" strokeLinecap="round" /><path className="cord cord--rig" d="M124 187.017s-21.259 17.932-21.259 30.26c0 12.327 14.173 20.173 21.259 30.26 7.086 10.086 21.259 17.933 21.259 30.26 0 12.327-21.259 30.26-21.259 30.26" strokeWidth="6" strokeLinecap="round" /><path className="cord cord--rig" d="M124 187s29.763 8.644 29.763 20.735-19.842 13.823-29.763 20.734c-9.921 6.912-29.763 8.644-29.763 20.735S124 269.939 124 269.939" strokeWidth="6" strokeLinecap="round" /><path className="cord cord--rig" d="M124 187.029s-10.63 26.199-10.63 39.992c0 13.794 7.087 26.661 10.63 39.992 3.543 13.331 10.63 26.198 10.63 39.992 0 13.793-10.63 39.992-10.63 39.992" strokeWidth="6" strokeLinecap="round" /><path className="cord cord--rig" d="M124 187.033V347" strokeWidth="6" strokeLinecap="round" /><line className="cord cord--dummy" x1="124" y2="348" x2="124" y1="190" strokeWidth="6" strokeLinecap="round" /></g><path className="lamp__light" d="M290.5 193H39L0 463.5c0 11.046 75.478 20 165.5 20s167-11.954 167-23l-42-267.5z" fill="url(#light)" /><g className="lamp__top top"><path className="top__body" fillRule="evenodd" clipRule="evenodd" d="M164.859 0c55.229 0 100 8.954 100 20l29.859 199.06C291.529 208.451 234.609 200 164.859 200S38.189 208.451 35 219.06L64.859 20c0-11.046 44.772-20 100-20z" /><path className="top__shading" fillRule="evenodd" clipRule="evenodd" d="M164.859 0c55.229 0 100 8.954 100 20l29.859 199.06C291.529 208.451 234.609 200 164.859 200S38.189 208.451 35 219.06L64.859 20c0-11.046 44.772-20 100-20z" fill="url(#top-shading)" /></g><g className="lamp__face face"><g className="lamp__mouth"><path d="M165 178c19.882 0 36-16.118 36-36h-72c0 19.882 16.118 36 36 36z" fill="#141414" /><clipPath className="lamp__feature" id="mouth" x="129" y="142" width="72" height="36"><path d="M165 178c19.882 0 36-16.118 36-36h-72c0 19.882 16.118 36 36 36z" fill="#141414" /></clipPath><g clipPath="url(#mouth)"><circle className="lamp__tongue" cx="179.4" cy="172.6" r="18" /></g></g><g className="lamp__eyes"><path className="lamp__eye lamp__stroke" d="M115 135c0-5.523-5.82-10-13-10s-13 4.477-13 10" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /><path className="lamp__eye lamp__stroke" d="M241 135c0-5.523-5.82-10-13-10s-13 4.477-13 10" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /></g></g><defs><linearGradient id="opening-shade" x1="35" y1="220" x2="295" y2="220" gradientUnits="userSpaceOnUse"><stop /><stop offset="1" stopColor="var(--shade)" stopOpacity="0" /></linearGradient><linearGradient id="base-shading" x1="85" y1="444" x2="245" y2="444" gradientUnits="userSpaceOnUse"><stop stopColor="var(--b-1)" /><stop offset="0.8" stopColor="var(--b-2)" stopOpacity="0" /></linearGradient><linearGradient id="side-shading" x1="119" y1="430" x2="245" y2="430" gradientUnits="userSpaceOnUse"><stop stopColor="var(--b-3)" /><stop offset="1" stopColor="var(--b-4)" stopOpacity="0" /></linearGradient><linearGradient id="post-shading" x1="150" y1="288" x2="180" y2="288" gradientUnits="userSpaceOnUse"><stop stopColor="var(--b-1)" /><stop offset="1" stopColor="var(--b-2)" stopOpacity="0" /></linearGradient><linearGradient id="light" x1="165.5" y1="218.5" x2="165.5" y2="483.5" gradientUnits="userSpaceOnUse"><stop stopColor="var(--l-1)" stopOpacity=".2" /><stop offset="1" stopColor="var(--l-2)" stopOpacity="0" /></linearGradient><linearGradient id="top-shading" x1="56" y1="110" x2="295" y2="110" gradientUnits="userSpaceOnUse"><stop stopColor="var(--t-1)" stopOpacity=".8" /><stop offset="1" stopColor="var(--t-2)" stopOpacity="0" /></linearGradient></defs><circle className="lamp__hit" cx="124" cy="347" r="66" fill="#C4C4C4" fillOpacity=".1" /></svg>
  );

// ... (keep the rest of the file) ...

// --- Password Strength Component ---
const PasswordStrengthIndicator = ({ strength }) => {
  const getStrengthColor = () => {
    switch (strength) {
      case 0: return '#ef4444'; // Weak
      case 1: return '#f97316'; // Medium
      case 2: return '#eab308'; // Good
      case 3: return '#10b981'; // Strong
      default: return '#6b7280'; // Empty
    }
  };
  const strengthPercentage = strength * 25 + (strength > 0 ? 25 : 0);

  return (
    <div className="password-strength-bar-container">
      <div 
        className="password-strength-bar" 
        style={{ width: `${strengthPercentage}%`, backgroundColor: getStrengthColor() }}
      ></div>
    </div>
  );
};


function LoginPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(-1);
  const [isSignUp, setIsSignUp] = useState(true); 
  const [message, setMessage] = useState(''); 
  const { login } = useAuth();

  const checkPasswordStrength = (pass) => {
    let score = 0;
    if (!pass) {
      setPasswordStrength(-1);
      return;
    }
    if (pass.length > 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    setPasswordStrength(score > 3 ? 3 : score);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  const handleAuth = async (e) => {
    e.preventDefault(); 
    setMessage('Processing...'); 

    if (!isSignUp) {
      try {
        const response = await fetch('http://localhost:5001/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Something went wrong');
        }
        login(data.user, data.token);
      } catch (error) {
        setMessage(error.message);
      }
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      login(data.user, data.token);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const toggleMode = (e) => {
    e.preventDefault(); 
    setIsSignUp((prevMode) => !prevMode); 
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setPasswordStrength(-1);
    setMessage(''); 
  };

  // --- Lamp Animation (MODIFIED) ---
  useEffect(() => {
    if (window.gsap) {
        // --- MOVED ALL GSAP CODE INSIDE THE 'if' BLOCK ---
        const {
          gsap,
          gsap: { registerPlugin, set, to, timeline },
          MorphSVGPlugin,
          Draggable,
        } = window;
        
        // --- Set initial theme to yellow on load ---
        const initialHue = 60;
        set(document.documentElement, { "--shade-hue": initialHue });
        const initialGlowColor = `hsl(${initialHue}, 40%, 45%)`;
        const initialGlowColorDark = `hsl(${initialHue}, 40%, 35%)`;
        set(document.documentElement, {
          "--glow-color": initialGlowColor,
        });
        set(document.documentElement, {
          "--glow-color-dark": initialGlowColorDark,
        });
        
        registerPlugin(MorphSVGPlugin);
        const AUDIO = {
          CLICK: new Audio("https://assets.codepen.io/605876/click.mp3"),
        };
        const LOGIN_FORM = document.querySelector(".login-form");
        let startX;
        let startY;
        const PROXY = document.createElement("div");
        const CORDS = gsap.utils.toArray(".cords path");
        const CORD_DURATION = 0.1;
        const HIT = document.querySelector(".lamp__hit");
        const DUMMY_CORD = document.querySelector(".cord--dummy");
        const ENDX = DUMMY_CORD.getAttribute("x2");
        const ENDY = DUMMY_CORD.getAttribute("y2");
        const RESET = () => {
          set(PROXY, {
            x: ENDX,
            y: ENDY,
          });
        };
        RESET();
        const STATE = {
          ON: false,
        };
        
        gsap.set([".cords", HIT], {
          x: -10,
        });
        gsap.set(".lamp__eye", {
          rotate: 180,
          transformOrigin: "50% 50%",
          yPercent: 50,
        });

        const CORD_TL = timeline({
          paused: true,
          onStart: () => {
            STATE.ON = !STATE.ON;
            set(document.documentElement, { "--on": STATE.ON ? 1 : 0 });
            
            const hue = 60; // Keep it yellow

            set(document.documentElement, { "--shade-hue": hue });
            const glowColor = `hsl(${hue}, 40%, 45%)`;
            const glowColorDark = `hsl(${hue}, 40%, 35%)`;
            set(document.documentElement, {
              "--glow-color": glowColor,
            });
            set(document.documentElement, {
              "--glow-color-dark": glowColorDark,
            });
            set(".lamp__eye", {
              rotate: STATE.ON ? 0 : 180,
            });
            set([DUMMY_CORD, HIT], { display: "none" });
            set(CORDS[0], { display: "block" });
            AUDIO.CLICK.play();
            if (STATE.ON) {
              LOGIN_FORM.classList.add("active");
            } else {
              LOGIN_FORM.classList.remove("active");
            }
          },
          onComplete: () => {
            set([DUMMY_CORD, HIT], { display: "block" });
            set(CORDS[0], { display: "none" });
            RESET();
          },
        });
        for (let i = 1; i < CORDS.length; i++) {
          CORD_TL.add(
            to(CORDS[0], {
              morphSVG: CORDS[i],
              duration: CORD_DURATION,
              repeat: 1,
              yoyo: true,
            })
          );
        }
        Draggable.create(PROXY, {
          trigger: HIT,
          type: "x,y",
          onPress: (e) => {
            startX = e.x;
            startY = e.y;
          },
          onDrag: function () {
            set(DUMMY_CORD, {
              attr: {
                x2: this.x,
                y2: Math.max(400, this.y),
              },
            });
          },
          onRelease: function (e) {
            const DISTX = Math.abs(e.x - startX);
            const DISTY = Math.abs(e.y - startY);
            const TRAVELLED = Math.sqrt(DISTX * DISTX + DISTY * DISTY);
            to(DUMMY_CORD, {
              attr: { x2: ENDX, y2: ENDY },
              duration: CORD_DURATION,
              onComplete: () => {
                if (TRAVELLED > 50) {
                  CORD_TL.restart();
                } else {
                  RESET();
                }
              },
            });
          },
        });
        gsap.set(".lamp", { display: "block" });
      } else {
        console.error("GSAP scripts not loaded!");
      }
  }, []); // The empty array [] means this runs only ONCE
  

  return (
    <div className="auth-page">
      <AnnouncementBanner /> {/* 👈 Added Banner */}
      <div className="container">
        <LampSvg />
        <div className="login-form auth-card">
          <h1 id="auth-title">{isSignUp ? 'Create Your Account' : 'Sign In'}</h1>

          <div className="form-group-social">
            <a href="http://localhost:5001/auth/google" className="btn social-btn google">
              Sign {isSignUp ? 'Up' : 'In'} with Google
            </a>
          </div>
          <div className="form-divider">
            <span>OR</span>
          </div>

          <form id="auth-form" onSubmit={handleAuth}>
            
            {isSignUp && (
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" placeholder="Enter your full name" required value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="Enter your email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" placeholder="Min. 6 characters" required value={password} onChange={handlePasswordChange} />
              {isSignUp && <PasswordStrengthIndicator strength={passwordStrength} />}
            </div>

            {isSignUp && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input type="password" id="confirmPassword" placeholder="Confirm your password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
            )}

            {isSignUp && (
              <div className="form-group-checkbox">
                <input type="checkbox" id="newsletter" />
                <label htmlFor="newsletter">Yes, send me snack deals and exclusive offers!</label>
              </div>
            )}

            <button type="submit" id="auth-button" className="btn">
              {isSignUp ? 'Create Account' : 'Sign Up'}
            </button>

            {isSignUp && (
              <p className="legal-text">
                By creating an account, you agree to our 
                <a href="/terms" target="_blank"> Terms of Service</a> and 
                <a href="/privacy" target="_blank"> Privacy Policy</a>.
              </p>
            )}

            <div className="form-footer">
              {!isSignUp && (
                <p id="forgot-password-link">
                  <a href="#" className="forgot-link">Forgot Password?</a>
                </p>
              )}
              <p id="toggle-text" className="toggle-text">
                {isSignUp
                  ? 'Already have an account? '
                  : 'Need an account? '}
                <a href="#" id="toggle-link" onClick={toggleMode}>
                  {isSignUp ? 'Log In' : 'Sign Up'}
                </a>
              </p>
            </div>
            
            <p id="error-message" className="error-msg">{message}</p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;