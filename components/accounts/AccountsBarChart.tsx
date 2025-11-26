import React, { useState } from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { G, Path, Svg } from 'react-native-svg';
import { Account } from '../../core/types/transactions';

interface AccountsBarChartProps {
  accounts: Account[];
  width?: number;
  height?: number;
}

type SelectedAccount = 'none' | number;

const AccountsBarChart: React.FC<AccountsBarChartProps> = ({ 
  accounts, 
  width = 350,
  height = 40
}) => {
  const [selectedAccount, setSelectedAccount] = useState<SelectedAccount>('none');
  
  const totalBalance = accounts.reduce((sum, account) => {
    return sum + Math.max(0, account.currentBalance);
  }, 0);
  
  const gapWidth = 8;
  const borderRadius = 50;
  const minSegmentWidth = 20;
  
  const calculateSegments = () => {
    if (totalBalance === 0 || accounts.length === 0) return [];
    
    const totalGaps = gapWidth * (accounts.length - 1);
    const availableWidth = width - totalGaps;
    
    const proportionalWidths = accounts.map(account => {
      if (account.currentBalance <= 0) {
        return minSegmentWidth;
      }
      return (account.currentBalance / totalBalance) * availableWidth;
    });
    
    const negativeCount = accounts.filter(acc => acc.currentBalance <= 0).length;
    const spaceUsedByNegative = negativeCount * minSegmentWidth;
    
    const isSmall = proportionalWidths.map((w, i) => 
      accounts[i].currentBalance > 0 && w < minSegmentWidth
    );
    const smallPositiveCount = isSmall.filter(Boolean).length;
    
    if (smallPositiveCount === 0 && negativeCount === 0) {
      let currentX = 0;
      return accounts.map((account, index) => {
        const segmentWidth = proportionalWidths[index];
        const startX = currentX;
        const endX = currentX + segmentWidth;
        
        currentX = endX + gapWidth;
        
        return {
          account,
          startX,
          endX,
          width: segmentWidth,
          index
        };
      });
    }
    
    const spaceUsedBySmall = (smallPositiveCount + negativeCount) * minSegmentWidth;
    const spaceForLarge = availableWidth - spaceUsedBySmall;
    
    const largeBalance = accounts.reduce((sum, account, i) => {
      if (account.currentBalance <= 0 || isSmall[i]) {
        return sum;
      }
      return sum + account.currentBalance;
    }, 0);
    
    const finalWidths = accounts.map((account, i) => {
      if (account.currentBalance <= 0 || isSmall[i]) {
        return minSegmentWidth;
      } else {
        return (account.currentBalance / largeBalance) * spaceForLarge;
      }
    });
    
    let currentX = 0;
    return accounts.map((account, index) => {
      const segmentWidth = finalWidths[index];
      const startX = currentX;
      const endX = currentX + segmentWidth;
      
      currentX = endX + gapWidth;
      
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
    const account = accounts[index];
    
    if (selectedAccount === 'none') {
      return account.iconColor || '#71717a';
    }
    
    if (selectedAccount === index) {
      return account.iconColor || '#71717a';
    }
    
    return '#e4e4e7';
  };
  
  const getCenterContent = () => {
    if (accounts.length === 0) {
      return { value: 0, label: 'No accounts yet' };
    }
    
    if (selectedAccount !== 'none') {
      const account = accounts[selectedAccount];
      return { 
        value: account.currentBalance, 
        label: account.name 
      };
    }
    
    const realTotalBalance = accounts.reduce((sum, account) => sum + account.currentBalance, 0);
    return { value: realTotalBalance, label: 'Total balance' };
  };
  
  const centerContent = getCenterContent();
  
  const formatCurrency = (amount: number) => {
    const absAmount = Math.abs(amount);
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(absAmount);
    
    return amount < 0 ? `-${formatted}` : formatted;
  };

  const createRoundedRectPath = (x: number, y: number, width: number, height: number, radius: number, isFirst: boolean, isLast: boolean) => {
    const r = height / 2;
    const rMiddle = 5;
    
    if (isFirst && isLast) {
      return `
        M ${x + r} ${y}
        L ${x + width - r} ${y}
        Q ${x + width} ${y} ${x + width} ${y + r}
        Q ${x + width} ${y + height} ${x + width - r} ${y + height}
        L ${x + r} ${y + height}
        Q ${x} ${y + height} ${x} ${y + height - r}
        Q ${x} ${y} ${x + r} ${y}
        Z
      `;
    } else if (isFirst) {
      return `
        M ${x + r} ${y}
        L ${x + width - rMiddle} ${y}
        Q ${x + width} ${y} ${x + width} ${y + rMiddle}
        L ${x + width} ${y + height - rMiddle}
        Q ${x + width} ${y + height} ${x + width - rMiddle} ${y + height}
        L ${x + r} ${y + height}
        Q ${x} ${y + height} ${x} ${y + height - r}
        Q ${x} ${y} ${x + r} ${y}
        Z
      `;
    } else if (isLast) {
      return `
        M ${x + rMiddle} ${y}
        L ${x + width - r} ${y}
        Q ${x + width} ${y} ${x + width} ${y + r}
        Q ${x + width} ${y + height} ${x + width - r} ${y + height}
        L ${x + rMiddle} ${y + height}
        Q ${x} ${y + height} ${x} ${y + height - rMiddle}
        L ${x} ${y + rMiddle}
        Q ${x} ${y} ${x + rMiddle} ${y}
        Z
      `;
    } else {
      return `
        M ${x + rMiddle} ${y}
        L ${x + width - rMiddle} ${y}
        Q ${x + width} ${y} ${x + width} ${y + rMiddle}
        L ${x + width} ${y + height - rMiddle}
        Q ${x + width} ${y + height} ${x + width - rMiddle} ${y + height}
        L ${x + rMiddle} ${y + height}
        Q ${x} ${y + height} ${x} ${y + height - rMiddle}
        L ${x} ${y + rMiddle}
        Q ${x} ${y} ${x + rMiddle} ${y}
        Z
      `;
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleContainerTouch}>
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={[
            styles.balanceAmount,
            centerContent.value < 0 && styles.negativeAmount
          ]}>
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
        
        <View style={styles.chartContainer}>
          {accounts.length === 0 ? (
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
                        borderRadius,
                        index === 0,
                        index === segments.length - 1
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
  negativeAmount: {
    color: '#ef4444',
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