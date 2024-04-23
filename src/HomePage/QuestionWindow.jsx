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
        x: 0,
        y: 0,
        h: 0,
        w: width,
    }

    var disabledButton = isClickable? "": " disabled"
    return (
        <>
        <Confetti
            style={{display: (isCorrect !== null && isCorrect)? "block" : "none" }}
            run={isCorrect !== null && isCorrect}
            tweenDuration={100}
            recycle={false}
            gravity={0.5}
            confettiSource={confettiSource}
            onConfettiComplete={(confettiClass) => {
                confettiClass.reset()
            }}
        /> 
        <div className='container question-container'>
            <div className='card-header'>
                <h1 className='card-header-title'>
                    Вопрос {step + 1}/{totalQuestions}
                </h1>
                <div className='card-header-btns'>
                <button
                    className={`sn-section-item button` + disabledButton} 
                    tabIndex={-1}
                    onClick={onClickRepeatQuestion}
                >
                    <IconMegaphoneLoudFill style={{pointerEvents: 'none'}} />
                </button>
                <button
                    className={`sn-section-item button` + disabledButton} 
                    onClick={onClickSkip}
                    tabIndex={-1}
                >Пропустить</button>
                <button 
                    className={'sn-section-item button' + disabledButton}
                    onClick={onClickStartGame}
                    tabIndex={-1}
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
            tabIndex={-1}
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
