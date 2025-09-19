/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { createRef } from "react";
import { render, cleanup } from "@testing-library/react";
import { composeRefs, useComposedRefs } from "@/lib/compose-refs";

// A simple component that accepts a ref
const TestComponent = React.forwardRef<HTMLDivElement>((props, ref) => (
  <div ref={ref} data-testid="test-div">Hello</div>
));

// ✅ Fix ESLint warning: add displayName
TestComponent.displayName = "TestComponent";

describe("composeRefs", () => {
  afterEach(() => {
    cleanup();
  });

  it("should assign the same DOM node to multiple refs (object + callback)", () => {
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

  it("should handle undefined and null refs gracefully", () => {
    const objectRef = createRef<HTMLDivElement>();

    const composed = composeRefs(objectRef, undefined, null as any);

    render(<TestComponent ref={composed} />);

    expect(objectRef.current).toBeInstanceOf(HTMLDivElement);
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

    // Trigger cleanup on unmount
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
