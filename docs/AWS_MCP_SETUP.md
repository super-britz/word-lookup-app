# AWS MCP 配置和自动部署指南

## 📋 什么是AWS MCP？

AWS MCP (Model Context Protocol) 允许 Claude Code 直接与 AWS 服务交互，可以：
- 📦 管理 EC2 实例
- 📤 直接部署应用
- 🔍 监控服务器状态
- ⚙️ 自动化运维任务

---

## 🔧 第一步：安装AWS CLI

### Mac 安装
```bash
# 使用Homebrew安装
brew install awscli

# 验证安装
aws --version
```

### 其他系统
访问：https://aws.amazon.com/cli/

---

## 🔑 第二步：创建AWS访问密钥

### 1. 登录AWS控制台
https://console.aws.amazon.com/

### 2. 创建IAM用户

#### 进入IAM服务
- 搜索 "IAM" → 点击进入

#### 创建用户
1. 点击 "用户" → "创建用户"
2. 用户名：`claude-code-deployer`
3. 勾选 "提供用户访问权限 - 可选"
4. 选择 "我想创建 IAM 用户"
5. 点击 "下一步"

#### 设置权限
选择 "直接附加策略"，搜索并勾选以下策略：
- ✅ `AmazonEC2FullAccess` - 完全管理EC2
- ✅ `AmazonS3FullAccess` - S3存储（可选）
- ✅ `CloudWatchReadOnlyAccess` - 查看日志（可选）

点击 "下一步" → "创建用户"

#### 创建访问密钥
1. 点击刚创建的用户
2. 选择 "安全凭证" 标签
3. 点击 "创建访问密钥"
4. 选择 "命令行界面(CLI)"
5. 勾选确认框 → "下一步"
6. 描述标签：`Claude Code MCP`
7. 点击 "创建访问密钥"

**⚠️ 重要：立即保存以下信息（只显示一次）**
- Access Key ID: `AKIA...`
- Secret Access Key: `wJalr...`

---

## ⚙️ 第三步：配置AWS凭证

### 方法1：使用AWS CLI（推荐）

```bash
# 配置凭证
aws configure

# 按提示输入：
AWS Access Key ID [None]: AKIA... (粘贴你的Key)
AWS Secret Access Key [None]: wJalr... (粘贴你的Secret)
Default region name [None]: us-east-2 (你的EC2所在区域)
Default output format [None]: json
```

### 验证配置
```bash
# 列出EC2实例
aws ec2 describe-instances --query 'Reservations[].Instances[].[InstanceId,State.Name,PublicIpAddress]' --output table

# 应该能看到你的EC2实例
```

### 方法2：手动创建配置文件

```bash
# 创建配置目录
mkdir -p ~/.aws

# 创建凭证文件
cat > ~/.aws/credentials << EOF
[default]
aws_access_key_id = AKIA...
aws_secret_access_key = wJalr...
EOF

# 创建配置文件
cat > ~/.aws/config << EOF
[default]
region = us-east-2
output = json
EOF

# 设置权限
chmod 600 ~/.aws/credentials
chmod 600 ~/.aws/config
```

---

## 🔌 第四步：添加AWS MCP到Claude Code

### 自动安装（推荐）

**在新的终端窗口执行：**
```bash
# 不要在Claude Code会话中执行，打开新终端

# 安装AWS MCP包
npm install -g @aws/mcp-server-aws

# 添加到Claude Code
claude mcp add aws npx @aws/mcp-server-aws
```

### 手动配置

如果自动安装失败，手动编辑配置：

```bash
# 备份配置
cp ~/.claude.json ~/.claude.json.backup

# 编辑配置文件
code ~/.claude.json
# 或
nano ~/.claude.json
```

在 `projects` → `"/Users/britz/Downloads/figma-mcp"` → `mcpServers` 中添加：

```json
{
  "projects": {
    "/Users/britz/Downloads/figma-mcp": {
      "mcpServers": {
        "figma": {
          "type": "http",
          "url": "https://mcp.figma.com/mcp"
        },
        "aws": {
          "type": "stdio",
          "command": "npx",
          "args": ["@aws/mcp-server-aws"],
          "env": {
            "AWS_REGION": "us-east-2"
          }
        }
      }
    }
  }
}
```

保存文件后，重启Claude Code。

---

## 🎯 第五步：验证AWS MCP

### 重启Claude Code
```bash
# 退出当前会话
exit

# 重新启动
claude code
```

### 检查MCP服务器
在Claude Code中输入：
```
/mcp
```

你应该能看到：
- ✅ figma - Connected
- ✅ aws - Connected (新增)

---

## 🚀 第六步：使用AWS MCP部署

配置完成后，你可以直接在Claude Code中说：

```
"帮我部署应用到EC2实例 18.217.45.63"
```

Claude Code会自动：
1. 连接到EC2实例
2. 配置服务器环境
3. 上传并部署应用
4. 配置Nginx
5. 重启服务

---

## 🛠️ AWS MCP可用功能

### 实例管理
```
# 列出所有实例
"列出我的所有EC2实例"

# 启动实例
"启动EC2实例 i-xxxxx"

# 停止实例
"停止EC2实例 i-xxxxx"

# 重启实例
"重启EC2实例 i-xxxxx"
```

### 部署操作
```
# 部署应用
"部署应用到EC2"

# 更新应用
"更新EC2上的应用"

# 回滚
"回滚到上一个版本"
```

### 监控
```
# 查看实例状态
"查看EC2实例状态"

# 查看系统资源
"查看服务器CPU和内存使用情况"

# 查看日志
"查看Nginx错误日志"
```

---

## 🔒 安全最佳实践

### 1. 最小权限原则
只授予必要的IAM权限

### 2. 定期轮换密钥
```bash
# 每3个月轮换一次访问密钥
aws iam create-access-key --user-name claude-code-deployer
```

### 3. 使用MFA
在IAM用户上启用多因素认证

### 4. 监控API调用
在CloudTrail中查看所有API操作记录

### 5. 加密凭证文件
```bash
chmod 600 ~/.aws/credentials
```

---

## 🐛 故障排查

### AWS MCP未连接

**检查凭证：**
```bash
aws sts get-caller-identity
```

**检查区域：**
```bash
aws configure get region
```

**重新配置：**
```bash
aws configure
```

### 权限错误

确保IAM用户有足够权限：
```bash
aws iam list-attached-user-policies --user-name claude-code-deployer
```

### 连接超时

检查网络和防火墙设置

---

## 📚 相关资源

- [AWS CLI文档](https://docs.aws.amazon.com/cli/)
- [AWS IAM最佳实践](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [AWS MCP GitHub](https://github.com/aws/aws-mcp-server)

---

## 🎉 完成！

配置完成后，你可以直接通过Claude Code管理和部署AWS资源了！
