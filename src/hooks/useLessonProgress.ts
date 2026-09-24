// ความคืบหน้าของหลักสูตร: เก็บว่าเรียนบทไหนจบแล้ว ลง AsyncStorage
// หน้ารายการและหน้ารายละเอียดต้องเห็นค่าเดียวกันทันที จึงเก็บ state ไว้ระดับโมดูล (นอก component)
// แล้วให้ทุกหน้า subscribe ผ่าน useSyncExternalStore — แนวคิดเดียวกับ store เล็กๆ แบบ Zustand
import { useCallback, useEffect, useSyncExternalStore } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@notes_app/lesson-progress';

// ต้องสร้าง Set ใหม่ทุกครั้งที่เปลี่ยน React จะได้รู้ว่าค่าเปลี่ยน (เทียบด้วย reference)
let completed: ReadonlySet<string> = new Set();
let loadStarted = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return completed;
}

async function loadOnce() {
  if (loadStarted) return;
  loadStarted = true;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    // รวมกับค่าที่อาจถูกกดระหว่างรอโหลด จะได้ไม่ทับกัน
    completed = new Set([...(JSON.parse(raw) as string[]), ...completed]);
    emit();
  } catch (error) {
    console.error('Failed to load lesson progress', error);
  }
}

export function useLessonProgress() {
  const done = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  useEffect(() => {
    loadOnce();
  }, []);

  const toggleDone = useCallback((id: string) => {
    const next = new Set(completed);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    completed = next;
    emit();
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...next])).catch((error) =>
      console.error('Failed to save lesson progress', error)
    );
  }, []);

  return { done, toggleDone };
}
