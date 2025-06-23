import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

interface ChartProps {
  income: number;
  expenses: number;
  size?: number;
  strokeWidth?: number;
}

const Chart: React.FC<ChartProps> = ({ 
  income, 
  expenses, 
  size = 300, 
  strokeWidth = 25 
}) => {
  const balance = income - expenses;
  const total = income + expenses;
  
  // Configuración del gráfico
  const radius = (size - strokeWidth) / 2;
  const centerX = size / 2;
  const centerY = size / 2;
  
  // Ángulos para el semicírculo (180 grados total)
  const startAngle = 180; // Comenzar en 180 grados (lado izquierdo)
  const totalAngle = 180; // Total 180 grados para semicírculo perfecto
  
  // Gap entre segmentos (en grados)
  const gapAngle = 14;
  
  // Calcular ángulos disponibles después del gap
  const availableAngle = totalAngle - gapAngle;
  
  // Calcular ángulos para cada segmento con gap
  const incomeAngle = total > 0 ? (income / total) * availableAngle : 0;
  const expensesAngle = total > 0 ? (expenses / total) * availableAngle : 0;
  
  // Función para convertir grados a radianes
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  
  // Función para crear path del arco
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
  
  // Calcular paths para cada segmento con gap
  const incomeEndAngle = startAngle + incomeAngle;
  const expensesStartAngle = incomeEndAngle + gapAngle;
  const expensesEndAngle = expensesStartAngle + expensesAngle;
  
  const incomePath = createArcPath(
    startAngle,
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
  
  // Formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  return (
    <View style={styles.container}>
      <View style={[styles.chartContainer, { width: size, height: size * 0.6 }]}>
        <Svg width={size} height={size * 0.6} viewBox={`0 0 ${size} ${size * 0.6}`}>
          <G>
            {/* Segmento de ingresos (verde) */}
            {income > 0 && (
              <Path
                d={incomePath}
                stroke="#00c950"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                fill="none"
              />
            )}
            
            {/* Segmento de gastos (rojo) */}
            {expenses > 0 && (
              <Path
                d={expensesPath}
                stroke="#fb2c36"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                fill="none"
              />
            )}
          </G>
        </Svg>
        
        {/* Contenido central */}
        <View style={styles.centerContent}>
          <Text style={styles.balanceAmount}>
            {formatCurrency(balance)}
          </Text>
          <Text style={styles.balanceLabel}>Balance</Text>
        </View>
      </View>
    </View>
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
    top: '60%',
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  balanceLabel: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
    width: '100%',
  },
});

export default Chart;