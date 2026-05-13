import { useState, useEffect } from 'react';
import { getIngredients, createIngredient } from '../api/ingredients';
import { createRecipe, updateRecipe } from '../api/recipes';

const CATEGORIES = ['VEGETABLES','FRUITS','MEAT','FISH','DAIRY','GRAINS','CONDIMENTS','BEVERAGES','OTHER'];
const CAT_LABELS  = { VEGETABLES:'Verduras', FRUITS:'Frutas', MEAT:'Carnes', FISH:'Pescados', DAIRY:'Lácteos', GRAINS:'Cereales', CONDIMENTS:'Condimentos', BEVERAGES:'Bebidas', OTHER:'Otros' };

function IngredientRow({ row, index, allIngredients, onChange, onRemove }) {
  const [query, setQuery] = useState(row.ingredientName || '');
  const [open, setOpen] = useState(false);

  const suggestions = allIngredients.filter(i =>
    i.name.toLowerCase().includes(query.toLowerCase()) && query.length > 0
  ).slice(0, 8);

  const select = (ing) => {
    setQuery(ing.name);
    setOpen(false);
    onChange(index, { ingredientId: ing.id, ingredientName: ing.name, unit: ing.baseUnit });
  };

  const handleQueryChange = (val) => {
    setQuery(val);
    setOpen(true);
    if (!val) onChange(index, { ingredientId: null, ingredientName: '', unit: '' });
  };

  return (
    <div className="ingredient-row">
      <div className="ingredient-autocomplete">
        <input
          className="form-input"
          placeholder="Ingrediente..."
          value={query}
          onChange={e => handleQueryChange(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
        />
        {open && suggestions.length > 0 && (
          <div className="autocomplete-dropdown">
            {suggestions.map(ing => (
              <div key={ing.id} className="autocomplete-item" onMouseDown={() => select(ing)}>
                <span>{ing.name}</span>
                <span className="autocomplete-item-unit">{ing.baseUnit}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <input
        className="form-input ingredient-qty-input"
        type="number" min="0" step="0.5"
        placeholder="Cant."
        value={row.quantity}
        onChange={e => onChange(index, { quantity: e.target.value })}
      />
      <input
        className="form-input ingredient-unit-input"
        placeholder="Unidad"
        value={row.unit}
        onChange={e => onChange(index, { unit: e.target.value })}
      />
      <button className="btn btn-danger btn-icon btn-sm" onClick={() => onRemove(index)}>✕</button>
    </div>
  );
}

export default function RecipeModal({ recipe, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: recipe?.name || '',
    description: recipe?.description || '',
    prepTime: recipe?.prepTime || '',
    servings: recipe?.servings || 2,
  });
  const [rows, setRows] = useState(
    recipe?.ingredients?.map(i => ({
      ingredientId: i.ingredientId,
      ingredientName: i.ingredient.name,
      quantity: i.quantity,
      unit: i.unit
    })) || []
  );
  const [allIngredients, setAllIngredients] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getIngredients().then(setAllIngredients);
  }, []);

  const updateRow = (index, patch) => {
    setRows(prev => prev.map((r, i) => i === index ? { ...r, ...patch } : r));
  };
  const removeRow = (index) => setRows(prev => prev.filter((_, i) => i !== index));
  const addRow = () => setRows(prev => [...prev, { ingredientId: null, ingredientName: '', quantity: '', unit: '' }]);

  const handleSave = async () => {
    if (!form.name.trim()) return alert('El nombre es obligatorio');
    setSaving(true);
    try {
      const validRows = rows.filter(r => r.ingredientId && r.quantity);
      const data = { ...form, ingredients: validRows };
      const saved = recipe?.id
        ? await updateRecipe(recipe.id, data)
        : await createRecipe(data);
      onSaved(saved);
      onClose();
    } catch (e) {
      alert('Error al guardar la receta');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{recipe ? 'Editar Receta' : '✨ Nueva Receta'}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Nombre *</label>
            <input className="form-input" placeholder="Ej: Pasta carbonara"
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>

          <div className="form-group">
            <label className="form-label">Descripción</label>
            <textarea className="form-textarea" placeholder="Breve descripción de la receta..."
              value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>

          <div className="flex gap-3">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">⏱ Tiempo prep. (min)</label>
              <input className="form-input" type="number" placeholder="30"
                value={form.prepTime} onChange={e => setForm(f => ({ ...f, prepTime: e.target.value }))} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">👤 Personas</label>
              <input className="form-input" type="number" min="1" placeholder="2"
                value={form.servings} onChange={e => setForm(f => ({ ...f, servings: e.target.value }))} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">🥘 Ingredientes</label>
            <div className="ingredients-builder">
              <div className="ingredient-row" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, padding: '0 0 4px' }}>
                <span>Ingrediente</span><span>Cantidad</span><span>Unidad</span><span />
              </div>
              {rows.map((row, i) => (
                <IngredientRow
                  key={i} row={row} index={i}
                  allIngredients={allIngredients}
                  onChange={updateRow} onRemove={removeRow}
                />
              ))}
              <button className="btn btn-ghost btn-sm" onClick={addRow} style={{ alignSelf: 'flex-start' }}>
                + Añadir ingrediente
              </button>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? '⏳ Guardando...' : recipe ? '💾 Actualizar' : '✨ Crear Receta'}
          </button>
        </div>
      </div>
    </div>
  );
}
