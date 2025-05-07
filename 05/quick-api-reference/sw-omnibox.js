// 参考文档的链接
const URL_VUE_DOC = 'https://cn.vuejs.org/api/';

// 限制显示的数量
const NUMBER_OF_PREVIOUS_SEARCHES = 5;

// 通过监听 `runtime.onInstalled()` 事件，在扩展程序首次安装时初始化状态
// （以后可以参考这个写法对应用实现一些初始化配置）
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    // 通过以 key-value 形式存入 chrome.storage.local；初始化默认提供了 3 个 api 关键词
    chrome.storage.local.set({
      apiSuggestions: ['application', 'general', 'composition-api-setup'],
    });
  }
});

// 在“万能输入框”监听输入变化事件，并提供默认建议
chrome.omnibox.onInputChanged.addListener(async (input, suggest) => {
  // 设置默认建议
  await chrome.omnibox.setDefaultSuggestion({
    description: 'Enter a Vue API or choose from past searches',
  });
  // 从本地存储获取API建议列表
  const { apiSuggestions } = await chrome.storage.local.get('apiSuggestions');
  // 根据API建议列表生成搜索建议
  // 参数解释：
  // - content: 用户选择建议后实际使用的值
  // - description: 在地址栏下拉列表中显示给用户看的文本
  const suggestions = apiSuggestions.map((api) => {
    return { content: api, description: `Open Vue ${api} API` };
  });
  // 使用自定义拼接好的 suggestions 提供搜索建议
  // suggest 函数是由 Chrome 浏览器自动注入的，用于向 Chrome 地址栏提供搜索建议
  suggest(suggestions);
});

// 监听输入完成事件（即用户按下 Enter），并处理输入的内容
chrome.omnibox.onInputEntered.addListener((input) => {
  // 根据输入的内容创建新标签页，打开对应的 Vue API文档
  chrome.tabs.create({ url: URL_VUE_DOC + input });
  // 更新搜索历史
  updateHistory(input);
});

// 更新搜索历史的函数
async function updateHistory(input) {
  // 从本地存储获取API建议列表
  const { apiSuggestions } = await chrome.storage.local.get('apiSuggestions');
  // 将当前输入的内容添加到搜索历史的最前面
  apiSuggestions.unshift(input);
  // 保持搜索历史的数量不超过指定的限制
  apiSuggestions.splice(NUMBER_OF_PREVIOUS_SEARCHES);
  // 更新本地存储中的搜索历史
  return chrome.storage.local.set({ apiSuggestions });
}
