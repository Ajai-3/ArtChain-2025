export const generateFileName = (
  userId: string,
  originalName: string,
  category: "profile" | "banner" | "art" | "background"
): string => {
  const timestamp = Date.now();
  const ext = originalName.split(".").pop();

  switch (category) {
    case "profile":
      return `profile/${userId}_avatar.${timestamp}.${ext}`;
    case "banner":
      return `banner/${userId}_cover.${timestamp}.${ext}`;
    case "background":
      return `background/${userId}_background.${timestamp}.${ext}`  
    case "art":
      return `art/${userId}_${timestamp}_${originalName}`;
  }
};
