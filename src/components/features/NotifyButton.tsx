import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useLang } from '../../theme/LangContext';
import AnimatedPressable from '../AnimatedPressable';

interface Props { productId: string; productName: string; }

export const NotifyButton: React.FC<Props> = ({ productId, productName }) => {
  const { colors } = useTheme();
  const { isHindi } = useLang();
  const [notified, setNotified] = useState(false);

  const handlePress = () => {
    setNotified(true);
    Alert.alert(
      isHindi ? 'सूचना सेट!' : 'Alert Set!',
      isHindi ? `${productName} का स्टॉक आने पर हम बताएंगे।` : `We'll notify you when ${productName} is back.`
    );
  };

  return (
    <AnimatedPressable onPress={handlePress} scale={0.96} disabled={notified}>
      <View style={[styles.btn, { backgroundColor: notified ? colors.primaryLight : colors.bgSecondary, borderColor: notified ? colors.primary : colors.border }]}>
        <Text style={styles.icon}>{notified ? '🔔' : '🔕'}</Text>
        <Text style={[styles.text, { color: notified ? colors.primary : colors.textSecondary, fontFamily: 'Outfit-SemiBold' }]}>
          {notified ? (isHindi ? 'सूचना मिलेगी ✓' : 'Will notify you ✓') : (isHindi ? 'स्टॉक आने पर बताएं' : 'Notify when back')}
        </Text>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  btn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1.5 },
  icon: { fontSize: 18 },
  text: { fontSize: 14 },
});
