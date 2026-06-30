import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import '../../styles/posts-page.css';

const postList = [
  {
    id: '1',
    title: 'Xây dựng Portfolio CMS với Next.js và Express',
    excerpt:
      'Một hướng đi gọn cho project CV: frontend public đẹp, backend JWT auth, admin CRUD bài viết.',
    category: 'Development',
    date: '28 Jun 2026',
    readTime: '6 min read',
  },
  {
    id: '2',
    title: 'Thiết kế landing page sáng, sạch và dễ đọc',
    excerpt:
      'Tối ưu phần hero, card bài viết và điều hướng để người dùng xem nội dung ngay cả khi chưa đăng nhập.',
    category: 'UI/UX',
    date: '27 Jun 2026',
    readTime: '4 min read',
  },
  {
    id: '3',
    title: 'JWT auth cơ bản cho blog CMS cá nhân',
    excerpt:
      'Tách rõ public route và admin route để hệ thống đơn giản, dễ debug và phù hợp project portfolio.',
    category: 'Backend',
    date: '26 Jun 2026',
    readTime: '7 min read',
  },
  {
    id: '4',
    title: 'Tổ chức auth flow cho frontend với Redux Toolkit',
    excerpt:
      'Cách bootstrap auth state, refresh token và giữ trải nghiệm mượt sau khi reload trang.',
    category: 'Frontend',
    date: '25 Jun 2026',
    readTime: '5 min read',
  },
  {
    id: '5',
    title: 'Thiết kế card layout cho blog archive page',
    excerpt:
      'Tạo nhịp thị giác tốt hơn cho page danh sách bài viết bằng hierarchy và spacing hợp lý.',
    category: 'UI/UX',
    date: '24 Jun 2026',
    readTime: '4 min read',
  },
  {
    id: '6',
    title: 'Tư duy chia public route và admin route trong CMS',
    excerpt:
      'Một cấu trúc nhỏ nhưng giúp project dễ mở rộng, debug nhanh và ít đụng nhau giữa user/admin.',
    category: 'Architecture',
    date: '23 Jun 2026',
    readTime: '6 min read',
  },
];

export default function PostsPage() {
  const featuredPost = postList[0];
  const otherPosts = postList.slice(1);

  return (
    <main className="posts-page">
      <Header />

      <section className="posts-hero">
        <div className="posts-hero-copy">
          <p className="posts-kicker">Writing archive</p>
          <h1>Bài viết về web, gameplay systems và portfolio building.</h1>
          <p className="posts-subtext">
            Tập hợp các ghi chú ngắn, bài viết kỹ thuật và chia sẻ về cách tôi xây dựng sản phẩm,
            tổ chức hệ thống và tối ưu trải nghiệm.
          </p>
        </div>
      </section>

      <section className="posts-toolbar">
        <div className="toolbar-search">
          <input type="text" placeholder="Tìm bài viết..." />
        </div>

        <div className="toolbar-filters">
          <button className="filter-chip active">Tất cả</button>
          <button className="filter-chip">Development</button>
          <button className="filter-chip">UI/UX</button>
          <button className="filter-chip">Backend</button>
        </div>
      </section>

      <section className="featured-post-section">
        <div className="section-head">
          <p className="section-tag">Featured</p>
          <h2>Bài viết nổi bật</h2>
        </div>

        <article className="featured-post-card">
          <div className="featured-post-meta">
            <span className="post-category">{featuredPost.category}</span>
            <span>{featuredPost.date}</span>
            <span>{featuredPost.readTime}</span>
          </div>

          <h3>{featuredPost.title}</h3>
          <p>{featuredPost.excerpt}</p>

          <a href={`/posts/${featuredPost.id}`} className="read-post-link">
            Đọc bài viết
          </a>
        </article>
      </section>

      <section className="posts-list-section">
        <div className="section-head">
          <p className="section-tag">All posts</p>
          <h2>Tất cả bài viết</h2>
        </div>

        <div className="posts-grid">
          {otherPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </main>
  );
}