import React from 'react';
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom'; // for the matchers like 'toBeInTheDocument'
import SignIn from "@/app/(auth)/signin/page";

// Mock the SignInForm and ImageSlide components since we are focusing on SignIn
jest.mock('@/app/(auth)/signin/SignInForm', () => {
  const MockSignInForm = () => <div>SignInForm Component</div>;
  MockSignInForm.displayName = 'MockSignInForm';
  return MockSignInForm;
});
jest.mock('@/components/imageslide', () => {
  const MockImageSlide = () => <div>ImageSlide Component</div>;
  MockImageSlide.displayName = 'MockImageSlide';
  return MockImageSlide;
});

// Mocking next/router since we aren't testing routing here
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(), // mock implementation of router.push
  }),
}));

describe('SignIn Page', () => {
  // Test if the SignIn page renders properly
  it('should render the SignIn page with the form and image slide', () => {
    // Render the SignIn component
    render(<SignIn />);

    // Check if the SignInForm component is rendered
    expect(screen.getByText('SignInForm Component')).toBeInTheDocument();

    // Check if the ImageSlide component is rendered
    expect(screen.getByText('ImageSlide Component')).toBeInTheDocument();
  });

  // You can add more tests later for the session logic and router behavior once the effect is uncommented
});
