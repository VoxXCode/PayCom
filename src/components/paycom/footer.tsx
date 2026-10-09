/**
 * PayCom - Footer Component
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PayComColors } from '@/constants/theme';

export function Footer() {
  return (
    <View style={styles.footer}>
      <View style={styles.footerInner}>
        <View style={styles.footerLeft}>
          <View style={styles.footerDot} />
          <Text style={styles.footerText}>PAYCOM HARDWARE TELEMETRY CORE</Text>
          <Text style={styles.footerSep}>•</Text>
          <Text style={styles.footerText}>PRECISION FABRICATION GRID</Text>
        </View>
        <Text style={styles.footerCopy}>© 2025 PayCom Systems. All hardware diagnostics operational.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#0d1117',
    borderTopWidth: 1,
    borderTopColor: 'rgba(59,73,75,0.3)',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  footerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: PayComColors.primaryContainer,
  },
  footerText: {
    fontSize: 10,
    fontWeight: '500',
    color: PayComColors.onSurfaceVariant,
    letterSpacing: 0.5,
  },
  footerSep: {
    fontSize: 10,
    color: PayComColors.onSurfaceVariant,
  },
  footerCopy: {
    fontSize: 10,
    color: PayComColors.onSurfaceVariant,
  },
});
