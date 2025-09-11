export const generateFileName = (
  userId: string,
  originalName: string,
  category: "profile" | "banner" | "art"
): string => {
  const timestamp = Date.now();
  switch (category) {
    case "profile":
      return `profile/${userId}_avatar.${Date.now()}${originalName.split(".").pop()}`;
    case "banner":
      return `banner/${userId}_cover.${originalName.split(".").pop()}`;
    case "art":
      return `art/${userId}_${timestamp}_${originalName}`;
  }
};
