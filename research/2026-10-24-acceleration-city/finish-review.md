disposition: recapture

## recapture

- 缺少本次 Acceleration City 的手机视口截图。指定的 `screenshots/25-local-mobile-game.jpg` 不存在；备用 `.impeccable/review/mobile.png` 是 Coreball，不能用于本项目。需在约 390×844 下捕获页首、完整工具栏和设备说明，并确认无横向溢出；指南也需一张手机阅读截图。
- `screenshots/21-local-desktop-loaded.jpg`、`22-local-desktop-playing.jpg` 和 `23-local-focus-view.jpg` 均早于最后的页内重载确认与高度调整。需在当前代码上重拍桌面页首/游戏、专注视图及展开的重载确认；确认区须显示警告、Reload game、Keep playing，且游戏与退出控件没有被遮挡。用取消、Escape 和明确确认分别验证行为；静态/事件 harness 结果不能替代这一轮视觉证据。
- `screenshots/24-local-fullscreen.jpg` 实际显示的是 “Fullscreen was unavailable; focus view is on.”，可作为全屏失败回退证据，不能作为原生全屏成功证据。下一轮应准确命名回退截图；若要宣称原生全屏通过，还需捕获真正进入浏览器元素全屏后的游戏与退出控件。
- 本轮因证据检查失败而停止于 check 0；未形成代码/视觉质量矩阵，也未裁定 detector 的 hover 与逻辑间距结果。浏览器恢复后，以当前构建的完整桌面和手机截图做一次完整复审，不能只做修复评分。
