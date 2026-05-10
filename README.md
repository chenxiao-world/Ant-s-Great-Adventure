# Ant's Great Adventure / Ant Escape
A fun retro-style puzzle platformer game where you play as an ant trying to escape an infested area, solving puzzles, collecting food points, and unlocking skins!

## 🎮 直接开始游戏 (Play Now)
既然项目已经连接并同步到了 GitHub，最方便让其他所有人访问的方法是使用 **GitHub Pages** 服务。
如果你的项目已经配置了 GitHub Pages（推荐），可以直接点击下方链接在任何设备的浏览器中游玩：
**[🕹️ 点击这里通过 GitHub Pages 访问游戏](https://chenxiao-world.github.io/Ant-s-Great-Adventure/)**

*(💡 注意：如果上面的 GitHub 链接显示 404 找不到网页，请确保在你的 GitHub 仓库（Settings -> Pages）中开启了 Pages 服务，并选择使用代码的正确分支（通常是 `gh-pages`、`main` 或包含构建后文件的目录）进行部署。)*

你之前看到的 `ais-pre-...run.app` 链接是 AI Studio 内部的临时预览链接，有严格的访问鉴权控制，所以换了电脑或没登录相关账号就无法访问。

## ⌨️ 游戏控制 (Controls)
- **A / D 或 左右方向键**: 移动 (Move left/right)
- **W / 向上方向键**: 跳跃 (Jump) - 支持二段跳 (Double jump supported!)
- **SPACE**: 投掷石头 (Throw rock, needs to be unlocked in the shop)

## 🛠️ 本地运行指南 (Local Development)
如果你想在本地运行和修改游戏，请按照以下步骤操作：

1. 确保你已经安装了 [Node.js](https://nodejs.org/)。
2. 克隆或下载本项目到本地。
3. 在项目根目录下打开终端，运行以下命令安装依赖：
   ```bash
   npm install
   ```
4. 启动本地开发服务器：
   ```bash
   npm run dev
   ```
5. 在浏览器中打开 `http://localhost:3000` 即可体验游戏。
