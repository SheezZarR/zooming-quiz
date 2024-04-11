import React from 'react';
import './styles.css'

class QuestionWindow extends React.Component {
    render() {
        console.log("Question Window Props", this.props)
        const { question, step, onClick, answerIdx, isCorrect, isClickable } = this.props;

        return (
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
                        />
                        
                        )
                    )
                }
                </ul>
            </div>
        );
    }
}


function Button({
    onClick,
    id,
    text,
    isCorrect,
}) {

    var appendClass = ""

    if (isCorrect !== null) {
        appendClass = isCorrect ? "correct" : "incorrect"
    }

    return (
        <li
            onClick={onClick}
            id={id}
            className={"answer-item " + appendClass}
        > {text}
        </li>
    )

}

export default QuestionWindow
