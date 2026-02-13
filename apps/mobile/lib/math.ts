import type { MathTopic } from "./api";

export interface TopicSection {
  title: string;
  content: string;
}

const HEADING_PATTERN = /^([A-Za-z][A-Za-z0-9'()\-\/ ]+):$/;

const CATEGORY_THEME: Record<
  string,
  { accent: string; chip: string; soft: string; emoji: string }
> = {
  Algebra: {
    accent: "#0F766E",
    chip: "#CCFBF1",
    soft: "#F0FDFA",
    emoji: "🧩",
  },
  Calculus: {
    accent: "#B45309",
    chip: "#FEF3C7",
    soft: "#FFFBEB",
    emoji: "📈",
  },
  "Coordinate Geometry": {
    accent: "#0369A1",
    chip: "#E0F2FE",
    soft: "#F0F9FF",
    emoji: "📐",
  },
  "Three-Dimensional Geometry": {
    accent: "#4338CA",
    chip: "#E0E7FF",
    soft: "#EEF2FF",
    emoji: "🛰️",
  },
  "Vector Algebra": {
    accent: "#166534",
    chip: "#DCFCE7",
    soft: "#F0FDF4",
    emoji: "🧭",
  },
  Trigonometry: {
    accent: "#BE123C",
    chip: "#FFE4E6",
    soft: "#FFF1F2",
    emoji: "🌊",
  },
  "Statistics and Probability": {
    accent: "#9A3412",
    chip: "#FFEDD5",
    soft: "#FFF7ED",
    emoji: "🎲",
  },
};

export function parseTopicSections(explanation?: string): TopicSection[] {
  if (!explanation?.trim()) {
    return [];
  }

  const lines = explanation.replace(/\r\n/g, "\n").split("\n");
  const sections: TopicSection[] = [];

  let currentTitle = "Overview";
  let buffer: string[] = [];
  let sawHeading = false;

  const flush = () => {
    const content = buffer.join("\n").trim();
    if (!content) return;
    sections.push({ title: currentTitle, content });
    buffer = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    const match = line.match(HEADING_PATTERN);

    if (match) {
      sawHeading = true;
      flush();
      currentTitle = match[1];
      continue;
    }

    buffer.push(rawLine);
  }

  flush();

  if (!sawHeading && sections.length === 0) {
    return [{ title: "Overview", content: explanation.trim() }];
  }

  return sections;
}

export function estimateReadMinutes(text?: string, wordsPerMinute = 180): number {
  if (!text?.trim()) return 1;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function topicPreview(explanation?: string, maxLength = 170): string {
  if (!explanation?.trim()) return "Open this lesson to explore key ideas.";

  const sections = parseTopicSections(explanation);
  const source = sections[0]?.content ?? explanation;
  const compact = source.replace(/\s+/g, " ").trim();

  if (compact.length <= maxLength) return compact;
  return `${compact.slice(0, maxLength).trimEnd()}...`;
}

export function getCategoryTheme(category?: string) {
  return (
    CATEGORY_THEME[category ?? ""] ?? {
      accent: "#334155",
      chip: "#E2E8F0",
      soft: "#F8FAFC",
      emoji: "🧠",
    }
  );
}

export function sortTopics(topics: MathTopic[]): MathTopic[] {
  return [...topics].sort((a, b) => a.title.localeCompare(b.title));
}
