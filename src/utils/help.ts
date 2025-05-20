export const getPriorityColor = (priority: string) => {
  switch (priority) {
  case "high":
    return "bg-red-100 text-red-800";
  case "medium":
    return "bg-yellow-100 text-yellow-800";
  case "low":
    return "bg-green-100 text-green-800";
  default:
    return "bg-gray-100 text-gray-800";
  }
};

export const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString();
};