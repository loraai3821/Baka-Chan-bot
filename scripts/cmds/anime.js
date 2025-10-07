const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "anime",
    aliases: ["supanime", "ani"],
    version: "1.0",
    author: "Farhan",
    countDown: 10,
    role: 0,
    shortDescription: {
      en: "Generate anime style image"
    },
    longDescription: {
      en: "Generate an anime style image from a text prompt using SupAnime API"
    },
    category: "image",
    guide: {
      en: "{pn} dog\n{pn} girl with sword"
    }
  },

  onStart: async function ({ message, args }) {
    try {
      const prompt = args.join(" ");
      if (!prompt) {
        return message.reply("⚠️ Please provide a prompt.\nExample: anime dog");
      }

      await message.reply("⏳ Generating anime image...");

      const apiUrl = `https://dev.oculux.xyz/api/supanime?prompt=${encodeURIComponent(prompt)}`;
      const imgPath = path.join(__dirname, "cache", `anime_${Date.now()}.jpg`);

      const res = await axios.get(apiUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(imgPath, res.data);

      await message.reply({
        body: `✅ Anime Image Generated!\n🎨 Prompt: ${prompt}`,
        attachment: fs.createReadStream(imgPath)
      });

      setTimeout(() => fs.unlinkSync(imgPath), 5000); // cleanup cache

    } catch (err) {
      console.error("anime command error:", err.message);
      return message.reply("❌ Failed to generate anime image.");
    }
  }
};
