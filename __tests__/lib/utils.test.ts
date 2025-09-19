import {
  cn,
  extractPathFromUrl,
  formatPrice,
  ensureBlob,
  getDateRanges,
  calculateDiscountPrice,
  getDiscountInfo,
} from "@/lib/utils";
import type { DiscountInfo, ProductWithProps } from "@/types";

describe("Helpers", () => {
  // 🟢 cn()
  it("merges class names correctly", () => {
    expect(cn("p-2", "text-red-500")).toBe("p-2 text-red-500");
    expect(cn("p-2", false && "hidden")).toBe("p-2");
  });

  // 🟢 extractPathFromUrl()
  it("extracts path from valid URL", () => {
    const url =
      "https://example.com/storage/v1/object/public/bucket/my/file.png";
    expect(extractPathFromUrl(url)).toBe("my/file.png");
  });

  it("returns null for invalid URL", () => {
    expect(extractPathFromUrl("not-a-url")).toBeNull();
  });

  // 🟢 formatPrice()
  it("formats price with two decimals", () => {
    expect(formatPrice(1234.5)).toBe("1,234.50");
  });

  // 🟢 ensureBlob()
  it("returns the same Blob if input is Blob", async () => {
    const blob = new Blob(["test"], { type: "text/plain" });
    const result = await ensureBlob(blob);
    expect(result).toBeInstanceOf(Blob);
  });

  it("converts File to Blob", async () => {
    const file = new File(["hello"], "test.txt", { type: "text/plain" });
    const result = await ensureBlob(file);
    expect(result).toBeInstanceOf(Blob);
  });

  // 🟢 getDateRanges()
  it("returns correct range for last7days", () => {
    const { start, prevStart, prevEnd } = getDateRanges("last7days");
    expect(start).toBeInstanceOf(Date);
    expect(prevStart).toBeInstanceOf(Date);
    expect(prevEnd).toBeInstanceOf(Date);
  });

  // 🟢 calculateDiscountPrice()
  it("applies percentage and fixed discounts", () => {
    const discounts: DiscountInfo[] = [
      {
        discountType: "Percentage Off",
        value: 10,
        type: "test",
        text: "10% off",
      },
      { discountType: "Fixed Price", value: 50, type: "test", text: "₱50 off" },
    ];
    const result = calculateDiscountPrice(1000, discounts);
    // 1000 - 10% = 900 → -50 = 850
    expect(result).toBe(850);
  });

  it("never returns negative price", () => {
    const discounts: DiscountInfo[] = [
      {
        discountType: "Fixed Price",
        value: 2000,
        type: "test",
        text: "₱2000 off",
      },
    ];
    const result = calculateDiscountPrice(1000, discounts);
    expect(result).toBe(0);
  });

  // 🟢 getDiscountInfo()
  it("returns discounts for product with active promos", () => {
    const product = {
      newArrivalDiscount: {
        status: "Ongoing",
        value: 15,
        discount: "15% OFF",
        type: "Percentage Off",
      },
      productDiscount: {
        status: "Ongoing",
        value: 100,
        discount: "₱100 OFF",
        type: "Fixed Price",
      },
    } as unknown as ProductWithProps;

    const result = getDiscountInfo(product);
    expect(result).toHaveLength(2);
    expect(result[0].type).toBe("new-arrival");
    expect(result[1].type).toBe("product");
  });

  it("returns empty discounts when none are active", () => {
    const product = {} as ProductWithProps;
    expect(getDiscountInfo(product)).toEqual([]);
  });
});
