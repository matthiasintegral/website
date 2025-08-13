"use client";

import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import { cn } from '@/lib/utils';

interface MathContentProps {
  content: string;
  className?: string;
}

/**
 * Component that renders text with LaTeX mathematical notation
 * Supports both inline (\(...\) and $...$) and block (\[...\] and $$...$$) math expressions
 */
export function MathContent({ content, className }: MathContentProps) {
  const renderContent = (text: string) => {
    // First, split by display math expressions (\[...\] and $$...$$)
    const displayMathParts = text.split(/(\\\[[\s\S]*?\\\]|\$\$[\s\S]*?\$\$)/g);
    
    return displayMathParts.map((part, blockIndex) => {
      // Handle display math expressions
      if ((part.startsWith('\\[') && part.endsWith('\\]')) || 
          (part.startsWith('$$') && part.endsWith('$$'))) {
        // Display math expression
        const mathContent = part.startsWith('\\[') 
          ? part.slice(2, -2).trim()
          : part.slice(2, -2).trim();
        return (
          <div key={blockIndex} className="my-4">
            <BlockMath math={mathContent} />
          </div>
        );
      } else {
        // Process inline math expressions (\(...\) and $...$) in this part
        const inlineMathParts = part.split(/(\\\([\s\S]*?\\\)|\$[^$]*?\$)/g);
        
        return inlineMathParts.map((inlinePart, inlineIndex) => {
          // Handle inline math expressions
          if ((inlinePart.startsWith('\\(') && inlinePart.endsWith('\\)')) ||
              (inlinePart.startsWith('$') && inlinePart.endsWith('$') && inlinePart.length > 2)) {
            // Inline math expression
            const mathContent = inlinePart.startsWith('\\(')
              ? inlinePart.slice(2, -2)
              : inlinePart.slice(1, -1);
            return (
              <InlineMath key={`${blockIndex}-${inlineIndex}`} math={mathContent} />
            );
          } else {
            // Regular text - preserve line breaks
            return inlinePart.split('\n').map((line, lineIndex, lines) => (
              <React.Fragment key={`${blockIndex}-${inlineIndex}-${lineIndex}`}>
                {line}
                {lineIndex < lines.length - 1 && <br />}
              </React.Fragment>
            ));
          }
        });
      }
    });
  };

  return (
    <div className={cn("math-content", className)}>
      {renderContent(content)}
    </div>
  );
}

export default MathContent; 