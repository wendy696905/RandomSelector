# Random Selector - iOS App

A fun and interactive spinning wheel app for making random selections. Perfect for deciding who pays for dinner, what to eat, or any other group decisions!

## 🎯 Features

### Core Functionality
- **Spinning Wheel Animation**: Smooth, realistic spinning animation with physics-based deceleration
- **Custom Participants**: Add unlimited participants with custom names
- **Visual Feedback**: Colorful wheel segments with clear participant labels
- **Winner Selection**: Fair random selection with animated result presentation

### User Experience
- **Intuitive Setup**: Easy-to-use form for adding participants and customizing game titles
- **Quick Add Options**: Pre-built sample data (names and food options) for quick testing
- **Smart Input Validation**: Prevents multiple names in single input and handles duplicates gracefully
- **Responsive Design**: Optimized for various iOS screen sizes

### Game Management
- **Game State Persistence**: Maintains participant list when navigating between screens
- **Spin Again**: Quick re-spin with same participants
- **Edit Players**: Return to setup to modify participant list
- **New Game**: Complete reset to start fresh

## 🏗️ Technical Architecture

### Built With
- **React Native** with Expo CLI
- **React Native SVG** for wheel graphics
- **Expo Linear Gradient** for UI effects
- **Animated API** for smooth animations

### Project Structure
```
RandomSelector/
├── components/
│   ├── SpinnerScreen.js     # Main spinning wheel interface
│   ├── SetupForm.js         # Participant setup and game configuration
│   ├── ResultModal.js       # Winner announcement modal
│   └── Header.js            # Reusable header component
├── utils/
│   └── RandomGenerator.js   # Random selection and color generation logic
└── App.js                   # Main app navigation and state management
```

### Key Components

#### SpinnerScreen.js
- Renders SVG-based spinning wheel
- Handles spin animation with precise winner positioning
- Calculates segment angles and positions dynamically
- Provides visual feedback during spinning

#### SetupForm.js
- Participant management with add/remove functionality
- Input validation and duplicate handling
- Quick-add presets for testing
- Game title customization

#### ResultModal.js
- Animated winner announcement
- Options for "Spin Again" or "Edit Players"
- Confetti and celebration effects

#### RandomGenerator.js
- Fair random selection algorithm
- Color palette generation for wheel segments
- Utility functions for game logic

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Expo CLI installed globally
- iOS Simulator or physical iOS device with Expo Go app

### Installation

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd RandomSelector
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   expo start
   ```

4. **Run on iOS**
   - Press `i` to open in iOS Simulator
   - Or scan QR code with Expo Go app on your iOS device

### Required Dependencies
```json
{
  "expo": "~49.0.0",
  "expo-linear-gradient": "~12.3.0",
  "react": "18.2.0",
  "react-native": "0.72.6",
  "react-native-svg": "13.9.0"
}
```

## 🎮 How to Use

### Basic Usage
1. **Start the App**: Tap "Get Started" from the home screen
2. **Add Participants**: 
   - Enter participant names one at a time
   - Use "Add Sample Names" or "Add Food Options" for quick setup
   - Customize the game title (e.g., "Who Pays?", "What to Eat?")
3. **Start Spinning**: Tap "Start Spinning!" when you have 2+ participants
4. **Spin the Wheel**: Tap the "SPIN!" button to begin animation
5. **View Results**: Winner is announced in a celebration modal
6. **Continue Playing**: Choose "Spin Again" or "Edit Players"

### Advanced Features
- **Clear All**: Remove all participants at once
- **Duplicate Names**: App allows duplicates with confirmation
- **Navigation**: Use back buttons to return to previous screens
- **New Game**: Start completely fresh from any screen

## ⚙️ Configuration

### Customization Options
- **Wheel Size**: Adjusts automatically based on screen size
- **Animation Duration**: 3-second spin with realistic deceleration
- **Color Palette**: 12 predefined colors that cycle for large participant lists
- **Segment Text**: Automatically truncates long names with ellipsis

### Performance Settings
- **Native Driver**: All animations use native driver for smooth performance
- **Memory Management**: Efficient SVG rendering for large participant counts
- **State Management**: Optimized React state updates for responsive UI

## 🐛 Known Issues & Limitations

### Current Limitations
- Maximum recommended participants: 20 (for readability)
- Text truncation occurs after 8 characters in wheel segments
- iOS-focused design (Android compatibility not fully tested)

### Testing
- Manual testing on iOS Simulator
- Edge case handling (empty lists, single participant, etc.)
- Animation performance verification

## 📝 Version History

### v1.0.0 (Current)
- Initial release with core spinning wheel functionality
- Participant management system
- Animated winner selection
- Basic navigation and state management

---

**Built with ❤️ using React Native and Expo**

*Last updated: Aug. 16th, 2025*