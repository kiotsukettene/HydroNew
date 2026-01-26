import { cn } from '@/lib/utils';
import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

const Skeleton = React.forwardRef<View, React.ComponentProps<typeof View>>(
  ({ className, ...props }, ref) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();

      return () => animation.stop();
    }, [animatedValue]);

    const opacity = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.7],
    });

    return (
      <View
        ref={ref}
        className={cn('bg-gray-200 rounded-md overflow-hidden', className)}
        style={{ position: 'relative', zIndex: 0 }}
        {...props}
      >
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#e5e7eb',
            opacity,
            zIndex: 1,
          }}
        />
      </View>
    );
  }
);

Skeleton.displayName = 'Skeleton';

export { Skeleton };