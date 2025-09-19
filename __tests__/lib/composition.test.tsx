import React, { createRef } from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import {
  composeEventHandlers,
  composeRefs,
  useComposedRefs,
} from "@/lib/composition";

// A simple component that accepts ref
const TestComponent = React.forwardRef<HTMLDivElement>((props, ref) => (
  <div ref={ref} data-testid="test-div">Hello</div>
));
TestComponent.displayName = "TestComponent";

describe("composeEventHandlers", () => {
  it("should call both original and our handler", () => {
    const originalHandler = jest.fn();
    const ourHandler = jest.fn();

    const composed = composeEventHandlers<React.MouseEvent>(
      originalHandler,
      ourHandler
    );

    const { getByTestId } = render(
      <div data-testid="btn" onClick={composed}>Click</div>
    );

    fireEvent.click(getByTestId("btn"));

    expect(originalHandler).toHaveBeenCalledTimes(1);
    expect(ourHandler).toHaveBeenCalledTimes(1);
  });

  it("should not call our handler if defaultPrevented", () => {
    const originalHandler = jest.fn((e: React.SyntheticEvent) =>
      e.preventDefault()
    );
    const ourHandler = jest.fn();

    const composed = composeEventHandlers<React.SyntheticEvent>(
      originalHandler,
      ourHandler
    );

    const { getByTestId } = render(
      <div data-testid="btn" onClick={composed}>Click</div>
    );

    fireEvent.click(getByTestId("btn"));

    expect(originalHandler).toHaveBeenCalled();
    expect(ourHandler).not.toHaveBeenCalled();
  });

  it("should call our handler even if prevented when checkForDefaultPrevented = false", () => {
    const originalHandler = jest.fn((e: React.SyntheticEvent) =>
      e.preventDefault()
    );
    const ourHandler = jest.fn();

    const composed = composeEventHandlers<React.SyntheticEvent>(
      originalHandler,
      ourHandler,
      { checkForDefaultPrevented: false }
    );

    const { getByTestId } = render(
      <div data-testid="btn" onClick={composed}>Click</div>
    );

    fireEvent.click(getByTestId("btn"));

    expect(originalHandler).toHaveBeenCalled();
    expect(ourHandler).toHaveBeenCalled();
  });
});

describe("composeRefs", () => {
  afterEach(() => {
    cleanup();
  });

  it("should assign the same DOM node to multiple refs", () => {
    const objectRef = createRef<HTMLDivElement>();
    let callbackValue: HTMLDivElement | null = null;
    const callbackRef = (node: HTMLDivElement | null) => {
      callbackValue = node;
    };

    const composed = composeRefs(objectRef, callbackRef);

    render(<TestComponent ref={composed} />);

    expect(objectRef.current).not.toBeNull();
    expect(callbackValue).toBe(objectRef.current);
  });

  it("should support cleanup function when a ref callback returns a function", () => {
    const objectRef = createRef<HTMLDivElement>();
    let cleanedUp = false;

    const cleanupRef = (node: HTMLDivElement | null) => {
      if (node) {
        return () => {
          cleanedUp = true;
        };
      }
    };

    const composed = composeRefs(objectRef, cleanupRef);
    const { unmount } = render(<TestComponent ref={composed} />);

    unmount();

    expect(cleanedUp).toBe(true);
  });
});

describe("useComposedRefs", () => {
  it("should return a stable ref callback", () => {
    const objectRef = createRef<HTMLDivElement>();

    const HookComponent = () => {
      const composedRef = useComposedRefs(objectRef);
      return <div ref={composedRef} data-testid="hook-div" />;
    };

    const { getByTestId } = render(<HookComponent />);
    const div = getByTestId("hook-div");

    expect(objectRef.current).toBe(div);
  });
});
