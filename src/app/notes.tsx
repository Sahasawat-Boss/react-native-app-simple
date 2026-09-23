// หน้าบันทึก (route "/notes") — ประกอบ hook + components เข้าด้วยกัน
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNotes } from '@/hooks/useNotes';
import { NoteItem } from '@/components/NoteItem';
import { NoteFormModal } from '@/components/NoteFormModal';
import { Note } from '@/types/note';

export default function NotesScreen() {
  const { notes, isLoading, addNote, toggleDone, deleteNote, updateNote } = useNotes();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  // header ด้านบนจัดการ safe area ให้แล้ว เหลือแค่ขอบล่าง (home indicator) สำหรับปุ่ม +
  const insets = useSafeAreaInsets();

  const remainingCount = useMemo(() => notes.filter((n) => !n.done).length, [notes]);

  const openAddModal = () => {
    setEditingNote(null);
    setModalVisible(true);
  };

  const openEditModal = (note: Note) => {
    setEditingNote(note);
    setModalVisible(true);
  };

  const handleSubmit = (title: string, content: string) => {
    if (editingNote) {
      updateNote(editingNote.id, title, content);
    } else {
      addNote(title, content);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>
        {isLoading ? 'กำลังโหลด...' : `เหลือ ${remainingCount} รายการที่ยังไม่เสร็จ`}
      </Text>

      {!isLoading && notes.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="document-text-outline" size={48} color="#d1d5db" />
          <Text style={styles.emptyText}>ยังไม่มีรายการ กดปุ่ม + เพื่อเริ่มเพิ่ม</Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.listContent, { paddingBottom: 100 + insets.bottom }]}
          renderItem={({ item }) => (
            <NoteItem
              note={item}
              onToggle={toggleDone}
              onDelete={deleteNote}
              onPress={openEditModal}
            />
          )}
        />
      )}

      <TouchableOpacity
        style={[styles.fab, { bottom: 30 + insets.bottom }]}
        onPress={openAddModal}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <NoteFormModal
        visible={modalVisible}
        editingNote={editingNote}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 8,
  },
  listContent: {
    padding: 20,
    paddingTop: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 40,
  },
  emptyText: {
    color: '#9ca3af',
    textAlign: 'center',
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
});
