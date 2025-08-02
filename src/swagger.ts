import { Express } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Motoristas",
      version: "1.0.0",
      description:
        "Documentação da API de gerenciamento de motoristas e veículos",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "refresh-token",
          description: "Autenticação via cookie HTTP-only",
        },
      },
      schemas: {
        Driver: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "d3d9f9a0-5b5f-4b3a-8c1c-2e1b1b1b1b1b",
            },
            name: { type: "string", example: "João Silva" },
            phone: { type: "string", example: "(11) 99999-9999" },
            licenseNumber: { type: "string", example: "SP12345678" },
            licenseType: { type: "string", example: "B" },
            licenseExpiry: { type: "string", format: "date-time" },
            status: {
              type: "string",
              enum: ["ACTIVE", "INACTIVE", "ON_LEAVE", "SUSPENDED"],
            },
            vehicles: {
              type: "array",
              items: { $ref: "#/components/schemas/Vehicle" },
            },
          },
        },
        Vehicle: {
          type: "object",
          properties: {
            plate: { type: "string", example: "ABC1D23" },
            model: { type: "string", example: "Ford Transit" },
            year: { type: "integer", example: 2023 },
            type: {
              type: "string",
              enum: ["TRUCK", "VAN", "CAR", "MOTORCYCLE", "BUS"],
            },
          },
        },
      },
    },
  },
  apis: ["./src/modules/**/*.route.ts"], // Caminho para seus controllers
};

export function setupSwagger(app: Express) {
  const specs = swaggerJsdoc(options);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
}
