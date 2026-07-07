export const formatPostDate = (dateString?: string | null) => {
  if (!dateString) return "Chưa có ngày";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Chưa có ngày";
  }

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};