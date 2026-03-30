import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../services/api';
import { useAuthStore } from '../../../store/authStore';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../../constants/theme';

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Bugün';
  if (d.toDateString() === yesterday.toDateString()) return 'Dün';
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
}

function MessageBubble({ message, isMine }: { message: any; isMine: boolean }) {
  return (
    <View style={[styles.bubbleWrap, isMine ? styles.bubbleRight : styles.bubbleLeft]}>
      {!isMine && (
        <View style={styles.msgAvatar}>
          <Text style={styles.msgAvatarText}>{message.sender?.fullName?.charAt(0) || '?'}</Text>
        </View>
      )}
      <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleTheirs]}>
        {!isMine && (
          <Text style={styles.bubbleSender}>{message.sender?.fullName || 'Kullanıcı'}</Text>
        )}
        <Text style={[styles.bubbleText, isMine && { color: Colors.white }]}>
          {message.content}
        </Text>
        <View style={styles.bubbleMeta}>
          <Text style={[styles.bubbleTime, isMine && { color: 'rgba(255,255,255,0.65)' }]}>
            {formatTime(message.createdAt)}
          </Text>
          {isMine && (
            <Ionicons
              name={message.isRead ? 'checkmark-done' : 'checkmark'}
              size={14}
              color={message.isRead ? '#34D399' : 'rgba(255,255,255,0.5)'}
            />
          )}
        </View>
      </View>
    </View>
  );
}

