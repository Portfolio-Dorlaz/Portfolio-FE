"use client";

import Link from "next/link";
import { Button, Input, Select, Table, Tag, Popconfirm, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  getAllPosts,
  deletePost,
  getAllPostsAdmin,
} from "@/redux/slices/postSlice";
import {
  PostLoadingSelector,
  PostErrorSelector,
  PostsAdminSelector,
} from "@/redux/selector";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";

type AdminPost = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt?: string;
  createdAt?: string;
  publishedAt?: string | null;
  status?: "published" | "draft";
  isPublished?: boolean;
};

export default function AdminPostsPage() {
  const dispatch = useAppDispatch();

  const posts = useAppSelector(PostsAdminSelector) as AdminPost[];
  const loading = useAppSelector(PostLoadingSelector);
  const error = useAppSelector(PostErrorSelector);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getAllPostsAdmin());
  }, [dispatch]);

  const normalizedPosts = useMemo(() => {
    return posts.map((post) => {
      const resolvedStatus =
        post.status ?? (post.isPublished ? "published" : "draft");

      return {
        ...post,
        status: resolvedStatus,
      };
    });
  }, [posts]);

  const categories = useMemo(() => {
    return [
      "all",
      ...Array.from(
        new Set(normalizedPosts.map((post) => post.category).filter(Boolean)),
      ),
    ];
  }, [normalizedPosts]);

  const filteredPosts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return normalizedPosts.filter((post) => {
      const matchSearch =
        !keyword ||
        post.title?.toLowerCase().includes(keyword) ||
        post.slug?.toLowerCase().includes(keyword) ||
        post.category?.toLowerCase().includes(keyword) ||
        post.excerpt?.toLowerCase().includes(keyword);

      const matchCategory = category === "all" || post.category === category;
      const matchStatus = status === "all" || post.status === status;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [normalizedPosts, search, category, status]);

  const totalPosts = normalizedPosts.length;
  const publishedPosts = normalizedPosts.filter(
    (post) => post.status === "published",
  ).length;
  const draftPosts = normalizedPosts.filter(
    (post) => post.status === "draft",
  ).length;

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);

      await dispatch(deletePost({ id })).unwrap();
      message.success("Đã xóa bài viết");

      await dispatch(getAllPostsAdmin()).unwrap();
    } catch (err) {
      console.error(err);
      message.error("Xóa bài viết thất bại");
    } finally {
      setDeletingId(null);
    }
  };

  const columns: ColumnsType<AdminPost & { status: "published" | "draft" }> = [
    {
      title: "Bài viết",
      dataIndex: "title",
      key: "title",
      render: (_, record) => (
        <div className="min-w-0">
          <p className="mb-1 line-clamp-1 text-[15px] font-semibold text-slate-900">
            {record.title}
          </p>
          <span className="text-sm text-slate-500">/{record.slug}</span>
        </div>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (value: string) => (
        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
          {value || "Uncategorized"}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (value: "published" | "draft") =>
        value === "published" ? (
          <Tag className="!rounded-full !border-emerald-200 !bg-emerald-50 !px-3 !py-1 !text-emerald-700">
            Published
          </Tag>
        ) : (
          <Tag className="!rounded-full !border-amber-200 !bg-amber-50 !px-3 !py-1 !text-amber-700">
            Draft
          </Tag>
        ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_: string, record) => (
        <span className="text-sm text-slate-600">
          {record.createdAt || record.publishedAt || "Unknown date"}
        </span>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/posts/${record.slug}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            <EyeOutlined />
          </Link>

          <Link
            href={`/admin/posts/${record.slug}/edit`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            <EditOutlined />
          </Link>

          <Popconfirm
            title="Xóa bài viết"
            description="Bạn có chắc muốn xóa bài viết này?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDelete(record.id)}
          >
            <button
              type="button"
              disabled={deletingId === record.id}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <DeleteOutlined />
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f7fbff_0%,#edf4ff_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.10),transparent_22%)]" />
      <section className="mx-auto max-w-[1280px] px-6 pb-8 pt-[72px] max-[640px]:px-4">
        <div className="rounded-[28px] border border-white/80 bg-white/80 px-8 py-8 shadow-[0_24px_80px_rgba(37,99,235,0.08)] backdrop-blur max-[640px]:px-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-blue-600">
                Admin panel
              </p>
              <h1 className="mb-3 text-[clamp(2rem,4vw,3.2rem)] leading-[1] tracking-[-0.04em] text-slate-900">
                Quản lý bài viết
              </h1>
              <p className="max-w-[62ch] leading-[1.8] text-slate-600">
                Theo dõi danh sách bài viết, lọc theo category hoặc trạng thái,
                và thực hiện các thao tác quản trị nội dung trong một màn hình
                duy nhất.
              </p>
            </div>

            <Link href="/admin/posts/create">
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                className="!h-auto !rounded-full !border-0 !bg-blue-600 !px-5 !py-3 !font-bold !shadow-[0_14px_24px_rgba(37,99,235,0.18)] hover:!bg-blue-700"
              >
                Tạo bài viết
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1280px] grid-cols-3 gap-5 px-6 pb-8 max-[960px]:grid-cols-1 max-[640px]:px-4">
        <div className="rounded-[24px] border border-white/80 bg-white/92 p-6 shadow-[0_16px_34px_rgba(37,99,235,0.06)]">
          <p className="mb-2 text-sm font-medium text-slate-500">
            Tổng bài viết
          </p>
          <h2 className="m-0 text-[2rem] font-semibold text-slate-900">
            {totalPosts}
          </h2>
        </div>

        <div className="rounded-[24px] border border-white/80 bg-white/92 p-6 shadow-[0_16px_34px_rgba(37,99,235,0.06)]">
          <p className="mb-2 text-sm font-medium text-slate-500">Published</p>
          <h2 className="m-0 text-[2rem] font-semibold text-slate-900">
            {publishedPosts}
          </h2>
        </div>

        <div className="rounded-[24px] border border-white/80 bg-white/92 p-6 shadow-[0_16px_34px_rgba(37,99,235,0.06)]">
          <p className="mb-2 text-sm font-medium text-slate-500">Draft</p>
          <h2 className="m-0 text-[2rem] font-semibold text-slate-900">
            {draftPosts}
          </h2>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 pb-16 max-[640px]:px-4">
        <div className="rounded-[28px] border border-white/80 bg-white/92 p-6 shadow-[0_18px_50px_rgba(37,99,235,0.06)]">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <div className="min-w-[240px] flex-1">
              <Input
                placeholder="Tìm theo tiêu đề, slug hoặc category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                size="large"
                className="!rounded-2xl !border-slate-200 !bg-slate-50 !px-4 !py-2 !text-slate-900 hover:!border-slate-300 focus:!border-blue-500"
              />
            </div>

            <Select
              size="large"
              value={category}
              onChange={setCategory}
              className="min-w-[180px]"
              options={categories.map((item) => ({
                value: item,
                label: item === "all" ? "Tất cả category" : item,
              }))}
            />

            <Select
              size="large"
              value={status}
              onChange={setStatus}
              className="min-w-[180px]"
              options={[
                { value: "all", label: "Tất cả trạng thái" },
                { value: "published", label: "Published" },
                { value: "draft", label: "Draft" },
              ]}
            />
          </div>

          {error && (
            <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-600">
              {error.message || "Không thể tải danh sách bài viết"}
            </div>
          )}

          <div className="overflow-hidden rounded-[22px] border border-slate-200">
            <Table
              rowKey="id"
              columns={columns}
              dataSource={filteredPosts}
              loading={loading}
              pagination={{ pageSize: 6 }}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
