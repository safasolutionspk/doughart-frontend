import { CustomCakeBuilderAnimated } from "@/components/animation/CustomCakeBuilderAnimated";
import { SafeImage } from "@/components/ui/SafeImage";
import { siteImages } from "@/lib/images";
import { cn } from "@/lib/cn";

export function CustomCakeBuilder() {
  return (
    <section
      id="custom-cakes"
      className={cn(
        "section-anchor relative overflow-hidden bg-[#FBE4E8]",
        /* Mobile: match custom-cake.png ratio so object-contain shows the full scene */
        "aspect-[1672/941] min-h-[13.75rem]",
        "sm:aspect-auto sm:min-h-[34rem] lg:min-h-[40rem] xl:min-h-[44rem]",
      )}
      aria-labelledby="custom-cakes-heading"
    >
      {/* Full-bleed image only — no wash, gradient, blur, or cover layer */}
      <div className="absolute inset-0" aria-hidden>
        <SafeImage
          src={siteImages.customCake}
          fallbackSrc={siteImages.customCakeFallback}
          alt=""
          fill
          sizes="100vw"
          className={cn(
            "object-contain object-center opacity-100",
            "sm:object-cover sm:object-[68%_center] lg:object-[62%_center]",
          )}
        />
      </div>

      <CustomCakeBuilderAnimated />
    </section>
  );
}
