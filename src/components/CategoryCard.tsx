import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useLang } from '../theme/LangContext';
import AnimatedPressable from './AnimatedPressable';
import { radius, spacing, SCREEN_WIDTH } from '../theme/tokens';

interface Props {
  id: string;
  name: string;
  nameHi: string;
  image: string;
  onPress?: () => void;
  size?: 'sm' | 'md';
}

const CARD_SIZE = (SCREEN_WIDTH - spacing.lg * 2 - spacing.sm * 3) / 4;

const CategoryCard: React.FC<Props> = ({ name, nameHi, image, onPress, size = 'md' }) => {
  const { colors } = useTheme();
  const { isHindi } = useLang();

  const displayName = isHindi ? nameHi : name;

  return (
    <AnimatedPressable onPress={onPress} scale={0.94}>
      <View style={styles.card}>
        <View
          style={[
            styles.imageWrap,
            {
              backgroundColor: colors.bgSecondary,
              width: CARD_SIZE,
              height: CARD_SIZE,
            },
          ]}
        >
          <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
        </View>
        <Text
          style={[
            styles.label,
            {
              color: colors.text,
              fontFamily: isHindi ? 'Baloo2-Medium' : 'Outfit-Medium',
            },
          ]}
          numberOfLines={2}
        >
          {displayName}
        </Text>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    gap: 6,
    width: CARD_SIZE,
  },
  imageWrap: {
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  label: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default CategoryCard;
