// Shop by Room - Configuration
// To update: change images in /public/images/rooms/ and update hotspot positions below

export interface Hotspot {
  id: string;
  name: string;        // Product/category name in Hebrew
  price?: string;      // Optional starting price
  link: string;        // Link to category or product
  x: number;           // Position X in percentage (0-100)
  y: number;           // Position Y in percentage (0-100)
}

export interface Room {
  id: string;
  name: string;        // English name for display
  nameHe: string;      // Hebrew name
  slug: string;        // For category link
  image: string;       // Image path
  hotspots: Hotspot[];
}

export const rooms: Room[] = [
  {
    id: 'living-room',
    name: 'LIVING ROOM',
    nameHe: 'סלון',
    slug: 'living-room',
    image: '/images/rooms/living-room.webp',
    hotspots: [
      {
        id: 'sofa-1',
        name: 'ספה תלת מושבית',
        price: '4,500',
        link: '/category/sofas',
        x: 55,
        y: 30
      },
      {
        id: 'table-1',
        name: 'שולחן סלון',
        price: '1,800',
        link: '/category/coffee-tables',
        x: 35,
        y: 65
      }
    ]
  },
  {
    id: 'dining-room',
    name: 'DINING ROOM',
    nameHe: 'פינת אוכל',
    slug: 'dining-room',
    image: '/images/rooms/dining-room.webp',
    hotspots: [
      {
        id: 'dining-table-1',
        name: 'שולחן אוכל',
        price: '3,200',
        link: '/category/dining-tables',
        x: 50,
        y: 55
      }
    ]
  },
  {
    id: 'bedroom',
    name: 'BEDROOM',
    nameHe: 'חדר שינה',
    slug: 'bedroom',
    image: '/images/rooms/bedroom.webp',
    hotspots: [
      {
        id: 'dresser-1',
        name: 'קומודה',
        price: '2,400',
        link: '/category/dressers',
        x: 70,
        y: 45
      }
    ]
  },
  {
    id: 'hallway',
    name: 'HALLWAY',
    nameHe: 'מבואה',
    slug: 'hallway',
    image: '/images/rooms/hallway.webp',
    hotspots: [
      {
        id: 'console-1',
        name: 'קונסולה',
        price: '2,100',
        link: '/category/consoles',
        x: 50,
        y: 50
      }
    ]
  },
  {
    id: 'office',
    name: 'OFFICE',
    nameHe: 'משרד',
    slug: 'office',
    image: '/images/rooms/office.webp',
    hotspots: [
      {
        id: 'desk-1',
        name: 'שולחן משרד',
        price: '1,900',
        link: '/category/office-desks',
        x: 45,
        y: 55
      },
      {
        id: 'bookcase-1',
        name: 'ספרייה',
        price: '3,500',
        link: '/category/bookcases',
        x: 75,
        y: 40
      }
    ]
  }
];
