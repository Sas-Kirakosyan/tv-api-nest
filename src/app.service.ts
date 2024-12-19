import { Injectable, OnModuleInit } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class AppService implements OnModuleInit {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly dataSource: DataSource) { }
  onModuleInit() {
    console.log(
      "Entities loaded:",
      this.dataSource.entityMetadatas.map((entity) => entity.name),
    );
  }

  getHello(): string {
    return "Hello World!";
  }
}
