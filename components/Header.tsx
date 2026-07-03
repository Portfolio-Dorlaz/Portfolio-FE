"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { handleLogout } from "../redux/slices/authSlice";
import { AuthenticatedSelector, UserInfoSelector } from "../redux/selector";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import "../styles/header.css";

export default function Header() {
  const userInfo = useAppSelector(UserInfoSelector);
  const isAuthenticated = useAppSelector(AuthenticatedSelector);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onLogout = async () => {
    try {
      await dispatch(handleLogout()).unwrap();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-logo">
          MY PORTFOLIO<span>.</span>
        </Link>

        <nav className="site-nav">
          <Link href="/">Trang chủ</Link>
          <Link href="/posts">Bài viết</Link>
          {isAuthenticated && userInfo?.role === "admin" && (
            <Link href="/admin">Admin</Link>
          )}
        </nav>

        <div className="site-actions">
          {isAuthenticated && userInfo ? (
            <div className="user-actions">
              <span className="user-name">Xin chào, {userInfo.fullName}</span>
              <button
                type="button"
                className="btn btn-outline"
                onClick={onLogout}
              >
                Đăng xuất
              </button>
            </div>
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
