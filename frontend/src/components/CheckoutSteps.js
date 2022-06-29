import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  stepper: {
    backgroundColor: theme.palette.background.default,
    padding: 0,
    '& .MuiStepIcon-completed, .MuiStepIcon-active': {
      color: theme.palette.secondary.main,
    },
  },
}));

function getSteps() {
  return ['Sign In', 'Shipping Address', 'Payment Method', 'Place Order'];
}

export default function CheckoutSteps({ step }) {
  const classes = useStyles();
  const steps = getSteps();

  return (
    <div className={classes.root}>
      <Stepper activeStep={step} alternativeLabel className={classes.stepper}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}
