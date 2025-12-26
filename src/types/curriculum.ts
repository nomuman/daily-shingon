export type SanmitsuKey = "body" | "speech" | "mind";

export type CurriculumActionOption = {
  key: SanmitsuKey;
  text: string;
};

export type CurriculumDay = {
  id: string;
  day: number; // 1..30
  title: string;
  learn: string;
  example?: string;
  recommendedActionKey: SanmitsuKey;
  actionOptions: CurriculumActionOption[];
  nightQuestion: string;
  tags?: string[];
  sources?: string[];
};

export type Curriculum30 = {
  schemaVersion: string;
  locale: string;
  program: string; // "30days"
  generatedAt: string;
  sourceIndex: Record<string, string>;
  days: CurriculumDay[];
};
