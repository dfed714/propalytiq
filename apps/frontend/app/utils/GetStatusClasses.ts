export function getStatusClasses (status: string) {
  switch (status.toLowerCase()) {
    case "paid":
      return "bg-green-100 text-green-700 border-green-200";
    case "open":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "void":
    case "uncollectible":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}; 