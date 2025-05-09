import React, { Suspense, useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import AniqueSphere from './components/AniqueSphere';
import Navbar from './components/Navigation/Navbar';
import Dashboard from './pages/Dashboard/Dashboard';
import Apparel from './pages/Dashboard/Apparel';
import Inventory from './pages/Dashboard/Inventory';
import EComm from './pages/Dashboard/EComm';
import Login from './pages/Auth/Login';
import { updateSpeechState } from './components/AniqueSphere';

// Landing page component
const LandingPage = () => {
  const [isActive, setIsActive] = useState(true); // Start with input field active
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus the input field when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Sample inventory data for demo purposes
  // In a real implementation, this would come from your database
  const inventoryData = [
    { id: 'INV001', name: 'Cotton T-Shirt', category: 'Shirts', quantity: 150, status: 'In Stock' },
    { id: 'INV002', name: 'Denim Jeans', category: 'Pants', quantity: 100, status: 'In Stock' },
    { id: 'INV003', name: 'Leather Jacket', category: 'Outerwear', quantity: 25, status: 'Low Stock' },
    { id: 'INV004', name: 'Wool Sweater', category: 'Knitwear', quantity: 75, status: 'Warning' },
    { id: 'INV005', name: 'Running Shoes', category: 'Footwear', quantity: 0, status: 'Out of Stock' },
  ];

  // Sample apparel order data
  const apparelData = [
    { orderNumber: 'ORD-001', customer: 'Acme Corp', totalQuantity: 160, status: 'In Production' },
    { orderNumber: 'ORD-002', customer: 'TechStart Inc', totalQuantity: 65, status: 'Shipped' },
    { orderNumber: 'ORD-003', customer: 'Global Services', totalQuantity: 75, status: 'Received' },
    { orderNumber: 'ORD-004', customer: 'Summit Enterprises', totalQuantity: 115, status: 'Shipped' },
    { orderNumber: 'ORD-005', customer: 'Mountain View Co', totalQuantity: 80, status: 'In Production' },
  ];

  // Simple function to generate a response based on the query
  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    // Inventory related queries
    if (lowerQuery.includes('inventory') || lowerQuery.includes('stock')) {
      if (lowerQuery.includes('low') || lowerQuery.includes('critical')) {
        const lowStockItems = inventoryData.filter(item => 
          item.status === 'Low Stock' || item.status === 'Warning' || item.status === 'Out of Stock'
        );
        
        if (lowStockItems.length === 0) {
          return "All inventory items are well-stocked.";
        }
        
        return `There are ${lowStockItems.length} items with low stock: ${lowStockItems.map(item => item.name).join(', ')}.`;
      }
      
      if (lowerQuery.includes('total')) {
        const totalItems = inventoryData.reduce((sum, item) => sum + item.quantity, 0);
        return `There are ${totalItems} total items in inventory across ${inventoryData.length} different products.`;
      }
      
      // Specific item query
      for (const item of inventoryData) {
        if (lowerQuery.includes(item.name.toLowerCase())) {
          return `${item.name}: ${item.quantity} in stock (Status: ${item.status})`;
        }
      }
      
      // General inventory query
      return `Inventory status: ${inventoryData.length} products tracked. ${inventoryData.filter(i => i.status === 'In Stock').length} in stock, ${inventoryData.filter(i => i.status === 'Low Stock' || i.status === 'Warning').length} low stock, ${inventoryData.filter(i => i.status === 'Out of Stock').length} out of stock.`;
    }
    
    // Order related queries
    if (lowerQuery.includes('order') || lowerQuery.includes('apparel')) {
      if (lowerQuery.includes('pending') || lowerQuery.includes('production')) {
        const pendingOrders = apparelData.filter(order => order.status === 'In Production');
        return `There are ${pendingOrders.length} orders in production: ${pendingOrders.map(o => o.orderNumber).join(', ')}.`;
      }
      
      if (lowerQuery.includes('shipped')) {
        const shippedOrders = apparelData.filter(order => order.status === 'Shipped');
        return `There are ${shippedOrders.length} orders shipped: ${shippedOrders.map(o => o.orderNumber).join(', ')}.`;
      }
      
      // Specific order query
      for (const order of apparelData) {
        if (lowerQuery.includes(order.orderNumber.toLowerCase())) {
          return `Order ${order.orderNumber} for ${order.customer}: ${order.totalQuantity} items (Status: ${order.status})`;
        }
      }
      
      // General order query
      return `Order status: ${apparelData.length} total orders. ${apparelData.filter(o => o.status === 'In Production').length} in production, ${apparelData.filter(o => o.status === 'Shipped').length} shipped, ${apparelData.filter(o => o.status === 'Received').length} received.`;
    }
    
    // Business summary query
    if (lowerQuery.includes('summary') || lowerQuery.includes('overview') || lowerQuery.includes('snapshot')) {
      const totalItems = inventoryData.reduce((sum, item) => sum + item.quantity, 0);
      const lowStockCount = inventoryData.filter(item => item.status === 'Low Stock' || item.status === 'Warning').length;
      const totalOrders = apparelData.length;
      const pendingOrders = apparelData.filter(order => order.status === 'In Production').length;
      
      // Create an array of unique customers
      const uniqueCustomers = Array.from(new Set(apparelData.map(o => o.customer)));
      
      return `Business Summary:
      • Inventory: ${totalItems} items in stock (${lowStockCount} low stock alerts)
      • Orders: ${totalOrders} total orders (${pendingOrders} in production)
      • Top customers: ${uniqueCustomers.slice(0, 3).join(', ')}`;
    }
    
    // AI fallback for general questions
    return "I can help you with inventory and order information. Try asking about your current inventory, low stock items, or order status.";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;
    
    const userQuery = inputValue;
    
    // Start "thinking" animation
    setIsThinking(true);
    updateSpeechState(false, 0, true);
    setResponse(null);
    
    // Clear the input
    setInputValue('');
    
    // Simulate AI processing delay
    setTimeout(() => {
      const aiResponse = generateResponse(userQuery);
      setResponse(aiResponse);
      setIsThinking(false);
      updateSpeechState(false, 0, false);
    }, 1500);
  };

  return (
    <div style={{ 
      background: 'black', 
      minHeight: '100vh', 
      color: 'white', 
      overflow: 'hidden' 
    }}>
      {/* Include Navbar at the top */}
      <Navbar />
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        position: 'relative',
        paddingTop: '4rem'
      }}>
        {/* Decorative background elements */}
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'radial-gradient(circle at center, rgba(50, 30, 100, 0.2), transparent)',
          zIndex: 0 
        }} />
        
        {/* 3D Sphere */}
        <div style={{ 
          position: 'absolute', 
          height: '100vh', 
          width: '100vw', 
          zIndex: 1 
        }}>
          <Suspense fallback={null}>
            <AniqueSphere />
          </Suspense>
        </div>
        
        {/* Content - Centered input field */}
        <motion.div 
          style={{ 
            zIndex: 2, 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80%',
            maxWidth: '800px'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {/* Response area */}
          {response && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'rgba(20, 20, 30, 0.8)',
                borderRadius: '1rem',
                padding: '1.5rem',
                marginBottom: '2rem',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                boxShadow: '0 0 20px rgba(255, 215, 0, 0.1)',
                backdropFilter: 'blur(10px)',
                textAlign: 'left',
                width: '100%',
                whiteSpace: 'pre-line'
              }}
            >
              <p style={{ lineHeight: 1.6 }}>{response}</p>
            </motion.div>
          )}
          
          <motion.form
            key="input-form"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ 
              scale: 1, 
              opacity: 1
            }}
            onSubmit={handleSubmit}
            style={{
              width: '100%'
            }}
          >
            <div style={{
              position: 'relative',
              width: '100%'
            }}>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isThinking ? "Thinking..." : "How can I help?"}
                disabled={isThinking}
                style={{
                  width: '100%',
                  padding: '1rem 3.5rem 1rem 1.5rem',
                  fontSize: '1.25rem',
                  background: 'rgba(20, 20, 30, 0.6)',
                  color: 'white',
                  border: '1px solid rgba(255, 215, 0, 0.5)',
                  borderRadius: '2rem',
                  outline: 'none',
                  boxShadow: '0 0 15px rgba(255, 215, 0, 0.2)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                }}
                className="gold-placeholder"
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(255, 215, 0, 0.8)';
                  e.target.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 215, 0, 0.5)';
                  e.target.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.2)';
                }}
              />
              <motion.button
                type="submit"
                disabled={isThinking}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255, 215, 0, 0.15)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '38px',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: isThinking ? 'default' : 'pointer',
                  color: 'rgba(255, 215, 0, 0.7)',
                  fontSize: '1.25rem',
                  zIndex: 2
                }}
                whileHover={isThinking ? {} : { 
                  scale: 1.1, 
                  backgroundColor: 'rgba(255, 215, 0, 0.25)',
                  color: 'rgba(255, 215, 0, 1)',
                  boxShadow: '0 0 15px rgba(255, 215, 0, 0.5)'
                }}
                whileTap={isThinking ? {} : { 
                  scale: 0.95,
                  rotate: 15
                }}
                initial={{ rotate: 0 }}
                animate={{ rotate: isThinking ? [0, 5, -5, 5, -5, 0] : 0 }}
                transition={{ 
                  duration: isThinking ? 1 : 0.2,
                  repeat: isThinking ? Infinity : 0,
                  repeatType: "reverse" 
                }}
              >
                {isThinking ? (
                  <span className="thinking-dots">
                    <span className="thinking-dot"></span>
                    <span className="thinking-dot"></span>
                    <span className="thinking-dot"></span>
                  </span>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      d="M5 12H19" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                    <path 
                      d="M12 5L19 12L12 19" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </motion.button>
            </div>
          </motion.form>
          
          {/* Suggestion chips for demo */}
          {!response && !isThinking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
                marginTop: '1.5rem',
                justifyContent: 'center'
              }}
            >
              {[
                "Show business summary",
                "What's my inventory status?",
                "Any low stock items?",
                "Show me pending orders"
              ].map((suggestion, index) => (
                <motion.button
                  key={index}
                  whileHover={{ 
                    scale: 1.05, 
                    backgroundColor: 'rgba(255, 215, 0, 0.25)',
                    boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setInputValue(suggestion);
                    setTimeout(() => {
                      if (inputRef.current) {
                        inputRef.current.focus();
                      }
                    }, 10);
                  }}
                  style={{
                    background: 'rgba(255, 215, 0, 0.1)',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    borderRadius: '1.5rem',
                    padding: '0.5rem 1rem',
                    color: 'rgba(255, 215, 0, 0.8)',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: "'Rajdhani', sans-serif",
                  }}
                >
                  {suggestion}
                </motion.button>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Layout component for dashboard pages
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ 
      background: 'black', 
      minHeight: '100vh',
      position: 'relative'
    }}>
      <Navbar />
      <div style={{ paddingTop: '64px' }}>
        {children}
      </div>
      
      {/* 3D Sphere in background */}
      <div style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        opacity: 0.5,
      }}>
        <Suspense fallback={null}>
          <AniqueSphere />
        </Suspense>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Login Page */}
        <Route path="/login" element={<Login />} />
        
        {/* Dashboard Pages */}
        <Route 
          path="/dashboard" 
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          } 
        />
        <Route 
          path="/dashboard/apparel" 
          element={
            <DashboardLayout>
              <Apparel />
            </DashboardLayout>
          } 
        />
        <Route 
          path="/dashboard/inventory" 
          element={
            <DashboardLayout>
              <Inventory />
            </DashboardLayout>
          } 
        />
        <Route 
          path="/dashboard/ecomm" 
          element={
            <DashboardLayout>
              <EComm />
            </DashboardLayout>
          } 
        />

        {/* Redirect if no match */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
