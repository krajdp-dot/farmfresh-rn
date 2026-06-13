import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '../theme/ThemeContext';
import { useLang } from '../theme/LangContext';
import { radius, spacing } from '../theme/tokens';

interface Props {
  value?: string;
  onChangeText?: (text: string) => void;
  onPress?: () => void;
  editable?: boolean;
  autoFocus?: boolean;
}

const SearchBar: React.FC<Props> = ({
  value,
  onChangeText,
  onPress,
  editable = true,
  autoFocus = false,
}) => {
  const { colors } = useTheme();
  const { t, isHindi } = useLang();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: colors.inputBg,
          borderColor: colors.inputBorder,
        },
      ]}
      onPress={onPress}
      activeOpacity={editable ? 1 : 0.8}
    >
      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
        <Circle cx="10.5" cy="10.5" r="6.5" stroke={colors.textMuted} strokeWidth="2" />
        <Path d="M15.5 15.5L20 20" stroke={colors.textMuted} strokeWidth="2" strokeLinecap="round" />
      </Svg>
      <TextInput
        style={[
          styles.input,
          {
            color: colors.text,
            fontFamily: isHindi ? 'Baloo2-Regular' : 'Outfit-Regular',
          },
        ]}
        placeholder={t('searchPlaceholder')}
        placeholderTextColor={colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        autoFocus={autoFocus}
        returnKeyType="search"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 14,
    padding: 0,
    margin: 0,
  },
});

export default SearchBar;
