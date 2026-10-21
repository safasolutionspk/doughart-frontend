import type { Metadata } from "next";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { contactInfo } from "@/lib/contact";
import { buildPageMetadata } from "@/lib/seo";
import { getBusinessName } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const businessName = await getBusinessName();
  return buildPageMetadata({
    title: "Privacy Policy",
    description: `Learn how ${businessName} collects, uses, and protects information provided through its website and services.`,
    path: "/privacy-policy",
    brandName: businessName,
  });
}

function getPrivacySections(businessName: string) {
  return [
    {
      title: "1. Introduction",
      body: [
        `This Privacy Policy explains how ${businessName} (“we”, “us”, or “our”) may collect, use, and protect information when you browse our website, place an order, subscribe to updates, or contact us.`,
        "By using our website or services, you acknowledge this policy. If you do not agree with these terms, please discontinue use of the site.",
      ],
    },
    {
      title: "2. Information We Collect",
      body: [
        `Depending on how you interact with ${businessName}, we may collect:`,
        "Contact details such as your name, email address, phone number, and delivery or billing address when you place an order or enquire with us.",
        "Order details such as cake selections, customisation notes, delivery preferences, and related communication.",
        "Account details when you create or use a customer account, where that feature is available.",
        "Newsletter details such as your email address and marketing consent when you subscribe.",
        "Technical information that may be collected automatically, such as browser type, device information, and general usage data.",
      ],
    },
    {
      title: "3. How We Use Information",
      body: [
        "We may use the information we collect to:",
        "Process and fulfil cake orders and related customer requests.",
        "Communicate about order status, quotes, custom cakes, and support enquiries.",
        "Send marketing messages where you have provided consent.",
        "Improve our website experience, product presentation, and customer service.",
        "Protect the security and integrity of our website and services.",
        "Meet applicable legal or operational requirements where necessary.",
      ],
    },
    {
      title: "4. Orders and Customer Communication",
      body: [
        "When you place an order or request a custom cake, we use the details you provide to prepare, confirm, and deliver your order, and to respond to related questions.",
        "We may contact you by phone, WhatsApp, email, or other channels you share with us, depending on the nature of your request and the services used.",
      ],
    },
    {
      title: "5. Newsletter and Marketing Messages",
      body: [
        "If you subscribe to our newsletter, we use your email address to send updates about offers, new cakes, and bakery news, subject to your consent.",
        "You may unsubscribe from marketing emails at any time using the available unsubscribe method or by contacting us.",
        "Transactional messages related to an order or account may still be sent where necessary to complete your request.",
      ],
    },
    {
      title: "6. Cookies and Website Analytics",
      body: [
        "Our website may use cookies or similar technologies to support basic site functionality, remember preferences, and understand general traffic patterns where analytics tools are enabled.",
        "You can control cookies through your browser settings. Disabling some cookies may affect certain website features.",
      ],
    },
    {
      title: "7. Service Providers",
      body: [
        "We may share information with trusted service providers who help us operate our website and services, such as hosting, email delivery, messaging, analytics, or payment-related tools where applicable.",
        `These providers are expected to process information only as needed to perform their services for ${businessName}.`,
        "We do not sell your personal information.",
      ],
    },
    {
      title: "8. Data Retention",
      body: [
        "We retain information for as long as reasonably necessary to fulfil the purposes described in this policy, including order fulfilment, customer support, legal obligations, and business record-keeping.",
        "Retention periods may vary depending on the type of information and the services used.",
      ],
    },
    {
      title: "9. Information Security",
      body: [
        "We take reasonable measures intended to protect personal information against unauthorised access, loss, misuse, or alteration.",
        "No method of transmission or storage is completely secure, and we cannot guarantee absolute security. Please use strong passwords and protect your account credentials where accounts are available.",
      ],
    },
    {
      title: "10. Your Choices and Rights",
      body: [
        "Depending on applicable law and the services you use, you may request access to, correction of, or deletion of certain personal information we hold about you.",
        "You may also withdraw marketing consent or update your contact preferences by contacting us.",
        "We may need to verify your request before responding and may retain limited information where required for legal or operational reasons.",
      ],
    },
    {
      title: "11. Third-Party Links",
      body: [
        "Our website may include links to third-party websites or services, including social media platforms. Those services have their own privacy practices, and we are not responsible for their content or policies.",
        "We encourage you to review the privacy notices of any third-party sites you visit.",
      ],
    },
    {
      title: "12. Changes to This Policy",
      body: [
        "We may update this Privacy Policy from time to time to reflect changes in our practices, services, or legal requirements.",
        "The “Last updated” date at the top of this page will be revised when changes are published. Continued use of the website after updates means you acknowledge the revised policy.",
      ],
    },
    {
      title: "13. Contact Us",
      body: [
        `If you have questions about this Privacy Policy or how ${businessName} handles information, please contact us:`,
      ],
    },
  ];
}

export default async function PrivacyPolicyPage() {
  const businessName = await getBusinessName();
  const sections = getPrivacySections(businessName);

  return (
    <PublicPageLayout
      mainId="privacy-policy-page"
      ariaLabel="Privacy Policy"
    >
      <section className="section-padding bg-gradient-to-b from-brand-pink-lighter/40 via-white to-[#FFF8FA]">
        <div className="section-container max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">
            Legal
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-brand-brown sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-brand-muted">
            Last updated: July 25, 2026
          </p>
          <p className="mt-4 text-sm leading-relaxed text-brand-muted sm:text-base">
            This page explains how {businessName} may collect, use, and protect
            information provided through our bakery website and related
            services.
          </p>

          <div className="mt-8 space-y-8">
            {sections.map((section) => (
              <section key={section.title} className="scroll-mt-24">
                <h2 className="font-display text-lg font-semibold text-brand-brown sm:text-xl">
                  {section.title}
                </h2>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-brand-muted sm:text-[0.9375rem]">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}

            <address className="not-italic rounded-2xl border border-brand-border/60 bg-white px-4 py-4 text-sm text-brand-muted sm:px-5">
              <p className="font-display text-base font-semibold text-brand-brown">
                {businessName}
              </p>
              <p className="mt-2">{contactInfo.address}</p>
              <p className="mt-2">
                Email:{" "}
                <a
                  href={contactInfo.emailHref}
                  className="font-medium text-brand-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                >
                  {contactInfo.email}
                </a>
              </p>
              <p className="mt-1">
                Phone:{" "}
                <a
                  href={contactInfo.phoneHref}
                  className="font-medium text-brand-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                >
                  {contactInfo.phoneDisplay}
                </a>
              </p>
            </address>
          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
}
