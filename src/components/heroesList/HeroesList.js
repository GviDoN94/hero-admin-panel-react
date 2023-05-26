import { useHttp } from '../../hooks/http.hook';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  heroesFetching,
  heroesFetched,
  heroesFetchingError,
  heroDeleted,
} from '../../actions';
import HeroesListItem from '../heroesListItem/HeroesListItem';
import Spinner from '../spinner/Spinner';

const HeroesList = () => {
  const { filteredHeroes, heroesLoadingStatus } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { request } = useHttp();

  useEffect(() => {
    dispatch(heroesFetching());
    request('http://localhost:3001/heroes')
      .then((data) => dispatch(heroesFetched(data)))
      .catch(() => dispatch(heroesFetchingError()));
    // eslint-disable-next-line
  }, []);

  const onDelete = useCallback(
    (id) => {
      request(`http://localhost:3001/heroes/${id}`, 'DELETE')
        .then(dispatch(heroDeleted(id)))
        .catch((e) => console.error(e));
    },
    // eslint-disable-next-line
    [request],
  );

  if (heroesLoadingStatus === 'loading') {
    return <Spinner />;
  } else if (heroesLoadingStatus === 'error') {
    return <h5 className="text-center mt-5">Ошибка загрузки</h5>;
  }

  const renderHeroesList = (heroes) => {
    if (heroes.length === 0) {
      return <h5 className="text-center mt-5">Героев пока нет</h5>;
    }

    return heroes.map(({ id, ...props }) => {
      return (
        <HeroesListItem key={id} onDelete={() => onDelete(id)} {...props} />
      );
    });
  };

  return <ul>{renderHeroesList(filteredHeroes)}</ul>;
};

export default HeroesList;
