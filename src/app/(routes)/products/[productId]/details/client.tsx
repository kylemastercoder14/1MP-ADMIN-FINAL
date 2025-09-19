"use client";

import React, { useMemo, useState } from "react";
import { ProductWithProps } from "@/types";
import { ArrowLeft, ShieldCheck, Star, WalletMinimal } from "lucide-react";
import ProductImages from "@/components/globals/product-images";
import {
  calculateDiscountPrice,
  formatDiscountDateRange,
  formatText,
  getDiscountInfo,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ProductVariant } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import { ProductVariants } from "@/components/globals/product-variants";
import { paymentMethods } from "@/constants";
import Image from 'next/image';

const Client = ({ data }: { data: ProductWithProps | null }) => {
  const router = useRouter();
  const activeNewArrivalDiscount =
    data?.newArrivalDiscount?.status === "Ongoing";
  const activeDiscount = data?.productDiscount?.status === "Ongoing";
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    data?.variants?.[0] || null
  );

  const price = useMemo(() => {
    if (selectedVariant) {
      return selectedVariant.price;
    }
    return data?.price || 0;
  }, [selectedVariant, data]);

  const discounts = data ? getDiscountInfo(data) : [];
  const hasDiscount = discounts.length > 0;
  const discountPrice = calculateDiscountPrice(price, discounts);
  return (
    <div className="grid lg:grid-cols-10 grid-cols-1 gap-5">
      <div className="lg:col-span-6 bg-white p-4 rounded-md border">
        <div className="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="size-4" />
          </Button>
          <h3 className="text-lg font-semibold-4 capitalize">
            {data?.name || "Product Name"}
          </h3>
        </div>
        <div className="flex items-center gap-3 text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Star className={`size-4 fill-current text-yellow-500`} />
            <Star className={`size-4 fill-current text-yellow-500`} />
            <Star className={`size-4 fill-current text-yellow-500`} />
            <Star className={`size-4 fill-current text-yellow-500`} />
            <Star className={`size-4 fill-half text-yellow-500`} />
            <span className="text-gray-500">4.9</span>
          </div>
          <p>|</p>
          <span className="text-muted-foreground">
            Reviews{" "}
            <span className="text-gray-600 font-medium">
              {Math.floor(Math.random() * 2000) + 10}
            </span>
          </span>
        </div>
        <ProductImages images={data?.images || []} video={data?.video || ""} />
      </div>
      <div className="lg:col-span-4 h-fit border p-5 bg-white rounded-md">
        <div className="flex items-center gap-1 mb-2 flex-wrap">
          {data?.soldCount !== undefined && data.soldCount > 100 && (
            <span
              className={`text-sm bg-gradient-to-l from-blue-500 to-blue-800 text-white px-2 py-1 rounded-sm font-medium`}
            >
              BEST SELLER
            </span>
          )}
          {activeNewArrivalDiscount && (
            <span
              className={`text-sm bg-gradient-to-l from-emerald-500 to-emerald-800 text-white px-2 py-1 rounded-sm font-medium`}
            >
              NEW ARRIVAL
            </span>
          )}
          {data?.onTimeDeliveryGuarantee && (
            <span
              className={`text-sm bg-gradient-to-l from-orange-500 to-orange-800 text-white px-2 py-1 rounded-sm font-medium`}
            >
              ON TIME DELIVERY GUARANTEE
            </span>
          )}
          {data?.onSiteServiceGuarantee && (
            <span
              className={`text-sm bg-gradient-to-l from-violet-500 to-violet-800 text-white px-2 py-1 rounded-sm font-medium`}
            >
              ON SITE SERVICE GUARANTEE
            </span>
          )}
          {data?.freeReplacementParts && (
            <span
              className={`text-sm bg-gradient-to-l from-yellow-500 to-yellow-800 text-white px-2 py-1 rounded-sm font-medium`}
            >
              FREE REPLACEMENT PARTS
            </span>
          )}
        </div>
        <span className="text-sm text-muted-foreground">
          Brand:{" "}
          <span className="text-[#800020] font-normal">
            {data?.brand || "No Brand"}
          </span>{" "}
          |{" "}
          <span className="text-[#800020] font-normal">
            More {formatText(data?.subCategory?.name)} Products
          </span>
        </span>
        {activeDiscount && (
          <div className="bg-gradient-to-br from-red-500 rounded-md mt-3 to-[#800020] px-5 py-2 via-red-700 w-[400px]">
            <div className="flex items-center justify-between text-white">
              <div className="max-w-48">
                <h3 className="font-bold uppercase text-lg">
                  <span>
                    {data?.productDiscount?.discount || "Discount Title"}
                  </span>
                  <span className="bg-white text-[#800020] font-bold text-xs ml-2 rounded-sm px-1.5 py-0.5">
                    {formatDiscountDateRange(
                      data.productDiscount?.startDate || "",
                      data.productDiscount?.endDate || ""
                    )}
                  </span>
                </h3>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-yellow-300 text-lg font-bold">
                  UP TO{" "}
                  {data.productDiscount?.type === "Percentage Off"
                    ? `${data?.productDiscount?.value}% OFF`
                    : `₱${data?.productDiscount?.value} OFF`}
                </h3>
                <span className="text-center mx-auto font-semibold">
                  Shop Now!
                </span>
              </div>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2 mt-5">
          <span className="font-black text-3xl text-[#800020]">
            <span className="text-lg font-semibold">₱</span>
            {discountPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-base font-semibold text-gray-400 line-through">
              ₱{price.toFixed(2)}
            </span>
          )}
          {hasDiscount && (
            <div className="flex items-center gap-1">
              <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-green-200 flex items-center mt-1 text-green-700 font-bold">
                {discounts &&
                  discounts.some((d) => d.discountType === "Percentage Off") &&
                  `${discounts.reduce(
                    (sum, d) =>
                      d.discountType === "Percentage Off" ? sum + d.value : sum,
                    0
                  )}%`}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-yellow-200 flex items-center mt-1 text-yellow-700 font-bold">
                {discounts &&
                  discounts.some((d) => d.discountType === "Fixed Price") &&
                  `₱${discounts.reduce(
                    (sum, d) =>
                      d.discountType === "Fixed Price" ? sum + d.value : sum,
                    0
                  )}`}
              </span>
            </div>
          )}
        </div>
        <Separator className="my-4" />
        <ProductVariants
          variants={data?.variants || []}
          specifications={data?.specifications || []}
          onVariantSelect={(variant) => setSelectedVariant(variant)}
          selectedVariantId={selectedVariant?.id}
          sizeGuide={data?.sizeChart || null}
        />
        <span className="font-semibold text-lg mt-5">Shipping:</span>
        <div className="bg-zinc-100 px-4 py-2 rounded-sm mt-2 mb-5">
          <span>
            Shipping Fee: Est. ₱30.00 for motorcyle, ₱20.00 for bicycle
          </span>{" "}
          <br />
          <span>Estimated delivery in 1 hr to 3 hrs onwards.</span>
        </div>
        <div className="flex items-center justify-between mt-5">
          <span className="font-semibold text-lg">
            Protections for this product
          </span>
        </div>
        <div className="space-y-3 mt-2">
          <div>
            <div className="flex font-medium items-center gap-2">
              <ShieldCheck className="size-4" />
              Secure payments
            </div>
            <p className="ml-6">
              Every payment you make on 1 Market Philippines is secured with
              strict SSL encryption and PCI DSS data protection protocols
            </p>
            <div className="flex ml-6 mt-2 flex-wrap gap-2">
              {paymentMethods.map((method, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 relative`}
                  title={method.name}
                >
                  <Image
                    alt={method.name}
                    src={method.src}
                    fill
                    className="size-full"
                  />
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex font-medium items-center gap-2">
              <WalletMinimal className="size-4" />
              Easy Return & Refund
            </div>
            <p className="ml-6">
              Claim a refund if your order is missing or arrives with product
              issues.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Client;
