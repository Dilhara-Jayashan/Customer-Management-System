import { useState } from 'react';
import { Button, Alert, Table, Modal } from '../components';
import { customerService } from '../services/customerService';
import { parseCSV, downloadExcelTemplate } from '../utils/fileHelper';
import { formatErrorMessage } from '../utils/validation';
import { Upload, Download, AlertCircle } from 'lucide-react';
import './BulkUpload.css';

export const BulkUpload = () => {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file type
    if (!selectedFile.name.endsWith('.csv')) {
      showAlert('error', 'Please select a CSV file');
      return;
    }

    // Validate file size (max 50MB)
    if (selectedFile.size > 50 * 1024 * 1024) {
      showAlert('error', 'File size must be less than 50MB');
      return;
    }

    setFile(selectedFile);

    try {
      const data = await parseCSV(selectedFile);
      if (data.length === 0) {
        showAlert('error', 'CSV file is empty');
        return;
      }
      setParsedData(data);
      showAlert('success', `Successfully parsed ${data.length} records`);
    } catch (error) {
      showAlert('error', 'Failed to parse CSV file: ' + error.message);
      setParsedData([]);
    }
  };

  const handleBulkUpload = async () => {
    if (!file) {
      showAlert('error', 'Please select a file');
      return;
    }

    if (parsedData.length === 0) {
      showAlert('error', 'No valid data to upload');
      return;
    }

    if (!window.confirm(`Upload ${parsedData.length} customers? This operation may take a few moments.`)) {
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 20;
        });
      }, 500);

      const result = await customerService.bulkUploadCustomers(file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      setUploadResult(result.data || result);
      setShowResultModal(true);

      showAlert('success', 'Bulk upload completed successfully');

      // Reset form
      setTimeout(() => {
        setFile(null);
        setParsedData([]);
        setUploadProgress(0);
      }, 2000);
    } catch (error) {
      showAlert('error', formatErrorMessage(error));
    } finally {
      setIsUploading(false);
    }
  };

  const tableColumns = [
    { key: 'Name', label: 'Name' },
    { key: 'Date of Birth', label: 'Date of Birth' },
    { key: 'NIC Number', label: 'NIC Number' },
    { key: 'Mobile Number 1', label: 'Mobile Number 1' },
    { key: 'Mobile Number 2', label: 'Mobile Number 2' },
  ];

  return (
    <div className="bulk-upload-container">
      <div className="bulk-upload-header">
        <h1>Bulk Customer Upload</h1>
        <p>Upload multiple customers at once using a CSV file</p>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="upload-section">
        <div className="upload-box">
          <Upload size={48} />
          <h2>Upload CSV File</h2>
          <p>Drag and drop your CSV file or click to select</p>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="file-input"
          />
          {file && (
            <div className="file-info">
              <p>Selected file: <strong>{file.name}</strong></p>
              <p>Size: {(file.size / 1024).toFixed(2)} KB</p>
            </div>
          )}
        </div>

        <div className="template-section">
          <h3>CSV Template</h3>
          <p>Download a template to see the required format</p>
          <Button variant="secondary" onClick={downloadExcelTemplate}>
            <Download size={20} /> Download Template
          </Button>
          <div className="template-example">
            <h4>Example Format:</h4>
            <pre>{`Name,Date of Birth,NIC Number,Mobile Number 1,Mobile Number 2
John Doe,1990-01-15,ABC123456,0701234567,0702345678
Jane Smith,1992-03-20,XYZ789012,0703456789,`}</pre>
          </div>
        </div>
      </div>

      {parsedData.length > 0 && (
        <div className="preview-section">
          <h2>Preview ({parsedData.length} records)</h2>
          <div className="preview-info">
            <AlertCircle size={20} />
            <p>Please review the data below before uploading</p>
          </div>
          <Table columns={tableColumns} data={parsedData} />

          {isUploading && (
            <div className="progress-section">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
              </div>
              <p>{Math.round(uploadProgress)}%</p>
            </div>
          )}

          <div className="upload-actions">
            <Button
              onClick={handleBulkUpload}
              variant="primary"
              disabled={isUploading}
            >
              {isUploading ? `Uploading... ${Math.round(uploadProgress)}%` : 'Upload All Customers'}
            </Button>
            <Button
              onClick={() => {
                setFile(null);
                setParsedData([]);
              }}
              variant="secondary"
              disabled={isUploading}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <UploadResultModal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        result={uploadResult}
      />
    </div>
  );
};

const UploadResultModal = ({ isOpen, onClose, result }) => {
  if (!result) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Result"
      size="md"
    >
      <div className="result-content">
        <div className="result-stat">
          <h3>Total Records Processed</h3>
          <p className="stat-value">{result.totalProcessed || result.successCount || 0}</p>
        </div>
        <div className="result-stat success">
          <h3>Successful Uploads</h3>
          <p className="stat-value">{result.successCount || 0}</p>
        </div>
        <div className="result-stat error">
          <h3>Failed Uploads</h3>
          <p className="stat-value">{result.failureCount || 0}</p>
        </div>

        {result.errors && result.errors.length > 0 && (
          <div className="errors-section">
            <h3>Errors</h3>
            <div className="errors-list">
              {result.errors.map((error, index) => (
                <div key={index} className="error-item">
                  <p><strong>Row {error.rowNumber || index + 1}:</strong> {error.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="modal-actions">
          <Button onClick={onClose} variant="primary">Close</Button>
        </div>
      </div>
    </Modal>
  );
};
