import { useEffect } from "react";
import { useForumStore } from "@/lib/forum/store";

/** Resmî duyuru/kurallar konularını tarayıcıda bir kez enjekte eder */
export function SeedOfficialForum() {
  const ensureSeed = useForumStore((s) => s.ensureSeed);
  useEffect(() => {
    ensureSeed();
  }, [ensureSeed]);
  return null;
}
