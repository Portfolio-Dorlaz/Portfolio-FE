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
    <article className={`comment-thread ${isChild ? "is-child" : "is-root"}`}>
      <div className={`comment-card ${isChild ? "reply-card" : "parent-card"}`}>
        <div className="comment-top">
          <div className="comment-user">
            <div className={`comment-avatar ${isChild ? "reply-avatar" : ""}`}>
              {comment.author?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="comment-user-meta">
              <strong>{comment.author?.fullName || "Người dùng"}</strong>
              <span>
                {comment.createdAt
                  ? new Date(comment.createdAt).toLocaleString("vi-VN")
                  : "Vừa xong"}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="reply-btn"
            onClick={() => onReply(comment.id)}
          >
            Trả lời
          </button>
        </div>

        <p className="comment-content">{comment.content}</p>
      </div>

      {isReplying && (
        <div className="reply-form-box">
          <div className="reply-form-head">
            <span>
              Đang trả lời{" "}
              <strong>{comment.author?.fullName || "Người dùng"}</strong>
            </span>{" "}
            <button
              type="button"
              className="reply-cancel-btn"
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
        <div className="comment-tree">
          <div className="comment-tree-line" />
          <div className="comment-replies">
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
