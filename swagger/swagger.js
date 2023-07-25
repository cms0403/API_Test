const swaggerUi = require("swagger-ui-express")
const swaggerJsdoc = require("swagger-jsdoc")

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "API 문서화",
      description:
        "프로젝트 설명 Node.js Swaager swagger-jsdoc 방식 API 클라이언트 UI",
    },
    servers: [
      {
        url: "http://localhost:52273", // 요청 URL
      },
    ],
  },
  apis: ["./routes/*.js", "./*.js"], //Swagger 파일 연동
}
const specs = swaggerJsdoc(options)

module.exports = { swaggerUi, specs }