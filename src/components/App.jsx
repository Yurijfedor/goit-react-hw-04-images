import { useState, useEffect } from 'react';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Searchbar } from './imageGallery/searchbar';
import { ImageGallery } from './imageGallery/imageGallery';
import { Button } from './imageGallery/button';
import { Loader } from './imageGallery/loader';
import { Modal } from './imageGallery/modal';
import { fetchPictures } from './services/pixabayApiService';
import { Box } from 'constans';

export const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [largeImageUrl, setLargeImageUrl] = useState('');
  const [items, setItems] = useState([]);
  const [isLoader, setIsloader] = useState(false);
  const [totalImages, setTotalImages] = useState(1);
  const [alt, setAlt] = useState('');

  useEffect(() => {
    if (!query) {
      return;
    }
    fetchPictures(query, page)
      .then(response => {
        if (response.data.hits.length === 0) {
          toglleLoader();
          return Notify.failure(
            `Sorry, we couldn't find anything else! Try another query!`
          );
        }
        toglleLoader();
        const collectionOfImages = response.data.hits;
        setItems(prevState => [...prevState, ...collectionOfImages]);
        setTotalImages(response.data.total);
      })
      .finally(toglleLoader());
  }, [query, page]);

  const handleSubmit = value => {
    clearGallery();
    value.trim() !== ''
      ? setQuery(value.toLowerCase())
      : Notify.failure('Please, enter your query!');
  };

  const toglleLoader = () => {
    setIsloader(prevState => (prevState ? false : true));
  };

  const clearGallery = () => {
    setShowModal(false);
    setQuery('');
    setPage(1);
    setLargeImageUrl('');
    setItems([]);
    setIsloader(false);
    setTotalImages(1);
    setAlt('');
  };

  const loadMore = () => {
    query && setPage(prevState => prevState + 1);
  };

  const changeLargeImage = (url, alt) => {
    setLargeImageUrl(url);
    setAlt(alt);
    toggleModal();
  };

  const toggleModal = () => {
    setShowModal(prevState => !prevState);
  };

  return (
    <Box display={'grid'} gridTemplateColumns={'1fr'} gridGap={4} pb={4}>
      {showModal && (
        <Modal onClose={toggleModal} largeImageUrl={largeImageUrl} alt={alt} />
      )}
      <Searchbar onSubmit={handleSubmit} />

      <ImageGallery images={items} onClick={changeLargeImage} />
      {isLoader && <Loader />}
      {items.length !== totalImages && items.length !== 0 && (
        <Button onClick={loadMore} />
      )}
    </Box>
  );
};
