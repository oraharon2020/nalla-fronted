'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminStore {
  isAdmin: boolean;
  adminName: string;
  adminToken: string | null;
  upgrades: { name: string; price: number }[];
  showLoginModal: boolean;
  currentProductId: number | null;
  currentCategoryId: number | null;
  
  // Actions
  setAdmin: (isAdmin: boolean, adminName: string, token: string | null, upgrades?: { name: string; price: number }[]) => void;
  logout: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  setCurrentProduct: (id: number | null) => void;
  setCurrentCategory: (id: number | null) => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      isAdmin: false,
      adminName: '',
      adminToken: null,
      upgrades: [],
      showLoginModal: false,
      currentProductId: null,
      currentCategoryId: null,
      
      setAdmin: (isAdmin, adminName, token, upgrades = []) => 
        set({ isAdmin, adminName, adminToken: token, upgrades }),
      
      logout: () => 
        set({ isAdmin: false, adminName: '', adminToken: null, upgrades: [] }),
      
      openLoginModal: () => 
        set({ showLoginModal: true }),
      
      closeLoginModal: () => 
        set({ showLoginModal: false }),
      
      setCurrentProduct: (id) => 
        set({ currentProductId: id }),
      
      setCurrentCategory: (id) => 
        set({ currentCategoryId: id }),
    }),
    {
      name: 'nalla-admin',
      partialize: (state) => ({
        isAdmin: state.isAdmin,
        adminName: state.adminName,
        adminToken: state.adminToken,
        upgrades: state.upgrades,
      }),
    }
  )
);
