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
  color?: string;
}

type SelectedSegment = 'none' | number;

const CategoryChart: React.FC<CategoryChartProps> = ({ 
  categories, 
  size = 300, 
  strokeWidth = 25,
  color = '#00c950'
}) => {
  const [selectedSegment, setSelectedSegment] = useState<SelectedSegment>('none');
  
  const total = categories.reduce((sum, cat) => sum + cat.amount, 0);
  
  const radius = (size - strokeWidth) / 2;
  const centerX = size / 2;
  const centerY = size / 2;

  const startAngle = 180;
  const endAngle = 360;
  const totalAngle = 180;
  const gapAngle = 15;

  const minTouchAngle = 10;
  
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

    const innerRadius = 0;
    const outerRadius = radius + strokeWidth;
    
    if (distance < innerRadius || distance > outerRadius) {
      return false;
    }
    
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    if (angle < 0) angle += 360;

    const segmentAngle = endAngleDeg - startAngleDeg;
    let touchStartAngle = startAngleDeg;
    let touchEndAngle = endAngleDeg;

    if (segmentAngle < minTouchAngle) {
      const expansion = (minTouchAngle - segmentAngle) / 2;
      touchStartAngle -= expansion;
      touchEndAngle += expansion;
    }
    
    let normalizedStart = touchStartAngle;
    let normalizedEnd = touchEndAngle;
    let normalizedAngle = angle;
    
    if (normalizedStart > normalizedEnd) {
      if (normalizedAngle < normalizedStart) {
        normalizedAngle += 360;
      }
      normalizedEnd += 360;
    }
    
    return normalizedAngle >= normalizedStart && normalizedAngle <= normalizedEnd;
  };
  
  const calculateSegmentAngles = () => {
    if (total === 0) return [];
    
    const totalGaps = gapAngle * (categories.length - 1);
    const availableAngle = totalAngle - totalGaps;
    
    let currentAngle = startAngle;
    
    return categories.map((cat, index) => {
      const segmentAngle = (cat.amount / total) * availableAngle;
      const startAngleDeg = currentAngle;
      const endAngleDeg = currentAngle + segmentAngle;
      
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

    for (let i = segments.length - 1; i >= 0; i--) {
      const segment = segments[i];
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
      return color;
    }
    
    if (selectedSegment === index) {
      return color;
    }
    
    return '#e4e4e7';
  };
  
  const getCenterContent = () => {
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
                {total === 0 && (
                  <Path
                    d={createArcPath(startAngle, endAngle, radius, centerX, centerY)}
                    stroke="#f4f4f5"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    fill="none"
                  />
                )}
                
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
