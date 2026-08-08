import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ListingCategory,
  ListingCondition,
  MarketplaceListing,
} from "./data";

type MarketState = {
  listings: MarketplaceListing[];
  addListing: (input: {
    title: string;
    description: string;
    category: ListingCategory;
    condition: ListingCondition;
    district: string;
    priceNote: string;
    contact: string;
    authorName: string;
  }) => string;
  markSold: (id: string) => void;
  removeListing: (id: string) => void;
};

function id() {
  return `m_${Math.random().toString(36).slice(2, 10)}`;
}

export const useMarketplaceStore = create<MarketState>()(
  persist(
    (set, get) => ({
      listings: [],
      addListing: (input) => {
        const listingId = id();
        const listing: MarketplaceListing = {
          id: listingId,
          title: input.title.trim(),
          description: input.description.trim(),
          category: input.category,
          condition: input.condition,
          district: input.district,
          priceNote: input.priceNote.trim(),
          contact: input.contact.trim(),
          authorName: input.authorName.trim() || "Misafir",
          createdAt: new Date().toISOString(),
          status: "aktif",
        };
        set({ listings: [listing, ...get().listings] });
        return listingId;
      },
      markSold: (listingId) => {
        set({
          listings: get().listings.map((l) =>
            l.id === listingId ? { ...l, status: "satildi" } : l,
          ),
        });
      },
      removeListing: (listingId) => {
        set({
          listings: get().listings.filter((l) => l.id !== listingId),
        });
      },
    }),
    { name: "konyago-arsiv-market-v2" },
  ),
);
