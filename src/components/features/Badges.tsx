import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface FreshnessProps { freshness?: 'morning' | 'yesterday' | 'fresh'; isHindi?: boolean; }

export const FreshnessBadge: React.FC<FreshnessProps> = ({ freshness = 'fresh', isHindi = false }) => {
  const label = freshness === 'morning'
    ? (isHindi ? '🌅 आज सुबह' : '🌅 This morning')
    : freshness === 'yesterday'
    ? (isHindi ? '📦 कल का' : '📦 Yesterday')
    : (isHindi ? '🌿 ताज़ा' : '🌿 Fresh');

  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};

export const WeightBadge: React.FC = () => (
  <View style={styles.wBadge}>
    <Text style={styles.wText}>⚖️ Weighed</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: { position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(45,138,78,0.85)', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  text: { color: '#fff', fontSize: 9, fontFamily: 'Outfit-SemiBold' },
  wBadge: { position: 'absolute', bottom: 8, left: 8, backgroundColor: 'rgba(45,138,78,0.85)', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6 },
  wText: { color: '#fff', fontSize: 9, fontFamily: 'Outfit-SemiBold' },
});
