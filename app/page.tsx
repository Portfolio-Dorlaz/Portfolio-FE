import Header from '@/components/Header';
import '../styles/landing.css';
import PostCard from '@/components/PostCard';

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
];

export default function HomePage() {
  return (
    <main className="landing-page">
      <Header />

      <section className="hero-section">
        <div className="hero-copy">
          <p className="hero-tag">Public blog</p>
          <h1>Đọc bài viết ngay cả khi chưa đăng nhập</h1>
          <p className="hero-text">
            Đây là landing page public cho người dùng xem bài viết, khám phá nội dung và bấm đăng nhập khi cần vào khu vực quản trị.
          </p>
        </div>

        <div className="hero-panel">
          <div className="hero-panel-card">
            <span className="hero-chip">Open access</span>
            <h3>Nội dung public</h3>
            <p>
              Người dùng chưa đăng nhập vẫn có thể đọc danh sách bài viết, còn admin dùng nút đăng nhập ở header để vào dashboard.
            </p>
          </div>
        </div>
      </section>

      <section className="posts-section">
        <div className="section-head">
          <div>
            <p className="section-tag">Latest posts</p>
            <h2>Bài viết mới</h2>
          </div>
        </div>

        <div className="posts-grid">
          {postList.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </main>
  );
}