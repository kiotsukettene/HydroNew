import { Platform } from 'react-native';
import Animated, { type AnimatedProps } from 'react-native-reanimated';

interface NativeOnlyAnimatedViewProps extends AnimatedProps<any> {
  children?: React.ReactNode;
}

export function NativeOnlyAnimatedView({
  children,
  ...props
}: NativeOnlyAnimatedViewProps) {
  if (Platform.OS === 'web') {
    // On web, render a regular View instead of Animated.View
    const { View } = require('react-native');
    return <View {...props}>{children}</View>;
  }

  // On native platforms, use Animated.View
  return <Animated.View {...props}>{children}</Animated.View>;
}
