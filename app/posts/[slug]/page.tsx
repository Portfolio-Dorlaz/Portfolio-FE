import Header from '@/components/Header';
import '../../../styles/post-detail.css';

const relatedPosts = [
  {
    id: '2',
    title: 'Thiết kế landing page sáng, sạch và dễ đọc',
    category: 'UI/UX',
  },
  {
    id: '3',
    title: 'JWT auth cơ bản cho blog CMS cá nhân',
    category: 'Backend',
  },
  {
    id: '4',
    title: 'Tổ chức auth flow cho frontend với Redux Toolkit',
    category: 'Frontend',
  },
];

export default function PostDetailPage() {
  return (
    <main className="post-detail-page">
      <Header />

      <section className="post-hero">
        <div className="post-hero-inner">
          <p className="post-category-label">Development</p>
          <h1>Xây dựng Portfolio CMS với Next.js và Express</h1>
          <p className="post-lead">
            Một hướng đi gọn cho project CV: frontend public đẹp, backend JWT auth,
            admin CRUD bài viết và cấu trúc rõ giữa public routes với admin routes.
          </p>

          <div className="post-meta-row">
            <span>28 Jun 2026</span>
            <span>6 min read</span>
            <span>By Võ Tấn Tài</span>
          </div>
        </div>
      </section>

      <section className="post-body-layout">
        <aside className="post-toc">
          <div className="toc-card">
            <p className="toc-title">On this page</p>
            <a href="#overview">Tổng quan</a>
            <a href="#architecture">Kiến trúc</a>
            <a href="#auth">Auth flow</a>
            <a href="#admin">Admin CMS</a>
            <a href="#conclusion">Kết luận</a>
          </div>
        </aside>

        <article className="post-content">
          <section id="overview">
            <h2>Tổng quan</h2>
            <p>
              Portfolio CMS là một dạng project rất phù hợp để thể hiện tư duy full-stack,
              vì nó có cả phần public cho người xem và phần admin cho người quản trị nội dung.
            </p>
            <p>
              Nếu tổ chức tốt từ đầu, bạn có thể giữ codebase gọn, dễ mở rộng và không bị
              lẫn logic giữa guest-facing pages với dashboard nội bộ.
            </p>
          </section>

          <section id="architecture">
            <h2>Kiến trúc</h2>
            <p>
              Cách đơn giản nhất là chia hệ thống thành hai phần rõ ràng: public frontend và
              admin management flow. Public side tập trung vào landing page, danh sách bài viết,
              trang chi tiết bài viết và project showcase.
            </p>
            <p>
              Trong khi đó, admin side tập trung vào authentication, CRUD bài viết, CRUD project
              và quản lý nội dung tổng quát.
            </p>
          </section>

          <section id="auth">
            <h2>Auth flow</h2>
            <p>
              Với project dạng này, JWT access token kết hợp refresh strategy là đủ tốt cho một
              hệ thống portfolio cá nhân. Điểm quan trọng là tách selector, auth state và route
              guard để UI phản ứng đúng khi login hoặc logout.
            </p>
            <blockquote>
              Một auth flow tốt không làm app phức tạp hơn mức cần thiết.
            </blockquote>
          </section>

          <section id="admin">
            <h2>Admin CMS</h2>
            <p>
              Admin page nên ưu tiên dashboard đơn giản, form dễ dùng và table/card layout rõ ràng.
              Không cần làm quá nhiều tính năng từ đầu; chỉ cần tạo, sửa, xóa và preview nội dung là đủ.
            </p>

            <ul>
              <li>Quản lý bài viết theo title, category, slug.</li>
              <li>Preview nhanh metadata và excerpt.</li>
              <li>Tách component form để tái sử dụng khi create/edit.</li>
            </ul>
          </section>

          <section id="conclusion">
            <h2>Kết luận</h2>
            <p>
              Đây là một loại project nhỏ nhưng rất tốt để đưa vào portfolio vì nó chạm vào
              cả frontend, backend, auth, UI/UX và tư duy tổ chức hệ thống.
            </p>
          </section>
        </article>
      </section>

      <section className="related-posts">
        <div className="related-head">
          <p className="section-tag">Continue reading</p>
          <h2>Bài viết liên quan</h2>
        </div>

        <div className="related-grid">
          {relatedPosts.map((post) => (
            <a key={post.id} href={`/posts/${post.id}`} className="related-card">
              <span>{post.category}</span>
              <h3>{post.title}</h3>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}