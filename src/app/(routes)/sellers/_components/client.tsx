"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle, ChevronRight, Loader2, XCircle } from "lucide-react";
import { FaComments } from "react-icons/fa";
import { ChatPerformanceData, SellerWithProps } from "@/types";
import Tabs, { IItem } from "./table-tabs";
import {
  IconBuildingStore,
  IconClipboardText,
  IconClock,
  IconId,
  IconBuilding,
  IconMessage,
  IconShare2,
  IconStar,
  IconUsers,
  IconWallet,
  IconStarFilled,
  IconStarHalfFilled,
} from "@tabler/icons-react";
import { formatDistanceToNowStrict, format } from "date-fns";
import useCountdown from "@/hooks/use-countdown";
import { calculateDiscountPrice, getDiscountInfo } from "@/lib/utils";
import ProductCard from "@/components/globals/product-card";
import ImageZoom from "@/components/globals/image-zoom";
import Link from "next/link";
import { ChatWrapper } from "./chat-wrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Client = ({
  vendor,
  followersCount,
  averageRating,
  totalReviews,
  totalSold
}: {
  vendor: SellerWithProps | null;
  followersCount: number;
  averageRating: number;
  totalReviews: number;
  totalSold: number;
}) => {
  const [activeTab, setActiveTab] = useState<IItem["value"]>("Products");
  const [chatPerformance, setChatPerformance] =
    React.useState<ChatPerformanceData | null>(null);
  const [openAttachment, setOpenAttachment] = React.useState({
    toggle: false,
    data: "",
  });
  const [isLoadingChatPerformance, setIsLoadingChatPerformance] =
    React.useState(true);
  const [isChatOpen, setIsChatOpen] = React.useState(false);

  const isOnline = true;
  const statusText = "Online";
  const isLoadingFollow = false;
  const isFollowing = false;
  const isLoadingVendor = false;

  React.useEffect(() => {
    if (!vendor?.id) {
      setIsLoadingChatPerformance(false);
      return;
    }

    // Function to fetch the chat performance data
    const fetchChatPerformanceData = async () => {
      try {
        const response = await fetch(
          `https://onemarketphilippines.com/api/v1/vendor/${vendor?.id}/chat-performance`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch chat performance data.");
        }
        const result = await response.json();
        if (result.success) {
          setChatPerformance(result.data);
        } else {
          console.error(result.message);
        }
      } catch (err) {
        console.error("Error fetching chat performance:", err);
      } finally {
        setIsLoadingChatPerformance(false);
      }
    };

    fetchChatPerformanceData();
  }, [vendor?.id]);

  const CountdownComponent = ({ endDate }: { endDate: Date }) => {
    const countdown = useCountdown(endDate);

    if (!countdown) {
      return null; // Or a loading state
    }

    // Check if countdown is finished
    const isExpired =
      countdown.days +
        countdown.hours +
        countdown.minutes +
        countdown.seconds <=
      0;

    return (
      <p className="text-red-700 text-xs mt-1 font-medium whitespace-nowrap">
        {isExpired
          ? "Expired"
          : `Expires in ${countdown.days}d ${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`}
      </p>
    );
  };

  const ProgressComponent = ({
    claimed,
    total,
  }: {
    claimed: number;
    total: number;
  }) => {
    const progressValue = (claimed / total) * 100;
    const progressText = `${Math.round(progressValue)}% claimed`;

    return (
      <div className="flex items-center w-full gap-2">
        <Progress className="h-[5px]" value={progressValue} />
        <p className="text-red-700 text-xs font-medium whitespace-nowrap">
          {progressText}
        </p>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Products":
        return (
          <div className="pt-10">
            <div>
              <h3 className="text-xl font-bold tracking-tight">Vouchers</h3>
              {isLoadingVendor ? (
                <div className="mt-5 grid lg:grid-cols-3 grid-cols-1 gap-4 lg:gap-6">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-60 rounded-lg" />
                  ))}
                </div>
              ) : vendor?.coupon && vendor?.coupon.length > 0 ? (
                <Carousel
                  opts={{
                    align: "start",
                  }}
                  className="w-full mt-5"
                >
                  <CarouselContent>
                    {vendor.coupon.map((coupon, index) => {
                      const claimedQuantity = coupon.claimedQuantity || 0;
                      const totalQuantity = coupon.claimableQuantity;
                      return (
                        <CarouselItem
                          key={index}
                          className="lg:basis-1/3 basis-full"
                        >
                          <div className="relative h-36 border-[#800020]/30 pl-3 border rounded-lg bg-[#800020]/5 w-full">
                            <span className="text-[10px] absolute top-0 left-0 font-medium bg-[#800020] text-white px-2 py-1 rounded-br-lg rounded-tl-lg">
                              Limited Redemption
                            </span>
                            <div className="bg-white rounded-full w-[14px] h-[8px] absolute border border-[#800020]/30 -top-1 left-36"></div>
                            <div className="bg-white rounded-full w-[14px] h-[8px] absolute border border-[#800020]/30 -bottom-1 left-36"></div>
                            <div className="flex items-center h-full">
                              <div className="border-r-[2px] border-dashed border-[#800020]/20 pr-5 py-11 h-full">
                                {coupon.type === "Money off (min.spend)" ? (
                                  <h3 className="text-[#800020] text-center text-4xl font-black tracking-tighter">
                                    <span className="text-xl">₱</span>
                                    {coupon.discountAmount?.toLocaleString()}
                                  </h3>
                                ) : (
                                  <h3 className="text-[#800020] text-center text-4xl font-black tracking-tighter">
                                    {coupon.discountAmount}
                                    <span className="text-xl">% OFF</span>
                                  </h3>
                                )}
                                {coupon.minimumSpend && (
                                  <p className="text-sm whitespace-nowrap text-center text-red-700 mt-1 font-medium">
                                    Min. spend ₱
                                    {coupon.minimumSpend.toLocaleString()}
                                  </p>
                                )}
                              </div>
                              <div className="pl-5 w-full pr-5">
                                <div className="flex w-full items-center justify-between">
                                  <p className="text-2xl font-bold tracking-tight text-[#800020]">
                                    {coupon.name}
                                  </p>
                                  <p className="text-xs text-red-600 px-1.5 py-1 rounded-lg bg-[#800020]/15 font-medium">
                                    T&C
                                  </p>
                                </div>
                                <p className="text-red-700 text-sm">
                                  {vendor.name}
                                </p>
                                <div className="flex items-start justify-between mt-2">
                                  <div>
                                    <ProgressComponent
                                      claimed={claimedQuantity}
                                      total={totalQuantity}
                                    />
                                    <CountdownComponent
                                      endDate={coupon.endDate}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CarouselItem>
                      );
                    })}
                  </CarouselContent>
                </Carousel>
              ) : (
                <p className="mt-5 text-gray-500">No vouchers available</p>
              )}
            </div>
            <div className="flex items-center mt-10 justify-between">
              <h3 className="text-xl font-bold tracking-tight">Products</h3>
              <Link
                href={`/sellers/${vendor?.id}/products`}
                className="flex hover:underline items-center gap-1"
              >
                <p>View all products</p>
                <ChevronRight className="size-4 inline-block" />
              </Link>
            </div>
            <div className="mt-5 grid lg:grid-cols-5 grid-cols-1 gap-5">
              {isLoadingVendor ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-60 rounded-lg" />
                ))
              ) : vendor?.product && vendor?.product.length > 0 ? (
                vendor.product.map((product) => {
                  const price =
                    product.variants.length > 0
                      ? Math.min(...product.variants.map((v) => v.price))
                      : product.price || 0;

                  const discounts = getDiscountInfo(product);
                  const hasDiscount = discounts.length > 0;
                  const discountPrice = calculateDiscountPrice(
                    price,
                    discounts
                  );

                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      price={price}
                      discounts={discounts}
                      hasDiscount={hasDiscount}
                      viewMode={"grid4"}
                      discountPrice={discountPrice}
                    />
                  );
                })
              ) : (
                <div className="text-center col-span-full py-12">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <Image
                      src="/images/empty.svg"
                      alt="No products found"
                      width={200}
                      height={200}
                    />
                    <h3 className="text-xl font-medium text-gray-700">
                      No products available
                    </h3>
                    <p className="text-gray-500">
                      It seems like this vendor has no products listed at the
                      moment.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case "Policies":
        return (
          <div className="pt-10">
            <h3 className="text-xl font-bold tracking-tight">Policies</h3>
            {vendor?.vendorPolicies && vendor.vendorPolicies.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {vendor.vendorPolicies.map((policy) => (
                  <AccordionItem key={policy.id} value={policy.id}>
                    <AccordionTrigger className="font-semibold text-lg">
                      {policy.name}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      <div
                        className="space-y-4"
                        dangerouslySetInnerHTML={{
                          __html: policy.content || "",
                        }}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-12">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <Image
                    src="/images/empty.svg"
                    alt="No policies found"
                    width={200}
                    height={200}
                  />
                  <h3 className="text-xl font-medium text-gray-700">
                    No policies available
                  </h3>
                  <p className="text-gray-500">
                    It seems like this vendor has not provided any policies yet.
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      case "FAQs":
        return (
          <div className="pt-10">
            <h3 className="text-xl font-bold tracking-tight">
              Frequently Asked Questions
            </h3>
            {vendor?.vendorFaqs && vendor.vendorFaqs.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {vendor.vendorFaqs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="font-semibold text-lg">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      <div
                        className="space-y-4"
                        dangerouslySetInnerHTML={{ __html: faq.answer || "" }}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-12">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <Image
                    src="/images/empty.svg"
                    alt="No FAQs found"
                    width={200}
                    height={200}
                  />
                  <h3 className="text-xl font-medium text-gray-700">
                    No FAQs available
                  </h3>
                  <p className="text-gray-500">
                    It seems like this vendor has not provided any FAQs yet.
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      case "Reviews":
        return (
          <div className="pt-10">
            <h3 className="text-xl font-bold tracking-tight mb-5">Reviews</h3>
            {isLoadingVendor ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ))}
              </div>
            ) : vendor?.vendorReview && vendor.vendorReview.length > 0 ? (
              <div className="space-y-4">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {vendor.vendorReview.map((review: any) => {
                  const fullStars = Math.floor(review.rating);
                  const hasHalfStar = review.rating % 1 >= 0.5;
                  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
                  const reviewerName = review.isAnonymous
                    ? "Anonymous"
                    : review.user.firstName && review.user.lastName
                      ? `${review.user.firstName} ${review.user.lastName}`
                      : review.user.email.split("@")[0];

                  return (
                    <div
                      key={review.id}
                      className="border rounded-lg p-4 bg-white shadow-sm"
                    >
                      <div className="flex items-start gap-4">
                        <Avatar className="size-10">
                          <AvatarImage
                            src={
                              review.isAnonymous
                                ? undefined
                                : review.user.image || undefined
                            }
                            alt={reviewerName}
                          />
                          <AvatarFallback>
                            {review.isAnonymous
                              ? "A"
                              : reviewerName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-semibold text-base">
                                {reviewerName}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-0.5">
                                  {Array.from({ length: fullStars }).map(
                                    (_, i) => (
                                      <IconStarFilled
                                        key={`full-${i}`}
                                        className="size-4 text-yellow-500"
                                      />
                                    )
                                  )}
                                  {hasHalfStar && (
                                    <IconStarHalfFilled className="size-4 text-yellow-500" />
                                  )}
                                  {Array.from({ length: emptyStars }).map(
                                    (_, i) => (
                                      <IconStar
                                        key={`empty-${i}`}
                                        className="size-4 text-yellow-500 fill-yellow-500/20"
                                      />
                                    )
                                  )}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {format(
                                    new Date(review.createdAt),
                                    "MMM d, yyyy"
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
                            {review.review}
                          </p>
                          {review.images && review.images.length > 0 && (
                            <div className="grid grid-cols-4 gap-2 mt-3">
                              {review.images.map((image: string, index: number) => (
                                <div
                                  key={index}
                                  className="relative h-20 w-full rounded-md overflow-hidden cursor-pointer border"
                                  onClick={() =>
                                    setOpenAttachment({
                                      toggle: true,
                                      data: image,
                                    })
                                  }
                                >
                                  <Image
                                    src={image}
                                    alt={`Review image ${index + 1}`}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <Image
                    src="/images/empty.svg"
                    alt="No reviews found"
                    width={200}
                    height={200}
                  />
                  <h3 className="text-xl font-medium text-gray-700">
                    No reviews available
                  </h3>
                  <p className="text-gray-500">
                    This vendor hasn&apos;t received any reviews yet.
                  </p>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <>
      {openAttachment.toggle && (
        <ImageZoom
          src={openAttachment.data}
          onClose={() => setOpenAttachment({ toggle: false, data: "" })}
        />
      )}
      <div className="grid mb-5 lg:grid-cols-13 grid-cols-1 gap-5">
        <div className="lg:col-span-4">
          <div className="flex flex-col items-start bg-gradient-to-r from-[#800020] to-[#a01530] rounded-md p-4 ring-2 ring-white/10 shadow-lg">
            {isLoadingVendor ? (
              <div className="flex items-start space-x-4">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <div
                  className={`relative ${vendor?.isPremium ? "size-22" : "size-20"} rounded-full overflow-hidden border-2 border-green-200`}
                >
                  {vendor?.image ? (
                    <Image
                      src={vendor?.image || ""}
                      alt={vendor?.name || "Vendor Image"}
                      layout="fill"
                      objectFit="cover"
                    />
                  ) : (
                    <div>
                      {vendor?.name?.charAt(0).toUpperCase() || "V"}
                    </div>
                  )}
                </div>
                <div>
                  {vendor?.isPremium && (
                    <div className="bg-gradient-to-r mb-1 flex items-center gap-1 w-[80%] from-white/40 text-white to-transparent font-bold text-[10px] px-1.5 py-0.5 rounded-xs">
                      Verified{" "}
                      <span className="bg-blue-600 text-[8px] rounded-xs text-white px-1 py-[1px]">
                        PRO
                      </span>
                    </div>
                  )}
                  <h2 className="text-white text-lg font-semibold">
                    {vendor?.name || "Vendor Name"}
                  </h2>

                  <div className="flex items-center gap-1 mt-1">
                    {isOnline && (
                      <div className={`bg-green-500 rounded-full size-2`} />
                    )}
                    <p className="text-xs text-gray-300">{statusText}</p>
                  </div>
                </div>
              </div>
            )}
            <div className="flex items-center w-full space-x-2 mt-4">
              {isLoadingVendor ? (
                <>
                  <Skeleton className="h-8 w-24 rounded-full" />
                  <Skeleton className="h-8 w-24 rounded-full" />
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    disabled={isLoadingFollow}
                    className={`flex cursor-pointer flex-1 justify-center rounded-none items-center space-x-1 px-3 py-1 text-sm transition-colors border
                            ${
                              isFollowing
                                ? "bg-white text-black hover:bg-gray-200 border-white"
                                : "bg-transparent text-white hover:bg-white hover:text-black border-white"
                            }
                          `}
                  >
                    {isLoadingFollow ? (
                      <Loader2 className="animate-spin text-sm" />
                    ) : isFollowing ? (
                      <CheckCircle className="text-sm" />
                    ) : (
                      <XCircle className="text-sm" />
                    )}
                    <span>
                      {isLoadingFollow
                        ? "Loading..."
                        : isFollowing
                          ? "Activate"
                          : "Deactivate"}
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setIsChatOpen(true)}
                    className="flex cursor-pointer flex-1 rounded-none justify-center items-center space-x-1 text-white hover:text-black px-3 py-1 bg-transparent border border-white text-sm hover:bg-accent transition-colors"
                  >
                    <FaComments className="text-xs" />
                    <span>Chat</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="lg:col-span-3 ml-5 mt-5 space-y-8">
          {isLoadingVendor ? (
            <>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-6 w-6 rounded-md" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-6 w-6 rounded-md" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-6 w-6 rounded-md" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-2">
                <IconBuildingStore className="text-gray-500" />
                <div className="flex items-center space-x-2">
                  <p className="text-base text-gray-500">Products:</p>
                  <p className="font-medium text-base text-[#800020]">
                    {vendor?.product.length}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <IconUsers className="text-gray-500" />
                <div className="flex items-center space-x-2">
                  <p className="text-base text-gray-500">Followers:</p>
                  <p className="font-medium text-base text-[#800020]">
                    {followersCount ?? 0}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <IconMessage className="text-gray-500" />
                <div className="flex items-center space-x-2">
                  <p className="text-base text-gray-500">Chat Performance:</p>
                  {isLoadingChatPerformance ? (
                    <Skeleton className="h-4 w-[120px]" />
                  ) : (
                    <p className="font-medium text-base text-[#800020]">
                      {chatPerformance?.chatPerformance || "N/A (No data)"}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="lg:col-span-3 ml-5 mt-5 space-y-8">
          {isLoadingVendor ? (
            <>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-6 w-6 rounded-md" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-6 w-6 rounded-md" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-6 w-6 rounded-md" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-2">
                <IconWallet className="text-gray-500" />
                <div className="flex items-center space-x-2">
                  <p className="text-base text-gray-500">Sold:</p>
                  <p className="font-medium text-base text-[#800020]">
                    {(totalSold ?? 0).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <IconStar className="text-gray-500" />
                <div className="flex items-center space-x-2">
                  <p className="text-base text-gray-500">Rating:</p>
                  <p className="font-medium text-base text-[#800020]">
                    {(totalReviews ?? 0) > 0
                      ? `${(averageRating ?? 0).toFixed(1)} (${totalReviews} ${totalReviews === 1 ? 'Rating' : 'Ratings'})`
                      : "0 (0 Ratings)"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <IconClock className="text-gray-500" />
                <div className="flex items-center space-x-2">
                  <p className="text-base text-gray-500">Joined:</p>
                  <p className="font-medium text-base text-[#800020]">
                    {formatDistanceToNowStrict(vendor?.createdAt ?? new Date())}{" "}
                    ago
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="lg:col-span-3 ml-5 mt-5 space-y-8">
          {isLoadingVendor ? (
            <>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-6 w-6 rounded-md" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-6 w-6 rounded-md" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-6 w-6 rounded-md" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-2">
                <IconId className="text-gray-500" />
                <div className="flex items-center space-x-2">
                  <p className="text-base text-gray-500">Valid ID:</p>
                  <span className="font-medium text-base text-[#800020]">
                    {vendor?.identityType || "N/A"}
                  </span>
                  {vendor?.identity && (
                    <IconShare2
                      onClick={() =>
                        setOpenAttachment({
                          toggle: !openAttachment.toggle,
                          data: vendor.identity as string,
                        })
                      }
                      className="text-gray-500 size-4 cursor-pointer hover:text-gray-700"
                    />
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <IconClipboardText className="text-gray-500" />
                <div className="flex items-center space-x-2">
                  <p className="text-base text-gray-500">BIR:</p>
                  <span className="font-medium text-base text-[#800020]">
                    {vendor?.bir ? "BIR" : "N/A"}
                  </span>
                  {vendor?.bir && (
                    <IconShare2
                      onClick={() =>
                        setOpenAttachment({
                          toggle: !openAttachment.toggle,
                          data: vendor.bir as string,
                        })
                      }
                      className="text-gray-500 size-4 cursor-pointer hover:text-gray-700"
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <IconBuilding className="text-gray-500" />
                <div className="flex items-center space-x-2">
                  <p className="text-base text-gray-500">Business Permit:</p>
                  <span className="font-medium text-base text-[#800020]">
                    {vendor?.barangayBusinessPermit
                      ? "Business Permit"
                      : "N/A"}
                  </span>
                  {vendor?.barangayBusinessPermit && (
                    <IconShare2
                      onClick={() =>
                        setOpenAttachment({
                          toggle: !openAttachment.toggle,
                          data: vendor.barangayBusinessPermit as string,
                        })
                      }
                      className="text-gray-500 size-4 cursor-pointer hover:text-gray-700"
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="pb-20">{renderContent()}</div>

      <ChatWrapper
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </>
  );
};

export default Client;
