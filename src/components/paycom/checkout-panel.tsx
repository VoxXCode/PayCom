/**
 * PayCom - Checkout Summary Panel
 * Right column with pricing breakdown and CTA buttons
 */

import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert, Platform } from 'react-native';
import { PayComColors } from '@/constants/theme';
import { formatRupiah } from '@/constants/data';
import { useBuild } from '@/hooks/use-build';

export function CheckoutPanel() {
  const { totals, components, saveBuild } = useBuild();
  const [savedMessage, setSavedMessage] = useState('');

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      setSavedMessage(message);
      setTimeout(() => setSavedMessage(''), 3000);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleShare = () => {
    if (Platform.OS === 'web') {
      navigator.clipboard.writeText('https://paycom.store/builds/shared-rig');
      showAlert('📤 Share', 'Link spesifikasi disalin ke clipboard!');
    } else {
      showAlert('📤 Share', 'Fitur bagikan segera hadir di mobile!');
    }
  };

  const handleExport = () => {
    if (Platform.OS === 'web') {
      window.print();
    } else {
      showAlert('📄 Export', 'Fitur export PDF belum tersedia di mobile.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.titleRow}>
            <View style={styles.pulseDot} />
            <Text style={styles.titleLabel}>LIVE BILLING ENGINE</Text>
          </View>
          <Text style={styles.title}>RINGKASAN ESTIMASI</Text>
        </View>
        <View style={styles.timeBadge}>
          <Text style={styles.timeText}>WIB {new Date().toLocaleTimeString('id-ID')}</Text>
        </View>
      </View>

      {/* Compatibility Warning */}
      {totals.hasConflict && (
        <View style={styles.warningBox}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <View style={styles.warningText}>
            <Text style={styles.warningTitle}>Peringatan Perakitan</Text>
            <Text style={styles.warningDesc}>
              Selesaikan 1 isu kecocokan sebelum melanjutkan pembayaran.
            </Text>
          </View>
        </View>
      )}

      {/* Breakdown */}
      <View style={styles.breakdown}>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Total Komponen ({totals.itemCount} Item)</Text>
          <Text style={styles.breakdownValue}>{formatRupiah(totals.componentTotal)}</Text>
        </View>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Jasa Rakit & Pro Cable Routing</Text>
          <Text style={styles.breakdownValue}>{formatRupiah(totals.assemblyFee)}</Text>
        </View>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Stress Test & Win 11 Pro</Text>
          <Text style={styles.breakdownValueFree}>Rp 0 (GRATIS)</Text>
        </View>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Proteksi Pengiriman & Packing Kayu</Text>
          <Text style={styles.breakdownValue}>{formatRupiah(totals.shippingProtection)}</Text>
        </View>
        <View style={styles.breakdownRow}>
          <Text style={[styles.breakdownLabel, styles.discountLabel]}>Diskon Promo Cyber Week</Text>
          <Text style={styles.discountValue}>{formatRupiah(totals.promoDiscount)}</Text>
        </View>
      </View>

      {/* Grand Total */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>TOTAL HARGA RAKITAN</Text>
        <Text style={styles.totalValue}>{formatRupiah(totals.grandTotal)}</Text>
        <View style={styles.installmentRow}>
          <Text style={styles.installmentIcon}>💳</Text>
          <Text style={styles.installmentText}>
            Cicilan mulai dari <Text style={styles.installmentBold}>{formatRupiah(totals.installment)}</Text> / bulan
          </Text>
        </View>
      </View>

      {/* CTA Button */}
      <Pressable
        style={[styles.ctaButton, totals.hasConflict && styles.ctaDisabled]}
        onPress={() => {
          if (totals.hasConflict) {
            showAlert('⚠️ Konflik', 'Selesaikan konflik komponen terlebih dahulu!');
          } else {
            showAlert('🛒 Checkout', 'Pesanan berhasil dibuat! Tim PayCom akan memproses rakitan Anda.');
          }
        }}
      >
        <Text style={styles.ctaText}>Beli Paket Rakitan</Text>
        <Text style={styles.ctaIcon}>🛒</Text>
      </Pressable>

      {/* Feedback message */}
      {savedMessage !== '' && (
        <View style={styles.feedbackBox}>
          <Text style={styles.feedbackText}>{savedMessage}</Text>
        </View>
      )}

      {/* Secondary Actions */}
      <View style={styles.secondaryActions}>
        <Pressable
          style={styles.secondaryBtn}
          onPress={() => {
            saveBuild();
            if (Platform.OS === 'web') {
              showAlert('✅ Tersimpan', 'Build ditambahkan ke profil Anda!');
            }
          }}
        >
          <Text style={styles.secondaryBtnIcon}>🔖</Text>
          <Text style={styles.secondaryBtnText}>Simpan ke Profil</Text>
        </Pressable>
        <Pressable
          style={styles.secondaryBtn}
          onPress={handleShare}
        >
          <Text style={styles.secondaryBtnIcon}>📤</Text>
          <Text style={styles.secondaryBtnText}>Bagikan Spesifikasi</Text>
        </Pressable>
        <Pressable
          style={styles.secondaryBtn}
          onPress={handleExport}
        >
          <Text style={styles.secondaryBtnIcon}>📄</Text>
          <Text style={styles.secondaryBtnText}>Export PDF / Bill of Materials</Text>
        </Pressable>
      </View>

      {/* Guarantee */}
      <View style={styles.guaranteeBox}>
        <Text style={styles.guaranteeIcon}>✅</Text>
        <View style={styles.guaranteeText}>
          <Text style={styles.guaranteeTitle}>Garansi Resmi 3 Tahun PayCom</Text>
          <Text style={styles.guaranteeDesc}>Ganti baru 30 hari pertama & teknisi on-site.</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(24,28,34,0.95)',
    borderRadius: 12,
    padding: 16,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: PayComColors.primaryContainer,
  },
  titleLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: PayComColors.primaryContainer,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: PayComColors.onSurface,
    marginTop: 2,
  },
  timeBadge: {
    backgroundColor: PayComColors.surfaceContainerHigh,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  timeText: {
    fontSize: 10,
    fontWeight: '500',
    color: PayComColors.onSurfaceVariant,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(147,0,10,0.4)',
  },
  warningIcon: {
    fontSize: 16,
    marginTop: 1,
  },
  warningText: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: PayComColors.error,
  },
  warningDesc: {
    fontSize: 11,
    color: PayComColors.onSurfaceVariant,
    marginTop: 2,
  },
  breakdown: {
    gap: 6,
    paddingTop: 4,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 4,
  },
  breakdownLabel: {
    fontSize: 12,
    color: PayComColors.onSurfaceVariant,
    flex: 1,
  },
  breakdownValue: {
    fontSize: 12,
    color: PayComColors.onSurface,
    fontWeight: '500',
  },
  breakdownValueFree: {
    fontSize: 12,
    color: PayComColors.primaryContainer,
    fontWeight: '600',
  },
  discountLabel: {
    color: PayComColors.primaryContainer,
  },
  discountValue: {
    fontSize: 12,
    color: PayComColors.primaryContainer,
    fontWeight: '600',
  },
  totalCard: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: PayComColors.surfaceContainerLowest,
    gap: 4,
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: PayComColors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: PayComColors.primaryContainer,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0,240,255,0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  installmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(59,73,75,0.3)',
  },
  installmentIcon: {
    fontSize: 12,
  },
  installmentText: {
    fontSize: 11,
    color: PayComColors.onSurfaceVariant,
  },
  installmentBold: {
    fontWeight: '700',
    color: PayComColors.onSurface,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: PayComColors.primaryContainer,
  },
  ctaDisabled: {
    opacity: 0.7,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    color: PayComColors.onPrimaryContainer,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ctaIcon: {
    fontSize: 18,
  },
  feedbackBox: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(0,240,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0,240,255,0.3)',
  },
  feedbackText: {
    fontSize: 12,
    color: PayComColors.primaryContainer,
    textAlign: 'center',
    fontWeight: '500',
  },
  secondaryActions: {
    gap: 6,
    paddingTop: 4,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: PayComColors.surfaceContainer,
  },
  secondaryBtnIcon: {
    fontSize: 14,
  },
  secondaryBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: PayComColors.onSurface,
  },
  guaranteeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(10,14,20,0.8)',
  },
  guaranteeIcon: {
    fontSize: 20,
  },
  guaranteeText: {
    flex: 1,
  },
  guaranteeTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: PayComColors.onSurface,
  },
  guaranteeDesc: {
    fontSize: 11,
    color: PayComColors.onSurfaceVariant,
    marginTop: 1,
  },
});
