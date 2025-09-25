import db from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// Since this is running in a server component, we should treat it as a utility, not a hook
export const useAdmin = async () => {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("1MP-Authorization");

  if (!authToken) {
    return { error: "Authorization token is missing" };
  }

  try {
    const token = authToken.value;
    // Verify JWT token using the secret
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as {
      sub: string;
      exp: number;
    };

    const adminId = decodedToken.sub;

    // Fetch admin from database
    const admin = await db.admin.findFirst({
      where: {
        id: adminId,
      },
    });

    if (!admin) {
      return { error: "Admin not found" };
    }

    return { admin, adminId, authToken };
  } catch (error) {
    console.error(error);
    return { error: "Invalid or expired token" };
  }
};
