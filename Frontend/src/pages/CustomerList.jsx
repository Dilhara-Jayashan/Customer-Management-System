import { useState, useEffect, useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  Users, Plus, Search, Eye, Edit2, Trash2,
  Phone, MapPin, Heart, AlertTriangle, X,
  UserCheck, Calendar, CreditCard, RefreshCw
} from 'lucide-react';
import { Button, Input, Select, DatePicker, Modal, Badge, Table } from '../components';
import { customerService } from '../services/customerService';
import { format, parse, isValid } from 'date-fns';
import './CustomerList.css';

/* ── Helpers ─────────────────────────────────────── */
const initials = (name) =>
  (name || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

const fmtDate = (d) => {
  if (!d) return '—';
  if (typeof d === 'string') return d;
  try { return format(d, 'yyyy-MM-dd'); } catch { return '—'; }
};

const parseDate = (s) => {
  if (!s) return null;
  try { const d = parse(s, 'yyyy-MM-dd', new Date()); return isValid(d) ? d : null; }
  catch { return null; }
};

const blankCustomer = () => ({
  name: '', dateOfBirth: null, nicNumber: '',
  mobileNumbers: [], addresses: [], familyMembers: [],
});

/* ── Main Page ───────────────────────────────────── */
export const CustomerList = () => {
  const [customers, setCustomers]       = useState([]);
  const [loading, setLoading]           = useState(false);
  const [isStub, setIsStub]             = useState(false);
  const [countries, setCountries]       = useState([]);
  const [cities, setCities]             = useState([]);
  const [search, setSearch]             = useState('');
  const [modalMode, setModalMode]       = useState(null); // 'add'|'edit'|'view'|'delete'
  const [selected, setSelected]         = useState(null);
  
  // Pagination States
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage]                 = useState(0);
  const [hasMore, setHasMore]           = useState(false);

  const load = useCallback(async (pageNum = 0, isInitialLoad = false) => {
    setLoading(true);
    try {
      // Fetch 50 customers at a time
      const res = await customerService.getAllCustomers(pageNum, 50); 
      const incomingData = res.content || [];
      
      // If it's the first load, replace the array. If "Load More", append it.
      if (isInitialLoad) {
        setCustomers(incomingData);
      } else {
        setCustomers(prev => [...prev, ...incomingData]);
      }
      
      setTotalRecords(res.totalElements || incomingData.length || 0); 
      setHasMore(pageNum + 1 < (res.totalPages || 1));
      setIsStub(!!res._stub);
    } catch (e) {
      toast.error(e.message || 'Failed to load customers');
    } finally { 
      setLoading(false); 
    }
  }, []);

  const handleRefresh = useCallback(() => {
    setPage(0);
    load(0, true);
  }, [load]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    load(nextPage, false);
  };

  const loadMaster = useCallback(async () => {
    try {
      const [c, ct] = await Promise.all([
        customerService.getCountries(),
        customerService.getCities(),
      ]);
      setCountries(Array.isArray(c) ? c : []);
      setCities(Array.isArray(ct) ? ct : []);
    } catch { /* master data optional */ }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: async data loaders called on mount
  useEffect(() => { handleRefresh(); loadMaster(); }, [handleRefresh, loadMaster]);

  const filtered = useMemo(() => {
    if (!search.trim()) return customers;
    const q = search.toLowerCase();
    return customers.filter(c =>
      c.name?.toLowerCase().includes(q) ||
      c.nicNumber?.toLowerCase().includes(q)
    );
  }, [customers, search]);

  const openAdd  = () => { setSelected(null); setModalMode('add'); };
  const openEdit = (c) => { setSelected(c);    setModalMode('edit'); };
  const openView = (c) => { setSelected(c);    setModalMode('view'); };
  const openDel  = (c) => { setSelected(c);    setModalMode('delete'); };
  const closeModal = () => { setModalMode(null); setSelected(null); };

  const handleDelete = async () => {
    try {
      await customerService.deleteCustomer(selected.id);
      toast.success('Customer deleted');
      closeModal(); 
      handleRefresh(); // Refresh table from page 0
    } catch (e) { toast.error(e.message); }
  };

  const cols = [
    {
      key: 'name', label: 'Customer', width: '220px',
      render: (v, row) => (
        <div className="customer-name-cell">
          <div className="customer-avatar">{initials(v)}</div>
          <div>
            <div className="customer-name-text">{v}</div>
            <div className="customer-nic-text">{row.nicNumber}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'dateOfBirth', label: 'Date of Birth', width: '130px',
      render: (v) => fmtDate(v),
    },
    {
      key: 'mobileNumbers', label: 'Mobile Numbers', width: '180px',
      render: (v) => (
        <div className="mobile-badges">
          {(v && v.length > 0)
            ? v.map((m, i) => <Badge key={i} variant="default">{m.number}</Badge>)
            : <span style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>—</span>}
        </div>
      ),
    },
    {
      key: 'addresses', label: 'Addresses', width: '80px',
      render: (v) => v?.length
        ? <Badge variant="primary"><MapPin size={10} />{v.length}</Badge>
        : '—',
    },
    {
      key: 'familyMembers', label: 'Family', width: '70px',
      render: (v) => v?.length
        ? <Badge variant="success"><Heart size={10} />{v.length}</Badge>
        : '—',
    },
    {
      key: 'actions', label: '', width: '130px',
      render: (_, row) => (
        <div className="action-cell">
          <Button variant="ghost" size="sm" icon onClick={() => openView(row)} title="View">
            <Eye size={15} />
          </Button>
          <Button variant="ghost" size="sm" icon onClick={() => openEdit(row)} title="Edit">
            <Edit2 size={15} />
          </Button>
          <Button variant="danger" size="sm" icon onClick={() => openDel(row)} title="Delete">
            <Trash2 size={15} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-eyebrow"><Users size={12} /> Customer Management</div>
          <h1 className="page-title">Customers</h1>
          <p className="page-subtitle">Create, view and manage all customer records</p>
        </div>
        <div className="page-header-actions">
          <Button variant="secondary" onClick={handleRefresh} disabled={loading} title="Refresh">
            <RefreshCw size={15} style={loading ? { animation: 'spin 1s linear infinite' } : {}} />
            Refresh
          </Button>
          <Button variant="primary" onClick={openAdd} id="btn-add-customer">
            <Plus size={16} /> Add Customer
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon indigo"><Users size={20} /></div>
          <div className="stat-info">
            <div className="stat-value">{totalRecords}</div>
            <div className="stat-label">Total Customers</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon violet"><Phone size={20} /></div>
          <div className="stat-info">
            <div className="stat-value">
              {customers.filter(c => c.mobileNumbers?.length > 0).length}
            </div>
            <div className="stat-label">With Mobiles</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon cyan"><MapPin size={20} /></div>
          <div className="stat-info">
            <div className="stat-value">
              {customers.filter(c => c.addresses?.length > 0).length}
            </div>
            <div className="stat-label">With Addresses</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><Heart size={20} /></div>
          <div className="stat-info">
            <div className="stat-value">
              {customers.filter(c => c.familyMembers?.length > 0).length}
            </div>
            <div className="stat-label">With Family</div>
          </div>
        </div>
      </div>

      {/* Stub notice */}
      {isStub && (
        <div className="stub-notice">
          <AlertTriangle size={16} />
          <span>
            <strong>Backend Note:</strong> The <code>GET /api/customers</code> endpoint currently returns a stub message.
            Please implement a proper paginated endpoint in <code>CustomerController</code> that returns <code>Page&lt;CustomerDTO&gt;</code> using <code>customerRepository.findAll(Pageable)</code>.
          </span>
        </div>
      )}

      {/* Toolbar + Table */}
      <div className="section-card">
        <div className="section-card-header">
          <h2 className="section-card-title"><UserCheck size={16} /> All Customers</h2>
          <div className="toolbar" style={{ margin: 0, marginLeft: 'auto' }}>
            <div className="search-box">
              <Search size={15} className="search-icon" />
              <input
                className="search-input"
                placeholder="Search name or NIC…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                id="customer-search"
              />
            </div>
          </div>
        </div>
        <Table
          columns={cols}
          data={filtered}
          isLoading={loading && page === 0} // Only show full loader on page 0
          emptyMessage="No customers found. Click 'Add Customer' to get started."
        />
        
        {/* Load More Button */}
        {hasMore && !search.trim() && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px', borderTop: '1px solid var(--border)' }}>
            <Button 
              variant="secondary" 
              onClick={handleLoadMore} 
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load Next 50 Customers'}
            </Button>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <CustomerFormModal
        isOpen={modalMode === 'add' || modalMode === 'edit'}
        onClose={closeModal}
        customer={modalMode === 'edit' ? selected : null}
        customers={customers}
        countries={countries}
        cities={cities}
        onSuccess={() => { closeModal(); handleRefresh(); }}
      />

      {/* View Modal */}
      {selected && (
        <CustomerViewModal
          isOpen={modalMode === 'view'}
          onClose={closeModal}
          customer={selected}
          onEdit={() => setModalMode('edit')}
        />
      )}

      {/* Delete Confirm */}
      <Modal isOpen={modalMode === 'delete'} onClose={closeModal} title="Delete Customer" size="sm" icon={Trash2}>
        <div className="delete-confirm">
          <div className="delete-confirm-icon"><Trash2 size={24} /></div>
          <h3>Delete Customer?</h3>
          <p>Are you sure you want to delete <strong>{selected?.name}</strong>? This action cannot be undone.</p>
          <div className="delete-confirm-actions">
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Yes, Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

/* ── Customer Form Modal ─────────────────────────── */
const CustomerFormModal = ({ isOpen, onClose, customer, customers, countries, cities, onSuccess }) => {
  const isEdit = !!customer;
  const [form, setForm]           = useState(blankCustomer);
  const [errors, setErrors]       = useState({});
  const [saving, setSaving]       = useState(false);
  const [citiesByCountry, setCitiesByCountry] = useState({});

  // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: reset form when modal opens or customer prop changes
  useEffect(() => {
    if (isOpen) {
      if (customer) {
        setForm({
          name: customer.name || '',
          dateOfBirth: parseDate(customer.dateOfBirth),
          nicNumber: customer.nicNumber || '',
          mobileNumbers: Array.isArray(customer.mobileNumbers) ? customer.mobileNumbers : [],
          addresses: Array.isArray(customer.addresses)
            ? customer.addresses.map(a => ({
                ...a,
                cityId:    a.cityId    ? String(a.cityId)    : '',
                countryId: a.countryId ? String(a.countryId) : '',
              }))
            : [],
          familyMembers: Array.isArray(customer.familyMembers) ? customer.familyMembers : [],
        });
      } else {
        setForm(blankCustomer());
      }
      setErrors({});
    }
  }, [isOpen, customer]);

  const set = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    setErrors(e => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name?.trim() || form.name.trim().length < 2) e.name = 'Name must be 2–100 characters';
    if (!form.dateOfBirth) e.dateOfBirth = 'Date of birth is required';
    if (!form.nicNumber?.trim() || form.nicNumber.trim().length < 5) e.nicNumber = 'NIC must be 5–20 characters';
    return e;
  };

  const handleCountryChange = async (idx, countryId) => {
    const updated = [...form.addresses];
    updated[idx] = { ...updated[idx], countryId, cityId: '' };
    set('addresses', updated);
    if (countryId && !citiesByCountry[countryId]) {
      try {
        const data = await customerService.getCitiesByCountry(countryId);
        setCitiesByCountry(prev => ({ ...prev, [countryId]: data }));
      } catch { /* ignore */ }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const validMobiles  = form.mobileNumbers.filter(m => m.number?.trim());
      const validAddresses = form.addresses.filter(a => a.addressLine1?.trim());
      const validFamily    = form.familyMembers.filter(f => f.familyCustomerId);

      const payload = {
        name:        form.name.trim(),
        dateOfBirth: fmtDate(form.dateOfBirth),
        nicNumber:   form.nicNumber.trim(),
        mobileNumbers: validMobiles.map(m => ({ id: m.id || null, number: m.number.trim() })),
        addresses: validAddresses.map(a => ({
          id: a.id || null,
          addressLine1: a.addressLine1.trim(),
          addressLine2: a.addressLine2?.trim() || '',
          cityId:    Number(a.cityId)    || null,
          countryId: Number(a.countryId) || null,
        })),
        familyMembers: validFamily.map(f => ({
          id: f.id || null,
          familyCustomerId: Number(f.familyCustomerId),
          relationship: f.relationship || '',
        })),
      };

      if (isEdit) {
        await customerService.updateCustomer(customer.id, payload);
        toast.success('Customer updated successfully!');
      } else {
        await customerService.createCustomer(payload);
        toast.success('Customer created successfully!');
      }
      onSuccess();
    } catch (err) {
      toast.error(err.message || 'Save failed');
    } finally { setSaving(false); }
  };

  /* ── Mobile helpers */
  const addMobile   = () => set('mobileNumbers', [...form.mobileNumbers, { id: null, number: '' }]);
  const removeMobile = (i) => set('mobileNumbers', form.mobileNumbers.filter((_, x) => x !== i));
  const setMobile   = (i, val) => {
    const arr = [...form.mobileNumbers];
    arr[i] = { ...arr[i], number: val };
    set('mobileNumbers', arr);
  };

  /* ── Address helpers */
  const addAddress = () => set('addresses', [...form.addresses, { id: null, addressLine1: '', addressLine2: '', cityId: '', countryId: '' }]);
  const removeAddress = (i) => set('addresses', form.addresses.filter((_, x) => x !== i));
  const setAddr = (i, field, val) => {
    const arr = [...form.addresses];
    arr[i] = { ...arr[i], [field]: val };
    set('addresses', arr);
  };

  /* ── Family helpers */
  const addFamily = () => set('familyMembers', [...form.familyMembers, { id: null, familyCustomerId: '', relationship: '' }]);
  const removeFamily = (i) => set('familyMembers', form.familyMembers.filter((_, x) => x !== i));
  const setFamily = (i, field, val) => {
    const arr = [...form.familyMembers];
    arr[i] = { ...arr[i], [field]: val };
    set('familyMembers', arr);
  };

  const otherCustomers = customers.filter(c => c.id !== customer?.id);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Customer' : 'Add New Customer'}
      size="lg"
      icon={isEdit ? Edit2 : Plus}
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          {/* Basic Info */}
          <Input
            label="Full Name" id="f-name" name="name" required
            placeholder="e.g. John Silva"
            value={form.name} onChange={e => set('name', e.target.value)}
            error={errors.name}
          />
          <Input
            label="NIC Number" id="f-nic" name="nicNumber" required
            placeholder="e.g. 901234567V"
            value={form.nicNumber} onChange={e => set('nicNumber', e.target.value)}
            error={errors.nicNumber}
            hint="Must be unique"
          />
          <div className="form-full">
            <DatePicker
              label="Date of Birth" id="f-dob" required
              selected={form.dateOfBirth}
              onChange={d => set('dateOfBirth', d)}
              error={errors.dateOfBirth}
              maxDate={new Date()}
            />
          </div>

          {/* Mobile Numbers */}
          <div className="form-section">
            <div className="form-section-header">
              <h3 className="form-section-title"><Phone size={13} /> Mobile Numbers <Badge variant="default">Optional</Badge></h3>
              <Button type="button" variant="secondary" size="sm" onClick={addMobile}>
                <Plus size={13} /> Add
              </Button>
            </div>
            <div className="form-section-body">
              {form.mobileNumbers.length === 0 && (
                <div className="form-empty-state"><Phone size={22} /><span>No mobile numbers added</span></div>
              )}
              {form.mobileNumbers.map((m, i) => (
                <div key={i} className="form-row">
                  <Input
                    id={`mobile-${i}`} placeholder="07XXXXXXXX"
                    value={m.number} onChange={e => setMobile(i, e.target.value)}
                    label={`Mobile ${i + 1}`}
                  />
                  <Button type="button" variant="danger" size="sm" icon onClick={() => removeMobile(i)} style={{ marginBottom: 0 }}>
                    <X size={14} />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Addresses */}
          <div className="form-section">
            <div className="form-section-header">
              <h3 className="form-section-title"><MapPin size={13} /> Addresses <Badge variant="default">Optional</Badge></h3>
              <Button type="button" variant="secondary" size="sm" onClick={addAddress}>
                <Plus size={13} /> Add
              </Button>
            </div>
            <div className="form-section-body">
              {form.addresses.length === 0 && (
                <div className="form-empty-state"><MapPin size={22} /><span>No addresses added</span></div>
              )}
              {form.addresses.map((a, i) => (
                <div key={i} className="form-address-block">
                  <span className="form-address-number">Address {i + 1}</span>
                  <div className="form-address-inner">
                    <Input id={`al1-${i}`} label="Address Line 1" placeholder="No. 10, Main Street"
                      value={a.addressLine1} onChange={e => setAddr(i, 'addressLine1', e.target.value)} />
                    <Input id={`al2-${i}`} label="Address Line 2 (optional)" placeholder="Suite / Floor"
                      value={a.addressLine2 || ''} onChange={e => setAddr(i, 'addressLine2', e.target.value)} />
                    <Select id={`country-${i}`} label="Country" required
                      options={countries}
                      value={a.countryId}
                      onChange={e => handleCountryChange(i, e.target.value)}
                    />
                    <Select id={`city-${i}`} label="City" required
                      options={citiesByCountry[a.countryId] || cities.filter(c => !a.countryId || String(c.countryId) === String(a.countryId))}
                      value={a.cityId}
                      onChange={e => setAddr(i, 'cityId', e.target.value)}
                    />
                  </div>
                  <div className="form-address-remove">
                    <Button type="button" variant="danger" size="sm" onClick={() => removeAddress(i)}>
                      <X size={13} /> Remove Address
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Family Members */}
          <div className="form-section">
            <div className="form-section-header">
              <h3 className="form-section-title"><Heart size={13} /> Family Members <Badge variant="default">Optional</Badge></h3>
              <Button type="button" variant="secondary" size="sm" onClick={addFamily}>
                <Plus size={13} /> Add
              </Button>
            </div>
            <div className="form-section-body">
              {form.familyMembers.length === 0 && (
                <div className="form-empty-state"><Heart size={22} /><span>No family members linked</span></div>
              )}
              {form.familyMembers.map((f, i) => (
                <div key={i} className="form-row-3">
                  <Select id={`fam-customer-${i}`} label={`Family Member ${i+1}`}
                    options={otherCustomers.map(c => ({ id: c.id, name: `${c.name} (${c.nicNumber})` }))}
                    value={f.familyCustomerId}
                    onChange={e => setFamily(i, 'familyCustomerId', e.target.value)}
                    placeholder="Select customer"
                  />
                  <Input id={`fam-rel-${i}`} label="Relationship"
                    placeholder="e.g. Spouse"
                    value={f.relationship || ''}
                    onChange={e => setFamily(i, 'relationship', e.target.value)}
                  />
                  <div />
                  <Button type="button" variant="danger" size="sm" icon onClick={() => removeFamily(i)} style={{ marginBottom: 0 }}>
                    <X size={14} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={saving} id="btn-save-customer">
            {saving ? 'Saving…' : isEdit ? 'Update Customer' : 'Create Customer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

/* ── Customer View Modal ─────────────────────────── */
const CustomerViewModal = ({ isOpen, onClose, customer, onEdit }) => {
  if (!customer) return null;
  const c = customer;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Customer Details" size="lg" icon={Eye}>
      <div className="view-grid">
        {/* Basic */}
        <div className="view-section">
          <div className="view-section-title">Basic Information</div>
          <div className="view-field">
            <span className="view-label"><Users size={11} /> Full Name</span>
            <span className="view-value">{c.name}</span>
          </div>
          <div className="view-field">
            <span className="view-label"><Calendar size={11} /> Date of Birth</span>
            <span className="view-value">{fmtDate(c.dateOfBirth)}</span>
          </div>
          <div className="view-field">
            <span className="view-label"><CreditCard size={11} /> NIC Number</span>
            <span className="view-value">{c.nicNumber}</span>
          </div>
        </div>

        {/* Mobile */}
        <div className="view-section">
          <div className="view-section-title">Mobile Numbers</div>
          {(c.mobileNumbers?.length > 0) ? (
            <div className="view-list">
              {c.mobileNumbers.map((m, i) => (
                <div key={i} className="view-list-item"><Phone size={14} />{m.number}</div>
              ))}
            </div>
          ) : <p className="view-empty">No mobile numbers</p>}
        </div>

        {/* Addresses */}
        <div className="view-section view-section-full">
          <div className="view-section-title">Addresses</div>
          {(c.addresses?.length > 0) ? (
            <div className="view-list">
              {c.addresses.map((a, i) => (
                <div key={i} className="view-address-card">
                  <p><MapPin size={13} style={{ display: 'inline', marginRight: 4, color: 'var(--indigo-400)' }} />
                    {a.addressLine1}{a.addressLine2 ? `, ${a.addressLine2}` : ''}
                  </p>
                  <div className="country-city">
                    {a.cityName && <Badge variant="default">{a.cityName}</Badge>}
                    {a.countryName && <Badge variant="primary">{a.countryName}</Badge>}
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="view-empty">No addresses</p>}
        </div>

        {/* Family */}
        <div className="view-section view-section-full">
          <div className="view-section-title">Family Members</div>
          {(c.familyMembers?.length > 0) ? (
            <div className="view-list">
              {c.familyMembers.map((f, i) => (
                <div key={i} className="view-family-card">
                  <div className="view-family-avatar">{initials(f.familyCustomerName)}</div>
                  <div className="view-family-info">
                    <div className="view-family-name">{f.familyCustomerName || `Customer #${f.familyCustomerId}`}</div>
                    <div className="view-family-rel">{f.relationship || 'Family member'}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="view-empty">No family members linked</p>}
        </div>
      </div>

      <div className="form-actions">
        <Button variant="secondary" onClick={onClose}>Close</Button>
        <Button variant="primary" onClick={onEdit}><Edit2 size={14} /> Edit Customer</Button>
      </div>
    </Modal>
  );
};