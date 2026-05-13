import { useState, useEffect, useCallback } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useWeek } from '../hooks/useWeek';
import { getRecipes } from '../api/recipes';
import { getMealPlans, addMealPlan, removeMealPlan, autoPlanWeek } from '../api/mealplans';
import CalendarGrid from '../components/CalendarGrid';
import RecipePanel from '../components/RecipePanel';
import RecipeCard from '../components/RecipeCard';
import RecipeModal from '../components/RecipeModal';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { weekStart, weekEnd, days, dayLabels, goNext, goPrev, goToday, formatRange, isToday } = useWeek();
  const [recipes, setRecipes] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);
  const [activeRecipe, setActiveRecipe] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [autoPlanning, setAutoPlanning] = useState(false);
  const [showAutoMenu, setShowAutoMenu] = useState(false);
  const [autoMeals, setAutoMeals] = useState({ BREAKFAST: false, LUNCH: true, DINNER: true });
  const [toast, setToast] = useState('');
  const navigate = useNavigate();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const loadRecipes = useCallback(() => getRecipes().then(setRecipes), []);
  const loadPlans = useCallback(() => getMealPlans(weekStart, weekEnd).then(setMealPlans), [weekStart, weekEnd]);

  useEffect(() => { loadRecipes(); }, [loadRecipes]);
  useEffect(() => { loadPlans(); }, [loadPlans]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleDragStart = (event) => {
    const recipe = recipes.find(r => r.id === event.active.id);
    setActiveRecipe(recipe || null);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveRecipe(null);
    if (!over) return;
    const [date, mealType] = over.id.split('|');
    try {
      const plan = await addMealPlan({ recipeId: active.id, date, mealType });
      setMealPlans(prev => {
        const filtered = prev.filter(p => !(p.date === date && p.mealType === mealType));
        return [...filtered, plan];
      });
      showToast(`✅ ${activeRecipe?.name || 'Receta'} añadida`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemovePlan = async (id) => {
    await removeMealPlan(id);
    setMealPlans(prev => prev.filter(p => p.id !== id));
    showToast('🗑️ Receta eliminada del calendario');
  };

  const handleAutoPlan = async () => {
    const selectedTypes = Object.entries(autoMeals)
      .filter(([, v]) => v).map(([k]) => k);
    if (selectedTypes.length === 0) return showToast('⚠️ Selecciona al menos un tipo de comida');
    
    setAutoPlanning(true);
    setShowAutoMenu(false);
    try {
      // Pass the object format expected by the current api/mealplans.js
      await autoPlanWeek({
        startDate: weekStart,
        endDate: weekEnd,
        meals: autoMeals
      });
      // Re-load plans from localStore to update UI
      const updatedPlans = await getMealPlans(weekStart, weekEnd);
      setMealPlans(updatedPlans);
      showToast('✨ Plan de la semana generado');
    } catch (e) {
      console.error(e);
      showToast('❌ Error al planificar');
    } finally {
      setAutoPlanning(false);
    }
  };

  const handleRecipeSaved = () => {
    loadRecipes();
    setShowModal(false);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-title">📅 Planificador Semanal</div>
          <div className="page-subtitle">Arrastra recetas al calendario</div>
        </div>
        <div className="dashboard-actions">
          {/* Auto-plan button with dropdown */}
          <div style={{ position: 'relative', flex: '1' }}>
            <button
              className="btn btn-primary w-full"
              onClick={() => setShowAutoMenu(v => !v)}
              disabled={autoPlanning}
              style={{ 
                background: 'linear-gradient(135deg,#4F6EF7,#22D3A5)', 
                boxShadow: '0 4px 20px rgba(79,110,247,0.3)',
                justifyContent: 'center'
              }}
            >
              {autoPlanning ? '⏳...' : '✨ Auto-planificar'}
            </button>
            {showAutoMenu && (
              <div className="auto-plan-menu">
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Incluir en el plan</div>
                {[['BREAKFAST','☀️ Desayuno'],['LUNCH','🍽️ Comida'],['DINNER','🌙 Cena']].map(([key, label]) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', cursor: 'pointer', borderBottom: '1px solid var(--border)', fontSize: '0.88rem' }}>
                    <input type="checkbox" className="custom-checkbox" checked={!!autoMeals[key]}
                      onChange={e => setAutoMeals(m => ({ ...m, [key]: e.target.checked }))} />
                    {label}
                  </label>
                ))}
                <button className="btn btn-accent w-full" style={{ marginTop: 12, justifyContent: 'center' }} onClick={handleAutoPlan}>
                  🎲 ¡Planificar!
                </button>
              </div>
            )}
          </div>
          
          <button
            className="btn btn-ghost"
            style={{ flex: '1', justifyContent: 'center' }}
            onClick={async () => {
              if (window.confirm('¿Seguro que quieres borrar todo el plan de esta semana?')) {
                for (const p of mealPlans) await removeMealPlan(p.id);
                setMealPlans([]);
                showToast('🧹 Plan borrado');
              }
            }}
          >
            🗑️ Limpiar
          </button>
          
          <button 
            className="btn btn-accent" 
            style={{ flex: '1', justifyContent: 'center' }}
            onClick={() => navigate('/shopping')}
          >
            🛒 Lista
          </button>
        </div>
      </div>

      {/* Week navigation */}
      <div className="calendar-nav" style={{ marginBottom: 16 }}>
        <button className="btn btn-ghost btn-sm" onClick={goPrev}>← Anterior</button>
        <button className="btn btn-ghost btn-sm" onClick={goToday}>Hoy</button>
        <span className="calendar-nav-title">
          Semana del <span className="week-range">{formatRange()}</span>
        </span>
        <button className="btn btn-ghost btn-sm" onClick={goNext}>Siguiente →</button>
      </div>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="calendar-wrapper">
          <div className="calendar-section">
            <CalendarGrid
              days={days}
              dayLabels={dayLabels}
              mealPlans={mealPlans}
              onRemovePlan={handleRemovePlan}
              isToday={isToday}
            />
            <div className="generate-btn-wrap">
              <button className="generate-btn" onClick={() => navigate('/shopping')}>
                🛒 Generar Lista de la Compra
              </button>
            </div>
          </div>

          <RecipePanel
            recipes={recipes}
            onNewRecipe={() => setShowModal(true)}
          />
        </div>

        <DragOverlay>
          {activeRecipe && <RecipeCard recipe={activeRecipe} isDragOverlay />}
        </DragOverlay>
      </DndContext>

      {showModal && (
        <RecipeModal
          onClose={() => setShowModal(false)}
          onSaved={handleRecipeSaved}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
