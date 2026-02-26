# AWS MCP 配置指南

## 前提条件

1. **AWS 账户凭证**
   - 你需要 AWS Access Key ID 和 Secret Access Key
   - 如果还没有，需要在 AWS IAM 控制台创建

## 步骤 1: 获取 AWS 访问密钥

### 在 AWS 控制台创建访问密钥：

1. 登录 AWS 控制台：https://console.aws.amazon.com/
2. 点击右上角的用户名，选择 "Security credentials"（安全凭证）
3. 滚动到 "Access keys"（访问密钥）部分
4. 点击 "Create access key"（创建访问密钥）
5. 选择用例：选择 "Command Line Interface (CLI)"
6. 确认并创建
7. **重要**：下载或复制 Access Key ID 和 Secret Access Key（这是唯一可以查看密钥的机会）

## 步骤 2: 配置 AWS 凭证

有两种方式配置 AWS 凭证：

### 方法 1: 使用 AWS CLI 配置（推荐）

```bash
# 安装 AWS CLI（如果还没安装）
brew install awscli

# 配置 AWS 凭证
aws configure
```

输入以下信息：
- AWS Access Key ID: [你的 Access Key ID]
- AWS Secret Access Key: [你的 Secret Access Key]
- Default region name: us-east-2（或你选择的区域）
- Default output format: json

### 方法 2: 手动创建凭证文件

```bash
# 创建 AWS 配置目录
mkdir -p ~/.aws

# 创建凭证文件
cat > ~/.aws/credentials << 'EOF'
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
EOF

# 创建配置文件
cat > ~/.aws/config << 'EOF'
[default]
region = us-east-2
output = json
EOF
```

## 步骤 3: 安装 AWS MCP Server

```bash
# 使用 npx 安装（推荐）
npx @anthropic-ai/mcp-server-aws install
```

或者全局安装：

```bash
npm install -g @anthropic-ai/mcp-server-aws
```

## 步骤 4: 配置 Claude Code MCP

找到你的 MCP 配置文件位置（可能是以下之一）：
- `~/.config/claude-code/mcp.json`
- `~/.cursor/mcp.json`
- `~/Library/Application Support/Code/User/mcp.json`

添加 AWS MCP 配置：

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-figma"
      ]
    },
    "aws": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic-ai/mcp-server-aws"
      ],
      "env": {
        "AWS_REGION": "us-east-2"
      }
    }
  }
}
```

## 步骤 5: 重启 Claude Code

配置完成后，需要重启 Claude Code 才能加载 AWS MCP。

## 步骤 6: 验证配置

重启后，可以使用以下命令验证 AWS MCP 是否正常工作：

```
/mcp
```

应该能看到 AWS MCP 相关的工具。

## 常用 AWS MCP 功能

配置成功后，你可以使用 AWS MCP 进行以下操作：

1. **列出 EC2 实例**
   ```
   列出我的 EC2 实例
   ```

2. **启动/停止实例**
   ```
   停止 EC2 实例 i-xxxxx
   启动 EC2 实例 i-xxxxx
   ```

3. **查看实例详情**
   ```
   查看 EC2 实例 i-xxxxx 的详细信息
   ```

4. **管理安全组**
   ```
   列出安全组
   修改安全组规则
   ```

## 安全提示

⚠️ **重要安全建议**：

1. **永远不要在代码中硬编码 AWS 凭证**
2. **使用 IAM 角色和最小权限原则**
3. **定期轮换访问密钥**
4. **不要将凭证文件提交到 Git**

建议在 `.gitignore` 中添加：
```
.aws/
*.pem
*.key
credentials
```

## 故障排除

### 问题：无法找到凭证

**解决方案**：
```bash
# 检查凭证文件是否存在
cat ~/.aws/credentials

# 检查环境变量
echo $AWS_ACCESS_KEY_ID
echo $AWS_SECRET_ACCESS_KEY
```

### 问题：权限不足

**解决方案**：
确保你的 IAM 用户有足够的权限。最少需要以下权限：
- EC2: DescribeInstances, StartInstances, StopInstances
- 如需更多功能，需要相应的 IAM 权限

### 问题：区域不匹配

**解决方案**：
确保配置的区域与你的 EC2 实例所在区域一致：
```bash
aws configure set region us-east-2
```

## 下一步

配置完成后，你可以直接通过对话要求我：
- 列出你的 EC2 实例
- 部署应用到 EC2
- 管理 AWS 资源
- 配置安全组等

