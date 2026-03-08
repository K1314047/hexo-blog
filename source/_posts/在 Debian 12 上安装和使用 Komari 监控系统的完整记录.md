---
title: 在 Debian 12 上安装和使用 Komari 监控系统的完整记录
---

- - ### **🛠️ 系统环境**
  
    - **操作系统**：Debian 12
  
    - **用户权限**：root 或具有 sudo 权限的用户
  
    ### **📦 安装步骤**
  
    #### **1. 下载安装脚本**
  
    bash
  
    ```plain
    curl -fsSL https://raw.githubusercontent.com/komari-monitor/komari/main/install-komari.sh -o install-komari.sh
    ```
  
    #### **2. 添加执行权限**
  
    bash
  
    ```plain
    chmod +x install-komari.sh
    ```
  
    #### **3. 执行安装**
  
    bash
  
    ```plain
    sudo ./install-komari.sh
    ```
  
    安装过程会自动完成依赖项安装和系统配置。
  
    ### **🔍 查找安装目录**
  
    安装完成后，使用以下命令查找 Komari 的安装目录：
  
    bash
  
    ```plain
    sudo find / -type d -name "komari" 2>/dev/null
    ```
  
    通常 Komari 会安装在 `/opt/komari` 目录下。
  
    ### **🔐 修改管理员密码**
  
    #### **1. 进入 Komari 目录**
  
    bash
  
    ```plain
    cd /opt/komari
    ```
  
    #### **2. 修改管理员密码**
  
    bash
  
    ```plain
    ./komari chpasswd -p 你的新密码
    ```
  
    例如，将密码修改为 `Ab890725`：
  
    bash
  
    ```plain
    ./komari chpasswd -p Ab890725
    ```
  
    #### **3. 重启服务生效**
  
    根据提示重启服务器：
  
    bash
  
    ```plain
    sudo reboot
    ```
  
    ### **✅ 验证安装**
  
    重启后，可以使用以下默认信息登录 Komari 控制面板：
  
    - **访问地址**：`http://你的服务器IP:3000`（具体端口请查看安装输出）
  
    - **用户名**：`admin`
  
    - **密码**：你设置的密码
  
    ### **💡 注意事项**
  
    1. 确保服务器开放了相应的防火墙端口
  
    1. 建议安装后立即修改默认密码
  
    1. 定期查看 Komari 的日志文件以监控系统运行状态
  
    ### **🎯 总结**
  
    通过以上步骤，可以在 Debian 12 系统上快速完成 Komari 监控系统的安装和基本配置。整个过程简洁明了，适合服务器监控需求。
