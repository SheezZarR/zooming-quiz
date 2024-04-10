import React from "react"
import { createSmartappDebugger, createAssistant } from "@salutejs/client";

import questions from "./consts";
import QuestionWindow from "./HomePage/QuestionWindow";
import Result from "./HomePage/Result";


const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJqdGkiOiJiMjJmOTRlNS1lYjIyLTQ1MGMtODRlMy0xMWFiZTlhMTliYTMiLCJzdWIiOiJmZjAwMTE4OWVmNjQ2YzhjYTg3NmQwYmFkY2Y0MTQ4NmI4MDVmYWVkNWRlMGIyNGQzYWM4MDgzMzA5OTcwNDdkYWZjYzciLCJpc3MiOiJLRVlNQVNURVIiLCJleHAiOjE3MTIwNzAxNTcsImF1ZCI6IlZQUyIsInVzciI6IjI2NGU2NmExLTgyNDAtNGJmNC04ZjcwLWQyOTM5YmZlYjlhMyIsImlhdCI6MTcxMTk4Mzc0Nywic2lkIjoiYTgxZGYyYjAtODEwMi00M2VlLThkZjEtNzkzNzE3Nzc3YzQyIn0.I4FJgqxCWZNaW-q0Kr9M0ICh8PJWJsEUL7uiGYIzfJ-Q2z4IcKp-w99YHu2xAOmd78nctoD-M_z6KlOkPMJAQYeDT1WT-jUAq0jsZhADeGiOkvCXPaLXjU8mRQgQuMYlbyinKz4YBkgNUNsjIxPcXd1H4Ye_dXonuNv566pKmDvkXPMljmqInf84T0SgBr_IeqbtQDegGD-Y18gDHMcaNfofMcnqznIQzQXrgSgYf3mxwq28zkGVN8LddYk7T7pLxWE_DPVstZnbftR0QYON-x11RJdVQKbymnRGXlx7MX3hBYvARqN3vY1X3FvE5axA4qxf2uxJ79X8qlfnTHZiuZunVTR0fFZMtgv2LXFN-3KjieLQwXrzOEWV3m9VymMG-EFezk6qbRSiwgDI7_RJ9AmsL-qrh7_PpDYj3-lJ3csbu4ExDWB2OfdLhAZycq5XaDGR9y8jUphObnZM1r89vYnPnlVetcvuXXyA6QYY9Kfc4KFfDKw6vyrdYA8raZhUTxKOBaH7xcFHmOM7adTdCJ5PWCEyHzxfOw--SSCZdH1uGpaC-KarwBKLcWBRK2ymEnnnXmeFfF3R2BZwrmYZvtHEC5gGqWjlT8D6thzfUiNDclqvemRUVRjaTDVh4bkzkCzJqB5jQn-U-NsoB36aHXJnjuvr7nsJx3L4hvuLfNs"

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
          console.log("smart_app_data")
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

    onClick = (index) => {
      const { step, brandCorrect, natureCorrect } = this.state;
      const question = questions[step];

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
      console.log("render")

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