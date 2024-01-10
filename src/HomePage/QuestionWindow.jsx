
import './styles.css'

function QuestionWindow({question, step, onClick, answrIdx, isCorrect}) {
    return (
        <div className= 'question-container' >
            <h1 style={{
                textAlign : 'left',
                fontSize: '13px'
            }
            }>
                Вопрос {step}/20
            </h1>
            <h2>
                {question.title}
            </h2>
            <ul className='answer-list'>
                {
                    question.answers.map((text, index) =>
                        <li
                            onClick={() => onClick(index)}
                            key={text}
                            className={`answer-item ${answrIdx === index && isCorrect ? 'correct' : answrIdx === index && !isCorrect ? 'incorrect' : ''}`}
                        >
                            {text}</li>)
                }
            </ul>
        </div>
    )
}

export default QuestionWindow