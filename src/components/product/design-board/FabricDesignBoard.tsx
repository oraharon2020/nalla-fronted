'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { X, Download, Search, ImageIcon, Loader2, RotateCw, Trash2, Copy, FlipHorizontal, Type, ArrowRight, Square, Circle, Minus } from 'lucide-react';
import * as fabric from 'fabric';

interface ProductSearchResult {
  id: number;
  name: string;
  image: string;
  price: string;
}

interface FabricDesignBoardProps {
  isOpen: boolean;
  onClose: () => void;
  productImage?: string;
  productName?: string;
  onSave?: (imageDataUrl: string) => void;
}

export function FabricDesignBoard({
  isOpen,
  onClose,
  productImage,
  productName,
  onSave
}: FabricDesignBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ProductSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [textColor, setTextColor] = useState('#000000');
  const [shapeColor, setShapeColor] = useState('#000000');
  const [hasSelection, setHasSelection] = useState(false);

  // Initialize Fabric canvas
  useEffect(() => {
    if (!isOpen || !canvasRef.current || fabricRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 900,
      height: 600,
      backgroundColor: '#ffffff',
      selection: true,
    });

    // Enable controls on objects
    canvas.on('selection:created', () => setHasSelection(true));
    canvas.on('selection:updated', () => setHasSelection(true));
    canvas.on('selection:cleared', () => setHasSelection(false));

    fabricRef.current = canvas;

    // Load initial product image
    if (productImage) {
      addImageToCanvas(productImage, true);
    }

    return () => {
      canvas.dispose();
      fabricRef.current = null;
    };
  }, [isOpen, productImage]);

  // Search products
  const searchProducts = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.products || []);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) searchProducts(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, searchProducts]);

  // Add image to canvas
  const addImageToCanvas = async (src: string, isInitial = false) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    try {
      const img = await fabric.FabricImage.fromURL(src, { crossOrigin: 'anonymous' });
      
      // Scale if too large
      const maxSize = isInitial ? 500 : 300;
      const scale = Math.min(maxSize / img.width!, maxSize / img.height!, 1);
      
      img.set({
        left: isInitial ? 50 : 200 + Math.random() * 100,
        top: isInitial ? 50 : 100 + Math.random() * 100,
        scaleX: scale,
        scaleY: scale,
        cornerStyle: 'circle',
        cornerColor: '#7c3aed',
        cornerStrokeColor: '#7c3aed',
        borderColor: '#7c3aed',
        transparentCorners: false,
      });

      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
    } catch (error) {
      console.error('Error adding image:', error);
    }
  };

  // Add text
  const addText = () => {
    const canvas = fabricRef.current;
    if (!canvas || !textInput.trim()) return;

    const text = new fabric.IText(textInput, {
      left: 200,
      top: 200,
      fontSize: 32,
      fill: textColor,
      fontFamily: 'Arial',
      cornerStyle: 'circle',
      cornerColor: '#7c3aed',
      borderColor: '#7c3aed',
      transparentCorners: false,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    setTextInput('');
    setShowTextInput(false);
  };

  // Add shape
  const addShape = (type: 'rectangle' | 'circle' | 'line' | 'arrow') => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    let shape: fabric.FabricObject;

    switch (type) {
      case 'rectangle':
        shape = new fabric.Rect({
          left: 200,
          top: 200,
          width: 100,
          height: 60,
          fill: 'transparent',
          stroke: shapeColor,
          strokeWidth: 2,
        });
        break;
      case 'circle':
        shape = new fabric.Circle({
          left: 200,
          top: 200,
          radius: 40,
          fill: 'transparent',
          stroke: shapeColor,
          strokeWidth: 2,
        });
        break;
      case 'line':
        shape = new fabric.Line([0, 0, 150, 0], {
          left: 200,
          top: 200,
          stroke: shapeColor,
          strokeWidth: 2,
        });
        break;
      case 'arrow':
        // Arrow using path
        shape = new fabric.Path('M 0 10 L 80 10 L 80 0 L 100 15 L 80 30 L 80 20 L 0 20 Z', {
          left: 200,
          top: 200,
          fill: shapeColor,
          scaleX: 1.5,
          scaleY: 1,
        });
        break;
      default:
        return;
    }

    shape.set({
      cornerStyle: 'circle',
      cornerColor: '#7c3aed',
      borderColor: '#7c3aed',
      transparentCorners: false,
    });

    canvas.add(shape);
    canvas.setActiveObject(shape);
    canvas.renderAll();
  };

  // Delete selected
  const deleteSelected = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const activeObjects = canvas.getActiveObjects();
    activeObjects.forEach(obj => canvas.remove(obj));
    canvas.discardActiveObject();
    canvas.renderAll();
  };

  // Duplicate selected
  const duplicateSelected = async () => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    const cloned = await activeObject.clone();
    cloned.set({
      left: (activeObject.left || 0) + 20,
      top: (activeObject.top || 0) + 20,
    });
    canvas.add(cloned);
    canvas.setActiveObject(cloned);
    canvas.renderAll();
  };

  // Rotate selected
  const rotateSelected = (degrees: number) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    activeObject.rotate((activeObject.angle || 0) + degrees);
    canvas.renderAll();
  };

  // Flip selected
  const flipSelected = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    activeObject.set('flipX', !activeObject.flipX);
    canvas.renderAll();
  };

  // Export canvas
  const handleExport = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2,
    });

    // Download
    const link = document.createElement('a');
    link.download = `design-${productName || 'bellano'}-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();

    // Callback
    onSave?.(dataUrl);
  };

  // Add product from search
  const addProductImage = (imageSrc: string) => {
    addImageToCanvas(imageSrc, false);
    setShowSearch(false);
    setSearchQuery('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center" dir="rtl">
      <div className="bg-white rounded-xl w-full h-full max-w-[95vw] max-h-[95vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-l from-purple-50 to-white flex-shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-800">🎨 לוח עיצוב - {productName}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Search className="w-4 h-4" />
              הוסף מוצר
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              ייצוא
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Toolbar */}
          <div className="w-56 bg-gray-50 border-l p-4 flex flex-col gap-4 overflow-y-auto flex-shrink-0">
            {/* Add Elements */}
            <div className="bg-white rounded-xl border p-3 space-y-2">
              <h3 className="font-bold text-sm text-gray-700 mb-2">➕ הוספת אלמנטים</h3>
              <button
                onClick={() => setShowTextInput(true)}
                className="w-full flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm"
              >
                <Type className="w-4 h-4" />
                טקסט
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => addShape('arrow')}
                  className="flex items-center justify-center gap-1 px-2 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm"
                >
                  <ArrowRight className="w-4 h-4" />
                  חץ
                </button>
                <button
                  onClick={() => addShape('line')}
                  className="flex items-center justify-center gap-1 px-2 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm"
                >
                  <Minus className="w-4 h-4" />
                  קו
                </button>
                <button
                  onClick={() => addShape('rectangle')}
                  className="flex items-center justify-center gap-1 px-2 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm"
                >
                  <Square className="w-4 h-4" />
                  מלבן
                </button>
                <button
                  onClick={() => addShape('circle')}
                  className="flex items-center justify-center gap-1 px-2 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm"
                >
                  <Circle className="w-4 h-4" />
                  עיגול
                </button>
              </div>
            </div>

            {/* Edit */}
            <div className="bg-white rounded-xl border p-3 space-y-2">
              <h3 className="font-bold text-sm text-gray-700 mb-2">✏️ עריכה</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => rotateSelected(15)}
                  disabled={!hasSelection}
                  className="flex items-center justify-center gap-1 px-2 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm disabled:opacity-50"
                >
                  <RotateCw className="w-4 h-4" />
                  סובב
                </button>
                <button
                  onClick={flipSelected}
                  disabled={!hasSelection}
                  className="flex items-center justify-center gap-1 px-2 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm disabled:opacity-50"
                >
                  <FlipHorizontal className="w-4 h-4" />
                  הפוך
                </button>
                <button
                  onClick={duplicateSelected}
                  disabled={!hasSelection}
                  className="flex items-center justify-center gap-1 px-2 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm disabled:opacity-50"
                >
                  <Copy className="w-4 h-4" />
                  שכפל
                </button>
                <button
                  onClick={deleteSelected}
                  disabled={!hasSelection}
                  className="flex items-center justify-center gap-1 px-2 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  מחק
                </button>
              </div>
            </div>

            {/* Colors */}
            <div className="bg-white rounded-xl border p-3 space-y-3">
              <h3 className="font-bold text-sm text-gray-700 mb-2">🎨 צבעים</h3>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={shapeColor}
                  onChange={(e) => setShapeColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border-2"
                />
                <span className="text-sm text-gray-600">צבע צורות</span>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-purple-50 rounded-xl p-3 text-xs text-purple-700">
              <p className="font-bold mb-1">💡 טיפים:</p>
              <ul className="space-y-1">
                <li>• גרור פינות לשינוי גודל</li>
                <li>• גרור מעגל עליון לסיבוב</li>
                <li>• לחץ Delete למחיקה</li>
                <li>• לחץ על אלמנט לבחירה</li>
              </ul>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 bg-gray-200 p-4 overflow-auto flex items-center justify-center">
            <div className="shadow-xl rounded-lg overflow-hidden">
              <canvas ref={canvasRef} />
            </div>
          </div>

          {/* Search Panel */}
          {showSearch && (
            <div className="w-80 border-r bg-gray-50 flex flex-col flex-shrink-0">
              <div className="p-4 border-b bg-white">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="חפש מוצר..."
                    className="w-full pr-10 pl-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    autoFocus
                  />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                {isSearching ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => addProductImage(product.image)}
                        className="group relative aspect-square rounded-lg overflow-hidden bg-white border hover:border-purple-500 transition-colors"
                      >
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <ImageIcon className="w-8 h-8 text-gray-300" />
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-xs p-2 line-clamp-2">
                          {product.name}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : searchQuery ? (
                  <p className="text-center text-gray-500 py-8">לא נמצאו תוצאות</p>
                ) : (
                  <p className="text-center text-gray-500 py-8">הקלד שם מוצר לחיפוש</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Text Input Modal */}
        {showTextInput && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
              <h3 className="font-bold text-lg mb-4">הוסף טקסט</h3>
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="הקלד טקסט..."
                className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                autoFocus
              />
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm">צבע:</span>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowTextInput(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  ביטול
                </button>
                <button
                  onClick={addText}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  הוסף
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
