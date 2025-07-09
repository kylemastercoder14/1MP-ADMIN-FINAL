/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
import React from "react";
import SignInForm from "@/components/forms/sign-in-form";

const Page = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/main/auth-banner.png"
          fill
          alt="Auth banner"
          className="object-cover blur-sm"
          priority
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/20 to-black/40"></div>
        {/* Additional Dark Overlay for Better Text Visibility */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex items-center px-4 py-8 sm:px-8 md:px-16">
        <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 items-center max-w-[1440px] mx-auto">
          {/* Left Side - Sign In Form */}
          <div className="flex justify-center lg:justify-start lg:col-span-2">
            <div className="w-full max-w-md sm:max-w-lg md:max-w-xl">
              {/* Mobile Logo (Visible only on mobile) */}
              <div className="lg:hidden text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  1 Market Philippines
                </h1>
                <p className="text-gray-200 text-sm sm:text-base">
                  Your trusted marketplace
                </p>
              </div>

              <SignInForm />
            </div>
          </div>

          {/* Right Side - Slogan/Information */}
          <div className="hidden lg:flex flex-col justify-center lg:col-span-2 text-white space-y-6 pr-8 xl:pr-16">
            <div className="space-y-4">
              <h2 className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-300 to-white text-3xl md:text-4xl lg:text-6xl font-sans py-2 font-bold tracking-tight">
                Grow your business with{" "}
                <span className="text-[#800020]">1 Market Philippines</span>{" "}
                today!
              </h2>
              <p className="text-base md:text-lg text-neutral-200 drop-shadow-lg leading-relaxed">
                Your one online place to find{" "}
                <span className="text-[#800020] font-semibold">
                  all businesses
                </span>{" "}
                in your neighborhood. From local shops to service providers, we
                connect you with the best in your area. Discover, shop, and
                support local businesses with ease.
              </p>
            </div>

            <div className="pt-6 border-t border-white/20">
              <p className="text-sm text-gray-300 italic drop-shadow-lg">
                "One community, one market place."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      {/* Hide or reposition these on smaller screens */}
      <div className="hidden md:block absolute top-20 left-10 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
      <div className="hidden md:block absolute bottom-20 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
      <div className="hidden md:block absolute top-1/2 left-1/4 w-20 h-20 bg-green-500/10 rounded-full blur-xl"></div>
    </div>
  );
};

export default Page;
