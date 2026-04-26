import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Review {
  id: string;
  authorName: string;
  segment: string;
  project: string;
  content: string;
  rating: number;
  hidden: boolean;
  sortOrder: number;
  createdAt: string;
}

export type ReviewInput = Omit<Review, "id" | "createdAt" | "sortOrder">;

interface ReviewsContextType {
  reviews: Review[];
  loading: boolean;
  addReview: (data: ReviewInput) => Promise<void>;
  updateReview: (id: string, data: Partial<ReviewInput>) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
}

const ReviewsContext = createContext<ReviewsContextType | null>(null);

const mapRow = (row: any): Review => ({
  id: row.id,
  authorName: row.author_name,
  segment: row.segment ?? "",
  project: row.project ?? "",
  content: row.content,
  rating: row.rating ?? 5,
  hidden: row.hidden ?? false,
  sortOrder: row.sort_order ?? 0,
  createdAt: row.created_at,
});

export const ReviewsProvider = ({ children }: { children: ReactNode }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase
      .from("reviews" as any)
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    setReviews((data ?? []).map(mapRow));
    setLoading(false);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel("reviews-sync")
      .on("postgres_changes", { event: "*", schema: "public", table: "reviews" }, load)
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  const addReview = async (data: ReviewInput) => {
    const maxOrder = reviews.reduce((m, r) => Math.max(m, r.sortOrder), 0);
    await supabase.from("reviews" as any).insert({
      author_name: data.authorName,
      segment: data.segment,
      project: data.project,
      content: data.content,
      rating: data.rating,
      hidden: data.hidden,
      sort_order: maxOrder + 1,
    });
    await load();
  };

  const updateReview = async (id: string, data: Partial<ReviewInput>) => {
    const patch: Record<string, any> = {};
    if (data.authorName !== undefined) patch.author_name = data.authorName;
    if (data.segment !== undefined) patch.segment = data.segment;
    if (data.project !== undefined) patch.project = data.project;
    if (data.content !== undefined) patch.content = data.content;
    if (data.rating !== undefined) patch.rating = data.rating;
    if (data.hidden !== undefined) patch.hidden = data.hidden;
    await supabase.from("reviews" as any).update(patch).eq("id", id);
    await load();
  };

  const deleteReview = async (id: string) => {
    await supabase.from("reviews" as any).delete().eq("id", id);
    await load();
  };

  return (
    <ReviewsContext.Provider value={{ reviews, loading, addReview, updateReview, deleteReview }}>
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = () => {
  const ctx = useContext(ReviewsContext);
  if (!ctx) throw new Error("useReviews must be used within ReviewsProvider");
  return ctx;
};
