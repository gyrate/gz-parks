// 广州公园数据（从JSON文件加载）
let parksData = [];

// 全局变量
let map;
let filteredParks = [...parksData];

// 广州各区实际公园数量分布（基于调研数据）
const GUANGZHOU_DISTRICT_PARK_COUNT = {
    '越秀区': 15,
    '荔湾区': 12,
    '海珠区': 18,
    '天河区': 22,
    '白云区': 28,
    '黄埔区': 16,
    '番禺区': 25,
    '花都区': 20,
    '南沙区': 14,
    '从化区': 35,
    '增城区': 30
};

/**
 * 加载公园数据
 * @description 从JSON文件异步加载公园数据
 * @returns {Promise<Array>} 返回公园数据数组
 * @throws {Error} 数据加载失败时抛出错误
 */
async function loadParksData() {
    try {
        const response = await fetch('parks-data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('加载公园数据失败:', error);
        // 返回空数组作为备用
        return [];
    }
}

/**
 * 初始化应用
 * @description 异步初始化应用，先加载数据再初始化各个模块
 */
async function initApp() {
    // 显示加载提示
    const loadingElement = document.createElement('div');
    loadingElement.id = 'loading';
    loadingElement.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(255,255,255,0.9); padding: 20px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 9999; text-align: center;">
            <div style="color: #2e7d32; font-size: 16px; margin-bottom: 10px;">正在加载公园数据...</div>
            <div style="width: 40px; height: 40px; border: 3px solid #e0e0e0; border-top: 3px solid #2e7d32; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    document.body.appendChild(loadingElement);
    
    try {
        // 加载公园数据
        parksData = await loadParksData();
        filteredParks = [...parksData];
        
        // 初始化各个模块
         initMap();
         initChart();
        renderParks(parksData);
        bindEvents();
        
        // 移除加载提示
        document.body.removeChild(loadingElement);
        
        console.log(`成功加载 ${parksData.length} 个公园数据`);
    } catch (error) {
        console.error('应用初始化失败:', error);
        // 移除加载提示并显示错误信息
        document.body.removeChild(loadingElement);
        
        const errorElement = document.createElement('div');
        errorElement.innerHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #ffebee; color: #c62828; padding: 20px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 9999; text-align: center; border: 1px solid #ef5350;">
                <h3 style="margin: 0 0 10px 0;">数据加载失败</h3>
                <p style="margin: 0;">请检查网络连接或刷新页面重试</p>
            </div>
        `;
        document.body.appendChild(errorElement);
        
        // 3秒后自动移除错误提示
        setTimeout(() => {
            if (document.body.contains(errorElement)) {
                document.body.removeChild(errorElement);
            }
        }, 3000);
    }
}

/**
 * 初始化高德地图
 * @description 创建地图实例并添加公园标记点
 */
function initMap() {
    // 检查高德地图API是否加载
    if (typeof AMap === 'undefined') {
        console.warn('高德地图API未加载，请配置正确的API Key');
        // 创建一个提示信息替代地图
        const mapContainer = document.getElementById('map');
        mapContainer.innerHTML = `
            <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; background: linear-gradient(135deg, #4a90e2 0%, #2e7d32 100%); color: white; text-align: center; padding: 40px;">
                <div style="font-size: 48px; margin-bottom: 20px;">🗺️</div>
                <h2 style="margin-bottom: 15px;">地图功能需要配置</h2>
                <p style="margin-bottom: 10px;">请在index.html中配置您的高德地图API Key</p>
                <p style="font-size: 14px; opacity: 0.8;">访问 https://lbs.amap.com/ 获取API Key</p>
            </div>
        `;
        return;
    }
    
    // 请替换为您的高德地图API Key
    map = new AMap.Map('map', {
        zoom: 11,
        center: [113.3644, 23.1291], // 广州市中心坐标
        mapStyle: 'amap://styles/fresh'
    });

    // 添加公园标记点
    parksData.forEach(park => {
        const marker = new AMap.Marker({
            position: park.coordinates,
            title: park.name,
            icon: new AMap.Icon({
                size: new AMap.Size(32, 32),
                image: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                        <circle cx="16" cy="16" r="12" fill="#2e7d32" stroke="white" stroke-width="2"/>
                        <circle cx="16" cy="14" r="6" fill="#4a90e2"/>
                        <circle cx="16" cy="14" r="3" fill="white"/>
                    </svg>
                `)
            })
        });

        // 添加信息窗体
        const infoWindow = new AMap.InfoWindow({
            content: `
                <div style="padding: 10px; min-width: 200px;">
                    <h3 style="color: #2e7d32; margin-bottom: 8px;">${park.name}</h3>
                    <p style="margin: 5px 0; color: #666;"><strong>位置：</strong>${park.location}</p>
                    <p style="margin: 5px 0; color: #666;"><strong>开放时间：</strong>${park.openTime}</p>
                    <p style="margin: 5px 0; color: #666;"><strong>收费：</strong>${park.fee}</p>
                    <p style="margin: 5px 0; color: #666; font-size: 12px;">${park.description}</p>
                    <div style="margin-top: 10px; text-align: center;">
                        <button onclick="openNavigation('${park.name}', ${park.coordinates[0]}, ${park.coordinates[1]})" 
                                style="background: linear-gradient(135deg, #4a90e2 0%, #2e7d32 100%); color: white; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer; font-size: 12px; font-weight: bold;">
                            🧭 地图导航
                        </button>
                    </div>
                </div>
            `
        });

        marker.on('click', () => {
            infoWindow.open(map, marker.getPosition());
        });

        map.add(marker);
    });
}

