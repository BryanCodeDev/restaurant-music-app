import React, { useState, useEffect, useMemo } from 'react';
import {
  Check,
  X,
  Eye,
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  CreditCard,
  Calendar,
  FileText,
  Search,
  Filter,
  RefreshCw,
  Star,
  Crown,
  Zap,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Trash2,
  Edit,
  Users,
  DollarSign,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import apiService from '../../services/apiService';

// Constantes para estados y métodos de pago
const SUBSCRIPTION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

const PAYMENT_METHODS = {
  QR: 'qr',
  TRANSFER: 'transfer'
};

const PLAN_TYPES = {
  STARTER: 'starter',
  PROFESSIONAL: 'professional',
  ENTERPRISE: 'enterprise'
};

const PaymentApproval = () => {
  const [pendingSubscriptions, setPendingSubscriptions] = useState([]);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);

  // Nuevos estados para funcionalidades avanzadas
  const [selectedSubscriptions, setSelectedSubscriptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('submittedAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [planFilter, setPlanFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  useEffect(() => {
    loadPendingSubscriptions();
  }, []);

  const loadPendingSubscriptions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiService.getAllSubscriptions();
      if (response.success) {
        setPendingSubscriptions(response.data.subscriptions || []);
      } else {
        setError('Error al cargar las suscripciones: ' + response.message);
      }
    } catch (err) {
      console.error('Error loading subscriptions:', err);
      setError('Error al cargar las suscripciones pendientes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveSubscription = async (subscriptionId) => {
    try {
      setActionLoading(subscriptionId);

      const response = await apiService.approveSubscription(subscriptionId);

      if (response.success) {
        // Actualizar estado local
        setPendingSubscriptions(prev =>
          prev.map(sub =>
            sub.id === subscriptionId
              ? { ...sub, status: 'approved' }
              : sub
          )
        );

        // Cerrar modal si está abierto
        if (selectedSubscription?.id === subscriptionId) {
          setShowDetailsModal(false);
          setSelectedSubscription(null);
        }

        // No mostrar alert, el estado se actualiza automáticamente
      } else {
        setError('Error al aprobar la suscripción: ' + response.message);
      }
    } catch (error) {
      setError('Error al aprobar la suscripción: ' + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectSubscription = async (subscriptionId, reason) => {
    try {
      setActionLoading(subscriptionId);

      const response = await apiService.rejectSubscription(subscriptionId, reason);

      if (response.success) {
        // Actualizar estado local
        setPendingSubscriptions(prev =>
          prev.map(sub =>
            sub.id === subscriptionId
              ? { ...sub, status: 'rejected', rejectionReason: reason }
              : sub
          )
        );

        // Cerrar modal si está abierto
        if (selectedSubscription?.id === subscriptionId) {
          setShowDetailsModal(false);
          setSelectedSubscription(null);
        }

        // No mostrar alert, el estado se actualiza automáticamente
      } else {
        setError('Error al rechazar la suscripción: ' + response.message);
      }
    } catch (error) {
      setError('Error al rechazar la suscripción: ' + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewDetails = (subscription) => {
    setSelectedSubscription(subscription);
    setShowDetailsModal(true);
  };

  // Funciones para operaciones en lote
  const handleSelectSubscription = (subscriptionId) => {
    setSelectedSubscriptions(prev =>
      prev.includes(subscriptionId)
        ? prev.filter(id => id !== subscriptionId)
        : [...prev, subscriptionId]
    );
  };

  const handleSelectAll = () => {
    if (selectedSubscriptions.length === filteredSubscriptions.length) {
      setSelectedSubscriptions([]);
    } else {
      setSelectedSubscriptions(filteredSubscriptions.map(sub => sub.id));
    }
  };

  const handleBulkApprove = async () => {
    if (selectedSubscriptions.length === 0) return;

    try {
      setBulkActionLoading(true);
      const results = await Promise.all(
        selectedSubscriptions.map(id => apiService.approveSubscription(id))
      );

      const successCount = results.filter(result => result.success).length;
      const failCount = results.length - successCount;

      // Actualizar estado local
      setPendingSubscriptions(prev =>
        prev.map(sub =>
          selectedSubscriptions.includes(sub.id)
            ? { ...sub, status: SUBSCRIPTION_STATUS.APPROVED }
            : sub
        )
      );

      setSelectedSubscriptions([]);

      if (failCount === 0) {
        setError(null);
      } else {
        setError(`${successCount} aprobadas exitosamente, ${failCount} fallaron`);
      }
    } catch (error) {
      setError('Error en aprobación masiva: ' + error.message);
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkReject = async () => {
    if (selectedSubscriptions.length === 0) return;

    const reason = prompt('Razón del rechazo masivo:');
    if (!reason) return;

    try {
      setBulkActionLoading(true);
      const results = await Promise.all(
        selectedSubscriptions.map(id => apiService.rejectSubscription(id, reason))
      );

      const successCount = results.filter(result => result.success).length;
      const failCount = results.length - successCount;

      // Actualizar estado local
      setPendingSubscriptions(prev =>
        prev.map(sub =>
          selectedSubscriptions.includes(sub.id)
            ? { ...sub, status: SUBSCRIPTION_STATUS.REJECTED, rejectionReason: reason }
            : sub
        )
      );

      setSelectedSubscriptions([]);

      if (failCount === 0) {
        setError(null);
      } else {
        setError(`${successCount} rechazadas exitosamente, ${failCount} fallaron`);
      }
    } catch (error) {
      setError('Error en rechazo masivo: ' + error.message);
    } finally {
      setBulkActionLoading(false);
    }
  };

  // Funciones de ordenamiento
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Funciones de paginación
  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSubscriptions = filteredSubscriptions.slice(startIndex, endIndex);

  // Funciones de exportación
  const exportToCSV = () => {
    const csvData = filteredSubscriptions.map(sub => ({
      'ID': sub.id,
      'Usuario': sub.userName,
      'Email': sub.userEmail,
      'Plan': sub.planName,
      'Precio': sub.planPrice,
      'Método de Pago': sub.paymentMethod === PAYMENT_METHODS.QR ? 'Código QR' : 'Transferencia',
      'Estado': sub.status,
      'Fecha': new Date(sub.submittedAt).toLocaleDateString('es-CO'),
      'Restaurante': sub.restaurantInfo?.name || 'N/A'
    }));

    const csvString = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `suscripciones_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredSubscriptions = useMemo(() => {
    return pendingSubscriptions
      .filter(subscription => {
        // Filtro de búsqueda
        const matchesSearch =
          subscription.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          subscription.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          subscription.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          subscription.restaurantInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase());

        // Filtro de estado
        const matchesStatus = statusFilter === 'all' || subscription.status === statusFilter;

        // Filtro de plan
        const matchesPlan = planFilter === 'all' || subscription.planId === planFilter;

        // Filtro de método de pago
        const matchesPaymentMethod = paymentMethodFilter === 'all' || subscription.paymentMethod === paymentMethodFilter;

        // Filtro de rango de fechas
        const matchesDateRange = (!dateRange.start || !dateRange.end) ||
          (new Date(subscription.submittedAt) >= new Date(dateRange.start) &&
           new Date(subscription.submittedAt) <= new Date(dateRange.end));

        return matchesSearch && matchesStatus && matchesPlan && matchesPaymentMethod && matchesDateRange;
      })
      .sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];

        // Manejar fechas
        if (sortField === 'submittedAt') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        // Manejar strings
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [pendingSubscriptions, searchTerm, statusFilter, planFilter, paymentMethodFilter, dateRange, sortField, sortDirection]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <div className="flex items-center space-x-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
            <Clock className="h-4 w-4 text-yellow-400" />
            <span className="text-yellow-400 font-medium">Pendiente</span>
          </div>
        );
      case 'approved':
        return (
          <div className="flex items-center space-x-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span className="text-green-400 font-medium">Aprobada</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center space-x-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
            <X className="h-4 w-4 text-red-400" />
            <span className="text-red-400 font-medium">Rechazada</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getPlanIcon = (planId) => {
    switch (planId) {
      case 'starter':
        return <Star className="h-5 w-5 text-blue-400" />;
      case 'professional':
        return <Crown className="h-5 w-5 text-purple-400" />;
      case 'enterprise':
        return <Zap className="h-5 w-5 text-yellow-400" />;
      default:
        return <CreditCard className="h-5 w-5 text-slate-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Cargando suscripciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Aprobación de Pagos</h2>
          <p className="text-slate-400">Revisa y aprueba las suscripciones pendientes</p>
        </div>
        <button
          onClick={loadPendingSubscriptions}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Actualizar</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, email o plan..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="approved">Aprobadas</option>
            <option value="rejected">Rechazadas</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Pendientes</p>
              <p className="text-2xl font-bold text-white">
                {filteredSubscriptions.filter(s => s.status === SUBSCRIPTION_STATUS.PENDING).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Aprobadas</p>
              <p className="text-2xl font-bold text-white">
                {filteredSubscriptions.filter(s => s.status === SUBSCRIPTION_STATUS.APPROVED).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Rechazadas</p>
              <p className="text-2xl font-bold text-white">
                {filteredSubscriptions.filter(s => s.status === SUBSCRIPTION_STATUS.REJECTED).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total</p>
              <p className="text-2xl font-bold text-white">
                {filteredSubscriptions.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-slate-400" />
            <span className="text-white font-medium">Filtros Avanzados</span>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
          >
            {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            <span>{showFilters ? 'Ocultar' : 'Mostrar'}</span>
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Plan</label>
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los planes</option>
                <option value={PLAN_TYPES.STARTER}>Starter</option>
                <option value={PLAN_TYPES.PROFESSIONAL}>Professional</option>
                <option value={PLAN_TYPES.ENTERPRISE}>Enterprise</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Método de Pago</label>
              <select
                value={paymentMethodFilter}
                onChange={(e) => setPaymentMethodFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los métodos</option>
                <option value={PAYMENT_METHODS.QR}>Código QR</option>
                <option value={PAYMENT_METHODS.TRANSFER}>Transferencia</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Fecha Desde</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Fecha Hasta</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedSubscriptions.length > 0 && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-blue-400" />
              <span className="text-blue-400 font-medium">
                {selectedSubscriptions.length} suscripción(es) seleccionada(s)
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleBulkApprove}
                disabled={bulkActionLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-400 transition-colors disabled:opacity-50"
              >
                {bulkActionLoading ? (
                  <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                <span>Aprobar Todas</span>
              </button>
              <button
                onClick={handleBulkReject}
                disabled={bulkActionLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 transition-colors disabled:opacity-50"
              >
                <X className="h-4 w-4" />
                <span>Rechazar Todas</span>
              </button>
              <button
                onClick={() => setSelectedSubscriptions([])}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Limpiar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subscriptions List */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSelectAll}
              className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
            >
              <div className={`w-4 h-4 border-2 rounded ${
                selectedSubscriptions.length === filteredSubscriptions.length && filteredSubscriptions.length > 0
                  ? 'bg-blue-500 border-blue-500'
                  : 'border-slate-600'
              } flex items-center justify-center`}>
                {selectedSubscriptions.length === filteredSubscriptions.length && filteredSubscriptions.length > 0 && (
                  <Check className="h-3 w-3 text-white" />
                )}
              </div>
              <span className="text-sm">Seleccionar todo</span>
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center space-x-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Exportar CSV</span>
            </button>
          </div>
          <div className="text-sm text-slate-400">
            Mostrando {startIndex + 1}-{Math.min(endIndex, filteredSubscriptions.length)} de {filteredSubscriptions.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/60">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <span>Seleccionar</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('userName')}>
                  <div className="flex items-center space-x-1">
                    <span>Usuario</span>
                    {sortField === 'userName' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('planName')}>
                  <div className="flex items-center space-x-1">
                    <span>Plan</span>
                    {sortField === 'planName' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Método de Pago
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('submittedAt')}>
                  <div className="flex items-center space-x-1">
                    <span>Fecha</span>
                    {sortField === 'submittedAt' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('status')}>
                  <div className="flex items-center space-x-1">
                    <span>Estado</span>
                    {sortField === 'status' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {paginatedSubscriptions.map((subscription) => (
                <tr key={subscription.id} className="hover:bg-slate-800/30">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <button
                        onClick={() => handleSelectSubscription(subscription.id)}
                        className="flex items-center justify-center w-4 h-4 border-2 border-slate-600 rounded hover:border-blue-500 transition-colors"
                      >
                        {selectedSubscriptions.includes(subscription.id) && (
                          <Check className="h-3 w-3 text-blue-500" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">
                          {subscription.userName}
                        </div>
                        <div className="text-sm text-slate-400">
                          {subscription.userEmail}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getPlanIcon(subscription.planId)}
                      <div>
                        <div className="text-sm font-medium text-white">
                          {subscription.planName}
                        </div>
                        <div className="text-sm text-slate-400">
                          {subscription.planPrice}{subscription.planPeriod}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-300">
                        {subscription.paymentMethod === 'qr' ? 'Código QR' : 'Transferencia'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {new Date(subscription.submittedAt).toLocaleDateString('es-CO', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(subscription.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewDetails(subscription)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {subscription.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApproveSubscription(subscription.id)}
                            disabled={actionLoading === subscription.id}
                            className="text-green-400 hover:text-green-300 transition-colors disabled:opacity-50"
                            title="Aprobar"
                          >
                            {actionLoading === subscription.id ? (
                              <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt('Razón del rechazo:');
                              if (reason) {
                                handleRejectSubscription(subscription.id, reason);
                              }
                            }}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            title="Rechazar"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSubscriptions.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-300 mb-2">
              No hay suscripciones
            </h3>
            <p className="text-slate-500">
              No se encontraron suscripciones con los filtros aplicados
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredSubscriptions.length > itemsPerPage && (
        <div className="flex items-center justify-between bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
          <div className="text-sm text-slate-400">
            Mostrando {startIndex + 1}-{Math.min(endIndex, filteredSubscriptions.length)} de {filteredSubscriptions.length} resultados
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              Anterior
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedSubscription && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Detalles de Suscripción</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Information */}
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Información del Usuario</span>
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-slate-400">Nombre</label>
                      <p className="text-white font-medium">{selectedSubscription.userName}</p>
                    </div>
                    <div>
                      <label className="text-sm text-slate-400">Email</label>
                      <p className="text-white">{selectedSubscription.userEmail}</p>
                    </div>
                    <div>
                      <label className="text-sm text-slate-400">Teléfono</label>
                      <p className="text-white">{selectedSubscription.userPhone}</p>
                    </div>
                  </div>
                </div>

                {/* Restaurant Information */}
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Información del Restaurante</span>
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-slate-400">Nombre</label>
                      <p className="text-white font-medium">{selectedSubscription.restaurantInfo.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-slate-400">Dirección</label>
                      <p className="text-white">{selectedSubscription.restaurantInfo.address}</p>
                    </div>
                    <div>
                      <label className="text-sm text-slate-400">Tipo de Cocina</label>
                      <p className="text-white">{selectedSubscription.restaurantInfo.cuisineType}</p>
                    </div>
                  </div>
                </div>

                {/* Plan Information */}
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    {getPlanIcon(selectedSubscription.planId)}
                    <span>Plan Seleccionado</span>
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-slate-400">Plan</label>
                      <p className="text-white font-medium">{selectedSubscription.planName}</p>
                    </div>
                    <div>
                      <label className="text-sm text-slate-400">Precio</label>
                      <p className="text-white font-medium">
                        {selectedSubscription.planPrice}{selectedSubscription.planPeriod}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-slate-400">Método de Pago</label>
                      <p className="text-white">
                        {selectedSubscription.paymentMethod === 'qr' ? 'Código QR' : 'Transferencia'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-slate-400">Fecha de Solicitud</label>
                      <p className="text-white">
                        {new Date(selectedSubscription.submittedAt).toLocaleString('es-CO')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Proof */}
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Comprobante de Pago</h3>
                  <div className="space-y-4">
                    <img
                      src={selectedSubscription.paymentProof}
                      alt="Comprobante de pago"
                      className="w-full max-h-48 object-contain rounded-lg border border-slate-600"
                    />
                    <div className="flex space-x-2">
                      <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 transition-colors">
                        <Eye className="h-4 w-4" />
                        <span>Ver Completo</span>
                      </button>
                      <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg text-slate-300 transition-colors">
                        <Download className="h-4 w-4" />
                        <span>Descargar</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedSubscription.notes && (
                <div className="mt-6 bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Notas</h3>
                  <p className="text-slate-300">{selectedSubscription.notes}</p>
                </div>
              )}

              {/* Actions */}
              {selectedSubscription.status === 'pending' && (
                <div className="mt-6 flex items-center justify-end space-x-4">
                  <button
                    onClick={() => {
                      const reason = prompt('Razón del rechazo (opcional):');
                      if (reason !== null) {
                        handleRejectSubscription(selectedSubscription.id, reason || 'Sin especificar');
                      }
                    }}
                    className="flex items-center space-x-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 transition-colors"
                  >
                    <X className="h-5 w-5" />
                    <span>Rechazar</span>
                  </button>
                  <button
                    onClick={() => handleApproveSubscription(selectedSubscription.id)}
                    disabled={actionLoading === selectedSubscription.id}
                    className="flex items-center space-x-2 px-6 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-400 hover:text-green-300 transition-colors disabled:opacity-50"
                  >
                    {actionLoading === selectedSubscription.id ? (
                      <div className="w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Check className="h-5 w-5" />
                    )}
                    <span>Aprobar</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentApproval;