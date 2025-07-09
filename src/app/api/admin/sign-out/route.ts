import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const supabase = createClient();
    const { error } = await (await supabase).auth.signOut();

    if (error) {
      return NextResponse.json(
        {
          message: "Failed to sign out.",
          code: "SIGN_OUT_ERROR",
          status: 400,
          error: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Successfully signed out.",
        code: "SIGN_OUT_SUCCESS",
        status: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Sign out error:", error);
    return NextResponse.json(
      {
        message: "An unexpected error occurred during sign out.",
        code: "UNEXPECTED_ERROR",
        status: 500,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
