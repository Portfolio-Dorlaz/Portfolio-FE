"use client";

import { message } from "antd";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { createPost, clearPostState } from "@/redux/slices/postSlice";
import { handleRefreshToken } from "@/redux/slices/authSlice";
import {
  AuthenticatedSelector,
  AuthLoadingSelector,
  AuthBootstrappedSelector,
  PostLoadingSelector,
} from "@/redux/selector";
import { getApiAccessToken } from "@/services/api";
import PostEditorForm, {
  PostEditorFormValues,
} from "@/components/comments/posts/PostEditorForm";

type RejectedError = {
  message?: string;
};

export default function CreatePostPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const loading = useAppSelector(PostLoadingSelector);
  const authLoading = useAppSelector(AuthLoadingSelector);
  const isAuthenticated = useAppSelector(AuthenticatedSelector);
  const bootstrapped = useAppSelector(AuthBootstrappedSelector);

  useEffect(() => {
    return () => {
      dispatch(clearPostState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!bootstrapped) {
      dispatch(handleRefreshToken());
    }
  }, [bootstrapped, dispatch]);

  const handleSubmit = async (
    values: PostEditorFormValues,
    thumbnailFile: File | null,
    galleryFiles: File[],
  ): Promise<void> => {
    try {
      if (!isAuthenticated) {
        await dispatch(handleRefreshToken()).unwrap();
      }

      const token = getApiAccessToken();

      if (!token) {
        message.error("Không có access token");
        return;
      }

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("slug", values.slug);
      formData.append("excerpt", values.excerpt || "");
      formData.append("content", values.content);
      formData.append("category", values.category || "");
      formData.append("status", values.status || "draft");

      if (values.thumbnailUrl) {
        formData.append("thumbnailUrl", values.thumbnailUrl);
      }

      if (thumbnailFile instanceof File) {
        formData.append("thumbnail", thumbnailFile);
      }

      galleryFiles.forEach((file) => {
        formData.append("images", file);
      });

      formData.append(
        "links",
        JSON.stringify(
          (values.links || []).map((item, index) => ({
            label: item.label?.trim() || "",
            url: item.url?.trim() || "",
            sortOrder:
              typeof item.sortOrder === "number" ? item.sortOrder : index,
          })),
        ),
      );

      formData.append(
        "imageMetas",
        JSON.stringify(
          (values.images || []).map((item, index) => ({
            alt: item.alt?.trim() || "",
            sortOrder:
              typeof item.sortOrder === "number" ? item.sortOrder : index,
            url: item.url?.trim() || "",
          })),
        ),
      );

      const createdPost = await dispatch(createPost(formData)).unwrap();

      message.success("Tạo bài viết thành công");
      dispatch(clearPostState());

      if (createdPost?.slug) {
        router.push(`/posts/${createdPost.slug}`);
      }
    } catch (error) {
      const err = error as RejectedError;
      console.error("create post error:", err);
      message.error(err?.message || "Không thể tạo bài viết");
    }
  };

  return (
    <PostEditorForm
      mode="create"
      loading={loading || authLoading || !bootstrapped}
      submitText="Tạo bài viết"
      backHref="/admin"
      backText="Quay lại admin"
      initialValues={{
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        category: "Game Development",
        status: "draft",
        thumbnailUrl: "",
        links: [],
        images: [],
      }}
      onSubmit={handleSubmit}
    />
  );
}
