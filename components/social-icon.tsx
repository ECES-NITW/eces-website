import type { SocialId } from "@/lib/social-links";

// lucide-react v1 ships no brand marks, so these are drawn to match its 24px, 1.5px-stroke style.
export function SocialIcon({ id, size = 20 }: { id: SocialId; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {id === "instagram"
      ? <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".6" fill="currentColor" /></>
      : <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 10.5V17M8 7.25v.01M12 17v-6.5M12 13.25c0-1.6 1.1-2.75 2.5-2.75S17 11.4 17 13v4" /></>}
  </svg>;
}
