# AWS 部署完整指南

## 📋 目录
1. [注册AWS账户](#注册aws账户)
2. [配置EC2实例](#配置ec2实例)
3. [部署React应用](#部署react应用)
4. [使用AWS MCP](#使用aws-mcp)
5. [域名和SSL配置](#域名和ssl配置)

---

## 1️⃣ 注册AWS账户

### 步骤详解

#### 1. 访问注册页面
- 国际版：https://portal.aws.amazon.com/billing/signup
- 中国版：https://www.amazonaws.cn/

#### 2. 填写账户信息
- **邮箱地址**：用于登录和接收通知
- **密码**：至少8个字符，包含大小写字母和数字
- **AWS账户名称**：公司或个人名称

#### 3. 填写联系信息
- 选择账户类型：**个人** 或 **专业**
- 填写姓名、电话、地址
- 中国用户需要提供身份证信息

#### 4. 支付信息
- **信用卡/借记卡**：需要国际信用卡（Visa/MasterCard）
  - 会扣取1美元验证（稍后退回）
- **支付宝**（中国区）：部分服务支持

#### 5. 身份验证
- 通过短信或电话接收验证码
- 输入验证码完成验证

#### 6. 选择支持计划
- **基本计划**（免费）：适合个人学习
- **开发者计划**（$29/月）：技术支持
- **商业计划**（$100/月）：生产环境

#### 7. 完成注册
注册成功后，等待几分钟激活账户。

---

## 2️⃣ 配置EC2实例

### AWS免费套餐
新账户可享受**12个月免费套餐**：
- EC2 t2.micro/t3.micro实例：750小时/月
- 30GB EBS存储
- 100GB数据传输

### 创建EC2实例

#### 1. 登录AWS控制台
https://console.aws.amazon.com/

#### 2. 选择区域
右上角选择距离用户最近的区域：
- **亚太（东京）**：ap-northeast-1
- **亚太（新加坡）**：ap-southeast-1
- **美国东部（弗吉尼亚）**：us-east-1

#### 3. 启动EC2实例

**进入EC2控制台：**
- 搜索"EC2" → 点击"启动实例"

**配置实例：**

```
名称和标签：
  名称：word-lookup-app-server

应用程序和操作系统映像（AMI）：
  选择：Ubuntu Server 22.04 LTS (Free tier eligible)

实例类型：
  选择：t2.micro (免费套餐)
  - 1 vCPU
  - 1 GiB 内存

密钥对（登录）：
  ⚠️ 创建新密钥对：
    - 名称：word-app-key
    - 类型：RSA
    - 格式：.pem (Mac/Linux) 或 .ppk (Windows)
    - 下载并妥善保存！

网络设置：
  ✅ 允许来自互联网的 SSH 流量
  ✅ 允许来自互联网的 HTTPS 流量
  ✅ 允许来自互联网的 HTTP 流量

配置存储：
  30 GiB gp3 (免费套餐)
```

#### 4. 启动实例
点击"启动实例" → 等待实例状态变为"运行中"

#### 5. 获取公网IP
在EC2实例列表中，找到你的实例，记录：
- **公有IPv4地址**：如 54.123.45.67
- **公有IPv4 DNS**：如 ec2-54-123-45-67.compute-1.amazonaws.com

---

## 3️⃣ 部署React应用

### 方法一：手动部署

#### 1. 连接到EC2实例

**Mac/Linux:**
```bash
# 修改密钥权限
chmod 400 ~/Downloads/word-app-key.pem

# SSH连接
ssh -i ~/Downloads/word-app-key.pem ubuntu@54.123.45.67
```

**Windows (使用Git Bash或PowerShell):**
```bash
ssh -i C:\Users\YourName\Downloads\word-app-key.pem ubuntu@54.123.45.67
```

#### 2. 安装必要软件

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 验证安装
node --version  # 应显示 v18.x.x
npm --version

# 安装Nginx
sudo apt install -y nginx

# 启动Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### 3. 上传项目文件

**从本地上传（在本地终端执行）:**
```bash
# 进入项目目录
cd /Users/britz/Downloads/figma-mcp

# 构建项目
npm run build

# 上传到EC2
scp -i ~/Downloads/word-app-key.pem -r dist ubuntu@54.123.45.67:~/
```

#### 4. 配置Nginx

**在EC2上执行:**
```bash
# 移动构建文件
sudo mv ~/dist/* /var/www/html/

# 创建Nginx配置
sudo nano /etc/nginx/sites-available/word-app
```

**粘贴以下配置:**
```nginx
server {
    listen 80;
    server_name 54.123.45.67;  # 替换为你的EC2公网IP

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 启用Gzip压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

**激活配置:**
```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/word-app /etc/nginx/sites-enabled/

# 删除默认配置
sudo rm /etc/nginx/sites-enabled/default

# 测试配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx
```

#### 5. 访问应用
浏览器访问：`http://54.123.45.67`

---

### 方法二：使用PM2和Node服务器（推荐）

#### 1. 连接EC2并安装软件
```bash
# SSH连接
ssh -i ~/Downloads/word-app-key.pem ubuntu@54.123.45.67

# 安装PM2
sudo npm install -g pm2

# 安装Nginx
sudo apt install -y nginx
```

#### 2. 克隆或上传项目
```bash
# 创建项目目录
mkdir -p ~/apps
cd ~/apps

# 从本地上传整个项目
# (在本地执行)
scp -i ~/Downloads/word-app-key.pem -r /Users/britz/Downloads/figma-mcp ubuntu@54.123.45.67:~/apps/
```

#### 3. 部署应用
```bash
# 进入项目
cd ~/apps/figma-mcp

# 安装依赖
npm install

# 构建项目
npm run build

# 使用PM2启动静态服务器
pm2 serve dist 3000 --name word-app --spa

# 设置开机自启
pm2 startup
pm2 save
```

#### 4. 配置Nginx反向代理
```bash
sudo nano /etc/nginx/sites-available/word-app
```

**配置文件:**
```nginx
server {
    listen 80;
    server_name 54.123.45.67;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**激活并重启:**
```bash
sudo ln -s /etc/nginx/sites-available/word-app /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

---

## 4️⃣ 使用AWS MCP

AWS MCP (Model Context Protocol) 允许你通过Claude Code直接管理AWS资源。

### 安装AWS MCP服务器

#### 1. 在本地安装
```bash
# 安装AWS MCP
npm install -g @anthropic-ai/mcp-server-aws

# 或使用Claude Code添加
claude mcp add aws-ec2 npx @anthropic-ai/mcp-server-aws ec2
```

#### 2. 配置AWS凭证

**创建IAM用户:**
1. 登录AWS控制台
2. 进入IAM服务
3. 创建新用户，附加权限策略：
   - `AmazonEC2FullAccess`
   - `AmazonS3FullAccess`
4. 创建访问密钥（Access Key）

**配置凭证:**
```bash
# 方法1：使用AWS CLI
aws configure
# 输入：
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region: ap-northeast-1
# - Default output format: json

# 方法2：手动创建配置文件
mkdir -p ~/.aws
nano ~/.aws/credentials
```

**credentials文件内容:**
```ini
[default]
aws_access_key_id = YOUR_ACCESS_KEY
aws_secret_access_key = YOUR_SECRET_KEY
```

**config文件:**
```ini
[default]
region = ap-northeast-1
output = json
```

#### 3. 使用MCP管理EC2

在Claude Code中可以使用MCP工具：
```
# 列出EC2实例
mcp__aws__list_instances

# 启动实例
mcp__aws__start_instance instance-id

# 停止实例
mcp__aws__stop_instance instance-id

# 部署代码
mcp__aws__deploy
```

---

## 5️⃣ 域名和SSL配置

### 配置域名

#### 1. 购买域名
- **阿里云**：https://wanwang.aliyun.com/
- **腾讯云**：https://dnspod.cloud.tencent.com/
- **Cloudflare**：https://www.cloudflare.com/
- **Namecheap**：https://www.namecheap.com/

#### 2. 配置DNS记录
在域名提供商处添加A记录：
```
类型: A
主机记录: @
记录值: 54.123.45.67 (你的EC2 IP)
TTL: 600
```

如果要配置www子域名：
```
类型: A
主机记录: www
记录值: 54.123.45.67
TTL: 600
```

### 配置SSL证书（HTTPS）

#### 使用Let's Encrypt免费证书

```bash
# SSH连接到EC2
ssh -i ~/Downloads/word-app-key.pem ubuntu@54.123.45.67

# 安装Certbot
sudo apt install -y certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 输入邮箱地址
# 同意服务条款
# 选择是否重定向HTTP到HTTPS（推荐选择2）

# 测试自动续期
sudo certbot renew --dry-run
```

证书会自动配置到Nginx，并自动续期。

访问：`https://yourdomain.com` ✅

---

## 🔧 常用管理命令

### PM2管理
```bash
# 查看应用状态
pm2 status

# 查看日志
pm2 logs word-app

# 重启应用
pm2 restart word-app

# 停止应用
pm2 stop word-app

# 删除应用
pm2 delete word-app
```

### Nginx管理
```bash
# 测试配置
sudo nginx -t

# 重启
sudo systemctl restart nginx

# 查看状态
sudo systemctl status nginx

# 查看错误日志
sudo tail -f /var/log/nginx/error.log

# 查看访问日志
sudo tail -f /var/log/nginx/access.log
```

### 系统监控
```bash
# 查看CPU和内存
top

# 查看磁盘使用
df -h

# 查看端口占用
sudo netstat -tulpn | grep :80
```

---

## 💰 成本预估

### 免费套餐（第一年）
- EC2 t2.micro：750小时/月（免费）
- 30GB EBS存储（免费）
- 数据传出：100GB/月（免费）

**预计成本：$0/月**

### 超出免费套餐后
- EC2 t2.micro：~$8.5/月
- EBS 30GB：~$3/月
- 数据传出（额外）：~$0.09/GB

**预计成本：~$12-15/月**

---

## 🔒 安全建议

1. **定期更新系统**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **配置防火墙**
   ```bash
   sudo ufw allow OpenSSH
   sudo ufw allow 'Nginx Full'
   sudo ufw enable
   ```

3. **限制SSH访问**
   - 只允许特定IP访问
   - 禁用root登录
   - 使用密钥认证

4. **定期备份**
   - 创建AMI镜像
   - 备份数据库

5. **监控和日志**
   - 使用CloudWatch监控
   - 定期检查访问日志

---

## 🚀 自动化部署脚本

创建部署脚本：`deploy.sh`

```bash
#!/bin/bash

# 配置变量
EC2_IP="54.123.45.67"
KEY_PATH="~/Downloads/word-app-key.pem"
APP_NAME="word-app"

echo "🚀 开始部署..."

# 构建项目
echo "📦 构建项目..."
npm run build

# 上传到EC2
echo "📤 上传文件..."
scp -i $KEY_PATH -r dist ubuntu@$EC2_IP:~/

# 在EC2上执行部署
echo "🔄 更新服务器..."
ssh -i $KEY_PATH ubuntu@$EC2_IP << 'EOF'
  sudo rm -rf /var/www/html/*
  sudo mv ~/dist/* /var/www/html/
  sudo systemctl restart nginx
  echo "✅ 部署完成！"
EOF

echo "🎉 部署成功！访问: http://$EC2_IP"
```

使用：
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 📚 相关资源

- [AWS免费套餐](https://aws.amazon.com/free/)
- [EC2文档](https://docs.aws.amazon.com/ec2/)
- [Nginx文档](https://nginx.org/en/docs/)
- [PM2文档](https://pm2.keymetrics.io/)
- [Let's Encrypt](https://letsencrypt.org/)

---

祝部署顺利！🎊
