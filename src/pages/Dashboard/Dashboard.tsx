import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// KPI Card Component
interface KPICardProps {
  title: string;
  value: string;
  change?: string;
  changePositive?: boolean;
  icon: React.ReactNode;
  onClick?: () => void;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, change, changePositive, icon, onClick }) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255, 215, 0, 0.3)',
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        background: 'rgba(20, 20, 30, 0.6)',
        backdropFilter: 'blur(10px)',
        borderRadius: '1rem',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        cursor: onClick ? 'pointer' : 'default',
        height: '100%',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.7)' }}>{title}</h3>
        <motion.div
          whileHover={{ 
            scale: 1.1,
            backgroundColor: 'rgba(255, 215, 0, 0.2)',
            boxShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
          }}
          style={{
              display: 'flex',
              alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '0.5rem',
            backgroundColor: 'rgba(30, 30, 40, 0.6)',
            color: 'rgba(255, 215, 0, 0.9)',
            transition: 'all 0.2s ease',
          }}
        >
          {icon}
        </motion.div>
      </div>
      <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{value}</h2>
      {change && (
        <div style={{ 
            display: 'flex',
            alignItems: 'center',
          color: changePositive ? 'rgba(75, 210, 143, 0.9)' : 'rgba(255, 99, 132, 0.9)',
          fontSize: '0.875rem',
        }}>
          {changePositive ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 20V4M12 4L5 11M12 4L19 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4V20M12 20L5 13M12 20L19 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          <span style={{ marginLeft: '0.25rem' }}>{change}</span>
      </div>
      )}
    </motion.div>
  );
};

// Notification Item Component
interface NotificationItemProps {
  title: string;
  message: string;
  time: string;
  isNew?: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ title, message, time, isNew }) => {
  return (
    <div style={{ 
      padding: '1rem 1.5rem', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      background: isNew ? 'rgba(255, 215, 0, 0.05)' : 'transparent',
        cursor: 'pointer',
      transition: 'background 0.2s ease',
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        marginBottom: '0.25rem' 
      }}>
        <h4 style={{ 
        fontSize: '0.875rem', 
          fontWeight: isNew ? 'bold' : 'normal',
          color: isNew ? 'rgba(255, 215, 0, 0.9)' : 'white',
        }}>
          {title}
        </h4>
        <span style={{ 
        fontSize: '0.75rem', 
          color: 'rgba(255, 255, 255, 0.6)' 
      }}>
        {time}
        </span>
      </div>
      <p style={{ 
        fontSize: '0.8125rem', 
        color: 'rgba(255, 255, 255, 0.7)',
        margin: 0,
        lineHeight: 1.5
      }}>
        {message}
      </p>
    </div>
  );
};

