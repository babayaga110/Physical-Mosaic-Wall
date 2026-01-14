
import React from 'react';
import { Platform } from './types';

export const FIXED_CAPTION = "✨ Transform your memories into a beautiful Mosaic Wall 💎\nPerfect for home & office decor 🏡\nDM to Order ✅";
export const FIXED_HASHTAGS = "#PhysicalMosaicWall #MosaicWall #HomeDecor #WallArt #InteriorDesign #Memories #CustomArt";

// Use Platform enum values as keys for ICONS to match values from UI interactions
export const ICONS: Record<Platform, React.ReactNode> = {
  [Platform.INSTAGRAM]: <i className="fab fa-instagram"></i>,
  [Platform.FACEBOOK]: <i className="fab fa-facebook"></i>,
  [Platform.LINKEDIN]: <i className="fab fa-linkedin"></i>,
  [Platform.TWITTER]: <i className="fab fa-twitter"></i>
};
