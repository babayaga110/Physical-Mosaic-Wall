
export enum Platform {
  INSTAGRAM = 'Instagram',
  FACEBOOK = 'Facebook',
  LINKEDIN = 'LinkedIn',
  TWITTER = 'Twitter(X)'
}

export enum SourceAspectRatio {
  SQUARE = 'Square',
  LANDSCAPE = 'Landscape',
  PORTRAIT = 'Portrait'
}

export interface PostInputs {
  platform: Platform;
  username: string;
  photo: string | null;
  aspectRatio: SourceAspectRatio;
}

export interface PlatformConfig {
  width: number;
}

export const PLATFORM_CONFIGS: Record<Platform, PlatformConfig> = {
  [Platform.INSTAGRAM]: { width: 550 },
  [Platform.FACEBOOK]: { width: 580 },
  [Platform.LINKEDIN]: { width: 560 },
  [Platform.TWITTER]: { width: 580 }
};
