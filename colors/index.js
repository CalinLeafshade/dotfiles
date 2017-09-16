const input = require("./input.json");
const fs = require("fs");
const path = require("path");
const ini = require("ini");
const tmp = require("tmp");
const { spawn } = require("child_process");
const rl = require("readlines");

function getUserHome() {
  return process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];
}

const TERMINALRC = path.join(
  getUserHome(),
  "/.config/xfce4/terminal/terminalrc"
);

const XRESOURCES = path.join(getUserHome(), "/.Xresources");

var config = ini.parse(fs.readFileSync(TERMINALRC, "utf-8"));

const processColor = c =>
  `#${c[1]}${c[2]}${c[1]}${c[2]}${c[3]}${c[4]}${c[3]}${c[4]}${c[5]}${c[6]}${c[5]}${c[6]}`;

config.Configuration = config.Configuration || {};
config.Configuration.ColorCursor = processColor(input.foreground);
config.Configuration.ColorForeground = processColor(input.foreground);
config.Configuration.ColorBackground = processColor(input.background);
config.Configuration.ColorPalette = input.color.map(processColor).join(";");

var tmpobj = tmp.fileSync();

fs.writeFileSync(
  tmpobj.name,
  ini
    .stringify(config)
    .replace(/\\#/g, "#")
    .replace(/\\;/g, ";")
);

const cp = spawn("cp", [tmpobj.name, TERMINALRC]);

cp.on("close", code => {
  console.log("Written TerminalRC");
});

tmpobj.removeCallback();

// X RESOURCES

const lines = rl.readlinesSync(XRESOURCES);

var output = lines
  .map(x => {
    if (x.startsWith("*foreground")) {
      return `*foreground: ${input.foreground}`;
    } else if (x.startsWith("*background")) {
      return `*background: ${input.background}`;
    } else if (x.startsWith("*cursorColor:")) {
      return `*cursorColor: ${input.foreground}`;
    } else if (x.startsWith("*color")) {
      const idx = Number(/\*color(\d+):/.exec(x)[1]);
      return `*color${idx}: ${input.color[idx]}`;
    } else if (x.startsWith("rofi.color-window")) {
      return `rofi.color-window: ${input.background}, ${input.background}, ${input
        .color[8]}`;
    } else if (x.startsWith("rofi.color-normal")) {
      return `rofi.color-normal: ${input.background}, ${input
        .color[8]}, ${input.background}, ${input.background}, ${input
        .color[1]}`;
    } else {
      return x;
    }
  })
  .join("\n");

fs.writeFileSync(XRESOURCES, output);
const merge = spawn("xrdb", [XRESOURCES]);

merge.on("close", code => {
  console.log("Written XRESOURCES");
});
