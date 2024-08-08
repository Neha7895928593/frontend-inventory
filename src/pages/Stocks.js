import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import * as XLSX from 'xlsx';
import { ArrowDownIcon, DocumentTextIcon, FunnelIcon, EyeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import TopNav from '../components/TopNav';
import BottomNav from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PDFDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Stock Export</Text>
        {data.map((item, index) => (
          <Text key={index} style={styles.text}>
            {item.modelNo} - Qty: {item.qty} - Price/P: {item.pricePer} - Amount: {item.amount}
          </Text>
        ))}
        <Text style={styles.total}>
          Total Qty: {data.reduce((acc, item) => acc + item.qty, 0)} - Total Amount: {data.reduce((acc, item) => acc + item.amount, 0)}
        </Text>
      </View>
    </Page>
  </Document>
);

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  total: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

const StockDisplay = () => {
  const [stockData, setStockData] = useState([]);
  const [filterBrand, setFilterBrand] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStockData = async () => {
      const token = localStorage.getItem('dealerToken');
      if (!token) {
        toast.error('No authentication token found');
        return;
      }

      try {
        const response = await axios.get('https://inventorysystem-a14x.onrender.com/api/var/dealers/stock-summary', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setStockData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
        toast.error('Failed to fetch stock data');
      }
    };

    fetchStockData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const uniqueBrands = [...new Set(stockData.map(item => item.brand))];

  const filteredData = stockData.filter((item) =>
    (item.brand.toLowerCase().includes(selectedBrand.toLowerCase()) || selectedBrand === '') &&
    (item.brand.toLowerCase().includes(filterBrand.toLowerCase()) || filterBrand === '')
  );

  const handleExcelExport = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Stock Data');
    XLSX.writeFile(wb, 'stock_data.xlsx');
    toast.success('Excel file generated');
  };

  const handleViewDetails = (item) => {
    navigate(`/brandDetails/${item.brand}`);
  };

  return (
    <>
      <TopNav />
      <div className="flex flex-col min-h-screen bg-gradient-to-r from-teal-200 to-gray-100">
        <div className="flex-1 mt-16 px-6">
          <h1 className="text-2xl font-bold mb-6 mt-8 text-gray-800">Current Stocks</h1>
          <div className="flex flex-col md:flex-row items-center justify-between mb-2">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="flex items-center border border-gray-300 rounded-md shadow-sm bg-white">
                <MagnifyingGlassIcon className="w-6 h-6 text-gray-500 ml-2" />
                <input
                  type="text"
                  value={filterBrand}
                  onChange={(e) => setFilterBrand(e.target.value)}
                  placeholder="Search"
                  className="p-2 border-none rounded-md focus:ring-teal-400 focus:border-teal-600 transition duration-300 w-full md:w-60"
                />
              </div>
              <div className="flex items-center border border-gray-300 rounded-md shadow-sm bg-white">
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="p-2 border-none rounded-md focus:ring-teal-400 focus:border-teal-600 transition duration-300 w-full md:w-60"
                >
                  <option value="">All Brands</option>
                  {uniqueBrands.map((brand, index) => (
                    <option key={index} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center bg-teal-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-teal-700 transition"
              >
                <FunnelIcon className="w-6 h-6" />
                <span className="ml-2">Filter</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto mb-20">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-teal-600 text-white">
                <tr>
                  <th className="p-4 text-left">Sl. No.</th>
                  <th className="p-4 text-left">Model No.</th>
                  <th className="p-4 text-left">Qty</th>
                  <th className="p-4 text-left">Price/P</th>
                  <th className="p-4 text-left">Amount</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50 transition duration-200">
                      <td className="p-4">{index + 1}</td>
                      <td className="p-4">{item.modelNo}</td>
                      <td className="p-4">{item.qty}</td>
                      <td className="p-4">{item.pricePer}</td>
                      <td className="p-4">{item.amount}</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleViewDetails(item)}
                          className="text-teal-600 hover:text-teal-800 transition"
                        >
                          <EyeIcon className="w-6 h-6" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-gray-500">
                      No data available
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="p-4 font-bold" colSpan="4">Total</td>
                  <td className="p-4 font-bold">
                    {filteredData.reduce((acc, item) => acc + item.amount, 0)}
                  </td>
                  <td className="p-4"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <BottomNav className="fixed bottom-0 left-0 w-full" />

        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80 animate-fadeIn">
              <h2 className="text-lg font-bold mb-4 text-gray-800">Export Options</h2>
              <button
                onClick={handleExcelExport}
                className="flex items-center mb-2 bg-teal-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-teal-700 transition w-full"
              >
                <ArrowDownIcon className="w-6 h-6 mr-2" />
                <span className="ml-2">Excel</span>
              </button>
              <PDFDownloadLink
                document={<PDFDocument data={filteredData} />}
                fileName="stock_data.pdf"
              >
                {({ loading }) =>
                  loading ? (
                    <button className="flex items-center mb-2 bg-teal-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-teal-700 transition w-full">
                      <ArrowDownIcon className="w-6 h-6 mr-2" />
                      Generating PDF...
                    </button>
                  ) : (
                    <button className="flex items-center mb-2 bg-teal-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-teal-700 transition w-full">
                      <ArrowDownIcon className="w-6 h-6 mr-2" />
                      <span className="ml-2">PDF</span>
                    </button>
                  )
                }
              </PDFDownloadLink>
              <CSVLink
                data={filteredData}
                filename="stock_data.csv"
                className="flex items-center mb-2 bg-teal-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-teal-700 transition w-full"
              >
                <DocumentTextIcon className="w-6 h-6 mr-2" />
                <span className="ml-2">CSV</span>
              </CSVLink>
              <button
                onClick={() => setIsModalOpen(false)}
                className="mt-4 w-full bg-gray-300 text-gray-800 px-4 py-2 rounded-lg shadow-md hover:bg-gray-400 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default StockDisplay;
