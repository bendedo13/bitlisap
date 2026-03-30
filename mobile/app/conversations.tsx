import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { FlashList } from '@shopify/flash-list';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import EmptyState from '../components/ui/EmptyState';

function timeAgo(dateStr: string) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return 'az önce';
  if (diff < 3600) return `${Math.floor(diff / 60)}dk`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}sa`;
  return new Date(dateStr).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
}

function ConversationItem({ item, userId, onPress }: { item: any; userId: string; onPress: () => void }) {
  const otherUser = item.user1Id === userId ? item.user2 : item.user1;
  const lastMsg = item.messages?.[0];
  const unread = item.messages?.filter((m: any) => !m.isRead && m.senderId !== userId).length || 0;

  return (
    <TouchableOpacity style={styles.convItem} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.convAvatar}>
        <Text style={styles.convAvatarText}>{otherUser?.fullName?.charAt(0) || '?'}</Text>
        {otherUser?.isOnline && <View style={styles.convOnline} />}
      </View>
      <View style={styles.convBody}>
        <View style={styles.convTop}>
          <Text style={[styles.convName, unread > 0 && { fontWeight: '700' }]} numberOfLines={1}>
            {otherUser?.fullName || 'Kullanıcı'}
          </Text>
          <Text style={styles.convTime}>{lastMsg ? timeAgo(lastMsg.createdAt) : ''}</Text>
        </View>
        <View style={styles.convBottom}>
          <Text style={[styles.convLastMsg, unread > 0 && { color: Colors.textPrimary, fontWeight: '500' }]} numberOfLines={1}>
            {lastMsg ? (lastMsg.senderId === userId ? `Siz: ${lastMsg.content}` : lastMsg.content) : 'Henüz mesaj yok'}
          </Text>
          {unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{unread}</Text>
            </View>
          )}
        </View>
        {item.listing && (
          <View style={styles.convListing}>
            <Ionicons name="pricetag-outline" size={10} color={Colors.textMuted} />
            <Text style={styles.convListingText} numberOfLines={1}>{item.listing.title}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function ConversationsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const res = await api.get('/messages/conversations');
      return res.data;
    },
  });

  const conversations = data?.conversations ?? [];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <View style={styles.headerCircle} />
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.white} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Mesajlar</Text>
          <Text style={styles.headerSub}>{conversations.length} sohbet</Text>
        </View>
        <TouchableOpacity style={styles.newChatBtn}>
          <Ionicons name="create-outline" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={Colors.primary[500]} size="large" />
        </View>
      ) : conversations.length === 0 ? (
        <EmptyState
          icon="chatbubbles-outline"
          title="Henüz mesajınız yok"
          description="Bir ilan sahibine mesaj göndererek sohbet başlatın"
        />
      ) : (
        <FlashList
          data={conversations}
          estimatedItemSize={80}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 4 }}
          renderItem={({ item }) => (
            <ConversationItem
              item={item}
              userId={user?.id || ''}
              onPress={() => router.push(`/listing/chat/${item.id}` as any)}
            />
          )}
          keyExtractor={(item: any) => item.id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  header: {
    backgroundColor: Colors.primary[800],
    paddingTop: (StatusBar.currentHeight || 44) + 8,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    overflow: 'hidden',
  },
  headerCircle: {
    position: 'absolute', width: 160, height: 160, borderRadius: 80,
    backgroundColor: Colors.primary[600], opacity: 0.2, top: -40, right: -30,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { ...Typography.h2, color: Colors.white },
  headerSub: { ...Typography.caption, color: 'rgba(255,255,255,0.55)' },
  newChatBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },

  convItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, marginHorizontal: Spacing.lg,
    marginTop: Spacing.sm, borderRadius: BorderRadius.lg,
    padding: Spacing.md, gap: Spacing.md, ...Shadows.sm,
  },
  convAvatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.primary[100],
    alignItems: 'center', justifyContent: 'center',
  },
  convAvatarText: { fontSize: 20, fontWeight: '700', color: Colors.primary[600] },
  convOnline: {
    position: 'absolute', bottom: 1, right: 1,
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: '#34D399', borderWidth: 2, borderColor: Colors.white,
  },
  convBody: { flex: 1 },
  convTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 },
  convName: { ...Typography.h4, color: Colors.textPrimary, flex: 1, marginRight: 8 },
  convTime: { ...Typography.caption, color: Colors.textMuted },
  convBottom: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  convLastMsg: { flex: 1, ...Typography.bodySm, color: Colors.textMuted },
  unreadBadge: {
    minWidth: 20, height: 20, borderRadius: 10,
    backgroundColor: Colors.primary[600],
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6,
  },
  unreadText: { ...Typography.caption, color: Colors.white, fontWeight: '700', fontSize: 10 },
  convListing: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    marginTop: 4, backgroundColor: Colors.gray[50],
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  convListingText: { ...Typography.caption, color: Colors.textMuted, fontSize: 10 },
});