/**
 * 初始化分布图表
 * @description 使用ECharts创建公园分布柱状图
 */
function initChart() {
    // 检查ECharts是否加载
    if (typeof echarts === 'undefined') {
        console.warn('ECharts库未加载，使用备用图表显示');
        createFallbackChart();
        return;
    }
    
    const chartContainer = document.getElementById('distributionChart');
    const myChart = echarts.init(chartContainer);
    
    // 使用全局公园数量分布数据
    const districtCount = GUANGZHOU_DISTRICT_PARK_COUNT;

    const labels = Object.keys(districtCount);
    const data = Object.values(districtCount);

    const option = {
        // title: {
        //     text: '广州各区公园分布情况',
        //     left: 'center',
        //     textStyle: {
        //         fontSize: 18,
        //         fontWeight: 'bold',
        //         color: '#2e7d32'
        //     }
        // },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: '{b}: {c}个公园'
        },
        xAxis: {
            type: 'category',
            data: labels,
            axisLabel: {
                color: '#666',
                rotate: 45
            },
            axisLine: {
                lineStyle: {
                    color: '#e0e0e0'
                }
            }
        },
        yAxis: {
            type: 'value',
            minInterval: 1,
            axisLabel: {
                color: '#666'
            },
            splitLine: {
                lineStyle: {
                    color: '#e0e0e0'
                }
            }
        },
        series: [{
            name: '公园数量',
            type: 'bar',
            data: data,
            label: {
                show: true,
                position: 'top',
                color: '#2e7d32',
                fontSize: 12,
                fontWeight: 'bold',
                formatter: '{c}个'
            },
            itemStyle: {
                color: function(params) {
                    const colors = [
                        '#4a90e2', '#2e7d32', '#66bb6a', '#42a5f5',
                        '#26c6da', '#66bb6a', '#9ccc65', '#d4e157',
                        '#ffee58', '#ffca28', '#ffa726'
                    ];
                    return colors[params.dataIndex % colors.length];
                },
                borderColor: '#2e7d32',
                borderWidth: 2,
                borderRadius: [8, 8, 0, 0]
            },
            animationDuration: 1500,
            animationEasing: 'cubicInOut'
        }],
        grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true
        }
    };

    myChart.setOption(option);
    
    // 确保图表尺寸正确
    setTimeout(() => {
        myChart.resize();
    }, 100);
    
    // 响应式处理
    window.addEventListener('resize', function() {
        myChart.resize();
    });
}

/**
 * 渲染公园卡片列表
 * @param {Array} parks - 公园数据数组
 */
