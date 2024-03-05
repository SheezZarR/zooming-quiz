import { createAssistant, createSmartappDebugger } from '@salutejs/client';
import React, {useEffect, useRef} from 'react'

import questions from "./consts";
import QuestionWindow from "./HomePage/QuestionWindow";
import Result from "./HomePage/Result";

let brandCorrect = 0;
let natureCorrect = 0;

const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJqdGkiOiJjOTBkYjNhNy02ZWE2LTQxNDktOTI5My05MWVjYmU0Yjk3NWYiLCJzdWIiOiJmZjAwMTE4OWVmNjQ2YzhjYTg3NmQwYmFkY2Y0MTQ4NmI4MDVmYWVkNWRlMGIyNGQzYWM4MDgzMzA5OTcwNDdkYWZjYzciLCJpc3MiOiJLRVlNQVNURVIiLCJleHAiOjE3MDgzNDAxNTgsImF1ZCI6IlZQUyIsImlhdCI6MTcwODI1Mzc0OCwic2lkIjoiOTdhMTYzMDctNmIyZi00OGRjLWE0MDktMmFjYjVhYWQ1M2QxIn0.QJJt4HNr0IqK7EZzHpVDlzrD5maP6jxeyj-3or6pv1gPQi13-_mjhWN_io8y758BGkCeUvwO4pwLruAs2CX0wbn-15MA355QXXT4Dl0n8XHxvUDfEQ1af9-LTE_QCi_Rbi4b2ythtvvJnCQTbzutXE172ZlzsKIKi6s9PZM68eh34ZyFQXPED3_4jb3Opw5VUWjiYZrXdAe8xA_QDKR4ltoCknv5Se-hFwEDQUN_s6MAhjU3voMn5iJBrS0nDC1yPnytQB1iNnRps1rONr4agGtcfUe2iQbjRDBPGOfkZAH5a-Vp2yGeE2PuBMKNuZRhwhe6OHPhJn76njkz6yPRu0ZhQv9mLrs9RRqngxAS3NW0dKKSlOqBj96R0ngf5TC1Zzgq0tNVeBpYAciNoE5SIgD_55mN8DIoUf3JyxUIEPS8bAfimjPUoFTjJTmKpyLDBhT7W2Lcwb6fDzREoT5erb_jTbj5vxoMmlLQu78XDQjsA3GC5S0r0Sm2bfBTfNkwPUsBk1EAlWn_xBvQ2H-ltMNv5Unqda7hWLE66mUchpcdFkbvb6XUIdCxxYeb1kGgqWYdy3m8aPFKGmbUNeo3_29dTDDqp99YMXe8REF7V8bF4pfs6p1puS97oSfcPyTeaPCj6iuZcPJ4sVRTH_rRJj60hU_ZLE8EkSIkZLp8U5Q"
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
