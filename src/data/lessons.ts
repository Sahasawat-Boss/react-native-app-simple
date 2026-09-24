// ข้อมูลบทเรียน (อยู่นอก src/app/ เพราะไม่ใช่หน้าจอ)
// หน้า /lessons แสดงรายการจาก array นี้ ส่วน /lessons/[id] หาบทเรียนจาก id
import { Ionicons } from '@expo/vector-icons';

export type LessonSection = {
  heading: string;
  body: string;
  code?: string;
};

export type Lesson = {
  id: string;
  title: string;
  summary: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  sections: LessonSection[];
};

export const LESSONS: Lesson[] = [
  {
    id: 'components',
    title: 'Components พื้นฐาน',
    summary: 'View, Text, Pressable แทน div, span, button',
    icon: 'cube-outline',
    color: '#2563eb',
    sections: [
      {
        heading: 'ไม่มี HTML',
        body: 'React Native ไม่มี <div> หรือ <span> ต้องใช้ component ที่แปลงเป็น native view ของ iOS/Android แทน',
        code: '<View>      // ≈ <div>\n<Text>      // ≈ <span>, <p>\n<Image>     // ≈ <img>\n<TextInput> // ≈ <input>',
      },
      {
        heading: 'ข้อความต้องอยู่ใน <Text> เสมอ',
        body: 'ถ้าใส่ข้อความตรงๆ ใน <View> แอปจะ error ทันที ต่างจากเว็บที่ใส่ข้อความใน <div> ได้เลย',
      },
      {
        heading: 'กดได้ต้องใช้ Pressable',
        body: 'ไม่มี onClick ใช้ onPress บน <Pressable> หรือ <TouchableOpacity> แทน',
        code: '<Pressable onPress={() => alert("hi")}>\n  <Text>กดฉัน</Text>\n</Pressable>',
      },
    ],
  },
  {
    id: 'styling',
    title: 'การจัด Style',
    summary: 'StyleSheet และ Flexbox แทน CSS/Tailwind',
    icon: 'color-palette-outline',
    color: '#db2777',
    sections: [
      {
        heading: 'Style เป็น JavaScript object',
        body: 'ไม่มีไฟล์ CSS หรือ className ชื่อ property เป็น camelCase และตัวเลขไม่ต้องใส่หน่วย px',
        code: 'const styles = StyleSheet.create({\n  box: { backgroundColor: "#fff", padding: 16 },\n});\n\n<View style={styles.box} />',
      },
      {
        heading: 'Flexbox เป็นค่าเริ่มต้น',
        body: 'ทุก View เป็น flex อยู่แล้ว แต่ flexDirection เริ่มต้นเป็น column (บนเว็บเป็น row) จะเรียงแนวนอนต้องใส่ flexDirection: "row" เอง',
      },
      {
        heading: 'รวมหลาย style ด้วย array',
        body: 'ส่ง array เข้า style ได้ ตัวหลังจะทับตัวหน้า คล้ายการต่อ className แบบมีเงื่อนไข',
        code: '<Text style={[styles.title, done && styles.done]} />',
      },
    ],
  },
  {
    id: 'navigation',
    title: 'Navigation',
    summary: 'Expo Router: ไฟล์ = หน้าจอ เหมือน Next.js',
    icon: 'git-branch-outline',
    color: '#d97706',
    sections: [
      {
        heading: 'ไฟล์ใน src/app/ คือหน้าจอ',
        body: 'ชื่อไฟล์กลายเป็น URL เหมือน App Router ของ Next.js',
        code: 'src/app/index.tsx          → /\nsrc/app/lessons/index.tsx  → /lessons\nsrc/app/lessons/[id].tsx   → /lessons/styling',
      },
      {
        heading: 'Dynamic route',
        body: 'ไฟล์ชื่อ [id].tsx รับค่าจาก URL ได้ อ่านค่าด้วย useLocalSearchParams (หน้านี้ที่คุณอ่านอยู่ก็ทำแบบนี้)',
        code: 'const { id } = useLocalSearchParams<{ id: string }>();',
      },
      {
        heading: 'Stack navigator',
        body: 'กดเข้าหน้าใหม่ = ซ้อนหน้าขึ้นไปบน stack กด back หรือปัดขอบจอ = เอาหน้าบนสุดออก',
      },
    ],
  },
];
