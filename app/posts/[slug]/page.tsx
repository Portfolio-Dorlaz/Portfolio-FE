"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
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
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
        Đang tải bài viết...
      </main>
    );
  }

  if (!postDetail) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
        Không tìm thấy bài viết.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.12),transparent_32%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-5 pb-10 pt-[72px] max-[768px]:px-4 max-[768px]:pb-7 max-[768px]:pt-14">
        <div className="mx-auto max-w-[860px]">
          <p className="mb-[18px] inline-flex items-center rounded-full bg-[rgba(15,118,110,0.1)] px-3 py-1.5 text-[13px] font-bold uppercase tracking-[0.04em] text-teal-700">
            {postDetail.category}
          </p>
          <h1 className="m-0 text-[clamp(34px,5vw,58px)] leading-[1.08] tracking-[-0.03em] text-slate-900">
            {postDetail.title}
          </h1>
          <p className="mt-[18px] max-w-[720px] text-[18px] leading-[1.8] text-slate-600">
            {postDetail.excerpt ||
              "Bài viết chi tiết về dự án và cách tổ chức hệ thống."}
          </p>

          <div className="mt-6 flex flex-wrap gap-x-[18px] gap-y-3 text-sm text-slate-500">
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

      <section className="sticky top-0 z-20 border-b border-slate-200 bg-[rgba(248,250,252,0.9)] backdrop-blur-[10px]">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-5 px-5 py-[14px] max-[768px]:px-4">
          <p className="m-0 text-xs font-bold uppercase tracking-[0.08em] text-teal-700">
            On this page
          </p>
          <nav className="flex flex-wrap gap-x-[18px] gap-y-2">
            {tocItems.length > 0 ? (
              tocItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`text-sm no-underline transition-colors hover:text-teal-700 ${
                    item.level === "h3"
                      ? "text-[13px] text-slate-500"
                      : "text-slate-600"
                  }`}
                >
                  {item.text}
                </a>
              ))
            ) : (
              <>
                <a
                  href="#content"
                  className="text-sm text-slate-600 no-underline transition-colors hover:text-teal-700"
                >
                  Nội dung
                </a>
                <a
                  href="#comments"
                  className="text-sm text-slate-600 no-underline transition-colors hover:text-teal-700"
                >
                  Bình luận
                </a>
                <a
                  href="#related"
                  className="text-sm text-slate-600 no-underline transition-colors hover:text-teal-700"
                >
                  Liên quan
                </a>
              </>
            )}
          </nav>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1320px] grid-cols-[260px_minmax(0,1fr)_260px] gap-6 px-5 pb-0 pt-8 max-[1180px]:grid-cols-1 max-[768px]:px-4">
        <aside className="sticky top-[92px] self-start max-[1180px]:hidden">
          <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
            <img
              src="https://picsum.photos/seed/cms-left/420/720"
              alt="Workspace and planning notes for CMS architecture"
              className="block h-[720px] w-full object-cover"
            />
          </div>
        </aside>

        <article
          className="rounded-[28px] border border-slate-200 bg-white p-10 shadow-[0_14px_40px_rgba(15,23,42,0.05)] max-[1180px]:p-8 max-[768px]:rounded-[22px] max-[768px]:p-6"
          id="content"
          ref={contentRef}
        >
          <section className="[&+section]:mt-7">
            <h2 className="mb-[10px] scroll-mt-24 text-[28px] text-slate-900">
              Giới thiệu
            </h2>
            <p className="m-0 whitespace-pre-line text-base leading-[1.9] text-slate-700">
              {postDetail.excerpt ||
                "Bài viết này trình bày chi tiết quá trình xây dựng hệ thống, tổ chức mã nguồn và triển khai các luồng xử lý chính."}
            </p>
          </section>

          <section className="[&+section]:mt-7">
            <h2 className="mb-[10px] scroll-mt-24 text-[28px] text-slate-900">
              Tổng quan bài viết
            </h2>
            <p className="m-0 whitespace-pre-line text-base leading-[1.9] text-slate-700">
              {postDetail.content}
            </p>
          </section>

          <section className="[&+section]:mt-7">
            <h2 className="mb-[10px] scroll-mt-24 text-[28px] text-slate-900">
              Cách tổ chức hệ thống
            </h2>
            <p className="m-0 whitespace-pre-line text-base leading-[1.9] text-slate-700">
              Nội dung bài viết tập trung vào cách chia layer rõ ràng giữa
              frontend, backend, route, middleware, service và database để dễ mở
              rộng về sau.
            </p>
          </section>

          <section className="[&+section]:mt-7">
            <h3 className="mb-[10px] scroll-mt-24 text-[22px] text-slate-900">
              Xử lý auth
            </h3>
            <p className="m-0 whitespace-pre-line text-base leading-[1.9] text-slate-700">
              Phần auth thường được tách qua middleware để xác thực token trước
              khi controller xử lý nghiệp vụ chính.
            </p>
          </section>

          <section className="[&+section]:mt-7">
            <h3 className="mb-[10px] scroll-mt-24 text-[22px] text-slate-900">
              Quản lý state
            </h3>
            <p className="m-0 whitespace-pre-line text-base leading-[1.9] text-slate-700">
              Với frontend, Redux Toolkit giúp tách rõ async thunk, slice,
              selector và trạng thái loading, error, success một cách gọn hơn.
            </p>
          </section>

          <section className="[&+section]:mt-7">
            <h2 className="mb-[10px] scroll-mt-24 text-[28px] text-slate-900">
              Kết quả triển khai
            </h2>
            <p className="m-0 whitespace-pre-line text-base leading-[1.9] text-slate-700">
              Sau khi hoàn thiện, hệ thống có thể hiển thị bài viết theo slug,
              lấy danh sách comment theo post, và giữ luồng dữ liệu nhất quán
              giữa store và giao diện.
            </p>
          </section>
        </article>

        <aside className="sticky top-[92px] self-start max-[1180px]:hidden">
          <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
            <img
              src="https://picsum.photos/seed/cms-right/420/720"
              alt="Developer desk with code editor and system diagrams"
              className="block h-[720px] w-full object-cover"
            />
          </div>
        </aside>
      </section>

      <section
        className="mx-auto mt-12 max-w-[1200px] px-5 max-[768px]:px-4"
        id="related"
      >
        <div className="mb-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-teal-700">
            Continue reading
          </p>
          <h2 className="m-0 text-[30px] text-slate-900">Bài viết liên quan</h2>
        </div>

        <div className="grid grid-cols-3 gap-[18px] max-[768px]:grid-cols-1">
          {relatedPosts.map((item) => (
            <Link
              key={item.id}
              href={`/posts/${item.slug}`}
              className="block rounded-[22px] border border-slate-200 bg-white p-[22px] no-underline shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-[3px] hover:border-teal-200 hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)]"
            >
              <span className="mb-[10px] inline-block text-[13px] font-bold text-teal-700">
                {item.category}
              </span>
              <h3 className="m-0 text-[19px] leading-[1.5] text-slate-900">
                {item.title}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      <section
        className="mx-auto mt-12 max-w-[960px] px-5 pb-[72px] max-[768px]:px-4"
        id="comments"
      >
        <div className="mb-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-teal-700">
            Discussion
          </p>
          <h2 className="m-0 text-[30px] text-slate-900">Bình luận</h2>
        </div>

        <CommentForm
          loading={commentLoading}
          onSubmit={handleSubmitComment}
          submitText="Gửi bình luận"
        />

        <div className="mt-7 flex flex-col gap-[22px]">
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
