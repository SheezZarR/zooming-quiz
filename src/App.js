import React from "react"
import { createSmartappDebugger, createAssistant } from "@salutejs/client";

import questions from "./consts";
import QuestionWindow from "./HomePage/QuestionWindow";
import Result from "./HomePage/Result";


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


class App extends React.Component {
    constructor(props) {
      console.log("constructor")
      super(props);
      this.state = {
        step: 0,
        answerIdx: null,
        isCorrect: null,
        brandCorrect: 0,
        natureCorrect: 0,
        isClickable : true,
        isShowApp : true,
      };
      this.assistant = initializeAssistant(() => this.getStateForAssistant())
      this.assistant.on("data", (event) => {
        console.log(`assistant.on(data)`, event);
        if(event.type === "smart_app_data") {
          const {smart_app_data} = event
          console.log("Recieved data from scenarios")
          //(smart_app_data.isCorrect)
        }
    });
    this.assistant.on("start", (event) => {
        console.log(`assistant.on(start)`, event);
    });
    }

    getStateForAssistant() {
        console.log('getStateForAssistant: state:', this.state);
        return this.state;
    }

    dispatchAssistantData(data) {
      console.log('dispatchAssistantData', data);
      this.onClick(questions[this.state.step].correct, true);
    }

    sendDataToAssistant(data) {
      console.log("sendDataToAssistant", data);
      this.assistant.sendData({action: {action_id : "start"}})
    }

    onClickButton = () => {
      console.log("render StartButton")
      this.setState(prevState => ({
        isShowApp : false
      }));
      this.assistant.sendData({action : {action_id : "quest1"}})
    }

    renderAppWithVoiceAnswer(_isCorrect){
      const { step, brandCorrect, natureCorrect } = this.state;
      const question = questions[step];
    }

    onClick = (evt) => {
      // В функцию приходит event. Это особый тип в javascript
      
      const { step, brandCorrect, natureCorrect } = this.state;
      const question = questions[step];

      const index = parseInt(evt.target.id)
      this.state.isCorrect = (question.correct === index)
      
      // В таргете лежит html элемент
      console.log("This answer onClick button", evt.target, index)
      
      if (step % 2 === 0) {
        if (index === question.correct) {
          this.setState({ isCorrect: true, brandCorrect: brandCorrect + 1, answerIdx : index, isClickable : false });
          this.assistant.sendData({action : {action_id : "correct"}})
        } else {
          this.setState({ isCorrect: false, answerIdx : index, isClickable : false });
          this.assistant.sendData({action : {action_id : "incorrect"}})
        }
      } else {
        if (index === question.correct) {
          this.setState({ isCorrect: true, natureCorrect: natureCorrect + 1, answerIdx : index, isClickable : false });
          this.assistant.sendData({action : {action_id : "correct"}})
        } else {
          this.setState({ isCorrect: false, answerIdx : index, isClickable : false });
          this.assistant.sendData({action : {action_id : "incorrect"}})
        }
      }

      setTimeout(() => {
        this.setState({
          isClickable : true,
          answerIdx: null,
          isCorrect: null,
          step: step + 1
        });
        let question_state = "quest" + (step + 2).toString()
      
        console.log(question_state)
        this.assistant.sendData({action : {action_id : question_state}})
      }, 4000);


    }
  
    render() {
      const { step, answerIdx, isCorrect, brandCorrect, natureCorrect, isClickable, isShowApp} = this.state;
      const question = questions[step];
      console.log("render", this.state)

      if (isShowApp) {
          return <div className='container'>
          <button
            className='start-button'
            onClick={this.onClickButton}
        >
          Начать!
        </button>
        </div> 
      }
  
      else if (step !== questions.length) {
        return (
          <QuestionWindow
            question={question}
            step={step}
            onClick={this.onClick}
            answerIdx={answerIdx}
            isCorrect={isCorrect}
            isClickable = {isClickable}
          />
        );
      } else {
        return (
          <Result
            brandCorrect={brandCorrect}
            natureCorrect={natureCorrect}
          />
        );
      }
    }
  }
  
  export default App;
