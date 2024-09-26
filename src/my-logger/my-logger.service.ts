import { ConsoleLogger, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { appendFile, mkdir } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class MyLoggerService extends ConsoleLogger {
  async logToFile(entry: string) {
    const formattedEntry = `${Intl.DateTimeFormat('zh-CN', {
      dateStyle: 'short',
      timeStyle: 'short',
      timeZone: 'Asia/Shanghai',
    }).format(new Date())}\t${entry}\n`;

    try {
      if (!existsSync(join(__dirname, '..', '..', 'logs'))) {
        await mkdir(join(__dirname, '..', '..', 'logs'));
      }
      await appendFile(join(__dirname, '..', '..', 'logs', 'nest.log'), formattedEntry);
    } catch (e) {
      if (e instanceof Error) console.error(e.message);
    }
  }

  log(message: any, context?: string) {
    const entry = `${context}\t${message}`;
    this.logToFile(entry);
    super.log(message, context);
  }

  error(message: any, stackOrContext?: string) {
    const entry = `${stackOrContext}\t${message}`;
    this.logToFile(entry);
    super.error(message, stackOrContext);
  }
}
