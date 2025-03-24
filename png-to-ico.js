const fs = require("fs");
const path = require("path");
const toIco = require("to-ico");

async function convertToIco() {
  try {
    console.log("Converting PNG to ICO...");

    const inputPath = path.join(__dirname, "public", "favicon-temp.png");
    const pngBuffer = fs.readFileSync(inputPath);

    // Convert to ICO format with multiple sizes
    const icoBuffer = await toIco([pngBuffer], {
      sizes: [16, 32, 48, 64],
      resize: true,
    });

    // Save as ICO file
    const outputPath = path.join(__dirname, "public", "fav.ico");
    fs.writeFileSync(outputPath, icoBuffer);

    console.log("Favicon created at:", outputPath);
    console.log("Process complete!");
  } catch (error) {
    console.error("Error creating favicon:", error);
  }
}

convertToIco();
