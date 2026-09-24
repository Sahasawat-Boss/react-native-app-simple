// ข้อมูลหลักสูตร (อยู่นอก src/app/ เพราะไม่ใช่หน้าจอ)
// จัดเป็น "โมดูล" หลายบท — หน้า /lessons แสดงตามโมดูล ส่วน /lessons/[id] หาบทเรียนจาก id
// เพิ่มบทใหม่: ใส่ object ใน lessons ของโมดูลที่ต้องการ (id ต้องไม่ซ้ำ เพราะใช้เป็น URL และเก็บความคืบหน้า)
import { Ionicons } from '@expo/vector-icons';

export type LessonSection = {
  heading: string;
  body: string;
  code?: string;
};

type LessonContent = {
  id: string;
  title: string;
  summary: string;
  icon: keyof typeof Ionicons.glyphMap;
  sections: LessonSection[];
};

export type Module = {
  id: string;
  title: string;
  description: string;
  color: string; // ทุกบทในโมดูลใช้สีเดียวกัน
  lessons: LessonContent[];
};

// บทเรียนที่ "แบน" แล้ว พร้อมข้อมูลโมดูลและลำดับ ใช้ในหน้ารายละเอียด
export type Lesson = LessonContent & {
  color: string;
  moduleId: string;
  moduleTitle: string;
  number: number; // ลำดับบทในทั้งหลักสูตร เริ่มที่ 1
};

