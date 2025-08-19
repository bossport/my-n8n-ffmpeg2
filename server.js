const express = require("express");
const multer = require("multer");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/make-video", upload.array("files"), async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length < 2) {
      return res.status(400).send("حداقل یک صدا و یک تصویر نیاز است");
    }

    // جدا کردن عکس‌ها و صدا
    const images = files.filter(f => f.mimetype.startsWith("image"));
    const audio = files.find(f => f.mimetype.startsWith("audio"));

    if (images.length === 0 || !audio) {
      return res.status(400).send("باید حداقل یک عکس و یک صدا بدهی");
    }

    // مرتب کردن عکس‌ها به ترتیب اسم
    images.sort((a, b) => a.originalname.localeCompare(b.originalname));

    const imageDir = "uploads/images";
    if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true });

    images.forEach((img, i) => {
      fs.renameSync(img.path, path.join(imageDir, `img${String(i).padStart(3, "0")}.jpg`));
    });

    const audioPath = path.join("uploads", audio.filename + path.extname(audio.originalname));
    fs.renameSync(audio.path, audioPath);

    const output = `uploads/output_${Date.now()}.mp4`;

    // ساخت ویدیو ساده (هر عکس 5 ثانیه)
    const command = `ffmpeg -y -framerate 1/5 -i ${imageDir}/img%03d.jpg -i ${audioPath} -c:v libx264 -c:a aac -shortest ${output}`;

    exec(command, (err) => {
      if (err) {
        return res.status(500).send("خطا در ffmpeg: " + err.message);
      }

      res.download(output, "video.mp4", () => {
        fs.rmSync("uploads", { recursive: true, force: true });
      });
    });
  } catch (err) {
    res.status(500).send("خطای داخلی سرور: " + err.message);
  }
});

app.listen(3000, () => {
  console.log("FFmpeg API running on port 3000");
});
