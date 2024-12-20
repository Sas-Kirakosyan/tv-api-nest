import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { TvApiModule } from "./tv-api/tv-api.module";
import { WhmcsModule } from "./whmcs/whmcs.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration globally available
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "aws-0-eu-central-1.pooler.supabase.com", //localhost
      port: 6543,
      username: "postgres.dtvvwkvmuulpyqzfcoka", //"postgres",
      password: "ZX8QTJ*##grMp2#", //  "MySt0ngDBP@ss",
      database: "postgres", // "novatv",
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      migrations: [__dirname + "/migrations/*{.ts,.js}"],
      synchronize: true,
      autoLoadEntities: true, // Automatically load entities
      ssl: {
        rejectUnauthorized: false, // Required for Supabase
      },
    }),
    UsersModule,
    AuthModule,
    TvApiModule,
    WhmcsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
// eslint-disable-next-line prettier/prettier
export class AppModule { }
