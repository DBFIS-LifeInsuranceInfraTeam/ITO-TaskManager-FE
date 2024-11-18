import React from 'react'
import constructionlogo from '../styles/images/construction-logo.png';


const Notification: React.FC = () => {
  return (
    <div style={{minHeight:'100vh',
      backgroundColor: '#fff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'}}>
        <img src={constructionlogo} alt="" style={{height: '4em',
    width: '4em',
    alignSelf: 'center'
}}/>
        <span style={{fontSize: 'xlarge',
    fontWeight: 500}}>추후 구현 예정</span>
    </div>
  )
}

export default Notification