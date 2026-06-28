import Link from 'next/link';

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand">
          Dev<span>Blog</span>
        </Link>

        <nav className="header-nav">
          <Link href="/" className="nav-link">
            Trang chủ
          </Link>
          <Link href="/register" className="nav-link">
            Đăng ký
          </Link>
          <Link href="/login" className="login-button">
            Đăng nhập
          </Link>
        </nav>
      </div>
    </header>
  );
}