import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

// Add Client Modal
interface AddClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const AddClientModal = ({ isOpen, onClose, onSuccess }: AddClientModalProps) => {
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data: authData, error: authError } = await supabase.auth.admin.createUser({
                email,
                password: Math.random().toString(36).slice(-8),
                email_confirm: true,
            });

            if (authError) throw authError;

            if (authData.user) {
                await supabase
                    .from("profiles")
                    .update({
                        full_name: fullName,
                        role: "client",
                    })
                    .eq("id", authData.user.id);
            }

            onSuccess();
            onClose();
            setEmail("");
            setFullName("");
        } catch (err: any) {
            setError(err.message || "Failed to create client");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Client">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <div>
                    <label htmlFor="fullName" className="block text-slate-400 text-sm mb-2">Full Name</label>
                    <input
                        id="fullName"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-cyan-500"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-slate-400 text-sm mb-2">Email</label>
                    <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-cyan-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-semibold hover:opacity-90 disabled:opacity-50"
                >
                    {loading ? "Creating..." : "Create Client"}
                </button>
            </form>
        </Modal>
    );
};

// Upload Invoice Modal
interface UploadInvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    clients: any[];
}

export const UploadInvoiceModal = ({ isOpen, onClose, onSuccess, clients }: UploadInvoiceModalProps) => {
    const [clientId, setClientId] = useState("");
    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [tax, setTax] = useState("0");
    const [discount, setDiscount] = useState("0");
    const [dueDate, setDueDate] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            let uploadedFileUrl: string | null = null;

            if (file) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage
                    .from('documents')
                    .upload(`invoices/${fileName}`, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('documents')
                    .getPublicUrl(`invoices/${fileName}`);

                uploadedFileUrl = publicUrl;
            }

            const total = parseFloat(amount) + parseFloat(tax) - parseFloat(discount);

            const { error: insertError } = await supabase
                .from("invoices")
                .insert({
                    client_id: clientId,
                    invoice_number: invoiceNumber,
                    amount: parseFloat(amount),
                    tax: parseFloat(tax),
                    discount: parseFloat(discount),
                    total,
                    due_date: dueDate,
                    file_url: uploadedFileUrl,
                    status: "pending",
                });

            if (insertError) throw insertError;

            onSuccess();
            onClose();
            setClientId("");
            setInvoiceNumber("");
            setAmount("");
            setTax("0");
            setDiscount("0");
            setDueDate("");
            setFile(null);
        } catch (err: any) {
            setError(err.message || "Failed to upload invoice");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Upload Invoice">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <div>
                    <label htmlFor="invoiceClient" className="block text-slate-400 text-sm mb-2">Client</label>
                    <select
                        id="invoiceClient"
                        required
                        value={clientId}
                        onChange={(e) => setClientId(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-cyan-500"
                    >
                        <option value="">Select client</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>
                                {client.full_name || client.email}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="invoiceNumber" className="block text-slate-400 text-sm mb-2">Invoice Number</label>
                    <input
                        id="invoiceNumber"
                        type="text"
                        required
                        value={invoiceNumber}
                        onChange={(e) => setInvoiceNumber(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-cyan-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="amount" className="block text-slate-400 text-sm mb-2">Amount ($)</label>
                        <input
                            id="amount"
                            type="number"
                            required
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-cyan-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="tax" className="block text-slate-400 text-sm mb-2">Tax ($)</label>
                        <input
                            id="tax"
                            type="number"
                            step="0.01"
                            value={tax}
                            onChange={(e) => setTax(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-cyan-500"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="discount" className="block text-slate-400 text-sm mb-2">Discount ($)</label>
                    <input
                        id="discount"
                        type="number"
                        step="0.01"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-cyan-500"
                    />
                </div>

                <div>
                    <label htmlFor="dueDate" className="block text-slate-400 text-sm mb-2">Due Date</label>
                    <input
                        id="dueDate"
                        type="date"
                        required
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-cyan-500"
                    />
                </div>

                <div>
                    <label htmlFor="invoicePdf" className="block text-slate-400 text-sm mb-2">Invoice PDF (Optional)</label>
                    <input
                        id="invoicePdf"
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-cyan-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-semibold hover:opacity-90 disabled:opacity-50"
                >
                    {loading ? "Uploading..." : "Upload Invoice"}
                </button>
            </form>
        </Modal>
    );
};

// Upload Contract Modal
interface UploadContractModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    clients: any[];
}

export const UploadContractModal = ({ isOpen, onClose, onSuccess, clients }: UploadContractModalProps) => {
    const [clientId, setClientId] = useState("");
    const [contractNumber, setContractNumber] = useState("");
    const [value, setValue] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            let uploadedFileUrl: string | null = null;

            if (file) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage
                    .from('documents')
                    .upload(`contracts/${fileName}`, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('documents')
                    .getPublicUrl(`contracts/${fileName}`);

                uploadedFileUrl = publicUrl;
            }

            const { error: insertError } = await supabase
                .from("contracts")
                .insert({
                    client_id: clientId,
                    contract_number: contractNumber,
                    value: parseFloat(value),
                    start_date: startDate,
                    end_date: endDate,
                    file_url: uploadedFileUrl,
                    status: "sent",
                });

            if (insertError) throw insertError;

            onSuccess();
            onClose();
            setClientId("");
            setContractNumber("");
            setValue("");
            setStartDate("");
            setEndDate("");
            setFile(null);
        } catch (err: any) {
            setError(err.message || "Failed to upload contract");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Upload Contract">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <div>
                    <label htmlFor="contractClient" className="block text-slate-400 text-sm mb-2">Client</label>
                    <select
                        id="contractClient"
                        required
                        value={clientId}
                        onChange={(e) => setClientId(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-cyan-500"
                    >
                        <option value="">Select client</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>
                                {client.full_name || client.email}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="contractNumber" className="block text-slate-400 text-sm mb-2">Contract Number</label>
                    <input
                        id="contractNumber"
                        type="text"
                        required
                        value={contractNumber}
                        onChange={(e) => setContractNumber(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-cyan-500"
                    />
                </div>

                <div>
                    <label htmlFor="contractValue" className="block text-slate-400 text-sm mb-2">Value ($)</label>
                    <input
                        id="contractValue"
                        type="number"
                        required
                        step="0.01"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-cyan-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="startDate" className="block text-slate-400 text-sm mb-2">Start Date</label>
                        <input
                            id="startDate"
                            type="date"
                            required
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-cyan-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-slate-400 text-sm mb-2">End Date</label>
                        <input
                            id="endDate"
                            type="date"
                            required
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-cyan-500"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="contractPdf" className="block text-slate-400 text-sm mb-2">Contract PDF</label>
                    <input
                        id="contractPdf"
                        type="file"
                        accept=".pdf"
                        required
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-cyan-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-semibold hover:opacity-90 disabled:opacity-50"
                >
                    {loading ? "Uploading..." : "Upload Contract"}
                </button>
            </form>
        </Modal>
    );
};

// Add Lead Modal
interface AddLeadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const AddLeadModal = ({ isOpen, onClose, onSuccess }: AddLeadModalProps) => {
    const [businessName, setBusinessName] = useState("");
    const [contactPerson, setContactPerson] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [potentialValue, setPotentialValue] = useState("");
    const [source, setSource] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { error: insertError } = await supabase
                .from("leads")
                .insert({
                    business_name: businessName,
                    contact_person: contactPerson,
                    email,
                    phone,
                    potential_value: parseFloat(potentialValue) || 0,
                    source: source || "website",
                    status: "new_lead",
                });

            if (insertError) throw insertError;

            onSuccess();
            onClose();
            setBusinessName("");
            setContactPerson("");
            setEmail("");
            setPhone("");
            setPotentialValue("");
            setSource("");
        } catch (err: any) {
            setError(err.message || "Failed to add lead");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Lead">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <div>
                    <label htmlFor="businessName" className="block text-slate-400 text-sm mb-2">Business Name *</label>
                    <input
                        id="businessName"
                        type="text"
                        required
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-cyan-500"
                    />
                </div>

                <div>
                    <label htmlFor="contactPerson" className="block text-slate-400 text-sm mb-2">Contact Person</label>
                    <input
                        id="contactPerson"
                        type="text"
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-cyan-500"
                    />
                </div>

                <div>
                    <label htmlFor="leadEmail" className="block text-slate-400 text-sm mb-2">Email</label>
                    <input
                        id="leadEmail"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-cyan-500"
                    />
                </div>

                <div>
                    <label htmlFor="phone" className="block text-slate-400 text-sm mb-2">Phone</label>
                    <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-cyan-500"
                    />
                </div>

                <div>
                    <label htmlFor="potentialValue" className="block text-slate-400 text-sm mb-2">Potential Value ($)</label>
                    <input
                        id="potentialValue"
                        type="number"
                        step="0.01"
                        value={potentialValue}
                        onChange={(e) => setPotentialValue(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-cyan-500"
                    />
                </div>

                <div>
                    <label htmlFor="source" className="block text-slate-400 text-sm mb-2">Source</label>
                    <select
                        id="source"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-cyan-500"
                    >
                        <option value="website">Website</option>
                        <option value="referral">Referral</option>
                        <option value="social_media">Social Media</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-semibold hover:opacity-90 disabled:opacity-50"
                >
                    {loading ? "Adding..." : "Add Lead"}
                </button>
            </form>
        </Modal>
    );
};

// Add Expense Modal
interface AddExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const AddExpenseModal = ({ isOpen, onClose, onSuccess }: AddExpenseModalProps) => {
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { error: insertError } = await supabase
                .from("expenses")
                .insert({
                    category,
                    description,
                    amount: parseFloat(amount),
                    date,
                });

            if (insertError) throw insertError;

            onSuccess();
            onClose();
            setCategory("");
            setDescription("");
            setAmount("");
            setDate(new Date().toISOString().split('T')[0]);
        } catch (err: any) {
            setError(err.message || "Failed to add expense");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Expense">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <div>
                    <label htmlFor="category" className="block text-slate-400 text-sm mb-2">Category *</label>
                    <select
                        id="category"
                        required
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-cyan-500"
                    >
                        <option value="">Select category</option>
                        <option value="tools">Tools</option>
                        <option value="marketing">Marketing</option>
                        <option value="staff">Staff</option>
                        <option value="operations">Operations</option>
                        <option value="misc">Miscellaneous</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="description" className="block text-slate-400 text-sm mb-2">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-cyan-500"
                    />
                </div>

                <div>
                    <label htmlFor="expenseAmount" className="block text-slate-400 text-sm mb-2">Amount ($) *</label>
                    <input
                        id="expenseAmount"
                        type="number"
                        required
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-cyan-500"
                    />
                </div>

                <div>
                    <label htmlFor="expenseDate" className="block text-slate-400 text-sm mb-2">Date *</label>
                    <input
                        id="expenseDate"
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-cyan-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-semibold hover:opacity-90 disabled:opacity-50"
                >
                    {loading ? "Adding..." : "Add Expense"}
                </button>
            </form>
        </Modal>
    );
};