import { act, renderHook } from '@testing-library/react-hooks';
import { useFormStore } from '@/app/(auth)/signin/FormStore';

describe('useFormStore', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useFormStore());
    
    expect(result.current.email).toBe('');
    expect(result.current.password).toBe('');
    expect(result.current.error).toBe('');
  });

  it('should set email', () => {
    const { result } = renderHook(() => useFormStore());
    
    act(() => {
      result.current.setEmail('test@example.com');
    });

    expect(result.current.email).toBe('test@example.com');
  });

  it('should set password', () => {
    const { result } = renderHook(() => useFormStore());

    act(() => {
      result.current.setPassword('password123');
    });

    expect(result.current.password).toBe('password123');
  });

  it('should set error', () => {
    const { result } = renderHook(() => useFormStore());

    act(() => {
      result.current.setError('An error occurred');
    });

    expect(result.current.error).toBe('An error occurred');
  });

  it('should reset state', () => {
    const { result } = renderHook(() => useFormStore());

    act(() => {
      result.current.setEmail('test@example.com');
      result.current.setPassword('password123');
      result.current.setError('An error occurred');
    });

    expect(result.current.email).toBe('test@example.com');
    expect(result.current.password).toBe('password123');
    expect(result.current.error).toBe('An error occurred');

    act(() => {
      result.current.reset();
    });

    expect(result.current.email).toBe('');
    expect(result.current.password).toBe('');
    expect(result.current.error).toBe('');
  });
});
