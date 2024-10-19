import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import SideNav from "@/app/volunteer/components/SideNav";
import '@testing-library/jest-dom';

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

describe("SideNav", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (usePathname as jest.Mock).mockReturnValue("/volunteer/home");
  });

  it("renders user profile and links", () => {
    render(<SideNav />);

    expect(screen.getByText("Person Name")).toBeInTheDocument();
    expect(screen.getByText("person@example.com")).toBeInTheDocument();

    // Open the dropdown first before checking for these links
    const dropdownButton = screen.getByRole("button", { name: /Person Name/i });
    fireEvent.click(dropdownButton); // Open the dropdown

    expect(screen.getByText("Manage Account")).toBeInTheDocument();
    expect(screen.getByText("Switch to Admin View")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Notifications")).toBeInTheDocument();
    expect(screen.getByText("Events")).toBeInTheDocument();
  });

  it("toggles the dropdown menu on button click", () => {
    render(<SideNav />);

    const dropdownButton = screen.getByRole("button", { name: /Person Name/i });
    
    // Initially, dropdown should be closed
    expect(screen.queryByText("Manage Account")).not.toBeInTheDocument();

    // Open dropdown
    fireEvent.click(dropdownButton);
    expect(screen.getByText("Manage Account")).toBeInTheDocument();

    // Close dropdown
    fireEvent.click(dropdownButton);
    expect(screen.queryByText("Manage Account")).not.toBeInTheDocument();
  });

  it("navigates to the profile on logout", () => {
    render(<SideNav />);

    const dropdownButton = screen.getByRole("button", { name: /Person Name/i });
    fireEvent.click(dropdownButton); // Open the dropdown
    fireEvent.click(screen.getByText("Logout"));

    expect(mockPush).toHaveBeenCalledWith("/signin");
  });

  it("highlights the active link", () => {
    render(<SideNav />);
    
    const homeLink = screen.getByText("Home").closest("li");
    expect(homeLink).toHaveClass("bg-orange text-white");
  });
});
