// store ของเมนูแชท: ข้อความทั้งหมด + เวลาที่อ่านล่าสุดของแต่ละห้อง (ไว้นับข้อความที่ยังไม่อ่าน)
// หน้ารายชื่อแชทกับหน้าห้องแชทต้องเห็นค่าเดียวกันทันที จึงใช้ store ระดับโมดูล + useSyncExternalStore
// แบบเดียวกับ useLessonProgress
import { useCallback, useEffect, useSyncExternalStore } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONTACTS, createSeedMessages, getContact, Message } from '@/data/chats';

const STORAGE_KEY = '@notes_app/chats';

type ChatState = {
  loaded: boolean;
  messages: Message[]; // เรียงจากเก่าไปใหม่
  lastRead: Record<string, number>; // chatId → timestamp ที่เปิดอ่านล่าสุด
  typing: ReadonlySet<string>; // ห้องที่เพื่อนกำลังพิมพ์ (ไม่ต้องบันทึกลงเครื่อง)
};

let state: ChatState = { loaded: false, messages: [], lastRead: {}, typing: new Set() };
let loadStarted = false;
const listeners = new Set<() => void>();

// ต้องสร้าง object ใหม่ทุกครั้ง React จะได้รู้ว่าค่าเปลี่ยน
function setState(patch: Partial<ChatState>, persist = true) {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener());
  if (persist) {
    const { messages, lastRead } = state;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, lastRead })).catch((error) =>
      console.error('Failed to save chats', error)
    );
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return state;
}

async function loadOnce() {
  if (loadStarted) return;
  loadStarted = true;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as Pick<ChatState, 'messages' | 'lastRead'>;
      setState({ ...saved, loaded: true }, false);
      return;
    }
  } catch (error) {
    console.error('Failed to load chats', error);
  }

  // เปิดครั้งแรก: ใส่ข้อความตัวอย่าง และตั้งให้บางห้องมีข้อความที่ยังไม่อ่าน
  const now = Date.now();
  const lastRead: Record<string, number> = {};
  CONTACTS.forEach((contact) => (lastRead[contact.id] = now));
  lastRead.mint = now - 7.5 * 60 * 1000;
  lastRead.team = 0;
  setState({ messages: createSeedMessages(now), lastRead, loaded: true });
}

// เพื่อนตอบกลับอัตโนมัติ: โชว์ "กำลังพิมพ์..." สักพักแล้วส่งข้อความสุ่ม
function scheduleReply(chatId: string) {
  const contact = getContact(chatId);
  if (!contact || state.typing.has(chatId)) return;

  setTimeout(() => {
    setState({ typing: new Set(state.typing).add(chatId) }, false);

    setTimeout(() => {
      const typing = new Set(state.typing);
      typing.delete(chatId);
      const text = contact.replies[Math.floor(Math.random() * contact.replies.length)];
      const reply: Message = {
        id: `${Date.now()}-reply`,
        chatId,
        fromMe: false,
        text,
        createdAt: Date.now(),
      };
      setState({ typing, messages: [...state.messages, reply] });
    }, 1500 + Math.random() * 1500);
  }, 600);
}

export function useChats() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  useEffect(() => {
    loadOnce();
  }, []);

  const sendMessage = useCallback((chatId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const message: Message = {
      id: `${Date.now()}-me`,
      chatId,
      fromMe: true,
      text: trimmed,
      createdAt: Date.now(),
    };
    setState({
      messages: [...state.messages, message],
      lastRead: { ...state.lastRead, [chatId]: message.createdAt },
    });
    scheduleReply(chatId);
  }, []);

  const markRead = useCallback((chatId: string) => {
    const latest = state.messages.filter((m) => m.chatId === chatId).at(-1);
    if (!latest || (state.lastRead[chatId] ?? 0) >= latest.createdAt) return;
    setState({ lastRead: { ...state.lastRead, [chatId]: latest.createdAt } });
  }, []);

  return { ...snapshot, sendMessage, markRead };
}

export function countUnread(messages: Message[], chatId: string, lastRead: number) {
  return messages.filter((m) => m.chatId === chatId && !m.fromMe && m.createdAt > lastRead)
    .length;
}

// เวลาแบบสั้นในรายชื่อแชท: วันนี้ → "14:05", เมื่อวาน → "เมื่อวาน", เก่ากว่า → "12 ก.ย."
export function formatChatTime(timestamp: number) {
  const date = new Date(timestamp);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  if (timestamp >= startOfToday) {
    return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  }
  if (timestamp >= startOfToday - 24 * 60 * 60 * 1000) return 'เมื่อวาน';
  return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
}
