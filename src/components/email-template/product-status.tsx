/* eslint-disable react/no-unescaped-entities */
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

interface ProductStatusProps {
  status: "Approved" | "Rejected" | "Activated" | "Deactivated";
  storeName: string;
  productImage: string;
  productName: string;
  rejectionReason?: string;
  deactivationReason?: string;
}

export const ProductStatus = ({
  status,
  storeName,
  productImage,
  productName,
  rejectionReason,
  deactivationReason,
}: ProductStatusProps) => {
  const isApproved = status === "Approved";
  const isRejected = status === "Rejected";
  const isActivated = status === "Activated";
  const isDeactivated = status === "Deactivated";

  const getStatusConfig = () => {
    switch (status) {
      case "Approved":
        return { color: "#22c55e", text: "Approved" };
      case "Rejected":
        return { color: "#ef4444", text: "Rejected" };
      case "Activated":
        return { color: "#3b82f6", text: "Activated" };
      case "Deactivated":
        return { color: "#f59e0b", text: "Deactivated" };
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
        Your product "{productName}" has been {statusText.toLowerCase()}
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
              <Text style={statusTextStyle}>Product {statusText}</Text>
            </Section>

            {/* Main Content */}
            <Section style={contentSection}>
              <Text style={greeting}>Hello {storeName},</Text>

              {isApproved ? (
                <>
                  <Text style={paragraph}>
                    Great news! Your product has been{" "}
                    <strong style={{ color: statusColor }}>approved</strong> by our admin team and
                    is now live on our platform.
                  </Text>
                  <Text style={paragraph}>
                    You can now start selling and managing your inventory.
                    Customers will be able to discover and purchase your product
                    immediately.
                  </Text>
                </>
              ) : isRejected ? (
                <>
                  <Text style={paragraph}>
                    We regret to inform you that your product has been{" "}
                    <strong style={{ color: statusColor }}>rejected</strong> by our admin team and
                    cannot be listed at this time.
                  </Text>
                  {rejectionReason && (
                    <Section style={rejectionBox}>
                      <Text style={rejectionTitle}>Reason for rejection:</Text>
                      <Text style={rejectionText}>{rejectionReason}</Text>
                    </Section>
                  )}
                  <Text style={paragraph}>
                    You can edit your product details and resubmit for review.
                    Please ensure your product meets our guidelines before
                    resubmitting.
                  </Text>
                </>
              ) : isActivated ? (
                <>
                  <Text style={paragraph}>
                    Your product has been successfully{" "}
                    <strong style={{ color: statusColor }}>activated</strong> by our admin team
                    and is now available for purchase.
                  </Text>
                  <Text style={paragraph}>
                    Customers can now see and buy your product. You can manage your
                    inventory and track sales from your seller dashboard.
                  </Text>
                </>
              ) : isDeactivated ? (
                <>
                  <Text style={paragraph}>
                    Your product has been{" "}
                    <strong style={{ color: statusColor }}>deactivated</strong> by our admin team
                    and is no longer visible to customers.
                  </Text>
                  {deactivationReason && (
                    <Section style={deactivationBox}>
                      <Text style={deactivationTitle}>Reason for deactivation:</Text>
                      <Text style={deactivationText}>{deactivationReason}</Text>
                    </Section>
                  )}
                  <Text style={paragraph}>
                    You can contact our support team for assistance or make the necessary
                    changes to reactivate your product.
                  </Text>
                </>
              ) : null}

              {/* Product Details */}
              <Section style={productSection}>
                <Img
                  src={productImage}
                  alt={productName}
                  width="200"
                  height="200"
                  style={productImageStyle}
                />
                <Text style={productNameStyle}>
                  <strong>{productName}</strong>
                </Text>
              </Section>

              {/* Action Buttons */}
              <Section style={buttonSection}>
                {isApproved ? (
                  <>
                    <Link
                      href="https://selleronemarketphilippines.vercel.app/dashboard"
                      style={{ ...button, backgroundColor: "#22c55e" }}
                    >
                      View Dashboard
                    </Link>
                    <Link
                      href="https://selleronemarketphilippines.vercel.app/products"
                      style={{ ...button, backgroundColor: "#3b82f6" }}
                    >
                      Manage Products
                    </Link>
                  </>
                ) : isRejected ? (
                  <>
                    <Link
                      href="https://selleronemarketphilippines.vercel.app/products"
                      style={{ ...button, backgroundColor: "#f59e0b" }}
                    >
                      Edit Product
                    </Link>
                    <Link
                      href="https://onemarketphilippines.vercel.app/1-market-philippines-policy?type=product-listing-policy"
                      style={{ ...button, backgroundColor: "#6b7280" }}
                    >
                      View Guidelines
                    </Link>
                  </>
                ) : isActivated ? (
                  <>
                    <Link
                      href="https://selleronemarketphilippines.vercel.app/dashboard"
                      style={{ ...button, backgroundColor: "#3b82f6" }}
                    >
                      View Dashboard
                    </Link>
                    <Link
                      href="https://selleronemarketphilippines.vercel.app/products"
                      style={{ ...button, backgroundColor: "#8b5cf6" }}
                    >
                      Manage Products
                    </Link>
                  </>
                ) : isDeactivated ? (
                  <>
                    <Link
                      href="https://selleronemarketphilippines.vercel.app/support"
                      style={{ ...button, backgroundColor: "#22c55e" }}
                    >
                      Contact Support
                    </Link>
                    <Link
                      href="https://onemarketphilippines.vercel.app/1-market-philippines-policy?type=product-listing-policy"
                      style={{ ...button, backgroundColor: "#6b7280" }}
                    >
                      View Guidelines
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

export const ProductStatusHTML = (props: ProductStatusProps) =>
  render(<ProductStatus {...props} />, {
    pretty: true,
  });

// Common rejection reasons you can use:
export const REJECTION_REASONS = {
  RESTRICTED_PRODUCT:
    "The product name or category is restricted and violates our marketplace policies.",
  POLICY_VIOLATION:
    "The product does not meet our content and safety guidelines.",
  INSUFFICIENT_INFO:
    "Product description lacks sufficient detail or required information.",
  INAPPROPRIATE_IMAGES:
    "Product images do not meet our quality standards or contain inappropriate content.",
  PROHIBITED_ITEMS: "This item is prohibited from being sold on our platform.",
  COPYRIGHT_VIOLATION:
    "The product appears to infringe on intellectual property rights.",
  DUPLICATE_LISTING:
    "This product appears to be a duplicate of an existing listing.",
  INCOMPLETE_DETAILS:
    "Required product details such as specifications or pricing are missing or incomplete.",
  MISLEADING_INFO:
    "Product contains misleading or false information that could deceive customers.",
  PRICING_VIOLATION:
    "Product pricing violates our fair pricing policies or contains hidden fees.",
};

// Common deactivation reasons you can use:
export const DEACTIVATION_REASONS = {
  OUT_OF_STOCK:
    "Product has been deactivated due to being out of stock for an extended period.",
  SELLER_REQUEST:
    "Product deactivated per seller request through support ticket.",
  POLICY_VIOLATION:
    "Product violated marketplace policies and has been deactivated pending review.",
  QUALITY_ISSUES:
    "Product deactivated due to multiple customer complaints about quality issues.",
  PRICING_ISSUES:
    "Product deactivated due to pricing discrepancies or violations of pricing policies.",
  MAINTENANCE:
    "Product temporarily deactivated for system maintenance or updates.",
  SEASONAL:
    "Product deactivated due to seasonal availability restrictions.",
  SUPPLIER_ISSUES:
    "Product deactivated due to supplier-related issues or discontinuation.",
  CUSTOMER_COMPLAINTS:
    "Product deactivated due to excessive customer complaints or negative feedback.",
  SHIPPING_ISSUES:
    "Product deactivated due to recurring shipping or delivery problems.",
  COMPLIANCE_REVIEW:
    "Product deactivated pending compliance review by our admin team.",
  SUSPICIOUS_ACTIVITY:
    "Product deactivated due to suspicious selling patterns or fraudulent activity.",
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

const deactivationBox = {
  backgroundColor: "#fef3c7",
  border: "1px solid #fde68a",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
};

const deactivationTitle = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#d97706",
  margin: "0 0 8px 0",
};

const deactivationText = {
  fontSize: "15px",
  color: "#92400e",
  margin: "0",
  lineHeight: "1.5",
};

const productSection = {
  textAlign: "center" as const,
  padding: "32px 0",
  borderTop: "1px solid #e5e7eb",
  borderBottom: "1px solid #e5e7eb",
  margin: "32px 0",
};

const productImageStyle = {
  borderRadius: "8px",
  objectFit: "cover" as const,
};

const productNameStyle = {
  fontSize: "18px",
  color: "#1f2937",
  margin: "16px 0 0 0",
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
