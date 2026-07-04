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
    createdAt: "28 Jun 2026",
    readTime: "6 min read",
  },
  {
    id: "2",
    slug: "thiet-ke-landing-page-sang-sach-va-de-doc",
    title: "Thiết kế landing page sáng, sạch và dễ đọc",
    excerpt:
      "Tối ưu phần hero, card bài viết và điều hướng để người dùng xem nội dung ngay cả khi chưa đăng nhập.",
    category: "UI/UX",
    createdAt: "27 Jun 2026",
    readTime: "4 min read",
  },
  {
    id: "3",
    slug: "jwt-auth-co-ban-cho-blog-cms-ca-nhan",
    title: "JWT auth cơ bản cho blog CMS cá nhân",
    excerpt:
      "Tách rõ public route và admin route để hệ thống đơn giản, dễ debug và phù hợp project portfolio.",
    category: "Backend",
    createdAt: "26 Jun 2026",
    readTime: "7 min read",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f7fbff_0%,#edf4ff_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.10),transparent_22%)]" />
      <section className="mx-auto grid max-w-[1180px] grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] items-center gap-8 px-6 pb-16 pt-20 max-[980px]:grid-cols-1 max-[980px]:pt-14 max-[640px]:px-4">
        <div>
          <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.18em] text-blue-600">
            Game Dev × Web Dev
          </p>

          <h1 className="max-w-[11ch] text-[clamp(2.8rem,6vw,5.6rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-slate-900 max-[980px]:max-w-[12ch] max-[640px]:text-[clamp(2.3rem,12vw,3.6rem)]">
            Võ Tấn Tài builds playable systems and polished web experiences.
          </h1>

          <p className="mt-6 max-w-[62ch] text-[16px] leading-[1.9] text-slate-600">
            Tôi phát triển gameplay prototypes, gameplay systems và các sản phẩm
            web full-stack với trọng tâm vào trải nghiệm, hiệu năng và cấu trúc
            sạch.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#featured"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white no-underline shadow-[0_16px_30px_rgba(37,99,235,0.18)] transition duration-200 hover:-translate-y-[1px] hover:bg-blue-700"
            >
              Xem project nổi bật
            </a>
            <a
              href="#writing"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 no-underline transition duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              Đọc bài viết
            </a>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[28px] border border-white/80 bg-white/92 p-6 shadow-[0_18px_50px_rgba(37,99,235,0.08)]">
            <span className="mb-4 inline-flex rounded-full bg-blue-50 px-3 py-1 text-[12px] font-bold uppercase tracking-[0.08em] text-blue-700">
              Now building
            </span>
            <h3 className="mb-3 text-[1.6rem] leading-[1.25] text-slate-900">
              Portfolio CMS, gameplay prototypes, admin systems
            </h3>
            <p className="m-0 leading-[1.8] text-slate-600">
              Kết hợp tư duy sản phẩm web với cách tiếp cận hệ thống của game
              development.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
            <div className="rounded-[24px] border border-white/80 bg-white/90 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
              <strong className="mb-2 block text-sm uppercase tracking-[0.08em] text-slate-500">
                Focus
              </strong>
              <span className="text-sm leading-[1.7] text-slate-600">
                Gameplay, Tools, Full-stack
              </span>
            </div>

            <div className="rounded-[24px] border border-white/80 bg-white/90 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
              <strong className="mb-2 block text-sm uppercase tracking-[0.08em] text-slate-500">
                Stack
              </strong>
              <span className="text-sm leading-[1.7] text-slate-600">
                Next.js, Express, PostgreSQL, UI Systems
              </span>
            </div>
          </div>
        </div>
      </section>

      <section
        id="featured"
        className="mx-auto max-w-[1180px] px-6 py-14 max-[640px]:px-4"
      >
        <div className="mb-8 flex items-end justify-between gap-6 max-[900px]:flex-col max-[900px]:items-start">
          <div>
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-blue-600">
              Featured work
            </p>
            <h2 className="text-[2.1rem] tracking-[-0.03em] text-slate-900">
              Project nổi bật
            </h2>
          </div>
          <p className="max-w-[56ch] leading-[1.8] text-slate-600">
            Một vài hướng build thể hiện cách tôi kết hợp tư duy gameplay, hệ
            thống và sản phẩm web.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5 max-[980px]:grid-cols-1">
          {featuredProjects.map((project, index) => (
            <article
              key={project.id}
              className={`rounded-[28px] border border-white/80 bg-white/92 p-6 shadow-[0_18px_40px_rgba(37,99,235,0.08)] transition duration-300 hover:-translate-y-[4px] hover:border-blue-200 hover:shadow-[0_24px_56px_rgba(37,99,235,0.12)] ${
                index === 0 ? "md:col-span-2" : ""
              }`}
            >
              <span className="mb-4 inline-flex rounded-full bg-blue-50 px-3 py-1 text-[12px] font-bold uppercase tracking-[0.08em] text-blue-700">
                {project.status}
              </span>

              <h3 className="mb-3 text-[1.55rem] leading-[1.3] text-slate-900">
                {project.title}
              </h3>

              <p className="mb-5 max-w-[62ch] leading-[1.8] text-slate-600">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2.5">
                {project.stack.map((item) => (
                  <span
                    key={item}
                    className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[12px] font-semibold text-slate-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-6 py-14 max-[640px]:px-4">
        <div className="mb-8 flex items-end justify-between gap-6 max-[900px]:flex-col max-[900px]:items-start">
          <div>
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-blue-600">
              What I do
            </p>
            <h2 className="text-[2.1rem] tracking-[-0.03em] text-slate-900">
              Năng lực chính
            </h2>
          </div>
          <p className="max-w-[56ch] leading-[1.8] text-slate-600">
            Tập trung vào interactive systems, công cụ quản trị và giao diện có
            cấu trúc rõ ràng.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5 max-[900px]:grid-cols-1">
          {skills.map((skill) => (
            <article
              key={skill.title}
              className="rounded-[24px] border border-white/80 bg-white/92 p-6 shadow-[0_16px_34px_rgba(37,99,235,0.06)]"
            >
              <h3 className="mb-3 text-[1.3rem] text-slate-900">
                {skill.title}
              </h3>
              <p className="leading-[1.8] text-slate-600">{skill.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="writing"
        className="mx-auto max-w-[1180px] px-6 pb-20 pt-14 max-[640px]:px-4"
      >
        <div className="mb-8 flex items-end justify-between gap-6 max-[900px]:flex-col max-[900px]:items-start">
          <div>
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-blue-600">
              Writing
            </p>
            <h2 className="text-[2.1rem] tracking-[-0.03em] text-slate-900">
              Ghi chú và bài viết
            </h2>
          </div>
          <p className="max-w-[56ch] leading-[1.8] text-slate-600">
            Các ghi chú ngắn về frontend, backend, auth flow và cách tổ chức một
            portfolio CMS gọn.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-5 max-[1080px]:grid-cols-2 max-[768px]:grid-cols-1">
          {postList.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </main>
  );
}
