import { useState, useEffect } from 'react';
import { Button, Input, DatePicker, Select, Modal, Alert, Table } from '../components';
import { useForm, useFetch } from '../hooks';
import { customerService } from '../services/customerService';
import { validateName, validateNIC, validatePhone, validateDateOfBirth, formatDate, parseDate, formatErrorMessage } from '../utils/validation';
import { Plus, Edit, Trash2, Download } from 'lucide-react';
import './CustomerList.css';

export const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [alert, setAlert] = useState(null);
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);

  const { data: customersData, loading: customersLoading, execute: fetchCustomers } = useFetch(
    customerService.getAllCustomers
  );
  const { execute: deleteCustomerAPI } = useFetch(customerService.deleteCustomer);
  const { execute: fetchCitiesAPI } = useFetch(customerService.getCities);
  const { execute: fetchCountriesAPI } = useFetch(customerService.getCountries);

  // Load initial data
  useEffect(() => {
    loadCustomers();
    loadMasterData();
  }, []);

  useEffect(() => {
    if (customersData) {
      setCustomers(customersData);
    }
  }, [customersData]);

  const loadCustomers = async () => {
    try {
      await fetchCustomers();
    } catch (error) {
      console.error('Error loading customers:', error);
      showAlert('error', formatErrorMessage(error));
    }
  };

  const loadMasterData = async () => {
    try {
      const citiesData = await fetchCitiesAPI();
      const countriesData = await fetchCountriesAPI();
      setCities(Array.isArray(citiesData) ? citiesData : []);
      setCountries(Array.isArray(countriesData) ? countriesData : []);
    } catch (error) {
      console.error('Error loading master data:', error);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    setIsAddModalOpen(true);
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
  };

  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomerAPI(customerId);
        showAlert('success', 'Customer deleted successfully');
        loadCustomers();
      } catch (error) {
        showAlert('error', formatErrorMessage(error));
      }
    }
  };

  const tableColumns = [
    { key: 'id', label: 'ID', width: '80px' },
    { key: 'name', label: 'Name', width: '200px' },
    { key: 'nicNumber', label: 'NIC Number', width: '150px' },
    { key: 'dateOfBirth', label: 'Date of Birth', width: '150px', render: (value) => formatDate(value) },
    {
      key: 'actions',
      label: 'Actions',
      width: '150px',
      render: (_, row) => (
        <div className="actions-cell">
          <button 
            className="action-btn edit-btn"
            onClick={() => handleEditCustomer(row)}
            title="Edit"
          >
            <Edit size={18} />
          </button>
          <button 
            className="action-btn delete-btn"
            onClick={() => handleDeleteCustomer(row.id)}
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="customer-list-container">
      <div className="customer-list-header">
        <h1>Customer Management</h1>
        <div className="header-actions">
          <Button onClick={handleAddCustomer} variant="primary">
            <Plus size={20} /> Add Customer
          </Button>
        </div>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <Table
        columns={tableColumns}
        data={customers}
        isLoading={customersLoading}
      />

      <AddEditCustomerModal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
          setSelectedCustomer(null);
        }}
        customer={selectedCustomer}
        onSuccess={() => {
          showAlert('success', selectedCustomer ? 'Customer updated successfully' : 'Customer created successfully');
          loadCustomers();
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
          setSelectedCustomer(null);
        }}
        onError={(error) => showAlert('error', formatErrorMessage(error))}
        cities={cities}
        countries={countries}
      />
    </div>
  );
};

