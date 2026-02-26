#!/bin/bash

# EC2 服务器初始化脚本
# 在EC2实例上运行此脚本来配置环境
# 使用方法: bash server-setup.sh

set -e

# 颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🔧 EC2 服务器环境配置${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 步骤1: 更新系统
echo -e "${YELLOW}📦 步骤 1/5: 更新系统...${NC}"
sudo apt update && sudo apt upgrade -y
echo -e "${GREEN}✅ 系统更新完成${NC}"
echo ""

# 步骤2: 安装Node.js
echo -e "${YELLOW}📦 步骤 2/5: 安装 Node.js 18.x...${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
echo -e "${GREEN}✅ Node.js 安装完成${NC}"
node --version
npm --version
echo ""

# 步骤3: 安装Nginx
echo -e "${YELLOW}📦 步骤 3/5: 安装 Nginx...${NC}"
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
echo -e "${GREEN}✅ Nginx 安装完成${NC}"
echo ""

# 步骤4: 创建Web目录
echo -e "${YELLOW}📁 步骤 4/5: 创建 Web 目录...${NC}"
sudo mkdir -p /var/www/html
sudo chown -R $USER:$USER /var/www/html
echo -e "${GREEN}✅ 目录创建完成${NC}"
echo ""

# 步骤5: 配置Nginx
echo -e "${YELLOW}⚙️  步骤 5/5: 配置 Nginx...${NC}"

# 获取EC2公网IP
EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

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

# 激活配置
sudo ln -sf /etc/nginx/sites-available/word-app /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# 测试配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx

echo -e "${GREEN}✅ Nginx 配置完成${NC}"
echo ""

# 步骤6: 配置防火墙
echo -e "${YELLOW}🔒 配置防火墙...${NC}"
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
echo "y" | sudo ufw enable || true
echo -e "${GREEN}✅ 防火墙配置完成${NC}"
echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 服务器配置完成！${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}📝 配置摘要:${NC}"
echo -e "  Node.js: $(node --version)"
echo -e "  npm: $(npm --version)"
echo -e "  Nginx: $(nginx -v 2>&1 | grep -o 'nginx/[0-9.]*')"
echo -e "  Web根目录: /var/www/html"
echo -e "  公网IP: $EC2_IP"
echo ""
echo -e "${YELLOW}🚀 下一步:${NC}"
echo -e "  1. 在本地运行部署脚本："
echo -e "     ${BLUE}EC2_IP=$EC2_IP KEY_PATH=~/path/to/key.pem ./deploy.sh${NC}"
echo -e "  2. 访问应用："
echo -e "     ${BLUE}http://$EC2_IP${NC}"
echo ""
echo -e "${YELLOW}📚 配置SSL证书 (可选):${NC}"
echo -e "  ${BLUE}sudo apt install -y certbot python3-certbot-nginx${NC}"
echo -e "  ${BLUE}sudo certbot --nginx -d yourdomain.com${NC}"
echo ""
