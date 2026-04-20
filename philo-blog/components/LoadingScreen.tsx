"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            background: "var(--color-bg)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'ZerdeDisplay', serif",
              fontSize: "clamp(2rem, 6vw, 4rem)",
              fontWeight: 800,
              letterSpacing: "0.15em",
              color: "var(--color-text)",
            }}
          >
            ZERDE
          </motion.div>

          <motion.div
            style={{
              width: "120px",
              height: "2px",
              background: "var(--color-border)",
              borderRadius: "999px",
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
                repeat: Infinity,
                repeatType: "loop",
              }}
              style={{
                height: "100%",
                width: "60%",
                background: "var(--color-primary)",
                borderRadius: "999px",
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
