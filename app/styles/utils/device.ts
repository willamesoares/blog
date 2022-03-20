type SizeOptions = {
  min: string;
  max: string;
};

type SizeTypes =
  | 'mobileS'
  | 'mobileM'
  | 'mobileL'
  | 'tablet'
  | 'laptop'
  | 'laptopL'
  | 'desktop';

type DeviceSizes = Record<SizeTypes, SizeOptions>;

const sizes: Record<SizeTypes, number> = {
  mobileS: 319,
  mobileM: 374,
  mobileL: 424,
  tablet: 767,
  laptop: 1023,
  laptopL: 1279,
  desktop: 1600,
};

const buildDeviceSizes = (): DeviceSizes => {
  const device = {} as DeviceSizes;
  Object.keys(sizes).forEach((key: string) => {
    device[key as SizeTypes] = {
      min: `min-width: ${sizes[key as SizeTypes] + 1}px`,
      max: `max-width: ${sizes[key as SizeTypes]}px`,
    };
  });
  return device;
};

export const device = buildDeviceSizes();
