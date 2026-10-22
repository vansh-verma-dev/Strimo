import { FaArrowRight } from "react-icons/fa";
import { LiaRupeeSignSolid } from "react-icons/lia";

import offerData from "../data/offer.json";

const SHOP_URL = "https://apexstore-e-commerce-mdrz.onrender.com";

function OfferSection() {
  return (
    <section className="my-6">
      {/* --headline-- */}
      <div className="mb-4 flex items-center justify-between gap-3 px-1">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Strimo Shop</h1>
          <p className="text-sm text-gray-500">
            Top-ups, gift cards and gaming gear at special prices
          </p>
        </div>

        <a
          href={SHOP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex shrink-0 items-center gap-1.5 rounded-2xl bg-purple-50 px-3.5 py-2 text-sm font-medium text-purple-600 transition hover:bg-purple-100"
        >
          <span>View all</span>
          <FaArrowRight className="text-xs transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>

      {/* --offer-cards-- (swipe left / right) */}
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] sm:gap-4 [&::-webkit-scrollbar]:hidden">
        {offerData.map((data) => (
          <a
            key={data.id}
            href={SHOP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group w-[170px] shrink-0 snap-start overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:-translate-y-0.5 hover:shadow-md sm:w-[200px]"
          >
            {/* image */}
            <div className="relative aspect-square bg-gray-50">
              <img
                src={data.image}
                alt={data.title}
                loading="lazy"
                className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
              />

              {data.discount > 0 && (
                <span className="absolute left-2 top-2 rounded-full bg-emerald-500 px-2 py-0.5 text-[11px] font-bold text-white">
                  {data.discount}% OFF
                </span>
              )}
            </div>

            {/* details */}
            <div className="p-3">
              <span className="text-[12px] font-medium text-purple-600">
                {data.game}
              </span>
              <p className="mt-0.5 line-clamp-1 text-sm font-semibold text-gray-900">
                {data.title}
              </p>

              <div className="mt-1.5 flex items-center gap-2">
                <p className="flex items-center text-base font-semibold text-gray-900">
                  <LiaRupeeSignSolid />
                  {data.price}
                </p>
                {data.originalPrice > data.price && (
                  <span className="flex items-center text-xs text-gray-400 line-through">
                    <LiaRupeeSignSolid />
                    {data.originalPrice}
                  </span>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export default OfferSection;