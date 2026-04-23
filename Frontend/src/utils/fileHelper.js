export const downloadFile = (data, filename, type = 'application/json') => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const downloadExcelTemplate = () => {
  const headers = ['Name', 'Date of Birth', 'NIC Number', 'Mobile Number 1', 'Mobile Number 2'];
  const csvContent = headers.join(',') + '\n' +
    'John Doe,1990-01-15,ABC123456,0701234567,0702345678\n' +
    'Jane Smith,1992-03-20,XYZ789012,0703456789,';

  downloadFile(csvContent, 'customer_template.csv', 'text/csv');
};

export const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const data = lines.slice(1)
          .filter(line => line.trim())
          .map(line => {
            const values = line.split(',').map(v => v.trim());
            return headers.reduce((obj, header, index) => {
              obj[header] = values[index] || '';
              return obj;
            }, {});
          });
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};
