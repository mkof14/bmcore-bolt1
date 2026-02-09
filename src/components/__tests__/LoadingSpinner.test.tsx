import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSpinner, { LoadingPage } from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('should render spinner with default size', () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should render spinner with custom size', () => {
    const { container } = render(<LoadingSpinner size="lg" />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should render with custom className', () => {
    const { container } = render(<LoadingSpinner className="text-red-600" />);
    const wrapper = container.querySelector('.text-red-600');
    expect(wrapper).toBeInTheDocument();
  });
});

describe('LoadingPage', () => {
  it('should render loading page with default text', () => {
    render(<LoadingPage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render loading page with custom text', () => {
    render(<LoadingPage text="Please wait..." />);
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

  it('should contain spinner', () => {
    const { container } = render(<LoadingPage />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});
