// หน้ารายชื่อแชท (route "/chats") — หน้าตาแบบแอปแชทยอดนิยม:
// ช่องค้นหา → แถวเพื่อนที่ออนไลน์ (เลื่อนแนวนอน) → รายการห้องแชทเรียงตามข้อความล่าสุด
import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '@/components/Avatar';
import { CHAT_COLOR, CONTACTS, Contact, Message } from '@/data/chats';
import { countUnread, formatChatTime, useChats } from '@/hooks/useChats';
import { useTheme } from '@/theme/ThemeProvider';

type ChatRow = {
  contact: Contact;
  last?: Message;
  unread: number;
  typing: boolean;
};

export default function ChatListScreen() {
  const { colors } = useTheme();
  const { messages, lastRead, typing } = useChats();
  const [query, setQuery] = useState('');

  const rows = useMemo<ChatRow[]>(() => {
    return CONTACTS.map((contact) => ({
      contact,
      last: messages.filter((m) => m.chatId === contact.id).at(-1),
      unread: countUnread(messages, contact.id, lastRead[contact.id] ?? 0),
      typing: typing.has(contact.id),
    })).sort((a, b) => (b.last?.createdAt ?? 0) - (a.last?.createdAt ?? 0));
  }, [messages, lastRead, typing]);

  const filtered = rows.filter((row) => row.contact.name.includes(query.trim()));
  const onlineContacts = CONTACTS.filter((contact) => contact.online);

  const header = (
    <>
      <View style={[styles.search, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="ค้นหา"
          placeholderTextColor={colors.textMuted}
          style={[styles.searchInput, { color: colors.text }]}
        />
      </View>

      {!query && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.activeRow}
        >
          {onlineContacts.map((contact) => (
            <Pressable
              key={contact.id}
              onPress={() => router.push(`/chats/${contact.id}`)}
              style={({ pressed }) => [styles.activeItem, pressed && styles.pressed]}
            >
              <Avatar name={contact.name} color={contact.color} size={60} online />
              <Text numberOfLines={1} style={[styles.activeName, { color: colors.textSecondary }]}>
                {contact.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </>
  );

  return (
    <FlatList
      data={filtered}
      keyExtractor={(row) => row.contact.id}
      ListHeaderComponent={header}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.content}
      ListEmptyComponent={
        <Text style={[styles.empty, { color: colors.textMuted }]}>ไม่พบแชทที่ค้นหา</Text>
      }
      renderItem={({ item }) => <ChatListItem row={item} />}
    />
  );
}

function ChatListItem({ row }: { row: ChatRow }) {
  const { colors } = useTheme();
  const { contact, last, unread, typing } = row;
  const hasUnread = unread > 0;

  let preview = 'เริ่มแชทกันเลย 👋';
  if (typing) preview = 'กำลังพิมพ์...';
  else if (last) preview = last.fromMe ? `คุณ: ${last.text}` : last.text;

  return (
    <Pressable
      onPress={() => router.push(`/chats/${contact.id}`)}
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.card }]}
    >
      <Avatar name={contact.name} color={contact.color} size={58} online={contact.online} />
      <View style={styles.rowText}>
        <Text
          numberOfLines={1}
          style={[styles.name, { color: colors.text }, hasUnread && styles.bold]}
        >
          {contact.name}
        </Text>
        <View style={styles.previewRow}>
          <Text
            numberOfLines={1}
            style={[
              styles.preview,
              { color: hasUnread || typing ? colors.text : colors.textSecondary },
              hasUnread && styles.bold,
              typing && { color: CHAT_COLOR },
            ]}
          >
            {preview}
          </Text>
          {last && (
            <Text style={[styles.time, { color: colors.textSecondary }]}>
              · {formatChatTime(last.createdAt)}
            </Text>
          )}
        </View>
      </View>
      {hasUnread && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{unread}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 40,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 8,
    paddingHorizontal: 14,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  activeRow: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    gap: 4,
  },
  activeItem: {
    width: 72,
    alignItems: 'center',
  },
  activeName: {
    fontSize: 12,
    marginTop: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  rowText: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  preview: {
    flexShrink: 1,
    fontSize: 14,
  },
  time: {
    fontSize: 14,
    marginLeft: 4,
  },
  bold: {
    fontWeight: '700',
  },
  unreadBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    paddingHorizontal: 6,
    backgroundColor: CHAT_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 15,
  },
  pressed: {
    opacity: 0.7,
  },
});