function DateSeparator({ date }: { date: string }) {
  return (
    <View style={styles.dateSep}>
      <View style={styles.dateSepLine} />
      <View style={styles.dateSepBadge}>
        <Text style={styles.dateSepText}>{formatDate(date)}</Text>
      </View>
      <View style={styles.dateSepLine} />
    </View>
  );
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const flatListRef = useRef<FlatList>(null);
  const [text, setText] = useState('');

  const { data: convData, isLoading } = useQuery({
    queryKey: ['conversation', id],
    queryFn: async () => {
      const res = await api.get(`/messages/conversations/${id}`);
      return res.data;
    },
  });

  const sendMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await api.post(`/messages/conversations/${id}/send`, { content });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversation', id] });
    },
  });

  const messages = convData?.messages ?? [];
  const otherUser = convData?.conversation?.user1Id === user?.id
    ? convData?.conversation?.user2
    : convData?.conversation?.user1;

  const handleSend = () => {
    if (!text.trim()) return;
    sendMutation.mutate(text.trim());
    setText('');
  };

  const renderItem = useCallback(({ item, index }: { item: any; index: number }) => {
    const isMine = item.senderId === user?.id;
    const prevMsg = index < messages.length - 1 ? messages[index + 1] : null;
    const showDate = !prevMsg || new Date(item.createdAt).toDateString() !== new Date(prevMsg.createdAt).toDateString();
    return (
      <View>
        {showDate && <DateSeparator date={item.createdAt} />}
        <MessageBubble message={item} isMine={isMine} />
      </View>
    );
  }, [messages, user?.id]);

  if (isLoading) {
    return <View style={styles.loading}><ActivityIndicator color={Colors.primary[500]} size="large" /></View>;
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.headerAvatar}>
          <Text style={styles.headerAvatarText}>{otherUser?.fullName?.charAt(0) || '?'}</Text>
          {otherUser?.isOnline && <View style={styles.onlineDot} />}
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName} numberOfLines={1}>{otherUser?.fullName || 'Kullanıcı'}</Text>
          <Text style={styles.headerStatus}>
            {otherUser?.isOnline ? 'Çevrimiçi' : 'Çevrimdışı'}
          </Text>
        </View>
        <TouchableOpacity style={styles.headerAction}>
          <Ionicons name="call-outline" size={20} color={Colors.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerAction}>
          <Ionicons name="ellipsis-vertical" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <View style={styles.chatArea}>
        {messages.length === 0 ? (
          <View style={styles.emptyChat}>
            <View style={styles.emptyChatIcon}>
              <Ionicons name="chatbubbles-outline" size={48} color={Colors.primary[300]} />
            </View>
            <Text style={styles.emptyChatTitle}>Henüz mesaj yok</Text>
            <Text style={styles.emptyChatSub}>İlk mesajı gönderin ve sohbete başlayın!</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item: any) => item.id}
            inverted
            contentContainerStyle={{ paddingVertical: 12, paddingHorizontal: Spacing.md }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <TouchableOpacity style={styles.attachBtn}>
          <Ionicons name="add-circle-outline" size={26} color={Colors.primary[500]} />
        </TouchableOpacity>
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder="Mesajınız..."
            placeholderTextColor={Colors.gray[400]}
            value={text}
            onChangeText={setText}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity style={styles.emojiBtn}>
            <Ionicons name="happy-outline" size={22} color={Colors.gray[400]} />
          </TouchableOpacity>
        </View>
        {text.trim() ? (
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend} activeOpacity={0.8}>
            <Ionicons name="send" size={18} color={Colors.white} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.micBtn}>
            <Ionicons name="mic-outline" size={24} color={Colors.primary[500]} />
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#ECE5DD' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background },

  header: {
    backgroundColor: Colors.primary[800],
    flexDirection: 'row', alignItems: 'center',
    paddingTop: (StatusBar.currentHeight || 44) + 4,
    paddingBottom: 10, paddingHorizontal: Spacing.sm, gap: 8,
  },
  backBtn: { padding: 6 },
  headerAvatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: Colors.primary[500],
    alignItems: 'center', justifyContent: 'center',
  },
  headerAvatarText: { fontSize: 18, fontWeight: '700', color: Colors.white },
  onlineDot: {
    position: 'absolute', bottom: 0, right: 0,
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: '#34D399', borderWidth: 2, borderColor: Colors.primary[800],
  },
  headerInfo: { flex: 1 },
  headerName: { ...Typography.h4, color: Colors.white },
  headerStatus: { ...Typography.caption, color: 'rgba(255,255,255,0.6)' },
  headerAction: { padding: 8 },

  chatArea: { flex: 1 },
  emptyChat: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xl },
  emptyChatIcon: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: Colors.primary[50], alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  emptyChatTitle: { ...Typography.h3, color: Colors.textPrimary, marginBottom: 6 },
  emptyChatSub: { ...Typography.body, color: Colors.textMuted, textAlign: 'center' },

  bubbleWrap: { flexDirection: 'row', marginBottom: 4, alignItems: 'flex-end' },
  bubbleRight: { justifyContent: 'flex-end' },
  bubbleLeft: { justifyContent: 'flex-start' },
  msgAvatar: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.stone[200], alignItems: 'center', justifyContent: 'center',
    marginRight: 6, marginBottom: 2,
  },
  msgAvatarText: { fontSize: 12, fontWeight: '600', color: Colors.stone[700] },
  bubble: { maxWidth: '75%', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 8 },
  bubbleMine: { backgroundColor: Colors.primary[600], borderBottomRightRadius: 4 },
  bubbleTheirs: { backgroundColor: Colors.white, borderBottomLeftRadius: 4, ...Shadows.sm },
  bubbleSender: { ...Typography.label, color: Colors.primary[500], marginBottom: 2 },
  bubbleText: { ...Typography.body, color: Colors.textPrimary, lineHeight: 22 },
  bubbleMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 3, marginTop: 2 },
  bubbleTime: { ...Typography.caption, color: Colors.textMuted, fontSize: 10 },

  dateSep: { flexDirection: 'row', alignItems: 'center', marginVertical: 12 },
  dateSepLine: { flex: 1, height: 1, backgroundColor: 'rgba(0,0,0,0.1)' },
  dateSepBadge: {
    backgroundColor: 'rgba(0,0,0,0.08)', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: BorderRadius.full, marginHorizontal: 8,
  },
  dateSepText: { ...Typography.caption, color: Colors.textMuted, fontSize: 11 },

  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end',
    paddingHorizontal: Spacing.sm, paddingVertical: Spacing.sm,
    backgroundColor: Colors.white, gap: 6,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  attachBtn: { padding: 6, paddingBottom: 8 },
  inputWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'flex-end',
    backgroundColor: Colors.gray[50], borderRadius: 24,
    paddingHorizontal: 14, minHeight: 44,
  },
  input: {
    flex: 1, ...Typography.body, color: Colors.textPrimary,
    paddingVertical: 10, maxHeight: 100,
  },
  emojiBtn: { padding: 6, paddingBottom: 10 },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.primary[600],
    alignItems: 'center', justifyContent: 'center',
    ...Shadows.md,
  },
  micBtn: { padding: 6, paddingBottom: 8 },
});