function renderParks(parks) {
    const parksGrid = document.getElementById('parks-grid');
    
    if (parks.length === 0) {
        parksGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px; color: #666;">
                <div style="font-size: 48px; margin-bottom: 20px;">🔍</div>
                <h3>未找到符合条件的公园</h3>
                <p>请尝试调整筛选条件</p>
            </div>
        `;
        return;
    }

    parksGrid.innerHTML = parks.map(park => `
        <div class="park-card" data-id="${park.id}">
            <img src="${park.image}" alt="${park.name}" class="park-image" 
                 onerror="this.src='default-park.svg'; this.onerror=null;">
            <div class="park-content">
                <h3 class="park-name">${park.name}</h3>
                <div class="park-location">
                    <span>📍</span>
                    <span>${park.location}</span>
                </div>
                <div class="park-info">
                    <div class="park-info-item">
                        <span class="park-info-label">开放时间：</span>
                        <span>${park.openTime}</span>
                    </div>
                    <div class="park-info-item">
                        <span class="park-info-label">所属区域：</span>
                        <span>${park.district}</span>
                    </div>
                </div>
                <div class="park-fee ${park.fee === '免费' ? 'free' : 'paid'}">
                    ${park.fee === '免费' ? '🆓 免费开放' : '💰 收费景区'}
                </div>
                <p class="park-description">${park.description}</p>
                <div class="park-actions" style="margin-top: 15px; text-align: center;">
                    <button onclick="openNavigation('${park.name}', ${park.coordinates[0]}, ${park.coordinates[1]})" 
                            class="nav-button" style="background: linear-gradient(135deg, #4a90e2 0%, #2e7d32 100%); color: white; border: none; padding: 10px 20px; border-radius: 25px; cursor: pointer; font-size: 14px; font-weight: bold; transition: transform 0.2s ease, box-shadow 0.2s ease;" 
                            onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(74, 144, 226, 0.3)';" 
                            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                        🧭 地图导航
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // 添加卡片点击事件
    document.querySelectorAll('.park-card').forEach(card => {
        card.addEventListener('click', () => {
            const parkId = parseInt(card.dataset.id);
            const park = parksData.find(p => p.id === parkId);
            if (park) {
                // 地图定位到公园位置（如果地图已加载）
                if (map && typeof map.setZoomAndCenter === 'function') {
                    map.setZoomAndCenter(15, park.coordinates);
                }
                // 滚动到地图区域
                document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

/**
 * 筛选公园数据
 * @param {string} district - 区域筛选条件
 * @param {string} fee - 收费筛选条件
 * @returns {Array} 筛选后的公园数据
 */
function filterParks(district, fee) {
    return parksData.filter(park => {
        const districtMatch = !district || park.district === district;
        const feeMatch = !fee || park.fee === fee;
        return districtMatch && feeMatch;
    });
}

/**
 * 绑定事件监听器
 */
function bindEvents() {
    // 筛选按钮点击事件
    document.getElementById('search-btn').addEventListener('click', () => {
        const district = document.getElementById('district-filter').value;
        const fee = document.getElementById('fee-filter').value;
        
        filteredParks = filterParks(district, fee);
        renderParks(filteredParks);
    });

    // 筛选条件改变时自动搜索
    document.getElementById('district-filter').addEventListener('change', () => {
        document.getElementById('search-btn').click();
    });
    
    document.getElementById('fee-filter').addEventListener('change', () => {
        document.getElementById('search-btn').click();
    });

    // 导航链接平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 70; // 考虑固定头部高度
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 页面滚动时头部样式变化
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(46, 125, 50, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'linear-gradient(135deg, #4a90e2 0%, #2e7d32 100%)';
            header.style.backdropFilter = 'none';
        }
    });
}

/**
 * 创建备用图表（当ECharts无法加载时）
 * @description 使用HTML和CSS创建简单的柱状图，基于广州各区实际公园分布数据
 */
function createFallbackChart() {
    // 使用全局公园数量分布数据
    const districtCount = GUANGZHOU_DISTRICT_PARK_COUNT;

    const maxCount = Math.max(...Object.values(districtCount));
    const chartContainer = document.querySelector('.chart-container');
    
    chartContainer.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
            <h3 style="color: #2e7d32; font-size: 18px; margin-bottom: 20px;">广州各区公园分布情况</h3>
        </div>
        <div style="display: flex; align-items: end; justify-content: space-around; height: 300px; padding: 20px; background: #f9f9f9; border-radius: 10px;">
            ${Object.entries(districtCount).map(([district, count]) => {
                const height = (count / maxCount) * 200;
                const colors = ['#4a90e2', '#2e7d32', '#66bb6a', '#42a5f5', '#26c6da', '#66bb6a', '#9ccc65', '#d4e157', '#ffee58', '#ffca28', '#ffa726'];
                const colorIndex = Object.keys(districtCount).indexOf(district);
                return `
                    <div style="display: flex; flex-direction: column; align-items: center; margin: 0 5px;">
                        <div style="background: ${colors[colorIndex % colors.length]}; width: 40px; height: ${height}px; border-radius: 4px 4px 0 0; margin-bottom: 10px; display: flex; align-items: end; justify-content: center; color: white; font-weight: bold; padding-bottom: 5px;">
                            ${count}
                        </div>
                        <div style="font-size: 12px; color: #666; text-align: center; writing-mode: vertical-rl; height: 60px; display: flex; align-items: center;">
                            ${district}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
        <div style="text-align: center; margin-top: 15px; font-size: 12px; color: #999;">
            数据统计：共${parksData.length}个公园
        </div>
    `;
}

/**
 * 滚动到公园列表区域
 * @description 平滑滚动到公园列表部分，提供良好的用户体验
 */
function scrollToParks() {
    const parksSection = document.getElementById('parks');
    if (parksSection) {
        const offsetTop = parksSection.offsetTop - 70; // 考虑固定头部高度
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

/**
 * 打开地图导航
 * @description 调用高德地图app进行导航，支持多种设备和浏览器环境
 * @param {string} name - 目的地名称
 * @param {number} lng - 经度
 * @param {number} lat - 纬度
 */
function openNavigation(name, lng, lat) {
    // 高德地图导航URL scheme
    const amapUrl = `amapuri://route/plan/?dlat=${lat}&dlon=${lng}&dname=${encodeURIComponent(name)}&dev=0&t=0`;
    
    // 高德地图网页版导航URL（备用方案）
    const webUrl = `https://uri.amap.com/navigation?to=${lng},${lat},${encodeURIComponent(name)}&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=1`;
    
    // 检测设备类型
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // 移动设备：尝试打开高德地图app
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = amapUrl;
        document.body.appendChild(iframe);
        
        // 如果app未安装，2秒后跳转到网页版
        setTimeout(() => {
            document.body.removeChild(iframe);
            window.open(webUrl, '_blank');
        }, 2000);
        
        // 显示提示信息
        showNavigationTip('正在启动高德地图导航...');
    } else {
        // 桌面设备：直接打开网页版导航
        window.open(webUrl, '_blank');
        showNavigationTip('已在新窗口打开高德地图导航');
    }
}

/**
 * 显示导航提示信息
 * @description 显示导航操作的反馈信息
 * @param {string} message - 提示信息内容
 */
function showNavigationTip(message) {
    // 创建提示元素
    const tip = document.createElement('div');
    tip.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: rgba(46, 125, 50, 0.95); color: white; padding: 15px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 10000; font-size: 14px; max-width: 300px;">
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 16px;">🧭</span>
                <span>${message}</span>
            </div>
        </div>
    `;
    
    document.body.appendChild(tip);
    
    // 3秒后自动移除提示
    setTimeout(() => {
        if (document.body.contains(tip)) {
            tip.style.opacity = '0';
            tip.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(tip);
            }, 300);
        }
    }, 3000);
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', initApp);

// 窗口大小改变时重新调整地图
window.addEventListener('resize', () => {
    if (map && typeof map.getViewport === 'function') {
        map.getViewport().resize();
    }
});