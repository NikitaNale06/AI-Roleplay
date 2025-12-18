export const AVATAR_CONFIGS = {
  default: {
    bodyType: 'fullbody',
    style: 'professional',
    outfit: 'business_casual',
    animation: 'idle'
  },
  interviewer: {
    bodyType: 'fullbody',
    style: 'formal',
    outfit: 'business_formal',
    animation: 'idle'
  },
  happy: {
    animation: 'wave',
    expression: 'smile'
  },
  thinking: {
    animation: 'thinking',
    expression: 'thoughtful'
  },
  speaking: {
    animation: 'talking',
    expression: 'neutral'
  }
};

export const generateAvatarUrl = (config: any = {}): string => {
  const baseUrl = 'https://models.readyplayer.me';
  const defaultConfig = AVATAR_CONFIGS.default;
  const mergedConfig = { ...defaultConfig, ...config };
  
  // Generate URL based on config
  return `${baseUrl}/avatar-${mergedConfig.bodyType}-${mergedConfig.style}.glb`;
};