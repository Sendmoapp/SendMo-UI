import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractChainId(privyChainId: string) {
  return privyChainId.split(":")[1]; // Extracts the numeric chain ID
}

export function isValidWalletAddress(address: string): boolean {
  if (typeof address !== "string") {
    return false;
  }

  if (!address.startsWith("0x")) {
    return false;
  }

  if (address.length !== 42) {
    return false;
  }

  try {
    // Attempt to parse the address as a hexadecimal value.
    // If it's not valid hex, it will throw an error.
    BigInt(address); // BigInt will throw an error if the hex is invalid.
    return true;
  } catch (error) {
    return false;
  }
}

export function formatAddress(address: string, chars = 4): string {
  if (!address) {
    return "";
  }
  if (address.length <= chars * 2 + 2) {
    return address;
  }
  return `${address.substring(0, chars + 2)}...${address.substring(
    address.length - chars
  )}`;
}

const dateformatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  timeZoneName: "short",
});

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return dateformatter.format(date);
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString();
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString();
}

export function scientificToDecimal(input: string): string {
  if (typeof input !== "string") {
    return "Invalid input";
  }

  if (!input.includes("e") && !input.includes("E")) {
    // Not scientific notation, return as is
    if (isNaN(parseFloat(input))) {
      return "Invalid input"; //handle cases where string is not a number
    }
    return input;
  }

  try {
    const num = parseFloat(input);
    if (isNaN(num)) {
      return "Invalid input";
    }
    return num.toString();
  } catch (error) {
    return "Invalid input";
  }
}
