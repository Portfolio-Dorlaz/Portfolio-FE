"use client";

import { message } from "antd";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
  const router = useRouter();
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
    thumbnailFile: File | null,
    galleryFiles: File[],
  ): Promise<void> => {
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

      const updatedPost = await dispatch(
        updatePost({
          id: postDetail.id,
          data: formData,
        }),
      ).unwrap();

      message.success("Cập nhật bài viết thành công");

      if (updatedPost?.slug) {
        router.push(`/posts/${updatedPost.slug}`);
      }
    } catch (error) {
      const err = error as RejectedError;
      console.error("update post error:", err);
      message.error(err?.message || "Không thể cập nhật bài viết");
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
        status: postDetail?.status || "draft",
        thumbnailUrl: postDetail?.thumbnailUrl || "",
        links: postDetail?.links || [],
        images:
          postDetail?.images?.map((item, index) => ({
            alt: item.alt || "",
            url: item.url || "",
            sortOrder:
              typeof item.sortOrder === "number" ? item.sortOrder : index,
          })) || [],
      }}
      initialImageUrl={postDetail?.thumbnailUrl || ""}
      initialGalleryUrls={
        postDetail?.images?.map((item) => ({
          url: item.url,
          alt: item.alt || "",
        })) || []
      }
      onSubmit={handleSubmit}
    />
  );
}
