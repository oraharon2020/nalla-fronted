'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Calculator, Upload, Settings } from 'lucide-react';

interface AdminFieldsData {
  width: string;
  depth: string;
  height: string;
  additionalFee: string;
  additionalFeeReason: string;
  discountType: 'percent' | 'fixed';
  discountValue: string;
  freeComments: string;
  uploadedFile: string;
}

interface Upgrade {
  name: string;
  price: number;
}

interface AdminFieldsProps {
  basePrice: number;
  variationPrice?: number;
  onPriceChange?: (newPrice: number, data: AdminFieldsData) => void;
  onDataChange?: (data: AdminFieldsData) => void;
}

export function AdminProductFields({ 
  basePrice, 
  variationPrice, 
  onPriceChange,
  onDataChange 
}: AdminFieldsProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);
  const [upgrades, setUpgrades] = useState<Upgrade[]>([]);
  const [selectedUpgrades, setSelectedUpgrades] = useState<Record<number, number>>({});
  const [showUpgradesPopup, setShowUpgradesPopup] = useState(false);
  
  const [formData, setFormData] = useState<AdminFieldsData>({
    width: '',
    depth: '',
    height: '',
    additionalFee: '',
    additionalFeeReason: '',
    discountType: 'percent',
    discountValue: '',
    freeComments: '',
    uploadedFile: '',
  });

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch('/api/auth/check-admin', {
          credentials: 'include',
        });
        const data = await response.json();
        setIsAdmin(data.isAdmin);
        
        if (data.upgrades) {
          setUpgrades(data.upgrades);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, []);

  // Calculate total price
  const currentBasePrice = variationPrice || basePrice;
  
  const calculateTotalPrice = () => {
    let price = currentBasePrice;
    
    // Add upgrades
    Object.entries(selectedUpgrades).forEach(([index, quantity]) => {
      const upgrade = upgrades[parseInt(index)];
      if (upgrade && quantity > 0) {
        price += upgrade.price * quantity;
      }
    });
    
    // Add additional fee
    const additionalFee = parseFloat(formData.additionalFee) || 0;
    price += additionalFee;
    
    // Apply discount
    const discountValue = parseFloat(formData.discountValue) || 0;
    if (formData.discountType === 'percent' && discountValue > 0) {
      price = price * (1 - Math.min(100, discountValue) / 100);
    } else if (formData.discountType === 'fixed' && discountValue > 0) {
      price = discountValue;
    }
    
    return Math.max(0, price);
  };

  const totalPrice = calculateTotalPrice();
  const discountPercent = currentBasePrice > 0 
    ? ((currentBasePrice - totalPrice) / currentBasePrice) * 100 
    : 0;

  // Notify parent of changes
  useEffect(() => {
    onPriceChange?.(totalPrice, formData);
    onDataChange?.(formData);
  }, [totalPrice, formData, onPriceChange, onDataChange]);

  const handleInputChange = (field: keyof AdminFieldsData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpgradeQuantityChange = (index: number, quantity: number) => {
    setSelectedUpgrades(prev => ({
      ...prev,
      [index]: Math.max(0, quantity),
    }));
  };

  const upgradesTotal = Object.entries(selectedUpgrades).reduce((sum, [index, qty]) => {
    const upgrade = upgrades[parseInt(index)];
    return sum + (upgrade ? upgrade.price * qty : 0);
  }, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) return null;
  if (!isAdmin) return null;

  return (
    <>
      <div className="border border-gray-300 rounded-lg bg-gray-50 overflow-hidden mb-4">
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-600" />
            <span className="font-bold text-gray-800">שינוי נתונים - למנהלים</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {isExpanded && (
          <div className="p-4 space-y-4">
            {/* Dimensions Row */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">רוחב</label>
                <input
                  type="number"
                  value={formData.width}
                  onChange={(e) => handleInputChange('width', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="ס״מ"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">עומק</label>
                <input
                  type="number"
                  value={formData.depth}
                  onChange={(e) => handleInputChange('depth', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="ס״מ"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">גובה</label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="ס״מ"
                />
              </div>
            </div>

            {/* Additional Fee Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">תוספת מחיר</label>
                <input
                  type="number"
                  min="0"
                  value={formData.additionalFee}
                  onChange={(e) => handleInputChange('additionalFee', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="₪"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">סיבה לתוספת</label>
                <input
                  type="text"
                  value={formData.additionalFeeReason}
                  onChange={(e) => handleInputChange('additionalFeeReason', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="למשל: מידה מיוחדת"
                />
              </div>
            </div>

            {/* Discount Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">סוג הנחה</label>
                <select
                  value={formData.discountType}
                  onChange={(e) => handleInputChange('discountType', e.target.value as 'percent' | 'fixed')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="percent">אחוזי הנחה</option>
                  <option value="fixed">מחיר חדש</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.discountType === 'percent' ? 'אחוז הנחה' : 'מחיר חדש'}
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.discountValue}
                  onChange={(e) => handleInputChange('discountValue', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder={formData.discountType === 'percent' ? '%' : '₪'}
                />
              </div>
            </div>

            {/* Comments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">הערות</label>
              <textarea
                value={formData.freeComments}
                onChange={(e) => handleInputChange('freeComments', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                rows={2}
                placeholder="הערות לגבי ההזמנה..."
              />
            </div>

            {/* Upgrades Button */}
            {upgrades.length > 0 && (
              <button
                type="button"
                onClick={() => setShowUpgradesPopup(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Calculator className="w-4 h-4" />
                בחר שדרוגים
                {upgradesTotal > 0 && (
                  <span className="bg-white text-blue-600 px-2 py-0.5 rounded text-sm font-bold">
                    +{formatPrice(upgradesTotal)}
                  </span>
                )}
              </button>
            )}

            {/* Price Summary */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>מחיר בסיס:</span>
                <span>{formatPrice(currentBasePrice)}</span>
              </div>
              {upgradesTotal > 0 && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>שדרוגים:</span>
                  <span>+{formatPrice(upgradesTotal)}</span>
                </div>
              )}
              {parseFloat(formData.additionalFee) > 0 && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>תוספת מחיר:</span>
                  <span>+{formatPrice(parseFloat(formData.additionalFee))}</span>
                </div>
              )}
              {discountPercent > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>הנחה:</span>
                  <span>-{discountPercent.toFixed(1)}%</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>מחיר סופי:</span>
                <span className="text-blue-600">{formatPrice(totalPrice)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upgrades Popup */}
      {showUpgradesPopup && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowUpgradesPopup(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-md max-h-[80vh] overflow-auto p-6">
            <h3 className="text-lg font-bold mb-4">שדרוגים זמינים</h3>
            
            <div className="space-y-3">
              {upgrades.map((upgrade, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium">{upgrade.name}</span>
                    <span className="text-gray-500 text-sm mr-2">
                      (+{formatPrice(upgrade.price)})
                    </span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={selectedUpgrades[index] || 0}
                    onChange={(e) => handleUpgradeQuantityChange(index, parseInt(e.target.value) || 0)}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                  />
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between font-bold mb-4">
                <span>סה״כ תוספת שדרוגים:</span>
                <span className="text-blue-600">{formatPrice(upgradesTotal)}</span>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowUpgradesPopup(false)}
                  className="flex-1 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  החל שדרוגים
                </button>
                <button
                  onClick={() => setShowUpgradesPopup(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  סגור
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
