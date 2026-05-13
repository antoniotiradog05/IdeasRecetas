import { useState } from 'react';
import RecipeCard from './RecipeCard';

export default function RecipePanel({ recipes, onNewRecipe }) {
  const [search, setSearch] = useState('');

  const filtered = recipes.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="recipe-panel">
      <div className="recipe-panel-header">
        <h3>📖 Mis Recetas</h3>
        <div className="recipe-panel-search mt-2">
          <input
            className="form-input"
            placeholder="Buscar receta..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ fontSize: '0.8rem', padding: '7px 12px' }}
          />
        </div>
      </div>

      <div className="recipe-panel-list">
        {filtered.length === 0 ? (
          <div className="empty-state" style={{ padding: '30px 10px' }}>
            <div className="empty-state-icon">🍽️</div>
            <p style={{ fontSize: '0.8rem' }}>
              {search ? 'Sin resultados' : 'Crea tu primera receta'}
            </p>
          </div>
        ) : (
          filtered.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))
        )}
      </div>

      <div style={{ padding: '12px', borderTop: '1px solid var(--border)' }}>
        <button className="btn btn-primary w-full" onClick={onNewRecipe} style={{ justifyContent: 'center' }}>
          + Nueva Receta
        </button>
      </div>
    </div>
  );
}
