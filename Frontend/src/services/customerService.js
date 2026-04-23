import api from './api';

const CUSTOMERS_ENDPOINT = '/customers';

export const customerService = {
  // Create a new customer
  createCustomer: (customerData) => {
    return api.post(`${CUSTOMERS_ENDPOINT}/create`, customerData).then(res => res.data);
  },

  // Get customer by ID
  getCustomerById: (id) => {
    return api.get(`${CUSTOMERS_ENDPOINT}/${id}`).then(res => res.data);
  },

  // Get all customers
  getAllCustomers: () => {
    return api.get(`${CUSTOMERS_ENDPOINT}?page=0&size=100`).then(res => {
      // Handle paginated response
      if (res.data && res.data.content) {
        return res.data.content; // Extract content from Page object
      }
      return res.data;
    });
  },

  // Update customer
  updateCustomer: (id, customerData) => {
    return api.put(`${CUSTOMERS_ENDPOINT}/${id}`, customerData).then(res => res.data);
  },

  // Delete customer
  deleteCustomer: (id) => {
    return api.delete(`${CUSTOMERS_ENDPOINT}/${id}`).then(res => res.data);
  },

  // Bulk upload customers from Excel
  bulkUploadCustomers: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`${CUSTOMERS_ENDPOINT}/bulk-upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => res.data);
  },

  // Get cities (master data)
  getCities: () => {
    return api.get('/cities').then(res => res.data);
  },

  // Get countries (master data)
  getCountries: () => {
    return api.get('/countries').then(res => res.data);
  },
};
