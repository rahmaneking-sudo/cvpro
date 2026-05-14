import { motion } from 'framer-motion';
import { useScrollReveal } from '../../hooks/useAnimations';

export default function RevealSection({ children, className = '', delay = 0 }) {
  const [ref, isVisible] = useScrollReveal(0.15);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.9,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}
