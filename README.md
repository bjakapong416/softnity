# Softnity

Pixel MMORPG ต้นแบบบนเบราว์เซอร์ (เฟส 1) ใช้ Ragnarok Online เป็นกรณีศึกษา

- เอนจิน: Phaser 3.80.1 (โหลดจาก cdnjs)
- ไฟล์เดียว: `index.html` เปิดในเบราว์เซอร์ได้ทันที ไม่ต้อง build
- ข้อมูลตัวละครบันทึกใน localStorage ของเบราว์เซอร์

## เล่นบนเครื่อง

เปิด `index.html` ด้วยเบราว์เซอร์ หรือรันเซิร์ฟเวอร์เล็ก ๆ:

```bash
npx serve .
# หรือ
python3 -m http.server 8080
```

## Deploy (GitHub Pages)

เปิดใช้งานที่ **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: main / (root)**
เกมจะอยู่ที่ `https://<username>.github.io/softnity/`

## ปุ่มลัด

| ปุ่ม | ใช้ทำ |
|---|---|
| W A S D / ลูกศร | เดิน |
| Space | โจมตี |
| Q E R | สกิล |
| 1–4 | ไอเทมลัด |
| F | เก็บของ |
| B | เปิด/ปิดบอท |
| C / K / U / I / M | สถานะ / สกิล / อุปกรณ์ / กระเป๋า / แผนที่ |
| Z | นั่งพัก |
| Enter | แชท |

## โครงสร้างถัดไป (ตาม GDD)

ย้ายเข้า monorepo `softnity-client` (Phaser + TypeScript + Vite), `softnity-server` (Node.js + Colyseus), `softnity-shared` (สูตรและ data) เมื่อเริ่มเฟส 2 Multiplayer
