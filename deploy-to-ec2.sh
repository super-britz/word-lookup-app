#!/bin/bash

# 快速部署脚本 - 为你的EC2定制
# 使用方法: ./deploy-to-ec2.sh

set -e

EC2_IP="18.217.45.63"
KEY_PATH="$HOME/Downloads/2026-02-13.pem"

echo "🚀 开始部署到 EC2..."
echo ""

# 构建项目
echo "📦 构建项目..."
npm run build

# 压缩
echo "🗜️ 压缩文件..."
tar -czf dist.tar.gz dist/

# 上传
echo "📤 上传到 EC2..."
scp -i "$KEY_PATH" -o StrictHostKeyChecking=no dist.tar.gz ubuntu@$EC2_IP:~/

# 部署
echo "🔄 部署应用..."
ssh -i "$KEY_PATH" -o StrictHostKeyChecking=no ubuntu@$EC2_IP << 'ENDSSH'
    tar -xzf dist.tar.gz
    sudo rm -rf /var/www/html/*
    sudo mv dist/* /var/www/html/
    sudo systemctl restart nginx
    rm -rf dist dist.tar.gz
    echo "✅ 部署完成！"
ENDSSH

# 清理
rm -f dist.tar.gz

echo ""
echo "🎉 部署成功！"
echo "🌐 访问地址: http://$EC2_IP"
