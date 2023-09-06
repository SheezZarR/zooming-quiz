import React from 'react'
import {render} from 'react-dom'
import QuestContainer from "./components/question";
import Button from "./components/button";

const Home = function() {
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