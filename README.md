# Softnity

MMORPG ต้นแบบบนเบราว์เซอร์ · Phaser 3 + three.js · TypeScript + Vite

เล่น: https://bjakapong416.github.io/softnity/

## เริ่มพัฒนา

```bash
npm install
npm run dev        # http://localhost:5173 แก้ไฟล์แล้วรีโหลดอัตโนมัติ
npm run build      # สร้างไฟล์เว็บใน dist/
npm run preview    # ทดสอบไฟล์ที่ build แล้ว
npm run typecheck  # ตรวจชนิดข้อมูล (ค่อย ๆ เพิ่ม type ภายหลัง)
```

Push ขึ้น `master` แล้ว GitHub Actions จะ build และ deploy ขึ้น GitHub Pages อัตโนมัติ

## โครงสร้าง

```
index.html               โครง HTML ของ HUD และหน้าต่าง
src/styles/main.css      สไตล์ทั้งหมด (รวมธีม UI โมเดิร์น)
src/game/                โค้ดเกม เรียงลำดับตามเลขไฟล์ ใช้ขอบเขตตัวแปรร่วมกัน
  00-core.ts             ค่าคงที่ ตัวช่วยพื้นฐาน
  01-data.ts             ข้อมูลเกม: อาชีพ สกิล มอนสเตอร์ ไอเทม แผนที่
  02-player.ts           สถานะผู้เล่น การบันทึก
  03-sound.ts            เสียง
  04-textures-pixel.ts   ภาพพิกเซล (โหมดสำรอง)
  05-hero-sprites.ts     ตัวละครพิกเซล
  06-models3d.ts         โมเดล 3D + ตัวเรนเดอร์ sprite (ใช้ร่วมกับ Sprite Studio)
  07-ground-painter.ts   วาดพื้นแผนที่แบบเรียบ
  08-hd-baking.ts        เรนเดอร์ตัวละคร/ฉากเป็นภาพ HD, ไอเทมบนตัวละคร
  09-map.ts              สร้างแผนที่
  10-scene.ts            ฉากหลักของ Phaser, ตัวละครจากไฟล์, แผนที่จากไฟล์
  11-town.ts             เมืองหลวง, บริการในเมือง
  12-pathfinding.ts      A* หาทางเดิน
  13-hero.ts             การควบคุมตัวละคร, ดาเมจ
  14-skills.ts ... 18-bot.ts   สกิล เอฟเฟกต์ มอนสเตอร์ ไอเทม ออโต้
  19-ui-*.ts ... 23-quests-hud.ts   หน้าต่างและ HUD
  24-boot.ts             หน้าโหลด หน้าเข้าเกม สร้างตัวละคร
public/tools/            Sprite Studio, Sprite Importer, Map Importer, 3D preview
public/sprites/          ตัวละครจากไฟล์ (manifest.json)
public/maps/             แผนที่จากไฟล์ (manifest.json)
```

## แผนย้ายเป็น TypeScript เต็มรูปแบบ

1. ตอนนี้ไฟล์ใน `src/game` ยังเป็นโค้ดเดิมที่แยกไฟล์ (ขอบเขตตัวแปรร่วมกันเหมือนเดิม) เพื่อไม่ให้เกมพัง
2. เพิ่ม type ทีละไฟล์ เริ่มจาก `01-data.ts` (interface ของ Item, Monster, Skill)
3. แยกระบบเป็น ES module จริง (`import`/`export`) ทีละส่วน เริ่มจากส่วนที่ไม่พึ่งพาส่วนอื่น เช่น pathfinding, sound
4. ย้าย Phaser และ three.js จาก CDN มาเป็นแพ็กเกจ npm
