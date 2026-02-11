import { Box, type BoxProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Card = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
  return (
    <Box
      ref={ref}
      bg="gray.800"
      borderWidth="1px"
      borderColor="gray.700"
      borderRadius="xl"
      p={6}
      transition="all 0.2s"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: 'xl',
      }}
      {...props}
    />
  );
});

Card.displayName = 'Card';
