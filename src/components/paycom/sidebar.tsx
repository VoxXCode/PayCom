/**
 * PayCom - Sidebar Component Navigation
 * Left column with hardware slot list & presets
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { PayComColors } from '@/constants/theme';
import { useBuild } from '@/hooks/use-build';
import { PRESETS } from '@/constants/data';

const SLOT_ICONS: Record<string, string> = {
  Processor: '🔲',
  Motherboard: '📟',
  RAM: '📊',
  'Kartu Grafis': '🎮',
  Storage: '💾',
  'Power Supply': '🔌',
  'CPU Cooler': '❄️',
  'Chassis Case': '🖥️',
};

export function Sidebar() {
  const { components, selectedSlot, selectSlot, applyPreset } = useBuild();

  const selectedCount = components.filter(c => c.status !== 'empty').length;
  const totalSlots = components.length;
  const progressPercent = (selectedCount / totalSlots) * 100;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.label}>Hardware Slots</Text>
          <Text style={styles.title}>KOMPONEN SISTEM</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{selectedCount}/{totalSlots} Dipilih</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
      </View>

      {/* Component List */}
      <View style={styles.navList}>
        {components.map(component => {
          const isActive = selectedSlot === component.slot;
          const isConflict = component.status === 'conflict' || component.status === 'incompatible';
          const isEmpty = component.status === 'empty';
          const isOk = component.status === 'compatible';

          return (
            <Pressable
              key={component.id}
              style={[
                styles.navItem,
                isConflict && styles.navItemError,
                isEmpty && styles.navItemEmpty,
                isActive && styles.navItemActive,
              ]}
              onPress={() => selectSlot(component.slot)}
            >
              <View style={styles.navItemLeft}>
                <View style={[
                  styles.iconBox,
                  isConflict && styles.iconBoxError,
                  isEmpty && styles.iconBoxEmpty,
                ]}>
                  <Text style={styles.iconText}>
                    {SLOT_ICONS[component.category] || '📦'}
                  </Text>
                </View>
                <View style={styles.navItemTextSection}>
                  <Text style={[
                    styles.navItemCategory,
                    isConflict && styles.navItemCategoryError,
                    isEmpty && styles.navItemCategoryEmpty,
                  ]}>
                    {component.category}
                  </Text>
                  <Text style={[
                    styles.navItemName,
                    isEmpty && styles.navItemNameEmpty,
                  ]} numberOfLines={1}>
                    {component.status === 'empty'
                      ? 'Belum Dipilih'
                      : component.name.split(' ').slice(0, 3).join(' ')}
                  </Text>
                </View>
              </View>

              {/* Status Indicator */}
              {isConflict && (
                <View style={styles.conflictBadge}>
                  <Text style={styles.conflictBadgeText}>KONFLIK</Text>
                </View>
              )}
              {isOk && <Text style={styles.checkIcon}>✅</Text>}
              {isEmpty && <Text style={styles.addIcon}>➕</Text>}
            </Pressable>
          );
        })}
      </View>

      {/* Presets */}
      <View style={styles.presetsSection}>
        <Text style={styles.presetsLabel}>LOADOUT PRESETS</Text>
        {PRESETS.map(preset => (
          <Pressable
            key={preset.id}
            style={[
              styles.presetItem,
              preset.active && styles.presetItemActive,
            ]}
            onPress={() => applyPreset(preset.id)}
          >
            <Text style={[
              styles.presetName,
              preset.active && styles.presetNameActive,
            ]}>
              {preset.name}
            </Text>
            <Text style={styles.presetBadge}>{preset.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(24,28,34,0.9)',
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 8,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    color: PayComColors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: PayComColors.onSurface,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: PayComColors.surfaceContainerHigh,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '500',
    color: PayComColors.primaryContainer,
  },
  progressBg: {
    width: '100%',
    height: 5,
    backgroundColor: PayComColors.surfaceContainerLowest,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: PayComColors.primaryContainer,
  },
  navList: {
    gap: 4,
    marginTop: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 8,
    backgroundColor: PayComColors.surfaceContainer,
  },
  navItemError: {
    backgroundColor: 'rgba(147,0,10,0.3)',
  },
  navItemEmpty: {
    backgroundColor: PayComColors.surfaceContainerLowest,
  },
  navItemActive: {
    borderWidth: 1,
    borderColor: 'rgba(0,240,255,0.4)',
  },
  navItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: PayComColors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxError: {
    backgroundColor: PayComColors.errorContainer,
  },
  iconBoxEmpty: {
    backgroundColor: PayComColors.surfaceContainerHigh,
  },
  iconText: {
    fontSize: 16,
  },
  navItemTextSection: {
    flex: 1,
    minWidth: 0,
  },
  navItemCategory: {
    fontSize: 10,
    fontWeight: '500',
    color: PayComColors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  navItemCategoryError: {
    color: PayComColors.error,
    fontWeight: '600',
  },
  navItemCategoryEmpty: {
    color: PayComColors.primaryContainer,
    fontWeight: '600',
  },
  navItemName: {
    fontSize: 13,
    fontWeight: '600',
    color: PayComColors.onSurface,
  },
  navItemNameEmpty: {
    color: PayComColors.onSurfaceVariant,
  },
  conflictBadge: {
    backgroundColor: PayComColors.error,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  conflictBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  checkIcon: {
    fontSize: 14,
  },
  addIcon: {
    fontSize: 14,
  },
  presetsSection: {
    marginTop: 8,
    paddingTop: 8,
    backgroundColor: 'rgba(10,14,20,0.5)',
    borderRadius: 8,
    padding: 10,
    gap: 6,
  },
  presetsLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: PayComColors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  presetItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(28,32,38,0.4)',
  },
  presetItemActive: {
    backgroundColor: PayComColors.surfaceContainer,
  },
  presetName: {
    fontSize: 13,
    fontWeight: '600',
    color: PayComColors.onSurfaceVariant,
  },
  presetNameActive: {
    color: PayComColors.primaryContainer,
  },
  presetBadge: {
    fontSize: 10,
    fontWeight: '500',
    color: PayComColors.onSurfaceVariant,
    letterSpacing: 0.5,
  },
});
