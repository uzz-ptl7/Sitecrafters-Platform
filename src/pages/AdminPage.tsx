import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import {
    LogOut, Users, FolderOpen, FileText, DollarSign,
    TrendingUp, Bell, Plus, Search, Eye, Edit2, Trash2, Upload,
    CheckCircle, Clock, AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { AddClientModal, UploadInvoiceModal, UploadContractModal, AddLeadModal, AddExpenseModal } from "@/components/Modals";

interface Client {
    id: string;
    email: string;
    full_name: string | null;
    created_at: string;
}

interface Project {
    id: string;
    user_id: string;
    title: string;
    description: string;
    status: string;
    progress: number;
    created_at: string;
}

interface Invoice {
    id: string;
    invoice_number: string;
    client_id: string;
    amount: number;
    total: number;
    status: string;
    due_date: string;
    paid_date: string | null;
    created_at: string;
    profiles?: { email: string; full_name: string | null };
}

interface Contract {
    id: string;
    contract_number: string;
    client_id: string;
    status: string;
    start_date: string;
    end_date: string;
    value: number;
    created_at: string;
    profiles?: { email: string; full_name: string | null };
}

interface Lead {
    id: string;
    business_name: string;
    contact_person: string;
    email: string;
    status: string;
    potential_value: number;
    created_at: string;
}

interface Expense {
    id: string;
    category: string;
    description: string;
    amount: number;
    date: string;
}

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    created_at: string;
}

type Tab = 'overview' | 'clients' | 'projects' | 'invoices' | 'contracts' | 'files' | 'leads' | 'expenses' | 'notifications';

