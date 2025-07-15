const fs = require("fs");
const { spawnSync, spawn } = require("child_process");

const zokouEnv = {
  // WhatsApp session ID (used to connect to your account)
  SESSION_ID: "ZOKOU-MD-WHATSAPP-BOT=>49ccef0647",

  // Command prefix to trigger the bot
  PREFIX: ",",

  // If set to "yes", the bot will automatically view all WhatsApp statuses
  AUTO_READ_STATUS: "no",

  // If set to "yes", the bot will automatically download all WhatsApp statuses
  AUTO_DOWNLOAD_STATUS: "yes",

  // Display name of your bot
  BOT_NAME: "Zokou-MD",

  // Visual theme for the bot menus (predefined name or media links)
  MENU_THEME: "Bold",

  // If "no", commands won't work in private for others
  PM_PERMIT: "no",

  // If "yes", the bot is available to everyone; if "no", only the owner can use it
  MODE_PUBLIC: "no",

  // Controls the bot's visible activity: 1 = online, 2 = typing, 3 = recording, empty = real
  PRESENCE: "1",

  // Your display name (owner's name)
  OWNER_NAME: "Dafrank",

  // Your phone number in international format
  OWNER_NUMBER: "27 783 583068",

  // Number of warnings before a user is sanctioned
  WARN_COUNT: 3,

  // If "yes", the bot sends a welcome message on startup
  STARTING_BOT_MESSAGE: "yes",

  // If "yes", the bot automatically replies to private messages
  PM_CHATBOT: "no",

  // If "yes", adds a delay between commands to prevent spam
  ANTI_COMMAND_SPAM: "yes",

  // If "yes", deleted messages by others will be sent to you privately
  ANTI_DELETE_MESSAGE: "no",

  // If "yes", the bot automatically reacts to incoming messages
  AUTO_REACT_MESSAGE: "no",

  // If "yes", the bot automatically reacts to statuses
  AUTO_REACT_STATUS: "no",

  // Time zone used by the bot
  TIME_ZONE: "Africa/Sao_Tome",

  // Server environment used (e.g. HEROKU, VPS, etc.)
  SERVER: "vps",

  // Sticker pack name used by the bot
  STICKER_PACKNAME: "made with ❤; Zokou-MD",
};

//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

function cloneRepository() {
  const cloneResult = spawnSync("git", [
    "clone",
    "https://github.com/luffy8979/Zokou-MD-english",
    "zokou",
  ]);

  if (cloneResult.error) {
    console.error("Error cloning repository:", cloneResult.error);
  }

  const envFile = "zokou/set.env";

  if (!fs.existsSync(envFile)) {
    for (const [key, value] of Object.entries(zokouEnv)) {
      value ? fs.appendFileSync(envFile, `${key}=${value}\n`) : null;
    }
  }

  installDependancies();
}

function installDependancies() {
  const result = spawnSync("npm", ["install"], {
    cwd: "zokou",
    stdio: "inherit",
    env: { ...process.env, CI: "true" },
  });

  if (result.error || result.status !== 0) {
    console.error("Error installing dependencies:", result.error);
    process.exit(1);
  }
}

function checkDependencies() {
  const result = spawnSync("npm", ["ls"], {
    cwd: "zokou",
    stdio: "inherit",
  });

  if (result.status !== 0) {
    console.log("Some dependencies are missing or invalid.");
    installDependancies();
  } else {
    console.log("All dependencies are installed properly.");
  }
}

function startPm2() {
  const pm2 = spawn(
    "npx",
    ["pm2", "start", "index.js", "--name", "zokou", "--attach"],
    {
      cwd: "zokou",
      stdio: "inherit",
    }
  );

  pm2.on("exit", (code) => {
    if (code !== 0) console.error(`PM2 exited with code ${code}`);
  });

  pm2.on("error", (err) => {
    console.error("PM2 encountered an error:", err);
  });

  pm2?.stderr?.on("data", (data) => {
    console.log(data.toString());
  });

  pm2?.stdout?.on("data", (data) => {
    console.log(data.toString());
  });
}

if (!fs.existsSync("zokou")) {
  cloneRepository();
}

checkDependencies();
startPm2();
