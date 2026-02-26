#!/bin/bash

# EC2 一键配置脚本
# 这个脚本会自动配置好所有环境

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 开始配置 EC2 服务器环境"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 获取EC2公网IP
EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 || echo "未知")

echo "📍 当前服务器IP: $EC2_IP"
echo ""

# 步骤1: 更新系统
echo "📦 [1/6] 更新系统包..."
sudo apt update -qq && sudo apt upgrade -y -qq
echo "✅ 系统更新完成"
echo ""

# 步骤2: 安装Node.js
echo "📦 [2/6] 安装 Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - > /dev/null 2>&1
sudo apt install -y nodejs -qq
NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
echo "✅ Node.js $NODE_VERSION 安装完成"
echo "✅ npm $NPM_VERSION 安装完成"
echo ""

# 步骤3: 安装Nginx
echo "📦 [3/6] 安装 Nginx..."
sudo apt install -y nginx -qq
sudo systemctl start nginx
sudo systemctl enable nginx > /dev/null 2>&1
NGINX_VERSION=$(nginx -v 2>&1 | grep -o 'nginx/[0-9.]*')
echo "✅ $NGINX_VERSION 安装完成"
echo ""

# 步骤4: 创建Web目录
echo "📁 [4/6] 创建 Web 目录..."
sudo mkdir -p /var/www/html
sudo chown -R ubuntu:ubuntu /var/www/html
echo "✅ 目录创建完成: /var/www/html"
echo ""

# 步骤5: 配置Nginx
echo "⚙️  [5/6] 配置 Nginx..."
sudo tee /etc/nginx/sites-available/word-app > /dev/null << EOF
server {
    listen 80;
    server_name $EC2_IP _;

    root /var/www/html;
    index index.html;

    # 启用Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    # SPA路由支持
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
EOF

sudo ln -sf /etc/nginx/sites-available/word-app /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t > /dev/null 2>&1
sudo systemctl restart nginx
echo "✅ Nginx 配置完成"
echo ""

# 步骤6: 配置防火墙
echo "🔒 [6/6] 配置防火墙..."
sudo ufw allow OpenSSH > /dev/null 2>&1
sudo ufw allow 'Nginx Full' > /dev/null 2>&1
echo "y" | sudo ufw enable > /dev/null 2>&1 || true
echo "✅ 防火墙配置完成"
echo ""

# 创建欢迎页面
cat > /var/www/html/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>服务器配置成功</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .container {
            background: white;
            padding: 3rem;
            border-radius: 1rem;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            text-align: center;
            max-width: 500px;
        }
        h1 { color: #333; margin-bottom: 1rem; }
        .status { font-size: 4rem; margin-bottom: 1rem; }
        .info { color: #666; line-height: 1.8; }
        .next { background: #667eea; color: white; padding: 1rem 2rem; border-radius: 0.5rem; display: inline-block; margin-top: 1rem; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="status">✅</div>
        <h1>服务器配置成功！</h1>
        <div class="info">
            <p><strong>Nginx:</strong> 运行中</p>
            <p><strong>Node.js:</strong> 已安装</p>
            <p><strong>状态:</strong> 就绪</p>
        </div>
        <p style="margin-top: 2rem; color: #999;">等待应用部署...</p>
    </div>
</body>
</html>
EOF

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 服务器配置完成！"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 配置摘要:"
echo "  ✅ Node.js: $NODE_VERSION"
echo "  ✅ npm: $NPM_VERSION"
echo "  ✅ Nginx: $NGINX_VERSION"
echo "  ✅ Web目录: /var/www/html"
echo "  ✅ 公网IP: $EC2_IP"
echo ""
echo "🌐 测试访问: http://$EC2_IP"
echo ""
echo "📤 下一步: 在本地运行部署脚本"
echo "   ./deploy-to-ec2.sh"
echo ""
