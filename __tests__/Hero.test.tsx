import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Hero from '@/app/Hero';
import { fireEvent } from '@testing-library/react';

// Mock Next.js's Link and Image components
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

jest.mock('next/image', () => {
  const MockImage = ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  );
  MockImage.displayName = 'MockImage';
  return MockImage;
});

describe('Hero Component', () => {
  it('should render the hero component with the welcome message', () => {
    render(<Hero />);

    // Check if the heading is rendered
    expect(screen.getByText('Welcome to')).toBeInTheDocument();
    expect(screen.getByText('HelpingHand')).toBeInTheDocument();

    // Check if the description is rendered
    expect(screen.getByText(/Join our community of dedicated volunteers/)).toBeInTheDocument();
  });

  it('should render the "Get Started" link', () => {
    render(<Hero />);

    // Check if the "Get Started" link is rendered and has correct href
    const link = screen.getByRole('link', { name: 'Get Started' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/signin');
  });

  it('should start with the first image and cycle through images', () => {
    jest.useFakeTimers(); // Use fake timers for setInterval

    render(<Hero />);

    // Check if the first image is displayed
    expect(screen.getByAltText('carousel')).toHaveAttribute('src', '/images/vol1.jpg');

    // Fast forward 10 seconds to trigger the image change
    jest.advanceTimersByTime(10000);

    // Check if the second image is displayed
    expect(screen.getByAltText('carousel')).toHaveAttribute('src', '/images/vol2.jpg');

    // Fast forward another 10 seconds for the next image
    jest.advanceTimersByTime(10000);
    expect(screen.getByAltText('carousel')).toHaveAttribute('src', '/images/vol3.jpg');

    jest.useRealTimers(); // Restore the real timers
  });
});
