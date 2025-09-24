import React, { useState } from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import { Category } from '../core/types/transactions';

interface CategoryData {
  category: Category;
  amount: number;
}

interface CategoryChartProps {
  categories: CategoryData[];
  size?: number;
  strokeWidth?: number;
  color?: string; // Color principal para los segmentos
}

type SelectedSegment = 'none' | number; // 'none' o el índice de la categoría

const CategoryChart: React.FC<CategoryChartProps> = ({ 
  categories, 
  size = 300, 
  strokeWidth = 25,
  color = '#00c950' // Verde por defecto (para incomes)
}) => {
  const [selectedSegment, setSelectedSegment] = useState<SelectedSegment>('none');
  
  const total = categories.reduce((sum, cat) => sum + cat.amount, 0);
  
  const radius = (size - strokeWidth) / 2;
  const centerX = size / 2;
  const centerY = size / 2;

  // Para un semicírculo perfecto, empezamos desde 180° (izquierda) hasta 360° (derecha)
  const startAngle = 180;
  const endAngle = 360;
  const totalAngle = 180; // 180 grados para un semicírculo

  const gapAngle = 15; // Mismo gap que en el Chart original
  
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  
  const createArcPath = (
    startAngleDeg: number,
    endAngleDeg: number,
    radius: number,
    centerX: number,
    centerY: number
  ) => {
    const startAngleRad = toRadians(startAngleDeg);
    const endAngleRad = toRadians(endAngleDeg);
    
    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);
    
    const largeArcFlag = endAngleDeg - startAngleDeg > 180 ? 1 : 0;
    
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
  };
  
  const isPointInArc = (
    x: number, 
    y: number, 
    startAngleDeg: number, 
    endAngleDeg: number
  ) => {
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const innerRadius = radius - strokeWidth / 2;
    const outerRadius = radius + strokeWidth / 2;
    
    if (distance < innerRadius || distance > outerRadius) {
      return false;
    }
    
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    
    let normalizedStart = startAngleDeg;
    let normalizedEnd = endAngleDeg;
    let normalizedAngle = angle;
    
    if (normalizedStart > normalizedEnd) {
      if (normalizedAngle < normalizedStart) {
        normalizedAngle += 360;
      }
      normalizedEnd += 360;
    }
    
    return normalizedAngle >= normalizedStart && normalizedAngle <= normalizedEnd;
  };
  
  // Calcular los ángulos de cada segmento
  const calculateSegmentAngles = () => {
    if (total === 0) return [];
    
    // Calcular el ángulo total disponible restando los gaps
    const totalGaps = gapAngle * (categories.length - 1);
    const availableAngle = totalAngle - totalGaps;
    
    let currentAngle = startAngle;
    
    return categories.map((cat, index) => {
      const segmentAngle = (cat.amount / total) * availableAngle;
      const startAngleDeg = currentAngle;
      const endAngleDeg = currentAngle + segmentAngle;
      
      // Añadir gap después de cada segmento (excepto el último)
      currentAngle = endAngleDeg + (index < categories.length - 1 ? gapAngle : 0);
      
      return {
        startAngle: startAngleDeg,
        endAngle: endAngleDeg,
        path: createArcPath(startAngleDeg, endAngleDeg, radius, centerX, centerY),
        category: cat.category,
        amount: cat.amount,
        index
      };
    });
  };
  
  const segments = calculateSegmentAngles();
  
  const handleSvgTouch = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    
    for (const segment of segments) {
      if (isPointInArc(locationX, locationY, segment.startAngle, segment.endAngle)) {
        setSelectedSegment(selectedSegment === segment.index ? 'none' : segment.index);
        return;
      }
    }
    
    setSelectedSegment('none');
  };

  const handleContainerTouch = () => {
    setSelectedSegment('none');
  };
  
  const getSegmentColor = (index: number) => {
    if (selectedSegment === 'none') {
      return color; // Usar el color pasado como prop
    }
    
    if (selectedSegment === index) {
      return color; // Usar el color pasado como prop cuando está seleccionado
    }
    
    return '#e4e4e7'; // Gris cuando no está seleccionado
  };
  
  const getCenterContent = () => {
    // Si no hay categorías, mostrar mensaje de estado vacío
    if (total === 0) {
      return { value: 0, label: 'No transactions yet' };
    }
    
    if (selectedSegment !== 'none') {
      const selectedCategory = segments[selectedSegment];
      return { 
        value: selectedCategory.amount, 
        label: selectedCategory.category.name 
      };
    }
    
    // Determinar el label según el color
    const label = color === '#fb2c36' ? 'Total expenses' : 'Total incomes';
    return { value: total, label };
  };
  
  const centerContent = getCenterContent();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  return (
    <TouchableWithoutFeedback onPress={handleContainerTouch}>
      <View style={styles.container}>
        <View style={[styles.chartContainer, { width: size, height: size * 0.6 }]}>
          <TouchableWithoutFeedback onPress={handleSvgTouch}>
            <Svg width={size} height={size * 0.6} viewBox={`0 0 ${size} ${size * 0.6}`}>
              <G>
                {/* Estado vacío: arco completo gris */}
                {total === 0 && (
                  <Path
                    d={createArcPath(startAngle, endAngle, radius, centerX, centerY)}
                    stroke="#f4f4f5"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    fill="none"
                  />
                )}
                
                {/* Segmentos de categorías */}
                {segments.map((segment, index) => (
                  <Path
                    key={segment.category.id}
                    d={segment.path}
                    stroke={getSegmentColor(index)}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    fill="none"
                  />
                ))}
              </G>
            </Svg>
          </TouchableWithoutFeedback>
          
          {/* Contenido central */}
          <TouchableWithoutFeedback onPress={handleContainerTouch}>
            <View style={styles.centerContent}>
              <Text style={styles.balanceAmount}>
                {total === 0 ? '$0' : formatCurrency(centerContent.value)}
              </Text>
              <Text style={[styles.balanceLabel, total === 0 && styles.emptyStateLabel]}>
                {centerContent.label}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: '50%',
  },
  balanceAmount: {
    fontSize: 52,
    fontFamily: 'Inter_700Bold',
    color: '#09090b',
    textAlign: 'center',
  },
  balanceLabel: {
    fontSize: 22,
    fontFamily: 'Inter_500Medium',
    color: '#71717a',
    textAlign: 'center',
    width: '100%',
  },
  emptyStateLabel: {
    fontSize: 18,
    fontFamily: 'Inter_500Medium',
    color: '#71717a',
    textAlign: 'center',
    maxWidth: 200,
  },
});

export default CategoryChart;
