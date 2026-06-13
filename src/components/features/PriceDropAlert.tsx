import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useLang } from '../../theme/LangContext';
import AnimatedPressable from '../AnimatedPressable';

interface Props { productId: string; productName: string; }

export const PriceDropAlert: React.FC<Props> = ({ productId, productName }) => {
  const { colors } = useTheme();
  const { isHindi } = useLang();
  const [on, setOn] = useState(false);

  return (
    <AnimatedPressable onPress={() => setOn(!on)} scale={0.97}>
      <View style={[styles.row, { borderColor: colors.border, backgroundColor: on ? colors.primaryLight : colors.bgSecondary }]}>
        <Text style={styles.icon}>{on ? '🔔' : '🔕'}</Text>
        <Text style={[styles.text, { color: on ? colors.primary : colors.textSecondary, fontFamily: 'Outfit-Medium' }]}>
          {on ? (isHindi ? 'कीमत गिरने पर सूचित होंगे ✓' : 'Price drop alert ON ✓') : (isHindi ? 'कीमत गिरने पर बताएं' : 'Alert me on price drop')}
        </Text>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderRadius: 10, borderWidth: 1, marginTop: 8 },
  icon: { fontSize: 16 },
  text: { fontSize: 13 },
});
