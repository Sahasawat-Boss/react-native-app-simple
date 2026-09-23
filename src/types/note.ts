// โครงสร้างข้อมูลของ 1 รายการ (โน้ต / to-do item)
// ใน React Native เราไม่มี "database" ในตัว จึงกำหนด type เองแล้วเก็บเป็น JSON ผ่าน AsyncStorage
export type Note = {
  id: string;
  title: string;
  content: string;
  done: boolean;
  createdAt: number; // เก็บเป็น timestamp (Date.now()) เพื่อเรียงลำดับ/แสดงเวลาได้ง่าย
};
