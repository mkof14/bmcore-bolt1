import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useAsync } from '../useAsync';

describe('useAsync', () => {
  it('should handle successful async operation', async () => {
    const asyncFn = vi.fn().mockResolvedValue('success');
    const { result } = renderHook(() => useAsync(asyncFn, { immediate: false }));

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toBeNull();

    await act(async () => {
      await result.current.execute();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.data).toBe('success');
    expect(result.current.error).toBeNull();
  });

  it('should handle async operation errors', async () => {
    const error = new Error('Test error');
    const asyncFn = vi.fn().mockRejectedValue(error);
    const { result } = renderHook(() => useAsync(asyncFn, { immediate: false }));

    expect(result.current.loading).toBe(false);

    await act(async () => {
      await expect(result.current.execute()).rejects.toThrow('Test error');
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.error).toBe(error);
    expect(result.current.data).toBeNull();
  });

  it('should allow manual re-execution', async () => {
    const asyncFn = vi.fn().mockResolvedValue('success');
    const { result, rerender } = renderHook(
      ({ fn }) => useAsync(fn, { immediate: false }),
      { initialProps: { fn: asyncFn } }
    );

    await act(async () => {
      await result.current.execute();
    });
    expect(asyncFn).toHaveBeenCalledTimes(1);

    const nextFn = vi.fn().mockResolvedValue('next');
    rerender({ fn: nextFn });
    await act(async () => {
      await result.current.execute();
    });
    expect(nextFn).toHaveBeenCalledTimes(1);
  });
});
