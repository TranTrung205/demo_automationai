export type ElementType =
  | "input"
  | "button"
  | "link"
  | "text"
  | "container"
  | "checkbox"
  | "dropdown";

export interface ElementSchema {
  primary: string;
  fallback?: string[];
  type?: ElementType;
  description?: string;
}

export interface GeneratedUI {
  pageName: string;
  elements: Record<string, ElementSchema>;
}