"use client";

import {
  hasItemType,
  type CheckoutLineDetails,
  type ItemType,
} from "@/lib/itemTypes";
import { cn } from "@/lib/cn";

const inputClassName = cn(
  "w-full rounded-xl border border-brand-border bg-white px-3.5 py-2.5 text-sm text-brand-brown",
  "placeholder:text-brand-muted/60 outline-none transition-shadow",
  "focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
);

const inputErrorClassName = "border-red-300 focus-visible:ring-red-400";

const labelClassName =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-brown";

export type LineDetailsFieldErrors = {
  size?: string;
  flavor?: string;
  message?: string;
  cakeNotes?: string;
  giftNotes?: string;
  productNotes?: string;
};

type CheckoutItemDetailsSectionsProps = {
  itemKey: string;
  itemName?: string;
  itemTypes: ItemType[];
  details: CheckoutLineDetails;
  errors?: LineDetailsFieldErrors;
  disabled?: boolean;
  showItemHeading?: boolean;
  onChange: (next: CheckoutLineDetails) => void;
};

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }
  return (
    <p className="mt-1.5 text-xs text-red-700" role="alert">
      {message}
    </p>
  );
}

export function CheckoutItemDetailsSections({
  itemKey,
  itemName,
  itemTypes,
  details,
  errors,
  disabled,
  showItemHeading = false,
  onChange,
}: CheckoutItemDetailsSectionsProps) {
  const showCake = hasItemType(itemTypes, "cake");
  const showGift = hasItemType(itemTypes, "gift");
  const showOther = hasItemType(itemTypes, "other");

  return (
    <div className="space-y-6">
      {showItemHeading && itemName ? (
        <h3 className="font-display text-lg font-semibold text-brand-brown">
          {itemName}
        </h3>
      ) : null}

      {showCake ? (
        <section className="space-y-4 rounded-2xl border border-brand-border/70 bg-white/80 p-4 sm:p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-brown">
            Cake details
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor={`${itemKey}-size`}
                className={labelClassName}
              >
                Pounds <span className="text-brand-primary">*</span>
              </label>
              <input
                id={`${itemKey}-size`}
                type="text"
                required
                maxLength={80}
                value={details.cake?.size ?? ""}
                placeholder="e.g. 2 pounds"
                disabled={disabled}
                onChange={(event) =>
                  onChange({
                    ...details,
                    cake: {
                      size: event.target.value,
                      flavor: details.cake?.flavor ?? "",
                      message: details.cake?.message ?? "",
                      notes: details.cake?.notes ?? "",
                    },
                  })
                }
                aria-invalid={Boolean(errors?.size)}
                className={cn(inputClassName, errors?.size && inputErrorClassName)}
              />
              <FieldError message={errors?.size} />
            </div>
            <div>
              <label
                htmlFor={`${itemKey}-flavor`}
                className={labelClassName}
              >
                Flavor <span className="text-brand-primary">*</span>
              </label>
              <input
                id={`${itemKey}-flavor`}
                type="text"
                required
                maxLength={120}
                value={details.cake?.flavor ?? ""}
                placeholder="e.g. Chocolate, Vanilla, Red Velvet"
                disabled={disabled}
                onChange={(event) =>
                  onChange({
                    ...details,
                    cake: {
                      size: details.cake?.size ?? "",
                      flavor: event.target.value,
                      message: details.cake?.message ?? "",
                      notes: details.cake?.notes ?? "",
                    },
                  })
                }
                aria-invalid={Boolean(errors?.flavor)}
                className={cn(
                  inputClassName,
                  errors?.flavor && inputErrorClassName,
                )}
              />
              <FieldError message={errors?.flavor} />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor={`${itemKey}-message`}
                className={labelClassName}
              >
                Message on cake
              </label>
              <input
                id={`${itemKey}-message`}
                type="text"
                maxLength={200}
                value={details.cake?.message ?? ""}
                disabled={disabled}
                onChange={(event) =>
                  onChange({
                    ...details,
                    cake: {
                      size: details.cake?.size ?? "",
                      flavor: details.cake?.flavor ?? "",
                      message: event.target.value,
                      notes: details.cake?.notes ?? "",
                    },
                  })
                }
                aria-invalid={Boolean(errors?.message)}
                className={cn(
                  inputClassName,
                  errors?.message && inputErrorClassName,
                )}
              />
              <FieldError message={errors?.message} />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor={`${itemKey}-cake-notes`}
                className={labelClassName}
              >
                Additional notes
              </label>
              <textarea
                id={`${itemKey}-cake-notes`}
                rows={3}
                maxLength={1000}
                value={details.cake?.notes ?? ""}
                disabled={disabled}
                onChange={(event) =>
                  onChange({
                    ...details,
                    cake: {
                      size: details.cake?.size ?? "",
                      flavor: details.cake?.flavor ?? "",
                      message: details.cake?.message ?? "",
                      notes: event.target.value,
                    },
                  })
                }
                placeholder="Allergies, design tweaks, delivery instructions…"
                aria-invalid={Boolean(errors?.cakeNotes)}
                className={cn(
                  inputClassName,
                  "resize-y",
                  errors?.cakeNotes && inputErrorClassName,
                )}
              />
              <FieldError message={errors?.cakeNotes} />
            </div>
          </div>
        </section>
      ) : null}

      {showGift ? (
        <section className="space-y-4 rounded-2xl border border-brand-border/70 bg-white/80 p-4 sm:p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-brown">
            Gift details
          </h2>
          <div>
            <label
              htmlFor={`${itemKey}-gift-notes`}
              className={labelClassName}
            >
              Additional notes
            </label>
            <textarea
              id={`${itemKey}-gift-notes`}
              rows={4}
              maxLength={1000}
              value={details.gift?.notes ?? ""}
              disabled={disabled}
              onChange={(event) =>
                onChange({
                  ...details,
                  gift: { notes: event.target.value },
                })
              }
              placeholder="If you have any instructions or special requests related to your gift, please add them here..."
              aria-invalid={Boolean(errors?.giftNotes)}
              className={cn(
                inputClassName,
                "resize-y",
                errors?.giftNotes && inputErrorClassName,
              )}
            />
            <FieldError message={errors?.giftNotes} />
          </div>
        </section>
      ) : null}

      {showOther ? (
        <section className="space-y-4 rounded-2xl border border-brand-border/70 bg-white/80 p-4 sm:p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-brown">
            Product details
          </h2>
          <div>
            <label
              htmlFor={`${itemKey}-product-notes`}
              className={labelClassName}
            >
              Additional notes
            </label>
            <textarea
              id={`${itemKey}-product-notes`}
              rows={4}
              maxLength={1000}
              value={details.other?.notes ?? ""}
              disabled={disabled}
              onChange={(event) =>
                onChange({
                  ...details,
                  other: { notes: event.target.value },
                })
              }
              placeholder="If you have any special instructions related to this product, please add them here..."
              aria-invalid={Boolean(errors?.productNotes)}
              className={cn(
                inputClassName,
                "resize-y",
                errors?.productNotes && inputErrorClassName,
              )}
            />
            <FieldError message={errors?.productNotes} />
          </div>
        </section>
      ) : null}
    </div>
  );
}
