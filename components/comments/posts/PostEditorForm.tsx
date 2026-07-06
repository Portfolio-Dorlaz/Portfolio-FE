"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { Button, Form, Input, Select } from "antd";
import {
  ArrowLeftOutlined,
  CameraOutlined,
  DeleteOutlined,
  InboxOutlined,
  PictureOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;

export type PostEditorLinkValue = {
  label: string;
  url: string;
  sortOrder?: number;
};

export type PostEditorImageMetaValue = {
  alt?: string;
  url?: string;
  sortOrder?: number;
};

export type PostEditorFormValues = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  status: "draft" | "published";
  thumbnailUrl?: string;
  links?: PostEditorLinkValue[];
  images?: PostEditorImageMetaValue[];
};

type PostEditorFormProps = {
  mode?: "create" | "update";
  loading?: boolean;
  submitText?: string;
  backHref?: string;
  backText?: string;
  initialValues?: Partial<PostEditorFormValues>;
  initialImageUrl?: string;
  initialGalleryUrls?: { url: string; alt?: string }[];
  onSubmit: (
    values: PostEditorFormValues,
    thumbnailFile: File | null,
    galleryFiles: File[],
  ) => Promise<void> | void;
};

type GalleryPreviewItem = {
  id: string;
  file?: File;
  url: string;
  alt?: string;
  sizeLabel?: string;
  isRemote?: boolean;
};

