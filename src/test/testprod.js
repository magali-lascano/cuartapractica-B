const request = require("supertest")("http://localhost:8080");
const expect = require("chai").expect;
const mongoose = require("mongoose");

before(async () => {
  await mongoose.connect(
    "mongodb+srv://lascanoaylenmagali:magaMONGO@cluster0.elopmfb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  );
});

after(async () => {
  mongoose.connection.close();
});

describe("Test cases", function () {
  it("POST /api/products/mockingproducts/:total - genera un numero de productos", async function () {
    const response = await request.post("/api/products/mockingproducts/5");
    expect(response.status).to.eql(200);
    expect(response.body.products).to.have.length(5);
    // console.log(response.body.products);
  });
  it("POST /api/products/mockingproducts/:total - debe devolver 400 cuando el user envia data erronea", async function () {
    const response = await request.post("/api/products/mockingproducts/0");
    expect(response.status).to.eql(400);
    // console.log(response.body.products);
  });
  it("GET /api/products - devuelve todos los productos", async function () {
    const response = await request.get("/api/products");
    expect(response.status).to.eql(200);
    expect(response.body.products).to.have.length(95);
    // console.log(response.body.products);
  });
  it("GET /api/products/:pid - devuelve product by ID", async function () {
    const response = await request.get(
      "/api/products/6435"
    );
    expect(response.status).to.eql(200);
    expect(response.body.product._id).to.be.ok;
    // console.log(response.body.product._id);
  });
  it("GET /api/products/:pid -  debe devolver 400 cuando el user envia data erronea", async function () {
    const response = await request.get("/api/products/6435");
    expect(response.status).to.eql(500);
    // console.log(response.body.product._id);
  });
  it("GET /api/products/:pid - debe devolver 404 cuando el producto no existe", async function () {
    const response = await request.get(
      "/api/products/5555a"
    );
    expect(response.status).to.eql(404);
    // console.log(response.body.product._id);
  });
  it("POST /api/products - crea un producto", async function () {
    const mockProduct = {
      title: "Producto",
      price: 1700,
      stock: 2000,
      thumbnail_url: "image1.jpg",
    };
    const response = await request.post("/api/products").send(mockProduct);
    expect(response.status).to.eql(200);
    expect(response.body.newProduct._id).to.be.ok;
    expect(response.body.newProduct.title).to.be.eql("Producto");
    // console.log(response.body.newProduct);
  });
  it("POST /api/products - debe devolver 400 cuando el user envia data erronea", async function () {
    const mockProduct = {
      price: 130,
      stock: 100,
      thumbnail_url: "image1.jpg",
    };
    const response = await request.post("/api/products").send(mockProduct);
    expect(response.status).to.eql(400);
  });
  it("PUT /api/products/:pid - actualiza product by ID", async function () {
    const mockProduct = {
      title: "Producto",
      price: 357,
      stock: 57,
      thumbnail_url: "image1.jpg",
    };
    const response = await request
      .put("/api/products/abc123")
      .send(mockProduct);
    expect(response.status).to.eql(200);
    // console.log(response);
  });
  it("PUT /api/products/:pid - debe devolver 400 cuando el user envia data erronea", async function () {
    const mockProduct = {
      price: 357,
      stock: 57,
      thumbnail_url: "image1.jpg",
    };
    const response = await request
      .put("/api/products/abc123")
      .send(mockProduct);
    expect(response.status).to.eql(400);
    // console.log(response);
  });
  it("DELETE /api/products/:pid - debe eliminar product by ID", async function () {
    const response = await request.delete(
      "/api/products/abc123"
    );
    expect(response.status).to.eql(200);
    // console.log(response);
  });
  it("DELETE /api/products/:pid - debe devolver 400 cuando el user envia data erronea", async function () {
    const response = await request.delete("/api/products/");
    expect(response.status).to.eql(404);
    // console.log(response);
  });
});