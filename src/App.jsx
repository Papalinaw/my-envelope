import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // 3D Tilt Logics
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);
  
  const springConfig = { damping: 20, stiffness: 150 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const handleMouseMove = (e) => {
    if (isOpen) return; 
    
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
    closed: { 
      rotateX: 0, 
      rotateY: 0,
      z: 0,
      y: 0 
    },
    open: { 
      rotateX: 0,
      rotateY: 0,
      z: 0,     
      y: 400,    // Ibaba pa lalo ang envelope dahil sobrang haba na ng paper
      transition: { duration: 1.5, ease: "easeInOut" }
    }
  };

  const flapVariants = {
    closed: { 
      rotateX: 0,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } 
    },
    open: { 
      rotateX: 180,
      transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.2 } 
    }
  };

  const letterVariants = {
    closed: { 
      x: "-50%", 
      y: 0,      
      z: 2, 
      scale: 0.9,
      opacity: 0,
      transition: { duration: 0.4 }
    },
    open: { 
      x: "-50%", 
      y: -300,   // Itaas pa lalo ang slide para lumabas ang dulo ng papel
      z: 80,     
      scale: 1,
      opacity: 1,
      transition: { 
        duration: 1.2, 
        ease: "easeInOut",
        delay: 0.4 
      }
    }
  };

  // Staggered Text Reveal
  const textContainerVariants = {
    closed: { opacity: 0 },
    open: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 1.2 }
    }
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
            transition={{ 
              duration: heart.duration, 
              delay: heart.delay, 
              ease: "linear",
              repeat: 0
            }}
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
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Great+Vibes&display=swap');

        :root {
          --bg-gradient: radial-gradient(circle at center, #f5f4ef 0%, #e0ddd5 100%);
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
          font-family: 'Cormorant Garamond', serif;
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
          
          /* ADJUSTED: Ginawa kong 550px ang height */
          width: 320px;
          height: 550px; 
          background: var(--paper-color);
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 35px 25px;
          box-sizing: border-box;
          box-shadow: 0 5px 15px rgba(0,0,0,0.15);
          border: 1px solid rgba(212, 175, 55, 0.2);
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
          font-family: 'Great Vibes', cursive;
          font-size: 2rem;
          margin: 0 0 15px 0;
          color: #333;
          line-height: 1;
        }

        /* Message body styling */
        .message-body {
          font-size: 0.95rem; 
          line-height: 1.5;
          color: #2c2c2c;
          display: flex;
          flex-direction: column;
          gap: 15px; 
          width: 100%;
        }

        .message-body p {
          margin: 0;
        }

        .highlight {
          font-weight: 600;
          color: #800000;
          margin-top: 15px !important;
          font-size: 1.1rem;
          font-family: 'Great Vibes', cursive;
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
        {isOpen && <FallingHearts />}
      </AnimatePresence>

      <div className="scene">
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
                  For now, ito muna ang paraan ko para maiparamdam sa’yo ang love ko. Isipin mo na lang na ako yung bouquet 💐
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
      </div>
    </>
  );
};

export default App;