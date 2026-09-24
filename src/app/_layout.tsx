// Root layout: เหมือน app/layout.tsx ใน Next.js — ครอบทุกหน้าในแอป
// <Stack> คือ navigator แบบซ้อนหน้า (กดเข้าไปแล้วมีปุ่ม back / ปัดกลับได้)
// Expo Router ครอบ SafeAreaProvider ให้อัตโนมัติแล้ว จึงไม่ต้องใส่เอง
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ThemedStack />
    </ThemeProvider>
  );
}

// แยกออกมาเป็น component ลูก เพราะ useTheme() ต้องถูกเรียกภายใน <ThemeProvider>
function ThemedStack() {
  const { mode, colors } = useTheme();

  return (
    <>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.primary, // สีปุ่ม back
          headerShadowVisible: false,
          headerTitleStyle: { fontWeight: '700', color: colors.text },
          headerBackButtonDisplayMode: 'minimal', // iOS: โชว์แค่ลูกศร ไม่โชว์ชื่อหน้าก่อนหน้า
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        {/* หน้าแรกทำหัวหน้าเอง (คำทักทาย + ปุ่มตั้งค่า) จึงซ่อน header */}
        <Stack.Screen name="index" options={{ title: 'เมนู', headerShown: false }} />
        <Stack.Screen name="notes" options={{ title: 'บันทึกของฉัน' }} />
        <Stack.Screen name="lessons/index" options={{ title: 'บทเรียน' }} />
        <Stack.Screen name="settings" options={{ title: 'ตั้งค่า' }} />
        {/* lessons/[id] ตั้งชื่อ header เองในไฟล์ของมัน */}
      </Stack>
    </>
  );
}
