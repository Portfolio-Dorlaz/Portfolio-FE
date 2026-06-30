"use client";

import Header from "@/components/Header";
import PostCard from "@/components/PostCard";
import "../../styles/posts-page.css";
import { Button } from "antd";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getAllPosts } from "@/redux/slices/postSlice";
import {
  PostsSelector,
  PostLoadingSelector,
  PostErrorSelector,
} from "@/redux/selector";

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

  console.log("Posts: ", posts);

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
    <main className="posts-page">
      <section className="posts-hero">
        <div className="posts-hero-copy">
          <p className="posts-kicker">Writing archive</p>
          <h1>Bài viết về web, gameplay systems và portfolio building.</h1>
          <p className="posts-subtext">
            Tập hợp các ghi chú ngắn, bài viết kỹ thuật và chia sẻ về cách tôi
            xây dựng sản phẩm, tổ chức hệ thống và tối ưu trải nghiệm.
          </p>
        </div>
      </section>

      <section className="posts-toolbar">
        <div className="toolbar-search">
          <input
            type="text"
            placeholder="Tìm bài viết..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="toolbar-filters">
          {categories.map((category) => (
            <Button
              key={category}
              className={`filter-chip ${
                activeCategory === category ? "active" : ""
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </section>

      {loading && <p className="posts-status">Đang tải bài viết...</p>}

      {error && !loading && (
        <p className="posts-status posts-status-error">{error.message}</p>
      )}

      {!loading && !error && filteredPosts.length > 0 && featuredPost && (
        <>
          <section className="featured-post-section">
            <div className="section-head">
              <p className="section-tag">Featured</p>
              <h2>Bài viết nổi bật</h2>
            </div>

            <article className="featured-post-card">
              <div className="featured-post-meta">
                <span className="post-category">{featuredPost.category}</span>
                {featuredPost.createdAt && (
                  <span>{featuredPost.createdAt}</span>
                )}
              </div>

              <h3>{featuredPost.title}</h3>
              <p>{featuredPost.excerpt}</p>

              <Link
                href={`/posts/${featuredPost.slug}`}
                className="read-post-link"
              >
                Đọc bài viết
              </Link>
            </article>
          </section>

          <section className="posts-list-section">
            <div className="section-head">
              <p className="section-tag">All posts</p>
              <h2>Tất cả bài viết</h2>
            </div>

            <div className="posts-grid">
              {otherPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        </>
      )}

      {!loading && !error && filteredPosts.length === 0 && (
        <section className="posts-list-section">
          <div className="section-head">
            <p className="section-tag">No results</p>
            <h2>Không có bài viết phù hợp</h2>
          </div>
        </section>
      )}
    </main>
  );
}
