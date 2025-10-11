"use client";

import { motion } from "framer-motion";

const ImmersionShowcase = () => {
  return (
    <section
      id="immersion"
      className="bg-brand-dark relative overflow-hidden py-28"
    >
      <div className="bg-brand-dark absolute inset-0" />
      <div className="from-brand-primary/25 absolute inset-x-0 top-0 h-20 bg-gradient-to-b via-transparent to-transparent" />
      <div className="from-brand-primary/20 absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t via-transparent to-transparent" />
      <div className="bg-brand-primary/25 absolute -top-24 right-1/3 h-72 w-72 rounded-full blur-3xl" />
      <div className="absolute -bottom-28 left-1/4 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.4 }}
        >
          <span className="font-poppins text-brand-primary/80 text-sm tracking-[0.5em] uppercase sm:text-base">
            Une plongée dans l’espace
          </span>
        </motion.div>

        <motion.div
          className="border-brand-primary/35 bg-brand-dark/70 relative mt-14 overflow-hidden rounded-[2.8rem] border shadow-[0_28px_70px_rgba(var(--brand-dark-rgb),0.55)]"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          viewport={{ once: true, amount: 0.35 }}
        >
          <div className="relative aspect-video w-full overflow-hidden">
            <iframe
              src="https://www.youtube.com/embed/lyid5mEvoUU"
              title="Voyage à travers les dunes stellaires"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              className="h-full w-full"
            />
            <div className="from-black/60 pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ImmersionShowcase;
