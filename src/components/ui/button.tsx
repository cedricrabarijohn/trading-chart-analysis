import { Button as ChakraButton, Spinner } from '@chakra-ui/react';
import { forwardRef } from 'react';
import type { ButtonProps as ChakraButtonProps } from '@chakra-ui/react';

export interface ButtonProps extends ChakraButtonProps {
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { loading, children, disabled, ...rest } = props;
  
  return (
    <ChakraButton
      ref={ref}
      size="md"
      colorScheme="purple"
      borderRadius="xl"
      fontWeight="semibold"
      transition="all 0.3s"
      disabled={disabled || loading}
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: 'lg',
      }}
      padding={'0 10px 0 10px'}
      {...rest}
    >
      {loading && <Spinner size="sm" mr={2} />}
      {children}
    </ChakraButton>
  );
});

Button.displayName = 'Button';


