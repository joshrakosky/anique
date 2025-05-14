import React, { useState, useEffect } from 'react';
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

// Interface for project items
interface Project {
  id: string;
  name: string;
  client: string;
  status: 'Planning' | 'In Progress' | 'Review' | 'Completed';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  deadline: string;
  progress: number;
  budget: number;
  spent: number;
  manager: string;
  team: string[];
}

// Interface for task items
interface Task {
  id: string;
  projectId: string;
  title: string;
  assignee: string;
  dueDate: string;
  status: 'To Do' | 'In Progress' | 'Ready for Review' | 'Completed';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  description: string;
  tags: string[];
}

const Projects: React.FC = () => {
  // Sample project data
  const [projects, setProjects] = useState<Project[]>([
    { 
      id: 'PRJ001', 
      name: 'Website Redesign', 
      client: 'Acme Corp', 
      status: 'In Progress', 
      priority: 'High', 
      deadline: '2023-12-15', 
      progress: 65, 
      budget: 12000, 
      spent: 7800,
      manager: 'Sarah Johnson',
      team: ['Mike Peterson', 'Lisa Chen', 'Dave Miller']
    },
    { 
      id: 'PRJ002', 
      name: 'Mobile App Development', 
      client: 'TechStart Inc', 
      status: 'Planning', 
      priority: 'Medium', 
      deadline: '2024-02-28', 
      progress: 15, 
      budget: 35000, 
      spent: 5250,
      manager: 'Robert Chen',
      team: ['Anita Singh', 'Carlos Rodriguez', 'Emma Wilson', 'Jason Lee'] 
    },
    { 
      id: 'PRJ003', 
      name: 'E-commerce Integration', 
      client: 'Fashion Trends', 
      status: 'Review', 
      priority: 'Urgent', 
      deadline: '2023-11-30', 
      progress: 90, 
      budget: 8500, 
      spent: 8200,
      manager: 'Michelle Parker',
      team: ['Tom Hayes', 'Julia Fox'] 
    },
    { 
      id: 'PRJ004', 
      name: 'Analytics Dashboard', 
      client: 'Data Insights Co', 
      status: 'Completed', 
      priority: 'Low', 
      deadline: '2023-10-15', 
      progress: 100, 
      budget: 5000, 
      spent: 4850,
      manager: 'David Thompson',
      team: ['Rachel Green', 'Alex Morgan'] 
    },
    { 
      id: 'PRJ005', 
      name: 'SEO Optimization', 
      client: 'GrowthHackers', 
      status: 'In Progress', 
      priority: 'Medium', 
      deadline: '2023-12-01', 
      progress: 45, 
      budget: 3000, 
      spent: 1350,
      manager: 'Jessica Miller',
      team: ['Brian White', 'Sophie Turner'] 
    },
  ]);

  // Sample tasks data
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'TSK001',
      projectId: 'PRJ001',
      title: 'Create homepage wireframe',
      assignee: 'Lisa Chen',
      dueDate: '2023-11-20',
      status: 'Completed',
      priority: 'High',
      description: 'Design wireframe for the new homepage layout',
      tags: ['Design', 'UX']
    },
    {
      id: 'TSK002',
      projectId: 'PRJ001',
      title: 'Develop navigation component',
      assignee: 'Dave Miller',
      dueDate: '2023-11-25',
      status: 'In Progress',
      priority: 'Medium',
      description: 'Create responsive navigation menu with dropdown functionality',
      tags: ['Frontend', 'React']
    },
    {
      id: 'TSK003',
      projectId: 'PRJ001',
      title: 'Implement user authentication',
      assignee: 'Mike Peterson',
      dueDate: '2023-11-28',
      status: 'To Do',
      priority: 'High',
      description: 'Set up JWT authentication and user session management',
      tags: ['Backend', 'Security']
    },
    {
      id: 'TSK004',
      projectId: 'PRJ002',
      title: 'App architecture planning',
      assignee: 'Anita Singh',
      dueDate: '2023-12-05',
      status: 'In Progress',
      priority: 'High',
      description: 'Define app architecture, data flow, and component structure',
      tags: ['Planning', 'Architecture']
    },
    {
      id: 'TSK005',
      projectId: 'PRJ002',
      title: 'Design UI kit',
      assignee: 'Emma Wilson',
      dueDate: '2023-12-10',
      status: 'To Do',
      priority: 'Medium',
      description: 'Create reusable UI components and style guide',
      tags: ['Design', 'UI']
    },
    {
      id: 'TSK006',
      projectId: 'PRJ003',
      title: 'Payment gateway integration',
      assignee: 'Tom Hayes',
      dueDate: '2023-11-22',
      status: 'Completed',
      priority: 'Urgent',
      description: 'Integrate Stripe and PayPal payment processors',
      tags: ['Backend', 'Payments']
    },
    {
      id: 'TSK007',
      projectId: 'PRJ003',
      title: 'Product catalog import',
      assignee: 'Julia Fox',
      dueDate: '2023-11-25',
      status: 'Ready for Review',
      priority: 'High',
      description: 'Import existing product catalog into new e-commerce platform',
      tags: ['Data', 'E-commerce']
    },
    {
      id: 'TSK008',
      projectId: 'PRJ005',
      title: 'Keyword research',
      assignee: 'Sophie Turner',
      dueDate: '2023-11-18',
      status: 'Completed',
      priority: 'Medium',
      description: 'Research competitive keywords and create target list',
      tags: ['SEO', 'Research']
    },
    {
      id: 'TSK009',
      projectId: 'PRJ005',
      title: 'On-page optimization',
      assignee: 'Brian White',
      dueDate: '2023-11-24',
      status: 'In Progress',
      priority: 'Medium',
      description: 'Optimize meta tags, headings, and content for target keywords',
      tags: ['SEO', 'Content']
    },
  ]);

  // View mode state (list or board)
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');

  // Filter states for projects
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Sort config for projects
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Project;
    direction: 'ascending' | 'descending';
  } | null>(null);

  // State for expanded project and active tab
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'tasks' | 'details' | 'team'>('tasks');

  // Apply filters and sorting to projects
  const filteredProjects = React.useMemo(() => {
    let filtered = [...projects];
    
    // Apply status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }
    
    // Apply priority filter
    if (priorityFilter !== 'All') {
      filtered = filtered.filter(project => project.priority === priorityFilter);
    }
    
    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(
        project => project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  project.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filtered;
  }, [projects, statusFilter, priorityFilter, searchTerm, sortConfig]);

  // Sort function for projects
  const requestSort = (key: keyof Project) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // State variables for tasks
  const [taskStatusFilter, setTaskStatusFilter] = useState<string>('All');
  const [taskSearch, setTaskSearch] = useState<string>('');

  // Filter tasks based on selected project and filters
  const filteredTasks = React.useMemo(() => {
    if (!expandedProject) return [];
    
    let filtered = tasks.filter(task => task.projectId === expandedProject);
    
    // Apply status filter
    if (taskStatusFilter !== 'All') {
      filtered = filtered.filter(task => task.status === taskStatusFilter);
    }
    
    // Apply search
    if (taskSearch) {
      filtered = filtered.filter(
        task => task.title.toLowerCase().includes(taskSearch.toLowerCase()) || 
               task.assignee.toLowerCase().includes(taskSearch.toLowerCase()) ||
               task.description.toLowerCase().includes(taskSearch.toLowerCase())
      );
    }
    
    return filtered;
  }, [tasks, expandedProject, taskStatusFilter, taskSearch]);

  // Toggle project expansion
  const toggleProject = (projectId: string) => {
    if (expandedProject === projectId) {
      setExpandedProject(null);
    } else {
      setExpandedProject(projectId);
      setActiveTab('tasks');
    }
  };

  // Calculate project statistics
  const completedProjects = projects.filter(project => project.status === 'Completed').length;
  const urgentProjects = projects.filter(project => project.priority === 'Urgent').length;
  const upcomingDeadlines = projects.filter(project => {
    const deadline = new Date(project.deadline);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && project.status !== 'Completed';
  }).length;
  const totalBudget = projects.reduce((sum, project) => sum + project.budget, 0);
  const totalSpent = projects.reduce((sum, project) => sum + project.spent, 0);

  // Function to get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low':
        return 'rgba(0, 200, 83, 0.9)';
      case 'Medium':
        return 'rgba(255, 180, 0, 0.9)';
      case 'High':
        return 'rgba(255, 130, 0, 0.9)';
      case 'Urgent':
        return 'rgba(255, 80, 80, 0.9)';
      default:
        return 'white';
    }
  };

  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planning':
        return 'rgba(0, 122, 255, 0.9)';
      case 'In Progress':
        return 'rgba(255, 180, 0, 0.9)';
      case 'Review':
        return 'rgba(175, 82, 222, 0.9)';
      case 'Completed':
        return 'rgba(0, 200, 83, 0.9)';
      case 'To Do':
        return 'rgba(0, 122, 255, 0.9)';
      case 'Ready for Review':
        return 'rgba(175, 82, 222, 0.9)';
      default:
        return 'white';
    }
  };

  // Status background colors (lighter)
  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'Planning':
        return 'rgba(0, 122, 255, 0.15)';
      case 'In Progress':
        return 'rgba(255, 180, 0, 0.15)';
      case 'Review':
        return 'rgba(175, 82, 222, 0.15)';
      case 'Completed':
        return 'rgba(0, 200, 83, 0.15)';
      case 'To Do':
        return 'rgba(0, 122, 255, 0.15)';
      case 'Ready for Review':
        return 'rgba(175, 82, 222, 0.15)';
      default:
        return 'rgba(255, 255, 255, 0.1)';
    }
  };

  // Format date to show in a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Sample data for chart
  const projectStatusData = {
    labels: ['Planning', 'In Progress', 'Review', 'Completed'],
    datasets: [
      {
        label: 'Projects by Status',
        data: [
          projects.filter(p => p.status === 'Planning').length,
          projects.filter(p => p.status === 'In Progress').length,
          projects.filter(p => p.status === 'Review').length,
          projects.filter(p => p.status === 'Completed').length,
        ],
        backgroundColor: [
          'rgba(0, 122, 255, 0.7)',
          'rgba(255, 180, 0, 0.7)',
          'rgba(175, 82, 222, 0.7)',
          'rgba(0, 200, 83, 0.7)',
        ],
        borderColor: [
          'rgba(0, 122, 255, 1)',
          'rgba(255, 180, 0, 1)',
          'rgba(175, 82, 222, 1)',
          'rgba(0, 200, 83, 1)',
        ],
        borderWidth: 1,
      },
    ],
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
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            marginBottom: '1rem',
            fontFamily: "'Rajdhani', sans-serif",
            background: 'linear-gradient(to right, #FFD700, #FFA500)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Projects
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Manage projects, assign tasks, and track progress.
          </p>
        </div>

        {/* KPI Section */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2.5rem' 
        }}>
          {/* Total Projects */}
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
              Total Projects
            </h3>
            <p style={{ 
              fontSize: '1.75rem', 
              fontWeight: 'bold',
              fontFamily: "'Rajdhani', sans-serif",
            }}>
              {projects.length}
            </p>
          </motion.div>

          {/* Completed Projects */}
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
              Completed Projects
            </h3>
            <p style={{ 
              fontSize: '1.75rem', 
              fontWeight: 'bold',
              fontFamily: "'Rajdhani', sans-serif",
              color: 'rgba(0, 200, 83, 0.9)',
            }}>
              {completedProjects}
            </p>
          </motion.div>

          {/* Urgent Projects */}
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
              Urgent Projects
            </h3>
            <p style={{ 
              fontSize: '1.75rem', 
              fontWeight: 'bold',
              fontFamily: "'Rajdhani', sans-serif",
              color: urgentProjects > 0 ? 'rgba(255, 80, 80, 0.9)' : 'white',
            }}>
              {urgentProjects}
            </p>
          </motion.div>

          {/* Budget Allocation */}
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
              Budget Allocation
            </h3>
            <p style={{ 
              fontSize: '1.75rem', 
              fontWeight: 'bold',
              fontFamily: "'Rajdhani', sans-serif",
              color: 'rgba(255, 215, 0, 0.9)',
            }}>
              ${totalBudget.toLocaleString()}
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
          {/* View Toggle */}
          <div style={{
            display: 'flex',
            background: 'rgba(30, 30, 40, 0.6)',
            borderRadius: '0.5rem',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '0.6rem 1rem',
                background: viewMode === 'list' ? 'rgba(255, 215, 0, 0.2)' : 'transparent',
                border: 'none',
                color: viewMode === 'list' ? 'rgba(255, 215, 0, 0.9)' : 'rgba(255, 255, 255, 0.7)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 6H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 12H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 18H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode('board')}
              style={{
                padding: '0.6rem 1rem',
                background: viewMode === 'board' ? 'rgba(255, 215, 0, 0.2)' : 'transparent',
                border: 'none',
                color: viewMode === 'board' ? 'rgba(255, 215, 0, 0.9)' : 'rgba(255, 255, 255, 0.7)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 3H3V10H10V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 3H14V10H21V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 14H14V21H21V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 14H3V21H10V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Board</span>
            </button>
          </div>

          {/* Search Input */}
          <div style={{
            position: 'relative',
            flex: '1',
            minWidth: '250px',
            maxWidth: '400px'
          }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search projects..."
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                borderRadius: '0.5rem',
                background: 'rgba(30, 30, 40, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'white',
                outline: 'none',
              }}
            />
            <span style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255, 255, 255, 0.5)',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            </span>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Status Filter */}
            <div style={{
              position: 'relative',
              minWidth: '150px',
            }}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  background: 'rgba(30, 30, 40, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  appearance: 'none',
                  paddingRight: '2rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="All">All Statuses</option>
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Completed">Completed</option>
              </select>
              <span style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(255, 255, 255, 0.5)',
                pointerEvents: 'none',
              }}>
                ▼
              </span>
            </div>
            
            {/* Priority Filter */}
            <div style={{
              position: 'relative',
              minWidth: '150px',
            }}>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  background: 'rgba(30, 30, 40, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  appearance: 'none',
                  paddingRight: '2rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="All">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
              <span style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(255, 255, 255, 0.5)',
                pointerEvents: 'none',
              }}>
                ▼
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>          
            {/* Add New Button */}
            <motion.button
              whileHover={{ 
                scale: 1.03, 
                backgroundColor: 'rgba(255, 215, 0, 0.3)',
                boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)'
              }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                background: 'rgba(255, 215, 0, 0.2)',
                border: '1px solid rgba(255, 215, 0, 0.5)',
                color: 'white',
                cursor: 'pointer',
                fontFamily: "'Rajdhani', sans-serif",
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span>+</span>
              <span>New Project</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Project Views */}
        <AnimatePresence mode="wait">
          {viewMode === 'list' ? (
            <motion.div
              key="list-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
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
              {/* List View Content */}
              <div style={{ padding: '1.5rem' }}>
                <h2 style={{ 
                  fontSize: '1.25rem', 
                  marginBottom: '1.5rem', 
                  color: 'rgba(255, 215, 0, 0.9)',
                  borderBottom: '1px solid rgba(255, 215, 0, 0.3)',
                  paddingBottom: '0.5rem'
                }}>
                  Project List
                </h2>
                
                {/* Projects Table */}
                <div style={{ width: '100%', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '650px' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'rgba(30, 30, 40, 0.6)', textAlign: 'left' }}>
                        <th 
                          style={{ padding: '1rem', cursor: 'pointer' }}
                          onClick={() => requestSort('name')}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>Project</span>
                            {sortConfig?.key === 'name' && (
                              <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                            )}
                          </div>
                        </th>
                        <th 
                          style={{ padding: '1rem', cursor: 'pointer' }}
                          onClick={() => requestSort('client')}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>Client</span>
                            {sortConfig?.key === 'client' && (
                              <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                            )}
                          </div>
                        </th>
                        <th 
                          style={{ padding: '1rem', cursor: 'pointer' }}
                          onClick={() => requestSort('status')}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>Status</span>
                            {sortConfig?.key === 'status' && (
                              <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                            )}
                          </div>
                        </th>
                        <th 
                          style={{ padding: '1rem', cursor: 'pointer' }}
                          onClick={() => requestSort('progress')}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>Progress</span>
                            {sortConfig?.key === 'progress' && (
                              <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                            )}
                          </div>
                        </th>
                        <th 
                          style={{ padding: '1rem', cursor: 'pointer' }}
                          onClick={() => requestSort('deadline')}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>Deadline</span>
                            {sortConfig?.key === 'deadline' && (
                              <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                            )}
                          </div>
                        </th>
                        <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{ padding: '2rem 1rem', textAlign: 'center', color: 'rgba(255, 255, 255, 0.5)' }}>
                            No projects found matching your filters.
                          </td>
                        </tr>
                      ) : (
                        filteredProjects.map((project, index) => (
                          <React.Fragment key={project.id}>
                            <motion.tr 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ backgroundColor: 'rgba(30, 30, 40, 0.8)' }}
                              onClick={() => toggleProject(project.id)}
                              style={{ 
                                backgroundColor: expandedProject === project.id 
                                  ? 'rgba(255, 215, 0, 0.1)' 
                                  : index % 2 === 0 ? 'transparent' : 'rgba(30, 30, 40, 0.3)',
                                borderBottom: expandedProject === project.id
                                  ? 'none'
                                  : '1px solid rgba(255, 255, 255, 0.05)',
                                cursor: 'pointer',
                              }}
                            >
                              <td style={{ padding: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                  <span style={{
                                    fontSize: '0.875rem',
                                    transform: expandedProject === project.id ? 'rotate(90deg)' : 'rotate(0)',
                                    transition: 'transform 0.2s ease'
                                  }}>▶</span>
                                  <div>
                                    <div style={{ fontWeight: 'bold' }}>{project.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>#{project.id}</div>
                                  </div>
                                </div>
                              </td>
                              <td style={{ padding: '1rem' }}>{project.client}</td>
                              <td style={{ padding: '1rem' }}>
                                <span 
                                  style={{
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '1rem',
                                    fontSize: '0.8rem',
                                    backgroundColor: getStatusBgColor(project.status),
                                    color: getStatusColor(project.status),
                                  }}
                                >
                                  {project.status}
                                </span>
                              </td>
                              <td style={{ padding: '1rem' }}>
                                <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <div style={{ 
                                    flex: 1,
                                    height: '6px', 
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                                    borderRadius: '3px', 
                                    overflow: 'hidden' 
                                  }}>
                                    <div style={{ 
                                      height: '100%', 
                                      width: `${project.progress}%`, 
                                      backgroundColor: getPriorityColor(project.priority),
                                      borderRadius: '3px',
                                    }}/>
                                  </div>
                                  <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                                    {project.progress}%
                                  </span>
                                </div>
                              </td>
                              <td style={{ padding: '1rem' }}>
                                {formatDate(project.deadline)}
                              </td>
                              <td style={{ padding: '1rem' }}>
                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                  <motion.button
                                    whileHover={{ 
                                      scale: 1.1, 
                                      color: 'rgba(255, 215, 0, 1)',
                                      boxShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
                                    }}
                                    whileTap={{ scale: 0.9 }}
                                    title="Edit Project"
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
                                </div>
                              </td>
                            </motion.tr>
                          </React.Fragment>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="board-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Board View - will be implemented with draggable cards */}
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem',
                marginBottom: '1.5rem'
              }}>
                {/* Status Columns */}
                {['Planning', 'In Progress', 'Review', 'Completed'].map((status) => (
                  <div
                    key={status}
                    style={{
                      background: 'rgba(20, 20, 30, 0.6)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '1rem',
                      padding: '1.5rem',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      minHeight: '400px',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <h3 style={{ 
                      fontSize: '1rem', 
                      marginBottom: '1rem', 
                      color: getStatusColor(status),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <span>{status}</span>
                      <span style={{ 
                        fontSize: '0.8rem', 
                        padding: '0.2rem 0.5rem', 
                        background: getStatusBgColor(status),
                        borderRadius: '1rem',
                      }}>
                        {projects.filter(p => p.status === status).length}
                      </span>
                    </h3>

                    {/* Project Cards - to be implemented with drag and drop */}
                    <div style={{ flex: 1 }}>
                      {filteredProjects.filter(p => p.status === status).length === 0 ? (
                        <div style={{ 
                          textAlign: 'center', 
                          padding: '2rem 0',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          color: 'rgba(255, 255, 255, 0.4)',
                          border: '2px dashed rgba(255, 255, 255, 0.1)',
                          borderRadius: '0.5rem',
                        }}>
                          <div style={{ marginBottom: '0.5rem' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <p style={{ fontSize: '0.8rem' }}>Drag items here</p>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {filteredProjects
                            .filter(p => p.status === status)
                            .map((project) => (
                              <motion.div
                                key={project.id}
                                whileHover={{ y: -5, boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)' }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                  background: 'rgba(30, 30, 40, 0.6)',
                                  backdropFilter: 'blur(10px)',
                                  borderRadius: '0.75rem',
                                  padding: '1rem',
                                  border: `1px solid ${getStatusBgColor(project.status)}`,
                                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                  cursor: 'grab',
                                  position: 'relative',
                                }}
                              >
                                {/* Priority indicator */}
                                <div style={{ 
                                  position: 'absolute', 
                                  top: '0.75rem', 
                                  right: '0.75rem',
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  backgroundColor: getPriorityColor(project.priority)
                                }} title={`Priority: ${project.priority}`} />

                                {/* Project name and ID */}
                                <div style={{ marginBottom: '0.5rem' }}>
                                  <h4 style={{ 
                                    fontSize: '1rem', 
                                    fontWeight: 'bold', 
                                    color: 'white',
                                    marginBottom: '0.25rem'
                                  }}>
                                    {project.name}
                                  </h4>
                                  <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                  }}>
                                    <span style={{ 
                                      fontSize: '0.75rem', 
                                      color: 'rgba(255, 255, 255, 0.5)',
                                    }}>
                                      {project.id}
                                    </span>
                                    <span style={{ 
                                      fontSize: '0.75rem', 
                                      color: 'rgba(255, 255, 255, 0.7)',
                                    }}>
                                      {project.client}
                                    </span>
                                  </div>
                                </div>

                                {/* Progress bar */}
                                <div style={{ marginBottom: '0.75rem' }}>
                                  <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '0.25rem',
                                  }}>
                                    <span style={{ 
                                      fontSize: '0.75rem', 
                                      color: 'rgba(255, 255, 255, 0.7)',
                                    }}>
                                      Progress
                                    </span>
                                    <span style={{ 
                                      fontSize: '0.75rem', 
                                      color: 'rgba(255, 255, 255, 0.7)',
                                    }}>
                                      {project.progress}%
                                    </span>
                                  </div>
                                  <div style={{ 
                                    height: '4px', 
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                                    borderRadius: '2px', 
                                    overflow: 'hidden' 
                                  }}>
                                    <div style={{ 
                                      height: '100%', 
                                      width: `${project.progress}%`, 
                                      backgroundColor: getPriorityColor(project.priority),
                                      borderRadius: '2px',
                                    }}/>
                                  </div>
                                </div>

                                {/* Bottom info */}
                                <div style={{ 
                                  display: 'flex', 
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  fontSize: '0.75rem',
                                  color: 'rgba(255, 255, 255, 0.6)',
                                }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M3.05 11C3.27246 7.94668 4.72033 5.14795 7.0534 3.22682C9.38648 1.3057 12.3797 0.435088 15.3667 0.865878C18.3536 1.29667 21.0353 2.98547 22.7021 5.52265C24.3688 8.05983 24.8539 11.2043 24.0414 14.1335C23.2289 17.0628 21.1817 19.5323 18.428 20.9562C15.6744 22.3801 12.4638 22.6365 9.53434 21.6716C6.60486 20.7066 4.21619 18.5941 2.90082 15.8379C1.58545 13.0816 1.44307 9.93239 2.5 7.05" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span>{formatDate(project.deadline)}</span>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span>{project.team.length}</span>
                                  </div>
                                </div>

                                {/* Quick Actions */}
                                <div style={{ 
                                  display: 'flex',
                                  justifyContent: 'flex-end',
                                  marginTop: '0.75rem',
                                  gap: '0.5rem'
                                }}>
                                  <motion.button
                                    whileHover={{ 
                                      scale: 1.1, 
                                      color: 'rgba(255, 215, 0, 1)',
                                    }}
                                    whileTap={{ scale: 0.9 }}
                                    title="Edit Project"
                                    style={{
                                      width: '24px',
                                      height: '24px',
                                      borderRadius: '50%',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      background: 'transparent',
                                      border: 'none',
                                      color: 'rgba(255, 255, 255, 0.5)',
                                      cursor: 'pointer',
                                      fontSize: '0.75rem',
                                      padding: 0
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
                                      color: 'rgba(255, 215, 0, 1)',
                                    }}
                                    whileTap={{ scale: 0.9 }}
                                    title="View Tasks"
                                    style={{
                                      width: '24px',
                                      height: '24px',
                                      borderRadius: '50%',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      background: 'transparent',
                                      border: 'none',
                                      color: 'rgba(255, 255, 255, 0.5)',
                                      cursor: 'pointer',
                                      fontSize: '0.75rem',
                                      padding: 0
                                    }}
                                  >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M8 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M8 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M8 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M3 6H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M3 12H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M3 18H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  </motion.button>
                                </div>
                              </motion.div>
                            ))
                          }
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Projects; 