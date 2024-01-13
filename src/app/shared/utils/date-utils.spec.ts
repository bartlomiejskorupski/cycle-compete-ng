import { formatTimer } from "./date-utils";

describe('date-utils', () => {

  describe('#formatTimer', () => {
    
    it('should return 00:00:00 if no time difference', () => {
      const from = new Date(2024, 0, 13, 12, 12, 12, 123);
      const to = new Date(2024, 0, 13, 12, 12, 12, 123);
      
      const formatted = formatTimer(from, to);

      expect(formatted).toEqual('00:00:00');
    });

    it('should throw error if difference is negative', () => {
      const from = new Date(2024, 0, 13, 10, 10, 10, 123);
      const to = new Date(2024, 0, 13, 9, 11, 10, 123);

      expect(() => formatTimer(from, to)).toThrow(new Error('Argument exception'));
    });

    it('should return 00:00:00 if 999 ms passed', () => {
      const from = new Date(2024, 0, 13, 10, 10, 10, 150);
      const to = new Date(2024, 0, 13, 10, 10, 11, 149);

      const formatted = formatTimer(from, to);

      expect(formatted).toEqual('00:00:00');
    });

    it('should return 00:00:28 if 28s passed', () => {
      const from = new Date(2024, 0, 13, 10, 10, 10, 150);
      const to = new Date(2024, 0, 13, 10, 10, 38, 150);

      const formatted = formatTimer(from, to);

      expect(formatted).toEqual('00:00:28');
    });

    
    it('should return 00:01:28 if 1m28s passed', () => {
      const from = new Date(2024, 0, 13, 10, 10, 10, 150);
      const to = new Date(2024, 0, 13, 10, 11, 38, 150);

      const formatted = formatTimer(from, to);

      expect(formatted).toEqual('00:01:28');
    });

    it('should return 00:00:59 if 59s 999ms passed', () => {
      const from = new Date(2024, 0, 13, 10, 10, 10, 150);
      const to = new Date(2024, 0, 13, 10, 11, 10, 149);

      const formatted = formatTimer(from, to);

      expect(formatted).toEqual('00:00:59');
    });

    it('should return 00:13:37 if that much passed', () => {
      const from = new Date(2024, 0, 13, 10, 10, 10, 150);
      const to = new Date(2024, 0, 13, 10, 23, 47, 150);

      const formatted = formatTimer(from, to);

      expect(formatted).toEqual('00:13:37');
    });

    it('should return 01:30:21 if that much passed', () => {
      const from = new Date(2024, 0, 13, 10, 45, 10, 150);
      const to = new Date(2024, 0, 13, 12, 15, 31, 150);

      const formatted = formatTimer(from, to);

      expect(formatted).toEqual('01:30:21');
    });

    it('should work when date changes', () => {
      const from = new Date(2024, 0, 13, 23, 50, 0, 150);
      const to = new Date(2024, 0, 14, 1, 12, 12, 150);

      const formatted = formatTimer(from, to);

      expect(formatted).toEqual('01:22:12');
    });

    it('should work after 20 hours', () => {
      const from = new Date(2024, 0, 13, 1, 30, 0, 150);
      const to = new Date(2024, 0, 13, 22, 44, 44, 150);

      const formatted = formatTimer(from, to);

      expect(formatted).toEqual('21:14:44');
    });

    it('should work after 24 hours', () => {
      const from = new Date(2024, 0, 13, 1, 30, 0, 150);
      const to = new Date(2024, 0, 14, 14, 44, 44, 150);

      const formatted = formatTimer(from, to);

      expect(formatted).toEqual('37:14:44');
    });

  });

});