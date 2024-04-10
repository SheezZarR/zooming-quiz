import React from 'react';
import './styles.css'

class QuestionWindow extends React.Component {
    render() {
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
                        <li
                            onClick={isClickable ? () => onClick(index) : undefined}
                            key={text}
                            className={`answer-item ${answerIdx === index && isCorrect ? 'correct' : answerIdx === index && !isCorrect ? 'incorrect' : ''}`}
                        >
                            {text}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}


const Button = ({text, onClick}) => {
    const handleOnClick = () => {
        onClick();
    }
    
    return (
        <li
            onClick={onClick}
            key={text}
            className={`answer-item' ${answerIdx === index && isCorrect ? 'correct' : answerIdx === index && !isCorrect ? 'incorrect' : ''}`}> 
            {text} 
        </li>
    )

}

export default QuestionWindow