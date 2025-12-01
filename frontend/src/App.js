import React, { useMemo, useState, useEffect } from 'react';
import './App.css';
import './index.css';
import { recipes as allRecipes } from './data/recipes';
import { getTheme } from './theme';

// PUBLIC_INTERFACE
export function getApiBase() {
  /** Returns the configured API base URL from environment variables, or null if unset. */
  return process.env.REACT_APP_API_BASE || null;
}

/**
 * Simple client-side "router" using window.location.hash so we don't add new dependencies.
 * Routes:
 *   #/           -> recipe list
 *   #/recipe/ID  -> recipe detail
 */
function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash || '#/');

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash || '#/');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const route = useMemo(() => {
    const cleaned = hash.replace(/^#/, '') || '/';
    const parts = cleaned.split('/').filter(Boolean);

    if (parts[0] === 'recipe' && parts[1]) {
      return { path: '/recipe/:id', params: { id: parts[1] } };
    }
    return { path: '/', params: {} };
  }, [hash]);

  return route;
}

const CATEGORIES = [
  'All',
  'Breakfast',
  'Lunch',
  'Dinner',
  'Dessert',
  'Vegan',
  'Quick & Easy',
];

function Header({ searchQuery, onSearchChange }) {
  const theme = getTheme();
  return (
    <header className="app-header" style={{ background: theme.headerGradient }}>
      <div className="app-header-inner">
        <div className="app-brand">
          <div className="app-logo-circle" aria-hidden="true">
            <span className="app-logo-letter">R</span>
          </div>
          <div className="app-brand-text">
            <h1 className="app-title">Ocean Recipes</h1>
            <p className="app-subtitle">Browse, search, and explore delicious dishes</p>
          </div>
        </div>
        <div className="app-header-right">
          <div className="app-search-wrapper">
            <label htmlFor="recipe-search" className="sr-only">
              Search recipes
            </label>
            <input
              id="recipe-search"
              data-testid="search-input"
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search recipes by name or tag..."
              className="app-search-input"
              aria-label="Search recipes"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

function Sidebar({ activeCategory, onCategoryChange }) {
  return (
    <aside className="app-sidebar" aria-label="Recipe categories">
      <h2 className="sidebar-title">Categories</h2>
      <nav className="sidebar-nav">
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              type="button"
              data-testid={`category-${category}`}
              className={`sidebar-chip ${isActive ? 'sidebar-chip-active' : ''}`}
              onClick={() => onCategoryChange(category)}
            >
              <span className="sidebar-chip-dot" aria-hidden="true" />
              <span>{category}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

function RecipeCard({ recipe }) {
  const handleClick = () => {
    window.location.hash = `#/recipe/${recipe.id}`;
  };

  return (
    <article
      className="recipe-card"
      data-testid={`recipe-card-${recipe.id}`}
    >
      <button
        type="button"
        className="recipe-card-button"
        onClick={handleClick}
        aria-label={`View details for ${recipe.title}`}
      >
        <div className="recipe-card-image-wrapper">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="recipe-card-image"
          />
          <span className="recipe-card-badge">
            {recipe.cookTime} min
          </span>
        </div>
        <div className="recipe-card-body">
          <h3 className="recipe-card-title">{recipe.title}</h3>
          <p className="recipe-card-category">{recipe.category}</p>
          <p className="recipe-card-description">{recipe.description}</p>
          <div className="recipe-card-tags">
            {recipe.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="recipe-card-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </button>
    </article>
  );
}

function EmptyState({ title, message, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon" aria-hidden="true">
        🍽️
      </div>
      <h2 className="empty-state-title">{title}</h2>
      <p className="empty-state-message">{message}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          className="empty-state-button"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

function LoadingState({ label = 'Loading recipes…' }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <div className="loading-spinner" aria-hidden="true" />
      <p className="loading-label">{label}</p>
    </div>
  );
}

function RecipeList({ recipes, loading }) {
  if (loading) {
    return <LoadingState />;
  }

  if (!recipes.length) {
    return (
      <EmptyState
        title="No recipes found"
        message="Try adjusting your search term or choosing a different category."
        actionLabel="Clear filters"
        onAction={() => {
          window.location.hash = '#/';
          window.location.reload();
        }}
      />
    );
  }

  return (
    <section aria-label="Recipe results" className="recipe-list">
      <div className="recipe-list-header">
        <h2 className="recipe-list-title">Results</h2>
        <p className="recipe-list-count">
          {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
        </p>
      </div>
      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </section>
  );
}

function RecipeDetail({ recipeId }) {
  const recipe = allRecipes.find((r) => String(r.id) === String(recipeId));

  if (!recipe) {
    return (
      <EmptyState
        title="Recipe not found"
        message="We couldn&apos;t find that recipe. It may have been removed or the link is incorrect."
        actionLabel="Back to recipes"
        onAction={() => {
          window.location.hash = '#/';
        }}
      />
    );
  }

  return (
    <article className="recipe-detail">
      <header className="recipe-detail-header">
        <button
          type="button"
          className="back-button"
          onClick={() => {
            window.location.hash = '#/';
          }}
        >
          ← Back to all recipes
        </button>
        <h1
          className="recipe-detail-title"
          data-testid="recipe-detail-title"
        >
          {recipe.title}
        </h1>
        <p className="recipe-detail-meta">
          <span>{recipe.category}</span>
          <span>•</span>
          <span>{recipe.cookTime} min</span>
        </p>
      </header>

      <div className="recipe-detail-hero">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="recipe-detail-image"
        />
        <div className="recipe-detail-overlay">
          <p className="recipe-detail-description">{recipe.description}</p>
          <div className="recipe-detail-tags">
            {recipe.tags.map((tag) => (
              <span key={tag} className="recipe-detail-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="recipe-detail-content">
        <section aria-label="Ingredients" className="recipe-detail-section">
          <h2 className="recipe-detail-section-title">Ingredients</h2>
          <ul className="ingredients-list">
            {recipe.ingredients.map((item) => (
              <li key={item} className="ingredients-item">
                <span className="ingredients-bullet" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-label="Preparation steps" className="recipe-detail-section">
          <h2 className="recipe-detail-section-title">Steps</h2>
          <ol className="steps-list">
            {recipe.steps.map((step, index) => (
              <li key={step} className="steps-item">
                <span className="steps-number">{index + 1}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </article>
  );
}

// PUBLIC_INTERFACE
function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  const route = useHashRoute();

  // Simple client-side debounce
  useEffect(() => {
    setLoading(true);
    const id = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim().toLowerCase());
      setLoading(false);
    }, 250);
    return () => clearTimeout(id);
  }, [searchQuery]);

  const filteredRecipes = useMemo(() => {
    let data = allRecipes;

    if (category !== 'All') {
      data = data.filter((recipe) => recipe.category === category);
    }

    if (debouncedQuery) {
      data = data.filter((recipe) => {
        const inTitle = recipe.title.toLowerCase().includes(debouncedQuery);
        const inTags = recipe.tags.some((tag) =>
          tag.toLowerCase().includes(debouncedQuery)
        );
        return inTitle || inTags;
      });
    }

    return data;
  }, [category, debouncedQuery]);

  const theme = getTheme();

  return (
    <div className="app-root" style={{ backgroundColor: theme.background }}>
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <div className="app-body">
        <Sidebar activeCategory={category} onCategoryChange={setCategory} />
        <main className="app-main">
          {route.path === '/recipe/:id' ? (
            <RecipeDetail recipeId={route.params.id} />
          ) : (
            <RecipeList recipes={filteredRecipes} loading={loading} />
          )}
        </main>
      </div>
      <footer className="app-footer">
        <p>
          API base:{' '}
          <code>
            {getApiBase() || 'not configured (using local placeholder data)'}
          </code>
        </p>
      </footer>
    </div>
  );
}

export default App;
