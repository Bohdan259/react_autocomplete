import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { PeopleMenu } from './Components';
import { Person } from './types/Person';

function debounce<T extends unknown[]>(
  callback: (...args: T) => void,
  delay: number,
) {
  let timerId = 0;

  return (...args: T) => {
    window.clearTimeout(timerId);
    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export const App: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [onselected, setOnselected] = useState<Person | null>(null);
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(debounce(setAppliedQuery, 3000), []);

  const filterPeople = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name
        .toLocaleLowerCase()
        .includes(appliedQuery.toLocaleLowerCase()),
    );
  }, [appliedQuery]);

  const visiblePeople = useMemo(() => {
    return isFocused ? filterPeople : [];
  }, [isFocused, filterPeople]);

  const error = isFocused && query && filterPeople.length === 0;

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {onselected
            ? `${onselected.name} (${onselected.born} - ${onselected.died})`
            : `No selected person`}
        </h1>
        <PeopleMenu
          isOpen={isOpen}
          query={query}
          people={visiblePeople}
          setFocused={setIsFocused}
          setQuery={setQuery}
          setSelected={setOnselected}
          setIsOpen={setIsOpen}
          applyQuery={applyQuery}
        />
        {error && (
          <div
            className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start
          "
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )}
      </main>
    </div>
  );
};
