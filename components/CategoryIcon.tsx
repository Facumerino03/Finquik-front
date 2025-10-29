import * as LucideIcons from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import { AVAILABLE_COLORS } from '../core/constants/availableColors';

interface CategoryIconProps {
  iconName?: string | null;
  iconColor?: string | null;
  size?: number;
  containerSize?: number; // Nuevo prop para tamaño fijo del contenedor
}

const CategoryIcon: React.FC<CategoryIconProps> = ({
  iconName,
  iconColor,
  size = 24,
  containerSize, // Si se proporciona, usa este tamaño fijo
}) => {
  // Buscar el componente del ícono
  const IconComponent = iconName 
    ? (LucideIcons[iconName as keyof typeof LucideIcons] as any)
    : null;

  // Obtener el color de fondo basado en el iconColor
  const getBackgroundColor = () => {
    if (!iconColor) return '#f4f4f5'; // zinc-100 por defecto
    
    const color = AVAILABLE_COLORS.find(c => c.value === iconColor);
    return color ? color.bg : '#f4f4f5';
  };

  const color = iconColor || '#71717a'; // zinc-500 por defecto
  const backgroundColor = getBackgroundColor();
  const finalSize = containerSize || size * 2.33;

  return (
    <View 
      className="rounded-full items-center justify-center"
      style={{ 
        width: finalSize,
        height: finalSize,
        backgroundColor,
      }}
    >
      {IconComponent ? (
        <IconComponent size={size} color={color} />
      ) : (
        // Fallback: ícono de ayuda
        <LucideIcons.HelpCircle size={size} color={color} />
      )}
    </View>
  );
};

export default CategoryIcon;