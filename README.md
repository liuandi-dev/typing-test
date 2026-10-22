# ⌨️ 打字速度测试

> 100 项目挑战 · 项目 #010 · 方案由 Andy 自己撰写（Day 5 练习）

固定一段中文，60 秒倒计时自动停：实时逐字着色（对绿错红），成绩显示 WPM（每分钟正确字数）、正确率、错误字数。提前打完自动按实际用时折算。

## 文件结构

```
typing-test/
├── index.html   页面结构
├── style.css    样式（着色状态类、闪烁光标）
└── script.js    逻辑（逐字符对比 + 倒计时 + 成绩计算）
```

## 技术点

- **逐字符对比着色**：原文每个字一个 span，输入时按位置比对加 correct/wrong 类
- **WPM 折算**：`正确字数 × 60 ÷ 实际用时秒数`，提前打完不吃亏
- **setInterval/clearInterval**：番茄钟同款的定时器生命周期管理

## 本地预览

双击 `index.html` 即可。

## 在线地址

https://liuandi-dev.github.io/typing-test/
