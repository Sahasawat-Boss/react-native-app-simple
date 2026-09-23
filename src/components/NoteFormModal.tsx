// Modal สำหรับเพิ่ม/แก้ไขโน้ต ใช้ component <Modal> ในตัวของ React Native
// KeyboardAvoidingView ใช้ดันฟอร์มขึ้นตอนคีย์บอร์ดเปิด (ปัญหาที่เว็บไม่ค่อยเจอแต่ mobile เจอบ่อย)
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Note } from '../types/note';

type Props = {
  visible: boolean;
  editingNote: Note | null; // null = โหมดเพิ่มใหม่, ไม่ null = โหมดแก้ไข
  onClose: () => void;
  onSubmit: (title: string, content: string) => void;
};

export function NoteFormModal({ visible, editingNote, onClose, onSubmit }: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      {/* Modal จะ mount ลูกใหม่ทุกครั้งที่เปิด ฟอร์มจึงได้ค่าเริ่มต้นใหม่เองโดยไม่ต้องใช้ useEffect */}
      <NoteForm editingNote={editingNote} onClose={onClose} onSubmit={onSubmit} />
    </Modal>
  );
}

function NoteForm({ editingNote, onClose, onSubmit }: Omit<Props, 'visible'>) {
  // เติมค่าจาก editingNote (โหมดแก้ไข) หรือว่าง (โหมดเพิ่มใหม่) ตอน mount
  const [title, setTitle] = useState(editingNote?.title ?? '');
  const [content, setContent] = useState(editingNote?.content ?? '');

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit(title, content);
    onClose();
  };

  return (
    <View style={styles.overlay}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.sheet}
      >
        <Text style={styles.heading}>
          {editingNote ? 'แก้ไขรายการ' : 'เพิ่มรายการใหม่'}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="หัวข้อ"
          value={title}
          onChangeText={setTitle}
          autoFocus
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="รายละเอียด (ไม่บังคับ)"
          value={content}
          onChangeText={setContent}
          multiline
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>ยกเลิก</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
            <Text style={styles.saveText}>บันทึก</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 32,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#111827',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    marginBottom: 12,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 8,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelText: {
    color: '#6b7280',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
  },
});
