import React from 'react';
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
import { IconRefresh, IconMegaphoneLoudFill } from '@salutejs/plasma-icons';
import './styles.css'


export function QuestionWindow (props){
    const {
        totalQuestions,
        totalCorrect,
        question, 
        step, 
        onClickRepeatQuestion,
        onClick, 
        onClickSkip,
        onClickStartGame,
        clickedIndex, 
        isCorrect, 
        isClickable 
    } = props;
    
    const { width, height } = useWindowSize();
    const confettiSource = {
        x: width / 2,
        y: height / 4,
        h: 0,
        w: 0,
    }

    var disabledButton = isClickable? "": " disabled"
    return (
        <>
        <Confetti
            run={isCorrect !== null && isCorrect}
            tweenDuration={200}
            recycle={false}
            gravity={0.2}
            confettiSource={confettiSource}
            onConfettiComplete={(confettiClass) => {
                confettiClass.reset()
            }}
        /> 
        <div className='container question-container'>
            <div className='card-header'>
                <h1 style={{ textAlign: 'left', fontSize: '13px' }}>
                    Вопрос {step + 1}/{totalQuestions}
                </h1>
                <div className='card-header-btns'>
                <button
                    className={`sn-section-item button` + disabledButton} 
                    tabIndex={0}
                    onClick={onClickRepeatQuestion}
                >
                    <IconMegaphoneLoudFill style={{pointerEvents: 'none'}} />
                </button>
                <button
                    className={`sn-section-item button` + disabledButton} 
                    onClick={onClickSkip}
                    tabIndex={0}
                >Пропустить</button>
                <button 
                    className='sn-section-item button'
                    onClick={onClickStartGame}
                    tabIndex={0}
                >
                    <IconRefresh style={{pointerEvents: 'none'}}/>
                </button>
                </div>
            </div>
            <h2>
                {question.title}
            </h2>
            <ul className='answer-list'>
                {question.answers.map((text, index) => (
                    <Button
                        onClick={onClick}
                        id={index}
                        clickedIndex={clickedIndex}
                        text={text}
                        isCorrect={isCorrect}
                        isClickable={isClickable}
                    />
                    
                    )
                )
            }
            </ul>

            <QuestionFooter 
                totalCorrect={totalCorrect}
            />
        </div>

        </>
    );
    
}


function Button({
    onClick,
    id,
    clickedIndex,
    text,
    isCorrect,
    isClickable
}) {
    
    var appendClass = ""

    if (isCorrect !== null && clickedIndex === id){
        appendClass = isCorrect? "correct" : "incorrect"
    }
    
    appendClass += isClickable ? "" : " disabled"

    return (
        <li
            onClick={onClick}
            id={id}
            className={"sn-section-item answer-item " + appendClass}
            disabled={isClickable}
            tabIndex={0}
        > {text}
        </li>
    )

}


function QuestionFooter({totalCorrect}) {

    return (
        <div className='card-footer'>
            <div className='correct-stat flex-left'>ВЕРНО: {totalCorrect}</div>
        </div>
    )
}
export default QuestionWindow
