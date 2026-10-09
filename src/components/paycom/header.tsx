/**
 * PayCom - Header Component
 * Cyberpunk-styled fixed header with navigation
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet, Image, Platform } from 'react-native';
import { PayComColors } from '@/constants/theme';
import { useBuild, type ActiveTab } from '@/hooks/use-build';
import { useResponsive } from '@/hooks/use-responsive';

const NAV_ITEMS: { key: ActiveTab; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'builder', label: 'Builder' },
  { key: 'saved-builds', label: 'Saved Builds' },
  { key: 'benchmarks', label: 'Benchmarks' },
  { key: 'community', label: 'Community' },
];

export function Header() {
  const { activeTab, setActiveTab } = useBuild();
  const { isMobile, isDesktop } = useResponsive();

  return (
    <View style={styles.header}>
      <View style={styles.headerInner}>
        {/* Logo */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>⬡</Text>
            <Text style={styles.logoText}>PayCom</Text>
          </View>
          {isDesktop && (
            <View style={styles.versionBadge}>
              <Text style={styles.versionText}>RIG CONFIGURATOR v2.4</Text>
            </View>
          )}
        </View>

        {/* Navigation */}
        {!isMobile && (
          <View style={styles.nav}>
            {NAV_ITEMS.map(item => (
              <Pressable
                key={item.key}
                onPress={() => setActiveTab(item.key)}
                style={[
                  styles.navItem,
                  activeTab === item.key && styles.navItemActive,
                ]}
              >
                <Text
                  style={[
                    styles.navText,
                    activeTab === item.key && styles.navTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Right side */}
        <View style={styles.rightSection}>
          {!isMobile && (
            <View style={styles.statusIndicator}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>ENGINE: ACTIVE</Text>
            </View>
          )}
          <View style={styles.profileSection}>
            <View style={styles.profileInfo}>
              <Text style={styles.levelText}>LVL 89</Text>
              <Text style={styles.roleText}>Rig Master</Text>
            </View>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>RM</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Mobile Navigation Bar */}
      {isMobile && (
        <View style={styles.mobileNav}>
          {NAV_ITEMS.map(item => (
            <Pressable
              key={item.key}
              onPress={() => setActiveTab(item.key)}
              style={[
                styles.mobileNavItem,
                activeTab === item.key && styles.mobileNavItemActive,
              ]}
            >
              <Text
                style={[
                  styles.mobileNavText,
                  activeTab === item.key && styles.mobileNavTextActive,
                ]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'rgba(13,17,23,0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,240,255,0.3)',
    ...(Platform.OS === 'web'
      ? { position: 'fixed' as any, top: 0, left: 0, right: 0, zIndex: 50 }
      : {}),
  },
  headerInner: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    gap: 12,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoIcon: {
    fontSize: 24,
    color: PayComColors.primaryContainer,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
    color: PayComColors.primaryContainer,
    letterSpacing: 1,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0,240,255,0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  versionBadge: {
    backgroundColor: PayComColors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: PayComColors.outlineVariant,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  versionText: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 1,
    color: PayComColors.onSurfaceVariant,
    textTransform: 'uppercase',
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  navItem: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 4,
  },
  navItemActive: {
    backgroundColor: PayComColors.surfaceContainerHigh,
    borderBottomWidth: 2,
    borderBottomColor: PayComColors.primaryContainer,
  },
  navText: {
    fontSize: 14,
    fontWeight: '600',
    color: PayComColors.onSurfaceVariant,
  },
  navTextActive: {
    color: PayComColors.onSurface,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(10,14,20,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(59,73,75,0.6)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: PayComColors.primaryContainer,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
    color: PayComColors.primaryContainer,
    letterSpacing: 0.5,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 12,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(59,73,75,0.4)',
  },
  profileInfo: {
    alignItems: 'flex-end',
  },
  levelText: {
    fontSize: 10,
    fontWeight: '500',
    color: PayComColors.primaryContainer,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  roleText: {
    fontSize: 11,
    color: PayComColors.onSurfaceVariant,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: PayComColors.surfaceContainerHigh,
    borderWidth: 2,
    borderColor: 'rgba(0,240,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 11,
    fontWeight: '700',
    color: PayComColors.primaryContainer,
  },
  mobileNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(59,73,75,0.3)',
    paddingHorizontal: 4,
  },
  mobileNavItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  mobileNavItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: PayComColors.primaryContainer,
  },
  mobileNavText: {
    fontSize: 11,
    fontWeight: '500',
    color: PayComColors.onSurfaceVariant,
  },
  mobileNavTextActive: {
    color: PayComColors.primaryContainer,
    fontWeight: '600',
  },
});
