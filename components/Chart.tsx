import React, { useState } from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

interface ChartProps {
  income: number;
  expenses: number;
  size?: number;
  strokeWidth?: number;
}

type SelectedSegment = 'none' | 'income' | 'expenses';

const Chart: React.FC<ChartProps> = ({ 
  income, 
  expenses, 
  size = 300, 
  strokeWidth = 25 
}) => {
  const [selectedSegment, setSelectedSegment] = useState<SelectedSegment>('none');
  
  const balance = income - expenses;
  const total = income + expenses;
  
  const radius = (size - strokeWidth) / 2;
  const centerX = size / 2;
  const centerY = size / 2;

  const startAngle = 180;
  const endAngle = 360;
  const totalAngle = 180;
  const gapAngle = 15;
  
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
  
  // Calcular los ángulos de los segmentos
  let incomeStartAngle, incomeEndAngle, expensesStartAngle, expensesEndAngle;
  
  if (total === 0) {
    incomeStartAngle = incomeEndAngle = expensesStartAngle = expensesEndAngle = 0;
  } else if (income > 0 && expenses > 0) {
    // Ambos tipos presentes - aplicar gap
    const availableAngle = totalAngle - gapAngle;
    const incomeAngle = (income / total) * availableAngle;
    const expensesAngle = (expenses / total) * availableAngle;
    
    incomeStartAngle = startAngle;
    incomeEndAngle = incomeStartAngle + incomeAngle;
    expensesStartAngle = incomeEndAngle + gapAngle;
    expensesEndAngle = expensesStartAngle + expensesAngle;
  } else if (income > 0) {
    // Solo ingresos - ocupar todo el semicírculo
    incomeStartAngle = startAngle;
    incomeEndAngle = endAngle;
    expensesStartAngle = expensesEndAngle = 0;
  } else if (expenses > 0) {
    // Solo gastos - ocupar todo el semicírculo
    expensesStartAngle = startAngle;
    expensesEndAngle = endAngle;
    incomeStartAngle = incomeEndAngle = 0;
  } else {
    incomeStartAngle = incomeEndAngle = expensesStartAngle = expensesEndAngle = 0;
  }
  
  const incomePath = createArcPath(
    incomeStartAngle,
    incomeEndAngle,
    radius,
    centerX,
    centerY
  );
  
  const expensesPath = createArcPath(
    expensesStartAngle,
    expensesEndAngle,
    radius,
    centerX,
    centerY
  );

  // Crear arco completo gris para estado vacío
  const emptyStatePath = createArcPath(
    startAngle,
    endAngle,
    radius,
    centerX,
    centerY
  );
  
  const handleSvgTouch = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    
    if (income > 0 && isPointInArc(locationX, locationY, incomeStartAngle, incomeEndAngle)) {
      setSelectedSegment(selectedSegment === 'income' ? 'none' : 'income');
    } else if (expenses > 0 && isPointInArc(locationX, locationY, expensesStartAngle, expensesEndAngle)) {
      setSelectedSegment(selectedSegment === 'expenses' ? 'none' : 'expenses');
    } else {
      setSelectedSegment('none');
    }
  };

  const handleContainerTouch = () => {
    setSelectedSegment('none');
  };
  
  const getSegmentColor = (segment: 'income' | 'expenses') => {
    if (selectedSegment === 'none') {
      return segment === 'income' ? '#00c950' : '#fb2c36';
    }
    
    if (selectedSegment === segment) {
      return segment === 'income' ? '#00c950' : '#fb2c36';
    }
    
    return '#e4e4e7';
  };
  
  const getCenterContent = () => {
    // Si no hay transacciones, mostrar mensaje de estado vacío
    if (total === 0) {
      return { value: 0, label: 'Start adding your first transaction' };
    }
    
    switch (selectedSegment) {
      case 'income':
        return { value: income, label: 'Income' };
      case 'expenses':
        return { value: expenses, label: 'Expenses' };
      default:
        return { value: balance, label: 'Balance' };
    }
  };
  
  const centerContent = getCenterContent();
  
  const formatCurrency = (amount: number) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
    
    // Solo agregar signo - cuando el balance es negativo
    if (selectedSegment === 'none' && balance < 0) {
      return `-${formatted}`;
    }
    
    return formatted;
  };

  // Determinar el color del texto del balance
  const getBalanceColor = () => {
    if (selectedSegment !== 'none' || total === 0) {
      return '#09090b'; // Color por defecto
    }
    
    // Solo cambiar a rojo cuando el balance es negativo
    return balance < 0 ? '#fb2c36' : '#09090b';
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
                    d={emptyStatePath}
                    stroke="#f4f4f5"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    fill="none"
                  />
                )}
                
                {/* Segmento de ingresos */}
                {income > 0 && (
                  <Path
                    d={incomePath}
                    stroke={getSegmentColor('income')}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    fill="none"
                  />
                )}
                
                {/* Segmento de gastos */}
                {expenses > 0 && (
                  <Path
                    d={expensesPath}
                    stroke={getSegmentColor('expenses')}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    fill="none"
                  />
                )}
              </G>
            </Svg>
          </TouchableWithoutFeedback>
          
          {/* Contenido central */}
          <TouchableWithoutFeedback onPress={handleContainerTouch}>
            <View style={styles.centerContent}>
              <Text style={[
                styles.balanceAmount, 
                total === 0 && styles.emptyStateLabel,
                { color: getBalanceColor() }
              ]}>
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

export default Chart;
