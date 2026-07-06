"use client";

import { message } from "antd";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  clearPostState,
  getPostBySlug,
  updatePost,
} from "@/redux/slices/postSlice";
import {
  AuthBootstrappedSelector,
  AuthLoadingSelector,
  PostDetailSelector,
  PostLoadingSelector,
} from "@/redux/selector";
import { handleRefreshToken } from "@/redux/slices/authSlice";
import PostEditorForm, {
  PostEditorFormValues,
} from "@/components/comments/posts/PostEditorForm";

type RejectedError = {
  message?: string;
};

export default function UpdatePostPage() {
  const dispatch = useAppDispatch();
  const params = useParams();
  const slug = params?.slug as string;

  const loading = useAppSelector(PostLoadingSelector);
  const authLoading = useAppSelector(AuthLoadingSelector);
  const bootstrapped = useAppSelector(AuthBootstrappedSelector);
  const postDetail = useAppSelector(PostDetailSelector);

  useEffect(() => {
    if (!bootstrapped) {
      dispatch(handleRefreshToken());
    }
  }, [bootstrapped, dispatch]);

  useEffect(() => {
    if (slug) {
      dispatch(getPostBySlug({ slug }));
    }
  }, [dispatch, slug]);

  useEffect(() => {
    return () => {
      dispatch(clearPostState());
    };
  }, [dispatch]);

  const handleSubmit = async (
    values: PostEditorFormValues,
    imageFile: File | null,
  ) => {
    try {
      if (!postDetail?.id) {
        message.error("Không tìm thấy id bài viết để cập nhật");
        return;
      }

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("slug", values.slug);
      formData.append("excerpt", values.excerpt || "");
      formData.append("content", values.content);
      formData.append("category", values.category);
      formData.append("isPublished", String(values.isPublished));

      if (imageFile instanceof File) {
        formData.append("image", imageFile);
      }

      await dispatch(
        updatePost({
          id: postDetail.id,
          data: formData,
        }),
      ).unwrap();

      message.success("Cập nhật bài viết thành công");
    } catch (error) {
      const err = error as RejectedError;
      console.error("update post error:", err);
      message.error(err?.message || "Không thể cập nhật bài viết");
      throw error;
    }
  };

  return (
    <PostEditorForm
      mode="update"
      loading={loading || authLoading || !bootstrapped}
      submitText="Lưu cập nhật"
      backHref="/admin"
      backText="Quay lại admin"
      initialValues={{
        title: postDetail?.title || "",
        slug: postDetail?.slug || "",
        excerpt: postDetail?.excerpt || "",
        content: postDetail?.content || "",
        category: postDetail?.category || "Game Development",
        isPublished: Boolean(postDetail?.isPublished),
      }}
      initialImageUrl={postDetail?.thumbnailUrl || ""}
      onSubmit={handleSubmit}
    />
  );
}
