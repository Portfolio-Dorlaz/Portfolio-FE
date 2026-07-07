import Link from "next/link";

type PostCardPost = {
  id: string;
  slug?: string | null;
  title?: string | null;
  excerpt?: string | null;
  category?: string | null;
  createdAt?: string;
  publishedAt?: string | null;
  thumbnailUrl?: string | null;
};

type Props = {
  post: PostCardPost;
};

export default function PostCard({ post }: Props) {
  return (
    <article className="group flex h-full flex-col rounded-[24px] border border-white/80 bg-white/92 p-6 text-slate-900 shadow-[0_16px_40px_rgba(37,99,235,0.06)] transition duration-300 hover:-translate-y-[4px] hover:border-blue-200 hover:shadow-[0_24px_56px_rgba(37,99,235,0.12)]">
      <div className="mb-4 flex flex-wrap items-center gap-2.5 text-sm text-slate-500">
        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-[12px] font-bold uppercase tracking-[0.08em] text-blue-700">
          {post.category || "Uncategorized"}
        </span>
        <span>{post.createdAt || post.publishedAt || "Unknown date"}</span>
      </div>

      <h3 className="mb-3 text-[1.35rem] font-semibold leading-[1.35] tracking-[-0.02em] text-slate-900 transition-colors group-hover:text-blue-700">
        {post.title}
      </h3>

      <p className="mb-6 line-clamp-4 text-[15px] leading-[1.8] text-slate-600">
        {post.excerpt}
      </p>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
        <span className="text-sm font-medium text-slate-500">5 phút</span>

        <Link
          href={`/posts/${post.slug}`}
          className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2.5 text-sm font-bold text-white no-underline shadow-[0_12px_24px_rgba(37,99,235,0.18)] transition duration-200 hover:bg-blue-700"
        >
          Đọc thêm
        </Link>
      </div>
    </article>
  );
}
