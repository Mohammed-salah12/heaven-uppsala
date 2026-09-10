'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import MenuChoiceModal from '../components/MenuChoiceModal';

const MenuChoiceContext = createContext(null);

/**
 * Powers the "Utforska menyn" choice modal — mirrors BookingProvider. There
 * are two real menus (Mat meny / Drink meny), so "Explore the menu" opens a
 * choice between them instead of jumping straight to one.
 */
export function MenuChoiceProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [site, setSite] = useState(null);

  const openMenuChoice = useCallback(() => setOpen(true), []);
  const closeMenuChoice = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ open, openMenuChoice, closeMenuChoice, site, setSite }),
    [open, site]
  );

  return (
    <MenuChoiceContext.Provider value={value}>
      {children}
      <MenuChoiceModal />
    </MenuChoiceContext.Provider>
  );
}

export function useMenuChoice() {
  const ctx = useContext(MenuChoiceContext);
  if (!ctx) throw new Error('useMenuChoice must be used within a MenuChoiceProvider');
  return ctx;
}
