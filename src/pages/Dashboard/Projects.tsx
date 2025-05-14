import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement } from 'chart.js';

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
  status: 'Planning' | 'In Progress' | 'Review' | 'Completed' | 'On Hold' | 'Awaiting Reply';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  deadline: string;
  progress: number;
  budget: number;
  spent: number;
  manager: string;
  team: string[];
  scope?: string;
  contacts?: { name: string; email: string }[];
  nextSteps?: { id: string; text: string; completed: boolean }[];
  knowledgeTags?: ('users' | 'onboarding' | 'build' | 'ftp' | 'issue' | 'gift-cards' | 'promos' | 'art' | 'pricing' | 'research')[];
  statusTags?: {
    tag: 'Planning' | 'In Progress' | 'Review' | 'Completed' | 'On Hold' | 'Awaiting Reply';
    description: string;
  }[];
  sharedLink?: string;
  attachments?: { id: string; name: string; type: string; size: string; url: string }[];
  accountManager?: { name: string; email: string };
  projectManager?: { name: string; email: string };
  received?: string;
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
      team: ['Mike Peterson', 'Lisa Chen', 'Dave Miller'],
      scope: 'Complete redesign of the company website with modern UI/UX principles. Implementing responsive design and optimizing for mobile devices.',
      contacts: [
        { name: 'John Smith', email: 'john.smith@acmecorp.com' },
        { name: 'Emily Brown', email: 'emily.brown@acmecorp.com' }
      ],
      nextSteps: [
        { id: 'ns1', text: 'Finalize homepage mockup', completed: true },
        { id: 'ns2', text: 'Client review meeting', completed: false },
        { id: 'ns3', text: 'Implement feedback from stakeholders', completed: false }
      ],
      knowledgeTags: ['build', 'users'],
      statusTags: [
        { tag: 'In Progress', description: 'Active development is underway. Team is working on implementing the planned tasks.' },
        { tag: 'Completed', description: 'All project tasks have been completed successfully and the project has been delivered.' }
      ],
      sharedLink: 'https://docs.google.com/spreadsheets/d/1abc123def456/edit?usp=sharing',
      attachments: [
        { id: 'att1', name: 'Design_Requirements.pdf', type: 'pdf', size: '1.2 MB', url: '#' },
        { id: 'att2', name: 'Homepage_Mockup_v2.fig', type: 'fig', size: '3.5 MB', url: '#' },
        { id: 'att3', name: 'Client_Feedback.docx', type: 'docx', size: '0.8 MB', url: '#' }
      ],
      accountManager: { name: 'Alex Johnson', email: 'alex.johnson@anique.com' },
      projectManager: { name: 'Sarah Jenkins', email: 'sarah.jenkins@anique.com' },
      received: '2023-09-10'
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
      team: ['Anita Singh', 'Carlos Rodriguez', 'Emma Wilson', 'Jason Lee'],
      scope: 'Development of a cross-platform mobile application for iOS and Android with real-time data synchronization and offline capabilities.',
      contacts: [
        { name: 'Michael Johnson', email: 'michael.j@techstart.co' },
        { name: 'Sarah Williams', email: 'sarah.w@techstart.co' }
      ],
      nextSteps: [
        { id: 'ns1', text: 'Finalize app architecture', completed: false },
        { id: 'ns2', text: 'Create UI component library', completed: false },
        { id: 'ns3', text: 'Set up CI/CD pipeline', completed: false }
      ],
      knowledgeTags: ['onboarding', 'build'],
      statusTags: [
        { tag: 'Planning', description: 'Project is in the initial planning phase. Tasks are being defined and resources allocated.' }
      ],
      received: '2023-10-05'
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
      team: ['Tom Hayes', 'Julia Fox'],
      scope: 'Integration of an e-commerce platform with existing inventory management system, including payment gateway setup and order processing automation.',
      contacts: [
        { name: 'Rebecca Taylor', email: 'rebecca@fashiontrends.com' }
      ],
      nextSteps: [
        { id: 'ns1', text: 'Test payment gateway', completed: true },
        { id: 'ns2', text: 'Final security audit', completed: false },
        { id: 'ns3', text: 'Customer data migration', completed: true }
      ],
      knowledgeTags: ['ftp', 'issue'],
      statusTags: [
        { tag: 'Review', description: 'Project deliverables are being reviewed by stakeholders or going through quality assurance.' }
      ],
      received: '2023-08-15'
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
      team: ['Rachel Green', 'Alex Morgan'],
      scope: 'Creation of an interactive analytics dashboard with data visualization components, real-time updates, and export capabilities.',
      contacts: [
        { name: 'Daniel Lee', email: 'd.lee@datainsights.io' },
        { name: 'Amanda Phillips', email: 'a.phillips@datainsights.io' }
      ],
      nextSteps: [
        { id: 'ns1', text: 'Knowledge transfer session', completed: true },
        { id: 'ns2', text: 'Documentation finalization', completed: true },
        { id: 'ns3', text: 'Maintenance handover', completed: true }
      ],
      knowledgeTags: ['users', 'build'],
      statusTags: [
        { tag: 'Completed', description: 'All project tasks have been completed successfully and the project has been delivered.' }
      ],
      received: '2023-07-30'
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
      team: ['Brian White', 'Sophie Turner'],
      scope: 'Comprehensive SEO optimization including keyword research, on-page improvements, content strategy, and technical SEO fixes.',
      contacts: [
        { name: 'Greg Mason', email: 'greg@growthhackers.com' },
        { name: 'Lisa Ford', email: 'lisa@growthhackers.com' }
      ],
      nextSteps: [
        { id: 'ns1', text: 'Complete keyword mapping', completed: true },
        { id: 'ns2', text: 'Implement meta tag optimizations', completed: false },
        { id: 'ns3', text: 'Content gap analysis', completed: false }
      ],
      knowledgeTags: ['issue', 'onboarding'],
      statusTags: [
        { tag: 'In Progress', description: 'Active development is underway. Team is working on implementing the planned tasks.' }
      ],
      received: '2023-09-25'
    },
  ]);

  // Sample tasks data
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  const [showCriticalOnly, setShowCriticalOnly] = useState<boolean>(false);
  
  // Tooltip state for status popup
  const [statusTooltip, setStatusTooltip] = useState<{visible: boolean; status: string; x: number; y: number}>({
    visible: false,
    status: '',
    x: 0,
    y: 0
  });
  
  // Sort config for projects
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Project;
    direction: 'ascending' | 'descending';
  } | null>(null);

  // State for expanded project and active tab
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeTab, setActiveTab] = useState<'tasks' | 'details' | 'team'>('tasks');

  // State for editable fields in expanded view
  const [editableScopeId, setEditableScopeId] = useState<string | null>(null);
  const [editableScope, setEditableScope] = useState<string>('');
  const [datePickerVisible, setDatePickerVisible] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [newNextStep, setNewNextStep] = useState<string>('');
  
  // State for shared link and attachments
  const [editableSharedLinkId, setEditableSharedLinkId] = useState<string | null>(null);
  const [editableSharedLink, setEditableSharedLink] = useState<string>('');
  const [uploadingAttachment, setUploadingAttachment] = useState<boolean>(false);
  const [fileUploadName, setFileUploadName] = useState<string>('');
  
  // State for drag and drop
  const [draggedProject, setDraggedProject] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<string | null>(null);

  // State for project completion modal
  const [completionModal, setCompletionModal] = useState<{
    visible: boolean;
    projectId: string;
    projectName: string;
  }>({
    visible: false,
    projectId: '',
    projectName: ''
  });

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
    
    // Apply critical filter
    if (showCriticalOnly) {
      filtered = filtered.filter(project => project.priority === 'Urgent');
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
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue !== undefined && bValue !== undefined) {
          if (aValue < bValue) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
        }
        return 0;
      });
    }
    
    return filtered;
  }, [projects, statusFilter, priorityFilter, searchTerm, sortConfig, showCriticalOnly]);

  // Sort function for projects
  const requestSort = (key: keyof Project) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // State variables for tasks
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [taskStatusFilter, setTaskStatusFilter] = useState<string>('All');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [taskSearch, setTaskSearch] = useState<string>('');

  // Filter tasks based on selected project and filters
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const upcomingDeadlines = projects.filter(project => {
    const deadline = new Date(project.deadline);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && project.status !== 'Completed';
  }).length;
  const totalBudget = projects.reduce((sum, project) => sum + project.budget, 0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // Get status description for tooltip
  const getStatusDescription = (status: string): string => {
    switch (status) {
      case 'Planning':
        return 'Project is in the initial planning phase. Tasks are being defined and resources allocated.';
      case 'In Progress':
        return 'Active development is underway. Team is working on implementing the planned tasks.';
      case 'Review':
        return 'Project deliverables are being reviewed by stakeholders or going through quality assurance.';
      case 'Completed':
        return 'All project tasks have been completed successfully and the project has been delivered.';
      case 'To Do':
        return 'Tasks that have been identified but work has not yet started.';
      case 'Ready for Review':
        return 'Tasks are complete and ready for inspection, approval, or feedback.';
      default:
        return 'Status information not available.';
    }
  };

  // Format date to show in a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Sample data for chart
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // Function to add a new next step
  const addNextStep = (projectId: string) => {
    if (!newNextStep.trim()) return;
    
    setProjects(prevProjects => {
      return prevProjects.map(p => {
        if (p.id === projectId) {
          const newStep = {
            id: `ns${Date.now()}`,
            text: newNextStep,
            completed: false
          };
          return {
            ...p,
            nextSteps: [...(p.nextSteps || []), newStep]
          };
        }
        return p;
      });
    });
    setNewNextStep('');
  };

  // Function to toggle next step completion
  const toggleNextStep = (projectId: string, stepId: string) => {
    setProjects(prevProjects => {
      return prevProjects.map(p => {
        if (p.id === projectId && p.nextSteps) {
          return {
            ...p,
            nextSteps: p.nextSteps.map(step => 
              step.id === stepId ? { ...step, completed: !step.completed } : step
            )
          };
        }
        return p;
      });
    });
  };

  // Function to update project deadline
  const updateDeadline = (projectId: string, newDeadline: string) => {
    setProjects(prevProjects => {
      return prevProjects.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            deadline: newDeadline
          };
        }
        return p;
      });
    });
    setDatePickerVisible(null);
  };

  // Function to update project scope
  const updateScope = (projectId: string) => {
    if (!editableScope.trim()) return;
    
    setProjects(prevProjects => {
      return prevProjects.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            scope: editableScope
          };
        }
        return p;
      });
    });
    setEditableScopeId(null);
  };

  // Function to add or remove tag
  const toggleTag = (projectId: string, tag: 'users' | 'onboarding' | 'build' | 'ftp' | 'issue' | 'gift-cards' | 'promos' | 'art' | 'pricing' | 'research') => {
    setProjects(prevProjects => {
      return prevProjects.map(p => {
        if (p.id === projectId) {
          const currentTags = p.knowledgeTags || [];
          if (currentTags.includes(tag)) {
            return {
              ...p,
              knowledgeTags: currentTags.filter(t => t !== tag)
            };
          } else {
            return {
              ...p,
              knowledgeTags: [...currentTags, tag]
            };
          }
        }
        return p;
      });
    });
  };

  // Function to export projects to Excel
  const exportToExcel = () => {
    // In a real application, this would create and download an Excel file
    // For this prototype, we'll just show a notification
    alert('Projects data exported to Excel');
  };

  // Function to update shared link 
  const updateSharedLink = (projectId: string) => {
    if (!editableSharedLink.trim()) return;
    
    setProjects(prevProjects => {
      return prevProjects.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            sharedLink: editableSharedLink
          };
        }
        return p;
      });
    });
    setEditableSharedLinkId(null);
  };

  // Function to handle file upload
  const handleFileUpload = (projectId: string) => {
    if (!fileUploadName.trim()) return;
    
    // In a real app, this would handle actual file upload
    // For this prototype, we'll just simulate adding a file
    const fileType = fileUploadName.split('.').pop() || '';
    const newAttachment = {
      id: `attach-${Date.now()}`,
      name: fileUploadName,
      type: fileType,
      size: '1.2 MB', // Dummy size
      url: '#' // Dummy URL
    };
    
    setProjects(prevProjects => {
      return prevProjects.map(p => {
        if (p.id === projectId) {
          const currentAttachments = p.attachments || [];
          return {
            ...p,
            attachments: [...currentAttachments, newAttachment]
          };
        }
        return p;
      });
    });
    
    setFileUploadName('');
    setUploadingAttachment(false);
  };

  // Function to remove an attachment
  const removeAttachment = (projectId: string, attachmentId: string) => {
    setProjects(prevProjects => {
      return prevProjects.map(p => {
        if (p.id === projectId && p.attachments) {
          return {
            ...p,
            attachments: p.attachments.filter(a => a.id !== attachmentId)
          };
        }
        return p;
      });
    });
  };

  // Function to complete a project
  const completeProject = (projectId: string) => {
    setProjects(prevProjects => {
      return prevProjects.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            status: 'Completed',
            progress: 100
          };
        }
        return p;
      });
    });
    setCompletionModal({
      visible: false,
      projectId: '',
      projectName: ''
    });
  };

  // Drag and drop functions
  const handleDragStart = (projectId: string) => {
    setDraggedProject(projectId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, status: string) => {
    e.preventDefault();
    setDragOverStatus(status);
  };

  const handleDragLeave = () => {
    setDragOverStatus(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: string) => {
    e.preventDefault();
    if (draggedProject) {
      // Update project status
      setProjects(prevProjects => {
        return prevProjects.map(p => {
          if (p.id === draggedProject) {
            return {
              ...p,
              status: newStatus as any
            };
          }
          return p;
        });
      });
    }
    
    // Reset drag states
    setDraggedProject(null);
    setDragOverStatus(null);
  };

  return (
    <div style={{ 
      padding: '2rem 2rem 2rem 2rem', 
      minHeight: '100vh',
      background: 'black',
    }}>
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

          {/* In Progress Projects */}
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
              In Progress
            </h3>
            <p style={{ 
              fontSize: '1.75rem', 
              fontWeight: 'bold',
              fontFamily: "'Rajdhani', sans-serif",
              color: 'rgba(255, 180, 0, 0.9)',
            }}>
              {projects.filter(p => p.status === 'In Progress').length}
            </p>
          </motion.div>

          {/* Review Projects */}
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
              Review
            </h3>
            <p style={{ 
              fontSize: '1.75rem', 
              fontWeight: 'bold',
              fontFamily: "'Rajdhani', sans-serif",
              color: 'rgba(175, 82, 222, 0.9)',
            }}>
              {projects.filter(p => p.status === 'Review').length}
            </p>
          </motion.div>

          {/* Critical Projects */}
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
              Critical Projects
            </h3>
            <p style={{ 
              fontSize: '1.75rem', 
              fontWeight: 'bold',
              fontFamily: "'Rajdhani', sans-serif",
              color: 'rgba(255, 80, 80, 0.9)',
            }}>
              {projects.filter(p => p.priority === 'Urgent').length}
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
              placeholder="Search projects..."
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                borderRadius: '0.5rem',
                background: 'rgba(30, 30, 40, 0.6)',
                border: '1px solid rgba(255, 215, 0, 0.2)',
                color: 'rgba(255, 215, 0, 0.9)',
                outline: 'none',
              }}
            />
            <span style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255, 215, 0, 0.7)',
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

          {/* View Toggle in the middle */}
          <div style={{
            flex: 'none',
            width: 'calc(25% - 1.125rem)', // Match KPI card width
            display: 'flex',
            justifyContent: 'center',
            alignSelf: 'flex-start',
          }}>
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
          </div>

          {/* Filter dropdowns under Urgent Projects KPI */}
          <div style={{ 
            flex: 'none',
            width: 'calc(25% - 1.125rem)', // Match KPI card width
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'center',
            alignSelf: 'flex-start',
          }}>
            {/* Status Filter */}
            <div style={{
              position: 'relative',
              width: '50%'
            }}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  background: 'rgba(30, 30, 40, 0.6)',
                  border: '1px solid rgba(255, 215, 0, 0.2)',
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
                color: 'rgba(255, 215, 0, 0.7)',
                pointerEvents: 'none',
              }}>
                ▼
              </span>
            </div>
            
            {/* Priority Filter */}
            <div style={{
              position: 'relative',
              width: '50%'
            }}>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  background: 'rgba(30, 30, 40, 0.6)',
                  border: '1px solid rgba(255, 215, 0, 0.2)',
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
                color: 'rgba(255, 215, 0, 0.7)',
                pointerEvents: 'none',
              }}>
                ▼
              </span>
            </div>
          </div>

          {/* Action buttons aligned right under Budget Allocation KPI */}
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            alignItems: 'center',
            flex: 'none',
            width: 'calc(25% - 1.125rem)', // Match KPI card width
            justifyContent: 'flex-end',
            alignSelf: 'flex-start',
          }}>
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
              title="Show Urgent Projects Only"
            >
              <span style={{ 
                fontWeight: 'bold', 
                fontSize: '1.5rem',
                color: showCriticalOnly ? 'white' : 'rgba(255, 215, 0, 0.9)', // Make it gold when not active
              }}>!</span>
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
              title="Add New Project"
            >
              +
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
                      <tr style={{ backgroundColor: 'rgba(30, 30, 40, 0.6)', textAlign: 'center' }}>
                        <th 
                          style={{ padding: '1rem', cursor: 'pointer' }}
                          onClick={() => requestSort('name')}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
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
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
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
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
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
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <span>Progress</span>
                            {sortConfig?.key === 'progress' && (
                              <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                            )}
                          </div>
                        </th>
                        <th 
                          style={{ padding: '1rem', cursor: 'pointer' }}
                          onClick={() => requestSort('received')}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <span>Received</span>
                            {sortConfig?.key === 'received' && (
                              <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                            )}
                          </div>
                        </th>
                        <th 
                          style={{ padding: '1rem', cursor: 'pointer' }}
                          onClick={() => requestSort('deadline')}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <span>Deadline</span>
                            {sortConfig?.key === 'deadline' && (
                              <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                            )}
                          </div>
                        </th>
                        <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
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
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center' }}>
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
                              <td style={{ padding: '1rem', textAlign: 'center' }}>{project.client}</td>
                              <td style={{ padding: '1rem', textAlign: 'center' }}>
                                <span 
                                  style={{
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '1rem',
                                    fontSize: '0.8rem',
                                    backgroundColor: getStatusBgColor(project.status),
                                    color: getStatusColor(project.status),
                                    position: 'relative',
                                    cursor: 'help'
                                  }}
                                  onMouseEnter={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setStatusTooltip({
                                      visible: true,
                                      status: project.status,
                                      x: rect.left + rect.width/2,
                                      y: rect.bottom + window.scrollY + 5
                                    });
                                  }}
                                  onMouseLeave={() => {
                                    setStatusTooltip({...statusTooltip, visible: false});
                                  }}
                                >
                                  {project.status}
                                </span>
                              </td>
                              <td style={{ padding: '1rem', textAlign: 'center' }}>
                                <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                                  <div style={{ 
                                    width: '80px',
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
                                  <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)', width: '30px', textAlign: 'left' }}>
                                    {project.progress}%
                                  </span>
                                </div>
                              </td>
                              <td style={{ padding: '1rem', textAlign: 'center' }}>
                                {formatDate(project.received || '')}
                              </td>
                              <td style={{ padding: '1rem', textAlign: 'center' }}>
                                <div 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDatePickerVisible(project.id);
                                    setSelectedDate(project.deadline);
                                  }}
                                  style={{ 
                                    cursor: 'pointer',
                                    display: 'inline-block',
                                    transition: 'all 0.2s',
                                    borderRadius: '0.25rem',
                                    padding: '0.25rem 0.5rem',
                                    backgroundColor: 'transparent'
                                  }}
                                  onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(255, 215, 0, 0.1)';
                                  }}
                                  onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                  }}
                                >
                                  {formatDate(project.deadline)}
                                </div>
                                {datePickerVisible === project.id && (
                                  <div style={{
                                    position: 'absolute',
                                    zIndex: 10,
                                    backgroundColor: 'rgba(30, 30, 40, 0.95)',
                                    borderRadius: '0.5rem',
                                    padding: '1rem',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                                    border: '1px solid rgba(255, 215, 0, 0.3)',
                                    backdropFilter: 'blur(10px)'
                                  }}>
                                    <div style={{ marginBottom: '1rem' }}>
                                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                                        Select new deadline date:
                                      </label>
                                      <input 
                                        type="date" 
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        style={{
                                          padding: '0.5rem',
                                          backgroundColor: 'rgba(20, 20, 30, 0.8)',
                                          border: '1px solid rgba(255, 255, 255, 0.2)',
                                          borderRadius: '0.25rem',
                                          color: 'white',
                                          width: '100%'
                                        }}
                                      />
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setDatePickerVisible(null);
                                        }}
                                        style={{
                                          padding: '0.5rem 0.75rem',
                                          backgroundColor: 'transparent',
                                          border: '1px solid rgba(255, 255, 255, 0.2)',
                                          borderRadius: '0.25rem',
                                          color: 'white',
                                          cursor: 'pointer'
                                        }}
                                      >
                                        Cancel
                                      </button>
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          updateDeadline(project.id, selectedDate);
                                        }}
                                        style={{
                                          padding: '0.5rem 0.75rem',
                                          backgroundColor: 'rgba(255, 215, 0, 0.2)',
                                          border: '1px solid rgba(255, 215, 0, 0.5)',
                                          borderRadius: '0.25rem',
                                          color: 'white',
                                          cursor: 'pointer'
                                        }}
                                      >
                                        Update
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </td>
                              <td style={{ padding: '1rem' }}>
                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                  {/* Critical/Urgent toggle button */}
                                  <motion.button
                                    whileHover={{ 
                                      scale: 1.1, 
                                      color: project.priority === 'Urgent' ? 'rgba(255, 80, 80, 1)' : 'rgba(255, 215, 0, 1)',
                                      boxShadow: project.priority === 'Urgent' ? '0 0 10px rgba(255, 80, 80, 0.3)' : '0 0 10px rgba(255, 215, 0, 0.3)'
                                    }}
                                    whileTap={{ scale: 0.9 }}
                                    title={project.priority === 'Urgent' ? "Remove Critical Status" : "Mark as Critical"}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setProjects(prevProjects => {
                                        return prevProjects.map(p => {
                                          if (p.id === project.id) {
                                            return {
                                              ...p,
                                              priority: p.priority === 'Urgent' ? 'High' : 'Urgent'
                                            };
                                          }
                                          return p;
                                        });
                                      });
                                    }}
                                    style={{
                                      width: '32px',
                                      height: '32px',
                                      borderRadius: '50%',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      background: project.priority === 'Urgent' ? 'rgba(255, 80, 80, 0.15)' : 'rgba(255, 215, 0, 0.15)',
                                      border: `1px solid ${project.priority === 'Urgent' ? 'rgba(255, 80, 80, 0.5)' : 'rgba(255, 215, 0, 0.5)'}`,
                                      color: project.priority === 'Urgent' ? 'rgba(255, 80, 80, 0.7)' : 'rgba(255, 215, 0, 0.7)',
                                      cursor: 'pointer',
                                      fontSize: '0.875rem'
                                    }}
                                  >
                                    <span style={{ 
                                      fontWeight: 'bold', 
                                      fontSize: '1.5rem',
                                    }}>!</span>
                                  </motion.button>
                                  
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
                                      color: 'rgba(0, 200, 83, 1)',
                                      boxShadow: '0 0 10px rgba(0, 200, 83, 0.3)'
                                    }}
                                    whileTap={{ scale: 0.9 }}
                                    title="Complete Project"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setCompletionModal({
                                        visible: true,
                                        projectId: project.id,
                                        projectName: project.name
                                      });
                                    }}
                                    style={{
                                      width: '32px',
                                      height: '32px',
                                      borderRadius: '50%',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      background: 'rgba(0, 200, 83, 0.15)',
                                      border: '1px solid rgba(0, 200, 83, 0.5)',
                                      color: 'rgba(0, 200, 83, 0.7)',
                                      cursor: 'pointer',
                                      fontSize: '0.875rem'
                                    }}
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  </motion.button>
                                </div>
                              </td>
                            </motion.tr>

                            {/* Expanded Row Content */}
                            {expandedProject === project.id && (
                              <motion.tr
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                style={{ 
                                  backgroundColor: 'rgba(30, 30, 40, 0.4)',
                                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                                }}
                              >
                                <td colSpan={6} style={{ padding: '1.5rem' }}>
                                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                    {/* Left Column */}
                                    <div>
                                      {/* Scope of Work */}
                                      <div style={{ marginBottom: '1.5rem' }}>
                                        <div style={{ 
                                          display: 'flex', 
                                          justifyContent: 'space-between', 
                                          alignItems: 'center',
                                          marginBottom: '0.5rem'
                                        }}>
                                          <h3 style={{ 
                                            fontSize: '1rem',
                                            color: 'rgba(255, 215, 0, 0.9)',
                                          }}>
                                            Scope of Work
                                          </h3>
                                          <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              if (editableScopeId === project.id) {
                                                updateScope(project.id);
                                              } else {
                                                setEditableScopeId(project.id);
                                                setEditableScope(project.scope || '');
                                              }
                                            }}
                                            style={{
                                              padding: '0.25rem 0.5rem',
                                              backgroundColor: 'transparent',
                                              border: '1px solid rgba(255, 215, 0, 0.5)',
                                              borderRadius: '0.25rem',
                                              color: 'rgba(255, 215, 0, 0.8)',
                                              cursor: 'pointer',
                                              fontSize: '0.75rem'
                                            }}
                                          >
                                            {editableScopeId === project.id ? 'Save' : 'Edit'}
                                          </motion.button>
                                        </div>

                                        {editableScopeId === project.id ? (
                                          <textarea
                                            value={editableScope}
                                            onChange={(e) => setEditableScope(e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            style={{
                                              width: '100%',
                                              minHeight: '120px',
                                              padding: '0.75rem',
                                              backgroundColor: 'rgba(20, 20, 30, 0.7)',
                                              border: '1px solid rgba(255, 255, 255, 0.2)',
                                              borderRadius: '0.5rem',
                                              color: 'white',
                                              resize: 'vertical',
                                              fontFamily: 'inherit'
                                            }}
                                            placeholder="Enter scope of work..."
                                          />
                                        ) : (
                                          <div style={{ 
                                            padding: '0.75rem',
                                            backgroundColor: 'rgba(20, 20, 30, 0.7)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '0.5rem',
                                            color: 'rgba(255, 255, 255, 0.8)',
                                            fontSize: '0.9rem',
                                            lineHeight: '1.5'
                                          }}>
                                            {project.scope || 'No scope of work defined.'}
                                          </div>
                                        )}
                                      </div>

                                      {/* Contacts */}
                                      <div style={{ marginBottom: '1.5rem' }}>
                                        <h3 style={{ 
                                          fontSize: '1rem',
                                          color: 'rgba(255, 215, 0, 0.9)',
                                          marginBottom: '0.5rem'
                                        }}>
                                          Contacts
                                        </h3>
                                        <div style={{ 
                                          backgroundColor: 'rgba(20, 20, 30, 0.7)',
                                          border: '1px solid rgba(255, 255, 255, 0.1)',
                                          borderRadius: '0.5rem',
                                          overflow: 'hidden'
                                        }}>
                                          {project.contacts && project.contacts.length > 0 ? (
                                            project.contacts.map((contact, idx) => (
                                              <div 
                                                key={idx} 
                                                style={{ 
                                                  padding: '0.75rem',
                                                  borderBottom: idx < (project.contacts?.length || 0) - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                                                  display: 'flex',
                                                  justifyContent: 'space-between',
                                                  alignItems: 'center'
                                                }}
                                              >
                                                <div>
                                                  <div style={{ fontWeight: 'bold' }}>{contact.name}</div>
                                                  <div style={{ 
                                                    fontSize: '0.8rem', 
                                                    color: 'rgba(255, 255, 255, 0.6)' 
                                                  }}>
                                                    {contact.email}
                                                  </div>
                                                </div>
                                                <motion.button
                                                  whileHover={{ scale: 1.1, color: 'rgba(255, 215, 0, 0.9)' }}
                                                  whileTap={{ scale: 0.9 }}
                                                  onClick={(e) => e.stopPropagation()}
                                                  style={{
                                                    backgroundColor: 'transparent',
                                                    border: 'none',
                                                    color: 'rgba(255, 255, 255, 0.6)',
                                                    cursor: 'pointer',
                                                    fontSize: '0.875rem',
                                                    padding: '0.25rem'
                                                  }}
                                                >
                                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z" fill="currentColor"/>
                                                  </svg>
                                                </motion.button>
                                              </div>
                                            ))
                                          ) : (
                                            <div style={{ 
                                              padding: '0.75rem',
                                              color: 'rgba(255, 255, 255, 0.5)',
                                              textAlign: 'center',
                                              fontStyle: 'italic',
                                              fontSize: '0.9rem'
                                            }}>
                                              No contacts added.
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      
                                      {/* Account Manager */}
                                      <div style={{ marginBottom: '1.5rem' }}>
                                        <h3 style={{ 
                                          fontSize: '1rem',
                                          color: 'rgba(255, 215, 0, 0.9)',
                                          marginBottom: '0.5rem'
                                        }}>
                                          Account Manager
                                        </h3>
                                        <div style={{ 
                                          backgroundColor: 'rgba(20, 20, 30, 0.7)',
                                          border: '1px solid rgba(255, 255, 255, 0.1)',
                                          borderRadius: '0.5rem',
                                          overflow: 'hidden'
                                        }}>
                                          {project.accountManager ? (
                                            <div 
                                              style={{ 
                                                padding: '0.75rem',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                              }}
                                            >
                                              <div>
                                                <div style={{ fontWeight: 'bold' }}>{project.accountManager.name}</div>
                                                <div style={{ 
                                                  fontSize: '0.8rem', 
                                                  color: 'rgba(255, 255, 255, 0.6)' 
                                                }}>
                                                  {project.accountManager.email}
                                                </div>
                                              </div>
                                              <motion.button
                                                whileHover={{ scale: 1.1, color: 'rgba(255, 215, 0, 0.9)' }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={(e) => e.stopPropagation()}
                                                style={{
                                                  backgroundColor: 'transparent',
                                                  border: 'none',
                                                  color: 'rgba(255, 255, 255, 0.6)',
                                                  cursor: 'pointer',
                                                  fontSize: '0.875rem',
                                                  padding: '0.25rem'
                                                }}
                                              >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                  <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z" fill="currentColor"/>
                                                </svg>
                                              </motion.button>
                                            </div>
                                          ) : (
                                            <div style={{ 
                                              padding: '0.75rem',
                                              color: 'rgba(255, 255, 255, 0.5)',
                                              textAlign: 'center',
                                              fontStyle: 'italic',
                                              fontSize: '0.9rem'
                                            }}>
                                              No account manager assigned.
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      {/* Project Manager */}
                                      <div style={{ marginBottom: '1.5rem' }}>
                                        <h3 style={{ 
                                          fontSize: '1rem',
                                          color: 'rgba(255, 215, 0, 0.9)',
                                          marginBottom: '0.5rem'
                                        }}>
                                          Project Manager
                                        </h3>
                                        <div style={{ 
                                          backgroundColor: 'rgba(20, 20, 30, 0.7)',
                                          border: '1px solid rgba(255, 255, 255, 0.1)',
                                          borderRadius: '0.5rem',
                                          overflow: 'hidden'
                                        }}>
                                          {project.projectManager ? (
                                            <div 
                                              style={{ 
                                                padding: '0.75rem',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                              }}
                                            >
                                              <div>
                                                <div style={{ fontWeight: 'bold' }}>{project.projectManager.name}</div>
                                                <div style={{ 
                                                  fontSize: '0.8rem', 
                                                  color: 'rgba(255, 255, 255, 0.6)' 
                                                }}>
                                                  {project.projectManager.email}
                                                </div>
                                              </div>
                                              <motion.button
                                                whileHover={{ scale: 1.1, color: 'rgba(255, 215, 0, 0.9)' }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={(e) => e.stopPropagation()}
                                                style={{
                                                  backgroundColor: 'transparent',
                                                  border: 'none',
                                                  color: 'rgba(255, 255, 255, 0.6)',
                                                  cursor: 'pointer',
                                                  fontSize: '0.875rem',
                                                  padding: '0.25rem'
                                                }}
                                              >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                  <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z" fill="currentColor"/>
                                                </svg>
                                              </motion.button>
                                            </div>
                                          ) : (
                                            <div style={{ 
                                              padding: '0.75rem',
                                              color: 'rgba(255, 255, 255, 0.5)',
                                              textAlign: 'center',
                                              fontStyle: 'italic',
                                              fontSize: '0.9rem'
                                            }}>
                                              No project manager assigned.
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Right Column */}
                                    <div>
                                      {/* Knowledge Tags */}
                                      <div style={{ marginBottom: '1.5rem' }}>
                                        <h3 style={{ 
                                          fontSize: '1rem',
                                          color: 'rgba(255, 215, 0, 0.9)',
                                          marginBottom: '0.5rem'
                                        }}>
                                          Knowledge Tags
                                        </h3>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                          {['users', 'onboarding', 'build', 'ftp', 'issue', 'gift-cards', 'promos', 'art', 'pricing', 'research'].map(tag => {
                                            const isActive = project.knowledgeTags?.includes(tag as any);
                                            return (
                                              <motion.div
                                                key={tag}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  toggleTag(project.id, tag as any);
                                                }}
                                                style={{
                                                  padding: '0.35rem 0.75rem',
                                                  borderRadius: '1rem',
                                                  backgroundColor: isActive ? 'rgba(255, 215, 0, 0.2)' : 'rgba(30, 30, 40, 0.7)',
                                                  border: `1px solid ${isActive ? 'rgba(255, 215, 0, 0.5)' : 'rgba(255, 255, 255, 0.2)'}`,
                                                  color: isActive ? 'rgba(255, 215, 0, 0.9)' : 'rgba(255, 255, 255, 0.7)',
                                                  cursor: 'pointer',
                                                  fontSize: '0.8rem',
                                                  textTransform: 'capitalize',
                                                  userSelect: 'none'
                                                }}
                                              >
                                                {tag}
                                              </motion.div>
                                            );
                                          })}
                                        </div>
                                      </div>

                                      {/* Next Steps */}
                                      <div style={{ marginBottom: '1.5rem' }}>
                                        <h3 style={{ 
                                          fontSize: '1rem',
                                          color: 'rgba(255, 215, 0, 0.9)',
                                          marginBottom: '0.5rem'
                                        }}>
                                          Next Steps
                                        </h3>
                                        <div style={{ 
                                          backgroundColor: 'rgba(20, 20, 30, 0.7)',
                                          border: '1px solid rgba(255, 255, 255, 0.1)',
                                          borderRadius: '0.5rem',
                                          padding: '0.75rem',
                                          marginBottom: '0.75rem'
                                        }}>
                                          {project.nextSteps && project.nextSteps.length > 0 ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                              {project.nextSteps.map(step => (
                                                <div 
                                                  key={step.id} 
                                                  style={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: '0.5rem' 
                                                  }}
                                                >
                                                  <input 
                                                    type="checkbox" 
                                                    checked={step.completed}
                                                    onChange={(e) => {
                                                      e.stopPropagation();
                                                      toggleNextStep(project.id, step.id);
                                                    }}
                                                    style={{ cursor: 'pointer' }}
                                                  />
                                                  <span style={{ 
                                                    textDecoration: step.completed ? 'line-through' : 'none',
                                                    color: step.completed ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.9)'
                                                  }}>
                                                    {step.text}
                                                  </span>
                                                </div>
                                              ))}
                                            </div>
                                          ) : (
                                            <div style={{ 
                                              color: 'rgba(255, 255, 255, 0.5)',
                                              textAlign: 'center',
                                              fontStyle: 'italic',
                                              fontSize: '0.9rem'
                                            }}>
                                              No next steps defined.
                                            </div>
                                          )}
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                          <input
                                            type="text"
                                            value={newNextStep}
                                            onChange={(e) => setNewNextStep(e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            placeholder="Add new next step..."
                                            style={{
                                              flex: 1,
                                              padding: '0.5rem 0.75rem',
                                              backgroundColor: 'rgba(30, 30, 40, 0.7)',
                                              border: '1px solid rgba(255, 255, 255, 0.2)',
                                              borderRadius: '0.25rem',
                                              color: 'white',
                                            }}
                                            onKeyDown={(e) => {
                                              if (e.key === 'Enter' && newNextStep.trim()) {
                                                addNextStep(project.id);
                                              }
                                            }}
                                          />
                                          <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              addNextStep(project.id);
                                            }}
                                            style={{
                                              padding: '0.5rem 0.75rem',
                                              backgroundColor: 'rgba(255, 215, 0, 0.2)',
                                              border: '1px solid rgba(255, 215, 0, 0.5)',
                                              borderRadius: '0.25rem',
                                              color: 'white',
                                              cursor: 'pointer'
                                            }}
                                          >
                                            Add
                                          </motion.button>
                                        </div>
                                      </div>

                                      {/* Shared Document Link */}
                                      <div style={{ marginBottom: '1.5rem' }}>
                                        <div style={{ 
                                          display: 'flex', 
                                          justifyContent: 'space-between', 
                                          alignItems: 'center',
                                          marginBottom: '0.5rem'
                                        }}>
                                          <h3 style={{ 
                                            fontSize: '1rem',
                                            color: 'rgba(255, 215, 0, 0.9)',
                                          }}>
                                            Shared Document Link
                                          </h3>
                                          <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              if (editableSharedLinkId === project.id) {
                                                updateSharedLink(project.id);
                                              } else {
                                                setEditableSharedLinkId(project.id);
                                                setEditableSharedLink(project.sharedLink || '');
                                              }
                                            }}
                                            style={{
                                              padding: '0.25rem 0.5rem',
                                              backgroundColor: 'transparent',
                                              border: '1px solid rgba(255, 215, 0, 0.5)',
                                              borderRadius: '0.25rem',
                                              color: 'rgba(255, 215, 0, 0.8)',
                                              cursor: 'pointer',
                                              fontSize: '0.75rem'
                                            }}
                                          >
                                            {editableSharedLinkId === project.id ? 'Save' : 'Edit'}
                                          </motion.button>
                                        </div>

                                        {editableSharedLinkId === project.id ? (
                                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <input
                                              type="text"
                                              value={editableSharedLink}
                                              onChange={(e) => setEditableSharedLink(e.target.value)}
                                              onClick={(e) => e.stopPropagation()}
                                              placeholder="Enter document URL..."
                                              style={{
                                                flex: 1,
                                                padding: '0.5rem 0.75rem',
                                                backgroundColor: 'rgba(20, 20, 30, 0.7)',
                                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                                borderRadius: '0.25rem',
                                                color: 'white',
                                              }}
                                              onKeyDown={(e) => {
                                                if (e.key === 'Enter' && editableSharedLink.trim()) {
                                                  updateSharedLink(project.id);
                                                }
                                              }}
                                            />
                                          </div>
                                        ) : (
                                          <div style={{ 
                                            padding: '0.75rem',
                                            backgroundColor: 'rgba(20, 20, 30, 0.7)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '0.5rem',
                                            color: 'rgba(255, 255, 255, 0.8)',
                                            fontSize: '0.9rem',
                                            lineHeight: '1.5'
                                          }}>
                                            {project.sharedLink ? (
                                              <a 
                                                href={project.sharedLink} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                style={{ 
                                                  color: 'rgba(255, 215, 0, 0.9)', 
                                                  textDecoration: 'none',
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  gap: '0.5rem'
                                                }}
                                              >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                                {project.sharedLink.length > 40 ? 
                                                  project.sharedLink.substring(0, 40) + '...' : 
                                                  project.sharedLink
                                                }
                                              </a>
                                            ) : (
                                              <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontStyle: 'italic' }}>
                                                No shared document link added.
                                              </span>
                                            )}
                                          </div>
                                        )}
                                      </div>

                                      {/* Attachments */}
                                      <div style={{ marginBottom: '1.5rem' }}>
                                        <div style={{ 
                                          display: 'flex', 
                                          justifyContent: 'space-between', 
                                          alignItems: 'center',
                                          marginBottom: '0.5rem'
                                        }}>
                                          <h3 style={{ 
                                            fontSize: '1rem',
                                            color: 'rgba(255, 215, 0, 0.9)',
                                          }}>
                                            Attachments
                                          </h3>
                                          <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setUploadingAttachment(!uploadingAttachment);
                                            }}
                                            style={{
                                              padding: '0.25rem 0.5rem',
                                              backgroundColor: 'transparent',
                                              border: '1px solid rgba(255, 215, 0, 0.5)',
                                              borderRadius: '0.25rem',
                                              color: 'rgba(255, 215, 0, 0.8)',
                                              cursor: 'pointer',
                                              fontSize: '0.75rem',
                                              display: 'flex',
                                              alignItems: 'center',
                                              gap: '0.25rem'
                                            }}
                                          >
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                              <path d="M7 8L12 3L17 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                              <path d="M20 15V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            Upload
                                          </motion.button>
                                        </div>

                                        {uploadingAttachment && (
                                          <div style={{ 
                                            marginBottom: '0.75rem',
                                            display: 'flex',
                                            gap: '0.5rem'
                                          }}>
                                            <input
                                              type="text"
                                              value={fileUploadName}
                                              onChange={(e) => setFileUploadName(e.target.value)}
                                              onClick={(e) => e.stopPropagation()}
                                              placeholder="Enter file name with extension..."
                                              style={{
                                                flex: 1,
                                                padding: '0.5rem 0.75rem',
                                                backgroundColor: 'rgba(20, 20, 30, 0.7)',
                                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                                borderRadius: '0.25rem',
                                                color: 'white',
                                              }}
                                              onKeyDown={(e) => {
                                                if (e.key === 'Enter' && fileUploadName.trim()) {
                                                  handleFileUpload(project.id);
                                                }
                                              }}
                                            />
                                            <motion.button
                                              whileHover={{ scale: 1.05 }}
                                              whileTap={{ scale: 0.95 }}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleFileUpload(project.id);
                                              }}
                                              style={{
                                                padding: '0.5rem 0.75rem',
                                                backgroundColor: 'rgba(255, 215, 0, 0.2)',
                                                border: '1px solid rgba(255, 215, 0, 0.5)',
                                                borderRadius: '0.25rem',
                                                color: 'white',
                                                cursor: 'pointer'
                                              }}
                                            >
                                              Add
                                            </motion.button>
                                          </div>
                                        )}

                                        <div style={{ 
                                          backgroundColor: 'rgba(20, 20, 30, 0.7)',
                                          border: '1px solid rgba(255, 255, 255, 0.1)',
                                          borderRadius: '0.5rem',
                                          overflow: 'hidden'
                                        }}>
                                          {project.attachments && project.attachments.length > 0 ? (
                                            project.attachments.map((attachment, idx) => (
                                              <div 
                                                key={attachment.id} 
                                                style={{ 
                                                  padding: '0.75rem',
                                                  borderBottom: idx < (project.attachments?.length || 0) - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                                                  display: 'flex',
                                                  justifyContent: 'space-between',
                                                  alignItems: 'center',
                                                  gap: '0.5rem'
                                                }}
                                              >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                  {/* File icon based on type */}
                                                  <div style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '0.25rem',
                                                    backgroundColor: 'rgba(255, 215, 0, 0.15)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'rgba(255, 215, 0, 0.9)',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 'bold',
                                                    textTransform: 'uppercase'
                                                  }}>
                                                    {attachment.type || '?'}
                                                  </div>
                                                  
                                                  <div>
                                                    <div style={{ fontWeight: 'bold' }}>{attachment.name}</div>
                                                    <div style={{ 
                                                      fontSize: '0.8rem', 
                                                      color: 'rgba(255, 255, 255, 0.6)' 
                                                    }}>
                                                      {attachment.size}
                                                    </div>
                                                  </div>
                                                </div>
                                                
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                  <motion.button
                                                    whileHover={{ scale: 1.1, color: 'rgba(255, 215, 0, 0.9)' }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={(e) => e.stopPropagation()}
                                                    style={{
                                                      backgroundColor: 'transparent',
                                                      border: 'none',
                                                      color: 'rgba(255, 255, 255, 0.6)',
                                                      cursor: 'pointer',
                                                      fontSize: '0.875rem',
                                                      padding: '0.25rem'
                                                    }}
                                                  >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                      <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                      <path d="M7 8L12 3L17 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                      <path d="M20 15V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                  </motion.button>
                                                  <motion.button
                                                    whileHover={{ scale: 1.1, color: 'rgba(255, 80, 80, 0.9)' }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      removeAttachment(project.id, attachment.id);
                                                    }}
                                                    style={{
                                                      backgroundColor: 'transparent',
                                                      border: 'none',
                                                      color: 'rgba(255, 255, 255, 0.6)',
                                                      cursor: 'pointer',
                                                      fontSize: '0.875rem',
                                                      padding: '0.25rem'
                                                    }}
                                                  >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                      <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                  </motion.button>
                                                </div>
                                              </div>
                                            ))
                                          ) : (
                                            <div style={{ 
                                              padding: '0.75rem',
                                              color: 'rgba(255, 255, 255, 0.5)',
                                              textAlign: 'center',
                                              fontStyle: 'italic',
                                              fontSize: '0.9rem'
                                            }}>
                                              No attachments added.
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </motion.tr>
                            )}
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
                      border: dragOverStatus === status 
                        ? '2px solid rgba(255, 215, 0, 0.7)' 
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      minHeight: '400px',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.2s ease',
                      boxShadow: dragOverStatus === status 
                        ? '0 0 15px rgba(255, 215, 0, 0.3)' 
                        : 'none',
                    }}
                    onDragOver={(e) => handleDragOver(e, status)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, status)}
                  >
                    <h3 style={{ 
                      fontSize: '1rem', 
                      marginBottom: '1rem', 
                      color: getStatusColor(status),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <span 
                        style={{ cursor: 'help' }}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setStatusTooltip({
                            visible: true,
                            status: status,
                            x: rect.left + rect.width/2,
                            y: rect.bottom + window.scrollY + 5
                          });
                        }}
                        onMouseLeave={() => {
                          setStatusTooltip({...statusTooltip, visible: false});
                        }}
                      >
                        {status}
                      </span>
                      <span style={{ 
                        fontSize: '0.8rem', 
                        padding: '0.2rem 0.5rem', 
                        background: getStatusBgColor(status),
                        borderRadius: '1rem',
                      }}>
                        {projects.filter(p => p.status === status).length}
                      </span>
                    </h3>

                    {/* Project Cards - with drag and drop */}
                    <div style={{ flex: 1 }}>
                      {filteredProjects.filter(p => p.status === status).length === 0 || dragOverStatus === status ? (
                        <div style={{ 
                          textAlign: 'center', 
                          padding: '2rem 0',
                          height: dragOverStatus === status && filteredProjects.filter(p => p.status === status).length > 0 ? '100px' : '100%',
                          marginTop: dragOverStatus === status && filteredProjects.filter(p => p.status === status).length > 0 ? '1rem' : '0',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          color: 'rgba(255, 255, 255, 0.4)',
                          border: dragOverStatus === status 
                            ? '2px dashed rgba(255, 215, 0, 0.5)'
                            : '2px dashed rgba(255, 255, 255, 0.1)',
                          borderRadius: '0.5rem',
                          backgroundColor: dragOverStatus === status 
                            ? 'rgba(255, 215, 0, 0.05)'
                            : 'transparent',
                          transition: 'all 0.2s ease',
                          opacity: dragOverStatus === status || filteredProjects.filter(p => p.status === status).length === 0 ? 1 : 0,
                          pointerEvents: draggedProject && !dragOverStatus ? 'none' : 'auto',
                          visibility: (dragOverStatus === status || filteredProjects.filter(p => p.status === status).length === 0) ? 'visible' : 'hidden',
                          position: dragOverStatus === status && filteredProjects.filter(p => p.status === status).length > 0 ? 'relative' : 'static',
                        }}>
                          <div style={{ marginBottom: '0.5rem' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <p style={{ fontSize: '0.8rem' }}>
                            {dragOverStatus === status ? 'Drop here' : 'Drag items here'}
                          </p>
                        </div>
                      ) : null}
                      
                      {filteredProjects.filter(p => p.status === status).length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {filteredProjects
                            .filter(p => p.status === status)
                            .map((project) => (
                              <motion.div
                                key={project.id}
                                layoutId={project.id}
                                whileHover={{ y: -5, boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)' }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ 
                                  type: "spring", 
                                  stiffness: 300, 
                                  damping: 25,
                                  duration: 0.3
                                }}
                                style={{
                                  background: 'rgba(30, 30, 40, 0.6)',
                                  backdropFilter: 'blur(10px)',
                                  borderRadius: '0.75rem',
                                  padding: '1rem',
                                  border: draggedProject === project.id
                                    ? '2px solid rgba(255, 215, 0, 0.7)'
                                    : `1px solid ${getStatusBgColor(project.status)}`,
                                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                  cursor: 'grab',
                                  position: 'relative',
                                  opacity: draggedProject === project.id ? 0.6 : 1,
                                }}
                                draggable={true}
                                onDragStart={() => handleDragStart(project.id)}
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
                                  justifyContent: 'space-between',
                                  marginTop: '0.75rem',
                                  gap: '0.5rem',
                                  alignItems: 'center'
                                }}>
                                  {/* Drag handle indicator */}
                                  <div style={{
                                    color: 'rgba(255, 255, 255, 0.4)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    fontSize: '0.7rem'
                                  }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M19 12L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span>Drag to move</span>
                                  </div>
                                  
                                  <div style={{ display: 'flex', gap: '0.5rem' }}>
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

      {/* Status Tooltip */}
      <AnimatePresence>
        {statusTooltip.visible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              left: `${statusTooltip.x}px`,
              top: `${statusTooltip.y}px`,
              transform: 'translateX(-50%)',
              zIndex: 1000,
              backgroundColor: 'rgba(30, 30, 40, 0.95)',
              color: getStatusColor(statusTooltip.status),
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
              border: `1px solid ${getStatusColor(statusTooltip.status)}`,
              backdropFilter: 'blur(10px)',
              maxWidth: '300px',
              fontSize: '0.85rem',
              pointerEvents: 'none',
            }}
          >
            <div style={{ marginBottom: '0.25rem', fontWeight: 'bold' }}>
              {statusTooltip.status}
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.8rem', lineHeight: 1.4 }}>
              {getStatusDescription(statusTooltip.status)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Completion Modal */}
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
            onClick={() => setCompletionModal({visible: false, projectId: '', projectName: ''})}
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
                    Complete Project
                  </h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>
                    Are you sure you want to mark <strong>{completionModal.projectName}</strong> as completed?
                  </p>
                  <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    This will set the status to "Completed" and progress to 100%.
                  </p>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                  <motion.button
                    whileHover={{ backgroundColor: 'rgba(0, 200, 83, 0.8)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => completeProject(completionModal.projectId)}
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
                    Complete Project
                  </motion.button>
                  <motion.button
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCompletionModal({visible: false, projectId: '', projectName: ''})}
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

export default Projects; 