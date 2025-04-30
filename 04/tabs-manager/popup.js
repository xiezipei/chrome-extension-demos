// 查询符合特定URL模式的标签页
const tabs = await chrome.tabs.query({
  url: ['https://developer.chrome.com/docs/webstore/*', 'https://developer.chrome.com/docs/extensions/*'],
});

// 使用Intl.Collator对标签页按照标题进行排序
const collator = new Intl.Collator();
tabs.sort((a, b) => collator.compare(a.title, b.title));

// 获取模板元素
const template = document.getElementById('li_template');
// 创建一个Set来存储生成的元素，以避免重复
const elements = new Set();
// 遍历排序后的标签页数组
for (const tab of tabs) {
  // 克隆模板元素
  const element = template.content.firstElementChild.cloneNode(true);

  // 从标签页标题中提取主要标题
  const title = tab.title.split('-')[0].trim();
  // 从标签页URL中提取路径名
  const pathname = new URL(tab.url).pathname.slice('/docs'.length);

  // 设置元素的标题和路径名
  element.querySelector('.title').textContent = title;
  element.querySelector('.pathname').textContent = pathname;
  // 为元素添加点击事件监听器，用于激活对应的标签页和窗口
  element.querySelector('a').addEventListener('click', async () => {
    // 需要同时激活窗口和标签页
    await chrome.tabs.update(tab.id, { active: true });
    await chrome.windows.update(tab.windowId, { focused: true });
  });

  // 将生成的元素添加到Set中
  elements.add(element);
}
// 将所有生成的元素添加到文档的UL元素中
document.querySelector('ul').append(...elements);

// 获取按钮元素
const button = document.querySelector('button');
// 为按钮添加点击事件监听器，用于分组标签页
button.addEventListener('click', async () => {
  // 获取所有标签页的ID
  const tabIds = tabs.map(({ id }) => id);
  // 如果有标签页，则分组它们
  if (tabIds.length) {
    const group = await chrome.tabs.group({ tabIds });
    await chrome.tabGroups.update(group, { title: 'DOCS' });
  }
});
