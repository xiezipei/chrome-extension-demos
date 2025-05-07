// 补充注释
console.log('sw-tips.js');

// 更新提示
const updateTip = async () => {
  const response = await fetch('https://chrome.dev/f/extension_tips');
  const tips = await response.json();
  const randomIndex = Math.floor(Math.random() * tips.length);
  return chrome.storage.local.set({ tip: tips[randomIndex] });
};

// 提示的闹钟名称
const ALARM_NAME = 'tip';

// 创建提示的闹钟
async function createAlarm() {
  const alarm = await chrome.alarms.get(ALARM_NAME);
  if (typeof alarm === 'undefined') {
    chrome.alarms.create(ALARM_NAME, {
      delayInMinutes: 1,
      periodInMinutes: 1440,
    });
    updateTip();
  }
}

// 初始化提示的闹钟
createAlarm();

// 监听提示的闹钟
chrome.alarms.onAlarm.addListener(updateTip);

// 监听消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.greeting === 'tip') {
    chrome.storage.local.get('tip').then(sendResponse);
    return true;
  }
});
