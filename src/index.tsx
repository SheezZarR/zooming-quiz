import React, { useEffect, useReducer, useRef, useState } from 'react'
import {render} from 'react-dom'
import QuestContainer from "./components/question";
import Button from "./components/button";
import { createAssistant, createSmartappDebugger } from '@salutejs/client';
import { QuizAction, reducer } from './storage/storage';


const initializeAssistant = (getState: any) => {
    if (process.env.NODE_ENV === "development") {
        return createSmartappDebugger({
            token: process.env.REACT_APP_SBER_TOKEN ? process.env.REACT_APP_SBER_TOKEN : "" ,
            initPhrase: "Включи Квиз о Мире",
            getState
            
        })
    }

    return createAssistant({ getState })
}


const Home = function() {
    const [appState, dispatch] = useReducer(reducer, {question_num: 0})
    const assistantRef = useRef<ReturnType <typeof createAssistant>>()

    useEffect(() => {
        assistantRef.current = initializeAssistant(() => {})
        assistantRef.current.on("data", ({action}: any) => {
            console.log("меем")
        })  
    })
    console.log(assistantRef.current)
    return (
        <div style={styles.container}>
            <QuestContainer>
                <p>
                    Разве непрозрачность не всегда указывается в процентах? Когда вы пишете что-то вроде opacity: 0.6, вы говорите "сделайте это на 60% непрозрачным".

                    Вертикальное центрирование в CSS - это сложная задача, и его может быть сложно поддерживать в нескольких браузерах. Если вам это действительно нужно, иногда вы </p>
            </QuestContainer>
            <div style={styles.row}>
                <Button> Кнопка один</Button>
                <Button> Кнопка два</Button>
                <Button> Кнопка три</Button>
                <Button> Кнопка четыре</Button>
            </div>
        </div>
    )
}


const styles = {
    container: {
        display: 'grid',
        gridTemplateRows: 'auto 1fr 1fr', // Первый ряд - авто, остальные - одинаковые размеры
        gap: '10px', // Расстояние между элементами
        justifyContent: 'center', // Центрирование элементов по горизонтали
    },
    row: {
        display: 'grid',
        padding: '40px',
        gridTemplateColumns: '1fr 1fr', // Две колонки с одинаковым размером
        gap: '10px', // Расстояние между кнопками
        justifyContent: 'center', // Центрирование кнопок по горизонтали
    },
};

render(<Home/>, document.getElementById('root'))