"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import "../../../styles/post-detail.css";
import { useAppDispatch } from "@/redux/hooks";
import { getPostBySlug } from "@/redux/slices/postSlice";
import { PostDetailSelector, PostLoadingSelector } from "@/redux/selector";

export default function PostDetailPage() {
  const dispatch = useAppDispatch();
  const params = useParams();
  const slug = params?.slug as string;

  const postDetail = useSelector(PostDetailSelector);
  const loading = useSelector(PostLoadingSelector);

  const relatedPosts = [
    {
      id: "2",
      title: "Thiết kế landing page sáng, sạch và dễ đọc",
      category: "UI/UX",
    },
    {
      id: "3",
      title: "JWT auth cơ bản cho blog CMS cá nhân",
      category: "Backend",
    },
    {
      id: "4",
      title: "Tổ chức auth flow cho frontend với Redux Toolkit",
      category: "Frontend",
    },
  ];

  const comments = [
    {
      id: "1",
      name: "Nguyễn Minh",
      time: "1 giờ trước",
      content:
        "Bài viết rất rõ ràng, đặc biệt là phần tách public route và admin route.",
    },
    {
      id: "2",
      name: "Trần Quốc",
      time: "3 giờ trước",
      content:
        "Mình thích cách bạn giữ auth flow đơn giản, đúng kiểu portfolio project.",
    },
  ];

  useEffect(() => {
    if (slug) {
      dispatch(getPostBySlug({ slug }));
    }
  }, [dispatch, slug]);

  if (loading) {
    return <main className="post-detail-page">Đang tải bài viết...</main>;
  }

  if (!postDetail) {
    return <main className="post-detail-page">Không tìm thấy bài viết.</main>;
  }

  return (
    <main className="post-detail-page">
      <section className="post-hero">
        <div className="post-hero-inner">
          <p className="post-category-label">{postDetail.category}</p>
          <h1>{postDetail.title}</h1>
          <p className="post-lead">
            {postDetail.excerpt ||
              "Bài viết chi tiết về dự án và cách tổ chức hệ thống."}
          </p>

          <div className="post-meta-row">
            <span>
              {postDetail.createdAt
                ? new Date(postDetail.createdAt).toLocaleDateString("vi-VN")
                : "Unknown date"}
            </span>
            <span>6 min read</span>
            <span>By Võ Tấn Tài</span>
          </div>
        </div>
      </section>

      <section className="post-page-nav">
        <div className="post-page-nav-inner">
          <p className="page-nav-label">On this page</p>
          <nav className="page-nav-links">
            <a href="#content">Nội dung</a>
            <a href="#comments">Bình luận</a>
            <a href="#related">Liên quan</a>
          </nav>
        </div>
      </section>

      <section className="post-detail-shell">
        <aside className="post-side-visual">
          <div className="side-visual-card">
            <img
              src="https://picsum.photos/seed/cms-left/420/720"
              alt="Workspace and planning notes for CMS architecture"
            />
          </div>
        </aside>

        <article className="post-content" id="content">
          <section>
            <h2>{postDetail.title}</h2>
            <p>{postDetail.content}</p>
          </section>
        </article>

        <aside className="post-side-visual">
          <div className="side-visual-card">
            <img
              src="https://picsum.photos/seed/cms-right/420/720"
              alt="Developer desk with code editor and system diagrams"
            />
          </div>
        </aside>
      </section>

      <section className="related-posts" id="related">
        <div className="related-head">
          <p className="section-tag">Continue reading</p>
          <h2>Bài viết liên quan</h2>
        </div>

        <div className="related-grid">
          {relatedPosts.map((item) => (
            <Link
              key={item.id}
              href={`/posts/${item.id}`}
              className="related-card"
            >
              <span>{item.category}</span>
              <h3>{item.title}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="post-comments" id="comments">
        <div className="comments-head">
          <p className="section-tag">Discussion</p>
          <h2>Bình luận</h2>
        </div>

        <form className="comment-form">
          <div className="comment-form-row">
            <input type="text" placeholder="Tên của bạn" />
            <input type="email" placeholder="Email" />
          </div>

          <textarea rows={5} placeholder="Viết bình luận của bạn..."></textarea>

          <button type="submit" className="comment-submit-btn">
            Gửi bình luận
          </button>
        </form>

        <div className="comment-list">
          {comments.map((comment) => (
            <article key={comment.id} className="comment-card">
              <div className="comment-top">
                <strong>{comment.name}</strong>
                <span>{comment.time}</span>
              </div>
              <p>{comment.content}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
