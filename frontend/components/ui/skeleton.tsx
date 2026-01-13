import { cn } from '@/lib/utils';
import React from 'react';
import { View } from 'react-native';

const Skeleton = React.forwardRef<View, React.ComponentProps<typeof View>>(
  ({ className, ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={cn('bg-gray-200 rounded-md', className)}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

export { Skeleton };
