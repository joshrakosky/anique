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

const EComm: React.FC = () => {
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
            eComm Projects
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Manage e-commerce projects, assign tasks, and track progress.
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
      </motion.div>
    </div>
  );
};

export default EComm; 