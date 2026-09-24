'use client';

import { useMenuChoice } from '../context/MenuChoiceProvider';

/**
 * Drop-in replacement for the old "Utforska menyn" <a href="#buffe"> link.
 * Opens the menu-choice modal (Mat meny vs. Drink meny) instead of jumping
 * straight to the home page's buffet section.
 */
export default function ExploreMenuButton({ className = 'btn btn-outline', style, children }) {
  const { openMenuChoice } = useMenuChoice();
  return (
    <button type="button" className={className} style={style} onClick={openMenuChoice}>
      {children}
    </button>
  );
}
