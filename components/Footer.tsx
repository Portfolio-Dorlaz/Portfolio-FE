import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(239,246,255,0.92)_100%)]">
      <div className="mx-auto max-w-[1180px] px-6 pb-6 pt-14 max-[640px]:px-4 max-[640px]:pb-5 max-[640px]:pt-10">
        <div className="grid grid-cols-4 items-start gap-7 max-[960px]:grid-cols-2 max-[640px]:grid-cols-1 max-[640px]:gap-6">
          <div className="min-w-0">
            <Link
              href="/"
              className="mb-[14px] inline-block text-[1.08rem] font-extrabold tracking-[-0.03em] text-slate-900 no-underline"
            >
              Võ Tấn Tài<span className="text-blue-600">.</span>
            </Link>
            <p className="m-0 max-w-[30ch] text-[0.96rem] leading-7 text-slate-600">
              Portfolio CMS cá nhân dành cho game development, web development
              và các ghi chú kỹ thuật.
            </p>
          </div>

          <div className="min-w-0">
            <p className="mb-[14px] text-[0.92rem] font-bold uppercase tracking-[0.04em] text-slate-900">
              Điều hướng
            </p>
            <div className="flex flex-col gap-2.5">
              <Link
                href="/"
                className="leading-[1.7] text-slate-600 no-underline transition-colors duration-200 hover:text-blue-700"
              >
                Trang chủ
              </Link>
              <Link
                href="/posts"
                className="leading-[1.7] text-slate-600 no-underline transition-colors duration-200 hover:text-blue-700"
              >
                Bài viết
              </Link>
              <Link
                href="/login"
                className="leading-[1.7] text-slate-600 no-underline transition-colors duration-200 hover:text-blue-700"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="leading-[1.7] text-slate-600 no-underline transition-colors duration-200 hover:text-blue-700"
              >
                Đăng ký
              </Link>
            </div>
          </div>

          <div className="min-w-0">
            <p className="mb-[14px] text-[0.92rem] font-bold uppercase tracking-[0.04em] text-slate-900">
              Nội dung
            </p>
            <div className="flex flex-col gap-2.5">
              <Link
                href="/posts"
                className="leading-[1.7] text-slate-600 no-underline transition-colors duration-200 hover:text-blue-700"
              >
                Latest posts
              </Link>
              <a
                href="#featured"
                className="leading-[1.7] text-slate-600 no-underline transition-colors duration-200 hover:text-blue-700"
              >
                Featured work
              </a>
              <a
                href="#writing"
                className="leading-[1.7] text-slate-600 no-underline transition-colors duration-200 hover:text-blue-700"
              >
                Writing notes
              </a>
              <a
                href="#top"
                className="leading-[1.7] text-slate-600 no-underline transition-colors duration-200 hover:text-blue-700"
              >
                Back to top
              </a>
            </div>
          </div>

          <div className="min-w-0">
            <p className="mb-[14px] text-[0.92rem] font-bold uppercase tracking-[0.04em] text-slate-900">
              Liên hệ
            </p>
            <div className="flex flex-col gap-2.5">
              <a
                href="mailto:votantai.07092002@gmail.com"
                className="leading-[1.7] text-slate-600 no-underline transition-colors duration-200 hover:text-blue-700"
              >
                votantai.07092002@gmail.com
              </a>
              <a
                href="https://github.com/votantai3070"
                target="_blank"
                rel="noopener noreferrer"
                className="leading-[1.7] text-slate-600 no-underline transition-colors duration-200 hover:text-blue-700"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/dorlaz/"
                target="_blank"
                rel="noopener noreferrer"
                className="leading-[1.7] text-slate-600 no-underline transition-colors duration-200 hover:text-blue-700"
              >
                LinkedIn
              </a>
              <a
                href="https://www.facebook.com/dorlaz2002"
                target="_blank"
                rel="noopener noreferrer"
                className="leading-[1.7] text-slate-600 no-underline transition-colors duration-200 hover:text-blue-700"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-[18px] max-[640px]:flex-col max-[640px]:items-start">
          <p className="m-0 text-[0.92rem] text-slate-500">
            © 2026 Võ Tấn Tài. Built for portfolio and publishing.
          </p>
          <div className="flex flex-wrap items-center gap-[14px]">
            <Link
              href="/"
              className="text-[0.92rem] text-slate-600 no-underline transition-colors duration-200 hover:text-blue-700"
            >
              Home
            </Link>
            <Link
              href="/posts"
              className="text-[0.92rem] text-slate-600 no-underline transition-colors duration-200 hover:text-blue-700"
            >
              Posts
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
