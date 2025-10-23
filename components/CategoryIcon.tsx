import * as LucideIcons from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';

interface CategoryIconProps {
  iconName?: string | null;
  size?: number;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({
  iconName,
  size = 24,
}) => {
  // Buscar el componente del ícono
  const IconComponent = iconName 
    ? (LucideIcons[iconName as keyof typeof LucideIcons] as any)
    : null;

  return (
    <View 
      className="rounded-full items-center justify-center bg-zinc-100"
      style={{ 
        width: size * 2.33,
        height: size * 2.33,
      }}
    >
      {IconComponent ? (
        <IconComponent size={size} color="#09090b" />
      ) : (
        // Fallback: ícono de ayuda
        <LucideIcons.HelpCircle size={size} color="#09090b" />
      )}
    </View>
  );
};

export default CategoryIcon;