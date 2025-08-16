import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  SafeAreaView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Text as SvgText, Circle } from 'react-native-svg';
import { RandomGenerator } from '../utils/RandomGenerator';

const { width: screenWidth } = Dimensions.get('window');
const wheelSize = Math.min(screenWidth * 0.8, 300);
const radius = wheelSize / 2 - 10;

export const SpinnerScreen = ({ gameData, onSpinComplete, onBack, onReset }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;
  const [cumulativeRotation, setCumulativeRotation] = useState(0);

  const handleSpin = () => {
    if (isSpinning || !gameData?.participants?.length) return;

    setIsSpinning(true);
    
    // Select random winner
    const result = RandomGenerator.selectRandom(gameData.participants);
    console.log('Selected winner:', result.item.name, 'at index:', result.index);
    
    const numParticipants = gameData.participants.length;
    const anglePerSegment = 360 / numParticipants;
    
    // Calculate where the selected segment is CURRENTLY positioned
    const initialSegmentCenter = result.index * anglePerSegment + anglePerSegment / 2;
    const currentSegmentPosition = (initialSegmentCenter + cumulativeRotation) % 360;
    
    // Calculate rotation needed to bring segment to 0° (top)
    let rotationNeeded = -currentSegmentPosition;
    
    // Always rotate clockwise (positive direction)
    // If the rotation would be counter-clockwise (negative), add 360° to make it clockwise
    if (rotationNeeded < 0) {
      rotationNeeded += 360;
    }

    // Add at least three full clockwise rotations for visual effect
    const minExtraRotation = 360 * 3; // At least three full spins
    const extraSpins = 3 + Math.floor(Math.random() * 7);
    const extraRotation = extraSpins * 360;
    
    const totalRotation = extraRotation + rotationNeeded;
    const finalCumulativeRotation = cumulativeRotation + totalRotation;
    
    console.log('Clockwise rotation calculation:', {
      winnerIndex: result.index,
      winnerName: result.item.name,
      initialSegmentCenter: initialSegmentCenter,
      currentCumulativeRotation: cumulativeRotation,
      currentSegmentPosition: currentSegmentPosition,
      baseRotationNeeded: -currentSegmentPosition, // Original calculation
      clockwiseRotationNeeded: rotationNeeded, // Adjusted to be clockwise
      extraSpins: extraSpins,
      totalRotation: totalRotation,
      finalRotation: finalCumulativeRotation,
      explanation: `Always rotating CLOCKWISE: ${totalRotation.toFixed(1)}° (${extraSpins.toFixed(1)} spins + ${rotationNeeded}° to target)`
    });

    // Animate from current cumulative rotation to final
    spinValue.setValue(cumulativeRotation);

    Animated.timing(spinValue, {
      toValue: finalCumulativeRotation,
      duration: 3000, // Longer duration for multiple spins
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        console.log('Animation finished - Winner should be:', result.item.name);
        
        setCumulativeRotation(finalCumulativeRotation);
        setIsSpinning(false);
        
        setTimeout(() => {
          onSpinComplete(result.item);
        }, 800);
      }
    });
  };

  // Animation style with extended range for large rotations
  const animatedStyle = {
    transform: [
      {
        rotate: spinValue.interpolate({
          inputRange: [0, 3600],
          outputRange: ['0deg', '3600deg'],
          extrapolate: 'extend',
        }),
      },
    ],
  };

  // Generate segments with colors
  const segments = gameData.participants.map((participant, index) => {
    const angle = 360 / gameData.participants.length;
    const startAngle = index * angle;
    const colors = RandomGenerator.generateColors(gameData.participants.length);
    
    return {
      ...participant,
      startAngle,
      endAngle: startAngle + angle,
      color: colors[index],
      index,
    };
  });

  // FIXED: Remove debug info completely (no longer shown in production or development)

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{gameData.title}</Text>
        <TouchableOpacity style={styles.resetButton} onPress={onReset}>
          <Text style={styles.resetButtonText}>New Game</Text>
        </TouchableOpacity>
      </View>

      {/* Wheel Container */}
      <View style={styles.wheelContainer}>
        {/* Wheel Shadow */}
        <View style={styles.wheelShadow} />
        
        {/* Animated Wheel */}
        <Animated.View style={[styles.wheel, animatedStyle]}>
          <Svg width={wheelSize} height={wheelSize}>
            {segments.map((segment, index) => (
              <WheelSegment
                key={`${segment.id}-${index}`}
                segment={segment}
                radius={radius}
                centerX={wheelSize / 2}
                centerY={wheelSize / 2}
              />
            ))}
            
            {/* Center circle */}
            <Circle
              cx={wheelSize / 2}
              cy={wheelSize / 2}
              r={25}
              fill="white"
              stroke="#333"
              strokeWidth={3}
            />
            
            {/* Center dot */}
            <Circle
              cx={wheelSize / 2}
              cy={wheelSize / 2}
              r={8}
              fill="#333"
            />
          </Svg>
        </Animated.View>

        {/* Pointer at top */}
        <View style={styles.pointer}>
          <View style={styles.pointerTriangle} />
          <View style={styles.pointerCircle} />
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.spinButton, isSpinning && styles.disabledButton]}
          onPress={handleSpin}
          disabled={isSpinning}
        >
          <LinearGradient
            colors={isSpinning ? ['#ccc', '#999'] : ['#FF6B6B', '#FF5252']}
            style={styles.spinButtonGradient}
          >
            <Text style={styles.spinButtonText}>
              {isSpinning ? 'SPINNING...' : 'SPIN!'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.participantCount}>
          {gameData?.participants?.length || 0} participants
        </Text>
        
        {isSpinning && (
          <Text style={styles.spinningStatus}>🎯 Finding the winner...</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

// Wheel segment component with proper coordinate system
const WheelSegment = ({ segment, radius, centerX, centerY }) => {
  const { startAngle, endAngle, color, name, index } = segment;
  
  // Convert to radians for drawing
  // We need to subtract 90° to make 0° point to the top instead of right
  const startRad = (startAngle - 90) * (Math.PI / 180);
  const endRad = (endAngle - 90) * (Math.PI / 180);
  
  // Calculate arc points
  const x1 = centerX + radius * Math.cos(startRad);
  const y1 = centerY + radius * Math.sin(startRad);
  const x2 = centerX + radius * Math.cos(endRad);
  const y2 = centerY + radius * Math.sin(endRad);
  
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
  
  const pathData = `
    M ${centerX} ${centerY}
    L ${x1} ${y1}
    A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
    Z
  `;

  // Text positioning (also needs the -90° offset)
  const midAngle = (startAngle + endAngle) / 2;
  const textRadius = radius * 0.7;
  const textX = centerX + textRadius * Math.cos((midAngle - 90) * (Math.PI / 180));
  const textY = centerY + textRadius * Math.sin((midAngle - 90) * (Math.PI / 180));

  // Better text display
  const displayName = name.length > 8 ? name.substring(0, 8) + '...' : name;

  return (
    <>
      <Path
        d={pathData}
        fill={color}
        stroke="white"
        strokeWidth={2}
      />
      <SvgText
        x={textX}
        y={textY}
        textAnchor="middle"
        fontSize="12"
        fontWeight="bold"
        fill="white"
        transform={`rotate(${midAngle} ${textX} ${textY})`}
      >
        {displayName}
      </SvgText>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: Platform.OS === 'ios' ? 10 : 15, // FIXED: Less top padding since SafeAreaView handles status bar
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  resetButton: {
    padding: 5,
  },
  resetButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  wheelContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  wheelShadow: {
    position: 'absolute',
    width: wheelSize + 10,
    height: wheelSize + 10,
    borderRadius: (wheelSize + 10) / 2,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  wheel: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointer: {
    position: 'absolute',
    top: '50%',
    marginTop: -(wheelSize / 2) - 20,
    alignItems: 'center',
    zIndex: 10,
  },
  pointerTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderBottomWidth: 30,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FF0000',
  },
  pointerCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF0000',
    marginTop: -4,
    borderWidth: 3,
    borderColor: 'white',
  },
  controlsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  spinButton: {
    borderRadius: 35,
    marginBottom: 15,
  },
  spinButtonGradient: {
    paddingHorizontal: 50,
    paddingVertical: 20,
    borderRadius: 35,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  spinButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  participantCount: {
    color: '#666',
    fontSize: 14,
    marginBottom: 5,
  },
  spinningStatus: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
});