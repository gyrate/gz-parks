# 广州公园景区指南

一个基于高德地图API的广州市公园景区展示网页，提供公园信息查询、地图定位、分布统计等功能。

## 功能特色

- 🗺️ **互动地图**：基于高德地图API，展示广州各大公园位置
- 📊 **数据可视化**：使用Chart.js展示各区公园分布情况
- 🔍 **智能筛选**：支持按区域和收费情况筛选公园
- 📱 **响应式设计**：适配桌面端和移动端设备
- 🎨 **清新界面**：采用绿色、蓝色、白色的自然配色方案

## 技术栈

- **前端框架**：原生HTML5 + CSS3 + JavaScript
- **地图服务**：高德地图Web API 2.0
- **图表库**：Chart.js
- **样式**：CSS Grid + Flexbox布局
- **图标**：SVG矢量图标

## 快速开始

### 1. 获取高德地图API Key

1. 访问[高德开放平台](https://lbs.amap.com/)
2. 注册并登录账号
3. 创建应用，获取Web服务API Key
4. 在`index.html`中替换`YOUR_AMAP_KEY`为您的实际API Key：

```html
<script src="https://webapi.amap.com/maps?v=2.0&key=您的API_KEY"></script>
```

### 2. 本地运行

由于浏览器的同源策略限制，建议使用本地服务器运行项目：

```bash
# 使用Python启动简单HTTP服务器
python -m http.server 8000

# 或使用Node.js的http-server
npx http-server

# 或使用Live Server扩展（VS Code）
```

然后在浏览器中访问 `http://localhost:8000`

### 3. 项目结构

```
gz-parks/
├── index.html          # 主页面文件
├── styles.css          # 样式文件
├── script.js           # JavaScript逻辑
├── logo.svg           # 网站Logo
├── logo.png           # 备用Logo（已弃用）
└── README.md          # 项目说明
```

## 主要功能模块

### 1. 头部导航
- Logo展示
- 导航菜单（首页、公园介绍、分布情况、公园列表、联系我们）
- 响应式设计，移动端自适应

### 2. 地图展示
- 全屏地图显示
- 公园位置标记
- 点击标记显示公园详细信息
- 地图样式：清新风格

### 3. 公园介绍
- 广州公园特色介绍
- 卡片式布局展示公园分类
- 动画效果增强用户体验

### 4. 分布统计
- 柱状图展示各区公园数量
- 动态数据统计
- 响应式图表设计

### 5. 公园列表
- 筛选功能：按区域、收费情况筛选
- 卡片式公园展示
- 包含公园照片、位置、开放时间、收费情况、简介
- 点击卡片可在地图上定位

### 6. 页脚信息
- 网站信息
- 快速链接
- 法律信息
- 联系方式

## 数据说明

项目内置了11个广州主要公园的示例数据，包括：

- 越秀公园（越秀区）
- 荔枝湾涌公园（荔湾区）
- 海珠湖公园（海珠区）
- 天河公园（天河区）
- 白云山风景区（白云区）
- 黄埔公园（黄埔区）
- 大夫山森林公园（番禺区）
- 花都湖公园（花都区）
- 南沙湿地公园（南沙区）
- 流溪河国家森林公园（从化区）
- 增城公园（增城区）

## 自定义配置

### 添加新公园

在`script.js`的`parksData`数组中添加新的公园数据：

```javascript
{
    id: 12,
    name: "新公园名称",
    district: "所属区域",
    location: "详细地址",
    coordinates: [经度, 纬度],
    openTime: "开放时间",
    fee: "免费" | "收费",
    image: "图片URL",
    description: "公园描述"
}
```

### 修改样式主题

在`styles.css`中修改CSS变量来改变主题色彩：

```css
:root {
    --primary-color: #2e7d32;    /* 主色调 */
    --secondary-color: #4a90e2;  /* 辅助色 */
    --background-color: #f8fffe; /* 背景色 */
}
```

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 注意事项

1. **API Key安全**：请不要在生产环境中暴露您的高德地图API Key
2. **图片资源**：示例中使用了占位图片，实际使用时请替换为真实的公园图片
3. **数据更新**：公园信息可能会发生变化，建议定期更新数据
4. **性能优化**：如果公园数量较多，建议实现分页或虚拟滚动

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！

---

**开发者**：Vue.js全栈工程师  
**联系方式**：gyratesky@gmail.com
**项目地址**：https://github.com/gyrate/gz-parks