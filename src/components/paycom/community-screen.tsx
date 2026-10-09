/**
 * PayCom - Community Screen
 * Community builds showcase and discussions
 */

import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { PayComColors } from '@/constants/theme';
import { formatRupiah } from '@/constants/data';

const COMMUNITY_BUILDS = [
  {
    id: '1',
    username: 'CyberNinja',
    level: 'LVL 120',
    avatar: '🥷',
    buildName: 'Shadow Phantom RTX Build',
    description: 'Full watercool custom loop with hard tubing. 4K@144Hz capable gaming beast.',
    price: 85000000,
    likes: 2840,
    comments: 156,
    components: ['i9-14900K', 'RTX 4090', '64GB DDR5', '4TB NVMe'],
    tags: ['Custom Loop', '4K Gaming', 'Extreme'],
  },
  {
    id: '2',
    username: 'TechWizard',
    level: 'LVL 95',
    avatar: '🧙',
    buildName: 'Deep Learning Workstation X',
    description: 'Dual GPU setup for AI training and inference. Optimized for CUDA cores.',
    price: 125000000,
    likes: 1560,
    comments: 89,
    components: ['Threadripper 7980X', '2x RTX 4090', '128GB DDR5', '8TB NVMe'],
    tags: ['AI/ML', 'Workstation', 'Dual GPU'],
  },
  {
    id: '3',
    username: 'StreamQueen',
    level: 'LVL 78',
    avatar: '👑',
    buildName: 'Crystal Rose Streaming PC',
    description: 'Aesthetic white build with dual NVENC encoding. Stream + game simultaneously.',
    price: 42000000,
    likes: 3200,
    comments: 245,
    components: ['R7 7800X3D', 'RTX 4070 Ti Super', '32GB DDR5', '2TB NVMe'],
    tags: ['Streaming', 'Aesthetic', 'White Build'],
  },
  {
    id: '4',
    username: 'BudgetKing',
    level: 'LVL 45',
    avatar: '👨‍💻',
    buildName: 'Value Champion 1440p',
    description: 'Best price-to-performance ratio. Destroys 1440p gaming at ultra settings.',
    price: 18500000,
    likes: 5600,
    comments: 320,
    components: ['R5 7600', 'RX 7800 XT', '32GB DDR5', '1TB NVMe'],
    tags: ['Budget', '1440p', 'Best Value'],
  },
];

