const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AyamHub API",
      version: "1.0.0",
      description:
        "Back-end REST API untuk Aplikasi Mobile AyamHub — platform penghubung antara peternakan dan UMKM/penjual ayam broiler di Indonesia.\n\nDirancang berdasarkan jurnal: \"Rancang Bangun Back-end API pada Aplikasi Mobile AyamHub Menggunakan Framework Node JS Express\" (JUSTIN Vol. 11, No. 3, Juli 2023)",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Masukkan JWT token yang didapat dari endpoint login",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id_user: { type: "integer", example: 1 },
            nama: { type: "string", example: "John Doe" },
            email: { type: "string", example: "john@example.com" },
            no_telepon: { type: "string", example: "081234567890" },
            alamat: { type: "string", example: "Jl. Raya No.1, Surabaya" },
            foto_profil: { type: "string", example: "foto-profil-123.jpg" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Farm: {
          type: "object",
          properties: {
            id_farm: { type: "integer", example: 1 },
            id_user: { type: "integer", example: 1 },
            nama_peternakan: { type: "string", example: "Peternakan Jaya Abadi" },
            deskripsi: { type: "string", example: "Peternakan ayam broiler modern" },
            alamat: { type: "string", example: "Jl. Raya No.1" },
            kota: { type: "string", example: "Surabaya" },
            provinsi: { type: "string", example: "Jawa Timur" },
            foto_peternakan: { type: "string", example: "foto_peternakan-123.jpg" },
            kapasitas: { type: "integer", example: 5000 },
            no_telepon: { type: "string", example: "081234567890" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Bookmark: {
          type: "object",
          properties: {
            id_bookmark: { type: "integer", example: 1 },
            id_user: { type: "integer", example: 1 },
            id_farm: { type: "integer", example: 1 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
