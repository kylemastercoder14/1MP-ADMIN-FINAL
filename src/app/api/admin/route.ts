import { createClient } from "@/lib/supabase/server";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // 1. Get the access token from Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          message: "Authorization header is missing or invalid.",
          code: "MISSING_AUTH_HEADER",
        },
        { status: 401 }
      );
    }

    const accessToken = authHeader.split(" ")[1];

    // 2. Create Supabase client and verify the token
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await (await supabase).auth.getUser(accessToken);

    if (authError || !user) {
      return NextResponse.json(
        {
          message: "Invalid or expired access token.",
          code: "INVALID_ACCESS_TOKEN",
        },
        { status: 401 }
      );
    }

    // 3. Fetch admin details from the database
    const admin = await db.admin.findUnique({
      where: { authId: user.id },
    });

    if (!admin) {
      return NextResponse.json(
        {
          message: "Admin not found.",
          code: "ADMIN_NOT_FOUND",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: {
          id: admin.id,
          email: admin.email,
          authId: admin.authId,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching admin details:", error);
    return NextResponse.json(
      {
        message: "Internal server error.",
        code: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}
