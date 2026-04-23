import api from './api';

export const customerService = {
  // ─── Customer CRUD ────────────────────────────────────────────
  createCustomer: (data) =>
    api.post('/customers/create', data).then((r) => r.data),

  getCustomerById: (id) =>
    api.get(`/customers/${id}`).then((r) => r.data),

  updateCustomer: (id, data) =>
    api.put(`/customers/${id}`, data).then((r) => r.data),

  deleteCustomer: (id) =>
    api.delete(`/customers/${id}`).then((r) => r.data),

  /**
   * getAllCustomers — the backend GET /api/customers returns a plain string
   * message. To list all customers we rely on JpaRepository's findAll via
   * pagination. The controller stub returns HTTP 200 with a text body, so
   * we try to GET with page params and fall back gracefully.
   * NOTE: Backend GET /api/customers is currently a stub. Add a proper
   *       Page<CustomerDTO> endpoint for production use.
   */
  getAllCustomers: async (page = 0, size = 50) => {
    try {
      const res = await api.get(`/customers?page=${page}&size=${size}`);
      if (res.data && res.data.content) return res.data; // Page<CustomerDTO>
      if (Array.isArray(res.data)) return { content: res.data, totalElements: res.data.length, totalPages: 1 };
      // Backend currently returns a string stub → return empty
      return { content: [], totalElements: 0, totalPages: 0, _stub: true };
    } catch {
      return { content: [], totalElements: 0, totalPages: 0, _stub: true };
    }
  },

  // ─── Bulk Upload (Excel .xlsx/.xls) ───────────────────────────
  bulkUploadCustomers: (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/customers/bulk/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
      timeout: 600000, // 10 min for million-record files
    }).then((r) => r.data);
  },

  // ─── Master Data ───────────────────────────────────────────────
  getCountries: () =>
    api.get('/master/countries').then((r) => r.data),

  getCities: () =>
    api.get('/master/cities').then((r) => r.data),

  getCitiesByCountry: (countryId) =>
    api.get(`/master/cities/country/${countryId}`).then((r) => r.data),
};
