import React from 'react';
import {
  FacebookShareButton,
  TelegramShareButton,
  TwitterShareButton,
  PinterestShareButton,
  FacebookIcon,
  TwitterIcon,
  PinterestIcon,
  TelegramIcon,
} from 'react-share';

const style = {
  marginRight: 8,
};
const ShareButtons = ({ url, quote, size }) => {
  return (
    <>
      <FacebookShareButton url={url} quote={quote} style={style}>
        <FacebookIcon size={size} round />
      </FacebookShareButton>
      <TelegramShareButton url={url} quote={quote} style={style}>
        <TelegramIcon size={size} round />
      </TelegramShareButton>
      <PinterestShareButton url={url} quote={quote} style={style}>
        <PinterestIcon size={size} round />
      </PinterestShareButton>
      <TwitterShareButton url={url} quote={quote} style={style}>
        <TwitterIcon size={size} round />
      </TwitterShareButton>
    </>
  );
};

ShareButtons.defaultProps = {
  quote: 'Fashion Shop',
  size: 32,
};

export default ShareButtons;
