export const fontOutfit = 'font-outfit'; 
export const fontPoppins = 'font-poppins';
export type AsProp<T extends React.ElementType> = {
  as?: T;
  className?: string;
  children: React.ReactNode;
};

export type TitleVariant =
  | 'display' // 40 / 130% Bold
  | 'h1' // 24 / 130% Bold
  | 'h2' // 20 / 120% Bold
  | 'h3' // 16 / 120% Bold
  | 'h4' // 16 / 120% Medium
  | 'h5' // 28 / 130% SemiBold
  | 'h6' // 18 / 115% Bold
  | 'h7' // 14 / 115% Medium
  | 'h8' // 16 / 125% SemiBold
  | 'h9'; // 32 / 150% Bold

export const TITLE_STYLES: Record<TitleVariant, string> = {
  display: `${fontOutfit} text-[40px] leading-[130%] font-bold`,
  h1: `${fontOutfit} text-[24px] leading-[130%] font-bold`,
  h2: `${fontOutfit} text-[20px] leading-[120%] font-bold`,
  h3: `${fontOutfit} text-[16px] leading-[120%] font-bold`,
  h4: `${fontOutfit} text-[16px] leading-[120%] font-medium`,
  h5: `${fontOutfit} text-[28px] leading-[130%] font-semibold`,
  h6: `${fontOutfit} text-[18px] leading-[115%] font-bold`,
  h7: `${fontOutfit} text-[14px] leading-[115%] font-medium`,
  h8: `${fontOutfit} text-[16px] leading-[125%] font-semibold`,
  h9: `${fontOutfit} text-[32px] leading-[150%] font-bold`,
};

export type HeaderVariant = 'buttonBold';

export const HEADER_STYLES: Record<HeaderVariant, string> = {
  buttonBold: `${fontOutfit} text-[18px] leading-[135%] font-bold`,
};

export type BodyVariant =
  | 'xsRegular' // 12 / 150% Regular
  | 'smRegular' // 14 / 150% Regular
  | 'smMedium' // 14 / 130% Medium
  | 'smSemiBold' // 14 / 150% SemiBold
  | 'mdRegular' // 16 / 150% Regular
  | 'mdMedium' // 16 / 150% Medium
  | 'lgRegular'; // 18 / 120% Regular

export const BODY_STYLES: Record<BodyVariant, string> = {
  xsRegular: `${fontPoppins} text-[12px] leading-[150%] font-normal`,
  smRegular: `${fontPoppins} text-[14px] leading-[150%] font-normal`,
  smMedium: `${fontPoppins} text-[14px] leading-[130%] font-medium`,
  smSemiBold: `${fontPoppins} text-[14px] leading-[150%] font-semibold`,
  mdRegular: `${fontPoppins} text-[16px] leading-[150%] font-normal`,
  mdMedium: `${fontPoppins} text-[16px] leading-[150%] font-medium`,
  lgRegular: `${fontPoppins} text-[18px] leading-[120%] font-normal`,
};
