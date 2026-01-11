'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Clean product description from unwanted HTML and shortcodes
 * - Removes ChatGPT/AI-generated wrapper divs
 * - Removes WordPress shortcodes like [read more] [/read]
 * - Removes inline styles but keeps basic formatting
 * - Preserves <br> and <p> tags for line breaks
 */
function cleanProductDescription(html: string): string {
  if (!html) return '';
  
  let cleaned = html
    // Remove WordPress shortcodes
    .replace(/\[read\s*more\]/gi, '')
    .replace(/\[\/read\]/gi, '')
    .replace(/\[read\]/gi, '')
    
    // Remove ChatGPT/AI wrapper divs (keep inner content)
    .replace(/<div[^>]*class="[^"]*(?:group|markdown|prose|dark:|flex|gap-)[^"]*"[^>]*>/gi, '')
    .replace(/<\/div>/gi, '')
    
    // Remove span with inline color styles (keep content)
    .replace(/<span[^>]*style="[^"]*color[^"]*"[^>]*>([\s\S]*?)<\/span>/gi, '$1')
    
    // Remove all inline styles from remaining tags
    .replace(/\s*style="[^"]*"/gi, '')
    
    // Remove class attributes (we'll style with our own CSS)
    .replace(/\s*class="[^"]*"/gi, '')
    
    // Clean up empty paragraphs
    .replace(/<p>\s*<\/p>/g, '')
    .replace(/<p>&nbsp;<\/p>/g, '')
    
    // Convert multiple <br> to single
    .replace(/(<br\s*\/?>\s*){2,}/gi, '<br>')
    
    // Clean up whitespace
    .replace(/\n\s*\n/g, '\n')
    .trim();
  
  // Wrap plain text in paragraph if needed
  if (cleaned && !cleaned.startsWith('<')) {
    cleaned = `<p>${cleaned}</p>`;
  }
  
  return cleaned;
}

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

  // Clean description - strip unwanted HTML and shortcodes
  const cleanDescription = cleanProductDescription(description);

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
