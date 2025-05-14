import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
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

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  usageYTD: number;
  usageTotal: number;
  usageMonthly: number;
  projectedMonths: number;
  status: 'In Stock' | 'Low Stock' | 'Warning' | 'Out of Stock';
  sku: string;
  isCritical: boolean;
  image: string;
  quantityAlt?: number; // Alternative quantity for alignment
  needsAlignment?: boolean; // Flag to indicate if alignment is needed
  note?: string; // Add note field
}

interface ProductionOrder {
  orderId: string;
  pvNumber: string; // Added for 5-digit PV number
  productId: string;
  productName: string;
  quantity: number;
  orderDate: string;
  completionDate: string;
  status: 'In Progress' | 'Pending' | 'Delayed' | 'Completed';
  isCritical: boolean;
}

const Inventory: React.FC = () => {
  // Sample inventory data
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([
    { id: 'SYK-KIT-PRO-018', name: 'Carhartt Gilliam Jacket', category: 'Outerwear', quantity: 150, price: 89.99, sku: 'SYK-KIT-PRO-018', usageYTD: 720, usageTotal: 1850, usageMonthly: 90, projectedMonths: 1.7, status: 'Low Stock', isCritical: false, image: 'https://images.unsplash.com/photo-1559551409-dadc959f76b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 'SYK-KIT-PRO-019', name: 'Cutter and Buck Men\'s Peshastin Fleece Recycled Half-Zip Pullover', category: 'Outerwear', quantity: 150, price: 74.99, sku: 'SYK-KIT-PRO-019', usageYTD: 580, usageTotal: 1200, usageMonthly: 70, projectedMonths: 2.1, status: 'Low Stock', isCritical: false, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 'SYK-KIT-PRO-020', name: 'OGIO Rogue Pack', category: 'Bags', quantity: 50, price: 59.99, sku: 'SYK-KIT-PRO-020', usageYTD: 280, usageTotal: 620, usageMonthly: 35, projectedMonths: 1.4, status: 'Warning', isCritical: true, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 'SYK-KIT-PRO-017', name: 'Helly Hansen Men\'s Manchester Rain Jacket', category: 'Outerwear', quantity: 55, price: 119.99, sku: 'SYK-KIT-PRO-017', usageYTD: 310, usageTotal: 720, usageMonthly: 40, projectedMonths: 1.4, status: 'Warning', isCritical: true, image: 'https://images.unsplash.com/photo-1545594861-3bbef5b18624?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 'SYK-KIT-PRO-022', name: 'Imperial The Habanero Performance Rope Cap', category: 'Headwear', quantity: 50, price: 29.99, sku: 'SYK-KIT-PRO-022', usageYTD: 380, usageTotal: 920, usageMonthly: 45, projectedMonths: 1.1, status: 'Warning', isCritical: true, image: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 'SYK-KIT-PRO-016', name: 'Helly Hansen Women\'s Aden Long Coat', category: 'Outerwear', quantity: 76, price: 149.99, sku: 'SYK-KIT-PRO-016', usageYTD: 220, usageTotal: 450, usageMonthly: 30, projectedMonths: 2.5, status: 'Low Stock', isCritical: false, image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 'SYK-KIT-PRO-015', name: 'Cutter and Buck Women\'s Peshastin Fleece Recycled Half-Zip Pullover', category: 'Outerwear', quantity: 120, price: 74.99, sku: 'SYK-KIT-PRO-015', usageYTD: 410, usageTotal: 980, usageMonthly: 50, projectedMonths: 2.4, status: 'Low Stock', isCritical: false, image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 'SYK-KIT-PRO-024', name: 'Richardson Snapback Trucker Cap', category: 'Headwear', quantity: 50, price: 24.99, sku: 'SYK-KIT-PRO-024', usageYTD: 520, usageTotal: 1250, usageMonthly: 60, projectedMonths: 0.8, status: 'Warning', isCritical: true, image: 'https://images.unsplash.com/photo-1534215754734-18e55d13e346?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 'SYK-KIT-PRO-014', name: 'Carhartt Women\'s Gilliam Jacket', category: 'Outerwear', quantity: 80, price: 89.99, sku: 'SYK-KIT-PRO-014', usageYTD: 310, usageTotal: 760, usageMonthly: 40, projectedMonths: 2.0, status: 'Low Stock', isCritical: false, image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 'SYK-KIT-PRO-025', name: 'Cap America Relaxed Golf Dad Hat', category: 'Headwear', quantity: 45, price: 19.99, sku: 'SYK-KIT-PRO-025', usageYTD: 280, usageTotal: 650, usageMonthly: 35, projectedMonths: 1.3, status: 'Warning', isCritical: true, image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 'SYK-KIT-PRO-013', name: 'OGIO Regain Polo', category: 'Shirts', quantity: 240, price: 54.99, sku: 'SYK-KIT-PRO-013', usageYTD: 850, usageTotal: 2100, usageMonthly: 110, projectedMonths: 2.2, status: 'Low Stock', isCritical: false, image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 'SYK-KIT-PRO-012', name: 'Callaway Core Performance Polo', category: 'Shirts', quantity: 220, price: 49.99, sku: 'SYK-KIT-PRO-012', usageYTD: 780, usageTotal: 1950, usageMonthly: 100, projectedMonths: 2.2, status: 'Low Stock', isCritical: false, image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 'SYK-KIT-PRO-021', name: 'Carhartt 28L Foundry Series Dual-Compartment Backpack', category: 'Bags', quantity: 50, price: 99.99, sku: 'SYK-KIT-PRO-021', usageYTD: 180, usageTotal: 420, usageMonthly: 25, projectedMonths: 2.0, status: 'Low Stock', isCritical: false, image: 'https://images.unsplash.com/photo-1622560480654-d96214fdc887?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 'SYK-KIT-PRO-026', name: '32 oz. CamelBak Chute Mag Copper VSS', category: 'Drinkware', quantity: 50, price: 39.99, sku: 'SYK-KIT-PRO-026', usageYTD: 340, usageTotal: 820, usageMonthly: 45, projectedMonths: 1.1, status: 'Warning', isCritical: true, image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 'SYK-KIT-PRO-027', name: 'Moleskine Hard Cover Ruled Large Notebook', category: 'Office', quantity: 50, price: 22.99, sku: 'SYK-KIT-PRO-027', usageYTD: 260, usageTotal: 680, usageMonthly: 35, projectedMonths: 1.4, status: 'Warning', isCritical: true, image: 'https://images.unsplash.com/photo-1544164871-b780de15012a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 'SYK-KIT-PRO-028', name: 'Irintana Comfort Pen', category: 'Office', quantity: 100, price: 14.99, sku: 'SYK-KIT-PRO-028', usageYTD: 520, usageTotal: 1250, usageMonthly: 65, projectedMonths: 1.5, status: 'Warning', isCritical: false, image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 'SYK-KIT-PRO-029', name: 'OtterBox Commuter Series with MagSafe (iPhone 15/14/13)', category: 'Tech', quantity: 25, price: 49.99, sku: 'SYK-KIT-PRO-029', usageYTD: 180, usageTotal: 420, usageMonthly: 20, projectedMonths: 1.3, status: 'Warning', isCritical: true, image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 'SYK-KIT-PRO-011', name: 'Callaway Broken Stripe Polo', category: 'Shirts', quantity: 110, price: 59.99, sku: 'SYK-KIT-PRO-011', usageYTD: 480, usageTotal: 1150, usageMonthly: 60, projectedMonths: 1.8, status: 'Low Stock', isCritical: false, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 'SYK-KIT-PRO-010', name: 'Callaway Ladies Broken Stripe Polo', category: 'Shirts', quantity: 70, price: 59.99, sku: 'SYK-KIT-PRO-010', usageYTD: 290, usageTotal: 680, usageMonthly: 35, projectedMonths: 2.0, status: 'Low Stock', isCritical: false, image: 'https://images.unsplash.com/photo-1556763273-6174e851f35c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 'SYK-KIT-PRO-009', name: 'OGIO Women\'s Regain Polo', category: 'Shirts', quantity: 160, price: 54.99, sku: 'SYK-KIT-PRO-009', usageYTD: 560, usageTotal: 1350, usageMonthly: 70, projectedMonths: 2.3, status: 'Low Stock', isCritical: false, image: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 'SYK-KIT-PRO-008', name: 'Callaway Ladies Tulip Sleeve Polo', category: 'Shirts', quantity: 105, price: 54.99, sku: 'SYK-KIT-PRO-008', usageYTD: 380, usageTotal: 920, usageMonthly: 50, projectedMonths: 2.1, status: 'Low Stock', isCritical: false, image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 'SYK-KIT-PRO-006', name: 'Men\'s Callaway Ventilated Polo, Black/Quiet Shade; Med. Blue; Peacoat Navy (S-4XL)', category: 'Shirts', quantity: 50, price: 64.99, sku: 'SYK-KIT-PRO-006', usageYTD: 330, usageTotal: 840, usageMonthly: 40, projectedMonths: 1.3, status: 'Warning', isCritical: true, image: 'https://images.unsplash.com/photo-1571455786673-9d9d6c194f90?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 'SYK-KIT-PRO-001', name: '23 oz Chenab Tritan Plastic Water Bottle', category: 'Drinkware', quantity: 10, price: 18.99, sku: 'SYK-KIT-PRO-001', usageYTD: 270, usageTotal: 640, usageMonthly: 35, projectedMonths: 0.3, status: 'Out of Stock', isCritical: true, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 'SYK-KIT-PRO-005', name: 'Port Authority Women\'s Core Soft Shell Jacket', category: 'Outerwear', quantity: 7, price: 79.99, sku: 'SYK-KIT-PRO-005', usageYTD: 130, usageTotal: 320, usageMonthly: 15, projectedMonths: 0.5, status: 'Warning', isCritical: true, image: 'https://images.unsplash.com/photo-1548126032-079a0fb0099d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 'SYK-KIT-PRO-004', name: 'Port Authority Core Soft Shell Jacket', category: 'Outerwear', quantity: 20, price: 79.99, sku: 'SYK-KIT-PRO-004', usageYTD: 160, usageTotal: 380, usageMonthly: 20, projectedMonths: 1.0, status: 'Warning', isCritical: true, image: 'https://images.unsplash.com/photo-1545594861-3bbef5b18624?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 'SYK-KIT-PRO-002', name: 'OGIO - Roamer Pack', category: 'Bags', quantity: 9, price: 49.99, sku: 'SYK-KIT-PRO-002', usageYTD: 140, usageTotal: 320, usageMonthly: 17, projectedMonths: 0.5, status: 'Warning', isCritical: true, image: 'https://images.unsplash.com/photo-1577733966973-d680bffd2e80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
  ]);

  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>('All');
  // Update the statuses array to use "All Status" instead of "All"
  const displayStatuses = ['All Status', 'In Stock', 'Low Stock', 'Warning', 'Out of Stock'];
  const statuses = ['All', 'In Stock', 'Low Stock', 'Warning', 'Out of Stock'];
  
  // Helper functions to convert between display values and actual values
  const getStatusValue = (display: string) => display === 'All Status' ? 'All' : display;
  const getStatusDisplay = (value: string) => value === 'All' ? 'All Status' : value;

  // Search state
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Customer filter state
  const [customerFilter, setCustomerFilter] = useState<string>('All Customers');
  const customers = ['All Customers', 'Stryker', 'Republic Airways', 'Trane', 'New Season'];

  // View mode toggle (Available/Production)
  const [viewMode, setViewMode] = useState<'available' | 'production' | 'alignment'>('available');

  // Critical items filter
  const [showCriticalOnly, setShowCriticalOnly] = useState<boolean>(false);

  // Sort config
  const [sortConfig, setSortConfig] = useState<{
    key: keyof InventoryItem;
    direction: 'ascending' | 'descending';
  } | null>(null);

  // Add state for the hover image
  const [hoveredItem, setHoveredItem] = useState<InventoryItem | null>(null);

  // Reorder state
  const [isReorderMode, setIsReorderMode] = useState<boolean>(false);
  const [reorderItem, setReorderItem] = useState<string | null>(null);
  const [reorderQuantities, setReorderQuantities] = useState<Record<string, number>>({});
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [confirmedItem, setConfirmedItem] = useState<InventoryItem | null>(null);
  const [artworkConfirmed, setArtworkConfirmed] = useState<boolean>(false);

  // Analytics modal state
  const [showAnalytics, setShowAnalytics] = useState<boolean>(false);
  const [analyticsItems, setAnalyticsItems] = useState<InventoryItem[]>([]); // Changed to array for multiple items
  const [selectedDateRange, setSelectedDateRange] = useState<string>('month');
  const [selectedMetric, setSelectedMetric] = useState<string>('usage');
  const [showAnalyticsSelector, setShowAnalyticsSelector] = useState<boolean>(false);
  const [analyticsSearchTerm, setAnalyticsSearchTerm] = useState<string>('');
  
  // New state for comparison feature
  const [comparisonItems, setComparisonItems] = useState<InventoryItem[]>([]);
  const [showComparisonSelector, setShowComparisonSelector] = useState<boolean>(false);
  const [comparisonSearchTerm, setComparisonSearchTerm] = useState<string>('');
  
  // Sample sales data by region
  const salesByRegion = [
    { region: 'North America', value: 42 },
    { region: 'Europe', value: 29 },
    { region: 'Asia', value: 15 },
    { region: 'South America', value: 8 },
    { region: 'Africa', value: 4 },
    { region: 'Australia', value: 2 },
  ];

  // Sample heatmap data for different regions
  const heatmapData = [
    { region: 'North America', subregions: [
      { id: 'us-west', name: 'US West', value: 35, lat: 37.7749, lng: -122.4194 },
      { id: 'us-midwest', name: 'US Midwest', value: 28, lat: 41.8781, lng: -87.6298 },
      { id: 'us-east', name: 'US East', value: 42, lat: 40.7128, lng: -74.0060 },
      { id: 'us-south', name: 'US South', value: 31, lat: 29.7604, lng: -95.3698 },
      { id: 'canada-east', name: 'Canada East', value: 24, lat: 43.6532, lng: -79.3832 },
      { id: 'canada-west', name: 'Canada West', value: 18, lat: 49.2827, lng: -123.1207 },
      { id: 'mexico', name: 'Mexico', value: 15, lat: 19.4326, lng: -99.1332 },
    ]},
    { region: 'Europe', subregions: [
      { id: 'uk', name: 'United Kingdom', value: 38, lat: 51.5074, lng: -0.1278 },
      { id: 'france', name: 'France', value: 29, lat: 48.8566, lng: 2.3522 },
      { id: 'germany', name: 'Germany', value: 34, lat: 52.5200, lng: 13.4050 },
      { id: 'italy', name: 'Italy', value: 26, lat: 41.9028, lng: 12.4964 },
      { id: 'spain', name: 'Spain', value: 22, lat: 40.4168, lng: -3.7038 },
      { id: 'scandinavia', name: 'Scandinavia', value: 19, lat: 59.3293, lng: 18.0686 },
      { id: 'eastern-europe', name: 'Eastern Europe', value: 16, lat: 52.2297, lng: 21.0122 },
    ]},
    { region: 'Asia', subregions: [
      { id: 'japan', name: 'Japan', value: 37, lat: 35.6762, lng: 139.6503 },
      { id: 'china-east', name: 'China East', value: 41, lat: 31.2304, lng: 121.4737 },
      { id: 'china-south', name: 'China South', value: 33, lat: 22.3193, lng: 114.1694 },
      { id: 'korea', name: 'South Korea', value: 26, lat: 37.5665, lng: 126.9780 },
      { id: 'india-north', name: 'India North', value: 22, lat: 28.6139, lng: 77.2090 },
      { id: 'india-south', name: 'India South', value: 18, lat: 13.0827, lng: 80.2707 },
      { id: 'southeast-asia', name: 'Southeast Asia', value: 25, lat: 1.3521, lng: 103.8198 },
    ]},
    { region: 'Australia & Oceania', subregions: [
      { id: 'australia-east', name: 'Australia East', value: 28, lat: -33.8688, lng: 151.2093 },
      { id: 'australia-west', name: 'Australia West', value: 16, lat: -31.9505, lng: 115.8605 },
      { id: 'new-zealand', name: 'New Zealand', value: 12, lat: -36.8509, lng: 174.7645 },
    ]},
    { region: 'South America', subregions: [
      { id: 'brazil', name: 'Brazil', value: 22, lat: -23.5505, lng: -46.6333 },
      { id: 'argentina', name: 'Argentina', value: 16, lat: -34.6037, lng: -58.3816 },
      { id: 'colombia', name: 'Colombia', value: 12, lat: 4.7110, lng: -74.0721 },
      { id: 'chile', name: 'Chile', value: 9, lat: -33.4489, lng: -70.6693 },
    ]},
    { region: 'Africa', subregions: [
      { id: 'south-africa', name: 'South Africa', value: 18, lat: -33.9249, lng: 18.4241 },
      { id: 'egypt', name: 'Egypt', value: 14, lat: 30.0444, lng: 31.2357 },
      { id: 'nigeria', name: 'Nigeria', value: 11, lat: 9.0820, lng: 8.6753 },
      { id: 'morocco', name: 'Morocco', value: 8, lat: 31.7917, lng: -7.0926 },
    ]},
  ];

  // State for heatmap interactions
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [hoveredSubregion, setHoveredSubregion] = useState<any>(null);

  // Production orders data
  const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>([
    { 
      orderId: 'RO-24052201', 
      pvNumber: '12345',
      productId: 'SYK-KIT-PRO-017', 
      productName: 'Helly Hansen Men\'s Manchester Rain Jacket', 
      quantity: 150, 
      orderDate: '2024-04-15', 
      completionDate: '2024-06-20', 
      status: 'In Progress',
      isCritical: true
    },
    { 
      orderId: 'RO-24052105', 
      pvNumber: '54321',
      productId: 'SYK-KIT-PRO-022', 
      productName: 'Imperial The Habanero Performance Rope Cap', 
      quantity: 300, 
      orderDate: '2024-04-25', 
      completionDate: '2024-06-10', 
      status: 'In Progress',
      isCritical: false
    },
    { 
      orderId: 'RO-24050987', 
      pvNumber: '78901',
      productId: 'SYK-KIT-PRO-001', 
      productName: '23 oz Chenab Tritan Plastic Water Bottle', 
      quantity: 500, 
      orderDate: '2024-04-10', 
      completionDate: '2024-05-25', 
      status: 'Delayed',
      isCritical: true
    },
    { 
      orderId: 'RO-24050654', 
      pvNumber: '21098',
      productId: 'SYK-KIT-PRO-020', 
      productName: 'OGIO Rogue Pack', 
      quantity: 120, 
      orderDate: '2024-04-28', 
      completionDate: '2024-07-05', 
      status: 'Pending',
      isCritical: false
    },
    { 
      orderId: 'RO-24050432', 
      pvNumber: '34567',
      productId: 'SYK-KIT-PRO-026', 
      productName: '32 oz. CamelBak Chute Mag Copper VSS', 
      quantity: 250, 
      orderDate: '2024-04-18', 
      completionDate: '2024-06-12', 
      status: 'In Progress',
      isCritical: false
    },
  ]);

  // Cancellation modal state
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
  
  // Completion modal state
  const [completionModal, setCompletionModal] = useState<{
    visible: boolean;
    orderId: string;
    orderName: string;
  }>({
    visible: false,
    orderId: '',
    orderName: ''
  });

  // Apply filters and sorting
  const filteredData = React.useMemo(() => {
    let filtered = [...inventoryData];
    
    // Apply status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    // Apply critical filter if enabled
    if (showCriticalOnly) {
      filtered = filtered.filter(item => item.isCritical);
    }
    
    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(
        item => item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
               item.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        // Add null/undefined check for the properties
        const valueA = a[sortConfig.key];
        const valueB = b[sortConfig.key];
        
        // Handle undefined or null values
        if (valueA === undefined && valueB === undefined) return 0;
        if (valueA === undefined) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valueB === undefined) return sortConfig.direction === 'ascending' ? 1 : -1;
        
        // Compare values
        if (valueA < valueB) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filtered;
  }, [inventoryData, statusFilter, searchTerm, sortConfig, showCriticalOnly]);

  const requestSort = (key: keyof InventoryItem) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Inventory analytics
  const totalItems = inventoryData.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockCount = inventoryData.filter(item => item.status === 'Low Stock' || item.status === 'Warning').length;
  const criticalCount = inventoryData.filter(item => item.isCritical).length;
  const outOfStockCount = inventoryData.filter(item => item.status === 'Out of Stock').length;
  const totalInventoryValue = inventoryData.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Toggle reorder mode for a specific item
  const toggleReorderMode = (itemId: string) => {
    if (reorderItem === itemId) {
      // If clicking on the same item, toggle off reorder mode
      setReorderItem(null);
      setIsReorderMode(false);
    } else {
      // If clicking on a different item, set it as the current reorder item
      setReorderItem(itemId);
      setIsReorderMode(true);
      
      // Initialize reorder quantity if not already set
      if (!reorderQuantities[itemId]) {
        const initialReorderQty = calculateRecommendedReorder(
          inventoryData.find(item => item.id === itemId)?.usageMonthly || 0
        );
        setReorderQuantities(prev => ({
          ...prev,
          [itemId]: initialReorderQty
        }));
      }
    }
  };

  // Calculate a recommended reorder quantity (3 months of usage)
  const calculateRecommendedReorder = (monthlyUsage: number) => {
    return Math.ceil(monthlyUsage * 3);
  };

  // Handle reorder quantity change
  const handleReorderQuantityChange = (itemId: string, value: string) => {
    const quantity = parseInt(value) || 0;
    setReorderQuantities(prev => ({
      ...prev,
      [itemId]: quantity
    }));
  };

  // Confirm reorder
  const confirmReorder = (item: InventoryItem) => {
    setConfirmedItem(item);
    setShowConfirmation(true);
  };

  // Process confirmed reorder
  const processReorder = () => {
    if (!confirmedItem || !reorderItem) return;
    
    // Update inventory with new quantity
    const updatedInventory = inventoryData.map(item => {
      if (item.id === reorderItem) {
        const newQuantity = item.quantity + reorderQuantities[reorderItem];
        
        // Ensure status is one of the allowed literal types
        let newStatus: 'In Stock' | 'Low Stock' | 'Warning' | 'Out of Stock';
        if (newQuantity > item.usageMonthly * 6) {
          newStatus = 'In Stock';
        } else if (newQuantity > item.usageMonthly * 3) {
          newStatus = 'Low Stock';
        } else if (newQuantity > 0) {
          newStatus = 'Warning';
        } else {
          newStatus = 'Out of Stock';
        }
        
        return {
          ...item,
          quantity: newQuantity,
          status: newStatus,
          projectedMonths: newQuantity / item.usageMonthly
        };
      }
      return item;
    });
    
    setInventoryData(updatedInventory);
    setShowConfirmation(false);
    setReorderItem(null);
    setIsReorderMode(false);
    setConfirmedItem(null);
    setArtworkConfirmed(false);
  };

  // Cancel reorder
  const cancelReorder = () => {
    setShowConfirmation(false);
    setReorderItem(null);
    setIsReorderMode(false);
    setConfirmedItem(null);
    setArtworkConfirmed(false);
  };

  // Sample time-series data
  const generateTimeSeriesData = (item: InventoryItem | null, dateRange: string, metric: string) => {
    if (!item) return { labels: [], datasets: [] };
    
    let labels: string[] = [];
    
    if (dateRange === 'week') {
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    } else if (dateRange === 'month') {
      labels = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
    } else {
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    }

    // Function to generate data for an item
    const generateDataForItem = (currentItem: InventoryItem, color: string) => {
      let usageData: number[] = [];
      let salesData: number[] = [];
      let revenueData: number[] = [];
      
      // Use item's ID as a seed to generate consistent data
      const seed = currentItem.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      
      // Helper function to generate a deterministic "random" number between min and max
      const pseudoRandom = (index: number, min: number, max: number) => {
        // Use a simple hash function to get a value between 0 and 1
        const value = Math.sin(seed * (index + 1)) * 10000;
        const normalized = Math.abs(value - Math.floor(value)); // Value between 0 and 1
        return min + normalized * (max - min);
      };
      
      if (dateRange === 'week') {
        // Generate deterministic data based on the item properties
        const dailyUsage = Math.round(currentItem.usageMonthly / 30);
        usageData = labels.map((_, index) => 
          Math.max(0, Math.round(dailyUsage * (0.7 + pseudoRandom(index, 0, 0.6))))
        );
        salesData = usageData.map((u, index) => 
          Math.round(u * (0.9 + pseudoRandom(index, 0, 0.2)))
        );
        revenueData = salesData.map(s => Math.round(s * currentItem.price));
      } else if (dateRange === 'month') {
        const dailyUsage = Math.round(currentItem.usageMonthly / 30);
        usageData = labels.map((_, index) => 
          Math.max(0, Math.round(dailyUsage * (0.7 + pseudoRandom(index, 0, 0.6))))
        );
        salesData = usageData.map((u, index) => 
          Math.round(u * (0.9 + pseudoRandom(index, 0, 0.2)))
        );
        revenueData = salesData.map(s => Math.round(s * currentItem.price));
      } else {
        const monthlyUsage = currentItem.usageMonthly;
        usageData = labels.map((_, index) => 
          Math.max(0, Math.round(monthlyUsage * (0.7 + pseudoRandom(index, 0, 0.6))))
        );
        salesData = usageData.map((u, index) => 
          Math.round(u * (0.9 + pseudoRandom(index, 0, 0.2)))
        );
        revenueData = salesData.map(s => Math.round(s * currentItem.price));
      }
      
      // Return appropriate dataset based on selected metric
      if (metric === 'usage') {
        return {
          label: currentItem.name,
          data: usageData,
          borderColor: color,
          backgroundColor: color.replace('1)', '0.1)'),
          tension: 0.4,
          fill: false, // Changed to false for better comparison
        };
      } else if (metric === 'sales') {
        return {
          label: currentItem.name,
          data: salesData,
          borderColor: color,
          backgroundColor: color.replace('1)', '0.1)'),
          tension: 0.4,
          fill: false,
        };
      } else {
        return {
          label: currentItem.name,
          data: revenueData,
          borderColor: color,
          backgroundColor: color.replace('1)', '0.1)'),
          tension: 0.4,
          fill: false,
        };
      }
    };
    
    // Create datasets array with main item + comparison items
    const datasets = [
      generateDataForItem(item, 'rgba(255, 215, 0, 1)') // Main item is gold
    ];
    
    // Add comparison items
    comparisonItems.forEach((compItem, index) => {
      datasets.push(generateDataForItem(compItem, getComparisonColor(index)));
    });
    
    return { labels, datasets };
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
  
  // Close analytics modal
  const closeAnalytics = () => {
    setShowAnalytics(false);
    setAnalyticsItems([]); // Clear analytics items when closing
    setShowAnalyticsSelector(false);
  };
  
  // Open analytics modal
  const openAnalytics = (item: InventoryItem) => {
    setAnalyticsItems([item]); // Reset analytics items when opening new item
    setShowAnalytics(true);
    setComparisonItems([]); // Reset comparison items when opening new item
  };

  // Function to add/remove comparison item
  const toggleComparisonItem = (item: InventoryItem) => {
    if (comparisonItems.some(i => i.id === item.id)) {
      setComparisonItems(comparisonItems.filter(i => i.id !== item.id));
    } else {
      setComparisonItems([...comparisonItems, item]);
    }
  };

  // Get a color for a specific comparison item (for consistent coloring in charts)
  const getComparisonColor = (index: number) => {
    const colors = [
      'rgba(0, 200, 83, 1)',    // Green
      'rgba(0, 180, 220, 1)',   // Blue
      'rgba(255, 100, 100, 1)', // Red
      'rgba(255, 180, 0, 1)',   // Orange
      'rgba(180, 120, 255, 1)'  // Purple
    ];
    return colors[index % colors.length];
  };

  // Function to get color intensity based on value
  const getHeatColor = (value: number) => {
    // Golden color range for heat map
    if (value >= 40) return 'rgba(255, 215, 0, 0.9)'; // High value - bright gold
    if (value >= 30) return 'rgba(255, 215, 0, 0.75)';
    if (value >= 20) return 'rgba(255, 215, 0, 0.6)';
    if (value >= 10) return 'rgba(255, 215, 0, 0.45)';
    return 'rgba(255, 215, 0, 0.3)'; // Low value - dim gold
  };

  // Send email proposal to customer
  const sendEmailProposal = () => {
    if (confirmedItem) {
      // Create email subject and body
      const subject = `Reorder Proposal: ${confirmedItem.name}`;
      const body = `
Hello,

Please find the details of the proposed reorder below:

Item: ${confirmedItem.name}
SKU: ${confirmedItem.sku}
Current Quantity: ${confirmedItem.quantity}
Reorder Quantity: +${reorderQuantities[confirmedItem.id] || 0}
New Total Quantity: ${confirmedItem.quantity + (reorderQuantities[confirmedItem.id] || 0)}
Projected Months: ${((confirmedItem.quantity + (reorderQuantities[confirmedItem.id] || 0)) / confirmedItem.usageMonthly).toFixed(1)}
Total Cost: $${((reorderQuantities[confirmedItem.id] || 0) * confirmedItem.price).toFixed(2)}

Thank you,
Anique Inventory Management
      `;

      // Encode subject and body for mailto URL
      const encodedSubject = encodeURIComponent(subject);
      const encodedBody = encodeURIComponent(body);

      // Create mailto URL and open it
      const mailtoLink = `mailto:?subject=${encodedSubject}&body=${encodedBody}`;
      window.open(mailtoLink, '_blank');
    }
  };

  // Download artwork
  const downloadArtwork = () => {
    // This is a placeholder function - will be implemented with actual artwork download later
    console.log('Downloading artwork');
    // Add a visual feedback that the button was clicked
    alert('Artwork download feature will be implemented soon');
  };

  // Add state for the add product modal
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newProduct, setNewProduct] = useState<{
    name: string;
    category: string;
    quantity: string;
    price: string;
  }>({
    name: '',
    category: '',
    quantity: '',
    price: ''
  });

  // Categories for the dropdown
  const categories = ['Shirts', 'Outerwear', 'Headwear', 'Bags', 'Drinkware', 'Office', 'Tech'];

  // Handle new product input changes
  const handleNewProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add new product
  const addNewProduct = () => {
    const quantity = parseInt(newProduct.quantity) || 0;
    const price = parseFloat(newProduct.price) || 0;
    
    // Calculate a fake usage based on quantity
    const monthlyUsage = Math.max(5, Math.round(quantity * 0.15));
    const ytdUsage = monthlyUsage * 7;
    const totalUsage = monthlyUsage * 18;
    
    // New item to add
    const newItem: InventoryItem = {
      id: `SYK-KIT-PRO-${Math.floor(Math.random() * 900) + 100}`,
      name: newProduct.name,
      category: newProduct.category,
      quantity: quantity,
      price: price,
      sku: `SYK-KIT-PRO-${Math.floor(Math.random() * 900) + 100}`,
      usageYTD: ytdUsage,
      usageTotal: totalUsage,
      usageMonthly: monthlyUsage,
      projectedMonths: quantity / monthlyUsage,
      status: quantity > monthlyUsage * 3 ? 'In Stock' : quantity > 0 ? 'Low Stock' : 'Out of Stock',
      isCritical: quantity < monthlyUsage,
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    };
    
    // Add to inventory
    setInventoryData(prev => [newItem, ...prev]);
    
    // Reset and close modal
    setNewProduct({
      name: '',
      category: '',
      quantity: '',
      price: ''
    });
    
    setShowAddModal(false);
  };

  // Add export function
  const exportToExcel = () => {
    // In a real implementation, this would use a library like xlsx
    // For the prototype, we'll just show a message
    alert('Table exported as Excel file!');
    // In production, you would use:
    // 1. Create worksheet from the filteredData
    // 2. Create a workbook and add the worksheet
    // 3. Generate file and trigger download
  };

  // Add useEffect for animation styles
  useEffect(() => {
    // Add keyframes animation to document
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      @keyframes pulse {
        0% {
          box-shadow: 0 0 0 0 rgba(255, 80, 80, 0.7);
        }
        50% {
          box-shadow: 0 0 0 8px rgba(255, 80, 80, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(255, 80, 80, 0);
        }
      }
      
      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
      
      @keyframes blueGlow {
        0% {
          box-shadow: 0 0 0 0 rgba(130, 180, 255, 0.7);
        }
        50% {
          box-shadow: 0 0 0 8px rgba(130, 180, 255, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(130, 180, 255, 0);
        }
      }
    `;
    document.head.appendChild(styleEl);
    
    // Cleanup on unmount
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  // State for Help/FAQ modal
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  // Toggle help modal
  const toggleHelpModal = () => {
    setShowHelpModal(!showHelpModal);
  };

  // Function to simulate a click on a help button that would be in the parent component
  useEffect(() => {
    // This can be used to connect our modal to a help button event from parent
    const handleHelpButtonClick = (event: CustomEvent) => {
      setShowHelpModal(true);
    };

    // Listen for a custom event that would be dispatched by a help button
    window.addEventListener('helpButtonClick' as any, handleHelpButtonClick);

    return () => {
      window.removeEventListener('helpButtonClick' as any, handleHelpButtonClick);
    };
  }, []);

  // Handle production order cancellation
  const handleCancelOrder = (orderId: string) => {
    setOrderToCancel(orderId);
    setShowCancelModal(true);
  };

  // Confirm production order cancellation
  const confirmCancelOrder = () => {
    if (orderToCancel) {
      // Remove the order from the production orders
      setProductionOrders(productionOrders.filter(order => order.orderId !== orderToCancel));
      setShowCancelModal(false);
      setOrderToCancel(null);
    }
  };

  // Add function to check if an item has pending production orders
  const hasProductionOrder = (itemId: string): boolean => {
    return productionOrders.some(order => 
      order.productId === itemId && 
      (order.status === 'In Progress' || order.status === 'Pending')
    );
  };

  // Initialize alignment data on component mount if not already set
  React.useEffect(() => {
    // Check if alignment data needs to be initialized
    const shouldInitialize = inventoryData.some(item => item.needsAlignment === undefined);
    
    if (shouldInitialize) {
      // Add alignment data to some inventory items
      const updatedInventory = inventoryData.map((item, index) => {
        // Add alignment data to some items (every 3rd item for this example)
        if (index % 3 === 0) {
          // Use fixed differences instead of random
          // Even indices get +5, odd indices get -5
          const fixedDiff = index % 2 === 0 ? 5 : -5;
          return {
            ...item,
            quantityAlt: Math.max(0, item.quantity + fixedDiff),
            needsAlignment: true
          };
        }
        return item;
      });
      
      setInventoryData(updatedInventory);
    }
  }, [inventoryData, setInventoryData]);

  // Update alignment for an item
  const updateAlignment = (itemId: string) => {
    const updatedInventory = inventoryData.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          quantity: item.quantityAlt || item.quantity, // Update the main quantity to match the alternate
          needsAlignment: false // Mark as not needing alignment to remove from the list
        };
      }
      return item;
    });
    
    setInventoryData(updatedInventory);
  };

  // Undo alignment for an item
  const undoAlignment = (itemId: string) => {
    const updatedInventory = inventoryData.map(item => {
      if (item.id === itemId) {
        // Instead of random variance, use a small fixed difference
        // This ensures alignment is still needed but numbers don't spaz out
        return {
          ...item,
          quantityAlt: Math.max(0, item.quantity + 5), // Fixed +5 difference
          needsAlignment: true
        };
      }
      return item;
    });
    
    setInventoryData(updatedInventory);
  };

  // Get count of items needing alignment for notification badge
  const unalignedItemsCount = React.useMemo(() => {
    return inventoryData.filter(item => item.needsAlignment).length;
  }, [inventoryData]);

  // Notes modal state
  const [showNotesModal, setShowNotesModal] = useState<boolean>(false);
  const [selectedItemForNotes, setSelectedItemForNotes] = useState<InventoryItem | null>(null);
  const [noteText, setNoteText] = useState<string>('');

  // Function to save notes
  const saveNotes = () => {
    if (selectedItemForNotes) {
      const updatedItems = inventoryData.map(item => 
        item.id === selectedItemForNotes.id 
          ? { ...item, note: noteText }
          : item
      );
      setInventoryData(updatedItems);
      setShowNotesModal(false);
      setSelectedItemForNotes(null);
      setNoteText('');
    }
  };

  // Function to delete notes
  const deleteNotes = () => {
    if (selectedItemForNotes) {
      const updatedItems = inventoryData.map(item => 
        item.id === selectedItemForNotes.id 
          ? { ...item, note: undefined }
          : item
      );
      setInventoryData(updatedItems);
      setShowNotesModal(false);
      setSelectedItemForNotes(null);
      setNoteText('');
    }
  };

  // Complete production order
  const completeOrder = (orderId: string) => {
    setProductionOrders(prevOrders => {
      return prevOrders.map(order => {
        if (order.orderId === orderId) {
          return {
            ...order,
            status: 'Completed'
          };
        }
        return order;
      });
    });
    setCompletionModal({
      visible: false,
      orderId: '',
      orderName: ''
    });
  };

  return (
    <div style={{ 
      padding: '2rem 2rem 2rem 2rem', // Reduced top padding to move elements up
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
        {/* KPI Section - reduced top margin to move up */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '1.5rem' // Reduced margin to match spacing between other elements
        }}>
          {/* Total Inventory */}
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
              Total Inventory
            </h3>
            <p style={{ 
              fontSize: '1.75rem', 
              fontWeight: 'bold',
              fontFamily: "'Rajdhani', sans-serif",
              color: 'rgba(255, 215, 0, 0.9)',
            }}>
              {totalItems.toLocaleString()}
            </p>
          </motion.div>

          {/* Inventory Value */}
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
              Inventory Value
            </h3>
            <p style={{ 
              fontSize: '1.75rem', 
              fontWeight: 'bold',
              fontFamily: "'Rajdhani', sans-serif",
              color: 'rgba(255, 215, 0, 0.9)',
            }}>
              ${totalInventoryValue.toLocaleString()}
            </p>
          </motion.div>

          {/* Low Stock/Warning Items */}
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
              Low Stock/Warning
            </h3>
            <p style={{ 
              fontSize: '1.75rem', 
              fontWeight: 'bold',
              fontFamily: "'Rajdhani', sans-serif",
              color: lowStockCount > 0 ? 'rgba(255, 180, 0, 0.9)' : 'white',
            }}>
              {lowStockCount}
            </p>
          </motion.div>

          {/* Out of Stock */}
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
              Out of Stock
            </h3>
            <p style={{ 
              fontSize: '1.75rem', 
              fontWeight: 'bold',
              fontFamily: "'Rajdhani', sans-serif",
              color: outOfStockCount > 0 ? 'rgba(255, 80, 80, 0.9)' : 'white',
            }}>
              {outOfStockCount}
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
          {/* Search Input - Align width with first KPI card */}
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
              placeholder="Search inventory..."
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

          {/* Customer Filter Dropdown - positioned under Low Stock KPI */}
          <div style={{
            position: 'relative',
            flex: 'none',
            width: 'calc(25% - 1.125rem)', // Match KPI card width
            minWidth: '200px',
            display: 'flex',
            justifyContent: 'center',  // Center it
            alignSelf: 'flex-start',
          }}>
            <select
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                appearance: 'none',
                background: 'rgba(30, 30, 40, 0.6)',
                border: '1px solid rgba(255, 215, 0, 0.2)',
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
              color: 'rgba(255, 215, 0, 0.7)',
              pointerEvents: 'none',
            }}>
              ▼
            </span>
          </div>

          {/* Status Filter - aligned with Critical Items KPI */}
          <div style={{
            position: 'relative',
            minWidth: '150px',
            flex: 'none',
            width: 'calc(25% - 1.125rem)', // Match KPI card width
            alignSelf: 'flex-start',
          }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                width: '50%', // Half the size
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                background: 'rgba(30, 30, 40, 0.6)',
                border: '1px solid rgba(255, 215, 0, 0.2)', // Changed to gold border
                color: 'white',
                appearance: 'none',
                paddingRight: '2rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {displayStatuses.map(status => (
                <option key={status} value={getStatusValue(status)}>
                  {status}
                </option>
              ))}
            </select>
            <span style={{
              position: 'absolute',
              right: '50%', // Adjust for half width
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255, 215, 0, 0.7)',
              pointerEvents: 'none',
              marginRight: '0.5rem',
            }}>
              ▼
            </span>
            
            {/* View Mode Toggle Switch to the right of status dropdown */}
            <div style={{ 
              position: 'absolute',
              left: '55%', // Position right of status dropdown
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <span style={{ 
                fontSize: '0.75rem', 
                color: viewMode === 'available' || viewMode === 'alignment' ? 'rgba(255, 215, 0, 0.9)' : 'rgba(255, 255, 255, 0.6)',
                fontWeight: viewMode === 'available' || viewMode === 'alignment' ? 'bold' : 'normal',
                cursor: 'pointer',
              }}
              onClick={() => setViewMode('available')}
              >
                Available
              </span>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode(viewMode !== 'production' ? 'production' : 'available')}
                style={{
                  width: '48px',
                  height: '24px',
                  background: 'rgba(30, 30, 40, 0.6)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  padding: '2px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: viewMode === 'production' ? 'flex-end' : 'flex-start'
                }}
              >
                <motion.div
                  layout
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '9px',
                    background: viewMode === 'production' ? 'rgba(130, 180, 255, 0.9)' : 'rgba(255, 215, 0, 0.9)',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                  }}
                />
              </motion.div>
              <span style={{ 
                fontSize: '0.75rem', 
                color: viewMode === 'production' ? 'rgba(130, 180, 255, 0.9)' : 'rgba(255, 255, 255, 0.6)',
                fontWeight: viewMode === 'production' ? 'bold' : 'normal',
                cursor: 'pointer',
              }}
              onClick={() => setViewMode('production')}
              >
                Production
              </span>
            </div>
          </div>

          {/* Action buttons aligned right under Out of Stock KPI */}
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            alignItems: 'center',
            flex: 'none',
            width: 'calc(25% - 1.125rem)', // Match KPI card width
            justifyContent: 'flex-end',
            alignSelf: 'flex-start',
          }}>
            {/* View Mode Toggle moved to status dropdown section */}

            {/* Alignment Button - Scale icon button with notification badge */}
            <motion.button
              whileHover={{ 
                scale: 1.1, 
                backgroundColor: viewMode === 'alignment' ? 'rgba(0, 200, 83, 0.4)' : 'rgba(255, 215, 0, 0.3)',
                boxShadow: viewMode === 'alignment' ? '0 0 15px rgba(0, 200, 83, 0.3)' : '0 0 15px rgba(255, 215, 0, 0.3)'
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setViewMode(viewMode === 'alignment' ? 'available' : 'alignment')}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: viewMode === 'alignment' ? 'rgba(0, 200, 83, 0.3)' : 'rgba(255, 215, 0, 0.2)',
                border: viewMode === 'alignment' ? '1px solid rgba(0, 200, 83, 0.5)' : '1px solid rgba(255, 215, 0, 0.5)',
                color: viewMode === 'alignment' ? 'white' : 'rgba(255, 215, 0, 0.9)',
                cursor: 'pointer',
                fontSize: '1.2rem',
                position: 'relative', // For notification badge
              }}
              title="Toggle Alignment View"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3L12 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 6L19 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 6L5 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 12L7 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 12L21 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              
              {/* Notification Badge for unaligned items */}
              {unalignedItemsCount > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: 'rgba(255, 80, 80, 0.9)', // Always red regardless of viewMode
                  color: 'rgba(255, 215, 0, 0.9)',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                }}>
                  {unalignedItemsCount}
                </div>
              )}
            </motion.button>

            {/* Critical Items Filter Button - Icon button style */}
            <motion.button
              whileHover={{ 
                scale: 1.1, 
                backgroundColor: showCriticalOnly ? 'rgba(255, 80, 80, 0.4)' : 'rgba(255, 215, 0, 0.3)',
                boxShadow: showCriticalOnly ? '0 0 15px rgba(255, 80, 80, 0.3)' : '0 0 15px rgba(255, 215, 0, 0.3)'
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowCriticalOnly(!showCriticalOnly)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: showCriticalOnly ? 'rgba(255, 80, 80, 0.3)' : 'rgba(255, 215, 0, 0.2)',
                border: showCriticalOnly ? '1px solid rgba(255, 80, 80, 0.5)' : '1px solid rgba(255, 215, 0, 0.5)',
                color: showCriticalOnly ? 'white' : 'rgba(255, 215, 0, 0.7)',
                cursor: 'pointer',
                fontSize: '1.2rem',
                animation: showCriticalOnly ? 'pulse 1s infinite' : 'none',
              }}
              title="Show Critical Items"
            >
              <span style={{ 
                fontWeight: 'bold', 
                fontSize: '1.5rem',
                color: showCriticalOnly ? 'white' : 'rgba(255, 215, 0, 0.9)', // Make it gold when not active
              }}>!</span>
            </motion.button>

            {/* Analytics Table Icon */}
            <motion.button
              whileHover={{ 
                scale: 1.1, 
                backgroundColor: 'rgba(255, 215, 0, 0.3)',
                boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)'
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowAnalyticsSelector(true)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 215, 0, 0.2)',
                border: '1px solid rgba(255, 215, 0, 0.5)',
                color: 'rgba(255, 215, 0, 0.7)',
                cursor: 'pointer',
                fontSize: '1.2rem',
              }}
              title="Analytics"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
            
            {/* Export Button */}
            <motion.button
              whileHover={{ 
                scale: 1.1, 
                backgroundColor: 'rgba(255, 215, 0, 0.3)',
                boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)'
              }}
              whileTap={{ scale: 0.97 }}
              onClick={exportToExcel}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 215, 0, 0.2)',
                border: '1px solid rgba(255, 215, 0, 0.5)',
                color: 'rgba(255, 215, 0, 0.7)',
                cursor: 'pointer',
                fontSize: '1.2rem',
              }}
              title="Export as Excel"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15L12 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 8L12 3L17 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 15V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18L4 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
            
            {/* Add New Button - Icon button style */}
            <motion.button
              whileHover={{ 
                scale: 1.1, 
                backgroundColor: 'rgba(255, 215, 0, 0.3)',
                boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)'
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowAddModal(true)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 215, 0, 0.2)',
                border: '1px solid rgba(255, 215, 0, 0.5)',
                color: 'rgba(255, 215, 0, 0.7)',
                cursor: 'pointer',
                fontSize: '1.5rem',
              }}
              title="Add New Item"
            >
              +
            </motion.button>
          </div>
        </motion.div>

        {/* Image preview overlay */}
        <AnimatePresence>
          {hoveredItem && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(5px)',
              }}
              onClick={() => setHoveredItem(null)}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                style={{
                  background: 'rgba(30, 30, 40, 0.95)',
                  borderRadius: '0.75rem',
                  overflow: 'hidden',
                  width: 'auto',
                  maxWidth: '400px',
                  height: 'auto',
                  maxHeight: '400px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  position: 'relative',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close (X) button */}
                <motion.button
                  whileHover={{ 
                    scale: 1.1,
                    backgroundColor: 'rgba(255, 215, 0, 0.3)',
                  }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setHoveredItem(null)}
                  style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255, 215, 0, 0.15)',
                    border: '1px solid rgba(255, 215, 0, 0.5)',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    zIndex: 10,
                  }}
                >
                  ✕
                </motion.button>
                
                <img 
                  src={hoveredItem.image} 
                  alt={hoveredItem.name} 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '0.75rem',
                  background: 'rgba(0, 0, 0, 0.7)',
                  color: 'rgba(255, 215, 0, 0.9)',
                  fontSize: '0.875rem',
                  textAlign: 'center',
                }}>
                  {hoveredItem.name}
              </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Inventory Table */}
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
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '60vh',
          }}
        >
          {viewMode === 'available' ? (
            // Available Inventory Table Content
            <div style={{ 
              width: '100%', 
              overflowX: 'auto',
              overflowY: 'auto',
              flex: 1
            }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'separate', 
                borderSpacing: 0, 
                minWidth: '650px' 
              }}>
                <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                  <tr style={{ backgroundColor: 'rgba(20, 20, 30, 0.95)', textAlign: 'center' }}>
                    <th 
                      style={{ padding: '1rem', cursor: 'pointer', position: 'sticky', top: 0 }}
                    onClick={() => requestSort('id')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <span>ID</span>
                      {sortConfig?.key === 'id' && (
                        <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                      style={{ padding: '1rem', cursor: 'pointer', position: 'sticky', top: 0 }}
                    onClick={() => requestSort('name')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <span>Item</span>
                      {sortConfig?.key === 'name' && (
                        <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                      style={{ padding: '1rem', cursor: 'pointer', position: 'sticky', top: 0 }}
                    onClick={() => requestSort('quantity')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <span>Quantity</span>
                      {sortConfig?.key === 'quantity' && (
                        <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                      style={{ padding: '1rem', cursor: 'pointer', position: 'sticky', top: 0 }}
                    onClick={() => requestSort('usageYTD')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <span>{isReorderMode ? 'Reorder Qty' : 'Usage YTD'}</span>
                      {sortConfig?.key === 'usageYTD' && !isReorderMode && (
                        <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                      style={{ padding: '1rem', cursor: 'pointer', position: 'sticky', top: 0 }}
                    onClick={() => requestSort('usageTotal')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <span>{isReorderMode ? 'New Quantity' : 'Usage Total'}</span>
                      {sortConfig?.key === 'usageTotal' && !isReorderMode && (
                        <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                      style={{ padding: '1rem', cursor: 'pointer', position: 'sticky', top: 0 }}
                    onClick={() => requestSort('usageMonthly')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <span>{isReorderMode ? 'Cost' : 'Usage Monthly'}</span>
                      {sortConfig?.key === 'usageMonthly' && !isReorderMode && (
                        <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                      style={{ padding: '1rem', cursor: 'pointer', position: 'sticky', top: 0 }}
                    onClick={() => requestSort('projectedMonths')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <span>Projected Months</span>
                      {sortConfig?.key === 'projectedMonths' && !isReorderMode && (
                        <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                      style={{ padding: '1rem', cursor: 'pointer', position: 'sticky', top: 0 }}
                    onClick={() => requestSort('status')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <span>{isReorderMode ? 'Confirm' : 'Status'}</span>
                      {sortConfig?.key === 'status' && !isReorderMode && (
                        <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                    <th style={{ padding: '1rem', textAlign: 'center', position: 'sticky', top: 0 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <motion.tr 
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ backgroundColor: 'rgba(30, 30, 40, 0.8)' }}
                    style={{ 
                      backgroundColor: 
                        reorderItem === item.id ? 'rgba(255, 215, 0, 0.05)' : 
                        index % 2 === 0 ? 'transparent' : 'rgba(30, 30, 40, 0.3)',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <td style={{ padding: '1rem', textAlign: 'center' }}>{item.id}</td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <div 
                          onClick={() => setHoveredItem(item)}
                          style={{
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            textDecorationStyle: 'dotted',
                            textDecorationColor: 'rgba(255, 215, 0, 0.5)',
                            display: 'inline-block',
                          }}
                        >
                          {item.name}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>{item.quantity.toLocaleString()}</td>
                    
                    {/* Usage YTD or Reorder Quantity */}
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      {isReorderMode && reorderItem === item.id ? (
                        <input
                          type="number"
                          value={reorderQuantities[item.id] || 0}
                          onChange={(e) => handleReorderQuantityChange(item.id, e.target.value)}
                          style={{
                            width: '80px',
                            background: 'rgba(30, 30, 40, 0.8)',
                            border: '1px solid rgba(255, 215, 0, 0.5)',
                            color: 'rgba(255, 215, 0, 0.9)',
                            padding: '0.5rem',
                            borderRadius: '0.25rem',
                            textAlign: 'center'
                          }}
                        />
                      ) : (
                        item.usageYTD.toLocaleString()
                      )}
                    </td>
                    
                    {/* Usage Total or New Quantity */}
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      {isReorderMode && reorderItem === item.id ? (
                        <span style={{ color: 'rgba(255, 215, 0, 0.9)' }}>
                          {(item.quantity + (reorderQuantities[item.id] || 0)).toLocaleString()}
                        </span>
                      ) : (
                        item.usageTotal.toLocaleString()
                      )}
                    </td>
                    
                    {/* Usage Monthly or Cost */}
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      {isReorderMode && reorderItem === item.id ? (
                        <span style={{ color: 'rgba(255, 215, 0, 0.9)' }}>
                          ${((reorderQuantities[item.id] || 0) * item.price).toFixed(2)}
                        </span>
                      ) : (
                        item.usageMonthly.toLocaleString()
                      )}
                    </td>
                    
                    {/* Projected Months (Original or New) */}
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      {isReorderMode && reorderItem === item.id ? (
                        <span style={{
                          color: 
                            (item.quantity + (reorderQuantities[item.id] || 0)) / item.usageMonthly < 3 
                              ? 'rgba(255, 80, 80, 0.9)' 
                              : (item.quantity + (reorderQuantities[item.id] || 0)) / item.usageMonthly < 6 
                                ? 'rgba(255, 180, 0, 0.9)' 
                                : 'rgba(0, 200, 83, 0.9)'
                        }}>
                          {((item.quantity + (reorderQuantities[item.id] || 0)) / item.usageMonthly).toFixed(1)}
                        </span>
                      ) : (
                        <span style={{
                          color: item.projectedMonths < 3 ? 'rgba(255, 80, 80, 0.9)' : 
                                item.projectedMonths < 6 ? 'rgba(255, 180, 0, 0.9)' : 
                                'white'
                        }}>
                          {item.projectedMonths.toFixed(1)}
                        </span>
                      )}
                    </td>
                    
                    {/* Status or Confirm/Cancel */}
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      {isReorderMode && reorderItem === item.id ? (
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => confirmReorder(item)}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'rgba(0, 200, 83, 0.2)',
                              border: '1px solid rgba(0, 200, 83, 0.5)',
                              color: 'rgba(0, 200, 83, 1)',
                              cursor: 'pointer',
                              fontSize: '0.875rem'
                            }}
                          >
                            ✓
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleReorderMode(item.id)}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'rgba(255, 80, 80, 0.2)',
                              border: '1px solid rgba(255, 80, 80, 0.5)',
                              color: 'rgba(255, 80, 80, 1)',
                              cursor: 'pointer',
                              fontSize: '0.875rem'
                            }}
                          >
                            ✕
                          </motion.button>
                        </div>
                      ) : (
                        <span style={{
                            padding: '0.25rem 0.75rem',
                          borderRadius: '1rem',
                          fontSize: '0.875rem',
                            fontWeight: 'bold',
                          color: 
                            item.status === 'In Stock' ? 'rgba(0, 200, 83, 1)' :
                            item.status === 'Low Stock' ? 'rgba(255, 180, 0, 1)' :
                            item.status === 'Warning' ? 'rgba(255, 130, 0, 1)' :
                            'rgba(255, 80, 80, 1)',
                        }}>
                          {item.status}
                        </span>
                      )}
                    </td>
                    
                    {/* Actions */}
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <motion.button
                          whileHover={{ 
                            scale: 1.1, 
                              color: item.isCritical ? 'rgba(255, 80, 80, 1)' : 'rgba(255, 215, 0, 1)',
                              boxShadow: item.isCritical ? '0 0 10px rgba(255, 80, 80, 0.3)' : '0 0 10px rgba(255, 215, 0, 0.3)'
                          }}
                          whileTap={{ scale: 0.9 }}
                            title={item.isCritical ? "Remove Critical Flag" : "Mark as Critical"}
                            onClick={() => {
                              // Toggle critical status
                              const updatedInventory = inventoryData.map(invItem => 
                                invItem.id === item.id ? {...invItem, isCritical: !invItem.isCritical} : invItem
                              );
                              setInventoryData(updatedInventory);
                            }}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                              background: item.isCritical ? 'rgba(255, 80, 80, 0.3)' : 'rgba(255, 215, 0, 0.15)',
                              border: item.isCritical ? '1px solid rgba(255, 80, 80, 0.5)' : '1px solid rgba(255, 215, 0, 0.5)',
                              color: item.isCritical ? 'rgba(255, 80, 80, 1)' : 'rgba(255, 215, 0, 0.7)',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            opacity: isReorderMode && reorderItem !== item.id ? 0.5 : 1,
                              pointerEvents: isReorderMode && reorderItem !== item.id ? 'none' : 'auto',
                              animation: item.isCritical ? 'pulse 1s infinite' : 'none',
                          }}
                        >
                            <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>!</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ 
                            scale: 1.1, 
                            color: 'rgba(255, 215, 0, 1)',
                            boxShadow: hasProductionOrder(item.id) || reorderItem === item.id ? 
                              '0 0 10px rgba(130, 180, 255, 0.5)' : 
                              '0 0 10px rgba(255, 215, 0, 0.3)'
                          }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleReorderMode(item.id)}
                          title={hasProductionOrder(item.id) ? "Production Order In Progress (Click to reorder more)" : "Reorder"}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: hasProductionOrder(item.id) || reorderItem === item.id ? 'rgba(130, 180, 255, 0.25)' : 'rgba(255, 215, 0, 0.15)',
                            border: hasProductionOrder(item.id) || reorderItem === item.id ? '1px solid rgba(130, 180, 255, 0.7)' : '1px solid rgba(255, 215, 0, 0.5)',
                            color: hasProductionOrder(item.id) || reorderItem === item.id ? 'rgba(130, 180, 255, 0.9)' : 'rgba(255, 215, 0, 0.7)',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            opacity: isReorderMode && reorderItem !== item.id ? 0.5 : 1,
                            pointerEvents: isReorderMode && reorderItem !== item.id ? 'none' : 'auto',
                            animation: hasProductionOrder(item.id) || reorderItem === item.id ? 'blueGlow 1.5s infinite' : 'none',
                          }}
                        >
                          <div
                            style={{
                              animation: hasProductionOrder(item.id) || reorderItem === item.id ? 'spin 4s linear infinite' : 'none',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M4 4V10H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M20 20V14H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M4 10C4 10 7 4 14 4C16.667 4 20 6 20 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M20 14C20 14 17 20 10 20C7.333 20 4 18 4 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </motion.button>
                        <motion.button
                          whileHover={{ 
                            scale: 1.1, 
                            color: 'rgba(255, 215, 0, 1)',
                            boxShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
                          }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => openAnalytics(item)}
                          title="Analytics"
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
                            fontSize: '0.875rem',
                            opacity: isReorderMode && reorderItem !== item.id ? 0.5 : 1,
                            pointerEvents: isReorderMode && reorderItem !== item.id ? 'none' : 'auto'
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M6 20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </motion.button>
                        <motion.button
                          whileHover={{ 
                            scale: 1.1, 
                            color: 'rgba(255, 215, 0, 1)',
                            boxShadow: item.note ? 
                              '0 0 10px rgba(0, 200, 83, 0.5)' : 
                              '0 0 10px rgba(255, 215, 0, 0.3)'
                          }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setSelectedItemForNotes(item);
                            setNoteText(item.note || '');
                            setShowNotesModal(true);
                          }}
                          title={item.note ? "View/Edit Notes" : "Add Notes"}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: item.note ? 'rgba(0, 200, 83, 0.25)' : 'rgba(255, 215, 0, 0.15)',
                            border: item.note ? '1px solid rgba(0, 200, 83, 0.7)' : '1px solid rgba(255, 215, 0, 0.5)',
                            color: item.note ? 'rgba(0, 200, 83, 0.9)' : 'rgba(255, 215, 0, 0.7)',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            opacity: isReorderMode && reorderItem !== item.id ? 0.5 : 1,
                            pointerEvents: isReorderMode && reorderItem !== item.id ? 'none' : 'auto'
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
                ))}
              </tbody>
            </table>
          </div>
          ) : viewMode === 'production' ? (
            // Production Orders Table Content
            <div style={{ 
              width: '100%', 
              overflowX: 'auto',
              overflowY: 'auto',
              flex: 1
            }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'separate', 
                borderSpacing: 0, 
                minWidth: '650px' 
              }}>
                <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                  <tr style={{ backgroundColor: 'rgba(20, 20, 30, 0.95)', textAlign: 'center' }}>
                    <th style={{ padding: '1rem', position: 'sticky', top: 0 }}>Order Date</th>
                    <th style={{ padding: '1rem', position: 'sticky', top: 0 }}>RO #</th>
                    <th style={{ padding: '1rem', position: 'sticky', top: 0 }}>PV #</th>
                    <th style={{ padding: '1rem', position: 'sticky', top: 0 }}>ID</th>
                    <th style={{ padding: '1rem', position: 'sticky', top: 0 }}>Item</th>
                    <th style={{ padding: '1rem', position: 'sticky', top: 0 }}>Qty</th>
                    <th style={{ padding: '1rem', position: 'sticky', top: 0 }}>Completion Date</th>
                    <th style={{ padding: '1rem', position: 'sticky', top: 0 }}>Status</th>
                    <th style={{ padding: '1rem', position: 'sticky', top: 0 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {productionOrders.map((order, index) => (
                    <motion.tr 
                      key={order.orderId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ backgroundColor: 'rgba(30, 30, 40, 0.8)' }}
                      style={{ 
                        backgroundColor: index % 2 === 0 ? 'transparent' : 'rgba(30, 30, 40, 0.3)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                      }}
                    >
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        {new Date(order.orderDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>{order.orderId}</td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>{order.pvNumber}</td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>{order.productId}</td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {order.productName}
                        </div>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>{order.quantity.toLocaleString()}</td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        {new Date(order.completionDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '1rem',
                          fontSize: '0.875rem',
                          fontWeight: 'bold',
                          color: 
                            order.status === 'Completed' ? 'rgba(0, 200, 83, 1)' :
                            order.status === 'In Progress' ? 'rgba(255, 215, 0, 0.9)' :
                            order.status === 'Pending' ? 'rgba(130, 180, 255, 0.9)' :
                            'rgba(255, 80, 80, 1)',
                        }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          {/* Critical Flag Button */}
                          <motion.button
                            whileHover={{ 
                              scale: 1.1, 
                              color: order.isCritical ? 'rgba(255, 80, 80, 1)' : 'rgba(255, 215, 0, 1)',
                              boxShadow: order.isCritical ? '0 0 10px rgba(255, 80, 80, 0.3)' : '0 0 10px rgba(255, 215, 0, 0.3)'
                            }}
                            whileTap={{ scale: 0.9 }}
                            title={order.isCritical ? "Remove Critical Flag" : "Mark as Critical"}
                            onClick={() => {
                              // Toggle critical status
                              setProductionOrders(productionOrders.map(po => 
                                po.orderId === order.orderId ? {...po, isCritical: !po.isCritical} : po
                              ));
                            }}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: order.isCritical ? 'rgba(255, 80, 80, 0.3)' : 'rgba(255, 215, 0, 0.15)',
                              border: order.isCritical ? '1px solid rgba(255, 80, 80, 0.5)' : '1px solid rgba(255, 215, 0, 0.5)',
                              color: order.isCritical ? 'rgba(255, 80, 80, 1)' : 'rgba(255, 215, 0, 0.7)',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              animation: order.isCritical ? 'pulse 1s infinite' : 'none',
                            }}
                          >
                            <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>!</span>
                          </motion.button>
                          
                          {/* Cancel Order Button */}
                          <motion.button
                            whileHover={{ 
                              scale: 1.1, 
                              color: 'rgba(255, 215, 0, 1)',
                              boxShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
                            }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleCancelOrder(order.orderId)}
                            title="Cancel Order"
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
                              fontSize: '0.875rem',
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </motion.button>
                          
                          {/* Complete Order Button */}
                          <motion.button
                            whileHover={{ 
                              scale: 1.1, 
                              color: 'rgba(0, 200, 83, 1)',
                              boxShadow: '0 0 10px rgba(0, 200, 83, 0.3)'
                            }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setCompletionModal({
                              visible: true,
                              orderId: order.orderId,
                              orderName: order.productName
                            })}
                            title="Complete Order"
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'rgba(0, 200, 83, 0.15)',
                              border: '1px solid rgba(0, 200, 83, 0.3)',
                              color: 'rgba(0, 200, 83, 0.7)',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {productionOrders.length === 0 && (
                <div style={{
                  width: '100%',
                  padding: '3rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255, 255, 255, 0.6)',
                  textAlign: 'center'
                }}>
                  <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>No Production Orders</p>
                  <p>All production orders have been fulfilled or canceled.</p>
                </div>
              )}
            </div>
          ) : (
            // Alignment Table Content
            <div style={{ 
              width: '100%', 
              overflowX: 'auto',
              overflowY: 'auto',
              flex: 1
            }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'separate', 
                borderSpacing: 0, 
                minWidth: '650px' 
              }}>
                <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                  <tr style={{ backgroundColor: 'rgba(20, 20, 30, 0.95)', textAlign: 'center' }}>
                    <th style={{ padding: '1rem', position: 'sticky', top: 0 }}>ID</th>
                    <th style={{ padding: '1rem', position: 'sticky', top: 0 }}>Item</th>
                    <th style={{ padding: '1rem', position: 'sticky', top: 0 }}>FMG</th>
                    <th style={{ padding: '1rem', position: 'sticky', top: 0 }}>PV</th>
                    <th style={{ padding: '1rem', position: 'sticky', top: 0 }}>Diff</th>
                    <th style={{ padding: '1rem', position: 'sticky', top: 0 }}>Diff (%)</th>
                    <th style={{ padding: '1rem', position: 'sticky', top: 0 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.filter(item => item.needsAlignment).map((item, index) => (
                    <motion.tr 
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ backgroundColor: 'rgba(30, 30, 40, 0.8)' }}
                      style={{ 
                        backgroundColor: index % 2 === 0 ? 'transparent' : 'rgba(30, 30, 40, 0.3)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                      }}
                    >
                      <td style={{ padding: '1rem', textAlign: 'center' }}>{item.id}</td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                          <div 
                            onClick={() => setHoveredItem(item)}
                            style={{
                              cursor: 'pointer',
                              textDecoration: 'underline',
                              textDecorationStyle: 'dotted',
                              textDecorationColor: 'rgba(255, 215, 0, 0.5)',
                              display: 'inline-block',
                            }}
                          >
                            {item.name}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>{item.quantity.toLocaleString()}</td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>{(item.quantityAlt || 0).toLocaleString()}</td>
                      <td style={{ 
                        padding: '1rem', 
                        textAlign: 'center',
                        color: (item.quantityAlt || 0) > item.quantity ? 'rgba(0, 200, 83, 0.9)' : (item.quantityAlt || 0) < item.quantity ? 'rgba(255, 80, 80, 0.9)' : 'white'
                      }}>
                        {(item.quantityAlt || 0) > item.quantity ? '+' : ''}{((item.quantityAlt || 0) - item.quantity).toLocaleString()}
                      </td>
                      <td style={{ 
                        padding: '1rem', 
                        textAlign: 'center',
                        color: (item.quantityAlt || 0) > item.quantity ? 'rgba(0, 200, 83, 0.9)' : (item.quantityAlt || 0) < item.quantity ? 'rgba(255, 80, 80, 0.9)' : 'white'
                      }}>
                        {item.quantity === 0 ? 'N/A' : 
                          `${(item.quantityAlt || 0) > item.quantity ? '+' : ''}${(((item.quantityAlt || 0) - item.quantity) / item.quantity * 100).toFixed(1)}%`
                        }
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          {/* Align Button */}
                          <motion.button
                            whileHover={{ 
                              scale: 1.1, 
                              color: 'rgba(0, 200, 83, 1)',
                              boxShadow: '0 0 10px rgba(0, 200, 83, 0.3)'
                            }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateAlignment(item.id)}
                            title="Align quantities"
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'rgba(0, 200, 83, 0.15)',
                              border: '1px solid rgba(0, 200, 83, 0.3)',
                              color: 'rgba(0, 200, 83, 0.7)',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </motion.button>
                          
                          {/* Undo Button */}
                          <motion.button
                            whileHover={{ 
                              scale: 1.1, 
                              color: 'rgba(255, 215, 0, 1)',
                              boxShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
                            }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => undoAlignment(item.id)}
                            title="Undo alignment"
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'rgba(255, 215, 0, 0.15)',
                              border: '1px solid rgba(255, 215, 0, 0.3)',
                              color: 'rgba(255, 215, 0, 0.7)',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1 4V10H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M3.51 15C4.15839 16.8404 5.38734 18.4202 7.01166 19.5014C8.63598 20.5826 10.5677 21.1066 12.5157 20.9945C14.4637 20.8824 16.3226 20.1402 17.8121 18.8798C19.3017 17.6193 20.3413 15.909 20.7742 14.0064C21.2072 12.1038 21.0101 10.1123 20.2126 8.33111C19.4152 6.54989 18.0605 5.07631 16.3528 4.13243C14.6451 3.18856 12.6769 2.82161 10.7447 3.09116C8.81245 3.36071 7.02091 4.25361 5.64 5.64L1 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              {filteredData.filter(item => item.needsAlignment).length === 0 && (
                <div style={{
                  width: '100%',
                  padding: '3rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255, 255, 255, 0.6)',
                  textAlign: 'center'
                }}>
                  <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>No Alignment Needed</p>
                  <p>All inventory quantities are currently aligned.</p>
                </div>
              )}
            </div>
          )}
          
          {/* Pagination & Results Summary */}
          <div style={{ 
            padding: '1rem', 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
              Showing {filteredData.length} of {inventoryData.length} items
              {showCriticalOnly && ' (Filtered to critical items)'}
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <motion.button
                whileHover={{ backgroundColor: 'rgba(255, 215, 0, 0.15)' }}
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
                  color: 'white',
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
                  color: 'rgba(255, 215, 0, 0.7)',
                  cursor: 'pointer',
                }}
              >
                2
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Reorder Confirmation Modal */}
        <AnimatePresence>
          {showConfirmation && confirmedItem && (
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
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                style={{
                  background: 'rgba(30, 30, 40, 0.95)',
                  borderRadius: '1rem',
                  width: '90%',
                  maxWidth: '500px',
                  padding: '2rem',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  position: 'relative',
                }}
              >
                {/* Email notification button */}
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(0, 150, 220, 0.3)' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={sendEmailProposal}
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0, 150, 220, 0.2)',
                    border: '1px solid rgba(0, 150, 220, 0.5)',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                  title="Send Order Proposal Email"
                >
                  ✉️
                </motion.button>

                <h2 style={{ 
                  fontSize: '1.75rem', 
                  marginBottom: '1.5rem',
                  fontFamily: "'Rajdhani', sans-serif",
                  background: 'linear-gradient(to right, #FFD700, #FFA500)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  Confirm Reorder
                </h2>
                
                <div style={{ 
                  display: 'flex', 
                  gap: '1.5rem', 
                  marginBottom: '1.5rem',
                  alignItems: 'center'
                }}>
                  <div style={{ 
                    width: '120px', 
                    height: '120px', 
                    background: 'rgba(40, 40, 50, 0.8)',
                    borderRadius: '0.5rem',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}>
                    {confirmedItem.image ? (
                      <img 
                        src={confirmedItem.image} 
                        alt={confirmedItem.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ 
                        display: 'flex', 
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: '2rem'
                      }}>
                        📦
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: 'bold', 
                      marginBottom: '0.5rem',
                      color: 'rgba(255, 215, 0, 0.9)',
                    }}>
                      {confirmedItem.name}
                    </h3>
                    <p style={{ 
                      color: 'rgba(255, 255, 255, 0.7)', 
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem',
                    }}>
                      SKU: {confirmedItem.sku}
                    </p>
                  </div>
                </div>
                
                <div style={{ 
                  background: 'rgba(40, 40, 50, 0.5)',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '0.75rem',
                    fontSize: '0.875rem',
                  }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Current Quantity:</span>
                    <span style={{ color: 'white' }}>{confirmedItem.quantity.toLocaleString()}</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '0.75rem',
                    fontSize: '0.875rem',
                  }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Reorder Quantity:</span>
                    <span style={{ color: 'rgba(255, 215, 0, 0.9)' }}>
                      +{(reorderQuantities[confirmedItem.id] || 0).toLocaleString()}
                    </span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                  }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>New Total:</span>
                    <span style={{ color: 'rgba(0, 200, 83, 1)' }}>
                      {(confirmedItem.quantity + (reorderQuantities[confirmedItem.id] || 0)).toLocaleString()}
                    </span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '0.75rem',
                    fontSize: '0.875rem',
                  }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Projected Months:</span>
                    <span style={{ color: 'rgba(0, 150, 220, 1)' }}>
                      {((confirmedItem.quantity + (reorderQuantities[confirmedItem.id] || 0)) / confirmedItem.usageMonthly).toFixed(1)}
                    </span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    fontSize: '0.875rem',
                  }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Total Cost:</span>
                    <span style={{ color: 'rgba(255, 215, 0, 0.9)' }}>
                      ${((reorderQuantities[confirmedItem.id] || 0) * confirmedItem.price).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Artwork confirmation section */}
                <div style={{ 
                  background: 'rgba(40, 40, 50, 0.5)',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(0, 180, 220, 0.3)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={downloadArtwork}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      background: 'rgba(0, 180, 220, 0.2)',
                      color: 'white',
                      border: '1px solid rgba(0, 180, 220, 0.5)',
                      cursor: 'pointer',
                      fontFamily: "'Rajdhani', sans-serif",
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      alignSelf: 'center',
                      marginBottom: '0.5rem'
                    }}
                  >
                    <span style={{ fontSize: '1rem' }}>📥</span> Download Artwork
                  </motion.button>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <input 
                        type="checkbox" 
                        id="artworkConfirmation"
                        checked={artworkConfirmed}
                        onChange={() => setArtworkConfirmed(!artworkConfirmed)}
                        style={{
                          width: '18px',
                          height: '18px',
                          accentColor: '#FFD700'
                        }}
                      />
                      <label 
                        htmlFor="artworkConfirmation"
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '0.875rem',
                          cursor: 'pointer'
                        }}
                      >
                        I acknowledge and confirm the artwork is correct
                      </label>
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', width: '100%' }}>
                  <motion.button
                    whileHover={{ backgroundColor: 'rgba(0, 200, 83, 0.8)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={processReorder}
                    disabled={!artworkConfirmed}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      backgroundColor: artworkConfirmed ? 'rgba(0, 200, 83, 0.6)' : 'rgba(100, 100, 100, 0.2)',
                      color: 'white',
                      cursor: artworkConfirmed ? 'pointer' : 'not-allowed',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      opacity: artworkConfirmed ? 1 : 0.7,
                    }}
                  >
                    Confirm Order
                  </motion.button>
                  <motion.button
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={cancelReorder}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      backgroundColor: 'transparent',
                      color: 'rgba(255, 255, 255, 0.8)',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                    }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Analytics Modal */}
        <AnimatePresence>
          {showAnalytics && analyticsItems.length > 0 && (
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
                      {analyticsItems[0].name} Analytics
                    </h2>
                    <p style={{ 
                      color: 'rgba(255, 255, 255, 0.7)', 
                      fontSize: '0.875rem',
                      marginBottom: '0.5rem',
                    }}>
                      ID: {analyticsItems[0].id} | SKU: {analyticsItems[0].sku}
                    </p>
                    <div style={{
                      display: 'flex',
                      gap: '0.5rem',
                      alignItems: 'center',
                    }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        backgroundColor: 
                          analyticsItems[0].status === 'In Stock' ? 'rgba(0, 200, 83, 0.15)' :
                          analyticsItems[0].status === 'Low Stock' ? 'rgba(255, 180, 0, 0.15)' :
                          analyticsItems[0].status === 'Warning' ? 'rgba(255, 130, 0, 0.15)' :
                          'rgba(255, 80, 80, 0.15)',
                        color: 
                          analyticsItems[0].status === 'In Stock' ? 'rgba(0, 200, 83, 1)' :
                          analyticsItems[0].status === 'Low Stock' ? 'rgba(255, 180, 0, 1)' :
                          analyticsItems[0].status === 'Warning' ? 'rgba(255, 130, 0, 1)' :
                          'rgba(255, 80, 80, 1)',
                      }}>
                        {analyticsItems[0].status}
                      </span>
                      {analyticsItems[0].isCritical && (
                        <span style={{
                          fontSize: '0.75rem',
                          color: 'rgba(255, 80, 80, 0.9)',
                        }}>
                          ⚠️ Critical Item
                        </span>
                      )}
                    </div>
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
                      border: '1px solid rgba(255, 215, 0, 0.3)',
                      color: 'white',
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
                  {/* Current Stock */}
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
                      Current Stock
                    </h3>
                    <p style={{ 
                      fontSize: '1.75rem', 
                      fontWeight: 'bold',
                      fontFamily: "'Rajdhani', sans-serif",
                      color: analyticsItems[0].quantity === 0 ? 'rgba(255, 80, 80, 0.9)' : 'white',
                    }}>
                      {analyticsItems[0].quantity.toLocaleString()}
                    </p>
                  </motion.div>

                  {/* Monthly Usage */}
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
                      Monthly Usage
                    </h3>
                    <p style={{ 
                      fontSize: '1.75rem', 
                      fontWeight: 'bold',
                      fontFamily: "'Rajdhani', sans-serif",
                    }}>
                      {analyticsItems[0].usageMonthly.toLocaleString()}
                    </p>
                  </motion.div>

                  {/* Projected Months */}
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
                      Projected Months
                    </h3>
                    <p style={{ 
                      fontSize: '1.75rem', 
                      fontWeight: 'bold',
                      fontFamily: "'Rajdhani', sans-serif",
                      color: analyticsItems[0].projectedMonths < 3 ? 'rgba(255, 80, 80, 0.9)' : 
                             analyticsItems[0].projectedMonths < 6 ? 'rgba(255, 180, 0, 0.9)' : 
                             'rgba(0, 200, 83, 0.9)',
                    }}>
                      {analyticsItems[0].projectedMonths.toFixed(1)}
                    </p>
                  </motion.div>

                  {/* Price */}
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
                      Unit Price
                    </h3>
                    <p style={{ 
                      fontSize: '1.75rem', 
                      fontWeight: 'bold',
                      fontFamily: "'Rajdhani', sans-serif",
                      color: 'rgba(255, 215, 0, 0.9)',
                    }}>
                      ${analyticsItems[0].price.toFixed(2)}
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
                    marginBottom: '1rem',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}>
                    <h3 style={{ 
                      fontSize: '1.25rem', 
                      fontFamily: "'Rajdhani', sans-serif",
                      color: 'rgba(255, 215, 0, 0.9)',
                    }}>
                      Usage Trends
                    </h3>
                    
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      {/* Add comparison button */}
                      <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 215, 0, 0.3)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowComparisonSelector(!showComparisonSelector)}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '0.5rem',
                          background: 'rgba(255, 215, 0, 0.2)',
                          border: '1px solid rgba(255, 215, 0, 0.5)',
                          color: 'white',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        {showComparisonSelector ? 'Hide Comparison' : 'Add Comparison'}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </motion.button>
                      
                      {/* Date range selector */}
                      <div style={{ display: 'flex', overflow: 'hidden', borderRadius: '0.5rem' }}>
                        {['week', 'month', 'year'].map(range => (
                          <button
                            key={range}
                            onClick={() => setSelectedDateRange(range)}
                            style={{
                              padding: '0.5rem 1rem',
                              background: selectedDateRange === range ? 'rgba(255, 215, 0, 0.2)' : 'rgba(30, 30, 40, 0.6)',
                              border: 'none',
                              borderRight: range !== 'year' ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                              color: selectedDateRange === range ? 'rgba(255, 215, 0, 0.9)' : 'white',
                              cursor: 'pointer',
                              fontFamily: "'Rajdhani', sans-serif",
                              fontWeight: 600,
                              textTransform: 'capitalize',
                            }}
                          >
                            {range}
                          </button>
                        ))}
                      </div>
                      
                      {/* Metric selector */}
                      <div style={{ display: 'flex', overflow: 'hidden', borderRadius: '0.5rem' }}>
                        {['usage', 'sales', 'revenue'].map(metric => (
                          <button
                            key={metric}
                            onClick={() => setSelectedMetric(metric)}
                            style={{
                              padding: '0.5rem 1rem',
                              background: selectedMetric === metric ? 'rgba(255, 215, 0, 0.2)' : 'rgba(30, 30, 40, 0.6)',
                              border: 'none',
                              borderRight: metric !== 'revenue' ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                              color: selectedMetric === metric ? 'rgba(255, 215, 0, 0.9)' : 'white',
                              cursor: 'pointer',
                              fontFamily: "'Rajdhani', sans-serif",
                              fontWeight: 600,
                              textTransform: 'capitalize',
                            }}
                          >
                            {metric}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Main chart */}
                  <div style={{
                    background: 'rgba(30, 30, 40, 0.6)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    border: '1px solid rgba(255, 215, 0, 0.2)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    marginBottom: '2rem',
                    height: '300px',
                  }}>
                    <Line 
                      data={generateTimeSeriesData(analyticsItems[0], selectedDateRange, selectedMetric)} 
                      options={chartOptions} 
                    />
                  </div>
                  
                  {/* Comparison selector dropdown */}
                  {showComparisonSelector && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        background: 'rgba(30, 30, 40, 0.95)',
                        borderRadius: '1rem',
                        padding: '1.5rem',
                        border: '1px solid rgba(255, 215, 0, 0.2)',
                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                        marginBottom: '1.5rem',
                        position: 'relative',
                        maxHeight: '500px',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                      }}
                    >
                      <div style={{ marginBottom: '1rem' }}>
                        <h4 style={{ 
                          fontSize: '1rem', 
                          fontFamily: "'Rajdhani', sans-serif",
                          color: 'rgba(255, 215, 0, 0.9)',
                        }}>
                          Select items to compare
                        </h4>
                        <p style={{ 
                          fontSize: '0.875rem', 
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}>
                          Choose up to 4 additional items to compare with {analyticsItems[0]?.name}
                        </p>
                      </div>
                      
                      {/* Search input */}
                      <div style={{ 
                        marginBottom: '1rem',
                        position: 'relative',
                      }}>
                        <input
                          type="text"
                          value={comparisonSearchTerm}
                          onChange={(e) => setComparisonSearchTerm(e.target.value)}
                          placeholder="Search by name or SKU..."
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 2.5rem',
                            borderRadius: '0.5rem',
                            background: 'rgba(30, 30, 40, 0.6)',
                            border: '1px solid rgba(255, 215, 0, 0.2)',
                            color: 'white',
                            outline: 'none',
                          }}
                        />
                        <svg 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                          style={{
                            position: 'absolute',
                            left: '0.75rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'rgba(255, 215, 0, 0.7)',
                          }}
                        >
                          <path 
                            d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          />
                          <path 
                            d="M21 21L16.65 16.65" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          />
                        </svg>
                        
                        {comparisonSearchTerm && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setComparisonSearchTerm('')}
                            style={{
                              position: 'absolute',
                              right: '0.75rem',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'none',
                              border: 'none',
                              color: 'rgba(255, 255, 255, 0.7)',
                              cursor: 'pointer',
                              padding: '0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </motion.button>
                        )}
                      </div>
                      
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                        gap: '1rem',
                        maxHeight: '300px',
                        overflowY: 'auto',
                        paddingRight: '0.5rem',
                        flex: '1',
                      }}>
                        {inventoryData
                          .filter(item => item.id !== analyticsItems[0]?.id)
                          .filter(item => {
                            if (!comparisonSearchTerm) return true;
                            
                            const searchLower = comparisonSearchTerm.toLowerCase();
                            return (
                              item.name.toLowerCase().includes(searchLower) || 
                              item.sku.toLowerCase().includes(searchLower) ||
                              item.id.toLowerCase().includes(searchLower)
                            );
                          })
                          .map((item, index) => {
                            const isSelected = comparisonItems.some(i => i.id === item.id);
                            return (
                              <motion.div
                                key={item.id}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => toggleComparisonItem(item)}
                                style={{
                                  padding: '0.75rem',
                                  borderRadius: '0.75rem',
                                  background: isSelected ? 
                                    `rgba(${getComparisonColor(comparisonItems.findIndex(i => i.id === item.id)).replace('rgba(', '').replace(')', '')}, 0.2)` : 
                                    'rgba(30, 30, 40, 0.6)',
                                  border: isSelected ? 
                                    `1px solid ${getComparisonColor(comparisonItems.findIndex(i => i.id === item.id))}` : 
                                    '1px solid rgba(255, 255, 255, 0.1)',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.75rem',
                                }}
                              >
                                <div style={{
                                  width: '20px',
                                  height: '20px',
                                  borderRadius: '50%',
                                  background: isSelected ? 
                                    getComparisonColor(comparisonItems.findIndex(i => i.id === item.id)) : 
                                    'rgba(255, 255, 255, 0.2)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontSize: '0.75rem',
                                }}>
                                  {isSelected && '✓'}
                                </div>
                                <div>
                                  <div style={{ 
                                    fontSize: '0.875rem', 
                                    fontWeight: 'bold',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: '150px',
                                  }}>
                                    {item.name}
                                  </div>
                                  <div style={{ 
                                    fontSize: '0.75rem', 
                                    color: 'rgba(255, 255, 255, 0.6)',
                                  }}>
                                    {item.category} • SKU: {item.sku}
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                      </div>
                      
                      {/* Empty state when no search results */}
                      {comparisonSearchTerm && inventoryData
                        .filter(item => item.id !== analyticsItems[0]?.id)
                        .filter(item => {
                          const searchLower = comparisonSearchTerm.toLowerCase();
                          return (
                            item.name.toLowerCase().includes(searchLower) || 
                            item.sku.toLowerCase().includes(searchLower) ||
                            item.id.toLowerCase().includes(searchLower)
                          );
                        }).length === 0 && (
                          <div style={{
                            padding: '2rem',
                            textAlign: 'center',
                            color: 'rgba(255, 255, 255, 0.6)',
                          }}>
                            <p>No items found matching "{comparisonSearchTerm}"</p>
                          </div>
                        )}
                      
                      {/* Selected comparison items summary */}
                      {comparisonItems.length > 0 && (
                        <div style={{ 
                          marginTop: '1rem',
                          padding: '0.75rem',
                          borderRadius: '0.5rem',
                          background: 'rgba(255, 255, 255, 0.05)',
                          flexShrink: 0,
                        }}>
                          <div style={{ 
                            fontSize: '0.875rem', 
                            fontWeight: 'bold',
                            marginBottom: '0.5rem',
                          }}>
                            {comparisonItems.length} item{comparisonItems.length !== 1 ? 's' : ''} selected for comparison
                          </div>
                          <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '0.5rem',
                          }}>
                            {comparisonItems.map((item, index) => (
                              <div 
                                key={item.id}
                                style={{
                                  fontSize: '0.75rem',
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '0.25rem',
                                  background: getComparisonColor(index).replace('1)', '0.2)'),
                                  border: `1px solid ${getComparisonColor(index)}`,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                }}
                              >
                                {item.name}
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleComparisonItem(item);
                                  }}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'currentColor',
                                    padding: '0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </motion.button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                  
                  {/* Additional charts section */}
                  <div style={{
                    marginTop: '2rem'
                  }}>
                    {/* Heat Map Title */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem',
                    }}>
                      <h3 style={{ 
                        fontSize: '1.25rem', 
                        fontFamily: "'Rajdhani', sans-serif",
                        color: 'rgba(255, 215, 0, 0.9)',
                      }}>
                        Global Distribution Heat Map
                      </h3>
                    </div>
                    
                    {/* Interactive Heat Map */}
                    <div style={{
                      background: 'rgba(30, 30, 40, 0.6)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '1rem',
                      padding: '1.5rem',
                      border: '1px solid rgba(255, 215, 0, 0.2)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      height: '400px',
                      position: 'relative',
                      overflow: 'hidden',
                    }}>
                      {/* World map background */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'url("https://images.unsplash.com/photo-1589519160732-576f165b9ef4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80") center/cover no-repeat',
                        opacity: 0.15,
                        filter: 'brightness(0.7) contrast(1.2)',
                      }} />
                      
                      {/* Map overlay with golden grid */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: 'linear-gradient(rgba(255, 215, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 215, 0, 0.05) 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                        backgroundPosition: '-0.5px -0.5px',
                      }} />
                      
                      {/* Visualization container */}
                      <div style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        zIndex: 1,
                      }}>
                        {/* Regions and Ship-To Points */}
                        <div style={{
                          position: 'relative',
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          overflow: 'hidden',
                        }}>
                          {/* North America */}
                          <div style={{ position: 'absolute', top: '25%', left: '20%', color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                            North America
                          </div>
                          <div style={{ position: 'absolute', top: '30%', left: '18%' }}>
                            <motion.div
                              whileHover={{ scale: 1.2 }}
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: 'rgba(255, 215, 0, 0.6)',
                                boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                color: '#000',
                                cursor: 'pointer',
                              }}
                              title="US West: 35 units"
                            >
                              35
                            </motion.div>
                          </div>
                          <div style={{ position: 'absolute', top: '28%', left: '25%' }}>
                            <motion.div
                              whileHover={{ scale: 1.2 }}
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background: 'rgba(255, 215, 0, 0.8)',
                                boxShadow: '0 0 15px rgba(255, 215, 0, 0.5)',
                            display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                color: '#000',
                                cursor: 'pointer',
                              }}
                              title="US Midwest: 28 units"
                            >
                              28
                            </motion.div>
                          </div>
                          <div style={{ position: 'absolute', top: '26%', left: '32%' }}>
                            <motion.div
                              whileHover={{ scale: 1.2 }}
                              style={{
                                width: '42px',
                                height: '42px',
                                borderRadius: '50%',
                                background: 'rgba(255, 215, 0, 0.95)',
                                boxShadow: '0 0 20px rgba(255, 215, 0, 0.7)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                  fontSize: '0.9rem',
                                fontWeight: 'bold',
                                color: '#000',
                                cursor: 'pointer',
                              }}
                              title="US East: 42 units"
                            >
                              42
                            </motion.div>
                          </div>
                          <div style={{ position: 'absolute', top: '34%', left: '25%' }}>
                            <motion.div
                              whileHover={{ scale: 1.2 }}
                              style={{
                                width: '31px',
                                height: '31px',
                                borderRadius: '50%',
                                background: 'rgba(255, 215, 0, 0.7)',
                                boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
                                  display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                color: '#000',
                                cursor: 'pointer',
                              }}
                              title="US South: 31 units"
                            >
                              31
                            </motion.div>
                          </div>
                          
                          {/* Europe */}
                          <div style={{ position: 'absolute', top: '22%', left: '48%', color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                            Europe
                          </div>
                          <div style={{ position: 'absolute', top: '25%', left: '45%' }}>
                                    <motion.div
                              whileHover={{ scale: 1.2 }}
                                      style={{
                                width: '38px',
                                height: '38px',
                                        borderRadius: '50%',
                                background: 'rgba(255, 215, 0, 0.85)',
                                boxShadow: '0 0 15px rgba(255, 215, 0, 0.6)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                color: '#000',
                                        cursor: 'pointer',
                              }}
                              title="United Kingdom: 38 units"
                            >
                              38
                            </motion.div>
                          </div>
                          <div style={{ position: 'absolute', top: '28%', left: '51%' }}>
                            <motion.div
                              whileHover={{ scale: 1.2 }}
                              style={{
                                width: '34px',
                                height: '34px',
                                borderRadius: '50%',
                                background: 'rgba(255, 215, 0, 0.75)',
                                boxShadow: '0 0 12px rgba(255, 215, 0, 0.5)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold',
                                color: '#000',
                                cursor: 'pointer',
                              }}
                              title="Germany: 34 units"
                            >
                              34
                            </motion.div>
                          </div>
                          
                          {/* Asia */}
                          <div style={{ position: 'absolute', top: '30%', left: '70%', color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                            Asia
                          </div>
                          <div style={{ position: 'absolute', top: '26%', left: '82%' }}>
                                        <motion.div
                              whileHover={{ scale: 1.2 }}
                                          style={{
                                width: '37px',
                                height: '37px',
                                borderRadius: '50%',
                                background: 'rgba(255, 215, 0, 0.8)',
                                boxShadow: '0 0 15px rgba(255, 215, 0, 0.6)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                color: '#000',
                                cursor: 'pointer',
                              }}
                              title="Japan: 37 units"
                            >
                              37
                                        </motion.div>
                          </div>
                          <div style={{ position: 'absolute', top: '34%', left: '72%' }}>
                            <motion.div
                              whileHover={{ scale: 1.2 }}
                              style={{
                                width: '41px',
                                height: '41px',
                                borderRadius: '50%',
                                background: 'rgba(255, 215, 0, 0.9)',
                                boxShadow: '0 0 18px rgba(255, 215, 0, 0.7)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.85rem',
                                fontWeight: 'bold',
                                color: '#000',
                                cursor: 'pointer',
                              }}
                              title="China East: 41 units"
                            >
                              41
                                    </motion.div>
                                </div>
                          
                          {/* Australia */}
                          <div style={{ position: 'absolute', top: '60%', left: '85%', color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                            Australia
                              </div>
                          <div style={{ position: 'absolute', top: '65%', left: '82%' }}>
                            <motion.div
                              whileHover={{ scale: 1.2 }}
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                background: 'rgba(255, 215, 0, 0.65)',
                                boxShadow: '0 0 10px rgba(255, 215, 0, 0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                color: '#000',
                                cursor: 'pointer',
                              }}
                              title="Australia East: 28 units"
                            >
                              28
                            </motion.div>
                          </div>
                          
                          {/* South America */}
                          <div style={{ position: 'absolute', top: '50%', left: '30%', color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                            South America
                          </div>
                          <div style={{ position: 'absolute', top: '58%', left: '32%' }}>
                            <motion.div
                              whileHover={{ scale: 1.2 }}
                              style={{
                                width: '22px',
                                height: '22px',
                                borderRadius: '50%',
                                background: 'rgba(255, 215, 0, 0.5)',
                                boxShadow: '0 0 8px rgba(255, 215, 0, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.7rem',
                                fontWeight: 'bold',
                                color: '#000',
                                cursor: 'pointer',
                              }}
                              title="Brazil: 22 units"
                            >
                              22
                            </motion.div>
                          </div>
                          
                          {/* Africa */}
                          <div style={{ position: 'absolute', top: '42%', left: '50%', color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                            Africa
                          </div>
                          <div style={{ position: 'absolute', top: '60%', left: '52%' }}>
                            <motion.div
                              whileHover={{ scale: 1.2 }}
                              style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                background: 'rgba(255, 215, 0, 0.4)',
                                boxShadow: '0 0 6px rgba(255, 215, 0, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.65rem',
                                fontWeight: 'bold',
                                color: '#000',
                                cursor: 'pointer',
                              }}
                              title="South Africa: 18 units"
                            >
                              18
                            </motion.div>
                          </div>
                        </div>
                        
                        {/* Legend */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '1rem',
                          marginTop: '1rem',
                        }}>
                          <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.75rem' }}>
                            Lower Volume
                          </span>
                          <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255, 215, 0, 0.4)' }} />
                            <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: 'rgba(255, 215, 0, 0.6)' }} />
                            <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(255, 215, 0, 0.8)' }} />
                            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(255, 215, 0, 0.95)' }} />
                          </div>
                          <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.75rem' }}>
                            Higher Volume
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Insights panel */}
                    <div style={{
                      background: 'rgba(30, 30, 40, 0.6)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '1rem',
                      padding: '1.5rem',
                      border: '1px solid rgba(255, 215, 0, 0.2)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      marginTop: '1rem',
                    }}>
                      <h3 style={{ 
                        fontSize: '1rem', 
                        fontFamily: "'Rajdhani', sans-serif",
                        color: 'rgba(255, 215, 0, 0.9)',
                        marginBottom: '1rem',
                      }}>
                        Distribution Insights
                      </h3>
                      
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '1rem',
                      }}>
                        <div style={{
                          flex: '1 1 200px',
                          background: 'rgba(40, 40, 50, 0.6)',
                          borderRadius: '0.5rem',
                          padding: '1rem',
                        }}>
                          <h4 style={{ color: 'rgba(255, 215, 0, 0.9)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                            Top Markets
                          </h4>
                          <ul style={{ margin: 0, padding: '0 0 0 1.2rem', color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.85rem' }}>
                            <li>US East (42 units)</li>
                            <li>China East (41 units)</li>
                            <li>United Kingdom (38 units)</li>
                            <li>Japan (37 units)</li>
                            <li>US West (35 units)</li>
                          </ul>
                        </div>
                        
                        <div style={{
                          flex: '1 1 200px',
                          background: 'rgba(40, 40, 50, 0.6)',
                          borderRadius: '0.5rem',
                          padding: '1rem',
                        }}>
                          <h4 style={{ color: 'rgba(255, 215, 0, 0.9)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                            Growth Regions
                          </h4>
                          <ul style={{ margin: 0, padding: '0 0 0 1.2rem', color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.85rem' }}>
                            <li>Southeast Asia (+24% YoY)</li>
                            <li>Brazil (+18% YoY)</li>
                            <li>US South (+15% YoY)</li>
                            <li>India North (+14% YoY)</li>
                          </ul>
                        </div>
                        
                        <div style={{
                          flex: '1 1 200px',
                          background: 'rgba(40, 40, 50, 0.6)',
                          borderRadius: '0.5rem',
                          padding: '1rem',
                        }}>
                          <h4 style={{ color: 'rgba(255, 215, 0, 0.9)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                            Shipping Stats
                          </h4>
                          <ul style={{ margin: 0, padding: '0 0 0 1.2rem', color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.85rem' }}>
                            <li>Avg. Delivery: 4.2 days</li>
                            <li>Int'l Shipping: 12.6 days</li>
                            <li>Returns Rate: 2.8%</li>
                            <li>Backorders: 6 units</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Product Modal */}
        <AnimatePresence>
          {showAddModal && (
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
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                style={{
                  background: 'rgba(30, 30, 40, 0.95)',
                  borderRadius: '1rem',
                  width: '90%',
                  maxWidth: '500px',
                  padding: '2rem',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  position: 'relative',
                }}
              >
                <h2 style={{ 
                  fontSize: '1.75rem', 
                  marginBottom: '1.5rem',
                  fontFamily: "'Rajdhani', sans-serif",
                  background: 'linear-gradient(to right, #FFD700, #FFA500)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  Add New Product
                </h2>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <label 
                    style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontSize: '0.875rem',
                      color: 'rgba(255, 255, 255, 0.7)'
                    }}
                  >
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleNewProductChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '0.5rem',
                      background: 'rgba(30, 30, 40, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      outline: 'none',
                    }}
                    placeholder="Enter product name"
                  />
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <label 
                    style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontSize: '0.875rem',
                      color: 'rgba(255, 255, 255, 0.7)'
                    }}
                  >
                    Category
                  </label>
                  <select
                    name="category"
                    value={newProduct.category}
                    onChange={handleNewProductChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '0.5rem',
                      background: 'rgba(30, 30, 40, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      outline: 'none',
                      appearance: 'none',
                      position: 'relative',
                    }}
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '1.5rem',
                  marginBottom: '2rem'
                }}>
                  <div>
                    <label 
                      style={{ 
                        display: 'block', 
                        marginBottom: '0.5rem', 
                        fontSize: '0.875rem',
                        color: 'rgba(255, 255, 255, 0.7)'
                      }}
                    >
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={newProduct.quantity}
                      onChange={handleNewProductChange}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        background: 'rgba(30, 30, 40, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        outline: 'none',
                      }}
                      placeholder="Enter quantity"
                    />
                  </div>
                  
                  <div>
                    <label 
                      style={{ 
                        display: 'block', 
                        marginBottom: '0.5rem', 
                        fontSize: '0.875rem',
                        color: 'rgba(255, 255, 255, 0.7)'
                      }}
                    >
                      Price ($)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={newProduct.price}
                      onChange={handleNewProductChange}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        background: 'rgba(30, 30, 40, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        outline: 'none',
                      }}
                      placeholder="Enter price"
                      step="0.01"
                    />
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 80, 80, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddModal(false)}
                    style={{
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.5rem',
                      background: 'rgba(255, 80, 80, 0.2)',
                      color: 'white',
                      border: '1px solid rgba(255, 80, 80, 0.5)',
                      cursor: 'pointer',
                      fontFamily: "'Rajdhani', sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(0, 200, 83, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addNewProduct}
                    disabled={!newProduct.name || !newProduct.category || !newProduct.quantity || !newProduct.price}
                    style={{
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.5rem',
                      background: 'rgba(255, 215, 0, 0.2)',
                      border: '1px solid rgba(255, 215, 0, 0.5)',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '1.5rem',
                    }}
                  >
                    Add Product
                  </motion.button>
                </div>
      </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Help/FAQ Modal */}
      <AnimatePresence>
        {showHelpModal && (
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
            }}
            onClick={() => setShowHelpModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: 'rgba(30, 30, 40, 0.95)',
                borderRadius: '1rem',
                width: '90%',
                maxWidth: '600px',
                padding: '2rem',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                position: 'relative',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <motion.button
                whileHover={{ 
                  scale: 1.1,
                  backgroundColor: 'rgba(255, 215, 0, 0.3)',
                }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowHelpModal(false)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 215, 0, 0.15)',
                  border: '1px solid rgba(255, 215, 0, 0.5)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  zIndex: 10,
                }}
              >
                ✕
              </motion.button>
            
              <h2 style={{ 
                fontSize: '1.75rem', 
                marginBottom: '1.5rem',
                fontFamily: "'Rajdhani', sans-serif",
                background: 'linear-gradient(to right, #FFD700, #FFA500)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Help & Training
              </h2>
              
              <h3 style={{ 
                fontSize: '1.25rem', 
                marginBottom: '1rem',
                color: 'rgba(255, 215, 0, 0.9)',
                textAlign: 'center',
              }}>
                Coming Soon!
              </h3>
              
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.7)', 
                marginBottom: '2rem',
                textAlign: 'center',
              }}>
                Our FAQs and training materials are currently in development. Check back soon for helpful resources and guides to make the most of the platform.
              </p>
              
              <div style={{ 
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'rgba(255, 215, 0, 0.2)',
                  border: '1px solid rgba(255, 215, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  color: 'white',
                }}>
                  ?
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancellation Confirmation Modal */}
      <AnimatePresence>
        {showCancelModal && (
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
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: 'rgba(30, 30, 40, 0.95)',
                borderRadius: '1rem',
                width: '90%',
                maxWidth: '400px',
                padding: '2rem',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                position: 'relative',
              }}
            >
              <h2 style={{ 
                fontSize: '1.5rem', 
                marginBottom: '1.5rem',
                fontFamily: "'Rajdhani', sans-serif",
                background: 'linear-gradient(to right, #FFD700, #FFA500)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
              }}>
                Cancel Production Order
              </h2>
              
              <div style={{ 
                textAlign: 'center',
                marginBottom: '2rem',
                color: 'rgba(255, 255, 255, 0.8)',
              }}>
                <p style={{ marginBottom: '0.5rem' }}>
                  Are you sure you want to cancel this production order?
                </p>
                <p style={{ 
                  fontSize: '0.9rem', 
                  color: 'rgba(255, 80, 80, 0.9)',
                }}>
                  This action cannot be undone.
                </p>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '1rem',
                width: '100%'
              }}>
                <motion.button
                  whileHover={{ backgroundColor: 'rgba(255, 215, 0, 0.8)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={confirmCancelOrder}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    backgroundColor: 'rgba(255, 215, 0, 0.6)',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                  }}
                >
                  Yes, Cancel Order
                </motion.button>
                <motion.button
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCancelModal(false)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    backgroundColor: 'transparent',
                    color: 'rgba(255, 255, 255, 0.8)',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                  }}
                >
                  Keep Order
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes Modal */}
      <AnimatePresence>
        {showNotesModal && selectedItemForNotes && (
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
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: 'rgba(30, 30, 40, 0.95)',
                borderRadius: '1rem',
                width: '90%',
                maxWidth: '600px',
                padding: '2rem',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                position: 'relative',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <motion.button
                whileHover={{ 
                  scale: 1.1,
                  backgroundColor: 'rgba(255, 215, 0, 0.3)',
                }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowNotesModal(false)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 215, 0, 0.15)',
                  border: '1px solid rgba(255, 215, 0, 0.5)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  zIndex: 10,
                }}
              >
                ✕
              </motion.button>
            
              <h2 style={{ 
                fontSize: '1.75rem', 
                marginBottom: '1.5rem',
                fontFamily: "'Rajdhani', sans-serif",
                background: 'linear-gradient(to right, #FFD700, #FFA500)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Notes for {selectedItemForNotes.name}
              </h2>
              
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Enter your notes here..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  background: 'rgba(30, 30, 40, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  outline: 'none',
                  resize: 'vertical',
                  minHeight: '100px',
                }}
              />
              
              <div style={{ 
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '1rem',
                marginTop: '1rem',
              }}>
                {selectedItemForNotes.note && (
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 80, 80, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={deleteNotes}
                    style={{
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.5rem',
                      background: 'rgba(255, 80, 80, 0.2)',
                      color: 'white',
                      border: '1px solid rgba(255, 80, 80, 0.5)',
                      cursor: 'pointer',
                      fontFamily: "'Rajdhani', sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    Delete Notes
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 215, 0, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={saveNotes}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    background: 'rgba(255, 215, 0, 0.2)',
                    color: 'white',
                    border: '1px solid rgba(255, 215, 0, 0.5)',
                    cursor: 'pointer',
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: 600,
                  }}
                >
                  Save Notes
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analytics Selector Modal */}
      <AnimatePresence>
        {showAnalyticsSelector && (
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
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: 'rgba(30, 30, 40, 0.95)',
                borderRadius: '1rem',
                width: '90%',
                maxWidth: '600px',
                padding: '2rem',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                position: 'relative',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <motion.button
                whileHover={{ 
                  scale: 1.1,
                  backgroundColor: 'rgba(255, 215, 0, 0.3)',
                }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowAnalyticsSelector(false)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 215, 0, 0.15)',
                  border: '1px solid rgba(255, 215, 0, 0.5)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  zIndex: 10,
                }}
              >
                ✕
              </motion.button>
            
              <h2 style={{ 
                fontSize: '1.75rem', 
                marginBottom: '1.5rem',
                fontFamily: "'Rajdhani', sans-serif",
                background: 'linear-gradient(to right, #FFD700, #FFA500)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Select Items for Analytics
              </h2>
              
              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="text"
                  value={analyticsSearchTerm}
                  onChange={(e) => setAnalyticsSearchTerm(e.target.value)}
                  placeholder="Search items..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    background: 'rgba(30, 30, 40, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    outline: 'none',
                  }}
                />
              </div>
              
              <div style={{ 
                maxHeight: '300px',
                overflowY: 'auto',
                marginBottom: '1rem',
              }}>
                {inventoryData
                  .filter(item => {
                    if (!analyticsSearchTerm) return true;
                    const searchLower = analyticsSearchTerm.toLowerCase();
                    return (
                      item.name.toLowerCase().includes(searchLower) ||
                      item.sku.toLowerCase().includes(searchLower) ||
                      item.category.toLowerCase().includes(searchLower)
                    );
                  })
                  .map(item => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      style={{
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        background: analyticsItems.some(i => i.id === item.id) 
                          ? 'rgba(255, 215, 0, 0.2)' 
                          : 'rgba(30, 30, 40, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        marginBottom: '0.5rem',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                      onClick={() => {
                        if (analyticsItems.some(i => i.id === item.id)) {
                          setAnalyticsItems(analyticsItems.filter(i => i.id !== item.id));
                        } else if (analyticsItems.length < 5) {
                          setAnalyticsItems([...analyticsItems, item]);
                        }
                      }}
                    >
                      <div>
                        <div style={{ 
                          fontSize: '1rem',
                          color: 'rgba(255, 215, 0, 0.9)',
                          marginBottom: '0.25rem',
                        }}>
                          {item.name}
                        </div>
                        <div style={{ 
                          fontSize: '0.875rem',
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}>
                          SKU: {item.sku}
                        </div>
                      </div>
                      {analyticsItems.some(i => i.id === item.id) && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 6L9 17L4 12" stroke="rgba(255, 215, 0, 0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </motion.div>
                  ))}
              </div>
              
              <div style={{ 
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '1rem',
              }}>
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 215, 0, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAnalyticsSelector(false)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    background: 'rgba(255, 215, 0, 0.2)',
                    color: 'white',
                    border: '1px solid rgba(255, 215, 0, 0.5)',
                    cursor: 'pointer',
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 215, 0, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (analyticsItems.length > 0) {
                      setShowAnalytics(true);
                      setShowAnalyticsSelector(false);
                    }
                  }}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    background: analyticsItems.length > 0 ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    border: '1px solid rgba(255, 215, 0, 0.5)',
                    cursor: analyticsItems.length > 0 ? 'pointer' : 'not-allowed',
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: 600,
                    opacity: analyticsItems.length > 0 ? 1 : 0.5,
                  }}
                >
                  View Analytics
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Completion Modal */}
      <AnimatePresence>
        {completionModal.visible && (
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
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 9999,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
            }}
            onClick={() => setCompletionModal({visible: false, orderId: '', orderName: ''})}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              style={{
                backgroundColor: 'rgba(30, 30, 40, 0.95)',
                borderRadius: '1rem',
                padding: '2rem',
                maxWidth: '450px',
                width: '100%',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 215, 0, 0.2)',
                backdropFilter: 'blur(10px)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
                <div 
                  style={{ 
                    width: '70px', 
                    height: '70px', 
                    borderRadius: '50%', 
                    backgroundColor: 'rgba(0, 200, 83, 0.15)',
                    border: '1px solid rgba(0, 200, 83, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(0, 200, 83, 0.9)',
                  }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'rgba(255, 215, 0, 0.9)' }}>
                    Complete Reorder
                  </h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>
                    Are you sure you want to mark <strong>{completionModal.orderName}</strong> order as completed?
                  </p>
                  <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    This will set the status to "Completed" and add the items to inventory.
                  </p>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                  <motion.button
                    whileHover={{ backgroundColor: 'rgba(0, 200, 83, 0.8)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => completeOrder(completionModal.orderId)}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      backgroundColor: 'rgba(0, 200, 83, 0.6)',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                    }}
                  >
                    Complete Order
                  </motion.button>
                  <motion.button
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCompletionModal({visible: false, orderId: '', orderName: ''})}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      backgroundColor: 'transparent',
                      color: 'rgba(255, 255, 255, 0.8)',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                    }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Inventory; 