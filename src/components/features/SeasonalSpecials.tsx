import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useLang } from '../../theme/LangContext';
import AnimatedPressable from '../AnimatedPressable';

const SEASONAL = [
  { id: 's1', name: 'Raw Mango',   nameHi: 'कच्चा आम',  price: 60, unit: '1kg',  image: 'https://images.unsplash.com/photo-1601493700631-2851bdcbfe4e?w=300', season: 'Summer',       seasonHi: 'गर्मी' },
  { id: 's2', name: 'Watermelon',  nameHi: 'तरबूज',      price: 20, unit: '1kg',  image: 'https://images.unsplash.com/photo-1563114773-84221bd62daa?w=300', season: 'Summer',       seasonHi: 'गर्मी' },
  { id: 's3', name: 'Jackfruit',   nameHi: 'कटहल',       price: 30, unit: '1kg',  image: 'https://images.unsplash.com/photo-1568584958148-5b6b2ebf8d91?w=300', season: 'Seasonal',     seasonHi: 'मौसमी' },
  { id: 's4', name: 'Lychee',      nameHi: 'लीची',       price: 80, unit: '500g', image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=300', season: 'Bihar Special', seasonHi: 'बिहार स्पेशल' },
];

interface Props { onProductPress: (product: any) => void; }

export const SeasonalSpecials: React.FC<Props> = ({ onProductPress }) => {
  const { colors } = useTheme();
  const { isHindi } = useLang();

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text, fontFamily: 'Outfit-Bold' }]}>
            🌾 {isHindi ? 'मौसमी स्पेशल' : 'Seasonal Specials'}
          </Text>
          <Text style={[styles.sub, { color: colors.textMuted, fontFamily: 'Outfit-Regular' }]}>
            {isHindi ? 'इस हफ्ते मंडी में क्या आया' : "What's fresh at mandi this week"}
          </Text>
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {SEASONAL.map(item => (
          <AnimatedPressable key={item.id} onPress={() => onProductPress(item)} scale={0.96}>
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Image source={{ uri: item.image }} style={styles.img} resizeMode="cover" />
              <View style={[styles.seasonTag, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.seasonText, { color: colors.primary }]}>{isHindi ? item.seasonHi : item.season}</Text>
              </View>
              <View style={styles.info}>
                <Text style={[styles.name, { color: colors.text, fontFamily: 'Outfit-SemiBold' }]} numberOfLines={1}>
                  {isHindi ? item.nameHi : item.name}
                </Text>
                <Text style={[styles.price, { color: colors.primary, fontFamily: 'Outfit-Bold' }]}>₹{item.price}/{item.unit}</Text>
              </View>
            </View>
          </AnimatedPressable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { paddingHorizontal: 16, gap: 14, paddingTop: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: 18 },
  sub: { fontSize: 12, marginTop: 2 },
  row: { gap: 10, paddingRight: 16 },
  card: { width: 140, borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  img: { width: '100%', height: 100 },
  seasonTag: { position: 'absolute', top: 8, left: 8, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  seasonText: { fontSize: 10, fontFamily: 'Outfit-SemiBold' },
  info: { padding: 10, gap: 3 },
  name: { fontSize: 13 },
  price: { fontSize: 14 },
});
