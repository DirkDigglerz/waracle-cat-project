"use client";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export function useUserUUID(): string | null {
  const [uuid, setUUID] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("cat_user_id");

    if (stored && !stored.includes('"')) {
      // ✅ Already a clean string, use as-is
      setUUID(stored);
    } else {
      // ❌ Invalid or missing UUID — create a new one
      const newUUID = uuidv4();
      localStorage.setItem("cat_user_id", newUUID);
      setUUID(newUUID);
    }
  }, []);

  return uuid;
}
