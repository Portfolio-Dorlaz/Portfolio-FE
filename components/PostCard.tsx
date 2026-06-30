import Link from "next/link";
import "../styles/post-card.css";

type PostCardPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string | null;
  createdAt?: string;
  publishedAt?: string | null;
  thumbnailUrl?: string | null;
};

type Props = {
  post: PostCardPost;
};

export default function PostCard({ post }: Props) {
  return (
    <article className="post-card">
      <div className="post-meta">
        <span className="post-category">{post.category}</span>
        <span>{post.createdAt}</span>
      </div>

      <h3 className="post-title">{post.title}</h3>
      <p className="post-excerpt">{post.excerpt}</p>

      <div className="post-footer">
        <span className="post-read-time">5 phút</span>
        <Link href={`/posts/${post.slug}`} className="read-more-button">
          Đọc thêm
        </Link>
      </div>
    </article>
  );
}
