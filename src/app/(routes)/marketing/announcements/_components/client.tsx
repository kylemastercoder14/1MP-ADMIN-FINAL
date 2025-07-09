"use client";

import { useState } from "react";
import { Announcement } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

const PAGE_SIZE = 4;

const Client = ({
  data,
}: {
  data: Announcement[];
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  if (!data.length)
    return (
      <p className="text-center h-[60vh] flex items-center justify-center text-gray-500">No announcements available.</p>
    );

  // Calculate total pages
  const totalPages = Math.ceil(data.length / PAGE_SIZE);

  // Get paginated data
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedNews = data.slice(startIndex, startIndex + PAGE_SIZE);

  const latestNews = paginatedNews[0]; // Latest on the current page
  const otherNews = paginatedNews.slice(1); // Other news

  return (
    <div className="mt-6">
      {/* News Section */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Latest News - Bigger Section */}
        {latestNews && (
          <div className="lg:col-span-3 relative">
            <Link
              href={`/marketing/announcements/${latestNews.id}`}
              className="block"
            >
              <div className="relative w-full h-[400px] rounded-xl overflow-hidden">
                <Image
                  src={latestNews.images[0] || "/placeholder.jpg"}
                  alt={latestNews.title}
                  layout="fill"
                  objectFit="cover"
                  className="hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4 text-white">
                  <div
                    className="mt-2 line-clamp-4"
                    dangerouslySetInnerHTML={{ __html: latestNews.content }}
                  />
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Other News - Smaller Cards */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {otherNews.map((news) => (
              <Link
                key={news.id}
                href={`/marketing/announcements/${news.id}`}
                className="block"
              >
                <div className="flex items-center gap-4">
                  <div className="w-[30%] h-[150px] relative rounded-lg overflow-hidden">
                    <Image
                      src={news.images[0] || "/placeholder.jpg"}
                      alt={news.title}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="w-[70%]">
                    <h3 className="text-md font-semibold">{news.title}</h3>
                    <div
                      className="mt-2 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: news.content }}
                    />
                    <p className="text-gray-500 text-sm">
                      {new Date(news.createdAt).toDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {/* Pagination Controls */}
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
      </div>
    </div>
  );
};

export default Client;
