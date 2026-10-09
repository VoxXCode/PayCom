/**
 * PayCom - Saved Builds Screen
 * Display saved rig configurations
 */

import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { PayComColors } from '@/constants/theme';
import { formatRupiah } from '@/constants/data';
import { useBuild } from '@/hooks/use-build';

export function SavedBuildsScreen() {
  const { savedBuilds } = useBuild();
  const [selectedBuild, setSelectedBuild] = useState<string | null>(null);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>BUILD ARCHIVE</Text>
          <Text style={styles.headerTitle}>Saved Builds</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{savedBuilds.length} Builds</Text>
        </View>
      </View>

      <View style={styles.grid}>
        {savedBuilds.map(build => (
          <Pressable
            key={build.id}
            style={[
              styles.card,
              selectedBuild === build.id && styles.cardSelected,
            ]}
            onPress={() => setSelectedBuild(
              selectedBuild === build.id ? null : build.id
            )}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardIconBox}>
                <Text style={styles.cardIcon}>{build.icon}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: build.statusColor + '20' }]}>
                <Text style={[styles.statusText, { color: build.statusColor }]}>{build.status}</Text>
              </View>
            </View>
            <Text style={styles.cardName}>{build.name}</Text>
            <Text style={styles.cardDate}>{build.date}</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.cardComponents}>{build.components} Komponen</Text>
              <Text style={styles.cardPrice}>{formatRupiah(build.price)}</Text>
            </View>
            {selectedBuild === build.id && (
              <View style={styles.cardActions}>
                <Pressable 
                  style={styles.loadBtn}
                  onPress={() => Platform.OS !== 'web' && Alert.alert('Muat Build', 'Build berhasil dimuat ke editor!')}
                >
                  <Text style={styles.loadBtnText}>📂 Muat Build</Text>
                </Pressable>
                <Pressable 
                  style={styles.deleteBtn}
                  onPress={() => Platform.OS !== 'web' && Alert.alert('Hapus Build', 'Build berhasil dihapus dari arsip.')}
                >
                  <Text style={styles.deleteBtnText}>🗑️ Hapus</Text>
                </Pressable>
              </View>
            )}
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  container: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: PayComColors.primaryContainer,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: PayComColors.onSurface,
  },
  countBadge: {
    backgroundColor: PayComColors.surfaceContainerHigh,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    color: PayComColors.primaryContainer,
  },
  grid: {
    gap: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: PayComColors.surfaceContainerLow,
    borderRadius: 12,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    minWidth: 280,
    flex: 1,
  },
  cardSelected: {
    borderColor: 'rgba(0,240,255,0.4)',
    backgroundColor: PayComColors.surfaceContainer,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: PayComColors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIcon: {
    fontSize: 22,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
    color: PayComColors.onSurface,
    marginTop: 4,
  },
  cardDate: {
    fontSize: 11,
    color: PayComColors.onSurfaceVariant,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(59,73,75,0.3)',
  },
  cardComponents: {
    fontSize: 12,
    color: PayComColors.onSurfaceVariant,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: PayComColors.primaryContainer,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 8,
  },
  loadBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: PayComColors.primaryContainer,
    alignItems: 'center',
  },
  loadBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: PayComColors.onPrimaryContainer,
  },
  deleteBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(147,0,10,0.3)',
    alignItems: 'center',
  },
  deleteBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: PayComColors.error,
  },
});
