// There's a typo in the line below;
// ❌ oninstalled should be ✅ onInstalled.
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color: '#3aa757' }, () => {
    console.log('The background color is green.');
  });
});
