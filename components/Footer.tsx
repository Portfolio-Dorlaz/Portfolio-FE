import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-[rgba(148,163,184,0.12)] bg-[rgba(7,17,31,0.72)]">
      <div className="mx-auto max-w-[1180px] px-6 pb-6 pt-14 max-[640px]:px-4 max-[640px]:pb-5 max-[640px]:pt-10">
        <div className="grid grid-cols-4 items-start gap-7 max-[960px]:grid-cols-2 max-[640px]:grid-cols-1 max-[640px]:gap-6">
          <div className="min-w-0">
            <Link
              href="/"
              className="mb-[14px] inline-block text-[1.08rem] font-extrabold tracking-[-0.03em] text-[#f8fbff] no-underline"
            >
              Võ Tấn Tài<span className="text-cyan-300">.</span>
            </Link>
            <p className="m-0 max-w-[30ch] text-[0.96rem] leading-7 text-slate-400">
              Portfolio CMS cá nhân dành cho game development, web development
              và các ghi chú kỹ thuật.
            </p>
          </div>

          <div className="min-w-0">
            <p className="mb-[14px] text-[0.92rem] font-bold uppercase tracking-[0.04em] text-[#f8fbff]">
              Điều hướng
            </p>
            <div className="flex flex-col gap-2.5">
              <Link
                href="/"
                className="leading-[1.7] text-slate-400 no-underline transition-colors duration-200 hover:text-[#f8fbff]"
              >
                Trang chủ
              </Link>
              <Link
                href="/posts"
                className="leading-[1.7] text-slate-400 no-underline transition-colors duration-200 hover:text-[#f8fbff]"
              >
                Bài viết
              </Link>
              <Link
                href="/login"
                className="leading-[1.7] text-slate-400 no-underline transition-colors duration-200 hover:text-[#f8fbff]"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="leading-[1.7] text-slate-400 no-underline transition-colors duration-200 hover:text-[#f8fbff]"
              >
                Đăng ký
              </Link>
            </div>
          </div>

          <div className="min-w-0">
            <p className="mb-[14px] text-[0.92rem] font-bold uppercase tracking-[0.04em] text-[#f8fbff]">
              Nội dung
            </p>
            <div className="flex flex-col gap-2.5">
              <Link
                href="/posts"
                className="leading-[1.7] text-slate-400 no-underline transition-colors duration-200 hover:text-[#f8fbff]"
              >
                Latest posts
              </Link>
              <a
                href="#featured"
                className="leading-[1.7] text-slate-400 no-underline transition-colors duration-200 hover:text-[#f8fbff]"
              >
                Featured work
              </a>
              <a
                href="#writing"
                className="leading-[1.7] text-slate-400 no-underline transition-colors duration-200 hover:text-[#f8fbff]"
              >
                Writing notes
              </a>
              <a
                href="#top"
                className="leading-[1.7] text-slate-400 no-underline transition-colors duration-200 hover:text-[#f8fbff]"
              >
                Back to top
              </a>
            </div>
          </div>

          <div className="min-w-0">
            <p className="mb-[14px] text-[0.92rem] font-bold uppercase tracking-[0.04em] text-[#f8fbff]">
              Liên hệ
            </p>
            <div className="flex flex-col gap-2.5">
              <a
                href="mailto:votantai.07092002@gmail.com"
                className="leading-[1.7] text-slate-400 no-underline transition-colors duration-200 hover:text-[#f8fbff]"
              >
                votantai.07092002@gmail.com
              </a>
              <a
                href="https://github.com/votantai3070"
                target="_blank"
                rel="noopener noreferrer"
                className="leading-[1.7] text-slate-400 no-underline transition-colors duration-200 hover:text-[#f8fbff]"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/dorlaz/"
                target="_blank"
                rel="noopener noreferrer"
                className="leading-[1.7] text-slate-400 no-underline transition-colors duration-200 hover:text-[#f8fbff]"
              >
                LinkedIn
              </a>
              <a
                href="https://www.facebook.com/dorlaz2002"
                target="_blank"
                rel="noopener noreferrer"
                className="leading-[1.7] text-slate-400 no-underline transition-colors duration-200 hover:text-[#f8fbff]"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-between gap-4 border-t border-[rgba(148,163,184,0.1)] pt-[18px] max-[640px]:flex-col max-[640px]:items-start">
          <p className="m-0 text-[0.92rem] text-slate-500">
            © 2026 Võ Tấn Tài. Built for portfolio and publishing.
          </p>
          <div className="flex flex-wrap items-center gap-[14px]">
            <Link
              href="/"
              className="text-[0.92rem] text-slate-400 no-underline transition-colors duration-200 hover:text-[#f8fbff]"
            >
              Home
            </Link>
            <Link
              href="/posts"
              className="text-[0.92rem] text-slate-400 no-underline transition-colors duration-200 hover:text-[#f8fbff]"
            >
              Posts
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
