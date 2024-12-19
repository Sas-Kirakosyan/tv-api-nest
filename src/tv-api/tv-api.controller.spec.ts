import { Test, TestingModule } from "@nestjs/testing";
import { TvApiController } from "./tv-api.controller";

describe("TvApiController", () => {
  let controller: TvApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TvApiController],
    }).compile();

    controller = module.get<TvApiController>(TvApiController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
