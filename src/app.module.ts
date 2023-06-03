import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AtGuard } from './common/guards';
import { PrismaModule } from './prisma/prisma.module';
import { OrganizationModule } from './organizations/organization.module';
import { UserModule } from './user/user.module';
import { AddressModule } from './address/address.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { ProductModule } from './product/product.module';
import { HttpsRedirectMiddleware } from './common/middleware';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    OrganizationModule,
    UserModule,
    AddressModule,
    WarehouseModule,
    ProductModule,
    CacheModule.registerAsync<any>({
      isGlobal: true,
      useFactory: async () => {
        const store = await redisStore({
          url: 'redis://localhost:6379',
          password: 'eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81',
        });

        return () => store;
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    AppService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpsRedirectMiddleware).forRoutes('*');
  }
}
