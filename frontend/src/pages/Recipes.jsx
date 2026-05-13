import { useState, useEffect } from 'react';
import { getRecipes, deleteRecipe } from '../api/recipes';
import RecipeModal from '../components/RecipeModal';

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'new' | recipe object
  const [toast, setToast] = useState('');

  const load = () => getRecipes().then(r => { setRecipes(r); setLoading(false); });
  useEffect(() => { load(); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleDelete = async (recipe) => {
    if (!confirm(`¿Eliminar "${recipe.name}"?`)) return;
    await deleteRecipe(recipe.id);
    setRecipes(prev => prev.filter(r => r.id !== recipe.id));
    showToast('🗑️ Receta eliminada');
  };

  const handleSaved = (saved) => {
    load();
    setModal(null);
    showToast('✅ Receta guardada');
  };

  if (loading) return <div className="page"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-title">📖 Mis Recetas</div>
          <div className="page-subtitle">{recipes.length} recetas guardadas</div>
        </div>
        <button className="btn btn-primary" onClick={() => setModal('new')}>
          + Nueva Receta
        </button>
      </div>

      {recipes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🍳</div>
          <h3>Aún no tienes recetas</h3>
          <p>Crea tu primera receta y empieza a planificar</p>
          <button className="btn btn-primary" onClick={() => setModal('new')}>
            + Crear primera receta
          </button>
        </div>
      ) : (
        <div className="recipes-grid">
          {recipes.map(recipe => (
            <div key={recipe.id} className="recipe-full-card">
              <div className="recipe-full-card-header">
                <div className="recipe-full-card-title">{recipe.name}</div>
                <div className="recipe-full-card-actions">
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setModal(recipe)} title="Editar">✏️</button>
                  <button className="btn btn-danger btn-icon btn-sm" onClick={() => handleDelete(recipe)} title="Eliminar">🗑️</button>
                </div>
              </div>

              {recipe.description && (
                <p className="recipe-description">{recipe.description}</p>
              )}

              <div className="recipe-stats">
                {recipe.prepTime && <span className="recipe-stat">⏱ {recipe.prepTime} min</span>}
                <span className="recipe-stat">👤 {recipe.servings} personas</span>
                <span className="recipe-stat">🥘 {recipe.ingredients.length} ingredientes</span>
              </div>

              {recipe.ingredients.length > 0 && (
                <div className="ingredients-list">
                  {recipe.ingredients.slice(0, 4).map(ri => (
                    <div key={ri.ingredientId} className="ingredient-item">
                      <span className="ingredient-item-name">{ri.ingredient.name}</span>
                      <span className="ingredient-item-qty">{ri.quantity} {ri.unit}</span>
                    </div>
                  ))}
                  {recipe.ingredients.length > 4 && (
                    <div className="text-muted" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                      +{recipe.ingredients.length - 4} más...
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {modal && (
        <RecipeModal
          recipe={modal === 'new' ? undefined : modal}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
