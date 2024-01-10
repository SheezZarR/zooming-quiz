import React from 'react'
import './styles.css'

function Result({brandCorrect, natureCorrect}){
    return (
        <div className='result-container'>
            <div className='emoji'> 🎊 </div>
            <div className='result-text'> Вы угадали {brandCorrect}/15 вопросов про бренды и {natureCorrect}/15 вопросов про природу</div>
        </div>
    )
}

export default Result