"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import "../../../styles/post-detail.css";
import { useAppDispatch } from "@/redux/hooks";
import { getPostBySlug } from "@/redux/slices/postSlice";
import { createComment, getCommentsByPost } from "@/redux/slices/commentSlice";
import {
  CommentListSelector,
  LoadingCommentSelector,
  PostDetailSelector,
  PostLoadingSelector,
} from "@/redux/selector";
import CommentForm, {
  type CommentFormValues,
} from "@/components/comments/CommentForm";
import CommentItem from "@/components/comments/CommentItem";

type TocItem = {
  id: string;
  text: string;
  level: "h2" | "h3";
};

export default function PostDetailPage() {
  const dispatch = useAppDispatch();
  const params = useParams();
  const slug = params?.slug as string;

  const postDetail = useSelector(PostDetailSelector);
  const loading = useSelector(PostLoadingSelector);

  const commentsData = useSelector(CommentListSelector);
  const commentLoading = useSelector(LoadingCommentSelector);

  const contentRef = useRef<HTMLElement | null>(null);
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(
    null,
  );

  const relatedPosts = [
    {
      id: "2",
      slug: "thiet-ke-landing-page-sang-sach-va-de-doc",
      title: "Thiết kế landing page sáng, sạch và dễ đọc",
      category: "UI/UX",
    },
    {
      id: "3",
      slug: "jwt-auth-co-ban-cho-blog-cms-ca-nhan",
      title: "JWT auth cơ bản cho blog CMS cá nhân",
      category: "Backend",
    },
    {
      id: "4",
      slug: "to-chuc-auth-flow-cho-frontend-voi-redux-toolkit",
      title: "Tổ chức auth flow cho frontend với Redux Toolkit",
      category: "Frontend",
    },
  ];

  const createHeadingId = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  };

  useEffect(() => {
    if (slug) {
      dispatch(getPostBySlug({ slug }));
    }
  }, [dispatch, slug]);

  useEffect(() => {
    if (postDetail?.id) {
      dispatch(getCommentsByPost({ postId: postDetail.id }));
    }
  }, [dispatch, postDetail?.id]);

  useEffect(() => {
    if (!contentRef.current) return;

    const headings = contentRef.current.querySelectorAll("h2, h3");
    const items: TocItem[] = Array.from(headings).map((heading) => {
      const text = heading.textContent || "";
      const id = heading.id || createHeadingId(text);
      heading.id = id;

      return {
        id,
        text,
        level: heading.tagName.toLowerCase() as "h2" | "h3",
      };
    });

    setTocItems(items);
  }, [postDetail]);

  const handleSubmitComment = async (
    values: CommentFormValues,
  ): Promise<void> => {
    if (!postDetail?.id) return;

    try {
      await dispatch(
        createComment({
          postId: postDetail.id,
          content: values.content,
        }),
      ).unwrap();

      await dispatch(getCommentsByPost({ postId: postDetail.id })).unwrap();
    } catch (error) {
      console.error("Tạo comment thất bại:", error);
      throw error;
    }
  };

  const handleReplyClick = (commentId: string) => {
    setReplyingCommentId(commentId);
  };

  const handleCancelReply = () => {
    setReplyingCommentId(null);
  };

  const handleSubmitReply = async (
    commentId: string,
    values: CommentFormValues,
  ): Promise<void> => {
    if (!postDetail?.id) return;

    try {
      await dispatch(
        createComment({
          postId: postDetail.id,
          content: values.content,
          parentId: commentId,
        }),
      ).unwrap();

      setReplyingCommentId(null);
      await dispatch(getCommentsByPost({ postId: postDetail.id })).unwrap();
    } catch (error) {
      console.error("Tạo reply thất bại:", error);
      throw error;
    }
  };

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
            {tocItems.length > 0 ? (
              tocItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={item.level === "h3" ? "sub-link" : ""}
                >
                  {item.text}
                </a>
              ))
            ) : (
              <>
                <a href="#content">Nội dung</a>
                <a href="#comments">Bình luận</a>
                <a href="#related">Liên quan</a>
              </>
            )}
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

        <article className="post-content" id="content" ref={contentRef}>
          <section>
            <h2>Giới thiệu</h2>
            <p>
              {postDetail.excerpt ||
                "Bài viết này trình bày chi tiết quá trình xây dựng hệ thống, tổ chức mã nguồn và triển khai các luồng xử lý chính."}
            </p>
          </section>

          <section>
            <h2>Tổng quan bài viết</h2>
            <p>{postDetail.content}</p>
          </section>

          <section>
            <h2>Cách tổ chức hệ thống</h2>
            <p>
              Nội dung bài viết tập trung vào cách chia layer rõ ràng giữa
              frontend, backend, route, middleware, service và database để dễ mở
              rộng về sau.
            </p>
          </section>

          <section>
            <h3>Xử lý auth</h3>
            <p>
              Phần auth thường được tách qua middleware để xác thực token trước
              khi controller xử lý nghiệp vụ chính.
            </p>
          </section>

          <section>
            <h3>Quản lý state</h3>
            <p>
              Với frontend, Redux Toolkit giúp tách rõ async thunk, slice,
              selector và trạng thái loading, error, success một cách gọn hơn.
            </p>
          </section>

          <section>
            <h2>Kết quả triển khai</h2>
            <p>
              Sau khi hoàn thiện, hệ thống có thể hiển thị bài viết theo slug,
              lấy danh sách comment theo post, và giữ luồng dữ liệu nhất quán
              giữa store và giao diện.
            </p>
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
              href={`/posts/${item.slug}`}
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

        <CommentForm
          loading={commentLoading}
          onSubmit={handleSubmitComment}
          submitText="Gửi bình luận"
        />

        <div className="comment-list">
          {commentLoading ? (
            <p>Đang tải bình luận...</p>
          ) : commentsData.length > 0 ? (
            commentsData.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                replyingCommentId={replyingCommentId}
                onReply={handleReplyClick}
                onCancelReply={handleCancelReply}
                onSubmitReply={handleSubmitReply}
                replyLoading={commentLoading}
              />
            ))
          ) : (
            <p>Chưa có bình luận nào.</p>
          )}
        </div>
      </section>
    </main>
  );
}