export default function PostEditorForm({
  mode = "create",
  loading = false,
  submitText,
  backHref = "/admin",
  backText = "Quay lại admin",
  initialValues,
  initialImageUrl = "",
  initialGalleryUrls = [],
  onSubmit,
}: PostEditorFormProps) {
  const [form] = Form.useForm<PostEditorFormValues>();

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailBlobPreviewUrl, setThumbnailBlobPreviewUrl] = useState("");

  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [localGalleryPreviews, setLocalGalleryPreviews] = useState<
    GalleryPreviewItem[]
  >([]);

  const thumbnailGalleryInputRef = useRef<HTMLInputElement | null>(null);
  const thumbnailCameraInputRef = useRef<HTMLInputElement | null>(null);
  const galleryImagesInputRef = useRef<HTMLInputElement | null>(null);

  const revokeBlobUrl = (url?: string) => {
    if (url?.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      title: initialValues?.title || "",
      slug: initialValues?.slug || "",
      excerpt: initialValues?.excerpt || "",
      content: initialValues?.content || "",
      category: initialValues?.category || "Game Development",
      status: initialValues?.status || "draft",
      thumbnailUrl: initialValues?.thumbnailUrl || "",
      links: initialValues?.links || [],
      images:
        initialValues?.images ||
        initialGalleryUrls.map((item, index) => ({
          alt: item.alt || "",
          url: item.url,
          sortOrder: index,
        })),
    });
  }, [form, initialValues, initialGalleryUrls]);

  const remoteGalleryPreviews: GalleryPreviewItem[] = useMemo(
    () =>
      initialGalleryUrls.map((item, index) => ({
        id: `remote-${index}-${item.url}`,
        url: item.url,
        alt: item.alt || "",
        isRemote: true,
      })),
    [initialGalleryUrls],
  );

  const galleryPreviews: GalleryPreviewItem[] = useMemo(
    () => [...remoteGalleryPreviews, ...localGalleryPreviews],
    [remoteGalleryPreviews, localGalleryPreviews],
  );

  useEffect(() => {
    return () => {
      revokeBlobUrl(thumbnailBlobPreviewUrl);
      localGalleryPreviews.forEach((item) => revokeBlobUrl(item.url));
    };
  }, [thumbnailBlobPreviewUrl, localGalleryPreviews]);

  const categories = useMemo(
    () => [
      { label: "Web Development", value: "Web Development" },
      { label: "Frontend", value: "Frontend" },
      { label: "Backend", value: "Backend" },
      { label: "UI/UX", value: "UI/UX" },
      { label: "Career", value: "Career" },
      { label: "Game Development", value: "Game Development" },
    ],
    [],
  );

  const previewThumbnailUrl =
    thumbnailBlobPreviewUrl ||
    initialImageUrl ||
    initialValues?.thumbnailUrl ||
    "";

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

  const updateThumbnailPreview = (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return false;

    revokeBlobUrl(thumbnailBlobPreviewUrl);

    const nextPreviewUrl = URL.createObjectURL(file);
    setThumbnailFile(file);
    setThumbnailBlobPreviewUrl(nextPreviewUrl);
    return true;
  };

  const handlePickThumbnail = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    updateThumbnailPreview(file);
    event.target.value = "";
  };

  const handleCaptureThumbnail = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    updateThumbnailPreview(file);
    event.target.value = "";
  };

  const handleRemoveThumbnail = () => {
    revokeBlobUrl(thumbnailBlobPreviewUrl);
    setThumbnailFile(null);
    setThumbnailBlobPreviewUrl("");
    form.setFieldValue("thumbnailUrl", "");
  };

  const handlePickGalleryImages = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []).filter((file) =>
      file.type.startsWith("image/"),
    );

    if (files.length === 0) {
      event.target.value = "";
      return;
    }

    const nextPreviewItems: GalleryPreviewItem[] = files.map((file, index) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${index}`,
      file,
      url: URL.createObjectURL(file),
      alt: "",
      sizeLabel: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      isRemote: false,
    }));

    setGalleryFiles((prev) => [...prev, ...files]);
    setLocalGalleryPreviews((prev) => [...prev, ...nextPreviewItems]);

    const currentImages = (form.getFieldValue("images") ||
      []) as PostEditorImageMetaValue[];
    const nextImages: PostEditorImageMetaValue[] = [
      ...currentImages,
      ...files.map((_, index) => ({
        alt: "",
        url: "",
        sortOrder: currentImages.length + index,
      })),
    ];

    form.setFieldValue("images", nextImages);
    event.target.value = "";
  };

  const handleRemoveGalleryItem = (index: number) => {
    const target = galleryPreviews[index];
    if (!target) return;

    if (target.url) {
      revokeBlobUrl(target.url);
    }

    if (!target.isRemote) {
      setLocalGalleryPreviews((prev) =>
        prev.filter((item) => item.id !== target.id),
      );

      setGalleryFiles((prev) =>
        prev.filter(
          (file) =>
            !(
              file.name === target.file?.name &&
              file.size === target.file?.size &&
              file.lastModified === target.file?.lastModified
            ),
        ),
      );
    }

    const currentImages = (form.getFieldValue("images") ||
      []) as PostEditorImageMetaValue[];

    const nextImages: PostEditorImageMetaValue[] = currentImages
      .filter((_, i) => i !== index)
      .map((item, i) => ({
        ...item,
        sortOrder: i,
      }));

    form.setFieldValue("images", nextImages);
  };

  const handleFinish = async (values: PostEditorFormValues) => {
    const normalizedValues: PostEditorFormValues = {
      ...values,
      slug: generateSlug(values.slug || values.title),
      status: values.status || "draft",
      links: (values.links || [])
        .map((item, index) => ({
          label: item.label?.trim() || "",
          url: item.url?.trim() || "",
          sortOrder:
            typeof item.sortOrder === "number" ? item.sortOrder : index,
        }))
        .filter((item) => item.label && item.url),
      images: (values.images || []).map((item, index) => ({
        alt: item.alt?.trim() || "",
        url: item.url?.trim() || "",
        sortOrder: typeof item.sortOrder === "number" ? item.sortOrder : index,
      })),
    };

    await onSubmit(normalizedValues, thumbnailFile, galleryFiles);
  };

  const titleText =
    mode === "create" ? "Tạo bài viết mới" : "Cập nhật bài viết";

  const subtitleText =
    mode === "create"
      ? "Tạo nội dung mới cho portfolio, thêm ảnh đại diện, nhiều ảnh gallery và liên kết liên quan."
      : "Chỉnh sửa nội dung bài viết, cập nhật ảnh đại diện, gallery và trạng thái xuất bản.";

  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f7fbff_0%,#edf4ff_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.10),transparent_22%)]" />

      <section className="mx-auto max-w-[1180px] px-6 pb-8 pt-[72px] max-[640px]:px-4">
        <div className="rounded-[28px] border border-white/80 bg-white/80 px-8 py-8 shadow-[0_24px_80px_rgba(37,99,235,0.08)] backdrop-blur max-[640px]:px-5">
          <div className="mb-4">
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 no-underline transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              <ArrowLeftOutlined />
              {backText}
            </Link>
          </div>

          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-blue-600">
            {mode === "create" ? "Admin create post" : "Admin update post"}
          </p>
          <h1 className="mb-3 text-[clamp(2rem,4vw,3.2rem)] leading-[1] tracking-[-0.04em] text-slate-900">
            {titleText}
          </h1>
          <p className="max-w-[62ch] leading-[1.8] text-slate-600">
            {subtitleText}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-6 pb-16 max-[640px]:px-4">
        <div className="grid grid-cols-[minmax(0,1fr)_340px] gap-6 max-[980px]:grid-cols-1">
          <div className="rounded-[28px] border border-white/80 bg-white/92 p-6 shadow-[0_18px_50px_rgba(37,99,235,0.06)]">
            <Form<PostEditorFormValues>
              form={form}
              layout="vertical"
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
                ...initialValues,
              }}
              onFinish={handleFinish}
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
                    <Select
                      size="large"
                      options={categories}
                      className="[&_.ant-select-selector]:!rounded-2xl [&_.ant-select-selector]:!border-slate-200 [&_.ant-select-selector]:!bg-slate-50"
                    />
                  </Form.Item>

                  <Form.Item
                    label={
                      <span className="font-medium text-slate-700">
                        Trạng thái
                      </span>
                    }
                    name="status"
                    rules={[
                      { required: true, message: "Vui lòng chọn trạng thái" },
                    ]}
                  >
                    <Select
                      size="large"
                      options={[
                        { label: "Draft", value: "draft" },
                        { label: "Published", value: "published" },
                      ]}
                      className="[&_.ant-select-selector]:!rounded-2xl [&_.ant-select-selector]:!border-slate-200 [&_.ant-select-selector]:!bg-slate-50"
                    />
                  </Form.Item>
                </div>

                <Form.Item
                  label={
                    <span className="font-medium text-slate-700">
                      Thumbnail URL (optional)
                    </span>
                  }
                  name="thumbnailUrl"
                >
                  <Input
                    size="large"
                    placeholder="https://example.com/thumbnail.jpg"
                    className="!rounded-2xl !border-slate-200 !bg-slate-50 !px-4 !py-3 hover:!border-slate-300 focus:!border-blue-500"
                  />
                </Form.Item>

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

                <Form.List name="links">
                  {(fields, { add, remove }) => (
                    <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                          <h3 className="m-0 text-lg font-semibold text-slate-900">
                            Liên kết
                          </h3>
                          <p className="mt-1 text-sm text-slate-600">
                            Github, demo, Youtube hoặc tài nguyên liên quan.
                          </p>
                        </div>

                        <Button
                          type="dashed"
                          icon={<PlusOutlined />}
                          onClick={() => add({ label: "", url: "" })}
                          className="!rounded-full"
                        >
                          Thêm link
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {fields.map((field, index) => (
                          <div
                            key={field.key}
                            className="rounded-[20px] border border-slate-200 bg-white p-4"
                          >
                            <div className="grid grid-cols-[1fr_1.4fr_auto] gap-3 max-[768px]:grid-cols-1">
                              <Form.Item
                                {...field}
                                label="Label"
                                name={[field.name, "label"]}
                                rules={[
                                  { required: true, message: "Nhập label" },
                                ]}
                                className="!mb-0"
                              >
                                <Input
                                  size="large"
                                  placeholder="Github, Demo, Youtube..."
                                  className="!rounded-2xl"
                                />
                              </Form.Item>

                              <Form.Item
                                {...field}
                                label="URL"
                                name={[field.name, "url"]}
                                rules={[
                                  { required: true, message: "Nhập URL" },
                                  { type: "url", message: "URL không hợp lệ" },
                                ]}
                                className="!mb-0"
                              >
                                <Input
                                  size="large"
                                  placeholder="https://..."
                                  className="!rounded-2xl"
                                />
                              </Form.Item>

                              <div className="flex items-end">
                                <Button
                                  danger
                                  icon={<DeleteOutlined />}
                                  onClick={() => remove(field.name)}
                                  className="!h-[40px] !rounded-full"
                                >
                                  Xóa
                                </Button>
                              </div>
                            </div>

                            <Form.Item
                              {...field}
                              name={[field.name, "sortOrder"]}
                              initialValue={index}
                              className="!hidden"
                            >
                              <Input type="hidden" />
                            </Form.Item>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Form.List>

                <Form.List name="images">
                  {(fields, { add, remove }) => (
                    <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4">
                      <div className="mb-4 flex items-center justify-between gap-3 max-[640px]:flex-col max-[640px]:items-start">
                        <div>
                          <h3 className="m-0 text-lg font-semibold text-slate-900">
                            Gallery ảnh
                          </h3>
                          <p className="mt-1 text-sm text-slate-600">
                            Có thể thêm ảnh từ máy hoặc khai báo URL ảnh có sẵn.
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="dashed"
                            icon={<PictureOutlined />}
                            onClick={() =>
                              galleryImagesInputRef.current?.click()
                            }
                            className="!rounded-full"
                          >
                            Thêm ảnh từ máy
                          </Button>

                          <Button
                            type="dashed"
                            icon={<PlusOutlined />}
                            onClick={() => add({ alt: "", url: "" })}
                            className="!rounded-full"
                          >
                            Thêm ảnh URL
                          </Button>
                        </div>
                      </div>

                      <input
                        ref={galleryImagesInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePickGalleryImages}
                        className="hidden"
                      />

                      {fields.length > 0 ? (
                        <div className="space-y-4">
                          {fields.map((field, index) => (
                            <div
                              key={field.key}
                              className="rounded-[20px] border border-slate-200 bg-white p-4"
                            >
                              <div className="grid grid-cols-[120px_1fr_auto] gap-4 max-[768px]:grid-cols-1">
                                <div className="overflow-hidden rounded-[18px] border border-slate-200 bg-slate-100">
                                  {galleryPreviews[index]?.url ? (
                                    <img
                                      src={galleryPreviews[index].url}
                                      alt={
                                        galleryPreviews[index].alt ||
                                        `Gallery ${index + 1}`
                                      }
                                      className="aspect-square w-full object-cover"
                                    />
                                  ) : (
                                    <div className="flex aspect-square items-center justify-center text-slate-400">
                                      <InboxOutlined />
                                    </div>
                                  )}
                                </div>

                                <div className="grid gap-3">
                                  <Form.Item
                                    {...field}
                                    label="Alt text"
                                    name={[field.name, "alt"]}
                                    className="!mb-0"
                                  >
                                    <Input
                                      size="large"
                                      placeholder="Mô tả ngắn cho ảnh"
                                      className="!rounded-2xl"
                                      onChange={(e) => {
                                        const nextAlt = e.target.value;

                                        if (galleryPreviews[index]?.isRemote) {
                                          return;
                                        }

                                        setLocalGalleryPreviews((prev) =>
                                          prev.map((item) =>
                                            item.id ===
                                            galleryPreviews[index]?.id
                                              ? { ...item, alt: nextAlt }
                                              : item,
                                          ),
                                        );
                                      }}
                                    />
                                  </Form.Item>

                                  <Form.Item
                                    {...field}
                                    label="Image URL (optional)"
                                    name={[field.name, "url"]}
                                    className="!mb-0"
                                  >
                                    <Input
                                      size="large"
                                      placeholder="https://example.com/gallery-image.jpg"
                                      className="!rounded-2xl"
                                    />
                                  </Form.Item>

                                  <Form.Item
                                    {...field}
                                    name={[field.name, "sortOrder"]}
                                    initialValue={index}
                                    className="!hidden"
                                  >
                                    <Input type="hidden" />
                                  </Form.Item>

                                  {galleryPreviews[index]?.sizeLabel && (
                                    <p className="m-0 text-xs text-slate-500">
                                      {galleryPreviews[index].sizeLabel}
                                    </p>
                                  )}
                                </div>

                                <div className="flex items-start justify-end">
                                  <Button
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => {
                                      remove(field.name);
                                      handleRemoveGalleryItem(index);
                                    }}
                                    className="!rounded-full"
                                  >
                                    Xóa
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-[20px] border border-dashed border-slate-300 bg-white px-6 py-8 text-center">
                          <InboxOutlined className="mb-3 text-[26px] text-slate-400" />
                          <p className="mb-1 text-sm font-semibold text-slate-700">
                            Chưa có ảnh gallery nào
                          </p>
                          <p className="m-0 text-sm leading-7 text-slate-500">
                            Bạn có thể chọn nhiều ảnh từ máy hoặc thêm ảnh bằng
                            URL.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </Form.List>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button
                    htmlType="submit"
                    type="primary"
                    size="large"
                    icon={<SaveOutlined />}
                    loading={loading}
                    className="!h-auto !rounded-full !border-0 !bg-blue-600 !px-5 !py-3 !font-bold !shadow-[0_14px_24px_rgba(37,99,235,0.18)] hover:!bg-blue-700"
                  >
                    {submitText ||
                      (mode === "create" ? "Tạo bài viết" : "Lưu cập nhật")}
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
              ref={thumbnailGalleryInputRef}
              type="file"
              accept="image/*"
              onChange={handlePickThumbnail}
              className="hidden"
            />

            <input
              ref={thumbnailCameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleCaptureThumbnail}
              className="hidden"
            />

            <div className="flex flex-col gap-3">
              <Button
                size="large"
                icon={<PictureOutlined />}
                onClick={() => thumbnailGalleryInputRef.current?.click()}
                className="!h-auto !rounded-2xl !border-slate-200 !bg-white !px-4 !py-3 !font-semibold !text-slate-700 hover:!border-blue-200 hover:!bg-blue-50 hover:!text-blue-700"
              >
                Chọn ảnh từ máy
              </Button>

              <Button
                size="large"
                icon={<CameraOutlined />}
                onClick={() => thumbnailCameraInputRef.current?.click()}
                className="!h-auto !rounded-2xl !border-slate-200 !bg-white !px-4 !py-3 !font-semibold !text-slate-700 hover:!border-blue-200 hover:!bg-blue-50 hover:!text-blue-700"
              >
                Chụp ảnh bằng điện thoại
              </Button>

              {(thumbnailFile || previewThumbnailUrl) && (
                <Button
                  size="large"
                  danger
                  onClick={handleRemoveThumbnail}
                  className="!h-auto !rounded-2xl !px-4 !py-3"
                >
                  Xóa ảnh đã chọn
                </Button>
              )}
            </div>

            <div className="mt-5 overflow-hidden rounded-[24px] border border-dashed border-slate-300 bg-slate-50">
              {previewThumbnailUrl ? (
                <img
                  src={previewThumbnailUrl}
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

            {thumbnailFile && (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="mb-1 break-all text-sm font-semibold text-slate-800">
                  {thumbnailFile.name}
                </p>
                <p className="text-xs text-slate-500">
                  {(thumbnailFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
