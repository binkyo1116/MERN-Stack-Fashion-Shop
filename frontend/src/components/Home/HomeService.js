import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';
import { ReactComponent as DeliveryIcon } from '../../assets/icons/delivery-man.svg';
import { ReactComponent as ExchangeIcon } from '../../assets/icons/exchange.svg';
import { ReactComponent as ServiceIcon } from '../../assets/icons/customer-service.svg';

const content = [
  {
    Icon: DeliveryIcon,
    title: 'Free Delivery',
    subtitle: 'Free Shipping World Wide',
  },
  {
    Icon: ExchangeIcon,
    title: 'Exchange Available',
    subtitle: 'New online special festival offer',
  },
  {
    Icon: ServiceIcon,
    title: 'Customer Support',
    subtitle: 'Online service for new customer',
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '60px 0 0',
    padding: '50px 0',
    backgroundColor: '#FFF',
    justifyContent: 'center',
  },
  card: {
    minWidth: 275,
    textAlign: 'center',
    border: 'none',
    backgroundColor: '#FFF',
  },
  topIcon: {
    width: 56,
    height: 56,
    marginBottom: 10,
    '& path': {
      fill: theme.palette.secondary.main,
    },
  },
}));

const HomeService = () => {
  const classes = useStyles();
  return (
    <Grid container className={classes.root}>
      {content.map((item, index) => {
        const { Icon } = item;
        return (
          <Grid item md={3} key={index + 1}>
            <Card className={classes.card} variant='outlined'>
              <CardContent>
                <Icon className={classes.topIcon} />
                <Typography variant='h6' component='h2' gutterBottom noWrap>
                  {item.title}
                </Typography>
                <Typography
                  variant='body2'
                  component='p'
                  color='textSecondary'
                  gutterBottom
                  noWrap
                  style={{ textTransform: 'capitalize' }}
                >
                  {item.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default HomeService;
