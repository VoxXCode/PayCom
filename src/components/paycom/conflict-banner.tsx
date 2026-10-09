/**
 * PayCom - Conflict Alert Banner
 * Shows hardware compatibility warnings at the top of the builder
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { PayComColors } from '@/constants/theme';
import { useBuild } from '@/hooks/use-build';
import { useResponsive } from '@/hooks/use-responsive';

export function ConflictBanner() {
  const { components, resolveConflictAM5 } = useBuild();
  const { isMobile } = useResponsive();

  const hasConflict = components.some(
    c => c.status === 'conflict' || c.status === 'incompatible'
  );

  if (!hasConflict) return null;

  return (
    <View style={styles.container}>
      <View style={styles.contentRow}>
        <View style={styles.iconBox}>
          <Text style={styles.icon}>🛡️</Text>
        </View>
        <View style={styles.textSection}>
          <View style={styles.titleRow}>
            <View style={styles.pulsingDot} />
            <Text style={styles.alertLabel}>HARDWARE CONFLICT DETECTED</Text>
          </View>
          <Text style={styles.alertTitle}>
            Ketidakcocokan Komponen: CPU Socket AM5 tidak cocok dengan Motherboard LGA1700
          </Text>
          <Text style={styles.alertDesc}>
            Sistem tidak dapat dirakit karena perbedaan pin fisik soket prosesor AMD dan motherboard Intel.
          </Text>
        </View>
      </View>
      <View style={[styles.actions, isMobile && styles.actionsMobile]}>
        <Pressable style={styles.btnSecondary} onPress={resolveConflictAM5}>
          <Text style={styles.btnSecondaryText}>Ganti Prosesor LGA1700</Text>
        </Pressable>
        <Pressable style={styles.btnPrimary} onPress={resolveConflictAM5}>
          <Text style={styles.btnPrimaryText}>Rekomendasikan Solusi AM5</Text>
          <Text style={styles.btnPrimaryIcon}>✨</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(42,8,16,0.95)',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,51,102,0.2)',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: PayComColors.errorContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
  },
  textSection: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  pulsingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: PayComColors.error,
  },
  alertLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: PayComColors.error,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: PayComColors.onSurface,
    lineHeight: 20,
  },
  alertDesc: {
    fontSize: 12,
    color: PayComColors.onSurfaceVariant,
    marginTop: 4,
    lineHeight: 17,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
  actionsMobile: {
    flexDirection: 'column',
  },
  btnSecondary: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: PayComColors.surfaceContainerHigh,
    alignItems: 'center',
  },
  btnSecondaryText: {
    fontSize: 13,
    fontWeight: '600',
    color: PayComColors.primaryContainer,
  },
  btnPrimary: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: PayComColors.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  btnPrimaryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  btnPrimaryIcon: {
    fontSize: 14,
  },
});
