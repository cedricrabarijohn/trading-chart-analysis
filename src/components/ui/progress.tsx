import { Progress as ChakraProgress } from '@chakra-ui/react';
import { forwardRef } from 'react';

export interface ProgressProps extends ChakraProgress.RootProps {
  value?: number;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>((props, ref) => {
  const { value, ...rest } = props;
  
  return (
    <ChakraProgress.Root ref={ref} value={value} {...rest}>
      <ChakraProgress.Track>
        <ChakraProgress.Range />
      </ChakraProgress.Track>
    </ChakraProgress.Root>
  );
});

Progress.displayName = 'Progress';