const AdminPage = () => {
    const { user, signOut } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [loading, setLoading] = useState(true);

    const [clients, setClients] = useState<Client[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Modal states
    const [showAddClientModal, setShowAddClientModal] = useState(false);
    const [showUploadInvoiceModal, setShowUploadInvoiceModal] = useState(false);
    const [showUploadContractModal, setShowUploadContractModal] = useState(false);
    const [showAddLeadModal, setShowAddLeadModal] = useState(false);
    const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);

    const [stats, setStats] = useState({
        totalClients: 0,
        activeClients: 0,
        totalLeads: 0,
        totalProjects: 0,
        projectsInProgress: 0,
        completedProjects: 0,
        monthlyRevenue: 0,
        monthlyExpenses: 0,
        netProfit: 0,
        outstandingInvoices: 0,
    });

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchClients(),
                fetchProjects(),
                fetchInvoices(),
                fetchContracts(),
                fetchLeads(),
                fetchExpenses(),
                fetchNotifications(),
            ]);
            calculateStats();
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchClients = async () => {
        const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("role", "client")
            .order("created_at", { ascending: false });
        if (data) setClients(data);
    };

    const fetchProjects = async () => {
        const { data } = await supabase
            .from("projects")
            .select("*")
            .order("created_at", { ascending: false });
        if (data) setProjects(data);
    };

    const fetchInvoices = async () => {
        const { data } = await supabase
            .from("invoices")
            .select("*, profiles(email, full_name)")
            .order("created_at", { ascending: false });
        if (data) setInvoices(data);
    };

    const fetchContracts = async () => {
        const { data } = await supabase
            .from("contracts")
            .select("*, profiles(email, full_name)")
            .order("created_at", { ascending: false });
        if (data) setContracts(data);
    };

    const fetchLeads = async () => {
        const { data } = await supabase
            .from("leads")
            .select("*")
            .order("created_at", { ascending: false });
        if (data) setLeads(data);
    };

    const fetchExpenses = async () => {
        const { data } = await supabase
            .from("expenses")
            .select("*")
            .order("date", { ascending: false });
        if (data) setExpenses(data);
    };

    const fetchNotifications = async () => {
        const { data } = await supabase
            .from("notifications")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(10);
        if (data) setNotifications(data);
    };

    const calculateStats = () => {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const monthlyRevenue = invoices
            .filter(inv => inv.status === 'paid' && new Date(inv.paid_date || inv.created_at) >= firstDayOfMonth)
            .reduce((sum, inv) => sum + Number(inv.total), 0);

        const monthlyExpenses = expenses
            .filter(exp => new Date(exp.date) >= firstDayOfMonth)
            .reduce((sum, exp) => sum + Number(exp.amount), 0);

        const outstandingInvoices = invoices
            .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
            .reduce((sum, inv) => sum + Number(inv.total), 0);

        setStats({
            totalClients: clients.length,
            activeClients: clients.filter(c => projects.some(p => p.user_id === c.id && p.status === 'in_progress')).length,
            totalLeads: leads.length,
            totalProjects: projects.length,
            projectsInProgress: projects.filter(p => p.status === 'in_progress').length,
            completedProjects: projects.filter(p => p.status === 'completed').length,
            monthlyRevenue,
            monthlyExpenses,
            netProfit: monthlyRevenue - monthlyExpenses,
            outstandingInvoices,
        });
    };

    const handleSignOut = async () => {
        await signOut();
    };

    const handleDataUpdate = () => {
        fetchAllData();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
            case 'paid':
            case 'signed':
            case 'converted':
                return 'text-green-400 bg-green-500/10 border-green-500/50';
            case 'in_progress':
            case 'pending':
            case 'sent':
            case 'interested':
                return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/50';
            case 'overdue':
            case 'new_lead':
                return 'text-red-400 bg-red-500/10 border-red-500/50';
            default:
                return 'text-slate-400 bg-slate-500/10 border-slate-500/50';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
            case 'paid':
            case 'signed':
            case 'converted':
                return <CheckCircle size={14} />;
            case 'in_progress':
            case 'pending':
            case 'sent':
                return <Clock size={14} />;
            case 'overdue':
            case 'new_lead':
                return <AlertCircle size={14} />;
            default:
                return <Clock size={14} />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                Loading dashboard...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-950/30 via-black to-cyan-950/20" />

            <div className="relative z-10">
                {/* Header */}
                <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            SiteCrafters Admin
                        </h1>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30">
                                <span className="text-sm text-purple-300">Admin</span>
                            </div>

                            <div className="text-sm text-slate-300">
                                {user?.email}
                            </div>

                            <button
                                onClick={handleSignOut}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition text-sm"
                            >
                                <LogOut size={18} />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-6 py-8">
                    {/* Navigation Tabs */}
                    <div className="mb-8 flex flex-wrap gap-2">
                        {[
                            { id: 'overview', label: 'Overview', icon: TrendingUp },
                            { id: 'clients', label: 'Clients', icon: Users },
                            { id: 'projects', label: 'Projects', icon: FolderOpen },
                            { id: 'invoices', label: 'Invoices', icon: FileText },
                            { id: 'contracts', label: 'Contracts', icon: FileText },
                            { id: 'leads', label: 'Leads', icon: Users },
                            { id: 'expenses', label: 'Expenses', icon: DollarSign },
                            { id: 'notifications', label: 'Notifications', icon: Bell },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as Tab)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white'
                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                    }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Overview Dashboard */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                                            <Users className="w-6 h-6 text-cyan-400" />
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-1">{stats.totalClients}</h3>
                                    <p className="text-slate-400 text-sm">Total Clients</p>
                                    <p className="text-cyan-400 text-xs mt-2">{stats.activeClients} active</p>
                                </div>

                                <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                            <FolderOpen className="w-6 h-6 text-purple-400" />
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-1">{stats.totalProjects}</h3>
                                    <p className="text-slate-400 text-sm">Total Projects</p>
                                    <p className="text-purple-400 text-xs mt-2">{stats.projectsInProgress} in progress</p>
                                </div>

                                <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                                            <DollarSign className="w-6 h-6 text-green-400" />
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-1">${stats.monthlyRevenue.toFixed(2)}</h3>
                                    <p className="text-slate-400 text-sm">Monthly Revenue</p>
                                    <p className="text-green-400 text-xs mt-2">Net: ${stats.netProfit.toFixed(2)}</p>
                                </div>

                                <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                                            <FileText className="w-6 h-6 text-yellow-400" />
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-1">{stats.outstandingInvoices}</h3>
                                    <p className="text-slate-400 text-sm">Outstanding Invoices</p>
                                    <p className="text-yellow-400 text-xs mt-2">${stats.outstandingInvoices.toFixed(2)} due</p>
                                </div>
                            </div>

                            {/* Additional Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50">
                                    <h3 className="text-lg font-semibold text-white mb-4">Leads</h3>
                                    <p className="text-4xl font-bold text-cyan-400 mb-2">{stats.totalLeads}</p>
                                    <p className="text-slate-400 text-sm">Potential clients in pipeline</p>
                                </div>

                                <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50">
                                    <h3 className="text-lg font-semibold text-white mb-4">Projects Status</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">In Progress</span>
                                            <span className="text-yellow-400">{stats.projectsInProgress}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">Completed</span>
                                            <span className="text-green-400">{stats.completedProjects}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50">
                                    <h3 className="text-lg font-semibold text-white mb-4">Monthly Expenses</h3>
                                    <p className="text-4xl font-bold text-red-400 mb-2">${stats.monthlyExpenses.toFixed(2)}</p>
                                    <p className="text-slate-400 text-sm">Total spent this month</p>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50">
                                <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                                <div className="space-y-3">
                                    {notifications.length === 0 ? (
                                        <p className="text-slate-400 text-sm">No recent activity</p>
                                    ) : (
                                        notifications.slice(0, 5).map(notif => (
                                            <div key={notif.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30">
                                                <Bell size={16} className="text-cyan-400 mt-1" />
                                                <div className="flex-1">
                                                    <p className="text-white text-sm">{notif.title}</p>
                                                    <p className="text-slate-400 text-xs mt-1">{notif.message}</p>
                                                    <p className="text-slate-500 text-xs mt-1">
                                                        {new Date(notif.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Clients Tab */}
                    {activeTab === 'clients' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-white">Clients</h2>
                                <button
                                    onClick={() => setShowAddClientModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 text-white hover:opacity-90"
                                >
                                    <Plus size={18} />
                                    Add Client
                                </button>
                            </div>

                            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex-1 relative">
                                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Search clients..."
                                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-cyan-500"
                                        />
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-700">
                                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Client</th>
                                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Email</th>
                                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Projects</th>
                                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Joined</th>
                                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {clients.map(client => {
                                                const clientProjects = projects.filter(p => p.user_id === client.id);
                                                const activeProjects = clientProjects.filter(p => p.status === 'in_progress').length;

                                                return (
                                                    <tr key={client.id} className="border-b border-slate-800 hover:bg-slate-800/30">
                                                        <td className="py-3 px-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                                                                    {(client.full_name || client.email)[0].toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <p className="text-white font-medium">{client.full_name || 'No name'}</p>
                                                                    <p className="text-slate-400 text-xs">ID: {client.id.slice(0, 8)}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4 text-slate-300">{client.email}</td>
                                                        <td className="py-3 px-4">
                                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(activeProjects > 0 ? 'in_progress' : 'completed')}`}>
                                                                {getStatusIcon(activeProjects > 0 ? 'in_progress' : 'completed')}
                                                                {activeProjects > 0 ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-4 text-slate-300">{clientProjects.length} ({activeProjects} active)</td>
                                                        <td className="py-3 px-4 text-slate-400 text-sm">
                                                            {new Date(client.created_at).toLocaleDateString()}
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <div className="flex items-center gap-2">
                                                                <button title="View client" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400">
                                                                    <Eye size={16} />
                                                                </button>
                                                                <button title="Edit client" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-400">
                                                                    <Edit2 size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Projects Tab */}
                    {activeTab === 'projects' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-white">Projects</h2>
                                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 text-white hover:opacity-90">
                                    <Plus size={18} />
                                    New Project
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {projects.map(project => {
                                    const client = clients.find(c => c.id === project.user_id);
                                    return (
                                        <div key={project.id} className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-cyan-500/50 transition">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white mb-1">{project.title}</h3>
                                                    <p className="text-slate-400 text-sm">{client?.email || 'Unknown client'}</p>
                                                </div>
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(project.status)}`}>
                                                    {getStatusIcon(project.status)}
                                                    {project.status.replace('_', ' ')}
                                                </span>
                                            </div>

                                            <div className="mb-4">
                                                <div className="flex items-center justify-between text-sm mb-2">
                                                    <span className="text-slate-400">Progress</span>
                                                    <span className="text-cyan-400">{project.progress}%</span>
                                                </div>
                                                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all"
                                                        style={{ width: `${project.progress}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-400">
                                                    Created: {new Date(project.created_at).toLocaleDateString()}
                                                </span>
                                                <div className="flex gap-2">
                                                    <button title="View project" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400">
                                                        <Eye size={16} />
                                                    </button>
                                                    <button title="Edit project" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-400">
                                                        <Edit2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Invoices Tab */}
                    {activeTab === 'invoices' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-white">Invoices</h2>
                                <button
                                    onClick={() => setShowUploadInvoiceModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 text-white hover:opacity-90"
                                >
                                    <Upload size={18} />
                                    Upload Invoice
                                </button>
                            </div>

                            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-700">
                                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Invoice #</th>
                                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Client</th>
                                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Amount</th>
                                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Due Date</th>
                                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {invoices.map(invoice => (
                                                <tr key={invoice.id} className="border-b border-slate-800 hover:bg-slate-800/30">
                                                    <td className="py-3 px-4 text-white font-mono text-sm">{invoice.invoice_number}</td>
                                                    <td className="py-3 px-4 text-slate-300">
                                                        {invoice.profiles?.full_name || invoice.profiles?.email || 'Unknown'}
                                                    </td>
                                                    <td className="py-3 px-4 text-white font-semibold">${invoice.total.toFixed(2)}</td>
                                                    <td className="py-3 px-4 text-slate-400 text-sm">
                                                        {new Date(invoice.due_date).toLocaleDateString()}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(invoice.status)}`}>
                                                            {getStatusIcon(invoice.status)}
                                                            {invoice.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <button title="View invoice" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400">
                                                                <Eye size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Contracts Tab */}
                    {activeTab === 'contracts' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-white">Contracts</h2>
                                <button
                                    onClick={() => setShowUploadContractModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 text-white hover:opacity-90"
                                >
                                    <Upload size={18} />
                                    Upload Contract
                                </button>
                            </div>

                            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-700">
                                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Contract #</th>
                                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Client</th>
                                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Value</th>
                                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Dates</th>
                                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {contracts.map(contract => (
                                                <tr key={contract.id} className="border-b border-slate-800 hover:bg-slate-800/30">
                                                    <td className="py-3 px-4 text-white font-mono text-sm">{contract.contract_number}</td>
                                                    <td className="py-3 px-4 text-slate-300">
                                                        {contract.profiles?.full_name || contract.profiles?.email || 'Unknown'}
                                                    </td>
                                                    <td className="py-3 px-4 text-white font-semibold">${contract.value?.toFixed(2) || '0.00'}</td>
                                                    <td className="py-3 px-4">
                                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(contract.status)}`}>
                                                            {getStatusIcon(contract.status)}
                                                            {contract.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-slate-400 text-sm">
                                                        {contract.start_date && new Date(contract.start_date).toLocaleDateString()}
                                                        {contract.start_date && contract.end_date && ' - '}
                                                        {contract.end_date && new Date(contract.end_date).toLocaleDateString()}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <button title="View contract" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400">
                                                                <Eye size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Leads Tab */}
                    {activeTab === 'leads' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-white">Leads</h2>
                                <button
                                    onClick={() => setShowAddLeadModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 text-white hover:opacity-90"
                                >
                                    <Plus size={18} />
                                    Add Lead
                                </button>
                            </div>

                            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-700">
                                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Business</th>
                                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Contact</th>
                                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Email</th>
                                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Value</th>
                                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {leads.map(lead => (
                                                <tr key={lead.id} className="border-b border-slate-800 hover:bg-slate-800/30">
                                                    <td className="py-3 px-4 text-white font-medium">{lead.business_name}</td>
                                                    <td className="py-3 px-4 text-slate-300">{lead.contact_person || '-'}</td>
                                                    <td className="py-3 px-4 text-slate-300">{lead.email}</td>
                                                    <td className="py-3 px-4 text-white font-semibold">
                                                        ${lead.potential_value?.toFixed(2) || '0.00'}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(lead.status)}`}>
                                                            {getStatusIcon(lead.status)}
                                                            {lead.status.replace('_', ' ')}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <button title="View lead" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400">
                                                                <Eye size={16} />
                                                            </button>
                                                            <button title="Edit lead" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-400">
                                                                <Edit2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Expenses Tab */}
                    {activeTab === 'expenses' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-white">Expenses</h2>
                                <button
                                    onClick={() => setShowAddExpenseModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 text-white hover:opacity-90"
                                >
                                    <Plus size={18} />
                                    Add Expense
                                </button>
                            </div>

                            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-700">
                                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Category</th>
                                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Description</th>
                                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Amount</th>
                                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Date</th>
                                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {expenses.map(expense => (
                                                <tr key={expense.id} className="border-b border-slate-800 hover:bg-slate-800/30">
                                                    <td className="py-3 px-4">
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-slate-800 text-slate-300 border border-slate-700">
                                                            {expense.category}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-slate-300">{expense.description}</td>
                                                    <td className="py-3 px-4 text-red-400 font-semibold">-${expense.amount.toFixed(2)}</td>
                                                    <td className="py-3 px-4 text-slate-400 text-sm">
                                                        {new Date(expense.date).toLocaleDateString()}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <button title="Delete expense" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-red-400">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">Notifications</h2>

                            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50">
                                <div className="space-y-3">
                                    {notifications.length === 0 ? (
                                        <p className="text-slate-400 text-center py-8">No notifications</p>
                                    ) : (
                                        notifications.map(notif => (
                                            <div
                                                key={notif.id}
                                                className={`p-4 rounded-lg border ${notif.read ? 'bg-slate-800/30 border-slate-700' : 'bg-cyan-500/10 border-cyan-500/50'
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start gap-3">
                                                        <Bell size={18} className={`mt-1 ${notif.read ? 'text-slate-500' : 'text-cyan-400'}`} />
                                                        <div>
                                                            <h4 className="text-white font-medium">{notif.title}</h4>
                                                            <p className="text-slate-400 text-sm mt-1">{notif.message}</p>
                                                            <p className="text-slate-500 text-xs mt-2">
                                                                {new Date(notif.created_at).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {!notif.read && (
                                                        <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2" />
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    // Modals
    return (
        <>
            <AddClientModal
                isOpen={showAddClientModal}
                onClose={() => setShowAddClientModal(false)}
                onSuccess={handleDataUpdate}
            />

            <UploadInvoiceModal
                isOpen={showUploadInvoiceModal}
                onClose={() => setShowUploadInvoiceModal(false)}
                onSuccess={handleDataUpdate}
                clients={clients}
            />

            <UploadContractModal
                isOpen={showUploadContractModal}
                onClose={() => setShowUploadContractModal(false)}
                onSuccess={handleDataUpdate}
                clients={clients}
            />

            <AddLeadModal
                isOpen={showAddLeadModal}
                onClose={() => setShowAddLeadModal(false)}
                onSuccess={handleDataUpdate}
            />

            <AddExpenseModal
                isOpen={showAddExpenseModal}
                onClose={() => setShowAddExpenseModal(false)}
                onSuccess={handleDataUpdate}
            />
        </>
    );
};

export default AdminPage;
