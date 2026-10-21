"use client";

import Image from "next/image";
import { useState } from "react";

type ReviewAvatarProps = {
  avatar?: string;
  initials: string;
};

export function ReviewAvatar({ avatar, initials }: ReviewAvatarProps) {
  const [failed, setFailed] = useState(false);
  const showImage = avatar && !failed;

  if (showImage) {
    return (
      <span className="relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full border border-brand-border/60 bg-brand-pink-lighter">
        <Image
          src={avatar}
          alt=""
          fill
          sizes="36px"
          className="object-cover"
          onError={() => setFailed(true)}
          aria-hidden
        />
      </span>
    );
  }

  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-primary text-[0.625rem] font-bold text-white"
      aria-hidden
    >
      {initials}
    </span>
  );
}
