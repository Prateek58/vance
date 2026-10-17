'use client';

import React, { useMemo } from 'react';
import { marked } from 'marked';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const html = useMemo(() => {
    if (!content) return '';
    try {
      // Configure marked with breaks for easy authoring
      return marked.parse(content, {
        breaks: true,
        gfm: true,
      }) as string;
    } catch (e) {
      console.error('Failed to parse markdown:', e);
      return content;
    }
  }, [content]);

  if (!content) return null;

  return (
    <div
      className={`job-markdown ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
