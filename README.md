# Learn NestJS

本项目跟随 [Nest.js Full Course for Beginners | Complete All-in-One Tutorial | 3 Hours](https://www.youtube.com/watch?v=8_X0nSrzrCw) 学习

扩展了一下 `database.service.ts` 文件，新增在项目初始化后连接数据库的操作。

## 项目克隆

项目克隆后，使用 `pnpm i` 指令安装依赖，需要注意安装完后还无法直接使用，因为 `prisma` 还未将 `schema` 表结构对象迁移。

执行该命令后即可使用：

```shell
pnpm dlx prisma migrate dev --name clone
```
