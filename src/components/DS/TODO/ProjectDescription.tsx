"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@ui/button";

export default function ProjectDescription() {
  return (
    <section
      id="project"
      className="bg-brand-primary relative overflow-hidden py-28"
    >
      <div className="bg-brand-primary absolute inset-0" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/60 via-transparent to-transparent" />
      <div className="from-brand-dark/20 absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t via-transparent to-transparent" />
      <div className="absolute -top-32 right-1/5 h-72 w-72 rounded-full bg-white/35 blur-3xl" />
      <div className="bg-brand-dark/25 absolute -bottom-24 left-1/4 h-72 w-72 rounded-full blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          className="border-brand-dark/15 bg-brand-primary relative overflow-hidden rounded-[2.75rem] border p-10 shadow-[0_30px_60px_rgba(var(--brand-dark-rgb),0.25)] md:p-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.4 }}
        >
          <div
            className="absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 18% 20%, rgba(255,255,255,0.4), transparent 58%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 85% 80%, rgba(var(--brand-dark-rgb),0.15), transparent 60%)",
            }}
          />
          <div className="relative">
            <div className="max-w-3xl space-y-6">
              <span className="font-poppins text-brand-dark/70 text-[0.7rem] tracking-[0.5em] uppercase">
                Lorem ipsum
              </span>
              <h3 className="font-poppins text-brand-dark text-3xl font-semibold tracking-[0.24em] uppercase md:text-4xl">
                Dolor sit amet consectetur
              </h3>
              <p className="text-brand-dark/80 text-sm leading-relaxed sm:text-base">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
                iaculis, neque at vestibulum faucibus, orci nulla volutpat
                libero, vitae facilisis lorem quam non magna. Sed posuere
                vulputate magna, non efficitur risus ultricies vel.
              </p>
              <p className="text-brand-dark/70 text-sm leading-relaxed sm:text-base">
                Pellentesque habitant morbi tristique senectus et netus et
                malesuada fames ac turpis egestas. Vivamus vel lorem venenatis,
                tincidunt magna quis, cursus leo. Nam pharetra vulputate lorem,
                ut fermentum lacus facilisis ac.
              </p>
              <Button
                asChild
                size="lg"
                className="border-brand-dark bg-brand-dark text-brand-primary hover:text-brand-dark mt-4 w-fit border px-12 text-[0.6rem] font-semibold tracking-[0.4em] uppercase shadow-[0_18px_45px_rgba(var(--brand-dark-rgb),0.25)] transition-transform hover:scale-[1.02] hover:bg-transparent"
              >
                <Link href="#immersion">Découvrir</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

