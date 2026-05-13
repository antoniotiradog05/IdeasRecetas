import { useDroppable } from '@dnd-kit/core';

export default function MealSlot({ date, mealType, mealPlan, onRemove }) {
  const slotId = `${date}|${mealType}`;
  const { setNodeRef, isOver } = useDroppable({ id: slotId });

  return (
    <div
      ref={setNodeRef}
      className={`meal-slot ${isOver ? 'is-over' : ''} ${mealPlan ? 'has-recipe' : ''}`}
    >
      {mealPlan ? (
        <div className="meal-slot-content">
          <div className="meal-slot-recipe-name">{mealPlan.recipe.name}</div>
          <div className="meal-slot-meta">
            {mealPlan.recipe.prepTime && `⏱ ${mealPlan.recipe.prepTime}min`}
          </div>
          <button
            className="meal-slot-remove"
            onClick={() => onRemove(mealPlan.id)}
            title="Quitar"
          >✕</button>
        </div>
      ) : (
        <span className="meal-slot-empty-text">
          {isOver ? '¡Suéltala aquí!' : 'Arrastra una receta'}
        </span>
      )}
    </div>
  );
}
