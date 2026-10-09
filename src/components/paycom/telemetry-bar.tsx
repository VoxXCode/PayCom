/**
 * PayCom - Telemetry Bar
 * Real-time rig performance diagnostic tiles
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PayComColors } from '@/constants/theme';
import { useResponsive } from '@/hooks/use-responsive';

function ProgressBar({ percentage, color }: { percentage: number; color: string }) {
  return (
    <View style={styles.progressBg}>
      <View style={[styles.progressFill, { width: `${percentage}%`, backgroundColor: color }]} />
    </View>
  );
}

export function TelemetryBar() {
  const { isMobile } = useResponsive();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <View style={styles.pulseDot} />
          <Text style={styles.title}>REAL-TIME RIG TELEMETRY PIPELINE</Text>
        </View>
        <Text style={styles.subtitle}>PSU HEADROOM: +270W</Text>
      </View>

      <View style={[styles.tilesRow, isMobile && styles.tilesColumn]}>
        {/* Wattage Tile */}
        <View style={styles.tile}>
          <View style={styles.tileHeader}>
            <Text style={styles.tileLabel}>Kebutuhan Daya (TDP)</Text>
            <Text style={styles.tileIcon}>⚡</Text>
          </View>
          <View style={styles.tileValue}>
            <Text style={styles.valueMain}>580W</Text>
            <Text style={styles.valueSub}> / 850W PSU</Text>
          </View>
          <ProgressBar percentage={68} color={PayComColors.primaryContainer} />
          <Text style={styles.tileFooter}>Load Target: 68% (Optimal)</Text>
        </View>

        {/* Thermal Tile */}
        <View style={styles.tile}>
          <View style={styles.tileHeader}>
            <Text style={styles.tileLabel}>Estimasi Termal Peak</Text>
            <Text style={styles.tileIcon}>🌡️</Text>
          </View>
          <View style={styles.tileValue}>
            <Text style={[styles.valueMain, { color: PayComColors.secondary }]}>62°C</Text>
            <Text style={styles.valueSub}> Peak Load</Text>
          </View>
          <ProgressBar percentage={54} color={PayComColors.secondaryContainer} />
          <Text style={styles.tileFooter}>AIO 360mm: Cooling Safe</Text>
        </View>

        {/* Benchmark Tile */}
        <View style={styles.tile}>
          <View style={styles.tileHeader}>
            <Text style={styles.tileLabel}>Indeks Benchmark (Est.)</Text>
            <Text style={styles.tileIcon}>🏆</Text>
          </View>
          <View style={styles.tileValue}>
            <Text style={[styles.valueMain, { color: PayComColors.onSurface }]}>31,450</Text>
            <Text style={[styles.valueSub, { color: PayComColors.primaryContainer }]}> pts</Text>
          </View>
          <ProgressBar percentage={94} color={PayComColors.primaryContainer} />
          <Text style={styles.tileFooter}>Top 3% Global Benchmarks</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(24,28,34,0.9)',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
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
  title: {
    fontSize: 10,
    fontWeight: '500',
    color: PayComColors.primaryContainer,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '500',
    color: PayComColors.onSurfaceVariant,
    letterSpacing: 0.5,
  },
  tilesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  tilesColumn: {
    flexDirection: 'column',
  },
  tile: {
    flex: 1,
    backgroundColor: PayComColors.surfaceContainerLowest,
    borderRadius: 8,
    padding: 12,
    gap: 4,
  },
  tileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tileLabel: {
    fontSize: 11,
    color: PayComColors.onSurfaceVariant,
  },
  tileIcon: {
    fontSize: 14,
  },
  tileValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 4,
  },
  valueMain: {
    fontSize: 20,
    fontWeight: '700',
    color: PayComColors.primaryContainer,
    letterSpacing: -0.5,
  },
  valueSub: {
    fontSize: 11,
    fontWeight: '500',
    color: PayComColors.onSurfaceVariant,
  },
  progressBg: {
    width: '100%',
    height: 5,
    backgroundColor: PayComColors.surfaceContainer,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  tileFooter: {
    fontSize: 10,
    fontWeight: '500',
    color: PayComColors.onSurfaceVariant,
    marginTop: 4,
  },
});