export function CommunityScreen() {
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) => {
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>COMMUNITY HUB</Text>
          <Text style={styles.headerTitle}>Community Builds</Text>
        </View>
        <View style={styles.onlineBadge}>
          <View style={styles.onlineDot} />
          <Text style={styles.onlineText}>1,247 Online</Text>
        </View>
      </View>

      {/* Post Build CTA */}
      <Pressable style={styles.postCta}>
        <Text style={styles.postCtaIcon}>📸</Text>
        <View style={styles.postCtaText}>
          <Text style={styles.postCtaTitle}>Pamerkan Build Kamu!</Text>
          <Text style={styles.postCtaDesc}>Share spesifikasi & foto rig kamu ke komunitas</Text>
        </View>
        <Text style={styles.postCtaArrow}>→</Text>
      </Pressable>

      {/* Builds List */}
      <View style={styles.buildsList}>
        {COMMUNITY_BUILDS.map(build => (
          <View key={build.id} style={styles.buildCard}>
            {/* User Header */}
            <View style={styles.userRow}>
              <View style={styles.userLeft}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userAvatarText}>{build.avatar}</Text>
                </View>
                <View>
                  <Text style={styles.userName}>{build.username}</Text>
                  <Text style={styles.userLevel}>{build.level}</Text>
                </View>
              </View>
              <Pressable
                style={[
                  styles.likeBtn,
                  likedPosts.has(build.id) && styles.likeBtnActive,
                ]}
                onPress={() => toggleLike(build.id)}
              >
                <Text style={styles.likeBtnIcon}>
                  {likedPosts.has(build.id) ? '❤️' : '🤍'}
                </Text>
                <Text style={[
                  styles.likeBtnText,
                  likedPosts.has(build.id) && styles.likeBtnTextActive,
                ]}>
                  {likedPosts.has(build.id)
                    ? (build.likes + 1).toLocaleString()
                    : build.likes.toLocaleString()}
                </Text>
              </Pressable>
            </View>

            {/* Build Info */}
            <Text style={styles.buildName}>{build.buildName}</Text>
            <Text style={styles.buildDesc}>{build.description}</Text>

            {/* Tags */}
            <View style={styles.tagsRow}>
              {build.tags.map((tag, i) => (
                <View key={i} style={styles.tagBadge}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>

            {/* Component Summary */}
            <View style={styles.componentsRow}>
              {build.components.map((comp, i) => (
                <View key={i} style={styles.componentChip}>
                  <Text style={styles.componentChipText}>{comp}</Text>
                </View>
              ))}
            </View>

            {/* Footer */}
            <View style={styles.buildFooter}>
              <Text style={styles.buildPrice}>{formatRupiah(build.price)}</Text>
              <View style={styles.footerActions}>
                <Pressable 
                  style={styles.commentBtn}
                  onPress={() => Platform.OS !== 'web' && Alert.alert('Komentar', 'Fitur komentar akan segera hadir!')}
                >
                  <Text style={styles.commentBtnText}>💬 {build.comments}</Text>
                </Pressable>
                <Pressable 
                  style={styles.viewBtn}
                  onPress={() => Platform.OS !== 'web' && Alert.alert('Detail', 'Membuka halaman detail build...')}
                >
                  <Text style={styles.viewBtnText}>Lihat Detail</Text>
                </Pressable>
              </View>
            </View>
          </View>
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
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: PayComColors.surfaceContainerHigh,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ade80',
  },
  onlineText: {
    fontSize: 11,
    fontWeight: '600',
    color: PayComColors.onSurface,
  },
  postCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(0,240,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0,240,255,0.2)',
    borderRadius: 12,
    padding: 14,
    borderStyle: 'dashed',
  },
  postCtaIcon: {
    fontSize: 28,
  },
  postCtaText: {
    flex: 1,
  },
  postCtaTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: PayComColors.primaryContainer,
  },
  postCtaDesc: {
    fontSize: 12,
    color: PayComColors.onSurfaceVariant,
    marginTop: 2,
  },
  postCtaArrow: {
    fontSize: 20,
    color: PayComColors.primaryContainer,
    fontWeight: '700',
  },
  buildsList: {
    gap: 12,
  },
  buildCard: {
    backgroundColor: PayComColors.surfaceContainerLow,
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: PayComColors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,240,255,0.3)',
  },
  userAvatarText: {
    fontSize: 18,
  },
  userName: {
    fontSize: 13,
    fontWeight: '700',
    color: PayComColors.onSurface,
  },
  userLevel: {
    fontSize: 10,
    fontWeight: '500',
    color: PayComColors.primaryContainer,
    letterSpacing: 0.5,
  },
  likeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: PayComColors.surfaceContainer,
  },
  likeBtnActive: {
    backgroundColor: 'rgba(255,51,102,0.15)',
  },
  likeBtnIcon: {
    fontSize: 14,
  },
  likeBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: PayComColors.onSurfaceVariant,
  },
  likeBtnTextActive: {
    color: '#ff6b8a',
  },
  buildName: {
    fontSize: 16,
    fontWeight: '700',
    color: PayComColors.onSurface,
  },
  buildDesc: {
    fontSize: 13,
    color: PayComColors.onSurfaceVariant,
    lineHeight: 19,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  tagBadge: {
    backgroundColor: 'rgba(0,240,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
    color: PayComColors.primaryContainer,
    letterSpacing: 0.3,
  },
  componentsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  componentChip: {
    backgroundColor: PayComColors.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  componentChipText: {
    fontSize: 11,
    fontWeight: '500',
    color: PayComColors.onSurface,
  },
  buildFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(59,73,75,0.3)',
    gap: 8,
    flexWrap: 'wrap',
  },
  buildPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: PayComColors.primaryContainer,
  },
  footerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  commentBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: PayComColors.surfaceContainer,
  },
  commentBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: PayComColors.onSurfaceVariant,
  },
  viewBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: PayComColors.primaryContainer,
  },
  viewBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: PayComColors.onPrimaryContainer,
  },
});
