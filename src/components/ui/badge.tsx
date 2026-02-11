import { Badge as ChakraBadge, type BadgeProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>((props, ref) => {
  return (
    <ChakraBadge
      ref={ref}
      px={4}
      py={2}
      borderRadius="md"
      fontSize="sm"
      fontWeight="bold"
      letterSpacing="wider"
      {...props}
    />
  );
});

Badge.displayName = 'Badge';
