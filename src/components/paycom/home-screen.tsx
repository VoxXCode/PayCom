/**
 * PayCom - Home Screen
 * Custom landing page for the user to configure themselves
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { PayComColors } from '@/constants/theme';
import { useBuild } from '@/hooks/use-build';

export function HomeScreen() {
  const { setActiveTab } = useBuild();

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <View style={styles.heroSection}>
        <View style={styles.iconBox}>
          <Text style={styles.heroIcon}>⬡</Text>
        </View>
        <Text style={styles.heroTitle}>Selamat Datang di PayCom</Text>
        <Text style={styles.heroDesc}>
          Ini adalah halaman Home kustom Anda. Anda dapat mendesain atau 
          menambahkan konten apa pun di sini sesuai kebutuhan Anda.
        </Text>

        <Pressable 
          style={styles.ctaButton} 
          onPress={() => setActiveTab('builder')}
        >
          <Text style={styles.ctaButtonText}>Mulai Rakit PC Sekarang</Text>
          <Text style={styles.ctaButtonIcon}>🚀</Text>
        </Pressable>
      </View>

      <View style={styles.grid}>
        <View style={styles.card}>
          <Text style={styles.cardIcon}>🛠️</Text>
          <Text style={styles.cardTitle}>Customisasi Penuh</Text>
          <Text style={styles.cardDesc}>
            Ubah halaman ini menjadi dashboard promo, banner diskon, atau pengumuman fitur baru.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardIcon}>💻</Text>
          <Text style={styles.cardTitle}>Rig Configurator</Text>
          <Text style={styles.cardDesc}>
            Mesin perakitan cerdas dengan deteksi kompatibilitas otomatis dan harga real-time.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  container: {
    padding: 24,
    gap: 32,
    alignItems: 'center',
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    maxWidth: 600,
    marginTop: 32,
    gap: 16,
  },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: PayComColors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'rgba(0,240,255,0.4)',
    shadowColor: PayComColors.primaryContainer,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  heroIcon: {
    fontSize: 40,
    color: PayComColors.primaryContainer,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: PayComColors.onSurface,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  heroDesc: {
    fontSize: 16,
    color: PayComColors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 24,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: PayComColors.primaryContainer,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 16,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: PayComColors.onPrimaryContainer,
  },
  ctaButtonIcon: {
    fontSize: 18,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    maxWidth: 800,
    width: '100%',
  },
  card: {
    flex: 1,
    minWidth: 280,
    backgroundColor: PayComColors.surfaceContainerLow,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: PayComColors.outlineVariant,
    gap: 12,
  },
  cardIcon: {
    fontSize: 32,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: PayComColors.onSurface,
  },
  cardDesc: {
    fontSize: 14,
    color: PayComColors.onSurfaceVariant,
    lineHeight: 22,
  },
});
