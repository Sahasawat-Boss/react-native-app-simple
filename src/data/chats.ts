// ข้อมูลตั้งต้นของเมนูแชท (เพื่อนสมมติ + ข้อความเริ่มต้น) — ไม่มี server จริง
// ข้อความที่ผู้ใช้ส่งเพิ่มจะถูกเก็บใน AsyncStorage ผ่าน useChats
// สีหลักของเมนูแชท (ฟองข้อความของเรา, ปุ่มส่ง, จุดยังไม่อ่าน)
export const CHAT_COLOR = '#0a7cff';

export type Contact = {
  id: string;
  name: string;
  color: string; // สีพื้นหลังของรูปโปรไฟล์ (ใช้ตัวอักษรแรกแทนรูปจริง)
  online: boolean;
  lastSeen?: string; // แสดงเมื่อไม่ออนไลน์ เช่น "ใช้งานเมื่อ 2 ชม.ที่แล้ว"
  replies: string[]; // ข้อความที่เพื่อนจะตอบกลับอัตโนมัติ (สุ่มจากในนี้)
};

export type Message = {
  id: string;
  chatId: string;
  fromMe: boolean;
  text: string;
  createdAt: number;
};

export const CONTACTS: Contact[] = [
  {
    id: 'mint',
    name: 'มิ้นท์',
    color: '#e5484d',
    online: true,
    replies: ['จริงดิ 555', 'โอเคๆ', 'เดี๋ยวไปหานะ', 'ได้เลยยย 🙌', 'อ่านแล้วแต่ขี้เกียจตอบ 😝'],
  },
  {
    id: 'bank',
    name: 'แบงค์',
    color: '#0091ff',
    online: true,
    replies: ['ลองรัน npx expo start --clear ดูยัง', 'เดี๋ยวดูให้', 'เยี่ยมมาก 👍', 'ส่งโค้ดมาดูหน่อย'],
  },
  {
    id: 'ploy',
    name: 'พลอย',
    color: '#f76b15',
    online: false,
    lastSeen: 'ใช้งานเมื่อ 15 นาทีที่แล้ว',
    replies: ['ขอบคุณน้าา', 'เจอกันพรุ่งนี้', '🥰', 'ได้ๆ'],
  },
  {
    id: 'team',
    name: 'ทีม React Native',
    color: '#12a594',
    online: true,
    replies: ['ประชุม 10 โมงนะทุกคน', 'PR merge แล้ว', 'ใครว่างช่วย review หน่อย 🙏', 'lol'],
  },
  {
    id: 'mom',
    name: 'แม่',
    color: '#8e4ec6',
    online: false,
    lastSeen: 'ใช้งานเมื่อ 2 ชม.ที่แล้ว',
    replies: ['กินข้าวยังลูก', 'อย่านอนดึกนะ', 'โอเคจ้า'],
  },
];

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

// สร้างข้อความตั้งต้น เวลาอิงจากตอนเปิดแอปครั้งแรก (ago = กี่ ms ก่อนหน้านี้)
export function createSeedMessages(now: number): Message[] {
  const seed: [chatId: string, fromMe: boolean, text: string, ago: number][] = [
    ['mint', false, 'ว่างป่าววว', 9 * MINUTE],
    ['mint', true, 'ว่างๆ มีอะไร', 8 * MINUTE],
    ['mint', false, 'ไปกินหมูกระทะกันนน', 7 * MINUTE],
    ['mint', false, 'ร้านเดิมนะ 🔥', 6 * MINUTE],
    ['bank', true, 'แอปขึ้นจอขาวอะ ทำไงดี', 1 * HOUR],
    ['bank', false, 'ลองดู error ใน terminal ก่อน', 55 * MINUTE],
    ['ploy', true, 'ส่งไฟล์ให้แล้วนะ', 3 * HOUR],
    ['ploy', false, 'ได้รับแล้ว ขอบคุณมากๆ', 2.5 * HOUR],
    ['team', false, 'อย่าลืมรัน lint ก่อน push นะ', 5 * HOUR],
    ['mom', false, 'กลับบ้านกี่โมง', 26 * HOUR],
    ['mom', true, 'ประมาณ 6 โมงครับ', 25 * HOUR],
  ];

  return seed.map(([chatId, fromMe, text, ago], index) => ({
    id: `seed-${index}`,
    chatId,
    fromMe,
    text,
    createdAt: now - ago,
  }));
}

export function getContact(id: string): Contact | undefined {
  return CONTACTS.find((contact) => contact.id === id);
}
