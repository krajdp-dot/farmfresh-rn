import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
  scale?: number;
  haptic?: boolean;
  disabled?: boolean;
}

const AnimatedPressable: React.FC<Props> = ({
  children,
  onPress,
  onLongPress,
  style,
  scale = 0.96,
  haptic = true,
  disabled = false,
}) => {
  const pressed = useSharedValue(false);

  const triggerHaptic = () => {
    if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePress = () => {
    if (haptic) triggerHaptic();
    onPress?.();
  };

  const handleLongPress = () => {
    if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onLongPress?.();
  };

  const tap = Gesture.Tap()
    .enabled(!disabled)
    .onBegin(() => {
      pressed.value = true;
    })
    .onFinalize((_, success) => {
      pressed.value = false;
      if (success && onPress) runOnJS(handlePress)();
    });

  const longPress = Gesture.LongPress()
    .enabled(!disabled && !!onLongPress)
    .minDuration(500)
    .onStart(() => {
      if (onLongPress) runOnJS(handleLongPress)();
    });

  const composed = Gesture.Simultaneous(tap, longPress);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withSpring(pressed.value ? scale : 1, {
          damping: 15,
          stiffness: 300,
        }),
      },
    ],
    opacity: disabled ? 0.5 : 1,
  }));

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={[style, animStyle]}>{children}</Animated.View>
    </GestureDetector>
  );
};

export default AnimatedPressable;
