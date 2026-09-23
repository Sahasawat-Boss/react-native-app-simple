# คำสั่งที่ใช้บ่อยใน React Native (Expo)

รันทุกคำสั่งที่ root ของโปรเจกต์ (`D:\Code\mobile-react-native\react-native-test`)

## รันแอป (dev server)

```powershell
npx expo start                  # เปิด dev server แล้วสแกน QR ด้วย Expo Go บนมือถือ
npx expo start --web            # เปิดในเบราว์เซอร์บนคอม
npx expo start --clear          # ล้าง cache ก่อนรัน (ใช้เมื่อแก้ config หรือเจอ error แปลกๆ)
npx expo start --web --clear    # เปิดบนเว็บ + ล้าง cache
npx expo start --tunnel         # ใช้เมื่อมือถือกับคอมอยู่คนละ wifi หรือสแกน QR แล้วต่อไม่ติด
npx expo start --port 8082      # เปลี่ยนพอร์ต (ถ้า 8081 ถูกใช้อยู่)
```

หรือใช้ script ที่มีใน `package.json`:

```powershell
npm start          # = npx expo start
npm run web        # = npx expo start --web
npm run android    # = npx expo start --android (เปิดใน Android emulator ต้องลง Android Studio)
npm run lint       # = npx expo lint
```

### ปุ่มลัดใน terminal ระหว่าง server รันอยู่

| ปุ่ม | ทำอะไร |
|---|---|
| `r` | reload แอป |
| `w` | เปิดบนเว็บ |
| `a` | เปิดใน Android emulator |
| `j` | เปิด debugger |
| `m` | เปิด dev menu บนมือถือ |
| `?` | ดูปุ่มลัดทั้งหมด |
| `Ctrl + C` | หยุด server |

## ติดตั้ง package

```powershell
npx expo install <ชื่อ package>   # ใช้อันนี้เสมอ แทน npm install
npx expo install --fix            # แก้ package ที่เวอร์ชันไม่เข้ากับ Expo SDK
npm install                       # ติดตั้ง dependency ทั้งหมดใหม่ (เช่น หลัง clone โปรเจกต์)
```

> ทำไมใช้ `npx expo install` แทน `npm install`: มันเลือกเวอร์ชันที่เข้ากับ Expo SDK ของโปรเจกต์ให้เอง
> ถ้าใช้ `npm install` ตรงๆ อาจได้เวอร์ชันใหม่เกินไป แล้วแอปพัง

## ตรวจโค้ด (ควรรันก่อนถือว่างานเสร็จ)

```powershell
npx tsc --noEmit     # เช็ค TypeScript error
npx expo lint        # เช็ค lint (ESLint)
npx expo-doctor      # ตรวจปัญหา dependency และ config ของโปรเจกต์
```

## Build / Export

```powershell
npx expo export --platform web         # build เว็บเป็นไฟล์ static (ออกที่โฟลเดอร์ dist/)
npx eas-cli@latest build -p android    # build ไฟล์ติดตั้ง Android บน cloud (ต้องมีบัญชี Expo)
npx eas-cli@latest build -p ios        # build iOS บน cloud (ต้องมี Apple Developer account)
npx eas-cli@latest update              # ส่งอัปเดตโค้ด JS ให้แอปที่ติดตั้งแล้ว โดยไม่ต้อง build ใหม่
```

> **Expo Go** มีเฉพาะ native module ที่ Expo แถมมา ถ้าลง library ที่มี native code นอกเหนือจากนั้น
> จะเปิดใน Expo Go ไม่ได้ ต้องทำ development build แทน: `npx eas-cli@latest build --profile development`

## แก้ปัญหาที่เจอบ่อย

```powershell
# พอร์ต 8081 ค้าง (ปิด server ไม่สนิท): หา PID ที่ใช้พอร์ต แล้วสั่งปิด
netstat -ano | findstr :8081
Stop-Process -Id <PID> -Force

# แอปพังแปลกๆ หลังเปลี่ยน config หรือ package: ล้าง cache
npx expo start --clear

# node_modules เสีย: ลบแล้วติดตั้งใหม่
Remove-Item -Recurse -Force node_modules
npm install
```
