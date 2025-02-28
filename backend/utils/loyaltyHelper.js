// Calculate points based on package type
export const calculateLoyaltyPoints = (packageType) => {
  const pointsMap = {
    basic: 5,
    premium: 15,
    luxury: 25
  };
  return pointsMap[packageType] || 0;
};

// Calculate discount based on points
export const calculateDiscount = (points) => {
  // Every 50 points = $5 discount
  // Maximum discount of $50
  const discount = Math.floor(points / 50) * 5;
  return Math.min(discount, 50);
};