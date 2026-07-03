"use client";

import CommentForm, {
  type CommentFormValues,
} from "@/components/comments/CommentForm";

export type CommentAuthor = {
  id: string;
  fullName: string;
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
  onReply: (commentId: string) => void;
  onCancelReply: () => void;
  onSubmitReply: (
    commentId: string,
    values: CommentFormValues,
  ) => Promise<void>;
  replyLoading?: boolean;
};

export default function CommentItem({
  comment,
  depth = 0,
  replyingCommentId,
  onReply,
  onCancelReply,
  onSubmitReply,
  replyLoading = false,
}: CommentItemProps) {
  const hasReplies =
    Array.isArray(comment.replies) && comment.replies.length > 0;

  const isChild = depth > 0;
  const isReplying = replyingCommentId === comment.id;

  return (
    <article className="flex flex-col gap-3">
      <div
        className={`rounded-[22px] border p-4 shadow-[0_10px_28px_rgba(15,23,42,0.04)] ${
          isChild ? "bg-slate-50 border-slate-200" : "bg-white border-slate-200"
        }`}
      >
        <div className="mb-2.5 flex items-start justify-between gap-4 max-[768px]:flex-col max-[768px]:items-stretch">
          <div className="flex items-center gap-3">
            <div
              className={`flex shrink-0 items-center justify-center rounded-full text-white font-bold ${
                isChild
                  ? "h-[36px] w-[36px] bg-[linear-gradient(135deg,#475569,#64748b)] text-[13px]"
                  : "h-11 w-11 bg-[linear-gradient(135deg,#0f766e,#14b8a6)] text-[15px]"
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

          <button
            type="button"
            className="self-start bg-transparent p-0 text-sm font-bold text-teal-700 transition-opacity hover:opacity-80"
            onClick={() => onReply(comment.id)}
          >
            Trả lời
          </button>
        </div>

        <p className="m-0 whitespace-pre-line text-[15px] leading-[1.8] text-slate-700">
          {comment.content}
        </p>
      </div>

      {isReplying && (
        <div className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-slate-600">
              Đang trả lời{" "}
              <strong className="text-slate-900">
                {comment.author?.fullName || "Người dùng"}
              </strong>
            </span>
            <button
              type="button"
              className="rounded-full bg-[linear-gradient(135deg,#0f766e,#14b8a6)] px-4 py-2 text-sm font-bold text-white shadow-[0_14px_24px_rgba(20,184,166,0.2)] transition hover:-translate-y-[1px] hover:opacity-95"
              onClick={onCancelReply}
            >
              Hủy
            </button>
          </div>

          <CommentForm
            loading={replyLoading}
            submitText="Gửi trả lời"
            showAuthorFields={false}
            onSubmit={(values: CommentFormValues) =>
              onSubmitReply(comment.id, values)
            }
          />
        </div>
      )}

      {hasReplies && (
        <div className="ml-[18px] flex gap-[14px] max-[768px]:ml-[10px] max-[768px]:gap-[10px]">
          <div className="w-[2px] shrink-0 rounded-full bg-[linear-gradient(180deg,#cbd5e1_0%,#e2e8f0_100%)]" />
          <div className="flex-1 space-y-3">
            {comment.replies!.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                depth={depth + 1}
                replyingCommentId={replyingCommentId}
                onReply={onReply}
                onCancelReply={onCancelReply}
                onSubmitReply={onSubmitReply}
                replyLoading={replyLoading}
              />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
