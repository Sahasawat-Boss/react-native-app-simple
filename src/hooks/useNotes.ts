// Custom hook: รวม logic ทั้งหมดของการจัดการ notes ไว้ที่เดียว
// (เหมือน custom hook ที่คุณเคยใช้ใน React/Next.js — concept เดียวกันเป๊ะ)
import { useCallback, useEffect, useState } from 'react';
import { Note } from '../types/note';
import { loadNotes, saveNotes } from '../storage/notesStorage';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // โหลดข้อมูลจาก AsyncStorage ตอนแอปเปิดครั้งแรก
  useEffect(() => {
    (async () => {
      const stored = await loadNotes();
      setNotes(stored);
      setIsLoading(false);
    })();
  }, []);

  // ทุกครั้งที่ notes เปลี่ยน ให้บันทึกลง storage อัตโนมัติ (ยกเว้นตอนกำลังโหลดครั้งแรก)
  useEffect(() => {
    if (!isLoading) {
      saveNotes(notes);
    }
  }, [notes, isLoading]);

  const addNote = useCallback((title: string, content: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      done: false,
      createdAt: Date.now(),
    };
    setNotes((prev) => [newNote, ...prev]);
  }, []);

  const toggleDone = useCallback((id: string) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, done: !note.done } : note))
    );
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  }, []);

  const updateNote = useCallback((id: string, title: string, content: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, title: title.trim(), content: content.trim() } : note
      )
    );
  }, []);

  return { notes, isLoading, addNote, toggleDone, deleteNote, updateNote };
}
