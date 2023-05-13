import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import PublicLayout from "components/layouts/public";
import PrivateLayout from "components/layouts/private";
import PrivateFormLayout from "components/layouts/privateForm";
import * as Screen from 'screen'
import PublicAccountLayout from "components/layouts/publicAccount";
import ShipperLayout from "components/layouts/shipper";
import FragmentLayout from "components/layouts/fragment";
import { ToastContainer } from "react-toastify";
import ShipperFragmentLayout from "components/layouts/shipperFragment";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>

          <Route element={<PublicLayout />}>
            <Route path="/" element={<Screen.HomePage />} />
            <Route path="/home" element={<Screen.HomePage />} />
            <Route path="/login" element={<Screen.Login />} />
            <Route path="/register" element={<Screen.Register />} />
            <Route path="/product" element={<Screen.Product />} />
            <Route path="/product/detail/:productId/:versionId" element={<Screen.Detail />} />
            <Route path="/cart" element={<Screen.Cart />} />
            <Route path="/checkout" element={<Screen.Checkout />} />
            <Route path="/checkout-success" element={<Screen.CheckoutSuccess />} />
            <Route element={<PublicAccountLayout />}>
              <Route path="/order" element={<Screen.Order />} />
              <Route path="/order/:id" element={<Screen.OrderDetail />} />
              <Route path="/address" element={<Screen.AddressScreen />} />
              <Route path="/my-favorite" element={<Screen.FavoriteScreen />} />
              <Route path="/my-account" element={<Screen.UpdateProfile />} />
              <Route path="/reset-password" element={<Screen.ClientResetPassword />} />
            </Route>
          </Route>

          <Route element={<PrivateLayout />}>
            <Route path="/admin" element={<Screen.DashBoard />} />
            <Route path="/admin/employee" element={<Screen.EmployeeScreen />} />
            <Route path="/admin/employee/add" element={<Screen.AddEditEmployee />} />
            <Route path="/admin/employee/edit/:id" element={<Screen.AddEditEmployee />} />
            <Route path="/admin/employee/permission/:id" element={<Screen.EditPermission />} />
            <Route path="/admin/brand" element={<Screen.BrandScreen />} />
            <Route path="/admin/category" element={<Screen.CategoryScreen />} />
            <Route path="/admin/product" element={<Screen.ProductScreen />} />
            <Route path="/admin/product/info/add" element={<Screen.AddEditInfoProduct />} />
            <Route path="/admin/product/info/edit/:id" element={<Screen.AddEditInfoProduct />} />
            <Route path="/admin/product/version/add" element={<Screen.AddEditVersionProduct />} />
            <Route path="/admin/product/version/edit/:id" element={<Screen.AddEditVersionProduct />} />
            <Route path="/admin/import" element={<Screen.ImportScreen />} />
            <Route path="/admin/import/add" element={<Screen.AddImport />} />
            <Route path="/admin/import/:id" element={<Screen.DetailImport />} />
            <Route path="/admin/customer" element={<Screen.CustomerScreen />} />
            <Route path="/admin/customer/edit/:id" element={<Screen.EditCustomer />} />
            <Route path="/admin/:page/:id/" element={<Screen.AddEditEmployee />} />
            <Route path="/admin/voucher" element={<Screen.VoucherScreen />} />
            <Route path="/admin/voucher/add" element={<Screen.AddEditVoucher />} />
            <Route path="/admin/voucher/edit/:id" element={<Screen.AddEditVoucher />} />
            <Route path="/admin/order" element={<Screen.OrderScreen />} />
            <Route path="/admin/order-detail/:id" element={<Screen.AdminOrderDetail />} />
            <Route path="/admin/review" element={<Screen.ReviewScreen />} />
            <Route path="/admin/change-password" element={<Screen.ChangePasswordScreen />} />
          </Route>
          
          <Route element={<PrivateFormLayout />}>
            <Route path="/admin/login" element={<Screen.AdminLogin />} />
            <Route path="/admin/forgot_password" element={<Screen.ForgotPasword />} />
            <Route path="/admin/reset_password/:id/:token" element={<Screen.ResetPassword />} />
          </Route>

          <Route element={<ShipperLayout />}>
            <Route path="/shipper/" element={<Screen.ShipperOrdersPage />} />
            <Route path="/shipper/history" element={<Screen.ShipperHistoryPage />} />
            <Route path="/shipper/notify" element={<Screen.ShipperNotifyPage />} />
            <Route path="/shipper/account" element={<Screen.ShipperAccountPage />} />
          </Route>
          <Route element={<ShipperFragmentLayout />}>
            <Route path="/shipper/detail/:id" element={<Screen.ShipperOrdersDetail />} />
          </Route>

          <Route element={<FragmentLayout />}>
            <Route path="/shipper/login" element={<Screen.ShipperLogin />} />
          </Route>

          <Route path="*" element={<Screen.NotFound />} />
        
        </Routes>
      </BrowserRouter>

      <ToastContainer />
    </div>
  );
}

export default App;
