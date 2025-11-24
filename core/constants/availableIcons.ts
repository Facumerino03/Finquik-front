export const AVAILABLE_ICONS = [
  // Work and Finance
  'Briefcase',
  'DollarSign',
  'TrendingUp',
  'PiggyBank',
  'Wallet',
  'CreditCard',
  'Landmark',
  'Gift',
  'Award',
  'Star',
  'Coins',
  'BadgeDollarSign',
  
  // Expenses and Shopping
  'ShoppingCart',
  'ShoppingBag',
  'Store',
  'Tag',
  'Receipt',
  
  // Food and Drink
  'Coffee',
  'Utensils',
  'Pizza',
  'Wine',
  
  // Home
  'Home',
  'Lamp',
  'Armchair',
  'BedDouble',
  
  // Transportation
  'Car',
  'Bus',
  'Plane',
  'Train',
  'Bike',
  'Fuel',
  
  // Tecnology
  'Smartphone',
  'Laptop',
  'Tv',
  'Wifi',
  'Gamepad',
  'Headphones',
  
  // Entertainment
  'Film',
  'Music',
  'Book',
  'Camera',
  'Palette',
  
  // Health and Beauty
  'Heart',
  'Activity',
  'Scissors',
  'Sparkles',
  
  // Services
  'Zap',
  'Phone',
  'Globe',
  'Mail',
  
  // Education
  'GraduationCap',
  'BookOpen',
  'Pencil',
  
  // Others
  'Package',
  'Box',
  'Archive',
  'Bookmark',
  'Building',
  'Factory',
  'Warehouse',
  'Hotel',
  'MapPin',
] as const;

export type AvailableIconName = typeof AVAILABLE_ICONS[number];