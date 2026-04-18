"use client";

import { useEffect } from "react";
import { initializeDefaults } from "@/lib/storage";

export function ClientInit() {
  useEffect(() => {
    initializeDefaults();
  }, []);
  return null;
}
