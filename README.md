# react-native-test

แอปฝึก React Native ด้วย Expo (SDK 57) + Expo Router + TypeScript รันได้ทั้ง iOS, Android และเว็บ

## ฟีเจอร์

- **บทเรียน** — หลักสูตร React Native แบ่งเป็นโมดูล กดเข้าไปอ่านแต่ละบทและติ๊กว่าเรียนจบแล้วได้ (จำความคืบหน้าไว้ในเครื่อง)
- **บันทึก** — จดโน้ต / to-do เพิ่ม แก้ไข ลบ และติ๊กว่าเสร็จแล้วได้ (เก็บใน AsyncStorage)
- **แชท** — หน้าตาแบบแอปแชท: รายชื่อแชท, เพื่อนที่ออนไลน์, ฟองข้อความ, "กำลังพิมพ์..." และเพื่อนสมมติตอบกลับอัตโนมัติ (ข้อความเก็บในเครื่อง)
- **ตั้งค่า** — สลับโหมดมืด/สว่าง (ค่าเริ่มต้นตามระบบของเครื่อง)

## เริ่มต้นใช้งาน

ต้องมี Node.js และแอป [Expo Go](https://expo.dev/go) บนมือถือ (หรือจะเปิดบนเว็บก็ได้)

```bash
npm install        # ติดตั้ง dependency
npx expo start     # เปิด dev server แล้วสแกน QR ด้วย Expo Go
npm run web        # เปิดในเบราว์เซอร์
```

คำสั่งอื่นๆ และวิธีแก้ปัญหาที่เจอบ่อย ดูใน [command.md](command.md)

## ตรวจโค้ด

รันก่อนถือว่างานเสร็จทุกครั้ง:

```bash
npx tsc --noEmit   # TypeScript
npx expo lint      # ESLint
```

## โครงสร้างโปรเจกต์

```
src/
├── app/                  # หน้าจอทั้งหมด (Expo Router: 1 ไฟล์ = 1 route)
│   ├── _layout.tsx       # Stack หลัก + ThemeProvider ครอบทั้งแอป
│   ├── (tabs)/           # แถบเมนูด้านล่าง (วงเล็บ = ไม่ปรากฏใน URL)
│   │   ├── _layout.tsx   # ตั้งค่าแท็บ ไอคอน และตัวเลขแชทที่ยังไม่อ่าน
│   │   ├── index.tsx     # "/"          หน้าแรก
│   │   ├── lessons.tsx   # "/lessons"   รายการบทเรียนตามโมดูล
│   │   ├── chats.tsx     # "/chats"     รายชื่อแชท
│   │   ├── notes.tsx     # "/notes"     บันทึก
│   │   └── settings.tsx  # "/settings"  ตั้งค่า
│   ├── lessons/[id].tsx  # "/lessons/:id" เนื้อหาแต่ละบท (เปิดทับแถบเมนู)
│   └── chats/[id].tsx    # "/chats/:id"   ห้องแชท (เปิดทับแถบเมนู)
├── components/           # UI ที่ใช้ซ้ำ (Card, IconBadge, Avatar, NoteItem, ...)
├── data/                 # เนื้อหาหลักสูตร + ข้อมูลเพื่อนสมมติของแชท
├── hooks/                # useNotes, useLessonProgress, useChats
├── storage/              # อ่าน/เขียน AsyncStorage
├── theme/                # สีและ ThemeProvider (โหมดมืด/สว่าง)
└── types/                # TypeScript types
```

### เพิ่มเนื้อหา

- **เพิ่มบทเรียน:** ใส่ object ใหม่ใน `lessons` ของโมดูลใน [src/data/lessons.ts](src/data/lessons.ts) — `id` ห้ามซ้ำ เพราะใช้เป็น URL และ key ของความคืบหน้า
- **เพิ่มแท็บ:** สร้างไฟล์ใน `src/app/(tabs)/` แล้วเพิ่ม `<Tabs.Screen>` ใน [src/app/(tabs)/_layout.tsx](<src/app/(tabs)/_layout.tsx>) (ถ้าอยากมีการ์ดทางลัดที่หน้าแรก เพิ่มใน `MENU_ITEMS` ของ [src/app/(tabs)/index.tsx](<src/app/(tabs)/index.tsx>) ด้วย)

## หมายเหตุ

- ติดตั้ง package ด้วย `npx expo install <package>` เสมอ (ไม่ใช่ `npm install <package>`) เพื่อให้ได้เวอร์ชันที่เข้ากับ Expo SDK
- ไม่มีโฟลเดอร์ `ios/` และ `android/` — Expo สร้างให้ตอน build ตั้งค่า native ผ่าน [app.json](app.json) แทน
- ถ้าเพิ่ม library ที่มี native code นอกเหนือจากที่ Expo Go มี ต้องใช้ development build (`npx eas-cli@latest build --profile development`)
