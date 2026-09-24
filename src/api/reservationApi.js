import { apiClient, USE_MOCK, mockDelay } from "./client";
import { getMockDB, saveMockDB } from "./mockData";
import { generateReservationCode } from "../utils/formatters";

export const reservationApi = {
  async createReservation(data) {
    if (USE_MOCK) {
      await mockDelay(350);
      const db = getMockDB();
      const code = generateReservationCode();
      const med = db.medicines.find((m) => m.id === data.medicineId);

      const newReservation = {
        id: `res-${Date.now()}`,
        reservationCode: code,
        userId: data.userId || "user-1",
        userName: data.userName || "Alex Johnson",
        userEmail: data.userEmail || "user@medigo.health",
        userPhone: data.userPhone || "+1 (555) 123-4567",
        medicineId: data.medicineId,
        medicineName: med ? `${med.name} ${med.strength}` : data.medicineName,
        medicineImage: med?.image || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
        category: med?.category || "General",
        quantity: Number(data.quantity) || 1,
        unitPrice: Number(data.unitPrice) || med?.price || 15.0,
        totalPrice: (Number(data.quantity) || 1) * (Number(data.unitPrice) || med?.price || 15.0),
        pharmacyId: data.pharmacyId || med?.pharmacyId || "pharm-1",
        pharmacyName: data.pharmacyName || med?.pharmacyName || "Apex City Central Medical Store",
        pharmacyAddress: med?.pharmacyAddress || "742 Evergreen Blvd, Suite 100",
        pharmacyPhone: "+1 (555) 234-5678",
        status: "Confirmed",
        reservedAt: new Date().toISOString(),
        pickupDeadline: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
        notes: data.notes || ""
      };

      db.reservations.unshift(newReservation);
      saveMockDB("reservations", db.reservations);

      if (med && med.stockQuantity >= newReservation.quantity) {
        med.stockQuantity -= newReservation.quantity;
        if (med.stockQuantity === 0) med.stockStatus = "Out of Stock";
        else if (med.stockQuantity <= 5) med.stockStatus = "Low Stock";
        saveMockDB("medicines", db.medicines);
      }

      return { success: true, data: newReservation, message: "Reservation confirmed!" };
    }

    const response = await apiClient.post("/reservations", data);
    return response.data;
  },

  async getMyReservations(userId = "user-1") {
    if (USE_MOCK) {
      await mockDelay(200);
      const db = getMockDB();
      return db.reservations.filter((r) => r.userId === userId || !r.userId || userId === "user-1");
    }
    const response = await apiClient.get("/reservations/my");
    return response.data;
  },

  async getReservationById(id) {
    if (USE_MOCK) {
      await mockDelay(200);
      const db = getMockDB();
      const res = db.reservations.find((r) => r.id === id || r.reservationCode === id);
      if (!res) throw new Error("Reservation not found");
      return res;
    }
    const response = await apiClient.get(`/reservations/${id}`);
    return response.data;
  },

  async cancelReservation(id, reason = "User requested cancellation") {
    if (USE_MOCK) {
      await mockDelay(250);
      const db = getMockDB();
      const index = db.reservations.findIndex((r) => r.id === id || r.reservationCode === id);
      if (index !== -1) {
        db.reservations[index].status = "Cancelled";
        saveMockDB("reservations", db.reservations);
        return db.reservations[index];
      }
      throw new Error("Reservation not found");
    }
    const response = await apiClient.post(`/reservations/${id}/cancel`, { reason });
    return response.data;
  }
};
