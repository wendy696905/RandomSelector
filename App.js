import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SetupForm } from './components/SetupForm';
import { SpinnerScreen } from './components/SpinnerScreen';
import { ResultModal } from './components/ResultModal';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [gameData, setGameData] = useState(null);
  const [winner, setWinner] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const startSetup = () => {
    setCurrentScreen('setup');
  };

  const handleStartSpinner = (data) => {
    setGameData(data);
    setCurrentScreen('spinner');
  };

  const handleSpinComplete = (winnerData) => {
    setWinner(winnerData);
    setShowResult(true);
  };

  const resetGame = () => {
    setCurrentScreen('home');
    setGameData(null);
    setWinner(null);
    setShowResult(false);
  };

  // FIXED: Make back button work from all screens
  const goBack = () => {
    if (currentScreen === 'setup') {
      setCurrentScreen('home');
      // Clear game data when going back to home
      setGameData(null);
    } else if (currentScreen === 'spinner') {
      setCurrentScreen('setup');
      // Keep game data when going back to setup
    }
  };

  const handleSpinAgain = () => {
    setShowResult(false);
    setWinner(null);
    // Stay on spinner screen for another spin
  };

  const handleDone = () => {
    setShowResult(false);
    setWinner(null);
    // Go back to setup screen but preserve existing game data
    setCurrentScreen('setup');
  };

  const renderHomeScreen = () => (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.homeContainer}
    >
      <View style={styles.homeContent}>
        <Text style={styles.homeEmoji}>🎯</Text>
        <Text style={styles.homeTitle}>Random Selector</Text>
        <Text style={styles.homeSubtitle}>
          Create spinning wheels to make random selections!
        </Text>
        
        <TouchableOpacity style={styles.homeButton} onPress={startSetup}>
          <Text style={styles.homeButtonText}>Get Started</Text>
        </TouchableOpacity>
        
        <View style={styles.exampleContainer}>
          <Text style={styles.exampleTitle}>Perfect for:</Text>
          <Text style={styles.exampleText}>• Who pays for dinner?</Text>
          <Text style={styles.exampleText}>• What to eat tonight?</Text>
          <Text style={styles.exampleText}>• Which movie to watch?</Text>
          <Text style={styles.exampleText}>• Random team assignments</Text>
        </View>
      </View>
    </LinearGradient>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {currentScreen === 'home' && renderHomeScreen()}
      {currentScreen === 'setup' && (
        <SetupForm 
          onStartSpinner={handleStartSpinner} 
          onBack={goBack}
          existingGameData={gameData}
        />
      )}
      {currentScreen === 'spinner' && gameData && (
        <SpinnerScreen
          gameData={gameData}
          onSpinComplete={handleSpinComplete}
          onBack={goBack}
          onReset={resetGame}
        />
      )}
      
      <ResultModal
        visible={showResult}
        winner={winner}
        onClose={handleDone}
        onPlayAgain={handleSpinAgain}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  homeContainer: {
    flex: 1,
  },
  homeContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  homeEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  homeTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  homeSubtitle: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.9,
    paddingHorizontal: 20,
  },
  homeButton: {
    backgroundColor: 'white',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    marginBottom: 40,
  },
  homeButtonText: {
    color: '#667eea',
    fontSize: 18,
    fontWeight: 'bold',
  },
  exampleContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  exampleTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  exampleText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 5,
    opacity: 0.9,
  },
});