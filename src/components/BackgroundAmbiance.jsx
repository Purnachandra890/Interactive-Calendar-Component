import { motion, AnimatePresence } from 'framer-motion';

/**
 * BackgroundAmbiance component
 * Renders a realistic wall surface with a subtle texture and lighting,
 * and subtly tints the wall with the theme of the current month.
 */
export function BackgroundAmbiance({ image }) {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-[#F2F0E9] transition-colors duration-1000">
      
      {/* Wall Design Elements: Boho Minimalist Aesthetic */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle dot grid wallpaper pattern */}
        <div 
          className="absolute inset-0 opacity-40 mix-blend-multiply" 
          style={{ backgroundImage: "radial-gradient(rgba(0,0,0,0.1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} 
        />
        {/* Abstract painted arch on the right wall */}
        <div className="absolute top-10 right-10 md:top-20 md:right-32 w-48 md:w-64 h-[400px] md:h-[500px] border border-stone-400/20 rounded-t-full bg-stone-300/10 mix-blend-multiply" />
        {/* Abstract painted circle outline on the left wall */}
        <div className="absolute -bottom-20 -left-20 md:bottom-10 md:left-20 w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full border-[1.5px] border-stone-400/10 mix-blend-multiply" />
      </div>

      {/* Dynamic Environmental Theme Glow */}
      <AnimatePresence mode="popLayout">
        <motion.div
           key={image}
           initial={{ opacity: 0 }}
           animate={{ opacity: 0.6 }}
           exit={{ opacity: 0 }}
           transition={{ duration: 1.2, ease: "easeOut" }}
           className="absolute inset-0 pointer-events-none"
        >
          {/* Changed from multiply to overlay and increased opacity/saturation so colors vividly pop on the wall */}
          <img 
            src={image} 
            alt="ambient-tint" 
            className="w-full h-full object-cover scale-110 blur-[120px] saturate-[1.5] mix-blend-overlay"
          />
        </motion.div>
      </AnimatePresence>

      {/* 
        Subtle SVG paper grain / soft concrete texture 
        Placed over the designs so the design looks painted *on* the material.
      */}
      <div 
        className="absolute inset-0 opacity-[0.25] mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
      
      {/* Soft vignette and lighting gradients to create depth on the wall */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_var(--tw-gradient-stops))] from-white/60 via-transparent to-black/[0.04] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-stone-400/20 pointer-events-none mix-blend-multiply" />
    </div>
  );
}
