import { Test, TestingModule } from "@nestjs/testing";
import { WhmcsService } from "./whmcs.service";

describe("WhmcsService", () => {
  let service: WhmcsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WhmcsService],
    }).compile();

    service = module.get<WhmcsService>(WhmcsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
