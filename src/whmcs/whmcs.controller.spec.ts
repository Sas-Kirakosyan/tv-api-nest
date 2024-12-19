import { Test, TestingModule } from "@nestjs/testing";
import { WhmcsUsersController } from "./whmcs.controller";

describe("WhmcsController", () => {
  let controller: WhmcsUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WhmcsUsersController],
    }).compile();

    controller = module.get<WhmcsUsersController>(WhmcsUsersController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
