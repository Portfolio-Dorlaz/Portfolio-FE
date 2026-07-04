"use client";

import PostCard from "@/components/PostCard";
import { Button } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getAllPosts } from "@/redux/slices/postSlice";
import {
  PostsSelector,
  PostLoadingSelector,
  PostErrorSelector,
} from "@/redux/selector";
import Link from "next/link";

export default function PostsPage() {
  const dispatch = useAppDispatch();

  const posts = useAppSelector(PostsSelector);
  const loading = useAppSelector(PostLoadingSelector);
  const error = useAppSelector(PostErrorSelector);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tất cả");

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  const categories = useMemo(() => {
    const rawCategories = posts.map((post) => post.category);
    return ["Tất cả", ...Array.from(new Set(rawCategories))];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchCategory =
        activeCategory === "Tất cả" || post.category === activeCategory;

      const keyword = search.trim().toLowerCase();
      const matchSearch =
        !keyword ||
        post.title.toLowerCase().includes(keyword) ||
        post.excerpt.toLowerCase().includes(keyword) ||
        post.category.toLowerCase().includes(keyword);

      return matchCategory && matchSearch;
    });
  }, [posts, activeCategory, search]);

  const featuredPost = filteredPosts[0];
  const otherPosts = filteredPosts.slice(1);

  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f7fbff_0%,#edf4ff_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.10),transparent_24%)]" />
      <section className="mx-auto max-w-[1180px] px-6 pb-8 pt-[72px] max-[640px]:px-4">
        <div className="rounded-[28px] border border-white/80 bg-white/72 px-8 py-10 shadow-[0_24px_80px_rgba(37,99,235,0.08)] backdrop-blur max-[640px]:px-5 max-[640px]:py-7">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-blue-600">
            Writing archive
          </p>
          <h1 className="mb-4 max-w-[12ch] text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.98] tracking-[-0.04em] text-slate-900 max-[960px]:max-w-[14ch] max-[640px]:text-[clamp(2.1rem,11vw,3.2rem)]">
            Bài viết về web, gameplay systems và portfolio building.
          </h1>
          <p className="max-w-[62ch] leading-[1.85] text-slate-600">
            Tập hợp các ghi chú ngắn, bài viết kỹ thuật và chia sẻ về cách tôi
            xây dựng sản phẩm, tổ chức hệ thống và tối ưu trải nghiệm.
          </p>
        </div>
      </section>

      <section className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-[18px] px-6 pb-8 pt-1 max-[640px]:px-4">
        <div className="w-full max-w-[360px] flex-1 max-[960px]:max-w-full">
          <input
            type="text"
            placeholder="Tìm bài viết..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-[13px] text-slate-900 outline-none placeholder:text-slate-400 shadow-[0_10px_24px_rgba(15,23,42,0.04)] focus:border-blue-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {categories.map((category) => {
            const active = activeCategory === category;

            return (
              <Button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`!rounded-full !px-[14px] !py-[10px] !font-semibold !shadow-none ${
                  active
                    ? "!border-blue-200 !bg-blue-50 !text-blue-700"
                    : "!border-slate-200 !bg-white !text-slate-600 hover:!border-blue-200 hover:!bg-blue-50 hover:!text-blue-700"
                }`}
              >
                {category}
              </Button>
            );
          })}
        </div>
      </section>

      {loading && (
        <p className="mx-auto max-w-[1180px] px-6 pb-8 text-slate-600 max-[640px]:px-4">
          Đang tải bài viết...
        </p>
      )}

      {error && !loading && (
        <p className="mx-auto max-w-[1180px] px-6 pb-8 text-rose-500 max-[640px]:px-4">
          {error.message}
        </p>
      )}

      {!loading && !error && filteredPosts.length > 0 && featuredPost && (
        <>
          <section className="mx-auto max-w-[1180px] px-6 pb-14 pt-2 max-[640px]:px-4">
            <div className="mb-[22px]">
              <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-blue-600">
                Featured
              </p>
              <h2 className="m-0 text-[2rem] tracking-[-0.03em] text-slate-900">
                Bài viết nổi bật
              </h2>
            </div>

            <article className="rounded-[28px] border border-white/80 bg-white/92 p-7 shadow-[0_24px_70px_rgba(37,99,235,0.08)] max-[640px]:p-[22px]">
              <div className="mb-4 flex flex-wrap items-center gap-2.5 text-sm text-slate-500">
                <span className="font-bold text-blue-700">
                  {featuredPost.category}
                </span>
                {featuredPost.createdAt && (
                  <span>{featuredPost.createdAt}</span>
                )}
              </div>

              <h3 className="mb-[14px] text-[clamp(1.5rem,2.5vw,2.2rem)] leading-[1.2] text-slate-900">
                {featuredPost.title}
              </h3>
              <p className="mb-[18px] max-w-[64ch] leading-[1.82] text-slate-600">
                {featuredPost.excerpt}
              </p>

              <Link
                href={`/posts/${featuredPost.slug}`}
                className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-4 py-[11px] font-bold text-white no-underline shadow-[0_10px_24px_rgba(37,99,235,0.2)] hover:bg-blue-700"
              >
                Đọc bài viết
              </Link>
            </article>
          </section>

          <section className="mx-auto max-w-[1180px] px-6 pb-14 pt-2 max-[640px]:px-4">
            <div className="mb-[22px]">
              <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-blue-600">
                All posts
              </p>
              <h2 className="m-0 text-[2rem] tracking-[-0.03em] text-slate-900">
                Tất cả bài viết
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-5 max-[1080px]:grid-cols-2 max-[960px]:grid-cols-1">
              {otherPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        </>
      )}

      {!loading && !error && filteredPosts.length === 0 && (
        <section className="mx-auto max-w-[1180px] px-6 pb-14 pt-2 max-[640px]:px-4">
          <div className="rounded-[24px] border border-white/80 bg-white/92 p-6 shadow-[0_12px_30px_rgba(37,99,235,0.06)]">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-blue-600">
              No results
            </p>
            <h2 className="m-0 text-[2rem] tracking-[-0.03em] text-slate-900">
              Không có bài viết phù hợp
            </h2>
          </div>
        </section>
      )}
    </main>
  );
}
