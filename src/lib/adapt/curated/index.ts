import { computeMetrics } from "../analyze";
import { checkFidelity, readingText } from "../fidelity";
import { isDefaultSingleNeedProfile } from "../profile";
import { findSample, type SampleAssignment } from "../samples";
import type { AdaptResult, AdaptedAssignment, LearnerProfile, NeedId } from "../types";
import { ELA } from "./ela";
import { MATH } from "./math";
import { SCIENCE } from "./science";

/**
 * Pre-built reference outputs for the three sample assignments.
 * They load instantly for demos and are always labelled "Pre-built example"
 * in the UI — they are not presented as live AI output.
 */
export const CURATED: Record<SampleAssignment["id"], Record<NeedId, AdaptedAssignment>> = {
  science: SCIENCE,
  math: MATH,
  ela: ELA,
};

export function curatedResult(source: string, profile: LearnerProfile): AdaptResult | null {
  const sample = findSample(source);
  const need = isDefaultSingleNeedProfile(profile);
  if (!sample || !need) return null;
  const assignment = CURATED[sample.id][need];
  return {
    assignment,
    source: "curated",
    fidelity: checkFidelity(source, assignment),
    metrics: { before: computeMetrics(source), after: computeMetrics(readingText(assignment)) },
    profile,
    notices: [],
    generatedAt: new Date(0).toISOString(),
  };
}
