"use client";

import { Button } from "@ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-brand-primary relative flex min-h-[82vh] items-center justify-center overflow-hidden pt-32 pb-24 md:min-h-[92vh]">
      <div className="bg-brand-primary absolute inset-0" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 22%, rgba(255,255,255,0.45), transparent 55%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 82% 28%, rgba(var(--brand-dark-rgb),0.18), transparent 55%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(var(--brand-dark-rgb),0.18) 1px, transparent 0)",
          backgroundSize: "120px 120px",
        }}
      />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/45 via-transparent to-transparent" />
      <div className="from-brand-dark/25 absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t via-transparent to-transparent" />
      <div className="absolute -top-40 -left-40 h-[26rem] w-[26rem] rounded-full bg-white/30 blur-3xl" />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-6 text-center">
        <motion.h1
          className="font-poppins text-brand-dark text-4xl font-semibold tracking-[0.32em] uppercase sm:text-6xl md:text-[4.5rem]"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.15 }}
        >
          DÉMARRAGE DU PROJET <span className="text-white">DYINGSTAR</span>
        </motion.h1>

        <motion.p
          className="text-brand-dark/80 mt-6 text-sm tracking-[0.55em] uppercase sm:text-base"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.3 }}
        >
          IL ÉTAIT UNE FOIS DANS L’ESPACE....
        </motion.p>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.45 }}
        >
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="group border-brand-dark bg-brand-dark text-brand-primary hover:text-brand-dark h-12 border px-12 text-[0.65rem] font-semibold tracking-[0.45em] uppercase shadow-[0_18px_45px_rgba(var(--brand-dark-rgb),0.35)] transition-transform hover:scale-[1.03] hover:bg-transparent"
            >
              <Link href="#project">
                Découvrir
                <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="group border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-brand-primary h-12 border bg-transparent px-12 text-[0.65rem] font-semibold tracking-[0.45em] uppercase transition-all hover:scale-[1.03]"
            >
              <Link href="/contribute">
                How to contribute
                <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="border-brand-dark/20 pointer-events-none absolute top-[20%] left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full border" />
      <div className="border-brand-dark/15 pointer-events-none absolute top-[22%] left-1/2 h-[20rem] w-[20rem] -translate-x-1/2 rounded-full border" />
    </section>
  );
}
