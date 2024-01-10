import React, {useEffect} from 'react'

import questions from "./consts";
import QuestionWindow from "./HomePage/QuestionWindow";
import Result from "./HomePage/Result";

let brandCorrect = 0;
let natureCorrect = 0;

function App() {
    const [step, setStep] = React.useState(0)
    const [answerIdx, setAnswerIdx] = React.useState(null)
    const [isCorrect, setIsCorrect] = React.useState(null)
    const question = questions[step];

    const onClick = (index) => {
        if (step % 2 == 0) {
            if (index === question.correct){
                setIsCorrect(true)
                brandCorrect += 1
            }
            else setIsCorrect(false)
        }
        else {
            if (index === question.correct){
                setIsCorrect(true)
                natureCorrect += 1
            }
            else setIsCorrect(false)
        }
        setAnswerIdx(index)
        setTimeout(() => {
            setAnswerIdx(null)
            setIsCorrect(null)
            setStep(step + 1);
        }, 1000);
        //setAnswerIdx(null)
    }
    if (step != questions.length) {
        return <QuestionWindow
            question={question}
            step={step}
            onClick={onClick}
            answrIdx={answerIdx}
            isCorrect={isCorrect}
        />
    }
    else {
        return <Result
            brandCorrect={brandCorrect}
            natureCorrect={natureCorrect}
            />
    }

}

export default App