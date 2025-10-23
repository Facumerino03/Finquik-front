export const AVAILABLE_ICONS = [
  // Trabajo e Ingresos
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
  
  // Gastos y Compras
  'ShoppingCart',
  'ShoppingBag',
  'Store',
  'Tag',
  'Receipt',
  
  // Comida y Bebida
  'Coffee',
  'Utensils',
  'Pizza',
  'Wine',
  
  // Hogar
  'Home',
  'Lamp',
  'Armchair',
  'BedDouble',
  
  // Transporte
  'Car',
  'Bus',
  'Plane',
  'Train',
  'Bike',
  'Fuel',
  
  // Tecnología
  'Smartphone',
  'Laptop',
  'Tv',
  'Wifi',
  'Gamepad',
  'Headphones',
  
  // Entretenimiento
  'Film',
  'Music',
  'Book',
  'Camera',
  'Palette',
  
  // Salud y Belleza
  'Heart',
  'Activity',
  'Scissors',
  'Sparkles',
  
  // Servicios
  'Zap',
  'Phone',
  'Globe',
  'Mail',
  
  // Educación
  'GraduationCap',
  'BookOpen',
  'Pencil',
  
  // Otros
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