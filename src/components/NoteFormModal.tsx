// Modal สำหรับเพิ่ม/แก้ไขโน้ต ใช้ component <Modal> ในตัวของ React Native
// KeyboardAvoidingView ใช้ดันฟอร์มขึ้นตอนคีย์บอร์ดเปิด (ปัญหาที่เว็บไม่ค่อยเจอแต่ mobile เจอบ่อย)
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { Note } from '../types/note';
import { useTheme } from '../theme/ThemeProvider';

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
  const { colors } = useTheme();
  const canSave = title.trim().length > 0;

  const handleSubmit = () => {
    if (!canSave) return;
    onSubmit(title, content);
    onClose();
  };

  return (
    <View style={styles.overlay}>
      {/* กดพื้นที่มืดด้านบนเพื่อปิด */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="ปิด" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[styles.sheet, { backgroundColor: colors.card }]}
      >
        <View style={[styles.handle, { backgroundColor: colors.border }]} />

        <Text style={[styles.heading, { color: colors.text }]}>
          {editingNote ? 'แก้ไขรายการ' : 'เพิ่มรายการใหม่'}
        </Text>

        <FormInput
          label="หัวข้อ"
          placeholder="เช่น อ่านบทเรียน Navigation"
          value={title}
          onChangeText={setTitle}
          autoFocus
        />
        <FormInput
          label="รายละเอียด"
          placeholder="ไม่บังคับ"
          value={content}
          onChangeText={setContent}
          multiline
          style={styles.textArea}
        />

        <View style={styles.buttonRow}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: colors.background },
              pressed && styles.pressed,
            ]}
            onPress={onClose}
          >
            <Text style={[styles.buttonText, { color: colors.textSecondary }]}>ยกเลิก</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: colors.primary },
              !canSave && styles.disabled,
              pressed && canSave && styles.pressed,
            ]}
            onPress={handleSubmit}
            disabled={!canSave}
          >
            <Text style={[styles.buttonText, { color: '#fff' }]}>บันทึก</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

// ช่องกรอกพร้อม label และเส้นขอบสีหลักตอนกำลังพิมพ์ (focus)
function FormInput({ label, style, ...inputProps }: TextInputProps & { label: string }) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <TextInput
        {...inputProps}
        placeholderTextColor={colors.textMuted}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          styles.input,
          {
            backgroundColor: colors.background,
            color: colors.text,
            borderColor: focused ? colors.primary : 'transparent',
          },
          style,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(2,6,23,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 36,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 18,
  },
  heading: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 18,
  },
  field: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    marginLeft: 2,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  textArea: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.4,
  },
});
