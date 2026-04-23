import { useState, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Upload, Download, FileSpreadsheet, X, CheckCircle2, Info } from 'lucide-react';
import { Button, Alert, Modal, Badge } from '../components';
import { customerService } from '../services/customerService';
import './BulkUpload.css';

/* Download a sample CSV template */
const downloadTemplate = () => {
  const csv = [
    'Name,Date of Birth,NIC Number,Mobile Number',
    'John Silva,1990-01-15,901234567V,0771234567',
    'Amara Perera,1985-06-20,855678901V,0712345678',
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'customer_bulk_template.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('Template downloaded — save as .xlsx from Excel before uploading', { icon: 'ℹ️' });
};

const fmtSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

export const BulkUpload = () => {
  const fileRef  = useRef(null);
  const [file, setFile]             = useState(null);
  const [dragOver, setDragOver]     = useState(false);
  const [uploading, setUploading]   = useState(false);
  const [progress, setProgress]     = useState(0);
  const [result, setResult]         = useState(null);
  const [showResult, setShowResult] = useState(false);

  const selectFile = useCallback((f) => {
    if (!f) return;
    const ok = f.name.endsWith('.xlsx') || f.name.endsWith('.xls');
    if (!ok) { toast.error('Please select an Excel file (.xlsx or .xls)'); return; }
    setFile(f);
    setResult(null);
  }, []);

  const handleInput    = (e) => selectFile(e.target.files[0]);
  const handleDrop     = (e) => {
    e.preventDefault(); setDragOver(false);
    selectFile(e.dataTransfer.files[0]);
  };
  const handleDragOver  = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = ()  => setDragOver(false);

  const openFilePicker = (e) => {
    e.stopPropagation();
    fileRef.current?.click();
  };

  const handleUpload = async () => {
    if (!file) { toast.error('Please select a file first'); return; }
    setUploading(true);
    setProgress(0);
    try {
      const res = await customerService.bulkUploadCustomers(file, (evt) => {
        if (evt.total) setProgress(Math.round((evt.loaded / evt.total) * 100));
      });
      setProgress(100);
      setResult(res);
      setShowResult(true);
      toast.success(`Upload complete — ${res.successCount} records added`);
      setFile(null);
      if (fileRef.current) fileRef.current.value = '';
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bulk-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-eyebrow"><Upload size={12} /> Bulk Operations</div>
          <h1 className="page-title">Bulk Customer Upload</h1>
          <p className="page-subtitle">Import up to 1,000,000 customers from an Excel file</p>
        </div>
      </div>

      {/* Info alert */}
      <Alert
        type="info"
        title="Large File Support"
        message="The backend processes records in batches of 100 rows with streaming reads — safe for very large files. Timeout is set to 10 minutes for million-record uploads."
      />
      <div style={{ height: 20 }} />

      {/* Drop zone — using div, not label, so inner buttons work correctly */}
      <div
        className={`drop-zone${dragOver ? ' drag-over' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFilePicker}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && openFilePicker(e)}
        aria-label="Click or drag to upload Excel file"
      >
        {/* Hidden file input */}
        <input
          ref={fileRef}
          id="file-upload"
          type="file"
          accept=".xlsx,.xls"
          onChange={handleInput}
          style={{ display: 'none' }}
        />

        <div className="drop-zone-icon">
          <FileSpreadsheet size={28} />
        </div>
        <div className="drop-zone-title">Drop your Excel file here</div>
        <div className="drop-zone-subtitle">or click to browse — .xlsx / .xls accepted</div>

        <Button
          variant="primary"
          type="button"
          onClick={openFilePicker}
        >
          <Upload size={15} /> Choose File
        </Button>

        {file && (
          <div className="file-info-card" onClick={(e) => e.stopPropagation()}>
            <div className="file-info-icon"><FileSpreadsheet size={20} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="file-info-name">{file.name}</div>
              <div className="file-info-size">{fmtSize(file.size)}</div>
            </div>
            <div className="file-info-remove">
              <Button
                type="button" variant="ghost" size="sm" icon
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  if (fileRef.current) fileRef.current.value = '';
                }}
              >
                <X size={14} />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Progress */}
      {uploading && (
        <div className="progress-wrap">
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
          <div className="progress-label">{progress}% uploaded</div>
        </div>
      )}

      {/* Upload action */}
      <div className="upload-actions">
        <Button variant="secondary" type="button" onClick={downloadTemplate}>
          <Download size={15} /> Download Template
        </Button>
        <Button
          variant="primary"
          type="button"
          id="btn-upload-customers"
          onClick={handleUpload}
          disabled={!file || uploading}
        >
          {uploading ? `Uploading… ${progress}%` : <><Upload size={15} /> Upload Customers</>}
        </Button>
      </div>

      {/* Template guide */}
      <div className="template-card">
        <div className="template-title"><Info size={16} /> Required Excel Format</div>
        <p className="template-desc">Column A–D must be present in row 1 (header). Row 2 onward is data.</p>
        <div className="template-code">{`| A: Name          | B: Date of Birth | C: NIC Number | D: Mobile Number |
|------------------|------------------|---------------|------------------|
| John Silva       | 1990-01-15       | 901234567V    | 0771234567       |
| Amara Perera     | 1985-06-20       | 855678901V    | 0712345678       |`}</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Badge variant="error">Name — mandatory</Badge>
          <Badge variant="error">Date of Birth — mandatory (yyyy-MM-dd)</Badge>
          <Badge variant="error">NIC Number — mandatory, unique</Badge>
          <Badge variant="default">Mobile — optional</Badge>
        </div>
      </div>

      {/* Result modal */}
      <Modal isOpen={showResult} onClose={() => setShowResult(false)} title="Upload Result" size="md" icon={CheckCircle2}>
        {result && (
          <>
            <div className="result-grid">
              <div className="result-stat total">
                <div className="result-stat-value">{result.totalRecords ?? 0}</div>
                <div className="result-stat-label">Total Rows</div>
              </div>
              <div className="result-stat success">
                <div className="result-stat-value">{result.successCount ?? 0}</div>
                <div className="result-stat-label">Succeeded</div>
              </div>
              <div className="result-stat failed">
                <div className="result-stat-value">{result.failureCount ?? 0}</div>
                <div className="result-stat-label">Failed</div>
              </div>
            </div>
            {result.message && <div className="result-message">{result.message}</div>}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="primary" onClick={() => setShowResult(false)}>Done</Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};
