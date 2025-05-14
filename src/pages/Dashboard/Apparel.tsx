import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ApparelItem {
  id: string;
  orderNumber: string;
  orderDate: string;
  shipDate: string;
  customer: string;
  size: string;
  color: string;
  sku: string;
  quantity: number;
  decoration: 'Screen Print' | 'Embroidery';
  vendor: 'Hoop It Up' | 'Markit';
}

interface OrderGroup {
  orderNumber: string;
  orderDate: string;
  shipDate: string;
  customer: string;
  totalQuantity: number;
  status: 'In Production' | 'Received' | 'Shipped';
  lineItems: ApparelItem[];
}

// Interface for shipping information
interface ShippingInfo {
  orderNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  method: 'Ground' | 'Express' | '2-Day';
  tracking: string;
  estimatedDelivery: string;
}

const Apparel: React.FC = () => {
  // Sample apparel order data
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [apparelData, setApparelData] = useState<ApparelItem[]>([
    { id: '1', orderNumber: 'ORD-001', orderDate: '2023-04-28', shipDate: '2023-05-12', customer: 'Acme Corp', size: 'M', sku: 'T100-BLK-M', color: 'Black', quantity: 50, decoration: 'Screen Print', vendor: 'Markit' },
    { id: '2', orderNumber: 'ORD-001', orderDate: '2023-04-28', shipDate: '2023-05-12', customer: 'Acme Corp', size: 'L', sku: 'T100-BLK-L', color: 'Black', quantity: 75, decoration: 'Screen Print', vendor: 'Markit' },
    { id: '3', orderNumber: 'ORD-001', orderDate: '2023-04-28', shipDate: '2023-05-12', customer: 'Acme Corp', size: 'XL', sku: 'T100-BLK-XL', color: 'Black', quantity: 35, decoration: 'Screen Print', vendor: 'Markit' },
    { id: '4', orderNumber: 'ORD-002', orderDate: '2023-04-30', shipDate: '2023-05-15', customer: 'TechStart Inc', size: 'S', sku: 'P205-NVY-S', color: 'Navy', quantity: 25, decoration: 'Embroidery', vendor: 'Hoop It Up' },
    { id: '5', orderNumber: 'ORD-002', orderDate: '2023-04-30', shipDate: '2023-05-15', customer: 'TechStart Inc', size: 'M', sku: 'P205-NVY-M', color: 'Navy', quantity: 40, decoration: 'Embroidery', vendor: 'Hoop It Up' },
    { id: '6', orderNumber: 'ORD-003', orderDate: '2023-05-02', shipDate: '2023-05-18', customer: 'Global Services', size: 'L', sku: 'H300-RED-L', color: 'Red', quantity: 30, decoration: 'Screen Print', vendor: 'Hoop It Up' },
    { id: '7', orderNumber: 'ORD-003', orderDate: '2023-05-02', shipDate: '2023-05-18', customer: 'Global Services', size: 'XL', sku: 'H300-RED-XL', color: 'Red', quantity: 45, decoration: 'Screen Print', vendor: 'Hoop It Up' },
    { id: '8', orderNumber: 'ORD-004', orderDate: '2023-05-05', shipDate: '2023-05-20', customer: 'Summit Enterprises', size: 'M', sku: 'J150-WHT-M', color: 'White', quantity: 60, decoration: 'Embroidery', vendor: 'Markit' },
    { id: '9', orderNumber: 'ORD-004', orderDate: '2023-05-05', shipDate: '2023-05-20', customer: 'Summit Enterprises', size: 'L', sku: 'J150-WHT-L', color: 'White', quantity: 55, decoration: 'Embroidery', vendor: 'Markit' },
    { id: '10', orderNumber: 'ORD-005', orderDate: '2023-05-08', shipDate: '2023-05-22', customer: 'Mountain View Co', size: 'S', sku: 'P220-GRN-S', color: 'Green', quantity: 20, decoration: 'Screen Print', vendor: 'Markit' },
    { id: '11', orderNumber: 'ORD-005', orderDate: '2023-05-08', shipDate: '2023-05-22', customer: 'Mountain View Co', size: 'M', sku: 'P220-GRN-M', color: 'Green', quantity: 35, decoration: 'Screen Print', vendor: 'Markit' },
    { id: '12', orderNumber: 'ORD-005', orderDate: '2023-05-08', shipDate: '2023-05-22', customer: 'Mountain View Co', size: 'L', sku: 'P220-GRN-L', color: 'Green', quantity: 25, decoration: 'Screen Print', vendor: 'Markit' },
  ]);

  // Sample shipping information data
  const [shippingData] = useState<ShippingInfo[]>([
    { 
      orderNumber: 'ORD-001', 
      address: '123 Corporate Way', 
      city: 'New York', 
      state: 'NY', 
      zipCode: '10001', 
      method: 'Express', 
      tracking: 'UPS-8723591458', 
      estimatedDelivery: '2023-05-14' 
    },
    { 
      orderNumber: 'ORD-002', 
      address: '456 Tech Blvd', 
      city: 'San Francisco', 
      state: 'CA', 
      zipCode: '94105', 
      method: '2-Day', 
      tracking: 'FEDEX-4521867390', 
      estimatedDelivery: '2023-05-17' 
    },
    { 
      orderNumber: 'ORD-003', 
      address: '789 Service Rd', 
      city: 'Chicago', 
      state: 'IL', 
      zipCode: '60603', 
      method: 'Ground', 
      tracking: 'USPS-3654129870', 
      estimatedDelivery: '2023-05-20' 
    },
    { 
      orderNumber: 'ORD-004', 
      address: '321 Summit Ave', 
      city: 'Denver', 
      state: 'CO', 
      zipCode: '80202', 
      method: 'Express', 
      tracking: 'UPS-9513647820', 
      estimatedDelivery: '2023-05-22' 
    },
    { 
      orderNumber: 'ORD-005', 
      address: '159 Mountain Rd', 
      city: 'Seattle', 
      state: 'WA', 
      zipCode: '98101', 
      method: '2-Day', 
      tracking: 'FEDEX-6758291304', 
      estimatedDelivery: '2023-05-24' 
    },
  ]);

  // State for shipping info popup
  const [hoveredOrder, setHoveredOrder] = useState<string | null>(null);
  
  // State for expanded orders
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);
  
  // State for brand guidelines modal
  const [showBrandGuidelines, setShowBrandGuidelines] = useState(false);
  const [selectedCustomerGuidelines, setSelectedCustomerGuidelines] = useState<string | null>(null);
  
  // Toggle for vendor display (Hoop It Up vs Markit)
  const [viewMode, setViewMode] = useState<'hoopitup' | 'markit' | 'all'>('all');

  // Analytics modal state
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState<string>('orders');

  // Toggle order expansion
  const toggleOrderExpansion = (orderNumber: string) => {
    if (expandedOrders.includes(orderNumber)) {
      setExpandedOrders(expandedOrders.filter(order => order !== orderNumber));
    } else {
      setExpandedOrders([...expandedOrders, orderNumber]);
    }
  };

  // Group apparelData by orderNumber
  const groupedOrders = React.useMemo(() => {
    const orderMap = new Map<string, OrderGroup>();
    
    apparelData.forEach(item => {
      if (!orderMap.has(item.orderNumber)) {
        // Create a new randomly assigned status
        const statuses: Array<'In Production' | 'Received' | 'Shipped'> = ['In Production', 'Received', 'Shipped'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        orderMap.set(item.orderNumber, {
          orderNumber: item.orderNumber,
          orderDate: item.orderDate,
          shipDate: item.shipDate,
          customer: item.customer,
          totalQuantity: item.quantity,
          status: randomStatus,
          lineItems: [item]
        });
      } else {
        const order = orderMap.get(item.orderNumber)!;
        order.totalQuantity += item.quantity;
        order.lineItems.push(item);
      }
    });
    
    return Array.from(orderMap.values());
  }, [apparelData]);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof OrderGroup;
    direction: 'ascending' | 'descending';
  } | null>(null);

  // Search state
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Customer filter state
  const [customerFilter, setCustomerFilter] = useState<string>('All Customers');
  const customers = ['All Customers', 'Acme Corp', 'TechStart Inc', 'Global Services', 'Summit Enterprises', 'Mountain View Co'];
  
  // Status filter state
  const [statusFilter, setStatusFilter] = useState<string>('All');
  // Update the statuses array to use "All Status" instead of "All"
  const displayStatuses = ['All Status', 'In Production', 'Received', 'Shipped'];
  const getStatusValue = (display: string) => display === 'All Status' ? 'All' : display;
  const getStatusDisplay = (value: string) => value === 'All' ? 'All Status' : value;

  // Sort and filter function for grouped orders
  const filteredOrders = React.useMemo(() => {
    let filteredItems = [...groupedOrders];
    
    // Apply status filter
    if (statusFilter !== 'All') {
      filteredItems = filteredItems.filter(order => order.status === statusFilter);
    }
    
    // Apply vendor filter based on view mode
    if (viewMode !== 'all') {
      filteredItems = filteredItems.filter(order => 
        viewMode === 'hoopitup' ? order.lineItems.some(item => item.vendor === 'Hoop It Up') : order.lineItems.some(item => item.vendor === 'Markit')
      );
    }
    
    // Apply customer filter
    if (customerFilter !== 'All Customers') {
      filteredItems = filteredItems.filter(order => order.customer === customerFilter);
    }
    
    // Apply search filter - search across order number, customer
    if (searchTerm) {
      filteredItems = filteredItems.filter(order => 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
        order.customer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    if (sortConfig !== null) {
      filteredItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    } else {
      // Default sort by order date (newest first)
      filteredItems.sort((a, b) => {
        return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
      });
    }
    
    return filteredItems;
  }, [groupedOrders, sortConfig, viewMode, statusFilter, customerFilter, searchTerm]);

  const requestSort = (key: keyof OrderGroup) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Function to generate time series data for analytics
  const generateTimeSeriesData = (dateRange: string, metric: string) => {
    let labels: string[] = [];
    
    if (dateRange === 'week') {
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    } else if (dateRange === 'month') {
      labels = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
    } else {
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    }

    // Generate data for each vendor
    const generateDataForVendor = (vendor: 'Hoop It Up' | 'Markit', color: string) => {
      // Filter items by vendor
      const vendorItems = apparelData.filter(item => item.vendor === vendor);
      
      // Generate random but realistic-looking data based on the items
      let ordersData: number[] = [];
      let quantityData: number[] = [];
      let revenueData: number[] = [];
      
      if (dateRange === 'week' || dateRange === 'month') {
        const length = dateRange === 'week' ? 7 : 30;
        // Create a baseline with some randomness
        const baseline = Math.round(vendorItems.length / (vendor === 'Hoop It Up' ? 3 : 2));
        
        ordersData = Array(length).fill(0).map(() => 
          Math.max(1, Math.round(baseline * (0.7 + Math.random() * 0.6)))
        );
        
        quantityData = ordersData.map(orders => 
          Math.round(orders * (vendor === 'Hoop It Up' ? 40 : 50) * (0.8 + Math.random() * 0.4))
        );
        
        revenueData = quantityData.map(qty => 
          Math.round(qty * (vendor === 'Hoop It Up' ? 22 : 18) * (0.9 + Math.random() * 0.2))
        );
      } else {
        // Yearly data
        const monthlyBaseline = Math.round(vendorItems.length / (vendor === 'Hoop It Up' ? 3 : 2));
        
        // Create seasonal patterns
        ordersData = labels.map((_, i) => {
          // More orders during summer and winter
          const seasonalFactor = i < 2 || i > 9 ? 1.2 : // Winter
                                 i >= 4 && i <= 7 ? 1.3 : // Summer
                                 0.8; // Spring/Fall
          return Math.max(1, Math.round(monthlyBaseline * seasonalFactor * (0.8 + Math.random() * 0.4)));
        });
        
        quantityData = ordersData.map(orders => 
          Math.round(orders * (vendor === 'Hoop It Up' ? 40 : 50) * (0.8 + Math.random() * 0.4))
        );
        
        revenueData = quantityData.map(qty => 
          Math.round(qty * (vendor === 'Hoop It Up' ? 22 : 18) * (0.9 + Math.random() * 0.2))
        );
      }
      
      // Return appropriate dataset based on selected metric
      if (metric === 'orders') {
        return {
          label: vendor,
          data: ordersData,
          borderColor: color,
          backgroundColor: color.replace('1)', '0.1)'),
          tension: 0.4,
          fill: false,
        };
      } else if (metric === 'quantity') {
        return {
          label: vendor,
          data: quantityData,
          borderColor: color,
          backgroundColor: color.replace('1)', '0.1)'),
          tension: 0.4,
          fill: false,
        };
      } else {
        return {
          label: vendor,
          data: revenueData,
          borderColor: color,
          backgroundColor: color.replace('1)', '0.1)'),
          tension: 0.4,
          fill: false,
        };
      }
    };
    
    // Create datasets array with both vendors
    const datasets = [
      generateDataForVendor('Hoop It Up', 'rgba(255, 215, 0, 1)'), // Hoop It Up is gold
      generateDataForVendor('Markit', 'rgba(0, 200, 83, 1)'), // Markit is green
    ];
    
    return { labels, datasets };
  };

  // Generate pie chart data for vendor distribution
  const generateVendorDistributionData = () => {
    const hoopItUpItems = apparelData.filter(item => item.vendor === 'Hoop It Up');
    const markitItems = apparelData.filter(item => item.vendor === 'Markit');
    
    const hoopItUpQuantity = hoopItUpItems.reduce((sum, item) => sum + item.quantity, 0);
    const markitQuantity = markitItems.reduce((sum, item) => sum + item.quantity, 0);
    
    return {
      labels: ['Hoop It Up', 'Markit'],
      datasets: [
        {
          data: [hoopItUpQuantity, markitQuantity],
          backgroundColor: [
            'rgba(255, 215, 0, 0.8)',
            'rgba(0, 200, 83, 0.8)',
          ],
          borderColor: [
            'rgba(255, 215, 0, 1)',
            'rgba(0, 200, 83, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Generate decoration type distribution data
  const generateDecorationDistributionData = () => {
    const screenPrintItems = apparelData.filter(item => item.decoration === 'Screen Print');
    const embroideryItems = apparelData.filter(item => item.decoration === 'Embroidery');
    
    const screenPrintQuantity = screenPrintItems.reduce((sum, item) => sum + item.quantity, 0);
    const embroideryQuantity = embroideryItems.reduce((sum, item) => sum + item.quantity, 0);
    
    return {
      labels: ['Screen Print', 'Embroidery'],
      datasets: [
        {
          data: [screenPrintQuantity, embroideryQuantity],
          backgroundColor: [
            'rgba(130, 180, 255, 0.8)',
            'rgba(255, 130, 170, 0.8)',
          ],
          borderColor: [
            'rgba(130, 180, 255, 1)',
            'rgba(255, 130, 170, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
        }
      }
    }
  };

  // Pie chart options
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
        }
      }
    }
  };

  // Function to close analytics modal
  const closeAnalytics = () => {
    setShowAnalytics(false);
  };
  
  // Function to open analytics modal
  const openAnalytics = () => {
    setShowAnalytics(true);
  };
  
  // Function to open brand guidelines modal
  const openBrandGuidelines = (customer: string) => {
    setSelectedCustomerGuidelines(customer);
    setShowBrandGuidelines(true);
  };
  
  // Function to close brand guidelines modal
  const closeBrandGuidelines = () => {
    setShowBrandGuidelines(false);
    setSelectedCustomerGuidelines(null);
  };

  // Function to get shipping info by order number
  const getShippingInfo = (orderNumber: string): ShippingInfo | undefined => {
    return shippingData.find(info => info.orderNumber === orderNumber);
  };

  // Stats for KPIs
  const totalOrders = groupedOrders.length;
  const totalItems = apparelData.reduce((sum, item) => sum + item.quantity, 0);
  const pendingShipments = groupedOrders.filter(order => {
    const today = new Date();
    const shipDate = new Date(order.shipDate);
    return shipDate > today;
  }).length;
  const uniqueCustomers = new Set(groupedOrders.map(order => order.customer)).size;

  return (
    <div style={{ 
      padding: '2rem 2rem 2rem 2rem',
      minHeight: '100vh',
      background: 'black',
      position: 'relative',
    }}>
      {/* Note: The LOG IN button in the top navbar should be replaced with a gold sign out icon 
          in the parent component that contains the navigation */}
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* KPI Section */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          {/* Total Orders */}
          <motion.div
            whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: 'rgba(20, 20, 30, 0.6)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1rem',
              padding: '1.5rem',
              border: '1px solid rgba(255, 215, 0, 0.2)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3 style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem' }}>
              Total Orders
            </h3>
            <p style={{ 
              fontSize: '1.75rem', 
              fontWeight: 'bold',
              fontFamily: "'Rajdhani', sans-serif",
            }}>
              {groupedOrders.length}
            </p>
          </motion.div>

          {/* Total Qty - Changed from In Production */}
          <motion.div
            whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            style={{
              background: 'rgba(20, 20, 30, 0.6)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1rem',
              padding: '1.5rem',
              border: '1px solid rgba(255, 215, 0, 0.2)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3 style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem' }}>
              Total Qty
            </h3>
            <p style={{ 
              fontSize: '1.75rem', 
              fontWeight: 'bold',
              fontFamily: "'Rajdhani', sans-serif",
            }}>
              {totalItems.toLocaleString()}
            </p>
          </motion.div>

          {/* In Production - Changed from Received */}
          <motion.div
            whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            style={{
              background: 'rgba(20, 20, 30, 0.6)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1rem',
              padding: '1.5rem',
              border: '1px solid rgba(255, 215, 0, 0.2)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3 style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem' }}>
              In Production
            </h3>
            <p style={{ 
              fontSize: '1.75rem', 
              fontWeight: 'bold',
              fontFamily: "'Rajdhani', sans-serif",
              color: 'rgba(255, 215, 0, 0.9)',
            }}>
              {groupedOrders.filter(order => order.status === 'In Production').length}
            </p>
          </motion.div>

          {/* Current Production Days - Changed from Shipped */}
          <motion.div
            whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            style={{
              background: 'rgba(20, 20, 30, 0.6)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1rem',
              padding: '1.5rem',
              border: '1px solid rgba(255, 215, 0, 0.2)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3 style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem' }}>
              Current Production Days
            </h3>
            <p style={{ 
              fontSize: '1.75rem', 
              fontWeight: 'bold',
              fontFamily: "'Rajdhani', sans-serif",
              color: 'rgba(0, 200, 83, 0.9)',
            }}>
              6
            </p>
          </motion.div>
        </div>
        
        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          {/* Search Input */}
          <div style={{
            position: 'relative',
            flex: 'none',
            width: 'calc(25% - 1.125rem)', // Match KPI card width
            minWidth: '200px',
          }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search orders..."
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                borderRadius: '0.5rem',
                background: 'rgba(30, 30, 40, 0.6)',
                border: '1px solid rgba(255, 215, 0, 0.2)', // Updated to gold
                color: 'rgba(255, 215, 0, 0.9)',
                outline: 'none',
              }}
            />
            <span style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255, 215, 0, 0.7)', // Updated to gold
            }}>
              🔍
            </span>
          </div>

          {/* Customer Filter Dropdown */}
          <div style={{
            position: 'relative',
            flex: 'none',
            width: 'calc(25% - 1.125rem)', // Match KPI card width
            minWidth: '200px',
          }}>
            <select
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                appearance: 'none',
                background: 'rgba(30, 30, 40, 0.6)',
                border: '1px solid rgba(255, 215, 0, 0.2)', // Updated to gold
                borderRadius: '0.5rem',
                color: 'white',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {customers.map(customer => (
                <option key={customer} value={customer}>{customer}</option>
              ))}
            </select>
            <span style={{
              position: 'absolute',
              right: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255, 215, 0, 0.7)', // Updated to gold
              pointerEvents: 'none',
            }}>
              ▼
            </span>
          </div>

          {/* Status Filter Dropdown */}
          <div style={{
            position: 'relative',
            flex: 'none',
            width: 'calc(25% - 1.125rem)', // Match KPI card width
            minWidth: '200px',
          }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                appearance: 'none',
                background: 'rgba(30, 30, 40, 0.6)',
                border: '1px solid rgba(255, 215, 0, 0.2)', // Updated to gold
                borderRadius: '0.5rem',
                color: 'white',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {displayStatuses.map(status => (
                <option key={status} value={getStatusValue(status)}>{status}</option>
              ))}
            </select>
            <span style={{
              position: 'absolute',
              right: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255, 215, 0, 0.7)', // Updated to gold
              pointerEvents: 'none',
            }}>
              ▼
            </span>
          </div>

          {/* Vendor Dropdown + Analytics Button */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            flex: 'none',
            width: 'calc(25% - 1.125rem)', // Match KPI card width
            minWidth: '200px',
            justifyContent: 'flex-end',
          }}>
            {/* Vendor Dropdown */}
            <div style={{ position: 'relative', flex: 1 }}>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as 'hoopitup' | 'markit' | 'all')}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  appearance: 'none',
                  background: 'rgba(30, 30, 40, 0.6)',
                  border: '1px solid rgba(255, 215, 0, 0.2)', // Updated to gold
                  borderRadius: '0.5rem',
                  color: 'white',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                <option value="all">All Vendors</option>
                <option value="hoopitup">Hoop It Up</option>
                <option value="markit">Markit</option>
              </select>
              <span style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(255, 215, 0, 0.7)', // Updated to gold
                pointerEvents: 'none',
              }}>
                ▼
              </span>
            </div>
            
            {/* Analytics Button */}
            <motion.button
              whileHover={{ 
                scale: 1.05
              }}
              whileTap={{ scale: 0.95 }}
              onClick={openAnalytics}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#FFD700',
                border: 'none',
                color: '#000',
                cursor: 'pointer',
              }}
              title="Analytics"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
          </div>
        </motion.div>
        
        {/* Title removed as requested */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          style={{
            background: 'rgba(20, 20, 30, 0.6)',
            backdropFilter: 'blur(10px)',
            borderRadius: '1rem',
            overflow: 'hidden',
            border: '1px solid rgba(255, 215, 0, 0.2)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            marginBottom: '1.5rem'
          }}
        >
          {/* Table Title with Vendor */}
          <div style={{ 
            padding: '1rem 1.5rem', 
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center' 
          }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold',
              fontFamily: "'Rajdhani', sans-serif",
              color: viewMode === 'markit' ? 'rgba(0, 200, 83, 0.9)' : 'rgba(255, 215, 0, 0.9)',
            }}>
              {viewMode === 'markit' ? 'Markit Orders' : 'Hoop It Up Orders'}
            </h3>
            <div style={{
              padding: '0.25rem 0.5rem',
              borderRadius: '1rem',
              fontSize: '0.75rem',
              backgroundColor: viewMode === 'markit' ? 'rgba(0, 200, 83, 0.15)' : 'rgba(255, 215, 0, 0.15)',
              color: viewMode === 'markit' ? 'rgba(0, 200, 83, 1)' : 'rgba(255, 215, 0, 1)',
            }}>
              {filteredOrders.length} orders
            </div>
          </div>

          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '650px' }}>
              <thead>
                <tr style={{ backgroundColor: 'rgba(30, 30, 40, 0.6)', textAlign: 'center' }}>
                  <th 
                    style={{ padding: '1rem', cursor: 'pointer' }}
                    onClick={() => requestSort('orderNumber')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <span>Order #</span>
                      {sortConfig?.key === 'orderNumber' && (
                        <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    style={{ padding: '1rem', cursor: 'pointer' }}
                    onClick={() => requestSort('orderDate')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <span>Order Date</span>
                      {sortConfig?.key === 'orderDate' && (
                        <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    style={{ padding: '1rem', cursor: 'pointer' }}
                    onClick={() => requestSort('shipDate')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <span>Ship Date</span>
                      {sortConfig?.key === 'shipDate' && (
                        <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    style={{ padding: '1rem', cursor: 'pointer' }}
                    onClick={() => requestSort('customer')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <span>Customer</span>
                      {sortConfig?.key === 'customer' && (
                        <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    style={{ padding: '1rem', cursor: 'pointer' }}
                    onClick={() => requestSort('totalQuantity')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <span>Total Qty</span>
                      {sortConfig?.key === 'totalQuantity' && (
                        <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    style={{ padding: '1rem', cursor: 'pointer' }}
                    onClick={() => requestSort('status')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <span>Status</span>
                      {sortConfig?.key === 'status' && (
                        <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <React.Fragment key={order.orderNumber}>
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ backgroundColor: 'rgba(30, 30, 40, 0.8)' }}
                      onClick={() => toggleOrderExpansion(order.orderNumber)}
                      style={{ 
                        backgroundColor: expandedOrders.includes(order.orderNumber) 
                          ? viewMode === 'markit' 
                            ? 'rgba(0, 200, 83, 0.1)' 
                            : 'rgba(255, 215, 0, 0.1)' 
                          : index % 2 === 0 ? 'transparent' : 'rgba(30, 30, 40, 0.3)',
                        borderBottom: expandedOrders.includes(order.orderNumber)
                          ? 'none'
                          : '1px solid rgba(255, 255, 255, 0.05)',
                        cursor: 'pointer',
                      }}
                    >
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                          <span style={{
                            fontSize: '0.875rem',
                            transform: expandedOrders.includes(order.orderNumber) ? 'rotate(90deg)' : 'rotate(0)',
                            transition: 'transform 0.2s ease'
                          }}>▶</span>
                          {order.orderNumber}
                        </div>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>{new Date(order.orderDate).toLocaleDateString()}</td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>{new Date(order.shipDate).toLocaleDateString()}</td>
                      <td style={{ 
                        padding: '0.5rem 1rem',
                        textAlign: 'center',
                      }}>
                        <span 
                          onClick={(e) => {
                            e.stopPropagation();
                            openBrandGuidelines(order.customer);
                          }}
                          style={{
                            cursor: 'pointer',
                            color: 'rgba(255, 215, 0, 0.9)',
                            textDecoration: 'dotted underline',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            transition: 'all 0.2s ease',
                            display: 'inline-block',
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 215, 0, 0.1)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          {order.customer}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>{order.totalQuantity}</td>
                      <td style={{ padding: '1rem', textAlign: 'center', position: 'relative' }}>
                        <span 
                          style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '1rem',
                            fontSize: '0.875rem',
                            backgroundColor: 
                              order.status === 'In Production' ? 'rgba(255, 180, 0, 0.15)' : 
                              order.status === 'Received' ? 'rgba(0, 180, 220, 0.15)' :
                              'rgba(0, 200, 83, 0.15)',
                            color: 
                              order.status === 'In Production' ? 'rgba(255, 180, 0, 1)' : 
                              order.status === 'Received' ? 'rgba(0, 180, 220, 1)' :
                              'rgba(0, 200, 83, 1)',
                            cursor: order.status === 'Shipped' ? 'pointer' : 'default',
                            position: 'relative',
                          }}
                          onMouseEnter={() => {
                            if (order.status === 'Shipped') {
                              setHoveredOrder(order.orderNumber);
                            }
                          }}
                          onMouseLeave={() => {
                            setHoveredOrder(null);
                          }}
                        >
                          {order.status}
                        </span>
                        
                        {/* Shipping Info Popup */}
                        {hoveredOrder === order.orderNumber && order.status === 'Shipped' && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            style={{
                              position: 'absolute',
                              top: '-120px',
                              left: '-180px',
                              backgroundColor: 'rgba(20, 20, 30, 0.95)',
                              backdropFilter: 'blur(10px)',
                              borderRadius: '0.5rem',
                              padding: '1rem',
                              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
                              border: '1px solid rgba(255, 215, 0, 0.5)',
                              zIndex: 100,
                              width: '280px',
                              textAlign: 'left',
                            }}
                            onMouseEnter={() => setHoveredOrder(order.orderNumber)}
                            onMouseLeave={() => setHoveredOrder(null)}
                          >
                            {(() => {
                              const shippingInfo = getShippingInfo(order.orderNumber);
                              if (!shippingInfo) return <p>No shipping information available</p>;
                              
                              return (
                                <>
                                  <h4 style={{ 
                                    fontSize: '0.9rem', 
                                    fontWeight: 'bold', 
                                    color: 'rgba(255, 215, 0, 0.9)',
                                    marginBottom: '0.75rem',
                                    borderBottom: '1px solid rgba(255, 215, 0, 0.3)',
                                    paddingBottom: '0.5rem'
                                  }}>
                                    Shipping Details
                                  </h4>
                                  
                                  <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                                    <div style={{ marginBottom: '0.5rem' }}>
                                      <span style={{ color: 'rgba(255, 255, 255, 0.6)', display: 'block', marginBottom: '0.25rem' }}>Ship To:</span>
                                      <p style={{ margin: 0 }}>
                                        {shippingInfo.address}<br/>
                                        {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
                                      </p>
                                    </div>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                      <div>
                                        <span style={{ color: 'rgba(255, 255, 255, 0.6)', display: 'block', marginBottom: '0.25rem' }}>Method:</span>
                                        <span style={{ 
                                          padding: '0.15rem 0.4rem',
                                          borderRadius: '0.25rem',
                                          fontSize: '0.75rem',
                                          backgroundColor: 
                                            shippingInfo.method === 'Express' ? 'rgba(255, 180, 0, 0.15)' : 
                                            shippingInfo.method === '2-Day' ? 'rgba(0, 180, 220, 0.15)' :
                                            'rgba(255, 255, 255, 0.1)',
                                          color: 
                                            shippingInfo.method === 'Express' ? 'rgba(255, 180, 0, 1)' : 
                                            shippingInfo.method === '2-Day' ? 'rgba(0, 180, 220, 1)' :
                                            'rgba(255, 255, 255, 0.9)',
                                        }}>
                                          {shippingInfo.method}
                                        </span>
                                      </div>
                                      <div>
                                        <span style={{ color: 'rgba(255, 255, 255, 0.6)', display: 'block', marginBottom: '0.25rem' }}>Est. Delivery:</span>
                                        <p style={{ margin: 0 }}>{new Date(shippingInfo.estimatedDelivery).toLocaleDateString()}</p>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <span style={{ color: 'rgba(255, 255, 255, 0.6)', display: 'block', marginBottom: '0.25rem' }}>Tracking #:</span>
                                      <motion.p 
                                        whileHover={{ 
                                          color: 'rgba(255, 215, 0, 1)',
                                          textShadow: '0 0 5px rgba(255, 215, 0, 0.3)'
                                        }}
                                        style={{ 
                                          margin: 0, 
                                          color: 'rgba(255, 215, 0, 0.9)', 
                                          textDecoration: 'underline',
                                          cursor: 'copy',
                                          display: 'inline-block'
                                        }}
                                        title="Click to copy tracking number"
                                        onClick={() => {
                                          navigator.clipboard.writeText(shippingInfo.tracking)
                                            .then(() => {
                                              // Could add a toast notification here
                                              console.log('Tracking number copied');
                                            })
                                            .catch(err => {
                                              console.error('Failed to copy: ', err);
                                            });
                                        }}
                                      >
                                        {shippingInfo.tracking}
                                      </motion.p>
                                    </div>
                                  </div>
                                </>
                              );
                            })()}
                          </motion.div>
                        )}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <motion.button
                            whileHover={{ 
                              scale: 1.1, 
                              color: 'rgba(255, 215, 0, 1)',
                              boxShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
                            }}
                            whileTap={{ scale: 0.9 }}
                            title="Edit Order"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'rgba(255, 215, 0, 0.15)',
                              border: '1px solid rgba(255, 215, 0, 0.5)',
                              color: 'rgba(255, 215, 0, 0.7)',
                              cursor: 'pointer',
                              fontSize: '0.875rem'
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </motion.button>
                          <motion.button
                            whileHover={{ 
                              scale: 1.1, 
                              color: 'rgba(255, 215, 0, 1)',
                              boxShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
                            }}
                            whileTap={{ scale: 0.9 }}
                            title="View Details"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'rgba(255, 215, 0, 0.15)',
                              border: '1px solid rgba(255, 215, 0, 0.5)',
                              color: 'rgba(255, 215, 0, 0.7)',
                              cursor: 'pointer',
                              fontSize: '0.875rem'
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </motion.button>
                          <motion.button
                            whileHover={{ 
                              scale: 1.1, 
                              color: 'rgba(255, 215, 0, 1)',
                              boxShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
                            }}
                            whileTap={{ scale: 0.9 }}
                            title="Notes"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'rgba(255, 215, 0, 0.15)',
                              border: '1px solid rgba(255, 215, 0, 0.5)',
                              color: 'rgba(255, 215, 0, 0.7)',
                              cursor: 'pointer',
                              fontSize: '0.875rem'
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                    
                    {/* Expanded Order Details */}
                    {expandedOrders.includes(order.orderNumber) && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{
                          backgroundColor: viewMode === 'markit' 
                            ? 'rgba(0, 200, 83, 0.05)'
                            : 'rgba(255, 215, 0, 0.05)',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                        }}
                      >
                        <td colSpan={7} style={{ padding: '0' }}>
                          <div style={{ padding: '1rem' }}>
                            <div style={{ marginBottom: '1rem' }}>
                              <h4 style={{ 
                                marginBottom: '0.5rem', 
                                color: viewMode === 'markit' ? 'rgba(0, 200, 83, 0.9)' : 'rgba(255, 215, 0, 0.9)'
                              }}>
                                Line Items
                              </h4>
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                              <thead>
                                <tr style={{ backgroundColor: 'rgba(30, 30, 40, 0.5)', textAlign: 'center' }}>
                                  <th style={{ padding: '0.75rem', fontSize: '0.875rem' }}>SKU</th>
                                  <th style={{ padding: '0.75rem', fontSize: '0.875rem' }}>Color</th>
                                  <th style={{ padding: '0.75rem', fontSize: '0.875rem' }}>Size</th>
                                  <th style={{ padding: '0.75rem', fontSize: '0.875rem' }}>Quantity</th>
                                  <th style={{ padding: '0.75rem', fontSize: '0.875rem' }}>Decoration</th>
                                  <th style={{ padding: '0.75rem', fontSize: '0.875rem' }}>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.lineItems
                                  .filter(item => viewMode === 'hoopitup' ? item.vendor === 'Hoop It Up' : item.vendor === 'Markit')
                                  .map((item, itemIndex) => (
                                  <motion.tr
                                    key={item.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: itemIndex * 0.05 }}
                                    style={{ 
                                      backgroundColor: itemIndex % 2 === 0 ? 'rgba(20, 20, 30, 0.3)' : 'rgba(30, 30, 40, 0.3)',
                                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                                    }}
                                  >
                                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', textAlign: 'center' }}>{item.sku}</td>
                                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', textAlign: 'center' }}>{item.color}</td>
                                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', textAlign: 'center' }}>{item.size}</td>
                                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', textAlign: 'center' }}>{item.quantity}</td>
                                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', textAlign: 'center' }}>{item.decoration}</td>
                                    <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>
                                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                        <motion.button
                                          whileHover={{ 
                                            scale: 1.1, 
                                            color: 'rgba(255, 215, 0, 1)',
                                            boxShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
                                          }}
                                          whileTap={{ scale: 0.9 }}
                                          title="Edit Item"
                                          onClick={(e) => e.stopPropagation()}
                                          style={{
                                            width: '28px',
                                            height: '28px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: 'rgba(255, 215, 0, 0.15)',
                                            border: '1px solid rgba(255, 215, 0, 0.5)',
                                            color: 'rgba(255, 215, 0, 0.7)',
                                            cursor: 'pointer',
                                            fontSize: '0.75rem'
                                          }}
                                        >
                                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                          </svg>
                                        </motion.button>
                                        <motion.button
                                          whileHover={{ 
                                            scale: 1.1, 
                                            color: 'rgba(255, 80, 80, 1)',
                                            boxShadow: '0 0 10px rgba(255, 80, 80, 0.3)'
                                          }}
                                          whileTap={{ scale: 0.9 }}
                                          title="Delete"
                                          onClick={(e) => e.stopPropagation()}
                                          style={{
                                            width: '28px',
                                            height: '28px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: 'rgba(255, 80, 80, 0.15)',
                                            border: '1px solid rgba(255, 80, 80, 0.5)',
                                            color: 'rgba(255, 80, 80, 0.7)',
                                            cursor: 'pointer',
                                            fontSize: '0.75rem'
                                          }}
                                        >
                                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                          </svg>
                                        </motion.button>
                                      </div>
                                    </td>
                                  </motion.tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination & Results Summary */}
          <div style={{ 
            padding: '1rem', 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
              Showing {filteredOrders.length} of {groupedOrders.filter(order => 
                order.lineItems.some(item => 
                  viewMode === 'hoopitup' ? item.vendor === 'Hoop It Up' : item.vendor === 'Markit'
                )
              ).length} orders
              {statusFilter !== 'All' ? ` (Status: ${getStatusDisplay(statusFilter)})` : ''}
              {customerFilter !== 'All Customers' ? ` (Customer: ${customerFilter})` : ''}
              {viewMode === 'hoopitup' ? ' (Vendor: Hoop It Up)' : ' (Vendor: Markit)'}
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <motion.button
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '0.5rem',
                  background: 'rgba(255, 215, 0, 0.15)',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  color: 'rgba(255, 215, 0, 0.9)',
                  cursor: 'pointer',
                }}
              >
                1
              </motion.button>
              <motion.button
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '0.5rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                2
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Analytics Modal */}
      <AnimatePresence>
        {showAnalytics && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(5px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              overflowY: 'auto',
              padding: '2rem 0',
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: 'rgba(20, 20, 30, 0.95)',
                borderRadius: '1rem',
                width: '90%',
                maxWidth: '1200px',
                padding: '2rem',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                maxHeight: '90vh',
                overflowY: 'auto',
                color: 'rgba(255, 215, 0, 0.9)',
              }}
            >
              {/* Header */}
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '2rem',
              }}>
                <div>
                  <h2 style={{ 
                    fontSize: '1.75rem', 
                    marginBottom: '0.5rem',
                    fontFamily: "'Rajdhani', sans-serif",
                    background: 'linear-gradient(to right, #FFD700, #FFA500)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    Apparel Orders Analytics
                  </h2>
                  <p style={{ 
                    color: 'rgba(255, 255, 255, 0.7)', 
                    fontSize: '0.875rem',
                    marginBottom: '0.5rem',
                  }}>
                    Insights and data on order patterns, vendor distribution, and decoration types
                  </p>
                </div>
                
                {/* Close button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeAnalytics}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255, 215, 0, 0.15)',
                    border: '1px solid rgba(255, 215, 0, 0.5)',
                    color: 'rgba(255, 215, 0, 0.7)',
                    cursor: 'pointer',
                    fontSize: '1rem',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.button>
              </div>
              
              {/* KPI Cards */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '1.5rem',
                marginBottom: '2.5rem' 
              }}>
                {/* Total Orders */}
                <motion.div
                  whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: 'rgba(30, 30, 40, 0.6)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    border: '1px solid rgba(255, 215, 0, 0.2)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <h3 style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem' }}>
                    Total Orders
                  </h3>
                  <p style={{ 
                    fontSize: '1.75rem', 
                    fontWeight: 'bold',
                    fontFamily: "'Rajdhani', sans-serif",
                  }}>
                    {totalOrders.toLocaleString()}
                  </p>
                </motion.div>

                {/* Total Quantity */}
                <motion.div
                  whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  style={{
                    background: 'rgba(30, 30, 40, 0.6)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    border: '1px solid rgba(255, 215, 0, 0.2)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <h3 style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem' }}>
                    Total Quantity
                  </h3>
                  <p style={{ 
                    fontSize: '1.75rem', 
                    fontWeight: 'bold',
                    fontFamily: "'Rajdhani', sans-serif",
                  }}>
                    {totalItems.toLocaleString()}
                  </p>
                </motion.div>

                {/* Vendor Balance */}
                <motion.div
                  whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  style={{
                    background: 'rgba(30, 30, 40, 0.6)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    border: '1px solid rgba(255, 215, 0, 0.2)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <h3 style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem' }}>
                    Vendor Balance
                  </h3>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginTop: '0.25rem',
                  }}>
                    <span style={{ 
                      color: 'rgba(255, 215, 0, 0.9)',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                    }}>
                      Hoop It Up: {apparelData.filter(item => item.vendor === 'Hoop It Up').length}
                    </span>
                    <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '1rem' }}>|</span>
                    <span style={{ 
                      color: 'rgba(0, 200, 83, 0.9)',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                    }}>
                      Markit: {apparelData.filter(item => item.vendor === 'Markit').length}
                    </span>
                  </div>
                </motion.div>

                {/* Unique Customers */}
                <motion.div
                  whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  style={{
                    background: 'rgba(30, 30, 40, 0.6)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    border: '1px solid rgba(255, 215, 0, 0.2)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <h3 style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem' }}>
                    Unique Customers
                  </h3>
                  <p style={{ 
                    fontSize: '1.75rem', 
                    fontWeight: 'bold',
                    fontFamily: "'Rajdhani', sans-serif",
                  }}>
                    {uniqueCustomers}
                  </p>
                </motion.div>
              </div>
              
              {/* Controls and Charts */}
              <div>
                {/* Chart controls */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {/* Date range selector */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>Time Period:</span>
                      <div style={{ display: 'flex', background: 'rgba(30, 30, 40, 0.6)', borderRadius: '0.5rem', overflow: 'hidden' }}>
                        {['week', 'month', 'year'].map(range => (
                          <button
                            key={range}
                            onClick={() => setSelectedDateRange(range)}
                            style={{
                              padding: '0.5rem 0.75rem',
                              border: 'none',
                              background: selectedDateRange === range ? 'rgba(255, 215, 0, 0.2)' : 'transparent',
                              color: selectedDateRange === range ? 'rgba(255, 215, 0, 0.9)' : 'rgba(255, 255, 255, 0.7)',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              fontWeight: selectedDateRange === range ? 'bold' : 'normal',
                              textTransform: 'capitalize',
                            }}
                          >
                            {range}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Metric selector */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>Metric:</span>
                      <div style={{ display: 'flex', background: 'rgba(30, 30, 40, 0.6)', borderRadius: '0.5rem', overflow: 'hidden' }}>
                        {['orders', 'quantity', 'revenue'].map(metric => (
                          <button
                            key={metric}
                            onClick={() => setSelectedMetric(metric)}
                            style={{
                              padding: '0.5rem 0.75rem',
                              border: 'none',
                              background: selectedMetric === metric ? 'rgba(255, 215, 0, 0.2)' : 'transparent',
                              color: selectedMetric === metric ? 'rgba(255, 215, 0, 0.9)' : 'rgba(255, 255, 255, 0.7)',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              fontWeight: selectedMetric === metric ? 'bold' : 'normal',
                              textTransform: 'capitalize',
                            }}
                          >
                            {metric}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Info text */}
                  <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.5)', fontStyle: 'italic' }}>
                    Comparing Hoop It Up vs Markit performance
                  </div>
                </div>
                
                {/* Line Chart */}
                <div style={{
                  background: 'rgba(25, 25, 35, 0.5)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  marginBottom: '2rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  height: '350px',
                }}>
                  <Line 
                    data={generateTimeSeriesData(selectedDateRange, selectedMetric)}
                    options={chartOptions}
                  />
                </div>
                
                {/* Pie Charts Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '2rem',
                  marginBottom: '2rem'
                }}>
                  {/* Vendor Distribution */}
                  <div style={{
                    background: 'rgba(25, 25, 35, 0.5)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    height: '300px',
                  }}>
                    <h3 style={{ 
                      fontSize: '1rem', 
                      marginBottom: '1rem', 
                      color: 'rgba(255, 255, 255, 0.9)',
                      textAlign: 'center',
                    }}>
                      Vendor Distribution (Items)
                    </h3>
                    <Pie 
                      data={generateVendorDistributionData()}
                      options={pieChartOptions}
                    />
                  </div>
                  
                  {/* Decoration Type Distribution */}
                  <div style={{
                    background: 'rgba(25, 25, 35, 0.5)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    height: '300px',
                  }}>
                    <h3 style={{ 
                      fontSize: '1rem', 
                      marginBottom: '1rem', 
                      color: 'rgba(255, 255, 255, 0.9)',
                      textAlign: 'center',
                    }}>
                      Decoration Method (Items)
                    </h3>
                    <Pie 
                      data={generateDecorationDistributionData()}
                      options={pieChartOptions}
                    />
                  </div>
                </div>
                
                {/* Insights Section */}
                <div style={{
                  background: 'rgba(30, 30, 40, 0.6)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  border: '1px solid rgba(255, 215, 0, 0.2)',
                  marginBottom: '1rem',
                }}>
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    marginBottom: '1rem', 
                    color: 'rgba(255, 215, 0, 0.9)',
                    fontFamily: "'Rajdhani', sans-serif",
                  }}>
                    Key Insights
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '1.5rem',
                  }}>
                    <div>
                      <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                        Vendor Performance
                      </h4>
                      <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.5' }}>
                        Markit is handling {Math.round(apparelData.filter(item => item.vendor === 'Markit').length / apparelData.length * 100)}% of apparel items,
                        while Hoop It Up is responsible for {Math.round(apparelData.filter(item => item.vendor === 'Hoop It Up').length / apparelData.length * 100)}%. 
                        Markit produces higher volume of items per order, averaging {Math.round(apparelData.filter(item => item.vendor === 'Markit').reduce((sum, item) => sum + item.quantity, 0) / apparelData.filter(item => item.vendor === 'Markit').length)} 
                        items per order.
                      </p>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                        Decoration Trends
                      </h4>
                      <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.5' }}>
                        Screen printing accounts for {Math.round(apparelData.filter(item => item.decoration === 'Screen Print').reduce((sum, item) => sum + item.quantity, 0) / totalItems * 100)}% of 
                        total item volume, with embroidery at {Math.round(apparelData.filter(item => item.decoration === 'Embroidery').reduce((sum, item) => sum + item.quantity, 0) / totalItems * 100)}%. 
                        Screen printing is the preferred method for higher volume orders, while embroidery is chosen for premium items.
                      </p>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                        Order Patterns
                      </h4>
                      <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.5' }}>
                        The average order contains {Math.round(totalItems / totalOrders)} items. 
                        Monthly orders show a {selectedDateRange === 'year' ? 'stronger seasonal pattern' : 'consistent distribution'} with 
                        {selectedDateRange === 'year' ? ' peaks in summer and winter months.' : ' regular weekly patterns.'}
                        There are currently {pendingShipments} orders pending shipment.
                      </p>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                        Recommendations
                      </h4>
                      <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.5' }}>
                        Consider rebalancing vendor workload to optimize for delivery speed. 
                        There's an opportunity to consolidate orders for the same customer to reduce shipping costs.
                        {pendingShipments > 3 ? ' Prioritize pending shipments to avoid delays.' : ' Current shipment schedule is on track.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Brand Guidelines Modal */}
      <AnimatePresence>
        {showBrandGuidelines && selectedCustomerGuidelines && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(5px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              overflowY: 'auto',
              padding: '2rem 0',
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: 'rgba(20, 20, 30, 0.95)',
                borderRadius: '1rem',
                width: '90%',
                maxWidth: '1200px',
                padding: '2rem',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                maxHeight: '90vh',
                overflowY: 'auto',
                color: 'white',
              }}
            >
              {/* Header */}
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '2rem',
              }}>
                <div>
                  <h2 style={{ 
                    fontSize: '1.75rem', 
                    marginBottom: '0.5rem',
                    fontFamily: "'Rajdhani', sans-serif",
                    background: 'linear-gradient(to right, #FFD700, #FFA500)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    {selectedCustomerGuidelines} Brand Guidelines
                  </h2>
                  <p style={{ 
                    color: 'rgba(255, 255, 255, 0.7)', 
                    fontSize: '0.875rem',
                    marginBottom: '0.5rem',
                  }}>
                    Decoration requirements, logo specifications, and color standards
                  </p>
                </div>
                
                {/* Close button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeBrandGuidelines}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255, 215, 0, 0.15)',
                    border: '1px solid rgba(255, 215, 0, 0.5)',
                    color: 'rgba(255, 215, 0, 0.7)',
                    cursor: 'pointer',
                    fontSize: '1rem',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.button>
              </div>
              
              {/* Brand Guidelines Content */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                gap: '2rem',
                marginBottom: '2rem',
              }}>
                {/* Logo Assets */}
                <div style={{
                  background: 'rgba(30, 30, 40, 0.6)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}>
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    marginBottom: '1.5rem', 
                    color: 'rgba(255, 215, 0, 0.9)',
                    borderBottom: '1px solid rgba(255, 215, 0, 0.3)',
                    paddingBottom: '0.5rem'
                  }}>
                    Logo Assets
                  </h3>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{
                      background: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '0.5rem',
                      padding: '1.5rem',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: '1rem',
                      border: '1px dashed rgba(255, 255, 255, 0.2)',
                      height: '150px',
                    }}>
                      {/* Placeholder for Customer Logo */}
                      <div style={{
                        background: 'rgba(255, 215, 0, 0.2)',
                        width: '200px',
                        height: '80px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem',
                        color: 'rgba(255, 215, 0, 0.9)',
                        borderRadius: '0.5rem',
                      }}>
                        {selectedCustomerGuidelines} Logo
                      </div>
                    </div>
                    
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                      gap: '1rem',
                    }}>
                      {['Primary Logo.ai', 'Logo White.eps', 'Icon Only.dst', 'Wordmark.eps'].map((file, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ 
                            scale: 1.05, 
                            backgroundColor: 'rgba(255, 215, 0, 0.15)',
                            borderColor: 'rgba(255, 215, 0, 0.5)'
                          }}
                          style={{
                            padding: '0.75rem',
                            background: 'rgba(30, 30, 40, 0.6)',
                            borderRadius: '0.5rem',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                          }}
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="rgba(255, 215, 0, 0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M14 2V8H20" stroke="rgba(255, 215, 0, 0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 18V12" stroke="rgba(255, 215, 0, 0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M9 15L12 18L15 15" stroke="rgba(255, 215, 0, 0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span style={{ fontSize: '0.75rem' }}>{file}</span>
                          <span style={{ fontSize: '0.7rem', color: 'rgba(255, 215, 0, 0.7)' }}>Download</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Color Specifications */}
                <div style={{
                  background: 'rgba(30, 30, 40, 0.6)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}>
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    marginBottom: '1.5rem', 
                    color: 'rgba(255, 215, 0, 0.9)',
                    borderBottom: '1px solid rgba(255, 215, 0, 0.3)',
                    paddingBottom: '0.5rem'
                  }}>
                    Color Specifications
                  </h3>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                      Primary Colors
                    </h4>
                    
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                      gap: '1rem',
                      marginBottom: '1.5rem',
                    }}>
                      {[
                        { color: '#1A237E', name: 'Navy Blue', pms: 'PMS 281 C' },
                        { color: '#D32F2F', name: 'Red', pms: 'PMS 186 C' },
                        { color: '#FFFFFF', name: 'White', pms: 'White' }
                      ].map((colorItem, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}>
                          <div style={{
                            width: '60px',
                            height: '60px',
                            backgroundColor: colorItem.color,
                            borderRadius: '0.5rem',
                            marginBottom: '0.5rem',
                            border: colorItem.color === '#FFFFFF' ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
                          }}></div>
                          <span style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>{colorItem.name}</span>
                          <span style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.6)' }}>{colorItem.pms}</span>
                          <span style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.6)' }}>{colorItem.color}</span>
                        </div>
                      ))}
                    </div>
                    
                    <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                      Thread Colors
                    </h4>
                    
                    <div style={{
                      background: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '0.5rem',
                      padding: '1rem',
                      fontSize: '0.875rem',
                      marginBottom: '1rem',
                    }}>
                      <div style={{ marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 'bold', color: 'rgba(255, 215, 0, 0.9)' }}>Dark Garments:</span>
                        <ul style={{ margin: '0.5rem 0 0 1.5rem', padding: 0, color: 'rgba(255, 255, 255, 0.8)' }}>
                          <li>Madeira 1841 (White)</li>
                          <li>Madeira 1839 (Navy)</li>
                          <li>Madeira 1147 (Red)</li>
                        </ul>
                      </div>
                      <div>
                        <span style={{ fontWeight: 'bold', color: 'rgba(255, 215, 0, 0.9)' }}>Light Garments:</span>
                        <ul style={{ margin: '0.5rem 0 0 1.5rem', padding: 0, color: 'rgba(255, 255, 255, 0.8)' }}>
                          <li>Madeira 1776 (Navy)</li>
                          <li>Madeira 1039 (Red)</li>
                          <li>No white thread on light garments</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
              }}>
                {/* Decoration Guidelines */}
                <div style={{
                  background: 'rgba(30, 30, 40, 0.6)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}>
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    marginBottom: '1.5rem', 
                    color: 'rgba(255, 215, 0, 0.9)',
                    borderBottom: '1px solid rgba(255, 215, 0, 0.3)',
                    paddingBottom: '0.5rem'
                  }}>
                    Decoration Guidelines
                  </h3>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                      Logo Placement
                    </h4>
                    
                    <div style={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                      marginBottom: '1.5rem',
                    }}>
                      <div style={{
                        background: 'rgba(0, 0, 0, 0.2)',
                        borderRadius: '0.5rem',
                        padding: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                      }}>
                        <div style={{ 
                          minWidth: '80px', 
                          height: '80px', 
                          backgroundColor: 'rgba(255, 215, 0, 0.1)',
                          borderRadius: '0.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'rgba(255, 215, 0, 0.7)',
                          fontSize: '0.75rem',
                          textAlign: 'center',
                        }}>
                          Left Chest
                        </div>
                        <div>
                          <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                            <span style={{ fontWeight: 'bold', color: 'rgba(255, 215, 0, 0.9)' }}>Size:</span> 3.5" wide
                          </p>
                          <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', margin: '0.5rem 0 0 0' }}>
                            <span style={{ fontWeight: 'bold', color: 'rgba(255, 215, 0, 0.9)' }}>Position:</span> 7-8" down from shoulder seam, centered on left chest
                          </p>
                        </div>
                      </div>
                      
                      <div style={{
                        background: 'rgba(0, 0, 0, 0.2)',
                        borderRadius: '0.5rem',
                        padding: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                      }}>
                        <div style={{ 
                          minWidth: '80px', 
                          height: '80px', 
                          backgroundColor: 'rgba(255, 215, 0, 0.1)',
                          borderRadius: '0.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'rgba(255, 215, 0, 0.7)',
                          fontSize: '0.75rem',
                          textAlign: 'center',
                        }}>
                          Full Back
                        </div>
                        <div>
                          <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                            <span style={{ fontWeight: 'bold', color: 'rgba(255, 215, 0, 0.9)' }}>Size:</span> 10-11" wide
                          </p>
                          <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', margin: '0.5rem 0 0 0' }}>
                            <span style={{ fontWeight: 'bold', color: 'rgba(255, 215, 0, 0.9)' }}>Position:</span> 5-6" down from collar, centered
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                      Decoration Methods
                    </h4>
                    
                    <div style={{ 
                      background: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '0.5rem',
                      padding: '1rem',
                      fontSize: '0.875rem',
                      marginBottom: '1rem',
                    }}>
                      <p style={{ margin: '0 0 0.75rem 0', color: 'rgba(255, 255, 255, 0.8)' }}>
                        <span style={{ fontWeight: 'bold', color: 'rgba(255, 215, 0, 0.9)' }}>Embroidery:</span> 
                        Preferred for polo shirts, jackets, and caps. Use 60-weight thread for fine details.
                      </p>
                      <p style={{ margin: '0 0 0.75rem 0', color: 'rgba(255, 255, 255, 0.8)' }}>
                        <span style={{ fontWeight: 'bold', color: 'rgba(255, 215, 0, 0.9)' }}>Screen Printing:</span> 
                        Preferred for t-shirts and sweatshirts. Use simulated process for full-color images.
                      </p>
                      <p style={{ margin: '0', color: 'rgba(255, 255, 255, 0.8)' }}>
                        <span style={{ fontWeight: 'bold', color: 'rgba(255, 215, 0, 0.9)' }}>Heat Transfer:</span> 
                        Not approved for standard use. Contact brand manager for exceptions.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Do's and Don'ts */}
                <div style={{
                  background: 'rgba(30, 30, 40, 0.6)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}>
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    marginBottom: '1.5rem', 
                    color: 'rgba(255, 215, 0, 0.9)',
                    borderBottom: '1px solid rgba(255, 215, 0, 0.3)',
                    paddingBottom: '0.5rem'
                  }}>
                    Do's and Don'ts
                  </h3>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1.5rem',
                    marginBottom: '1.5rem',
                  }}>
                    {/* Do's */}
                    <div>
                      <h4 style={{ 
                        fontSize: '1rem', 
                        marginBottom: '1rem', 
                        color: 'rgba(75, 210, 143, 0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}>
                        <span style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(75, 210, 143, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17L4 12" stroke="rgba(75, 210, 143, 0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                        Do's
                      </h4>
                      
                      <ul style={{ 
                        margin: 0, 
                        padding: '0 0 0 1rem', 
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '0.875rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                      }}>
                        <li>Use only approved colors and thread colors</li>
                        <li>Maintain minimum clear space around the logo</li>
                        <li>Use PNG or AI versions for screen printing</li>
                        <li>Use vector EPS for printing materials</li>
                        <li>Use only approved DST files for embroidery</li>
                        <li>Ensure logo is legible at all sizes</li>
                      </ul>
                    </div>
                    
                    {/* Don'ts */}
                    <div>
                      <h4 style={{ 
                        fontSize: '1rem', 
                        marginBottom: '1rem', 
                        color: 'rgba(255, 99, 132, 0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}>
                        <span style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(255, 99, 132, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18" stroke="rgba(255, 99, 132, 0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M6 6L18 18" stroke="rgba(255, 99, 132, 0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                        Don'ts
                      </h4>
                      
                      <ul style={{ 
                        margin: 0, 
                        padding: '0 0 0 1rem', 
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '0.875rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                      }}>
                        <li>Don't alter the logo proportions or stretch it</li>
                        <li>Don't change the logo colors</li>
                        <li>Don't add effects like shadows or glows</li>
                        <li>Don't place logo on busy backgrounds</li>
                        <li>Don't use outdated versions of the logo</li>
                        <li>Don't use logo smaller than minimum size (2" wide)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Footer with contact information */}
              <div style={{
                marginTop: '2rem',
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                color: 'rgba(255, 255, 255, 0.7)',
                textAlign: 'center',
              }}>
                <p style={{ margin: 0 }}>
                  For questions about these guidelines, contact the {selectedCustomerGuidelines} Brand Team at{' '}
                  <span style={{ color: 'rgba(255, 215, 0, 0.9)' }}>brand@{selectedCustomerGuidelines.toLowerCase().replace(/\s+/g, '')}.com</span> or call <span style={{ color: 'rgba(255, 215, 0, 0.9)' }}>555-123-4567</span>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Apparel; 