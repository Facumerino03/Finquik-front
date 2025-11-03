import React, { useState } from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { G, Path, Svg } from 'react-native-svg';
import { Account } from '../core/types/transactions';

interface AccountsBarChartProps {
  accounts: Account[];
  width?: number;
  height?: number;
}

type SelectedAccount = 'none' | number; // 'none' o el índice de la cuenta

const AccountsBarChart: React.FC<AccountsBarChartProps> = ({ 
  accounts, 
  width = 350,
  height = 40
}) => {
  const [selectedAccount, setSelectedAccount] = useState<SelectedAccount>('none');
  
  // Calcular el balance total
  const totalBalance = accounts.reduce((sum, account) => sum + account.currentBalance, 0);
  
  const gapWidth = 8; // Gap entre segmentos
  const borderRadius = 20; // Radio de borde redondeado
  
  // Calcular los segmentos
  const calculateSegments = () => {
    if (totalBalance === 0 || accounts.length === 0) return [];
    
    // Calcular el ancho total disponible restando los gaps
    const totalGaps = gapWidth * (accounts.length - 1);
    const availableWidth = width - totalGaps;
    
    let currentX = 0;
    
    return accounts.map((account, index) => {
      const segmentWidth = (account.currentBalance / totalBalance) * availableWidth;
      const startX = currentX;
      const endX = currentX + segmentWidth;
      
      currentX = endX + gapWidth; // Añadir gap para el siguiente segmento
      
      return {
        account,
        startX,
        endX,
        width: segmentWidth,
        index
      };
    });
  };
  
  const segments = calculateSegments();
  
  const handleBarTouch = (event: any) => {
    const { locationX } = event.nativeEvent;
    
    // Encontrar en qué segmento se hizo clic
    for (const segment of segments) {
      if (locationX >= segment.startX && locationX <= segment.endX) {
        setSelectedAccount(segment.index);
        return;
      }
    }
    
    setSelectedAccount('none');
  };

  const handleContainerTouch = () => {
    setSelectedAccount('none');
  };
  
  const getSegmentColor = (index: number) => {
    if (selectedAccount === 'none') {
      // Mostrar todos los colores normales
      return accounts[index].iconColor || '#71717a';
    }
    
    if (selectedAccount === index) {
      // El segmento seleccionado mantiene su color
      return accounts[index].iconColor || '#71717a';
    }
    
    // Los demás segmentos se vuelven grises
    return '#e4e4e7';
  };
  
  const getCenterContent = () => {
    // Si no hay cuentas, mostrar mensaje de estado vacío
    if (totalBalance === 0 || accounts.length === 0) {
      return { value: 0, label: 'No accounts yet' };
    }
    
    if (selectedAccount !== 'none') {
      const account = accounts[selectedAccount];
      return { 
        value: account.currentBalance, 
        label: account.name 
      };
    }
    
    return { value: totalBalance, label: 'Total balance' };
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

  // Crear el path para un rectángulo redondeado
  const createRoundedRectPath = (x: number, y: number, width: number, height: number, radius: number) => {
    const r = Math.min(radius, width / 2, height / 2);
    return `
      M ${x + r} ${y}
      L ${x + width - r} ${y}
      Q ${x + width} ${y} ${x + width} ${y + r}
      L ${x + width} ${y + height - r}
      Q ${x + width} ${y + height} ${x + width - r} ${y + height}
      L ${x + r} ${y + height}
      Q ${x} ${y + height} ${x} ${y + height - r}
      L ${x} ${y + r}
      Q ${x} ${y} ${x + r} ${y}
      Z
    `;
  };

  return (
    <TouchableWithoutFeedback onPress={handleContainerTouch}>
      <View style={styles.container}>
        {/* Información central */}
        <View style={styles.centerContent}>
          <Text style={styles.balanceAmount}>
            {formatCurrency(centerContent.value)}
          </Text>
          <Text 
            style={styles.balanceLabel}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {centerContent.label}
          </Text>
        </View>
        
        {/* Gráfico de barra */}
        <View style={styles.chartContainer}>
          {totalBalance === 0 || accounts.length === 0 ? (
            // Estado vacío: barra gris completa
            <View 
              style={[
                styles.emptyBar,
                { 
                  width, 
                  height,
                  borderRadius 
                }
              ]}
            />
          ) : (
            <TouchableWithoutFeedback onPress={handleBarTouch}>
              <Svg width={width} height={height}>
                <G>
                  {segments.map((segment, index) => (
                    <Path
                      key={`segment-${index}`}
                      d={createRoundedRectPath(
                        segment.startX,
                        0,
                        segment.width,
                        height,
                        borderRadius
                      )}
                      fill={getSegmentColor(index)}
                    />
                  ))}
                </G>
              </Svg>
            </TouchableWithoutFeedback>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  balanceAmount: {
    fontSize: 52,
    fontFamily: 'Geist_700Bold',
    color: '#09090b',
    textAlign: 'center',
  },
  balanceLabel: {
    fontSize: 22,
    fontFamily: 'Geist_500Medium',
    color: '#71717a',
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 300,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyBar: {
    backgroundColor: '#f4f4f5',
  },
});

export default AccountsBarChart;