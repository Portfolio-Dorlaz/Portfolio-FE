import Link from "next/link";
import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-grid">
          <div className="footer-column footer-brand">
            <Link href="/" className="footer-logo">
              Võ Tấn Tài<span>.</span>
            </Link>
            <p className="footer-text">
              Portfolio CMS cá nhân dành cho game development, web development
              và các ghi chú kỹ thuật.
            </p>
          </div>

          <div className="footer-column">
            <p className="footer-title">Điều hướng</p>
            <div className="footer-links">
              <Link href="/">Trang chủ</Link>
              <Link href="/posts">Bài viết</Link>
              <Link href="/login">Đăng nhập</Link>
              <Link href="/register">Đăng ký</Link>
            </div>
          </div>

          <div className="footer-column">
            <p className="footer-title">Nội dung</p>
            <div className="footer-links">
              <Link href="/posts">Latest posts</Link>
              <a href="#featured">Featured work</a>
              <a href="#writing">Writing notes</a>
              <a href="#top">Back to top</a>
            </div>
          </div>

          <div className="footer-column">
            <p className="footer-title">Liên hệ</p>
            <div className="footer-links">
              <a href="votantai.07092002@gmail.com@gmail.com">
                votantai.07092002@gmail.com@gmail.com
              </a>
              <a
                href="https://github.com/votantai3070"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/dorlaz/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              <a
                href="https://www.facebook.com/dorlaz2002"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Võ Tấn Tài. Built for portfolio and publishing.</p>
          <div className="footer-bottom-links">
            <Link href="/">Home</Link>
            <Link href="/posts">Posts</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
