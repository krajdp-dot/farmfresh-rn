import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useLang } from '../../theme/LangContext';

interface Props { value: string; onChange: (text: string) => void; }

export const OrderNotes: React.FC<Props> = ({ value, onChange }) => {
  const { colors } = useTheme();
  const { isHindi } = useLang();

  return (
    <View style={[styles.wrap, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}>
      <View style={styles.header}>
        <Text style={styles.icon}>📝</Text>
        <Text style={[styles.label, { color: colors.text, fontFamily: 'Outfit-SemiBold' }]}>
          {isHindi ? 'डिलीवरी नोट' : 'Delivery Instructions'}
        </Text>
        <Text style={[styles.optional, { color: colors.textMuted, fontFamily: 'Outfit-Regular' }]}>
          {isHindi ? '(वैकल्पिक)' : '(optional)'}
        </Text>
      </View>
      <TextInput
        value={value} onChangeText={onChange}
        placeholder={isHindi ? 'जैसे: दरवाज़े के पास छोड़ें, 3rd floor...' : 'e.g. Leave at door, call on arrival, 3rd floor...'}
        placeholderTextColor={colors.textMuted}
        style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card, fontFamily: 'Outfit-Regular' }]}
        multiline maxLength={200} numberOfLines={3}
      />
      <Text style={[styles.count, { color: colors.textMuted, fontFamily: 'Outfit-Regular' }]}>{value.length}/200</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { marginHorizontal: 16, marginTop: 12, borderRadius: 14, borderWidth: 1, padding: 14, gap: 10 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  icon: { fontSize: 18 },
  label: { fontSize: 15 },
  optional: { fontSize: 12 },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 14, lineHeight: 20, minHeight: 80, textAlignVertical: 'top' },
  count: { fontSize: 11, textAlign: 'right' },
});
