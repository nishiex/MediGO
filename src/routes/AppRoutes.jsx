import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '../layouts/PublicLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';

// Common Route Guards
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { RoleRoute } from '../components/common/RoleRoute';

// Public Pages
import { HomePage } from '../pages/public/HomePage';
import { MedicineSearchPage } from '../pages/public/MedicineSearchPage';
import { MedicineDetailsPage } from '../pages/public/MedicineDetailsPage';
import { LoginPage } from '../pages/public/LoginPage';
import { RegisterPage } from '../pages/public/RegisterPage';
import { NotFoundPage } from '../pages/public/NotFoundPage';

// User / Patient Pages
import { UserDashboard } from '../pages/user/UserDashboard';
import { MyReservationsPage } from '../pages/user/MyReservationsPage';
import { ReservationDetailsPage } from '../pages/user/ReservationDetailsPage';

// Pharmacy Partner Pages
import { PharmacyDashboard } from '../pages/pharmacy/PharmacyDashboard';
import { PharmacyMedicinesPage } from '../pages/pharmacy/PharmacyMedicinesPage';
import { AddMedicinePage } from '../pages/pharmacy/AddMedicinePage';
import { EditMedicinePage } from '../pages/pharmacy/EditMedicinePage';
import { PharmacyReservationsPage } from '../pages/pharmacy/PharmacyReservationsPage';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminPharmaciesPage } from '../pages/admin/AdminPharmaciesPage';
import { AdminMedicinesPage } from '../pages/admin/AdminMedicinesPage';
import { AdminReservationsPage } from '../pages/admin/AdminReservationsPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/medicines" element={<MedicineSearchPage />} />
        <Route path="/medicines/:id" element={<MedicineDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* User / Patient Protected Routes */}
      <Route
        path="/user"
        element={
          <RoleRoute allowedRoles={['user', 'admin']}>
            <DashboardLayout />
          </RoleRoute>
        }
      >
        <Route index element={<Navigate to="/user/dashboard" replace />} />
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="reservations" element={<MyReservationsPage />} />
        <Route path="reservations/:id" element={<ReservationDetailsPage />} />
      </Route>

      {/* Pharmacy Partner Routes */}
      <Route
        path="/pharmacy"
        element={
          <RoleRoute allowedRoles={['pharmacy', 'admin']}>
            <DashboardLayout />
          </RoleRoute>
        }
      >
        <Route index element={<Navigate to="/pharmacy/dashboard" replace />} />
        <Route path="dashboard" element={<PharmacyDashboard />} />
        <Route path="medicines" element={<PharmacyMedicinesPage />} />
        <Route path="medicines/new" element={<AddMedicinePage />} />
        <Route path="medicines/edit/:id" element={<EditMedicinePage />} />
        <Route path="reservations" element={<PharmacyReservationsPage />} />
      </Route>

      {/* Super Admin Routes */}
      <Route
        path="/admin"
        element={
          <RoleRoute allowedRoles={['admin']}>
            <DashboardLayout />
          </RoleRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="pharmacies" element={<AdminPharmaciesPage />} />
        <Route path="medicines" element={<AdminMedicinesPage />} />
        <Route path="reservations" element={<AdminReservationsPage />} />
        <Route path="users" element={<AdminUsersPage />} />
      </Route>
    </Routes>
  );
};
