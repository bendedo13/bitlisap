import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../constants/theme';
import { useAuthStore } from '../../../store/authStore';

interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const userId = useAuthStore((s) => s.user?.id);
  const [message, setMessage] = useState('');
  const [messages] = useState<ChatMessage[]>([]);

  const handleSend = () => {
    if (!message.trim()) return;
    // Socket.IO ile mesaj gonder
    setMessage('');
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50"
      behavior={
        Platform.OS === 'ios' ? 'padding' : 'height'
      }
      keyboardVerticalOffset={90}
    >
      {messages.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Ionicons
            name="chatbubbles-outline"
            size={48}
            color="#ccc"
          />
          <Text className="text-gray-400 mt-2">
            Henüz mesaj yok
          </Text>
          <Text className="text-gray-300 text-sm">
            İlk mesajı gönderin
          </Text>
        </View>
      ) : (
        <FlatList
          data={messages}
          inverted
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => {
            const isMine = item.senderId === userId;
            return (
              <View
                className={`mb-2 max-w-[80%] ${
                  isMine
                    ? 'self-end'
                    : 'self-start'
                }`}
              >
                <View
                  style={{
                    backgroundColor: isMine
                      ? colors.primary
                      : '#fff',
                    borderRadius: 16,
                    padding: 12,
                  }}
                >
                  <Text
                    style={{
                      color: isMine
                        ? '#fff'
                        : '#333',
                    }}
                  >
                    {item.content}
                  </Text>
                </View>
              </View>
            );
          }}
        />
      )}

      <View className="flex-row items-center p-3 bg-white border-t border-gray-100">
        <TextInput
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-2"
          placeholder="Mesajınız..."
          value={message}
          onChangeText={setMessage}
          accessibilityLabel="Mesaj yaz"
        />
        <TouchableOpacity
          style={{
            backgroundColor: colors.primary,
          }}
          className="w-10 h-10 rounded-full items-center justify-center"
          onPress={handleSend}
          accessibilityLabel="Gönder"
        >
          <Ionicons
            name="send"
            size={18}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
