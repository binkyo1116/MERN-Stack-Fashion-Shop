import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Slide from '@material-ui/core/Slide';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearSnackbar } from '../actions/snackbarActions';

function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

const SlideTransition = React.forwardRef((props, ref) => (
  <Slide direction='left' {...props} ref={ref} />
));

export default function SnackbarMessage() {
  const dispatch = useDispatch();
  const {
    isOpen,
    message,
    variant,
    link: { hasLink, to, text },
  } = useSelector((state) => state.snackbarState);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    dispatch(clearSnackbar());
  };

  return (
    <Snackbar
      TransitionComponent={SlideTransition}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      open={isOpen}
      autoHideDuration={3500}
      onClose={handleClose}
    >
      <div>
        <Alert onClose={handleClose} severity={variant}>
          {message}{' '}
          {hasLink && (
            <Link color='primary' component={RouterLink} to={to}>
              {text}
            </Link>
          )}
        </Alert>
      </div>
    </Snackbar>
  );
}
