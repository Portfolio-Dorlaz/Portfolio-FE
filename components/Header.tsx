'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import {
  AuthenticatedSelector,
	UserInfoSelector
} from '../redux/selector';
import "../styles/header.css"


export default function Header() {
  const userInfo = useSelector(UserInfoSelector);
  const isAuthenticated = useSelector(AuthenticatedSelector)


  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-logo">
          My Blog
        </Link>

        <nav className="site-nav">
          <Link href="/">Trang chủ</Link>
          <Link href="/posts">Bài viết</Link>
        </nav>

        <div className="site-actions">
          {isAuthenticated && userInfo ? (
            <span className="user-name">
              Xin chào, {userInfo.fullName}
            </span>
          ) : (
            <>
              <Link href="/login" className="btn btn-outline">
                Đăng nhập
              </Link>
              <Link href="/register" className="btn btn-primary">
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}