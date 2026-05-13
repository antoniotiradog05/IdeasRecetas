import { useDraggable } from '@dnd-kit/core';

export default function RecipeCard({ recipe, isDragOverlay = false }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: recipe.id,
    data: { recipe }
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`recipe-card ${isDragging ? 'is-dragging' : ''} ${isDragOverlay ? 'drag-overlay' : ''}`}
    >
      <div className="recipe-card-name">{recipe.name}</div>
      <div className="recipe-card-meta">
        {recipe.prepTime && (
          <span className="recipe-card-tag">⏱ {recipe.prepTime} min</span>
        )}
        <span className="recipe-card-tag">👤 {recipe.servings} pers.</span>
        <span className="recipe-card-tag">🥘 {recipe.ingredients?.length || 0} ing.</span>
      </div>
    </div>
  );
}
