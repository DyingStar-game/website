import { type Locale } from "@i18n/config";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const localMapper = (locale: Locale) => {
  switch (locale) {
    case "fr":
      return "fr_FR";
    case "en":
      return "en_GB";
    default:
      return "fr_FR";
  }
};
