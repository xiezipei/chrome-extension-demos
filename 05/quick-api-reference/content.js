(async () => {
  const { tip } = await chrome.runtime.sendMessage({ greeting: 'tip' });

  const nav = document.querySelector('.content > nav');

  const tipWidget = createDomElement(`
      <button type="button" popovertarget="tip-popover" popovertargetaction="show" style="padding: 0 12px;background:#2eb985;color:#fff;">
      <span style="display: block; font: var(--devsite-link-font,500 14px/20px var(--devsite-primary-font-family));">Tip</span>
      </button>
  `);

  const popover = createDomElement(`<div id='tip-popover' popover style="margin: auto;">${tip}</div>`);

  document.body.append(popover);

  // 插入元素
  nav.append(tipWidget);
})();

// 创建 dom 元素
function createDomElement(html) {
  const dom = new DOMParser().parseFromString(html, 'text/html');
  return dom.body.firstElementChild;
}
