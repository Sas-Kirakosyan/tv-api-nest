import { NestFactory } from "@nestjs/core";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";
// import * as session from "express-session";
// import * as cookieParser from "cookie-parser";
import { ExpressAdapter } from "@nestjs/platform-express";
// import * as serverless from "serverless-http";
// import * as express from "express";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import serverless from "serverless-http";

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle("Your Project API")
    .setDescription("API description")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  // Setup session middleware
  app.use(
    session({
      secret: "your-secret-key", // Replace with a strong secret
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true, // Prevents client-side JS from accessing the cookie
        secure: process.env.NODE_ENV === "production" || true, // Ensures the cookie is sent over HTTPS only in production
        maxAge: 36000, // 1/100 hour session expiration
      },
    }),
  );
  app.use(cookieParser());
  const port = 5000;
  // Log deployment details at startup
  console.log("Current working directory:", process.cwd());
  console.log("Deployed files:", readdirSync(join(process.cwd(), "dist")));

  app.getHttpAdapter().get("/download-file", (req, res) => {
    try {
      const filePath = join(process.cwd(), "dist", "main.js"); // Specify the file to download
      const fileContent = readFileSync(filePath, "utf-8");
      res.send(fileContent);
    } catch (error) {
      res.status(500).send(`Error reading file: ${error.message}`);
    }
  });

  await app.listen(port);
  await app.init();
  console.log(`Server started on port :${port}`);
  return serverless(server);
}
bootstrap();
