const express = require("express");
const { UserController, SaleController } = require("../../controllers");
const { InfoController } = require("../../controllers");
const { AuthRequestMiddlewares } = require("../../middlewares");

const userRouter = require("./user-routes");
const router = express.Router();

router.get("/info", InfoController.info);
router.get(
  "/admin/sales",
  AuthRequestMiddlewares.checkAuth,
  
  SaleController.getAdminSalesData
);
router.post(
  "/sale",
  AuthRequestMiddlewares.checkAuth,
  SaleController.createSale
);
router.get(
  "/user/sales",
  AuthRequestMiddlewares.checkAuth,
  SaleController.getUserSales
);
router.use("/admin", userRouter);
router.post(
  "/auth/login",
  AuthRequestMiddlewares.validateAuthRequest,
  UserController.signin

);
router.get("/admin/users", UserController.getAllUsers);
router.post(
  "/auth/refresh",
  AuthRequestMiddlewares.validateAuthRequest,
  UserController.refreshToken
);
router.post("/auth/logout",
    AuthRequestMiddlewares.validateAuthRequest, UserController.logout);

router.put("/admin/user/:id",  UserController.updateUser);

router.delete("/admin/user/:id", UserController.deleteUser);

module.exports = router;
