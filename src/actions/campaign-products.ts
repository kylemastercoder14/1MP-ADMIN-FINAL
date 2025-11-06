"use server";

import db from "@/lib/db";

// Change campaign product status (approve/reject)
export const changeCampaignProductStatus = async (
  id: string,
  status: string,
  reason?: string
) => {
  try {
    const existingCampaignProduct = await db.campaignProduct.findUnique({
      where: { id },
      include: {
        product: {
          include: {
            vendor: true,
          },
        },
        campaign: true,
      },
    });

    if (!existingCampaignProduct) {
      return { error: "Campaign product not found." };
    }

    const data = await db.campaignProduct.update({
      where: { id },
      data: { status },
    });

    // TODO: Send email notification if needed
    // await sendCampaignProductStatusEmail(...)

    return { success: `Campaign product ${status.toLowerCase()} successfully`, data };
  } catch (error) {
    console.error("Error changing campaign product status:", error);
    return { error: "An error occurred while changing the campaign product status." };
  }
};


