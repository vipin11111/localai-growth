import React, { useState, useEffect } from "react";
import { Lead } from "../types";
import { db } from "../lib/firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Phone,
  Mail,
  UserPlus,
  CheckCircle,
  XCircle,
  TrendingUp,
  AlertCircle,
  FileSpreadsheet
} from "lucide-react";

interface LeadCRMProps {
  userId: string;
}

export default function LeadCRM({ userId }: LeadCRMProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  // Form State
  const [showModal, setShowModal] = useState(false);
  const [currentLeadId, setCurrentLeadId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<Lead["status"]>("new");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchLeads();
  }, [userId]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "leads"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const fetchedLeads: Lead[] = [];
      querySnapshot.forEach((doc) => {
        fetchedLeads.push({ id: doc.id, ...doc.data() } as Lead);
      });
      // Sort client side
      fetchedLeads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setLeads(fetchedLeads);
    } catch (err) {
      console.error("Error fetching CRM leads:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setCurrentLeadId(null);
    setName("");
    setEmail("");
    setPhone("");
    setStatus("new");
    setNotes("");
    setShowModal(true);
  };

  const handleOpenEdit = (lead: Lead) => {
    setCurrentLeadId(lead.id || null);
    setName(lead.name);
    setEmail(lead.email);
    setPhone(lead.phone);
    setStatus(lead.status);
    setNotes(lead.notes);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Name is required!");
      return;
    }

    setLoading(true);

    try {
      if (currentLeadId) {
        // Update
        const leadRef = doc(db, "leads", currentLeadId);
        await updateDoc(leadRef, {
          name,
          email,
          phone,
          status,
          notes
        });
      } else {
        // Create
        await addDoc(collection(db, "leads"), {
          name,
          email,
          phone,
          status,
          notes,
          userId,
          createdAt: new Date().toISOString()
        });
      }
      setShowModal(false);
      await fetchLeads();
    } catch (err) {
      console.error("Error submitting lead:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (leadId: string) => {
    if (!confirm("Are you sure you want to delete this customer lead?")) return;
    try {
      await deleteDoc(doc(db, "leads", leadId));
      await fetchLeads();
    } catch (err) {
      console.error("Error deleting lead:", err);
    }
  };

  const handleLoadSampleLeads = async () => {
    setLoading(true);
    const samples = [
      { name: "John Miller", email: "john@millerconsulting.com", phone: "+1 (555) 304-9021", status: "qualified" as const, notes: "Inquired about elite crossfit training and private booking schedules." },
      { name: "Sara Jenkins", email: "sara.j@gmail.com", phone: "+1 (555) 492-0193", status: "new" as const, notes: "Signed up via website lead-capture form. Needs quick outreach regarding opening hours." },
      { name: "Marcus Brody", email: "marcus@brodymedia.io", phone: "+1 (555) 283-9182", status: "contacted" as const, notes: "Sent discount proposal. Follow-up email scheduled for Friday." },
      { name: "Eleanor Vance", email: "eleanor@vancecorp.co", phone: "+1 (555) 193-4820", status: "closed_won" as const, notes: "Purchased the Standard Corporate Suite. Contract active!" }
    ];

    try {
      for (const sample of samples) {
        await addDoc(collection(db, "leads"), {
          ...sample,
          userId,
          createdAt: new Date().toISOString()
        });
      }
      await fetchLeads();
    } catch (err) {
      console.error("Failed to add sample leads:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Lead["status"]) => {
    switch (status) {
      case "new":
        return <span className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">New</span>;
      case "contacted":
        return <span className="text-xs bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">Contacted</span>;
      case "qualified":
        return <span className="text-xs bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">Qualified</span>;
      case "closed_won":
        return <span className="text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">Closed Won</span>;
      default:
        return <span className="text-xs bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-300 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">Closed Lost</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold">
            <Users className="w-3.5 h-3.5" /> Customer Relations
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-50 tracking-tight">Leads & CRM Contacts</h2>
          <p className="text-xs text-slate-400">
            Track, prioritize, and manage client interaction pipelines directly synced with your database.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {leads.length === 0 && (
            <button
              onClick={handleLoadSampleLeads}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-full text-xs font-bold tracking-wide shadow-sm transition-all"
            >
              Load Sample Leads
            </button>
          )}
          <button
            onClick={handleOpenAdd}
            id="crm-add-lead-btn"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-bold tracking-wide shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Lead</span>
          </button>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads by name or email..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pr-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">Filter Status:</span>
          {["all", "new", "contacted", "qualified", "closed_won", "closed_lost"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex-shrink-0 ${
                statusFilter === status
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              {status.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Cards Grid / Table */}
      {loading ? (
        <div className="text-center py-12 text-xs text-slate-400">Loading leads pipeline database...</div>
      ) : filteredLeads.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLeads.map((lead) => (
            <div key={lead.id} className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold text-xs uppercase tracking-wider w-8 h-8 flex items-center justify-center">
                      {lead.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{lead.name}</h4>
                      <p className="text-[10px] text-slate-400">Registered {new Date(lead.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {getStatusBadge(lead.status)}
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {lead.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{lead.email}</span>
                    </div>
                  )}
                  {lead.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{lead.phone}</span>
                    </div>
                  )}
                  {lead.notes && (
                    <div className="mt-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/20 text-[11px] leading-relaxed text-slate-500 italic">
                      "{lead.notes}"
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                <button
                  onClick={() => handleOpenEdit(lead)}
                  className="p-2 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
                  title="Edit Lead"
                  id={`crm-edit-${lead.id}`}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(lead.id!)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all"
                  title="Delete Lead"
                  id={`crm-delete-${lead.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-12 text-center shadow-sm flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-3xl w-fit">
            <UserPlus className="w-10 h-10 text-indigo-500" />
          </div>
          <div className="space-y-1 max-w-md">
            <h4 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">Empty Leads pipeline</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              You don't have any customer leads on file yet. Tap "Add New Lead" or click "Load Sample Leads" to seed your CRM database.
            </p>
          </div>
        </div>
      )}

      {/* Overlay modal to Add/Edit Leads */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-slate-850 dark:text-slate-50">
                {currentLeadId ? "Update Lead details" : "Add customer Lead"}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all text-slate-500"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-805 dark:text-slate-50 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. name@domain.com"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-805 dark:text-slate-50 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +1 (555) 000-0000"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-805 dark:text-slate-50 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pipeline status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Lead["status"])}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-805 dark:text-slate-50 focus:outline-none"
                >
                  <option value="new">New Lead</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="closed_won">Closed Won (Deal Done)</option>
                  <option value="closed_lost">Closed Lost</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Conversational Notes / Background</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="e.g. Inquired about discount codes or custom packaging..."
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-805 dark:text-slate-50 focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-md"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
