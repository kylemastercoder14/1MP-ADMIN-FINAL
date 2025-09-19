
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  render,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface SellerStatusProps {
  sellerId: string;
  storeName: string;
  status: "Approved" | "Rejected";
  reason?: string;
}

export const SellerStatus = ({
  sellerId,
  storeName,
  status,
  reason,
}: SellerStatusProps) => {
  const isApproved = status === "Approved";
  const isRejected = status === "Rejected";

  const getStatusConfig = () => {
    switch (status) {
      case "Approved":
        return { color: "#22c55e", text: "Approved" };
      case "Rejected":
        return { color: "#ef4444", text: "Rejected" };
      default:
        return { color: "#6b7280", text: "Unknown" };
    }
  };

  const statusConfig = getStatusConfig();
  const statusColor = statusConfig.color;
  const statusText = statusConfig.text;

  return (
    <Html>
      <Head />
      <Preview>
        Your seller application has been {statusText.toLowerCase()} | 1 Market Philippines
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={coverSection}>
            {/* Header with Logo */}
            <Section style={headerSection}>
              <Img
                src="https://utqpspeicywesqihyelg.supabase.co/storage/v1/object/public/assets/logo_maroon_transparent.png"
                width="60"
                height="60"
                alt="1 Market Philippines Logo"
                style={logo}
              />
              <Text style={headerTitle}>1 Market Philippines</Text>
            </Section>

            {/* Status Banner */}
            <Section style={{ ...statusBanner, backgroundColor: statusColor }}>
              <Text style={statusTextStyle}>Application {statusText}</Text>
            </Section>

            {/* Main Content */}
            <Section style={contentSection}>
              <Text style={greeting}>Hello {storeName},</Text>

              {isApproved ? (
                <>
                  <Text style={paragraph}>
                    Congratulations! Your seller application has been{" "}
                    <strong style={{ color: statusColor }}>approved</strong> by our admin team.
                  </Text>
                  <Text style={paragraph}>
                    Welcome to 1 Market Philippines! You can now start listing your products
                    and begin selling on our platform. Access your seller dashboard to get started.
                  </Text>
                </>
              ) : isRejected ? (
                <>
                  <Text style={paragraph}>
                    We regret to inform you that your seller application has been{" "}
                    <strong style={{ color: statusColor }}>rejected</strong> by our admin team.
                  </Text>
                  {reason && (
                    <Section style={rejectionBox}>
                      <Text style={rejectionTitle}>Reason for rejection:</Text>
                      <Text style={rejectionText}>{reason}</Text>
                    </Section>
                  )}
                  <Text style={paragraph}>
                    You can reapply after addressing the issues mentioned above.
                    Please ensure you meet all our seller requirements before submitting a new application.
                  </Text>
                </>
              ) : null}

              {/* Store Info Section */}
              <Section style={storeSection}>
                <Text style={storeTitle}>
                  <strong>Store Name: {storeName}</strong>
                </Text>
                <Text style={storeId}>
                  Seller ID: {sellerId}
                </Text>
              </Section>

              {/* Action Buttons */}
              <Section style={buttonSection}>
                {isApproved ? (
                  <>
                    <Link
                      href={`https://selleronemarketphilippines.vercel.app/dashboard`}
                      style={{ ...button, backgroundColor: "#22c55e" }}
                    >
                      Access Dashboard
                    </Link>
                    <Link
                      href="https://selleronemarketphilippines.vercel.app/products/create"
                      style={{ ...button, backgroundColor: "#3b82f6" }}
                    >
                      Add Products
                    </Link>
                  </>
                ) : isRejected ? (
                  <>
                    <Link
                      href="https://onemarketphilippines.vercel.app/seller/register"
                      style={{ ...button, backgroundColor: "#f59e0b" }}
                    >
                      Reapply
                    </Link>
                    <Link
                      href="https://onemarketphilippines.vercel.app/1-market-philippines-policy?type=seller-requirements"
                      style={{ ...button, backgroundColor: "#6b7280" }}
                    >
                      View Requirements
                    </Link>
                  </>
                ) : null}
              </Section>

              <Text style={signature}>
                Best regards,
                <br />
                The 1 Market Philippines Team
              </Text>
            </Section>

            <Hr style={divider} />

            {/* Security Notice */}
            <Text style={securityText}>
              🔒 1 Market Philippines will never email you asking for your
              password, credit card, or banking details.
            </Text>
          </Section>

          {/* Footer */}
          <Text style={footerText}>
            This message was produced and distributed by 1 Market Philippines.
            © 2025. All rights reserved. 1 Market Philippines is a registered
            trademark of{" "}
            <Link
              href="https://one-market-philippines-production.vercel.app"
              target="_blank"
              style={link}
            >
              onemarketphilippines.com
            </Link>
            . View our{" "}
            <Link
              href="https://one-market-philippines-production.vercel.app/privacy-policy"
              target="_blank"
              style={link}
            >
              privacy policy
            </Link>{" "}
            and{" "}
            <Link
              href="https://one-market-philippines-production.vercel.app/terms"
              target="_blank"
              style={link}
            >
              terms of service
            </Link>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export const SellerStatusHTML = (props: SellerStatusProps) =>
  render(<SellerStatus {...props} />, {
    pretty: true,
  });

// Common rejection reasons for seller applications:
export const SELLER_REJECTION_REASONS = {
  INCOMPLETE_DOCUMENTS:
    "Required documents are missing or incomplete. Please submit all necessary business registration and identification documents.",
  INVALID_BUSINESS_INFO:
    "Business information provided does not match official records or appears to be invalid.",
  POLICY_VIOLATION:
    "Your application violates our seller terms of service or marketplace policies.",
  DUPLICATE_APPLICATION:
    "A seller account with similar business details already exists on our platform.",
  RESTRICTED_CATEGORY:
    "Your business category is currently restricted or not supported on our platform.",
  INSUFFICIENT_EXPERIENCE:
    "Insufficient selling experience or business history to meet our seller requirements.",
  GEOGRAPHIC_RESTRICTION:
    "Your business location is currently outside our supported service areas.",
  QUALITY_CONCERNS:
    "Concerns about product quality or business practices based on provided information.",
  VERIFICATION_FAILED:
    "Unable to verify the authenticity of submitted documents or business information.",
  REPUTATION_ISSUES:
    "Negative history or reputation concerns identified during background verification.",
  NON_COMPLIANCE:
    "Your business does not comply with Philippine business regulations or tax requirements.",
  INCOMPLETE_PROFILE:
    "Seller profile information is incomplete or does not meet our minimum requirements.",
};

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "600px",
};

const coverSection = {
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
};

const headerSection = {
  textAlign: "center" as const,
  padding: "32px 20px 20px",
  backgroundColor: "#ffffff",
};

const logo = {
  display: "block",
  margin: "0 auto",
};

const headerTitle = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#1f2937",
  margin: "12px 0 0 0",
};

