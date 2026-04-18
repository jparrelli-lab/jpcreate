import { useState, useEffect } from "react";
import { initStorage, initializeDefaults } from "@/lib/storage";

export function useInit() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initStorage().then(() => {
      initializeDefaults();
      setReady(true);
    });
  }, []);

  return ready;
}
