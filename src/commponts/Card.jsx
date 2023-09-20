import React from 'react'
import { memo } from 'react';

const styles = {
  content: {
    borderRadius: '10px',
    boxShadow: '0 0 10px black'
  }
}

const Card = (props) => {
  /**
   * 传参
   */
  const {
    id = 'CartID',
    width = '100px',
    height = '100px',
    children,
    ...res
  } = props
  return (
    <div id={id} style={{
      width: width,
      height: height,
      ...styles.content,
      ...res
    }}>
      {children}
    </div>
  )
}

export default memo(Card) 