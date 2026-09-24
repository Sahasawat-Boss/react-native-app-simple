// หน้าห้องแชท (route "/chats/:id") — ฟองข้อความซ้าย/ขวา, "กำลังพิมพ์...", ช่องพิมพ์ติดคีย์บอร์ด
// header ของ Stack ถูกซ่อน (ตั้งใน _layout.tsx) แล้วทำหัวเอง (รูป + ชื่อ + สถานะ) จึงต้องเว้นขอบบนตาม safe area เอง
import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '@/components/Avatar';
import { CHAT_COLOR, Contact, getContact, Message } from '@/data/chats';
import { useChats } from '@/hooks/useChats';
import { useTheme } from '@/theme/ThemeProvider';

// ห่างกันเกินเท่านี้ถือว่าเป็นคนละช่วงสนทนา → แสดงเวลาคั่น และไม่รวมฟองเป็นกลุ่มเดียวกัน
const GROUP_GAP = 10 * 60 * 1000;
const LIKE = '👍';

export default function ChatRoomScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const contact = getContact(id);
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { messages, typing, sendMessage, markRead } = useChats();
  const [text, setText] = useState('');

  const chatMessages = messages.filter((m) => m.chatId === id);

  // เปิดห้องอยู่ = อ่านแล้ว รวมถึงข้อความที่เข้ามาระหว่างเปิดหน้านี้อยู่
  useEffect(() => {
    markRead(id);
  }, [id, chatMessages.length, markRead]);

  if (!contact) {
    return (
      <View style={[styles.notFound, { paddingTop: insets.top }]}>
        <Text style={{ color: colors.textSecondary }}>ไม่พบแชท &quot;{id}&quot;</Text>
      </View>
    );
  }

  const send = (value: string) => {
    sendMessage(contact.id, value);
    setText('');
  };

  // FlatList แบบ inverted: รายการแรกอยู่ล่างสุด เลยต้องกลับลำดับเป็นใหม่ → เก่า
  // ข้อดีคือเปิดมาอยู่ที่ข้อความล่าสุดเลย และข้อความใหม่ต่อท้ายด้านล่างเองโดยไม่ต้องสั่ง scroll
  const reversed = [...chatMessages].reverse();
  const hasText = text.trim().length > 0;

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ChatHeader contact={contact} isTyping={typing.has(contact.id)} topInset={insets.top} />

      <FlatList
        style={styles.flex}
        data={reversed}
        inverted
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.messages}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={typing.has(contact.id) ? <TypingBubble contact={contact} /> : null}
        ListFooterComponent={<ChatIntro contact={contact} />}
        renderItem={({ item, index }) => (
          <MessageRow
            message={item}
            older={reversed[index + 1]}
            newer={reversed[index - 1]}
            contact={contact}
          />
        )}
      />

      <View
        style={[
          styles.inputBar,
          { paddingBottom: Math.max(insets.bottom, 10), borderTopColor: colors.border },
        ]}
      >
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Aa"
          placeholderTextColor={colors.textMuted}
          multiline
          style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
        />
        <Pressable
          onPress={() => send(hasText ? text : LIKE)}
          hitSlop={8}
          accessibilityLabel={hasText ? 'ส่งข้อความ' : 'ส่งไลก์'}
          style={({ pressed }) => [styles.sendButton, pressed && styles.pressed]}
        >
          {hasText ? (
            <Ionicons name="send" size={24} color={CHAT_COLOR} />
          ) : (
            <Text style={styles.likeIcon}>{LIKE}</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function ChatHeader({
  contact,
  isTyping,
  topInset,
}: {
  contact: Contact;
  isTyping: boolean;
  topInset: number;
}) {
  const { colors } = useTheme();
  let status = contact.lastSeen ?? '';
  if (isTyping) status = 'กำลังพิมพ์...';
  else if (contact.online) status = 'กำลังใช้งาน';

  return (
    <View
      style={[
        styles.header,
        { paddingTop: topInset + 6, borderBottomColor: colors.border, backgroundColor: colors.background },
      ]}
    >
      <Pressable onPress={() => router.back()} hitSlop={10} accessibilityLabel="ย้อนกลับ">
        <Ionicons name="chevron-back" size={28} color={CHAT_COLOR} />
      </Pressable>
      <Avatar name={contact.name} color={contact.color} size={38} online={contact.online} />
      <View style={styles.flex}>
        <Text numberOfLines={1} style={[styles.headerName, { color: colors.text }]}>
          {contact.name}
        </Text>
        {!!status && (
          <Text numberOfLines={1} style={[styles.headerStatus, { color: colors.textSecondary }]}>
            {status}
          </Text>
        )}
      </View>
      {/* ปุ่มโทร/วิดีโอคอลเป็นแค่หน้าตา ยังไม่ได้ทำงานจริง */}
      <Ionicons name="call" size={22} color={CHAT_COLOR} />
      <Ionicons name="videocam" size={24} color={CHAT_COLOR} />
    </View>
  );
}

// ส่วนบนสุดของห้อง (เลื่อนขึ้นไปจนสุด) แนะนำตัวเพื่อน
function ChatIntro({ contact }: { contact: Contact }) {
  const { colors } = useTheme();
  return (
    <View style={styles.intro}>
      <Avatar name={contact.name} color={contact.color} size={84} />
      <Text style={[styles.introName, { color: colors.text }]}>{contact.name}</Text>
      <Text style={[styles.introText, { color: colors.textSecondary }]}>
        คุณเป็นเพื่อนกันแล้ว เริ่มแชทได้เลย
      </Text>
    </View>
  );
}

function MessageRow({
  message,
  older,
  newer,
  contact,
}: {
  message: Message;
  older?: Message;
  newer?: Message;
  contact: Contact;
}) {
  const { colors, mode } = useTheme();
  const { fromMe, text } = message;

  // ฟองติดกันจากคนเดียวกันรวมเป็น "กลุ่ม" — มุมด้านที่ติดกันจะมนน้อยลง และโชว์รูปแค่ฟองสุดท้าย
  const newSession = !older || message.createdAt - older.createdAt > GROUP_GAP;
  const isFirst = !older || newSession || older.fromMe !== fromMe;
  const isLast =
    !newer || newer.fromMe !== fromMe || newer.createdAt - message.createdAt > GROUP_GAP;

  const big = 18;
  const small = 4;
  const corners = fromMe
    ? {
        borderTopRightRadius: isFirst ? big : small,
        borderBottomRightRadius: isLast ? big : small,
      }
    : {
        borderTopLeftRadius: isFirst ? big : small,
        borderBottomLeftRadius: isLast ? big : small,
      };

  const theirBubble = mode === 'dark' ? '#303030' : '#e9e9eb';
  const isLike = text === LIKE;

  return (
    <View>
      {newSession && (
        <Text style={[styles.sessionTime, { color: colors.textMuted }]}>
          {new Date(message.createdAt).toLocaleString('th-TH', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      )}
      <View
        style={[
          styles.messageRow,
          fromMe ? styles.rowMine : styles.rowTheirs,
          isLast ? styles.groupEnd : styles.groupMiddle,
        ]}
      >
        {!fromMe && (
          <View style={styles.avatarSlot}>
            {isLast && <Avatar name={contact.name} color={contact.color} size={28} />}
          </View>
        )}
        {isLike ? (
          <Text style={styles.bigLike}>{LIKE}</Text>
        ) : (
          <View
            style={[
              styles.bubble,
              corners,
              { backgroundColor: fromMe ? CHAT_COLOR : theirBubble },
            ]}
          >
            <Text style={[styles.bubbleText, { color: fromMe ? '#fff' : colors.text }]}>
              {text}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

// ฟอง "..." ตอนเพื่อนกำลังพิมพ์ จุดสามจุดกระพริบไล่กัน
function TypingBubble({ contact }: { contact: Contact }) {
  const { mode } = useTheme();
  return (
    <View style={[styles.messageRow, styles.rowTheirs, styles.groupEnd]}>
      <View style={styles.avatarSlot}>
        <Avatar name={contact.name} color={contact.color} size={28} />
      </View>
      <View
        style={[
          styles.bubble,
          styles.typingBubble,
          { backgroundColor: mode === 'dark' ? '#303030' : '#e9e9eb' },
        ]}
      >
        {[0, 1, 2].map((i) => (
          <TypingDot key={i} delay={i * 150} />
        ))}
      </View>
    </View>
  );
}

function TypingDot({ delay }: { delay: number }) {
  const [on, setOn] = useState(false);

  // สลับความเข้มของจุดเป็นจังหวะ (แบบง่ายด้วย setInterval ไม่ต้องใช้ library animation)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      interval = setInterval(() => setOn((v) => !v), 450);
    }, delay);
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [delay]);

  return <View style={[styles.typingDot, { opacity: on ? 1 : 0.35 }]} />;
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '700',
  },
  headerStatus: {
    fontSize: 12,
    marginTop: 1,
  },
  messages: {
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  intro: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 16,
  },
  introName: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 10,
  },
  introText: {
    fontSize: 13,
    marginTop: 4,
  },
  sessionTime: {
    textAlign: 'center',
    fontSize: 12,
    marginVertical: 12,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  rowMine: {
    justifyContent: 'flex-end',
  },
  rowTheirs: {
    justifyContent: 'flex-start',
  },
  groupMiddle: {
    marginBottom: 2,
  },
  groupEnd: {
    marginBottom: 10,
  },
  avatarSlot: {
    width: 28,
    marginRight: 8,
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: 18,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  bubbleText: {
    fontSize: 16,
    lineHeight: 21,
  },
  bigLike: {
    fontSize: 44,
  },
  typingBubble: {
    flexDirection: 'row',
    gap: 4,
    paddingVertical: 14,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8e8e93',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: 12,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    maxHeight: 120,
    minHeight: 38,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingTop: 9,
    paddingBottom: 9,
    fontSize: 16,
  },
  sendButton: {
    height: 38,
    justifyContent: 'center',
  },
  likeIcon: {
    fontSize: 28,
  },
  pressed: {
    opacity: 0.6,
  },
});
