import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import PublicLayout from "components/layouts/public";
import PrivateLayout from "components/layouts/private";
import PrivateFormLayout from "components/layouts/privateForm";
import * as Screen from 'screen'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>

          <Route element={<PublicLayout />}>
            <Route path="/" element={<Screen.HomePage />} />
            <Route path="/home" element={<Screen.HomePage />} />
            <Route path="/product" element={<Screen.Product />} />
            <Route path="/product/detail/:id" element={<Screen.Product />} />
          </Route>

          <Route element={<PrivateLayout />}>
            <Route path="/admin" element={<Screen.DashBoard />} />
            <Route path="/admin/employee" element={<Screen.EmployeeScreen />} />
            <Route path="/admin/employee/add" element={<Screen.AddEditEmployee />} />
            <Route path="/admin/employee/edit/:id" element={<Screen.AddEditEmployee />} />
            <Route path="/admin/employee/permission/:id" element={<Screen.EditPermission />} />
            <Route path="/admin/brand" element={<Screen.BrandScreen />} />
            <Route path="/admin/category" element={<Screen.CategoryScreen />} />
            <Route path="/admin/product-sample" element={<Screen.ProductSampleScreen />} />
            <Route path="/admin/product-sample/add" element={<Screen.AddEditProductSample />} />
            <Route path="/admin/product-sample/edit/:id" element={<Screen.AddEditProductSample />} />
            <Route path="/admin/product" element={<Screen.ProductScreen />} />
            <Route path="/admin/product/add" element={<Screen.AddEditProduct />} />
            <Route path="/admin/product/edit/:id" element={<Screen.AddEditProduct />} />
            <Route path="/admin/import" element={<Screen.ImportScreen />} />
            <Route path="/admin/import/add" element={<Screen.AddImport />} />
            <Route path="/admin/import/:id" element={<Screen.DetailImport />} />
            <Route path="/admin/customer" element={<Screen.CustomerScreen />} />
            <Route path="/admin/customer/edit/:id" element={<Screen.EditCustomer />} />
            <Route path="/admin/:page/:id/" element={<Screen.AddEditEmployee />} />
            <Route path="/admin/voucher" element={<Screen.VoucherScreen />} />
            <Route path="/admin/voucher/add" element={<Screen.AddEditVoucher />} />
            <Route path="/admin/voucher/edit/:id" element={<Screen.AddEditVoucher />} />
            <Route path="/admin/change-password/" element={<Screen.ChangePasswordScreen />} />
          </Route>
          
          <Route element={<PrivateFormLayout />}>
            <Route path="/admin/login" element={<Screen.AdminLogin />} />
            <Route path="/admin/forgot_password" element={<Screen.ForgotPasword />} />
            <Route path="/admin/reset_password/:id/:token" element={<Screen.ResetPassword />} />
          </Route>

          <Route path="*" element={<Screen.NotFound />} />
        
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
