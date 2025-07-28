"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { NewsWithSections } from "@/types";

// No longer needed for this UI
const PAGE_SIZE = 4;

const Client = ({ data }: { data: NewsWithSections[] }) => {
  // No longer needed for this UI
  const [currentPage, setCurrentPage] = useState(1);

  if (!data || data.length === 0)
    return (
      <p className="text-center h-[60vh] flex items-center justify-center text-gray-500">
        No active news articles available.
      </p>
    );

  const totalPages = Math.ceil(data.length / PAGE_SIZE);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedNews = data.slice(startIndex, startIndex + PAGE_SIZE);
  const latestNews = paginatedNews[0];
  const otherNews = paginatedNews.slice(1);

  // Helper to format date
  const formatDate = (dateString: string | Date) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="mt-6">
      {/* News Section */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Latest News - Bigger Section */}
        {latestNews && (
          <div className="lg:col-span-3">
            <Link
              href={`/marketing/news-center/${latestNews.id}`}
              className="block group" // Added group for hover effects on text
            >
              <div className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={latestNews.thumbnail || "/placeholder.jpg"}
                  alt={latestNews.title}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 group-hover:scale-105"
                  priority // Prioritize loading for the main image
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                  {/* Title */}
                  <h2 className="text-3xl font-bold mb-2 line-clamp-2 group-hover:underline">
                    {latestNews.title}
                  </h2>
                  {/* Author and Date */}
                  <p className="text-sm opacity-90">
                    Admin / {formatDate(latestNews.createdAt)}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Other News - Smaller Cards */}
        <div className="lg:col-span-2 space-y-4">
          {otherNews.map((news) => (
            <Link
              key={news.id}
              href={`/marketing/news-center/${news.id}`}
              className="block group"
            >
              <div className="flex items-center gap-4 border rounded-lg overflow-hidden p-2 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-[120px] h-[90px] relative flex-shrink-0">
                  {" "}
                  {/* Adjusted size */}
                  <Image
                    src={news.thumbnail || "/placeholder.jpg"}
                    alt={news.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
                <div className="flex-1 py-2">
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-1">
                    {news.category.toUpperCase()} | {news.type.toUpperCase()}{" "}
                  </p>
                  {/* Title */}
                  <h3 className="text-base font-semibold mb-1 line-clamp-2 group-hover:underline">
                    {news.title}
                  </h3>
                  {/* Author and Date */}
                  <p className="text-gray-500 text-xs">
                    Admin / {formatDate(news.createdAt)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end mt-6 gap-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-base font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Client;
