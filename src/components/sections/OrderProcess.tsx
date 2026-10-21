import { Reveal } from "@/components/animation/Reveal";
import { SafeImage } from "@/components/ui/SafeImage";
import { capStaggerDelay } from "@/lib/animation/constants";
import { cn } from "@/lib/cn";
import { siteImages } from "@/lib/images";
import { getOrderProcessCopy, whyChooseBenefits } from "@/lib/orderProcess";
import { getBusinessName } from "@/lib/settings";

export async function OrderProcess() {
  const businessName = await getBusinessName();
  const whyChooseCopy = getOrderProcessCopy(businessName);

  return (
    <section
      id="order"
      className={cn(
        "section-anchor relative overflow-hidden bg-[#FBE4E8]",
        /* Mobile: match process.png ratio so object-contain shows the full scene */
        "aspect-[1884/835] min-h-[13.75rem]",
        "sm:aspect-auto sm:min-h-[32rem] lg:min-h-[36rem] xl:min-h-[40rem]",
      )}
      aria-labelledby="order-heading"
    >
      <div className="absolute inset-0" aria-hidden>
        <SafeImage
          src={siteImages.process}
          fallbackSrc={siteImages.process}
          alt=""
          fill
          sizes="100vw"
          className={cn(
            "object-contain object-center opacity-100",
            "sm:object-cover sm:object-[72%_center] lg:object-right",
          )}
        />
      </div>

      <div
        className={cn(
          "section-container relative z-10 flex h-full items-center",
          "py-4 sm:min-h-[32rem] sm:py-12",
          "lg:min-h-[36rem] lg:py-14 xl:min-h-[40rem] xl:py-16",
        )}
      >
        <div className="relative min-w-0 max-w-[10.75rem] sm:max-w-sm md:max-w-md lg:max-w-[28rem] xl:max-w-[30rem]">
          <Reveal direction="left" delay={0}>
            <h2
              id="order-heading"
              className="font-display text-[0.95rem] font-bold leading-[1.05] tracking-tight text-brand-brown sm:text-3xl sm:leading-tight lg:text-[2.125rem]"
            >
              {whyChooseCopy.heading}
            </h2>
          </Reveal>

          <ul className="mt-2.5 space-y-1.5 sm:mt-7 sm:space-y-5 lg:mt-8">
            {whyChooseBenefits.map((benefit, index) => (
              <Reveal
                key={benefit.title}
                as="li"
                delay={capStaggerDelay(index, 0.08, 0.45)}
                direction="up"
                className="flex min-w-0 gap-1.5 sm:gap-3"
              >
                <span
                  className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-primary text-[0.55rem] font-bold text-white sm:mt-0.5 sm:h-8 sm:w-8 sm:text-xs"
                  aria-hidden
                >
                  {index + 1}
                </span>
                <div className="min-w-0 pt-px sm:pt-0.5">
                  <h3 className="font-display text-[0.65rem] font-bold leading-[1.15] text-brand-brown sm:text-base sm:leading-snug">
                    {benefit.title}
                  </h3>
                  <p className="mt-px max-w-[9.5rem] text-[0.5rem] font-medium leading-[1.25] text-brand-brown/80 sm:mt-0.5 sm:max-w-none sm:text-sm sm:leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
