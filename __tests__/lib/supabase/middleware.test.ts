/**
 * @jest-environment node
 */

import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// --- mock next/headers to prevent "outside request scope" errors ---
jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({
    getAll: jest.fn(() => []),
    set: jest.fn(),
  })),
}));

// --- mock @supabase/ssr ---
jest.mock("@supabase/ssr", () => ({
  createServerClient: jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createServerClient } = require("@supabase/ssr");

describe("middleware (updateSession)", () => {
  let mockGetUser: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock getUser to return the correct Supabase shape
    mockGetUser = jest.fn();

    (createServerClient as jest.Mock).mockReturnValue({
      auth: {
        getUser: mockGetUser,
      },
    });
  });

  const makeRequest = (path: string) =>
    new NextRequest(new URL(path, "http://localhost:3000"));

  it("should allow public routes when no user", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    const req = makeRequest("/sign-in");
    const res = await updateSession(req);

    expect(res).toBeInstanceOf(NextResponse);
    expect(res.status).toBe(200);
  });

  it("should redirect to /sign-in if no user on protected route", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    const req = makeRequest("/dashboard");
    const res = await updateSession(req);

    expect(res.headers.get("location")).toBe("http://localhost:3000/sign-in");
  });

  it("should allow access if user exists", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "123" } },
      error: null,
    });

    const req = makeRequest("/dashboard");
    const res = await updateSession(req);

    expect(res).toBeInstanceOf(NextResponse);
    expect(res.status).toBe(200);
  });
});
