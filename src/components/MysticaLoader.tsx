// components/MysticaLoader.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, StyleSheet } from 'react-native';

export function MysticaLoader() {
  const pulse = useRef(new Animated.Value(0)).current;
  const spin1 = useRef(new Animated.Value(0)).current;
  const spin2 = useRef(new Animated.Value(0)).current;
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Crystal pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();

    // Ring spin 1
    Animated.loop(
      Animated.timing(spin1, { toValue: 1, duration: 1800, easing: Easing.linear, useNativeDriver: true })
    ).start();

    // Ring spin 2 (reverse, slower)
    Animated.loop(
      Animated.timing(spin2, { toValue: 1, duration: 2800, easing: Easing.linear, useNativeDriver: true })
    ).start();

    // Dots
    const makeDot = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: 1, duration: 400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.delay(600),
        ])
      );

    Animated.parallel([
      makeDot(dot1, 0),
      makeDot(dot2, 200),
      makeDot(dot3, 400),
    ]).start();
  }, []);

  const rotate1 = spin1.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const rotate2 = spin2.interpolate({ inputRange: [0, 1], outputRange: ['360deg', '0deg'] });

  const glowScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });
  const glowOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.85] });

  const makeDotStyle = (anim: Animated.Value) => ({
    opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
    transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.4] }) }],
  });

  return (
    <View style={styles.root}>
      {/* Crystal ball */}
      <View style={styles.crystalWrap}>
        {/* Glow ring 1 */}
        <Animated.View style={[styles.ring, { transform: [{ rotate: rotate1 }] }]} />
        {/* Glow ring 2 */}
        <Animated.View style={[styles.ring, styles.ring2, { transform: [{ rotate: rotate2 }] }]} />

        {/* Crystal body */}
        <Animated.View style={[
          styles.crystal,
          { transform: [{ scale: glowScale }] },
        ]}>
          {/* Inner swirl shimmer */}
          <Animated.View style={[styles.swirl, { opacity: glowOpacity }]} />
          {/* Specular highlight */}
          <View style={styles.highlight} />
        </Animated.View>

        {/* Orbiting stars */}
        {[0, 120, 240].map((deg, i) => (
          <Animated.View
            key={i}
            style={[
              styles.star,
              {
                transform: [
                  { rotate: spin1.interpolate({ inputRange: [0, 1], outputRange: [`${deg}deg`, `${deg + 360}deg`] }) },
                  { translateX: 48 },
                ],
              },
            ]}
          />
        ))}
      </View>

      {/* Dots */}
      <View style={styles.dotsRow}>
        <Animated.View style={[styles.dot, makeDotStyle(dot1)]} />
        <Animated.View style={[styles.dot, makeDotStyle(dot2)]} />
        <Animated.View style={[styles.dot, makeDotStyle(dot3)]} />
      </View>

      {/* Text */}
      <Text style={styles.text}>KEŞFEDİLİYOR</Text>
    </View>
  );
}

const CRYSTAL = 88;
const RING_OFFSET = 10;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0A0A0F',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
  },
  crystalWrap: {
    width: CRYSTAL + RING_OFFSET * 4,
    height: CRYSTAL + RING_OFFSET * 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crystal: {
    width: CRYSTAL,
    height: CRYSTAL,
    borderRadius: CRYSTAL / 2,
    backgroundColor: '#0E0E1C',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#7311d4',
    shadowOpacity: 0.7,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swirl: {
    position: 'absolute',
    inset: 0,
    borderRadius: CRYSTAL / 2,
    backgroundColor: 'rgba(115,17,212,0.35)',
  },
  highlight: {
    position: 'absolute',
    top: 12,
    left: 16,
    width: 20,
    height: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.07)',
    transform: [{ rotate: '-30deg' }],
  },
  ring: {
    position: 'absolute',
    width: CRYSTAL + RING_OFFSET * 2,
    height: CRYSTAL + RING_OFFSET * 2,
    borderRadius: (CRYSTAL + RING_OFFSET * 2) / 2,
    borderWidth: 1,
    borderColor: 'transparent',
    borderTopColor: 'rgba(115,17,212,0.8)',
    borderRightColor: 'rgba(115,17,212,0.2)',
  },
  ring2: {
    width: CRYSTAL + RING_OFFSET * 3.5,
    height: CRYSTAL + RING_OFFSET * 3.5,
    borderRadius: (CRYSTAL + RING_OFFSET * 3.5) / 2,
    borderTopColor: 'rgba(180,100,255,0.5)',
    borderRightColor: 'transparent',
  },
  star: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(190,130,255,0.95)',
    shadowColor: '#b478ff',
    shadowOpacity: 0.9,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#7311d4',
  },
  text: {
    color: 'rgba(148,163,184,0.7)',
    fontSize: 11,
    letterSpacing: 3,
    fontWeight: '500',
  },
});  