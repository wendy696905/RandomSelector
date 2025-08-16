export class RandomGenerator {
  static selectRandom(array) {
    if (!array || array.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * array.length);
    return {
      item: array[randomIndex],
      index: randomIndex
    };
  }

  static generateColors(count) {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
      '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
      '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
    ];
    
    return Array.from({length: count}, (_, i) => colors[i % colors.length]);
  }
}