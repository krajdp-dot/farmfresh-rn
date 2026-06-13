import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useLang } from '../theme/LangContext';

const MANDI_DATA = [
  { name: 'Tomato', nameHi: 'टमाटर', mandi: 18, ours: 25 },
  { name: 'Potato', nameHi: 'आलू', mandi: 15, ours: 22 },
  { name: 'Onion', nameHi: 'प्याज़', mandi: 20, ours: 28 },
  { name: 'Cauliflower', nameHi: 'फूलगोभी', mandi: 25, ours: 35 },
  { name: 'Spinach', nameHi: 'पालक', mandi: 12, ours: 18 },
  { name: 'Ginger', nameHi: 'अदरक', mandi: 60, ours: 80 },
  { name: 'Garlic', nameHi: 'लहसुन', mandi: 80, ours: 100 },
  { name: 'Bitter Gourd', nameHi: 'करेला', mandi: 30, ours: 42 },
];

const MandiTicker: React.FC = () => {
  const { colors } = useTheme();
  const { isHindi, t } = useLang();
  const scrollX = useRef(new Animated.Value(0)).current;

  const tickerText = MANDI_DATA.map((item) => {
    const name = isHindi ? item.nameHi : item.name;
    return `${name}: ₹${item.mandi}/kg (${t('mandiPrice')}) → ₹${item.ours}/kg (${t('ourPrice')})`;
  }).join('   •   ');

  const fullText = tickerText + '   •   ' + tickerText;
  const textWidth = fullText.length * 7.5;

  useEffect(() => {
    scrollX.setValue(0);
    const anim = Animated.loop(
      Animated.timing(scrollX, {
        toValue: -textWidth / 2,
        duration: textWidth * 28,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    anim.start();
    return () => anim.stop();
  }, [isHindi, textWidth]);

  return (
    <View style={[styles.container, { backgroundColor: colors.mandiStrip, borderBottomColor: colors.mandiBorder }]}>
      <View style={[styles.label, { backgroundColor: colors.mandiText }]}>
        <Text style={styles.labelText}>{t('mandiLive')}</Text>
      </View>
      <View style={styles.ticker}>
        <Animated.Text
          style={[
            styles.tickerText,
            {
              color: colors.mandiText,
              fontFamily: isHindi ? 'Baloo2-Medium' : 'Outfit-Medium',
              transform: [{ translateX: scrollX }],
            },
          ]}
          numberOfLines={1}
        >
          {fullText}
        </Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 34,
    borderBottomWidth: 1,
    overflow: 'hidden',
  },
  label: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  labelText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Outfit-Bold',
    letterSpacing: 0.5,
  },
  ticker: {
    flex: 1,
    overflow: 'hidden',
  },
  tickerText: {
    fontSize: 12,
    whiteSpace: 'nowrap',
  } as any,
});

export default MandiTicker;
