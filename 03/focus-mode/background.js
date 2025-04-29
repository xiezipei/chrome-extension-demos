const extensions = 'https://developer.chrome.com/docs/extensions';
const webstore = 'https://developer.chrome.com/docs/webstore';

// 监听扩展程序安装完成事件，并设置徽章文本为'OFF'
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: 'OFF',
  });
});

// 监听扩展程序徽章点击事件
chrome.action.onClicked.addListener(async (tab) => {
  // 检查当前标签页的URL是否为指定的扩展程序或应用商店页面
  if (tab.url.startsWith(extensions) || tab.url.startsWith(webstore)) {
    // 获取当前徽章的文本状态
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    // 根据当前状态切换到下一个状态
    const nextState = prevState === 'ON' ? 'OFF' : 'ON';

    // 设置徽章的文本为下一个状态
    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState,
    });

    // 根据下一个状态执行相应的操作
    if (nextState === 'ON') {
      // 插入样式以启用聚焦模式
      await chrome.scripting.insertCSS({
        files: ['focus-mode.css'],
        target: { tabId: tab.id },
      });
    } else if (nextState === 'OFF') {
      // 移除样式以禁用聚焦模式
      await chrome.scripting.removeCSS({
        files: ['focus-mode.css'],
        target: { tabId: tab.id },
      });
    }
  }
});
