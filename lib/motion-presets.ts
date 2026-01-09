export const motionPresets = {
  fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  fadeUp: { hidden: { opacity: 0, y: 40 }, visible: { opacity: 0.999, y: 0 } },
  fadeDown: { hidden: { opacity: 0, y: -40 }, visible: { opacity: 1, y: 0 } },
  fadeLeft: { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } },
  fadeRight: { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } },
  scale: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
  blur: {
    hidden: { opacity: 0, filter: "blur(6px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
  },
} as const;
