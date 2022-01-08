import React from 'react'
import { RingLoader } from 'react-spinners';
import { css } from "@emotion/react";

const loaderCss = css
`position: fixed;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);`;

export default function Loader() {
  return <RingLoader css={loaderCss} size={100} />;
}
