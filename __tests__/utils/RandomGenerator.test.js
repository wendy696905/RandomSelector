import { RandomGenerator } from '../../utils/RandomGenerator';

describe('RandomGenerator', () => {
  describe('selectRandom', () => {
    test('should return null for empty array', () => {
      expect(RandomGenerator.selectRandom([])).toBeNull();
      expect(RandomGenerator.selectRandom(null)).toBeNull();
    });

    test('should return the only item for single-item array', () => {
      const items = ['only-item'];
      const result = RandomGenerator.selectRandom(items);
      
      expect(result).toEqual({
        item: 'only-item',
        index: 0
      });
    });

    test('should return valid result for multiple items', () => {
      const items = ['item1', 'item2', 'item3'];
      const result = RandomGenerator.selectRandom(items);
      
      expect(result).toHaveProperty('item');
      expect(result).toHaveProperty('index');
      expect(items).toContain(result.item);
      expect(result.index).toBeGreaterThanOrEqual(0);
      expect(result.index).toBeLessThan(items.length);
    });
  });

  describe('generateColors', () => {
    test('should generate correct number of colors', () => {
      const colors = RandomGenerator.generateColors(5);
      expect(colors).toHaveLength(5);
    });

    test('should cycle through colors for large counts', () => {
      const colors = RandomGenerator.generateColors(15);
      expect(colors).toHaveLength(15);
      // Should repeat colors after running out
      expect(colors[0]).toBe(colors[12]); // 12 base colors, so index 0 = index 12
    });
  });
});