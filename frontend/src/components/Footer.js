import React from 'react';
import { Container, IconButton, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import { makeStyles } from '@material-ui/core/styles';
import { VscTwitter } from 'react-icons/vsc';
import { ImGooglePlus } from 'react-icons/im';
import { RiRssFill, RiLinkedinFill, RiFacebookFill } from 'react-icons/ri';

const useStyles = makeStyles((theme) => ({
  root: {
    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: '100%',
    paddingTop: 16,
    paddingBottom: 16,
    // '@media (max-width: 600px)': {
    //   paddingBottom: 16 + 56, // + height of BottomNavigation
    // },
  },
  box: {
    ...theme.mixins.customize.flexMixin('space-between', 'center'),
    color: '#929292',
    '@media (max-width: 960px)': {
      textAlign: 'center',
      flexDirection: 'column',
      '& $copyright': {
        padding: '10px 0 0',
      },
    },
  },
  logoWrapper: {
    ...theme.mixins.customize.centerFlex(),
  },
  logo: {
    maxWidth: 140,
  },
  copyright: {
    flexGrow: 1,
    paddingLeft: 100,
  },
  socialGroup: {
    ...theme.mixins.customize.flexMixin('center', 'center'),
  },
  icon: {
    fontSize: 18,
    margin: '0 10px',
    color: '#929292',
    transition: 'transform .3s',
    '&:hover': {
      transform: 'translateY(-1px)',
      color: theme.palette.secondary.main,
    },
  },
}));

const Footer = () => {
  const classes = useStyles();
  return (
    <footer>
      <Container className={classes.root}>
        <div className={classes.box}>
          <Link to='/' className={classes.logoWrapper}>
            <img src={logo} alt='logo' className={classes.logo} />
          </Link>
          <Typography
            variant='body2'
            component='p'
            className={classes.copyright}
          >
            Copyright &copy; 2021 Fashion Shop. All Right Reserved.
          </Typography>
          <div className={classes.socialGroup}>
            <IconButton className={classes.icon}>
              <RiFacebookFill />
            </IconButton>
            <IconButton className={classes.icon}>
              <VscTwitter />
            </IconButton>
            <IconButton className={classes.icon}>
              <RiRssFill />
            </IconButton>
            <IconButton className={classes.icon}>
              <ImGooglePlus fontSize={20} />
            </IconButton>
            <IconButton className={classes.icon}>
              <RiLinkedinFill />
            </IconButton>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
