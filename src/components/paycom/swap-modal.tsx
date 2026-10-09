/**
 * PayCom - Swap Modal
 * Full-screen modal for selecting alternative components
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Modal, Image, Platform } from 'react-native';
import { PayComColors } from '@/constants/theme';
import { formatRupiah, PCComponent } from '@/constants/data';
import { useBuild } from '@/hooks/use-build';

export function SwapModal() {
  const {
    showSwapModal,
    swapCategory,
    swapOptions,
    closeSwapModal,
    swapComponent,
    selectCase,
    components,
  } = useBuild();

  if (!showSwapModal) return null;

  const currentComponent = components.find(c => c.category === swapCategory);

  const handleSelect = (option: PCComponent) => {
    if (swapCategory === 'Chassis Case') {
      selectCase(option);
    } else if (currentComponent) {
      swapComponent(currentComponent.id, option);
    }
    closeSwapModal();
  };

  // Use a full-screen overlay approach that works on both web and native
  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        {/* Modal Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerLabel}>PILIH KOMPONEN</Text>
            <Text style={styles.headerTitle}>{swapCategory || 'Komponen'}</Text>
          </View>
          <Pressable style={styles.closeBtn} onPress={closeSwapModal}>
            <Text style={styles.closeBtnText}>✕</Text>
          </Pressable>
        </View>

        {/* Options List */}
        <ScrollView style={styles.optionsList} contentContainerStyle={styles.optionsContent}>
          {swapOptions.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📦</Text>
              <Text style={styles.emptyTitle}>Belum Ada Opsi Tersedia</Text>
              <Text style={styles.emptyDesc}>
                Komponen alternatif untuk kategori ini sedang disiapkan.
              </Text>
            </View>
          ) : (
            swapOptions.map(option => (
              <Pressable
                key={option.id}
                style={styles.optionCard}
                onPress={() => handleSelect(option)}
              >
                <View style={styles.optionContent}>
                  {option.image && (
                    <View style={styles.optionImageBox}>
                      <Image
                        source={{ uri: option.image }}
                        style={styles.optionImage}
                        resizeMode="contain"
                      />
                    </View>
                  )}
                  <View style={styles.optionInfo}>
                    <View style={styles.optionTags}>
                      {option.tags.map((tag, i) => (
                        <View key={i} style={styles.optionTag}>
                          <Text style={styles.optionTagText}>{tag}</Text>
                        </View>
                      ))}
                      <View style={[styles.optionTag, styles.compatibleTag]}>
                        <Text style={styles.compatibleTagText}>✓ Kompatibel</Text>
                      </View>
                    </View>
                    <Text style={styles.optionName}>{option.name}</Text>
                    <Text style={styles.optionSpecs}>{option.specs}</Text>
                  </View>
                </View>
                <View style={styles.optionAction}>
                  <Text style={styles.optionPrice}>{formatRupiah(option.price)}</Text>
                  <View style={styles.selectBtn}>
                    <Text style={styles.selectBtnText}>Pilih</Text>
                  </View>
                </View>
              </Pressable>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...(Platform.OS === 'web'
      ? { position: 'fixed' as any, top: 0, left: 0, right: 0, bottom: 0, zIndex: 100 }
      : { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100 }),
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modal: {
    width: '100%',
    maxWidth: 640,
    maxHeight: '80%',
    flexShrink: 1,
    backgroundColor: PayComColors.surfaceContainerLow,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,240,255,0.2)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: PayComColors.outlineVariant,
  },
  headerLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: PayComColors.primaryContainer,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: PayComColors.onSurface,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: PayComColors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 18,
    color: PayComColors.onSurfaceVariant,
    fontWeight: '600',
  },
  optionsList: {
    flexShrink: 1,
  },
  optionsContent: {
    padding: 12,
    gap: 10,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: PayComColors.onSurface,
  },
  emptyDesc: {
    fontSize: 13,
    color: PayComColors.onSurfaceVariant,
    textAlign: 'center',
  },
  optionCard: {
    backgroundColor: PayComColors.surfaceContainer,
    borderRadius: 12,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionContent: {
    flexDirection: 'row',
    gap: 12,
  },
  optionImageBox: {
    width: 52,
    height: 52,
    borderRadius: 8,
    backgroundColor: PayComColors.surfaceContainerLowest,
    overflow: 'hidden',
    flexShrink: 0,
  },
  optionImage: {
    width: '100%',
    height: '100%',
  },
  optionInfo: {
    flex: 1,
  },
  optionTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 4,
  },
  optionTag: {
    backgroundColor: PayComColors.surfaceContainerHigh,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  optionTagText: {
    fontSize: 10,
    fontWeight: '500',
    color: PayComColors.onSurface,
  },
  compatibleTag: {
    backgroundColor: 'rgba(0,240,255,0.15)',
  },
  compatibleTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: PayComColors.primaryContainer,
  },
  optionName: {
    fontSize: 14,
    fontWeight: '600',
    color: PayComColors.onSurface,
    lineHeight: 20,
  },
  optionSpecs: {
    fontSize: 11,
    color: PayComColors.onSurfaceVariant,
    marginTop: 2,
  },
  optionAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(59,73,75,0.3)',
  },
  optionPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: PayComColors.primaryContainer,
  },
  selectBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: PayComColors.primaryContainer,
  },
  selectBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: PayComColors.onPrimaryContainer,
  },
});
