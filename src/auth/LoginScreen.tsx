import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useOAuth, useSignIn } from '@clerk/clerk-expo';

/* ─────────────────────────────────────────────
   Design tokens
───────────────────────────────────────────── */
const PURPLE       = '#7311d4';
const PURPLE_LIGHT = '#9b42f5';
const PURPLE_GLOW  = 'rgba(115,17,212,0.25)';
const TEXT_PRIMARY = '#F1F0FF';
const TEXT_MUTED   = 'rgba(148,163,184,0.8)';
const BORDER_GLASS = 'rgba(255,255,255,0.10)';
const INPUT_BG     = 'rgba(15,23,42,0.95)';

/* ─────────────────────────────────────────────
   useLayout — tüm responsive değerleri tek yerde
───────────────────────────────────────────── */
function useLayout() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Breakpoints
  const isSmall  = height < 668;   // SE 1st gen, eski Androidler
  const isTablet = width  >= 768;

  // Viewport yüzde helpers
  const vw = (pct: number) => (width  * pct) / 100;
  const vh = (pct: number) => (height * pct) / 100;

  // Akıcı font ölçeği — 390 pt referans genişliğe göre, ±%18 clamp
  const fs = (base: number) => {
    const scaled = (base / 390) * width;
    return Math.min(Math.max(scaled, base * 0.78), base * 1.18);
  };

  // Crystal ball boyutu — küçük ekranda %36vw, tablette max 200
  const ballSize = isSmall
    ? vw(36)
    : isTablet
    ? Math.min(vw(22), 200)
    : vw(44);

  // Yatay padding — tablette daha geniş boşluk
  const hPad = isTablet ? vw(10) : vw(6.5);

  // Auth alanı max genişliği
  const authMaxWidth = isTablet ? 440 : width - hPad * 2;

  // Buton / input yükseklikleri
  const btnH   = isSmall ? 46 : 52;
  const inputH = isSmall ? 44 : 48;

  return {
    width, height, insets,
    isSmall, isTablet,
    vw, vh, fs,
    ballSize, hPad, authMaxWidth, btnH, inputH,
  };
}

/* ─────────────────────────────────────────────
   Alt bileşenler
───────────────────────────────────────────── */
function AppleIcon({ size }: { size: number }) {
  return (
    <Text style={{ color: TEXT_PRIMARY, fontSize: size, marginRight: 8 }}>
      {'\uF8FF'}{/* Apple sembolü — @expo/vector-icons yoksa bu satırı değiştir */}
    </Text>
  );
}

function GoogleG({ size }: { size: number }) {
  return (
    <Text style={{ fontSize: size, fontWeight: '700', marginRight: 8, color: '#4285F4' }}>
      G
    </Text>
  );
}

function OrDivider({ fontSize }: { fontSize: number }) {
  return (
    <View style={styles.dividerRow}>
      <View style={styles.dividerLine} />
      <Text style={[styles.dividerText, { fontSize }]}>OR</Text>
      <View style={styles.dividerLine} />
    </View>
  );
}

