import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { fade, makeStyles } from '@material-ui/core/styles';
import { IconButton, InputBase } from '@material-ui/core';
import { IoSearchOutline } from 'react-icons/io5';
import { addSearchTerm } from '../actions/filterActions';

const useStyles = makeStyles((theme) => ({
  search: {
    position: 'relative',
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 1),
    },
    transition: 'background .3s',
    marginLeft: 0,
    marginBottom: 28,
    marginTop: 18,
    border: '1px solid #DDDDDD',
    borderRadius: 4,
    [theme.breakpoints.up('sm')]: {
      width: 'auto',
    },
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(1),
    },
    overflow: 'hidden',
    margin: (props) => props.role === 'searchDrawer' && '30px 24px',
  },
  searchIcon: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    right: 0,
    padding: theme.spacing(0, 2),
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#A3A2A2',
    zIndex: 1,
  },
  inputRoot: {
    color: 'inherit',
    width: (props) => props.role === 'searchDrawer' && '100%',
  },
  inputInput: {
    padding: '12px 50px 12px 0',
    paddingLeft: 20,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

const SearchBox = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles(props);
  const history = useHistory();
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);
  const { searchTerm } = useSelector((state) => state.filter);

  const handleInputChange = (e) => {
    setKeyword(e.target.value);
    console.log(keyword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keyword) {
      dispatch(addSearchTerm(keyword));
      history.push('/shop');
      props.setOpenSearchDrawer(false);
    }
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 500);

    return () => clearTimeout(timerId);
  }, [keyword]);

  useEffect(() => {
    if (debouncedKeyword) {
      dispatch(addSearchTerm(debouncedKeyword));
    }
  }, [dispatch, debouncedKeyword]);

  useEffect(() => {
    if (!searchTerm) {
      setKeyword('');
    } else {
      setKeyword(searchTerm);
    }
  }, [searchTerm]);

  return (
    <form className={classes.search} onSubmit={handleSubmit}>
      <InputBase
        placeholder='Search…'
        autoFocus={props.role === 'searchDrawer'}
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        value={keyword}
        onChange={handleInputChange}
        inputProps={{ 'aria-label': 'search' }}
      />
      <IconButton type='submit' className={classes.searchIcon}>
        <IoSearchOutline fontSize={20} />
      </IconButton>
    </form>
  );
};

export default SearchBox;
