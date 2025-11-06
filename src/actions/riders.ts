"use server";

import db from "@/lib/db";

// Change rider status (approve/reject)
export const changeRiderStatus = async (
  id: string,
  status: string,
  reason: string
) => {
  try {
    const existingRider = await db.rider.findUnique({
      where: { id },
    });

    if (!existingRider) {
      return { error: "Rider not found." };
    }

    const data = await db.rider.update({
      where: { id },
      data: { adminApproval: status },
    });

    // TODO: Send email notification if needed
    // await sendVerificationReasonEmail(...)

    return { success: `Rider ${status.toLowerCase()} successfully`, data };
  } catch (error) {
    console.error("Error changing rider status:", error);
    return { error: "An error occurred while changing the rider status." };
  }
};

// Delete rider
export const deleteRider = async (id: string) => {
  try {
    const response = await db.rider.delete({
      where: { id },
    });

    return { success: "Rider deleted successfully", data: response };
  } catch (error) {
    console.error("Error deleting rider:", error);
    return { error: "An error occurred while deleting the rider." };
  }
};


