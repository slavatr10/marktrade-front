import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';

type Props = {
  children: React.ReactNode;
  className?: string;
  onIndexChange: (index: number) => void;
};

export function HorizontalCarousel({
  children,
  className,
  onIndexChange,
}: Props) {
  return (
    <Swiper
      className={` ${className || ''}`}
      slidesPerView={'auto'}
      spaceBetween={16}
      grabCursor={true}
      onSlideChange={(swiper) => {
        onIndexChange(swiper.realIndex);
      }}
      initialSlide={0}
    >
      {React.Children.map(children, (child, index) => (
        <SwiperSlide key={index} style={{ width: '306px' }}>
          {child}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
