import { act, renderHook } from '@testing-library/react-hooks';
import { useFormStore } from '@/app/(auth)/signup/FormStore';

describe('useFormStore', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useFormStore());

    expect(result.current.step).toBe(1);
    expect(result.current.code).toEqual(['', '', '', '', '']);
    expect(result.current.email).toBe('');
    expect(result.current.password).toBe('');
    expect(result.current.firstName).toBe('');
    expect(result.current.lastName).toBe('');
  });

  it('should set step', () => {
    const { result } = renderHook(() => useFormStore());

    act(() => {
      result.current.setStep(2);
    });

    expect(result.current.step).toBe(2);
  });

  it('should set code', () => {
    const { result } = renderHook(() => useFormStore());

    act(() => {
      result.current.setCode(['1', '2', '3', '4', '5']);
    });

    expect(result.current.code).toEqual(['1', '2', '3', '4', '5']);
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

  it('should set firstName', () => {
    const { result } = renderHook(() => useFormStore());

    act(() => {
      result.current.setFirstName('John');
    });

    expect(result.current.firstName).toBe('John');
  });

  it('should set lastName', () => {
    const { result } = renderHook(() => useFormStore());

    act(() => {
      result.current.setLastName('Doe');
    });

    expect(result.current.lastName).toBe('Doe');
  });

  it('should reset state', () => {
    const { result } = renderHook(() => useFormStore());

    act(() => {
      result.current.setStep(2);
      result.current.setCode(['1', '2', '3', '4', '5']);
      result.current.setEmail('test@example.com');
      result.current.setPassword('password123');
      result.current.setFirstName('John');
      result.current.setLastName('Doe');
    });

    expect(result.current.step).toBe(2);
    expect(result.current.code).toEqual(['1', '2', '3', '4', '5']);
    expect(result.current.email).toBe('test@example.com');
    expect(result.current.password).toBe('password123');
    expect(result.current.firstName).toBe('John');
    expect(result.current.lastName).toBe('Doe');

    act(() => {
      result.current.reset();
    });

    expect(result.current.step).toBe(1);
    expect(result.current.code).toEqual(['', '', '', '', '']);
    expect(result.current.email).toBe('');
    expect(result.current.password).toBe('');
    expect(result.current.firstName).toBe('');
    expect(result.current.lastName).toBe('');
  });
});