export const MODULES: Module[] = [
  {
    id: 'start',
    title: 'เริ่มต้น',
    description: 'React Native กับ Expo ทำงานยังไง',
    color: '#5b5bd6',
    lessons: [
      {
        id: 'intro',
        title: 'React Native คืออะไร',
        summary: 'เขียน React ครั้งเดียว ได้แอป native ทั้ง iOS และ Android',
        icon: 'rocket-outline',
        sections: [
          {
            heading: 'ไม่ใช่เว็บที่ห่อไว้ในแอป',
            body: 'โค้ด JavaScript ของเราทำหน้าที่เป็น "สมอง" (state, logic) ส่วนสิ่งที่เห็นบนจอคือ view จริงของ iOS/Android เช่น <View> กลายเป็น UIView บน iPhone แอปจึงลื่นและหน้าตาเป็นธรรมชาติกว่าเว็บใน WebView',
          },
          {
            heading: 'Expo คือ Next.js ของ React Native',
            body: 'React Native ให้ของพื้นฐานมา Expo เติมสิ่งที่ต้องใช้จริงให้ครบ: ระบบ routing (Expo Router), โมดูลเข้าถึงกล้อง/ตำแหน่ง/การแจ้งเตือน, และบริการ build ขึ้น store (EAS) แบบเดียวกับที่ Next.js เติมให้ React',
          },
          {
            heading: 'รันแอปครั้งแรก',
            body: 'สั่ง expo start แล้วสแกน QR ด้วยแอป Expo Go บนมือถือ หรือกดปุ่มลัดในเทอร์มินัลเพื่อเปิดใน emulator / เบราว์เซอร์ แก้โค้ดแล้วแอปรีโหลดทันทีเหมือน hot reload บนเว็บ',
            code: `npx expo start

# ในเทอร์มินัลที่รันอยู่:
# a → เปิดใน Android emulator
# i → เปิดใน iOS simulator (เฉพาะ Mac)
# w → เปิดในเบราว์เซอร์
# r → รีโหลดแอป`,
          },
        ],
      },
      {
        id: 'project-structure',
        title: 'โครงสร้างโปรเจกต์',
        summary: 'แต่ละโฟลเดอร์มีหน้าที่อะไร และทำไมไม่มีโฟลเดอร์ ios/android',
        icon: 'folder-open-outline',
        sections: [
          {
            heading: 'หน้าตาโปรเจกต์นี้',
            body: 'เฉพาะ src/app/ เท่านั้นที่เป็นหน้าจอ ที่เหลือแยกตามหน้าที่แบบเดียวกับโปรเจกต์ React ทั่วไป',
            code: `src/
  app/          ← หน้าจอ (ไฟล์ = route)
  components/   ← UI ที่ใช้ซ้ำ
  hooks/        ← custom hooks
  data/         ← ข้อมูลคงที่ (เช่นบทเรียนนี้)
  storage/      ← อ่าน/เขียนข้อมูลลงเครื่อง
  theme/        ← สีและโหมดมืด
app.json        ← ตั้งค่าแอป
package.json`,
          },
          {
            heading: 'app.json คือบัตรประชาชนของแอป',
            body: 'ชื่อแอป, ไอคอน, หน้า splash, เวอร์ชัน, การขอสิทธิ์ต่างๆ อยู่ที่นี่ คล้าย next.config.js รวมกับ manifest.json ของเว็บ',
          },
          {
            heading: 'ไม่ต้องแตะ ios/ และ android/',
            body: 'Expo สร้างโปรเจกต์ native ให้ตอน build จากค่าใน app.json (เรียกว่า Continuous Native Generation) เราจึงไม่ต้องเขียน Swift/Kotlin หรือแก้ไฟล์ native เอง ถ้าต้องปรับ native ให้ทำผ่าน app.json และ config plugin',
          },
          {
            heading: 'ติดตั้ง package ด้วย expo install',
            body: 'ใช้ npx expo install แทน npm install เพราะมันเลือกเวอร์ชันที่เข้ากับ Expo SDK ที่เราใช้อยู่ให้อัตโนมัติ',
            code: `npx expo install expo-haptics`,
          },
        ],
      },
    ],
  },
  {
    id: 'ui',
    title: 'UI พื้นฐาน',
    description: 'Component, style และ layout',
    color: '#2563eb',
    lessons: [
      {
        id: 'components',
        title: 'Components พื้นฐาน',
        summary: 'View, Text, Pressable แทน div, span, button',
        icon: 'cube-outline',
        sections: [
          {
            heading: 'ไม่มี HTML',
            body: 'React Native ไม่มี <div> หรือ <span> ต้องใช้ component ที่แปลงเป็น native view ของ iOS/Android แทน',
            code: `<View>      // ≈ <div>
<Text>      // ≈ <span>, <p>
<Image>     // ≈ <img>
<TextInput> // ≈ <input>`,
          },
          {
            heading: 'ข้อความต้องอยู่ใน <Text> เสมอ',
            body: 'ถ้าใส่ข้อความตรงๆ ใน <View> แอปจะ error ทันที ต่างจากเว็บที่ใส่ข้อความใน <div> ได้เลย',
          },
          {
            heading: 'กดได้ต้องใช้ Pressable',
            body: 'ไม่มี onClick ใช้ onPress บน <Pressable> หรือ <TouchableOpacity> แทน',
            code: `<Pressable onPress={() => alert("hi")}>
  <Text>กดฉัน</Text>
</Pressable>`,
          },
        ],
      },
      {
        id: 'styling',
        title: 'การจัด Style',
        summary: 'StyleSheet แทน CSS/Tailwind',
        icon: 'color-palette-outline',
        sections: [
          {
            heading: 'Style เป็น JavaScript object',
            body: 'ไม่มีไฟล์ CSS หรือ className ชื่อ property เป็น camelCase และตัวเลขไม่ต้องใส่หน่วย px',
            code: `const styles = StyleSheet.create({
  box: { backgroundColor: "#fff", padding: 16 },
});

<View style={styles.box} />`,
          },
          {
            heading: 'ไม่มีการสืบทอด style',
            body: 'บนเว็บ color หรือ font ที่ตั้งบน <div> จะไหลลงลูกทุกตัว แต่ใน React Native ไม่เป็นแบบนั้น (ยกเว้น <Text> ซ้อน <Text>) ต้องใส่ style ให้ <Text> แต่ละตัวเอง จึงนิยมทำ component กลางไว้ใช้ซ้ำ',
          },
          {
            heading: 'รวมหลาย style ด้วย array',
            body: 'ส่ง array เข้า style ได้ ตัวหลังจะทับตัวหน้า คล้ายการต่อ className แบบมีเงื่อนไข',
            code: `<Text style={[styles.title, done && styles.done]} />`,
          },
        ],
      },
      {
        id: 'layout',
        title: 'Flexbox และ Layout',
        summary: 'จัดวางของบนจอด้วย flex, gap และ position',
        icon: 'grid-outline',
        sections: [
          {
            heading: 'ทุกอย่างเป็น flex และเรียงแนวตั้ง',
            body: 'ทุก View เป็น flex container อยู่แล้ว แต่ flexDirection เริ่มต้นเป็น column (บนเว็บเป็น row) ถ้าจะเรียงแนวนอนต้องใส่ flexDirection: "row" เอง',
          },
          {
            heading: 'flex: 1 = กินพื้นที่ที่เหลือ',
            body: 'View ที่ไม่มีเนื้อหาจะสูง 0 ถ้าอยากให้เต็มจอหรือเต็มพื้นที่ที่เหลือ ใส่ flex: 1 หน้าจอส่วนใหญ่เริ่มด้วยแบบนี้',
            code: `<View style={{ flex: 1 }}>
  <View style={{ height: 60 }} />   {/* แถบบน สูง 60 */}
  <View style={{ flex: 1 }} />      {/* เนื้อหา กินที่เหลือทั้งหมด */}
</View>`,
          },
          {
            heading: 'จัดกึ่งกลางและระยะห่าง',
            body: 'justifyContent จัดตามแกนหลัก alignItems จัดตามแกนรอง (สลับกับเว็บเพราะแกนหลักเป็นแนวตั้ง) และใช้ gap เว้นระยะระหว่างลูกได้เหมือน CSS',
            code: `row: {
  flexDirection: "row",
  alignItems: "center",       // กึ่งกลางแนวตั้ง
  justifyContent: "space-between",
  gap: 12,
}`,
          },
          {
            heading: 'ลอยทับด้วย position absolute',
            body: 'ปุ่ม + ลอยมุมขวาล่างในหน้าบันทึกใช้ position: "absolute" แบบเดียวกับ CSS ส่วนการปรับตามขนาดจอใช้ useWindowDimensions แทน media query',
            code: `const { width } = useWindowDimensions();
const isTablet = width >= 768;`,
          },
        ],
      },
      {
        id: 'images-icons',
        title: 'รูปภาพและไอคอน',
        summary: 'Image, expo-image และ @expo/vector-icons',
        icon: 'image-outline',
        sections: [
          {
            heading: 'รูปในโปรเจกต์ใช้ require',
            body: 'รูปที่อยู่ในโฟลเดอร์ assets โหลดด้วย require คล้าย import รูปใน Next.js',
            code: `<Image
  source={require("../assets/logo.png")}
  style={{ width: 120, height: 120 }}
/>`,
          },
          {
            heading: 'รูปจากเน็ตต้องกำหนดขนาดเสมอ',
            body: 'แอปไม่รู้ขนาดรูปจาก URL ล่วงหน้า ถ้าไม่ใส่ width/height รูปจะไม่แสดงเลย ต่างจาก <img> บนเว็บ',
            code: `<Image source={{ uri: "https://..." }} style={{ width: 200, height: 150 }} />`,
          },
          {
            heading: 'expo-image สำหรับงานจริง',
            body: 'expo-image มี cache, placeholder, และ contentFit (คล้าย object-fit ใน CSS) แนะนำให้ใช้แทน Image ตัวพื้นฐาน',
            code: `import { Image } from "expo-image";

<Image source={url} contentFit="cover" style={{ width: 200, height: 150 }} />`,
          },
          {
            heading: 'ไอคอนมีให้ใช้ทันที',
            body: '@expo/vector-icons มีชุดไอคอนยอดนิยมมาในตัว แอปนี้ใช้ Ionicons ทั้งหมด ค้นหาชื่อไอคอนได้ที่ icons.expo.fyi',
            code: `<Ionicons name="heart" size={24} color="#e5484d" />`,
          },
        ],
      },
      {
        id: 'text-input',
        title: 'ฟอร์มและคีย์บอร์ด',
        summary: 'TextInput และการจัดการคีย์บอร์ดที่บังจอ',
        icon: 'create-outline',
        sections: [
          {
            heading: 'onChangeText ได้ string เลย',
            body: 'TextInput ทำงานแบบ controlled เหมือน <input> แต่ onChangeText ส่งข้อความมาให้ตรงๆ ไม่ต้อง e.target.value',
            code: `const [name, setName] = useState("");

<TextInput value={name} onChangeText={setName} placeholder="ชื่อ" />`,
          },
          {
            heading: 'เลือกคีย์บอร์ดให้ตรงงาน',
            body: 'บนมือถือเราเลือกได้ว่าจะให้คีย์บอร์ดแบบไหนเด้งขึ้นมา ช่วยให้ผู้ใช้กรอกง่ายขึ้นมาก',
            code: `<TextInput keyboardType="email-address" autoCapitalize="none" />
<TextInput keyboardType="number-pad" />
<TextInput secureTextEntry />  // รหัสผ่าน
<TextInput returnKeyType="done" onSubmitEditing={save} />`,
          },
          {
            heading: 'คีย์บอร์ดบังช่องกรอก',
            body: 'ปัญหาที่เว็บแทบไม่เจอ: คีย์บอร์ดเด้งขึ้นมาทับฟอร์ม แก้ด้วย KeyboardAvoidingView (ดูตัวอย่างในฟอร์มเพิ่มบันทึก) และปิดคีย์บอร์ดเองได้ด้วย Keyboard.dismiss()',
            code: `<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
  {/* ฟอร์ม */}
</KeyboardAvoidingView>`,
          },
        ],
      },
      {
        id: 'touch',
        title: 'การสัมผัสและ Feedback',
        summary: 'ทำให้ปุ่มรู้สึกดีเวลากด',
        icon: 'finger-print-outline',
        sections: [
          {
            heading: 'มือถือไม่มี hover',
            body: 'ผู้ใช้ต้องเห็นทันทีว่ากดโดนแล้ว Pressable ส่งสถานะ pressed มาให้ใช้เปลี่ยนหน้าตาได้ การ์ดทุกใบในแอปนี้จะย่อลงนิดหน่อยตอนกด',
            code: `<Pressable
  style={({ pressed }) => [styles.card, pressed && { opacity: 0.7 }]}
/>`,
          },
          {
            heading: 'พื้นที่กดต้องใหญ่พอ',
            body: 'นิ้วใหญ่กว่าเมาส์มาก ปุ่มควรกดได้อย่างน้อยราว 44×44 ถ้าไอคอนเล็กให้ขยายพื้นที่กดด้วย hitSlop โดยไม่ต้องขยายหน้าตา (ปุ่มถังขยะในหน้าบันทึกใช้แบบนี้)',
            code: `<Pressable hitSlop={10} onPress={onDelete}>
  <Ionicons name="trash-outline" size={18} />
</Pressable>`,
          },
          {
            heading: 'สั่นเบาๆ ด้วย Haptics',
            body: 'การสั่นสั้นๆ ตอนทำสิ่งสำคัญ (เช่นติ๊กเสร็จ ลบ) ทำให้แอปรู้สึกเป็น native มากขึ้น ใช้ expo-haptics',
            code: `import * as Haptics from "expo-haptics";

Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);`,
          },
        ],
      },
    ],
  },
  {
    id: 'data',
    title: 'State และข้อมูล',
    description: 'จัดการ state, รายการ, เก็บข้อมูล และเรียก API',
    color: '#12a594',
    lessons: [
      {
        id: 'state-hooks',
        title: 'State และ Hooks',
        summary: 'React ที่คุณรู้จักใช้ได้เหมือนเดิมทุกอย่าง',
        icon: 'git-commit-outline',
        sections: [
          {
            heading: 'ความรู้ React ใช้ได้ 100%',
            body: 'useState, useEffect, useMemo, useContext, custom hooks ทำงานเหมือนบนเว็บเป๊ะ ต่างกันแค่ component ที่ใช้ render',
          },
          {
            heading: 'ไม่มี window และ document',
            body: 'โค้ดที่พึ่ง DOM หรือ API ของเบราว์เซอร์ (localStorage, document.title, window.scrollTo) ใช้ไม่ได้ ต้องหาตัวแทนฝั่ง native เช่น AsyncStorage แทน localStorage',
          },
          {
            heading: 'แยก logic ไว้ใน custom hook',
            body: 'หน้าบันทึกของแอปนี้เรียกแค่ useNotes() ส่วนการโหลด บันทึก เพิ่ม ลบ อยู่ใน hook ทั้งหมด หน้าจอจึงสั้นและอ่านง่าย',
            code: `const { notes, addNote, deleteNote } = useNotes();`,
          },
          {
            heading: 'State ที่หลายหน้าใช้ร่วมกัน',
            body: 'ใช้ Context แบบเดียวกับเว็บ เช่นโหมดมืดของแอปนี้อยู่ใน ThemeProvider ครอบทั้งแอป ถ้า state ใหญ่ขึ้นค่อยพิจารณา Zustand หรือ Redux ซึ่งใช้กับ React Native ได้เหมือนกัน',
          },
        ],
      },
      {
        id: 'lists',
        title: 'รายการข้อมูล',
        summary: 'ScrollView, FlatList และ SectionList',
        icon: 'list-outline',
        sections: [
          {
            heading: 'ScrollView สำหรับเนื้อหาสั้น',
            body: 'ต่างจากเว็บ: View ไม่เลื่อนได้เอง ต้องครอบด้วย ScrollView ซึ่งจะ render ลูกทุกตัวพร้อมกัน เหมาะกับหน้าที่เนื้อหาไม่ยาวมาก เช่นหน้าบทเรียนนี้',
          },
          {
            heading: 'FlatList สำหรับรายการยาว',
            body: 'FlatList render เฉพาะแถวที่อยู่บนจอ (virtualization) แถวที่เลื่อนผ่านไปจะถูกนำกลับมาใช้ใหม่ ข้อมูลเป็นพันแถวก็ยังลื่น',
            code: `<FlatList
  data={notes}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <NoteItem note={item} />}
/>`,
          },
          {
            heading: 'SectionList สำหรับรายการแบ่งกลุ่ม',
            body: 'เหมือน FlatList แต่มีหัวข้อกลุ่ม หน้ารายการบทเรียนที่แบ่งตามโมดูลใช้ตัวนี้',
          },
          {
            heading: 'ของแถมที่ควรรู้',
            body: 'FlatList มีความสามารถที่แอปมือถือต้องใช้บ่อยมาในตัว',
            code: `ListEmptyComponent={<Text>ไม่มีข้อมูล</Text>}
ListHeaderComponent={<Header />}
refreshing={loading} onRefresh={reload}   // ดึงลงเพื่อรีเฟรช
onEndReached={loadMore}                   // เลื่อนสุดแล้วโหลดเพิ่ม`,
          },
        ],
      },
      {
        id: 'storage',
        title: 'เก็บข้อมูลในเครื่อง',
        summary: 'AsyncStorage, SecureStore และ SQLite',
        icon: 'save-outline',
        sections: [
          {
            heading: 'AsyncStorage ≈ localStorage แบบ async',
            body: 'เก็บ key-value เป็น string และทุกคำสั่งต้อง await บันทึกของแอปนี้และโหมดมืดใช้ตัวนี้',
            code: `await AsyncStorage.setItem("notes", JSON.stringify(notes));
const raw = await AsyncStorage.getItem("notes");
const notes = raw ? JSON.parse(raw) : [];`,
          },
          {
            heading: 'ข้อมูลลับใช้ SecureStore',
            body: 'token หรือรหัสผ่านห้ามเก็บใน AsyncStorage เพราะไม่ได้เข้ารหัส ใช้ expo-secure-store ซึ่งเก็บใน Keychain (iOS) / Keystore (Android)',
            code: `import * as SecureStore from "expo-secure-store";

await SecureStore.setItemAsync("token", token);`,
          },
          {
            heading: 'ข้อมูลเยอะใช้ SQLite',
            body: 'ถ้าต้องค้นหา กรอง หรือมีข้อมูลหลายพันรายการ ใช้ expo-sqlite ซึ่งเป็นฐานข้อมูลจริงในเครื่อง',
          },
        ],
      },
      {
        id: 'fetching',
        title: 'เรียก API',
        summary: 'fetch, loading state และ environment variable',
        icon: 'cloud-download-outline',
        sections: [
          {
            heading: 'fetch ใช้ได้เหมือนเบราว์เซอร์',
            body: 'เขียนแบบที่คุ้นเคยได้เลย และควรมี state สำหรับกำลังโหลดกับ error เสมอ เพราะเน็ตมือถือไม่เสถียร',
            code: `useEffect(() => {
  fetch(API_URL + "/posts")
    .then((res) => res.json())
    .then(setPosts)
    .catch(setError)
    .finally(() => setLoading(false));
}, []);`,
          },
          {
            heading: 'localhost บนมือถือ ≠ คอมของคุณ',
            body: 'บนโทรศัพท์ localhost คือตัวโทรศัพท์เอง ถ้าจะเรียก API ที่รันบนคอม ต้องใช้ IP ของคอมในวง Wi-Fi เดียวกัน เช่น http://192.168.1.10:3000',
          },
          {
            heading: 'Environment variable',
            body: 'ตัวแปรที่ขึ้นต้นด้วย EXPO_PUBLIC_ ในไฟล์ .env ใช้ในโค้ดได้ (เหมือน NEXT_PUBLIC_) แต่จะถูกฝังไปกับแอป ห้ามใส่ secret key',
            code: `# .env
EXPO_PUBLIC_API_URL=https://api.example.com

// ในโค้ด
const API_URL = process.env.EXPO_PUBLIC_API_URL;`,
          },
          {
            heading: 'งานจริงใช้ TanStack Query',
            body: 'cache, retry, refetch เมื่อกลับมาเปิดแอป ใช้ @tanstack/react-query ได้เหมือนบนเว็บทุกอย่าง',
          },
        ],
      },
    ],
  },
  {
    id: 'navigation',
    title: 'Navigation',
    description: 'Expo Router: stack, tabs, modal และการส่งค่าข้ามหน้า',
    color: '#d97706',
    lessons: [
      {
        id: 'navigation',
        title: 'Routing ด้วยไฟล์',
        summary: 'Expo Router: ไฟล์ = หน้าจอ เหมือน Next.js',
        icon: 'git-branch-outline',
        sections: [
          {
            heading: 'ไฟล์ใน src/app/ คือหน้าจอ',
            body: 'ชื่อไฟล์กลายเป็น URL เหมือน App Router ของ Next.js',
            code: `src/app/index.tsx          → /
src/app/lessons/index.tsx  → /lessons
src/app/lessons/[id].tsx   → /lessons/styling`,
          },
          {
            heading: 'Dynamic route',
            body: 'ไฟล์ชื่อ [id].tsx รับค่าจาก URL ได้ อ่านค่าด้วย useLocalSearchParams (หน้านี้ที่คุณอ่านอยู่ก็ทำแบบนี้)',
            code: `const { id } = useLocalSearchParams<{ id: string }>();`,
          },
          {
            heading: 'Stack navigator',
            body: 'กดเข้าหน้าใหม่ = ซ้อนหน้าขึ้นไปบน stack กด back หรือปัดขอบจอ = เอาหน้าบนสุดออก',
          },
        ],
      },
      {
        id: 'layouts',
        title: 'Layout, Tabs และ Modal',
        summary: '_layout.tsx กำหนดว่าหน้าในโฟลเดอร์นั้นเปลี่ยนกันแบบไหน',
        icon: 'albums-outline',
        sections: [
          {
            heading: '_layout.tsx = navigator',
            body: 'เหมือน layout.tsx ใน Next.js แต่นอกจากครอบหน้าแล้วยังเลือกได้ว่าจะเปลี่ยนหน้าแบบ Stack (ซ้อนกัน) หรือ Tabs (แถบด้านล่าง)',
          },
          {
            heading: 'แถบ Tab ด้านล่าง',
            body: 'แอปมือถือส่วนใหญ่มีแถบเมนูด้านล่าง สร้างได้ด้วย Tabs ในไฟล์ _layout.tsx ของโฟลเดอร์นั้น',
            code: `// src/app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "หน้าแรก" }} />
      <Tabs.Screen name="profile" options={{ title: "โปรไฟล์" }} />
    </Tabs>
  );
}`,
          },
          {
            heading: 'Route group (วงเล็บ)',
            body: 'โฟลเดอร์ชื่อในวงเล็บ เช่น (tabs) ไม่ถูกนับเป็นส่วนของ URL เหมือน route group ของ Next.js ใช้จัดกลุ่มหน้าที่ใช้ layout เดียวกัน',
          },
          {
            heading: 'เปิดหน้าเป็น Modal',
            body: 'ตั้ง presentation เป็น modal ใน Stack หน้านั้นจะเลื่อนขึ้นจากด้านล่างแทนการเลื่อนจากขวา',
            code: `<Stack.Screen name="new-note" options={{ presentation: "modal" }} />`,
          },
        ],
      },
      {
        id: 'router-api',
        title: 'เปลี่ยนหน้าและส่งค่า',
        summary: 'Link, router.push, replace และ back',
        icon: 'swap-horizontal-outline',
        sections: [
          {
            heading: 'Link แบบประกาศ',
            body: 'ใช้เหมือน <Link> ของ Next.js ส่ง params ได้ด้วย object',
            code: `<Link href="/notes">ไปหน้าบันทึก</Link>

<Link href={{ pathname: "/lessons/[id]", params: { id: "layout" } }}>
  ไปบท Layout
</Link>`,
          },
          {
            heading: 'router แบบสั่งด้วยโค้ด',
            body: 'ใช้หลังทำงานบางอย่างเสร็จ เช่นบันทึกแล้วกลับหน้าเดิม replace ใช้เมื่อไม่อยากให้กดย้อนกลับมาได้ เช่นหลัง login',
            code: `router.push("/notes");      // ซ้อนหน้าใหม่
router.replace("/home");    // แทนที่หน้าปัจจุบัน
router.back();              // ย้อนกลับ`,
          },
          {
            heading: 'ตั้ง header จากในหน้า',
            body: 'ถ้าชื่อหน้าขึ้นกับข้อมูล ให้ใส่ <Stack.Screen options> ไว้ในหน้าเอง หน้าบทเรียนนี้ตั้งชื่อ header จากชื่อบทแบบนี้',
            code: `<Stack.Screen options={{ title: lesson.title }} />`,
          },
        ],
      },
    ],
  },
  {
    id: 'platform',
    title: 'Platform และ UX',
    description: 'ทำให้แอปดูดีบนทุกเครื่อง',
    color: '#db2777',
    lessons: [
      {
        id: 'safe-area',
        title: 'Safe Area และ Status Bar',
        summary: 'หลบรอยบากและแถบ home ด้านล่าง',
        icon: 'phone-portrait-outline',
        sections: [
          {
            heading: 'จอมือถือไม่ได้สี่เหลี่ยมเรียบ',
            body: 'มีรอยบาก/Dynamic Island ด้านบน และแถบ home ด้านล่าง ถ้าวางของชิดขอบจะโดนบัง พื้นที่ที่ปลอดภัยเรียกว่า safe area',
          },
          {
            heading: 'useSafeAreaInsets',
            body: 'บอกระยะที่ต้องเว้นแต่ละด้าน หน้าแรกของแอปนี้ใช้เว้นขอบบน ส่วนหน้าบันทึกใช้ยกปุ่ม + ให้พ้นแถบ home (หน้าที่มี header ของ Stack จัดการขอบบนให้แล้ว)',
            code: `const insets = useSafeAreaInsets();

<View style={{ paddingTop: insets.top }} />`,
          },
          {
            heading: 'Status Bar',
            body: 'แถบเวลา/แบตด้านบน ต้องปรับสีตัวอักษรให้ตัดกับพื้นหลัง แอปนี้สลับตามโหมดมืดใน _layout.tsx',
            code: `<StatusBar style={mode === "dark" ? "light" : "dark"} />`,
          },
        ],
      },
      {
        id: 'platform-specific',
        title: 'iOS vs Android',
        summary: 'เขียนโค้ดต่างกันเฉพาะจุดที่จำเป็น',
        icon: 'logo-apple',
        sections: [
          {
            heading: 'Platform.OS และ Platform.select',
            body: 'เช็กว่ากำลังรันบนอะไร ตัวอย่างโค้ดในหน้านี้ใช้ Platform.select เลือกฟอนต์ เพราะ iOS ไม่รู้จักชื่อ monospace',
            code: `fontFamily: Platform.select({ ios: "Menlo", default: "monospace" })`,
          },
          {
            heading: 'แยกไฟล์ตาม platform',
            body: 'ถ้าต่างกันเยอะ ตั้งชื่อไฟล์ตาม platform แล้ว import ชื่อเดียว ระบบจะเลือกไฟล์ให้เอง',
            code: `Map.ios.tsx
Map.android.tsx
Map.web.tsx

import { Map } from "./Map";`,
          },
          {
            heading: 'ทดสอบทั้งสองฝั่งเสมอ',
            body: 'หลายอย่างแสดงผลไม่เหมือนกัน เช่นเงา (iOS ใช้ shadow*, Android ใช้ elevation), ฟอนต์, ปุ่ม back และคีย์บอร์ด',
          },
        ],
      },
      {
        id: 'theming',
        title: 'โหมดมืดและ Theme',
        summary: 'ระบบสีที่สลับโหมดได้ทั้งแอป',
        icon: 'moon-outline',
        sections: [
          {
            heading: 'อ่านโหมดของเครื่อง',
            body: 'useColorScheme() บอกว่าผู้ใช้ตั้งเครื่องเป็นโหมดมืดหรือสว่าง ต้องตั้ง userInterfaceStyle เป็น automatic ใน app.json ด้วย',
            code: `const scheme = useColorScheme(); // "light" | "dark"`,
          },
          {
            heading: 'เก็บสีเป็น token',
            body: 'แทนที่จะเขียน #ffffff กระจายทั่วแอป ให้ตั้งชื่อสีตามหน้าที่ (background, card, text) แยกชุดสว่าง/มืด คล้าย CSS variables ดูได้ใน src/theme/colors.ts',
          },
          {
            heading: 'แจกสีผ่าน Context',
            body: 'ThemeProvider ของแอปนี้รวมค่าจากเครื่องกับค่าที่ผู้ใช้เลือกในหน้าตั้งค่า แล้วให้ทุก component ดึงสีผ่าน useTheme()',
            code: `const { colors } = useTheme();

<Text style={[styles.title, { color: colors.text }]} />`,
          },
        ],
      },
      {
        id: 'animations',
        title: 'Animation',
        summary: 'Animated API และ Reanimated',
        icon: 'sparkles-outline',
        sections: [
          {
            heading: 'ไม่มี CSS transition',
            body: 'การเคลื่อนไหวต้องสั่งด้วยโค้ด Animated ที่มากับ React Native ใช้ค่าพิเศษ (Animated.Value) ผูกกับ style',
            code: `const opacity = useRef(new Animated.Value(0)).current;

useEffect(() => {
  Animated.timing(opacity, {
    toValue: 1,
    duration: 300,
    useNativeDriver: true,
  }).start();
}, []);

<Animated.View style={{ opacity }} />`,
          },
          {
            heading: 'useNativeDriver: true',
            body: 'ให้ animation วิ่งฝั่ง native ไม่ต้องรอ JavaScript แม้ JS กำลังยุ่งอยู่ animation ก็ยังลื่น ใช้ได้กับ opacity และ transform',
          },
          {
            heading: 'งานซับซ้อนใช้ Reanimated',
            body: 'animation ที่ตามนิ้ว (ลาก ปัด) หรือซับซ้อน ใช้ react-native-reanimated คู่กับ react-native-gesture-handler ซึ่งเป็นมาตรฐานของวงการ',
          },
        ],
      },
    ],
  },
  {
    id: 'native',
    title: 'ความสามารถของเครื่อง',
    description: 'กล้อง ตำแหน่ง การแจ้งเตือน และ development build',
    color: '#7c3aed',
    lessons: [
      {
        id: 'native-modules',
        title: 'ใช้ความสามารถของเครื่อง',
        summary: 'Expo SDK และการขอสิทธิ์',
        icon: 'hardware-chip-outline',
        sections: [
          {
            heading: 'มีโมดูลสำเร็จรูปให้เกือบทุกอย่าง',
            body: 'Expo SDK มีโมดูลสำหรับกล้อง ตำแหน่ง การแจ้งเตือน เลือกรูป สแกน QR ฯลฯ ติดตั้งด้วย npx expo install แล้วใช้ได้ทันที',
            code: `npx expo install expo-image-picker expo-location`,
          },
          {
            heading: 'ต้องขอสิทธิ์ก่อนใช้',
            body: 'กล้อง ตำแหน่ง รูปภาพ ต้องขออนุญาตผู้ใช้ก่อน และต้องรับมือกรณีผู้ใช้กดปฏิเสธด้วย',
            code: `const { status } = await Location.requestForegroundPermissionsAsync();
if (status !== "granted") {
  // แจ้งผู้ใช้ว่าทำไมต้องใช้ แล้วหยุดตรงนี้
  return;
}
const position = await Location.getCurrentPositionAsync();`,
          },
          {
            heading: 'ข้อความขอสิทธิ์ตั้งใน app.json',
            body: 'iOS บังคับให้บอกเหตุผลที่ขอสิทธิ์ ตั้งผ่าน config plugin ของโมดูลนั้นใน app.json',
            code: `"plugins": [
  ["expo-camera", { "cameraPermission": "ใช้กล้องเพื่อถ่ายรูปแนบบันทึก" }]
]`,
          },
        ],
      },
      {
        id: 'dev-build',
        title: 'Expo Go vs Development Build',
        summary: 'เมื่อไหร่ต้องสร้างแอปทดสอบของตัวเอง',
        icon: 'construct-outline',
        sections: [
          {
            heading: 'Expo Go เหมาะกับการเริ่มต้น',
            body: 'Expo Go คือแอปที่ติดตั้งโมดูลของ Expo SDK ไว้ล่วงหน้า เราส่งแค่ JavaScript เข้าไปรัน จึงเริ่มได้ทันทีโดยไม่ต้อง build อะไร',
          },
          {
            heading: 'ข้อจำกัดของ Expo Go',
            body: 'ถ้าติดตั้ง library ที่มีโค้ด native ซึ่ง Expo Go ไม่มี หรือแก้ค่า native ใน app.json (เช่นชื่อ bundle, ไอคอน) จะทดสอบใน Expo Go ไม่ได้',
          },
          {
            heading: 'Development build = Expo Go ของเราเอง',
            body: 'สร้างแอปทดสอบที่มีโค้ด native ของโปรเจกต์เราครบ แต่ยังแก้ JavaScript แล้วรีโหลดทันทีได้เหมือนเดิม build ในเครื่องหรือบน cloud ก็ได้',
            code: `# build ในเครื่อง (ต้องมี Android Studio / Xcode)
npx expo run:android

# build บน cloud ด้วย EAS
npx eas-cli@latest build --profile development`,
          },
        ],
      },
    ],
  },
  {
    id: 'ship',
    title: 'Debug และขึ้น Store',
    description: 'หาบั๊ก ทำให้เร็ว และส่งแอปถึงผู้ใช้',
    color: '#e5484d',
    lessons: [
      {
        id: 'debugging',
        title: 'Debug',
        summary: 'console, dev menu, DevTools และ error boundary',
        icon: 'bug-outline',
        sections: [
          {
            heading: 'console.log ไปโผล่ที่เทอร์มินัล',
            body: 'log จากแอปบนมือถือแสดงในเทอร์มินัลที่รัน expo start ไม่ใช่ในแอป',
          },
          {
            heading: 'Dev menu และ DevTools',
            body: 'เขย่าเครื่องหรือกด m ในเทอร์มินัลเพื่อเปิด dev menu กด j เพื่อเปิด debugger หน้าตาคล้าย Chrome DevTools ดู console, ตั้ง breakpoint และดู component tree ได้',
            code: `# ในเทอร์มินัลที่รัน expo start
m → dev menu
j → เปิด debugger
r → รีโหลด`,
          },
          {
            heading: 'จอแดง จอเหลือง',
            body: 'error ร้ายแรงขึ้นจอแดงพร้อม stack trace, warning ขึ้นแถบเหลืองด้านล่าง อย่าปล่อย warning สะสม เพราะมักเป็นต้นเหตุของบั๊กในอนาคต',
          },
          {
            heading: 'Error boundary ต่อหน้า',
            body: 'Expo Router ให้ export ErrorBoundary จากไฟล์หน้าได้ ถ้าหน้านั้นพัง จะแสดงหน้านี้แทนการพังทั้งแอป',
            code: `export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View>
      <Text>{error.message}</Text>
      <Pressable onPress={retry}><Text>ลองใหม่</Text></Pressable>
    </View>
  );
}`,
          },
        ],
      },
      {
        id: 'performance',
        title: 'Performance',
        summary: 'ทำให้แอปลื่นบนเครื่องจริง',
        icon: 'speedometer-outline',
        sections: [
          {
            heading: 'JavaScript มีเธรดเดียว',
            body: 'ถ้า JS คำนวณหนักๆ นานๆ ปุ่มจะกดไม่ติดและ animation จะกระตุก เหมือนบล็อก main thread บนเว็บ งานหนักควรย้ายไปทำฝั่ง server หรือแบ่งทำทีละส่วน',
          },
          {
            heading: 'รายการยาวใช้ FlatList เสมอ',
            body: 'อย่า map ข้อมูลหลายร้อยแถวใน ScrollView ใช้ FlatList และใส่ keyExtractor ให้ถูก ถ้าแต่ละแถวสูงเท่ากันใส่ getItemLayout จะเร็วขึ้นอีก',
          },
          {
            heading: 'ลด re-render',
            body: 'ฟังก์ชันที่ส่งให้แถวในรายการควรห่อด้วย useCallback (useNotes ของแอปนี้ทำแล้ว) และห่อ component แถวด้วย React.memo เพื่อไม่ให้ทุกแถว render ใหม่เมื่อแถวเดียวเปลี่ยน',
          },
          {
            heading: 'วัดผลในโหมด production',
            body: 'โหมด dev ช้ากว่าของจริงมาก ก่อนสรุปว่าแอปช้า ให้ลองรันแบบ production บนมือถือจริง (โดยเฉพาะ Android รุ่นกลางๆ)',
            code: `npx expo start --no-dev --minify`,
          },
        ],
      },
      {
        id: 'eas',
        title: 'Build และส่งขึ้น Store',
        summary: 'EAS Build, Submit และ Update',
        icon: 'cloud-upload-outline',
        sections: [
          {
            heading: 'EAS Build: build บน cloud',
            body: 'ไม่ต้องมี Mac หรือ Android Studio ก็ build ได้ EAS สร้างไฟล์ติดตั้ง (.apk/.aab/.ipa) ให้บน server แล้วส่งลิงก์กลับมา',
            code: `npx eas-cli@latest build --platform android
npx eas-cli@latest build --platform ios`,
          },
          {
            heading: 'Profile ใน eas.json',
            body: 'ปกติมี 3 แบบ: development (แอปทดสอบสำหรับนักพัฒนา), preview (ส่งให้ทีม/ลูกค้าลองติดตั้ง), production (ส่งขึ้น store)',
          },
          {
            heading: 'EAS Submit: ส่งขึ้น store',
            body: 'ส่งไฟล์ที่ build แล้วขึ้น App Store / Google Play ด้วยคำสั่งเดียว ต้องมีบัญชีนักพัฒนาของแต่ละ store ก่อน (Apple รายปี, Google จ่ายครั้งเดียว)',
            code: `npx eas-cli@latest submit --platform android`,
          },
          {
            heading: 'EAS Update: แก้บั๊กโดยไม่ต้องรอรีวิว',
            body: 'อัปเดตเฉพาะ JavaScript และรูปภาพส่งตรงถึงเครื่องผู้ใช้ได้ทันที (over-the-air) แต่ถ้าเพิ่ม library native หรือแก้ app.json ต้อง build และส่ง store ใหม่',
            code: `npx eas-cli@latest update --branch production --message "แก้บั๊กปุ่มบันทึก"`,
          },
        ],
      },
    ],
  },
];

// แปลงเป็น array เดียวเรียงตามลำดับหลักสูตร เพื่อหาบทจาก id และหาบทก่อนหน้า/ถัดไปได้ง่าย
let lessonNumber = 0;
export const LESSONS: Lesson[] = MODULES.flatMap((module) =>
  module.lessons.map((lesson) => ({
    ...lesson,
    color: module.color,
    moduleId: module.id,
    moduleTitle: module.title,
    number: ++lessonNumber,
  }))
);
