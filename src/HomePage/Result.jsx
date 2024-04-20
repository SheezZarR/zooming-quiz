import React from 'react'
import questions from '../consts'
import './styles.css'

function Result({brandCorrect, natureCorrect, onClickStartGame}){
    const brandTotal = questions.reduce(
        (counter, question) => question.type === 'brand'? counter + 1: counter,
        0
    );
    const natureTotal = questions.reduce(
        (counter, question) => question.type === 'nature'? counter + 1: counter,
        0
    );

    return (
        <div className='container'>
            <div className='emoji'> 🎊 </div>
            <div className='results-inner'>
                <h1>Результаты</h1>
                <ul>
                    <li>Бренды: {brandCorrect}/{brandTotal} вопросов </li>
                    <li>Природа: {natureCorrect}/{natureTotal} вопросов </li>
                </ul>
            </div>
            <div className='card-footer'>
                <div></div>
                <button 
                    style={{fontSize: 1 + 'rem', borderRadius: 5 + 'px'}} 
                    className='sn-section-item button skip-button'
                    onClick={onClickStartGame}>Начать сначала</button>
            </div>
        </div>
    )
}

export default Result
