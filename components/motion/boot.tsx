/**
 * The one piece of script that must run before first paint (DESIGN.md §7.1,
 * §7.10). It decides two things the server cannot know:
 *
 *   - whether the intro has already played this session, so a repeat visit
 *     never flashes an overlay it is about to hide;
 *   - whether script is running at all, which is what licenses the reveal
 *     styles to hold content at the start of its rise.
 *
 * The failsafe matters: if hydration never arrives, `data-js` is dropped and
 * every held element falls back to being plainly visible. ScrollReveals
 * clears the timer the moment it mounts.
 */
export const INTRO_KEY = "thifa:intro-seen";
export const FAILSAFE_KEY = "__thifaRevealFailsafe";

const boot = `(function(){var h=document.documentElement;try{if(sessionStorage.getItem(${JSON.stringify(
  INTRO_KEY,
)})){h.setAttribute("data-intro","done")}else{sessionStorage.setItem(${JSON.stringify(
  INTRO_KEY,
)},"1")}}catch(e){}h.setAttribute("data-js","");window[${JSON.stringify(
  FAILSAFE_KEY,
)}]=setTimeout(function(){h.removeAttribute("data-js")},4000)})();`;

export function MotionBoot() {
  return <script dangerouslySetInnerHTML={{ __html: boot }} />;
}
