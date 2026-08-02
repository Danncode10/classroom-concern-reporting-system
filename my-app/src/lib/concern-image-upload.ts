import { createClient } from "@/utils/supabase/client";

const BUCKET = "concern-images";
const MAX_INPUT_BYTES = 10 * 1024 * 1024;
const MAX_EDGE = 1600;
const JPEG_QUALITY = 0.84;

export type ConcernImageUpload = { url: string; path: string };

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    const sourceUrl = URL.createObjectURL(file);
    image.onload = () => {
      URL.revokeObjectURL(sourceUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(sourceUrl);
      reject(new Error("The selected image could not be read."));
    };
    image.src = sourceUrl;
  });
}

async function compressImage(file: File): Promise<Blob> {
  const image = await loadImage(file);
  let { width, height } = image;

  if (Math.max(width, height) > MAX_EDGE) {
    const scale = MAX_EDGE / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")?.drawImage(image, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => blob ? resolve(blob) : reject(new Error("Image compression failed.")),
      "image/jpeg",
      JPEG_QUALITY,
    );
  });
}

export function validateConcernImage(file: File): string | null {
  if (!file.type.startsWith("image/")) return "Please choose an image file.";
  if (file.size > MAX_INPUT_BYTES) return "Choose an image smaller than 10 MB.";
  return null;
}

export async function uploadConcernImage(file: File): Promise<ConcernImageUpload> {
  const validationError = validateConcernImage(file);
  if (validationError) throw new Error(validationError);

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Please sign in again before uploading an image.");

  const image = await compressImage(file);
  if (image.size > 5 * 1024 * 1024) throw new Error("The compressed image is still too large. Please choose another image.");

  const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, image, {
    contentType: "image/jpeg",
    upsert: false,
  });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { path, url: data.publicUrl };
}

export async function deleteConcernImage(path: string): Promise<void> {
  const supabase = createClient();
  await supabase.storage.from(BUCKET).remove([path]);
}
