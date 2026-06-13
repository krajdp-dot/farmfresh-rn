import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface Props {
  onFinish: () => void;
}

const SplashScreen: React.FC<Props> = ({ onFinish }) => {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const leafRotate = useRef(new Animated.Value(0)).current;
  const taglineY = useRef(new Animated.Value(30)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const pill1Opacity = useRef(new Animated.Value(0)).current;
  const pill2Opacity = useRef(new Animated.Value(0)).current;
  const pill3Opacity = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;
  const bgScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      // Logo entrance
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, damping: 10, stiffness: 80, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(leafRotate, { toValue: 1, duration: 800, easing: Easing.out(Easing.back(2)), useNativeDriver: true }),
      ]),
      Animated.delay(100),
      // Tagline
      Animated.parallel([
        Animated.spring(taglineY, { toValue: 0, damping: 12, stiffness: 100, useNativeDriver: true }),
        Animated.timing(taglineOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      Animated.delay(100),
      // Pills stagger
      Animated.stagger(120, [
        Animated.timing(pill1Opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(pill2Opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(pill3Opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
      Animated.delay(900),
      // Exit
      Animated.parallel([
        Animated.timing(screenOpacity, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(bgScale, { toValue: 1.08, duration: 500, useNativeDriver: true }),
      ]),
    ]).start(() => onFinish());
  }, []);

  const leafSpin = leafRotate.interpolate({ inputRange: [0, 1], outputRange: ['-20deg', '0deg'] });

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity, transform: [{ scale: bgScale }] }]}>
      {/* Background gradient blobs */}
      <View style={styles.blobTopRight} />
      <View style={styles.blobBottomLeft} />
      <View style={styles.blobCenter} />

      {/* Grid pattern overlay */}
      <View style={styles.gridOverlay} />

      {/* Main content */}
      <View style={styles.center}>
        {/* Logo block */}
        <Animated.View style={[styles.logoWrap, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
          <View style={styles.logoIconOuter}>
            <View style={styles.logoIconInner}>
              <Animated.Text style={[styles.logoLeaf, { transform: [{ rotate: leafSpin }] }]}>🌿</Animated.Text>
            </View>
          </View>

          <Animated.View style={[styles.taglineWrap, { opacity: taglineOpacity, transform: [{ translateY: taglineY }] }]}>
            <Text style={styles.appName}>Farm Fresh</Text>
            <Text style={styles.appNameHi}>फ़ार्म फ्रेश</Text>
          </Animated.View>
        </Animated.View>

        {/* Tagline */}
        <Animated.View style={[styles.subTagWrap, { opacity: taglineOpacity, transform: [{ translateY: taglineY }] }]}>
          <Text style={styles.subTag}>मंडी से आपके दरवाज़े तक</Text>
          <Text style={styles.subTagEn}>From Bhagalpur Mandi to your door</Text>
        </Animated.View>

        {/* Feature pills */}
        <View style={styles.pillsRow}>
          <Animated.View style={[styles.pill, { opacity: pill1Opacity }]}>
            <Text style={styles.pillText}>🌿 Fresh Daily</Text>
          </Animated.View>
          <Animated.View style={[styles.pill, { opacity: pill2Opacity }]}>
            <Text style={styles.pillText}>📊 Mandi Price</Text>
          </Animated.View>
          <Animated.View style={[styles.pill, { opacity: pill3Opacity }]}>
            <Text style={styles.pillText}>🚀 Fast Delivery</Text>
          </Animated.View>
        </View>
      </View>

      {/* Bottom */}
      <View style={styles.bottom}>
        <View style={styles.loadingBar}>
          <Animated.View style={[styles.loadingFill, { width: '70%' }]} />
        </View>
        <Text style={styles.bottomText}>Bhagalpur's freshest 🌾</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D2A18',
  },
  blobTopRight: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#1A6B38',
    top: -80,
    right: -80,
    opacity: 0.6,
  },
  blobBottomLeft: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#2D8A4E',
    bottom: -60,
    left: -60,
    opacity: 0.4,
  },
  blobCenter: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#80EF80',
    top: height * 0.35,
    right: -40,
    opacity: 0.08,
  },
  gridOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    opacity: 0.03,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
    paddingHorizontal: 32,
  },
  logoWrap: {
    alignItems: 'center',
    gap: 20,
  },
  logoIconOuter: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: 'rgba(128,239,128,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(128,239,128,0.2)',
  },
  logoIconInner: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: '#2D8A4E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#80EF80',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  logoLeaf: { fontSize: 38 },
  taglineWrap: { alignItems: 'center', gap: 4 },
  appName: {
    fontSize: 36,
    color: '#FFFFFF',
    fontFamily: 'Outfit-ExtraBold',
    letterSpacing: -0.5,
  },
  appNameHi: {
    fontSize: 18,
    color: 'rgba(128,239,128,0.8)',
    fontFamily: 'Baloo2-Medium',
  },
  subTagWrap: { alignItems: 'center', gap: 4 },
  subTag: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'Baloo2-Regular',
    textAlign: 'center',
  },
  subTagEn: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    fontFamily: 'Outfit-Regular',
    textAlign: 'center',
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  pill: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
  },
  pillText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    fontFamily: 'Outfit-Medium',
  },
  bottom: {
    paddingHorizontal: 40,
    paddingBottom: 52,
    alignItems: 'center',
    gap: 12,
  },
  loadingBar: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 999,
    overflow: 'hidden',
  },
  loadingFill: {
    height: '100%',
    backgroundColor: '#80EF80',
    borderRadius: 999,
  },
  bottomText: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 12,
    fontFamily: 'Outfit-Regular',
  },
});

export default SplashScreen;
