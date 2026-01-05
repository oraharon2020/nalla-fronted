'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ExpandableDescriptionProps {
  description: string;
  maxLines?: number;
  className?: string;
}

export function ExpandableDescription({ description, maxLines = 2, className }: ExpandableDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsTruncation, setNeedsTruncation] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Calculate if content needs truncation based on actual rendered height
  useEffect(() => {
    if (contentRef.current) {
      const lineHeight = 24; // approx line height for text-sm
      const maxHeight = lineHeight * maxLines;
      setNeedsTruncation(contentRef.current.scrollHeight > maxHeight + 10);
    }
  }, [description, maxLines]);

  // Clean description - strip empty paragraphs
  const cleanDescription = description
    .replace(/<p>\s*<\/p>/g, '')
    .replace(/<p>&nbsp;<\/p>/g, '')
    .trim();

  if (!cleanDescription) {
    return null;
  }

  return (
    <div className={className}>
      <div className="relative">
        <div 
          ref={contentRef}
          className="overflow-hidden transition-all duration-300"
          style={{ 
            maxHeight: isExpanded ? '500px' : `${maxLines * 1.5}em`,
          }}
        >
          <div 
            className="prose prose-sm max-w-none prose-p:my-1 prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: cleanDescription }}
          />
        </div>
        {/* Fade effect when truncated */}
        {needsTruncation && !isExpanded && (
          <div 
            className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, transparent, rgb(245 245 245))'
            }}
          />
        )}
      </div>
      
      {/* Toggle button - only show if content is truncated */}
      {needsTruncation && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 mt-2 transition-colors"
        >
          {isExpanded ? (
            <>
              <span>הצג פחות</span>
              <ChevronUp className="w-3 h-3" />
            </>
          ) : (
            <>
              <span>קרא עוד</span>
              <ChevronDown className="w-3 h-3" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
