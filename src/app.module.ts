import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    OrganizationModule,
    UserModule,
    AddressModule,
    WarehouseModule,
    ProductModule,
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
