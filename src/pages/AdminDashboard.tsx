import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useActs } from '../hooks';
import ActCard from '../components/ActCard';
import QRCodeDisplay from '../components/QRCodeDisplay';
import { createAct, updateAct, deleteAct, getActsByStatus, updateActStatus, updateActWithHistory } from '../utils/firestore';
import { sampleActs } from '../data/seedData';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { acts, loading } = useActs();
  const [showAddForm, setShowAddForm] = useState(false);
  const [pendingActs, setPendingActs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'approved' | 'pending'>('approved');
  const [editingActId, setEditingActId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    grade: '',
    description: '',
  });
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    description: '',
  });

  // Load pending acts
  useEffect(() => {
    const loadPendingActs = async () => {
      try {
        console.log('Loading pending acts...');
        const pending = await getActsByStatus('pending');
        console.log('Found pending acts:', pending);
        setPendingActs(pending);
      } catch (error) {
        console.error('Error loading pending acts:', error);
      }
    };
    
    loadPendingActs();
    
    // Also reload when acts change (in case a new act was registered)
    const interval = setInterval(loadPendingActs, 5000); // Check every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  const handleApproveAct = async (actId: string) => {
    try {
      const nextOrder = Math.max(...acts.map(a => a.order), 0) + 1;
      await updateActStatus(actId, 'approved', nextOrder);
      setPendingActs(prev => prev.filter(act => act.id !== actId));
    } catch (error) {
      console.error('Error approving act:', error);
    }
  };

  const handleRejectAct = async (actId: string) => {
    try {
      await updateActStatus(actId, 'rejected');
      setPendingActs(prev => prev.filter(act => act.id !== actId));
    } catch (error) {
      console.error('Error rejecting act:', error);
    }
  };

  const handleAddAct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.grade) return;

    try {
      const newAct = {
        ...formData,
        order: acts.length + 1,
        isActive: false,
        isVotingOpen: false,
        avgScore: 0,
        votesCount: 0,
        status: 'approved' as const,
        submittedBy: 'Admin',
      };

      await createAct(newAct);
      setFormData({ name: '', grade: '', description: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding act:', error);
    }
  };

  const handleActivate = async (actId: string) => {
    try {
      // Deactivate all other acts first
      await Promise.all(
        acts.map(act => 
          act.id !== actId && act.isActive 
            ? updateAct(act.id, { isActive: false, isVotingOpen: false })
            : Promise.resolve()
        )
      );
      
      // Activate the selected act
      await updateAct(actId, { isActive: true });
    } catch (error) {
      console.error('Error activating act:', error);
    }
  };

  const handleStartVoting = async (actId: string) => {
    try {
      await updateAct(actId, { isVotingOpen: true });
    } catch (error) {
      console.error('Error starting voting:', error);
    }
  };

  const handleStopVoting = async (actId: string) => {
    try {
      await updateAct(actId, { isVotingOpen: false });
    } catch (error) {
      console.error('Error stopping voting:', error);
    }
  };

  const handleDeleteAct = async (actId: string) => {
    if (window.confirm('Are you sure you want to delete this act?')) {
      try {
        await deleteAct(actId);
      } catch (error) {
        console.error('Error deleting act:', error);
      }
    }
  };

  const handleSeedData = async () => {
    if (window.confirm('This will add sample acts. Continue?')) {
      try {
        for (const act of sampleActs) {
          await createAct(act);
        }
      } catch (error) {
        console.error('Error seeding data:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading acts...</p>
        </motion.div>
      </div>
    );
  }

  const handleEditAct = (act: any) => {
    setEditingActId(act.id);
    setEditFormData({
      name: act.name,
      grade: act.grade,
      description: act.description,
    });
  };

  const handleSaveEdit = async (actId: string) => {
    try {
      const originalAct = [...acts, ...pendingActs].find(act => act.id === actId);
      if (!originalAct) return;

      await updateActWithHistory(actId, editFormData, originalAct, user?.email || 'Admin');
      
      // Update local state
      setPendingActs(prev => prev.map(act => 
        act.id === actId ? { ...act, ...editFormData } : act
      ));
      
      setEditingActId(null);
    } catch (error) {
      console.error('Error saving edit:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingActId(null);
    setEditFormData({ name: '', grade: '', description: '' });
  };

  return (
    <div className="min-h-screen bg-theatrical">
      {/* Header */}
      <motion.header
        className="bg-gradient-to-r from-curtain-800 via-curtain-700 to-curtain-800 shadow-2xl border-b-4 border-secondary-400"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-secondary-200 text-glow">
                🎭 BROEDIES GOT TALENT
              </h1>
              <p className="text-secondary-300 mt-2 text-lg font-semibold">
                ✨ ADMIN PANEL ✨
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-secondary-300">
                Welcome, {user?.email}
              </span>
              <button
                onClick={logout}
                className="btn-curtain"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <motion.div
          className="mb-8 flex flex-wrap gap-4 justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex gap-4">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn-spotlight"
            >
              ✨ Add New Act
            </button>
            <button
              onClick={handleSeedData}
              className="btn-secondary"
            >
              🌱 Add Sample Data
            </button>
            <a
              href="/register"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              📝 Registration Page
            </a>
          </div>
          
          <div className="flex gap-4">
            <a
              href="/display"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent"
            >
              📺 Display View
            </a>
            <a
              href="/audience"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent"
            >
              👥 Audience View
            </a>
          </div>
        </motion.div>

        {/* QR Code Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-secondary-200 text-glow mb-2">
              📱 Audience Access QR Codes
            </h2>
            <p className="text-secondary-300 font-semibold">
              Share these QR codes for easy audience access
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <QRCodeDisplay
              url={`${window.location.origin}/audience`}
              title="🎭 Audience Experience"
              description="Scan to vote, comment, and participate"
            />
            <QRCodeDisplay
              url={`${window.location.origin}/register`}
              title="📝 Act Registration"
              description="Scan to register a new act"
            />
            <QRCodeDisplay
              url={`${window.location.origin}/display`}
              title="📺 Display Screen"
              description="Scan for projector display view"
            />
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex space-x-1 bg-curtain-800 p-1 rounded-lg w-fit border-2 border-secondary-400">
            <button
              onClick={() => setActiveTab('approved')}
              className={`px-6 py-3 rounded-md font-bold transition-all duration-300 ${
                activeTab === 'approved'
                  ? 'bg-secondary-500 text-white shadow-lg transform scale-105'
                  : 'text-secondary-200 hover:text-white hover:bg-curtain-700'
              }`}
            >
              ✨ Approved Acts ({acts.filter(act => act.status === 'approved').length})
            </button>
            <button
              onClick={() => {
                setActiveTab('pending');
                // Reload pending acts when switching to pending tab
                const loadPendingActs = async () => {
                  try {
                    console.log('Manually loading pending acts...');
                    const pending = await getActsByStatus('pending');
                    console.log('Manually found pending acts:', pending);
                    setPendingActs(pending);
                  } catch (error) {
                    console.error('Error loading pending acts:', error);
                  }
                };
                loadPendingActs();
              }}
              className={`px-6 py-3 rounded-md font-bold transition-all duration-300 ${
                activeTab === 'pending'
                  ? 'bg-secondary-500 text-white shadow-lg transform scale-105'
                  : 'text-secondary-200 hover:text-white hover:bg-curtain-700'
              }`}
            >
              ⏳ Pending Review ({pendingActs.length})
            </button>
          </div>
        </motion.div>

        {/* Add Act Form */}
        {showAddForm && (
          <motion.div
            className="card mb-8"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Act</h2>
            <form onSubmit={handleAddAct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Act Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Grade 1 Singing Stars"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade
                  </label>
                  <input
                    type="text"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Grade 1"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field resize-none h-20"
                  placeholder="Brief description of the performance..."
                />
              </div>
              <div className="flex gap-4">
                <button type="submit" className="btn-primary">
                  Add Act
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Acts List */}
        <div className="space-y-6">
          {activeTab === 'approved' ? (
            acts.filter(act => act.status === 'approved').length === 0 ? (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-6xl mb-4">🎭</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No approved acts yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Add acts manually or approve pending submissions
                </p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="btn-primary"
                >
                  Add First Act
                </button>
              </motion.div>
            ) : (
              acts.filter(act => act.status === 'approved').map((act, index) => (
                <motion.div
                  key={act.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ActCard
                    act={act}
                    onActivate={() => handleActivate(act.id)}
                    onStartVoting={() => handleStartVoting(act.id)}
                    onStopVoting={() => handleStopVoting(act.id)}
                    onEdit={() => console.log('Edit act:', act.id)}
                    onDelete={() => handleDeleteAct(act.id)}
                    isAdmin={true}
                  />
                </motion.div>
              ))
            )
          ) : (
            // Pending Acts Section
            pendingActs.length === 0 ? (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No pending submissions
                </h3>
                <p className="text-gray-500 mb-4">
                  New act registrations will appear here for review
                </p>
                <a
                  href="/register"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  View Registration Page
                </a>
              </motion.div>
            ) : (
              pendingActs.map((act, index) => (
                <motion.div
                  key={act.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="card-theatrical border-l-4 border-secondary-400">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-secondary-200 text-secondary-800 px-3 py-1 rounded-full text-sm font-bold border border-secondary-400">
                            ⏳ PENDING REVIEW
                          </span>
                          <span className="bg-primary-200 text-primary-800 px-3 py-1 rounded-full text-sm font-bold border border-primary-400">
                            🎭 ACT{act.id.slice(-3)}
                          </span>
                          <span className="bg-accent-200 text-accent-800 px-3 py-1 rounded-full text-sm font-bold border border-accent-400">
                            📚 {editingActId === act.id ? editFormData.grade : act.grade}
                          </span>
                        </div>
                        
                        {editingActId === act.id ? (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Act Name
                              </label>
                              <input
                                type="text"
                                value={editFormData.name}
                                onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="input-field"
                                placeholder="Act name"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Grade
                              </label>
                              <input
                                type="text"
                                value={editFormData.grade}
                                onChange={(e) => setEditFormData(prev => ({ ...prev, grade: e.target.value }))}
                                className="input-field"
                                placeholder="Grade"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                              </label>
                              <textarea
                                value={editFormData.description}
                                onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                                rows={3}
                                className="input-field"
                                placeholder="Act description"
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                              {act.name}
                            </h3>
                            
                            <p className="text-gray-600 mb-3">
                              {act.description}
                            </p>
                          </>
                        )}

                        <div className="text-sm text-gray-500 mb-3">
                          <p><strong>Submitted by:</strong> {act.submittedBy}</p>
                          {act.contactEmail && <p><strong>Email:</strong> {act.contactEmail}</p>}
                          {act.contactPhone && <p><strong>Phone:</strong> {act.contactPhone}</p>}
                          <p><strong>Submitted:</strong> {new Date(act.submissionDate).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        {editingActId === act.id ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(act.id)}
                              className="btn-spotlight text-sm py-2 px-4"
                            >
                              💾 Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="btn-accent text-sm py-2 px-4"
                            >
                              ✗ Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditAct(act)}
                              className="btn-spotlight text-sm py-2 px-4"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleApproveAct(act.id)}
                              className="btn-primary text-sm py-2 px-4"
                            >
                              ✅ Approve
                            </button>
                            <button
                              onClick={() => handleRejectAct(act.id)}
                              className="btn-curtain text-sm py-2 px-4"
                            >
                              ❌ Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

