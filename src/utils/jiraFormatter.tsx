import React from 'react';

/**
 * Formats Jira wiki markup into HTML-safe styled text
 */
export function formatJiraDescription(description: string | undefined): React.ReactNode {
  if (!description) return null;

  const lines = description.split('\n');
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Horizontal rule
    if (line.trim() === '----') {
      elements.push(<hr key={`hr-${key++}`} className="my-3 border-border" />);
      continue;
    }

    // Headers (h2., h3., etc.)
    const headerMatch = line.match(/^h(\d)\.\s*(.+)$/);
    if (headerMatch) {
      const level = parseInt(headerMatch[1]);
      const text = formatInlineMarkup(headerMatch[2]);
      const className = level === 2 ? 'text-base font-semibold mt-4 mb-2' : 'text-sm font-semibold mt-3 mb-1';
      elements.push(<div key={`h${level}-${key++}`} className={className}>{text}</div>);
      continue;
    }

    // Bullet points (nested with **)
    if (line.match(/^\*\*\s/)) {
      const text = formatInlineMarkup(line.replace(/^\*\*\s/, ''));
      elements.push(
        <div key={`bullet2-${key++}`} className="ml-6 flex gap-2 text-sm">
          <span className="text-muted-foreground">◦</span>
          <span>{text}</span>
        </div>
      );
      continue;
    }

    // Bullet points (top level with *)
    if (line.match(/^\*\s/)) {
      const text = formatInlineMarkup(line.replace(/^\*\s/, ''));
      elements.push(
        <div key={`bullet-${key++}`} className="ml-3 flex gap-2 text-sm">
          <span className="text-muted-foreground">•</span>
          <span>{text}</span>
        </div>
      );
      continue;
    }

    // Empty lines
    if (line.trim() === '') {
      elements.push(<div key={`space-${key++}`} className="h-2" />);
      continue;
    }

    // Regular text
    const formatted = formatInlineMarkup(line);
    elements.push(<div key={`text-${key++}`} className="text-sm leading-relaxed">{formatted}</div>);
  }

  return <div className="space-y-1">{elements}</div>;
}

/**
 * Formats inline Jira markup (bold, code, etc.)
 */
function formatInlineMarkup(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Code blocks using double braces
    const codeRegex = /^\{\{([^}]+)\}\}/;
    const codeMatch = remaining.match(codeRegex);
    if (codeMatch) {
      parts.push(
        <code key={`code-${key++}`} className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">
          {codeMatch[1]}
        </code>
      );
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // Bold using asterisks
    const boldRegex = /^\*([^*]+)\*/;
    const boldMatch = remaining.match(boldRegex);
    if (boldMatch) {
      parts.push(
        <strong key={`bold-${key++}`} className="font-semibold">
          {boldMatch[1]}
        </strong>
      );
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // Regular text until next special character
    const nextSpecialRegex = /[*{]/;
    const nextSpecial = remaining.search(nextSpecialRegex);
    if (nextSpecial === -1) {
      parts.push(remaining);
      break;
    } else if (nextSpecial > 0) {
      parts.push(remaining.slice(0, nextSpecial));
      remaining = remaining.slice(nextSpecial);
    } else {
      // Single character that did not match
      parts.push(remaining[0]);
      remaining = remaining.slice(1);
    }
  }

  return <>{parts}</>;
}
