export const customCakeCopy = {
  subtitle: "CREATE YOUR SIGNATURE CAKE",
  heading: "A Custom Cake Made for Your Moment",
  description:
    "Choose your favourite flavour, style, colours, and finishing touches to create a cake that feels completely yours.",
  ctaLabel: "Start Customizing",
  ctaHref: "/custom-cake",
} as const;

/** Legacy step list — retained for any remaining imports; not rendered on homepage Customize Cake */
export const customCakeSteps = [
  {
    step: 1,
    title: "Choose Flavour",
    description: "Vanilla, chocolate, red velvet, and more.",
  },
  {
    step: 2,
    title: "Choose Filling",
    description: "Fruit, ganache, buttercream, or mousse layers.",
  },
  {
    step: 3,
    title: "Choose Design",
    description: "Shapes, tiers, colors, and decorative finishes.",
  },
  {
    step: 4,
    title: "Add Personal Touch",
    description: "Messages, toppers, and custom details.",
  },
] as const;
