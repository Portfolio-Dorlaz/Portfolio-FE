"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { handleLogout } from "../redux/slices/authSlice";
import { AuthenticatedSelector, UserInfoSelector } from "../redux/selector";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

export default function Header() {
  const userInfo = useAppSelector(UserInfoSelector);
  const isAuthenticated = useAppSelector(AuthenticatedSelector);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onLogout = async () => {
    try {
      await dispatch(handleLogout()).unwrap();
    } catch (e) {
      console.log(e);
    }

    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-slate-200 bg-white/86 backdrop-blur-[10px]">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-6 px-6 py-4 max-md:flex-wrap max-md:gap-3.5 max-md:px-4 max-md:py-[14px] max-[480px]:items-start">
        <Link
          href="/"
          className="whitespace-nowrap text-[1.25rem] font-bold text-slate-900 no-underline"
        >
          MY PORTFOLIO<span className="text-blue-600">.</span>
        </Link>

        <nav className="flex flex-1 items-center justify-center gap-5 max-md:order-3 max-md:w-full max-md:justify-start max-md:gap-4 max-md:overflow-x-auto max-md:pt-1">
          <Link
            href="/"
            className="text-[0.95rem] font-medium text-slate-600 transition-colors duration-200 hover:text-blue-700"
          >
            Trang chủ
          </Link>
          <Link
            href="/posts"
            className="text-[0.95rem] font-medium text-slate-600 transition-colors duration-200 hover:text-blue-700"
          >
            Bài viết
          </Link>
          {isAuthenticated && userInfo?.role === "admin" && (
            <Link
              href="/admin"
              className="text-[0.95rem] font-medium text-slate-600 transition-colors duration-200 hover:text-blue-700"
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="flex min-w-fit items-center gap-3 max-md:ml-auto max-[480px]:w-full max-[480px]:justify-start max-[480px]:flex-wrap">
          {isAuthenticated && userInfo ? (
            <div className="flex items-center gap-3 max-[640px]:w-full max-[480px]:w-full">
              <span className="inline-flex items-center whitespace-nowrap rounded-full border border-blue-100 bg-blue-50 px-[14px] py-[10px] text-[0.95rem] font-medium text-blue-700 max-md:px-3 max-md:py-2 max-md:text-[0.9rem] max-[480px]:w-full max-[480px]:justify-center">
                Xin chào, {userInfo.fullName}
              </span>
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-[12px] border border-slate-200 bg-white px-4 py-[10px] text-[0.95rem] font-semibold text-slate-800 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 max-md:px-[14px] max-md:py-[9px] max-md:text-[0.9rem] max-[640px]:w-full max-[480px]:w-full"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-[12px] border border-slate-200 bg-white px-4 py-[10px] text-[0.95rem] font-semibold text-slate-800 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 max-md:px-[14px] max-md:py-[9px] max-md:text-[0.9rem] max-[640px]:w-full max-[480px]:w-full"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-[12px] border border-blue-600 bg-blue-600 px-4 py-[10px] text-[0.95rem] font-semibold text-white transition-all duration-200 hover:border-blue-700 hover:bg-blue-700 max-md:px-[14px] max-md:py-[9px] max-md:text-[0.9rem] max-[640px]:w-full max-[480px]:w-full"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
