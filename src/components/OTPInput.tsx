import React, { useRef, useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { radius } from '../theme/tokens';

interface Props {
  length?: number;
  onComplete: (otp: string) => void;
}

const OTPInput: React.FC<Props> = ({ length = 6, onComplete }) => {
  const { colors } = useTheme();
  const [values, setValues] = useState<string[]>(Array(length).fill(''));
  const refs = useRef<TextInput[]>([]);

  const handleChange = (text: string, index: number) => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(-1);
    const newVals = [...values];
    newVals[index] = cleaned;
    setValues(newVals);

    if (cleaned && index < length - 1) {
      refs.current[index + 1]?.focus();
    }

    const full = newVals.join('');
    if (full.length === length) onComplete(full);
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !values[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.row}>
      {Array(length)
        .fill(0)
        .map((_, i) => (
          <TextInput
            key={i}
            ref={(r) => { if (r) refs.current[i] = r; }}
            style={[
              styles.box,
              {
                backgroundColor: colors.inputBg,
                borderColor: values[i] ? colors.primary : colors.inputBorder,
                color: colors.text,
              },
            ]}
            value={values[i]}
            onChangeText={(t) => handleChange(t, i)}
            onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
            keyboardType="numeric"
            maxLength={1}
            textAlign="center"
            caretHidden
            fontFamily="Outfit-Bold"
            fontSize={22}
          />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  box: {
    width: 46,
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1.5,
    fontSize: 22,
    fontFamily: 'Outfit-Bold',
    textAlign: 'center',
  },
});

export default OTPInput;
