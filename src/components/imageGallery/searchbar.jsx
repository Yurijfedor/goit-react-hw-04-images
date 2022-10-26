import PropTypes from 'prop-types';

import { Header, Form, FormButton, Input } from './imageGallery.styled';

export const Searchbar = ({ onSubmit }) => {
  const getQueryValue = evt => {
    evt.preventDefault();
    const value = evt.target.query.value;
    onSubmit(value);
    evt.target.reset();
  };

  return (
    <Header>
      <Form onSubmit={getQueryValue}>
        <FormButton type="submit"></FormButton>

        <Input
          type="text"
          name="query"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
        />
      </Form>
    </Header>
  );
};

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
