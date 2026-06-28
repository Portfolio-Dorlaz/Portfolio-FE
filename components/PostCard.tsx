type Post = {
  category: string;
  date: string;
  title: string;
  excerpt: string;
  readTime: string;
};

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="post-card">
      <div className="post-meta">
        <span className="post-category">{post.category}</span>
        <span className="post-dot">•</span>
        <span>{post.date}</span>
      </div>

      <h3 className="post-title">{post.title}</h3>
      <p className="post-excerpt">{post.excerpt}</p>

      <div className="post-footer">
        <span className="post-read-time">{post.readTime}</span>
        <button className="read-more-button">Xem bài viết</button>
      </div>
    </article>
  );
}