import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react"
import { type ImageFileRouter } from "~/app/api/uploadthing/core"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function kebabCase(str: string): string {
  // Convert to lowercase and replace non-alphanumeric characters with hyphens
  const kebab = str.toLowerCase().replace(/[^a-z0-9]+/g, "-")
  // Remove hyphens from the beginning and end of the string
  return kebab.replace(/^-+|-+$/g, "")
}

export const UploadButton = generateUploadButton<ImageFileRouter>()
export const UploadDropzone = generateUploadDropzone<ImageFileRouter>()
