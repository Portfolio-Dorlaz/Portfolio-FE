"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import {
  clearAuth,
  getMe,
  handleRefreshToken,
  setBootstrapped,
} from "@/redux/slices/authSlice";

export default function AuthBootstrap() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let mounted = true;

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
      }
    };

    initAuth();

    return () => {
      mounted = false;
    };
  }, [dispatch]);

  return null;
}
