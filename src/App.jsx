import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Validation logic for empty fields
    if (!username || !password) {
      setError('Please enter your username and password, mahal.');
      return;
    }

    if (username === 'zhiiijumlaie' && password === 'sexylove') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect username or password, mahal.');
    }
  };

  // --- Envelope Logic ---
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);
  
  const springConfig = { damping: 20, stiffness: 150 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const handleMouseMove = (e) => {
    if (isOpen || !ref.current) return; 
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = (mouseX / width - 0.5) * 200;
    const yPct = (mouseY / height - 0.5) * 200;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const toggleEnvelope = (e) => {
    e?.stopPropagation();
    setIsOpen(!isOpen);
    if (!isOpen) {
      x.set(0);
      y.set(0);
    }
  };

  // 🎬 Animation Variants
  const envelopeVariants = {
    closed: { rotateX: 0, rotateY: 0, z: 0, y: 0 },
    // ADJUSTED: Ibinalik ko sa 350 (mula 450) para hindi masyadong mababa ang envelope
    open: { rotateX: 0, rotateY: 0, z: 0, y: 350, transition: { duration: 1.5, ease: "easeInOut" } }
  };

  const flapVariants = {
    closed: { rotateX: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
    open: { rotateX: 180, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.2 } }
  };

  const letterVariants = {
    closed: { x: "-50%", y: 0, z: 2, scale: 0.9, opacity: 0, transition: { duration: 0.4 } },
    // ADJUSTED: Ginawang -220 (mula -350) para hindi lumagpas sa taas ng screen
    open: { x: "-50%", y: -220, z: 80, scale: 1, opacity: 1, transition: { duration: 1.2, ease: "easeInOut", delay: 0.4 } }
  };

  const textContainerVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 1.2 } }
  };

  const textItemVariants = {
    closed: { opacity: 0, y: 10, filter: 'blur(2px)' },
    open: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8 } }
  };

  // ❤️ Falling Hearts Logic
  const FallingHearts = () => {
    const hearts = Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
      scale: 0.5 + Math.random() * 0.5,
    }));

    return (
      <div className="hearts-container">
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ y: -100, x: 0, opacity: 0, rotate: 0 }}
            animate={{ 
              y: '110vh', 
              x: Math.sin(heart.id) * 40,
              opacity: [0, 1, 1, 0],
              rotate: 360 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: heart.duration, delay: heart.delay, ease: "linear", repeat: 0 }}
            style={{
              position: 'fixed',
              left: `${heart.left}%`,
              top: 0,
              zIndex: 0, 
              pointerEvents: 'none',
              color: '#d4af37', 
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" style={{ transform: `scale(${heart.scale})`, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>
              <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap');

        :root {
          --bg-gradient: radial-gradient(circle at center, #f5f4ef 0%, #d1cfc7 100%);
          --envelope-color: #800000;
          --paper-color: #ffffff;
          --gold-accent: #D4AF37;
          --gold-shine: linear-gradient(45deg, #c5a028, #fcefa1, #c5a028);
        }

        body, html {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          background: var(--bg-gradient);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          overflow: hidden;
        }

        #root {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          perspective: 1200px;
        }

        /* Ambient Blobs */
        .ambient-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.6;
          z-index: 1;
          animation: floatBlob 10s infinite alternate ease-in-out;
        }

        .blob-1 {
          top: 20%;
          left: 20%;
          width: 300px;
          height: 300px;
          background: #800000;
        }

        .blob-2 {
          bottom: 20%;
          right: 20%;
          width: 250px;
          height: 250px;
          background: #D4AF37;
          animation-delay: -5s;
        }

        @keyframes floatBlob {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(20px, -20px) scale(1.1); }
        }

        /* --- iPhone Style Glass Login --- */
        .login-container {
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
          
          padding: 40px 30px;
          border-radius: 32px;
          text-align: center;
          max-width: 340px;
          width: 85%;
          z-index: 100;
          position: relative;
        }

        .login-title {
          font-family: 'Pinyon Script', cursive;
          font-size: 2.8rem;
          color: #4a0000;
          margin-bottom: 20px;
          text-shadow: 0 1px 2px rgba(255,255,255,0.8);
          letter-spacing: 1px;
        }

        .input-group {
          margin-bottom: 20px;
          text-align: left;
        }

        .input-group label {
          display: block;
          font-size: 0.9rem;
          color: #333;
          margin-bottom: 8px;
          font-weight: 500;
          padding-left: 8px;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .input-group input {
          width: 100%;
          padding: 16px;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 18px;
          font-size: 1.05rem;
          color: #1a1a1a;
          box-sizing: border-box;
          transition: all 0.3s ease;
        }

        .input-group input:focus {
          background: rgba(255, 255, 255, 0.95);
          border-color: #800000;
          box-shadow: 0 0 0 4px rgba(128, 0, 0, 0.1);
          outline: none;
        }

        .login-btn {
          width: 100%;
          /* MODIFIED: Red Gradient Background */
          background: linear-gradient(135deg, #ff4d4d 0%, #b71c1c 100%);
          color: white;
          border: none;
          padding: 18px;
          font-size: 1.05rem;
          font-weight: 600;
          border-radius: 18px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          letter-spacing: 0.02em;
          margin-top: 10px;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          /* Added shadow for depth */
          box-shadow: 0 8px 20px rgba(183, 28, 28, 0.3);
        }

        .login-btn:hover {
          transform: scale(0.98);
          box-shadow: 0 4px 10px rgba(183, 28, 28, 0.2);
        }

        .error-msg {
          background: rgba(255, 59, 48, 0.1);
          color: #ff3b30;
          padding: 12px;
          border-radius: 12px;
          font-size: 0.9rem;
          margin-bottom: 20px;
          font-weight: 500;
        }

        /* --- Envelope Styles --- */
        .scene {
          position: relative;
          width: 340px;
          height: 240px;
          transform-style: preserve-3d;
        }

        .envelope-3d {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          cursor: pointer;
        }

        .layer-back {
          position: absolute;
          width: 100%;
          height: 100%;
          background: var(--envelope-color);
          border-radius: 6px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.3);
          transform: translateZ(0px);
        }

        .layer-letter {
          position: absolute;
          left: 50%;
          bottom: 0; 
          transform-style: preserve-3d;
          
          width: 320px;
          height: 600px; 
          background: var(--paper-color);
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 30px 25px;
          box-sizing: border-box;
          box-shadow: 0 5px 15px rgba(0,0,0,0.15);
          border: 1px solid rgba(212, 175, 55, 0.2);
          font-family: 'Playfair Display', serif;
        }

        .layer-letter::after {
          content: '';
          position: absolute;
          top: 8px; left: 8px; right: 8px; bottom: 8px;
          border: 1px solid var(--gold-accent);
          opacity: 0.4;
          pointer-events: none;
        }

        h1 {
          font-family: 'Pinyon Script', cursive;
          font-size: 2.2rem;
          margin: 0 0 10px 0;
          color: #1a1a1a;
          line-height: 1;
          font-weight: 400;
        }

        .message-body {
          font-size: 0.85rem;
          line-height: 1.5;
          color: #2c2c2c;
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
        }

        .message-body p {
          margin: 0;
        }

        .highlight {
          font-family: 'Pinyon Script', cursive;
          font-size: 1.5rem;
          color: #800000;
          margin-top: 8px !important;
          line-height: 1.2;
        }

        .apple-emoji-text {
          width: 18px;
          height: 18px;
          vertical-align: text-bottom;
          margin-left: 4px;
        }

        .layer-front {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transform: translateZ(10px);
          pointer-events: none;
          z-index: 10;
          filter: drop-shadow(0 -5px 15px rgba(0,0,0,0.1));
        }

        .layer-flap {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 130px;
          transform-origin: top;
          transform: translateZ(12px);
          z-index: 30;
          pointer-events: none; 
          transform-style: preserve-3d; 
        }

        .flap-svg {
          filter: drop-shadow(0 5px 10px rgba(0,0,0,0.2));
        }

        .wax-seal {
          position: absolute;
          bottom: 15px;
          left: 50%;
          transform: translateX(-50%) translateZ(1px);
          width: 40px;
          height: 40px;
          background: var(--gold-shine);
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          border: 2px solid #b8860b;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: auto; 
          cursor: pointer;
        }
        
        .wax-seal:hover {
          transform: translateX(-50%) translateZ(1px) scale(1.1);
          transition: transform 0.2s ease;
        }
        
        .wax-seal-inner {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1px dashed #805a00;
          opacity: 0.6;
        }
        
        .hearts-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 5;
        }
      `}</style>

      <AnimatePresence>
        {isAuthenticated && isOpen && <FallingHearts />}
      </AnimatePresence>

      {!isAuthenticated ? (
        <>
          <div className="ambient-blob blob-1"></div>
          <div className="ambient-blob blob-2"></div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.5 }}
            className="login-container"
          >
            <div className="login-title">Login to open envelope</div>
            
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label>Username</label>
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  placeholder="Enter username"
                />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Enter password"
                />
              </div>
              {error && <div className="error-msg">{error}</div>}
              <button type="submit" className="login-btn">Unlock My Heart</button>
            </form>
          </motion.div>
        </>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 1 }}
          className="scene"
        >
          <motion.div 
            ref={ref}
            className="envelope-3d"
            onClick={toggleEnvelope}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              rotateX: isOpen ? 0 : springRotateX,
              rotateY: isOpen ? 0 : springRotateY,
            }}
            variants={envelopeVariants}
            animate={isOpen ? "open" : "closed"}
          >
            
            <div className="layer-back" />

            {/* The Letter */}
            <motion.div 
              className="layer-letter"
              variants={letterVariants}
              initial="closed"
              animate={isOpen ? "open" : "closed"}
            >
              <motion.div
                variants={textContainerVariants}
                initial="closed"
                animate={isOpen ? "open" : "closed"}
                style={{ width: '100%' }}
              >
                <motion.h1 variants={textItemVariants}>Happy Valentine’s Day!</motion.h1>
                
                <div className="message-body">
                  <motion.p variants={textItemVariants}>
                    Hi baby, I just want to say that I love you and I’m always grateful for having you in my life.
                  </motion.p>
                  <motion.p variants={textItemVariants}>
                    Kahit hindi tayo magkasama ngayong Valentine’s, sana next year magkasama na tayong mag-celebrate.
                  </motion.p>
                  <motion.p variants={textItemVariants}>
                    For now, ito muna ang paraan ko para maiparamdam sa’yo ang love ko. Isipin mo na lang na ako yung bouquet 
                    <img 
                      src="https://em-content.zobj.net/source/apple/391/bouquet_1f490.png" 
                      alt="Bouquet" 
                      className="apple-emoji-text"
                    />
                  </motion.p>
                  <motion.p variants={textItemVariants}>
                    Mahal na mahal kita. Nandito lang ako palagi para sa’yo, naka-support at mamahalin ka 24/7. Miss na miss na kita, uwi ka na ha? Hahaha
                  </motion.p>
                  <motion.p variants={textItemVariants} className="highlight">
                    I love you so much, mahal. Happy Valentine’s Day!
                  </motion.p>
                </div>

              </motion.div>
            </motion.div>

            <div className="layer-front">
              <svg width="100%" height="100%" viewBox="0 0 340 240" preserveAspectRatio="none">
                <path d="M0,0 L170,130 L340,0 L340,240 L0,240 Z" fill="#800000" />
              </svg>
            </div>

            <motion.div 
              className="layer-flap"
              variants={flapVariants}
              initial="closed"
              animate={isOpen ? "open" : "closed"}
            >
              <svg className="flap-svg" width="100%" height="100%" viewBox="0 0 340 130" preserveAspectRatio="none">
                <path d="M0,0 L170,130 L340,0 Z" fill="#900000" />
              </svg>
              <div className="wax-seal" onClick={toggleEnvelope}>
                <div className="wax-seal-inner" />
              </div>
            </motion.div>

          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default App;