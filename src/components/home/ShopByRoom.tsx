'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { rooms, Room, Hotspot } from '@/config/rooms';

const AUTO_ROTATE_INTERVAL = 4000; // 4 seconds between rotations

export function ShopByRoom() {
  const [activeRoom, setActiveRoom] = useState<Room>(rooms[0]);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-rotate rooms
  useEffect(() => {
    if (isAutoRotating) {
      intervalRef.current = setInterval(() => {
        setActiveRoom(current => {
          const currentIndex = rooms.findIndex(r => r.id === current.id);
          const nextIndex = (currentIndex + 1) % rooms.length;
          return rooms[nextIndex];
        });
      }, AUTO_ROTATE_INTERVAL);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoRotating]);

  // Handle room click - stop auto-rotation
  const handleRoomClick = (room: Room) => {
    setIsAutoRotating(false);
    setActiveRoom(room);
  };

  return (
    <section className="py-10 md:py-14 bg-white">
      <div className="max-w-[1300px] mx-auto px-4">
        <div className="flex flex-col md:flex-row-reverse gap-8 md:gap-16 items-stretch">
          
          {/* Left Side - Room List */}
          <div className="w-full md:w-2/5 order-2 md:order-1 flex flex-col justify-between" dir="ltr">
            {/* Section Title */}
            <div className="mb-6">
              <p className="font-english text-gray-400 text-base md:text-lg tracking-[0.25em] uppercase flex items-center gap-3">
                SHOP BY ROOM
                <span className="text-3xl">↘</span>
              </p>
            </div>
            
            {/* Room Names - with reasonable spacing */}
            <div className="flex-1 flex flex-col justify-center gap-4 md:gap-7">
              {rooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => handleRoomClick(room)}
                  className={`block w-full text-left font-english text-3xl md:text-5xl lg:text-6xl tracking-wide transition-all duration-300 ${
                    activeRoom.id === room.id
                      ? 'text-gray-900 font-medium'
                      : 'text-gray-300 hover:text-gray-500 font-light'
                  }`}
                >
                  {room.name}
                </button>
              ))}
            </div>
          </div>

          {/* Right Side - Image with Hotspots */}
          <div className="w-full md:w-3/5 order-1 md:order-2">
            <div className="relative aspect-[4/3] rounded-[30px] rounded-tl-none overflow-hidden bg-gray-100">
              {/* Room Image */}
              <Image
                src={activeRoom.image}
                alt={activeRoom.nameHe}
                fill
                className="object-cover transition-opacity duration-500"
                sizes="(max-width: 768px) 100vw, 60vw"
                priority
              />
              
              {/* Hotspots */}
              {activeRoom.hotspots.map((hotspot) => (
                <div
                  key={hotspot.id}
                  className="absolute"
                  style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                >
                  {/* Hotspot Button */}
                  <button
                    onMouseEnter={() => setActiveHotspot(hotspot.id)}
                    onMouseLeave={() => setActiveHotspot(null)}
                    onClick={() => setActiveHotspot(activeHotspot === hotspot.id ? null : hotspot.id)}
                    className="relative w-4 h-4 -translate-x-1/2 -translate-y-1/2"
                  >
                    {/* Pulsing circle */}
                    <span className="absolute inset-0 bg-white rounded-full animate-ping opacity-75" />
                    <span className="relative block w-4 h-4 bg-white rounded-full shadow-lg border-2 border-gray-200" />
                  </button>
                  
                  {/* Tooltip */}
                  {activeHotspot === hotspot.id && (
                    <Link
                      href={hotspot.link}
                      className="absolute right-6 top-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl px-4 py-3 min-w-[180px] z-10 transition-all duration-300 hover:shadow-2xl"
                    >
                      <p className="text-gray-900 font-semibold text-sm mb-1">
                        {hotspot.name}
                      </p>
                      {hotspot.price && (
                        <p className="text-[#4a7c59] text-xs">
                          החל מ-{hotspot.price} ש״ח
                        </p>
                      )}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
