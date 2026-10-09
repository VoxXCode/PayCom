/**
 * PayCom - Builder Screen
 * Main rig configurator with 3-column responsive layout
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { PayComColors } from '@/constants/theme';
import { useBuild } from '@/hooks/use-build';
import { useResponsive } from '@/hooks/use-responsive';
import { ConflictBanner } from '@/components/paycom/conflict-banner';
import { TelemetryBar } from '@/components/paycom/telemetry-bar';
import { ComponentCard } from '@/components/paycom/component-card';
import { Sidebar } from '@/components/paycom/sidebar';
import { CheckoutPanel } from '@/components/paycom/checkout-panel';

export function BuilderScreen() {
  const { components } = useBuild();
  const { isDesktop, isTablet, isMobile } = useResponsive();

  // Desktop: 3-column layout
  if (isDesktop) {
    return (
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.desktopContainer}
      >
        {/* Status breadcrumb */}
        <StatusBar />

        <View style={styles.desktopGrid}>
          {/* Left column: Sidebar */}
          <View style={styles.desktopLeft}>
            <Sidebar />
          </View>

          {/* Center column: Main workspace */}
          <View style={styles.desktopCenter}>
            <ConflictBanner />
            <TelemetryBar />
            <View style={styles.cardsList}>
              {components.map(component => (
                <ComponentCard key={component.id} component={component} />
              ))}
            </View>
          </View>

          {/* Right column: Checkout */}
          <View style={styles.desktopRight}>
            <CheckoutPanel />
          </View>
        </View>
      </ScrollView>
    );
  }

  // Tablet: 2-column layout (sidebar hidden, summary below)
  if (isTablet) {
    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.tabletContainer}
      >
        <StatusBar />
        <ConflictBanner />
        <TelemetryBar />
        <View style={styles.tabletGrid}>
          <View style={styles.tabletMain}>
            {components.map(component => (
              <ComponentCard key={component.id} component={component} />
            ))}
          </View>
          <View style={styles.tabletSide}>
            <Sidebar />
            <CheckoutPanel />
          </View>
        </View>
      </ScrollView>
    );
  }

  // Mobile: Single column, everything stacked
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.mobileContainer}
    >
      <StatusBar />
      <ConflictBanner />
      <TelemetryBar />
      <Sidebar />
      {components.map(component => (
        <ComponentCard key={component.id} component={component} />
      ))}
      <CheckoutPanel />
    </ScrollView>
  );
}

function StatusBar() {
  const { isMobile } = useResponsive();

  return (
    <View style={styles.statusBar}>
      <View style={styles.statusLeft}>
        <View style={styles.sysIdBadge}>
          <View style={styles.sysIdDot} />
          <Text style={styles.sysIdText}>SYS.ID: PC-8842-CYBER</Text>
        </View>
        {!isMobile && (
          <>
            <Text style={styles.statusSep}>/</Text>
            <Text style={styles.statusTitle}>Workstation & Extreme Gaming Rig</Text>
          </>
        )}
      </View>
      <View style={styles.statusRight}>
        {!isMobile && (
          <Text style={styles.statusMetric}>
            ⚡ LATENCY: <Text style={styles.statusMetricValue}>1.2ms</Text>
          </Text>
        )}
        <Text style={styles.statusMetric}>
          💻 FABRICATION: <Text style={styles.statusMetricValue}>CUSTOM ORDER</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  // Desktop
  desktopContainer: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  desktopGrid: {
    flexDirection: 'row',
    gap: 16,
    flex: 1,
  },
  desktopLeft: {
    width: 280,
    flexShrink: 0,
  },
  desktopCenter: {
    flex: 1,
    gap: 12,
  },
  desktopRight: {
    width: 300,
    flexShrink: 0,
  },
  // Tablet
  tabletContainer: {
    padding: 16,
    gap: 12,
  },
  tabletGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  tabletMain: {
    flex: 1,
    gap: 10,
  },
  tabletSide: {
    width: 280,
    gap: 12,
  },
  // Mobile
  mobileContainer: {
    padding: 12,
    gap: 10,
    paddingBottom: 40,
  },
  // Cards
  cardsList: {
    gap: 10,
  },
  // Status bar
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(10,14,20,0.8)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    flexWrap: 'wrap',
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sysIdBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: PayComColors.surfaceContainer,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  sysIdDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: PayComColors.primaryContainer,
  },
  sysIdText: {
    fontSize: 10,
    fontWeight: '500',
    color: PayComColors.primaryContainer,
    letterSpacing: 0.5,
  },
  statusSep: {
    fontSize: 10,
    color: PayComColors.onSurfaceVariant,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: PayComColors.onSurface,
    letterSpacing: 0.3,
  },
  statusRight: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  statusMetric: {
    fontSize: 10,
    fontWeight: '500',
    color: PayComColors.onSurfaceVariant,
  },
  statusMetricValue: {
    color: PayComColors.onSurface,
  },
});
