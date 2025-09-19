import { Footer } from "@components/DS/layout/footer";
import { CTASectionCard } from "@feat/landing/cta/cta-card-section";
import { CTAImageSection } from "@feat/landing/cta/cta-image-section";
import { CtaSection } from "@feat/landing/cta/cta-section";
import { FAQSection } from "@feat/landing/faq-section";
import { FeaturesSection } from "@feat/landing/feature-section";
import { Hero } from "@feat/landing/hero";
import { LandingHeader } from "@feat/landing/landing-header";
import { SectionDivider } from "@feat/landing/section-divider";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="bg-background text-foreground relative flex h-fit flex-col">
      <div className="mt-16"></div>

      <LandingHeader />

      <Hero />

      <SectionDivider />

      <FeaturesSection
        features={[
          {
            badge: "⏰ Schedule",
            title: "Schedule your post",
            description: "Schedule your post on the Threader in a few clicks.",
            component: (
              <Image
                src="/images/placeholder1.gif"
                alt=""
                width={200}
                height={100}
                className="h-auto w-full object-cover"
                unoptimized
              />
            ),
          },
          {
            badge: "📅 Calendar",
            title: "See what you scheduled",
            description:
              "With the calendar view, you can see what you scheduled and when.",
            component: (
              <Image
                src="/images/placeholder1.gif"
                alt=""
                width={200}
                height={100}
                className="h-auto w-full object-cover"
              />
            ),
          },
          {
            badge: "👁️ Preview",
            title: "Preview your post",
            description:
              "Preview your post before scheduling it to see how it will look like.",
            component: (
              <Image
                src="/images/placeholder1.gif"
                alt=""
                width={200}
                height={100}
                className="h-auto w-full object-cover"
                unoptimized
              />
            ),
          },
          {
            badge: "🔄 Repost",
            title: "Schedule repost",
            description:
              "Automatically repost your post after a certain amount of time.",
            component: (
              <Image
                src="/images/placeholder1.gif"
                alt=""
                width={200}
                height={100}
                className="h-auto w-full object-cover"
                unoptimized
              />
            ),
          },
        ]}
      />

      <CTAImageSection />

      <CTASectionCard />

      <CtaSection />

      <FAQSection
        faq={[
          {
            question: "What is Threader?",
            answer:
              "Threader is an innovative platform designed to help you write, schedule, and publish content to your account with the assistance of AI, enhancing your business's online presence.",
          },
          {
            question: "How does AI Content Generation work?",
            answer:
              "Our AI Content Generation feature leverages the power of artificial intelligence to create unique and engaging content for your Threads, making content creation easier and more efficient.",
          },
          {
            question: "Can I schedule my threads in advance?",
            answer:
              "Yes, with Threader, you can schedule your threads for a specific time, allowing you to maintain a consistent online presence without the need to manually post every day.",
          },
          {
            question: "What is the Now.TS project?",
            answer:
              "Now.TS is a new project announced on our platform that enables users to create professional Next.js applications in days, streamlining the development process.",
          },
          {
            question: "How can I get more followers?",
            answer:
              "To gain more followers, focus on creating content related to Next.js, as our analysis shows it's highly engaging. Utilize our research tools to understand trends and improve your content strategy.",
          },
          {
            question: "What are the benefits of posting with Threader?",
            answer:
              "Posting with Threader allows you to schedule posts, avoid daily manual postings, track your scheduled content easily, and maintain consistency in your online activity.",
          },
          {
            question: "What pricing plans does Threader offer?",
            answer:
              "Threader offers two pricing plans: THREADER FREE, perfect for tiny creators, allowing you to schedule 1 post in advance; and THREADER PREMIUM, ideal for content creators, offering unlimited scheduling, post previews, and auto-reposting features.",
          },
        ]}
      />

      <SectionDivider />

      <Footer />
    </div>
  );
}
