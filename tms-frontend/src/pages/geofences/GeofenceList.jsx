import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';
import { FiTarget, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { MapContainer, TileLayer, Circle, Popup, useMapEvents } from 'react-leaflet';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import geofenceService from '../../services/geofenceService';
import { useAuth } from '../../context/AuthContext';
import 'leaflet/dist/leaflet.css';
import '../../styles/components.css';

function GeofenceForm({ geofence, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: geofence?.name || '',
    description: geofence?.description || '',
    latitude: geofence?.latitude || 40.7128,
    longitude: geofence?.longitude || -74.006,
    radiusMeters: geofence?.radiusMeters || 500,
    type: geofence?.type || 'CUSTOM',
    active: geofence?.active !== undefined ? geofence.active : true,
  });

  const handleChange = (field, value) => setForm(f => ({ ...f, [field]: value }));

  function ClickHandler() {
    useMapEvents({
      click(e) {
        handleChange('latitude', e.latlng.lat);
        handleChange('longitude', e.latlng.lng);
      },
    });
    return null;
  }

  return (
    <div className="entity-form">
      <div className="form-grid">
        <div className="form-field">
          <label className="form-label">Name *</label>
          <input className="form-input" value={form.name} onChange={e => handleChange('name', e.target.value)} required />
        </div>
        <div className="form-field">
          <label className="form-label">Type</label>
          <select className="form-input" value={form.type} onChange={e => handleChange('type', e.target.value)}>
            <option value="DEPOT">Depot</option>
            <option value="RESTRICTED_ZONE">Restricted Zone</option>
            <option value="DELIVERY_ZONE">Delivery Zone</option>
            <option value="CUSTOM">Custom</option>
          </select>
        </div>
        <div className="form-field">
          <label className="form-label">Radius (meters) *</label>
          <input className="form-input" type="number" min="50" value={form.radiusMeters} onChange={e => handleChange('radiusMeters', parseFloat(e.target.value))} />
        </div>
        <div className="form-field">
          <label className="form-label">
            <input type="checkbox" checked={form.active} onChange={e => handleChange('active', e.target.checked)} style={{ marginRight: 8 }} />
            Active
          </label>
        </div>
        <div className="form-field" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Description</label>
          <textarea className="form-input form-textarea" value={form.description} onChange={e => handleChange('description', e.target.value)} />
        </div>
      </div>
      <div style={{ height: 250, marginBottom: 12, borderRadius: 8, overflow: 'hidden' }}>
        <MapContainer center={[form.latitude, form.longitude]} zoom={12} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Circle center={[form.latitude, form.longitude]} radius={form.radiusMeters} pathOptions={{ color: '#1a237e', fillColor: '#3f51b5', fillOpacity: 0.2 }} />
          <ClickHandler />
        </MapContainer>
      </div>
      <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>Click on map to set center. Lat: {form.latitude.toFixed(6)}, Lng: {form.longitude.toFixed(6)}</p>
      <div className="form-actions">
        <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary" onClick={() => onSubmit(form)}>{geofence ? 'Update' : 'Create'}</button>
      </div>
    </div>
  );
}

const GEOFENCE_COLORS = { DEPOT: '#2e7d32', RESTRICTED_ZONE: '#c62828', DELIVERY_ZONE: '#1565c0', CUSTOM: '#6a1b9a' };

function GeofenceList() {
  const intl = useIntl();
  const { hasRole } = useAuth();
  const [geofences, setGeofences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await geofenceService.getAll({ page: 0, size: 100 });
      setGeofences(res.data?.content || []);
    } catch { toast.error('Failed to load geofences'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (data) => {
    try {
      if (editing) {
        await geofenceService.update(editing.id, data);
        toast.success('Geofence updated');
      } else {
        await geofenceService.create(data);
        toast.success('Geofence created');
      }
      setModalOpen(false); setEditing(null); fetchData();
    } catch { toast.error('Operation failed'); }
  };

  const handleDelete = async () => {
    try {
      await geofenceService.delete(deleteTarget.id);
      toast.success('Geofence deleted');
      setDeleteTarget(null); fetchData();
    } catch { toast.error('Delete failed'); }
  };

  const mapCenter = geofences.length > 0 ? [geofences[0].latitude, geofences[0].longitude] : [40.7128, -74.006];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1><FiTarget style={{ marginRight: 8 }} />{intl.formatMessage({ id: 'geofences.title' })}</h1>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setModalOpen(true); }}>
          <FiPlus /> {intl.formatMessage({ id: 'btn.add' })}
        </button>
      </div>

      <div style={{ height: 350, marginBottom: 20, borderRadius: 8, overflow: 'hidden' }}>
        <MapContainer center={mapCenter} zoom={5} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {geofences.map(g => (
            <Circle key={g.id} center={[g.latitude, g.longitude]} radius={g.radiusMeters}
              pathOptions={{ color: GEOFENCE_COLORS[g.type] || '#6a1b9a', fillColor: GEOFENCE_COLORS[g.type] || '#6a1b9a', fillOpacity: 0.15 }}>
              <Popup><strong>{g.name}</strong><br />{g.type} · {g.radiusMeters}m<br />{g.description || ''}</Popup>
            </Circle>
          ))}
        </MapContainer>
      </div>

      {loading ? <p>{intl.formatMessage({ id: 'loading' })}</p> : (
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th><th>Type</th><th>Lat</th><th>Lng</th><th>Radius (m)</th><th>Active</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {geofences.map(g => (
                <tr key={g.id}>
                  <td><strong>{g.name}</strong></td>
                  <td><span className="status-badge" style={{ background: GEOFENCE_COLORS[g.type] || '#6a1b9a', color: '#fff' }}>{g.type}</span></td>
                  <td>{g.latitude?.toFixed(4)}</td>
                  <td>{g.longitude?.toFixed(4)}</td>
                  <td>{g.radiusMeters}</td>
                  <td>{g.active ? '✅' : '❌'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-sm btn-secondary" onClick={() => { setEditing(g); setModalOpen(true); }}><FiEdit2 /></button>
                      {hasRole('ADMIN') && <button className="btn btn-sm btn-danger" onClick={() => setDeleteTarget(g)}><FiTrash2 /></button>}
                    </div>
                  </td>
                </tr>
              ))}
              {geofences.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center' }}>No geofences defined</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} title={editing ? 'Edit Geofence' : 'Create Geofence'}>
        <GeofenceForm geofence={editing} onSubmit={handleSubmit} onCancel={() => { setModalOpen(false); setEditing(null); }} />
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Delete Geofence" message={`Delete geofence "${deleteTarget?.name}"?`} />
    </div>
  );
}

export default GeofenceList;

