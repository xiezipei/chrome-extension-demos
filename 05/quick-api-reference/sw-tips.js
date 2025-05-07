// 获取/更新提示
const updateTip = async () => {
  const response = await fetch('https://chrome.dev/f/extension_tips');
  const tips = await response.json();
  const randomIndex = Math.floor(Math.random() * tips.length);
  console.log('updateTip');
  return chrome.storage.local.set({ tip: tips[randomIndex] });
};

// 提示的闹钟名称
const ALARM_NAME = 'tip';

// 创建提示的闹钟：
// 每当闹钟（比如每天一次）触发时，就自动执行 updateTip，去获取新的小贴士
async function createAlarm() {
  const alarm = await chrome.alarms.get(ALARM_NAME);
  // 如果不存在则创建新闹钟
  if (typeof alarm === 'undefined') {
    // 用 chrome.alarms.create 创建了一个定时任务（比如每隔一段时间执行某个操作）
    // 当这个定时任务到点时，chrome.alarms.onAlarm 事件就会被触发
    chrome.alarms.create(ALARM_NAME, {
      delayInMinutes: 1, // 延迟一分钟
      periodInMinutes: 1440, // 间隔一天
    });
    updateTip();
  }
  console.log('createAlarm');
}

// 初始化提示的闹钟
createAlarm();

// 监听提示的闹钟
chrome.alarms.onAlarm.addListener(updateTip);

// 监听消息：

// chrome.runtime.onMessage 这个 API 是 Chrome 扩展中的消息监听器，
// 用于监听来自其他扩展脚本（如 content script、background、popup、options 等）发送的消息，
// 实现不同脚本之间的通信

// message：收到的消息内容
// sender：消息的发送者信息
// sendResponse：用于回复消息的函数

// 那么，谁是发送方（sender）？
// 发送方是通过 chrome.runtime.sendMessage 主动发消息的脚本
// 这是发送方是来自 content.js 的 `const { tip } = await chrome.runtime.sendMessage({ greeting: 'tip' });`

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 当收到消息 { greeting: 'tip' } 时，从本地存储读取 tip，并通过 sendResponse 返回给发送方（比如 content script）
  if (message.greeting === 'tip') {
    chrome.storage.local.get('tip').then(sendResponse);
    console.log('greeting', sender);
    return true; // 这里告诉 Chrome：我会异步调用 sendResponse，请等我
  }
});
