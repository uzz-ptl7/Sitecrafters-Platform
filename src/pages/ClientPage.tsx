import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import {
    LogOut, FolderOpen, FileText, Download, Bell,
    User, Calendar, TrendingUp, Eye, Clock, AlertCircle
} from "lucide-react";

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
    amount: number;
    total: number;
    status: string;
    due_date: string;
    paid_date: string | null;
    file_url: string | null;
    created_at: string;
}

interface Contract {
    id: string;
    contract_number: string;
    status: string;
    start_date: string;
    end_date: string;
    value: number;
    file_url: string | null;
    signed_file_url: string | null;
    created_at: string;
}

interface File {
    id: string;
    name: string;
    file_url: string;
    file_type: string;
    category: string;
    description: string;
    created_at: string;
}

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    link: string | null;
    created_at: string;
}

type Tab = 'overview' | 'projects' | 'invoices' | 'contracts' | 'files' | 'notifications' | 'profile';

const ClientPage = () => {
    const { user, signOut, profile } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [loading, setLoading] = useState(true);

    const [projects, setProjects] = useState<Project[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const [stats, setStats] = useState({
        activeProjects: 0,
        pendingInvoices: 0,
        paidInvoices: 0,
        totalPaid: 0,
        pendingAmount: 0,
    });

    useEffect(() => {
        if (user) {
            fetchAllData();
        }
    }, [user]);

    const fetchAllData = async () => {
        if (!user) return;

        setLoading(true);
        try {
            await Promise.all([
                fetchProjects(),
                fetchInvoices(),
                fetchContracts(),
                fetchFiles(),
                fetchNotifications(),
            ]);
            calculateStats();
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProjects = async () => {
        if (!user) return;
        const { data } = await supabase
            .from("projects")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });
        if (data) setProjects(data);
    };

    const fetchInvoices = async () => {
        if (!user) return;
        const { data } = await supabase
            .from("invoices")
            .select("*")
            .eq("client_id", user.id)
            .order("created_at", { ascending: false });
        if (data) setInvoices(data);
    };

    const fetchContracts = async () => {
        if (!user) return;
        const { data } = await supabase
            .from("contracts")
            .select("*")
            .eq("client_id", user.id)
            .order("created_at", { ascending: false });
        if (data) setContracts(data);
    };

    const fetchFiles = async () => {
        if (!user) return;
        const { data } = await supabase
            .from("files")
            .select("*")
            .eq("client_id", user.id)
            .order("created_at", { ascending: false });
        if (data) setFiles(data);
    };

    const fetchNotifications = async () => {
        if (!user) return;
        const { data } = await supabase
            .from("notifications")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(10);
        if (data) setNotifications(data);
    };

    const calculateStats = () => {
        const pending = invoices.filter(inv => inv.status === 'pending' || inv.status === 'overdue');
        const paid = invoices.filter(inv => inv.status === 'paid');

        const pendingAmount = pending.reduce((sum, inv) => sum + Number(inv.total), 0);
        const totalPaid = paid.reduce((sum, inv) => sum + Number(inv.total), 0);

        setStats({
            activeProjects: projects.filter(p => p.status === 'in_progress').length,
            pendingInvoices: pending.length,
            paidInvoices: paid.length,
            totalPaid,
            pendingAmount,
        });
    };

    const handleSignOut = async () => {
        await signOut();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
            case 'paid':
            case 'signed':
                return 'text-green-400 bg-green-500/10 border-green-500/50';
            case 'in_progress':
            case 'pending':
            case 'sent':
                return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/50';
            case 'overdue':
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
                return <TrendingUp size={14} />;
            case 'in_progress':
            case 'pending':
                return <Clock size={14} />;
            case 'overdue':
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
                            My Dashboard
                        </h1>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30">
                                <User size={16} className="text-cyan-400" />
                                <span className="text-sm text-cyan-300">Client</span>
                            </div>

                            <div className="text-sm text-slate-300">
                                {profile?.full_name || user?.email}
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
                            { id: 'projects', label: 'My Projects', icon: FolderOpen },
                            { id: 'invoices', label: 'Invoices', icon: FileText },
                            { id: 'contracts', label: 'Contracts', icon: FileText },
                            { id: 'files', label: 'Files', icon: Download },
                            { id: 'notifications', label: 'Notifications', icon: Bell },
                            { id: 'profile', label: 'Profile', icon: User },
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
                            {/* Welcome Message */}
                            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50">
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    Welcome back, {profile?.full_name || 'Client'}!
                                </h2>
                                <p className="text-slate-400">
                                    Here's an overview of your projects and account activity.
                                </p>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                                            <FolderOpen className="w-6 h-6 text-cyan-400" />
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-1">{stats.activeProjects}</h3>
                                    <p className="text-slate-400 text-sm">Active Projects</p>
                                </div>

                                <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                                            <FileText className="w-6 h-6 text-yellow-400" />
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-1">{stats.pendingInvoices}</h3>
                                    <p className="text-slate-400 text-sm">Pending Invoices</p>
                                    <p className="text-yellow-400 text-xs mt-2">${stats.pendingAmount.toFixed(2)} due</p>
                                </div>

                                <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                                            <TrendingUp className="w-6 h-6 text-green-400" />
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-1">{stats.paidInvoices}</h3>
                                    <p className="text-slate-400 text-sm">Paid Invoices</p>
                                    <p className="text-green-400 text-xs mt-2">${stats.totalPaid.toFixed(2)} total</p>
                                </div>

                                <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                            <FileText className="w-6 h-6 text-purple-400" />
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-1">{contracts.length}</h3>
                                    <p className="text-slate-400 text-sm">Contracts</p>
                                </div>
                            </div>

                            {/* Recent Projects */}
                            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50">
                                <h3 className="text-lg font-semibold text-white mb-4">Recent Projects</h3>
                                <div className="space-y-3">
                                    {projects.length === 0 ? (
                                        <p className="text-slate-400 text-sm">No projects yet</p>
                                    ) : (
                                        projects.slice(0, 5).map(project => (
                                            <div key={project.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
                                                <div className="flex items-center gap-3">
                                                    <FolderOpen size={18} className="text-cyan-400" />
                                                    <div>
                                                        <p className="text-white text-sm font-medium">{project.title}</p>
                                                        <p className="text-slate-400 text-xs">
                                                            {project.progress}% complete
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(project.status)}`}>
                                                    {getStatusIcon(project.status)}
                                                    {project.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Recent Notifications */}
                            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50">
                                <h3 className="text-lg font-semibold text-white mb-4">Recent Updates</h3>
                                <div className="space-y-3">
                                    {notifications.length === 0 ? (
                                        <p className="text-slate-400 text-sm">No recent updates</p>
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

                    {/* Projects Tab */}
                    {activeTab === 'projects' && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">My Projects</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {projects.map(project => (
                                    <div key={project.id} className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-cyan-500/50 transition">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-white mb-1">{project.title}</h3>
                                                <p className="text-slate-400 text-sm line-clamp-2">
                                                    {project.description || 'No description'}
                                                </p>
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
                                                Started: {new Date(project.created_at).toLocaleDateString()}
                                            </span>
                                            <button title="View project" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400">
                                                <Eye size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {projects.length === 0 && (
                                <div className="p-8 rounded-xl border border-slate-800 bg-slate-900/50 text-center">
                                    <FolderOpen size={48} className="mx-auto text-slate-600 mb-4" />
                                    <p className="text-slate-400">No projects assigned to you yet</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Invoices Tab */}
                    {activeTab === 'invoices' && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">My Invoices</h2>

                            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-700">
                                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Invoice #</th>
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
                                                            {invoice.file_url && (
                                                                <a
                                                                    href={invoice.file_url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400"
                                                                    title="Download invoice"
                                                                >
                                                                    <Download size={16} />
                                                                </a>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {invoices.length === 0 && (
                                <div className="p-8 rounded-xl border border-slate-800 bg-slate-900/50 text-center">
                                    <FileText size={48} className="mx-auto text-slate-600 mb-4" />
                                    <p className="text-slate-400">No invoices yet</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Contracts Tab */}
                    {activeTab === 'contracts' && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">My Contracts</h2>

                            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-700">
                                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Contract #</th>
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
                                                            {contract.file_url && (
                                                                <a
                                                                    href={contract.file_url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400"
                                                                    title="View contract"
                                                                >
                                                                    <Eye size={16} />
                                                                </a>
                                                            )}
                                                            {contract.signed_file_url && (
                                                                <a
                                                                    href={contract.signed_file_url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-green-400"
                                                                    title="Download signed contract"
                                                                >
                                                                    <Download size={16} />
                                                                </a>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {contracts.length === 0 && (
                                <div className="p-8 rounded-xl border border-slate-800 bg-slate-900/50 text-center">
                                    <FileText size={48} className="mx-auto text-slate-600 mb-4" />
                                    <p className="text-slate-400">No contracts yet</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Files Tab */}
                    {activeTab === 'files' && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">My Files</h2>

                            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {files.map(file => (
                                        <div key={file.id} className="p-4 rounded-lg border border-slate-700 bg-slate-800/30 hover:border-cyan-500/50 transition">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                                                    <FileText size={20} className="text-cyan-400" />
                                                </div>
                                                <span className="text-xs text-slate-400 uppercase">
                                                    {file.file_type}
                                                </span>
                                            </div>

                                            <h4 className="text-white font-medium mb-1 line-clamp-1">{file.name}</h4>
                                            <p className="text-slate-400 text-xs mb-3 line-clamp-2">
                                                {file.description || 'No description'}
                                            </p>

                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-slate-500 uppercase">
                                                    {file.category}
                                                </span>
                                                <a
                                                    href={file.file_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-cyan-400"
                                                    title="Download file"
                                                >
                                                    <Download size={16} />
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {files.length === 0 && (
                                <div className="p-8 rounded-xl border border-slate-800 bg-slate-900/50 text-center">
                                    <Download size={48} className="mx-auto text-slate-600 mb-4" />
                                    <p className="text-slate-400">No files shared with you yet</p>
                                </div>
                            )}
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

                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">My Profile</h2>

                            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-slate-400 text-sm mb-2">Full Name</label>
                                        <p className="text-white text-lg">{profile?.full_name || 'Not set'}</p>
                                    </div>

                                    <div>
                                        <label className="block text-slate-400 text-sm mb-2">Email</label>
                                        <p className="text-white text-lg">{user?.email}</p>
                                    </div>

                                    <div>
                                        <label className="block text-slate-400 text-sm mb-2">Account Type</label>
                                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300">
                                            <User size={16} />
                                            Client
                                        </span>
                                    </div>

                                    <div>
                                        <label className="block text-slate-400 text-sm mb-2">Member Since</label>
                                        <p className="text-white text-lg">
                                            {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientPage;