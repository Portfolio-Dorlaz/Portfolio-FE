"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import {
  clearAuth,
  getMe,
  handleRefreshToken,
  setBootstrapped,
} from "@/redux/slices/authSlice";

const PUBLIC_AUTH_PATHS = ["/login", "/register"];

export default function AuthBootstrap() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;

    const isPublicAuthPage = PUBLIC_AUTH_PATHS.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`),
    );

    if (isPublicAuthPage) {
      dispatch(setBootstrapped(true));
      return () => {
        mounted = false;
      };
    }

    const initAuth = async () => {
      try {
        const refreshData = await dispatch(handleRefreshToken()).unwrap();

        if (!mounted) return;

        if (!refreshData.user) {
          await dispatch(getMe()).unwrap();
        }

        dispatch(setBootstrapped(true));
      } catch {
        if (!mounted) return;
        dispatch(clearAuth());
        dispatch(setBootstrapped(true));
      }
    };

    initAuth();

    return () => {
      mounted = false;
    };
  }, [dispatch, pathname]);

  return null;
}
