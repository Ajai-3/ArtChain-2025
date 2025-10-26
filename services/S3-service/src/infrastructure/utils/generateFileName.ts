import { v4 as uuidv4 } from "uuid";

export const generateFileName = (
  userId: string,
  originalName: string,
  category: "profile" | "banner" | "art" | "background"
): string => {
  const ext = originalName.split(".").pop() || "jpg";
  const uniqueId = uuidv4();

  switch (category) {
    case "profile":
      return `profile/${userId}/${userId}-${uniqueId}.${ext}`;
    case "banner":
      return `banner/${userId}/${userId}-${uniqueId}.${ext}`;
    case "background":
      return `background/${userId}/${userId}-${uniqueId}.${ext}`  
    case "art":
      return `art/${userId}_${uniqueId}_${originalName}`;
  }
};
