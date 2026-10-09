/**
 * Responsive layout hook for PayCom
 * Detects screen width and provides breakpoint info
 */

import { useState, useEffect } from 'react';
import { Dimensions, Platform } from 'react-native';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export function useResponsive() {
  const [width, setWidth] = useState(Dimensions.get('window').width);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  const breakpoint: Breakpoint =
    width >= 1024 ? 'desktop' : width >= 768 ? 'tablet' : 'mobile';

  return {
    width,
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop',
  };
}
