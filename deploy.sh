#!/bin/bash

# 词典应用 - AWS EC2 自动部署脚本
# 使用方法: ./deploy.sh

set -e  # 遇到错误立即退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置变量（请修改为你的实际值）
EC2_IP="${EC2_IP:-your-ec2-ip}"
KEY_PATH="${KEY_PATH:-~/Downloads/word-app-key.pem}"
APP_NAME="word-lookup-app"

# 检查配置
if [ "$EC2_IP" = "your-ec2-ip" ]; then
    echo -e "${RED}❌ 错误: 请先设置EC2_IP环境变量${NC}"
    echo -e "${YELLOW}使用方法: EC2_IP=54.123.45.67 KEY_PATH=~/path/to/key.pem ./deploy.sh${NC}"
    exit 1
fi

if [ ! -f "$KEY_PATH" ]; then
    echo -e "${RED}❌ 错误: 密钥文件不存在: $KEY_PATH${NC}"
    exit 1
fi

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🚀 开始部署 $APP_NAME 到 AWS EC2${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 步骤1: 构建项目
echo -e "${YELLOW}📦 步骤 1/4: 构建项目...${NC}"
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 构建成功${NC}"
else
    echo -e "${RED}❌ 构建失败${NC}"
    exit 1
fi
echo ""

# 步骤2: 压缩文件
echo -e "${YELLOW}🗜️  步骤 2/4: 压缩文件...${NC}"
tar -czf dist.tar.gz dist/
echo -e "${GREEN}✅ 压缩完成${NC}"
echo ""

# 步骤3: 上传到EC2
echo -e "${YELLOW}📤 步骤 3/4: 上传到 EC2 ($EC2_IP)...${NC}"
scp -i "$KEY_PATH" -o StrictHostKeyChecking=no dist.tar.gz ubuntu@$EC2_IP:~/
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 上传成功${NC}"
else
    echo -e "${RED}❌ 上传失败${NC}"
    exit 1
fi
echo ""

# 步骤4: 在EC2上部署
echo -e "${YELLOW}🔄 步骤 4/4: 更新服务器...${NC}"
ssh -i "$KEY_PATH" -o StrictHostKeyChecking=no ubuntu@$EC2_IP << 'ENDSSH'
    set -e

    echo "解压文件..."
    tar -xzf dist.tar.gz

    echo "备份旧版本..."
    sudo rm -rf /var/www/html.backup
    sudo cp -r /var/www/html /var/www/html.backup || true

    echo "部署新版本..."
    sudo rm -rf /var/www/html/*
    sudo mv dist/* /var/www/html/

    echo "重启Nginx..."
    sudo systemctl restart nginx

    echo "清理临时文件..."
    rm -rf dist dist.tar.gz

    echo "✅ 服务器更新完成！"
ENDSSH

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 部署成功${NC}"
else
    echo -e "${RED}❌ 部署失败${NC}"
    exit 1
fi

# 清理本地临时文件
rm -f dist.tar.gz

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 部署完成！${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}🌐 访问地址: ${BLUE}http://$EC2_IP${NC}"
echo ""
echo -e "${YELLOW}提示: 如果配置了域名，请访问你的域名地址${NC}"
echo ""
