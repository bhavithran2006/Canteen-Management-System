import { execFile } from "child_process";
import fs from "fs";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const args = [
  "--headless",
  "--disable-gpu",
  "--screenshot=e:\\Can\\canteen-app\\admin_shot.png",
  "--window-size=1440,1100",
  "--virtual-time-budget=3000",
  "http://localhost:5173/#login"
];

execFile(chromePath, args, (err, stdout, stderr) => {
  if (err) {
    console.error("Exec error:", err);
  } else {
    console.log("Screenshot taken! File exists:", fs.existsSync("e:\\Can\\canteen-app\\admin_shot.png"));
  }
});
