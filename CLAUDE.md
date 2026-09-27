# Softnity – คู่มือสำหรับ Claude Code

- เกม MMORPG บนเบราว์เซอร์ ใช้ Phaser 3 (CDN) + three.js (dynamic import จาก jsDelivr)
- โค้ดเกมอยู่ใน `src/game/NN-*.ts` ถูกนำมาต่อกันตามลำดับเลขไฟล์โดย plugin ใน `vite.config.ts` (ยังไม่ใช่ ES module) ตัวแปรระดับบนสุดใช้ร่วมกันทุกไฟล์
- ห้ามเปลี่ยนลำดับไฟล์หรือเพิ่ม `import/export` ในไฟล์เหล่านี้ ถ้าจะสร้างระบบใหม่เป็น module ให้สร้างนอก `src/game` แล้วค่อยเชื่อม
- ข้อความในเกมเป็นภาษาไทย
- ทดสอบด้วย `npm run build` ก่อน commit
- UI ใช้ธีม `body.ui5` (glass) ใน `src/styles/main.css`
- ภาพตัวละคร/ฉาก HD สร้างจากโมเดลใน `06-models3d.ts` (ไฟล์เดียวกับที่ Sprite Studio ใช้)
- push ขึ้น `master` แล้ว GitHub Actions deploy ขึ้น GitHub Pages
