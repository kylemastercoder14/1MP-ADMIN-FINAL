/**
 * @jest-environment node
 */

import { GET } from "@/app/api/admin/route";

// Mock Supabase + DB
jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
}));

jest.mock("@/lib/db", () => ({
  admin: {
    findUnique: jest.fn(),
  },
}));

import { createClient } from "@/lib/supabase/server";
import db from "@/lib/db";

describe("GET /api/admin", () => {
  const mockUser = { id: "user-123", email: "test@example.com" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if no Authorization header", async () => {
    const request = new Request("http://localhost/api/admin", {
      headers: {}, // no auth header
    });

    const response = await GET(request);
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json.code).toBe("MISSING_AUTH_HEADER");
  });

  it("should return 401 if token is invalid", async () => {
    (createClient as jest.Mock).mockReturnValue(
      Promise.resolve({
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: null },
            error: { message: "Invalid token" },
          }),
        },
      })
    );

    const request = new Request("http://localhost/api/admin", {
      headers: { Authorization: "Bearer invalidtoken" },
    });

    const response = await GET(request);
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json.code).toBe("INVALID_ACCESS_TOKEN");
  });

  it("should return 404 if admin not found", async () => {
    (createClient as jest.Mock).mockReturnValue(
      Promise.resolve({
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: mockUser },
            error: null,
          }),
        },
      })
    );

    (db.admin.findUnique as jest.Mock).mockResolvedValue(null);

    const request = new Request("http://localhost/api/admin", {
      headers: { Authorization: "Bearer validtoken" },
    });

    const response = await GET(request);
    const json = await response.json();

    expect(response.status).toBe(404);
    expect(json.code).toBe("ADMIN_NOT_FOUND");
  });

  it("should return 200 with admin details if found", async () => {
    (createClient as jest.Mock).mockReturnValue(
      Promise.resolve({
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: mockUser },
            error: null,
          }),
        },
      })
    );

    (db.admin.findUnique as jest.Mock).mockResolvedValue({
      id: "admin-1",
      email: "admin@example.com",
      authId: "user-123",
    });

    const request = new Request("http://localhost/api/admin", {
      headers: { Authorization: "Bearer validtoken" },
    });

    const response = await GET(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.data).toMatchObject({
      id: "admin-1",
      email: "admin@example.com",
      authId: "user-123",
    });
  });
});
