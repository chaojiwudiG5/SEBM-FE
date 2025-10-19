/*
 * WebSocket 连接诊断工具
 * 用于调试 WebSocket 连接问题
 */
export class WebSocketDebugger {
    // 检查 localStorage 中的用户信息
    static checkUserInfo() {
        console.log('=== 检查用户信息 ===');
        const userStore = localStorage.getItem('user');
        if (!userStore) {
            console.error('❌ localStorage 中没有 user 信息');
            console.log('💡 请先登录系统');
            return null;
        }
        try {
            const user = JSON.parse(userStore);
            const userId = user.userInfo?.userId || user.userInfo?.id;
            if (!userId) {
                console.error('❌ 无法从 user 对象中获取 userId');
                console.log('当前 user 对象:', user);
                console.log('💡 user.userInfo 应该包含 userId 或 id 字段');
                return null;
            }
            console.log('✅ 用户信息正常');
            console.log('userId:', userId);
            console.log('完整 user 对象:', user);
            return userId;
        }
        catch (error) {
            console.error('❌ 解析 user 信息失败:', error);
            return null;
        }
    }
    // 检查后端服务状态
    static async checkBackendStatus() {
        console.log('\n=== 检查后端服务 ===');
        const baseURL = import.meta.env.DEV
            ? 'http://localhost:29578'
            : 'https://sebm-production.up.railway.app';
        try {
            const response = await fetch(`${baseURL}/actuator/health`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log('✅ 后端服务正常运行');
                console.log('健康状态:', data);
                return true;
            }
            else {
                console.error('❌ 后端服务响应异常:', response.status);
                return false;
            }
        }
        catch (error) {
            console.error('❌ 无法连接到后端服务:', error);
            console.log('💡 请确保后端服务运行在', baseURL);
            return false;
        }
    }
    // 测试 WebSocket 连接
    static testWebSocketConnection(userId) {
        console.log('\n=== 测试 WebSocket 连接 ===');
        const wsURL = import.meta.env.DEV
            ? `ws://localhost:29578/ws/notification?userId=${userId}`
            : `wss://sebm-production.up.railway.app/ws/notification?userId=${userId}`;
        console.log('连接地址:', wsURL);
        const ws = new WebSocket(wsURL);
        ws.onopen = () => {
            console.log('✅ WebSocket 连接成功！');
            console.log('发送测试心跳...');
            ws.send(JSON.stringify({ type: 'ping' }));
        };
        ws.onmessage = (event) => {
            console.log('📨 收到消息:', event.data);
            try {
                const data = JSON.parse(event.data);
                console.log('解析后的消息:', data);
            }
            catch (e) {
                console.log('原始消息:', event.data);
            }
        };
        ws.onerror = (error) => {
            console.error('❌ WebSocket 错误:', error);
        };
        ws.onclose = (event) => {
            console.log('WebSocket 连接已关闭');
            console.log('关闭代码:', event.code);
            console.log('关闭原因:', event.reason);
            // 常见错误代码说明
            const errorCodes = {
                1000: '正常关闭',
                1001: '端点离开',
                1002: '协议错误',
                1003: '不支持的数据类型',
                1006: '异常关闭（可能是网络问题或服务器未响应）',
                1007: '无效的数据',
                1008: '违反策略',
                1009: '消息太大',
                1010: '扩展协商失败',
                1011: '服务器遇到意外情况',
                1015: 'TLS 握手失败'
            };
            if (errorCodes[event.code]) {
                console.log('💡 错误说明:', errorCodes[event.code]);
            }
        };
        // 5秒后关闭测试连接
        setTimeout(() => {
            if (ws.readyState === WebSocket.OPEN) {
                console.log('测试完成，关闭连接');
                ws.close();
            }
        }, 5000);
        return ws;
    }
    // 完整诊断流程
    static async diagnose() {
        console.log('🔍 开始 WebSocket 连接诊断...\n');
        // 1. 检查用户信息
        const userId = this.checkUserInfo();
        if (!userId) {
            console.log('\n❌ 诊断失败：无法获取用户ID');
            return;
        }
        // 2. 检查后端服务
        const backendOk = await this.checkBackendStatus();
        if (!backendOk) {
            console.log('\n❌ 诊断失败：后端服务不可用');
            console.log('💡 解决方法:');
            console.log('   1. 确保后端服务已启动');
            console.log('   2. 检查端口 29578 是否被占用');
            console.log('   3. 查看后端日志是否有错误');
            return;
        }
        // 3. 测试 WebSocket 连接
        console.log('\n开始测试 WebSocket 连接（将持续 5 秒）...');
        this.testWebSocketConnection(userId);
        console.log('\n💡 诊断提示:');
        console.log('   - 如果看到 "WebSocket 连接成功"，说明配置正确');
        console.log('   - 如果连接失败，请检查后端 WebSocket 配置');
        console.log('   - 确保后端 WebSocketConfig 中的端点是 /ws/notification');
    }
    // 检查常见问题
    static checkCommonIssues() {
        console.log('=== 常见问题检查 ===\n');
        const issues = [];
        // 检查 1: 用户是否登录
        if (!localStorage.getItem('token')) {
            issues.push({
                issue: '未找到登录 token',
                solution: '请先登录系统'
            });
        }
        // 检查 2: 用户信息是否完整
        const user = localStorage.getItem('user');
        if (user) {
            try {
                const userObj = JSON.parse(user);
                if (!userObj.userInfo?.userId && !userObj.userInfo?.id) {
                    issues.push({
                        issue: 'user.userInfo 中缺少 userId 或 id',
                        solution: '检查登录接口返回的用户数据结构'
                    });
                }
            }
            catch (e) {
                issues.push({
                    issue: 'user 数据格式错误',
                    solution: '重新登录以获取正确的用户数据'
                });
            }
        }
        if (issues.length === 0) {
            console.log('✅ 未发现常见问题');
        }
        else {
            console.log('❌ 发现以下问题:\n');
            issues.forEach((item, index) => {
                console.log(`${index + 1}. 问题: ${item.issue}`);
                console.log(`   解决: ${item.solution}\n`);
            });
        }
        return issues;
    }
    // 显示当前配置
    static showConfig() {
        console.log('=== 当前 WebSocket 配置 ===\n');
        const isDev = import.meta.env.DEV;
        const wsURL = isDev
            ? 'ws://localhost:29578/ws/notification?userId={userId}'
            : 'wss://sebm-production.up.railway.app/ws/notification?userId={userId}';
        console.log('环境:', isDev ? '开发环境' : '生产环境');
        console.log('WebSocket URL:', wsURL);
        console.log('心跳间隔: 30 秒');
        console.log('最大重连次数: 5 次');
        console.log('重连间隔: 3 秒（指数退避）');
    }
}
// 在浏览器控制台中使用的快捷方式
window.wsDebug = {
    // 完整诊断
    diagnose: () => WebSocketDebugger.diagnose(),
    // 检查用户信息
    checkUser: () => WebSocketDebugger.checkUserInfo(),
    // 检查后端
    checkBackend: () => WebSocketDebugger.checkBackendStatus(),
    // 检查常见问题
    checkIssues: () => WebSocketDebugger.checkCommonIssues(),
    // 显示配置
    showConfig: () => WebSocketDebugger.showConfig(),
    // 清除并重新登录
    reset: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('message-store');
        console.log('✅ 已清除本地存储，请重新登录');
        window.location.href = '/login';
    },
    // 帮助信息
    help: () => {
        console.log(`
=== WebSocket 调试工具使用指南 ===

在浏览器控制台中输入以下命令：

1. wsDebug.diagnose()       - 运行完整诊断
2. wsDebug.checkUser()      - 检查用户信息
3. wsDebug.checkBackend()   - 检查后端服务
4. wsDebug.checkIssues()    - 检查常见问题
5. wsDebug.showConfig()     - 显示当前配置
6. wsDebug.reset()          - 清除数据并重新登录
7. wsDebug.help()           - 显示此帮助信息

推荐诊断流程：
1. 先运行 wsDebug.diagnose() 进行全面检查
2. 根据提示信息解决问题
3. 如果问题依然存在，联系开发人员
        `);
    }
};
console.log('💡 WebSocket 调试工具已加载！在控制台输入 wsDebug.help() 查看使用说明');
