import * as React from "react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

interface MathRendererProps {
  children: string;
  className?: string;
}

/**
 * Renders text containing LaTeX using these delimiters:
 *  - Inline:  $...$   and  \( ... \)
 *  - Block:   $$...$$ and  \[ ... \]
 *
 * Supports mixed plain text + multiple math segments in one string.
 */
export function MathRenderer({ children, className }: MathRendererProps) {
  let text = String(children ?? "");

  // Preprocess: Fix common AI formatting issues
  text = text
    // Remove any leftover markdown
    .replace(/\*\*/g, '')
    .replace(/```[\s\S]*?```/g, '')
    // Replace \( \) with $ $
    .replace(/\\\(/g, '$')
    .replace(/\\\)/g, '$')
    // Replace \[ \] with $$ $$
    .replace(/\\\[/g, '$$')
    .replace(/\\\]/g, '$$')
    // Collapse spaces around delimiters
    .replace(/\$\s+/g, '$')
    .replace(/\s+\$/g, '$')
    // Convert standalone $...$ lines to $$...$$
    .replace(/^\s*\$([^$\n]+)\$\s*$/gm, '$$$$1$$');

  // Order matters: $$...$$ | \[...\] | \(...\) | $...$
  // Non-greedy ([\s\S]+?) so we don't over-capture; supports newlines.
  // Allow spaces inside inline math by using [^$\n]+? instead of requiring non-space after $
  const pattern =
    /(\$\$([\s\S]+?)\$\$)|\\\[([\s\S]+?)\\\]|\\\(([\s\S]+?)\\\)|\$([^$\n]+?)\$/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    const matchStart = match.index;

    // Push plain text before the match
    if (matchStart > lastIndex) {
      parts.push(text.slice(lastIndex, matchStart));
    }

    // Determine if it's block or inline and extract inner math
    // groups: [1]=$$...$$, [3]=\[...\], [4]=\(...\), [5]=$...$
    const isBlock = !!(match[1] || match[3]);
    const mathContent =
      match[2] ?? // inner of $$...$$
      match[3] ?? // inner of \[...\]
      match[4] ?? // inner of \(...\)
      match[5] ?? // inner of $...$
      "";

    parts.push(
      isBlock ? (
        <BlockMath key={matchStart} math={mathContent} />
      ) : (
        <InlineMath key={matchStart} math={mathContent} />
      )
    );

    lastIndex = pattern.lastIndex;
  }

  // Push any trailing text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  // If no math found, render as plain text
  if (parts.length === 0) {
    return <span className={className}>{text}</span>;
  }

  return <span className={className}>{parts}</span>;
}

export default MathRenderer;
