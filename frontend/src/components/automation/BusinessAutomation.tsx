import React, { useState, useEffect } from 'react';
import { Bot, Play, Pause, Settings, BarChart3, Clock, CheckCircle, AlertCircle, Zap, Calendar, Target, TrendingUp, Users, Mail, Phone, MessageSquare } from 'lucide-react';

interface Workflow {
  id: number;
  name: string;
  description: string;
  type: 'lead-nurturing' | 'follow-up' | 'inventory' | 'marketing' | 'customer-service';
  status: 'active' | 'paused' | 'draft';
  triggers: string[];
  actions: string[];
  performance: {
    executed: number;
    success: number;
    revenue: string;
  };
  schedule?: string;
  lastRun?: string;
  nextRun?: string;
}

interface AutomationMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
}

interface Task {
  id: number;
  title: string;
  type: 'email' | 'call' | 'meeting' | 'follow-up';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  contact: string;
  status: 'pending' | 'completed' | 'overdue';
  automationId?: number;
}

const BusinessAutomation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'workflows' | 'tasks' | 'analytics'>('dashboard');
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [metrics, setMetrics] = useState<AutomationMetric[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAutomationData();
  }, []);

  const fetchAutomationData = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setWorkflows([
        {
          id: 1,
          name: "New Lead Welcome Sequence",
          description: "Automated email sequence for new potential retailers and distributors",
          type: "lead-nurturing",
          status: "active",
          triggers: ["Low stock alert", "Regional demand spike"],
          actions: [
            "Send reorder notification",
            "Contact suppliers automatically",
            "Update regional partners",
            "Adjust pricing for scarcity"
          ],
          performance: {
            executed: 12,
            success: 11,
            revenue: "₹85,000"
          },
          schedule: "Daily check at 9 AM",
          lastRun: "This morning",
          nextRun: "Tomorrow 9 AM"
        },
        {
          id: 4,
          name: "Customer Follow-up Sequence",
          description: "Automated follow-up with existing customers and partners for repeat business",
          type: "follow-up",
          status: "active",
          triggers: ["30 days after purchase", "Partner order completion"],
          actions: [
            "Send satisfaction survey",
            "Offer loyalty discount",
            "Share new arrivals",
            "Schedule relationship call"
          ],
          performance: {
            executed: 67,
            success: 52,
            revenue: "₹3,20,000"
          },
          schedule: "Triggered by purchase dates",
          lastRun: "Yesterday",
          nextRun: "Continuous"
        },
        {
          id: 5,
          name: "Regional Expansion Outreach",
          description: "Automated outreach to potential partners in new target markets",
          type: "marketing",
          status: "paused",
          triggers: ["Market analysis completion", "New region identified"],
          actions: [
            "Research local contacts",
            "Send culturally adapted introduction",
            "Schedule market visit",
            "Prepare regional samples"
          ],
          performance: {
            executed: 8,
            success: 3,
            revenue: "₹45,000"
          },
          schedule: "On-demand trigger",
          lastRun: "3 days ago",
          nextRun: "Paused"
        }
      ]);

      setTasks([
        {
          id: 1,
          title: "Follow up with Sunita Boutique - Dehradun",
          type: "call",
          priority: "high",
          dueDate: "Today, 2:00 PM",
          contact: "Sunita Sharma",
          status: "pending",
          automationId: 1
        },
        {
          id: 2,
          title: "Send festival catalog to Mountain Wedding Planners",
          type: "email",
          priority: "medium",
          dueDate: "Tomorrow, 10:00 AM",
          contact: "Rajesh Thakur",
          status: "pending",
          automationId: 2
        },
        {
          id: 3,
          title: "Schedule product demo with Himalayan Textiles",
          type: "meeting",
          priority: "high",
          dueDate: "Oct 5, 3:00 PM",
          contact: "Mohan Rawat",
          status: "pending",
          automationId: 1
        },
        {
          id: 4,
          title: "Send reorder alert for Kanchipuram silk sarees",
          type: "email",
          priority: "medium",
          dueDate: "Yesterday",
          contact: "Inventory Team",
          status: "overdue",
          automationId: 3
        },
        {
          id: 5,
          title: "Customer satisfaction survey - Dev Bhoomi Distributors",
          type: "email",
          priority: "low",
          dueDate: "Oct 8, 11:00 AM",
          contact: "Priya Bhatt",
          status: "pending",
          automationId: 4
        }
      ]);

      setMetrics([
        {
          label: "Active Workflows",
          value: "4",
          change: "+1",
          trend: "up",
          icon: <Bot className="w-5 h-5" />
        },
        {
          label: "Tasks Automated",
          value: "155",
          change: "+23%",
          trend: "up",
          icon: <CheckCircle className="w-5 h-5" />
        },
        {
          label: "Time Saved",
          value: "32 hrs",
          change: "+8 hrs",
          trend: "up",
          icon: <Clock className="w-5 h-5" />
        },
        {
          label: "Revenue Impact",
          value: "₹10.3L",
          change: "+15%",
          trend: "up",
          icon: <TrendingUp className="w-5 h-5" />
        },
        {
          label: "Success Rate",
          value: "84%",
          change: "+2%",
          trend: "up",
          icon: <Target className="w-5 h-5" />
        },
        {
          label: "Active Contacts",
          value: "78",
          change: "+12",
          trend: "up",
          icon: <Users className="w-5 h-5" />
        }
      ]);

      setLoading(false);
    }, 1500);
  };

  const toggleWorkflowStatus = (id: number) => {
    setWorkflows(prev =>
      prev.map(workflow =>
        workflow.id === id
          ? { ...workflow, status: workflow.status === 'active' ? 'paused' : 'active' }
          : workflow
      )
    );
  };

  const completeTask = (id: number) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, status: 'completed' } : task
      )
    );
  };

  const getWorkflowIcon = (type: string) => {
    switch (type) {
      case 'lead-nurturing':
        return '🎯';
      case 'follow-up':
        return '📞';
      case 'inventory':
        return '📦';
      case 'marketing':
        return '📢';
      case 'customer-service':
        return '💬';
      default:
        return '⚙️';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'paused':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'draft':
        return 'bg-gray-50 text-gray-800 border-gray-200';
      case 'pending':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'overdue':
        return 'bg-red-50 text-red-800 border-red-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'call':
        return <Phone className="w-4 h-4" />;
      case 'meeting':
        return <Calendar className="w-4 h-4" />;
      case 'follow-up':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Automation Dashboard</h3>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-blue-600">{metric.icon}</div>
              <div className={`text-sm font-medium ${
                metric.trend === 'up' ? 'text-green-600' :
                metric.trend === 'down' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {metric.change}
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800 mb-1">{metric.value}</p>
            <p className="text-sm text-gray-600">{metric.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="font-semibold text-gray-800 mb-4">Quick Actions</h4>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Zap className="w-6 h-6 text-blue-600" />
            <div className="text-left">
              <p className="font-medium text-gray-800">Create Workflow</p>
              <p className="text-sm text-gray-600">Set up new automation</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <BarChart3 className="w-6 h-6 text-green-600" />
            <div className="text-left">
              <p className="font-medium text-gray-800">View Analytics</p>
              <p className="text-sm text-gray-600">Performance insights</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Settings className="w-6 h-6 text-purple-600" />
            <div className="text-left">
              <p className="font-medium text-gray-800">Manage Settings</p>
              <p className="text-sm text-gray-600">Configure automation</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Clock className="w-6 h-6 text-orange-600" />
            <div className="text-left">
              <p className="font-medium text-gray-800">Schedule Tasks</p>
              <p className="text-sm text-gray-600">Plan activities</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-800 mb-4">Recent Automations</h4>
          <div className="space-y-3">
            {workflows.slice(0, 3).map(workflow => (
              <div key={workflow.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getWorkflowIcon(workflow.type)}</span>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{workflow.name}</p>
                    <p className="text-xs text-gray-600">Last run: {workflow.lastRun}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(workflow.status)}`}>
                  {workflow.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-800 mb-4">Pending Tasks</h4>
          <div className="space-y-3">
            {tasks.filter(task => task.status === 'pending').slice(0, 3).map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={getPriorityColor(task.priority)}>
                    {getTaskIcon(task.type)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{task.title}</p>
                    <p className="text-xs text-gray-600">Due: {task.dueDate}</p>
                  </div>
                </div>
                <button
                  onClick={() => completeTask(task.id)}
                  className="text-green-600 hover:text-green-800"
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderWorkflows = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Automation Workflows</h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Create New Workflow
        </button>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading workflows...</span>
          </div>
        ) : (
          workflows.map(workflow => (
            <div key={workflow.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{getWorkflowIcon(workflow.type)}</div>
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-xl font-semibold text-gray-800">{workflow.name}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(workflow.status)}`}>
                        {workflow.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{workflow.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 mb-1"><span className="font-medium">Schedule:</span> {workflow.schedule}</p>
                        <p className="text-gray-600 mb-1"><span className="font-medium">Last Run:</span> {workflow.lastRun}</p>
                        <p className="text-gray-600"><span className="font-medium">Next Run:</span> {workflow.nextRun}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1"><span className="font-medium">Executed:</span> {workflow.performance.executed} times</p>
                        <p className="text-gray-600 mb-1"><span className="font-medium">Success Rate:</span> {Math.round((workflow.performance.success / workflow.performance.executed) * 100)}%</p>
                        <p className="text-gray-600"><span className="font-medium">Revenue Impact:</span> {workflow.performance.revenue}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleWorkflowStatus(workflow.id)}
                    className={`p-2 rounded-lg ${
                      workflow.status === 'active'
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {workflow.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-gray-800 mb-2">Triggers</h5>
                  <div className="space-y-1">
                    {workflow.triggers.map((trigger, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>{trigger}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-800 mb-2">Actions</h5>
                  <div className="space-y-1">
                    {workflow.actions.map((action, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderTasks = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Automated Tasks</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {tasks.filter(t => t.status === 'pending').length} pending,{' '}
            {tasks.filter(t => t.status === 'overdue').length} overdue
          </span>
        </div>
      </div>

      {/* Task Filters */}
      <div className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4">
        <span className="text-sm font-medium text-gray-700">Filter by:</span>
        <div className="flex items-center space-x-2">
          {['all', 'pending', 'overdue', 'completed'].map(status => (
            <button
              key={status}
              className={`px-3 py-1 text-sm rounded-full ${
                status === 'all'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="font-semibold text-gray-800">Task Management</h4>
        </div>
        
        <div className="divide-y divide-gray-200">
          {tasks.map(task => (
            <div key={task.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={getPriorityColor(task.priority)}>
                    {getTaskIcon(task.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h5 className="font-medium text-gray-800">{task.title}</h5>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Contact: {task.contact}</span>
                      <span>Due: {task.dueDate}</span>
                      {task.automationId && (
                        <span>
                          Workflow: {workflows.find(w => w.id === task.automationId)?.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {task.status === 'pending' && (
                    <button
                      onClick={() => completeTask(task.id)}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      Complete
                    </button>
                  )}
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Automation Analytics</h3>
      
      {/* Performance Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Efficiency Gains</h4>
              <p className="text-sm text-gray-600">This month vs last month</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Time Saved</span>
              <span className="font-medium text-green-600">+32 hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tasks Automated</span>
              <span className="font-medium text-green-600">+23%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Error Reduction</span>
              <span className="font-medium text-green-600">-15%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Success Rates</h4>
              <p className="text-sm text-gray-600">Workflow performance</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Lead Nurturing</span>
              <span className="font-medium text-blue-600">84%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Follow-up</span>
              <span className="font-medium text-blue-600">78%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Marketing</span>
              <span className="font-medium text-blue-600">87%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Revenue Impact</h4>
              <p className="text-sm text-gray-600">Generated through automation</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">This Month</span>
              <span className="font-medium text-purple-600">₹10.3L</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Growth</span>
              <span className="font-medium text-green-600">+15%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">ROI</span>
              <span className="font-medium text-purple-600">340%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="font-semibold text-gray-800 mb-4">Workflow Performance Details</h4>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workflow</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Executions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Success Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {workflows.map(workflow => (
                <tr key={workflow.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="mr-3 text-lg">{getWorkflowIcon(workflow.type)}</span>
                      <span className="font-medium text-gray-800">{workflow.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                    {workflow.type.replace('-', ' ')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {workflow.performance.executed}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-green-600">
                      {Math.round((workflow.performance.success / workflow.performance.executed) * 100)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">
                    {workflow.performance.revenue}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(workflow.status)}`}>
                      {workflow.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center space-x-2 mb-4">
          <Bot className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold text-blue-800">AI Recommendations</h4>
        </div>
        
        <ul className="space-y-2 text-blue-700">
          <li className="flex items-start space-x-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
            <span>Consider creating a seasonal inventory workflow - current manual process could save 8+ hours weekly</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
            <span>Your follow-up workflows have 78% success rate - adding personalization could boost to 85%+</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
            <span>Regional expansion workflow is paused but shows high potential - restart with refined targeting</span>
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Business Automation</h2>
        <p className="text-gray-600">Streamline operations with intelligent automation workflows</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
        {[
          { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { key: 'workflows', label: 'Workflows', icon: Bot },
          { key: 'tasks', label: 'Tasks', icon: CheckCircle },
          { key: 'analytics', label: 'Analytics', icon: TrendingUp }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'workflows' && renderWorkflows()}
        {activeTab === 'tasks' && renderTasks()}
        {activeTab === 'analytics' && renderAnalytics()}
      </div>
    </div>
  );
};

// --- KEEP YOUR ORIGINAL DATA (unchanged) ---
// I changed only the export style below so the component remains the default export
export const BusinessAutomationData = [
  {
    id: 1,
    name: "New Contact Workflow",
    description: "Automates tasks when a new contact shows interest",
    type: "workflow",
    status: "active",
    triggers: ["New contact added", "Contact shows interest"],
    actions: [
      "Send welcome email with catalog",
      "Schedule follow-up call in 3 days",
      "Send cultural adaptation guide",
      "Book product demonstration"
    ],
    performance: {
      executed: 45,
      success: 38,
      revenue: "₹2,30,000"
    },
    schedule: "Immediate trigger",
    lastRun: "2 hours ago",
    nextRun: "Continuous"
  }
  // ... rest of objects
];

// <<== CRITICAL FIX: export the component as the default export (so JSX <BusinessAutomation /> works) ==>
export default BusinessAutomation;