/* ─────────────────────────────────────────────
   LoginScreen
───────────────────────────────────────────── */
export function LoginScreen() {
  const navigation = useNavigation<any>();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const { signIn, setActive, isLoaded } = useSignIn();

  const [loading,      setLoading]      = useState(false);
  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);

  const {
    insets, isSmall, isTablet,
    vw, vh, fs,
    ballSize, hPad, authMaxWidth, btnH, inputH,
  } = useLayout();

  const innerGlowSize = ballSize * 0.38;

  /* ── Google OAuth ── */
  const onGooglePress = useCallback(async () => {
    try {
      setLoading(true);
      const { createdSessionId, setActive: activate } = await startOAuthFlow();
      if (createdSessionId && activate) await activate({ session: createdSessionId });
    } catch (err) {
      console.error('Google sign-in error', err);
    } finally {
      setLoading(false);
    }
  }, [startOAuthFlow]);

  /* ── Email / Password ── */
  const onEmailSignIn = useCallback(async () => {
    if (!isLoaded || !signIn) return;
    if (!email || !password) {
      Alert.alert('Missing details', 'Please enter your email and password.');
      return;
    }
    try {
      setLoading(true);
      const result = await signIn.create({ identifier: email, password });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
      } else {
        console.warn('Sign-in incomplete', JSON.stringify(result, null, 2));
      }
    } catch (err: any) {
      console.error('Email sign-in error', err);
      Alert.alert('Sign in failed', 'Check your email and password and try again.');
    } finally {
      setLoading(false);
    }
  }, [email, password, isLoaded, signIn, setActive]);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0F" />

      {/* Arka plan glow — scroll'un arkasında mutlak konumlu */}
      <View
        style={[
          styles.glowOuter,
          {
            width:        vw(72),
            height:       vw(72),
            borderRadius: vw(36),
            top:          vh(16),
            left:         vw(14),
          },
        ]}
      />
      <View
        style={[
          styles.glowInner,
          {
            width:        vw(38),
            height:       vw(38),
            borderRadius: vw(19),
            top:          vh(20),
            left:         vw(31),
          },
        ]}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop:        insets.top + (isSmall ? 12 : 24),
            paddingBottom:     insets.bottom + 24,
            paddingHorizontal: hPad,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* ── Köşe ikonları ── */}
        <View style={styles.headerIconsRow}>
          <Text style={[styles.headerIcon, { fontSize: fs(20) }]}>✦</Text>
          <Text style={[styles.headerIcon, { fontSize: fs(20) }]}>☾</Text>
        </View>

        {/* ── Hero ── */}
        <View style={[styles.hero, { marginVertical: isSmall ? vh(2) : vh(3) }]}>
          <View
            style={[
              styles.crystalBall,
              { width: ballSize, height: ballSize, borderRadius: ballSize / 2 },
            ]}
          >
            <View
              style={[
                styles.crystalInnerGlow,
                {
                  width:        innerGlowSize,
                  height:       innerGlowSize,
                  borderRadius: innerGlowSize / 2,
                },
              ]}
            />
          </View>

          <Text
            style={[
              styles.title,
              { fontSize: fs(isSmall ? 34 : 42), marginTop: isSmall ? 16 : 24 },
            ]}
          >
            Mystica
          </Text>
          <Text style={[styles.subtitle, { fontSize: fs(10) }]}>
            Discover the secrets of the universe
          </Text>
        </View>

        {/* ── Auth alanı ── */}
        <View
          style={[
            styles.authContainer,
            {
              maxWidth:        authMaxWidth,
              paddingHorizontal: isTablet ? 24 : 0,
            },
          ]}
        >
          {/* Apple */}
          <TouchableOpacity
            style={[styles.socialButton, { height: btnH }]}
            activeOpacity={0.8}
          >
            <AppleIcon size={fs(16)} />
            <Text style={[styles.socialButtonText, { fontSize: fs(14) }]}>
              Continue with Apple
            </Text>
          </TouchableOpacity>

          {/* Google */}
          <TouchableOpacity
            style={[styles.googleButton, { height: btnH }]}
            onPress={onGooglePress}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <>
                <GoogleG size={fs(15)} />
                <Text style={[styles.googleButtonText, { fontSize: fs(14) }]}>
                  Continue with Google
                </Text>
              </>
            )}
          </TouchableOpacity>

          <OrDivider fontSize={fs(11)} />

          {/* Email input */}
          <TextInput
            style={[
              styles.input,
              { height: inputH, fontSize: fs(14) },
              focusedField === 'email' && styles.inputFocused,
            ]}
            placeholder="Email"
            placeholderTextColor="rgba(148,163,184,0.6)"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
          />

          {/* Password input */}
          <TextInput
            style={[
              styles.input,
              { height: inputH, fontSize: fs(14) },
              focusedField === 'password' && styles.inputFocused,
            ]}
            placeholder="Password"
            placeholderTextColor="rgba(148,163,184,0.6)"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
          />

          {/* Forgot password */}
          <TouchableOpacity style={styles.forgotRow}>
            <Text style={[styles.forgotText, { fontSize: fs(12) }]}>
              Forgot password?
            </Text>
          </TouchableOpacity>

          {/* Sign In */}
          <TouchableOpacity
            style={[styles.emailButton, { height: btnH }]}
            onPress={onEmailSignIn}
            disabled={loading}
            activeOpacity={0.88}
          >
            {loading ? (
              <ActivityIndicator color={TEXT_PRIMARY} />
            ) : (
              <Text style={[styles.emailButtonText, { fontSize: fs(15) }]}>
                Sign In
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* ── Footer ── */}
        <View style={styles.footerRow}>
          <Text style={[styles.footerText, { fontSize: fs(13) }]}>
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={[styles.footerLink, { fontSize: fs(13) }]}> Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ─────────────────────────────────────────────
   Statik stiller — yalnızca renk & layout
   Boyuta bağlı her şey inline (useLayout)
───────────────────────────────────────────── */
const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },

  /* Glow katmanları */
  glowOuter: {
    position: 'absolute',
    backgroundColor: PURPLE_GLOW,
    opacity: 0.55,
  },
  glowInner: {
    position: 'absolute',
    backgroundColor: 'rgba(115,17,212,0.15)',
  },

  /* ScrollView içeriği */
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },

  /* Köşe ikonları */
  headerIconsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    zIndex: 1,
  },
  headerIcon: {
    color: 'rgba(115,17,212,0.75)',
  },

  /* Hero */
  hero: {
    alignItems: 'center',
    zIndex: 1,
  },
  crystalBall: {
    backgroundColor: '#12122A',
    borderWidth: 1,
    borderColor: BORDER_GLASS,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PURPLE,
    shadowOpacity: 0.7,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  crystalInnerGlow: {
    backgroundColor: 'rgba(115,17,212,0.28)',
    shadowColor: PURPLE_LIGHT,
    shadowOpacity: 0.9,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  title: {
    fontWeight: '700',
    color: TEXT_PRIMARY,
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 6,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    color: TEXT_MUTED,
    textAlign: 'center',
  },

  /* Auth container */
  authContainer: {
    width: '100%',
    alignSelf: 'center',
    zIndex: 1,
    marginTop: 8,
  },

  /* Social butonlar */
  socialButton: {
    borderRadius: 26,
    borderWidth: 1,
    borderColor: BORDER_GLASS,
    backgroundColor: 'rgba(255,255,255,0.06)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  socialButtonText: {
    color: TEXT_PRIMARY,
    fontWeight: '600',
  },
  googleButton: {
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  googleButtonText: {
    color: '#1A1A1A',
    fontWeight: '600',
  },

  /* Divider */
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(148,163,184,0.2)',
  },
  dividerText: {
    color: 'rgba(148,163,184,0.45)',
    letterSpacing: 1.5,
    marginHorizontal: 12,
  },

  /* Input */
  input: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.25)',
    paddingHorizontal: 16,
    color: TEXT_PRIMARY,
    marginBottom: 10,
    backgroundColor: INPUT_BG,
  },
  inputFocused: {
    borderColor: 'rgba(115,17,212,0.65)',
    borderWidth: 1.5,
  },

  /* Forgot */
  forgotRow: {
    alignSelf: 'flex-end',
    marginBottom: 14,
    marginTop: -2,
  },
  forgotText: {
    color: PURPLE_LIGHT,
    fontWeight: '500',
  },

  /* Sign In butonu */
  emailButton: {
    borderRadius: 26,
    backgroundColor: PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: PURPLE_LIGHT,
  },
  emailButtonText: {
    color: TEXT_PRIMARY,
    fontWeight: '700',
    letterSpacing: 0.4,
  },

  /* Footer */
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 4,
  },
  footerText: {
    color: 'rgba(148,163,184,0.7)',
  },
  footerLink: {
    color: PURPLE_LIGHT,
    fontWeight: '600',
  },
});