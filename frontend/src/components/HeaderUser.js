import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { ReactComponent as UserIcon } from '../assets/icons/user.svg';
import { makeStyles } from '@material-ui/core/styles';
import { Link as RouterLink } from 'react-router-dom';
import { logout } from '../actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import { FiLogIn } from 'react-icons/fi';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  paper: {
    marginRight: theme.spacing(2),
  },
}));

export default function HeaderUser() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { userInfo } = useSelector((state) => state.userLogin);
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  return (
    <div className={classes.root}>
      <div>
        {userInfo ? (
          <>
            <IconButton ref={anchorRef} onClick={handleToggle}>
              <UserIcon height={22} />
            </IconButton>
            <Popper
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === 'bottom' ? 'center top' : 'center bottom',
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList
                        autoFocusItem={open}
                        id='menu-list-grow'
                        onKeyDown={handleListKeyDown}
                      >
                        <MenuItem component={RouterLink} to='/profile' divider>
                          {userInfo.name ? userInfo.name : 'Profile'}
                        </MenuItem>
                        {userInfo.isAdmin && [
                          <MenuItem
                            component={RouterLink}
                            to='/admin/userlist'
                            key={1}
                          >
                            Manage Users
                          </MenuItem>,
                          <MenuItem
                            component={RouterLink}
                            to='/admin/productlist'
                            key={2}
                          >
                            Manage Products
                          </MenuItem>,
                          <MenuItem
                            component={RouterLink}
                            to='/admin/orderlist'
                            divider
                            key={3}
                          >
                            Manage Orders
                          </MenuItem>,
                        ]}
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </>
        ) : (
          <IconButton component={RouterLink} to='/login'>
            <FiLogIn height={22} color='#444' />
          </IconButton>
        )}
      </div>
    </div>
  );
}
