"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { App, Button, Form, Input, Select, Switch } from "antd";
import {
  ArrowLeftOutlined,
  CameraOutlined,
  InboxOutlined,
  PictureOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { createPost, clearPostState } from "@/redux/slices/postSlice";
import { PostLoadingSelector } from "@/redux/selector";

const { TextArea } = Input;

type CreatePostValues = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  isPublished: boolean;
};

export default function CreatePostPage() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(PostLoadingSelector);
  const { message } = App.useApp();
  const [form] = Form.useForm<CreatePostValues>();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      dispatch(clearPostState());
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [dispatch, previewUrl]);

  const categories = useMemo(
    () => [
      { label: "WebDevelopment", value: "Web Development" },
      { label: "Frontend", value: "Frontend" },
      { label: "Backend", value: "Backend" },
      { label: "UI/UX", value: "UI/UX" },
      { label: "Career", value: "Career" },
      { label: "Game Development", value: "Game Development" },
    ],
    [],
  );

  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleGenerateSlug = () => {
    const title = form.getFieldValue("title") || "";
    form.setFieldValue("slug", generateSlug(title));
  };

  const updateImagePreview = (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      message.error("Vui lòng chọn file ảnh hợp lệ");
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const nextPreviewUrl = URL.createObjectURL(file);
    setImageFile(file);
    setPreviewUrl(nextPreviewUrl);
  };

  const handlePickFromGallery = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    updateImagePreview(file);
    event.target.value = "";
  };

  const handleCaptureFromCamera = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    updateImagePreview(file);
    event.target.value = "";
  };

  const handleRemoveImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setImageFile(null);
    setPreviewUrl("");
  };

  const handleSubmit = async (values: CreatePostValues) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("slug", values.slug);
      formData.append("excerpt", values.excerpt);
      formData.append("content", values.content);
      formData.append("category", values.category);
      formData.append("isPublished", String(values.isPublished));

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await dispatch(createPost(formData)).unwrap();

      message.success("Tạo bài viết thành công");
      form.resetFields();
      handleRemoveImage();
      dispatch(clearPostState());
    } catch (error) {
      console.error(error);
      message.error("Không thể tạo bài viết");
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f7fbff_0%,#edf4ff_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.10),transparent_22%)]" />
      <section className="mx-auto max-w-[1180px] px-6 pb-8 pt-[72px] max-[640px]:px-4">
        <div className="rounded-[28px] border border-white/80 bg-white/80 px-8 py-8 shadow-[0_24px_80px_rgba(37,99,235,0.08)] backdrop-blur max-[640px]:px-5">
          <div className="mb-4">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 no-underline transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              <ArrowLeftOutlined />
              Quay lại admin
            </Link>
          </div>

          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-blue-600">
            Admin create post
          </p>
          <h1 className="mb-3 text-[clamp(2rem,4vw,3.2rem)] leading-[1] tracking-[-0.04em] text-slate-900">
            Tạo bài viết mới
          </h1>
          <p className="max-w-[62ch] leading-[1.8] text-slate-600">
            Tạo nội dung mới cho portfolio, thêm hình ảnh đại diện và xuất bản
            trực tiếp hoặc lưu dưới dạng draft.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-6 pb-16 max-[640px]:px-4">
        <div className="grid grid-cols-[minmax(0,1fr)_340px] gap-6 max-[980px]:grid-cols-1">
          <div className="rounded-[28px] border border-white/80 bg-white/92 p-6 shadow-[0_18px_50px_rgba(37,99,235,0.06)]">
            <Form<CreatePostValues>
              form={form}
              layout="vertical"
              initialValues={{
                title: "",
                slug: "",
                excerpt: "",
                content: "",
                category: "Development",
                isPublished: false,
              }}
              onFinish={handleSubmit}
            >
              <div className="grid grid-cols-1 gap-4">
                <Form.Item
                  label={
                    <span className="font-medium text-slate-700">Tiêu đề</span>
                  }
                  name="title"
                  rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
                >
                  <Input
                    size="large"
                    placeholder="Nhập tiêu đề bài viết"
                    onBlur={handleGenerateSlug}
                    className="!rounded-2xl !border-slate-200 !bg-slate-50 !px-4 !py-3 hover:!border-slate-300 focus:!border-blue-500"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="font-medium text-slate-700">Slug</span>
                  }
                  name="slug"
                  rules={[
                    { required: true, message: "Vui lòng nhập slug" },
                    {
                      pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                      message: "Slug chỉ gồm chữ thường, số và dấu gạch ngang",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="vi-du-slug-bai-viet"
                    className="!rounded-2xl !border-slate-200 !bg-slate-50 !px-4 !py-3 hover:!border-slate-300 focus:!border-blue-500"
                  />
                </Form.Item>

                <div className="grid grid-cols-2 gap-4 max-[768px]:grid-cols-1">
                  <Form.Item
                    label={
                      <span className="font-medium text-slate-700">
                        Danh mục
                      </span>
                    }
                    name="category"
                    rules={[
                      { required: true, message: "Vui lòng chọn danh mục" },
                    ]}
                  >
                    <Select size="large" options={categories} />
                  </Form.Item>

                  <Form.Item
                    label={
                      <span className="font-medium text-slate-700">
                        Xuất bản ngay
                      </span>
                    }
                    name="isPublished"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </div>

                <Form.Item
                  label={
                    <span className="font-medium text-slate-700">
                      Mô tả ngắn
                    </span>
                  }
                  name="excerpt"
                  rules={[
                    { required: true, message: "Vui lòng nhập mô tả ngắn" },
                  ]}
                >
                  <TextArea
                    rows={4}
                    maxLength={240}
                    showCount
                    placeholder="Nhập excerpt cho bài viết"
                    className="!rounded-2xl !border-slate-200 !bg-slate-50 !px-4 !py-3 hover:!border-slate-300 focus:!border-blue-500"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="font-medium text-slate-700">
                      Nội dung bài viết
                    </span>
                  }
                  name="content"
                  rules={[
                    { required: true, message: "Vui lòng nhập nội dung" },
                  ]}
                >
                  <TextArea
                    rows={14}
                    placeholder="Viết nội dung bài viết tại đây..."
                    className="!rounded-2xl !border-slate-200 !bg-slate-50 !px-4 !py-3 hover:!border-slate-300 focus:!border-blue-500"
                  />
                </Form.Item>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button
                    htmlType="submit"
                    type="primary"
                    size="large"
                    icon={<SaveOutlined />}
                    loading={loading}
                    className="!h-auto !rounded-full !border-0 !bg-blue-600 !px-5 !py-3 !font-bold !shadow-[0_14px_24px_rgba(37,99,235,0.18)] hover:!bg-blue-700"
                  >
                    Tạo bài viết
                  </Button>

                  <Button
                    size="large"
                    onClick={handleGenerateSlug}
                    className="!h-auto !rounded-full !border-slate-200 !bg-white !px-5 !py-3 !font-semibold !text-slate-700 hover:!border-blue-200 hover:!bg-blue-50 hover:!text-blue-700"
                  >
                    Tạo slug tự động
                  </Button>
                </div>
              </div>
            </Form>
          </div>

          <aside className="rounded-[28px] border border-white/80 bg-white/92 p-6 shadow-[0_18px_50px_rgba(37,99,235,0.06)]">
            <div className="mb-5">
              <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.14em] text-blue-600">
                Featured image
              </p>
              <h2 className="text-[1.35rem] font-semibold text-slate-900">
                Ảnh đại diện bài viết
              </h2>
              <p className="mt-2 text-sm leading-[1.8] text-slate-600">
                Chọn ảnh từ máy hoặc chụp ảnh trực tiếp trên điện thoại.
              </p>
            </div>

            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              onChange={handlePickFromGallery}
              className="hidden"
            />

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleCaptureFromCamera}
              className="hidden"
            />

            <div className="flex flex-col gap-3">
              <Button
                size="large"
                icon={<PictureOutlined />}
                onClick={() => galleryInputRef.current?.click()}
                className="!h-auto !rounded-2xl !border-slate-200 !bg-white !px-4 !py-3 !font-semibold !text-slate-700 hover:!border-blue-200 hover:!bg-blue-50 hover:!text-blue-700"
              >
                Chọn ảnh từ máy
              </Button>

              <Button
                size="large"
                icon={<CameraOutlined />}
                onClick={() => cameraInputRef.current?.click()}
                className="!h-auto !rounded-2xl !border-slate-200 !bg-white !px-4 !py-3 !font-semibold !text-slate-700 hover:!border-blue-200 hover:!bg-blue-50 hover:!text-blue-700"
              >
                Chụp ảnh bằng điện thoại
              </Button>

              {imageFile && (
                <Button
                  size="large"
                  danger
                  onClick={handleRemoveImage}
                  className="!h-auto !rounded-2xl !px-4 !py-3"
                >
                  Xóa ảnh đã chọn
                </Button>
              )}
            </div>

            <div className="mt-5 overflow-hidden rounded-[24px] border border-dashed border-slate-300 bg-slate-50">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview ảnh bài viết"
                  className="block aspect-[4/3] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[4/3] flex-col items-center justify-center px-6 text-center">
                  <InboxOutlined className="mb-3 text-[28px] text-slate-400" />
                  <p className="mb-1 text-sm font-semibold text-slate-700">
                    Chưa có hình ảnh nào được chọn
                  </p>
                  <p className="text-sm leading-7 text-slate-500">
                    Trên mobile, nút chụp ảnh sẽ ưu tiên mở camera sau nếu trình
                    duyệt hỗ trợ.
                  </p>
                </div>
              )}
            </div>

            {imageFile && (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="mb-1 break-all text-sm font-semibold text-slate-800">
                  {imageFile.name}
                </p>
                <p className="text-xs text-slate-500">
                  {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
