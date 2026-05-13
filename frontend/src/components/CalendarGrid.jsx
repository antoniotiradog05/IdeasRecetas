import React from 'react';
import MealSlot from './MealSlot';

const MEAL_TYPES = [
  { key: 'BREAKFAST', label: 'Desayuno', icon: '☀️' },
  { key: 'LUNCH',     label: 'Comida',   icon: '🍽️' },
  { key: 'DINNER',    label: 'Cena',     icon: '🌙' },
];

export default function CalendarGrid({ days, dayLabels, mealPlans, onRemovePlan, isToday }) {
  const getMealPlan = (date, mealType) => {
    const dateStr = date.toISOString().split('T')[0];
    return mealPlans.find(p => p.date === dateStr && p.mealType === mealType) || null;
  };

  return (
    <div className="calendar-grid">
      {/* Header: empty + 7 day labels */}
      <div className="calendar-header-cell" />
      {days.map((day, i) => {
        const isT = isToday(day);
        return (
          <div key={i} className={`calendar-header-cell ${isT ? 'today-col' : ''}`}>
            <div>{dayLabels[i]}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: isT ? 800 : 400, color: isT ? 'var(--primary-light)' : 'var(--text-secondary)' }}>
              {day.getDate()}
            </div>
          </div>
        );
      })}

      {/* Rows: one per meal type */}
      {MEAL_TYPES.map(meal => (
        <React.Fragment key={meal.key}>
          <div className="calendar-row-label">
            <span className="meal-icon">{meal.icon}</span>
            <span style={{ fontSize: '0.7rem' }}>{meal.label}</span>
          </div>
          {days.map((day, i) => {
            const dateStr = day.toISOString().split('T')[0];
            const plan = getMealPlan(day, meal.key);
            return (
              <MealSlot
                key={`${dateStr}-${meal.key}`}
                date={dateStr}
                mealType={meal.key}
                mealPlan={plan}
                onRemove={onRemovePlan}
              />
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}
