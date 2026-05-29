"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeSelector } from "@/components/mode-selector";
import { GeneratorPanel } from "@/components/generators/generator-panel";
import {
  FormField,
  FormInput,
  FormSelect,
  FormTextarea,
} from "@/components/generators/form-field";
import { useGeneration } from "@/hooks/use-generation";
import type { AssignmentInput } from "@/lib/generation/types";
import type { AccessibilityMode } from "@/lib/types";
import {
  ASSIGNMENT_TYPE_OPTIONS,
  DIFFICULTY_OPTIONS,
  GRADE_OPTIONS,
} from "@/lib/generation/constants";

const DEFAULT: AssignmentInput = {
  subject: "Science",
  topic: "Photosynthesis",
  gradeLevel: "7th",
  difficulty: "medium",
  assignmentType: "worksheet",
  mode: "dyslexia",
  questionCount: 5,
  timeEstimate: "20 minutes",
};

export function AssignmentGenerator() {
  const [form, setForm] = useState<AssignmentInput>(DEFAULT);
  const { result, status, error, generate, retry, isLoading } =
    useGeneration<AssignmentInput>("/api/generate/assignment");

  const update = <K extends keyof AssignmentInput>(
    key: K,
    value: AssignmentInput[K],
  ) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void generate(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <GeneratorPanel
        title="Assignment details"
        description="Generate a new assignment shaped for the selected accessibility mode—not a generic worksheet."
        mode={form.mode}
        result={result}
        status={status}
        error={error}
        onRetry={retry}
        onRegenerate={() => void generate(form)}
        filePrefix="assignment"
        form={
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Subject" htmlFor="as-subject">
                <FormInput
                  id="as-subject"
                  value={form.subject}
                  onChange={(e) => update("subject", e.target.value)}
                  required
                />
              </FormField>
              <FormField label="Topic" htmlFor="as-topic">
                <FormInput
                  id="as-topic"
                  value={form.topic}
                  onChange={(e) => update("topic", e.target.value)}
                  required
                />
              </FormField>
              <FormField label="Grade level" htmlFor="as-grade">
                <FormSelect
                  id="as-grade"
                  value={form.gradeLevel}
                  onChange={(e) => update("gradeLevel", e.target.value)}
                >
                  {GRADE_OPTIONS.map((g) => (
                    <option key={g} value={g}>
                      {g} grade
                    </option>
                  ))}
                </FormSelect>
              </FormField>
              <FormField label="Difficulty" htmlFor="as-diff">
                <FormSelect
                  id="as-diff"
                  value={form.difficulty}
                  onChange={(e) =>
                    update("difficulty", e.target.value as AssignmentInput["difficulty"])
                  }
                >
                  {DIFFICULTY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </FormSelect>
              </FormField>
              <FormField label="Assignment type" htmlFor="as-type">
                <FormSelect
                  id="as-type"
                  value={form.assignmentType}
                  onChange={(e) =>
                    update(
                      "assignmentType",
                      e.target.value as AssignmentInput["assignmentType"],
                    )
                  }
                >
                  {ASSIGNMENT_TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </FormSelect>
              </FormField>
              <FormField label="Questions (optional)" htmlFor="as-count">
                <FormInput
                  id="as-count"
                  type="number"
                  min={3}
                  max={20}
                  value={form.questionCount ?? ""}
                  onChange={(e) =>
                    update(
                      "questionCount",
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                />
              </FormField>
            </div>
            <FormField label="Learning goals (optional)" htmlFor="as-goals">
              <FormTextarea
                id="as-goals"
                value={form.learningGoals ?? ""}
                onChange={(e) => update("learningGoals", e.target.value)}
                placeholder="e.g. Students will explain inputs and outputs of photosynthesis"
                className="min-h-[80px]"
              />
            </FormField>
            <FormField label="Time estimate (optional)" htmlFor="as-time">
              <FormInput
                id="as-time"
                value={form.timeEstimate ?? ""}
                onChange={(e) => update("timeEstimate", e.target.value)}
                placeholder="e.g. 25 minutes"
              />
            </FormField>
            <FormField label="Accessibility mode" htmlFor="as-mode">
              <ModeSelector
                active={form.mode}
                onChange={(m: AccessibilityMode) => update("mode", m)}
                variant="tabs"
              />
            </FormField>
            <Button type="submit" className="w-full gap-2 sm:w-auto" disabled={isLoading}>
              <Sparkles className="size-4" />
              {isLoading ? "Generating…" : "Generate assignment"}
            </Button>
          </>
        }
      />
    </form>
  );
}
