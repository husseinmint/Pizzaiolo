// Helper function to categorize ingredients based on name patterns
export function getIngredientCategory(name: string): string {
  const lowerName = name.toLowerCase().trim()
  
  // Dairy
  if (lowerName.includes("cheese") || lowerName.includes("mozzarella") || lowerName.includes("parmesan") || 
      lowerName.includes("gorgonzola") || lowerName.includes("ricotta") || lowerName.includes("milk") ||
      lowerName.includes("cream") || lowerName.includes("butter") || lowerName.includes("yogurt")) {
    return "Dairy"
  }
  
  // Meats
  if (lowerName.includes("chicken") || lowerName.includes("beef") || lowerName.includes("pork") ||
      lowerName.includes("sausage") || lowerName.includes("pepperoni") || lowerName.includes("ham") ||
      lowerName.includes("bacon") || lowerName.includes("meat") || lowerName.includes("prosciutto")) {
    return "Meats"
  }
  
  // Vegetables
  if (lowerName.includes("tomato") || lowerName.includes("basil") || lowerName.includes("onion") ||
      lowerName.includes("pepper") || lowerName.includes("mushroom") || lowerName.includes("olive") ||
      lowerName.includes("garlic") || lowerName.includes("spinach") || lowerName.includes("lettuce") ||
      lowerName.includes("arugula") || lowerName.includes("bell") || lowerName.includes("zucchini") ||
      lowerName.includes("eggplant") || lowerName.includes("broccoli") || lowerName.includes("corn")) {
    return "Vegetables"
  }
  
  // Dough & Base
  if (lowerName.includes("dough") || lowerName.includes("flour") || lowerName.includes("yeast") ||
      lowerName.includes("pizza") || lowerName.includes("base") || lowerName.includes("crust")) {
    return "Dough"
  }
  
  // Spices & Herbs
  if (lowerName.includes("salt") || lowerName.includes("pepper") || lowerName.includes("oregano") ||
      lowerName.includes("thyme") || lowerName.includes("rosemary") || lowerName.includes("paprika") ||
      lowerName.includes("chili") || lowerName.includes("cumin") || lowerName.includes("spice")) {
    return "Spices"
  }
  
  // Oils & Condiments
  if (lowerName.includes("oil") || lowerName.includes("vinegar") || lowerName.includes("sauce") ||
      lowerName.includes("paste") || lowerName.includes("honey") || lowerName.includes("mustard")) {
    return "Condiments"
  }
  
  // Seafood
  if (lowerName.includes("fish") || lowerName.includes("shrimp") || lowerName.includes("salmon") ||
      lowerName.includes("tuna") || lowerName.includes("anchovy") || lowerName.includes("seafood")) {
    return "Seafood"
  }
  
  // Default
  return "Other"
}


