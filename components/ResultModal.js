import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const ResultModal = ({ visible, winner, onClose, onPlayAgain }) => {
  const scaleValue = new Animated.Value(0);

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scaleValue, {
        toValue: 1,
        tension: 50,
        friction: 5,
        useNativeDriver: true,
      }).start();
    } else {
      scaleValue.setValue(0);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View 
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: scaleValue }]
            }
          ]}
        >
          <LinearGradient
            colors={['#FFD700', '#FFA500']}
            style={styles.modalContent}
          >
            <View style={styles.confettiContainer}>
              <Text style={styles.confetti}>🎉</Text>
              <Text style={styles.confetti}>🎊</Text>
              <Text style={styles.confetti}>✨</Text>
            </View>

            <Text style={styles.winnerEmoji}>🏆</Text>
            <Text style={styles.winnerTitle}>Winner!</Text>
            
            <View style={styles.winnerNameContainer}>
              <Text style={styles.winnerName}>{winner?.name}</Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.playAgainButton]} 
                onPress={onPlayAgain}
              >
                <Text style={styles.playAgainText}>🎯 Spin Again</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, styles.closeButton]} 
                onPress={onClose}
              >
                <Text style={styles.closeText}>✏️ Edit Players</Text>
              </TouchableOpacity>
            </View>

            {/* FIXED: Help text to explain button differences */}
            <Text style={styles.helpText}>
              Spin Again: Another round with same players{'\n'}
              Edit Players: Change participants
            </Text>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    margin: 20,
    borderRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
  },
  modalContent: {
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 300,
  },
  confettiContainer: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  confetti: {
    fontSize: 24,
  },
  winnerEmoji: {
    fontSize: 80,
    marginBottom: 15,
    marginTop: 20,
  },
  winnerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 15,
  },
  winnerNameContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 15,
    marginBottom: 25,
    minWidth: 200,
    alignItems: 'center',
  },
  winnerName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#8B4513',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 110,
    alignItems: 'center',
  },
  playAgainButton: {
    backgroundColor: '#4CAF50',
  },
  closeButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  playAgainText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  closeText: {
    color: '#8B4513',
    fontSize: 14,
    fontWeight: 'bold',
  },
  helpText: {
    fontSize: 11,
    color: '#8B4513',
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 16,
  },
});