import type { LineDetailsFieldErrors } from "@/components/checkout/CheckoutItemDetailsSections";
import {
  emptyLineDetailsForTypes,
  hasItemType,
  type CheckoutLineDetails,
  type ItemType,
} from "@/lib/itemTypes";

export type CheckoutContactValues = {
  name: string;
  phone: string;
  email: string;
  deliveryDate: string;
  address: string;
};

export type CheckoutFieldErrors = Partial<
  Record<keyof CheckoutContactValues, string>
> & {
  lines?: Record<string, LineDetailsFieldErrors>;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[\d\s+().-]{7,30}$/;

function isFutureOrToday(dateValue: string): boolean {
  const date = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return false;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
}

export function validateContactForm(
  values: CheckoutContactValues,
): CheckoutFieldErrors {
  const errors: CheckoutFieldErrors = {};
  const name = values.name.trim();

  if (name.length < 2) {
    errors.name = "Please enter your name.";
  } else if (name.length > 120) {
    errors.name = "Name is too long (maximum 120 characters).";
  }

  const phone = values.phone.trim();
  if (!phone) {
    errors.phone = "Please enter your phone number.";
  } else if (phone.length < 7) {
    errors.phone = "Please enter your phone number.";
  } else if (!PHONE_PATTERN.test(phone)) {
    errors.phone = "Phone number contains invalid characters.";
  }

  const email = values.email.trim();
  if (email && !EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address or leave this field blank.";
  }

  if (values.deliveryDate && !isFutureOrToday(values.deliveryDate)) {
    errors.deliveryDate = "Delivery date must be today or in the future.";
  }

  if (!values.address.trim()) {
    errors.address = "Please enter your address.";
  } else if (values.address.trim().length > 500) {
    errors.address = "Address is too long (maximum 500 characters).";
  }

  return errors;
}

export function validateLineDetails(
  itemTypes: ItemType[],
  details: CheckoutLineDetails,
): LineDetailsFieldErrors {
  const errors: LineDetailsFieldErrors = {};

  if (hasItemType(itemTypes, "cake")) {
    const size = details.cake?.size?.trim() ?? "";
    const flavor = details.cake?.flavor?.trim() ?? "";
    const message = details.cake?.message?.trim() ?? "";
    const notes = details.cake?.notes?.trim() ?? "";

    if (!size) {
      errors.size = "Please enter cake pounds.";
    } else if (size.length > 80) {
      errors.size = "Pounds is too long (maximum 80 characters).";
    }

    if (!flavor) {
      errors.flavor = "Please enter cake flavor.";
    } else if (flavor.length > 120) {
      errors.flavor = "Flavor is too long (maximum 120 characters).";
    }

    if (message.length > 200) {
      errors.message = "Message on cake is too long (maximum 200 characters).";
    }

    if (notes.length > 1000) {
      errors.cakeNotes = "Notes are too long (maximum 1000 characters).";
    }
  }

  if (hasItemType(itemTypes, "gift")) {
    const notes = details.gift?.notes?.trim() ?? "";
    if (notes.length > 1000) {
      errors.giftNotes = "Notes are too long (maximum 1000 characters).";
    }
  }

  if (hasItemType(itemTypes, "other")) {
    const notes = details.other?.notes?.trim() ?? "";
    if (notes.length > 1000) {
      errors.productNotes = "Notes are too long (maximum 1000 characters).";
    }
  }

  return errors;
}

export function validateCheckoutLines(
  lines: Array<{ key: string; itemTypes: ItemType[]; details: CheckoutLineDetails }>,
): Record<string, LineDetailsFieldErrors> {
  const lineErrors: Record<string, LineDetailsFieldErrors> = {};

  for (const line of lines) {
    const details =
      line.details && Object.keys(line.details).length > 0
        ? line.details
        : emptyLineDetailsForTypes(line.itemTypes);
    const errors = validateLineDetails(line.itemTypes, details);
    if (Object.keys(errors).length > 0) {
      lineErrors[line.key] = errors;
    }
  }

  return lineErrors;
}

/** @deprecated use validateContactForm + validateCheckoutLines */
export function validateCheckoutForm(
  values: CheckoutContactValues & {
    size?: string;
    flavor?: string;
    message?: string;
    notes?: string;
  },
): CheckoutFieldErrors {
  return validateContactForm(values);
}

export function hasCheckoutErrors(errors: CheckoutFieldErrors): boolean {
  if (errors.name || errors.phone || errors.email || errors.deliveryDate || errors.address) {
    return true;
  }
  if (!errors.lines) {
    return false;
  }
  return Object.values(errors.lines).some(
    (line) => Object.keys(line).length > 0,
  );
}

/** Map backend Zod field names to checkout form fields */
export function mapApiFieldErrors(
  errors?: Record<string, string[] | undefined>,
): CheckoutFieldErrors {
  if (!errors) {
    return {};
  }

  const mapped: CheckoutFieldErrors = {};
  const fieldMap: Record<string, keyof CheckoutContactValues> = {
    name: "name",
    phone: "phone",
    email: "email",
    deliveryDate: "deliveryDate",
    address: "address",
  };

  for (const [key, messages] of Object.entries(errors)) {
    const formKey = fieldMap[key];
    const message = messages?.[0];
    if (formKey && message) {
      mapped[formKey] = message;
    }
  }

  return mapped;
}

export function getFirstCheckoutError(
  errors: CheckoutFieldErrors,
): string | null {
  const contact = [
    errors.name,
    errors.phone,
    errors.email,
    errors.deliveryDate,
    errors.address,
  ].find(Boolean);
  if (contact) {
    return contact;
  }

  if (errors.lines) {
    for (const line of Object.values(errors.lines)) {
      const first = Object.values(line).find(Boolean);
      if (first) {
        return first;
      }
    }
  }

  return null;
}
