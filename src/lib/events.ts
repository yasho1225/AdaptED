import type { NeedId } from "@/lib/adapt/types";

/** Fired by the hero to open the sample worksheet, adapted for one need, in the studio. */
export const OPEN_IN_STUDIO = "adapted:open";
export type OpenInStudioDetail = { need: NeedId };
