'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ExpandableDescriptionProps {
  description: string;
  maxLines?: number;
}

export function ExpandableDescription({ description, maxLines = 2 }: ExpandableDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Check if description is long enough to need truncation
  const plainText = description.replace(/<[^>]*>/g, '');
  const needsTruncation = plainText.length > 150;

  if (!needsTruncation) {
    return (
      <div 
        className="text-muted-foreground text-sm"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    );
  }

  return (
    <div className="relative">
      <div 
        className={`text-muted-foreground text-sm overflow-hidden transition-all duration-300 ${
          isExpanded ? 'max-h-[500px]' : 'max-h-[3em]'
        }`}
      >
        <div 
          className="prose prose-sm max-w-none prose-p:my-1"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>
      
      {/* Gradient fade when collapsed */}
      {!isExpanded && (
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      )}
      
      {/* Toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 mt-1 transition-colors"
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
    </div>
  );
}
