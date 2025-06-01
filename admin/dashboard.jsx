import React, { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  FileText,
  AlertTriangle,
  GraduationCap,
  Building2,
  Calendar,
  TrendingUp,
  Bell,
  Search,
  Settings,
  ChevronDown,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  Upload,
} from "lucide-react";

const NITJAdminDashboard = (props) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [notifications, setNotifications] = useState(5);
  const [stats, setStats] = useState({
    departments: 0,
    subjects: 0,
    documents: 0,
    reports: 0,
  });

  // Fetch real data from AdminJS API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch department count
        const deptResponse = await fetch("/admin/api/resources/departments");
        const deptData = await deptResponse.json();

        // Fetch subject count
        const subjectResponse = await fetch("/admin/api/resources/subjects");
        const subjectData = await subjectResponse.json();

        // Fetch document count
        const docResponse = await fetch("/admin/api/resources/documents");
        const docData = await docResponse.json();

        // Fetch report count
        const reportResponse = await fetch("/admin/api/resources/reports");
        const reportData = await reportResponse.json();

        setStats({
          departments: deptData.meta?.total || 0,
          subjects: subjectData.meta?.total || 0,
          documents: docData.meta?.total || 0,
          reports: reportData.meta?.total || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        // Fallback to mock data
        setStats({
          departments: 12,
          subjects: 847,
          documents: 2843,
          reports: 23,
        });
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Departments",
      value: stats.departments.toLocaleString(),
      change: "+2 new",
      changeType: "positive",
      icon: Building2,
      color: "from-blue-500 to-cyan-500",
      description: "Active academic departments",
    },
    {
      title: "Total Subjects",
      value: stats.subjects.toLocaleString(),
      change: "+24 this sem",
      changeType: "positive",
      icon: BookOpen,
      color: "from-emerald-500 to-green-500",
      description: "Across all years & branches",
    },
    {
      title: "Documents",
      value: stats.documents.toLocaleString(),
      change: "+156 this week",
      changeType: "positive",
      icon: FileText,
      color: "from-purple-500 to-pink-500",
      description: "Notes, assignments & resources",
    },
    {
      title: "Reports",
      value: stats.reports.toLocaleString(),
      change: "+5 pending",
      changeType: "attention",
      icon: AlertTriangle,
      color: "from-orange-500 to-red-500",
      description: "Content reports to review",
    },
  ];

  // Rest of your dashboard component code...
  // [Include the full dashboard JSX here]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Your existing dashboard JSX */}
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          NITJ Admin Dashboard
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-md border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${card.color} flex items-center justify-center`}
                >
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-600">
                  {card.title}
                </h3>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-gray-800">
                    {card.value}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      card.changeType === "positive"
                        ? "text-green-600"
                        : "text-orange-600"
                    }`}
                  >
                    {card.change}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{card.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/admin/resources/departments"
            className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <Building2 className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-800">
                  Manage Departments
                </h3>
                <p className="text-sm text-gray-600">
                  Add, edit, or remove departments
                </p>
              </div>
            </div>
          </a>

          <a
            href="/admin/resources/subjects"
            className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-gray-800">Manage Subjects</h3>
                <p className="text-sm text-gray-600">
                  Organize subjects by department
                </p>
              </div>
            </div>
          </a>

          <a
            href="/admin/resources/documents"
            className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-purple-600" />
              <div>
                <h3 className="font-semibold text-gray-800">View Documents</h3>
                <p className="text-sm text-gray-600">
                  Browse uploaded resources
                </p>
              </div>
            </div>
          </a>

          <a
            href="/admin/resources/reports"
            className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div>
                <h3 className="font-semibold text-gray-800">Review Reports</h3>
                <p className="text-sm text-gray-600">Handle content reports</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default NITJAdminDashboard;
