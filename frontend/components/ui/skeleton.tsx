import { cn } from '@/lib/utils';
import React, { useEffect, useRef } from 'react';
import { View, Animated, DimensionValue } from 'react-native';

// ============================================================
// Base Skeleton Component
// ============================================================
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

// ============================================================
// Skeleton Text - For text placeholders
// ============================================================
interface SkeletonTextProps {
  width?: DimensionValue;
  height?: DimensionValue;
  lines?: number;
  className?: string;
}

const SkeletonText: React.FC<SkeletonTextProps> = ({
  width = '100%',
  height = 16,
  lines = 1,
  className,
}) => {
  return (
    <View className={cn('gap-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className="rounded"
          style={{
            width: index === lines - 1 && lines > 1 ? '75%' : width,
            height,
          }}
        />
      ))}
    </View>
  );
};

SkeletonText.displayName = 'SkeletonText';

// ============================================================
// Skeleton Circle - For avatars, icons, circular elements
// ============================================================
interface SkeletonCircleProps {
  size?: number;
  className?: string;
}

const SkeletonCircle: React.FC<SkeletonCircleProps> = ({
  size = 40,
  className,
}) => {
  return (
    <Skeleton
      className={cn('rounded-full', className)}
      style={{ width: size, height: size }}
    />
  );
};

SkeletonCircle.displayName = 'SkeletonCircle';

// ============================================================
// Skeleton Card - Card wrapper with skeleton styling
// ============================================================
interface SkeletonCardProps {
  children?: React.ReactNode;
  className?: string;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ children, className }) => {
  return (
    <View
      className={cn(
        'rounded-2xl bg-gray-100 p-4 overflow-hidden',
        className
      )}
    >
      {children}
    </View>
  );
};

SkeletonCard.displayName = 'SkeletonCard';

export { Skeleton, SkeletonText, SkeletonCircle, SkeletonCard };