const AddEditCustomerModal = ({ isOpen, onClose, customer, onSuccess, onError, cities, countries }) => {
  const initialValues = customer ? {
    name: customer.name || '',
    dateOfBirth: customer.dateOfBirth ? parseDate(customer.dateOfBirth) : null,
    nicNumber: customer.nicNumber || '',
    mobileNumbers: (customer.mobileNumbers && Array.isArray(customer.mobileNumbers)) ? customer.mobileNumbers : [],
    addresses: (customer.addresses && Array.isArray(customer.addresses)) ? customer.addresses : [],
  } : {
    name: '',
    dateOfBirth: null,
    nicNumber: '',
    mobileNumbers: [],
    addresses: [],
  };

  const form = useForm(initialValues, async (values) => {
    const errors = validateCustomerForm(values);
    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([field, error]) => {
        form.setFieldError(field, error);
      });
      return;
    }

    try {
      // Mobile numbers are optional, but if provided must be valid (7-10 characters)
      const validMobileNumbers = values.mobileNumbers
        .filter(m => m.number && m.number.trim().length > 0);

      let hasMobileErrors = false;
      validMobileNumbers.forEach((mobile, index) => {
        const phoneNum = mobile.number.trim();
        if (phoneNum.length < 7 || phoneNum.length > 10) {
          form.setFieldError(`mobileNumbers[${index}]`, 'Mobile number must be between 7 and 10 characters');
          hasMobileErrors = true;
        }
      });

      // Addresses are optional, but if provided must be complete
      const validAddresses = values.addresses
        .filter(a => a.addressLine1 && a.addressLine1.trim().length > 0);

      let hasAddressErrors = false;
      validAddresses.forEach((address, index) => {
        if (!address.addressLine1 || address.addressLine1.trim().length === 0) {
          form.setFieldError(`addresses[${index}].addressLine1`, 'Address Line 1 is required');
          hasAddressErrors = true;
        }
        if (!address.cityId || address.cityId === '') {
          form.setFieldError(`addresses[${index}].cityId`, 'City is required');
          hasAddressErrors = true;
        }
        if (!address.countryId || address.countryId === '') {
          form.setFieldError(`addresses[${index}].countryId`, 'Country is required');
          hasAddressErrors = true;
        }
      });

      if (hasMobileErrors || hasAddressErrors) {
        return;
      }

      const payload = {
        name: values.name,
        dateOfBirth: formatDate(values.dateOfBirth),
        nicNumber: values.nicNumber,
        mobileNumbers: validMobileNumbers.map(m => ({
          id: m.id || null,
          number: m.number,
        })),
        addresses: validAddresses.map(a => ({
          id: a.id || null,
          addressLine1: a.addressLine1,
          addressLine2: a.addressLine2 || '',
          city: { id: parseInt(a.cityId) || null },
          country: { id: parseInt(a.countryId) || null },
        })),
      };

      if (customer) {
        await customerService.updateCustomer(customer.id, payload);
        window.alert('✅ Customer updated successfully!');
      } else {
        await customerService.createCustomer(payload);
        window.alert('✅ Customer profile created successfully!');
      }
      onSuccess();
      form.resetForm();
    } catch (error) {
      onError(error);
    }
  });

  const validateCustomerForm = (values) => {
    const errors = {};

    if (!validateName(values.name)) {
      errors.name = 'Name must be between 2 and 100 characters';
    }

    if (!validateDateOfBirth(values.dateOfBirth)) {
      errors.dateOfBirth = 'Date of birth must be valid and not in the future';
    }

    if (!validateNIC(values.nicNumber)) {
      errors.nicNumber = 'NIC number must be between 5 and 20 characters';
    }

    return errors;
  };

  const handleAddMobileNumber = () => {
    const currentMobiles = form.values.mobileNumbers || [];
    form.setFieldValue('mobileNumbers', [
      ...currentMobiles,
      { id: null, number: '' },
    ]);
  };

  const handleRemoveMobileNumber = (index) => {
    const currentMobiles = form.values.mobileNumbers || [];
    form.setFieldValue(
      'mobileNumbers',
      currentMobiles.filter((_, i) => i !== index)
    );
  };

  const handleMobileNumberChange = (index, value) => {
    const currentMobiles = form.values.mobileNumbers || [];
    const updated = [...currentMobiles];
    if (updated[index]) {
      updated[index] = { ...updated[index], number: value };
    }
    form.setFieldValue('mobileNumbers', updated);
  };

  const handleAddAddress = () => {
    const currentAddresses = form.values.addresses || [];
    form.setFieldValue('addresses', [
      ...currentAddresses,
      { id: null, addressLine1: '', addressLine2: '', cityId: '', countryId: '' },
    ]);
  };

  const handleRemoveAddress = (index) => {
    const currentAddresses = form.values.addresses || [];
    form.setFieldValue(
      'addresses',
      currentAddresses.filter((_, i) => i !== index)
    );
  };

  const handleAddressChange = (index, field, value) => {
    const currentAddresses = form.values.addresses || [];
    const updated = [...currentAddresses];
    if (updated[index]) {
      updated[index] = { ...updated[index], [field]: value };
    }
    form.setFieldValue('addresses', updated);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={customer ? 'Edit Customer' : 'Add Customer'}
      size="lg"
    >
      <form onSubmit={(e) => form.handleSubmit(e)}>
        <Input
          label="Name"
          id="name"
          value={form.values.name}
          onChange={form.handleChange}
          error={form.errors.name}
          required
          name="name"
        />

        <DatePicker
          label="Date of Birth"
          id="dateOfBirth"
          selected={form.values.dateOfBirth}
          onChange={(date) => form.setFieldValue('dateOfBirth', date)}
          error={form.errors.dateOfBirth}
          required
        />

        <Input
          label="NIC Number"
          id="nicNumber"
          value={form.values.nicNumber}
          onChange={form.handleChange}
          error={form.errors.nicNumber}
          required
          name="nicNumber"
        />

        <div className="form-section">
          <div className="form-section-header">
            <h3>Mobile Numbers <span className="optional-badge">(Optional)</span></h3>
            <Button type="button" variant="secondary" size="sm" onClick={handleAddMobileNumber}>
              Add
            </Button>
          </div>
          {form.values.mobileNumbers.map((mobile, index) => (
            <div key={index} className="form-row">
              <Input
                label={`Mobile ${index + 1}`}
                id={`mobile-${index}`}
                value={mobile.number}
                onChange={(e) => handleMobileNumberChange(index, e.target.value)}
                placeholder="Enter mobile number"
              />
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => handleRemoveMobileNumber(index)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>

        <div className="form-section">
          <div className="form-section-header">
            <h3>Addresses <span className="optional-badge">(Optional)</span></h3>
            <Button type="button" variant="secondary" size="sm" onClick={handleAddAddress}>
              Add
            </Button>
          </div>
          {form.values.addresses.map((address, index) => (
            <div key={index} className="address-section">
              <Input
                label="Address Line 1"
                id={`address-line-1-${index}`}
                value={address.addressLine1}
                onChange={(e) => handleAddressChange(index, 'addressLine1', e.target.value)}
                placeholder="Enter address line 1"
              />
              <Input
                label="Address Line 2"
                id={`address-line-2-${index}`}
                value={address.addressLine2}
                onChange={(e) => handleAddressChange(index, 'addressLine2', e.target.value)}
                placeholder="Enter address line 2"
              />
              <Select
                label="City"
                id={`city-${index}`}
                options={cities}
                value={address.cityId}
                onChange={(e) => handleAddressChange(index, 'cityId', e.target.value)}
              />
              <Select
                label="Country"
                id={`country-${index}`}
                options={countries}
                value={address.countryId}
                onChange={(e) => handleAddressChange(index, 'countryId', e.target.value)}
              />
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => handleRemoveAddress(index)}
              >
                Remove Address
              </Button>
            </div>
          ))}
        </div>

        <div className="form-actions">
          <Button type="submit" variant="primary" disabled={form.isSubmitting}>
            {form.isSubmitting ? 'Saving...' : 'Save Customer'}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};
