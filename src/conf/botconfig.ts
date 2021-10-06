export const dev: string[] = ["441958036362493962", "497336267252432897"];
export const nodes: { host: string; port: number; password: string }[] = [
  { host: "localhost", port: 6666, password: "password" },
];
export const clientID: string = process.env.clientID;
export const clientSecret: string = process.env.clientSecret;
export const settings = {
  COMMENT: "time_delay 0 === insta leave",
  progressbar_emoji: "🔶",
  leaveOnEmpty_Channel: { enable: true, time_delay: 60000 },
  LeaveOnEmpty_Queue: { enable: true, time_delay: 30000 },
  selfDef: true,
  serverDef: true,
};
export const embed = {
  color: "#8106f6",
  wrongcolor: "#e01e01",
  footertext: "RaRNime | powered by kiara.pw",
  footericon:
    "https://cdn.discordapp.com/attachments/891235330735366164/891387071376269342/amelia_corp.png",
};
export const emoji = {
  react: {
    COMMENT:
      "IF YOU DECIDE TO USE CUSTOM EMOJIS, USE JUST THE ID IN REACT, EXAMPLE: ⏪ --> 818558865268408341",
    ERROR: "❌",
    SUCCESS: "✅",
    rewind: "⏪",
    forward: "⏩",
    pause_resume: "⏯️",
    stop: "⏹️",
    previous_track: "⏮️",
    skip_track: "⏭️",
    replay_track: "🔃",
    reduce_volume: "🔉",
    raise_volume: "🔊",
    toggle_mute: "🔇",
    repeat_mode: "🔄",
    autoplay_mode: "♾",
    shuffle: "🔀",
    show_queue: "📑",
    show_current_track: "🩸",
  },
  msg: {
    COMMENT:
      "IF YOU DECIDE TO USE CUSTOM EMOJIS, USE THE NAME AND THE ID IN MSG, EXAMPLE: ⬜ --> <:progressbar_left_filled:818558865268408341>",
    ERROR: "❌",
    SUCCESS: "✅",
    disabled: "❌",
    enabled: "✅",
    progress_bar: {
      leftindicator: "[",
      rightindicator: "]",
      emptyframe: "⬜",
      filledframe: "🟧",
    },
    playing: "🎶",
    pruning: "💬",
    equalizer: "🎚",
    cleared: "🗑",
    leave_on_empty: "🗣️",
    time: "⌛",
    premium: "💰",
    song_by: "💯",
    setup: "⚙️",
    dj: "🎧",
    bot: "🤖",
    search: "🔎",
    resume: "▶",
    pause: "⏸",
    lyrics: "📃",
    disk: "📀",
    ping: "🏓",
    rewind: "⏪",
    forward: "⏩",
    pause_resume: "⏯️",
    stop: "⏹️",
    previous_track: "⏮️",
    skip_track: "⏭️",
    replay_track: "🔃",
    reduce_volume: "🔉",
    raise_volume: "🔊",
    toggle_mute: "🔇",
    repeat_mode: "🔄",
    autoplay_mode: "♾",
    shuffle: "🔀",
    show_queue: "📑",
    show_current_track: "🩸",
  },
};
export const songoftheday = { track: { url: "https://www.youtube.com/watch?v=gADgM89skZQ", title: "Tones and I - Dance Monkey (Lyrics)", duration: "03:29 | 209 Seconds", thumbnail: "https://img.youtube.com/vi/gADgM89skZQ/default.jpg"}, message: "Today It's a masterpeace which gives you happyness and old feelings."};