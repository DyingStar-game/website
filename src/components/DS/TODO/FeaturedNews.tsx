'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export type FeaturedNewsItem = {
  title: string;
  description: string;
  image: string;
  badge?: string;
};

export default function FeaturedNews({ items }: { items: FeaturedNewsItem[] }) {
  if (!items.length) {
    return null;
  }

  const latest = items[0];

  return (
    <section id="news" className="relative overflow-hidden bg-brand-dark py-28">
      <div className="absolute inset-0 bg-brand-dark" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-brand-primary/25 via-transparent to-transparent" />
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{ backgroundImage: 'radial-gradient(circle at 16% 25%, rgba(var(--brand-primary-rgb),0.35), transparent 55%)' }}
      />
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{ backgroundImage: 'radial-gradient(circle at 82% 12%, rgba(255,255,255,0.2), transparent 60%)' }}
      />
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-brand-primary/30 to-transparent" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          className="max-w-4xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.4 }}
        >
          <span className="font-poppins uppercase text-[0.65rem] tracking-[0.5em] text-brand-primary/80">Actualités</span>
          <h2 className="mt-4 font-poppins text-4xl font-semibold uppercase tracking-[0.32em] text-white md:text-5xl">
            NEWS
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-white/80 sm:text-base">
            Retrouvez l’essentiel de la mission : un aperçu rapide de la dernière transmission, avant d’explorer les archives des expéditions.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
          <motion.article
            className="relative flex flex-col justify-between border border-brand-primary/40 bg-brand-dark/70 p-10 shadow-[0_25px_60px_rgba(var(--brand-dark-rgb),0.55)]"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true, amount: 0.35 }}
          >
            <div className="space-y-4">
              {latest.badge && (
                <span className="inline-block border border-brand-primary bg-brand-primary/15 px-4 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.45em] text-brand-primary">
                  {latest.badge}
                </span>
              )}
              <h3 className="font-poppins text-[0.7rem] uppercase tracking-[0.42em] text-white">
                {latest.title}
              </h3>
              <p className="text-sm leading-relaxed text-white/75">
                {latest.description}
              </p>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.35em] text-brand-primary/80">
              <span>Dernière mise à jour</span>
              <span className="h-[1px] w-12 bg-brand-primary/40" aria-hidden />
              <span>Journal de bord</span>
            </div>
          </motion.article>

          <motion.div
            className="relative overflow-hidden border border-brand-primary/40 bg-brand-dark/70 shadow-[0_25px_60px_rgba(var(--brand-dark-rgb),0.55)]"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true, amount: 0.35 }}
          >
            <div className="relative aspect-[3/2] w-full overflow-hidden">
              <Image
                src={latest.image}
                alt={latest.title}
                fill
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
            </div>
            <div className="flex flex-col gap-4 border-t border-brand-primary/30 bg-gradient-to-r from-brand-primary/10 via-transparent to-white/5 px-8 py-8 text-xs uppercase tracking-[0.35em] text-brand-primary/80">
              <span>Transmission visuelle</span>
              <p className="text-[0.8rem] leading-relaxed normal-case tracking-normal text-white/80">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus posuere ex et erat ultricies, vitae fermentum quam dictum.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="mt-16 flex justify-center">
          <Button
            size="lg"
            className="border border-brand-primary bg-transparent px-10 text-[0.6rem] font-semibold uppercase tracking-[0.4em] text-brand-primary hover:bg-brand-primary hover:text-brand-dark"
            type="button"
          >
            Voir toutes les news
          </Button>
        </div>
      </div>
    </section>
  );
}
