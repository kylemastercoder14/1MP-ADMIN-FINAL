"use server";

import db from "@/lib/db";
import { useAdmin } from "@/hooks/use-user";

// Get or create conversation between admin and vendor
// Note: We'll use a system admin user ID for conversations
export const getOrCreateAdminVendorConversation = async (vendorId: string) => {
  try {
    const { admin } = await useAdmin();

    if (!admin) {
      return { error: "Admin not authenticated" };
    }

    // Find or create a system admin user for conversations
    // This is a workaround since Conversation requires userId
    let systemAdminUser = await db.user.findFirst({
      where: {
        email: "admin@system.internal",
      },
    });

    if (!systemAdminUser) {
      // Create system admin user if it doesn't exist
      systemAdminUser = await db.user.create({
        data: {
          email: "admin@system.internal",
          username: "system_admin",
          firstName: "System",
          lastName: "Admin",
        },
      });
    }

    // Find or create conversation
    let conversation = await db.conversation.findUnique({
      where: {
        userId_vendorId: {
          userId: systemAdminUser.id,
          vendorId: vendorId,
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            senderUser: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                image: true,
              },
            },
            senderVendor: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!conversation) {
      conversation = await db.conversation.create({
        data: {
          userId: systemAdminUser.id,
          vendorId: vendorId,
        },
        include: {
          messages: {
            orderBy: {
              createdAt: "asc",
            },
            include: {
              senderUser: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  image: true,
                },
              },
              senderVendor: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      });
    }

    return { conversation };
  } catch (error) {
    console.error("Error getting/creating conversation:", error);
    return { error: "Failed to get or create conversation" };
  }
};

// Send message from admin to vendor
export const sendAdminMessage = async (
  vendorId: string,
  message: string
) => {
  try {
    const { admin } = await useAdmin();

    if (!admin) {
      return { error: "Admin not authenticated" };
    }

    if (!message || message.trim().length === 0) {
      return { error: "Message cannot be empty" };
    }

    // Get or create conversation
    const conversationResult = await getOrCreateAdminVendorConversation(vendorId);

    if (conversationResult.error || !conversationResult.conversation) {
      return { error: conversationResult.error || "Failed to get conversation" };
    }

    // Find system admin user
    const systemAdminUser = await db.user.findFirst({
      where: {
        email: "admin@system.internal",
      },
    });

    if (!systemAdminUser) {
      return { error: "System admin user not found" };
    }

    // Create message
    const newMessage = await db.message.create({
      data: {
        body: message.trim(),
        conversationId: conversationResult.conversation.id,
        senderUserId: systemAdminUser.id,
      },
      include: {
        senderUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true,
          },
        },
        senderVendor: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // Update conversation lastMessageAt
    await db.conversation.update({
      where: {
        id: conversationResult.conversation.id,
      },
      data: {
        lastMessageAt: new Date(),
        isUnread: true,
      },
    });

    return { message: newMessage };
  } catch (error) {
    console.error("Error sending message:", error);
    return { error: "Failed to send message" };
  }
};

// Get messages for admin-vendor conversation
export const getAdminVendorMessages = async (vendorId: string) => {
  try {
    const conversationResult = await getOrCreateAdminVendorConversation(vendorId);

    if (conversationResult.error || !conversationResult.conversation) {
      return { error: conversationResult.error || "Failed to get conversation" };
    }

    const messages = await db.message.findMany({
      where: {
        conversationId: conversationResult.conversation.id,
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        senderUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true,
          },
        },
        senderVendor: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return { messages };
  } catch (error) {
    console.error("Error getting messages:", error);
    return { error: "Failed to get messages" };
  }
};

// Send message with attachment from admin to vendor
export const sendAdminMessageWithAttachment = async (
  vendorId: string,
  message: string | null,
  imageUrl: string | null,
  fileUrl: string | null,
  videoUrl: string | null
) => {
  try {
    const { admin } = await useAdmin();

    if (!admin) {
      return { error: "Admin not authenticated" };
    }

    // Get or create conversation
    const conversationResult = await getOrCreateAdminVendorConversation(vendorId);

    if (conversationResult.error || !conversationResult.conversation) {
      return { error: conversationResult.error || "Failed to get conversation" };
    }

    // Find system admin user
    const systemAdminUser = await db.user.findFirst({
      where: {
        email: "admin@system.internal",
      },
    });

    if (!systemAdminUser) {
      return { error: "System admin user not found" };
    }

    // Create message with attachment
    const newMessage = await db.message.create({
      data: {
        body: message || null,
        image: imageUrl || null,
        file: fileUrl || null,
        video: videoUrl || null,
        conversationId: conversationResult.conversation.id,
        senderUserId: systemAdminUser.id,
      },
      include: {
        senderUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true,
          },
        },
        senderVendor: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // Update conversation lastMessageAt
    await db.conversation.update({
      where: {
        id: conversationResult.conversation.id,
      },
      data: {
        lastMessageAt: new Date(),
        isUnread: true,
      },
    });

    return { message: newMessage };
  } catch (error) {
    console.error("Error sending message with attachment:", error);
    return { error: "Failed to send message" };
  }
};

// Get all vendors with their last message for sidebar
export const getVendorsWithLastMessage = async () => {
  try {
    const { admin } = await useAdmin();

    if (!admin) {
      return { error: "Admin not authenticated" };
    }

    // Find system admin user
    const systemAdminUser = await db.user.findFirst({
      where: {
        email: "admin@system.internal",
      },
    });

    if (!systemAdminUser) {
      return { error: "System admin user not found" };
    }

    // Get all conversations for admin
    const conversations = await db.conversation.findMany({
      where: {
        userId: systemAdminUser.id,
      },
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          select: {
            body: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        lastMessageAt: "desc",
      },
    });

    const vendors = conversations.map((conv) => ({
      id: conv.vendor.id,
      name: conv.vendor.name,
      image: conv.vendor.image,
      email: conv.vendor.email,
      lastMessage: conv.messages[0] || null,
    }));

    // Also get vendors without conversations
    const allVendors = await db.vendor.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        email: true,
      },
    });

    const vendorsWithConversations = vendors.map((v) => v.id);
    const vendorsWithoutConversations = allVendors
      .filter((v) => !vendorsWithConversations.includes(v.id))
      .map((v) => ({
        id: v.id,
        name: v.name,
        image: v.image,
        email: v.email,
        lastMessage: null,
      }));

    return { vendors: [...vendors, ...vendorsWithoutConversations] };
  } catch (error) {
    console.error("Error getting vendors with last message:", error);
    return { error: "Failed to get vendors" };
  }
};

