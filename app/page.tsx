import PostCard from "@/components/PostCard";

const featuredProjects = [
  {
    id: "f1",
    title: "Portfolio CMS Platform",
    description:
      "Hệ thống quản lý portfolio với đăng nhập JWT, CRUD bài viết, quản lý project và phân tách rõ public/admin routes.",
    stack: ["Next.js", "Express", "PostgreSQL"],
    status: "Full-stack build",
  },
  {
    id: "f2",
    title: "Gameplay Prototype Systems",
    description:
      "Prototype các core loop, progression flow và interaction systems với tư duy thiên về gameplay readability và iteration nhanh.",
    stack: ["Game Design", "Systems", "Prototype"],
    status: "Game dev focus",
  },
  {
    id: "f3",
    title: "Interactive Web Experiences",
    description:
      "Thiết kế và xây dựng các landing page, UI system và web experience có độ polish cao, rõ luồng và dễ mở rộng.",
    stack: ["UI/UX", "Frontend", "Product Thinking"],
    status: "Experience design",
  },
];

const skills = [
  {
    title: "Gameplay Systems",
    text: "Thiết kế mechanics, game loop và interaction flow với ưu tiên tính rõ ràng và khả năng iterate nhanh.",
  },
  {
    title: "Web Apps",
    text: "Xây dựng giao diện và sản phẩm web với Next.js, state management, API integration và trải nghiệm mượt.",
  },
  {
    title: "CMS & Admin Tools",
    text: "Thiết kế dashboard, auth flow, CRUD structure và content workflow cho các hệ thống quản trị cá nhân.",
  },
  {
    title: "UI Implementation",
    text: "Biến mockup hoặc ý tưởng thành giao diện thật với layout rõ, component sạch và responsive tốt.",
  },
];

const postList = [
  {
    id: "1",
    slug: "xay-dung-portfolio-cms-voi-nextjs-va-express",
    title: "Xây dựng Portfolio CMS với Next.js và Express",
    excerpt:
      "Một hướng đi gọn cho project CV: frontend public đẹp, backend JWT auth, admin CRUD bài viết.",
    category: "Development",
    date: "28 Jun 2026",
    readTime: "6 min read",
  },
  {
    id: "2",
    slug: "thiet-ke-landing-page-sang-sach-va-de-doc",
    title: "Thiết kế landing page sáng, sạch và dễ đọc",
    excerpt:
      "Tối ưu phần hero, card bài viết và điều hướng để người dùng xem nội dung ngay cả khi chưa đăng nhập.",
    category: "UI/UX",
    date: "27 Jun 2026",
    readTime: "4 min read",
  },
  {
    id: "3",
    slug: "jwt-auth-co-ban-cho-blog-cms-ca-nhan",
    title: "JWT auth cơ bản cho blog CMS cá nhân",
    excerpt:
      "Tách rõ public route và admin route để hệ thống đơn giản, dễ debug và phù hợp project portfolio.",
    category: "Backend",
    date: "26 Jun 2026",
    readTime: "7 min read",
  },
];

export default function HomePage() {
  return (
    <main className="landing-page">
      <section className="hero-section">
        <div className="hero-copy">
          <p className="hero-tag">Game Dev × Web Dev</p>
          <h1>
            Võ Tấn Tài builds playable systems and polished web experiences.
          </h1>
          <p className="hero-text">
            Tôi phát triển gameplay prototypes, gameplay systems và các sản phẩm
            web full-stack với trọng tâm vào trải nghiệm, hiệu năng và cấu trúc
            sạch.
          </p>

          <div className="hero-actions">
            <a href="#featured" className="btn btn-primary">
              Xem project nổi bật
            </a>
            <a href="#writing" className="btn btn-outline">
              Đọc bài viết
            </a>
          </div>
        </div>

        <div className="hero-highlight">
          <div className="hero-panel-card status-card">
            <span className="hero-chip">Now building</span>
            <h3>Portfolio CMS, gameplay prototypes, admin systems</h3>
            <p>
              Kết hợp tư duy sản phẩm web với cách tiếp cận hệ thống của game
              development.
            </p>
          </div>

          <div className="meta-grid">
            <div className="meta-card">
              <strong>Focus</strong>
              <span>Gameplay, Tools, Full-stack</span>
            </div>
            <div className="meta-card">
              <strong>Stack</strong>
              <span>Next.js, Express, PostgreSQL, UI Systems</span>
            </div>
          </div>
        </div>
      </section>

      <section id="featured" className="featured-section">
        <div className="section-head">
          <div>
            <p className="section-tag">Featured work</p>
            <h2>Project nổi bật</h2>
          </div>
          <p className="section-description">
            Một vài hướng build thể hiện cách tôi kết hợp tư duy gameplay, hệ
            thống và sản phẩm web.
          </p>
        </div>

        <div className="featured-grid">
          {featuredProjects.map((project, index) => (
            <article
              key={project.id}
              className={`featured-card ${index === 0 ? "featured-card-large" : ""}`}
            >
              <span className="featured-status">{project.status}</span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>

              <div className="featured-stack">
                {project.stack.map((item) => (
                  <span key={item} className="stack-chip">
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="skills-section">
        <div className="section-head">
          <div>
            <p className="section-tag">What I do</p>
            <h2>Năng lực chính</h2>
          </div>
          <p className="section-description">
            Tập trung vào interactive systems, công cụ quản trị và giao diện có
            cấu trúc rõ ràng.
          </p>
        </div>

        <div className="skills-grid">
          {skills.map((skill) => (
            <article key={skill.title} className="skill-card">
              <h3>{skill.title}</h3>
              <p>{skill.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="writing" className="posts-section">
        <div className="section-head">
          <div>
            <p className="section-tag">Writing</p>
            <h2>Ghi chú và bài viết</h2>
          </div>
          <p className="section-description">
            Các ghi chú ngắn về frontend, backend, auth flow và cách tổ chức một
            portfolio CMS gọn.
          </p>
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
