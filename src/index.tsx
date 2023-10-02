import React, { useState } from 'react'
import {render} from 'react-dom'
import QuestContainer from "./components/question";
import Button from "./components/button";
import { createAssistant, createSmartappDebugger } from '@salutejs/client';

const Home = function() {
    
    const [state, setState] = useState({})
    const [recoveryState, setRecoveryState] = useState({})

    const initialize = (getState, getRecoveryState) => {
        if (process.env.NODE_ENV === 'development') {
            return createSmartappDebugger({
                // Токен из Кабинета разработчика
                token: process.env.REACT_APP_SBER_TOKEN,
                // Пример фразы для запуска смартапа
                initPhrase: 'Хочу попкорн',
                // Текущее состояние смартапа
                getState,
                // Состояние смартапа, с которым он будет восстановлен при следующем запуске
                getRecoveryState,
                // Необязательные параметры панели, имитирующей панель на реальном устройстве
                nativePanel: {
                    // Стартовый текст в поле ввода пользовательского запроса
                    defaultText: 'Покажи что-нибудь',
                    // Позволяет включить вид панели, максимально приближенный к панели на реальном устройстве
                    screenshotMode: false,
                    // Атрибут `tabindex` поля ввода пользовательского запроса
                    tabIndex: -1,
                },
            });
        }
    
          // Только для среды production
        return createAssistant({ getState, getRecoveryState });
    }
    
    const assistant = initialize(() => state, () => recoveryState);
    assistant.on("data", (command) => {
        console.log(command)
    })
    

    const handleOnClick = () => {
        assistant.sendData({action: {type: "action_name", payload: {param: 1}}})
    }

    const handleOnRefreshClick = () => {
        
        const unsubscribe = assistant.sendAction(
            {type: 'action_name', payload: { param: 1 }},
            (data: { 
                type: string, 
                payload: Record<string, unknown>
            }) => {
                console.log(data.type, data.payload)
                unsubscribe();
            },
            (error: { code: number, description: string }) => {
                console.log(error.code, error.description)
            },
            {}
            )
    }
    


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