import { createAssistant, createSmartappDebugger } from '@salutejs/client';
import React, {useEffect, useRef} from 'react'

import questions from "./consts";
import QuestionWindow from "./HomePage/QuestionWindow";
import Result from "./HomePage/Result";

let brandCorrect = 0;
let natureCorrect = 0;

const token = ""

function initializeAssistant(getState){
    if (process.env.NODE_ENV === "development"){
        return createSmartappDebugger({
            token: token,
            initPhrase: "Включи Квиз о Мире",
            getState,
        })
    }

    return createAssistant({ getState });
}


function App() {
    console.log("Render App")
    const [step, setStep] = React.useState(0)
    const [answerIdx, setAnswerIdx] = React.useState(null)
    const [isCorrect, setIsCorrect] = React.useState(null)
    const question = questions[step];
    const assistantRef = useRef()
    
    useEffect(() => {
        console.log("useEffect")
        assistantRef.current = initializeAssistant(() => {})
        assistantRef.current.on("data", ({action} ) => {
            if (action) {
                console.log(action)
                //dispatch(action)
            }
        })
    })


    const onClick = (index) => {
        console.log("onClick")
        if (step % 2 == 0) {
            if (index === question.correct){
                setIsCorrect(true)
                console.log("set it correct func")
                setAnswerIdx(index)
                console.log("set answer func")
                brandCorrect += 1
            }
            else {
                setIsCorrect(false)
                console.log("set it correct func")
                setAnswerIdx(index)
                console.log("set answer func")
            }
        }
        else {
            if (index === question.correct){
                setIsCorrect(true)
                console.log("set it correct func")
                setAnswerIdx(index)
                console.log("set answer func")
                natureCorrect += 1
            }
            else {
                setIsCorrect(false)
                console.log("set it correct func")
                setAnswerIdx(index)
                console.log("set answer func")
            }
        }
        //setAnswerIdx(index)
        console.log("pered set time out")
        setTimeout(() => {
            console.log("Nachalo tela setTimeOut")
            setAnswerIdx(null)
            console.log("set answer func")
            setIsCorrect(null)
            console.log("set it correct func")
            setStep(step + 1);
            console.log("set step")
            console.log("Konec tela setTimeOut")
        }, 5000);
        console.log("posle set time out")
        console.log("Set Step func")
        
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
