import { cn } from '@/lib/utils'; // Adjust the import path if necessary

describe('cn utility function', () => {
  it('should return a single class name correctly', () => {
    const result = cn('bg-red-500');
    expect(result).toBe('bg-red-500');
  });

  it('should join multiple class names correctly', () => {
    const result = cn('bg-red-500', 'text-white');
    expect(result).toBe('bg-red-500 text-white');
  });

  it('should ignore falsey values (null, undefined, false)', () => {
    const result = cn('bg-red-500', false, null, undefined, 'text-white');
    expect(result).toBe('bg-red-500 text-white');
  });

  it('should merge conflicting Tailwind classes using twMerge', () => {
    const result = cn('bg-red-500', 'bg-green-500');
    expect(result).toBe('bg-green-500'); // twMerge should prefer the last value
  });

  it('should work with conditional classes', () => {
    const isActive = true;
    const result = cn('bg-red-500', isActive && 'text-white');
    expect(result).toBe('bg-red-500 text-white');
  });

  it('should handle empty inputs gracefully', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('should merge class names with different conditional truthy values', () => {
    const isActive = true;
    const result = cn('bg-red-500', isActive && 'text-white', null);
    expect(result).toBe('bg-red-500 text-white');
  });
});
