import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { parse } from 'path';
import { MyLoggerService } from 'src/my-logger/my-logger.service';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  private readonly logger = new MyLoggerService(DatabaseService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('数据库连接成功。');
    } catch (error) {
      if (error.code === 'PROTOCAL_CONNECTION_LOST') {
        this.logger.error('数据库连接丢失，请检查数据库配置');
        process.exit(1);
      } else {
        this.logger.log('数据库不存在，尝试创建数据库...');

        const connectionString = process.env.DATABASE_URL;
        const parsedConnection = parse(connectionString);
        const databaseName = parsedConnection.base.split('?')[0];

        const baseConnectionString = connectionString.replace(`/${databaseName}`, '');
        const tempPrisma = new PrismaClient({
          datasources: {
            db: {
              url: baseConnectionString,
            },
          },
        });
        try {
          await tempPrisma.$executeRawUnsafe(`CREATE DATABASE "${databaseName}"`);
          this.logger.log('数据库创建成功');
        } catch (queryError) {
          this.logger.error(queryError);
        }
        await tempPrisma.$disconnect();
      }
    }
  }
}
