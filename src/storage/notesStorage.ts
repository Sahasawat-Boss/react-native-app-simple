// เลเยอร์เก็บข้อมูลถาวรบนเครื่อง (คล้าย localStorage บนเว็บ แต่เป็น async ทั้งหมด)
// AsyncStorage เก็บได้แค่ string key-value จึงต้อง JSON.stringify / JSON.parse เอง
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from '../types/note';

const STORAGE_KEY = '@notes_app/notes';

export async function loadNotes(): Promise<Note[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Note[];
  } catch (error) {
    console.error('Failed to load notes', error);
    return [];
  }
}

export async function saveNotes(notes: Note[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error('Failed to save notes', error);
  }
}
