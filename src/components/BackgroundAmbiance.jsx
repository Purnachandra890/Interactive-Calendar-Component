import { motion, AnimatePresence } from 'framer-motion';

/**
 * BackgroundAmbiance component
 * Renders a full-screen, blurred version of the current month's hero image
 * to create an immersive environmental effect.
 * 
 * @param {Object} props
 * @param {string} props.image - The URL of the image to use as background
 */
export function BackgroundAmbiance({ image }) {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-slate-100 transition-colors duration-1000">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={image}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.35 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* 
            We use a high blur and scale the image slightly to ensure 
            the blurred edges don't reveal the background underneath.
          */}
          <img 
            src={image} 
            alt="" 
            className="w-full h-full object-cover scale-110 blur-[100px] saturate-150"
          />
        </motion.div>
      </AnimatePresence>

      {/* 
        Soft overlay gradient to ensure readability of the main UI.
        This provides a subtle transition from the blurred colors to the content.
      */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-slate-200/30 mix-blend-overlay" />
    </div>
  );
}
