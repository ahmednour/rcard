const fs = require("fs");
const path = require("path");
const Jimp = require("jimp");
const svg2img = require("svg2img");

// Path to SVG file
const svgPath = path.join(__dirname, "public", "Najran-Municipality.svg");
const svgContent = fs.readFileSync(svgPath, "utf8");

// Create multiple sizes for the favicon (16x16, 32x32, 48x48)
const sizes = [16, 32, 48, 64];

async function createFavicon() {
  try {
    console.log("Creating favicon from SVG...");

    // First convert SVG to PNG at the largest size
    svg2img(svgContent, { width: 64, height: 64 }, async (err, buffer) => {
      if (err) {
        console.error("Error converting SVG to PNG:", err);
        return;
      }

      // Save the PNG temporarily
      const pngPath = path.join(__dirname, "public", "favicon-temp.png");
      fs.writeFileSync(pngPath, buffer);

      console.log("Temporary PNG created at:", pngPath);
      console.log("Now create the favicon.ico file with an image editor");
      console.log("Steps:");
      console.log(
        "1. Open the PNG in an image editor that supports ICO format"
      );
      console.log('2. Save the file as "favicon.ico" in the public folder');
      console.log("3. Delete the temporary PNG file");

      console.log("Process complete!");
    });
  } catch (error) {
    console.error("Error creating favicon:", error);
  }
}

createFavicon();
