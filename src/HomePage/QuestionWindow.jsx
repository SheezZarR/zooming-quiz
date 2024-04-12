import React from 'react';
import Confetti from 'react-confetti'
import './styles.css'

class QuestionWindow extends React.Component {
    render() {
        console.log("Question Window Props", this.props)
        const { question, step, onClick, answerIdx, isCorrect, isClickable } = this.props;
        
        const confettiSource = {
            x: window.innerWidth / 2,
            y: 85,
            h: 0,
            w: 0,
        }
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
            <div className='question-container'>
                <h1 style={{ textAlign: 'left', fontSize: '13px' }}>
                    Вопрос {step}/20
                </h1>
                <h2>
                    {question.title}
                </h2>
                <ul className='answer-list'>
                    {question.answers.map((text, index) => (
                        <Button
                            onClick={onClick}
                            id={index}
                            text={text}
                            isCorrect={isCorrect}
                            isClickable={isClickable}
                        />
                        
                        )
                    )
                }
                </ul>
            </div>

            </>
        );
    }
}


function Button({
    onClick,
    id,
    text,
    isCorrect,
    isClickable
}) {
    
    var appendClass = ""

    if (isCorrect !== null){
        appendClass = isCorrect? "correct" : "incorrect"
    }
    
    appendClass += isClickable ? "" : " disabled"

    return (
        <li
            onClick={onClick}
            id={id}
            className={"answer-item " + appendClass}
            disabled={isClickable}
        > {text}
        </li>
    )

}

export default QuestionWindow
