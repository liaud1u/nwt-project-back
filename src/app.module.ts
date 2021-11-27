import { Module } from '@nestjs/common';
import { TestModule } from './test/test.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';

@Module({
  imports: [TestModule, AuthModule, UsersModule],
  controllers: [AppController],
})
export class AppModule {}
