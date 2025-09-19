import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

describe("Home Page", () => {
  it("renders redirecting text", () => {
    render(<Home />);
    expect(screen.getByText(/redirecting/i)).toBeInTheDocument();
  });
});
