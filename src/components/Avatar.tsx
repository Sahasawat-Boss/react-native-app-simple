// รูปโปรไฟล์วงกลม (ใช้ตัวอักษรแรกของชื่อแทนรูปจริง) + จุดเขียวมุมล่างขวาถ้าออนไลน์
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  name: string;
  color: string;
  size?: number;
  online?: boolean;
};

export function Avatar({ name, color, size = 52, online = false }: Props) {
  const { colors } = useTheme();
  const dot = Math.max(10, size * 0.28);

  return (
    <View style={{ width: size, height: size }}>
      <View
        style={[
          styles.circle,
          { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
        ]}
      >
        <Text style={[styles.initial, { fontSize: size * 0.42 }]}>{name.charAt(0)}</Text>
      </View>
      {online && (
        <View
          style={[
            styles.dot,
            {
              width: dot,
              height: dot,
              borderRadius: dot / 2,
              borderColor: colors.background,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    color: '#fff',
    fontWeight: '700',
  },
  dot: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#31a24c',
    borderWidth: 2.5,
  },
});
