// Root layout: เหมือน app/layout.tsx ใน Next.js — ครอบทุกหน้าในแอป
// <Stack> คือ navigator แบบซ้อนหน้า (กดเข้าไปแล้วมีปุ่ม back / ปัดกลับได้)
// Expo Router ครอบ SafeAreaProvider ให้อัตโนมัติแล้ว จึงไม่ต้องใส่เอง
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#f3f4f6' },
          headerShadowVisible: false,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: '#f3f4f6' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'เมนู' }} />
        <Stack.Screen name="notes" options={{ title: 'บันทึกของฉัน' }} />
      </Stack>
    </>
  );
}
