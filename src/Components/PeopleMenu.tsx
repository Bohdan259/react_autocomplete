import React, { useCallback } from 'react';
import { Person } from '../types/Person';
import classNames from 'classnames';

type Props = {
  people: Person[];
  query: string;
  isOpen: boolean;
  setFocused: (focuse: boolean) => void;
  setIsOpen: (isOpen: boolean) => void;
  setQuery: (query: string) => void;
  setSelected: (person: Person | null) => void;
  applyQuery: (setquery: string) => void;
};

const PeopleMenuComponent: React.FC<Props> = ({
  people,
  query,
  isOpen,
  setIsOpen,
  setQuery,
  setFocused,
  setSelected,
  applyQuery,
}) => {
  const handleInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      applyQuery(event.target.value);
      setSelected(null);
      setIsOpen(true);
    },
    [setQuery, applyQuery, setSelected, setIsOpen],
  );

  const handleClickInput = useCallback(
    (person: Person) => {
      setSelected(person);
      setQuery(person.name);
      setIsOpen(false);
    },
    [setSelected, setQuery, setIsOpen],
  );

  return (
    <div className={classNames('dropdown', { 'is-active': isOpen })}>
      <div className="dropdown-trigger">
        <input
          value={query}
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          onChange={handleInput}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {people.map(person => (
            <a
              key={person.name}
              className="dropdown-item"
              data-cy="suggestion-item"
              onMouseDown={e => e.preventDefault()}
              onClick={() => handleClickInput(person)}
            >
              <p className="has-text-link">{person.name}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

PeopleMenuComponent.displayName = 'PeopleMenu';

export const PeopleMenu = React.memo(PeopleMenuComponent);
