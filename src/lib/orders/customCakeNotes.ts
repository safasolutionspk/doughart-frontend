export type ParsedCustomCakeNotes = {
  giftNote?: string;
  referenceLink?: string;
  referenceFile?: string;
  extraNotes?: string;
};

export function parseCustomCakeNotes(
  specialInstructions?: string,
): ParsedCustomCakeNotes {
  if (!specialInstructions?.trim()) {
    return {};
  }

  const lines = specialInstructions.split("\n").map((line) => line.trim());
  const giftNote: string[] = [];
  const extraNotes: string[] = [];
  let referenceLink: string | undefined;
  let referenceFile: string | undefined;

  for (const line of lines) {
    const giftMatch = line.match(/^\[Gift note[^\]]*\]:\s*(.+)$/i);
    if (giftMatch) {
      giftNote.push(giftMatch[1]);
      continue;
    }

    const linkMatch = line.match(/^\[Inspiration[^\]]*\]:\s*(.+)$/i);
    if (linkMatch) {
      referenceLink = linkMatch[1];
      continue;
    }

    if (line.startsWith("[Reference image]:")) {
      referenceFile = line.replace(/^\[Reference image\]:\s*/i, "");
      continue;
    }

    if (line.startsWith("[Cake:")) {
      continue;
    }

    if (line) {
      extraNotes.push(line);
    }
  }

  return {
    giftNote: giftNote.length > 0 ? giftNote.join("\n") : undefined,
    referenceLink,
    referenceFile,
    extraNotes: extraNotes.length > 0 ? extraNotes.join("\n") : undefined,
  };
}
