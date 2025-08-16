import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const SetupForm = ({ onStartSpinner, onBack, existingGameData }) => {
  const [participants, setParticipants] = useState([]);
  const [inputText, setInputText] = useState('');
  const [title, setTitle] = useState('Who Pays?');

  // Load existing data when component mounts
  useEffect(() => {
    if (existingGameData) {
      setParticipants(existingGameData.participants || []);
      setTitle(existingGameData.title || 'Who Pays?');
    }
  }, [existingGameData]);

  // Input validation function
  const validateInput = (text) => {
    const hasMultipleWords = text.includes(',') || 
                            text.includes(';') || 
                            text.includes('|') ||
                            text.trim().split(/\s+/).length > 3;

    if (hasMultipleWords) {
      Alert.alert(
        'One Name at a Time',
        'Please enter only one participant name at a time. Use the Add button for each person.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const addParticipant = () => {
    const trimmedText = inputText.trim();
    
    if (!trimmedText) {
      Alert.alert('Empty Name', 'Please enter a participant name.');
      return;
    }

    // Validate input for multiple names
    if (!validateInput(trimmedText)) {
      return;
    }

    // Only show warning for duplicates, but still allow them
    if (participants.some(p => p.name.toLowerCase() === trimmedText.toLowerCase())) {
      Alert.alert(
        'Duplicate Name', 
        'This participant already exists, but I\'ll add it anyway!',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Add Anyway',
            onPress: () => {
              const newParticipant = {
                id: Date.now().toString() + Math.random(),
                name: trimmedText,
              };
              setParticipants([...participants, newParticipant]);
              setInputText('');
            }
          }
        ]
      );
      return;
    }

    // Add participant normally
    const newParticipant = {
      id: Date.now().toString() + Math.random(),
      name: trimmedText,
    };
    setParticipants([...participants, newParticipant]);
    setInputText('');
  };

  const removeParticipant = (id) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  // FIXED: Add function to clear all participants
  const clearAllParticipants = () => {
    if (participants.length === 0) {
      Alert.alert('No Participants', 'There are no participants to clear.');
      return;
    }

    Alert.alert(
      'Clear All Participants',
      `Are you sure you want to remove all ${participants.length} participants?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            setParticipants([]);
          }
        }
      ]
    );
  };

  const startSpinner = () => {
    if (participants.length < 2) {
      Alert.alert('Need More Options', 'Please add at least 2 participants.');
      return;
    }
    onStartSpinner({ participants, title });
  };

  const addQuickOptions = (options) => {
    const newParticipants = options.map(name => ({
      id: Date.now() + Math.random(),
      name,
    }));
    setParticipants([...participants, ...newParticipants]);
  };

  const renderParticipant = ({ item, index }) => (
    <View style={styles.participantItem}>
      <View style={[styles.participantColor, { backgroundColor: getParticipantColor(index) }]} />
      <Text style={styles.participantName}>{item.name}</Text>
      <TouchableOpacity
        onPress={() => removeParticipant(item.id)}
        style={styles.removeButton}
      >
        <Text style={styles.removeButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  const getParticipantColor = (index) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
    return colors[index % colors.length];
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Setup Game</Text>
        <View style={styles.placeholder} />
      </View>
      
      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Title Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Game Title</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="e.g., 'Who Pays?', 'What to Eat?'"
            value={title}
            onChangeText={setTitle}
            maxLength={30}
          />
        </View>

        {/* Add Participant */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Participants</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter one name at a time"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={addParticipant}
              maxLength={20}
            />
            <TouchableOpacity 
              style={[styles.addButton, !inputText.trim() && styles.disabledButton]} 
              onPress={addParticipant}
              disabled={!inputText.trim()}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Add Options */}
        <View style={styles.quickAddContainer}>
          <TouchableOpacity 
            style={styles.quickAddButton}
            onPress={() => addQuickOptions(['Alice', 'Bob', 'Charlie', 'Diana'])}
          >
            <Text style={styles.quickAddText}>+ Add Sample Names</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickAddButton}
            onPress={() => addQuickOptions(['Pizza', 'Burger', 'Sushi', 'Tacos'])}
          >
            <Text style={styles.quickAddText}>+ Add Food Options</Text>
          </TouchableOpacity>
        </View>

        {/* Participants List */}
        <View style={styles.listContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Participants ({participants.length})
            </Text>
            {/* FIXED: Move Clear All button next to Participants count */}
            <TouchableOpacity 
              style={[styles.clearAllButton, participants.length === 0 && styles.disabledClearButton]} 
              onPress={clearAllParticipants}
              disabled={participants.length === 0}
            >
              <Text style={[styles.clearAllText, participants.length === 0 && styles.disabledClearText]}>
                🗑️ Clear All
              </Text>
            </TouchableOpacity>
          </View>
          {participants.length > 0 ? (
            <FlatList
              data={participants}
              renderItem={renderParticipant}
              keyExtractor={item => item.id}
              style={styles.list}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No participants yet</Text>
              <Text style={styles.emptySubtext}>Add at least 2 to start spinning!</Text>
            </View>
          )}
        </View>

        {/* Start Button */}
        <TouchableOpacity
          style={[styles.startButton, participants.length < 2 && styles.disabledStartButton]}
          onPress={startSpinner}
          disabled={participants.length < 2}
        >
          <LinearGradient
            colors={participants.length >= 2 ? ['#4CAF50', '#45A049'] : ['#ccc', '#999']}
            style={styles.startButtonGradient}
          >
            <Text style={styles.startButtonText}>
              {participants.length < 2 ? 'Need 2+ Participants' : 'Start Spinning! 🎯'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
  placeholder: {
    width: 50,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  // FIXED: Add styles for section header with Clear All button
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  clearAllButton: {
    backgroundColor: '#FFE4E1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  disabledClearButton: {
    backgroundColor: '#F5F5F5',
    borderColor: '#CCC',
  },
  clearAllText: {
    color: '#FF6B6B',
    fontSize: 12,
    fontWeight: '600',
  },
  disabledClearText: {
    color: '#999',
  },
  titleInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  quickAddContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  quickAddButton: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  quickAddText: {
    color: '#1976D2',
    fontSize: 12,
    fontWeight: '600',
  },
  listContainer: {
    flex: 1,
    marginBottom: 20,
  },
  list: {
    flex: 1,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 8,
    borderRadius: 12,
  },
  participantColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
  },
  participantName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  removeButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  startButton: {
    borderRadius: 15,
  },
  disabledStartButton: {
    opacity: 0.6,
  },
  startButtonGradient: {
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});