"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/redux/hooks";
import { getPostBySlug } from "@/redux/slices/postSlice";
import {
  createComment,
  deleteComment,
  getCommentsByPost,
} from "@/redux/slices/commentSlice";
import {
  AuthenticatedSelector,
  CommentListSelector,
  LoadingCommentSelector,
  PostDetailSelector,
  PostLoadingSelector,
  UserInfoSelector,
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

  // const user = useSelector(UserInfoSelector);
  const postDetail = useSelector(PostDetailSelector);
  console.log("post detail: ", postDetail);

  const loading = useSelector(PostLoadingSelector);

  const commentsData = useSelector(CommentListSelector);
  const commentLoading = useSelector(LoadingCommentSelector);
  const isAuthenticated = useSelector(AuthenticatedSelector);

  const userInfo = useSelector(UserInfoSelector);
  console.log("user info: ", userInfo);

  const currentUserId = userInfo?.id || null;
  const currentUserFullName = userInfo?.fullName || "";
  const currentUserEmail = userInfo?.email || "";

  const contentRef = useRef<HTMLElement | null>(null);
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(
    null,
  );

  const createHeadingId = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const formattedCreatedAt = postDetail?.createdAt
    ? new Date(postDetail.createdAt).toLocaleString("vi-VN")
    : "Không rõ ngày tạo";

  const formattedUpdatedAt = postDetail?.updatedAt
    ? new Date(postDetail.updatedAt).toLocaleString("vi-VN")
    : null;

  const estimatedReadTime = useMemo(() => {
    const content =
      `${postDetail?.excerpt || ""} ${postDetail?.content || ""}`.trim();
    if (!content) return null;

    const words = content.split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} phút đọc`;
  }, [postDetail?.excerpt, postDetail?.content]);

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

  const handleDeleteComment = async (id: string): Promise<void> => {
    await dispatch(deleteComment({ id })).unwrap();
    if (postDetail?.id) {
      await dispatch(getCommentsByPost({ postId: postDetail.id })).unwrap();
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#f7fbff_0%,#edf4ff_100%)] px-4 py-10 text-slate-900">
        <div className="mx-auto max-w-[1080px]">
          <div className="rounded-[28px] border border-white/80 bg-white/90 p-8 shadow-[0_18px_50px_rgba(37,99,235,0.06)]">
            Đang tải bài viết...
          </div>
        </div>
      </main>
    );
  }

  if (!postDetail) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#f7fbff_0%,#edf4ff_100%)] px-4 py-10 text-slate-900">
        <div className="mx-auto max-w-[1080px]">
          <div className="rounded-[28px] border border-white/80 bg-white/90 p-8 shadow-[0_18px_50px_rgba(37,99,235,0.06)]">
            Không tìm thấy bài viết.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f7fbff_0%,#edf4ff_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.08),transparent_24%)]" />

      <section className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_32%),linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] px-5 pb-10 pt-[72px] max-[768px]:px-4 max-[768px]:pb-7 max-[768px]:pt-14">
        <div className="mx-auto max-w-[1080px]">
          <div className="mb-5">
            <Link
              href="/posts"
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 no-underline transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              ← Quay lại danh sách bài viết
            </Link>
          </div>

          <div className="max-w-[860px]">
            {postDetail.category && (
              <p className="mb-[18px] inline-flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-[13px] font-bold uppercase tracking-[0.04em] text-blue-700">
                {postDetail.category}
              </p>
            )}

            <h1 className="m-0 text-[clamp(34px,5vw,58px)] leading-[1.08] tracking-[-0.03em] text-slate-900">
              {postDetail.title}
            </h1>

            {postDetail.excerpt && (
              <p className="mt-[18px] max-w-[760px] text-[18px] leading-[1.8] text-slate-600">
                {postDetail.excerpt}
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-x-[18px] gap-y-3 text-sm text-slate-500">
              <span>{formattedCreatedAt}</span>
              {estimatedReadTime && <span>{estimatedReadTime}</span>}
              {postDetail.updatedAt && formattedUpdatedAt && (
                <span>Cập nhật: {formattedUpdatedAt}</span>
              )}
              {postDetail.slug && <span>Slug: {postDetail.slug}</span>}
            </div>
          </div>

          {postDetail.thumbnailUrl && (
            <div className="mt-8 overflow-hidden rounded-[30px] border border-white/80 bg-white shadow-[0_18px_50px_rgba(37,99,235,0.08)]">
              <img
                src={postDetail.thumbnailUrl}
                alt={postDetail.title || "Thumbnail bài viết"}
                className="block max-h-[620px] w-full object-cover"
              />
            </div>
          )}
        </div>
      </section>

      <section className="sticky top-0 z-20 border-b border-slate-200 bg-[rgba(255,255,255,0.86)] backdrop-blur-[10px]">
        <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-5 px-5 py-[14px] max-[900px]:flex-col max-[900px]:items-start max-[768px]:px-4">
          <p className="m-0 text-xs font-bold uppercase tracking-[0.08em] text-blue-700">
            Mục lục
          </p>

          <nav className="flex flex-wrap gap-x-[18px] gap-y-2">
            {tocItems.length > 0 ? (
              tocItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`text-sm no-underline transition-colors hover:text-blue-700 ${
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
                  className="text-sm text-slate-600 no-underline transition-colors hover:text-blue-700"
                >
                  Nội dung
                </a>
                <a
                  href="#post-meta"
                  className="text-sm text-slate-600 no-underline transition-colors hover:text-blue-700"
                >
                  Thông tin bài viết
                </a>
                <a
                  href="#comments"
                  className="text-sm text-slate-600 no-underline transition-colors hover:text-blue-700"
                >
                  Bình luận
                </a>
              </>
            )}
          </nav>
        </div>
      </section>

      <section className="mx-auto max-w-[1080px] px-5 pb-0 pt-8 max-[768px]:px-4">
        <article
          className="rounded-[28px] border border-white/80 bg-white/95 p-10 shadow-[0_18px_50px_rgba(37,99,235,0.06)] max-[768px]:rounded-[22px] max-[768px]:p-6"
          id="content"
          ref={contentRef}
        >
          <section className="border-b border-slate-200 pb-6" id="post-meta">
            <h2 className="mb-4 scroll-mt-24 text-[28px] text-slate-900">
              Thông tin bài viết
            </h2>

            <div className="grid grid-cols-2 gap-4 max-[768px]:grid-cols-1">
              <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
                  Tiêu đề
                </p>
                <p className="m-0 text-base font-semibold text-slate-900">
                  {postDetail.title || "—"}
                </p>
              </div>

              <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
                  Slug
                </p>
                <p className="m-0 break-all text-base text-slate-700">
                  {postDetail.slug || "—"}
                </p>
              </div>

              <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
                  Danh mục
                </p>
                <p className="m-0 text-base text-slate-700">
                  {postDetail.category || "—"}
                </p>
              </div>

              <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
                  Ngày tạo
                </p>
                <p className="m-0 text-base text-slate-700">
                  {formattedCreatedAt}
                </p>
              </div>

              {formattedUpdatedAt && (
                <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                  <p className="mb-1 text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
                    Cập nhật lần cuối
                  </p>
                  <p className="m-0 text-base text-slate-700">
                    {formattedUpdatedAt}
                  </p>
                </div>
              )}

              {estimatedReadTime && (
                <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                  <p className="mb-1 text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
                    Thời gian đọc
                  </p>
                  <p className="m-0 text-base text-slate-700">
                    {estimatedReadTime}
                  </p>
                </div>
              )}
            </div>
          </section>

          {postDetail.excerpt && (
            <section className="mt-8">
              <h2 className="mb-[10px] scroll-mt-24 text-[28px] text-slate-900">
                Tóm tắt
              </h2>
              <p className="m-0 whitespace-pre-line text-base leading-[1.9] text-slate-700">
                {postDetail.excerpt}
              </p>
            </section>
          )}

          <section className="mt-8">
            <h2 className="mb-[10px] scroll-mt-24 text-[28px] text-slate-900">
              Nội dung
            </h2>

            {postDetail.content ? (
              <div className="space-y-5">
                {postDetail.content
                  .split(/\n{2,}/)
                  .map((paragraph, index) => paragraph.trim())
                  .filter(Boolean)
                  .map((paragraph, index) => (
                    <p
                      key={`${index}-${paragraph.slice(0, 16)}`}
                      className="m-0 whitespace-pre-line text-base leading-[1.95] text-slate-700"
                    >
                      {paragraph}
                    </p>
                  ))}
              </div>
            ) : (
              <p className="m-0 text-base leading-[1.9] text-slate-500">
                Bài viết chưa có nội dung.
              </p>
            )}
          </section>
        </article>
      </section>

      <section
        className="mx-auto mt-12 max-w-[1080px] px-5 pb-[72px] max-[768px]:px-4"
        id="comments"
      >
        <div className="mb-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-blue-700">
            Discussion
          </p>
          <h2 className="m-0 text-[30px] text-slate-900">Bình luận</h2>
        </div>

        <CommentForm
          loading={commentLoading}
          onSubmit={handleSubmitComment}
          submitText="Gửi bình luận"
          isAuthenticated={isAuthenticated}
          currentUserFullName={currentUserFullName}
          currentUserEmail={currentUserEmail}
        />

        <div className="mt-7 flex flex-col gap-[22px]">
          {commentLoading ? (
            <p className="text-slate-600">Đang tải bình luận...</p>
          ) : commentsData.length > 0 ? (
            commentsData.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                replyingCommentId={replyingCommentId}
                currentUserId={currentUserId}
                isAdmin={userInfo?.role === "admin"}
                isAuthenticated={isAuthenticated}
                deleteLoadingId={replyingCommentId}
                onReply={handleReplyClick}
                onCancelReply={handleCancelReply}
                onSubmitReply={handleSubmitReply}
                onDelete={handleDeleteComment}
                replyLoading={commentLoading}
              />
            ))
          ) : (
            <div className="rounded-[22px] border border-white/80 bg-white/92 p-5 shadow-[0_10px_30px_rgba(37,99,235,0.05)]">
              <p className="m-0 text-slate-600">Chưa có bình luận nào.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
