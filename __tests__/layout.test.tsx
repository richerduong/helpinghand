import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RootLayout from '@/app/layout';

// Mock components used in the layout
jest.mock('@/components/Navbar', () => {
  const MockNavbar = () => <nav>Mock Navbar</nav>;
  MockNavbar.displayName = 'MockNavbar';
  return MockNavbar;
});
jest.mock('@/components/Footer', () => {
  const MockFooter = () => <footer>Mock Footer</footer>;
  MockFooter.displayName = 'MockFooter';
  return MockFooter;
});
jest.mock('@/components/auth/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock Next.js font
jest.mock('next/font/google', () => ({
  Hanken_Grotesk: () => ({
    className: 'mock-hanken-grotesk',
  }),
}));

describe('RootLayout Component', () => {
  it('should render the RootLayout with Navbar, Footer, and children', () => {
    render(
      <RootLayout>
        <div>Test Child Content</div>
      </RootLayout>
    );

    // Check if Navbar is rendered
    expect(screen.getByText('Mock Navbar')).toBeInTheDocument();

    // Check if Footer is rendered
    expect(screen.getByText('Mock Footer')).toBeInTheDocument();

    // Check if the children content is rendered
    expect(screen.getByText('Test Child Content')).toBeInTheDocument();
  });

  it('should apply the Hanken Grotesk font class to the body element', () => {
    const { container } = render(
      <RootLayout>
        <div>Test Child Content</div>
      </RootLayout>
    );

    // Check if the body element has the correct font class
    expect(container.querySelector('body')).toHaveClass('mock-hanken-grotesk');
  });
});
