"use client";

import CommentForm, {
  type CommentFormValues,
} from "@/components/comments/CommentForm";

export type CommentAuthor = {
  id: string;
  fullName: string;
  email: string;
};

export type CommentItemType = {
  id: string;
  authorId: string;
  postId: string;
  parentId: string | null;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  author?: CommentAuthor;
  replies?: CommentItemType[];
};

export type CommentItemProps = {
  comment: CommentItemType;
  depth?: number;
  replyingCommentId: string | null;
  currentUserId?: string | null;
  isAdmin?: boolean;
  isAuthenticated?: boolean;
  deleteLoadingId?: string | null;
  onReply: (commentId: string) => void;
  onCancelReply: () => void;
  onSubmitReply: (
    commentId: string,
    values: CommentFormValues,
  ) => Promise<void>;
  onDelete: (commentId: string) => Promise<void> | void;
  replyLoading?: boolean;
};

export default function CommentItem({
  comment,
  depth = 0,
  replyingCommentId,
  currentUserId,
  isAdmin = false,
  isAuthenticated = false,
  deleteLoadingId = null,
  onReply,
  onCancelReply,
  onSubmitReply,
  onDelete,
  replyLoading = false,
}: CommentItemProps) {
  const hasReplies =
    Array.isArray(comment.replies) && comment.replies.length > 0;

  const isChild = depth > 0;
  const isReplying = replyingCommentId === comment.id;
  const canReply = Boolean(isAuthenticated);
  const canDelete = Boolean(
    isAuthenticated && (isAdmin || currentUserId === comment.authorId),
  );
  console.log("comment authorId: ", comment.authorId);
  console.log("current user id: ", currentUserId);
  console.log("canDelete: ", canDelete);
  console.log("isAdmin: ", isAdmin);

  const isDeleting = deleteLoadingId === comment.id;
  const currentUserFullName = comment.author?.fullName || "";
  const currentUserEmail = comment.author?.email || "";

  return (
    <article className="flex flex-col gap-3">
      <div
        className={`rounded-[22px] border p-4 shadow-[0_10px_28px_rgba(37,99,235,0.05)] ${
          isChild
            ? "border-slate-200 bg-slate-50/90"
            : "border-white/80 bg-white/92"
        }`}
      >
        <div className="mb-2.5 flex items-start justify-between gap-4 max-[768px]:flex-col max-[768px]:items-stretch">
          <div className="flex items-center gap-3">
            <div
              className={`flex shrink-0 items-center justify-center rounded-full font-bold text-white ${
                isChild
                  ? "h-[36px] w-[36px] bg-slate-400 text-[13px]"
                  : "h-11 w-11 bg-blue-600 text-[15px]"
              }`}
            >
              {comment.author?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="flex flex-col gap-0.5">
              <strong className="text-[15px] leading-[1.4] text-slate-900">
                {comment.author?.fullName || "Người dùng"}
              </strong>
              <span className="text-[13px] leading-[1.4] text-slate-500">
                {comment.createdAt
                  ? new Date(comment.createdAt).toLocaleString("vi-VN")
                  : "Vừa xong"}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {canReply && (
              <button
                type="button"
                className="self-start rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
                onClick={() => onReply(comment.id)}
              >
                Trả lời
              </button>
            )}

            {canDelete && (
              <button
                type="button"
                onClick={() => onDelete(comment.id)}
                disabled={isDeleting}
                className="self-start rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? "Đang xóa..." : "Xóa"}
              </button>
            )}
          </div>
        </div>

        <p className="m-0 whitespace-pre-line text-[15px] leading-[1.8] text-slate-700">
          {comment.content}
        </p>
      </div>

      {isReplying && (
        <div className="rounded-[22px] border border-white/80 bg-white/92 p-4 shadow-[0_10px_28px_rgba(37,99,235,0.05)]">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-slate-600">
              Đang trả lời{" "}
              <strong className="text-slate-900">
                {comment.author?.fullName || "Người dùng"}
              </strong>
            </span>
            <button
              type="button"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-[0_10px_20px_rgba(15,23,42,0.04)] transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              onClick={onCancelReply}
            >
              Hủy
            </button>
          </div>

          <CommentForm
            loading={replyLoading}
            submitText="Gửi trả lời"
            showAuthorFields={false}
            isAuthenticated={isAuthenticated}
            currentUserFullName={currentUserFullName}
            currentUserEmail={currentUserEmail}
            onSubmit={(values: CommentFormValues) =>
              onSubmitReply(comment.id, values)
            }
          />
        </div>
      )}

      {hasReplies && (
        <div className="ml-[18px] flex gap-[14px] max-[768px]:ml-[10px] max-[768px]:gap-[10px]">
          <div className="w-[2px] shrink-0 rounded-full bg-[linear-gradient(180deg,#bfdbfe_0%,#dbeafe_100%)]" />
          <div className="flex-1 space-y-3">
            {comment.replies!.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                depth={depth + 1}
                replyingCommentId={replyingCommentId}
                currentUserId={currentUserId}
                isAdmin={isAdmin}
                isAuthenticated={isAuthenticated}
                deleteLoadingId={deleteLoadingId}
                onReply={onReply}
                onCancelReply={onCancelReply}
                onSubmitReply={onSubmitReply}
                onDelete={onDelete}
                replyLoading={replyLoading}
              />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