const statusBanner = {
  padding: "16px 20px",
  textAlign: "center" as const,
};

const statusTextStyle = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#ffffff",
  margin: "0",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const contentSection = {
  padding: "32px 40px",
};

const greeting = {
  fontSize: "16px",
  color: "#1f2937",
  margin: "0 0 24px 0",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#374151",
  margin: "16px 0",
};

const rejectionBox = {
  backgroundColor: "#fef2f2",
  border: "1px solid #fecaca",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
};

const rejectionTitle = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#dc2626",
  margin: "0 0 8px 0",
};

const rejectionText = {
  fontSize: "15px",
  color: "#7f1d1d",
  margin: "0",
  lineHeight: "1.5",
};

const storeSection = {
  textAlign: "center" as const,
  padding: "32px 0",
  borderTop: "1px solid #e5e7eb",
  borderBottom: "1px solid #e5e7eb",
  margin: "32px 0",
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
};

const storeTitle = {
  fontSize: "18px",
  color: "#1f2937",
  margin: "0 0 8px 0",
};

const storeId = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "0",
  fontFamily: "monospace",
};

const buttonSection = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  display: "inline-block",
  padding: "12px 24px",
  margin: "8px 12px",
  borderRadius: "6px",
  color: "#ffffff",
  textDecoration: "none",
  fontWeight: "600",
  fontSize: "14px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const signature = {
  fontSize: "16px",
  color: "#1f2937",
  margin: "32px 0 0 0",
  lineHeight: "1.6",
};

const divider = {
  borderColor: "#e5e7eb",
  margin: "32px 40px",
};

const securityText = {
  fontSize: "14px",
  color: "#6b7280",
  textAlign: "center" as const,
  padding: "0 40px 20px",
  backgroundColor: "#f9fafb",
  margin: "0",
};

const footerText = {
  color: "#6b7280",
  fontSize: "12px",
  lineHeight: "1.6",
  padding: "20px 40px 0",
  textAlign: "center" as const,
};

const link = {
  color: "#2563eb",
  textDecoration: "underline",
};
