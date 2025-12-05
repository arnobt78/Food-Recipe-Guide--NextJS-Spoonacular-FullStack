/**
 * Reusable Hero Header Component
 * 
 * Features:
 * - Hero image with overlay
 * - SVG icons integration
 * - Gradient text styling
 * - Reusable across pages
 */

import { motion } from "framer-motion";

interface HeroHeaderProps {
  title: string;
  subtitle?: string;
  imageSrc?: string;
  icons?: string[];
  className?: string;
}

const HeroHeader = ({
  title,
  subtitle,
  imageSrc = "/hero-image.webp",
  icons = ["/chef.svg", "/cooking.svg", "/food.svg"],
  className = "",
}: HeroHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative mb-8 rounded-2xl overflow-hidden ${className}`}
    >
      <img
        src={imageSrc}
        alt="Hero"
        className="w-full h-[500px] object-cover opacity-50"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          {icons.length > 0 && (
            <div className="flex items-center justify-center gap-4 mb-4">
              {icons.map((icon, index) => (
                <motion.img
                  key={index}
                  src={icon}
                  alt={`Icon ${index + 1}`}
                  className="w-12 h-12 md:w-16 md:h-16 opacity-80 drop-shadow-glow"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.8, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                />
              ))}
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-white bg-black/80 px-8 py-4 rounded-xl backdrop-blur-sm shadow-glow">
            {title}
          </h1>
          {subtitle && (
            <p className="text-purple-200 mt-2 text-sm md:text-base">{subtitle}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default HeroHeader;

