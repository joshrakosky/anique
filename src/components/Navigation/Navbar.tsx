import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FingerPrintIcon } from '@heroicons/react/24/outline';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [hoverItem, setHoverItem] = useState<string | null>(null);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3); // Example: 3 unread notifications

  // New state for Help & Training modal
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Apparel', path: '/dashboard/apparel' },
    { name: 'Inventory', path: '/dashboard/inventory' },
    { name: 'Projects', path: '/dashboard/projects', icon: 'calendar' },
  ];

  // Categories for the Help & Training modal
  const helpCategories = [
    { 
      id: 'projects', 
      name: 'Projects',
      sections: [
        { 
          id: 'users', 
          title: 'Users',
          content: 'User management information and guides for the eCommerce platform.'
        },
        { 
          id: 'new-build', 
          title: 'New Build',
          content: 'Resources and guides for creating new eCommerce builds, including checklists and best practices.',
          hasDownload: true
        },
        { 
          id: 'vdps', 
          title: 'VDPs',
          content: 'Information about Vehicle Display Pages (VDPs) and how to optimize them for better conversion.',
          customContent: true
        },
        { 
          id: 'gift-cards', 
          title: 'Gift Cards',
          content: 'Learn how to create, manage and process gift cards in the eCommerce system.'
        },
        { 
          id: 'promos', 
          title: 'Promos',
          content: 'Creating and managing promotional offers and discount codes.'
        },
        { 
          id: 'spending-accounts', 
          title: 'Spending Accounts',
          content: 'How to set up and manage customer spending accounts and loyalty programs.'
        },
        { 
          id: 'orderforge', 
          title: 'OrderForge',
          content: 'Complete guide to using the OrderForge system for order processing and management.'
        },
        { 
          id: 'product-onboarding', 
          title: 'Product Onboarding',
          content: 'Step-by-step process for adding new products to the eCommerce platform.'
        },
        { 
          id: 'fmg-integration', 
          title: 'FMG Integration',
          content: 'Integration guides for connecting with the FMG platform and services.'
        },
        { 
          id: 'frontend', 
          title: 'Frontend',
          content: 'Frontend development guidelines and best practices for the eCommerce platform.'
        },
        { 
          id: 'backend', 
          title: 'Backend',
          content: 'Backend architecture and API documentation for developers.'
        }
      ]
    },
    { 
      id: 'inventory', 
      name: 'Inventory',
      sections: [
        { 
          id: 'inventory-management', 
          title: 'Inventory Management',
          content: 'How to efficiently manage and track inventory across multiple locations.'
        },
        { 
          id: 'reorders', 
          title: 'Reorders',
          content: 'Managing inventory reorder points, automatic reordering, and purchase orders.'
        },
        { 
          id: 'usage', 
          title: 'Usage',
          content: 'Tracking and analyzing inventory usage patterns and consumption rates.'
        },
        { 
          id: 'sku-assignment', 
          title: 'SKU Assignment',
          content: 'Guidelines for creating and managing SKUs, including naming conventions and categorization.'
        }
      ]
    },
    { 
      id: 'apparel', 
      name: 'Apparel',
      sections: [
        { 
          id: 'ordering', 
          title: 'Ordering Process',
          content: 'Step-by-step guide to the apparel ordering process.'
        }
      ]
    },
    { 
      id: 'shipping', 
      name: 'Shipping',
      sections: [
        { 
          id: 'shipping-setup', 
          title: 'Shipping Setup',
          content: 'How to configure shipping options, rates, and carriers.'
        },
        { 
          id: 'tracking', 
          title: 'Order Tracking',
          content: 'Managing shipment tracking and customer notifications.'
        }
      ]
    },
    { 
      id: 'order-processing', 
      name: 'Order Processing',
      sections: [
        { 
          id: 'order-workflow', 
          title: 'Order Workflow',
          content: 'End-to-end process for handling orders from submission to fulfillment.'
        },
        { 
          id: 'returns', 
          title: 'Returns & Exchanges',
          content: 'How to process returns, exchanges, and refunds in the system.'
        },
        { 
          id: 'order-status', 
          title: 'Order Status',
          content: 'Understanding and managing different order statuses and transitions.'
        },
        { 
          id: 'apparel-orders', 
          title: 'Apparel',
          content: 'Specific workflow and requirements for processing apparel orders.'
        },
        { 
          id: '4over-orders', 
          title: '4Over',
          content: 'Guidelines for managing and processing 4Over print orders.'
        },
        { 
          id: 'promo-orders', 
          title: 'Promo',
          content: 'Processing promotional product orders, including vendor coordination and tracking.'
        },
        { 
          id: 'print-orders', 
          title: 'Print',
          content: 'Workflow for handling print orders, including file preparation and quality control.'
        }
      ]
    },
    { 
      id: 'proposals', 
      name: 'Proposals',
      sections: [
        { 
          id: 'proposal-creation', 
          title: 'Proposal Creation',
          content: 'How to create and format professional proposals for clients.'
        },
        { 
          id: 'templates', 
          title: 'Templates',
          content: 'Using and customizing proposal templates for different types of projects.'
        },
        { 
          id: 'follow-up', 
          title: 'Follow-up Process',
          content: 'Best practices for proposal follow-up and client engagement.'
        }
      ]
    }
  ];

  // Function to handle opening the FAQ modal
  const handleOpenFaqModal = () => {
    setShowFaqModal(true);
    setActiveCategory(helpCategories[0].id);
    setExpandedSections([]);
    setSearchQuery('');
  };

  // Function to handle closing the FAQ modal
  const handleCloseFaqModal = () => {
    setShowFaqModal(false);
  };
  
  // Function to toggle section expansion
  const toggleSection = (sectionId: string) => {
    if (expandedSections.includes(sectionId)) {
      setExpandedSections(expandedSections.filter(id => id !== sectionId));
    } else {
      setExpandedSections([...expandedSections, sectionId]);
    }
  };
  
  // VDP process steps for rendering in the content
  const vdpProcessSteps = [
    "Gather SOW from Client",
    "Create a variable product foundation in ProV2",
    "Create a static TEMP product in ProV2",
    {
      main: "Request SOW from prostoresteam@proforma.com - below info needed",
      sub: [
        "PDF/INDD/AI vector template (All possible fields filled out)",
        "Fonts/Images",
        "Customer Item #",
        "Static vs Optional vs Required Fields",
        "Flexing Behavior (Shifting or Font Size Decrease)",
        "Complexities (Dropdowns, QRs, etc.)"
      ]
    },
    "Receive SOW and approve/deny cost and timeline",
    "Oversee until completion",
    "Test",
    "Make Live"
  ];
  
  // Function to download checklist
  const downloadChecklist = () => {
    // In a real implementation, this would trigger a file download
    alert('Downloading checklist...');
  };

  // Function to handle notifications
  const handleToggleNotifications = () => {
    setShowNotificationsModal(!showNotificationsModal);
    // Mark as read when opened
    if (!showNotificationsModal && unreadNotifications > 0) {
      setUnreadNotifications(0);
    }
  };
  
  // Function to handle closing the notifications modal
  const handleCloseNotificationsModal = () => {
    setShowNotificationsModal(false);
    setUnreadNotifications(0); // Mark as read when closed
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="navbar"
      style={{
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: 700,
            fontSize: '1.5rem',
            letterSpacing: '0.05em',
            background: 'linear-gradient(to right, #FFD700, #FFA500)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            cursor: 'pointer',
          }}
        >
          ANIQUE
        </motion.div>
      </Link>

      {/* Navigation Links */}
      <div style={{ display: 'flex', gap: '2rem' }}>
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            style={{ textDecoration: 'none', position: 'relative' }}
            onMouseEnter={() => setHoverItem(item.name)}
            onMouseLeave={() => setHoverItem(null)}
          >
            <motion.div
              style={{
                color: location.pathname === item.path ? '#FFD700' : 'white',
                padding: '0.5rem 0',
                cursor: 'pointer',
                position: 'relative',
              }}
              whileHover={{ y: -2 }}
            >
              {item.name}
              {(location.pathname === item.path || hoverItem === item.name) && (
                <motion.div
                  layoutId="navbar-underline"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(to right, #FFD700, #FFA500)',
                    borderRadius: '1px',
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Login Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Settings Button */}
        <motion.div
          whileHover={{ 
            scale: 1.1, 
            rotate: 90,
            color: 'rgba(255, 215, 0, 1)',
          }}
          whileTap={{ scale: 0.9 }}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255, 215, 0, 0.7)',
            fontSize: '1.3rem',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>

        {/* Help/FAQ Button */}
        <motion.div
          whileHover={{ 
            scale: 1.1, 
            color: 'rgba(255, 215, 0, 1)',
          }}
          whileTap={{ scale: 0.9 }}
          onClick={handleOpenFaqModal}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255, 215, 0, 0.7)',
            fontSize: '1.3rem',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M9.09 9.00001C9.3251 8.33167 9.78915 7.76811 10.4 7.40914C11.0108 7.05016 11.7289 6.91895 12.4272 7.03871C13.1255 7.15848 13.7588 7.52153 14.2151 8.06353C14.6713 8.60554 14.9211 9.29153 14.92 10C14.92 12 11.92 13 11.92 13" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M12 17H12.01" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>

        {/* Notifications Button */}
        <motion.div
          whileHover={{ 
            scale: 1.1, 
            color: 'rgba(255, 215, 0, 1)',
          }}
          whileTap={{ scale: 0.9 }}
          onClick={handleToggleNotifications}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255, 215, 0, 0.7)',
            fontSize: '1.3rem',
            position: 'relative',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          
          {/* Notification badge */}
          {unreadNotifications > 0 && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="notification-badge"
              style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: 'linear-gradient(to right, #ff4d4d, #f80404)',
                color: 'white',
                fontSize: '0.7rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                border: '2px solid black',
              }}
            >
              {unreadNotifications}
            </motion.div>
          )}
        </motion.div>

        {/* Sign Out Button (replacing Login button) */}
        <Link to="/login" style={{ textDecoration: 'none' }}>
          <motion.div
            whileHover={{ 
              scale: 1.1, 
              color: 'rgba(255, 215, 0, 1)',
            }}
            whileTap={{ scale: 0.9 }}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255, 215, 0, 0.7)',
              fontSize: '1.3rem',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 17l5-5-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </Link>
      </div>

      {/* FAQ Modal */}
      {showFaqModal && (
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
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={handleCloseFaqModal}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 25 }}
            style={{
              position: 'fixed',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '70%',
              maxWidth: '900px',
              maxHeight: '85vh',
              backgroundColor: 'rgba(20, 20, 30, 0.95)',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
              border: '1px solid rgba(255, 215, 0, 0.2)',
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              margin: 0
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ 
                fontSize: '1.75rem', 
                background: 'linear-gradient(to right, #FFD700, #FFA500)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Help & Training
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCloseFaqModal}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                ✕
              </motion.button>
            </div>
            
            {/* Search Bar */}
            <div style={{ 
              position: 'relative',
              width: '100%',
              marginBottom: '1rem'
            }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help topics..."
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  borderRadius: '0.5rem',
                  backgroundColor: 'rgba(30, 30, 40, 0.6)',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none',
                }}
              />
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(255, 215, 0, 0.7)'
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
            </div>
            
            <div style={{ 
              display: 'flex',
              height: 'calc(100% - 120px)',
              gap: '1.5rem'
            }}>
              {/* Categories */}
              <div style={{ 
                width: '250px',
                borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                paddingRight: '1rem'
              }}>
                {helpCategories.map(category => (
                  <motion.div
                    key={category.id}
                    whileHover={{ backgroundColor: 'rgba(255, 215, 0, 0.1)' }}
                    onClick={() => setActiveCategory(category.id)}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '0.5rem',
                      marginBottom: '0.5rem',
                      cursor: 'pointer',
                      backgroundColor: activeCategory === category.id ? 'rgba(255, 215, 0, 0.2)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <span style={{
                      color: activeCategory === category.id ? '#FFD700' : 'rgba(255, 255, 255, 0.8)',
                      fontWeight: activeCategory === category.id ? 600 : 400
                    }}>
                      {category.name}
                    </span>
                  </motion.div>
                ))}
              </div>
              
              {/* Content Area */}
              <div style={{ 
                flex: '1',
                overflowY: 'auto',
              }}>
                {activeCategory && helpCategories.find(c => c.id === activeCategory)?.sections.map(section => {
                  // Filter based on search query if present
                  if (searchQuery && !section.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
                      !section.content.toLowerCase().includes(searchQuery.toLowerCase())) {
                    return null;
                  }
                  
                  return (
                    <motion.div
                      key={section.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        marginBottom: '1rem',
                        backgroundColor: 'rgba(30, 30, 40, 0.5)',
                        borderRadius: '0.5rem',
                        overflow: 'hidden',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <motion.div
                        whileHover={{ backgroundColor: 'rgba(255, 215, 0, 0.1)' }}
                        onClick={() => toggleSection(section.id)}
                        style={{
                          padding: '1rem',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          position: 'relative'
                        }}
                      >
                        <h3 style={{ 
                          margin: 0, 
                          color: '#FFD700',
                          fontSize: '1.1rem',
                          fontWeight: 500
                        }}>
                          {section.title}
                        </h3>
                        <motion.div
                          animate={{ rotate: expandedSections.includes(section.id) ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path 
                              d="M6 9L12 15L18 9" 
                              stroke="rgba(255, 215, 0, 0.8)" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            />
                          </svg>
                        </motion.div>
                      </motion.div>
                      
                      {expandedSections.includes(section.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{
                            padding: '0 1rem 1rem 1rem',
                            borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                          }}
                        >
                          {section.customContent && section.id === 'vdps' ? (
                            <div>
                              <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6', marginBottom: '15px' }}>
                                Information about Vehicle Display Pages (VDPs) and how to optimize them for better conversion.
                              </p>
                              <div style={{ 
                                marginTop: '15px', 
                                marginBottom: '15px', 
                                padding: '20px', 
                                backgroundColor: 'rgba(30, 30, 40, 0.3)', 
                                borderRadius: '8px'
                              }}>
                                <h4 style={{ marginBottom: '15px', fontSize: '1.1rem' }}>VDP Creation Process:</h4>
                                <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                                  {vdpProcessSteps.map((step, index) => (
                                    typeof step === 'string' ? (
                                      <li key={index} style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                        {step}
                                      </li>
                                    ) : (
                                      <li key={index} style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                        {step.main.split('prostoresteam@proforma.com').map((part, i, arr) => (
                                          i === 0 ? (
                                            <React.Fragment key={i}>
                                              {part}
                                              <a 
                                                href="mailto:prostoresteam@proforma.com" 
                                                style={{color: '#FFD700', textDecoration: 'underline'}}
                                              >
                                                prostoresteam@proforma.com
                                              </a>
                                              {arr.length > 1 && arr[1]}
                                            </React.Fragment>
                                          ) : null
                                        ))}
                                        <ol type="a" style={{ paddingLeft: '25px', lineHeight: '1.6', marginTop: '8px' }}>
                                          {step.sub.map((subStep, subIndex) => (
                                            <li key={subIndex} style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                              {subStep}
                                            </li>
                                          ))}
                                        </ol>
                                      </li>
                                    )
                                  ))}
                                </ol>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6' }}>
                                {section.content}
                              </p>
                              
                              {section.hasDownload && (
                                <motion.button
                                  whileHover={{ 
                                    scale: 1.03,
                                    backgroundColor: 'rgba(255, 215, 0, 0.3)'
                                  }}
                                  whileTap={{ scale: 0.97 }}
                                  onClick={downloadChecklist}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.5rem 1rem',
                                    background: 'rgba(255, 215, 0, 0.2)',
                                    border: '1px solid rgba(255, 215, 0, 0.5)',
                                    borderRadius: '0.5rem',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    marginTop: '1rem'
                                  }}
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path 
                                      d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" 
                                      stroke="currentColor" 
                                      strokeWidth="2" 
                                      strokeLinecap="round" 
                                      strokeLinejoin="round"
                                    />
                                    <path 
                                      d="M7 10L12 15L17 10" 
                                      stroke="currentColor" 
                                      strokeWidth="2" 
                                      strokeLinecap="round" 
                                      strokeLinejoin="round"
                                    />
                                    <path 
                                      d="M12 15V3" 
                                      stroke="currentColor" 
                                      strokeWidth="2" 
                                      strokeLinecap="round" 
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  Download Checklist
                                </motion.button>
                              )}
                            </>
                          )}
                        </motion.div>
                      )}
                </motion.div>
                  );
                })}
                
                {/* Show message when no search results */}
                {searchQuery && activeCategory && helpCategories.find(c => c.id === activeCategory)?.sections.every(
                  section => !section.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
                            !section.content.toLowerCase().includes(searchQuery.toLowerCase())
                ) && (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '2rem',
                    color: 'rgba(255, 255, 255, 0.7)'
                  }}>
                    <p>No results found for "{searchQuery}"</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Notifications Modal */}
      {showNotificationsModal && (
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
            zIndex: 1000,
          }}
          onClick={handleCloseNotificationsModal}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 25 }}
            style={{
              position: 'absolute',
              top: '4.5rem',
              right: '2rem',
              width: '350px',
              maxHeight: '80vh',
              backgroundColor: 'rgba(20, 20, 30, 0.95)',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
              border: '1px solid rgba(255, 215, 0, 0.2)',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ 
                fontSize: '1.25rem', 
                background: 'linear-gradient(to right, #FFD700, #FFA500)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Notifications
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCloseNotificationsModal}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                ✕
              </motion.button>
            </div>

            {/* Notification items */}
            <div style={{ marginBottom: '1rem' }}>
              {/* Approval notification */}
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                style={{
                  backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  borderLeft: '3px solid rgba(255, 215, 0, 0.7)',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  marginBottom: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 'bold', color: 'rgba(255, 215, 0, 0.9)' }}>Approval Required</span>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>Just now</span>
                </div>
                <p style={{ fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                  Order #ORD-005 requires your approval for processing.
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(0, 200, 83, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      padding: '0.4rem 0.75rem',
                      borderRadius: '0.25rem',
                      backgroundColor: 'rgba(0, 200, 83, 0.15)',
                      color: 'rgba(0, 200, 83, 1)',
                      border: '1px solid rgba(0, 200, 83, 0.3)',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                    }}
                  >
                    Approve
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 59, 48, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      padding: '0.4rem 0.75rem',
                      borderRadius: '0.25rem',
                      backgroundColor: 'rgba(255, 59, 48, 0.15)',
                      color: 'rgba(255, 59, 48, 1)',
                      border: '1px solid rgba(255, 59, 48, 0.3)',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                    }}
                  >
                    Reject
                  </motion.button>
                </div>
              </motion.div>

              {/* Regular notification */}
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{
                  backgroundColor: 'rgba(30, 30, 40, 0.6)',
                  borderLeft: '3px solid rgba(255, 255, 255, 0.3)',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  marginBottom: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 'bold' }}>Inventory Update</span>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>2 hours ago</span>
                </div>
                <p style={{ fontSize: '0.875rem' }}>
                  5 items in SKU T100-BLK-M are now below reorder threshold.
                </p>
              </motion.div>

              {/* System notification */}
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{
                  backgroundColor: 'rgba(30, 30, 40, 0.6)',
                  borderLeft: '3px solid rgba(0, 122, 255, 0.5)',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  marginBottom: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 'bold', color: 'rgba(0, 122, 255, 0.9)' }}>System Update</span>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>Yesterday</span>
                </div>
                <p style={{ fontSize: '0.875rem' }}>
                  New features have been added to the Apparel module.
                </p>
              </motion.div>
            </div>
            
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1rem' }}>
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
                  fontSize: '0.875rem',
                  width: '100%',
                  textAlign: 'center',
                }}
              >
                View all notifications
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar; 