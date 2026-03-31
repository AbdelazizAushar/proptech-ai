'use client';

/**
 * EmptyState — رسالة احترافية عند غياب البيانات
 * قابلة للتخصيص بالأيقونة والعنوان والوصف والإجراء.
 */

import React from 'react';
import './EmptyState.css';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state" role="status" aria-live="polite">
      {icon && (
        <div className="empty-state__icon" aria-hidden="true">
          {icon}
        </div>
      )}
      <h3 className="empty-state__title">{title}</h3>
      {description && (
        <p className="empty-state__desc">{description}</p>
      )}
      {action && (
        <button
          type="button"
          className="btn btn-primary empty-state__btn"
          onClick={action.onClick}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
