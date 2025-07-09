"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Admin } from "@prisma/client";

type UserData = {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
  };
};

export function useAdminDetails() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchadminDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        throw new Error(sessionError?.message || "No active session");
      }

      // Get Supabase user data
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError) throw new Error(userError.message);

      if (userData.user) {
        setUser({
          id: userData.user.id,
          email: userData.user.email || "",
          user_metadata: userData.user.user_metadata,
        });
      }

      const response = await fetch("/api/admin", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch admin details");
      }

      const { data: adminData } = await response.json();
      setAdmin(adminData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Automatically fetch when hook is used
  useEffect(() => {
    fetchadminDetails();
  }, [fetchadminDetails]);

  return {
    admin,
    user,
    loading,
    error,
    refetch: fetchadminDetails,
  };
}
