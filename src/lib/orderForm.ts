export const orderFormCopy = {
  title: "Place Your Custom Cake Order",
  description:
    "Tell us what you have in mind and we will get back to you to confirm flavours, design, and delivery details.",
  submitLabel: "Submit Order",
  submittingLabel: "Submitting…",
} as const;

export const cakeTypeOptions = [
  "Birthday Cake",
  "Wedding Cake",
  "Kids Cake",
  "Anniversary Cake",
  "Custom Design",
  "Other",
] as const;

export const cakeSizeOptions = [
  '6" (serves ~8)',
  '8" (serves ~12)',
  '10" (serves ~20)',
  '12" (serves ~30)',
  "Two-tier",
  "Three-tier",
  "Not sure yet",
] as const;

export const flavorOptions = [
  "Vanilla",
  "Chocolate",
  "Red Velvet",
  "Strawberry",
  "Lemon",
  "Carrot",
  "Other / mix",
] as const;

export const initialOrderFormState = {
  name: "",
  phone: "",
  email: "",
  cakeType: cakeTypeOptions[0],
  flavor: "",
  size: "",
  message: "",
  deliveryDate: "",
  address: "",
  notes: "",
} as const;

export type OrderFormState = {
  name: string;
  phone: string;
  email: string;
  cakeType: string;
  flavor: string;
  size: string;
  message: string;
  deliveryDate: string;
  address: string;
  notes: string;
};
