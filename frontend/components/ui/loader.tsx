import { cn } from '@/lib/utils';
import { ActivityIndicator, View } from 'react-native';
import { Text } from './text';

type LoaderSize = 'sm' | 'md' | 'lg';
type LoaderVariant = 'spinner' | 'fullscreen';

interface LoaderProps {
  size?: LoaderSize;
  variant?: LoaderVariant;
  color?: string;
  message?: string;
  className?: string;
  textClassName?: string;
}

const sizeMap = {
  sm: 'small' as const,
  md: 'small' as const,
  lg: 'large' as const,
};

const defaultColor = '#3B82F6'; // blue-500

/**
 * Reusable Loader Component
 *
 * @example
 * // Fullscreen loader with message
 * <FullscreenLoader message="Loading dashboard..." />
 *
 * @example
 * // Inline spinner
 * <Loader size="md" color="#10b981" message="Processing..." />
 *
 * @example
 * // Simple spinner without message
 * <Loader />
 */

// HOW TO USE:
/*

Simple inline spinner
<Loader />

Fullscreen loader with message
<FullscreenLoader message="Loading dashboard..." />

Custom colored spinner with message
<Loader size="lg" color="#10b981" message="Processing..." />

Inline loader
<InlineLoader message="Loading data..." />

Fullscreen with custom styling

<Loader 
  variant="fullscreen" 
  message="Generating tips..." 
  color="#2D7D7D"
  className="bg-white"
/>
 */

export function Loader({
  size = 'md',
  variant = 'spinner',
  color = defaultColor,
  message,
  className,
  textClassName,
}: LoaderProps) {
  const spinnerSize = sizeMap[size];

  // Fullscreen loader with message
  if (variant === 'fullscreen') {
    return (
      <View className={cn('flex-1 items-center justify-center', className)}>
        <ActivityIndicator size={spinnerSize} color={color} />
        {message && (
          <Text
            className={cn(
              'mt-4 text-center text-gray-600',
              size === 'sm' && 'text-sm',
              size === 'lg' && 'text-lg',
              textClassName
            )}>
            {message}
          </Text>
        )}
      </View>
    );
  }

  // Default inline spinner loader
  return (
    <View className={cn('items-center justify-center', className)}>
      <ActivityIndicator size={spinnerSize} color={color} />
      {message && (
        <Text
          className={cn(
            'mt-2 text-center text-gray-600',
            size === 'sm' && 'text-xs',
            size === 'md' && 'text-sm',
            size === 'lg' && 'text-base',
            textClassName
          )}>
          {message}
        </Text>
      )}
    </View>
  );
}

// Preset loaders for common use cases
export function FullscreenLoader({
  message = 'Loading...',
  ...props
}: Omit<LoaderProps, 'variant'>) {
  return <Loader variant="fullscreen" message={message} {...props} />;
}

export function InlineLoader({
  message,
  ...props
}: Omit<LoaderProps, 'variant'>) {
  return <Loader variant="spinner" message={message} {...props} />;
}

