import GridBackground from "@components/DS/grid-background";
import { Typography } from "@components/DS/typography";
import { SectionLayout } from "@feat/landing/section-layout";
import type { Metadata } from "next";
import { SiteConfig } from "site-config";

export const metadata: Metadata = {
  title: `About ${SiteConfig.title}`,
  description:
    "Learn about NOW.TS, our mission to empower content creators with powerful testimonial collection, and meet the founder behind the platform.",
  keywords: ["about", "testimonials", "content creation", "founder", "mission"],
  openGraph: {
    title: `About ${SiteConfig.title}`,
    description:
      "Learn about NOW.TS, our mission to empower content creators with powerful testimonial collection, and meet the founder behind the platform.",
    url: `${SiteConfig.prodUrl}/about`,
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="relative">
      <GridBackground
        color="color-mix(in srgb, var(--muted) 50%, transparent)"
        size={20}
      />
      {/* Hero Section */}
      <SectionLayout variant="transparent">
        <div className="mx-auto max-w-2xl text-center">
          <Typography
            variant="p"
            className="text-base/7 font-semibold text-primary"
          >
            About us
          </Typography>
          <Typography
            variant="h1"
            className="mt-2 text-5xl font-semibold tracking-tight text-foreground sm:text-7xl"
          >
            Building trust through authentic testimonials
          </Typography>
          <Typography
            variant="p"
            className="mt-8 text-lg font-medium text-pretty text-muted-foreground sm:text-xl/8"
          >
            A platform you can trust, built by a dedicated founder committed to
            continuous innovation, regular updates, and transparent
            communication with our community.
          </Typography>
        </div>
      </SectionLayout>

      {/* Main Content */}
      <SectionLayout size="lg" variant="transparent">
        <section className="mt-20 grid grid-cols-1 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-16">
          <div className="lg:pr-8">
            <Typography
              variant="h2"
              className="text-2xl font-semibold tracking-tight text-pretty text-foreground"
            >
              Our commitment to you
            </Typography>
            <Typography
              variant="p"
              className="mt-6 text-base/7 text-muted-foreground"
            >
              NOW.TS is built with a long-term vision and unwavering commitment
              to our users. We understand that choosing a platform means
              trusting us with your most valuable asset - your reputation and
              relationships with clients.
            </Typography>
            <Typography
              variant="p"
              className="mt-8 text-base/7 text-muted-foreground"
            >
              That's why we guarantee regular updates, continuous feature
              improvements, and transparent communication about every change.
              You'll never be left wondering about the future of your
              testimonials or our platform. We're here to grow with you, not
              abandon you.
            </Typography>
          </div>
          <div className="pt-16 lg:row-span-2 lg:-mr-16 xl:mr-auto">
            <div className="-mx-8 grid grid-cols-2 gap-4 sm:-mx-16 sm:grid-cols-4 lg:mx-0 lg:grid-cols-2 xl:gap-8">
              <div className="aspect-square overflow-hidden rounded-xl shadow-xl outline-1 -outline-offset-1 outline-border">
                <img
                  alt="Content creator recording testimonial"
                  src="https://codelynx.mlvcdn.com/images/2025-08-22/IMG_6608.jpeg"
                  className="block size-full object-cover"
                />
              </div>
              <div className="-mt-8 aspect-square overflow-hidden rounded-xl shadow-xl outline-1 -outline-offset-1 outline-border lg:-mt-40">
                <img
                  alt="Team collaboration on testimonials"
                  src="https://codelynx.mlvcdn.com/images/2025-08-22/IMG_7415.jpeg"
                  className="block size-full object-cover"
                />
              </div>
              <div className="aspect-square overflow-hidden rounded-xl shadow-xl outline-1 -outline-offset-1 outline-border">
                <img
                  alt="Digital testimonial showcase"
                  src="https://codelynx.mlvcdn.com/images/2025-08-22/IMG_9392.jpeg"
                  className="block size-full object-cover"
                />
              </div>
              <div className="-mt-8 aspect-square overflow-hidden rounded-xl shadow-xl outline-1 -outline-offset-1 outline-border lg:-mt-40">
                <img
                  alt="Creator success story"
                  src="https://codelynx.mlvcdn.com/images/2025-08-22/IMG_9896 2.jpeg"
                  className="block size-full object-cover"
                />
              </div>
            </div>
          </div>
          <div className="max-lg:mt-16 lg:col-span-1">
            <Typography
              variant="p"
              className="text-base/7 font-semibold text-muted-foreground"
            >
              Our reliability promise
            </Typography>
            <hr className="mt-6 border-t border-border" />
            <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              <div className="flex flex-col gap-y-2 border-b border-dotted border-border pb-4">
                <dt className="text-sm/6 text-muted-foreground">
                  Weekly Updates
                </dt>
                <dd className="order-first text-6xl font-semibold tracking-tight text-foreground">
                  <span>100</span>%
                </dd>
              </div>
              <div className="flex flex-col gap-y-2 border-b border-dotted border-border pb-4">
                <dt className="text-sm/6 text-muted-foreground">
                  Uptime Guarantee
                </dt>
                <dd className="order-first text-6xl font-semibold tracking-tight text-foreground">
                  <span>99.9</span>%
                </dd>
              </div>
              <div className="flex flex-col gap-y-2 max-sm:border-b max-sm:border-dotted max-sm:border-border max-sm:pb-4">
                <dt className="text-sm/6 text-muted-foreground">
                  Response Time
                </dt>
                <dd className="order-first text-6xl font-semibold tracking-tight text-foreground">
                  <span>&lt;24</span>h
                </dd>
              </div>
              <div className="flex flex-col gap-y-2">
                <dt className="text-sm/6 text-muted-foreground">
                  Years Committed
                </dt>
                <dd className="order-first text-6xl font-semibold tracking-tight text-foreground">
                  <span>10</span>+
                </dd>
              </div>
            </dl>
          </div>
        </section>
      </SectionLayout>
    </div>
  );
}