const Dashboard: React.FC = () => {
  // State for analytics modal
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyticsType, setAnalyticsType] = useState<'revenue' | 'agedAr' | 'inventory' | 'orders' | 'gpm'>('revenue');
  const [selectedDateRange, setSelectedDateRange] = useState<'week' | 'month' | 'year'>('month');
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'profit' | 'orders' | 'overview'>('revenue');
  
  // State for inventory analytics
  const [inventoryView, setInventoryView] = useState<'value' | 'units'>('value');
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventorySortBy, setInventorySortBy] = useState<'sku' | 'name' | 'inventory' | 'unitValue' | 'totalValue' | 'palletCount'>('totalValue');
  const [inventorySortDesc, setInventorySortDesc] = useState(true);
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('month');
  
  // State for reminder notification modal
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderCustomer, setReminderCustomer] = useState('');
  const [reminderOrderId, setReminderOrderId] = useState('');
  const [reminderType, setReminderType] = useState<'nice' | 'threatening'>('nice');
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  
  // State for GPM analytics
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [showCustomerGPMChart, setShowCustomerGPMChart] = useState(false);
  
  // State for map
  const [tooltipContent, setTooltipContent] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  
  // Function to open analytics modal
  const openAnalytics = (type: 'revenue' | 'agedAr' | 'inventory' | 'orders' | 'gpm') => {
    setAnalyticsType(type);
    setShowAnalytics(true);
  };
  
  // Function to close analytics modal
  const closeAnalytics = () => {
    setShowAnalytics(false);
  };
  
  // Function to open reminder modal
  const openReminderModal = (customer: string, orderId: string, type: 'nice' | 'threatening' = 'nice') => {
    setReminderCustomer(customer);
    setReminderOrderId(orderId);
    setReminderType(type);
    setShowReminderModal(true);
  };
  
  // Function to close reminder modal
  const closeReminderModal = () => {
    setShowReminderModal(false);
  };
  
  // Function to handle customer selection for GPM chart
  const handleCustomerSelect = (customer: string) => {
    setSelectedCustomer(customer);
    setShowCustomerGPMChart(true);
  };
  
  // Function to reset customer selection
  const resetCustomerSelection = () => {
    setSelectedCustomer(null);
    setShowCustomerGPMChart(false);
  };
  
  // Function to send reminder (would integrate with backend in a real app)
  const sendReminder = () => {
    // This would typically make an API call
    setTimeout(() => {
      setShowReminderModal(false);
      // Show success notification
      setNotificationMessage(
        reminderType === 'nice'
          ? `Friendly payment reminder sent to ${reminderCustomer} for order ${reminderOrderId}`
          : `Final payment notice sent to ${reminderCustomer} for order ${reminderOrderId}`
      );
      setShowSuccessNotification(true);
      
      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setShowSuccessNotification(false);
      }, 5000);
    }, 1000);
  };

  // Sample KPI data
  const kpiData = [
    {
      title: 'Total Revenue',
      value: '$428,920',
      change: '12.4% this month',
      changePositive: true,
      analyticsType: 'revenue' as const,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 21H3V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 9L13.5 16.5L9 12L3 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      title: 'Aged AR',
      value: '$85,210',
      change: '3.2% this month',
      changePositive: false,
      analyticsType: 'agedAr' as const,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      title: 'Inventory Value',
      value: '$356,420',
      change: '6.8% this month',
      changePositive: true,
      analyticsType: 'inventory' as const,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 8V21H3V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 4H21V8H3V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      title: 'GPM %',
      value: '35.2%',
      change: '2.5% this month',
      changePositive: true,
      analyticsType: 'gpm' as const,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 1V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

  // Sample notification data
  const notificationData = [
    {
      title: 'New Order Placed',
      message: 'Apex Corporation placed an order for Premium Hoodies (x120)',
      time: '2 hours ago',
      isNew: true
    },
    {
      title: 'Inventory Alert',
      message: 'Graphic T-Shirt (Black, M) is running low on stock (5 units remaining)',
      time: '4 hours ago',
      isNew: true
    },
    {
      title: 'Payment Received',
      message: 'Horizon Group cleared invoice #1042 for $24,540',
      time: '8 hours ago',
      isNew: false
    },
    {
      title: 'New Customer',
      message: 'Summit Enterprises registered as a new customer',
      time: 'Yesterday',
      isNew: false
    },
  ];

  // Sample data for revenue analytics
  const topProducts = [
    { name: 'Premium Hoodie', revenue: 124500 },
    { name: 'Graphic T-Shirt', revenue: 98700 },
    { name: 'Slim-fit Jeans', revenue: 78200 },
    { name: 'Canvas Backpack', revenue: 53400 },
    { name: 'Athletic Shoes', revenue: 42100 }
  ];

  const topCustomers = [
    { name: 'Apex Corp', revenue: 87600 },
    { name: 'Horizon Group', revenue: 65300 },
    { name: 'Summit Enterprises', revenue: 52800 },
    { name: 'Valley Retailers', revenue: 41700 },
    { name: 'Echo Distributors', revenue: 32500 }
  ];

  // Sample data for geographic sales distribution
  const salesByRegion = [
    { region: "Northeast", revenue: 145600, units: 4820, states: ["ME", "NH", "VT", "MA", "RI", "CT", "NY", "NJ", "PA"] },
    { region: "Southeast", revenue: 98400, units: 3210, states: ["DE", "MD", "VA", "WV", "KY", "NC", "SC", "TN", "GA", "FL", "AL", "MS", "AR", "LA"] },
    { region: "Midwest", revenue: 76300, units: 2540, states: ["OH", "MI", "IN", "WI", "IL", "MN", "IA", "MO", "ND", "SD", "NE", "KS"] },
    { region: "Southwest", revenue: 62100, units: 2080, states: ["OK", "TX", "NM", "AZ"] },
    { region: "West", revenue: 112400, units: 3750, states: ["CO", "WY", "MT", "ID", "WA", "OR", "UT", "NV", "CA", "AK", "HI"] }
  ];

  // Sales data by state (including intensity data for heat map)
  const salesByState = [
    { state: "NY", revenue: 42300, units: 1410, intensity: 0.9 },
    { state: "CA", revenue: 39600, units: 1320, intensity: 0.85 },
    { state: "TX", revenue: 36800, units: 1225, intensity: 0.8 },
    { state: "FL", revenue: 34200, units: 1140, intensity: 0.75 },
    { state: "IL", revenue: 28700, units: 955, intensity: 0.65 },
    { state: "PA", revenue: 26500, units: 885, intensity: 0.6 },
    { state: "OH", revenue: 24100, units: 805, intensity: 0.55 },
    { state: "GA", revenue: 23400, units: 780, intensity: 0.52 },
    { state: "NC", revenue: 22800, units: 760, intensity: 0.5 },
    { state: "MI", revenue: 21600, units: 720, intensity: 0.48 },
    { state: "NJ", revenue: 20100, units: 670, intensity: 0.45 },
    { state: "VA", revenue: 19500, units: 650, intensity: 0.43 },
    { state: "WA", revenue: 18900, units: 630, intensity: 0.41 },
    { state: "MA", revenue: 18300, units: 610, intensity: 0.4 },
    { state: "TN", revenue: 16500, units: 550, intensity: 0.36 },
    // Additional states with lower intensity
    { state: "AZ", revenue: 15900, units: 530, intensity: 0.35 },
    { state: "IN", revenue: 15300, units: 510, intensity: 0.34 },
    { state: "MO", revenue: 14700, units: 490, intensity: 0.32 },
    { state: "MD", revenue: 14100, units: 470, intensity: 0.31 },
    { state: "CO", revenue: 13500, units: 450, intensity: 0.3 },
    // Remaining states with low intensity
    { state: "WI", revenue: 12900, units: 430, intensity: 0.28 },
    { state: "MN", revenue: 12300, units: 410, intensity: 0.27 },
    { state: "SC", revenue: 11700, units: 390, intensity: 0.26 },
    { state: "AL", revenue: 11100, units: 370, intensity: 0.24 },
    { state: "LA", revenue: 10500, units: 350, intensity: 0.23 },
    { state: "KY", revenue: 9900, units: 330, intensity: 0.22 },
    { state: "OR", revenue: 9300, units: 310, intensity: 0.21 },
    { state: "OK", revenue: 8700, units: 290, intensity: 0.19 },
    { state: "CT", revenue: 8100, units: 270, intensity: 0.18 },
    { state: "IA", revenue: 7500, units: 250, intensity: 0.17 },
    { state: "MS", revenue: 6900, units: 230, intensity: 0.15 },
    { state: "AR", revenue: 6300, units: 210, intensity: 0.14 },
    { state: "KS", revenue: 5700, units: 190, intensity: 0.13 },
    { state: "NV", revenue: 5100, units: 170, intensity: 0.11 },
    { state: "UT", revenue: 4500, units: 150, intensity: 0.1 },
    { state: "NM", revenue: 3900, units: 130, intensity: 0.09 },
    { state: "WV", revenue: 3300, units: 110, intensity: 0.07 },
    { state: "NE", revenue: 2700, units: 90, intensity: 0.06 },
    { state: "ID", revenue: 2100, units: 70, intensity: 0.05 },
    { state: "HI", revenue: 1500, units: 50, intensity: 0.03 },
    { state: "NH", revenue: 1200, units: 40, intensity: 0.027 },
    { state: "ME", revenue: 900, units: 30, intensity: 0.02 },
    { state: "MT", revenue: 750, units: 25, intensity: 0.017 },
    { state: "RI", revenue: 600, units: 20, intensity: 0.013 },
    { state: "DE", revenue: 450, units: 15, intensity: 0.01 },
    { state: "SD", revenue: 375, units: 12.5, intensity: 0.008 },
    { state: "AK", revenue: 300, units: 10, intensity: 0.007 },
    { state: "ND", revenue: 225, units: 7.5, intensity: 0.005 },
    { state: "VT", revenue: 150, units: 5, intensity: 0.003 },
    { state: "WY", revenue: 75, units: 2.5, intensity: 0.002 },
  ];

  // Top states by sales (for markers on the map)
  const topStates = salesByState.slice(0, 5);

  // Sample data for GPM analytics
  const customerGPMData = [
    { name: 'Apex Corp', revenue: 87600, cost: 54912, profit: 32688, gpm: 37.3 },
    { name: 'Horizon Group', revenue: 65300, cost: 42445, profit: 22855, gpm: 35.0 },
    { name: 'Summit Enterprises', revenue: 52800, cost: 33792, profit: 19008, gpm: 36.0 },
    { name: 'Valley Retailers', revenue: 41700, cost: 27105, profit: 14595, gpm: 35.0 },
    { name: 'Echo Distributors', revenue: 32500, cost: 22100, profit: 10400, gpm: 32.0 },
    { name: 'Metro Apparel', revenue: 28900, cost: 17629, profit: 11271, gpm: 39.0 },
    { name: 'Northern Supply', revenue: 26400, cost: 17160, profit: 9240, gpm: 35.0 },
    { name: 'Coastal Brands', revenue: 22700, cost: 14755, profit: 7945, gpm: 35.0 },
    { name: 'Central Retail', revenue: 19800, cost: 12870, profit: 6930, gpm: 35.0 },
    { name: 'Urban Outfitters', revenue: 17900, cost: 10740, profit: 7160, gpm: 40.0 }
  ];

  // Historical GPM data for time series
  const historicalGPMData = {
    weekly: [34.1, 34.8, 35.2, 35.0, 34.6, 35.3, 35.2],
    monthly: Array.from({ length: 30 }, (_, i) => {
      // Create a realistic trend with small variations
      const baseGPM = 35.0;
      const dayEffect = Math.sin(i * 0.2) * 1.2; // Slight wave pattern
      return baseGPM + dayEffect;
    }),
    yearly: [33.5, 33.8, 34.2, 34.5, 34.8, 35.0, 35.2, 35.5, 35.4, 35.3, 35.1, 35.2]
  };

  // Function to generate time series data for analytics
  const generateTimeSeriesData = (dateRange: 'week' | 'month' | 'year', metric: 'revenue' | 'profit' | 'orders' | 'overview') => {
    let labels: string[] = [];
    
    switch(dateRange) {
      case 'week':
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        break;
      case 'month':
        labels = Array.from({ length: 30 }, (_, i) => `${i + 1}`);
        break;
      case 'year':
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        break;
    }

    // Generate random data based on metric
    const generateData = () => {
      return labels.map(() => Math.floor(Math.random() * 50000) + 10000);
    };

    return {
      labels,
      datasets: [
        {
          label: metric === 'revenue' ? 'Revenue' : 
                 metric === 'profit' ? 'Profit' : 
                 metric === 'orders' ? 'Order Count' : 'Overview',
          data: generateData(),
          borderColor: 'rgba(255, 215, 0, 0.8)',
          backgroundColor: 'rgba(255, 215, 0, 0.2)',
          tension: 0.3,
          fill: true
        }
      ]
    };
  };

  // Function to generate GPM time series data
  const generateGPMData = (dateRange: 'week' | 'month' | 'year', customer: string | null = null) => {
    let labels: string[] = [];
    
    switch(dateRange) {
      case 'week':
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        break;
      case 'month':
        labels = Array.from({ length: 30 }, (_, i) => `${i + 1}`);
        break;
      case 'year':
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        break;
    }

    // If a specific customer is selected, generate custom data for them
    if (customer) {
      // Find the customer's current GPM
      const customerData = customerGPMData.find(c => c.name === customer);
      if (!customerData) return { labels, datasets: [] };
      
      const baseGPM = customerData.gpm;
      
      // Generate realistic historical data with the current GPM as the end point
      const data = labels.map((_, i, arr) => {
        // Create a slightly different starting point (up to 5% different)
        const startGPM = baseGPM * (0.95 + Math.random() * 0.1);
        // Linear progression from start to current GPM
        const progress = i / (arr.length - 1);
        const gpm = startGPM + (baseGPM - startGPM) * progress;
        // Add some noise
        return gpm + (Math.random() - 0.5) * 1.5;
      });
      
      return {
        labels,
        datasets: [
          {
            label: `${customer} GPM %`,
            data,
            borderColor: 'rgba(255, 215, 0, 0.8)',
            backgroundColor: 'rgba(255, 215, 0, 0.2)',
            tension: 0.3,
            fill: true
          }
        ]
      };
    }
    
    // Use pre-generated data for overall GPM
    const data = dateRange === 'week' 
      ? historicalGPMData.weekly 
      : dateRange === 'month' 
        ? historicalGPMData.monthly 
        : historicalGPMData.yearly;
    
    return {
      labels,
      datasets: [
        {
          label: 'Overall GPM %',
          data,
          borderColor: 'rgba(255, 215, 0, 0.8)',
          backgroundColor: 'rgba(255, 215, 0, 0.2)',
          tension: 0.3,
          fill: true
        }
      ]
    };
  };

  // Chart options for responsive design
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          callback: (value: any) => {
            return '$' + value.toLocaleString();
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(20, 20, 30, 0.9)',
        titleColor: 'rgba(255, 215, 0, 0.9)',
        bodyColor: 'white',
        borderColor: 'rgba(255, 215, 0, 0.3)',
        borderWidth: 1,
        displayColors: false,
        padding: 10,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += '$' + context.parsed.y.toLocaleString();
            }
            return label;
          }
        }
      }
    }
  };

  // Bar chart options
  const barChartOptions = {
    ...chartOptions,
    indexAxis: 'y' as const,
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          callback: (value: any) => {
            return '$' + value.toLocaleString();
          }
        }
      },
      y: {
        grid: {
          display: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)'
        }
      }
    }
  };

  // Sample data for inventory values
  const inventoryHistoricalData = [
    { date: '2023-01-01', value: 458000 },
    { date: '2023-02-01', value: 472000 },
    { date: '2023-03-01', value: 491000 },
    { date: '2023-04-01', value: 505000 },
    { date: '2023-05-01', value: 523000 },
    { date: '2023-06-01', value: 548000 },
    { date: '2023-07-01', value: 567000 },
    { date: '2023-08-01', value: 582000 },
    { date: '2023-09-01', value: 613000 },
    { date: '2023-10-01', value: 632000 },
    { date: '2023-11-01', value: 651000 },
    { date: '2023-12-01', value: 687000 },
    { date: '2024-01-01', value: 705000 },
    { date: '2024-02-01', value: 728000 },
    { date: '2024-03-01', value: 752000 },
    { date: '2024-04-01', value: 776000 },
    { date: '2024-05-01', value: 792000 },
    { date: '2024-06-01', value: 815000 },
    { date: '2024-07-01', value: 842000 },
  ];
  
  const inventoryUnitsData = [
    { date: '2023-01-01', value: 24500 },
    { date: '2023-02-01', value: 25100 },
    { date: '2023-03-01', value: 26200 },
    { date: '2023-04-01', value: 27100 },
    { date: '2023-05-01', value: 27800 },
    { date: '2023-06-01', value: 29200 },
    { date: '2023-07-01', value: 30500 },
    { date: '2023-08-01', value: 31200 },
    { date: '2023-09-01', value: 32700 },
    { date: '2023-10-01', value: 33800 },
    { date: '2023-11-01', value: 35100 },
    { date: '2023-12-01', value: 36800 },
    { date: '2024-01-01', value: 37500 },
    { date: '2024-02-01', value: 38900 },
    { date: '2024-03-01', value: 40200 },
    { date: '2024-04-01', value: 41500 },
    { date: '2024-05-01', value: 42300 },
    { date: '2024-06-01', value: 43600 },
    { date: '2024-07-01', value: 45100 },
  ];
  
  // Sample inventory item data
  const inventoryData = [
    { 
      sku: 'ANQ-1001', 
      name: 'Antique Oak Dining Table', 
      inventory: 12, 
      unitValue: 1850, 
      totalValue: 22200, 
      palletCount: 3 
    },
    { 
      sku: 'ANQ-1002', 
      name: 'Victorian Mahogany Armchair', 
      inventory: 28, 
      unitValue: 975, 
      totalValue: 27300, 
      palletCount: 4 
    },
    { 
      sku: 'ANQ-1003', 
      name: 'Art Deco Walnut Sideboard', 
      inventory: 5, 
      unitValue: 3200, 
      totalValue: 16000, 
      palletCount: 2 
    },
    { 
      sku: 'ANQ-1004', 
      name: 'Mid-Century Teak Credenza', 
      inventory: 7, 
      unitValue: 2750, 
      totalValue: 19250, 
      palletCount: 2 
    },
    { 
      sku: 'ANQ-1005', 
      name: 'French Provincial Dresser', 
      inventory: 9, 
      unitValue: 1950, 
      totalValue: 17550, 
      palletCount: 3 
    },
    { 
      sku: 'ANQ-1006', 
      name: 'Vintage Crystal Chandelier', 
      inventory: 15, 
      unitValue: 4200, 
      totalValue: 63000, 
      palletCount: 3 
    },
    { 
      sku: 'ANQ-1007', 
      name: 'Baroque Gilt Mirror', 
      inventory: 11, 
      unitValue: 1600, 
      totalValue: 17600, 
      palletCount: 2 
    },
    { 
      sku: 'ANQ-1008', 
      name: 'Empire Style Coffee Table', 
      inventory: 18, 
      unitValue: 950, 
      totalValue: 17100, 
      palletCount: 3 
    },
    { 
      sku: 'ANQ-1009', 
      name: 'Queen Anne Wingback Chair', 
      inventory: 21, 
      unitValue: 1250, 
      totalValue: 26250, 
      palletCount: 4 
    },
    { 
      sku: 'ANQ-1010', 
      name: 'Georgian Silver Tea Set', 
      inventory: 3, 
      unitValue: 8500, 
      totalValue: 25500, 
      palletCount: 1 
    },
    { 
      sku: 'ANQ-1011', 
      name: 'Regency Rosewood Writing Desk', 
      inventory: 6, 
      unitValue: 4850, 
      totalValue: 29100, 
      palletCount: 2 
    },
    { 
      sku: 'ANQ-1012', 
      name: 'Edwardian Marble-Top Wash Stand', 
      inventory: 4, 
      unitValue: 3200, 
      totalValue: 12800, 
      palletCount: 1 
    }
  ];
  
  // Function to generate inventory data for charts
  const generateInventoryData = (dateRange: 'week' | 'month' | 'year', view: 'value' | 'units') => {
    // Create labels based on date range
    let labels = [];
    let startIndex = 0;
    
    if (dateRange === 'week') {
      // Last 7 days - use most recent daily data
      startIndex = inventoryHistoricalData.length - 7;
      for (let i = 0; i < 7; i++) {
        const date = new Date(inventoryHistoricalData[startIndex + i].date);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      }
    } else if (dateRange === 'month') {
      // Last 30 days - use last 4 weeks of data
      startIndex = inventoryHistoricalData.length - 4;
      for (let i = 0; i < 4; i++) {
        const date = new Date(inventoryHistoricalData[startIndex + i].date);
        labels.push(`Week ${i + 1}`);
      }
    } else if (dateRange === 'year') {
      // Last 12 months - use monthly data
      startIndex = inventoryHistoricalData.length - 12;
      for (let i = 0; i < 12; i++) {
        const date = new Date(inventoryHistoricalData[startIndex + i].date);
        labels.push(date.toLocaleDateString('en-US', { month: 'short' }));
      }
    }
    
    // Get the appropriate data based on view type
    const sourceData = view === 'value' ? inventoryHistoricalData : inventoryUnitsData;
    
    // Get data points matching our labels
    const dataPoints = [];
    for (let i = 0; i < labels.length; i++) {
      dataPoints.push(sourceData[startIndex + i].value);
    }
    
    return {
      labels,
      datasets: [
        {
          label: view === 'value' ? 'Inventory Value ($)' : 'Inventory Units',
          data: dataPoints,
          borderColor: '#4CAF50', // green color for inventory
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
        }
      ]
    };
  };

  return (
    <div style={{ 
      padding: '6rem 2rem 2rem 2rem', 
      minHeight: '100vh',
      background: 'black',
    }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            marginBottom: '1rem',
            fontFamily: "'Rajdhani', sans-serif",
            background: 'linear-gradient(to right, #FFD700, #FFA500)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Dashboard
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Welcome back. Here's what's happening with your business today.
          </p>
        </div>

        {/* KPI Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
            gap: '1.5rem',
            marginBottom: '2.5rem' 
          }}
        >
          {kpiData.map((kpi, index) => (
            <KPICard 
              key={index}
              title={kpi.title}
              value={kpi.value}
              change={kpi.change}
              changePositive={kpi.changePositive}
              icon={kpi.icon}
              onClick={() => openAnalytics(kpi.analyticsType as 'revenue' | 'agedAr' | 'inventory' | 'orders' | 'gpm')}
            />
          ))}
        </motion.div>

        {/* Dashboard Grid */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Notifications Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{
              background: 'rgba(20, 20, 30, 0.6)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1rem',
              overflow: 'hidden',
              border: '1px solid rgba(255, 215, 0, 0.2)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ 
              padding: '1.5rem', 
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ fontSize: '1.25rem' }}>Notifications</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255, 215, 0, 0.9)',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                Mark all as read
              </motion.button>
            </div>
            {notificationData.map((notification, index) => (
              <NotificationItem
                key={index}
                title={notification.title}
                message={notification.message}
                time={notification.time}
                isNew={notification.isNew}
              />
            ))}
            <div style={{ 
              padding: '1rem', 
              textAlign: 'center' 
            }}>
              <motion.button
                whileHover={{ 
                  color: 'rgba(255, 215, 0, 0.9)',
                  textDecoration: 'underline' 
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.7)',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                View all notifications
              </motion.button>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            style={{
              background: 'rgba(20, 20, 30, 0.6)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1rem',
              overflow: 'hidden',
              border: '1px solid rgba(255, 215, 0, 0.2)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Quick Actions</h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '1rem' 
            }}>
              {['Add Product', 'New Order', 'View Reports', 'Settings'].map((action, index) => (
                <motion.button
                  key={index}
                  whileHover={{ 
                    scale: 1.03, 
                    backgroundColor: 'rgba(255, 215, 0, 0.2)',
                    boxShadow: '0 0 10px rgba(255, 215, 0, 0.3)' 
                  }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    backgroundColor: 'rgba(30, 30, 40, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    color: 'white',
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontSize: '0.875rem'
                  }}
                >
                  {action}
                </motion.button>
              ))}
            </div>
            
            <h3 style={{ fontSize: '1rem', marginTop: '1rem', marginBottom: '0.5rem' }}>Recent Activity</h3>
            <div style={{
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '0.5rem',
              overflow: 'hidden'
            }}>
              {['User login from new device', 'Product inventory updated', 'New comment on order #1234'].map((activity, index) => (
                <div 
                  key={index}
                  style={{
                    padding: '0.75rem',
                    borderBottom: index < 2 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                    fontSize: '0.875rem',
                    color: 'rgba(255, 255, 255, 0.8)'
                  }}
                >
                  {activity}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        
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
                      {analyticsType === 'revenue' && 'Revenue Analytics'}
                      {analyticsType === 'agedAr' && 'Aged Accounts Receivable'}
                      {analyticsType === 'inventory' && 'Inventory Analytics'}
                      {analyticsType === 'orders' && 'Orders Analytics'}
                    </h2>
                    <p style={{ 
                      color: 'rgba(255, 255, 255, 0.7)', 
                      fontSize: '0.875rem',
                      marginBottom: '0.5rem',
                    }}>
                      {analyticsType === 'revenue' && 'In-depth analysis of revenue, trends, and top performing products'}
                      {analyticsType === 'agedAr' && 'Analysis of accounts receivable aging and collections'}
                      {analyticsType === 'inventory' && 'Detailed inventory metrics and valuation'}
                      {analyticsType === 'orders' && 'Order volume, fulfillment rates, and trends'}
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
                
                {/* Controls - Date Range and Metric Selector */}
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
                            onClick={() => setSelectedDateRange(range as 'week' | 'month' | 'year')}
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
                    
                    {/* Metric selector - only show for revenue */}
                    {analyticsType === 'revenue' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>Metric:</span>
                        <div style={{ display: 'flex', background: 'rgba(30, 30, 40, 0.6)', borderRadius: '0.5rem', overflow: 'hidden' }}>
                          {['revenue', 'profit', 'orders', 'overview'].map(metric => (
                            <button
                              key={metric}
                              onClick={() => setSelectedMetric(metric as 'revenue' | 'profit' | 'orders' | 'overview')}
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
                    )}
                  </div>
                </div>
                
                {/* Revenue Analytics Content */}
                {analyticsType === 'revenue' && (
                  <>
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
                    
                    {/* Two column layout for bar charts */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
                      gap: '2rem',
                      marginBottom: '2rem'
                    }}>
                      {/* Top Products */}
                      <div style={{
                        background: 'rgba(25, 25, 35, 0.5)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '1rem',
                        padding: '1.5rem',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}>
                        <h3 style={{ 
                          fontSize: '1.25rem', 
                          marginBottom: '1rem', 
                          color: 'rgba(255, 255, 255, 0.9)',
                        }}>
                          Top Products by Revenue
                        </h3>
                        <div style={{ height: '300px' }}>
                          <Bar 
                            data={{
                              labels: topProducts.map(product => product.name),
                              datasets: [
                                {
                                  label: 'Revenue ($)',
                                  data: topProducts.map(product => product.revenue),
                                  backgroundColor: 'rgba(255, 215, 0, 0.6)',
                                  borderColor: 'rgba(255, 215, 0, 1)',
                                  borderWidth: 1
                                }
                              ]
                            }}
                            options={barChartOptions}
                          />
                        </div>
                      </div>
                      
                      {/* Top Customers */}
                      <div style={{
                        background: 'rgba(25, 25, 35, 0.5)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '1rem',
                        padding: '1.5rem',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}>
                        <h3 style={{ 
                          fontSize: '1.25rem', 
                          marginBottom: '1rem', 
                          color: 'rgba(255, 255, 255, 0.9)',
                        }}>
                          Top Customers by Revenue
                        </h3>
                        <div style={{ height: '300px' }}>
                          <Bar 
                            data={{
                              labels: topCustomers.map(customer => customer.name),
                              datasets: [
                                {
                                  label: 'Revenue ($)',
                                  data: topCustomers.map(customer => customer.revenue),
                                  backgroundColor: 'rgba(130, 180, 255, 0.6)',
                                  borderColor: 'rgba(130, 180, 255, 1)',
                                  borderWidth: 1
                                }
                              ]
                            }}
                            options={barChartOptions}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Interactive Sales Map */}
                    <div style={{
                      background: 'rgba(25, 25, 35, 0.5)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '1rem',
                      padding: '1.5rem',
                      marginBottom: '2rem',
                      border: '1px solid rgba(255, 215, 0, 0.2)',
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        marginBottom: '1rem'
                      }}>
                        <h3 style={{ 
                          fontSize: '1.25rem', 
                          color: 'rgba(255, 255, 255, 0.9)',
                        }}>
                          Geographic Sales Distribution
                        </h3>
                        
                        {/* Region selector */}
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            onClick={() => setSelectedRegion(null)}
                            style={{
                              padding: '0.5rem 0.75rem',
                              background: selectedRegion === null ? 'rgba(255, 215, 0, 0.2)' : 'rgba(30, 30, 40, 0.6)',
                              border: selectedRegion === null ? '1px solid rgba(255, 215, 0, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                              borderRadius: '0.5rem',
                              color: selectedRegion === null ? 'rgba(255, 215, 0, 0.9)' : 'rgba(255, 255, 255, 0.7)',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                            }}
                          >
                            All Regions
                          </button>
                          {salesByRegion.map(region => (
                            <button 
                              key={region.region}
                              onClick={() => setSelectedRegion(region.region)}
                              style={{
                                padding: '0.5rem 0.75rem',
                                background: selectedRegion === region.region ? 'rgba(255, 215, 0, 0.2)' : 'rgba(30, 30, 40, 0.6)',
                                border: selectedRegion === region.region ? '1px solid rgba(255, 215, 0, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '0.5rem',
                                color: selectedRegion === region.region ? 'rgba(255, 215, 0, 0.9)' : 'rgba(255, 255, 255, 0.7)',
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                              }}
                            >
                              {region.region}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Custom Heat Map */}
                      <div style={{ 
                        position: 'relative',
                        height: '400px',
                        background: 'rgba(20, 20, 30, 0.5)',
                        borderRadius: '0.5rem',
                        overflow: 'hidden',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                      }}>
                        {/* Map tooltip */}
                        {tooltipContent && (
                          <div style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            background: 'rgba(20, 20, 30, 0.95)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '0.5rem',
                            padding: '0.75rem 1rem',
                            border: '1px solid rgba(255, 215, 0, 0.3)',
                            color: 'white',
                            fontSize: '0.875rem',
                            zIndex: 10,
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                            maxWidth: '200px',
                          }}>
                            <div dangerouslySetInnerHTML={{ __html: tooltipContent }} />
                          </div>
                        )}
                        
                        {/* Map Legend */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          marginBottom: '1rem',
                          gap: '0.75rem'
                        }}>
                          <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>Sales Intensity:</div>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            background: 'rgba(30, 30, 40, 0.6)',
                            borderRadius: '0.25rem',
                            padding: '0.25rem 0.5rem',
                            gap: '0.25rem'
                          }}>
                            <div style={{ width: '1rem', height: '1rem', background: 'rgba(255, 215, 0, 0.1)' }}></div>
                            <div style={{ width: '1rem', height: '1rem', background: 'rgba(255, 215, 0, 0.3)' }}></div>
                            <div style={{ width: '1rem', height: '1rem', background: 'rgba(255, 215, 0, 0.5)' }}></div>
                            <div style={{ width: '1rem', height: '1rem', background: 'rgba(255, 215, 0, 0.7)' }}></div>
                            <div style={{ width: '1rem', height: '1rem', background: 'rgba(255, 215, 0, 0.9)' }}></div>
                          </div>
                          <div style={{ display: 'flex', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                            <span>Low</span>
                            <span style={{ margin: '0 1.5rem' }}></span>
                            <span>High</span>
                          </div>
                        </div>
                        
                        {/* Interactive Hexagon Heat Map */}
                        <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignContent: 'flex-start', justifyContent: 'center' }}>
                          {salesByState.map((stateData) => {
                            // Check if this state belongs to the selected region
                            const regionData = selectedRegion 
                              ? salesByRegion.find(r => r.region === selectedRegion)
                              : null;
                            
                            const isInSelectedRegion = !selectedRegion || 
                              (regionData && regionData.states.includes(stateData.state));
                            
                            // If a region is selected and this state is not in it, reduce opacity
                            const stateOpacity = selectedRegion && !isInSelectedRegion ? 0.2 : 1;
                            
                            // Calculate the size based on revenue
                            const maxRevenue = Math.max(...salesByState.map(s => s.revenue));
                            const minSize = 40;
                            const maxSize = 80;
                            const size = minSize + ((stateData.revenue / maxRevenue) * (maxSize - minSize));
                            
                            return (
                              <motion.div
                                key={stateData.state}
                                whileHover={{ 
                                  scale: 1.1,
                                  zIndex: 5,
                                  boxShadow: '0 0 15px rgba(255, 215, 0, 0.4)'
                                }}
                                onMouseEnter={() => {
                                  setTooltipContent(`
                                    <strong>${stateData.state}</strong><br/>
                                    Revenue: $${stateData.revenue.toLocaleString()}<br/>
                                    Units Sold: ${stateData.units.toLocaleString()}<br/>
                                    Avg Price: $${(stateData.revenue / stateData.units).toFixed(2)}
                                  `);
                                }}
                                onMouseLeave={() => {
                                  setTooltipContent('');
                                }}
                                style={{
                                  width: `${size}px`,
                                  height: `${size}px`,
                                  backgroundColor: `rgba(255, 215, 0, ${stateData.intensity * stateOpacity})`,
                                  borderRadius: '0.5rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  position: 'relative',
                                  overflow: 'hidden',
                                  transition: 'opacity 0.3s ease',
                                  border: '1px solid rgba(255, 255, 255, 0.1)',
                                  opacity: stateOpacity,
                                  cursor: 'pointer',
                                }}
                              >
                                <div style={{ 
                                  position: 'absolute',
                                  top: '50%',
                                  left: '50%',
                                  transform: 'translate(-50%, -50%)',
                                  fontSize: `${Math.max(10, size / 4)}px`,
                                  fontWeight: 'bold',
                                  color: stateData.intensity > 0.5 ? 'rgba(20, 20, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                                  textShadow: stateData.intensity > 0.5 ? 'none' : '0 0 3px rgba(0, 0, 0, 0.5)',
                                  zIndex: 1
                                }}>
                                  {stateData.state}
                                </div>
                                {stateData.intensity > 0.7 && (
                                  <div style={{
                                    position: 'absolute',
                                    top: '3px',
                                    right: '3px',
                                    background: 'rgba(20, 20, 30, 0.7)',
                                    borderRadius: '50%',
                                    width: '10px',
                                    height: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '8px',
                                    color: 'white',
                                  }}>
                                    ★
                                  </div>
                                )}
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* Quick stats */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem',
                        marginTop: '1rem',
                      }}>
                        {[
                          {
                            label: "Total Revenue",
                            value: `$${salesByState.reduce((sum, state) => sum + state.revenue, 0).toLocaleString()}`,
                            color: "rgba(255, 215, 0, 0.9)"
                          },
                          {
                            label: "Total Units",
                            value: salesByState.reduce((sum, state) => sum + state.units, 0).toLocaleString(),
                            color: "rgba(130, 180, 255, 0.9)"
                          },
                          {
                            label: "Top State",
                            value: salesByState[0].state,
                            subtext: `$${salesByState[0].revenue.toLocaleString()}`,
                            color: "rgba(255, 215, 0, 0.9)"
                          },
                          {
                            label: "Coverage",
                            value: `${salesByState.length}/50 States`,
                            subtext: "100% of US Market",
                            color: "rgba(75, 210, 143, 0.9)"
                          }
                        ].map((stat, index) => (
                          <div key={index} style={{
                            background: 'rgba(30, 30, 40, 0.6)',
                            borderRadius: '0.5rem',
                            padding: '0.75rem 1rem',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                          }}>
                            <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.25rem' }}>
                              {stat.label}
                            </div>
                            <div style={{ fontSize: '1rem', fontWeight: 'bold', color: stat.color }}>
                              {stat.value}
                            </div>
                            {stat.subtext && (
                              <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)', marginTop: '0.25rem' }}>
                                {stat.subtext}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Key Insights Section */}
                    <div style={{
                      background: 'rgba(30, 30, 40, 0.6)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '1rem',
                      padding: '1.5rem',
                      border: '1px solid rgba(255, 215, 0, 0.2)',
                    }}>
                      <h3 style={{ 
                        fontSize: '1.25rem', 
                        marginBottom: '1rem', 
                        color: 'rgba(255, 215, 0, 0.9)',
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
                            Revenue Growth
                          </h4>
                          <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.5' }}>
                            Overall revenue grew by 12.4% compared to last period. The growth is primarily driven by Premium Hoodie and Graphic T-Shirt sales, which account for 35% of total revenue.
                          </p>
                        </div>
                        <div>
                          <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                            Customer Analysis
                          </h4>
                          <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.5' }}>
                            Top 5 customers contribute 47% of total revenue. Apex Corporation shows strongest growth at 24% year-over-year, while Horizon Group increased order frequency by 18%.
                          </p>
                        </div>
                        <div>
                          <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                            Seasonal Trends
                          </h4>
                          <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.5' }}>
                            {selectedDateRange === 'year' ? 
                              'Revenue peaks in Q4 (holiday season) and Q2 (summer collection launch). Consider inventory planning around these seasonal trends.' : 
                              'Current month shows 15% higher revenue than same period last year. Weekend sales are consistently 30% higher than weekday averages.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                {/* Aged AR Analytics Content */}
                {analyticsType === 'agedAr' && (
                  <>
                    {/* AR Aging Summary */}
                    <div style={{
                      background: 'rgba(25, 25, 35, 0.5)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '1rem',
                      padding: '1.5rem',
                      marginBottom: '2rem',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}>
                      <h3 style={{ 
                        fontSize: '1.25rem', 
                        marginBottom: '1rem', 
                        color: 'rgba(255, 255, 255, 0.9)',
                      }}>
                        Aged Accounts Receivable
                      </h3>
                      
                      {/* AR Summary Metrics - Moved above the table */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '1.5rem',
                        marginBottom: '2rem',
                      }}>
                        {[
                          { title: 'Total AR', value: '$78,500', change: '+5.2%', positive: false },
                          { title: '< 30 Days', value: '$35,210', percent: '44.9%' },
                          { title: '30-60 Days', value: '$24,750', percent: '31.5%' },
                          { title: '> 60 Days', value: '$18,540', percent: '23.6%' },
                        ].map((metric, index) => (
                          <div key={index} style={{
                            background: 'rgba(30, 30, 40, 0.6)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '1rem',
                            padding: '1.5rem',
                            border: index === 0 ? '1px solid rgba(255, 215, 0, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                          }}>
                            <h4 style={{ 
                              fontSize: '0.875rem', 
                              color: 'rgba(255, 255, 255, 0.7)',
                              marginBottom: '0.5rem',
                            }}>{metric.title}</h4>
                            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                              <h3 style={{ 
                                fontSize: '1.5rem', 
                                fontWeight: 'bold',
                                color: index === 0 ? 'rgba(255, 215, 0, 0.9)' : 'white',
                              }}>{metric.value}</h3>
                              {metric.percent && (
                                <span style={{ 
                                  fontSize: '0.875rem',
                                  color: 'rgba(255, 255, 255, 0.6)',
                                }}>{metric.percent}</span>
                              )}
                              {metric.change && (
                                <span style={{ 
                                  fontSize: '0.875rem',
                                  color: metric.positive ? 'rgba(75, 210, 143, 0.9)' : 'rgba(255, 99, 132, 0.9)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                }}>
                                  {metric.positive ? (
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M12 20V4M12 4L5 11M12 4L19 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  ) : (
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M12 4V20M12 20L5 13M12 20L19 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  )}
                                  {metric.change}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* AR Table */}
                      <div style={{
                        overflowX: 'auto',
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}>
                        <table style={{
                          width: '100%',
                          borderCollapse: 'collapse',
                          fontSize: '0.875rem',
                        }}>
                          <thead>
                            <tr style={{
                              background: 'rgba(30, 30, 40, 0.8)',
                              borderBottom: '2px solid rgba(255, 215, 0, 0.3)',
                            }}>
                              <th style={{
                                padding: '0.75rem 1rem',
                                textAlign: 'center',
                                color: 'rgba(255, 215, 0, 0.9)',
                                fontWeight: 'bold',
                              }}>Order #</th>
                              <th style={{
                                padding: '0.75rem 1rem',
                                textAlign: 'center',
                                color: 'rgba(255, 215, 0, 0.9)',
                                fontWeight: 'bold',
                              }}>Bill Date</th>
                              <th style={{
                                padding: '0.75rem 1rem',
                                textAlign: 'center',
                                color: 'rgba(255, 215, 0, 0.9)',
                                fontWeight: 'bold',
                              }}>Due Date</th>
                              <th style={{
                                padding: '0.75rem 1rem',
                                textAlign: 'center',
                                color: 'rgba(255, 215, 0, 0.9)',
                                fontWeight: 'bold',
                              }}>Customer</th>
                              <th style={{
                                padding: '0.75rem 1rem',
                                textAlign: 'center',
                                color: 'rgba(255, 215, 0, 0.9)',
                                fontWeight: 'bold',
                              }}>Days Past Due</th>
                              <th style={{
                                padding: '0.75rem 1rem',
                                textAlign: 'center',
                                color: 'rgba(255, 215, 0, 0.9)',
                                fontWeight: 'bold',
                              }}>Order Total</th>
                              <th style={{
                                padding: '0.75rem 1rem',
                                textAlign: 'center',
                                color: 'rgba(255, 215, 0, 0.9)',
                                fontWeight: 'bold',
                              }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { id: 'ORD-1042', billDate: '02/15/2023', dueDate: '03/15/2023', customer: 'Apex Corporation', daysPastDue: 45, total: 24540, severity: 'high' },
                              { id: 'ORD-1038', billDate: '03/01/2023', dueDate: '04/01/2023', customer: 'Horizon Group', daysPastDue: 30, total: 18750, severity: 'medium' },
                              { id: 'ORD-1035', billDate: '03/12/2023', dueDate: '04/12/2023', customer: 'Valley Retailers', daysPastDue: 15, total: 12320, severity: 'low' },
                              { id: 'ORD-1032', billDate: '03/25/2023', dueDate: '04/25/2023', customer: 'Summit Enterprises', daysPastDue: 5, total: 8640, severity: 'low' },
                              { id: 'ORD-1028', billDate: '04/02/2023', dueDate: '05/02/2023', customer: 'Echo Distributors', daysPastDue: 0, total: 14250, severity: 'none' },
                            ].map((order, index) => (
                              <tr key={index} style={{
                                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                                background: index % 2 === 0 ? 'rgba(20, 20, 30, 0.3)' : 'rgba(30, 30, 40, 0.3)',
                              }}>
                                <td style={{
                                  padding: '0.75rem 1rem',
                                  color: 'rgba(255, 255, 255, 0.9)',
                                  textAlign: 'center',
                                }}>{order.id}</td>
                                <td style={{
                                  padding: '0.75rem 1rem',
                                  color: 'rgba(255, 255, 255, 0.7)',
                                  textAlign: 'center',
                                }}>{order.billDate}</td>
                                <td style={{
                                  padding: '0.75rem 1rem',
                                  color: 'rgba(255, 255, 255, 0.7)',
                                  textAlign: 'center',
                                }}>{order.dueDate}</td>
                                <td style={{
                                  padding: '0.75rem 1rem',
                                  color: 'rgba(255, 255, 255, 0.9)',
                                  textAlign: 'center',
                                }}>{order.customer}</td>
                                <td style={{
                                  padding: '0.75rem 1rem',
                                  textAlign: 'center',
                                  color: order.daysPastDue > 30 ? 'rgba(255, 99, 132, 0.9)' : 
                                         order.daysPastDue > 15 ? 'rgba(255, 159, 64, 0.9)' : 
                                         order.daysPastDue > 0 ? 'rgba(255, 215, 0, 0.9)' : 
                                         'rgba(255, 255, 255, 0.7)',
                                  fontWeight: order.daysPastDue > 0 ? 'bold' : 'normal',
                                }}>{order.daysPastDue}</td>
                                <td style={{
                                  padding: '0.75rem 1rem',
                                  textAlign: 'center',
                                  color: 'rgba(255, 255, 255, 0.9)',
                                  fontWeight: 'bold',
                                }}>${order.total.toLocaleString()}</td>
                                <td style={{
                                  padding: '0.75rem 1rem',
                                  textAlign: 'center',
                                }}>
                                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                    {/* Nice Reminder - Happy Green Face */}
                                  <motion.button
                                    whileHover={{ 
                                        scale: 1.1,
                                        backgroundColor: 'rgba(75, 210, 143, 0.3)',
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                      onClick={() => openReminderModal(order.customer, order.id, 'nice')}
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        background: 'rgba(75, 210, 143, 0.15)',
                                        border: '1px solid rgba(75, 210, 143, 0.5)',
                                        color: 'rgba(75, 210, 143, 0.9)',
                                      fontSize: '0.75rem',
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                        position: 'relative',
                                      }}
                                      title="Send Friendly Reminder"
                                    >
                                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                        <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        <circle cx="8" cy="9" r="1.5" fill="currentColor" />
                                        <circle cx="16" cy="9" r="1.5" fill="currentColor" />
                                    </svg>
                                  </motion.button>
                                    
                                    {/* Threatening Reminder - Angry Red Face */}
                                    <motion.button
                                      whileHover={{ 
                                        scale: 1.1,
                                        backgroundColor: 'rgba(255, 99, 132, 0.3)',
                                      }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => openReminderModal(order.customer, order.id, 'threatening')}
                                      style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        background: 'rgba(255, 99, 132, 0.15)',
                                        border: '1px solid rgba(255, 99, 132, 0.5)',
                                        color: 'rgba(255, 99, 132, 0.9)',
                                        fontSize: '0.75rem',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative',
                                      }}
                                      title="Send Stern Reminder"
                                    >
                                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                        <path d="M8 16C8 16 9.5 14 12 14C14.5 14 16 16 16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        <path d="M7.5 9L8.5 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        <path d="M7.5 10L8.5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        <path d="M15.5 9L16.5 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        <path d="M15.5 10L16.5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                      </svg>
                                    </motion.button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    {/* AR Summary Metrics - REMOVED FROM HERE AND MOVED ABOVE */}
                    
                    {/* Recommendations */}
                    <div style={{
                      background: 'rgba(30, 30, 40, 0.6)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '1rem',
                      padding: '1.5rem',
                      border: '1px solid rgba(255, 215, 0, 0.2)',
                    }}>
                      <h3 style={{ 
                        fontSize: '1.25rem', 
                        marginBottom: '1rem', 
                        color: 'rgba(255, 215, 0, 0.9)',
                      }}>
                        AR Improvement Recommendations
                      </h3>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '1.5rem',
                      }}>
                        <div>
                          <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                            Priority Follow-ups
                          </h4>
                          <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.5' }}>
                            Focus on collecting from Apex Corporation and Horizon Group, which represent 52% of total AR. Consider offering a payment plan to Apex for their overdue balance.
                          </p>
                        </div>
                        <div>
                          <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                            Process Improvements
                          </h4>
                          <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.5' }}>
                            Implement automated reminders at 7, 15, and 30 days past due. Consider early payment discounts of 2% for payments within 10 days of invoice.
                          </p>
                        </div>
                        <div>
                          <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                            Customer Risk Assessment
                          </h4>
                          <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.5' }}>
                            Review credit terms for Apex Corporation. Their payment delays have increased by 15% over the last quarter. Consider adjusting credit limits accordingly.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                {/* GPM Analytics Content */}
                {analyticsType === 'gpm' && (
                  <>
                    {/* GPM Overview */}
                    {!showCustomerGPMChart && (
                      <div style={{
                        background: 'rgba(25, 25, 35, 0.5)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '1rem',
                        padding: '1.5rem',
                        marginBottom: '2rem',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        height: '350px',
                      }}>
                        <h3 style={{ 
                          fontSize: '1.25rem', 
                          marginBottom: '1rem', 
                          color: 'rgba(255, 255, 255, 0.9)',
                        }}>
                          Overall Gross Profit Margin %
                        </h3>
                        <Line 
                          data={generateGPMData(selectedDateRange)}
                          options={{
                            ...chartOptions,
                            scales: {
                              ...chartOptions.scales,
                              y: {
                                ...chartOptions.scales.y,
                                min: 30,
                                max: 40,
                                ticks: {
                                  color: 'rgba(255, 255, 255, 0.7)',
                                  callback: (value: any) => `${value}%`
                                }
                              }
                            },
                            plugins: {
                              ...chartOptions.plugins,
                              tooltip: {
                                ...chartOptions.plugins.tooltip,
                                callbacks: {
                                  label: function(context: any) {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                      label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                      label += `${context.parsed.y.toFixed(1)}%`;
                                    }
                                    return label;
                                  }
                                }
                              }
                            }
                          }}
                        />
                      </div>
                    )}

                    {/* Customer-specific GPM Chart */}
                    {showCustomerGPMChart && (
                      <div style={{
                        background: 'rgba(25, 25, 35, 0.5)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '1rem',
                        padding: '1.5rem',
                        marginBottom: '2rem',
                        border: '1px solid rgba(255, 215, 0, 0.3)',
                        height: '350px',
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          marginBottom: '1rem' 
                        }}>
                          <h3 style={{ 
                            fontSize: '1.25rem', 
                            color: 'rgba(255, 215, 0, 0.9)',
                          }}>
                            {selectedCustomer} - GPM % Over Time
                          </h3>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={resetCustomerSelection}
                            style={{
                              padding: '0.5rem 0.75rem',
                              backgroundColor: 'rgba(255, 215, 0, 0.15)',
                              border: '1px solid rgba(255, 215, 0, 0.5)',
                              borderRadius: '0.5rem',
                              color: 'rgba(255, 215, 0, 0.9)',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                            }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Back to Overview
                          </motion.button>
                        </div>
                        <Line 
                          data={generateGPMData(selectedDateRange, selectedCustomer)}
                          options={{
                            ...chartOptions,
                            scales: {
                              ...chartOptions.scales,
                              y: {
                                ...chartOptions.scales.y,
                                min: 30,
                                max: 42,
                                ticks: {
                                  color: 'rgba(255, 255, 255, 0.7)',
                                  callback: (value: any) => `${value}%`
                                }
                              }
                            },
                            plugins: {
                              ...chartOptions.plugins,
                              tooltip: {
                                ...chartOptions.plugins.tooltip,
                                callbacks: {
                                  label: function(context: any) {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                      label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                      label += `${context.parsed.y.toFixed(1)}%`;
                                    }
                                    return label;
                                  }
                                }
                              }
                            }
                          }}
                        />
                      </div>
                    )}
                    
                    {/* Customer GPM Table */}
                    <div style={{
                      background: 'rgba(25, 25, 35, 0.5)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '1rem',
                      padding: '1.5rem',
                      marginBottom: '2rem',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}>
                      <h3 style={{ 
                        fontSize: '1.25rem', 
                        marginBottom: '1rem', 
                        color: 'rgba(255, 255, 255, 0.9)',
                      }}>
                        Customer Profitability
                      </h3>
                      
                      {/* Customer GPM Table */}
                      <div style={{
                        overflowX: 'auto',
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}>
                        <table style={{
                          width: '100%',
                          borderCollapse: 'collapse',
                          fontSize: '0.875rem',
                        }}>
                          <thead>
                            <tr style={{
                              background: 'rgba(30, 30, 40, 0.8)',
                              borderBottom: '2px solid rgba(255, 215, 0, 0.3)',
                            }}>
                              <th style={{
                                padding: '0.75rem 1rem',
                                textAlign: 'left',
                                color: 'rgba(255, 215, 0, 0.9)',
                                fontWeight: 'bold',
                              }}>Customer</th>
                              <th style={{
                                padding: '0.75rem 1rem',
                                textAlign: 'right',
                                color: 'rgba(255, 215, 0, 0.9)',
                                fontWeight: 'bold',
                              }}>Revenue</th>
                              <th style={{
                                padding: '0.75rem 1rem',
                                textAlign: 'right',
                                color: 'rgba(255, 215, 0, 0.9)',
                                fontWeight: 'bold',
                              }}>Cost</th>
                              <th style={{
                                padding: '0.75rem 1rem',
                                textAlign: 'right',
                                color: 'rgba(255, 215, 0, 0.9)',
                                fontWeight: 'bold',
                              }}>Profit</th>
                              <th style={{
                                padding: '0.75rem 1rem',
                                textAlign: 'right',
                                color: 'rgba(255, 215, 0, 0.9)',
                                fontWeight: 'bold',
                              }}>GPM %</th>
                              <th style={{
                                padding: '0.75rem 1rem',
                                textAlign: 'center',
                                color: 'rgba(255, 215, 0, 0.9)',
                                fontWeight: 'bold',
                              }}>Trend</th>
                            </tr>
                          </thead>
                          <tbody>
                            {customerGPMData.map((customer, index) => (
                              <motion.tr 
                                key={index} 
                                whileHover={{ 
                                  backgroundColor: 'rgba(255, 215, 0, 0.05)',
                                  cursor: 'pointer'
                                }}
                                onClick={() => handleCustomerSelect(customer.name)}
                                style={{
                                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                                  background: index % 2 === 0 ? 'rgba(20, 20, 30, 0.3)' : 'rgba(30, 30, 40, 0.3)',
                                }}
                              >
                                <td style={{
                                  padding: '0.75rem 1rem',
                                  color: 'rgba(255, 255, 255, 0.9)',
                                }}>{customer.name}</td>
                                <td style={{
                                  padding: '0.75rem 1rem',
                                  color: 'rgba(255, 255, 255, 0.7)',
                                  textAlign: 'right',
                                }}>${customer.revenue.toLocaleString()}</td>
                                <td style={{
                                  padding: '0.75rem 1rem',
                                  color: 'rgba(255, 255, 255, 0.7)',
                                  textAlign: 'right',
                                }}>${customer.cost.toLocaleString()}</td>
                                <td style={{
                                  padding: '0.75rem 1rem',
                                  color: 'rgba(75, 210, 143, 0.9)',
                                  textAlign: 'right',
                                  fontWeight: 'bold',
                                }}>${customer.profit.toLocaleString()}</td>
                                <td style={{
                                  padding: '0.75rem 1rem',
                                  color: customer.gpm > 37 ? 'rgba(75, 210, 143, 0.9)' : 
                                         customer.gpm < 33 ? 'rgba(255, 99, 132, 0.9)' : 
                                         'rgba(255, 215, 0, 0.9)',
                                  textAlign: 'right',
                                  fontWeight: 'bold',
                                }}>{customer.gpm.toFixed(1)}%</td>
                                <td style={{
                                  padding: '0.75rem 1rem',
                                  textAlign: 'center',
                                }}>
                                  <svg width="60" height="20" viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path 
                                      d={`M0,10 ${Array.from({ length: 10 }, (_, i) => 
                                        `L${i * 6 + 6},${10 + (Math.random() * 6 - 3)}`).join(' ')}`} 
                                      stroke={customer.gpm > 37 ? 'rgba(75, 210, 143, 0.9)' : 
                                              customer.gpm < 33 ? 'rgba(255, 99, 132, 0.9)' : 
                                              'rgba(255, 215, 0, 0.9)'}
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <p style={{ 
                        fontSize: '0.8rem', 
                        color: 'rgba(255, 255, 255, 0.5)', 
                        marginTop: '0.75rem',
                        fontStyle: 'italic',
                        textAlign: 'center'
                      }}>
                        Click on a row to view detailed GPM trends for that customer
                      </p>
                    </div>
                    
                    {/* Key Insights Section */}
                    <div style={{
                      background: 'rgba(30, 30, 40, 0.6)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '1rem',
                      padding: '1.5rem',
                      border: '1px solid rgba(255, 215, 0, 0.2)',
                    }}>
                      <h3 style={{ 
                        fontSize: '1.25rem', 
                        marginBottom: '1rem', 
                        color: 'rgba(255, 215, 0, 0.9)',
                      }}>
                        Profitability Insights
                      </h3>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '1.5rem',
                      }}>
                        <div>
                          <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                            Overall Performance
                          </h4>
                          <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.5' }}>
                            Average GPM across all customers is 35.2%, which represents a 2.5% increase from last month. 
                            Top performers include Urban Outfitters (40.0%) and Metro Apparel (39.0%).
                          </p>
                        </div>
                        <div>
                          <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                            Improvement Opportunities
                          </h4>
                          <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.5' }}>
                            Echo Distributors has the lowest GPM at 32.0%. Consider reviewing pricing structure or material 
                            costs for this customer. A 2% improvement would generate an additional $650 in profit.
                          </p>
                        </div>
                        <div>
                          <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                            Recommendations
                          </h4>
                          <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.5' }}>
                            Focus on maintaining high-margin relationships like Urban Outfitters. Consider implementing the cost-saving 
                            measures used with Metro Apparel across other customers to improve overall profitability.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                {/* Other analytics types would go here */}
                {analyticsType !== 'revenue' && analyticsType !== 'agedAr' && analyticsType !== 'gpm' && (
                  <div className="inventory-analytics-container" style={{ padding: '1.5rem' }}>
                    <div className="controls-row" style={{ 
                    display: 'flex',
                      justifyContent: 'space-between', 
                      marginBottom: '1.5rem',
                      gap: '1rem',
                      flexWrap: 'wrap'
                    }}>
                      <div className="view-toggle" style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '0.75rem', color: 'var(--text-secondary)' }}>View:</span>
                        <div className="button-group" style={{ 
                          display: 'flex', 
                          borderRadius: '0.25rem', 
                          overflow: 'hidden',
                          border: '1px solid var(--border-color)' 
                        }}>
                          <button
                            style={{
                              padding: '0.5rem 1rem',
                              background: inventoryView === 'value' ? 'var(--primary-color)' : 'var(--background-secondary)',
                              color: inventoryView === 'value' ? 'white' : 'var(--text-primary)',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                            onClick={() => setInventoryView('value')}
                          >
                            Value
                          </button>
                          <button
                            style={{
                              padding: '0.5rem 1rem',
                              background: inventoryView === 'units' ? 'var(--primary-color)' : 'var(--background-secondary)',
                              color: inventoryView === 'units' ? 'white' : 'var(--text-primary)',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                            onClick={() => setInventoryView('units')}
                          >
                            Units
                          </button>
                        </div>
                      </div>
                      
                      <div className="date-range-selector" style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '0.75rem', color: 'var(--text-secondary)' }}>Period:</span>
                        <div className="button-group" style={{ 
                          display: 'flex', 
                          borderRadius: '0.25rem', 
                          overflow: 'hidden',
                          border: '1px solid var(--border-color)' 
                        }}>
                          <button
                            style={{
                              padding: '0.5rem 1rem',
                              background: dateRange === 'week' ? 'var(--primary-color)' : 'var(--background-secondary)',
                              color: dateRange === 'week' ? 'white' : 'var(--text-primary)',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                            onClick={() => setDateRange('week')}
                          >
                            Week
                          </button>
                          <button
                            style={{
                              padding: '0.5rem 1rem',
                              background: dateRange === 'month' ? 'var(--primary-color)' : 'var(--background-secondary)',
                              color: dateRange === 'month' ? 'white' : 'var(--text-primary)',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                            onClick={() => setDateRange('month')}
                          >
                            Month
                          </button>
                          <button
                            style={{
                              padding: '0.5rem 1rem',
                              background: dateRange === 'year' ? 'var(--primary-color)' : 'var(--background-secondary)',
                              color: dateRange === 'year' ? 'white' : 'var(--text-primary)',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                            onClick={() => setDateRange('year')}
                          >
                            Year
                          </button>
                        </div>
                      </div>
                      
                      <div className="search-container" style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                          type="text"
                          placeholder="Search inventory..."
                          value={inventorySearch}
                          onChange={(e) => setInventorySearch(e.target.value)}
                          style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.25rem',
                            border: '1px solid var(--border-color)',
                            background: 'var(--background-secondary)',
                            color: 'var(--text-primary)'
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="chart-container" style={{ 
                      height: '280px', 
                      marginBottom: '2rem',
                      background: 'var(--background-tertiary)',
                      borderRadius: '0.5rem',
                      padding: '1rem'
                    }}>
                      <Line
                        data={generateInventoryData(dateRange, inventoryView)}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                              grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                              },
                              ticks: {
                                color: 'rgba(255, 255, 255, 0.7)',
                                callback: (value) => {
                                  return inventoryView === 'value' 
                                    ? `$${Number(value).toLocaleString()}`
                                    : value.toLocaleString();
                                }
                              }
                            },
                            x: {
                              grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                              },
                              ticks: {
                                color: 'rgba(255, 255, 255, 0.7)'
                              }
                            }
                          },
                          plugins: {
                            tooltip: {
                              mode: 'index',
                              intersect: false,
                              callbacks: {
                                label: function(context) {
                                  let label = context.dataset.label || '';
                                  if (label) {
                                    label += ': ';
                                  }
                                  if (context.parsed.y !== null) {
                                    label += inventoryView === 'value'
                                      ? `$${context.parsed.y.toLocaleString()}`
                                      : context.parsed.y.toLocaleString();
                                  }
                                  return label;
                                }
                              }
                            },
                            legend: {
                              display: true,
                              position: 'top',
                              labels: {
                                color: 'rgba(255, 255, 255, 0.7)'
                              }
                            }
                          }
                        }}
                      />
                    </div>
                    
                    <div className="inventory-table" style={{ 
                      background: 'var(--background-tertiary)',
                      borderRadius: '0.5rem',
                      overflow: 'hidden'
                    }}>
                      <div className="table-header" style={{ 
                        display: 'grid',
                        gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr 1fr',
                        padding: '1rem',
                        borderBottom: '1px solid var(--border-color)',
                        fontWeight: 'bold',
                        color: 'var(--text-secondary)'
                      }}>
                        <div 
                          className="header-cell"
                          onClick={() => {
                            if (inventorySortBy === 'sku') {
                              setInventorySortDesc(!inventorySortDesc);
                            } else {
                              setInventorySortBy('sku');
                              setInventorySortDesc(false);
                            }
                          }}
                          style={{ 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          SKU
                          {inventorySortBy === 'sku' && (
                            <span>{inventorySortDesc ? '↓' : '↑'}</span>
                          )}
                        </div>
                        <div 
                          className="header-cell"
                          onClick={() => {
                            if (inventorySortBy === 'name') {
                              setInventorySortDesc(!inventorySortDesc);
                            } else {
                              setInventorySortBy('name');
                              setInventorySortDesc(false);
                            }
                          }}
                          style={{ 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          Product Name
                          {inventorySortBy === 'name' && (
                            <span>{inventorySortDesc ? '↓' : '↑'}</span>
                          )}
                        </div>
                        <div 
                          className="header-cell"
                          onClick={() => {
                            if (inventorySortBy === 'inventory') {
                              setInventorySortDesc(!inventorySortDesc);
                            } else {
                              setInventorySortBy('inventory');
                              setInventorySortDesc(true);
                            }
                          }}
                          style={{ 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            justifyContent: 'flex-end'
                          }}
                        >
                          Inventory
                          {inventorySortBy === 'inventory' && (
                            <span>{inventorySortDesc ? '↓' : '↑'}</span>
                          )}
                        </div>
                        <div 
                          className="header-cell"
                          onClick={() => {
                            if (inventorySortBy === 'unitValue') {
                              setInventorySortDesc(!inventorySortDesc);
                            } else {
                              setInventorySortBy('unitValue');
                              setInventorySortDesc(true);
                            }
                          }}
                          style={{ 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            justifyContent: 'flex-end'
                          }}
                        >
                          Unit Value
                          {inventorySortBy === 'unitValue' && (
                            <span>{inventorySortDesc ? '↓' : '↑'}</span>
                          )}
                        </div>
                        <div 
                          className="header-cell"
                          onClick={() => {
                            if (inventorySortBy === 'totalValue') {
                              setInventorySortDesc(!inventorySortDesc);
                            } else {
                              setInventorySortBy('totalValue');
                              setInventorySortDesc(true);
                            }
                          }}
                          style={{ 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            justifyContent: 'flex-end'
                          }}
                        >
                          Total Value
                          {inventorySortBy === 'totalValue' && (
                            <span>{inventorySortDesc ? '↓' : '↑'}</span>
                          )}
                        </div>
                        <div 
                          className="header-cell"
                          onClick={() => {
                            if (inventorySortBy === 'palletCount') {
                              setInventorySortDesc(!inventorySortDesc);
                            } else {
                              setInventorySortBy('palletCount');
                              setInventorySortDesc(true);
                            }
                          }}
                          style={{ 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            justifyContent: 'flex-end'
                          }}
                        >
                          Pallets
                          {inventorySortBy === 'palletCount' && (
                            <span>{inventorySortDesc ? '↓' : '↑'}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="table-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {inventoryData
                          .filter(item => {
                            // Filter based on search term
                            if (!inventorySearch) return true;
                            const searchLower = inventorySearch.toLowerCase();
                            return (
                              item.sku.toLowerCase().includes(searchLower) ||
                              item.name.toLowerCase().includes(searchLower)
                            );
                          })
                          .sort((a, b) => {
                            // Sort based on selected sort criteria
                            let comparison = 0;
                            
                            switch (inventorySortBy) {
                              case 'sku':
                                comparison = a.sku.localeCompare(b.sku);
                                break;
                              case 'name':
                                comparison = a.name.localeCompare(b.name);
                                break;
                              case 'inventory':
                                comparison = a.inventory - b.inventory;
                                break;
                              case 'unitValue':
                                comparison = a.unitValue - b.unitValue;
                                break;
                              case 'totalValue':
                                comparison = a.totalValue - b.totalValue;
                                break;
                              case 'palletCount':
                                comparison = a.palletCount - b.palletCount;
                                break;
                              default:
                                comparison = 0;
                            }
                            
                            return inventorySortDesc ? -comparison : comparison;
                          })
                          .map((item, index) => (
                            <div 
                              key={item.sku} 
                              className="table-row" 
                              style={{ 
                                display: 'grid',
                                gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr 1fr',
                                padding: '0.75rem 1rem',
                                borderBottom: '1px solid var(--border-color)',
                                backgroundColor: index % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.02)'
                              }}
                            >
                              <div className="cell">{item.sku}</div>
                              <div className="cell">{item.name}</div>
                              <div className="cell" style={{ textAlign: 'right' }}>{item.inventory.toLocaleString()}</div>
                              <div className="cell" style={{ textAlign: 'right' }}>${item.unitValue.toFixed(2)}</div>
                              <div className="cell" style={{ textAlign: 'right' }}>${item.totalValue.toLocaleString()}</div>
                              <div className="cell" style={{ textAlign: 'right' }}>{item.palletCount}</div>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                )}
      </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Reminder Modal */}
      <AnimatePresence>
        {showReminderModal && (
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
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(5px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
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
                maxWidth: '500px',
                padding: '2rem',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ 
                  fontSize: '1.5rem', 
                  fontFamily: "'Rajdhani', sans-serif",
                  background: reminderType === 'nice' 
                    ? 'linear-gradient(to right, #4BD28F, #2AAA6E)' 
                    : 'linear-gradient(to right, #FF6384, #FF3366)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {reminderType === 'nice' ? 'Send Friendly Reminder' : 'Send Final Notice'}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeReminderModal}
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
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.button>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>
                  You are sending a payment reminder to:
                </p>
                <div style={{ 
                  padding: '1rem',
                  background: 'rgba(30, 30, 40, 0.6)',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  marginBottom: '1rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>Customer:</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>{reminderCustomer}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>Order:</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>{reminderOrderId}</span>
                  </div>
                </div>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ 
                  fontSize: '1rem', 
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '0.75rem'
                }}>
                  Reminder Message
                </h3>
                <div style={{ 
                  padding: '1rem',
                  background: 'rgba(30, 30, 40, 0.6)',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}>
                  <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>
                    Dear {reminderCustomer},
                  </p>
                  {reminderType === 'nice' ? (
                    <>
                  <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>
                        Just a friendly reminder that payment for order {reminderOrderId} is currently past due. 
                        We understand that things can slip through the cracks sometimes and would appreciate your attention to this matter at your earliest convenience.
                  </p>
                  <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                        Please feel free to contact our accounts department if you have any questions or need assistance with payment options.
                      </p>
                      <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', marginTop: '0.5rem' }}>
                        Thank you for your continued business!
                      </p>
                    </>
                  ) : (
                    <>
                      <p style={{ fontSize: '0.875rem', color: 'rgba(255, 99, 132, 0.9)', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        This is a FINAL NOTICE regarding payment for order {reminderOrderId}, which is SERIOUSLY PAST DUE. 
                      </p>
                      <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>
                        Failure to remit payment within 48 HOURS will result in your account being sent to our collections department, 
                        potential legal action, and immediate suspension of all business relations.
                      </p>
                      <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                        Contact our accounts department IMMEDIATELY to resolve this matter before further action is taken.
                      </p>
                      <p style={{ fontSize: '0.875rem', color: 'rgba(255, 99, 132, 0.9)', marginTop: '0.5rem', fontStyle: 'italic' }}>
                        This communication will be documented in our records.
                      </p>
                    </>
                  )}
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={closeReminderModal}
                  style={{
                    padding: '0.75rem 1.25rem',
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '0.5rem',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ 
                    scale: 1.03,
                    backgroundColor: reminderType === 'nice' ? 'rgba(75, 210, 143, 0.3)' : 'rgba(255, 99, 132, 0.3)', 
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={sendReminder}
                  style={{
                    padding: '0.75rem 1.25rem',
                    background: reminderType === 'nice' ? 'rgba(75, 210, 143, 0.2)' : 'rgba(255, 99, 132, 0.2)',
                    border: reminderType === 'nice' ? '1px solid rgba(75, 210, 143, 0.5)' : '1px solid rgba(255, 99, 132, 0.5)',
                    borderRadius: '0.5rem',
                    color: reminderType === 'nice' ? 'rgba(75, 210, 143, 0.9)' : 'rgba(255, 99, 132, 0.9)',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6L12 12L20 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20 6H4V18H20V6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {reminderType === 'nice' ? 'Send Friendly Reminder' : 'Send Final Notice'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Success Notification Toast */}
      <AnimatePresence>
        {showSuccessNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              background: 'rgba(20, 20, 30, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '0.5rem',
              padding: '1rem 1.5rem',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
              border: notificationMessage.includes('Friendly') 
                ? '1px solid rgba(75, 210, 143, 0.3)' 
                : '1px solid rgba(255, 99, 132, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              zIndex: 1100,
              maxWidth: '400px',
            }}
          >
            <div style={{
              background: notificationMessage.includes('Friendly')
                ? 'rgba(75, 210, 143, 0.2)'
                : 'rgba(255, 99, 132, 0.2)',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: notificationMessage.includes('Friendly')
                ? 'rgba(75, 210, 143, 0.9)'
                : 'rgba(255, 99, 132, 0.9)',
              flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {notificationMessage.includes('Friendly') ? (
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                ) : (
                  <path d="M12 9v5M12 17.01l.01-.011M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                )}
              </svg>
            </div>
            <div>
              <h4 style={{ 
                fontSize: '0.875rem', 
                fontWeight: 'bold', 
                marginBottom: '0.25rem',
                color: notificationMessage.includes('Friendly')
                  ? 'rgba(75, 210, 143, 0.9)'
                  : 'rgba(255, 99, 132, 0.9)',
              }}>
                {notificationMessage.includes('Friendly') ? 'Success' : 'Notice Sent'}
              </h4>
              <p style={{ 
                fontSize: '0.8125rem', 
                color: 'rgba(255, 255, 255, 0.9)',
                margin: 0,
              }}>
                {notificationMessage}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowSuccessNotification(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                padding: '0.25rem',
                marginLeft: 'auto',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard; 