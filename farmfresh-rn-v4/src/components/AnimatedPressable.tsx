// ============================================================
// FARM FRESH RN v4 — AnimatedPressable
// Wrap EVERY tappable element with this.
// Gives spring scale-down on press, like native iOS feedback.
// ============================================================

import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Haptics } from '../utils/haptics';

interface AnimatedPressableProps {
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
  scaleDown?: number;    // default 0.96
  disabled?: boolean;
  hitSlop?: number;
}

export const AnimatedPressable = ({
  children,
  onPress,
  onLongPress,
  style,
  scaleDown = 0.96,
  disabled = false,
  hitSlop = 4,
}: AnimatedPressableProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const tap = Gesture.Tap()
    .enabled(!disabled)
    .hitSlop(hitSlop)
    .onBegin(() => {
      scale.value = withSpring(scaleDown, { damping: 15, stiffness: 300 });
    })
    .onFinalize(() => {
      scale.value = withSpring(1, { damping: 12, stiffness: 200 });
    })
    .onEnd(() => {
      if (onPress) onPress();
    });

  const longPress = Gesture.LongPress()
    .enabled(!disabled && !!onLongPress)
    .minDuration(500)
    .onStart(() => {
      if (onLongPress) onLongPress();
    });

  const composed = Gesture.Simultaneous(tap, longPress);

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={[style, animatedStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};
