/**
 * PayCom - Benchmarks Screen
 * Performance benchmarking and comparisons
 */

import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { PayComColors } from '@/constants/theme';

interface BenchmarkItem {
  id: string;
  name: string;
  icon: string;
  score: number;
  maxScore: number;
  rank: string;
  color: string;
}

const BENCHMARKS: BenchmarkItem[] = [
  {
    id: '1',
    name: 'Cinebench R23 Multi-Core',
    icon: '🔥',
    score: 28450,
    maxScore: 40000,
    rank: 'Top 5%',
    color: PayComColors.primaryContainer,
  },
  {
    id: '2',
    name: '3DMark Time Spy',
    icon: '🎮',
    score: 21300,
    maxScore: 25000,
    rank: 'Top 3%',
    color: '#508eff',
  },
  {
    id: '3',
    name: 'PCMark 10 Extended',
    icon: '📊',
    score: 12850,
    maxScore: 15000,
    rank: 'Top 8%',
    color: '#ffb2ba',
  },
  {
    id: '4',
    name: 'CrystalDisk NVMe Seq Read',
    icon: '💾',
    score: 7450,
    maxScore: 10000,
    rank: 'Top 2%',
    color: PayComColors.primaryContainer,
  },
  {
    id: '5',
    name: 'Blender Classroom (sec)',
    icon: '🎨',
    score: 82,
    maxScore: 120,
    rank: 'Top 4%',
    color: '#508eff',
  },
  {
    id: '6',
    name: 'Geekbench 6 Multi',
    icon: '⚡',
    score: 17200,
    maxScore: 20000,
    rank: 'Top 6%',
    color: '#ffb2ba',
  },
];

const GAME_BENCHMARKS = [
  { name: 'Cyberpunk 2077 (4K Ultra)', fps: '68 FPS', icon: '🌆', quality: 'Ultra' },
  { name: 'Red Dead Redemption 2 (4K)', fps: '75 FPS', icon: '🤠', quality: 'Ultra' },
  { name: 'Elden Ring (4K Max)', fps: '60 FPS', icon: '⚔️', quality: 'Max' },
  { name: 'Call of Duty MW3 (4K)', fps: '120 FPS', icon: '🎯', quality: 'Extreme' },
  { name: 'Forza Horizon 5 (4K)', fps: '95 FPS', icon: '🏎️', quality: 'Extreme' },
  { name: 'Hogwarts Legacy (4K)', fps: '55 FPS', icon: '🧙', quality: 'Ultra' },
];

export function BenchmarksScreen() {
  const [activeTab, setActiveTab] = useState<'synthetic' | 'gaming'>('synthetic');

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>PERFORMANCE MATRIX</Text>
          <Text style={styles.headerTitle}>Benchmarks</Text>
        </View>
        <View style={styles.overallScore}>
          <Text style={styles.overallLabel}>OVERALL</Text>
          <Text style={styles.overallValue}>31,450</Text>
          <Text style={styles.overallUnit}>pts</Text>
        </View>
      </View>

      {/* Tab Switch */}
      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tab, activeTab === 'synthetic' && styles.tabActive]}
          onPress={() => setActiveTab('synthetic')}
        >
          <Text style={[styles.tabText, activeTab === 'synthetic' && styles.tabTextActive]}>
            🔬 Synthetic
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'gaming' && styles.tabActive]}
          onPress={() => setActiveTab('gaming')}
        >
          <Text style={[styles.tabText, activeTab === 'gaming' && styles.tabTextActive]}>
            🎮 Gaming FPS
          </Text>
        </Pressable>
      </View>

      {activeTab === 'synthetic' ? (
        <View style={styles.benchmarkList}>
          {BENCHMARKS.map(bench => (
            <View key={bench.id} style={styles.benchCard}>
              <View style={styles.benchHeader}>
                <View style={styles.benchLeft}>
                  <Text style={styles.benchIcon}>{bench.icon}</Text>
                  <Text style={styles.benchName}>{bench.name}</Text>
                </View>
                <View style={[styles.rankBadge, { backgroundColor: bench.color + '20' }]}>
                  <Text style={[styles.rankText, { color: bench.color }]}>{bench.rank}</Text>
                </View>
              </View>
              <View style={styles.benchScoreRow}>
                <Text style={[styles.benchScore, { color: bench.color }]}>
                  {bench.score.toLocaleString()}
                </Text>
                <Text style={styles.benchMaxScore}>/ {bench.maxScore.toLocaleString()}</Text>
              </View>
              <View style={styles.benchProgressBg}>
                <View
                  style={[
                    styles.benchProgressFill,
                    {
                      width: `${(bench.score / bench.maxScore) * 100}%`,
                      backgroundColor: bench.color,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.gameList}>
          {GAME_BENCHMARKS.map((game, i) => (
            <View key={i} style={styles.gameCard}>
              <View style={styles.gameLeft}>
                <Text style={styles.gameIcon}>{game.icon}</Text>
                <View>
                  <Text style={styles.gameName}>{game.name}</Text>
                  <Text style={styles.gameQuality}>Quality: {game.quality}</Text>
                </View>
              </View>
              <View style={styles.fpsBox}>
                <Text style={styles.fpsValue}>{game.fps}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
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
    gap: 12,
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
  overallScore: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    backgroundColor: PayComColors.surfaceContainerLowest,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  overallLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: PayComColors.onSurfaceVariant,
    marginRight: 4,
  },
  overallValue: {
    fontSize: 22,
    fontWeight: '700',
    color: PayComColors.primaryContainer,
  },
  overallUnit: {
    fontSize: 12,
    fontWeight: '500',
    color: PayComColors.primaryContainer,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: PayComColors.surfaceContainerLowest,
    borderRadius: 10,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: PayComColors.surfaceContainer,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: PayComColors.onSurfaceVariant,
  },
  tabTextActive: {
    color: PayComColors.primaryContainer,
  },
  benchmarkList: {
    gap: 10,
  },
  benchCard: {
    backgroundColor: PayComColors.surfaceContainerLow,
    borderRadius: 12,
    padding: 14,
    gap: 8,
  },
  benchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  benchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  benchIcon: {
    fontSize: 18,
  },
  benchName: {
    fontSize: 13,
    fontWeight: '600',
    color: PayComColors.onSurface,
    flex: 1,
  },
  rankBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  rankText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  benchScoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  benchScore: {
    fontSize: 20,
    fontWeight: '700',
  },
  benchMaxScore: {
    fontSize: 12,
    color: PayComColors.onSurfaceVariant,
  },
  benchProgressBg: {
    width: '100%',
    height: 6,
    backgroundColor: PayComColors.surfaceContainerHighest,
    borderRadius: 3,
    overflow: 'hidden',
  },
  benchProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  gameList: {
    gap: 8,
  },
  gameCard: {
    backgroundColor: PayComColors.surfaceContainerLow,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  gameLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  gameIcon: {
    fontSize: 24,
  },
  gameName: {
    fontSize: 14,
    fontWeight: '600',
    color: PayComColors.onSurface,
  },
  gameQuality: {
    fontSize: 11,
    color: PayComColors.onSurfaceVariant,
    marginTop: 2,
  },
  fpsBox: {
    backgroundColor: PayComColors.surfaceContainerLowest,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  fpsValue: {
    fontSize: 16,
    fontWeight: '700',
    color: PayComColors.primaryContainer,
  },
});
