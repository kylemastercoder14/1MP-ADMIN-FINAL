export const generateSellerIcon = (category: string) => {
  switch (category) {
    case "home-supplies":
      return "🏠";
    case "arts,-crafts-sewing":
      return "🎨";
    case "automotive":
      return "🚗";
    case "beauty-health":
      return "💄";
    case "beauty-personal-care-services":
      return "💅";
    case "creative-services":
      return "✍🏾";
    case "education-training-services":
      return "📚";
    case "event-services":
      return "🎉";
    case "fashion-apparel":
      return "👗";
    case "food-beverages":
      return "🍔";
    case "health-wellness-services":
      return "🏋️";
    case "home-services":
      return "🏡";
    case "jewelry-accessories":
      return "💍";
    case "pet-supplies":
      return "🐶";
    case "professional-services":
      return "👔";
    case "real-estate-services":
      return "🏦";
    case "sports-outdoor":
      return "🏈";
    case "tools-hardwares":
      return "🔨";
    case "toys-games":
      return "🎲";
    case "transportation-logistic-services":
      return "🚚";
    default:
      return "🛒";
  }
};
