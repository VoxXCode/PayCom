/**
 * PayCom - Component Card
 * Individual hardware component display card with actions
 */

import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { PayComColors } from '@/constants/theme';
import { PCComponent, formatRupiah } from '@/constants/data';
import { useBuild } from '@/hooks/use-build';
import { useResponsive } from '@/hooks/use-responsive';

interface ComponentCardProps {
  component: PCComponent;
}

export function ComponentCard({ component }: ComponentCardProps) {
  const { removeComponent, openSwapModal } = useBuild();
  const { isMobile } = useResponsive();
  const [pressed, setPressed] = useState(false);

  const isConflict = component.status === 'conflict' || component.status === 'incompatible';
  const isEmpty = component.status === 'empty';

  if (isEmpty) {
    return <EmptySlotCard component={component} />;
  }

  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[styles.card, pressed && styles.cardPressed]}
    >
      <View style={[styles.cardInner, isMobile && styles.cardInnerMobile]}>
        {/* Left: Image + Info */}
        <View style={styles.infoSection}>
          {component.image && (
            <View style={styles.imageBox}>
              <Image
                source={{ uri: component.image }}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
          )}
          <View style={styles.textSection}>
            {/* Tags row */}
            <View style={styles.tagsRow}>
              <Text style={styles.slotLabel}>{component.slotLabel}</Text>
              {isConflict && (
                <View style={[styles.tag, styles.tagError]}>
                  <Text style={styles.tagErrorText}>{component.conflictMessage}</Text>
                </View>
              )}
              {!isConflict && (
                <View style={[styles.tag, styles.tagSuccess]}>
                  <Text style={styles.tagSuccessText}>Kompatibel</Text>
                </View>
              )}
              {component.tags.map((tag, i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.componentName} numberOfLines={2}>{component.name}</Text>
            <Text
              style={[styles.specs, isConflict && styles.specsError]}
              numberOfLines={2}
            >
              {component.specs}
            </Text>
          </View>
        </View>

        {/* Right: Price + Actions */}
        <View style={[styles.actionSection, isMobile && styles.actionSectionMobile]}>
          <Text style={styles.price}>{formatRupiah(component.price)}</Text>
          <View style={styles.actionButtons}>
            {isConflict && component.category === 'Motherboard' ? (
              <Pressable
                style={styles.btnSwapAM5}
                onPress={() => openSwapModal('Motherboard')}
              >
                <Text style={styles.btnSwapAM5Text}>Tukar ke AM5</Text>
              </Pressable>
            ) : (
              <Pressable
                style={styles.btnSwap}
                onPress={() => openSwapModal(component.category)}
              >
                <Text style={styles.btnSwapText}>Ganti</Text>
              </Pressable>
            )}
            <Pressable
              style={styles.btnRemove}
              onPress={() => removeComponent(component.id)}
            >
              <Text style={styles.btnRemoveText}>Hapus</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function EmptySlotCard({ component }: ComponentCardProps) {
  const { openSwapModal } = useBuild();
  const { isMobile } = useResponsive();

  return (
    <View style={styles.emptyCard}>
      <View style={[styles.emptyInner, isMobile && styles.emptyInnerMobile]}>
        <View style={styles.emptyLeftSection}>
          <View style={styles.emptyIconBox}>
            <Text style={styles.emptyIcon}>🖥️</Text>
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.emptySlotLabel}>{component.slotLabel}</Text>
            <Text style={styles.emptyTitle}>Belum Ada {component.category} Terpilih</Text>
            <Text style={styles.emptyDesc}>{component.specs}</Text>
          </View>
        </View>
        <Pressable
          style={styles.btnSelect}
          onPress={() => openSwapModal(component.category)}
        >
          <Text style={styles.btnSelectIcon}>＋</Text>
          <Text style={styles.btnSelectText}>Pilih {component.category}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(24,28,34,0.95)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cardPressed: {
    backgroundColor: 'rgba(38,42,49,0.95)',
    borderColor: 'rgba(0,240,255,0.2)',
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  cardInnerMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  imageBox: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: PayComColors.surfaceContainerLowest,
    overflow: 'hidden',
    flexShrink: 0,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textSection: {
    flex: 1,
    minWidth: 0,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 4,
    alignItems: 'center',
  },
  slotLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: PayComColors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tag: {
    backgroundColor: PayComColors.surfaceContainerHigh,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '500',
    color: PayComColors.onSurface,
  },
  tagError: {
    backgroundColor: 'rgba(147,0,10,0.3)',
  },
  tagErrorText: {
    fontSize: 10,
    fontWeight: '600',
    color: PayComColors.error,
  },
  tagSuccess: {},
  tagSuccessText: {
    fontSize: 10,
    fontWeight: '600',
    color: PayComColors.primaryContainer,
  },
  componentName: {
    fontSize: 16,
    fontWeight: '600',
    color: PayComColors.onSurface,
    lineHeight: 22,
  },
  specs: {
    fontSize: 12,
    color: PayComColors.onSurfaceVariant,
    marginTop: 2,
    lineHeight: 17,
  },
  specsError: {
    color: PayComColors.error,
  },
  actionSection: {
    alignItems: 'flex-end',
    gap: 8,
    flexShrink: 0,
  },
  actionSectionMobile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(59,73,75,0.3)',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: PayComColors.primaryContainer,
    letterSpacing: -0.5,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  btnSwap: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: PayComColors.surfaceContainer,
  },
  btnSwapText: {
    fontSize: 13,
    fontWeight: '600',
    color: PayComColors.onSurface,
  },
  btnSwapAM5: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: PayComColors.primaryContainer,
  },
  btnSwapAM5Text: {
    fontSize: 13,
    fontWeight: '600',
    color: PayComColors.onPrimaryContainer,
  },
  btnRemove: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: PayComColors.surfaceContainer,
  },
  btnRemoveText: {
    fontSize: 13,
    fontWeight: '600',
    color: PayComColors.error,
  },
  // Empty slot
  emptyCard: {
    backgroundColor: 'rgba(10,14,20,0.6)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,240,255,0.15)',
    borderStyle: 'dashed',
  },
  emptyInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  emptyInnerMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 12,
  },
  emptyLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  emptyIconBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: PayComColors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: 28,
  },
  emptySlotLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: PayComColors.primaryContainer,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: PayComColors.onSurface,
  },
  emptyDesc: {
    fontSize: 12,
    color: PayComColors.onSurfaceVariant,
    marginTop: 2,
    lineHeight: 17,
  },
  btnSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: PayComColors.primaryContainer,
  },
  btnSelectIcon: {
    fontSize: 16,
    fontWeight: '700',
    color: PayComColors.onPrimaryContainer,
  },
  btnSelectText: {
    fontSize: 14,
    fontWeight: '600',
    color: PayComColors.onPrimaryContainer,
    letterSpacing: 0.3,
  },
});
