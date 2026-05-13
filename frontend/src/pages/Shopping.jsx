import { useState, useEffect } from 'react';
import { getShoppingList } from '../api/shopping';
import { useWeek } from '../hooks/useWeek';

function getMonday(offset = 0) {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) + offset * 7;
  d.setDate(diff);
  return d.toISOString().split('T')[0];
}
function getSunday(offset = 0) {
  const d = new Date(getMonday(offset));
  d.setDate(d.getDate() + 6);
  return d.toISOString().split('T')[0];
}

export default function Shopping() {
  const [startDate, setStartDate] = useState(getMonday());
  const [endDate, setEndDate] = useState(getSunday());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState({});
  const [collapsed, setCollapsed] = useState({});

  const generate = async () => {
    setLoading(true);
    setChecked({});
    try {
      const result = await getShoppingList(startDate, endDate);
      setData(result);
    } catch (e) {
      alert('Error al generar la lista');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { generate(); }, []);

  const toggleCheck = (key) => setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  const toggleCollapse = (cat) => setCollapsed(prev => ({ ...prev, [cat]: !prev[cat] }));

  const checkedCount = Object.values(checked).filter(Boolean).length;
  const totalItems = data?.totalItems || 0;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-title">🛒 Lista de la Compra</div>
          <div className="page-subtitle">Generada automáticamente desde tu planificador</div>
        </div>
      </div>

      {/* Controls */}
      <div className="shopping-controls">
        <div className="date-picker-group">
          <label>Desde</label>
          <input type="date" className="form-input" style={{ width: 'auto' }}
            value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>
        <div className="date-picker-group">
          <label>Hasta</label>
          <input type="date" className="form-input" style={{ width: 'auto' }}
            value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={generate} disabled={loading}>
          {loading ? '⏳ Generando...' : '🔄 Generar Lista'}
        </button>

        {data && (
          <div className="shopping-summary">
            <div className="summary-stat">
              <div className="summary-stat-num">{totalItems}</div>
              <div className="summary-stat-label">Productos</div>
            </div>
            <div className="summary-stat">
              <div className="summary-stat-num">{data.mealCount}</div>
              <div className="summary-stat-label">Comidas</div>
            </div>
            <div className="summary-stat">
              <div className="summary-stat-num" style={{ color: 'var(--accent)' }}>
                {checkedCount}/{totalItems}
              </div>
              <div className="summary-stat-label">Comprado</div>
            </div>
          </div>
        )}
      </div>

      {loading && <div className="spinner" />}

      {!loading && data && data.categories.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>Sin comidas planificadas</h3>
          <p>Añade recetas al calendario para generar la lista</p>
        </div>
      )}

      {!loading && data && data.categories.length > 0 && (
        <div className="shopping-categories">
          {data.categories.map(cat => (
            <div key={cat.category} className="shopping-category">
              <div className="category-header" onClick={() => toggleCollapse(cat.category)}>
                <h3>{cat.label}</h3>
                <div className="flex items-center gap-3">
                  <span className="category-count">{cat.ingredients.length} productos</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {collapsed[cat.category] ? '▼' : '▲'}
                  </span>
                </div>
              </div>

              {!collapsed[cat.category] && (
                <div className="category-items">
                  {cat.ingredients.map(item => {
                    const key = `${item.id}::${item.unit}`;
                    const isChecked = !!checked[key];
                    return (
                      <label key={key} className={`shopping-item ${isChecked ? 'checked' : ''}`}>
                        <input
                          type="checkbox"
                          className="custom-checkbox"
                          checked={isChecked}
                          onChange={() => toggleCheck(key)}
                        />
                        <span className="shopping-item-name">{item.name}</span>
                        <span className="shopping-item-qty">
                          {Number.isInteger(item.totalQuantity)
                            ? item.totalQuantity
                            : item.totalQuantity.toFixed(1)} {item.unit}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
